// resources/js/components/visualizations/TspQaoaPipelineFlowchart.tsx
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
  kind?: "start" | "process" | "decision" | "io" | "group";
};

type Edge = {
  from: string;
  to: string;
  label?: string;
  path?: string; // SVG path override
  dashed?: boolean;
};

function clamp(v: number, a: number, b: number) {
  return Math.max(a, Math.min(b, v));
}

function roundedRectPath(x: number, y: number, w: number, h: number, r: number) {
  const rr = clamp(r, 0, Math.min(w, h) / 2);
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

function diamondPath(cx: number, cy: number, w: number, h: number) {
  const hw = w / 2;
  const hh = h / 2;
  return `M ${cx} ${cy - hh} L ${cx + hw} ${cy} L ${cx} ${cy + hh} L ${cx - hw} ${cy} Z`;
}

export function TspQaoaPipelineFlowchart() {
  const { nodes, edges } = useMemo(() => {
    // ViewBox coordinate system (1000x560)
    const nodes: Node[] = [
      // Group labels (soft)
      { id: "g1", x: 60, y: 40, w: 260, h: 110, title: "Initialization", desc: "Import libraries / dependencies", kind: "group" },
      { id: "g2", x: 60, y: 180, w: 880, h: 170, title: "Data Acquisition", desc: "Load / prepare input data", kind: "group" },
      { id: "g3", x: 60, y: 370, w: 880, h: 150, title: "Preprocessing + Quantum Optimization", desc: "Warm-start + QP + QAOA", kind: "group" },

      // Actual flow nodes
      { id: "start", x: 90, y: 70, w: 180, h: 56, title: "Start", kind: "start" },
      { id: "import", x: 300, y: 70, w: 250, h: 56, title: "Import Libraries", desc: "Qiskit, NumPy, Optimization", kind: "process" },

      { id: "tsp_txt", x: 170, y: 235, w: 180, h: 90, title: "tsp.txt?", desc: "Input file exists?", kind: "decision" },
      { id: "setup_files", x: 390, y: 205, w: 220, h: 56, title: "setup_files()", desc: "Generate / download files", kind: "io" },
      { id: "readData", x: 390, y: 280, w: 220, h: 56, title: "readData()", desc: "Parse distance matrix", kind: "process" },

      { id: "opt_txt", x: 170, y: 410, w: 180, h: 90, title: "optimal.txt?", desc: "Warm-start params?", kind: "decision" },
      { id: "load_params", x: 390, y: 380, w: 220, h: 56, title: "load_params()", desc: "Read β, γ, p", kind: "process" },
      { id: "random_pt", x: 390, y: 455, w: 220, h: 56, title: "Random init", desc: "Seed parameters", kind: "process" },

      { id: "hyper", x: 640, y: 410, w: 240, h: 56, title: "Set Hyperparams", desc: "shots, iterations, depth p", kind: "process" },
      { id: "qp", x: 640, y: 480, w: 240, h: 56, title: "Create TSP & QP", desc: "Quadratic Program", kind: "process" },
      { id: "qaoa", x: 640, y: 550, w: 240, h: 56, title: "Construct QAOA", desc: "Ansatz + SPSA loop", kind: "process" },
    ];

    const edges: Edge[] = [
      { from: "start", to: "import" },

      { from: "import", to: "tsp_txt" },
      { from: "tsp_txt", to: "setup_files", label: "No" },
      { from: "tsp_txt", to: "readData", label: "Yes" },
      { from: "setup_files", to: "readData" },

      { from: "readData", to: "opt_txt" },
      { from: "opt_txt", to: "load_params", label: "Yes" },
      { from: "opt_txt", to: "random_pt", label: "No" },

      { from: "load_params", to: "hyper" },
      { from: "random_pt", to: "hyper" },

      { from: "hyper", to: "qp" },
      { from: "qp", to: "qaoa" },
    ];

    return { nodes, edges };
  }, []);

  const nodeById = useMemo(() => new Map(nodes.map((n) => [n.id, n])), [nodes]);

  const anchor = (n: Node, side: "l" | "r" | "t" | "b") => {
    switch (side) {
      case "l":
        return { x: n.x, y: n.y + n.h / 2 };
      case "r":
        return { x: n.x + n.w, y: n.y + n.h / 2 };
      case "t":
        return { x: n.x + n.w / 2, y: n.y };
      case "b":
        return { x: n.x + n.w / 2, y: n.y + n.h };
    }
  };

  const edgePath = (e: Edge) => {
    if (e.path) return e.path;
    const a = nodeById.get(e.from)!;
    const b = nodeById.get(e.to)!;

    // Simple heuristic: mostly left->right; otherwise top->bottom
    const start = a.x + a.w <= b.x ? anchor(a, "r") : anchor(a, "b");
    const end = a.x + a.w <= b.x ? anchor(b, "l") : anchor(b, "t");

    const mx = (start.x + end.x) / 2;
    return `M ${start.x} ${start.y} C ${mx} ${start.y}, ${mx} ${end.y}, ${end.x} ${end.y}`;
  };

  return (
    <div className="w-full h-full">
      <svg viewBox="0 0 1000 620" className="w-full h-full">
        <defs>
          <linearGradient id="cardFill" x1="0" x2="1">
            <stop offset="0" stopColor="rgba(15,23,42,0.55)" />
            <stop offset="1" stopColor="rgba(15,23,42,0.35)" />
          </linearGradient>

          <marker id="arrow" markerWidth="12" markerHeight="12" refX="10" refY="6" orient="auto">
            <path d="M 0 0 L 12 6 L 0 12 z" fill="rgba(226,232,240,0.75)" />
          </marker>
        </defs>

        {/* Group containers */}
        {nodes
          .filter((n) => n.kind === "group")
          .map((g) => (
            <g key={g.id}>
              <path
                d={roundedRectPath(g.x, g.y, g.w, g.h, 16)}
                fill="rgba(2,6,23,0.25)"
                stroke="rgba(148,163,184,0.18)"
                strokeWidth="2"
              />
              <text x={g.x + 18} y={g.y + 26} fill="rgba(226,232,240,0.9)" fontSize="14" fontWeight="700">
                {g.title}
              </text>
              {g.desc ? (
                <text x={g.x + 18} y={g.y + 46} fill="rgba(148,163,184,0.9)" fontSize="12">
                  {g.desc}
                </text>
              ) : null}
            </g>
          ))}

        {/* Edges */}
        {edges.map((e, i) => (
          <g key={i}>
            <motion.path
              d={edgePath(e)}
              fill="none"
              stroke="rgba(226,232,240,0.55)"
              strokeWidth="2.5"
              strokeDasharray={e.dashed ? "8 8" : undefined}
              markerEnd="url(#arrow)"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.9, delay: 0.08 * i }}
            />
            {e.label ? (
              <text fill="rgba(226,232,240,0.75)" fontSize="12" fontWeight="700">
                <textPath href={`#edge-${i}`} />
              </text>
            ) : null}
          </g>
        ))}

        {/* Nodes */}
        {nodes
          .filter((n) => n.kind !== "group")
          .map((n, idx) => {
            const isDecision = n.kind === "decision";
            const isStart = n.kind === "start";
            const fill = isStart ? "rgba(99,102,241,0.18)" : isDecision ? "rgba(236,72,153,0.12)" : "url(#cardFill)";
            const stroke = isStart ? "rgba(99,102,241,0.35)" : isDecision ? "rgba(236,72,153,0.28)" : "rgba(148,163,184,0.18)";

            return (
              <motion.g
                key={n.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.05 * idx }}
              >
                {isDecision ? (
                  <path d={diamondPath(n.x + n.w / 2, n.y + n.h / 2, n.w, n.h)} fill={fill} stroke={stroke} strokeWidth="2" />
                ) : (
                  <path d={roundedRectPath(n.x, n.y, n.w, n.h, 14)} fill={fill} stroke={stroke} strokeWidth="2" />
                )}

                <text
                  x={n.x + n.w / 2}
                  y={n.y + 24}
                  textAnchor="middle"
                  fill="rgba(248,250,252,0.92)"
                  fontSize="14"
                  fontWeight="800"
                >
                  {n.title}
                </text>

                {n.desc ? (
                  <text
                    x={n.x + n.w / 2}
                    y={n.y + 44}
                    textAnchor="middle"
                    fill="rgba(148,163,184,0.95)"
                    fontSize="11.5"
                  >
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
