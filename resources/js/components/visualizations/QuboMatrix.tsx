import { motion } from "framer-motion";
import React from "react";

export const QuboMatrix = () => {
  const size = 5;
  return (
    <div className="grid grid-cols-5 gap-1 p-4 bg-slate-900 rounded-lg border border-white/10 w-fit mx-auto shadow-2xl">
      {Array.from({ length: size * size }).map((_, i) => {
        const row = Math.floor(i / size);
        const col = i % size;
        const isDiagonal = row === col;
        
        return (
          <motion.div
            key={i}
            className={`w-12 h-12 flex items-center justify-center text-xs font-mono rounded ${
                isDiagonal ? 'bg-purple-500/20 text-purple-300 border border-purple-500/50' : 'bg-slate-800 text-slate-500'
            }`}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.02 }}
            whileHover={{ scale: 1.1, backgroundColor: "#22d3ee", color: "#000" }}
          >
            {isDiagonal ? 'Qii' : `q${row}${col}`}
          </motion.div>
        );
      })}
    </div>
  );
};