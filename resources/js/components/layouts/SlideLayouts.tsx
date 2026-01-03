import React from "react";
import { motion } from "framer-motion";
import { SlideData } from "@/types/presentation";
import { GlassCard } from "@/Components/ui/PresentationPrimitives";
// ADDED: FileCode, ArrowUpRight, Download
import { ArrowRight, Server, Atom, Smartphone, FileCode, ArrowUpRight, Download } from "lucide-react";

import { CodeBlockHighlighter } from "@/Components/ui/CodeBlockHighlighter";
import { EntanglementGraph } from "@/Components/visualizations/EntanglementGraph";
import { WorkflowPipeline } from "@/Components/visualizations/WorkflowPipeline";
import { EnergyLandscape } from "@/Components/visualizations/EnergyLandscape";
import { SystemArchitecture } from "@/Components/visualizations/SystemArchitecture";
import { MobileAppMockup } from "@/Components/visualizations/MobileAppMockup";
import { QuboMatrix } from "@/Components/visualizations/QuboMatrix";

// --- LAYOUTS ---

export const SplitLayout = ({ slide }: { slide: SlideData }) => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 h-full items-center min-h-0 pt-4 pb-8">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="min-h-0">
            {slide.left}
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="h-full flex items-center justify-center min-h-0">
            {slide.right}
        </motion.div>
    </div>
);

export const GridLayout = ({ slide }: { slide: SlideData }) => (
    <div className="h-full flex flex-col justify-start md:justify-center min-h-0 pt-8 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 w-full">
            {slide.items?.map((item, i) => (
                <GlassCard key={i} className="flex flex-col gap-4">
                    <div className="p-3 bg-white/5 rounded-lg w-fit border border-white/10">{item.icon}</div>
                    <div>
                        <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                        <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                    </div>
                    {item.footer && (
                        <div className="mt-auto pt-4 border-t border-white/5 text-xs text-slate-500 font-mono">
                            {item.footer}
                        </div>
                    )}
                </GlassCard>
            ))}
        </div>
    </div>
);

export const HeroLayout = ({ slide }: { slide: SlideData }) => (
    <div className="w-full h-full flex items-center justify-center min-h-0">
        {slide.content}
    </div>
);

export const TerminalLayout = ({ slide }: { slide: SlideData }) => (
    <div className="w-full max-w-5xl mx-auto h-full max-h-[65vh] flex flex-col min-h-0 mt-4 md:mt-8">
        {slide.content}
    </div>
);

export const ArchitectureLayout = () => (
    <div className="w-full h-full flex items-center justify-center min-h-0 pt-8 pb-8">
        <div className="flex flex-col md:flex-row gap-4 items-stretch relative h-fit w-full justify-center">
            <GlassCard className="w-full md:w-64 flex flex-col items-center text-center gap-4 z-10 border-blue-500/30">
                <div className="p-3 rounded-full bg-blue-500/20 text-blue-400"><Server/></div>
                <h3 className="font-bold text-blue-200">Classical Server</h3>
                <div className="text-xs text-slate-400 space-y-2 w-full">
                    <div className="p-2 bg-black/20 rounded">Inputs</div>
                    <ArrowRight className="w-4 h-4 mx-auto rotate-90 text-slate-600"/>
                    <div className="p-2 bg-black/20 rounded">Distance Matrix</div>
                </div>
            </GlassCard>
            
            <GlassCard className="w-full md:w-72 flex flex-col items-center text-center gap-4 z-10 border-purple-500/30 bg-purple-900/10">
                <div className="p-3 rounded-full bg-purple-500/20 text-purple-400"><Atom/></div>
                <h3 className="font-bold text-purple-200">Hybrid VQE Loop</h3>
                <div className="w-full p-3 bg-black/40 rounded-xl border border-dashed border-purple-500/30">
                    <span className="text-[10px] text-purple-400 uppercase tracking-widest block mb-2">Optimization</span>
                    <div className="flex justify-between items-center text-xs text-slate-400">
                        <span>Circuit</span>
                        <div className="w-20 h-[1px] bg-slate-600"/>
                        <span>Optimizer</span>
                    </div>
                </div>
            </GlassCard>

            <GlassCard className="w-full md:w-64 flex flex-col items-center text-center gap-4 z-10 border-emerald-500/30">
                <div className="p-3 rounded-full bg-emerald-500/20 text-emerald-400"><Smartphone/></div>
                <h3 className="font-bold text-emerald-200">Client App</h3>
                <div className="text-xs text-slate-400 space-y-2 w-full">
                    <div className="p-2 bg-emerald-900/20 rounded border border-emerald-500/20 text-emerald-400 font-mono">
                        Route Found
                    </div>
                </div>
            </GlassCard>
        </div>
    </div>
);

