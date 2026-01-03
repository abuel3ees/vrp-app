import React, { useState, useRef } from "react";
import { motion } from "framer-motion";

interface XRayLensProps {
  baseContent: React.ReactNode;   // What is normally seen (e.g., Math Equation)
  revealContent: React.ReactNode; // What is hidden (e.g., Python Code)
  label?: string;
}

export const XRayLens = ({ baseContent, revealContent, label = "SOURCE_CODE" }: XRayLensProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  const maskSize = 200; // Size of the reveal circle

  return (
    <div 
        ref={ref}
        className="relative w-full h-full min-h-[300px] group overflow-hidden rounded-xl cursor-crosshair"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
    >
        {/* 1. Base Layer (The Math/Theory) */}
        <div className="w-full h-full relative z-10 bg-slate-900/50 p-8 border border-white/10 rounded-xl backdrop-blur-sm flex items-center justify-center transition-opacity duration-300">
            {baseContent}
            <div className="absolute bottom-4 right-4 text-xs text-slate-500 font-mono border border-slate-700 px-2 py-1 rounded opacity-50 group-hover:opacity-0 transition-opacity">
                HOVER TO INSPECT
            </div>
        </div>

        {/* 2. Reveal Layer (The Code) */}
        <div 
            className="absolute inset-0 z-20 bg-[#0d1117] p-8 rounded-xl border border-purple-500/50 pointer-events-none flex items-center justify-center"
            style={{
                // CSS Masking Magic
                maskImage: isHovering 
                    ? `radial-gradient(circle ${maskSize}px at ${mousePos.x}px ${mousePos.y}px, black 100%, transparent 100%)`
                    : "none",
                WebkitMaskImage: isHovering 
                    ? `radial-gradient(circle ${maskSize}px at ${mousePos.x}px ${mousePos.y}px, black 100%, transparent 100%)`
                    : "none",
                opacity: isHovering ? 1 : 0
            }}
        >
            {/* Grid Pattern Background */}
            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(#334155 1px, transparent 1px), linear-gradient(90deg, #334155 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
            
            {/* The Hidden Content */}
            <div className="relative z-10 w-full">
                <div className="absolute -top-6 -right-6 text-[10px] uppercase tracking-widest text-purple-500 font-bold border border-purple-500/30 px-2 py-0.5 rounded bg-purple-900/20">
                    {label}
                </div>
                {revealContent}
            </div>
        </div>

        {/* 3. The Lens Ring (Visual Border) */}
        {isHovering && (
            <motion.div
                className="absolute rounded-full border-[3px] border-purple-500/50 shadow-[0_0_50px_rgba(168,85,247,0.4)] pointer-events-none z-30"
                style={{ 
                    left: mousePos.x - maskSize/2, 
                    top: mousePos.y - maskSize/2,
                    width: maskSize,
                    height: maskSize
                }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
            />
        )}
    </div>
  );
};