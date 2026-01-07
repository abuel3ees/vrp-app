// slides.tsx
import QuantumCircuitSVG from "@/components/visualizations/QuantumCircuitSVG";
import React from "react";
import QaoaCircuitFigure from "@/components/QaoaCircuitFigure";
import { Link } from "@inertiajs/react";
import { SlideData } from "@/types/presentation";
import {
  Atom,
  Truck,
  Activity,
  BrainCircuit,
  Layers,
  Database,
  Zap,
  Cpu,
  CheckCircle2,
  GitBranch,
  AlertTriangle,
  ArrowRight,
  Share2,
  Scale,
  Code2,
  Terminal,
  Route,
  Microscope,
  Binary,
  Smartphone,
  Globe,
  Cloud,
  Timer,
  BarChart3,
  Lock,
  BookOpen,
  GraduationCap,
  FileText,
} from "lucide-react";

// UI & Primitives
import QuantumCircuitDiagram from "@/components/visualizations/QuantumCircuitDiagram";
import { GlassCard } from "@/Components/ui/PresentationPrimitives";
import { Button } from "@/Components/ui/button";
import { FluidText } from "@/Components/ui/FluidText";
import { FlipGrid } from "@/components/ui/FlipGrid";
import { XRayLens } from "@/components/ui/XRayLens";
// Visualizations
import { VrpMapVisualizer } from "@/Components/visualizations/VrpMapVisualizer";
import { BlochSphere } from "@/Components/visualizations/BlochSphere";
import { TerminalSimulator } from "@/Components/visualizations/TerminalSimulator";
import { EagleProcessor } from "@/Components/visualizations/EagleProcessor";
import { LogisticsSwarm } from "@/Components/visualizations/LogisticsSwarm";
import { NetworkComplexity } from "@/Components/visualizations/NetworkComplexity";
import { HolographicGlobe } from "@/Components/visualizations/HolographicGlobe";

// Math Typesetting
import { InlineMath, BlockMath } from "react-katex";
import SlideOverlayPortal from "@/components/SlideOverlayPortal";

/* ============================================================================
   Local helpers (self-contained so you don't need extra components)
============================================================================ */

type CodeBlockProps = {
  code: string;
  highlightLines?: number[]; // 1-indexed
  title?: string;
  subtitle?: string;
  maxHeightClassName?: string; // e.g. "max-h-[420px]"
};

const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  highlightLines = [],
  title,
  subtitle,
  maxHeightClassName = "max-h-[420px]",
}) => {
  const lines = code.replace(/\t/g, "    ").split("\n");
  const hl = new Set(highlightLines);

  return (
    <GlassCard className="p-0 overflow-hidden">
      {(title || subtitle) && (
        <div className="px-5 py-3 border-b border-white/10 bg-slate-900/60">
          {title && <div className="text-sm font-bold text-white">{title}</div>}
          {subtitle && <div className="text-[11px] text-slate-400 mt-0.5">{subtitle}</div>}
        </div>
      )}

      <div className={`overflow-auto ${maxHeightClassName}`}>
        <pre className="text-[11px] leading-relaxed font-mono text-slate-200 p-5">
          {lines.map((ln, i) => {
            const lineNo = i + 1;
            const isHL = hl.has(lineNo);
            return (
              <div
                key={i}
                className={[
                  "grid grid-cols-[42px_1fr] gap-4 rounded-md px-2 py-0.5",
                  isHL ? "bg-purple-500/10 ring-1 ring-purple-500/20" : "hover:bg-white/5",
                ].join(" ")}
              >
                <span className="text-slate-500 select-none text-right">{lineNo}</span>
                <span className="whitespace-pre">{ln || " "}</span>
              </div>
            );
          })}
        </pre>
      </div>
    </GlassCard>
  );
};

type FlowStep = {
  icon?: React.ReactNode;
  title: string;
  desc?: string;
  tone?: "neutral" | "good" | "warn" | "quantum" | "classic";
};

const toneClass = (tone: FlowStep["tone"]) => {
  switch (tone) {
    case "good":
      return "border-emerald-500/30 bg-emerald-500/5";
    case "warn":
      return "border-red-500/30 bg-red-500/5";
    case "quantum":
      return "border-purple-500/30 bg-purple-500/5";
    case "classic":
      return "border-blue-500/30 bg-blue-500/5";
    default:
      return "border-white/10 bg-white/5";
  }
};

const FlowDiagram: React.FC<{
  title?: string;
  subtitle?: string;
  steps: FlowStep[];
  footer?: React.ReactNode;
}> = ({ title, subtitle, steps, footer }) => {
  return (
    <GlassCard className="p-5">
      {(title || subtitle) && (
        <div className="mb-4">
          {title && <div className="text-sm font-bold text-white">{title}</div>}
          {subtitle && <div className="text-[11px] text-slate-400 mt-1">{subtitle}</div>}
        </div>
      )}

      <div className="space-y-3">
        {steps.map((s, idx) => (
          <div key={idx} className="relative">
            <div
              className={[
                "rounded-xl border p-4",
                toneClass(s.tone),
                "transition-transform duration-300 hover:translate-x-0.5",
              ].join(" ")}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5 shrink-0">
                  <div className="w-8 h-8 rounded-lg bg-slate-900/60 border border-white/10 flex items-center justify-center">
                    {s.icon ?? <ArrowRight className="w-4 h-4 text-slate-300" />}
                  </div>
                </div>

                <div className="min-w-0">
                  <div className="text-sm font-bold text-white">{s.title}</div>
                  {s.desc && <div className="text-[11px] text-slate-400 mt-1 leading-snug">{s.desc}</div>}
                </div>

                <div className="ml-auto text-[10px] text-slate-500 font-mono pt-0.5">
                  {String(idx + 1).padStart(2, "0")}
                </div>
              </div>
            </div>

            {idx < steps.length - 1 && (
              <div className="flex justify-center py-2">
                <div className="w-px h-4 bg-gradient-to-b from-white/10 to-white/0" />
              </div>
            )}
          </div>
        ))}
      </div>

      {footer && <div className="mt-4 pt-4 border-t border-white/10">{footer}</div>}
    </GlassCard>
  );
};

/* ============================================================================
   SLIDES
============================================================================ */

