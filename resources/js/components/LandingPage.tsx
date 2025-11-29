// resources/js/components/LandingPage.tsx
"use client"

import React from "react"
import { Link } from "@inertiajs/react"
import { GL } from "@/three/GL"
import { MiniPointCloud } from "@/three/MiniPointCloud"
import { NetworkGlobe } from "@/three/NetworkGlobe"
import {
  Sparkles,
  ArrowRight,
  ChevronDown,
  Map,
  LineChart,
  Clock,
  Activity,
  Zap,
  Brain,
  Route,
  GitBranch,
  Binary,
  PlayCircle,
  Info,
  Compass,
  Code2,
  Keyboard,
  MousePointer2,
  BadgeCheck,
  Terminal,
  Waypoints,
  FileText,
} from "lucide-react"

// -----------------------------------------------------------------------------
// Types & static content
// -----------------------------------------------------------------------------

type HeroStat = {
  label: string
  value: string
  hint?: string
}

type Feature = {
  title: string
  body: string
}

type FaqItem = {
  q: string
  a: string
}

type AlgoStep = {
  id: number
  label: string
  detail: string
  funCaption: string
}

type TimelineStep = {
  title: string
  subtitle: string
  description: string
}

type UnderTheHoodItem = {
  title: string
  subtitle: string
  detail: string
}

type Shortcut = {
  keys: string
  label: string
  context: string
}

// HERO STATS
const HERO_STATS: HeroStat[] = [
  {
    label: "Simulated stops",
    value: "10k+",
    hint: "Enough to sketch a full district in one run.",
  },
  {
    label: "Rebuild time",
    value: "< 5s",
    hint: "You can follow a thought before it disappears.",
  },
  {
    label: "Risk to reality",
    value: "0",
    hint: "This room never touches real drivers or live ops.",
  },
]

// HIGH-LEVEL FEATURES
const FEATURES: Feature[] = [
  {
    title: "Swarm",
    body: "A neon particle field driven by noise & time. It’s your routing logic as a mood ring — calm when balanced, restless when overloaded.",
  },
  {
    title: "Point cloud",
    body: "An animated point cloud that makes clusters, gaps, and quiet zones feel obvious. No map tiles, just structure.",
  },
  {
    title: "Globe",
    body: "A rotating network of nodes and arcs that hints at the multi-city future of this lab. Local experiments, global intuition.",
  },
  {
    title: "Narrative UI",
    body: "Cards, captions, and tiny stories instead of walls of jargon. The visuals teach you how your own graph thinks.",
  },
]

// FAQ
const FAQ: FaqItem[] = [
  {
    q: "What is this page actually for?",
    a: "It’s your routing lab. You open it when you want to experiment without consequences: spin up fake days, tweak penalties, and see how your graph reacts before you ever touch production.",
  },
  {
    q: "Is all this neon just aesthetics?",
    a: "No. The glow is structured. The swarm is about movement and balance, the point cloud is about density and gaps, and the globe is about reach and connectivity. Pretty, but also honest.",
  },
  {
    q: "Can anything here hit real drivers or orders?",
    a: "No. This page is sandbox-only. Runs here stay here. Anything that eventually talks to production will be clearly separated and labelled somewhere else.",
  },
  {
    q: "Will this grow as I add more solvers?",
    a: "Yes. As long as your code emits routes, events, and stops, you can keep wiring those into these visuals. This page is meant to grow with your ideas, not fight them.",
  },
]

// Clarke–Wright Steps
const CLARKE_WRIGHT_STEPS: AlgoStep[] = [
  {
    id: 0,
    label: "Start with lonely trips",
    detail:
      "Begin with one tiny route per customer: Depot → customer → Depot. It’s intentionally wasteful, but gives Clarke–Wright an obvious mess to clean up.",
    funCaption: "Everyone gets their own taxi. Your fuel bill is screaming.",
  },
  {
    id: 1,
    label: "Compute savings for pairs",
    detail:
      "For each pair of customers i and j, compute S(i, j) = d(0, i) + d(0, j) − d(i, j). Large savings mean a big win if those two share a vehicle.",
    funCaption: "It’s basically matchmaking for customers who should share a ride.",
  },
  {
    id: 2,
    label: "Sort by biggest savings first",
    detail:
      "Sort all pairs by S(i, j) descending. The top of this list are merges that you’d be almost irresponsible not to do.",
    funCaption: "Algorithmic FOMO: it goes for the juiciest moves first.",
  },
  {
    id: 3,
    label: "Merge when constraints allow",
    detail:
      "Walk down the savings list. If merging i and j keeps you within capacity and respects constraints, fuse those mini-routes into a longer chain.",
    funCaption: "Single pearls start becoming neon necklaces of customers.",
  },
  {
    id: 4,
    label: "Stop when merges would break rules",
    detail:
      "When every remaining merge violates a rule, you stop. What’s left are routes that look surprisingly smart for such a greedy algorithm.",
    funCaption: "It leaves you with something clean enough to iterate on.",
  },
]

// Dijkstra Steps
const DIJKSTRA_STEPS: AlgoStep[] = [
  {
    id: 0,
    label: "Admit ignorance",
    detail:
      "Every node except the source starts with distance ∞. The source is 0. You don’t pretend to know shortcuts yet.",
    funCaption: "Most of the graph is just question marks at this stage.",
  },
  {
    id: 1,
    label: "Pick the closest unknown node",
    detail:
      "From all nodes you haven’t finalised yet, pick the one with the smallest distance label. This is your current vantage point.",
    funCaption: "You stand where things currently look cheapest.",
  },
  {
    id: 2,
    label: "Relax neighbours",
    detail:
      "For each neighbour v of the current node u, see if dist[u] + weight(u, v) beats dist[v]. If yes, update it. No magic — just better numbers.",
    funCaption: "You keep rewriting sticky notes with shorter distances.",
  },
  {
    id: 3,
    label: "Lock what’s proven",
    detail:
      "Once a node has the smallest distance and is selected, you lock it. That distance will never improve again — that’s the Dijkstra guarantee.",
    funCaption: "The wavefront of certainty moves forward one node at a time.",
  },
  {
    id: 4,
    label: "Stop when destination is locked",
    detail:
      "When your destination node is locked, its distance is final. The shortest path is then reassembled by following breadcrumbs back to the source.",
    funCaption: "The final route is just you reading the trail backwards.",
  },
]

