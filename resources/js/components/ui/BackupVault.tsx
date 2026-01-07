import React from "react";
import { Archive, X, ArrowRight, FileText, Lock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Import the data directly
import { vaultedSlides } from "@/data/vaultedSlides";

interface BackupVaultProps {
    isOpen: boolean;
    onClose: () => void;
    onJumpTo: (slideId: string) => void;
}

export const BackupVault = ({ isOpen, onClose, onJumpTo }: BackupVaultProps) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-end justify-center pointer-events-none">
                    {/* Dark Backdrop */}
                    <motion.div 
                        className="absolute inset-0 bg-black/80 backdrop-blur-md pointer-events-auto"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={onClose}
                    />

                    {/* The Vault Drawer */}
                    <motion.div 
                        className="relative w-full max-w-7xl bg-[#0f172a] border-t border-x border-slate-700 rounded-t-3xl shadow-2xl p-8 pointer-events-auto h-[60vh] flex flex-col"
                        initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
                        transition={{ type: "spring", damping: 30, stiffness: 300 }}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/5 shrink-0">
                            <div className="flex items-center gap-5">
                                <div className="p-4 bg-purple-500/10 rounded-2xl text-purple-400 border border-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.15)]">
                                    <Archive className="w-8 h-8" />
                                </div>
                                <div>
                                    <h3 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
                                        Appendix Vault
                                        <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-400 border border-slate-700 uppercase tracking-wider font-mono">
                                            Restricted Access
                                        </span>
                                    </h3>
                                    <p className="text-base text-slate-400 mt-1">Supplementary technical material and deep-dive schematics.</p>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-6">
                                <div className="text-right hidden md:block">
                                    <div className="text-xs font-mono text-slate-500 uppercase tracking-widest">Vault Status</div>
                                    <div className="text-green-500 font-bold flex items-center gap-2 justify-end">
                                        <Lock className="w-3 h-3" /> UNLOCKED
                                    </div>
                                </div>
                                <button 
                                    onClick={onClose} 
                                    className="p-3 hover:bg-white/10 rounded-full transition-colors text-slate-400 hover:text-white border border-transparent hover:border-white/10"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                        </div>

                        {/* Grid of Backup Slides (Scrollable) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 overflow-y-auto pr-2 pb-4 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
                            {vaultedSlides.map((slide) => (
                                <button
                                    key={slide.id}
                                    onClick={() => { onJumpTo(slide.id); onClose(); }}
                                    className="group relative flex flex-col items-start p-6 bg-slate-800/40 border border-slate-700 rounded-xl hover:bg-slate-800 hover:border-purple-500/50 transition-all text-left overflow-hidden min-h-[180px]"
                                >
                                    {/* Hover Glow Effect */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                    <div className="relative z-10 w-full flex flex-col h-full">
                                        <div className="flex justify-between items-start mb-4">
                                            <span className="text-[10px] font-bold uppercase tracking-wider text-purple-300 bg-purple-500/10 px-2 py-1 rounded border border-purple-500/20">
                                                {slide.category}
                                            </span>
                                            <FileText className="w-5 h-5 text-slate-600 group-hover:text-purple-400 transition-colors" />
                                        </div>
                                        
                                        <span className="block text-lg font-bold text-slate-200 group-hover:text-white leading-tight mb-2">
                                            {slide.title}
                                        </span>
                                        <span className="block text-sm text-slate-500 line-clamp-2 leading-relaxed">
                                            {slide.subtitle}
                                        </span>
                                        
                                        <div className="mt-auto pt-6 flex items-center gap-2 text-xs font-bold text-slate-500 group-hover:text-purple-300 transition-colors uppercase tracking-widest">
                                            Deploy Slide <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};