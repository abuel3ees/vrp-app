import { motion } from "framer-motion";
import React, { useMemo } from "react";

// NOTICE: "export const", NOT "export default"
export const VrpMapVisualizer = () => {
    const nodes = useMemo(() => Array.from({ length: 15 }).map((_, i) => ({
        id: i,
        x: 50 + Math.cos(i * 2) * 30 + (Math.random() * 20 - 10),
        y: 50 + Math.sin(i * 2) * 30 + (Math.random() * 20 - 10),
        type: i === 0 ? 'depot' : 'customer'
    })), []);

    return (
        <div className="relative w-full aspect-square max-w-[500px] bg-slate-900/50 rounded-full border border-slate-700/50 overflow-hidden shadow-2xl mx-auto">
            <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/10 to-transparent w-full h-full origin-center"
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            />
            
            <svg className="w-full h-full p-8" viewBox="0 0 100 100">
                <defs>
                    <linearGradient id="pathGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#a855f7" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.8" />
                    </linearGradient>
                </defs>

                {nodes.map((node, i) => (
                    nodes.slice(i+1).map((target, j) => (
                        <motion.line 
                            key={`${i}-${j}`}
                            x1={node.x} y1={node.y}
                            x2={target.x} y2={target.y}
                            stroke="white"
                            strokeWidth="0.1"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: [0, 0.2, 0] }}
                            transition={{ duration: 2, delay: Math.random() * 2, repeat: Infinity }}
                        />
                    ))
                ))}

                <motion.path 
                    d={`M${nodes[0].x},${nodes[0].y} L${nodes[2].x},${nodes[2].y} L${nodes[5].x},${nodes[5].y} L${nodes[8].x},${nodes[8].y} L${nodes[0].x},${nodes[0].y}`}
                    fill="none"
                    stroke="url(#pathGrad)"
                    strokeWidth="0.8"
                    strokeDasharray="100"
                    strokeDashoffset="100"
                    strokeLinecap="round"
                    animate={{ strokeDashoffset: 0 }}
                    transition={{ duration: 3, ease: "easeInOut", repeat: Infinity, repeatDelay: 1 }}
                />

                {nodes.map((node, i) => (
                    <motion.circle
                        key={i}
                        cx={node.x}
                        cy={node.y}
                        r={node.type === 'depot' ? 3 : 1.5}
                        fill={node.type === 'depot' ? '#a855f7' : '#fff'}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: i * 0.05 }}
                    >
                    </motion.circle>
                ))}
            </svg>

            <div className="absolute bottom-6 right-6 p-3 bg-black/60 backdrop-blur rounded border border-white/10 text-[10px] font-mono text-white">
                <div className="flex items-center gap-2 mb-1"><div className="w-2 h-2 rounded-full bg-purple-500"/> Depot (Start)</div>
                <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-white"/> Customer Node</div>
            </div>
        </div>
    );
};