// Timeline of a “fake day”
const TIMELINE: TimelineStep[] = [
  {
    title: "1. Sketch the day",
    subtitle: "Stops, depots, constraints.",
    description:
      "You define a toy dataset: depots, stops, service times, maybe rough time windows. Enough to feel like a real day, not enough to overwhelm you.",
  },
  {
    title: "2. Pick a solver mood",
    subtitle: "Greedy, careful, or experimental.",
    description:
      "You choose Clarke–Wright, Dijkstra-based leg costs, or something you’re prototyping. This page doesn’t judge — it just shows you how each behaves.",
  },
  {
    title: "3. Watch the field respond",
    subtitle: "Particles react instantly.",
    description:
      "The swarm stretches, clusters thicken, edges on the globe reroute. You see whether your new rule made the day calmer or more chaotic.",
  },
  {
    title: "4. Inspect the weird bits",
    subtitle: "Find outliers, not averages.",
    description:
      "You focus on strange routes: single-stop tails, overloaded zones, uncanny gaps. The visuals pull your attention exactly where it should go.",
  },
  {
    title: "5. Keep the intuition",
    subtitle: "Not the screenshot.",
    description:
      "You’re not here to collect pretty images. You’re here to leave with a stronger feel for how your algorithms behave under pressure.",
  },
]

// Under-the-hood items
const UNDER_THE_HOOD: UnderTheHoodItem[] = [
  {
    title: "Particles as state carriers",
    subtitle: "Each point is a tiny narrative.",
    detail:
      "Every particle can encode where it came from, which route it belongs to, or what constraint it’s bumping against. The shader doesn’t just paint — it remembers.",
  },
  {
    title: "Textures instead of arrays",
    subtitle: "GPU over CPU.",
    detail:
      "Positions live inside floating-point textures and are updated via fragment shaders. Heavy lifting stays on the GPU, freeing your React tree to stay smooth.",
  },
  {
    title: "Noise with intent",
    subtitle: "Not random, but purposeful.",
    detail:
      "The periodic noise fields are tuned so motion loops cleanly yet feels organic. You get movement that’s interesting, but never distracting.",
  },
  {
    title: "Deterministic dances",
    subtitle: "Same inputs, same motion.",
    detail:
      "Because patterns are derived from seeded positions and time, running the same scenario later gives the same dance. Perfect when you want to compare ideas honestly.",
  },
]

// shortcuts (conceptual, UI hints)
const SHORTCUTS: Shortcut[] = [
  {
    keys: "Click+drag",
    label: "Rotate the world",
    context: "On the globe, orbit around slowly and see how links fan out.",
  },
  {
    keys: "Scroll",
    label: "Zoom your curiosity",
    context: "Zoom into dense clusters or pull back to see overall balance.",
  },
  {
    keys: "Hover",
    label: "Reveal micro-explanations",
    context: "Many tiny labels and icons reveal more context when hovered.",
  },
  {
    keys: "Tab+Enter",
    label: "Keyboard through CTAs",
    context: "Navigate core actions without breaking your typing flow.",
  },
]

// -----------------------------------------------------------------------------
// Tiny UI pieces
// -----------------------------------------------------------------------------

const Pill = ({ children }: { children: React.ReactNode }) => (
  <span className="inline-flex items-center gap-1 rounded-full border border-pink-500/40 bg-pink-500/15 px-2.5 py-1 text-[11px] font-medium text-pink-100">
    <span className="h-1.5 w-1.5 rounded-full bg-pink-300" />
    {children}
  </span>
)

const GlassCard = ({
  children,
  className = "",
}: {
  children: React.ReactNode
  className?: string
}) => (
  <div
    className={`rounded-2xl border border-white/10 bg-black/55 backdrop-blur-xl ${className}`}
  >
    {children}
  </div>
)

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <p className="text-[11px] font-semibold tracking-[0.18em] text-pink-300 uppercase mb-1">
    {children}
  </p>
)

const Divider = () => (
  <div className="h-px w-full bg-gradient-to-r from-transparent via-white/18 to-transparent my-10" />
)

const Keycap = ({ children }: { children: React.ReactNode }) => (
  <kbd className="inline-flex min-w-[1.4rem] items-center justify-center rounded-md border border-white/15 bg-white/5 px-1.5 py-0.5 text-[10px] font-mono text-white/80">
    {children}
  </kbd>
)

