import React from "react";
import { motion } from "framer-motion";
import { Navigation, Battery, Wifi, Signal, MapPin, Clock, Zap } from "lucide-react";

export const MobileAppMockup = () => {
  return (
    <div className="relative w-[320px] h-[640px] bg-slate-950 rounded-[3.5rem] border-[8px] border-slate-800 shadow-[0_0_50px_-10px_rgba(0,0,0,0.5)] overflow-hidden mx-auto ring-1 ring-white/10">
      
      {/* --- Dynamic Island / Notch --- */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-36 h-7 bg-black rounded-b-2xl z-50 flex items-center justify-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-slate-800/50" />
          <div className="w-16 h-4 bg-slate-900/50 rounded-full flex items-center px-2">
             <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse" />
          </div>
      </div>
      
      {/* --- Status Bar --- */}
      <div className="absolute top-3 w-full px-8 flex justify-between text-[10px] text-white z-40 font-bold tracking-widest">
        <span>10:42</span>
        <div className="flex gap-1.5 items-center">
            <Signal className="w-3 h-3" />
            <Wifi className="w-3 h-3" />
            <Battery className="w-4 h-4" />
        </div>
      </div>

      {/* --- Map Viewport --- */}
      <div className="w-full h-full bg-slate-900 flex flex-col relative overflow-hidden">
        
        {/* 1. Map Base Layer (Grid & "Buildings") */}
        <div className="absolute inset-0 opacity-40 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />
        
        {/* Simulated "3D Buildings" */}
        <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-20 left-10 w-20 h-24 bg-slate-800/50 border-t border-l border-white/5 rounded-sm transform skew-y-12" />
            <div className="absolute top-40 right-10 w-32 h-32 bg-slate-800/30 border-t border-l border-white/5 rounded-sm transform -skew-y-6" />
            <div className="absolute bottom-40 left-16 w-16 h-40 bg-slate-800/60 border-t border-l border-white/5 rounded-sm transform skew-y-6" />
        </div>

        {/* 2. The Route Layer */}
        <svg className="absolute inset-0 w-full h-full z-10 overflow-visible">
            <defs>
                <linearGradient id="routeGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#a855f7" />
                    <stop offset="100%" stopColor="#22d3ee" />
                </linearGradient>
                <filter id="glowRoute">
                    <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                    <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
            </defs>

            {/* Route Path */}
            <motion.path 
                d="M160,550 C160,500 120,450 100,400 C80,350 120,300 180,250 C240,200 220,150 160,100" 
                fill="none" 
                stroke="#22d3ee" 
                strokeWidth="6" 
                strokeLinecap="round"
                strokeOpacity="0.2"
            />
            {/* Active Path Animation */}
            <motion.path 
                d="M160,550 C160,500 120,450 100,400 C80,350 120,300 180,250 C240,200 220,150 160,100" 
                fill="none" 
                stroke="url(#routeGrad)" 
                strokeWidth="4" 
                strokeLinecap="round"
                filter="url(#glowRoute)"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 3, ease: "easeInOut", repeat: Infinity }}
            />

            {/* Destination Marker */}
            <g transform="translate(160, 100)">
                <circle r="8" fill="#a855f7" className="animate-ping opacity-75" />
                <circle r="4" fill="#fff" />
            </g>

            {/* Moving Car / Arrow */}
            {/* Using a second invisible path to guide the element along the curve */}
            <motion.g>
                <motion.div
                    className="w-0 h-0"
                    initial={{ offsetDistance: "0%" }}
                    animate={{ offsetDistance: "100%" }}
                    style={{ 
                        offsetPath: 'path("M160,550 C160,500 120,450 100,400 C80,350 120,300 180,250 C240,200 220,150 160,100")',
                        offsetRotate: "auto"
                    }}
                    transition={{ duration: 3, ease: "easeInOut", repeat: Infinity }}
                >
                    <div className="w-6 h-6 -ml-3 -mt-3 bg-white rounded-full border-2 border-slate-900 shadow-xl flex items-center justify-center relative z-20">
                        <Navigation className="w-3 h-3 text-black fill-current" />
                    </div>
                </motion.div>
            </motion.g>
        </svg>

        {/* --- UI Layer: Top Nav --- */}
        <div className="absolute top-12 left-4 right-4 z-20">
            <div className="bg-slate-900/90 backdrop-blur-xl rounded-2xl p-4 border border-white/10 shadow-xl flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center border border-white/5">
                    <Navigation className="w-5 h-5 text-white rotate-45" />
                </div>
                <div>
                    <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Next Turn</div>
                    <div className="text-sm font-bold text-white">Turn Right on Quantum Ave</div>
                </div>
                <div className="ml-auto text-xs font-mono text-cyan-400">200m</div>
            </div>
        </div>

        {/* --- UI Layer: Bottom Sheet --- */}
        <div className="absolute bottom-0 w-full z-30">
            <div className="bg-slate-950/80 backdrop-blur-xl rounded-t-[2rem] border-t border-white/10 p-6 pb-8 shadow-[0_-10px_40px_-10px_rgba(0,0,0,0.8)]">
                {/* Drag Handle */}
                <div className="w-12 h-1 bg-slate-700 rounded-full mx-auto mb-6" />
                
                {/* Route Stats */}
                <div className="flex justify-between items-end mb-6">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-3xl font-bold text-white tracking-tight">12<span className="text-lg text-slate-500">min</span></span>
                            <span className="px-2 py-0.5 rounded bg-green-500/20 text-green-400 text-[10px] font-bold border border-green-500/30">FASTEST</span>
                        </div>
                        <div className="text-xs text-slate-400 flex items-center gap-2">
                            <span className="flex items-center gap-1"><Clock className="w-3 h-3"/> 10:54 arrival</span>
                            <span>•</span>
                            <span>4.2 km</span>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center border border-purple-500/30 animate-pulse">
                            <Zap className="w-5 h-5 text-purple-400 fill-current" />
                        </div>
                    </div>
                </div>

                {/* Primary Action */}
                <div className="flex gap-3">
                    <button className="flex-1 h-12 bg-white rounded-xl flex items-center justify-center text-sm font-bold text-black shadow-lg hover:bg-slate-200 transition-colors">
                        End Route
                    </button>
                    <button className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center border border-white/10 hover:bg-slate-700 transition-colors text-white">
                        <MapPin className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};