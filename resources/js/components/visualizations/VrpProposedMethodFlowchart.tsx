// resources/js/components/visualizations/VrpProposedMethodFlowchart.tsx
import React, { useMemo } from "react";
import { motion } from "framer-motion";

type Node = {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  title: string;
  desc?: string;
  tone?: "pink" | "purple" | "blue" | "cyan" | "neutral";
  kind?: "process" | "decision" | "start" | "end" | "group";
};

type Edge = {
  from: string;
  to: string;
  label?: string;
  dashed?: boolean;
  soft?: boolean;
  bend?: "up" | "down";
};

function rrect(x: number, y: number, w: number, h: number, r: number) {
  const rr = Math.max(0, Math.min(r, Math.min(w, h) / 2));
  return `M ${x + rr} ${y}
          H ${x + w - rr}
          Q ${x + w} ${y} ${x + w} ${y + rr}
          V ${y + h - rr}
          Q ${x + w} ${y + h} ${x + w - rr} ${y + h}
          H ${x + rr}
          Q ${x} ${y + h} ${x} ${y + h - rr}
          V ${y + rr}
          Q ${x} ${y} ${x + rr} ${y}
          Z`;
}

function diamond(cx: number, cy: number, w: number, h: number) {
  const hw = w / 2;
  const hh = h / 2;
  return `M ${cx} ${cy - hh} L ${cx + hw} ${cy} L ${cx} ${cy + hh} L ${cx - hw} ${cy} Z`;
}

