import React, { useMemo } from "react";
import { GlassCard } from "@/Components/ui/PresentationPrimitives";

type Node = { x: number; y: number };
type Edge = { a: number; b: number };

export function PostOfficeVRPMap() {
  const { nodes, edges, drops } = useMemo(() => {
    // stylized "city" graph (not the real map image; this is your custom visual)
    const nodes: Node[] = [];
    const edges: Edge[] = [];

    const cols = 8;
    const rows = 6;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const jitter = (n: number) => (Math.sin(n * 999) * 0.5 + 0.5) * 8;
        nodes.push({
          x: c * 70 + 30 + jitter(r * cols + c),
          y: r * 60 + 30 + jitter(100 + r * cols + c),
        });
      }
    }

    const idx = (r: number, c: number) => r * cols + c;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (c < cols - 1) edges.push({ a: idx(r, c), b: idx(r, c + 1) });
        if (r < rows - 1) edges.push({ a: idx(r, c), b: idx(r + 1, c) });
        // a few diagonals for realism
        if (r < rows - 1 && c < cols - 1 && (r + c) % 3 === 0)
          edges.push({ a: idx(r, c), b: idx(r + 1, c + 1) });
      }
    }

    // “delivery points” sampled along edges
    const drops = Array.from({ length: 36 }).map((_, i) => {
      const e = edges[(i * 7) % edges.length];
      const t = ((i * 73) % 100) / 100;
      const A = nodes[e.a];
      const B = nodes[e.b];
      return { x: A.x + (B.x - A.x) * t, y: A.y + (B.y - A.y) * t };
    });

    return { nodes, edges, drops };
  }, []);

  return (
    <GlassCard className="w-full max-w-2xl">
      <div className="text-xs text-slate-500 uppercase tracking-widest font-mono mb-3">
        Stylized street graph + sampled delivery points
      </div>

      <div className="w-full overflow-hidden rounded-xl border border-white/10 bg-black/20">
        <svg viewBox="0 0 560 400" className="w-full h-[340px]">
          {/* edges */}
          {edges.map((e, i) => {
            const A = nodes[e.a];
            const B = nodes[e.b];
            return (
              <line
                key={i}
                x1={A.x}
                y1={A.y}
                x2={B.x}
                y2={B.y}
                stroke="rgba(255,255,255,0.10)"
                strokeWidth={2}
              />
            );
          })}

          {/* drops */}
          {drops.map((d, i) => (
            <circle
              key={i}
              cx={d.x}
              cy={d.y}
              r={3.4}
              fill="rgba(168,85,247,0.75)"
            >
              <animate
                attributeName="r"
                values="3.2;4.2;3.2"
                dur={`${1.8 + (i % 5) * 0.25}s`}
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="0.45;0.9;0.45"
                dur={`${2.2 + (i % 7) * 0.22}s`}
                repeatCount="indefinite"
              />
            </circle>
          ))}

          {/* depot marker */}
          <circle cx={nodes[0].x} cy={nodes[0].y} r={8} fill="rgba(34,197,94,0.85)" />
          <circle cx={nodes[0].x} cy={nodes[0].y} r={16} fill="rgba(34,197,94,0.12)">
            <animate attributeName="r" values="14;20;14" dur="2.6s" repeatCount="indefinite" />
          </circle>
        </svg>
      </div>

      <div className="mt-3 text-xs text-slate-400">
        This is a custom visual for the presentation: roads as edges, intersections as nodes, and delivery points sampled along streets.
      </div>
    </GlassCard>
  );
}