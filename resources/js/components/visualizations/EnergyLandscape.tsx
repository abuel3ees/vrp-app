import { motion } from "framer-motion";
import React from "react";

export const EnergyLandscape = () => {
  return (
    <div className="relative w-full h-[300px] lg:h-[400px] bg-slate-900 rounded-xl border border-slate-700 overflow-hidden flex items-end justify-center shadow-2xl">
      {/* Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />
      
      <svg className="w-full h-full absolute bottom-0 z-10" viewBox="0 0 400 200" preserveAspectRatio="none">
        <defs>
          <linearGradient id="landscapeGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#a855f7" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
          </linearGradient>
        </defs>
        
        {/* The Mountain Path (Double Well) */}
        <path 
            d="M0,50 C80,50 100,180 140,150 C180,120 200,10 260,10 C320,10 340,180 370,180 L400,180 L400,200 L0,200 Z" 
            fill="url(#landscapeGrad)" 
            stroke="#a855f7" 
            strokeWidth="2"
        />
        
        <text x="140" y="175" fill="white" fontSize="8" textAnchor="middle" className="font-mono">Local Minima</text>
        <text x="370" y="195" fill="#22d3ee" fontSize="8" textAnchor="middle" className="font-mono font-bold">Global Minima</text>
      </svg>

      {/* Classical Particle (Red) - Stuck in Local Minima */}
      {/* Replaced complex offset path with simple coordinate approximation to fix React warning */}
      <motion.div
        className="absolute w-4 h-4 rounded-full bg-red-500 shadow-[0_0_15px_red] z-20"
        animate={{ 
            left: ["25%", "35%", "35%", "25%"],
            top: ["75%", "75%", "75%", "75%"]
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] text-red-400 whitespace-nowrap bg-black/50 px-1 rounded">Classical</div>
      </motion.div>

      {/* Quantum Particle (Cyan) - Tunneling Through Barrier */}
      <motion.div
        className="absolute w-4 h-4 rounded-full bg-cyan-400 shadow-[0_0_15px_cyan] z-20"
        animate={{ 
           left: ["35%", "65%", "92%"],
           top: ["75%", "70%", "90%"],
           opacity: [1, 0.3, 1], // Dimming represents tunneling
           scale: [1, 0.8, 1]
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", times: [0, 0.5, 1] }}
      >
        <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] text-cyan-400 whitespace-nowrap bg-black/50 px-1 rounded">Quantum Tunneling</div>
      </motion.div>
    </div>
  );
};