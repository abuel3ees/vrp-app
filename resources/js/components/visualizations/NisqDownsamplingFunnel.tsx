import React from "react";

type Row = { label: string; value: string; hint: string };

export function NisqDownsamplingFunnel({
  rows = [
    { label: "Raw Instance", value: "≤ 30,000 stops", hint: "Full city workload" },
    { label: "Filter / Clean", value: "Remove invalid / duplicates", hint: "Data hygiene" },
    { label: "Cluster / Sample", value: "Select representative region", hint: "Preserve structure" },
    { label: "Quantum Subproblem", value: "n ≈ 12–20 (demo)", hint: "Fits qubit limits" },
  ],
}: {
  rows?: Row[];
}) {
  return (
    <div className="w-full h-full flex flex-col justify-center">
      <div className="mb-3">
        <div className="text-xs font-mono uppercase tracking-widest text-slate-400">
          NISQ practicality
        </div>
        <div className="text-[11px] text-slate-500 mt-1">
          We solve small quantum subproblems inside a classical orchestration loop
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-5">
        <div className="space-y-3">
          {rows.map((r, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <div
                className="h-12 rounded-xl border border-white/10 bg-white/5 flex items-center px-4"
                style={{ width: `${92 - idx * 12}%` }}
              >
                <div className="flex-1">
                  <div className="text-sm font-bold text-white">{r.label}</div>
                  <div className="text-[11px] text-slate-400">{r.hint}</div>
                </div>
                <div className="text-xs font-mono text-slate-300">{r.value}</div>
              </div>
              {idx < rows.length - 1 && (
                <div className="w-8 text-center text-slate-600 font-mono">→</div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-5 rounded-xl border border-purple-500/20 bg-purple-500/10 p-4">
          <div className="text-xs font-mono uppercase tracking-widest text-purple-200/90">
            Why this matters
          </div>
          <div className="text-sm text-slate-200 mt-2 leading-relaxed">
            Quantum hardware limits the number of binary variables we can encode.
            So we design the system to **select a small subproblem**, solve it (QAOA),
            then **stitch results** using classical logic.
          </div>
        </div>
      </div>
    </div>
  );
}