// Clarke–Wright toy SVG (fancier)
const ClarkeWrightSvg: React.FC<{ activeStep: number }> = ({ activeStep }) => {
  const baseRouteClass = "stroke-gray-600 stroke-[1.2] opacity-60"
  const mergeHighlight =
    activeStep >= 2
      ? "stroke-pink-300 stroke-[2.4] opacity-95"
      : "stroke-pink-300 stroke-[2.4] opacity-0"

  const showSavings = activeStep >= 1

  return (
    <svg
      viewBox="0 0 260 150"
      className="w-full h-44 md:h-48"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <radialGradient id="cwDepotGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#facc15" stopOpacity="1" />
          <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="cwNodeGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#f9a8d4" stopOpacity="1" />
          <stop offset="100%" stopColor="#db2777" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* soft background frame */}
      <rect
        x={8}
        y={10}
        width={244}
        height={130}
        rx={14}
        fill="rgba(15,23,42,0.85)"
        stroke="rgba(148,163,184,0.35)"
        strokeWidth={0.8}
      />

      {/* depot */}
      <g>
        <circle cx={70} cy={75} r={16} fill="url(#cwDepotGlow)" opacity={0.9} />
        <circle cx={70} cy={75} r={7} fill="#020617" />
        <circle cx={70} cy={75} r={3.5} fill="#eab308" />
        <text
          x={70}
          y={78}
          fontSize={8}
          textAnchor="middle"
          fill="#fefce8"
          fontFamily="system-ui, -apple-system, BlinkMacSystemFont"
        >
          DEPOT
        </text>
      </g>

      {/* customers */}
      {[
        { x: 190, y: 40, label: "A" },
        { x: 210, y: 82, label: "B" },
        { x: 185, y: 120, label: "C" },
      ].map((n, i) => (
        <g key={i}>
          <circle
            cx={n.x}
            cy={n.y}
            r={13}
            fill="url(#cwNodeGlow)"
            opacity={0.85}
          />
          <circle cx={n.x} cy={n.y} r={5} fill="#f9a8d4" />
          <text
            x={n.x}
            y={n.y + 3}
            fontSize={8}
            textAnchor="middle"
            fill="#fdf2f8"
            fontFamily="system-ui, -apple-system, BlinkMacSystemFont"
          >
            {n.label}
          </text>
        </g>
      ))}

      {/* base routes: depot → each customer */}
      <g
        className={
          activeStep === 0
            ? "opacity-100"
            : activeStep === 1
            ? "opacity-85"
            : "opacity-50"
        }
      >
        <path
          d="M 70 75 L 190 40"
          className={baseRouteClass}
          strokeLinecap="round"
        />
        <path
          d="M 70 75 L 210 82"
          className={baseRouteClass}
          strokeLinecap="round"
        />
        <path
          d="M 70 75 L 185 120"
          className={baseRouteClass}
          strokeLinecap="round"
        />
      </g>

      {/* merged arcs A-B-C depending on step */}
      <g>
        {/* A-B */}
        <path
          d="M 190 40 Q 215 30 210 82"
          className={mergeHighlight}
          fill="none"
          strokeLinecap="round"
        />
        {/* B-C */}
        <path
          d="M 210 82 Q 200 125 185 120"
          className={mergeHighlight}
          fill="none"
          strokeLinecap="round"
        />
      </g>

      {/* savings labels */}
      {showSavings && (
        <g fontFamily="system-ui, -apple-system, BlinkMacSystemFont">
          <text x={150} y={37} fontSize={8} fill="#a5b4fc">
            S(A,B)
          </text>
          <text x={170} y={115} fontSize={8} fill="#a5b4fc">
            S(B,C)
          </text>
          <text x={60} y={34} fontSize={8} fill="#9ca3af">
            Start: 3 mini-routes
          </text>
        </g>
      )}

      <text
        x={18}
        y={24}
        fontSize={8}
        fill="#e5e7eb"
        fontFamily="system-ui, -apple-system, BlinkMacSystemFont"
      >
        Clarke–Wright savings view
      </text>
    </svg>
  )
}

// Dijkstra toy SVG (fancier)
const DijkstraSvg: React.FC<{ activeStep: number }> = ({ activeStep }) => {
  const settledColor = (id: string) =>
    activeStep >= 3 && (id === "S" || id === "B" || id === "E")
      ? "#4ade80"
      : "#f9a8d4"

  const showDistances = activeStep >= 1

  return (
    <svg
      viewBox="0 0 260 150"
      className="w-full h-44 md:h-48"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <radialGradient id="djNodeGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#f9a8d4" stopOpacity="1" />
          <stop offset="100%" stopColor="#1e293b" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* soft frame */}
      <rect
        x={8}
        y={10}
        width={244}
        height={130}
        rx={14}
        fill="rgba(15,23,42,0.85)"
        stroke="rgba(148,163,184,0.35)"
        strokeWidth={0.8}
      />

      {/* edges */}
      <g strokeLinecap="round">
        <path
          d="M 40 80 L 120 40"
          stroke="#4b5563"
          strokeWidth={1.4}
          opacity={0.85}
        />
        <path
          d="M 40 80 L 120 118"
          stroke="#4b5563"
          strokeWidth={1.4}
          opacity={0.85}
        />
        <path
          d="M 120 40 L 210 70"
          stroke="#4b5563"
          strokeWidth={1.4}
          opacity={0.85}
        />
        <path
          d="M 120 118 L 210 70"
          stroke="#4b5563"
          strokeWidth={1.4}
          opacity={0.85}
        />

        {/* shortest path highlight S -> B -> E */}
        <path
          d="M 40 80 L 120 118 L 210 70"
          stroke="#4ade80"
          strokeWidth={activeStep >= 4 ? 3 : 0}
          opacity={activeStep >= 4 ? 0.95 : 0}
        />
      </g>

      {/* labels on edges */}
      {showDistances && (
        <g
          fontSize={8}
          fill="#e5e7eb"
          fontFamily="system-ui, -apple-system, BlinkMacSystemFont"
        >
          <text x={72} y={53}>
            6
          </text>
          <text x={72} y={108}>
            3
          </text>
          <text x={160} y={45}>
            4
          </text>
          <text x={160} y={104}>
            2
          </text>
        </g>
      )}

      {/* nodes */}
      {[
        { x: 40, y: 80, label: "S" },
        { x: 120, y: 40, label: "A" },
        { x: 120, y: 118, label: "B" },
        { x: 210, y: 70, label: "E" },
      ].map((n, i) => (
        <g key={i}>
          <circle
            cx={n.x}
            cy={n.y}
            r={13}
            fill="url(#djNodeGlow)"
            opacity={0.9}
          />
          <circle cx={n.x} cy={n.y} r={5} fill={settledColor(n.label)} />
          <text
            x={n.x}
            y={n.y + 3}
            fontSize={8}
            textAnchor="middle"
            fill="#fdf2f8"
            fontFamily="system-ui, -apple-system, BlinkMacSystemFont"
          >
            {n.label}
          </text>
        </g>
      ))}

      {/* distance labels */}
      {showDistances && (
        <g
          fontSize={8}
          fontFamily="system-ui, -apple-system, BlinkMacSystemFont"
          fill="#a5b4fc"
        >
          <text x={22} y={102}>
            dist(S)=0
          </text>
          <text x={122} y={26}>
            dist(A)=?
          </text>
          <text x={124} y={135}>
            dist(B)=?
          </text>
          <text x={188} y={92}>
            dist(E)=?
          </text>
        </g>
      )}

      <text
        x={18}
        y={24}
        fontSize={8}
        fill="#e5e7eb"
        fontFamily="system-ui, -apple-system, BlinkMacSystemFont"
      >
        Dijkstra shortest-path view
      </text>
    </svg>
  )
}

