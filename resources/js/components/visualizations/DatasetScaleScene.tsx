import React from "react";
import { GlassCard } from "@/Components/ui/PresentationPrimitives";
import { BarChart3, MapPinned, Timer } from "lucide-react";

export function DatasetScaleScene() {
  return (
    <GlassCard className="w-full max-w-xl">
      <div className="text-xs text-slate-500 uppercase tracking-widest font-mono mb-4">
        Scale + cost model (visual cue)
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="p-4 rounded-xl border border-white/10 bg-black/20">
          <div className="flex items-center gap-2">
            <MapPinned className="w-4 h-4 text-cyan-400" />
            <div className="text-sm text-white font-semibold">Road Graph</div>
          </div>
          <div className="mt-2 text-xs text-slate-400">
            Intersections & edges
          </div>
        </div>

        <div className="p-4 rounded-xl border border-white/10 bg-black/20">
          <div className="flex items-center gap-2">
            <Timer className="w-4 h-4 text-purple-400" />
            <div className="text-sm text-white font-semibold">Route Length</div>
          </div>
          <div className="mt-2 text-xs text-slate-400">≈ 6–8 hours</div>
        </div>

        <div className="p-4 rounded-xl border border-white/10 bg-black/20">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-emerald-400" />
            <div className="text-sm text-white font-semibold">Scale</div>
          </div>
          <div className="mt-2 text-xs text-slate-400">Up to ~30k points</div>
        </div>
      </div>

      <div className="mt-5 h-2 w-full rounded-full bg-slate-800 overflow-hidden">
        <div className="h-full w-[30%] bg-white/25 animate-[grow_2.4s_ease-in-out_infinite]" />
      </div>

      <style>{`
        @keyframes grow {
          0% { transform: translateX(-10%); width: 18%; }
          50% { transform: translateX(120%); width: 45%; }
          100% { transform: translateX(-10%); width: 18%; }
        }
      `}</style>
    </GlassCard>
  );
}