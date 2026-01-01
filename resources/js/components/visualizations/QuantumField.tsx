import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, useMemo } from "react";

export const QuantumField = () => {
  // PERFORMANCE FIX: Use MotionValues instead of State to prevent re-renders
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth out the mouse movement (spring physics)
  const smoothX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const smoothY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  // Map mouse position to light position (centered)
  const lightX = useTransform(smoothX, (x) => x - 400);
  const lightY = useTransform(smoothY, (y) => y - 400);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Directly update the motion value, bypassing React render cycle
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // OPTIMIZATION: Memoize particles and reduce count (60 -> 25)
  const particles = useMemo(() => Array.from({ length: 25 }).map(() => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2 + 1, // Smaller particles are faster to paint
    duration: Math.random() * 20 + 10,
    delay: Math.random() * 5
  })), []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 bg-slate-950 transform-gpu">
      {/* Static Background Layer */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(56,189,248,0.03),transparent_70%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.03)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_100%)]" />

      {/* Hardware Accelerated Mouse Light */}
      <motion.div 
        className="absolute w-[800px] h-[800px] bg-purple-600/5 rounded-full blur-[100px] mix-blend-screen will-change-transform"
        style={{ x: lightX, y: lightY }} 
      />

      {/* Optimized Particles */}
      {particles.map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-white/10 will-change-transform"
          initial={{ left: `${p.x}%`, top: `${p.y}%`, opacity: 0 }}
          animate={{
            y: [0, -100],
            opacity: [0, 0.5, 0],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "linear",
            times: [0, 0.5, 1] // Simple linear interpolation
          }}
          style={{ width: p.size, height: p.size }}
        />
      ))}
    </div>
  );
};