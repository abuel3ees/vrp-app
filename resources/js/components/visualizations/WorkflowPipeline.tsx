import { motion } from "framer-motion";
import { ArrowRight, Database, Calculator, Binary, Zap, Map } from "lucide-react";

export const WorkflowPipeline = () => {
    const steps = [
        { title: "User Input", icon: <Database className="w-4 h-4"/>, sub: "Stop Coordinates" },
        { title: "Distance Matrix", icon: <Calculator className="w-4 h-4"/>, sub: "Compute Costs" },
        { title: "QUBO", icon: <Binary className="w-4 h-4"/>, sub: "Formulation" },
        { title: "Hamiltonian", icon: <Zap className="w-4 h-4"/>, sub: "Ising Map" },
        { title: "QAOA", icon: <AtomIcon />, sub: "Optimize" },
        { title: "Result", icon: <Map className="w-4 h-4"/>, sub: "Route Indices" },
    ];

    return (
        <div className="flex flex-col gap-2 w-full">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {steps.map((step, i) => (
                    <motion.div 
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.2 }}
                        className="relative p-4 bg-white/5 border border-white/10 rounded-lg flex flex-col items-center text-center gap-2 group hover:bg-white/10 transition-colors"
                    >
                        <div className={`p-2 rounded-full ${i === 4 ? 'bg-purple-500/20 text-purple-400' : 'bg-slate-800 text-slate-400'} group-hover:scale-110 transition-transform`}>
                            {step.icon}
                        </div>
                        <div className="text-xs font-bold text-white">{step.title}</div>
                        <div className="text-[10px] text-slate-500">{step.sub}</div>
                        
                        {i < steps.length - 1 && (
                            <ArrowRight className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                        )}
                    </motion.div>
                ))}
            </div>
            <p className="text-[10px] text-slate-500 text-right mt-2">
                [cite_start]Based on Fig 1.1: Workflow diagram of the QAOA process [cite: 165]
            </p>
        </div>
    );
};

const AtomIcon = () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="1" />
        <ellipse cx="12" cy="12" rx="11" ry="4" transform="rotate(0 12 12)" />
        <ellipse cx="12" cy="12" rx="11" ry="4" transform="rotate(60 12 12)" />
        <ellipse cx="12" cy="12" rx="11" ry="4" transform="rotate(120 12 12)" />
    </svg>
);