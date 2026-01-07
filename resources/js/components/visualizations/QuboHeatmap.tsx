import React, { useMemo } from "react";

function clamp01(x: number) {
  return Math.max(0, Math.min(1, x));
}

// Deterministic pseudo-random
function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function QuboHeatmap({
  n = 18,
  seed = 7,
  title = "QUBO Matrix (Q)",
  caption = "Darker cells ≈ stronger quadratic coupling between variables",
}: {
  n?: number;
  seed?: number;
  title?: string;
  caption?: string;
}) {
  const Q = useMemo(() => {
    const rnd = mulberry32(seed);
    const m: number[][] = Array.from({ length: n }, () =>
      Array.from({ length: n }, () => 0)
    );

    for (let i = 0; i < n; i++) {
      // diagonal bias
      m[i][i] = (rnd() * 2 - 1) * 0.8;
      for (let j = i + 1; j < n; j++) {
        // sparse-ish couplings
        const raw = (rnd() * 2 - 1) * (rnd() > 0.6 ? 1 : 0.2);
        m[i][j] = raw;
        m[j][i] = raw;
      }
    }
    return m;
  }, [n, seed]);

  const maxAbs = useMemo(() => {
    let mx = 1e-9;
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        mx = Math.max(mx, Math.abs(Q[i][j]));
      }
    }
    return mx;
  }, [Q, n]);

  return (
    <div className="w-full h-full flex flex-col justify-center">
      <div className="mb-3 flex items-end justify-between">
        <div>
          <div className="text-xs font-mono uppercase tracking-widest text-slate-400">
            {title}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">{caption}</div>
        </div>
        <div className="text-[10px] font-mono text-slate-500 border border-white/10 rounded-full px-3 py-1">
          size: {n}×{n}
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-4">
        <div
          className="grid gap-[2px]"
          style={{
            gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))`,
          }}
        >
          {Q.flatMap((row, i) =>
            row.map((v, j) => {
              const a = clamp01(Math.abs(v) / maxAbs);
              const isDiag = i === j;

              // Opacity conveys magnitude; border conveys diagonal
              const opacity = 0.12 + a * 0.78;

              return (
                <div
                  key={`${i}-${j}`}
                  className={[
                    "aspect-square rounded-[3px]",
                    isDiag ? "ring-1 ring-purple-400/40" : "",
                    v >= 0 ? "bg-purple-500" : "bg-cyan-500",
                  ].join(" ")}
                  style={{ opacity }}
                  title={`Q[${i},${j}] = ${v.toFixed(3)}`}
                />
              );
            })
          )}
        </div>

        <div className="mt-4 flex items-center justify-between text-[10px] text-slate-500 font-mono">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1">
              <span className="w-3 h-3 rounded bg-purple-500 opacity-70" /> positive
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="w-3 h-3 rounded bg-cyan-500 opacity-70" /> negative
            </span>
          </div>
          <div>diagonal = linear terms embedded</div>
        </div>
      </div>
    </div>
  );
}
