// Merges markdown-authored nodes on top of legacy snapshot.
// md > legacy for same id. Normalizes edges to sorted-tuple form, dedupes, validates endpoints.

export function mergeNodes({ legacy, md }) {
  const byId = {};
  const stats = { fromMarkdown: 0, fromLegacy: 0 };
  for (const n of legacy) {
    byId[n.id] = { ...n, _source: 'legacy' };
  }
  for (const n of md) {
    byId[n.id] = { ...n, _source: 'md' };
  }
  for (const id of Object.keys(byId)) {
    if (byId[id]._source === 'md') stats.fromMarkdown++;
    else stats.fromLegacy++;
  }
  return { byId, stats };
}

export function normalizeEdges(edges) {
  const seen = new Set();
  const out = [];
  for (const [s, t] of edges) {
    if (s === t) continue;
    const [a, b] = s < t ? [s, t] : [t, s];
    const key = `${a}\x00${b}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push([a, b]);
  }
  out.sort((x, y) => x[0].localeCompare(y[0]) || x[1].localeCompare(y[1]));
  return out;
}

export function validateEdges(edges, byId) {
  const valid = [];
  const broken = [];
  for (const e of edges) {
    if (byId[e[0]] && byId[e[1]]) valid.push(e);
    else broken.push(e);
  }
  return { valid, broken };
}