export const CodeLayout = ({ slide }: { slide: SlideData }) => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full items-center min-h-0 pt-4 pb-8">
        <div className="order-2 lg:order-1 h-full max-h-[60vh] lg:max-h-[70vh] shadow-2xl overflow-hidden rounded-xl border border-white/10 bg-[#0d1117]">
             {slide.codeSnippet && (
                <CodeBlockHighlighter 
                    code={slide.codeSnippet} 
                    highlightLines={slide.highlightLines} 
                />
             )}
        </div>
        <div className="order-1 lg:order-2 space-y-6">
            <h3 className="text-3xl font-bold text-white mb-6 border-l-4 border-purple-500 pl-4">
                Implementation Logic
            </h3>
            <div className="space-y-4">
                {slide.items?.map((item, i) => (
                    <motion.div 
                        key={i}
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="p-5 rounded-xl bg-slate-800/80 border border-white/10 shadow-lg hover:border-purple-500/50 transition-colors"
                    >
                        <h4 className="font-bold text-purple-300 text-lg mb-2">{item.title}</h4>
                        <p className="text-slate-300 text-sm leading-relaxed">{item.desc}</p>
                    </motion.div>
                ))}
            </div>
        </div>
    </div>
);

export const GraphLayout = ({ slide }: { slide: SlideData }) => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 h-full items-center min-h-0 pt-4">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="min-h-0">
             {slide.left}
        </motion.div>
        <div className="h-full flex items-center justify-center p-8 bg-slate-900/30 rounded-3xl border border-white/5 relative overflow-hidden min-h-0">
             <EntanglementGraph />
        </div>
    </div>
);

export const PipelineLayout = ({ slide }: { slide: SlideData }) => (
    <div className="flex flex-col items-center justify-start h-full gap-8 min-h-0 pt-8 pb-8 overflow-y-auto lg:overflow-visible">
        <div className="w-full max-w-7xl shrink-0">
            <WorkflowPipeline />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl shrink-0">
             {slide.items?.map((item, i) => (
                 <div key={i} className="p-6 bg-slate-800/50 border border-white/10 rounded-xl">
                     <h4 className="font-bold text-purple-300 mb-2 text-lg">{item.title}</h4>
                     <p className="text-sm text-slate-300">{item.desc}</p>
                 </div>
             ))}
        </div>
    </div>
);

export const LandscapeLayout = ({ slide }: { slide: SlideData }) => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 h-full items-center min-h-0 pt-4 pb-8">
        <div className="order-2 lg:order-1 space-y-6">
             {slide.left}
        </div>
        <div className="order-1 lg:order-2 h-full flex items-center justify-center p-4 min-h-0">
             <EnergyLandscape />
        </div>
    </div>
);

