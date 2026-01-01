import { motion } from "framer-motion";
import React from "react";

export const EnergyLandscape = () => {
  return (
    <div className="relative w-full h-[400px] bg-slate-900/50 rounded-xl border border-white/10 overflow-hidden flex items-end justify-center">
      {/* Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(transparent_1px,_#0f172a_1px)] bg-[size:20px_20px] opacity-30" />
      
      <svg className="w-full h-full absolute bottom-0" viewBox="0 0 400 200" preserveAspectRatio="none">
        <defs>
          <linearGradient id="landscapeGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#a855f7" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
          </linearGradient>
        </defs>
        
        {/* The Mountain Path (Double Well Potential) */}
        <path 
            d="M0,50 C100,50 120,180 150,150 C180,120 200,20 250,20 C300,20 320,180 350,180 L400,180 L400,200 L0,200 Z" 
            fill="url(#landscapeGrad)" 
            stroke="#a855f7" 
            strokeWidth="2"
        />
        
        {/* Local Minima Label */}
        <text x="150" y="175" fill="white" fontSize="8" textAnchor="middle" className="font-mono">Local Minima</text>
        {/* Global Minima Label */}
        <text x="350" y="195" fill="#22d3ee" fontSize="8" textAnchor="middle" className="font-mono font-bold">Global Minima</text>
      </svg>

      {/* Classical Particle (Stuck) */}
      <motion.div
        className="absolute w-4 h-4 rounded-full bg-red-500 shadow-[0_0_10px_red]"
        animate={{ 
            offsetDistance: ["0%", "35%"],
            opacity: [1, 1] 
        }}
        style={{ offsetPath: 'path("M0,50 C100,50 120,180 150,150")' }}
        transition={{ duration: 2, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
      >
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[8px] text-red-400 whitespace-nowrap">Classical (Stuck)</div>
      </motion.div>

      {/* Quantum Particle (Tunneling) */}
      <motion.div
        className="absolute w-4 h-4 rounded-full bg-cyan-400 shadow-[0_0_15px_cyan]"
        animate={{ 
           left: ["37%", "62%", "87%"],
           top: ["75%", "75%", "90%"],
           opacity: [1, 0.3, 1], // Dimming represents tunneling through the barrier
           scale: [1, 0.8, 1]
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", times: [0, 0.5, 1] }}
      >
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[8px] text-cyan-400 whitespace-nowrap">Quantum Tunneling</div>
      </motion.div>
      
      <div className="absolute top-4 right-4 p-2 bg-black/60 rounded border border-white/10 text-xs text-slate-300 max-w-[150px]">
        [cite_start]Fig 2.5: Quantum algorithms traverse the energy landscape via tunneling[cite: 416].
      </div>
    </div>
  );
};