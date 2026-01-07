"use client";

import React from "react";

type Props = {
  nQubits?: number;          // recommended 6–7
  title?: string;
  subtitle?: string;
  layerLabel?: string;       // "repeat p layers"
};

export default function QuantumCircuitDiagram({
  nQubits = 6,
  title = "Quantum Circuit (QAOA)",
  subtitle = "Readable schematic of one QAOA layer",
  layerLabel = "repeat p layers",
}: Props) {
  // Canvas size for the SVG coordinate system
  const W = 1800;
  const H = 980;

  // Layout constants
  const padL = 140;
  const padR = 120;
  const top = 210;
  const wireGap = 95;

  const wireY = (i: number) => top + i * wireGap;

  // Gates x positions
  const xInit = 280;
  const xCost0 = 640;
  const xMix = 1280;
  const xMeas = 1600;

  const gateW = 70;
  const gateH = 58;

  const fontMain = 44;
  const fontSub = 24;

  const box = {
    cost: { x: xCost0 - 120, y: top - 70, w: 540, h: wireGap * (nQubits - 1) + 170 },
    mix:  { x: xMix - 130,  y: top - 70, w: 320, h: wireGap * (nQubits - 1) + 170 },
  };

  // A small "RZZ pattern" pairs (visual only, not exact mapping)
  const pairs: Array<[number, number]> = [];
  for (let i = 0; i < nQubits - 1; i++) pairs.push([i, i + 1]);
  if (nQubits >= 6) pairs.push([0, 2], [3, 5]); // a couple extra diagonals for richness

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="w-full h-full"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <linearGradient id="bgGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="rgba(2,6,23,0.92)" />
          <stop offset="55%" stopColor="rgba(2,6,23,0.72)" />
          <stop offset="100%" stopColor="rgba(15,23,42,0.78)" />
        </linearGradient>

        <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="10" result="blur" />
          <feColorMatrix
            in="blur"
            type="matrix"
            values="
              1 0 0 0 0
              0 1 0 0 0
              0 0 1 0 0
              0 0 0 0.25 0"
            result="glow"
          />
          <feMerge>
            <feMergeNode in="glow" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <filter id="cardShadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="18" stdDeviation="20" floodColor="rgba(0,0,0,0.55)" />
        </filter>
      </defs>

      {/* Background */}
      <rect x="0" y="0" width={W} height={H} rx="40" fill="url(#bgGrad)" />

      {/* Title */}
      <text x={padL} y={92} fill="rgba(255,255,255,0.92)" fontSize={fontMain} fontWeight={700}>
        {title}
      </text>
      <text x={padL} y={132} fill="rgba(148,163,184,0.9)" fontSize={fontSub} fontWeight={500}>
        {subtitle}
      </text>

      {/* Main glass card */}
      <g filter="url(#cardShadow)">
        <rect
          x={90}
          y={170}
          width={W - 180}
          height={H - 260}
          rx="34"
          fill="rgba(255,255,255,0.05)"
          stroke="rgba(255,255,255,0.10)"
        />
      </g>

      {/* Section labels */}
      <g>
        <text x={xInit - 40} y={195} fill="rgba(148,163,184,0.92)" fontSize="20" fontWeight={600}>
          Initialize to |+⟩
        </text>
        <text x={box.cost.x + 14} y={195} fill="rgba(148,163,184,0.92)" fontSize="20" fontWeight={600}>
          Cost U(γ): encode QUBO / Ising (RZZ + penalties)
        </text>
        <text x={box.mix.x + 14} y={195} fill="rgba(148,163,184,0.92)" fontSize="20" fontWeight={600}>
          Mixer U(β)
        </text>
        <text x={xMeas - 40} y={195} fill="rgba(148,163,184,0.92)" fontSize="20" fontWeight={600}>
          Measure
        </text>
      </g>

      {/* Wires + qubit labels */}
      {Array.from({ length: nQubits }).map((_, i) => {
        const y = wireY(i);
        return (
          <g key={i}>
            <text
              x={padL - 30}
              y={y + 8}
              fill="rgba(226,232,240,0.85)"
              fontSize="22"
              fontWeight={600}
              textAnchor="end"
            >
              q{i}
            </text>

            <line
              x1={padL}
              y1={y}
              x2={W - padR}
              y2={y}
              stroke="rgba(226,232,240,0.25)"
              strokeWidth={4}
              strokeLinecap="round"
            />
          </g>
        );
      })}

      {/* Init H gates */}
      {Array.from({ length: nQubits }).map((_, i) => {
        const y = wireY(i) - gateH / 2;
        return (
          <g key={`h-${i}`} filter="url(#softGlow)">
            <rect
              x={xInit}
              y={y}
              width={gateW}
              height={gateH}
              rx="14"
              fill="rgba(255,255,255,0.06)"
              stroke="rgba(255,255,255,0.18)"
              strokeWidth={2}
            />
            <text
              x={xInit + gateW / 2}
              y={y + gateH / 2 + 9}
              fill="rgba(255,255,255,0.92)"
              fontSize="28"
              fontWeight={800}
              textAnchor="middle"
            >
              H
            </text>
          </g>
        );
      })}

      {/* Cost + Mixer containers */}
      <g>
        <rect
          x={box.cost.x}
          y={box.cost.y}
          width={box.cost.w}
          height={box.cost.h}
          rx="24"
          fill="rgba(59,130,246,0.06)"
          stroke="rgba(59,130,246,0.25)"
          strokeWidth={2}
        />
        <rect
          x={box.mix.x}
          y={box.mix.y}
          width={box.mix.w}
          height={box.mix.h}
          rx="24"
          fill="rgba(168,85,247,0.07)"
          stroke="rgba(168,85,247,0.28)"
          strokeWidth={2}
        />

        {/* repeat label */}
        <text
          x={box.cost.x + box.cost.w + 80}
          y={box.cost.y + 28}
          fill="rgba(148,163,184,0.9)"
          fontSize="20"
          fontWeight={700}
        >
          {layerLabel}
        </text>
      </g>

      {/* Cost: RZZ links (visual) */}
      <g filter="url(#softGlow)">
        {pairs.map(([a, b], idx) => {
          const x = xCost0 + (idx % 3) * 140;
          const ya = wireY(a);
          const yb = wireY(b);

          return (
            <g key={`rzz-${idx}`}>
              {/* vertical connector */}
              <line x1={x} y1={ya} x2={x} y2={yb} stroke="rgba(226,232,240,0.55)" strokeWidth={5} />
              {/* end dots */}
              <circle cx={x} cy={ya} r={10} fill="rgba(226,232,240,0.9)" />
              <circle cx={x} cy={yb} r={10} fill="rgba(226,232,240,0.9)" />

              {/* RZZ label box near midpoint */}
              <g>
                <rect
                  x={x - 50}
                  y={(ya + yb) / 2 - 26}
                  width={100}
                  height={52}
                  rx="14"
                  fill="rgba(255,255,255,0.06)"
                  stroke="rgba(255,255,255,0.18)"
                  strokeWidth={2}
                />
                <text
                  x={x}
                  y={(ya + yb) / 2 + 9}
                  fill="rgba(255,255,255,0.92)"
                  fontSize="22"
                  fontWeight={800}
                  textAnchor="middle"
                >
                  RZZ
                </text>
              </g>
            </g>
          );
        })}
      </g>

      {/* Mixer: RX gates */}
      <g filter="url(#softGlow)">
        {Array.from({ length: nQubits }).map((_, i) => {
          const y = wireY(i) - gateH / 2;
          return (
            <g key={`rx-${i}`}>
              <rect
                x={xMix}
                y={y}
                width={120}
                height={gateH}
                rx="14"
                fill="rgba(168,85,247,0.11)"
                stroke="rgba(168,85,247,0.35)"
                strokeWidth={2}
              />
              <text
                x={xMix + 60}
                y={y + gateH / 2 + 9}
                fill="rgba(255,255,255,0.92)"
                fontSize="26"
                fontWeight={900}
                textAnchor="middle"
              >
                Rx(β)
              </text>
            </g>
          );
        })}
      </g>

      {/* Measurement boxes */}
      <g filter="url(#softGlow)">
        {Array.from({ length: nQubits }).map((_, i) => {
          const y = wireY(i) - gateH / 2;
          return (
            <g key={`m-${i}`}>
              <rect
                x={xMeas}
                y={y}
                width={72}
                height={gateH}
                rx="14"
                fill="rgba(255,255,255,0.06)"
                stroke="rgba(255,255,255,0.18)"
                strokeWidth={2}
              />
              <text
                x={xMeas + 36}
                y={y + gateH / 2 + 9}
                fill="rgba(255,255,255,0.9)"
                fontSize="24"
                fontWeight={900}
                textAnchor="middle"
              >
                M
              </text>
            </g>
          );
        })}
      </g>

      {/* Legend footer (big + readable) */}
      <g>
        <rect
          x={110}
          y={H - 130}
          width={W - 220}
          height={74}
          rx="18"
          fill="rgba(255,255,255,0.04)"
          stroke="rgba(255,255,255,0.10)"
        />
        <text x={140} y={H - 84} fill="rgba(226,232,240,0.88)" fontSize="22" fontWeight={650}>
          Output: sample bitstrings → filter infeasible → decode route → keep best cost. Parameters (β, γ) tuned by a classical optimizer.
        </text>
      </g>
    </svg>
  );
}