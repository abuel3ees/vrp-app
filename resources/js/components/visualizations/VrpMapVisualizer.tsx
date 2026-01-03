import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { Radar, MapPin } from "lucide-react";

export const VrpMapVisualizer = () => {
  // 1. Static Data (No useEffect delay = Instant Render)
  const nodes = useMemo(() => [
    { id: 0, x: 50, y: 50, type: 'depot' },
    { id: 1, x: 20, y: 30, type: 'stop' },
    { id: 2, x: 80, y: 20, type: 'stop' },
    { id: 3, x: 85, y: 70, type: 'stop' },
    { id: 4, x: 30, y: 80, type: 'stop' },
    { id: 5, x: 15, y: 60, type: 'stop' },
  ], []);

  // 2. Calculate Path immediately
  const pathString = useMemo(() => {
    const route = [nodes[0], nodes[1], nodes[5], nodes[4], nodes[3], nodes[2], nodes[0]];
    return route.map((n, i) => (i === 0 ? `M ${n.x},${n.y}` : `L ${n.x},${n.y}`)).join(" ");
  }, [nodes]);

  return (
    // changed bg to slate-900 to stand out against the page background
    <div className="relative w-full h-[400px] bg-slate-900 rounded-3xl overflow-hidden border border-slate-700 shadow-2xl flex items-center justify-center">
      
      {/* 1. Tactical Grid Background */}
      <div className="absolute inset-0 opacity-30" 
           style={{ 
             backgroundImage: 'linear-gradient(#475569 1px, transparent 1px), linear-gradient(90deg, #475569 1px, transparent 1px)', 
             backgroundSize: '40px 40px' 
           }} 
      />
      
      {/* 2. SVG Layer (The Routes) */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
            <linearGradient id="routeGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#a855f7" />
                <stop offset="100%" stopColor="#22d3ee" />
            </linearGradient>
            <filter id="glow">
                <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
        </defs>

        {/* Faint 'Possible' Connections */}
        {nodes.map((node, i) => (
             nodes.slice(i + 1).map((target, j) => (
                <line 
                    key={`conn-${i}-${j}`}
                    x1={node.x} y1={node.y} x2={target.x} y2={target.y}
                    stroke="#475569" strokeWidth="0.5" strokeDasharray="3,3"
                    opacity="0.5"
                />
             ))
        ))}

        {/* The Active Path */}
        <motion.path 
            d={pathString}
            fill="none"
            stroke="url(#routeGrad)"
            strokeWidth="1.5"
            filter="url(#glow)"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 3, ease: "easeInOut", delay: 0.5 }}
        />
      </svg>

      {/* 3. HTML Nodes (The Dots) - Higher Z-Index */}
      {nodes.map((node, i) => (
          <motion.div 
            key={i}
            className="absolute z-20"
            style={{ left: `${node.x}%`, top: `${node.y}%`, transform: 'translate(-50%, -50%)' }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: i * 0.1 }}
          >
              {/* Node Circle */}
              <div className={`relative flex items-center justify-center w-6 h-6 rounded-full border-2 shadow-lg ${node.type === 'depot' ? 'bg-purple-600 border-white shadow-purple-500/50' : 'bg-slate-950 border-cyan-500 shadow-cyan-500/50'}`}>
                  {node.type === 'depot' && <div className="w-2 h-2 bg-white rounded-full" />}
                  {node.type === 'stop' && <div className="text-[8px] font-bold text-cyan-400">{i}</div>}
              </div>
              
              {/* Ripple Animation */}
              <div className={`absolute inset-0 rounded-full animate-ping opacity-50 z-0 ${node.type === 'depot' ? 'bg-purple-500' : 'bg-cyan-500'}`} />

              {/* Label */}
              {node.type === 'depot' && (
                  <div className="absolute top-8 left-1/2 -translate-x-1/2 bg-slate-900/90 text-[10px] text-white px-2 py-1 rounded border border-white/20 whitespace-nowrap z-30 font-bold tracking-wider">
                      DEPOT
                  </div>
              )}
          </motion.div>
      ))}

      {/* 4. Scanning Overlay */}
      <div className="absolute top-0 w-full h-[2px] bg-cyan-400/50 blur-[4px] shadow-[0_0_20px_cyan] animate-[scan_4s_linear_infinite]" />
      <style>{`@keyframes scan { 0% { top: 0% } 50% { top: 100% } 100% { top: 0% } }`}</style>

      {/* 5. HUD */}
      <div className="absolute top-4 left-4 z-30 flex items-center gap-2 bg-black/40 px-3 py-1.5 rounded-full border border-white/10 backdrop-blur-md">
          <Radar className="w-4 h-4 text-green-400 animate-spin" />
          <span className="text-[10px] font-bold text-green-400 font-mono">LIVE OPTIMIZATION</span>
      </div>
    </div>
  );
};