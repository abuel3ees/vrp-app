import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SlideData } from "@/types/presentation";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  isOpen: boolean;
  slides: SlideData[];
  currentIndex: number;
  onSelect: (index: number) => void;
  onClose: () => void;
}

export const SlideOverview = ({ isOpen, slides, currentIndex, onSelect, onClose }: Props) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
          animate={{ opacity: 1, backdropFilter: "blur(20px)" }}
          exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
          className="fixed inset-0 z-[60] bg-slate-950/80 flex flex-col p-8"
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-8 shrink-0">
            <h2 className="text-2xl font-bold text-white tracking-tight">Slide Overview</h2>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors text-white">
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 overflow-y-auto pb-20 px-2 custom-scrollbar">
            {slides.map((slide, idx) => (
              <motion.button
                key={slide.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.03 }}
                onClick={() => onSelect(idx)}
                className={cn(
                  "aspect-video rounded-lg border-2 p-4 flex flex-col justify-end text-left transition-all relative overflow-hidden group",
                  idx === currentIndex 
                    ? "border-purple-500 bg-purple-500/10 shadow-[0_0_20px_rgba(168,85,247,0.3)]" 
                    : "border-white/10 bg-white/5 hover:border-white/30 hover:scale-[1.02]"
                )}
              >
                <div className="absolute top-2 left-3 text-xs font-mono text-slate-500">
                    {(idx + 1).toString().padStart(2, '0')}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-60" />
                <div className="relative z-10">
                    <div className="text-[10px] uppercase tracking-widest text-purple-400 mb-1">{slide.category}</div>
                    <div className="text-sm font-bold text-white leading-tight truncate w-full">
                        {slide.title || slide.id}
                    </div>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};