import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, ArrowDown, Database, Calculator, Binary, Zap, Map } from "lucide-react";

export const WorkflowPipeline = () => {
    const steps = [
        { title: "User Input", icon: <Database className="w-5 h-5"/>, sub: "Stop Coordinates", type: "classical" },
        { title: "Distance Matrix", icon: <Calculator className="w-5 h-5"/>, sub: "Compute Costs", type: "classical" },
        { title: "QUBO Form", icon: <Binary className="w-5 h-5"/>, sub: "Binary Optim.", type: "classical" },
        { title: "Hamiltonian", icon: <Zap className="w-5 h-5"/>, sub: "Ising Map", type: "bridge" },
        { title: "QAOA Loop", icon: <AtomIcon />, sub: "Quantum Optim.", type: "quantum" },
        { title: "Decoding", icon: <Map className="w-5 h-5"/>, sub: "Route Result", type: "classical" },
    ];

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.15 }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <div className="w-full p-6 bg-slate-950/50 rounded-3xl border border-white/5 backdrop-blur-sm relative overflow-hidden">
            {/* Background Gradient */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 opacity-30" />
            
            <motion.div 
                variants={container}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 relative z-10"
            >
                {steps.map((step, i) => {
                    const isQuantum = step.type === "quantum";
                    const isBridge = step.type === "bridge";
                    
                    return (
                        <div key={i} className="relative flex flex-col items-center">
                            <motion.div 
                                variants={item}
                                className={`
                                    relative w-full p-4 rounded-xl border flex flex-col items-center text-center gap-3 transition-all duration-300 group
                                    ${isQuantum 
                                        ? "bg-purple-900/20 border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.2)]" 
                                        : isBridge 
                                            ? "bg-slate-900/80 border-indigo-500/30"
                                            : "bg-slate-900/60 border-white/10 hover:border-white/20"
                                    }
                                `}
                            >
                                {/* Step Number Badge */}
                                <div className="absolute top-2 right-2 text-[9px] font-mono text-slate-600 font-bold">
                                    {(i + 1).toString().padStart(2, '0')}
                                </div>

                                {/* Icon */}
                                <div className={`
                                    p-3 rounded-full mb-1 transition-transform group-hover:scale-110 duration-300
                                    ${isQuantum ? "bg-purple-500 text-white" : "bg-slate-800 text-slate-400 group-hover:text-cyan-400 group-hover:bg-slate-700"}
                                `}>
                                    {step.icon}
                                </div>

                                {/* Text */}
                                <div>
                                    <div className={`text-sm font-bold ${isQuantum ? "text-purple-200" : "text-slate-200"}`}>
                                        {step.title}
                                    </div>
                                    <div className="text-[10px] text-slate-500 font-mono mt-1 uppercase tracking-wider">
                                        {step.sub}
                                    </div>
                                </div>

                                {/* Status Dot */}
                                <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-16 h-[1px] bg-gradient-to-r from-transparent via-${isQuantum ? 'purple' : 'cyan'}-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity`} />
                            </motion.div>

                            {/* Responsive Connector Arrow */}
                            {i < steps.length - 1 && (
                                <div className="flex items-center justify-center text-slate-700 my-2 lg:my-0 lg:absolute lg:-right-3 lg:top-1/2 lg:-translate-y-1/2 z-20">
                                    {/* Rotate arrow based on screen size: Down on mobile, Right on Desktop */}
                                    <ArrowRight className="hidden lg:block w-5 h-5" />
                                    <ArrowDown className="block lg:hidden w-5 h-5" />
                                </div>
                            )}
                        </div>
                    );
                })}
            </motion.div>
        </div>
    );
};

const AtomIcon = () => (
    <div className="animate-[spin_10s_linear_infinite]">
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="2" className="fill-current" />
            <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(0 12 12)" className="opacity-50" />
            <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)" className="opacity-50" />
            <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)" className="opacity-50" />
        </svg>
    </div>
);