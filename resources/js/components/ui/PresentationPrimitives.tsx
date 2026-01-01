import { motion } from "framer-motion";
import { cn } from "@/lib/utils"; // Assuming you have a standard class merger
import React from "react";

export const GlassCard = ({ children, className, hover = true }: { children: React.ReactNode, className?: string, hover?: boolean }) => (
    <motion.div 
        whileHover={hover ? { y: -5, boxShadow: "0 20px 40px -10px rgba(168,85,247,0.15)" } : {}}
        className={cn(
            "rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-md shadow-2xl p-6",
            className
        )}
    >
        {children}
    </motion.div>
);

export const SectionBadge = ({ text }: { text: string }) => (
    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-[10px] font-mono tracking-widest uppercase text-slate-400 mb-4">
        <div className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
        {text}
    </div>
);

export const GlitchText = ({ text }: { text: string }) => (
    <div className="relative group inline-block">
        <span className="relative z-10">{text}</span>
        <span className="absolute top-0 left-0 -z-10 w-full h-full text-red-500 opacity-0 group-hover:opacity-70 group-hover:translate-x-[2px] transition-all duration-75 animate-pulse">{text}</span>
        <span className="absolute top-0 left-0 -z-10 w-full h-full text-blue-500 opacity-0 group-hover:opacity-70 group-hover:-translate-x-[2px] transition-all duration-75 delay-75">{text}</span>
    </div>
);