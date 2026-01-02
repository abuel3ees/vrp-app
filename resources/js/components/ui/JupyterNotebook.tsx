import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FileCode, Play, RotateCcw, Loader2, Save, Terminal } from "lucide-react";
import { CodeBlockHighlighter } from "@/Components/ui/CodeBlockHighlighter";
import { usePyodide } from "@/hooks/usePyodide";

interface Cell {
  cell_type: "code" | "markdown";
  source: string[];
  outputs?: any[];
  execution_count?: number | null;
}

interface NotebookData {
  cells: Cell[];
  metadata: any;
}

export const JupyterNotebook = ({ filePath }: { filePath: string }) => {
  const { isReady, runCode } = usePyodide();
  const [data, setData] = useState<NotebookData | null>(null);
  const [cellContent, setCellContent] = useState<Record<number, string>>({});
  const [cellResults, setCellResults] = useState<Record<number, string>>({});
  const [executing, setExecuting] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  // Load Notebook JSON
  useEffect(() => {
    fetch(filePath)
      .then(res => res.json())
      .then((nb: NotebookData) => {
        setData(nb);
        // Initialize editable state
        const initialContent: Record<number, string> = {};
        nb.cells.forEach((cell, idx) => {
            if (cell.cell_type === 'code') {
                initialContent[idx] = cell.source.join("");
            }
        });
        setCellContent(initialContent);
        setLoading(false);
      })
      .catch(err => console.error(err));
  }, [filePath]);

  const executeCell = async (index: number) => {
    setExecuting(index);
    const code = cellContent[index];
    
    // Allow UI to update before freezing for calculation
    setTimeout(async () => {
        const output = await runCode(code);
        setCellResults(prev => ({ ...prev, [index]: output }));
        setExecuting(null);
    }, 100);
  };

  if (loading) return <div className="p-10 text-center text-slate-500">Loading Notebook...</div>;

  return (
    <div className="w-full h-full bg-[#0d1117] rounded-xl border border-white/10 overflow-hidden flex flex-col shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-white/5 shrink-0">
        <div className="flex items-center gap-2">
            <FileCode className="w-4 h-4 text-orange-400" />
            <span className="text-sm font-mono text-slate-300">{filePath.split('/').pop()}</span>
        </div>
        <div className="flex items-center gap-3">
            <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider ${isReady ? "bg-green-500/10 text-green-400" : "bg-yellow-500/10 text-yellow-400"}`}>
                <div className={`w-1.5 h-1.5 rounded-full ${isReady ? "bg-green-400" : "bg-yellow-400 animate-pulse"}`} />
                {isReady ? "Kernel Ready" : "Booting Python..."}
            </div>
        </div>
      </div>

      {/* Notebook Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar font-mono text-sm relative">
        {data?.cells.map((cell, idx) => (
          <motion.div key={idx} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="group relative">
            
            {/* MARKDOWN CELLS */}
            {cell.cell_type === "markdown" && (
                <div className="pl-14 pr-4 py-2 text-slate-400 prose prose-invert max-w-none prose-p:leading-relaxed prose-headings:text-purple-300">
                    {cell.source.join("").split('\n').map((l, i) => <div key={i}>{l.replace(/^#+\s/, '')}</div>)}
                </div>
            )}

            {/* CODE CELLS */}
            {cell.cell_type === "code" && (
                <div className="flex flex-col gap-3">
                    <div className="flex gap-3">
                        {/* Gutter / Controls */}
                        <div className="w-12 pt-1 flex flex-col items-end gap-2 shrink-0">
                            <span className="text-xs text-slate-600 font-mono select-none">In [{idx}]:</span>
                            <button 
                                onClick={() => executeCell(idx)}
                                disabled={!isReady || executing === idx}
                                className="p-1.5 rounded bg-slate-800 hover:bg-green-600 text-slate-400 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {executing === idx ? <Loader2 className="w-3 h-3 animate-spin" /> : <Play className="w-3 h-3 fill-current" />}
                            </button>
                        </div>

                        {/* Editor Area */}
                        <div className="flex-1 min-w-0 flex flex-col gap-2">
                            <div className="relative rounded-md overflow-hidden border border-slate-800 bg-[#0d1117] focus-within:border-purple-500/50 transition-colors">
                                <textarea
                                    value={cellContent[idx]}
                                    onChange={(e) => setCellContent(prev => ({...prev, [idx]: e.target.value}))}
                                    className="w-full min-h-[100px] bg-transparent text-slate-300 p-4 font-mono text-xs focus:outline-none resize-y leading-relaxed"
                                    spellCheck={false}
                                />
                                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span className="text-[9px] text-slate-600 bg-black/50 px-1 rounded">Editable</span>
                                </div>
                            </div>

                            {/* OUTPUT AREA */}
                            {(cellResults[idx] || (cell.outputs && cell.outputs.length > 0)) && (
                                <div className="relative mt-1">
                                    <div className="absolute top-0 -left-14 w-12 text-right text-xs text-red-400/50 select-none font-mono">
                                        Out[{idx}]:
                                    </div>
                                    <div className="bg-slate-800/30 border-l-2 border-red-400/30 pl-3 py-2 text-xs text-slate-300 whitespace-pre-wrap font-mono">
                                        {/* Show Real-time Result if available, else static output from file */}
                                        {cellResults[idx] ? (
                                            <span className="animate-in fade-in">{cellResults[idx]}</span>
                                        ) : (
                                            cell.outputs?.map((out: any, i: number) => (
                                                <span key={i} className="opacity-70">{out.text?.join("") || out.data?.['text/plain']?.join("")}</span>
                                            ))
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
          </motion.div>
        ))}
        
        <div className="h-20" /> {/* Bottom spacer */}
      </div>
    </div>
  );
};