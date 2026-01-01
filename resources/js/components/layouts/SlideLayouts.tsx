import React from "react";
import { motion } from "framer-motion";
import { SlideData } from "@/types/presentation";
import { GlassCard } from "@/Components/ui/PresentationPrimitives";
import { ArrowRight, Server, Atom, Smartphone } from "lucide-react";

// Visualization Imports
import { CodeBlockHighlighter } from "@/Components/ui/CodeBlockHighlighter";
import { EntanglementGraph } from "@/Components/visualizations/EntanglementGraph";
import { WorkflowPipeline } from "@/Components/visualizations/WorkflowPipeline";
import { EnergyLandscape } from "@/Components/visualizations/EnergyLandscape";

// Layout 1: Split Screen
export const SplitLayout = ({ slide }: { slide: SlideData }) => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 h-full items-center">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            {slide.left}
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }} className="h-full">
            {slide.right}
        </motion.div>
    </div>
);

// Layout 2: Grid of Cards
export const GridLayout = ({ slide }: { slide: SlideData }) => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
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
);

// Layout 3: Hero
export const HeroLayout = ({ slide }: { slide: SlideData }) => (
    <div className="w-full h-full flex items-center justify-center">
        {slide.content}
    </div>
);

// Layout 4: Terminal Simulation
export const TerminalLayout = ({ slide }: { slide: SlideData }) => (
    <div className="w-full max-w-4xl mx-auto h-[60vh] mt-8">
        {slide.content}
    </div>
);

// Layout 5: Architecture Flow
export const ArchitectureLayout = () => (
    <div className="w-full h-full flex items-center justify-center">
        <div className="flex flex-col md:flex-row gap-4 items-stretch relative">
            <GlassCard className="w-64 flex flex-col items-center text-center gap-4 z-10 border-blue-500/30">
                <div className="p-3 rounded-full bg-blue-500/20 text-blue-400"><Server/></div>
                <h3 className="font-bold text-blue-200">Classical Server</h3>
                <div className="text-xs text-slate-400 space-y-2 w-full">
                    <div className="p-2 bg-black/20 rounded">Inputs</div>
                    <ArrowRight className="w-4 h-4 mx-auto rotate-90 text-slate-600"/>
                    <div className="p-2 bg-black/20 rounded">Distance Matrix</div>
                </div>
            </GlassCard>
            
            <GlassCard className="w-72 flex flex-col items-center text-center gap-4 z-10 border-purple-500/30 bg-purple-900/10">
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

            <GlassCard className="w-64 flex flex-col items-center text-center gap-4 z-10 border-emerald-500/30">
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

// Layout 6: Code Layout
export const CodeLayout = ({ slide }: { slide: SlideData }) => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full items-center">
        <div className="order-2 lg:order-1 h-full max-h-[60vh]">
             {slide.codeSnippet && <CodeBlockHighlighter code={slide.codeSnippet} />}
        </div>
        <div className="order-1 lg:order-2 space-y-6">
            <h3 className="text-2xl font-bold text-white mb-4">Implementation Details</h3>
            {slide.items?.map((item, i) => (
                <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="p-4 rounded-xl bg-white/5 border border-white/10"
                >
                    <h4 className="font-bold text-purple-300 text-sm mb-1">{item.title}</h4>
                    <p className="text-slate-400 text-xs">{item.desc}</p>
                </motion.div>
            ))}
        </div>
    </div>
);

// Layout 7: Graph Layout
export const GraphLayout = ({ slide }: { slide: SlideData }) => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 h-full items-center">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
             {slide.left}
        </motion.div>
        <div className="h-full flex items-center justify-center p-8 bg-slate-900/30 rounded-3xl border border-white/5 relative overflow-hidden">
             <EntanglementGraph />
        </div>
    </div>
);

// Layout 8: Pipeline Layout
export const PipelineLayout = ({ slide }: { slide: SlideData }) => (
    <div className="flex flex-col items-center justify-center h-full gap-12">
        <div className="w-full max-w-5xl">
            <WorkflowPipeline />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
             {slide.items?.map((item, i) => (
                 <GlassCard key={i}>
                     <h4 className="font-bold text-purple-300 mb-2">{item.title}</h4>
                     <p className="text-sm text-slate-400">{item.desc}</p>
                 </GlassCard>
             ))}
        </div>
    </div>
);

// Layout 9: Landscape Layout
export const LandscapeLayout = ({ slide }: { slide: SlideData }) => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 h-full items-center">
        <div className="order-2 lg:order-1 space-y-6">
             {slide.left}
        </div>
        <div className="order-1 lg:order-2 h-full flex items-center justify-center">
             <EnergyLandscape />
        </div>
    </div>
);