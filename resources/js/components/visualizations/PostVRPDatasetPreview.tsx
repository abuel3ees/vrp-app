import React, { useMemo } from "react";

function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Props = {
  points?: number;
  seed?: number;
  title?: string;
};

export function PostVRPDatasetPreview({
  points = 650,
  seed = 11,
  title = "Post Office VRP (Preview)",
}: Props) {
  const pts = useMemo(() => {
    const rnd = mulberry32(seed);
    const arr = Array.from({ length: points }, () => {
      // clustered-ish scatter
      const cx = rnd() * 0.6 + 0.2;
      const cy = rnd() * 0.6 + 0.2;
      const x = cx + (rnd() * 2 - 1) * 0.18;
      const y = cy + (rnd() * 2 - 1) * 0.18;
      return { x: Math.max(0.02, Math.min(0.98, x)), y: Math.max(0.02, Math.min(0.98, y)) };
    });
    return arr;
  }, [points, seed]);

  const W = 720;
  const H = 420;
  const depot = { x: 0.52, y: 0.54 };

  return (
    <div className="w-full h-full flex flex-col justify-center">
      <div className="flex items-end justify-between mb-3">
        <div>
          <div className="text-xs font-mono uppercase tracking-widest text-slate-400">
            {title}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Large real-world benchmark; we sample small instances for NISQ limits
          </div>
        </div>

        <div className="text-[10px] font-mono text-slate-500 border border-white/10 rounded-full px-3 py-1">
          points shown: {points}
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-4">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto">
          <defs>
            <radialGradient id="glow" cx="50%" cy="50%" r="60%">
              <stop offset="0%" stopColor="white" stopOpacity="0.12" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </radialGradient>
          </defs>

          <rect x="0" y="0" width={W} height={H} rx="18" fill="rgba(255,255,255,0.02)" />
          <rect x="0" y="0" width={W} height={H} rx="18" fill="url(#glow)" />

          {/* points */}
          {pts.map((p, i) => (
            <circle
              key={i}
              cx={p.x * W}
              cy={p.y * H}
              r={2}
              fill="rgba(148,163,184,0.55)"
            />
          ))}

          {/* depot */}
          <circle cx={depot.x * W} cy={depot.y * H} r={7} fill="rgba(168,85,247,0.95)" />
          <circle cx={depot.x * W} cy={depot.y * H} r={15} fill="rgba(168,85,247,0.18)" />
          <text
            x={depot.x * W + 12}
            y={depot.y * H + 5}
            fontSize="12"
            fill="rgba(226,232,240,0.75)"
            fontFamily="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace"
          >
            depot
          </text>
        </svg>

        {/* scale cards */}
        <div className="mt-4 grid grid-cols-3 gap-3">
          <div className="rounded-xl border border-white/10 bg-white/5 p-3">
            <div className="text-[10px] uppercase tracking-widest text-slate-500 font-mono">
              scale
            </div>
            <div className="text-lg font-black text-white mt-1">Up to 30,000 stops</div>
            <div className="text-[11px] text-slate-400 mt-1">
              Much larger than classic VRP benchmarks
            </div>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-3">
            <div className="text-[10px] uppercase tracking-widest text-slate-500 font-mono">
              capacity
            </div>
            <div className="text-lg font-black text-white mt-1">Unlimited</div>
            <div className="text-[11px] text-slate-400 mt-1">
              Focus on routing + workload distribution
            </div>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-3">
            <div className="text-[10px] uppercase tracking-widest text-slate-500 font-mono">
              objectives
            </div>
            <div className="text-lg font-black text-white mt-1">K, distance, fairness</div>
            <div className="text-[11px] text-slate-400 mt-1">
              Multi-objective real operations
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