export function VrpProposedMethodFlowchart() {
  const { nodes, edges } = useMemo(() => {
    // ViewBox 1200 x 650
    const nodes: Node[] = [
      // Top
      { id: "start", x: 40, y: 40, w: 280, h: 78, title: "Input", desc: "Stops + depot + vehicles + mode", tone: "pink", kind: "start" },
      { id: "optK", x: 380, y: 46, w: 220, h: 88, title: "Optimize vehicles?", desc: "K fixed vs optimized", tone: "purple", kind: "decision" },

      // Shared preprocessing
      { id: "dist", x: 40, y: 160, w: 280, h: 78, title: "Distance matrix", desc: "Real distances / MDS", tone: "blue", kind: "process" },
      { id: "qp", x: 40, y: 260, w: 280, h: 78, title: "Quadratic Program", desc: "Binary vars + constraints", tone: "blue", kind: "process" },
      { id: "qubo", x: 40, y: 360, w: 280, h: 78, title: "QUBO → Ising", desc: "Penalties + Hamiltonian", tone: "cyan", kind: "process" },

      // QAOA loop container
      { id: "qaoaBox", x: 380, y: 170, w: 500, h: 320, title: "QAOA Loop", desc: "Quantum eval + classical update", tone: "neutral", kind: "group" },
      { id: "execute", x: 420, y: 230, w: 210, h: 78, title: "Execute circuit", desc: "Sampler / Aer", tone: "blue", kind: "process" },
      { id: "measure", x: 650, y: 230, w: 210, h: 78, title: "Measure + cost", desc: "Bitstrings → objective", tone: "cyan", kind: "process" },
      { id: "update", x: 535, y: 330, w: 230, h: 78, title: "Update (β, γ)", desc: "Classical optimizer (SPSA)", tone: "purple", kind: "process" },
      { id: "conv", x: 535, y: 430, w: 230, h: 88, title: "Converged?", desc: "Stop when stable", tone: "purple", kind: "decision" },

      // Post-processing
      { id: "feas", x: 920, y: 230, w: 240, h: 110, title: "Feasibility + subtour", desc: "Reject disjoint cycles", tone: "pink", kind: "process" },
      { id: "best", x: 920, y: 370, w: 240, h: 78, title: "Select best feasible", desc: "Min cost among samples", tone: "blue", kind: "process" },
      { id: "plot", x: 920, y: 480, w: 240, h: 78, title: "Output routes", desc: "Plot / return JSON", tone: "pink", kind: "end" },

      // K-optimized branch marker (subtle)
      { id: "forK", x: 380, y: 560, w: 500, h: 60, title: "If K is optimized", desc: "Repeat for k=1..K and keep best", tone: "neutral", kind: "process" },
    ];

    const edges: Edge[] = [
      { from: "start", to: "optK" },

      // preprocessing chain
      { from: "start", to: "dist", soft: true },
      { from: "dist", to: "qp" },
      { from: "qp", to: "qubo" },

      // into QAOA
      { from: "qubo", to: "execute" },
      { from: "execute", to: "measure" },
      { from: "measure", to: "update" },
      { from: "update", to: "execute", label: "iterate", dashed: true, bend: "up" },
      { from: "measure", to: "conv" },

      // convergence out
      { from: "conv", to: "feas", label: "Yes" },
      { from: "conv", to: "measure", label: "No", dashed: true },

      { from: "feas", to: "best" },
      { from: "best", to: "plot" },

      // K optimized route (illustrative)
      { from: "optK", to: "forK", label: "True", dashed: true },
      { from: "forK", to: "dist", dashed: true, bend: "up" },
      { from: "optK", to: "dist", label: "False" },
    ];

    return { nodes, edges };
  }, []);

  const byId = useMemo(() => new Map(nodes.map((n) => [n.id, n])), [nodes]);

  const tone = (t?: Node["tone"]) => {
    switch (t) {
      case "pink":
        return { fill: "rgba(236,72,153,0.10)", stroke: "rgba(236,72,153,0.28)" };
      case "purple":
        return { fill: "rgba(168,85,247,0.10)", stroke: "rgba(168,85,247,0.28)" };
      case "blue":
        return { fill: "rgba(59,130,246,0.10)", stroke: "rgba(59,130,246,0.25)" };
      case "cyan":
        return { fill: "rgba(34,211,238,0.09)", stroke: "rgba(34,211,238,0.24)" };
      default:
        return { fill: "rgba(2,6,23,0.25)", stroke: "rgba(148,163,184,0.18)" };
    }
  };

  const anchor = (n: Node, s: "l" | "r" | "t" | "b") => {
    if (s === "l") return { x: n.x, y: n.y + n.h / 2 };
    if (s === "r") return { x: n.x + n.w, y: n.y + n.h / 2 };
    if (s === "t") return { x: n.x + n.w / 2, y: n.y };
    return { x: n.x + n.w / 2, y: n.y + n.h };
  };

  const edgePath = (e: Edge) => {
    const a = byId.get(e.from)!;
    const b = byId.get(e.to)!;

    const leftToRight = a.x + a.w <= b.x;
    const start = leftToRight ? anchor(a, "r") : anchor(a, "b");
    const end = leftToRight ? anchor(b, "l") : anchor(b, "t");

    const dx = Math.abs(end.x - start.x);
    const dy = Math.abs(end.y - start.y);
    const curve = Math.max(60, Math.min(220, (dx + dy) / 3));

    const c1 = { x: start.x + (leftToRight ? curve : 0), y: start.y + (e.bend === "down" ? curve * 0.25 : e.bend === "up" ? -curve * 0.25 : 0) };
    const c2 = { x: end.x - (leftToRight ? curve : 0), y: end.y + (e.bend === "down" ? -curve * 0.25 : e.bend === "up" ? curve * 0.25 : 0) };

    return `M ${start.x} ${start.y} C ${c1.x} ${c1.y}, ${c2.x} ${c2.y}, ${end.x} ${end.y}`;
  };

  return (
    <div className="w-full h-full">
      <svg viewBox="0 0 1200 650" className="w-full h-full">
        <defs>
          <marker id="arrowV" markerWidth="12" markerHeight="12" refX="10" refY="6" orient="auto">
            <path d="M 0 0 L 12 6 L 0 12 z" fill="rgba(226,232,240,0.75)" />
          </marker>
          <filter id="softGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feColorMatrix
              in="blur"
              type="matrix"
              values="
                1 0 0 0 0
                0 1 0 0 0
                0 0 1 0 0
                0 0 0 0.35 0"
              result="glow"
            />
            <feMerge>
              <feMergeNode in="glow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* QAOA container */}
        {(() => {
          const box = byId.get("qaoaBox")!;
          return (
            <g>
              <path
                d={rrect(box.x, box.y, box.w, box.h, 18)}
                fill="rgba(2,6,23,0.24)"
                stroke="rgba(148,163,184,0.18)"
                strokeWidth="2"
              />
              <text x={box.x + 18} y={box.y + 30} fill="rgba(248,250,252,0.9)" fontSize="14" fontWeight="800">
                {box.title}
              </text>
              <text x={box.x + 18} y={box.y + 50} fill="rgba(148,163,184,0.9)" fontSize="12">
                {box.desc}
              </text>
            </g>
          );
        })()}

        {/* Edges */}
        {edges.map((e, i) => (
          <g key={i}>
            <motion.path
              d={edgePath(e)}
              fill="none"
              stroke={e.soft ? "rgba(148,163,184,0.35)" : "rgba(226,232,240,0.55)"}
              strokeWidth={e.soft ? "2" : "2.6"}
              strokeDasharray={e.dashed ? "8 8" : undefined}
              markerEnd="url(#arrowV)"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.85, delay: 0.06 * i }}
            />
          </g>
        ))}

        {/* Nodes */}
        {nodes
          .filter((n) => n.id !== "qaoaBox")
          .map((n, idx) => {
            const isDecision = n.kind === "decision";
            const { fill, stroke } = tone(n.tone);

            return (
              <motion.g key={n.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.03 * idx }}>
                {isDecision ? (
                  <path d={diamond(n.x + n.w / 2, n.y + n.h / 2, n.w, n.h)} fill={fill} stroke={stroke} strokeWidth="2" filter="url(#softGlow)" />
                ) : (
                  <path d={rrect(n.x, n.y, n.w, n.h, 16)} fill={fill} stroke={stroke} strokeWidth="2" filter="url(#softGlow)" />
                )}

                <text x={n.x + n.w / 2} y={n.y + 28} textAnchor="middle" fill="rgba(248,250,252,0.92)" fontSize="14" fontWeight="800">
                  {n.title}
                </text>

                {n.desc ? (
                  <text x={n.x + n.w / 2} y={n.y + 50} textAnchor="middle" fill="rgba(148,163,184,0.95)" fontSize="11.5">
                    {n.desc}
                  </text>
                ) : null}
              </motion.g>
            );
          })}
      </svg>
    </div>
  );
}
