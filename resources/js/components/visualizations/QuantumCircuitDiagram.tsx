import React, { useId } from "react";

type Props = {
  qubits?: number;
  layersLabel?: string; // e.g., "repeat p layers"
  params?: { cost?: string; mix?: string }; // e.g., { cost: "γ", mix: "ω" }
};

export default function QuantumCircuitDiagram({
  qubits = 6,
  layersLabel = "repeat p layers",
  params = { cost: "γ", mix: "ω" },
}: Props) {
  const uid = useId().replace(/:/g, "");
  const W = 1280;
  const H = 640;

  const left = 120;
  const right = 1140;
  const top = 170;
  const gap = 62;

  const y = (i: number) => top + i * gap;
  const yTop = y(0);
  const yBot = y(qubits - 1);

  const xInit = 290;
  const xCost = 610;
  const xMix = 860;
  const xMeas = 1060;

  const bandInit = { x: xInit - 86, y: yTop - 58, w: 172, h: yBot - yTop + 116 };
  const bandCost = { x: xCost - 220, y: yTop - 78, w: 440, h: yBot - yTop + 156 };
  const bandMix = { x: xMix - 170, y: yTop - 78, w: 340, h: yBot - yTop + 156 };
  const bandMeas = { x: xMeas - 80, y: yTop - 58, w: 160, h: yBot - yTop + 116 };

  const classical = { x: xMeas - 260, y: 78, w: 520, h: 74 };

  // Example couplings (kept readable)
  const couplings: Array<[number, number, number]> = [
    [0, 1, xCost - 40],
    [1, 2, xCost + 30],
    [2, 3, xCost - 10],
    [3, 4, xCost + 60],
    [1, 4, xCost + 120],
  ].filter(([a, b]) => a < qubits && b < qubits);

  // a smooth feedback path (measure -> classical -> back to cost/mix)
  const feedbackPath = `
    M ${xMeas} ${yBot + 52}
    C ${xMeas + 160} ${yBot + 160}, ${xCost - 360} ${yBot + 160}, ${xCost - 360} ${yTop - 150}
    C ${xCost - 360} ${yTop - 220}, ${xMeas - 320} ${yTop - 220}, ${xMeas - 120} ${classical.y + 18}
  `;

  return (
    <div className="w-full flex items-center justify-center">
      <div className="w-full max-w-[1240px]">
        <div className="relative rounded-[30px] border border-white/10 bg-[#070A12] overflow-hidden shadow-[0_60px_160px_rgba(0,0,0,0.65)]">
          {/* Ambient blobs */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -left-40 -top-40 w-[520px] h-[520px] rounded-full bg-cyan-500/10 blur-[95px]" />
            <div className="absolute -right-40 -bottom-40 w-[620px] h-[620px] rounded-full bg-purple-500/12 blur-[105px]" />
            <div className="absolute left-[38%] top-[-30%] w-[520px] h-[520px] rounded-full bg-indigo-500/8 blur-[110px]" />
          </div>

          <svg
            viewBox={`0 0 ${W} ${H}`}
            preserveAspectRatio="xMidYMid meet"
            className="block w-full h-auto"
            role="img"
            aria-label="QAOA circuit with classical optimizer loop"
          >
            <defs>
              {/* subtle noise */}
              <filter id={`noise_${uid}`}>
                <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
                <feColorMatrix type="matrix" values="
                  1 0 0 0 0
                  0 1 0 0 0
                  0 0 1 0 0
                  0 0 0 0.18 0
                "/>
              </filter>

              {/* glass + inner highlight */}
              <filter id={`glass_${uid}`} x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur in="SourceAlpha" stdDeviation="10" result="blur" />
                <feOffset dy="10" result="off" />
                <feColorMatrix in="off" type="matrix" values="
                  0 0 0 0 0
                  0 0 0 0 0
                  0 0 0 0 0
                  0 0 0 0.55 0
                " result="shadow" />
                <feMerge>
                  <feMergeNode in="shadow" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              {/* neon edge glow */}
              <filter id={`neon_${uid}`} x="-40%" y="-40%" width="180%" height="180%">
                <feGaussianBlur stdDeviation="8" result="b" />
                <feColorMatrix
                  in="b"
                  type="matrix"
                  values="
                    1 0 0 0 0
                    0 1 0 0 0
                    0 0 1 0 0
                    0 0 0 0.75 0"
                  result="g"
                />
                <feMerge>
                  <feMergeNode in="g" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              <linearGradient id={`wire_${uid}`} x1="0" x2="1">
                <stop offset="0" stopColor="rgba(148,163,184,0.18)" />
                <stop offset="0.5" stopColor="rgba(226,232,240,0.32)" />
                <stop offset="1" stopColor="rgba(148,163,184,0.18)" />
              </linearGradient>

              <linearGradient id={`cost_${uid}`} x1="0" x2="1">
                <stop offset="0" stopColor="rgba(56,189,248,0.22)" />
                <stop offset="1" stopColor="rgba(56,189,248,0.06)" />
              </linearGradient>

              <linearGradient id={`mix_${uid}`} x1="0" x2="1">
                <stop offset="0" stopColor="rgba(168,85,247,0.24)" />
                <stop offset="1" stopColor="rgba(168,85,247,0.07)" />
              </linearGradient>

              <linearGradient id={`gate_${uid}`} x1="0" x2="0" y1="0" y2="1">
                <stop offset="0" stopColor="rgba(255,255,255,0.08)" />
                <stop offset="1" stopColor="rgba(255,255,255,0.03)" />
              </linearGradient>

              <linearGradient id={`gateCost_${uid}`} x1="0" x2="1">
                <stop offset="0" stopColor="rgba(56,189,248,0.18)" />
                <stop offset="1" stopColor="rgba(56,189,248,0.08)" />
              </linearGradient>

              <linearGradient id={`gateMix_${uid}`} x1="0" x2="1">
                <stop offset="0" stopColor="rgba(168,85,247,0.20)" />
                <stop offset="1" stopColor="rgba(168,85,247,0.10)" />
              </linearGradient>

              <marker id={`arrow_${uid}`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="rgba(226,232,240,0.75)" />
              </marker>

              {/* scanline path across the circuit area */}
              <clipPath id={`clipCircuit_${uid}`}>
                <rect x={left} y={yTop - 92} width={right - left} height={yBot - yTop + 184} rx={26} />
              </clipPath>
            </defs>

            {/* background grid */}
            <g opacity="0.65">
              {Array.from({ length: 9 }).map((_, i) => {
                const yy = 110 + i * 60;
                return (
                  <line key={i} x1={0} y1={yy} x2={W} y2={yy} stroke="rgba(148,163,184,0.06)" strokeWidth="1" />
                );
              })}
              {Array.from({ length: 14 }).map((_, i) => {
                const xx = 60 + i * 90;
                return (
                  <line key={i} x1={xx} y1={0} x2={xx} y2={H} stroke="rgba(148,163,184,0.05)" strokeWidth="1" />
                );
              })}
            </g>

            {/* noise overlay */}
            <rect x="0" y="0" width={W} height={H} filter={`url(#noise_${uid})`} opacity="0.35" />

            {/* header */}
            <text x={left} y={64} className="q_title">
              Quantum Circuit (QAOA)
            </text>
            <text x={left} y={94} className="q_subtitle">
              stage highlight + optimizer feedback loop (wow, but still thesis-safe)
            </text>

            {/* classical optimizer */}
            <g filter={`url(#glass_${uid})`} className="classicalPulse">
              <rect x={classical.x} y={classical.y} width={classical.w} height={classical.h} rx={22} className="glassPanel" />
              <rect x={classical.x + 12} y={classical.y + 12} width={classical.w - 24} height="10" rx="5" className="glassSheen" />
              <text x={classical.x + 22} y={classical.y + 32} className="panelTitle">
                Classical computer (optimizer)
              </text>
              <text x={classical.x + 22} y={classical.y + 54} className="panelSub">
                updates {params.cost}/{params.mix} from measurement statistics
              </text>
            </g>

            {/* stage bands (Init/Cost/Mix/Measure) */}
            <g filter={`url(#glass_${uid})`}>
              <rect {...bandInit} rx={26} className="band" />
              <rect {...bandCost} rx={30} fill={`url(#cost_${uid})`} stroke="rgba(255,255,255,0.10)" />
              <rect {...bandMix} rx={30} fill={`url(#mix_${uid})`} stroke="rgba(255,255,255,0.10)" />
              <rect {...bandMeas} rx={26} className="band" />
            </g>

            {/* stage labels */}
            <g>
              <g className="labelInit stageLabel">
                <rect x={xInit - 95} y={yTop - 98} width="190" height="30" rx="14" className="pill" />
                <text x={xInit} y={yTop - 78} textAnchor="middle" className="pillText">
                  Initialize |+⟩
                </text>
              </g>

              <g className="labelCost stageLabel">
                <rect x={xCost - 135} y={yTop - 108} width="270" height="30" rx="14" className="pill" />
                <text x={xCost} y={yTop - 88} textAnchor="middle" className="pillText">
                  Cost U({params.cost}) : Ising / QUBO couplings
                </text>
              </g>

              <g className="labelMix stageLabel">
                <rect x={xMix - 115} y={yTop - 108} width="230" height="30" rx="14" className="pill" />
                <text x={xMix} y={yTop - 88} textAnchor="middle" className="pillText">
                  Mixer U({params.mix}) : Rx rotations
                </text>
              </g>

              <g className="labelMeas stageLabel">
                <rect x={xMeas - 68} y={yTop - 98} width="136" height="30" rx="14" className="pill" />
                <text x={xMeas} y={yTop - 78} textAnchor="middle" className="pillText">
                  Measure
                </text>
              </g>
            </g>

            {/* repeat bracket over cost+mixer */}
            <g opacity="0.95">
              <path
                d={`M ${bandCost.x + 22} ${bandCost.y - 18}
                    C ${bandCost.x + 120} ${bandCost.y - 52}, ${bandMix.x + bandMix.w - 120} ${bandCost.y - 52}, ${bandMix.x + bandMix.w - 22} ${bandCost.y - 18}`}
                fill="none"
                stroke="rgba(226,232,240,0.28)"
                strokeWidth="2"
              />
              <text x={(bandCost.x + (bandMix.x + bandMix.w)) / 2} y={bandCost.y - 56} textAnchor="middle" className="repeatText">
                {layersLabel}
              </text>
            </g>

            {/* qubit labels + wires */}
            {Array.from({ length: qubits }).map((_, i) => (
              <g key={`w${i}`}>
                <text x={left - 36} y={y(i) + 5} className="qLabel">
                  q{i}
                </text>
                <path
                  d={`M ${left} ${y(i)} L ${right} ${y(i)}`}
                  stroke={`url(#wire_${uid})`}
                  strokeWidth="2.4"
                  fill="none"
                />
              </g>
            ))}

            {/* scanline shimmer */}
            <g clipPath={`url(#clipCircuit_${uid})`} opacity="0.8">
              <rect x={left} y={yTop - 92} width={right - left} height="10" rx="5" className="scanLine">
                <animate
                  attributeName="y"
                  values={`${yTop - 92};${yBot + 92};${yTop - 92}`}
                  dur="7.8s"
                  repeatCount="indefinite"
                />
              </rect>
            </g>

            {/* H gates */}
            {Array.from({ length: qubits }).map((_, i) => (
              <g key={`h${i}`} className="gateInit">
                <rect x={xInit - 20} y={y(i) - 20} width="40" height="40" rx="12" fill={`url(#gate_${uid})`} stroke="rgba(255,255,255,0.14)" />
                <text x={xInit} y={y(i) + 7} textAnchor="middle" className="gateText">
                  H
                </text>
              </g>
            ))}

            {/* RZZ couplings */}
            {couplings.map(([a, b, xc], idx) => {
              const yA = y(a);
              const yB = y(b);
              const yM = (yA + yB) / 2;
              return (
                <g key={`c${idx}`} filter={`url(#neon_${uid})`} className="gateCostGlow">
                  <path d={`M ${xc} ${yA} L ${xc} ${yB}`} stroke="rgba(226,232,240,0.55)" strokeWidth="2.4" />
                  <circle cx={xc} cy={yA} r="5.2" fill="rgba(226,232,240,0.92)" />
                  <circle cx={xc} cy={yB} r="5.2" fill="rgba(226,232,240,0.92)" />
                  <rect x={xc - 34} y={yM - 18} width="68" height="36" rx="12" fill={`url(#gateCost_${uid})`} stroke="rgba(56,189,248,0.30)" />
                  <text x={xc} y={yM + 7} textAnchor="middle" className="gateText">
                    RZZ
                  </text>
                </g>
              );
            })}

            {/* Mixer Rx */}
            {Array.from({ length: qubits }).map((_, i) => (
              <g key={`rx${i}`} filter={`url(#neon_${uid})`} className="gateMixGlow">
                <rect x={xMix - 58} y={y(i) - 20} width="116" height="40" rx="14" fill={`url(#gateMix_${uid})`} stroke="rgba(168,85,247,0.34)" />
                <text x={xMix} y={y(i) + 7} textAnchor="middle" className="gateText">
                  Rx({params.mix})
                </text>
              </g>
            ))}

            {/* Measurement */}
            {Array.from({ length: qubits }).map((_, i) => (
              <g key={`m${i}`} className="gateMeas">
                <rect x={xMeas - 20} y={y(i) - 20} width="40" height="40" rx="12" fill={`url(#gate_${uid})`} stroke="rgba(255,255,255,0.16)" />
                <text x={xMeas} y={y(i) + 7} textAnchor="middle" className="gateText">
                  M
                </text>
              </g>
            ))}

            {/* Feedback loop path + animated particles */}
            <path
              d={feedbackPath}
              fill="none"
              stroke="rgba(226,232,240,0.42)"
              strokeWidth="2.6"
              strokeDasharray="10 12"
              markerEnd={`url(#arrow_${uid})`}
              className="feedbackDash"
            />

            {Array.from({ length: 10 }).map((_, i) => (
              <circle key={`p${i}`} r="3.7" className="particle">
                <animateMotion dur="4.2s" repeatCount="indefinite" begin={`${i * 0.24}s`} path={feedbackPath} />
              </circle>
            ))}

            {/* footer glass */}
            <g filter={`url(#glass_${uid})`}>
              <rect x={left} y={H - 86} width={right - left} height="56" rx="18" className="glassPanel" />
              <rect x={left + 16} y={H - 76} width={right - left - 32} height="10" rx="5" className="glassSheen" />
              <text x={left + 22} y={H - 52} className="footerText">
                Output: sample bitstrings → filter infeasible → decode route → keep best cost. Optimizer updates {params.cost}/{params.mix}.
              </text>
            </g>
          </svg>

          <style>{`
            .q_title {
              font: 800 30px system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
              fill: rgba(255,255,255,0.94);
              letter-spacing: -0.02em;
            }
            .q_subtitle {
              font: 500 14px system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
              fill: rgba(148,163,184,0.85);
            }

            .glassPanel {
              fill: rgba(255,255,255,0.04);
              stroke: rgba(255,255,255,0.12);
              stroke-width: 1.2;
            }
            .glassSheen {
              fill: rgba(255,255,255,0.10);
              opacity: 0.55;
            }

            .band {
              fill: rgba(255,255,255,0.02);
              stroke: rgba(255,255,255,0.10);
              stroke-width: 1.2;
            }

            .qLabel {
              font: 700 13px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
              fill: rgba(148,163,184,0.86);
            }

            .pill {
              fill: rgba(255,255,255,0.05);
              stroke: rgba(255,255,255,0.12);
              stroke-width: 1;
            }
            .pillText {
              font: 700 12px system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
              fill: rgba(226,232,240,0.92);
            }

            .repeatText {
              font: 600 12px system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
              fill: rgba(148,163,184,0.85);
            }

            .panelTitle {
              font: 800 14px system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
              fill: rgba(226,232,240,0.96);
            }
            .panelSub {
              font: 500 12.5px system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
              fill: rgba(148,163,184,0.86);
            }

            .gateText {
              font: 800 12px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
              fill: rgba(226,232,240,0.93);
            }

            .scanLine {
              fill: rgba(255,255,255,0.05);
              stroke: rgba(56,189,248,0.20);
              stroke-width: 1;
              filter: drop-shadow(0 0 12px rgba(56,189,248,0.16));
            }

            .feedbackDash {
              animation: dashMove 6.8s linear infinite;
            }
            @keyframes dashMove {
              to { stroke-dashoffset: -260; }
            }

            .particle {
              fill: rgba(168,85,247,0.95);
              opacity: 0.95;
              filter: drop-shadow(0 0 10px rgba(168,85,247,0.35));
            }

            .footerText {
              font: 500 12.5px system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
              fill: rgba(148,163,184,0.9);
            }

            /* WOW: sequential stage highlight (professional timing) */
            .stageLabel { opacity: 0.35; }
            .labelInit { animation: stage 8s ease-in-out infinite; }
            .labelCost { animation: stage 8s ease-in-out infinite; animation-delay: 1.9s; }
            .labelMix  { animation: stage 8s ease-in-out infinite; animation-delay: 3.8s; }
            .labelMeas { animation: stage 8s ease-in-out infinite; animation-delay: 5.7s; }

            @keyframes stage {
              0%, 100% { opacity: 0.35; filter: none; }
              35% { opacity: 1; filter: drop-shadow(0 0 14px rgba(226,232,240,0.18)); }
              60% { opacity: 0.75; }
            }

            /* subtle pulsing of key blocks */
            .gateInit { animation: softPulse 4.6s ease-in-out infinite; }
            .gateCostGlow { animation: softPulse2 4.2s ease-in-out infinite; }
            .gateMixGlow { animation: softPulse3 3.8s ease-in-out infinite; }
            .gateMeas { animation: softPulse 5.2s ease-in-out infinite; }

            .classicalPulse { animation: panelPulse 6.2s ease-in-out infinite; }
            @keyframes panelPulse {
              0%, 100% { transform: translateY(0); opacity: 0.96; }
              50% { transform: translateY(-1.5px); opacity: 1; }
            }

            @keyframes softPulse {
              0%, 100% { opacity: 0.90; }
              50% { opacity: 1; }
            }
            @keyframes softPulse2 {
              0%, 100% { opacity: 0.92; }
              50% { opacity: 1; filter: drop-shadow(0 0 12px rgba(56,189,248,0.18)); }
            }
            @keyframes softPulse3 {
              0%, 100% { opacity: 0.92; }
              50% { opacity: 1; filter: drop-shadow(0 0 12px rgba(168,85,247,0.18)); }
            }
          `}</style>
        </div>
      </div>
    </div>
  );
}