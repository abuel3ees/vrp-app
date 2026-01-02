import { motion } from "framer-motion";
import { Smartphone, Server, Box, Cloud } from "lucide-react";
import React from "react";

export const SystemArchitecture = () => {
  return (
    // CHANGED: h-[500px] -> h-full min-h-[300px] max-h-[500px] to prevent overlapping
    <div className="relative w-full h-full min-h-[300px] max-h-[500px] flex items-center justify-center p-8 bg-slate-950/50 rounded-3xl border border-white/5 overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)] pointer-events-none" />

      {/* SVG Layer for Connections */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
        <defs>
            <filter id="glow-line" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
        </defs>
        {/* We rely on the CSS flexbox for positioning, SVG lines are decorative/background here */}
      </svg>

      {/* Nodes Container */}
      <div className="relative z-10 flex flex-col md:flex-row justify-between items-center w-full max-w-6xl gap-4 md:gap-0 px-4">
        
        {/* 1. Driver App */}
        <TechNode 
            icon={<Smartphone className="w-6 h-6 md:w-8 md:h-8 text-blue-400" />} 
            label="Driver App" 
            sub="Flutter Mobile" 
            status="Online"
            color="border-blue-500/30 shadow-blue-500/20"
        />

        <FlowLabel text="JSON" />

        {/* 2. Orchestrator */}
        <TechNode 
            icon={<Server className="w-6 h-6 md:w-8 md:h-8 text-emerald-400" />} 
            label="Orchestrator" 
            sub="Laravel API" 
            status="Processing"
            color="border-emerald-500/30 shadow-emerald-500/20"
        />

        <FlowLabel text="Queue" />

        {/* 3. Solver Engine */}
        <TechNode 
            icon={<Box className="w-6 h-6 md:w-8 md:h-8 text-orange-400" />} 
            label="Solver Engine" 
            sub="Python / Qiskit" 
            status="Active"
            color="border-orange-500/30 shadow-orange-500/20"
        />

        <FlowLabel text="QASM" />

        {/* 4. Quantum Cloud */}
        <TechNode 
            icon={<Cloud className="w-6 h-6 md:w-8 md:h-8 text-purple-400" />} 
            label="IBMQ Cloud" 
            sub="Quantum Runtime" 
            status="Connected"
            color="border-purple-500/30 shadow-purple-500/20"
            isQuantum
        />
      </div>
    </div>
  );
};

// --- Sub Components ---

const TechNode = ({ icon, label, sub, status, color, isQuantum }: any) => (
    <motion.div 
        whileHover={{ y: -5, scale: 1.02 }}
        className={`relative flex flex-col items-center justify-center 
        w-32 h-32 md:w-48 md:h-48 
        bg-slate-900/80 backdrop-blur-xl rounded-2xl border ${color} 
        shadow-[0_0_40px_-10px_rgba(0,0,0,0.5)] transition-all group overflow-hidden shrink-0`}
    >
        {isQuantum && (
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(168,85,247,0.1),transparent_70%)] animate-pulse" />
        )}

        <div className="absolute top-2 md:top-4 w-full px-4 flex justify-between items-center">
            <div className="flex gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-600" />
                <div className="w-1.5 h-1.5 rounded-full bg-slate-600" />
            </div>
            <div className="flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
            </div>
        </div>

        <div className="relative z-10 mb-2 md:mb-3 p-3 md:p-4 bg-white/5 rounded-full border border-white/5 group-hover:border-white/20 transition-colors group-hover:scale-110 duration-300">
            {icon}
        </div>

        <div className="text-center z-10">
            <h4 className="text-white font-bold tracking-tight text-xs md:text-base">{label}</h4>
            <p className="text-[10px] md:text-xs text-slate-400 font-mono mt-1 hidden md:block">{sub}</p>
        </div>
    </motion.div>
);

const FlowLabel = ({ text }: { text: string }) => (
    <div className="flex-1 px-2 md:px-4 flex flex-col items-center justify-center relative h-12 md:h-auto shrink min-w-[40px]">
        {/* Connector Line */}
        <div className="w-full h-[1px] bg-slate-700 relative overflow-hidden">
            <motion.div 
                className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
                animate={{ x: ["-100%", "200%"] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            />
        </div>
        
        {/* Label Badge */}
        <div className="absolute top-1/2 -translate-y-1/2 bg-slate-950 border border-slate-700 px-1.5 py-0.5 rounded text-[8px] md:text-[9px] font-mono text-slate-400 uppercase tracking-wider whitespace-nowrap z-20">
            {text}
        </div>
    </div>
);