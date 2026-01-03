import React from 'react';

export const EnergyLandscape = () => {
  return (
    <div className="relative w-full aspect-video perspective-1000 bg-slate-900 rounded-xl border border-white/10 overflow-hidden flex items-center justify-center shadow-2xl">
        
        {/* 1. 3D Grid Floor (Pure CSS) */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:40px_40px] [transform:rotateX(60deg)] origin-bottom opacity-30" />
        
        {/* 2. The Math Function Graph */}
        <svg viewBox="0 0 200 100" className="w-[90%] h-[70%] z-10 drop-shadow-[0_0_10px_rgba(168,85,247,0.4)]">
            {/* The Hill and Valley Path */}
            <path id="energyPath" d="M0,80 Q20,20 40,80 T80,80 T120,20 T160,90 T200,50" fill="none" stroke="url(#gradient)" strokeWidth="2" strokeLinecap="round" />
            
            <defs>
                <linearGradient id="gradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#a855f7" />
                </linearGradient>
            </defs>
            
            {/* 3. Classical Ball (Stuck in local minima) */}
            <circle cx="40" cy="80" r="3" fill="#ef4444" className="animate-bounce">
                <animate attributeName="opacity" values="1;0.5;1" dur="2s" repeatCount="indefinite" />
            </circle>
            
            {/* 4. Quantum Ball (Tunneling through the hill) */}
            <circle r="4" fill="#a855f7" className="shadow-[0_0_15px_purple]">
                 {/* This animates the ball along the path defined above */}
                 <animateMotion dur="4s" repeatCount="indefinite" path="M0,60 Q20,0 40,60 T80,60 T120,0 T160,70 T200,30" />
            </circle>
        </svg>

        {/* Labels */}
        <div className="absolute bottom-4 left-6 text-[10px] font-mono text-red-400 flex items-center gap-2 bg-black/50 px-2 py-1 rounded border border-red-500/30">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" /> Classical Minima (Stuck)
        </div>
        <div className="absolute bottom-4 right-6 text-[10px] font-mono text-purple-400 flex items-center gap-2 bg-black/50 px-2 py-1 rounded border border-purple-500/30">
             Global Minima (Tunneling) <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
        </div>
    </div>
  );
};