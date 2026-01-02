import React, { useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export const SpotlightOverlay = ({ active }: { active: boolean }) => {
  const x = useMotionValue(window.innerWidth / 2);
  const y = useMotionValue(window.innerHeight / 2);
  
  const smoothX = useSpring(x, { stiffness: 300, damping: 30 });
  const smoothY = useSpring(y, { stiffness: 300, damping: 30 });

  useEffect(() => {
    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  if (!active) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[8000] pointer-events-none mix-blend-hard-light"
      style={{
        background: "radial-gradient(circle 150px at var(--x) var(--y), transparent 0%, rgba(0,0,0,0.95) 100%)",
      }}
    >
        {/* We use a CSS variable hack to pass motion values to the gradient */}
        <motion.div 
            className="w-full h-full"
            style={{ 
                //@ts-ignore
                "--x": smoothX, 
                "--y": smoothY 
            }} 
        />
    </motion.div>
  );
};