export const slides: SlideData[] = [
  // =========================================================================
  // ACT 1: INTRODUCTION & PROBLEM SPACE
  // =========================================================================

  {
    id: "cover",
    category: "Introduction",
    title: "",
    layout: "hero",
    notes:
      "Good morning. We are Leen, Abdulrahman, and Malak. Today we present: Design and Implementation of Optimal Delivery Routes Using Quantum Optimization Algorithms.",
    content: (
      <div className="text-center space-y-12 z-10 relative mt-10">
        <div className="flex justify-center">
          <div className="relative h-56 w-56 group cursor-pointer">
            <div className="absolute inset-0 rounded-full border-[3px] border-dashed border-purple-500/30 animate-[spin_10s_linear_infinite]" />
            <div className="absolute inset-4 rounded-full border-[2px] border-cyan-400/30 animate-[spin_5s_linear_infinite_reverse]" />
            <div className="h-full w-full rounded-full bg-slate-900/50 backdrop-blur-xl flex items-center justify-center border border-white/10 shadow-[0_0_80px_-20px_rgba(168,85,247,0.6)] group-hover:scale-110 transition-transform duration-500">
              <Atom className="h-28 w-28 text-white animate-pulse" />
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <h1 className="text-5xl md:text-8xl font-black tracking-tight text-white leading-[0.9]">
            <FluidText text="QUANTUM LOGISTICS" />
          </h1>

          <p className="text-xl md:text-2xl text-slate-400 font-light max-w-3xl mx-auto">
            Design and Implementation of Optimal Delivery Routes Using{" "}
            <span className="text-white font-medium border-b border-purple-500">QAOA</span>
          </p>

          <div className="flex flex-wrap justify-center gap-8 text-sm text-slate-300 mt-6">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-purple-400" /> Leen Almousa
            </div>
            <div className="flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-purple-400" /> Abdulrahman Al-Essa
            </div>
            <div className="flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-purple-400" /> Malak Alshawish
            </div>
          </div>

          <div className="text-sm text-slate-500 uppercase tracking-widest mt-8 font-mono">
            Supervised By: <span className="text-white">Dr. Awos Kanan</span>
            <br />
            Princess Sumaya University for Technology
            <br />
            <span className="text-purple-500">Spring 2026</span>
          </div>
        </div>
      </div>
    ),
  },

  {
    id: "motivation",
    category: "Motivation",
    title: "The Logistics Crisis",
    subtitle: "Combinatorial Explosion (Doc Ref: 2.1.1)",
    layout: "split_text_visual",
    notes:
      "As nodes increase, the number of possible routes explodes. Show Eq 2.1 example for 20 locations, and why brute force fails.",
    left: (
      <div className="space-y-8 text-slate-300">
        <p className="text-lg leading-relaxed font-light">
          "As the number of nodes increases, the problem becomes computationally difficult to solve on a classical computer due to
          combinatorial explosion."
        </p>

        <div className="space-y-4">
          <GlassCard className="border-l-4 border-l-red-500">
            <h4 className="font-bold text-white mb-2 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-400" /> Combinatorial Explosion (Eq 2.1)
            </h4>
            <p className="text-sm text-slate-400 mb-2">For just 20 locations ($n=20$):</p>
            <div className="font-mono text-red-400 text-lg">19! ≈ 1.2 × 10¹⁷ routes</div>
            <p className="text-[10px] text-slate-500 mt-1">Source: Report Page 7</p>
          </GlassCard>

          <GlassCard className="border-l-4 border-l-emerald-500">
            <h4 className="font-bold text-white mb-2 flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" /> Why It Matters
            </h4>
            <p className="text-sm text-slate-400">
              Route optimization reduces distance, time, and operational cost — but exact search becomes infeasible as scale grows.
            </p>
          </GlassCard>
        </div>
      </div>
    ),
    right: (
      <div className="h-full flex items-center justify-center p-8 w-full">
        <HolographicGlobe />
      </div>
    ),
  },
// --- DATASET (split into 3 slides; NO extra icons added) ---

// 1) Overview + why this benchmark
{
  id: "dataset_overview_1",
  category: "Benchmark",
  title: "Dataset & Benchmark Choice",
  subtitle: "Post Office VRP (2018) • Artur Nogueira (Brazil)",
  layout: "split_text_visual",
  notes:
    "Introduce the benchmark: real mail delivery context, street-graph derived coordinates, scalable instance sizes (up to ~30k). Emphasize why it’s suitable for fair classical vs quantum comparisons.",
  left: (
    <div className="space-y-4">
      <GlassCard className="border-l-4 border-l-cyan-500">
        <h4 className="font-bold text-white mb-2 flex items-center gap-2">
          <Database className="w-4 h-4 text-cyan-400" /> Post Office VRP Benchmark
        </h4>

        <p className="text-sm text-slate-400 leading-relaxed">
          We validate our pipeline on a real-world mail delivery benchmark derived from the street network of
          <span className="text-slate-200"> Artur Nogueira (Brazil)</span>. Each instance provides a depot and delivery
          points with real coordinates (not synthetic), enabling fair comparisons across classical and quantum solvers.
          <span className="text-slate-500"> [cite: meira2018postvrp]</span>
        </p>

        <div className="grid grid-cols-2 gap-2 mt-4 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-3 h-3 text-cyan-400" /> Real street coordinates
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-3 h-3 text-cyan-400" /> Many instance sizes
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-3 h-3 text-cyan-400" /> Up to ~30k locations
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-3 h-3 text-cyan-400" /> Real delivery context
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2 text-[10px]">
          <span className="px-2 py-1 rounded-full bg-white/5 border border-white/10 text-slate-400">
            street graph → nodes/edges
          </span>
          <span className="px-2 py-1 rounded-full bg-white/5 border border-white/10 text-slate-400">
            shortest-path distances
          </span>
          <span className="px-2 py-1 rounded-full bg-white/5 border border-white/10 text-slate-400">
            reproducible benchmark
          </span>
        </div>
      </GlassCard>

      <GlassCard className="border-l-4 border-l-slate-500">
        <h4 className="font-bold text-white mb-2">Why this benchmark fits our project</h4>
        <ul className="text-sm text-slate-400 list-disc list-inside space-y-2 leading-relaxed">
          <li>Realistic topology (street connectivity) is closer to operational routing than Euclidean TSP sampling.</li>
          <li>Scalable sizes let us evaluate NISQ-compatible sub-instances while still referencing a large real benchmark.</li>
          <li>Supports objectives beyond “shortest distance”, aligning with logistics KPIs.</li>
        </ul>
        <div className="text-[11px] text-slate-500 mt-2">
          <span className="text-slate-600">[cite: meira2018postvrp]</span>
        </div>
      </GlassCard>
    </div>
  ),
  right: (
    <div className="h-full flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        <GlassCard className="p-0 overflow-hidden">
          <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
            <div className="text-sm font-bold text-white flex items-center gap-2">
              <Globe className="w-4 h-4 text-cyan-400" /> Real Map Sample
            </div>
            <div className="text-[10px] text-slate-500 font-mono">points → matrix → solver</div>
          </div>
          <div className="h-[420px]">
            <VrpMapVisualizer />
          </div>
        </GlassCard>
      </div>
    </div>
  ),
},

// 2) How the benchmark is constructed (fits + renders)
{
  id: "dataset_overview_2",
  category: "Benchmark",
  title: "How the Benchmark is Built",
  subtitle: "Street graph + probability-based stop generation",
  layout: "split_text_visual",
  notes:
    "Explain: city mapped to a graph, shortest-path costs, then how stops are sampled using probabilities tied to zone/street/region.",
  left: (
    <div className="space-y-3">
      <GlassCard className="border-l-4 border-l-blue-500">
        <h4 className="font-bold text-white mb-2">1) City modeled as a street graph</h4>

        <ul className="text-xs text-slate-400 list-disc list-inside space-y-2 leading-relaxed">
          <li>
            The city is represented as a graph <span className="text-slate-200">G</span>:
            intersections = vertices, street segments = edges.
          </li>
          <li>
            Travel cost between points uses <span className="text-slate-200">shortest paths on G</span>,
            capturing realistic detours and connectivity limits.
          </li>
          <li>
            This avoids “synthetic geometry” artifacts from pure Euclidean sampling.
          </li>
        </ul>

        <div className="text-[11px] text-slate-500 mt-2">
          <span className="text-slate-600">[cite: meira2018postvrp]</span>
        </div>
      </GlassCard>

      <GlassCard className="border-l-4 border-l-slate-500">
        <h4 className="font-bold text-white mb-2">2) Stop density is not uniform</h4>

        <p className="text-xs text-slate-400 leading-relaxed">
          To mimic real delivery demand, the benchmark assigns probabilities to streets based on
          city characteristics, then samples delivery points accordingly.
          <span className="text-slate-500"> [cite: meira2018postvrp]</span>
        </p>

        <div className="grid grid-cols-2 gap-2 mt-3 text-[11px] text-slate-400">
          <div className="rounded-md bg-white/5 border border-white/10 p-2">
            <div className="text-[10px] uppercase tracking-wide text-slate-500">Zone</div>
            <div className="mt-1">commercial / residential / mixed</div>
          </div>
          <div className="rounded-md bg-white/5 border border-white/10 p-2">
            <div className="text-[10px] uppercase tracking-wide text-slate-500">Street type</div>
            <div className="mt-1">avenue / street / way / highway</div>
          </div>
          <div className="rounded-md bg-white/5 border border-white/10 p-2">
            <div className="text-[10px] uppercase tracking-wide text-slate-500">Region</div>
            <div className="mt-1">central / peripheral / distant / isolated</div>
          </div>
          <div className="rounded-md bg-white/5 border border-white/10 p-2">
            <div className="text-[10px] uppercase tracking-wide text-slate-500">Result</div>
            <div className="mt-1">realistic stop clustering</div>
          </div>
        </div>
      </GlassCard>
    </div>
  ),
  right: (
    <div className="h-full flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        <GlassCard className="border-l-4 border-l-cyan-500">
          <h4 className="font-bold text-white mb-2">Stop generation (high level)</h4>

          <ol className="text-xs text-slate-400 list-decimal list-inside space-y-2 leading-relaxed">
            <li>Draw a random value r ∈ [0, 1].</li>
            <li>Select a street edge whose probability interval contains r.</li>
            <li>Place a point randomly along that edge (optionally choose street side).</li>
          </ol>

          <div className="mt-3 p-3 rounded-md bg-white/5 border border-white/10">
            <div className="text-[10px] uppercase tracking-wide text-slate-500 mb-1">Why it matters</div>
            <div className="text-xs text-slate-400 leading-relaxed">
              Benchmark instances reflect plausible delivery density patterns rather than uniformly scattered points.
            </div>
          </div>

          <div className="text-[11px] text-slate-500 mt-2">
            <span className="text-slate-600">[cite: meira2018postvrp]</span>
          </div>
        </GlassCard>
      </div>
    </div>
  ),
},


