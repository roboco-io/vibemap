/* global React, ReactDOM */
const { useState, useEffect, useRef, useMemo, useCallback } = React;

const DATA = window.VIBEMAP_DATA;
const I18N = window.I18N;

function getText(obj, lang) {
  if (!obj) return '';
  return obj[lang] || obj.en || obj.ko || '';
}

function sizeRadius(size) {
  return size === 1 ? 14 : size === 2 ? 9 : 6;
}

function App() {
  const [lang, setLang] = useState(() => localStorage.getItem('vibemap.lang') || 'ko');
  const [activeId, setActiveId] = useState(null);
  const [hoverId, setHoverId] = useState(null);
  const [query, setQuery] = useState('');
  const [enabledCats, setEnabledCats] = useState(() => new Set(Object.keys(DATA.categories)));
  const [physics, setPhysics] = useState(true);
  const [introGone, setIntroGone] = useState(false);
  const [transform, setTransform] = useState({ x: 0, y: 0, k: 1 });
  const [entryProgress, setEntryProgress] = useState(0); // 0→1 ripple reveal
  const [references, setReferences] = useState({ byNode: {} });

  const t = I18N[lang];
  const stageRef = useRef(null);
  const simRef = useRef(null);
  const rafRef = useRef(0);
  const sizeRef = useRef({ w: 800, h: 600 });
  const dragRef = useRef(null);
  const panRef = useRef(null);

  // Initialize node positions (roughly by category angular sectors)
  const [nodes] = useState(() => {
    const cats = Object.keys(DATA.categories);
    const catIndex = Object.fromEntries(cats.map((c, i) => [c, i]));
    return DATA.nodes.map((n) => {
      if (n.id === 'vibe') return { ...n, x: 0, y: 0, vx: 0, vy: 0 };
      const ci = catIndex[n.cat] ?? 0;
      const angle = (ci / cats.length) * Math.PI * 2 + (Math.random() - 0.5) * 0.5;
      const r = 180 + Math.random() * 180 + n.size * 40;
      return {
        ...n,
        x: Math.cos(angle) * r,
        y: Math.sin(angle) * r,
        vx: 0, vy: 0,
      };
    });
  });

  const edges = useMemo(() => DATA.edges.map(([s, t]) => ({ source: s, target: t })), []);

  // Adjacency for hover highlight
  const adjacency = useMemo(() => {
    const m = {};
    for (const e of edges) {
      (m[e.source] ||= new Set()).add(e.target);
      (m[e.target] ||= new Set()).add(e.source);
    }
    return m;
  }, [edges]);

  // Setup sim
  useEffect(() => {
    const sim = new window.VibeSim(nodes, edges, {});
    simRef.current = sim;

    const tick = () => {
      const { w, h } = sizeRef.current;
      if (physics) sim.step(w, h);
      // trigger re-render by bumping a state
      setTick((x) => x + 1);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
    // eslint-disable-next-line
  }, [physics]);

  // dummy re-render tick
  const [, setTick] = useState(0);

  // Resize observer
  useEffect(() => {
    const onResize = () => {
      if (stageRef.current) {
        const r = stageRef.current.getBoundingClientRect();
        sizeRef.current = { w: r.width, h: r.height };
      }
    };
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Entry animation: ripple outwards from center node
  useEffect(() => {
    const start = performance.now();
    const dur = 1800;
    let raf;
    const step = (t) => {
      const p = Math.min(1, (t - start) / dur);
      setEntryProgress(p);
      if (p < 1) raf = requestAnimationFrame(step);
      else {
        setTimeout(() => setIntroGone(true), 200);
      }
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, []);

  // Load references.json (생성 실패 시 조용히 비어있는 상태 유지)
  useEffect(() => {
    let cancelled = false;
    fetch('./references.json', { cache: 'no-cache' })
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data) => {
        if (cancelled) return;
        if (data && data.version === '1' && data.byNode) {
          setReferences(data);
        } else {
          console.warn('references.json: unsupported schema; using empty fallback');
        }
      })
      .catch((err) => {
        console.warn('references.json unavailable:', err.message);
      });
    return () => { cancelled = true; };
  }, []);

  // Persist lang
  useEffect(() => { localStorage.setItem('vibemap.lang', lang); }, [lang]);

  // Node reveal order — BFS from center
  const revealOrder = useMemo(() => {
    const order = {};
    const visited = new Set(['vibe']);
    const queue = ['vibe'];
    let depth = 0;
    let levelEnd = 1;
    let idx = 0;
    while (queue.length) {
      const id = queue.shift();
      order[id] = depth;
      idx++;
      for (const nb of (adjacency[id] || [])) {
        if (!visited.has(nb)) { visited.add(nb); queue.push(nb); }
      }
      if (idx === levelEnd) { depth++; levelEnd = idx + queue.length; }
    }
    // Any unvisited
    for (const n of nodes) if (!(n.id in order)) order[n.id] = depth + 1;
    return order;
  }, [adjacency, nodes]);

  const maxDepth = useMemo(() => Math.max(...Object.values(revealOrder)), [revealOrder]);

  // Node reveal opacity based on entry progress
  const revealOpacity = useCallback((id) => {
    const depth = revealOrder[id] ?? 0;
    const t = depth / (maxDepth + 1);
    const threshold = t * 0.85;
    if (entryProgress < threshold) return 0;
    const local = (entryProgress - threshold) / 0.15;
    return Math.min(1, Math.max(0, local));
  }, [entryProgress, revealOrder, maxDepth]);

  // Filter logic
  const queryLower = query.trim().toLowerCase();
  const matchesQuery = useCallback((n) => {
    if (!queryLower) return true;
    const t = getText(n.title, lang).toLowerCase();
    return t.includes(queryLower);
  }, [queryLower, lang]);

  const isVisible = useCallback((n) => {
    return enabledCats.has(n.cat) && matchesQuery(n);
  }, [enabledCats, matchesQuery]);

  // Neighbours for highlight
  const highlightId = hoverId || activeId;
  const neighbours = highlightId ? (adjacency[highlightId] || new Set()) : null;

  // Zoom handling
  const onWheel = (e) => {
    e.preventDefault();
    const { x, y, k } = transform;
    const factor = Math.exp(-e.deltaY * 0.0015);
    const newK = Math.max(0.25, Math.min(3, k * factor));
    const rect = stageRef.current.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    // Zoom to cursor
    const cx = rect.width / 2, cy = rect.height / 2;
    const dx = mx - cx - x;
    const dy = my - cy - y;
    const newX = x - dx * (newK / k - 1);
    const newY = y - dy * (newK / k - 1);
    setTransform({ x: newX, y: newY, k: newK });
  };

  // Panning
  const onMouseDown = (e) => {
    if (e.target.closest('.node-g')) return;
    panRef.current = { sx: e.clientX, sy: e.clientY, x: transform.x, y: transform.y };
  };
  const onMouseMove = (e) => {
    // node drag
    if (dragRef.current) {
      const rect = stageRef.current.getBoundingClientRect();
      const cx = rect.width / 2, cy = rect.height / 2;
      const x = (e.clientX - rect.left - cx - transform.x) / transform.k;
      const y = (e.clientY - rect.top - cy - transform.y) / transform.k;
      const n = dragRef.current.node;
      n.fx = x; n.fy = y;
      simRef.current?.reheat(0.4);
      return;
    }
    if (panRef.current) {
      const dx = e.clientX - panRef.current.sx;
      const dy = e.clientY - panRef.current.sy;
      setTransform((t) => ({ ...t, x: panRef.current.x + dx, y: panRef.current.y + dy }));
    }
  };
  const onMouseUp = () => {
    if (dragRef.current) {
      const n = dragRef.current.node;
      n.fx = null; n.fy = null;
      dragRef.current = null;
    }
    panRef.current = null;
  };

  // Touch (basic)
  const touchRef = useRef(null);
  const onTouchStart = (e) => {
    if (e.touches.length === 1) {
      const t = e.touches[0];
      if (e.target.closest('.node-g')) return;
      panRef.current = { sx: t.clientX, sy: t.clientY, x: transform.x, y: transform.y };
    } else if (e.touches.length === 2) {
      panRef.current = null;
      const [a, b] = e.touches;
      touchRef.current = {
        dist: Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY),
        k: transform.k,
      };
    }
  };
  const onTouchMove = (e) => {
    if (dragRef.current && e.touches.length === 1) {
      const t = e.touches[0];
      const rect = stageRef.current.getBoundingClientRect();
      const cx = rect.width / 2, cy = rect.height / 2;
      const x = (t.clientX - rect.left - cx - transform.x) / transform.k;
      const y = (t.clientY - rect.top - cy - transform.y) / transform.k;
      const n = dragRef.current.node;
      n.fx = x; n.fy = y;
      simRef.current?.reheat(0.4);
      return;
    }
    if (e.touches.length === 1 && panRef.current) {
      const t = e.touches[0];
      const dx = t.clientX - panRef.current.sx;
      const dy = t.clientY - panRef.current.sy;
      setTransform((tr) => ({ ...tr, x: panRef.current.x + dx, y: panRef.current.y + dy }));
    } else if (e.touches.length === 2 && touchRef.current) {
      const [a, b] = e.touches;
      const d = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
      const newK = Math.max(0.25, Math.min(3, touchRef.current.k * (d / touchRef.current.dist)));
      setTransform((t) => ({ ...t, k: newK }));
    }
  };
  const onTouchEnd = () => {
    if (dragRef.current) { dragRef.current.node.fx = null; dragRef.current.node.fy = null; dragRef.current = null; }
    panRef.current = null; touchRef.current = null;
  };

  // Node click / drag
  const onNodeMouseDown = (e, node) => {
    e.stopPropagation();
    dragRef.current = { node, moved: false, sx: e.clientX, sy: e.clientY };
  };
  const onNodeClick = (e, node) => {
    e.stopPropagation();
    setActiveId(node.id);
  };

  const toggleCat = (cat) => {
    setEnabledCats((prev) => {
      const n = new Set(prev);
      if (n.has(cat)) n.delete(cat); else n.add(cat);
      return n;
    });
    simRef.current?.reheat(0.3);
  };

  const activeNode = activeId ? nodes.find(n => n.id === activeId) : null;
  const activeCat = activeNode ? DATA.categories[activeNode.cat] : null;

  // Counts per cat
  const catCounts = useMemo(() => {
    const m = {};
    for (const n of DATA.nodes) m[n.cat] = (m[n.cat] || 0) + 1;
    return m;
  }, []);

  const { w, h } = sizeRef.current;

  return (
    <>
      {/* Stage */}
      <div
        id="stage"
        ref={stageRef}
        onWheel={onWheel}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <svg viewBox={`${-w/2} ${-h/2} ${w} ${h}`} preserveAspectRatio="xMidYMid meet">
          <defs>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <g transform={`translate(${transform.x} ${transform.y}) scale(${transform.k})`}>
            {/* Edges */}
            <g>
              {edges.map((e, i) => {
                const a = nodes.find(n => n.id === e.source);
                const b = nodes.find(n => n.id === e.target);
                if (!a || !b) return null;
                if (!isVisible(a) || !isVisible(b)) return null;
                const aRev = revealOpacity(a.id);
                const bRev = revealOpacity(b.id);
                const op = Math.min(aRev, bRev);
                let cls = 'edge';
                if (highlightId) {
                  if (e.source === highlightId || e.target === highlightId) cls += ' hi';
                  else cls += ' dim';
                }
                return (
                  <line
                    key={i}
                    className={cls}
                    x1={a.x} y1={a.y} x2={b.x} y2={b.y}
                    style={{ opacity: op * (cls.includes('dim') ? 0.15 : 1) }}
                  />
                );
              })}
            </g>

            {/* Nodes */}
            <g>
              {nodes.map((n) => {
                if (!isVisible(n)) return null;
                const color = DATA.categories[n.cat].color;
                const r = sizeRadius(n.size);
                const op = revealOpacity(n.id);
                let cls = 'node-g';
                if (highlightId === n.id) cls += ' active hi';
                else if (neighbours && neighbours.has(n.id)) cls += ' hi';
                else if (highlightId) cls += ' dim';
                const fadeIn = op < 1 ? { opacity: op } : {};
                return (
                  <g
                    key={n.id}
                    className={cls}
                    data-size={n.size}
                    style={{ color, ...fadeIn }}
                    transform={`translate(${n.x} ${n.y})`}
                    onMouseEnter={() => setHoverId(n.id)}
                    onMouseLeave={() => setHoverId(null)}
                    onMouseDown={(e) => onNodeMouseDown(e, n)}
                    onClick={(e) => onNodeClick(e, n)}
                    onTouchStart={(e) => { if (e.touches.length === 1) { dragRef.current = { node: n, moved: false, sx: e.touches[0].clientX, sy: e.touches[0].clientY }; } }}
                  >
                    <circle className="node-halo" r={r * 2.4} />
                    <circle className="node-core" r={r} filter={n.size === 1 ? 'url(#glow)' : undefined} />
                    <text className="node-label" y={r + 15}>
                      {getText(n.title, lang)}
                    </text>
                  </g>
                );
              })}
            </g>
          </g>
        </svg>
      </div>

      {/* Top bar */}
      <div className="topbar">
        <div className="brand">
          <h1 className="brand-title">{t.title}</h1>
          <p className="brand-sub">{t.subtitle}</p>
        </div>
        <div className="topbar-actions">
          <div className="search-box">
            <input
              type="text"
              placeholder={t.search}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <button
            className={`iconbtn ${physics ? 'on' : ''}`}
            title={t.physics}
            onClick={() => { setPhysics((p) => !p); simRef.current?.reheat(0.8); }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <ellipse cx="12" cy="12" rx="10" ry="4" />
              <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)" />
              <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)" />
            </svg>
          </button>
          <button
            className="iconbtn"
            title={t.resetLayout}
            onClick={() => {
              // scatter
              for (const n of nodes) {
                if (n.id === 'vibe') { n.x = 0; n.y = 0; n.vx = 0; n.vy = 0; continue; }
                const a = Math.random() * Math.PI * 2;
                const r = 150 + Math.random() * 300;
                n.x = Math.cos(a) * r; n.y = Math.sin(a) * r; n.vx = 0; n.vy = 0;
              }
              simRef.current?.reheat(1);
              setTransform({ x: 0, y: 0, k: 1 });
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M3 12a9 9 0 1 0 3-6.7" />
              <polyline points="3 4 3 10 9 10" />
            </svg>
          </button>
          <div className="lang-switch">
            {['ko', 'en', 'ja'].map((L) => (
              <button
                key={L}
                className={lang === L ? 'on' : ''}
                onClick={() => setLang(L)}
              >{L.toUpperCase()}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="legend">
        <div className="legend-title">{t.filters}</div>
        {Object.entries(DATA.categories).map(([key, cat]) => {
          const on = enabledCats.has(key);
          return (
            <div
              key={key}
              className={`legend-row ${on ? '' : 'off'}`}
              onClick={() => toggleCat(key)}
              style={{ color: cat.color }}
            >
              <span className="legend-dot" style={{ background: cat.color }} />
              <span style={{ color: on ? '#e8e4ff' : 'inherit' }}>{getText(cat.label, lang)}</span>
              <span className="legend-count">{catCounts[key] || 0}</span>
            </div>
          );
        })}
      </div>

      {/* Right panel */}
      <aside className={`panel ${activeNode ? 'open' : ''}`}>
        {activeNode && activeCat && (
          <>
            <div className="panel-head">
              <button className="panel-close" onClick={() => setActiveId(null)}>×</button>
              <div className="panel-cat" style={{ color: activeCat.color }}>
                <span className="panel-cat-dot" />
                {getText(activeCat.label, lang)}
              </div>
              <h2 className="panel-title">{getText(activeNode.title, lang)}</h2>
            </div>
            <div className="panel-body">
              <div className="panel-text">{getText(activeNode.body, lang)}</div>
              <div className="panel-section">
                <div className="panel-section-label">{t.connections}</div>
                <div className="panel-links">
                  {[...(adjacency[activeNode.id] || [])].map((nid) => {
                    const n = nodes.find(x => x.id === nid);
                    if (!n) return null;
                    const cat = DATA.categories[n.cat];
                    return (
                      <button
                        key={nid}
                        className="link-chip"
                        style={{ color: cat.color }}
                        onClick={() => setActiveId(nid)}
                      >
                        <span className="link-chip-dot" />
                        <span style={{ color: '#e8e4ff' }}>{getText(n.title, lang)}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
              {(references.byNode[activeNode.id]?.length ?? 0) > 0 && (
                <div className="panel-section refs">
                  <div className="panel-section-label">{t.referencesTitle}</div>
                  <ul className="refs-list">
                    {references.byNode[activeNode.id].map((ref, i) => (
                      <li key={i} className="refs-item">
                        <a
                          className="refs-link"
                          href={ref.url}
                          target="_blank"
                          rel="noreferrer noopener"
                        >
                          {ref.title}
                        </a>
                        {ref.excerpt && (
                          <p className="refs-excerpt">{ref.excerpt}</p>
                        )}
                        <span className={`refs-lang refs-lang-${ref.lang || 'other'}`}>
                          {(ref.lang || 'other').toUpperCase()}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </>
        )}
      </aside>

      {/* Intro overlay */}
      <div className={`intro ${introGone ? 'gone' : ''}`}>
        <div className="intro-text">{t.intro}</div>
      </div>

      {/* Hint */}
      <div className="hint">scroll · drag · click</div>
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
