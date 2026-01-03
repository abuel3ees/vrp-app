import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export const MagneticButton = ({ href, children }: { href: string, children: React.ReactNode }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current?.getBoundingClientRect()!;
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    
    // Calculate distance from center
    const x = (clientX - centerX) * 0.3; // 0.3 = Magnetic strength
    const y = (clientY - centerY) * 0.3;
    
    setPosition({ x, y });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <a href={href} target="_blank">
        <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            animate={{ x: position.x, y: position.y }}
            transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
            className="group relative flex items-center justify-center px-8 py-4 bg-white text-slate-950 font-bold rounded-full cursor-pointer overflow-hidden shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_40px_rgba(255,255,255,0.5)] transition-shadow"
        >
            {/* Hover Fill Effect */}
            <div className="absolute inset-0 bg-slate-200 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
            
            <span className="relative z-10 flex items-center gap-2">
                {children} <ArrowRight className="w-4 h-4" />
            </span>
        </motion.div>
    </a>
  );
};