// -----------------------------------------------------------------------------
// Main Landing Page
// -----------------------------------------------------------------------------

const LandingPage: React.FC = () => {
  const [openFaq, setOpenFaq] = React.useState<string | null>(FAQ[0]?.q ?? null)
  const [cwStep, setCwStep] = React.useState<number>(0)
  const [djStep, setDjStep] = React.useState<number>(0)

  const cwActive = CLARKE_WRIGHT_STEPS[cwStep]
  const djActive = DIJKSTRA_STEPS[djStep]

  const cwProgress = ((cwStep + 1) / CLARKE_WRIGHT_STEPS.length) * 100
  const djProgress = ((djStep + 1) / DIJKSTRA_STEPS.length) * 100

  return (
    <div className="min-h-screen bg-black text-white flex flex-col relative overflow-hidden overflow-x-hidden">
      {/* ambient blobs */}
      <div className="pointer-events-none absolute -top-40 -left-32 h-80 w-80 rounded-full bg-pink-500/25 blur-[110px]" />
      <div className="pointer-events-none absolute -bottom-48 -right-40 h-96 w-96 rounded-full bg-purple-500/25 blur-[130px]" />
      <div className="pointer-events-none absolute top-1/3 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-pink-400/10 blur-[90px]" />

      {/* subtle scanlines */}
      <div className="pointer-events-none fixed inset-0 opacity-[0.06] mix-blend-soft-light bg-[linear-gradient(to_bottom,rgba(255,255,255,0.16)_1px,transparent_1px)] bg-[length:100%_2px]" />

      {/* HEADER */}
      <header className="relative z-30 flex items-center justify-between px-6 md:px-12 py-4 md:py-5">
        <div className="flex items-center gap-3">
          <div className="relative h-9 w-9 rounded-2xl bg-black/80 border border-pink-400/70 flex items-center justify-center overflow-hidden shadow-[0_0_26px_rgba(236,72,153,0.7)]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_0,rgba(244,114,182,0.45),transparent_60%),radial-gradient(circle_at_80%_100,rgba(147,51,234,0.6),transparent_60%)]" />
            <span className="relative z-10 text-[10px] font-mono tracking-[0.22em] text-pink-50">
              VRP
            </span>
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-sm md:text-base font-semibold tracking-tight flex items-center gap-1.5">
              Your Routing Lab
              <Sparkles className="h-3.5 w-3.5 text-pink-300" />
            </span>
            <span className="text-[11px] text-pink-100/85">
              A calm neon room where your routes learn to behave.
            </span>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-6 text-xs text-white/70">
          <a href="#hero" className="hover:text-pink-200 transition-colors">
            Overview
          </a>
          <a href="#views" className="hover:text-pink-200 transition-colors">
            Views
          </a>
          <a href="#algos" className="hover:text-pink-200 transition-colors">
            Algorithms
          </a>
          <a href="#timeline" className="hover:text-pink-200 transition-colors">
            Flow
          </a>
          <a href="#under" className="hover:text-pink-200 transition-colors">
            Under the hood
          </a>
          <a href="#faq" className="hover:text-pink-200 transition-colors">
            FAQ
          </a>
        </nav>

        <div className="flex items-center gap-2 md:gap-3">
          <Link
            href="/admin/instances"
            className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-xs md:text-sm font-medium text-white hover:bg-white/10 transition-colors"
          >
            <Compass className="h-3.5 w-3.5" />
            <span>Recent runs</span>
          </Link>
          <Link
            href="/admin/instances/create"
            className="inline-flex items-center gap-1.5 rounded-full border border-pink-400/55 bg-pink-500/15 px-3 py-1.5 text-[11px] md:text-xs font-medium text-pink-100 hover:bg-pink-500/25 transition-colors"
          >
            <span>New test</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </header>

      {/* MAIN */}
      <main className="relative z-20 flex-1 flex flex-col">
        {/* HERO */}
        <section
          id="hero"
          className="px-6 md:px-12 pt-4 md:pt-8 pb-10 md:pb-14 flex flex-col lg:flex-row gap-8 lg:gap-10"
        >
          {/* left */}
          <div className="w-full lg:w-1/2 flex flex-col justify-center gap-6">
            <div className="flex flex-wrap gap-2">
              <Pill>Your universe</Pill>
              <Pill>Sandbox, not production</Pill>
            </div>

            <div className="space-y-4">
              <h1 className="text-[2.4rem] sm:text-[2.9rem] md:text-[3.4rem] lg:text-[3.6rem] font-semibold tracking-tight leading-[1.06]">
                Watch your{" "}
                <span className="text-pink-300">deliveries</span>{" "}
                fall into place — in a world that only answers to you.
              </h1>
              <p className="text-sm md:text-base text-white/82 max-w-xl">
                This isn’t a KPI dashboard. It’s a routing lab. Spin up a fake
                day, change the rules, and let a neon field tell you when your
                logic feels clean — and when it quietly falls apart.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-2">
              <Link
                href="/admin/instances/create"
                className="inline-flex items-center justify-center rounded-full bg-pink-500 px-5 py-2.5 text-sm font-medium text-black shadow-[0_0_42px_rgba(236,72,153,0.8)] hover:bg-pink-400 transition-colors"
              >
                <span>Start a new universe</span>
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <a
                href="#views"
                className="inline-flex items-center justify-center rounded-full border border-white/20 px-5 py-2.5 text-sm font-medium text-white/85 hover:bg-white/5 transition-colors"
              >
                <Map className="h-4 w-4 mr-2" />
                <span>Explore the views</span>
              </a>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-4 text-xs text-white/65 max-w-2xl">
              {HERO_STATS.map((stat) => (
                <div key={stat.label} className="space-y-1">
                  <div className="text-base md:text-lg font-semibold text-pink-100">
                    {stat.value}
                  </div>
                  <div>{stat.label}</div>
                  {stat.hint && (
                    <p className="text-[11px] leading-snug text-white/45">
                      {stat.hint}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* right: GL hero */}
          <div className="w-full lg:w-1/2">
            <GlassCard className="relative h-[50vh] md:h-[56vh] lg:h-full flex items-stretch justify-stretch overflow-hidden border-pink-500/40 bg-black/70">
              <div className="absolute inset-0">
                <GL hovering={false} />
              </div>
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-l from-black/65 via-black/30 to-transparent" />
              <div className="pointer-events-none absolute bottom-3 left-4 text-[11px] text-white/65 flex items-center gap-2">
                <LineChart className="h-3.5 w-3.5 text-pink-300" />
                <span>Neon swarm: a live mood ring for your routing logic.</span>
              </div>
            </GlassCard>
          </div>
        </section>

        {/* context strip */}
        <section className="px-6 md:px-12 pb-8">
          <GlassCard className="px-4 md:px-5 py-4 bg-black/75">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 text-[11px] text-white/70">
              <div className="flex items-center gap-2">
                <Activity className="h-3.5 w-3.5 text-pink-300" />
                <span>
                  This page is your{" "}
                  <span className="font-semibold text-pink-100">calm mode</span>
                  . No alerts, no pressure — just space to observe and adjust.
                </span>
              </div>
              <div className="flex items-center gap-2 text-white/55">
                <Clock className="h-3.5 w-3.5 text-pink-300" />
                <span>Runs here stay in the lab. Nothing ships itself.</span>
              </div>
            </div>
          </GlassCard>
        </section>

        <Divider />

        {/* VIEWS: swarm + point cloud + globe */}
        <section
          id="views"
          className="px-6 md:px-12 pb-10 md:pb-12 flex flex-col gap-6"
        >
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <SectionLabel>Visual views</SectionLabel>
              <h2 className="text-xl md:text-2xl font-semibold tracking-tight">
                One brain, three lenses.
              </h2>
              <p className="text-xs md:text-sm text-white/75 max-w-md mt-2">
                The swarm, point cloud, and globe all stare at the same data.
                They just tell different stories about where your attention
                should go.
              </p>
            </div>
          </div>

          <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr] items-stretch">
            {/* point cloud side */}
            <div className="space-y-3">
              <MiniPointCloud />
              <div className="flex items-center justify-between text-[11px] text-white/70">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-pink-300" />
                    <span>Stops & clusters</span>
                  </span>
                  <span className="inline-flex items-center gap-1 text-white/55">
                    <span className="h-2 w-6 rounded-full bg-gradient-to-r from-pink-400 to-purple-500" />
                    <span>Implied flows</span>
                  </span>
                </div>
                <span className="text-pink-200/80 flex items-center gap-1">
                  <Zap className="h-3 w-3" />
                  <span>Animated point cloud</span>
                </span>
              </div>
            </div>

            {/* globe side */}
            <GlassCard className="p-4 md:p-5 bg-black/80 flex flex-col justify-between">
              <NetworkGlobe />
              <div className="mt-3 space-y-2 text-[11px] text-white/75">
                <p className="text-[11px] uppercase tracking-[0.16em] text-pink-300">
                  World view
                </p>
                <p className="text-[12px] text-white/80 leading-relaxed">
                  The globe quietly reminds you that this same logic can span
                  more than one city. Nodes pulse, links breathe, and the world
                  turns slowly — like your backlog of experiments orbiting
                  future networks.
                </p>
              </div>
            </GlassCard>
          </div>

          {/* features under views */}
          <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((f) => (
              <GlassCard key={f.title} className="p-4 bg-black/75 flex flex-col gap-2">
                <h3 className="text-sm font-semibold">{f.title}</h3>
                <p className="text-[12px] text-white/82 leading-relaxed">
                  {f.body}
                </p>
              </GlassCard>
            ))}
          </div>
        </section>

        <Divider />

        {/* ALGORITHM PLAYGROUND: Clarke–Wright + Dijkstra */}
        <section
          id="algos"
          className="px-6 md:px-12 pb-10 md:pb-12 bg-black/95"
        >
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
            <div>
              <SectionLabel>Algorithm playground</SectionLabel>
              <h2 className="text-xl md:text-2xl font-semibold tracking-tight">
                Clarke–Wright & Dijkstra, as tools and characters.
              </h2>
            </div>
            <p className="text-xs md:text-sm text-white/70 max-w-md">
              Each block is half visual story, half pseudo-code. Enough to make
              the idea stick in your head, not enough to feel like a textbook.
            </p>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            {/* Clarke–Wright card */}
            <GlassCard className="p-4 md:p-5 bg-black/80 flex flex-col gap-4">
              {/* header */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="inline-flex items-center gap-2 mb-1">
                    <span className="h-7 w-7 rounded-xl bg-black/80 border border-pink-400/45 flex items-center justify-center text-pink-300">
                      <Route className="h-4 w-4" />
                    </span>
                    <span className="text-[11px] uppercase tracking-[0.15em] text-pink-300">
                      Clarke–Wright
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold">
                    From lonely trips to neon necklaces.
                  </h3>
                  <p className="text-[12px] text-white/80 mt-1 max-w-md">
                    A savings-based VRP heuristic: start embarrassingly wasteful,
                    then greedily merge routes until the day looks sane.
                  </p>
                </div>
                <Brain className="h-5 w-5 text-pink-300/80" />
              </div>

              {/* layout: left = SVG, right = steps + pseudo-code */}
              <div className="grid gap-4 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1.1fr)] items-stretch">
                <div className="space-y-2">
                  <ClarkeWrightSvg activeStep={cwStep} />
                  <div className="flex items-center justify-between text-[11px] text-white/70">
                    <span className="flex items-center gap-1">
                      <Binary className="h-3 w-3 text-pink-300" />
                      <span>S(i,j) = d(0,i) + d(0,j) − d(i,j)</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <PlayCircle className="h-3.5 w-3.5 text-pink-300" />
                      <span>
                        Step {cwStep + 1} / {CLARKE_WRIGHT_STEPS.length}
                      </span>
                    </span>
                  </div>
                  {/* progress bar */}
                  <div className="mt-1 h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-pink-400 via-fuchsia-400 to-purple-400"
                      style={{ width: `${cwProgress}%` }}
                    />
                  </div>
                </div>

                {/* right: step & pseudo-code */}
                <div className="flex flex-col gap-2">
                  {/* steps chips */}
                  <div className="flex flex-wrap gap-1.5 mb-1">
                    {CLARKE_WRIGHT_STEPS.map((s, idx) => {
                      const active = s.id === cwStep
                      return (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => setCwStep(idx)}
                          className={`px-2.5 py-0.5 rounded-full border text-[10px] transition-colors ${
                            active
                              ? "border-pink-400/80 bg-pink-500/20 text-pink-100"
                              : "border-white/15 bg-black/60 text-white/70 hover:border-pink-400/50"
                          }`}
                        >
                          {s.id + 1}. {s.label.split("–")[0].trim()}
                        </button>
                      )
                    })}
                  </div>

                  {/* active step text */}
                  <div className="rounded-xl border border-pink-500/30 bg-pink-500/10 px-3 py-2 text-[11px] text-pink-100/95">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <GitBranch className="h-3 w-3" />
                      <span className="font-semibold">{cwActive.label}</span>
                    </div>
                    <p className="text-[11px] text-pink-50/90 leading-relaxed mt-0.5">
                      {cwActive.detail}
                    </p>
                    <p className="mt-1 text-[10px] text-pink-100/80 italic">
                      {cwActive.funCaption}
                    </p>
                  </div>

                  {/* pseudo-code */}
                  <div className="mt-1 rounded-xl border border-white/15 bg-black/75 p-2.5">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <div className="flex items-center gap-1.5">
                        <Code2 className="h-3 w-3 text-pink-300" />
                        <span className="text-[10px] font-semibold text-white/85">
                          Pseudo-code sketch
                        </span>
                      </div>
                      <span className="text-[9px] text-white/45">
                        O(n² log n) on pairs
                      </span>
                    </div>
                    <pre className="text-[10px] leading-snug text-pink-100/90 font-mono whitespace-pre-wrap">
{`start with one route [0 → i → 0] for each customer i
compute savings S(i,j) for all pairs
sort all pairs by S(i,j) descending
for each (i,j) in sorted order:
  if merging i and j respects constraints:
    fuse their routes into one
return all merged routes
`}
                    </pre>
                  </div>
                </div>
              </div>

              {/* navigation buttons */}
              <div className="mt-2 flex items-center justify-between gap-2 text-[11px]">
                <button
                  type="button"
                  onClick={() =>
                    setCwStep((prev) =>
                      prev === 0 ? CLARKE_WRIGHT_STEPS.length - 1 : prev - 1
                    )
                  }
                  className="inline-flex items-center gap-1 rounded-full border border-white/20 px-3 py-1 text-white/80 hover:bg-white/5 transition-colors"
                >
                  <span>Previous</span>
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setCwStep((prev) =>
                      prev === CLARKE_WRIGHT_STEPS.length - 1 ? 0 : prev + 1
                    )
                  }
                  className="inline-flex items-center gap-1 rounded-full border border-pink-400/60 bg-pink-500/15 px-3 py-1 text-pink-100 hover:bg-pink-500/25 transition-colors"
                >
                  <span>Next</span>
                  <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            </GlassCard>

            {/* Dijkstra card */}
            <GlassCard className="p-4 md:p-5 bg-black/80 flex flex-col gap-4">
              {/* header */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="inline-flex items-center gap-2 mb-1">
                    <span className="h-7 w-7 rounded-xl bg-black/80 border border-pink-400/45 flex items-center justify-center text-pink-300">
                      <Brain className="h-4 w-4" />
                    </span>
                    <span className="text-[11px] uppercase tracking-[0.15em] text-pink-300">
                      Dijkstra
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold">
                    A wavefront of certainty through your graph.
                  </h3>
                  <p className="text-[12px] text-white/80 mt-1 max-w-md">
                    Classic shortest path logic. No magic, just relentless
                    relaxation of distances and a guarantee that it never lies.
                  </p>
                </div>
                <Info className="h-5 w-5 text-pink-300/80" />
              </div>

              {/* layout: left = SVG, right = steps + pseudo-code */}
              <div className="grid gap-4 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1.1fr)] items-stretch">
                <div className="space-y-2">
                  <DijkstraSvg activeStep={djStep} />
                  <div className="flex items-center justify-between text-[11px] text-white/70">
                    <span className="flex items-center gap-1">
                      <Binary className="h-3 w-3 text-pink-300" />
                      <span>Greedy + proof it stabilises correctly.</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <PlayCircle className="h-3.5 w-3.5 text-pink-300" />
                      <span>
                        Step {djStep + 1} / {DIJKSTRA_STEPS.length}
                      </span>
                    </span>
                  </div>
                  {/* progress bar */}
                  <div className="mt-1 h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-400 via-pink-400 to-purple-400"
                      style={{ width: `${djProgress}%` }}
                    />
                  </div>
                </div>

                {/* right: step & pseudo-code */}
                <div className="flex flex-col gap-2">
                  {/* steps chips */}
                  <div className="flex flex-wrap gap-1.5 mb-1">
                    {DIJKSTRA_STEPS.map((s, idx) => {
                      const active = s.id === djStep
                      return (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => setDjStep(idx)}
                          className={`px-2.5 py-0.5 rounded-full border text-[10px] transition-colors ${
                            active
                              ? "border-emerald-400/80 bg-emerald-500/20 text-emerald-100"
                              : "border-white/15 bg-black/60 text-white/70 hover:border-emerald-400/50"
                          }`}
                        >
                          {s.id + 1}. {s.label.split("–")[0].trim()}
                        </button>
                      )
                    })}
                  </div>

                  {/* active step text */}
                  <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-[11px] text-emerald-50/95">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <Brain className="h-3 w-3" />
                      <span className="font-semibold">{djActive.label}</span>
                    </div>
                    <p className="text-[11px] text-emerald-50/90 leading-relaxed mt-0.5">
                      {djActive.detail}
                    </p>
                    <p className="mt-1 text-[10px] text-emerald-50/80 italic">
                      {djActive.funCaption}
                    </p>
                  </div>

                  {/* pseudo-code */}
                  <div className="mt-1 rounded-xl border border-white/15 bg-black/75 p-2.5">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <div className="flex items-center gap-1.5">
                        <Code2 className="h-3 w-3 text-emerald-300" />
                        <span className="text-[10px] font-semibold text-white/85">
                          Pseudo-code sketch
                        </span>
                      </div>
                      <span className="text-[9px] text-white/45">
                        O(E log V) with a priority queue
                      </span>
                    </div>
                    <pre className="text-[10px] leading-snug text-emerald-50/90 font-mono whitespace-pre-wrap">
{`for each node v:
  dist[v] = ∞
dist[source] = 0
push (0, source) into priority queue

while queue not empty:
  (d, u) = pop smallest
  if d > dist[u]: continue
  for each edge (u → v, w):
    if dist[u] + w < dist[v]:
      dist[v] = dist[u] + w
      push (dist[v], v) into queue
`}
                    </pre>
                  </div>
                </div>
              </div>

              {/* navigation buttons */}
              <div className="mt-2 flex items-center justify-between gap-2 text-[11px]">
                <button
                  type="button"
                  onClick={() =>
                    setDjStep((prev) =>
                      prev === 0 ? DIJKSTRA_STEPS.length - 1 : prev - 1
                    )
                  }
                  className="inline-flex items-center gap-1 rounded-full border border-white/20 px-3 py-1 text-white/80 hover:bg-white/5 transition-colors"
                >
                  <span>Previous</span>
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setDjStep((prev) =>
                      prev === DIJKSTRA_STEPS.length - 1 ? 0 : prev + 1
                    )
                  }
                  className="inline-flex items-center gap-1 rounded-full border border-emerald-400/60 bg-emerald-500/15 px-3 py-1 text-emerald-100 hover:bg-emerald-500/25 transition-colors"
                >
                  <span>Next</span>
                  <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            </GlassCard>
          </div>
        </section>

        <Divider />

        {/* TIMELINE / FLOW */}
        <section
          id="timeline"
          className="px-6 md:px-12 pb-10 md:pb-12 bg-black"
        >
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
            <div>
              <SectionLabel>How a fake day feels</SectionLabel>
              <h2 className="text-xl md:text-2xl font-semibold tracking-tight">
                One run, as a small story.
              </h2>
            </div>
            <p className="text-xs md:text-sm text-white/70 max-w-md">
              From sketching stops to reading the neon swarm, each step is here
              so the whole thing feels more like a narrative than a config file.
            </p>
          </div>

          <GlassCard className="p-4 md:p-6 bg-black/80">
            <div className="grid gap-6 md:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
              <div className="space-y-5">
                {TIMELINE.map((step, idx) => (
                  <div key={step.title} className="flex gap-3">
                    <div className="mt-1 flex flex-col items-center">
                      <div className="h-6 w-6 rounded-full bg-pink-500/20 border border-pink-400/60 flex items-center justify-center text-[11px] text-pink-100">
                        {idx + 1}
                      </div>
                      {idx < TIMELINE.length - 1 && (
                        <div className="flex-1 w-px bg-gradient-to-b from-pink-500/50 via-pink-500/10 to-transparent mt-1" />
                      )}
                    </div>
                    <div>
                      <p className="text-[12px] font-semibold text-white/90">
                        {step.title}
                      </p>
                      <p className="text-[11px] text-pink-200/85">
                        {step.subtitle}
                      </p>
                      <p className="mt-1 text-[12px] text-white/80 leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-4 text-[12px] text-white/80">
                <p className="text-[11px] uppercase tracking-[0.18em] text-pink-300">
                  Quiet promises
                </p>
                <p>
                  This page doesn’t try to be everything — it only promises a
                  few things:
                </p>
                <ul className="mt-2 space-y-1.5 list-disc list-inside text-white/80">
                  <li>No production side effects.</li>
                  <li>Honest visual feedback about your choices.</li>
                  <li>Enough beauty to make you want to come back.</li>
                  <li>Enough clarity to make you leave with new ideas.</li>
                </ul>
                <p className="mt-3 text-white/70">
                  You can treat this as a daily ritual: five to ten minutes of
                  watching your routes behave, misbehave, and gradually become
                  something you’re proud of.
                </p>
              </div>
            </div>
          </GlassCard>
        </section>

        <Divider />

        {/* UNDER THE HOOD */}
        <section
          id="under"
          className="px-6 md:px-12 pb-10 md:pb-12 bg-black/95"
        >
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
            <div>
              <SectionLabel>Under the hood</SectionLabel>
              <h2 className="text-xl md:text-2xl font-semibold tracking-tight">
                What all the glow is actually doing.
              </h2>
            </div>
            <p className="text-xs md:text-sm text-white/70 max-w-md">
              If you ever feel like popping the hood, this is the high-level
              sketch of how the visuals think about your data.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-5">
            {UNDER_THE_HOOD.map((item) => (
              <GlassCard
                key={item.title}
                className="p-4 bg-black/80 flex flex-col gap-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <p className="text-[12px] font-semibold text-white/90">
                      {item.title}
                    </p>
                    <p className="text-[11px] text-pink-200/90">
                      {item.subtitle}
                    </p>
                  </div>
                  <div className="h-6 w-6 rounded-xl bg-pink-500/15 border border-pink-400/60 flex items-center justify-center text-pink-200">
                    <Code2 className="h-3.5 w-3.5" />
                  </div>
                </div>
                <p className="text-[12px] text-white/80 leading-relaxed">
                  {item.detail}
                </p>
              </GlassCard>
            ))}
          </div>

          {/* small dev strip */}
          <GlassCard className="p-4 bg-black/80">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 text-[11px] text-white/75">
              <div className="flex items-center gap-2">
                <Terminal className="h-3.5 w-3.5 text-pink-300" />
                <span>
                  This page is happy to stay purely visual, but if you ever want
                  to wire in real logs, solvers, or quantum experiments, the
                  layout is ready to host them.
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-white/55">
                <BadgeCheck className="h-3.5 w-3.5 text-pink-300" />
                <span>
                  Routes, events, penalties — maybe even QAOA steps — all future
                  guests.
                </span>
              </div>
            </div>
          </GlassCard>
        </section>

        <Divider />

        {/* SHORTCUTS / HOW TO INTERACT */}
        <section
          id="shortcuts"
          className="px-6 md:px-12 pb-10 md:pb-12 bg-black"
        >
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
            <div>
              <SectionLabel>How to play with it</SectionLabel>
              <h2 className="text-xl md:text-2xl font-semibold tracking-tight">
                You don’t need a manual — just a few hints.
              </h2>
            </div>
            <p className="text-xs md:text-sm text-white/70 max-w-md">
              Most of this is meant to be discoverable. These hints just push
              you over the tiny bumps so you can stay in flow.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {SHORTCUTS.map((s) => (
              <GlassCard
                key={s.label}
                className="p-4 bg-black/80 flex flex-col gap-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <Keyboard className="h-3.5 w-3.5 text-pink-300" />
                    <p className="text-[12px] font-semibold text-white/90">
                      {s.label}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    {s.keys.split("+").map((k, idx) => (
                      <React.Fragment key={`${s.label}-${idx}`}>
                        {idx > 0 && (
                          <span className="text-white/40 text-[10px]">+</span>
                        )}
                        <Keycap>{k.trim()}</Keycap>
                      </React.Fragment>
                    ))}
                  </div>
                </div>
                <p className="text-[11px] text-white/78 leading-relaxed">
                  {s.context}
                </p>
              </GlassCard>
            ))}
          </div>

          {/* subtle note */}
          <div className="mt-5 text-[11px] text-white/60 flex items-center gap-2">
            <MousePointer2 className="h-3.5 w-3.5 text-pink-300" />
            <span>
              You can treat every glowing element as an invitation to look
              closer. If something feels alive, it’s probably trying to teach
              you something.
            </span>
          </div>
        </section>

        <Divider />

        {/* FAQ */}
        <section
          id="faq"
          className="px-6 md:px-12 py-10 md:py-12 border-t border-white/10 bg-black/95"
        >
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-6">
            <div className="max-w-md">
              <SectionLabel>Questions your brain might whisper</SectionLabel>
              <h2 className="text-xl md:text-2xl font-semibold tracking-tight mb-2">
                What this page promises — and what it doesn’t.
              </h2>
              <p className="text-sm text-white/78">
                Short answers for the future you who forgot why this room exists
                and whether it’s safe to press anything.
              </p>
            </div>
            <div className="text-xs text-white/60 max-w-sm">
              <p>
                The short version: it’s a safe place to think with routes. The
                long version lives in the answers below, whenever you’re ready
                to read them.
              </p>
            </div>
          </div>

          <div className="max-w-3xl space-y-3">
            {FAQ.map((f) => {
              const open = openFaq === f.q
              return (
                <GlassCard
                  key={f.q}
                  className={`px-4 py-3 bg-black/80 cursor-pointer ${
                    open ? "border-pink-400/80 bg-pink-500/12" : ""
                  }`}
                >
                  <button
                    type="button"
                    className="flex w-full items-center justify-between gap-3 text-left"
                    onClick={() =>
                      setOpenFaq((prev) => (prev === f.q ? null : f.q))
                    }
                  >
                    <span className="text-sm font-medium text-white/90">
                      {f.q}
                    </span>
                    <ChevronDown
                      className={`h-4 w-4 text-white/55 transition-transform ${
                        open ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {open && (
                    <p className="mt-2 text-[12px] leading-relaxed text-white/80">
                      {f.a}
                    </p>
                  )}
                </GlassCard>
              )
            })}
          </div>
        </section>

        {/* final CTA strip */}
        <section className="px-6 md:px-12 py-8 bg-black border-t border-white/10">
          <GlassCard className="p-4 md:p-5 bg-black/85">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 h-8 w-8 rounded-xl bg-pink-500/20 border border-pink-400/70 flex items-center justify-center">
                  <Waypoints className="h-4 w-4 text-pink-200" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white/90">
                    Ready to watch a graph make up its mind?
                  </p>
                  <p className="text-[12px] text-white/75 mt-1 max-w-xl">
                    Start with a tiny fake day, push a few constraints around,
                    and just see what happens. No deadlines. No alerts.
                    Just you, a swarm, and a stubbornly honest globe.
                  </p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/admin/instances/create"
                  className="inline-flex items-center justify-center rounded-full bg-pink-500 px-4 py-2 text-xs md:text-sm font-medium text-black shadow-[0_0_32px_rgba(236,72,153,0.8)] hover:bg-pink-400 transition-colors"
                >
                  <span>Spin up a test day</span>
                  <ArrowRight className="ml-2 h-3.5 w-3.5" />
                </Link>
                <a
                  href="#algos"
                  className="inline-flex items-center justify-center rounded-full border border-white/20 px-4 py-2 text-xs md:text-sm font-medium text-white/85 hover:bg-white/5 transition-colors"
                >
                  <FileText className="h-3.5 w-3.5 mr-1.5" />
                  <span>Revisit the algorithms</span>
                </a>
              </div>
            </div>
          </GlassCard>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="relative z-20 border-t border-white/10 bg-black px-6 md:px-12 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-white/60">
        <span>
          © {new Date().getFullYear()} · Your routing lab, your swarm, your cloud, your globe.
        </span>
        <div className="flex flex-wrap items-center gap-2 text-white/45">
          <Zap className="h-3.5 w-3.5 text-pink-300" />
          <span>
            Clarke–Wright · Dijkstra · Animated point cloud · Network globe ·
            Narrative UI
          </span>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage