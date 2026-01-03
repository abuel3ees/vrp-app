import React from 'react';
import { Activity } from 'lucide-react';

export const QuantumCircuitDiagram = () => {
  return (
    <div className="relative w-full h-64 bg-slate-900/80 rounded-xl border border-white/10 p-6 overflow-hidden flex items-center justify-center font-mono text-xs shadow-2xl">
      
      {/* 1. Wire Lines (The Qubits) */}
      <div className="absolute inset-0 flex flex-col justify-center gap-12 px-12 opacity-30">
          {[0, 1, 2, 3].map(i => (
            <div key={i} className="w-full h-[1px] bg-slate-400 relative">
                <span className="absolute -left-8 -top-2 text-slate-300 font-bold">q[{i}]</span>
            </div>
          ))}
      </div>
      
      {/* 2. Gates Layer 1: Hadamard (Superposition) */}
      <div className="absolute left-20 flex flex-col gap-8">
          {[0, 1, 2, 3].map(i => (
            <div key={i} className="w-8 h-8 bg-blue-600 text-white flex items-center justify-center border border-blue-400 shadow-[0_0_15px_rgba(37,99,235,0.6)] z-10 rounded-sm">H</div>
          ))}
          <div className="absolute -bottom-8 left-0 text-[10px] text-blue-400 text-center w-full">Init</div>
      </div>

      {/* 3. Gates Layer 2: Entanglement (CNOTs) */}
      <div className="absolute left-44 inset-y-0 py-[70px] flex flex-col justify-between">
           {/* Connection Line */}
           <div className="w-[2px] h-24 bg-purple-500 absolute left-4 top-14 z-0"></div>
           {/* Control Dot */}
           <div className="w-3 h-3 rounded-full bg-purple-500 z-10 ml-2.5 shadow-[0_0_10px_purple]"></div> 
           {/* Target Plus */}
           <div className="w-8 h-8 rounded-full border-2 border-purple-500 bg-slate-900 flex items-center justify-center z-10 text-purple-400 font-bold text-lg shadow-[0_0_15px_purple]">⊕</div>
           <div className="absolute -bottom-[26px] left-0 text-[10px] text-purple-400 text-center w-full">Entangle</div>
      </div>

      {/* 4. Gates Layer 3: Rotation (QAOA Parameters) */}
      <div className="absolute left-72 flex flex-col gap-8">
          {[0, 1, 2, 3].map(i => (
            <div key={i} className="w-10 h-8 bg-emerald-600 text-white flex items-center justify-center border border-emerald-400 text-[10px] z-10 rounded-sm shadow-[0_0_15px_rgba(5,150,105,0.6)]">Rz(γ)</div>
          ))}
           <div className="absolute -bottom-8 left-0 text-[10px] text-emerald-400 text-center w-full">Cost</div>
      </div>

      {/* 5. Gates Layer 4: Measurement */}
      <div className="absolute right-20 flex flex-col gap-8">
          {[0, 1, 2, 3].map(i => (
            <div key={i} className="w-8 h-8 bg-slate-800 text-white flex items-center justify-center border border-slate-600 z-10 rounded-sm"><Activity className="w-4 h-4"/></div>
          ))}
           <div className="absolute -bottom-8 left-0 text-[10px] text-slate-400 text-center w-full">Measure</div>
      </div>
    </div>
  );
};