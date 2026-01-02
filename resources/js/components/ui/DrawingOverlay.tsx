import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Eraser, PenTool, X } from "lucide-react";

interface Point { x: number; y: number }
interface Stroke { points: Point[]; color: string }

export const DrawingOverlay = ({ active, onClose }: { active: boolean; onClose: () => void }) => {
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [currentStroke, setCurrentStroke] = useState<Point[]>([]);
  const [color, setColor] = useState("#22d3ee"); // Default Cyan
  const isDrawing = useRef(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        if (!active) return;
        if (e.key === "Escape") onClose();
        if (e.key === "z" && (e.metaKey || e.ctrlKey)) {
            setStrokes(prev => prev.slice(0, -1)); // Undo
        }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [active, onClose]);

  if (!active) return null;

  const handleMouseDown = (e: React.MouseEvent) => {
    isDrawing.current = true;
    setCurrentStroke([{ x: e.clientX, y: e.clientY }]);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDrawing.current) return;
    setCurrentStroke(prev => [...prev, { x: e.clientX, y: e.clientY }]);
  };

  const handleMouseUp = () => {
    if (!isDrawing.current) return;
    isDrawing.current = false;
    if (currentStroke.length > 0) {
      setStrokes(prev => [...prev, { points: currentStroke, color }]);
      setCurrentStroke([]);
    }
  };

  // Convert points to SVG path
  const getPath = (points: Point[]) => {
    if (points.length === 0) return "";
    const d = points.map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`)).join(" ");
    return d;
  };

  return (
    <div 
        className="fixed inset-0 z-[9000] cursor-crosshair touch-none"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
    >
      <svg className="absolute inset-0 w-full h-full pointer-events-none drop-shadow-[0_0_8px_rgba(0,0,0,0.5)]">
        {strokes.map((stroke, i) => (
          <path
            key={i}
            d={getPath(stroke.points)}
            stroke={stroke.color}
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ))}
        {currentStroke.length > 0 && (
          <path
            d={getPath(currentStroke)}
            stroke={color}
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}
      </svg>

      {/* Drawing Toolbar */}
      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-slate-900/90 border border-white/10 p-2 rounded-full flex gap-2 pointer-events-auto backdrop-blur shadow-2xl"
      >
        <button onClick={() => setColor("#22d3ee")} className={`w-8 h-8 rounded-full bg-cyan-400 border-2 ${color === "#22d3ee" ? "border-white" : "border-transparent"}`} />
        <button onClick={() => setColor("#a855f7")} className={`w-8 h-8 rounded-full bg-purple-500 border-2 ${color === "#a855f7" ? "border-white" : "border-transparent"}`} />
        <button onClick={() => setColor("#ef4444")} className={`w-8 h-8 rounded-full bg-red-500 border-2 ${color === "#ef4444" ? "border-white" : "border-transparent"}`} />
        <button onClick={() => setColor("#eab308")} className={`w-8 h-8 rounded-full bg-yellow-500 border-2 ${color === "#eab308" ? "border-white" : "border-transparent"}`} />
        
        <div className="w-[1px] h-8 bg-white/20 mx-1" />
        
        <button onClick={() => setStrokes([])} className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-white/10" title="Clear All">
            <Eraser className="w-5 h-5" />
        </button>
        <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-white/10" title="Exit Drawing Mode">
            <X className="w-5 h-5" />
        </button>
      </motion.div>
    </div>
  );
};