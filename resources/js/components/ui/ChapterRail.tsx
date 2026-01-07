import React from "react";
import { motion } from "framer-motion";

// These match the 'category' fields in your slides.tsx
const chapters = [
  { id: "Introduction", label: "01 INTRO" },
  { id: "Theory", label: "02 THEORY" },
  { id: "System Design", label: "03 SYSTEM" },
  { id: "Implementation", label: "04 BUILD" }, // Captures 'Classical Code', 'Quantum Code', 'Live Code'
  { id: "Results", label: "05 RESULTS" },
  { id: "Conclusion", label: "06 FUTURE" },
];

export const ChapterRail = ({ currentCategory }: { currentCategory: string }) => {
  
  // Helper to map specific slide categories to broad chapters
  const activeIndex = chapters.findIndex(c => {
      if (c.id === currentCategory) return true;
      // Handle sub-categories
      if (c.id === "Theory" && (currentCategory === "Motivation" || currentCategory === "Mathematics" || currentCategory === "Quantum Fundamentals")) return true;
      if (c.id === "System Design" && (currentCategory === "Architecture" || currentCategory === "Engineering")) return true;
      if (c.id === "Implementation" && (currentCategory.includes("Code") || currentCategory === "Live Demo")) return true;
      return false;
  });

  return (
    <div className="fixed left-6 top-1/2 -translate-y-1/2 flex flex-col gap-6 z-40 hidden xl:flex">
        {/* The Rail Line */}
        <div className="absolute left-[5px] top-0 bottom-0 w-[1px] bg-white/10 -z-10" />

        {chapters.map((chapter, i) => {
            const isActive = i === activeIndex;
            const isPast = i < activeIndex;

            return (
                <div key={chapter.id} className="group flex items-center gap-4 relative">
                    
                    {/* Dot */}
                    <motion.div 
                        className={`w-2.5 h-2.5 rounded-full border-2 transition-all duration-500 z-10
                        ${isActive ? 'bg-purple-500 border-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.8)] scale-125' : 
                          isPast ? 'bg-slate-700 border-slate-700' : 'bg-slate-900 border-slate-700'}`}
                    />

                    {/* Label */}
                    <div className={`text-[10px] font-bold tracking-widest transition-all duration-500
                        ${isActive ? 'text-white opacity-100 translate-x-0' : 
                          isPast ? 'text-slate-600 opacity-50' : 'text-slate-700 opacity-30 group-hover:opacity-60'}`}
                    >
                        {chapter.label}
                    </div>

                    {/* Active Glow Beam */}
                    {isActive && (
                        <motion.div 
                            layoutId="active-glow"
                            className="absolute left-[-20px] w-[2px] h-full bg-gradient-to-b from-transparent via-purple-500 to-transparent blur-sm"
                        />
                    )}
                </div>
            );
        })}
    </div>
  );
};