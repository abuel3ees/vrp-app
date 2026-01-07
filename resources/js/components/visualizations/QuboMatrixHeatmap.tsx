import React, { useMemo } from "react";
import { GlassCard } from "@/Components/ui/PresentationPrimitives";

export function QuboMatrixHeatmap() {
  const size = 10;

  const cells = useMemo(() => {
    const arr: number[] = [];
    for (let i = 0; i < size * size; i++) {
      // deterministic “random-looking” pattern
      const v = Math.sin(i * 12.9898) * 43758.5453;
      arr.push(v - Math.floor(v));
    }
    return arr;
  }, []);

  return (
    <GlassCard className="w-full max-w-lg">
      <div className="text-xs text-slate-500 uppercase tracking-widest font-mono mb-4">
        Example Q matrix (conceptual)
      </div>

      <div
        className="grid gap-1"
        style={{ gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))` }}
      >
        {cells.map((v, idx) => (
          <div
            key={idx}
            className="aspect-square rounded-[6px] border border-white/5"
            style={{
              background: `rgba(255,255,255,${0.04 + v * 0.26})`,
              transform: `scale(${0.92 + v * 0.08})`,
              transition: "transform 220ms ease",
            }}
          />
        ))}
      </div>

      <div className="mt-4 text-xs text-slate-400">
        Darker/brighter cells represent stronger interactions/penalties in QUBO form.
      </div>
    </GlassCard>
  );
}