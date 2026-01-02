import { motion, useMotionValue, useSpring } from "framer-motion";
import React, { useEffect } from "react";

export const LaserPointer = ({ active }: { active: boolean }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const smoothX = useSpring(x, { stiffness: 500, damping: 28 });
  const smoothY = useSpring(y, { stiffness: 500, damping: 28 });

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
      className="fixed top-0 left-0 w-6 h-6 bg-red-500 rounded-full blur-[2px] z-[9999] pointer-events-none mix-blend-screen"
      style={{ x: smoothX, y: smoothY, translateX: "-50%", translateY: "-50%" }}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      exit={{ scale: 0 }}
    >
      <div className="absolute inset-0 bg-red-500 blur-lg opacity-50 scale-150" />
    </motion.div>
  );
};