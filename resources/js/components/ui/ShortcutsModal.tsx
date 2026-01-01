import { motion, AnimatePresence } from "framer-motion";
import { X, Keyboard } from "lucide-react";
import React from "react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const ShortcutsModal = ({ isOpen, onClose }: Props) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl z-[70] overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Keyboard className="w-5 h-5 text-purple-500" /> Keyboard Shortcuts
                </h3>
                <button onClick={onClose} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <ShortcutItem keys={['→', 'Space', 'Enter']} desc="Next Slide" />
                <ShortcutItem keys={['←']} desc="Previous Slide" />
                <ShortcutItem keys={['F']} desc="Toggle Fullscreen" />
                <ShortcutItem keys={['?']} desc="Toggle Help" />
              </div>
            </div>
            <div className="px-6 py-4 bg-slate-950/50 border-t border-slate-800 text-xs text-slate-500 text-center">
              Press <span className="text-white font-mono bg-slate-800 px-1 rounded">Esc</span> to close
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const ShortcutItem = ({ keys, desc }: { keys: string[], desc: string }) => (
  <div className="flex items-center justify-between group py-2 border-b border-slate-800 last:border-0">
    <span className="text-slate-300 font-medium">{desc}</span>
    <div className="flex gap-2">
      {keys.map((k, i) => (
        <kbd key={i} className="px-2 py-1 bg-slate-800 border border-slate-700 rounded text-xs font-mono text-slate-400 min-w-[24px] text-center shadow-sm">
          {k}
        </kbd>
      ))}
    </div>
  </div>
);