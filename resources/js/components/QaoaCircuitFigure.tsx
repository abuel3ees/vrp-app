import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

type QaoaCircuitFigureProps = {
  className?: string;
  qubits?: number; // default 6
  showFooter?: boolean;
};

const BASE_W = 1280;
const BASE_H = 560;

const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

export default function QaoaCircuitFigure({
  className,
  qubits = 6,
  showFooter = true,
}: QaoaCircuitFigureProps) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState(1);
  const reduceMotion = useReducedMotion();

  const labels = useMemo(() => Array.from({ length: qubits }, (_, i) => `q${i}`), [qubits]);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    const ro = new ResizeObserver(() => {
      const { width, height } = el.getBoundingClientRect();
      const pad = 28;
      const s = Math.min((width - pad) / BASE_W, (height - pad) / BASE_H);
      setScale(Number.isFinite(s) ? Math.max(0.15, Math.min(1.35, s)) : 1);
    });

    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // === Shift the circuit up a tiny bit (only the circuit group, NOT the classical box/footer) ===
  const CIRCUIT_SHIFT_Y = -30;

  // Layout (SVG coords)
  const topPad = 72;
  const wireLeft = 140;
  const wireRight = BASE_W - 80;

  const initX = 250;

  const costX = 360;
  const costW = 430;

  const mixerX = costX + costW + 44;
  const mixerW = 290;

  // tighten the gap so measurement stays inside the viewBox
  const measGap = 25;
  const measX = mixerX + mixerW + measGap;

  const wireY0 = topPad + 52;
  const wireGap = 58;

  const gateH = 40;

  const hX = initX;
  const rxX = mixerX + 118;
  const mX = measX + 12;

  const yFor = (i: number) => wireY0 + i * wireGap;

  // ===== Classical optimizer block (MOVED DOWN BELOW THE CIRCUIT) =====
  const classW = 560;
  const classH = 72; // slightly shorter so it fits cleanly below the circuit + above footer

  const measPanelRight = measX + 150;
  const classX = clamp(measPanelRight - classW, 44, BASE_W - classW - 44);

  // Footer moved a bit down to make room
  const footerY = BASE_H - 58; // was BASE_H - 78
  const classY = footerY - classH - 14; // sits above footer with a small gap

  // Sparse, readable RZZ couplings
  const couplings: Array<[number, number, number, number]> = [
    [0, 1, costX + 150, 0],
    [1, 2, costX + 260, 1],
    [2, 3, costX + 330, 2],
    [3, 4, costX + 290, 3],
    [4, 5, costX + 170, 4],
    [0, 3, costX + 360, 5],
  ]
    .filter(([a, b]) => a < qubits && b < qubits)
    .map(([a, b, x, idx]) => [a, b, x, idx]);

  // Animation timing (sequence)
  const T = {
    wires: 0.15,
    hStart: 0.25,
    costStart: 0.55,
    mixerStart: 0.95,
    measStart: 1.25,
    sweepCost: 0.55,
    sweepMixer: 0.95,
    classical: 1.45,
    feedback: 1.65,
  };

  // Helpers for arrow anchors (NOTE: circuit is shifted up, classical is not)
  const measCenterX = measX + 75;
  const measCenterY = topPad + 22 + (qubits * wireGap) / 2 + CIRCUIT_SHIFT_Y;

  const costHeadX = costX + costW * 0.52;
  const costHeadY = topPad + 28 + CIRCUIT_SHIFT_Y;

  const mixerHeadX = mixerX + mixerW * 0.5;
  const mixerHeadY = topPad + 28 + CIRCUIT_SHIFT_Y;

  // Classical box anchors
  const classTopX = classX + classW / 2;
  const classTopY = classY;

  const classLeftOutX = classX + 140;
  const classRightOutX = classX + classW - 140;
  const classOutY = classY + 8;

  // Paths (nice curves)
  const pathMeasToClass = `M ${measCenterX} ${measCenterY} C ${measCenterX} ${measCenterY + 52}, ${classTopX} ${
    classTopY - 56
  }, ${classTopX} ${classTopY}`;
  const pathClassToCost = `M ${classLeftOutX} ${classOutY} C ${classLeftOutX} ${classOutY - 120}, ${costHeadX} ${
    costHeadY + 70
  }, ${costHeadX} ${costHeadY}`;
  const pathClassToMixer = `M ${classRightOutX} ${classOutY} C ${classRightOutX} ${classOutY - 120}, ${mixerHeadX} ${
    mixerHeadY + 70
  }, ${mixerHeadX} ${mixerHeadY}`;

  return (
    <div ref={wrapRef} className={`w-full h-full ${className ?? ""}`}>
      {/* TRUE CENTERING LAYER */}
      <div className="w-full h-full grid place-items-center">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, scale: 0.985, y: 10 }}
          animate={reduceMotion ? undefined : { opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.2, 0.9, 0.2, 1] }}
          style={{
            width: BASE_W,
            height: BASE_H,
            transform: `scale(${scale})`,
            transformOrigin: "center",
          }}
        >
          <div className="w-full h-full rounded-[30px] border border-white/10 bg-white/[0.035] shadow-[0_20px_90px_rgba(0,0,0,0.6)] backdrop-blur-xl overflow-hidden">
            <motion.svg
              width={BASE_W}
              height={BASE_H}
              viewBox={`0 0 ${BASE_W} ${BASE_H}`}
              className="block"
              shapeRendering="geometricPrecision"
            >
              <defs>
                <linearGradient id="panel" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="rgba(255,255,255,0.07)" />
                  <stop offset="1" stopColor="rgba(255,255,255,0.02)" />
                </linearGradient>

                <linearGradient id="costGlow" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0" stopColor="rgba(56,189,248,0.14)" />
                  <stop offset="1" stopColor="rgba(56,189,248,0.05)" />
                </linearGradient>

                <linearGradient id="mixerGlow" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0" stopColor="rgba(168,85,247,0.16)" />
                  <stop offset="1" stopColor="rgba(168,85,247,0.06)" />
                </linearGradient>

                <linearGradient id="sweep" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0" stopColor="rgba(255,255,255,0)" />
                  <stop offset="0.5" stopColor="rgba(255,255,255,0.18)" />
                  <stop offset="1" stopColor="rgba(255,255,255,0)" />
                </linearGradient>

                <linearGradient id="classGlow" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0" stopColor="rgba(255,255,255,0.10)" />
                  <stop offset="1" stopColor="rgba(255,255,255,0.03)" />
                </linearGradient>

                <clipPath id="clipCost">
                  <rect x={costX + 1} y={topPad + 6} width={costW - 2} height={qubits * wireGap + 40} rx="22" />
                </clipPath>
                <clipPath id="clipMixer">
                  <rect x={mixerX + 1} y={topPad + 6} width={mixerW - 2} height={qubits * wireGap + 40} rx="22" />
                </clipPath>

                {/* Arrow head */}
                <marker id="arrowHead" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="rgba(226,232,240,0.70)" />
                </marker>
              </defs>

              {/* Background */}
              <rect x="0" y="0" width={BASE_W} height={BASE_H} fill="rgba(10,14,28,0.35)" />
              <rect x="18" y="18" width={BASE_W - 36} height={BASE_H - 36} rx="22" fill="url(#panel)" />

              {/* ==================== CIRCUIT GROUP (shifted up) ==================== */}
              <g transform={`translate(0 ${CIRCUIT_SHIFT_Y})`}>
                {/* Init panel */}
                <rect
                  x={initX - 30}
                  y={topPad + 22}
                  width={120}
                  height={qubits * wireGap}
                  rx="18"
                  fill="rgba(255,255,255,0.03)"
                  stroke="rgba(255,255,255,0.06)"
                />
                <text
                  x={initX - 84 + 18}
                  y={topPad + 14}
                  fill="rgba(203,213,225,0.95)"
                  fontSize="14"
                  fontWeight="800"
                >
                  Initialize to |+⟩
                </text>

                {/* Cost panel (soft breathing glow) */}
                <motion.g
                  animate={reduceMotion ? undefined : { opacity: [0.95, 1, 0.95] }}
                  transition={reduceMotion ? undefined : { duration: 3.8, repeat: Infinity, ease: "easeInOut" }}
                >
                  <rect
                    x={costX}
                    y={topPad + 6}
                    width={costW}
                    height={qubits * wireGap + 44}
                    rx="22"
                    fill="url(#costGlow)"
                  />
                </motion.g>
                <rect
                  x={costX + 1}
                  y={topPad + 7}
                  width={costW}
                  height={qubits * wireGap + 42}
                  rx="22"
                  fill="rgba(0,0,0,0.12)"
                  stroke="rgba(56,189,248,0.22)"
                />
                <text x={costX +7} y={topPad + 30} fill="rgba(224,242,254,0.95)" fontSize="15" fontWeight="900">
                  Cost U(γ): encode QUBO / Ising (RZZ + penalties), Updates γ
                </text>

                {/* Mixer panel (soft breathing glow) */}
                <motion.g
                  animate={reduceMotion ? undefined : { opacity: [0.95, 1, 0.95] }}
                  transition={reduceMotion ? undefined : { duration: 3.8, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
                >
                  <rect
                    x={mixerX}
                    y={topPad + 6}
                    width={mixerW}
                    height={qubits * wireGap + 44}
                    rx="22"
                    fill="url(#mixerGlow)"
                  />
                </motion.g>
                <rect
                  x={mixerX + 1}
                  y={topPad + 7}
                  width={mixerW - 2}
                  height={qubits * wireGap + 42}
                  rx="22"
                  fill="rgba(0,0,0,0.12)"
                  stroke="rgba(168,85,247,0.22)"
                />
                <text x={mixerX + 22} y={topPad + 30} fill="rgba(243,232,255,0.95)" fontSize="15" fontWeight="900">
                  Mixer U(ω), updates ω
                </text>

                {/* Measure panel */}
                <rect
                  x={measX}
                  y={topPad + 22}
                  width={100}
                  height={qubits * wireGap}
                  rx="18"
                  fill="rgba(255,255,255,0.03)"
                  stroke="rgba(255,255,255,0.06)"
                />

                {/* Your request: put the word classical on top of measurement */}
                <text
                  x={measX + 75}
                  y={topPad - 8}
                  textAnchor="middle"
                  fill="rgba(203,213,225,0.90)"
                  fontSize="12"
                  fontWeight="900"
                  letterSpacing="0.10em"
                >
                  CLASSICAL
                </text>

                <text x={measX + 20} y={topPad + 14} fill="rgba(203,213,225,0.95)" fontSize="14" fontWeight="800">
                  Measure
                </text>

                {/* repeat p layers arc */}
                <text x={mixerX - 12} y={topPad - 4} fill="rgba(148,163,184,0.95)" fontSize="13" fontWeight="800">
                  repeat p layers
                </text>
                <path
                  d={`M ${costX + 12} ${topPad - 2} Q ${costX + costW / 2} ${topPad - 18} ${mixerX + mixerW - 12} ${
                    topPad - 2
                  }`}
                  stroke="rgba(148,163,184,0.55)"
                  strokeWidth="2"
                  fill="none"
                />

                {/* SWEEP HIGHLIGHTS */}
                {!reduceMotion && (
                  <>
                    <motion.rect
                      clipPath="url(#clipCost)"
                      x={costX - 120}
                      y={topPad + 6}
                      width={160}
                      height={qubits * wireGap + 44}
                      fill="url(#sweep)"
                      initial={{ opacity: 0 }}
                      animate={{ x: costX + costW + 80, opacity: [0, 0.9, 0] }}
                      transition={{ delay: T.sweepCost, duration: 1.15, ease: [0.2, 0.9, 0.2, 1] }}
                    />
                    <motion.rect
                      clipPath="url(#clipMixer)"
                      x={mixerX - 120}
                      y={topPad + 6}
                      width={160}
                      height={qubits * wireGap + 44}
                      fill="url(#sweep)"
                      initial={{ opacity: 0 }}
                      animate={{ x: mixerX + mixerW + 80, opacity: [0, 0.9, 0] }}
                      transition={{ delay: T.sweepMixer, duration: 1.15, ease: [0.2, 0.9, 0.2, 1] }}
                    />
                  </>
                )}

                {/* Wires + labels */}
                {labels.map((lab, i) => {
                  const y = yFor(i);
                  return (
                    <g key={lab}>
                      <text x={80} y={y + 6} fill="rgba(226,232,240,0.9)" fontSize="16" fontWeight="850">
                        {lab}
                      </text>

                      <motion.line
                        x1={wireLeft}
                        y1={y}
                        x2={wireRight}
                        y2={y}
                        stroke="rgba(226,232,240,0.30)"
                        strokeWidth="2"
                        pathLength={1}
                        initial={reduceMotion ? false : { pathLength: 0, opacity: 0.6 }}
                        animate={reduceMotion ? undefined : { pathLength: 1, opacity: 1 }}
                        transition={{ delay: T.wires, duration: 0.75, ease: "easeInOut" }}
                      />
                    </g>
                  );
                })}

                {/* H gates */}
                {labels.map((_, i) => {
                  const y = yFor(i);
                  return (
                    <Gate
                      key={`h-${i}`}
                      x={hX}
                      y={y - gateH / 2}
                      w={64}
                      h={40}
                      label="H"
                      variant="neutral"
                      delay={T.hStart + i * 0.05}
                      reduceMotion={!!reduceMotion}
                    />
                  );
                })}

                {/* RZZ couplings */}
                {couplings.map(([a, b, x, idx]) => {
                  const y1 = yFor(a);
                  const y2 = yFor(b);
                  const midY = (y1 + y2) / 2;
                  const d = T.costStart + idx * 0.08;

                  return (
                    <g key={`c-${idx}`}>
                      <motion.line
                        x1={x}
                        y1={y1}
                        x2={x}
                        y2={y2}
                        stroke="rgba(226,232,240,0.40)"
                        strokeWidth="2"
                        pathLength={1}
                        initial={reduceMotion ? false : { pathLength: 0, opacity: 0.25 }}
                        animate={reduceMotion ? undefined : { pathLength: 1, opacity: 1 }}
                        transition={{ delay: d, duration: 0.55, ease: "easeInOut" }}
                      />
                      <motion.circle
                        cx={x}
                        cy={y1}
                        r="5"
                        fill="rgba(226,232,240,0.95)"
                        initial={reduceMotion ? false : { opacity: 0, scale: 0.6 }}
                        animate={reduceMotion ? undefined : { opacity: 1, scale: 1 }}
                        transition={{ delay: d + 0.2, duration: 0.25 }}
                      />
                      <motion.circle
                        cx={x}
                        cy={y2}
                        r="5"
                        fill="rgba(226,232,240,0.95)"
                        initial={reduceMotion ? false : { opacity: 0, scale: 0.6 }}
                        animate={reduceMotion ? undefined : { opacity: 1, scale: 1 }}
                        transition={{ delay: d + 0.2, duration: 0.25 }}
                      />

                      <Gate
                        x={x - 42}
                        y={midY - gateH / 2}
                        w={84}
                        h={40}
                        label="RZZ"
                        variant="cost"
                        delay={d + 0.12}
                        reduceMotion={!!reduceMotion}
                      />
                    </g>
                  );
                })}

                {/* Rx(ω) mixer gates */}
                {labels.map((_, i) => {
                  const y = yFor(i);
                  return (
                    <Gate
                      key={`rx-${i}`}
                      x={rxX}
                      y={y - gateH / 2}
                      w={104}
                      h={40}
                      label="Rx(ω)"
                      variant="mixer"
                      delay={T.mixerStart + i * 0.05}
                      reduceMotion={!!reduceMotion}
                    />
                  );
                })}

                {/* Measurement gates */}
                {labels.map((_, i) => {
                  const y = yFor(i);
                  return (
                    <Gate
                      key={`m-${i}`}
                      x={mX}
                      y={y - gateH / 2}
                      w={64}
                      h={40}
                      label="M"
                      variant="neutral"
                      delay={T.measStart + i * 0.04}
                      reduceMotion={!!reduceMotion}
                    />
                  );
                })}
              </g>

              {/* ==================== CLASSICAL OPTIMIZER (DOWN BELOW) ==================== */}
              <motion.g
                initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                transition={{ delay: T.classical, duration: 0.55, ease: [0.2, 0.9, 0.2, 1] }}
              >
                <rect
                  x={classX}
                  y={classY}
                  width={classW}
                  height={classH}
                  rx="18"
                  fill="url(#classGlow)"
                  stroke="rgba(255,255,255,0.14)"
                />
                <text x={classX + 22} y={classY + 28} fill="rgba(226,232,240,0.95)" fontSize="15" fontWeight="900">
                  Classical computer (optimizer loop)
                </text>
                <text x={classX + 22} y={classY + 50} fill="rgba(148,163,184,0.95)" fontSize="13" fontWeight="750">
                  Evaluate objective → update parameters → minimize ⟨H
                  <tspan baselineShift="sub" fontSize="10">
                    C
                  </tspan>
                  ⟩
                </text>
                <text
                  x={classX + classW - 22}
                  y={classY + 40}
                  textAnchor="end"
                  fill="rgba(226,232,240,0.92)"
                  fontSize="13"
                  fontWeight="850"
                >
                  updates (γ, ω)
                </text>
              </motion.g>

              {/* Animated feedback arrows */}
              {!reduceMotion && (
                <>
                  <motion.path
                    d={pathMeasToClass}
                    fill="none"
                    stroke="rgba(226,232,240,0.55)"
                    strokeWidth="2.2"
                    markerEnd="url(#arrowHead)"
                    pathLength={1}
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ delay: T.feedback, duration: 0.85, ease: [0.2, 0.9, 0.2, 1] }}
                  />
                  <motion.path
                    d={pathClassToCost}
                    fill="none"
                    stroke="rgba(56,189,248,0.55)"
                    strokeWidth="2.2"
                    markerEnd="url(#arrowHead)"
                    pathLength={1}
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ delay: T.feedback + 0.25, duration: 0.85, ease: [0.2, 0.9, 0.2, 1] }}
                  />
                  <motion.path
                    d={pathClassToMixer}
                    fill="none"
                    stroke="rgba(168,85,247,0.55)"
                    strokeWidth="2.2"
                    markerEnd="url(#arrowHead)"
                    pathLength={1}
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ delay: T.feedback + 0.35, duration: 0.85, ease: [0.2, 0.9, 0.2, 1] }}
                  />
                </>
              )}

              {/* Footer strip (moved slightly down) */}
              {showFooter && (
                <motion.g
                  initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                  animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                  transition={{ delay: 1.55, duration: 0.45, ease: [0.2, 0.9, 0.2, 1] }}
                >
                  <rect
                    x={44}
                    y={footerY}
                    width={BASE_W - 88}
                    height={44}
                    rx="14"
                    fill="rgba(255,255,255,0.045)"
                    stroke="rgba(255,255,255,0.07)"
                  />
                  <text x={68} y={footerY + 28} fill="rgba(226,232,240,0.88)" fontSize="14" fontWeight="750">
                    Output: sample bitstrings → filter infeasible → decode route → keep best cost.
                    <tspan fill="rgba(148,163,184,0.92)"> Classical loop tunes γ and ω for p-layer QAOA.</tspan>
                  </text>
                </motion.g>
              )}
            </motion.svg>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function Gate({
  x,
  y,
  w,
  h,
  label,
  variant,
  delay,
  reduceMotion,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  variant: "neutral" | "cost" | "mixer";
  delay: number;
  reduceMotion: boolean;
}) {
  const styles =
    variant === "cost"
      ? { fill: "rgba(56,189,248,0.11)", stroke: "rgba(56,189,248,0.32)", text: "rgba(224,242,254,0.96)" }
      : variant === "mixer"
      ? { fill: "rgba(168,85,247,0.12)", stroke: "rgba(168,85,247,0.34)", text: "rgba(243,232,255,0.96)" }
      : { fill: "rgba(255,255,255,0.065)", stroke: "rgba(255,255,255,0.18)", text: "rgba(255,255,255,0.92)" };

  return (
    <motion.g
      initial={reduceMotion ? false : { opacity: 0, y: 8, scale: 0.985 }}
      animate={reduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.42, ease: [0.2, 0.9, 0.2, 1] }}
    >
      <rect x={x} y={y} width={w} height={h} rx="10" fill={styles.fill} stroke={styles.stroke} strokeWidth="2" />
      <text x={x + w / 2} y={y + h / 2 + 6} textAnchor="middle" fill={styles.text} fontSize="16" fontWeight="900">
        {label}
      </text>
    </motion.g>
  );
}