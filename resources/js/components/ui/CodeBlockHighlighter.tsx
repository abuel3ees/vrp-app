import React, { useState } from "react";
import { Copy, Check } from "lucide-react";
import { Button } from "@/Components/ui/button";

interface CodeBlockProps {
  code: string;
  language?: string;
}

export const CodeBlockHighlighter = ({ code, language = "python" }: CodeBlockProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group rounded-xl overflow-hidden border border-white/10 bg-[#0d1117] shadow-2xl font-mono text-sm h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/5 shrink-0">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500/50" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
          <div className="w-3 h-3 rounded-full bg-green-500/50" />
        </div>
        <div className="text-xs text-slate-500 uppercase font-bold">{language}</div>
      </div>

      {/* Code Area */}
      <div className="p-4 overflow-y-auto flex-1 custom-scrollbar">
        <pre className="text-slate-300 leading-relaxed font-mono text-xs md:text-sm">
          <code>
            {code.split('\n').map((line, i) => (
              <div key={i} className="table-row">
                <span className="table-cell select-none text-slate-700 text-right pr-4 w-8">{i + 1}</span>
                <span className="table-cell" dangerouslySetInnerHTML={{ __html: highlightSyntax(line) }} />
              </div>
            ))}
          </code>
        </pre>
      </div>

      {/* Copy Button */}
      <Button
        onClick={handleCopy}
        variant="ghost"
        size="icon"
        className="absolute top-12 right-4 opacity-0 group-hover:opacity-100 transition-opacity bg-white/10 hover:bg-white/20 text-white"
      >
        {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
      </Button>
    </div>
  );
};

// Simple regex-based syntax highlighter for the demo
const highlightSyntax = (line: string) => {
  let processed = line
    .replace(/(import|from|def|class|return|if|else|for|in|while|try|except)/g, '<span class="text-purple-400 font-bold">$1</span>')
    .replace(/(print|range|len|enumerate|super|QuantumCircuit|TwoLocal|ZZFeatureMap)/g, '<span class="text-blue-400">$1</span>')
    .replace(/('.*?'|".*?")/g, '<span class="text-green-400">$1</span>')
    .replace(/(#.*)/g, '<span class="text-slate-500 italic">$1</span>')
    .replace(/(\d+)/g, '<span class="text-orange-400">$1</span>')
    .replace(/(self|cls)/g, '<span class="text-red-400 italic">$1</span>');
  return processed;
};