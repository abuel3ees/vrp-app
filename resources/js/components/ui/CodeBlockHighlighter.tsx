import React, { useState } from "react";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

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
        <pre className="text-slate-300 leading-relaxed font-mono text-xs md:text-sm whitespace-pre">
          <code>
            {code.split('\n').map((line, i) => (
              <div key={i} className="table-row">
                <span className="table-cell select-none text-slate-700 text-right pr-4 w-8 border-r border-white/5 mr-4">{i + 1}</span>
                <span className="table-cell pl-4" dangerouslySetInnerHTML={{ __html: highlightSyntax(line) }} />
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

// ROBUST SYNTAX HIGHLIGHTER (Placeholder Strategy)
const highlightSyntax = (line: string) => {
  const placeholders: string[] = [];
  
  // Helper to store a safe placeholder
  const store = (html: string) => {
    placeholders.push(html);
    return `__TOKEN_${placeholders.length - 1}__`;
  };

  // 1. Extract Strings (Green) to prevent matching keywords inside them
  let processed = line.replace(/('.*?'|".*?")/g, (match) => 
    store(`<span class="text-green-400">${match}</span>`)
  );

  // 2. Extract Comments (Grey)
  processed = processed.replace(/(#.*)/g, (match) => 
    store(`<span class="text-slate-500 italic">${match}</span>`)
  );

  // 3. Keywords (Purple) - using Word Boundaries \b
  processed = processed.replace(/\b(import|from|def|class|return|if|else|for|in|while|try|except|with|as|pass|raise|lambda)\b/g, (match) => 
    store(`<span class="text-purple-400 font-bold">${match}</span>`)
  );

  // 4. Built-ins & Libs (Blue)
  processed = processed.replace(/\b(print|range|len|enumerate|super|open|int|str|float|list|dict|set|json|sys|os|numpy|qiskit|ortools|pywrapcp|routing_enums_pb2)\b/g, (match) => 
    store(`<span class="text-blue-400">${match}</span>`)
  );

  // 5. Numbers (Orange)
  processed = processed.replace(/\b(\d+)\b/g, (match) => 
    store(`<span class="text-orange-400">${match}</span>`)
  );

  // 6. Self/Cls (Red)
  processed = processed.replace(/\b(self|cls)\b/g, (match) => 
    store(`<span class="text-red-400 italic">${match}</span>`)
  );

  // 7. Restore Placeholders (Reverse order not strictly necessary but good practice)
  placeholders.forEach((html, index) => {
    processed = processed.replace(`__TOKEN_${index}__`, html);
  });

  return processed;
};