export const SystemLayout = ({ slide }: { slide: SlideData }) => (
    <div className="flex flex-col items-center justify-start h-full gap-8 min-h-0 pt-8 pb-8 overflow-y-auto lg:overflow-visible">
        <div className="w-full flex-1 min-h-[300px] max-h-[500px] shrink-0">
            <SystemArchitecture />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl shrink-0">
             {slide.items?.map((item, i) => (
                 <div key={i} className="text-center p-4 bg-white/5 rounded-xl border border-white/10">
                     <h4 className="font-bold text-white mb-1">{item.title}</h4>
                     <p className="text-xs text-slate-400">{item.desc}</p>
                 </div>
             ))}
        </div>
    </div>
);

export const MobileLayout = ({ slide }: { slide: SlideData }) => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 h-full items-start lg:items-center min-h-0 pt-12 pb-8">
        <div className="order-2 lg:order-1 h-full flex items-start justify-center min-h-0 relative">
             <div className="transform scale-[0.7] md:scale-[0.8] lg:scale-[0.85] origin-top">
                <MobileAppMockup />
             </div>
        </div>
        <div className="order-1 lg:order-2 space-y-6 z-10 pt-4 lg:pt-0">
             {slide.right}
        </div>
    </div>
);

export const MatrixLayout = ({ slide }: { slide: SlideData }) => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 h-full items-center min-h-0 pt-4 pb-8">
        <div className="order-1 space-y-6">
             {slide.left}
        </div>
        <div className="order-2 h-full flex items-center justify-center min-h-0">
             <QuboMatrix />
        </div>
    </div>
);

// NEW: VS Code Launcher Layout
export const NotebookLayout = ({ slide }: { slide: SlideData }) => {
    // We attempt to construct a VS Code URI. 
    // NOTE: This requires the 'absolutePath' field in your slides.tsx
    const vscodeUrl = slide.absolutePath ? `vscode://file/${slide.absolutePath}` : null;

    return (
        <div className="w-full h-full flex flex-col items-center justify-center min-h-0">
            <div className="relative p-12 bg-[#007ACC]/10 border border-[#007ACC]/30 rounded-3xl backdrop-blur-xl flex flex-col items-center gap-8 shadow-[0_0_50px_rgba(0,122,204,0.2)] max-w-lg text-center group hover:bg-[#007ACC]/20 transition-all">
                
                {/* VS Code Icon/Visual */}
                <div className="w-24 h-24 bg-[#007ACC] rounded-2xl flex items-center justify-center shadow-2xl transform group-hover:scale-110 transition-transform duration-300">
                    <img 
                        src="https://upload.wikimedia.org/wikipedia/commons/9/9a/Visual_Studio_Code_1.35_icon.svg" 
                        alt="VS Code" 
                        className="w-16 h-16 drop-shadow-md"
                    />
                </div>

                <div className="space-y-2">
                    <h3 className="text-3xl font-bold text-white">Live Notebook</h3>
                    <p className="text-blue-200 text-sm font-mono bg-black/20 px-3 py-1 rounded-lg inline-block border border-blue-400/20">
                        {slide.notebookPath?.split('/').pop()}
                    </p>
                </div>

                <div className="flex flex-col gap-3 w-full">
                    {/* Primary Button: Open in VS Code */}
                    {vscodeUrl ? (
                        <a href={vscodeUrl} className="w-full">
                            <button className="w-full h-14 bg-[#007ACC] hover:bg-[#0063a5] text-white rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-2 transition-all transform active:scale-95">
                                <FileCode className="w-5 h-5" />
                                Launch VS Code
                            </button>
                        </a>
                    ) : (
                        <div className="text-xs text-red-400 bg-red-900/20 p-2 rounded">
                            Missing absolutePath in slides.tsx
                        </div>
                    )}

                    {/* Fallback: Standard Download */}
                    <a href={slide.notebookPath} download className="w-full">
                        <button className="w-full h-12 bg-transparent hover:bg-white/5 text-slate-400 hover:text-white border border-white/10 rounded-xl font-medium text-sm transition-colors flex items-center justify-center gap-2">
                            <Download className="w-4 h-4" />
                            Download File
                        </button>
                    </a>
                </div>
            </div>
        </div>
    );  
};