import React, { useState } from "react";
import { motion } from "framer-motion";
import { X, Cpu, Layers, DollarSign, Smartphone } from "lucide-react";

interface CardItem {
    title: string;
    description: string;
    icon?: React.ReactNode;
}

export const FlipGrid = () => {
  // Content strictly derived from documented Design Constraints
  const items: CardItem[] = [
    {
        title: "Qubit & Memory Limits",
        description: "Simulations are capped at 30 qubits due to 16GB RAM limits; physical hardware is practically limited to 50-60 qubits due to noise floor.",
        icon: <Cpu className="w-6 h-6"/>
    },
    {
        title: "Circuit Depth",
        description: "Restricted to 100 layers to prevent qubit relaxation and decoherence, requiring p-layer optimization to maintain solution quality.",
        icon: <Layers className="w-6 h-6"/>
    },
    {
        title: "Economic Factors",
        description: "Managed via a pay-as-you-go model for Google Maps API and cloud QPU usage fees per execution shot or runtime second.",
        icon: <DollarSign className="w-6 h-6"/>
    },
    {
        title: "Commercial Use",
        description: "The mobile interface is optimized for variable network conditions and battery preservation during extended driver work shifts.",
        icon: <Smartphone className="w-6 h-6"/>
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-7xl mx-auto px-4">
        {items.map((item, i) => (
            <FlipCard key={i} item={item} />
        ))}
    </div>
  );
};

const FlipCard = ({ item }: { item: CardItem }) => {
    const [isFlipped, setIsFlipped] = useState(false);

    return (
        <div 
            className="group h-72 [perspective:1000px] cursor-pointer"
            onClick={() => setIsFlipped(!isFlipped)}
        >
            <motion.div 
                className="relative w-full h-full transition-all duration-500 [transform-style:preserve-3d]"
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
            >
                {/* FRONT CARD (The Constraint) */}
                <div className="absolute inset-0 bg-slate-800/50 backdrop-blur border border-slate-600 p-6 rounded-2xl [backface-visibility:hidden] flex flex-col items-center justify-center text-center hover:border-blue-500/50 hover:bg-slate-800 transition-colors shadow-xl">
                    <div className="mb-4 p-4 bg-slate-900 rounded-full text-blue-400 group-hover:scale-110 group-hover:text-blue-300 transition-all border border-slate-700">
                        {item.icon}
                    </div>
                    <h3 className="text-lg font-bold text-slate-100">{item.title}</h3>
                    <p className="text-[10px] text-slate-500 mt-4 uppercase tracking-widest font-bold group-hover:text-blue-400 transition-colors">
                        Click to See Mitigation
                    </p>
                </div>

                {/* BACK CARD (The Engineering Strategy) */}
                <div 
                    className="absolute inset-0 bg-gradient-to-br from-blue-900/90 to-slate-900/95 border border-blue-500 p-6 rounded-2xl [backface-visibility:hidden] [transform:rotateY(180deg)] flex flex-col items-center justify-center text-center shadow-[0_0_30px_rgba(59,130,246,0.3)]"
                >
                    <div className="absolute top-4 right-4 text-blue-300 opacity-50"><X className="w-4 h-4"/></div>
                    
                    <div className="text-[10px] font-bold text-blue-300 uppercase tracking-widest mb-3">
                        Project Constraint
                    </div>
                    <div className="text-sm font-medium text-white leading-relaxed">
                        {item.description}
                    </div>
                </div>
            </motion.div>
        </div>
    );
};