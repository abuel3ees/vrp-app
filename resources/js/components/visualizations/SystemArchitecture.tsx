import { motion } from "framer-motion";
import { Smartphone, Server, Box, Cloud, Activity, Lock, Zap, Wifi } from "lucide-react";
import React from "react";

export const SystemArchitecture = () => {
  return (
    <div className="relative w-full h-full min-h-[300px] max-h-[500px] flex items-center justify-center p-8 bg-slate-950/50 rounded-3xl border border-white/5 overflow-hidden shadow-2xl">
      
      {/* --- 1. Background Effects --- */}
      {/* Digital Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)] pointer-events-none" />
      
      {/* Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[200px] bg-purple-500/10 blur-[100px] rounded-full pointer-events-none" />

      {/* --- 2. The Main Architecture Flow --- */}
      <div className="relative z-10 flex flex-col md:flex-row justify-between items-center w-full max-w-6xl gap-4 md:gap-0 px-4">
        
        {/* Node 1: Driver App */}
        <TechNode 
            icon={<Smartphone className="w-6 h-6 md:w-8 md:h-8 text-blue-400" />} 
            label="Driver App" 
            sub="Flutter Mobile" 
            status="Connected"
            color="border-blue-500/30 shadow-[0_0_30px_rgba(59,130,246,0.15)]"
            delay={0}
        />

        {/* Connector 1 */}
        <FlowLabel text="HTTPS / JSON" delay={0.5} />

        {/* Node 2: Orchestrator */}
        <TechNode 
            icon={<Server className="w-6 h-6 md:w-8 md:h-8 text-emerald-400" />} 
            label="Orchestrator" 
            sub="Laravel API" 
            status="Processing"
            color="border-emerald-500/30 shadow-[0_0_30px_rgba(16,185,129,0.15)]"
            delay={0.2}
        />

        {/* Connector 2 */}
        <FlowLabel text="Job Queue" delay={0.7} />

        {/* Node 3: Solver Engine */}
        <TechNode 
            icon={<Box className="w-6 h-6 md:w-8 md:h-8 text-orange-400" />} 
            label="Solver Engine" 
            sub="Python / Qiskit" 
            status="Active"
            color="border-orange-500/30 shadow-[0_0_30px_rgba(249,115,22,0.15)]"
            delay={0.4}
        />

        {/* Connector 3 */}
        <FlowLabel text="QASM Circuits" delay={0.9} />

        {/* Node 4: Quantum Cloud */}
        <TechNode 
            icon={<Cloud className="w-6 h-6 md:w-8 md:h-8 text-purple-400" />} 
            label="IBMQ Cloud" 
            sub="Quantum Runtime" 
            status="Online"
            color="border-purple-500/30 shadow-[0_0_30px_rgba(168,85,247,0.15)]"
            isQuantum
            delay={0.6}
        />
      </div>
    </div>
  );
};

// --- Sub Components ---

const TechNode = ({ icon, label, sub, status, color, isQuantum, delay }: any) => (
    <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: delay }}
        whileHover={{ y: -5, scale: 1.02 }}
        className={`relative flex flex-col items-center justify-center 
        w-32 h-32 md:w-48 md:h-48 
        bg-slate-900/60 backdrop-blur-xl rounded-2xl border ${color} 
        transition-all group overflow-hidden shrink-0`}
    >
        {/* Quantum Background Effect */}
        {isQuantum && (
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(168,85,247,0.15),transparent_70%)] animate-pulse" />
        )}

        {/* Top Status Bar */}
        <div className="absolute top-3 md:top-4 w-full px-4 flex justify-between items-center">
            <div className="flex gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-600/50" />
                <div className="w-1.5 h-1.5 rounded-full bg-slate-600/50" />
            </div>
            <div className="flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <span className="hidden md:block text-[9px] uppercase tracking-wider text-slate-500 font-bold">{status}</span>
            </div>
        </div>

        {/* Icon Area with Glow */}
        <div className="relative z-10 mb-2 md:mb-3 p-3 md:p-4 bg-white/5 rounded-full border border-white/5 group-hover:border-white/20 transition-all duration-300 group-hover:scale-110 group-hover:bg-white/10">
            {icon}
        </div>

        {/* Labels */}
        <div className="text-center z-10 px-2">
            <h4 className="text-white font-bold tracking-tight text-xs md:text-lg">{label}</h4>
            <p className="text-[10px] md:text-xs text-slate-400 font-mono mt-1 opacity-80">{sub}</p>
        </div>

        {/* Reflection/Glow on Hover */}
        <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none`} />
    </motion.div>
);

const FlowLabel = ({ text, delay }: { text: string, delay: number }) => (
    <div className="flex-1 px-2 md:px-0 flex flex-col items-center justify-center relative h-12 md:h-auto shrink min-w-[40px] md:min-w-[80px]">
        
        {/* The Wire */}
        <div className="w-full h-[1px] bg-slate-800 relative overflow-visible">
            
            {/* The Pulse (Energy Packet) */}
            <motion.div 
                className="absolute top-1/2 -translate-y-1/2 w-20 h-[3px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent blur-[1px]"
                initial={{ left: "-100%" }}
                animate={{ left: "200%" }}
                transition={{ 
                    duration: 2, 
                    repeat: Infinity, 
                    ease: "linear",
                    delay: delay 
                }}
            />
             {/* Secondary Particle */}
             <motion.div 
                className="absolute top-1/2 -translate-y-1/2 w-1 h-1 bg-white rounded-full shadow-[0_0_10px_white]"
                initial={{ left: "0%", opacity: 0 }}
                animate={{ left: "100%", opacity: [0, 1, 0] }}
                transition={{ 
                    duration: 2, 
                    repeat: Infinity, 
                    ease: "linear",
                    delay: delay 
                }}
            />
        </div>
        
        {/* Label Badge */}
        <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: delay + 0.2 }}
            className="absolute top-1/2 -translate-y-1/2 bg-slate-950 border border-slate-700 px-2 py-1 rounded-full text-[8px] md:text-[10px] font-mono text-cyan-400/80 uppercase tracking-wider whitespace-nowrap z-20 shadow-lg"
        >
            {text}
        </motion.div>
    </div>
);