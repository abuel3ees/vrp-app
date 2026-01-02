import { motion } from "framer-motion";
import React, { useMemo } from "react";

export const EntanglementGraph = () => {
  // Define nodes and edges inside useMemo to ensure stability
  const { nodes, edges, positions } = useMemo(() => {
    const n = Array.from({ length: 12 }).map((_, i) => ({ id: i }));
    const e = [
        [0, 1], [1, 2], [1, 3], [3, 5], [4, 5], [5, 6],
        [6, 7], [7, 8], [6, 9], [9, 10], [10, 11]
    ];
    
    // Calculate positions once
    const p = n.map((_, i) => ({
      x: 50 + Math.cos(i * 0.55) * 35 + (i % 2 === 0 ? 5 : -5),
      y: 50 + Math.sin(i * 0.55) * 35
    }));

    return { nodes: n, edges: e, positions: p };
  }, []);

  return (
    <div className="relative w-full aspect-square max-w-[400px] mx-auto group">
      <div className="absolute inset-0 bg-purple-500/5 rounded-full blur-3xl group-hover:bg-purple-500/10 transition-colors duration-500" />
      
      <svg className="w-full h-full p-4 overflow-visible" viewBox="0 0 100 100">
        <defs>
          <linearGradient id="edgeGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#a855f7" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.8" />
          </linearGradient>
        </defs>

        {/* Edges */}
        {edges.map(([s, t], i) => {
            const start = positions[s];
            const end = positions[t];
            // Safety check to prevent cx="undefined" crash
            if (!start || !end) return null;

            return (
              <React.Fragment key={`edge-group-${i}`}>
                  {/* The Line */}
                  <motion.line
                    x1={start.x}
                    y1={start.y}
                    x2={end.x}
                    y2={end.y}
                    stroke="url(#edgeGrad)"
                    strokeWidth="1"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 1.5, delay: i * 0.1 }}
                  />
                  
                  {/* The Pulse (Particle) */}
                  <motion.circle
                    r="1.5"
                    fill="#fff"
                    initial={{ cx: start.x, cy: start.y, opacity: 0 }}
                    animate={{ 
                      cx: [start.x, end.x],
                      cy: [start.y, end.y],
                      opacity: [0, 1, 0]
                    }}
                    transition={{ 
                      duration: 2, 
                      repeat: Infinity, 
                      ease: "linear",
                      delay: Math.random() * 2 
                    }}
                  />
              </React.Fragment>
            );
        })}

        {/* Nodes */}
        {nodes.map((n, i) => (
          <motion.g 
            key={n.id}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: i * 0.05, type: "spring" }}
          >
            <circle cx={positions[i].x} cy={positions[i].y} r="4" fill="#0f172a" stroke="#475569" strokeWidth="0.5" />
            <circle cx={positions[i].x} cy={positions[i].y} r="2" fill={i === 5 ? "#22d3ee" : "#a855f7"} />
            <text x={positions[i].x} y={positions[i].y + 0.5} textAnchor="middle" fontSize="3" fill="white" className="font-mono pointer-events-none select-none">
                {n.id}
            </text>
          </motion.g>
        ))}
      </svg>
      
      <div className="absolute -bottom-8 w-full text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-black/50 border border-white/10 rounded-full text-[10px] text-slate-400 font-mono">
          <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          Hardware Topology: Heavy-Hex
        </div>
      </div>
    </div>
  );
};