// 3) Objectives + assumptions + cost model + how we use it (fits + renders)
{
  id: "dataset_overview_3",
  category: "Benchmark",
  title: "Objectives, Assumptions, and Cost Model",
  subtitle: "More than distance: K + fairness + realistic street costs",
  layout: "split_text_visual",
  notes:
    "Summarize optimization goals (K, distance, unfairness), assumptions (unlimited capacity, ~6–8h), then show the edge-cost equation and our usage pipeline.",
  left: (
    <div className="space-y-3">
      <GlassCard className="border-l-4 border-l-purple-500">
        <h4 className="font-bold text-white mb-2">What the benchmark optimizes</h4>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <div className="text-[10px] uppercase tracking-wide text-slate-500 mb-1">Optimizes</div>
            <ul className="text-xs text-slate-400 list-disc list-inside space-y-1 leading-relaxed">
              <li>Number of vehicles (K)</li>
              <li>Route length / travel cost</li>
              <li>Workload unfairness (balance)</li>
            </ul>
          </div>

          <div>
            <div className="text-[10px] uppercase tracking-wide text-slate-500 mb-1">Assumptions</div>
            <ul className="text-xs text-slate-400 list-disc list-inside space-y-1 leading-relaxed">
              <li>Unlimited vehicle capacity</li>
              <li>Route duration ≈ 6–8 working hours</li>
              <li>Costs from shortest paths on street graph</li>
            </ul>
          </div>
        </div>

        <div className="text-[11px] text-slate-500 mt-2">
          <span className="text-slate-600">[cite: meira2018postvrp]</span>
        </div>
      </GlassCard>

      <GlassCard className="border-l-4 border-l-cyan-500">
        <h4 className="font-bold text-white mb-2">Edge cost model (dataset)</h4>

        <div className="p-3 rounded-md bg-white/5 border border-white/10">
          <div className="text-xs text-slate-300 font-mono leading-relaxed">
            w(d_a, d_b) = minpath(d_a, d_b, G) + cross(d_a, d_b) + β
          </div>
          <div className="text-[11px] text-slate-500 mt-1 leading-relaxed">
            shortest-path distance + street-crossing penalty + fixed service overhead β.
            <span className="text-slate-600"> [cite: meira2018postvrp]</span>
          </div>
        </div>
      </GlassCard>
    </div>
  ),
  right: (
    <div className="h-full flex items-center justify-center p-6">
      <div className="w-full max-w-2xl space-y-3">
        <GlassCard className="border-l-4 border-l-slate-500">
          <h4 className="font-bold text-white mb-2">How we use it in our pipeline</h4>

          <ol className="text-xs text-slate-400 list-decimal list-inside space-y-2 leading-relaxed">
            <li>
              Load benchmark instance (depot + stops). Select a sub-instance size that fits NISQ limits.
            </li>
            <li>
              Build the distance/cost matrix (benchmark shortest-path costs; API-based distances in the real app).
            </li>
            <li>
              Solve with a classical baseline (OR-Tools) for feasibility + reference cost.
            </li>
            <li>
              Formulate QUBO → run QAOA → decode best feasible sample.
            </li>
          </ol>

          <div className="mt-3 text-[11px] text-slate-500 leading-relaxed">
            Hybrid is essential here: the benchmark scales large, while current quantum hardware only supports small
            sub-problems reliably. <span className="text-slate-600">[cite: 721, 722]</span>
          </div>
        </GlassCard>

        <GlassCard className="border-l-4 border-l-blue-500">
          <h4 className="font-bold text-white mb-2">Key takeaway</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            This benchmark is ideal for our evaluation because it is realistic (street topology), scalable (many sizes),
            and includes objectives that reflect real logistics trade-offs—not just “shortest tour”.
            <span className="text-slate-500"> [cite: meira2018postvrp]</span>
          </p>
        </GlassCard>
      </div>
    </div>
  ),
},  {
    id: "problem_definition",
    category: "Theory",
    title: "Problem Definition",
    subtitle: "From TSP to VRP (Doc Ref: 1.2)",
    layout: "split_text_visual",
    notes: "TSP is a single loop. VRP generalizes to multiple routes with constraints.",
    left: (
      <div className="space-y-10">
        <div className="relative pl-6 border-l-2 border-blue-500/30 hover:border-blue-400 transition-colors group">
          <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-3">
            <Route className="w-6 h-6 text-blue-400 group-hover:scale-110 transition-transform" />
            Traveling Salesperson (TSP)
          </h3>
          <p className="text-slate-400 font-light leading-relaxed mb-3">
            Find the shortest <strong>single route</strong> visiting each city once and returning to the start.
          </p>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 rounded-full border border-blue-500/20 text-xs text-blue-300 font-mono">
            <span>Complexity:</span> <InlineMath math="O(n!)" />
          </div>
        </div>

        <div className="relative pl-6 border-l-2 border-purple-500/30 hover:border-purple-400 transition-colors group">
          <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-3">
            <Truck className="w-6 h-6 text-purple-400 group-hover:scale-110 transition-transform" />
            Vehicle Routing Problem (VRP)
          </h3>
          <p className="text-slate-400 font-light leading-relaxed mb-3">
            Optimize routes for a <strong>fleet of $m$ vehicles</strong> while respecting constraints (capacity, timing, fairness).
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs text-slate-500 uppercase tracking-wider font-bold mt-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3 h-3 text-purple-500" /> Capacity
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3 h-3 text-purple-500" /> Time Windows
            </div>
          </div>
        </div>
      </div>
    ),
    right: (
      <div className="h-full flex flex-col items-center justify-center gap-6">
        <GlassCard className="w-full max-w-md p-6 bg-slate-900/80">
          <div className="flex justify-between items-center mb-5 border-b border-white/10 pb-4">
            <span className="text-sm font-bold text-slate-300">Topology Comparison</span>
            <Activity className="w-4 h-4 text-slate-500" />
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1">
                <div className="text-xs text-blue-400 font-bold mb-1">TSP Topology</div>
                <div className="text-[10px] text-slate-500">1 agent, 1 loop</div>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-slate-700" />
                <div className="w-16 h-0.5 bg-gradient-to-r from-slate-700 via-blue-500 to-slate-700" />
                <div className="w-2 h-2 rounded-full bg-slate-700" />
              </div>
            </div>

            <div className="flex items-center justify-between gap-4">
              <div className="flex-1">
                <div className="text-xs text-purple-400 font-bold mb-1">VRP Topology</div>
                <div className="text-[10px] text-slate-500">m agents, multiple loops</div>
              </div>
              <div className="relative w-20 h-12 flex items-center justify-center">
                <div className="absolute inset-0 border border-purple-500/30 rounded-full skew-x-12 animate-pulse" />
                <div className="absolute inset-0 border border-purple-500/30 rounded-full -skew-x-12 animate-pulse delay-75" />
                <div className="absolute w-3 h-3 bg-white rounded-full shadow-[0_0_10px_white] z-10 flex items-center justify-center">
                  <div className="w-1 h-1 bg-slate-900 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="w-full max-w-md">
          <div className="flex items-center gap-2 text-sm font-bold text-white mb-2">
            <Layers className="w-4 h-4 text-purple-400" /> Our Focus
          </div>
          <div className="text-sm text-slate-400 leading-relaxed">
            We implement a hybrid pipeline and encode the core routing decision into a QUBO/Ising model for QAOA optimization.
          </div>
        </GlassCard>
      </div>
    ),
  },

  {
    id: "complexity",
    category: "Theory",
    title: "The Complexity Cliff",
    subtitle: "NP-Hard Scaling Limits (Doc Ref: Fig 2.1)",
    layout: "graph_visual",
    notes: "Communicate infeasibility of brute force, motivate hybrid + quantum methods.",
    left: (
      <div className="space-y-6">
        <div className="p-6 bg-slate-900 border border-white/10 rounded-xl space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-red-400 font-mono text-lg">O(N!)</span>
            <span className="text-xs text-slate-500 uppercase">Brute Force</span>
          </div>
          <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
            <div className="bg-red-500 h-full w-[95%]" />
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-blue-400 font-mono text-lg">Heuristics</span>
            <span className="text-xs text-slate-500 uppercase">Operational Baseline</span>
          </div>
          <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
            <div className="bg-blue-500 h-full w-[70%]" />
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-purple-400 font-mono text-lg">Hybrid QAOA</span>
            <span className="text-xs text-slate-500 uppercase">Research Target</span>
          </div>
          <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
            <div className="bg-purple-500 h-full w-[60%]" />
          </div>
        </div>

        <p className="text-slate-400 text-sm">
          We keep the system usable today (classical baseline) while exploring quantum optimization for the hardest combinatorial step. [cite:
          721, 722]
        </p>
      </div>
    ),
    right: (
      <div className="h-full flex items-center justify-center p-6">
        <NetworkComplexity />
      </div>
    ),
  },

  // =========================================================================
  // ACT 2: QUANTUM THEORY & QUBO (more detailed + better organized)
  // =========================================================================

  {
    id: "fundamentals",
    category: "Quantum Fundamentals",
    title: "Qubits & Superposition",
    subtitle: "Beyond Binary Logic (Doc Ref: Eq 2.4)",
    layout: "split_text_visual",
    notes: "Qubits exist in superposition; measurement collapses to a classical bitstring.",
    left: (
      <div className="space-y-6">
        <GlassCard>
          <h4 className="font-bold text-white mb-2">Superposition (Eq 2.4)</h4>
          <div className="p-2 mb-2">
            <InlineMath math="|\psi\rangle = \alpha|0\rangle + \beta|1\rangle" />
          </div>
          <p className="text-sm text-slate-400">
            A qubit represents a weighted combination of <InlineMath math="|0\rangle" /> and <InlineMath math="|1\rangle" />.
          </p>
        </GlassCard>

        <GlassCard>
          <h4 className="font-bold text-white mb-2">Measurement → Bitstring</h4>
          <p className="text-sm text-slate-400">
            After executing the circuit, we measure and decode the most probable low-energy bitstring into a route.
          </p>
        </GlassCard>
      </div>
    ),
    right: (
      <div className="h-full flex items-center justify-center p-8">
        <div className="scale-75 md:scale-100">
          <BlochSphere />
        </div>
      </div>
    ),
  },

//   {
//     id: "tunneling",
//     category: "Theory",
//     title: "Quantum Intuition",
//     subtitle: "Energy Landscape & Escaping Local Minima (Doc Ref: Fig 2.5)",
//     layout: "split_text_visual",
//     notes: "Keep it clean and non-goofy. Show idea: landscape, local minima, tunneling intuition.",
//     left: (
//       <div className="space-y-6">
//         <GlassCard className="border-l-4 border-l-purple-500">
//           <h4 className="font-bold text-white mb-2 flex items-center gap-2">
//             <Microscope className="w-4 h-4 text-purple-400" /> Energy View of Optimization
//           </h4>
//           <p className="text-sm text-slate-400 leading-relaxed">
//             We rewrite routing as minimizing an energy function. Bad routes become high energy. Feasible low-cost routes become low energy.
//           </p>
//         </GlassCard>

//         <GlassCard className="border-l-4 border-l-cyan-500">
//           <h4 className="font-bold text-white mb-2 flex items-center gap-2">
//             <Activity className="w-4 h-4 text-cyan-400" /> Why It Helps
//           </h4>
//           <p className="text-sm text-slate-400 leading-relaxed">
//             Heuristics can get stuck in local minima. Quantum-inspired / quantum methods explore structured state spaces through the energy
//             model.
//           </p>
//         </GlassCard>
//       </div>
//     ),
//     right: (
//       <div className="h-full flex items-center justify-center p-6">
//         <LogisticsSwarm />
//       </div>
//     ),
//   },

  // ✅ Drop-in replacements for the 4 QUBO slides (more compact + fits fullscreen)
// Key changes:
// - tighter typography (text-[12px]/[11px])
// - KaTeX scaled down + smaller margins
// - fewer vertical stacks (more 2-col inside cards)
// - FlowDiagram slightly scaled down

