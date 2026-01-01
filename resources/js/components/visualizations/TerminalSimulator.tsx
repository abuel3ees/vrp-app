import { motion } from "framer-motion";
import React, { useState, useEffect, useRef } from "react";

export const TerminalSimulator = ({ logs }: { logs: string[] }) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [displayedLogs, setDisplayedLogs] = useState<string[]>([]);

    useEffect(() => {
        let currentIndex = 0;
        const interval = setInterval(() => {
            if (currentIndex < logs.length) {
                setDisplayedLogs(prev => [...prev, logs[currentIndex]]);
                currentIndex++;
                if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
            } else {
                clearInterval(interval);
            }
        }, 800);
        return () => clearInterval(interval);
    }, [logs]);

    return (
        <div className="font-mono text-xs w-full h-full bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-2xl flex flex-col">
            <div className="bg-slate-900 p-2 flex items-center gap-2 border-b border-slate-800">
                <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
                </div>
                <div className="text-slate-500 ml-2">qiskit-runtime — zsh</div>
            </div>
            <div ref={scrollRef} className="flex-1 p-4 overflow-y-auto space-y-2 text-slate-300">
                {displayedLogs.map((log, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
                        <span className="text-purple-500 mr-2">➜</span>
                        <span dangerouslySetInnerHTML={{ __html: log }} />
                    </motion.div>
                ))}
            </div>
        </div>
    )
};