import React, { useEffect, useState } from "react";
import { Search, CornerDownLeft, Hash, ArrowRight } from "lucide-react";
import { SlideData } from "@/types/presentation";

interface CommandMenuProps {
  slides: SlideData[];
  isOpen: boolean;
  onClose: () => void;
  onSelect: (index: number) => void;
}

export const CommandMenu = ({ slides, isOpen, onClose, onSelect }: CommandMenuProps) => {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Filter slides
  const filtered = slides.map((s, i) => ({ ...s, originalIndex: i })).filter(s => 
    (s.title?.toLowerCase().includes(query.toLowerCase())) || 
    (s.category?.toLowerCase().includes(query.toLowerCase())) ||
    (s.id.toLowerCase().includes(query.toLowerCase()))
  );

  useEffect(() => {
    if (isOpen) {
        setQuery("");
        setSelectedIndex(0);
    }
  }, [isOpen]);

  // Keyboard navigation within the menu
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
        if (e.key === "ArrowDown") {
            setSelectedIndex(prev => (prev + 1) % filtered.length);
        } else if (e.key === "ArrowUp") {
            setSelectedIndex(prev => (prev - 1 + filtered.length) % filtered.length);
        } else if (e.key === "Enter") {
            if (filtered[selectedIndex]) {
                onSelect(filtered[selectedIndex].originalIndex);
                onClose();
            }
        }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, filtered, selectedIndex, onSelect, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[20vh] bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
        
        {/* Modal Window */}
        <div className="w-full max-w-xl bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden flex flex-col relative animate-in zoom-in-95 duration-200">
            
            {/* Search Input */}
            <div className="flex items-center gap-3 px-4 py-4 border-b border-white/5">
                <Search className="w-5 h-5 text-slate-400" />
                <input 
                    autoFocus
                    type="text"
                    placeholder="Search slides (e.g., 'Results', 'Math', 'Demo')..."
                    className="flex-1 bg-transparent border-none outline-none text-lg text-white placeholder:text-slate-500"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <div className="text-xs font-mono text-slate-500 border border-slate-700 px-2 py-1 rounded">ESC</div>
            </div>

            {/* Results List */}
            <div className="max-h-[300px] overflow-y-auto p-2 space-y-1">
                {filtered.length === 0 ? (
                    <div className="p-8 text-center text-slate-500">No slides found.</div>
                ) : (
                    filtered.map((slide, i) => (
                        <div 
                            key={slide.id}
                            onClick={() => { onSelect(slide.originalIndex); onClose(); }}
                            onMouseEnter={() => setSelectedIndex(i)}
                            className={`flex items-center gap-3 px-3 py-3 rounded-lg cursor-pointer transition-colors ${i === selectedIndex ? 'bg-purple-600/20' : 'hover:bg-white/5'}`}
                        >
                            <div className={`w-8 h-8 rounded flex items-center justify-center text-xs font-bold ${i === selectedIndex ? 'bg-purple-500 text-white' : 'bg-slate-800 text-slate-400'}`}>
                                {slide.originalIndex + 1}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className={`font-medium truncate ${i === selectedIndex ? 'text-purple-200' : 'text-slate-200'}`}>
                                    {slide.title || slide.id}
                                </div>
                                <div className="text-xs text-slate-500 flex items-center gap-2">
                                    <Hash className="w-3 h-3"/> {slide.category}
                                </div>
                            </div>
                            {i === selectedIndex && (
                                <CornerDownLeft className="w-4 h-4 text-purple-400" />
                            )}
                        </div>
                    ))
                )}
            </div>
            
            {/* Footer */}
            <div className="bg-slate-950/50 px-4 py-2 border-t border-white/5 text-[10px] text-slate-500 flex justify-between">
                <span>Navigate using arrows</span>
                <span className="flex items-center gap-1">Jump <ArrowRight className="w-3 h-3"/></span>
            </div>
        </div>

        {/* Backdrop Click to Close */}
        <div className="absolute inset-0 -z-10" onClick={onClose} />
    </div>
  );
};