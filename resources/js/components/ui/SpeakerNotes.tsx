import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic2, X } from "lucide-react";

export const SpeakerNotes = ({ isOpen, notes, onClose }: { isOpen: boolean, notes?: string, onClose: () => void }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: "100%", opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: "100%", opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="fixed top-20 right-8 w-80 bg-black/90 border border-white/20 rounded-xl p-6 shadow-2xl z-[9999] backdrop-blur-md"
        >
          <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-2">
            <h3 className="text-sm font-bold text-yellow-400 flex items-center gap-2">
                <Mic2 className="w-4 h-4" /> Speaker Notes
            </h3>
            <button onClick={onClose} className="text-slate-500 hover:text-white"><X className="w-4 h-4"/></button>
          </div>
          <div className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap font-mono">
            {notes || "No notes for this slide."}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};