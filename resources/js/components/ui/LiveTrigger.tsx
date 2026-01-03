import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Loader2, CheckCircle2, Zap } from "lucide-react";
import { useSoundEffects } from "@/hooks/useSoundEffects";

export const LiveTrigger = () => {
  const [status, setStatus] = useState<"idle" | "connecting" | "optimizing" | "ready">("idle");
  const { playSuccess, playClick } = useSoundEffects();

  const handleLaunch = () => {
    playClick();
    setStatus("connecting");
    
    // Simulate Sequence
    setTimeout(() => setStatus("optimizing"), 1500);
    setTimeout(() => {
        setStatus("ready");
        playSuccess();
    }, 3500);
  };

  return (
    <div className="relative group">
        {/* Glow Effect */}
        <div className={`absolute -inset-1 bg-gradient-to-r from-purple-600 to-cyan-500 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200 ${status !== 'idle' ? 'opacity-50' : ''}`}></div>
        
        <button 
            onClick={status === "idle" ? handleLaunch : undefined}
            disabled={status !== "idle" && status !== "ready"}
            className="relative w-64 h-16 bg-slate-900 ring-1 ring-white/10 rounded-lg flex items-center justify-center overflow-hidden"
        >
            {/* Background Progress */}
            {status === "optimizing" && (
                <motion.div 
                    className="absolute inset-0 bg-purple-600/20"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 2 }}
                />
            )}

            {/* IDLE STATE */}
            {status === "idle" && (
                <div className="flex items-center gap-2 text-white font-bold tracking-wider">
                    <Zap className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    INITIATE DEMO
                </div>
            )}

            {/* CONNECTING STATE */}
            {status === "connecting" && (
                <div className="flex items-center gap-2 text-cyan-400 font-mono text-sm">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    CONNECTING TO QPU...
                </div>
            )}

            {/* OPTIMIZING STATE */}
            {status === "optimizing" && (
                <div className="flex items-center gap-2 text-purple-400 font-mono text-sm">
                    <AtomIcon />
                    ANNEALING...
                </div>
            )}

            {/* READY STATE */}
            {status === "ready" && (
                <a href="/admin/optimize" target="_blank" className="absolute inset-0 flex items-center justify-center bg-green-500 text-slate-900 font-bold gap-2 animate-in fade-in">
                    LAUNCH DASHBOARD <ArrowRight className="w-5 h-5"/>
                </a>
            )}
        </button>
    </div>
  );
};

const AtomIcon = () => (
    <div className="w-4 h-4 relative animate-spin-slow">
        <div className="absolute inset-0 border border-current rounded-full rotate-45"></div>
        <div className="absolute inset-0 border border-current rounded-full -rotate-45"></div>
    </div>
);