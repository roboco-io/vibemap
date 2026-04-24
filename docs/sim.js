// Force-directed graph simulation
// Barnes-Hut optimization skipped — 80 nodes is fine with O(n²)
(function() {
  class Sim {
    constructor(nodes, edges, opts = {}) {
      this.nodes = nodes; // each: {id, x, y, vx, vy, fx?, fy?, size}
      this.edges = edges; // each: {source, target}
      this.opts = Object.assign({
        repulsion: 3400,    // 1800 → 3400: stronger spread now that we have 75 nodes / 580 edges
        springLen: 170,     // 110 → 170: longer rest length so connected pairs sit farther apart
        springK: 0.028,     // 0.04 → 0.028: weaker pull so springs don't collapse the spread
        damping: 0.84,      // 0.82 → 0.84: a bit more momentum so the larger field settles smoothly
        center: 0.0035,     // 0.006 → 0.0035: gentler centering — let outer nodes breathe
        maxV: 18,           // 14 → 18: room for the longer first leg during expansion
      }, opts);
      this.nodeMap = Object.fromEntries(nodes.map(n => [n.id, n]));
      this.running = true;
      this.alpha = 1;
      this.alphaDecay = 0.003;
    }

    reheat(a = 0.8) { this.alpha = Math.max(this.alpha, a); }

    step(w, h) {
      if (!this.running) return;
      const { repulsion, springLen, springK, damping, center, maxV } = this.opts;
      const nodes = this.nodes;
      const alpha = this.alpha;
      if (alpha < 0.01) { this.alpha = 0.01; }

      // Repulsion between all nodes (O(n²))
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          let dx = b.x - a.x, dy = b.y - a.y;
          let d2 = dx*dx + dy*dy;
          if (d2 < 0.01) { d2 = 0.01; dx = (Math.random()-0.5); dy = (Math.random()-0.5); }
          const d = Math.sqrt(d2);
          const f = repulsion / d2;
          const fx = (dx / d) * f * alpha;
          const fy = (dy / d) * f * alpha;
          a.vx -= fx; a.vy -= fy;
          b.vx += fx; b.vy += fy;
        }
      }

      // Springs along edges
      for (const e of this.edges) {
        const a = this.nodeMap[e.source], b = this.nodeMap[e.target];
        if (!a || !b) continue;
        const dx = b.x - a.x, dy = b.y - a.y;
        const d = Math.sqrt(dx*dx + dy*dy) || 0.01;
        const diff = d - springLen;
        const f = springK * diff * alpha;
        const fx = (dx / d) * f;
        const fy = (dy / d) * f;
        a.vx += fx; a.vy += fy;
        b.vx -= fx; b.vy -= fy;
      }

      // Gentle centering
      for (const n of nodes) {
        n.vx -= n.x * center * alpha;
        n.vy -= n.y * center * alpha;
      }

      // Integrate
      for (const n of nodes) {
        if (n.fx !== undefined && n.fx !== null) { n.x = n.fx; n.vx = 0; }
        else { n.vx *= damping; if (n.vx > maxV) n.vx = maxV; if (n.vx < -maxV) n.vx = -maxV; n.x += n.vx; }
        if (n.fy !== undefined && n.fy !== null) { n.y = n.fy; n.vy = 0; }
        else { n.vy *= damping; if (n.vy > maxV) n.vy = maxV; if (n.vy < -maxV) n.vy = -maxV; n.y += n.vy; }
      }

      this.alpha *= (1 - this.alphaDecay);
    }
  }

  window.VibeSim = Sim;
})();