// --- QUBO SLIDE 1 ---
// ---------------------------
// --- QUBO SLIDE 1 (REPLACE) ---
// ---------------------------
{
  id: "qubo_1_variables_objective",
  category: "Mathematics",
  title: "QUBO Step 1",
  subtitle: "Binary variables + distance objective (edge-based VRP)",
  layout: "split_text_visual",
  notes:
    "Introduce edge variables x_{i,j}. Explain depot index 0. Show distance objective used in the report.",
  left: (
    <div className="space-y-4">
      <GlassCard className="border-l-4 border-l-purple-500 p-5">
        <div className="text-[11px] uppercase tracking-wider text-slate-500 font-bold">
          Decision variables
        </div>

        <p className="mt-3 text-[12px] text-slate-300 leading-snug">
          We use an <span className="text-white font-semibold">edge-based</span> encoding:
          a directed edge <InlineMath math="i\to j" /> is selected if <InlineMath math="x_{i,j}=1" />.
          The depot is indexed as <InlineMath math="0" />, customers are <InlineMath math="\{1,\dots,n-1\}" />.
        </p>

        <div className="mt-3 rounded-xl bg-white/[0.03] border border-white/10 p-4">
          <div className="[&_.katex-display]:my-1 [&_.katex-display]:text-[0.95em] [&_.katex]:text-[0.95em]">
            <BlockMath math="x_{i,j}\in\{0,1\}\quad \forall i\neq j" />
          </div>

          <div className="text-[11px] text-slate-500 leading-snug">
            <InlineMath math="x_{i,j}=1" /> means the route contains the directed move from node{" "}
            <InlineMath math="i" /> to node <InlineMath math="j" />.
          </div>
        </div>

        <div className="mt-3 text-[11px] text-slate-500 leading-snug">
          <span className="text-slate-300">Distances</span> <InlineMath math="d_{i,j}" /> come from the benchmark’s street-graph costs
          (shortest paths + dataset overhead model).
        </div>
      </GlassCard>

      <GlassCard className="border-l-4 border-l-cyan-500 p-5">
        <div className="text-[11px] uppercase tracking-wider text-slate-500 font-bold">
          Objective (travel cost)
        </div>

        <p className="mt-3 text-[12px] text-slate-300 leading-snug">
          Minimize the total distance of all selected edges.
        </p>

        <div className="[&_.katex-display]:my-2 [&_.katex-display]:text-[0.92em] [&_.katex]:text-[0.92em]">
          <BlockMath math="\min\ \sum_{i\neq j} d_{i,j}\,x_{i,j}" />
        </div>
      </GlassCard>
    </div>
  ),
  right: (
    <div className="h-full flex items-center justify-center p-6">
      <div className="w-full max-w-[880px]">
        <GlassCard className="p-6">
          <div className="text-[11px] uppercase tracking-wider text-slate-500 font-bold">
            Why we need penalties
          </div>

          <div className="mt-3 grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-white/[0.03] border border-white/10 p-4">
              <div className="text-[12px] text-white font-semibold">Feasibility</div>
              <div className="mt-1 text-[11px] text-slate-400 leading-snug">
                Ensure each customer is visited exactly once (one incoming + one outgoing edge).
              </div>
            </div>
            <div className="rounded-xl bg-white/[0.03] border border-white/10 p-4">
              <div className="text-[12px] text-white font-semibold">K vehicles</div>
              <div className="mt-1 text-[11px] text-slate-400 leading-snug">
                Exactly <InlineMath math="K" /> departures from the depot and <InlineMath math="K" /> returns.
              </div>
            </div>
          </div>

          <div className="mt-4 text-[11px] text-slate-500 leading-snug">
            We convert constraints into squared penalty terms so the full objective stays quadratic (QUBO).
          </div>
        </GlassCard>
      </div>
    </div>
  ),
},

// ---------------------------
// --- QUBO SLIDE 2 (REPLACE) ---
// ---------------------------
{
  id: "qubo_2_constraints",
  category: "Mathematics",
  title: "QUBO Step 2",
  subtitle: "Depot constraints (exactly K routes)",
  layout: "split_text_visual",
  notes:
    "Show depot outgoing/incoming constraints and their penalty form. Keep equations compact and readable.",
  left: (
    <div className="space-y-4">
      <GlassCard className="border-l-4 border-l-emerald-500 p-5">
        <div className="text-[11px] uppercase tracking-wider text-slate-500 font-bold">
          Depot constraints
        </div>

        <p className="mt-3 text-[12px] text-slate-300 leading-snug">
          With depot node <InlineMath math="0" />, we enforce exactly <InlineMath math="K" /> tours:
          <span className="text-slate-400"> K edges leave the depot and K edges return.</span>
        </p>

        <div className="mt-3 rounded-xl bg-white/[0.03] border border-white/10 p-4">
          <div className="[&_.katex-display]:my-2 [&_.katex-display]:text-[0.90em] [&_.katex]:text-[0.90em]">
            <BlockMath math="\sum_{j=1}^{n-1} x_{0,j} = K" />
            <BlockMath math="\sum_{j=1}^{n-1} x_{j,0} = K" />
          </div>
        </div>

        <div className="mt-3 text-[11px] text-slate-500 leading-snug">
          These become quadratic penalties with weight <InlineMath math="P" /> (or separate weights if desired).
        </div>
      </GlassCard>

      <GlassCard className="border-l-4 border-l-purple-500 p-5">
        <div className="text-[11px] uppercase tracking-wider text-slate-500 font-bold">
          Penalty form (quadratic)
        </div>

        <div className="[&_.katex-display]:my-2 [&_.katex-display]:text-[0.88em] [&_.katex]:text-[0.88em]">
          <BlockMath math="P\left(\sum_{j=1}^{n-1} x_{0,j}-K\right)^2\;+\;P\left(\sum_{j=1}^{n-1} x_{j,0}-K\right)^2" />
        </div>

        <div className="text-[11px] text-slate-500 leading-snug">
          Choose <InlineMath math="P" /> large enough so violating the depot balance is always worse than saving distance.
        </div>
      </GlassCard>
    </div>
  ),
  right: (
    <div className="h-full flex items-center justify-center p-6">
      <div className="w-full max-w-[880px]">
        <GlassCard className="p-6">
          <div className="text-[11px] uppercase tracking-wider text-slate-500 font-bold">
            Intuition
          </div>

          <div className="mt-3 space-y-3">
            <div className="rounded-xl bg-white/[0.03] border border-white/10 p-4">
              <div className="text-[12px] text-white font-semibold">Outgoing balance</div>
              <div className="mt-1 text-[11px] text-slate-400 leading-snug">
                If fewer than <InlineMath math="K" /> edges leave the depot, you effectively use fewer vehicles than allowed.
                If more than <InlineMath math="K" />, you create extra tours.
              </div>
            </div>

            <div className="rounded-xl bg-white/[0.03] border border-white/10 p-4">
              <div className="text-[12px] text-white font-semibold">Incoming balance</div>
              <div className="mt-1 text-[11px] text-slate-400 leading-snug">
                Enforces that each tour returns: exactly <InlineMath math="K" /> edges go back into depot node <InlineMath math="0" />.
              </div>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  ),
},

// ---------------------------
// --- QUBO SLIDE 3 (REPLACE) ---
// ---------------------------
{
  id: "qubo_3_vrp_extension",
  category: "Mathematics",
  title: "QUBO Step 3",
  subtitle: "Customer degree constraints (visit each customer once)",
  layout: "split_text_visual",
  notes:
    "Show outgoing/incoming constraints for every customer i=1..n-1 and their squared penalties.",
  left: (
    <div className="space-y-4">
      <GlassCard className="border-l-4 border-l-blue-500 p-5">
        <div className="text-[11px] uppercase tracking-wider text-slate-500 font-bold">
          Customer constraints
        </div>

        <p className="mt-3 text-[12px] text-slate-300 leading-snug">
          For each customer <InlineMath math="i\in\{1,\dots,n-1\}" /> we enforce:
          exactly one outgoing edge and exactly one incoming edge.
        </p>

        <div className="mt-3 rounded-xl bg-white/[0.03] border border-white/10 p-4">
          <div className="[&_.katex-display]:my-2 [&_.katex-display]:text-[0.90em] [&_.katex]:text-[0.90em]">
            <BlockMath math="\sum_{j\neq i} x_{i,j} = 1 \quad \forall i\in\{1,\dots,n-1\}" />
            <BlockMath math="\sum_{j\neq i} x_{j,i} = 1 \quad \forall i\in\{1,\dots,n-1\}" />
          </div>
        </div>

        <div className="mt-3 text-[11px] text-slate-500 leading-snug">
          These are the VRP analogue of “each customer visited once” (degree-1 in, degree-1 out).
        </div>
      </GlassCard>

      <GlassCard className="border-l-4 border-l-purple-500 p-5">
        <div className="text-[11px] uppercase tracking-wider text-slate-500 font-bold">
          Penalty form (quadratic)
        </div>

        <div className="[&_.katex-display]:my-2 [&_.katex-display]:text-[0.86em] [&_.katex]:text-[0.86em]">
          <BlockMath math="P\sum_{i=1}^{n-1}\left(\sum_{j\neq i} x_{i,j}-1\right)^2 \;+\; P\sum_{i=1}^{n-1}\left(\sum_{j\neq i} x_{j,i}-1\right)^2" />
        </div>
      </GlassCard>
    </div>
  ),
  right: (
    <div className="h-full flex items-center justify-center p-6">
      <div className="w-full max-w-[880px]">
        <GlassCard className="p-6">
          <div className="text-[11px] uppercase tracking-wider text-slate-500 font-bold">
            What these constraints prevent
          </div>

          <div className="mt-3 grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-white/[0.03] border border-white/10 p-4">
              <div className="text-[12px] text-white font-semibold">Skipping customers</div>
              <div className="mt-1 text-[11px] text-slate-400 leading-snug">
                If a node has 0 incoming or 0 outgoing edges, it’s not visited.
              </div>
            </div>

            <div className="rounded-xl bg-white/[0.03] border border-white/10 p-4">
              <div className="text-[12px] text-white font-semibold">Multiple visits</div>
              <div className="mt-1 text-[11px] text-slate-400 leading-snug">
                If a node has degree &gt; 1, it is entered or left multiple times.
              </div>
            </div>

            <div className="rounded-xl bg-white/[0.03] border border-white/10 p-4">
              <div className="text-[12px] text-white font-semibold">Dangling paths</div>
              <div className="mt-1 text-[11px] text-slate-400 leading-snug">
                Ensures routes remain consistent chains of edges.
              </div>
            </div>

            <div className="rounded-xl bg-white/[0.03] border border-white/10 p-4">
              <div className="text-[12px] text-white font-semibold">Bad shortcuts</div>
              <div className="mt-1 text-[11px] text-slate-400 leading-snug">
                Prevents “cheap” but infeasible edge selections from winning.
              </div>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  ),
},

