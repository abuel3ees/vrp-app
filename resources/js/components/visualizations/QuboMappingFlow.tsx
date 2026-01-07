import React, { useEffect, useMemo, useState } from "react";

type Step = {
  title: string;
  subtitle: string;
  body: string[];
  badge: string;
};

export function QuboMappingFlow({
  autoPlay = true,
  intervalMs = 4200,
}: {
  autoPlay?: boolean;
  intervalMs?: number;
}) {
  const steps: Step[] = useMemo(
    () => [
      {
        badge: "1",
        title: "Define Binary Variables",
        subtitle: "Encode routing decisions as 0/1",
        body: [
          "Choose an encoding: x(i,t)=1 if customer i is visited at position t",
          "Binary domain enables QUBO (Quadratic Unconstrained Binary Optimization)",
        ],
      },
      {
        badge: "2",
        title: "Write the Objective",
        subtitle: "Distance / cost becomes a quadratic term",
        body: [
          "Cost accumulates across consecutive positions: (i at t) → (j at t+1)",
          "Build terms that reward short edges and penalize long edges",
        ],
      },
      {
        badge: "3",
        title: "Add Constraints as Penalties",
        subtitle: "Hard rules → energy penalties",
        body: [
          "Each customer visited exactly once",
          "Each position filled by exactly one customer",
          "Optional: depot constraints / vehicle constraints / balance constraints",
        ],
      },
      {
        badge: "4",
        title: "Combine into a Single Energy",
        subtitle: "Minimize f(x)=xᵀQx + cᵀx + const",
        body: [
          "Objective + A·(constraint penalties)",
          "Choose A big enough so feasibility dominates distance",
        ],
      },
    ],
    []
  );

  const [active, setActive] = useState(0);

  useEffect(() => {
    if (!autoPlay) return;
    const id = window.setInterval(() => {
      setActive((p) => (p + 1) % steps.length);
    }, intervalMs);
    return () => window.clearInterval(id);
  }, [autoPlay, intervalMs, steps.length]);

  return (
    <div className="w-full h-full flex flex-col justify-center">
      <div className="grid grid-cols-4 gap-3 mb-6">
        {steps.map((s, idx) => {
          const on = idx === active;
          return (
            <button
              key={s.badge}
              onClick={() => setActive(idx)}
              className={[
                "text-left rounded-xl border px-4 py-3 transition-all",
                on
                  ? "border-purple-400/60 bg-purple-500/10 shadow-[0_0_24px_-12px_rgba(168,85,247,0.9)]"
                  : "border-white/10 bg-white/5 hover:bg-white/7 hover:border-white/15",
              ].join(" ")}
            >
              <div className="flex items-center justify-between">
                <div className="text-xs font-mono text-slate-400">
                  Step {s.badge}
                </div>
                <div
                  className={[
                    "w-2.5 h-2.5 rounded-full transition-opacity",
                    on ? "bg-purple-400 opacity-100" : "bg-slate-600 opacity-60",
                  ].join(" ")}
                />
              </div>
              <div className="mt-1 text-sm font-bold text-white leading-tight">
                {s.title}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                {s.subtitle}
              </div>
            </button>
          );
        })}
      </div>

      <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-widest font-mono text-purple-300/90">
              {steps[active].subtitle}
            </div>
            <div className="text-2xl font-black text-white mt-1">
              {steps[active].title}
            </div>
          </div>
          <div className="text-xs font-mono text-slate-400 border border-white/10 rounded-full px-3 py-1">
            Auto: {autoPlay ? "ON" : "OFF"}
          </div>
        </div>

        <div className="mt-5 grid md:grid-cols-2 gap-4">
          {steps[active].body.map((line, i) => (
            <div
              key={i}
              className="rounded-xl border border-white/10 bg-white/5 p-4"
            >
              <div className="text-sm text-slate-200 leading-relaxed">
                {line}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex items-center gap-2">
          <div className="h-1 flex-1 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-purple-500 transition-all"
              style={{
                width: `${((active + 1) / steps.length) * 100}%`,
              }}
            />
          </div>
          <div className="text-[10px] font-mono text-slate-500">
            {active + 1}/{steps.length}
          </div>
        </div>
      </div>
    </div>
  );
}