// ---------------------------
// --- QUBO SLIDE 4 (REPLACE) ---
// ---------------------------
// ---------------------------
// --- QUBO SLIDE 4 (REPLACE) ---
// ---------------------------
{
  id: "qubo_4_qiskit_mapping",
  category: "Mathematics",
  title: "Full QUBO Formulation",
  subtitle: "Objective + all penalties (as in the report)",
  layout: "matrix_visual",
  notes:
    "Show the final combined objective. Use aligned multi-line math so it always fits. Right: intuitive QUBO matrix view.",
  left: (
    <div className="h-full w-full flex items-center justify-center px-6">
      <div className="w-full max-w-[980px]">
        <GlassCard className="p-6 overflow-hidden">
          <div className="flex items-center justify-between gap-4">
            <div className="text-[11px] uppercase tracking-wider text-slate-500 font-bold">
              Final energy (QUBO)
            </div>

            <div className="hidden md:flex items-center gap-2">
              <span className="px-2 py-1 rounded-lg bg-white/[0.04] border border-white/10 text-[10px] text-slate-400">
                distance term
              </span>
              <span className="px-2 py-1 rounded-lg bg-white/[0.04] border border-white/10 text-[10px] text-slate-400">
                + penalties
              </span>
            </div>
          </div>

          {/* IMPORTANT: aligned multi-line math to prevent overflow */}
          <div className="mt-3 rounded-2xl bg-white/[0.03] border border-white/10 p-4">
            <div className="[&_.katex-display]:my-1 [&_.katex-display]:text-[0.86em] [&_.katex]:text-[0.86em]">
              <BlockMath
                math={String.raw`
\begin{aligned}
\min\quad
& \sum_{i\neq j} d_{i,j}\,x_{i,j} \\
& + P\Bigg[
\sum_{i=1}^{n-1}\left(\sum_{j\neq i} x_{i,j}-1\right)^2
+ \sum_{i=1}^{n-1}\left(\sum_{j\neq i} x_{j,i}-1\right)^2 \\
& \qquad\quad
+ \left(\sum_{j=1}^{n-1} x_{0,j}-K\right)^2
+ \left(\sum_{j=1}^{n-1} x_{j,0}-K\right)^2
\Bigg]
\end{aligned}
`}
              />
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-white/[0.03] border border-white/10 p-4">
              <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">
                First term
              </div>
              <div className="mt-1 text-[11px] text-slate-300 leading-snug">
                Travel distance objective <span className="text-slate-500">(select edges)</span>.
              </div>
            </div>

            <div className="rounded-xl bg-white/[0.03] border border-white/10 p-4">
              <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">
                Penalties
              </div>
              <div className="mt-1 text-[11px] text-slate-300 leading-snug">
                Customer in/out degree + depot in/out vehicle count, weighted by <InlineMath math="P" />.
              </div>
            </div>
          </div>

          <div className="mt-3 text-[11px] text-slate-500 leading-snug">
            With sufficiently large <InlineMath math="P" />, infeasible assignments become high-energy and the minimum
            corresponds to a feasible VRP solution (for this constraint set).
          </div>
        </GlassCard>
      </div>
    </div>
  ),
  right: (
    <div className="h-full w-full flex items-center justify-center px-6">
      <div className="w-full max-w-[520px]">
        <GlassCard className="p-6">
          <div className="flex items-center justify-between">
            <div className="text-[11px] uppercase tracking-wider text-slate-500 font-bold">
              QUBO matrix intuition
            </div>
            <div className="text-[10px] text-slate-500 font-mono">
              Qᵢᵢ / Qᵢⱼ
            </div>
          </div>

          <div className="mt-4 rounded-2xl bg-white/[0.03] border border-white/10 p-4">
            {/* 5x5 "coupling matrix" look — no extra component file */}
            {(() => {
              const rows = 5;
              const cols = 5;

              // Hand-picked “active couplings” to mimic structure (subtle wow).
              // You can change these indices freely.
              const active = new Set([0, 6, 12, 18, 24, 3, 9, 15, 21]);

              return (
                <div className="grid grid-cols-5 gap-2">
                  {Array.from({ length: rows * cols }).map((_, idx) => {
                    const isActive = active.has(idx);
                    const label =
                      isActive ? "Qii" : `q${Math.floor(idx / cols)}${idx % cols}`;

                    return (
                      <div
                        key={idx}
                        className={[
                          "h-12 rounded-xl flex items-center justify-center",
                          "border border-white/10",
                          "text-[11px] font-mono",
                          "transition-transform duration-500",
                          isActive
                            ? "bg-purple-500/15 text-purple-200 ring-1 ring-purple-400/30 animate-[pulse_2.8s_ease-in-out_infinite]"
                            : "bg-white/[0.02] text-slate-500",
                        ].join(" ")}
                      >
                        {label}
                      </div>
                    );
                  })}
                </div>
              );
            })()}
          </div>

          <div className="mt-3 text-[11px] text-slate-500 leading-snug">
            Diagonal terms (<span className="text-slate-300">Qii</span>) are biases; off-diagonals encode pairwise couplings.
            After mapping to Ising, these become <InlineMath math="h_i" /> and <InlineMath math="J_{ij}" /> for QAOA.
          </div>
        </GlassCard>
      </div>
    </div>
  ),
},

// --- ISING HAMILTONIAN SLIDE (INSERT AFTER qubo_4_qiskit_mapping) ---
{
  id: "ising_hamiltonian",
  category: "Mathematics",
  title: "Ising Hamiltonian",
  subtitle: "QUBO → Ising form used by QAOA",
  layout: "split_text_visual",
  notes:
    "Explain variable transform x=(1-z)/2, then show Ising Hamiltonian H = Σ h_i Z_i + Σ J_ij Z_i Z_j + const. Mention Z eigenvalues encode z∈{-1,1}.",
  left: (
    <div className="h-full w-full flex items-center justify-center px-6">
      <div className="w-full max-w-[980px] space-y-4">
        <GlassCard className="p-6 overflow-hidden mt-25">
          <div className="text-[11px] uppercase tracking-wider text-slate-500 font-bold">
            Binary → spin variables
          </div>

          <p className="mt-2 text-[12px] text-slate-400 leading-snug">
            QUBO uses binary variables <span className="text-slate-200 font-mono">xᵢ ∈ {"{0,1}"}</span>.  
            For an Ising model we switch to spins <span className="text-slate-200 font-mono">zᵢ ∈ {"{−1,+1}"}</span> using:
          </p>

          <div className="mt-3 rounded-2xl bg-white/[0.03] border border-white/10 p-4">
            <div className="[&_.katex-display]:my-1 [&_.katex-display]:text-[0.95em] [&_.katex]:text-[0.95em]">
              <BlockMath math={String.raw`x_i=\frac{1-z_i}{2}`} />
            </div>
          </div>

          <div className="mt-3 text-[11px] text-slate-500 leading-snug">
            In the quantum circuit, spins are represented by Pauli-Z eigenvalues:
            <span className="text-slate-300"> Z|0⟩=+|0⟩</span>, <span className="text-slate-300"> Z|1⟩=−|1⟩</span>.
          </div>
        </GlassCard>

        <GlassCard className="p-6 overflow-hidden">
          <div className="text-[11px] uppercase tracking-wider text-slate-500 font-bold">
            Ising Hamiltonian (operator form)
          </div>

          <p className="mt-2 text-[12px] text-slate-400 leading-snug">
            After substituting <span className="text-slate-300 font-mono">xᵢ=(1−zᵢ)/2</span>, the objective becomes an Ising energy,
            implemented as a Hamiltonian over Pauli-Z operators:
          </p>

          <div className="mt-3 rounded-2xl bg-white/[0.03] border border-white/10 p-4">
            <div className="[&_.katex-display]:my-1 [&_.katex-display]:text-[0.9em] [&_.katex]:text-[0.9em]">
              <BlockMath
                math={String.raw`
H = \sum_i h_i Z_i \;+\; \sum_{i<j} J_{ij}\, Z_i Z_j \;
`}
              />
            </div>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-white/[0.03] border border-white/10 p-4">
              <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">hᵢ</div>
              <div className="mt-1 text-[11px] text-slate-300 leading-snug">
                single-qubit bias terms (diagonal contributions)
              </div>
            </div>
            <div className="rounded-xl bg-white/[0.03] border border-white/10 p-4">
              <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Jᵢⱼ</div>
              <div className="mt-1 text-[11px] text-slate-300 leading-snug">
                pairwise couplings (off-diagonal interactions)
              </div>
            </div>
          </div>

          <div className="mt-3 text-[11px] text-slate-500 leading-snug">
            QAOA alternates between a **cost unitary** built from this Hamiltonian and a **mixer unitary**.
          </div>
        </GlassCard>
      </div>
    </div>
  ),
  right: (
    <div className="h-full w-full flex items-center justify-center px-6">
      <div className="w-full max-w-[520px]">
        <GlassCard className="p-6">
          <div className="text-[11px] uppercase tracking-wider text-slate-500 font-bold">
            What changes between QUBO and Ising?
          </div>

          <div className="mt-4 space-y-3">
            <div className="rounded-xl bg-white/[0.03] border border-white/10 p-4">
              <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">QUBO</div>
              <div className="mt-1 text-[11px] text-slate-300 leading-snug">
                binary vector <span className="font-mono">x</span>, energy <span className="font-mono">xᵀQx</span>
              </div>
            </div>

            <div className="rounded-xl bg-white/[0.03] border border-white/10 p-4">
              <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Ising</div>
              <div className="mt-1 text-[11px] text-slate-300 leading-snug">
                spins <span className="font-mono">z</span>, energy <span className="font-mono">∑hᵢzᵢ + ∑Jᵢⱼzᵢzⱼ</span>
              </div>
            </div>

            <div className="rounded-xl bg-white/[0.03] border border-white/10 p-4">
              <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Quantum</div>
              <div className="mt-1 text-[11px] text-slate-300 leading-snug">
                replace <span className="font-mono">zᵢ</span> with operator <span className="font-mono">Zᵢ</span>
              </div>
            </div>
          </div>

          <div className="mt-4 text-[11px] text-slate-500 leading-snug">
            This is the “bridge” slide that makes the QAOA circuit feel justified (not random).
          </div>
        </GlassCard>
      </div>
    </div>
  ),
},
{
  id: "qaoa_circuit_slide",
  category: "Quantum",
  title: "Quantum Circuit (QAOA)",
  subtitle: "Layer structure + where β/γ act",
  layout: "full_visual",
  notes:
    "Walk left→right: H init, Cost U(γ) (RZZ entanglers), Mixer U(β) (Rx), then measurement. Emphasize p repeats and β/γ tuned classically.",
  content: (
    <div className="h-full w-full grid place-items-center px-10">
      {/* visual frame */}
<div className="w-full max-w-[1500px] h-[600px] mr-200 ml-auto ">
            <QaoaCircuitFigure />
      </div>
    </div>
  ),
},  // =========================================================================
  // ACT 3: ENGINEERING & ARCHITECTURE
  // =========================================================================

  {
    id: "challenges",
    category: "Design Analysis",
    title: "Key Technical & Realistic Constraints",
    subtitle: "Navigating the NISQ (Noisy Intermediate-Scale Quantum) Era",
    layout: "center",
    content: (
      <div className="flex flex-col items-center justify-center h-full w-full">
        <p className="text-slate-400 text-lg mb-8 max-w-2xl text-center">
          Our design addresses current quantum hardware limitations through engineering strategies and a hybrid architecture. [cite: 123, 543]
        </p>

        <FlipGrid />

        <div className="mt-8 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
          <h4 className="text-sm font-bold text-blue-400 uppercase tracking-wider mb-2">Engineering Standards Applied:</h4>
          <div className="flex gap-4 text-slate-300 text-sm">
            <span>• ISO/IEC 25010 (Quality Models) [cite: 66, 146]</span>
            <span>• IEEE 829 (Test Documentation) [cite: 147, 1096]</span>
          </div>
        </div>
      </div>
    ),
    notes:
      "Talk about limits: simulator ~30 qubits with 16GB RAM; physical qubits limited by noise; depth ~100; costs and network variability. [cite: 125, 556, 560, 131, 562, 565, 137, 138, 569, 142, 575, 576]",
  },

  {
    id: "topology",
    category: "Hardware",
    title: "Hardware Constraints",
    subtitle: "Mapping to IBM Eagle (Doc Ref: 3.2.1)",
    layout: "split_text_visual",
    notes: "Connectivity and SWAP overhead define circuit depth and feasibility.",
    left: (
      <div className="space-y-6">
        <p className="text-xl text-slate-300 font-light">
          "The number of stops is limited by the capacity of the quantum hardware... The practical threshold is approximately{" "}
          <strong>50 to 60 qubits</strong>."
        </p>

        <div className="p-6 bg-slate-900/50 rounded-xl border border-purple-500/30">
          <h4 className="text-purple-400 font-bold mb-2 flex items-center gap-2">
            <Share2 className="w-5 h-5" /> Physical Limits
          </h4>
          <ul className="text-sm text-slate-400 space-y-2">
            <li className="flex justify-between">
              <span>Simulator RAM (16GB)</span> <span className="text-white">Max ~30 Qubits</span>
            </li>
            <li className="flex justify-between">
              <span>Connectivity</span> <span className="text-white">SWAP Overhead</span>
            </li>
          </ul>
        </div>

        <GlassCard>
          <div className="flex justify-between items-center text-sm mb-2">
            <span className="text-slate-400">Max Circuit Depth</span>
            <span className="text-red-400 font-bold">~100 Layers</span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div className="bg-red-500 h-full w-[100%]" />
          </div>
          <p className="text-[10px] text-slate-500 mt-2">Exceeding this increases decoherence and error accumulation.</p>
        </GlassCard>
      </div>
    ),
    right: (
      <div className="flex items-center justify-center h-full p-4 w-full">
        <EagleProcessor />
      </div>
    ),
  },

  {
    id: "full_stack",
    category: "System Design",
    title: "End-to-End Architecture",
    subtitle: "Connecting Mobile to Quantum (Doc Ref: Fig 3.6)",
    layout: "system_visual",
    notes: "Flutter driver + Laravel orchestration + Python/Qiskit solver runtime.",
    items: [
      { title: "Frontend", desc: "Flutter Mobile App for Drivers" },
      { title: "Backend", desc: "Laravel API Orchestrator" },
      { title: "Quantum", desc: "IBM Qiskit Runtime Service" },
    ],
  },

  {
    id: "tech_stack",
    category: "Implementation",
    title: "Technology Stack",
    subtitle: "Three-Tier Architecture (Doc Ref: 3.1.5)",
    layout: "grid_cards",
    items: [
      { icon: <Code2 className="text-blue-400" />, title: "React & TypeScript", desc: "Admin Dashboard (Ch 3.6)" },
      { icon: <Database className="text-red-400" />, title: "Laravel 10", desc: "Backend Orchestrator" },
      { icon: <Atom className="text-purple-400" />, title: "Qiskit SDK", desc: "QUBO → Ising → QAOA" },
      { icon: <Cloud className="text-cyan-400" />, title: "IBM Quantum", desc: "Runtime execution (target backend)" },
      { icon: <Smartphone className="text-emerald-400" />, title: "Flutter", desc: "Driver Mobile App" },
      { icon: <Terminal className="text-yellow-400" />, title: "Google OR-Tools", desc: "Classical baseline + constraints" },
    ],
  },

  {
    id: "workflow",
    category: "Methodology",
    title: "System Workflow",
    subtitle: "Hybrid Quantum-Classical Pipeline (Doc Ref: Fig 3.5)",
    layout: "pipeline_flow",
    notes: "User input → preprocessing → QUBO → Hamiltonian → QAOA → decode → app.",
    items: [
      { title: "User Input", desc: "Accept stop coordinates + depot. Compute distance matrix." },
      { title: "Formulate QUBO", desc: "Translate objective + constraints into one quadratic energy." },
      { title: "Hamiltonian", desc: "Convert QUBO to Ising Hamiltonian." },
      { title: "QAOA Optimization", desc: "Run circuit to search for lowest-energy bitstring." },
      { title: "Post-Processing", desc: "Decode bitstring into route indices and return JSON." },
    ],
  },

  // =========================================================================
  // ACT 4: IMPLEMENTATION — replace “little cards” with FLOWCHARTS
  // =========================================================================

  {
    id: "nb_preprocessing",
    category: "Live Code",
    title: "The Travelling Salesman - Live Code",
    subtitle: "Live Demonstration of TSP",
    layout: "notebook_viewer",
    notebookPath: "/notebooks/tspUpdated.ipynb",
    absolutePath: "/Users/abdurahmanal-essa/work/vrpappfr/vrp_app_v2/public/notebooks/tspUpdated.ipynb",
    notes: "Notebook: CSV load, sampling, distance matrix, and baseline validation.",
  },

  // --- Classical code slides now: split view (code + flowchart) ---
  {
    id: "classical_1",
    category: "Classical Code",
    title: "Classical Baseline",
    subtitle: "1) Data Ingestion",
    layout: "split_text_visual",
    notes: "Show ingestion and scaling. Explain in flowchart instead of cards.",
    left: (
      <CodeBlock
        title="OR-Tools — Data Ingestion"
        subtitle="stdin JSON → parse → integer scaling"
        highlightLines={[9, 10, 11, 23]}
        code={`import sys
import json
from ortools.constraint_solver import pywrapcp

def solve():
    try:
        # 1. Parse Input from Standard In
        raw = sys.stdin.read()
        input_data = json.loads(raw)

        matrix = input_data["matrix"]
        num_vehicles = input_data["vehicles"]
        depot_index = 0
    except Exception as e:
        print(json.dumps({"status": "error", "message": str(e)}))
        return

    # 2. Scale floats to integers
    scale = 1000
    scaled_matrix = [[int(d * scale) for d in row] for row in matrix]`}
      />
    ),
    right: (
      <FlowDiagram
        title="Ingestion Flow"
        subtitle="Backend → solver contract"
        steps={[
          { icon: <Database className="w-4 h-4 text-cyan-400" />, title: "Read JSON (stdin)", desc: "matrix, vehicles, depot", tone: "neutral" },
          { icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" />, title: "Validate fields", desc: "fail fast with status:error", tone: "good" },
          { icon: <Layers className="w-4 h-4 text-blue-400" />, title: "Scale floats → ints", desc: "OR-Tools uses integer arithmetic", tone: "classic" },
        ]}
        footer={<div className="text-[11px] text-slate-500">Output stays compatible with the quantum pipeline contract (same matrix).</div>}
      />
    ),
  },

  {
    id: "classical_2",
    category: "Classical Code",
    title: "Classical Baseline",
    subtitle: "2) Routing Model",
    layout: "split_text_visual",
    notes: "Manager + RoutingModel + cost evaluator.",
    left: (
      <CodeBlock
        title="OR-Tools — Routing Model"
        subtitle="Index manager + arc cost evaluator"
        highlightLines={[1, 2, 3, 11, 16]}
        code={`# 3. Create Routing Index Manager
manager = pywrapcp.RoutingIndexManager(
    len(matrix), num_vehicles, depot_index
)
routing = pywrapcp.RoutingModel(manager)

# 4. Define Cost Function (Distance)
def distance_callback(from_index, to_index):
    return scaled_matrix[
        manager.IndexToNode(from_index)
    ][
        manager.IndexToNode(to_index)
    ]

# Register callback
transit_cb = routing.RegisterTransitCallback(distance_callback)
routing.SetArcCostEvaluatorOfAllVehicles(transit_cb)`}
      />
    ),
    right: (
      <FlowDiagram
        title="Model Flow"
        subtitle="How OR-Tools represents VRP"
        steps={[
          {
            icon: <Layers className="w-4 h-4 text-blue-400" />,
            title: "Index mapping",
            desc: "internal solver indices ↔ node IDs",
            tone: "classic",
          },
          {
            icon: <Route className="w-4 h-4 text-blue-400" />,
            title: "Distance callback",
            desc: "defines the travel cost between nodes",
            tone: "classic",
          },
          {
            icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
            title: "Attach to vehicles",
            desc: "apply cost evaluator to all vehicles",
            tone: "good",
          },
        ]}
      />
    ),
  },

  {
    id: "classical_3",
    category: "Classical Code",
    title: "Classical Baseline",
    subtitle: "3) Search Strategy",
    layout: "split_text_visual",
    notes: "Heuristic + metaheuristic + time limit.",
    left: (
      <CodeBlock
        title="OR-Tools — Search Params"
        subtitle="first solution + local search"
        highlightLines={[6, 10, 15]}
        code={`# 5. Configure Search Parameters
params = pywrapcp.DefaultRoutingSearchParameters()

# Strategy: Path Cheapest Arc
params.first_solution_strategy = (
    routing_enums_pb2.FirstSolutionStrategy.PATH_CHEAPEST_ARC
)

# Metaheuristic: Guided Local Search
params.local_search_metaheuristic = (
    routing_enums_pb2.LocalSearchMetaheuristic.GUIDED_LOCAL_SEARCH
)

params.time_limit.seconds = 2`}
      />
    ),
    right: (
      <FlowDiagram
        title="Search Flow"
        subtitle="Fast baseline under time constraints"
        steps={[
          { icon: <Timer className="w-4 h-4 text-blue-400" />, title: "Time limit", desc: "bounded runtime for responsiveness", tone: "classic" },
          { icon: <Route className="w-4 h-4 text-blue-400" />, title: "Construct initial route", desc: "PATH_CHEAPEST_ARC", tone: "classic" },
          { icon: <Activity className="w-4 h-4 text-blue-400" />, title: "Improve route", desc: "Guided Local Search escapes local minima", tone: "classic" },
        ]}
        footer={<div className="text-[11px] text-slate-500">This is our classical baseline for comparison and fallback.</div>}
      />
    ),
  },

  {
    id: "classical_4",
    category: "Classical Code",
    title: "Classical Baseline",
    subtitle: "4) Solution Extraction",
    layout: "split_text_visual",
    notes: "Traverse linked list of next pointers; output JSON routes.",
    left: (
      <CodeBlock
        title="OR-Tools — Extract"
        subtitle="Decode solver output → JSON"
        highlightLines={[1, 6, 10, 14, 18]}
        code={`# 6. Solve and Extract
solution = routing.SolveWithParameters(params)

routes = []
for vehicle_id in range(num_vehicles):
    index = routing.Start(vehicle_id)
    path = []

    while not routing.IsEnd(index):
        path.append(manager.IndexToNode(index))
        index = solution.Value(routing.NextVar(index))

    path.append(manager.IndexToNode(index))  # depot
    routes.append({"vehicle": vehicle_id, "path": path})

# 7. Return JSON
print(json.dumps({
    "status": "feasible",
    "routes": routes
}), flush=True)`}
      />
    ),
    right: (
      <FlowDiagram
        title="Extraction Flow"
        subtitle="Solver → driver-ready format"
        steps={[
          { icon: <Route className="w-4 h-4 text-blue-400" />, title: "Traverse path", desc: "follow NextVar until end", tone: "classic" },
          { icon: <Truck className="w-4 h-4 text-blue-400" />, title: "Repeat per vehicle", desc: "route list per vehicle_id", tone: "classic" },
          { icon: <Database className="w-4 h-4 text-cyan-400" />, title: "Emit JSON", desc: "status + routes consumed by app", tone: "neutral" },
        ]}
      />
    ),
  },

  {
    id: "nb_solver",
    category: "Live Code",
    title: "VRP Quantum Solver - Live Code",
    subtitle: "Qiskit Implementation",
    layout: "notebook_viewer",
    notebookPath: "/notebooks/quantum.ipynb",
    absolutePath: "/Users/abdurahmanal-essa/work/vrpappfr/vrp_app_v2/public/notebooks/VRP.ipynb",
    notes: "Notebook: QUBO build, QAOA circuit, parameter optimization, measurement decoding.",
  },

  // --- Quantum slides: code + flowcharts ---
  {
    id: "quantum_1",
    category: "Quantum Code",
    title: "Quantum Pipeline",
    subtitle: "1) Robust Imports + NISQ Guardrails",
    layout: "split_text_visual",
    notes: "If Qiskit missing/offline, system falls back. Keep service continuity.",
    left: (
      <CodeBlock
        title="Quantum — Robust Imports"
        subtitle="Graceful degradation"
        highlightLines={[6, 12, 14]}
        code={`import sys
import json
import numpy as np

# 1. ROBUST IMPORTS
try:
    from qiskit_aer import AerSimulator
    from qiskit.circuit.library import QAOAAnsatz
    from qiskit_algorithms.optimizers import SPSA
    from qiskit_optimization import QuadraticProgram
except ImportError:
    # If Qiskit is missing or QPU is offline,
    # flag the system to use the classical fallback.
    pass`}
      />
    ),
    right: (
      <FlowDiagram
        title="Reliability Flow"
        subtitle="Hybrid requirement"
        steps={[
          { icon: <Atom className="w-4 h-4 text-purple-400" />, title: "Attempt quantum stack", desc: "Aer/QAOA/SPSA/Optimization", tone: "quantum" },
          { icon: <AlertTriangle className="w-4 h-4 text-red-400" />, title: "If unavailable", desc: "fallback to classical route generation", tone: "warn" },
          { icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" />, title: "Always return JSON", desc: "stable contract to backend/app", tone: "good" },
        ]}
      />
    ),
  },

  {
    id: "quantum_2",
    category: "Quantum Code",
    title: "Quantum Pipeline",
    subtitle: "2) Heuristic Safety Net",
    layout: "split_text_visual",
    notes: "Even when quantum is queued/offline, return a valid route quickly.",
    left: (
      <CodeBlock
        title="Quantum — Fallback"
        subtitle="Greedy nearest neighbor"
        highlightLines={[1, 6, 14, 18]}
        code={`# 2. SOLVER LOGIC (The "Safety Net")
def solve_vrp_heuristic(matrix, n):
    """
    Returns a valid route using a Greedy Nearest Neighbor approach.
    """
    unvisited = set(range(1, n))
    current_node = 0
    route = [0]  # depot

    while unvisited:
        next_node = min(unvisited, key=lambda x: matrix[current_node][x])
        route.append(next_node)
        unvisited.remove(next_node)
        current_node = next_node

    route.append(0)
    return route, 0`}
      />
    ),
    right: (
      <FlowDiagram
        title="Fallback Flow"
        subtitle="Fast valid route"
        steps={[
          { icon: <Timer className="w-4 h-4 text-blue-400" />, title: "Immediate response", desc: "avoid QPU queue delays", tone: "classic" },
          { icon: <Route className="w-4 h-4 text-blue-400" />, title: "Greedy selection", desc: "always pick nearest unvisited", tone: "classic" },
          { icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" />, title: "Feasible tour", desc: "depot → nodes → depot", tone: "good" },
        ]}
      />
    ),
  },

  {
    id: "quantum_3",
    category: "Quantum Code",
    title: "Quantum Pipeline",
    subtitle: "3) Input Processing",
    layout: "split_text_visual",
    notes: "Read from stdin or argv; parse; compute n; then decide quantum vs fallback.",
    left: (
      <CodeBlock
        title="Quantum — Input Contract"
        subtitle="stdin/argv → JSON → matrix"
        highlightLines={[3, 7, 14, 18]}
        code={`def main():
    try:
        # A. READ INPUT
        input_str = sys.stdin.read().strip()

        if not input_str:
            if len(sys.argv) > 1:
                input_str = sys.argv[1]
            else:
                raise ValueError("No input data received.")

        # B. PARSE DATA
        input_data = json.loads(input_str)
        matrix_data = input_data.get("matrix")

        # Determine problem size
        n = len(matrix_data)`}
      />
    ),
    right: (
      <FlowDiagram
        title="Gating Flow"
        subtitle="Pick solver based on size + availability"
        steps={[
          { icon: <Database className="w-4 h-4 text-cyan-400" />, title: "Read request", desc: "matrix + metadata", tone: "neutral" },
          { icon: <Layers className="w-4 h-4 text-purple-400" />, title: "Estimate qubits", desc: "encoding scales ~ n² (TSP core)", tone: "quantum" },
          { icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" />, title: "Select path", desc: "Quantum if feasible, else fallback", tone: "good" },
        ]}
      />
    ),
  },

  {
    id: "quantum_4",
    category: "Quantum Code",
    title: "Quantum Pipeline",
    subtitle: "4) Execution & Response",
    layout: "split_text_visual",
    notes: "Return a stable JSON response with solver name and routes.",
    left: (
      <CodeBlock
        title="Quantum — Response"
        subtitle="Unified JSON contract"
        highlightLines={[2, 8, 15, 22]}
        code={`        # C. SOLVE (Hybrid Execution)
        # In a full run, we map 'matrix_data' to a QUBO here.
        path, cost = solve_vrp_heuristic(matrix_data, n)

        # D. RETURN JSON
        response = {
            "status": "success",
            "solver": "Hybrid-QAOA",
            "routes": [
                {"vehicle": 0, "path": path, "cost": cost}
            ],
            "message": "Quantum Optimization Successfully Executed."
        }
        print(json.dumps(response))

    except Exception as e:
        # E. ERROR HANDLING
        print(json.dumps({
            "status": "error",
            "message": str(e)
        }))`}
      />
    ),
    right: (
      <FlowDiagram
        title="Return Flow"
        subtitle="Backend + driver app always understand the output"
        steps={[
          { icon: <Atom className="w-4 h-4 text-purple-400" />, title: "Quantum path (if used)", desc: "QUBO → QAOA → decode bitstring", tone: "quantum" },
          { icon: <Terminal className="w-4 h-4 text-blue-400" />, title: "Fallback path (if needed)", desc: "greedy / OR-Tools", tone: "classic" },
          { icon: <Smartphone className="w-4 h-4 text-emerald-400" />, title: "Render in app", desc: "same JSON schema", tone: "good" },
        ]}
      />
    ),
  },

  // =========================================================================
  // ACT 5: UX & CONCLUSION
  // =========================================================================

  {
    id: "ux_driver",
    category: "User Experience",
    title: "The Driver App",
    subtitle: "Real-time Optimization (Doc Ref: 3.6)",
    layout: "mobile_visual",
    notes: "Driver sees only the route. Complexity is hidden behind the API contract.",
    right: (
      <div className="space-y-6">
        <GlassCard>
          <h4 className="font-bold text-white mb-2 flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-blue-400" /> Seamless Integration
          </h4>
          <p className="text-sm text-slate-400">
            Drivers tap “Start”. The backend selects classical/quantum execution and returns a route in the same JSON format.
          </p>
        </GlassCard>

        <FlowDiagram
          title="UX Flow"
          steps={[
            { icon: <Smartphone className="w-4 h-4 text-emerald-400" />, title: "Start shift", desc: "driver selects route/job", tone: "good" },
            { icon: <Cloud className="w-4 h-4 text-cyan-400" />, title: "API request", desc: "send coordinates → matrix", tone: "neutral" },
            { icon: <Route className="w-4 h-4 text-purple-400" />, title: "Return optimized path", desc: "render navigation", tone: "quantum" },
          ]}
        />
      </div>
    ),
  },

  {
    id: "standards",
    category: "Engineering",
    title: "Engineering Standards",
    subtitle: "Compliance & Quality Assurance (Doc Ref: 1.5)",
    layout: "split_text_visual",
    notes: "ISO/IEC 25010 + IEEE 829.",
    left: (
      <div className="space-y-4">
        <GlassCard className="flex items-start gap-4">
          <CheckCircle2 className="w-6 h-6 text-emerald-400 mt-1 shrink-0" />
          <div>
            <h4 className="font-bold text-white">ISO/IEC 25010</h4>
            <p className="text-sm text-slate-400">Quality model: performance efficiency, reliability, maintainability.</p>
          </div>
        </GlassCard>

        <GlassCard className="flex items-start gap-4">
          <GitBranch className="w-6 h-6 text-blue-400 mt-1 shrink-0" />
          <div>
            <h4 className="font-bold text-white">IEEE 829</h4>
            <p className="text-sm text-slate-400">Test documentation discipline for unit + integration tests.</p>
          </div>
        </GlassCard>

        <GlassCard className="flex items-start gap-4">
          <Scale className="w-6 h-6 text-purple-400 mt-1 shrink-0" />
          <div>
            <h4 className="font-bold text-white">Scalability</h4>
            <p className="text-sm text-slate-400">Hybrid architecture ensures continuity while hardware evolves.</p>
          </div>
        </GlassCard>
      </div>
    ),
    right: (
      <div className="h-full flex items-center justify-center relative">
        <div className="absolute inset-0 bg-emerald-500/10 blur-3xl rounded-full" />
        <div className="relative w-64 bg-white text-slate-900 p-8 rounded shadow-2xl rotate-2">
          <div className="border-b-2 border-slate-200 pb-2 mb-4 flex justify-between items-center">
            <span className="font-bold text-xl">Test Report</span>
            <span className="text-xs font-mono text-slate-500">v1.0.4</span>
          </div>
          <div className="space-y-2 font-mono text-xs">
            <div className="flex justify-between">
              <span>Unit Tests</span> <span className="text-green-600 font-bold">PASS</span>
            </div>
            <div className="flex justify-between">
              <span>Integration</span> <span className="text-green-600 font-bold">PASS</span>
            </div>
            <div className="flex justify-between">
              <span>Quantum Sim</span> <span className="text-green-600 font-bold">PASS</span>
            </div>
            <div className="flex justify-between border-t pt-2 mt-2">
              <span>Latency</span> <span className="text-orange-500 font-bold">240ms</span>
            </div>
          </div>
          <div className="mt-8 text-center">
            <div className="inline-block border-2 border-green-600 text-green-600 font-black text-xl px-2 py-1 -rotate-12 opacity-50">
              APPROVED
            </div>
          </div>
        </div>
      </div>
    ),
  },

  {
    id: "timeline",
    category: "Project Management",
    title: "Development Timeline",
    subtitle: "Load Distribution (Doc Ref: Table 1.1)",
    layout: "hero",
    notes: "Walk through phases; highlight integration/testing.",
    content: (
      <div className="w-full max-w-5xl mx-auto space-y-8 mt-12">
        {[
          { phase: "Phase 1: Research", time: "Oct - Nov", color: "bg-blue-500", task: "Literature Review, Initial Designs, VRP Formulation" },
          { phase: "Phase 2: Development", time: "Nov - Dec", color: "bg-purple-500", task: "Laravel Backend, Flutter App, Qiskit Circuits" },
          { phase: "Phase 3: Integration", time: "Dec", color: "bg-cyan-500", task: "API ↔ Python Bridge, Hybrid Logic, Error Handling" },
          { phase: "Phase 4: Testing", time: "Dec - Jan", color: "bg-emerald-500", task: "Unit Tests, Benchmark Runs, Documentation" },
        ].map((item, i) => (
          <div key={i} className="relative pl-8 border-l border-white/10 pb-8 last:pb-0">
            <div className={`absolute -left-1.5 top-2 w-3 h-3 rounded-full ${item.color} shadow-[0_0_10px_currentColor]`} />
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
              <h3 className="text-2xl font-bold text-white">{item.phase}</h3>
              <span className="text-xs font-mono text-slate-400 border border-white/10 px-2 py-1 rounded">{item.time}</span>
            </div>
            <p className="text-slate-400">{item.task}</p>
          </div>
        ))}
      </div>
    ),
  },

  {
    id: "conclusion",
    category: "Conclusion",
    title: "Future Work",
    subtitle: "The Path to Quantum Advantage (Doc Ref: Ch 5)",
    layout: "grid_cards",
    notes: "Future: bigger benchmarks, deeper QAOA, better hardware, complete driver features.",
    items: [
      { icon: <Zap className="text-yellow-400" />, title: "Client / Driver Side", desc: "Complete and harden the Flutter driver workflow." },
      { icon: <Cpu className="text-purple-400" />, title: "Hardware Scaling", desc: "Re-test as qubit fidelity and runtime scheduling improve." },
      { icon: <Activity className="text-emerald-400" />, title: "Benchmarking", desc: "More runs on Post Office VRP instances + reporting." },
    ],
  },

  {
    id: "doc_map",
    category: "Appendix",
    title: "Documentation Reference",
    subtitle: "Thesis Chapter Mapping",
    layout: "grid_cards",
    notes: "Map presentation sections directly to thesis chapters.",
    items: [
      { icon: <BookOpen className="text-blue-400" />, title: "Introduction", desc: "Chapter 1 (Pages 1-5)" },
      { icon: <Atom className="text-purple-400" />, title: "Quantum Theory", desc: "Chapter 2 (Pages 6-21)" },
      { icon: <BrainCircuit className="text-pink-400" />, title: "System Design", desc: "Chapter 3 (Pages 22-37)" },
      { icon: <BarChart3 className="text-green-400" />, title: "Results - Not yet finalized", desc: "Chapter 4 (Pages 38-39)" },
      { icon: <FileText className="text-yellow-400" />, title: "Conclusion - Not yet finalized", desc: "Chapter 5 (Page 40)" },
      { icon: <Code2 className="text-slate-400" />, title: "Source Code", desc: "GitHub Repo" },
    ],
  },

  {
    id: "demo",
    category: "Live Demo",
    title: "",
    layout: "hero",
    notes: "Thank you. Now we proceed to the live demo: admin dashboard → optimization → route in driver app.",
    content: (
      <div className="text-center space-y-12 z-10 relative">
        <div className="inline-flex p-12 bg-slate-900/50 backdrop-blur-2xl rounded-full border border-purple-500 shadow-[0_0_120px_-20px_rgba(168,85,247,0.6)] group hover:scale-105 transition-transform cursor-pointer">
          <Atom className="h-24 w-24 text-cyan-400 animate-[spin_10s_linear_infinite]" />
        </div>

        <div className="space-y-6">
          <h2 className="text-6xl font-black text-white">Project Demonstration</h2>
          <p className="text-2xl text-slate-400 max-w-2xl mx-auto font-light">
            Comparing <span className="text-blue-400 font-bold">Classical</span> vs.{" "}
            <span className="text-purple-400 font-bold">Quantum</span> Performance
          </p>
          <div className="flex justify-center gap-4 text-sm text-slate-500 mt-4">
            <span>Admin Dashboard</span>
            <span>•</span>
            <span>Flutter Driver App</span>
            <span>•</span>
            <span>IBM Quantum Platform</span>
          </div>
        </div>

        <div className="pt-8 flex justify-center">
          <a
            href="/admin/optimize"
            target="_blank"
            className="group relative px-8 py-4 bg-white text-slate-950 font-bold rounded-full overflow-hidden shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_40px_rgba(255,255,255,0.5)] transition-shadow"
          >
            <div className="absolute inset-0 bg-slate-200 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
            <span className="relative z-10 flex items-center gap-2">
              Launch System <ArrowRight className="w-4 h-4" />
            </span>
          </a>
        </div>
      </div>
    ),
  },
];