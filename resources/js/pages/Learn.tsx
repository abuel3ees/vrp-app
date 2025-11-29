// resources/js/pages/Learn.tsx
"use client"

import React from "react"
import { Head, Link } from "@inertiajs/react"
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Brain,
  Code2,
  GitBranch,
  Map,
  Network,
  Route,
  Sparkles,
  Triangle,
  Workflow,
  Zap,
  ChevronRight,
  Terminal,
  Binary,
  Eye,
  Server,
  Globe2,
  Activity,
  Info,
  Compass,
  Layers,
  Clock,
  GaugeCircle,
  Database,
  Grid3X3,
  ListChecks,
  LucideIcon,
} from "lucide-react"

// -----------------------------------------------------------------------------
// Small building blocks
// -----------------------------------------------------------------------------

const Badge = ({ children }: { children: React.ReactNode }) => (
  <span className="inline-flex items-center gap-1 rounded-full border border-pink-400/40 bg-pink-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-pink-200">
    {children}
  </span>
)

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <p className="text-[11px] font-semibold tracking-[0.18em] text-pink-300 uppercase mb-1">
    {children}
  </p>
)

const Glass = ({
  children,
  className = "",
}: {
  children: React.ReactNode
  className?: string
}) => (
  <div
    className={`rounded-2xl border border-white/10 bg-black/60 backdrop-blur-xl ${className}`}
  >
    {children}
  </div>
)

const Divider = () => (
  <div className="h-px w-full bg-gradient-to-r from-transparent via-white/18 to-transparent my-10" />
)

const CodeBlock = ({
  language,
  children,
}: {
  language?: string
  children: React.ReactNode
}) => (
  <div className="relative group">
    <div className="absolute right-3 top-2 text-[10px] uppercase tracking-[0.18em] text-pink-300/80">
      {language ?? "code"}
    </div>
    <pre className="mt-2 w-full overflow-x-auto rounded-xl bg-[#020617] border border-pink-500/30 px-3.5 py-3 text-[11px] leading-relaxed text-pink-100/95">
      <code>{children}</code>
    </pre>
  </div>
)

const Callout = ({
  icon: Icon,
  title,
  tone = "info",
  children,
}: {
  icon?: LucideIcon
  title: string
  tone?: "info" | "warn" | "ok"
  children: React.ReactNode
}) => {
  const toneClasses =
    tone === "info"
      ? "border-pink-400/60 bg-pink-500/10"
      : tone === "warn"
      ? "border-amber-400/70 bg-amber-500/10"
      : "border-emerald-400/70 bg-emerald-500/10"

  const iconColor =
    tone === "info"
      ? "text-pink-300"
      : tone === "warn"
      ? "text-amber-300"
      : "text-emerald-300"

  const IconComp = Icon ?? Info

  return (
    <div
      className={`mt-3 rounded-xl border px-3.5 py-2.5 text-[12px] ${toneClasses}`}
    >
      <div className="flex items-start gap-2">
        <div
          className={`mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-lg border border-white/15 bg-black/40 ${iconColor}`}
        >
          <IconComp className="h-3.5 w-3.5" />
        </div>
        <div>
          <p className="font-semibold mb-0.5 text-[12px]">{title}</p>
          <div className="text-[11px] leading-relaxed text-pink-50/90">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

// -----------------------------------------------------------------------------
// Page content
// -----------------------------------------------------------------------------

const Learn: React.FC = () => {
  return (
    <>
      <Head title="How This Lab Works – Routing Sandbox" />

      <div className="min-h-screen bg-black text-white flex flex-col relative overflow-hidden">
        {/* ambient blobs */}
        <div className="pointer-events-none absolute -top-40 -left-32 h-80 w-80 rounded-full bg-pink-500/25 blur-[110px]" />
        <div className="pointer-events-none absolute -bottom-48 -right-40 h-96 w-96 rounded-full bg-purple-500/25 blur-[130px]" />
        <div className="pointer-events-none absolute top-1/3 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-pink-400/10 blur-[90px]" />

        {/* scanlines */}
        <div className="pointer-events-none fixed inset-0 opacity-[0.06] mix-blend-soft-light bg-[linear-gradient(to_bottom,rgba(255,255,255,0.25)_1px,transparent_1px)] bg-[length:100%_2px]" />

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
                How this lab works
                <BookOpen className="h-3.5 w-3.5 text-pink-300" />
              </span>
              <span className="text-[11px] text-pink-100/85">
                A narrative tour of your routing sandbox – from JSON to neon.
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/5 px-3 py-1.5 text-[11px] md:text-xs font-medium text-white hover:bg-white/10 transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to lab</span>
            </Link>
            <Link
              href="/admin/instances/create"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-pink-400/55 bg-pink-500/15 px-3 py-1.5 text-[11px] md:text-xs font-medium text-pink-100 hover:bg-pink-500/25 transition-colors"
            >
              <span>Start a test run</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </header>

        {/* MAIN */}
        <main className="relative z-20 flex-1 flex flex-col">
          <div className="flex-1 flex flex-col lg:flex-row gap-6 md:gap-8 px-6 md:px-12 pb-12">
            {/* LEFT SIDEBAR – table of contents */}
            <aside className="w-full lg:w-64 xl:w-72 lg:sticky lg:top-20 lg:self-start lg:pt-2">
              <Glass className="p-4 bg-black/75 mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Badge>Map of this page</Badge>
                </div>
                <p className="text-[12px] text-white/80 mb-2">
                  You don’t have to read this linearly. Jump to the part your
                  brain wants right now.
                </p>
                <nav className="mt-2 space-y-1 text-[12px] text-white/75">
                  <TocItem href="#overview" icon={Sparkles} label="1. Big picture" />
                  <TocItem href="#flow" icon={Workflow} label="2. Data flow" />
                  <TocItem href="#visuals" icon={Eye} label="3. Visual layers" />
                  <TocItem href="#algorithms" icon={Brain} label="4. Algorithms" />
                  <TocItem href="#backend" icon={Server} label="5. Laravel brain" />
                  <TocItem href="#api" icon={Code2} label="6. API surface" />
                  <TocItem href="#mental-model" icon={Compass} label="7. Mental model" />
                  <TocItem href="#future" icon={Globe2} label="8. Future notes" />
                </nav>
              </Glass>

              <Glass className="p-3.5 bg-black/80 hidden lg:block">
                <SectionLabel>TL;DR for future you</SectionLabel>
                <p className="text-[11px] text-white/78">
                  “This is the place where I send fake days through real
                  algorithms and let shaders tell me how smart (or dumb) they
                  actually are.”
                </p>
              </Glass>
            </aside>

            {/* RIGHT CONTENT */}
            <section className="flex-1 space-y-10 md:space-y-12 pb-10">
              {/* 1. OVERVIEW */}
              <Glass id="overview" className="p-4 md:p-6 bg-black/80">
                <SectionLabel>1 · The big picture</SectionLabel>
                <h1 className="text-xl md:text-2xl font-semibold tracking-tight mb-3">
                  What this lab is, in one paragraph.
                </h1>
                <p className="text-[13px] md:text-[14px] leading-relaxed text-white/85 mb-3">
                  This lab is a **sandbox** that lives next to your routing
                  system. It takes in your *roads*, *vehicles*, and *deliveries*,
                  runs them through your optimisation brain (Clarke–Wright, VRP
                  heuristics, shortest paths), and then replays the result as a
                  **neon story**: a swarm, a point cloud, and a globe that
                  visually gossip about how well your logic is behaving.
                </p>

                <div className="grid md:grid-cols-3 gap-3 mt-4 text-[11px]">
                  <MiniPillCard
                    icon={Map}
                    title="Input"
                    body="JSON roads, vehicles, deliveries, penalties, time windows. All fake or test data here."
                  />
                  <MiniPillCard
                    icon={Brain}
                    title="Processing"
                    body="VRP engine, Clarke–Wright, Dijkstra, and whatever solver you plug in."
                  />
                  <MiniPillCard
                    icon={Zap}
                    title="Output"
                    body="Routes, costs, legs, and meta – visualised as glowing systems you can stare at."
                  />
                </div>

                <Callout
                  icon={Activity}
                  title="Important rule: this page is ‘no consequences’ mode."
                  tone="info"
                >
                  This page never writes to live drivers or production
                  infrastructure. It’s your **thinking space**. When you do
                  build real actions, they’ll live somewhere separate and loud.
                </Callout>
              </Glass>

              {/* 2. DATA FLOW */}
              <Glass id="flow" className="p-4 md:p-6 bg-black/80">
                <SectionLabel>2 · Data flow</SectionLabel>
                <h2 className="text-lg md:text-xl font-semibold tracking-tight mb-3">
                  From roads & deliveries to a glowing universe.
                </h2>
                <p className="text-[13px] text-white/85 mb-3">
                  Under the neon, the whole pipeline is surprisingly simple:
                  **structured JSON + a Laravel brain + a few shaders** that
                  turn numbers into motion.
                </p>

                <div className="grid lg:grid-cols-2 gap-4 items-start">
                  <div className="space-y-3 text-[12px] text-white/80">
                    <FlowStep
                      index="1"
                      title="Roads & penalties"
                      body="You store your roads as JSON segments with penalties (AVENUE, RESIDENTIAL, CENTRAL, etc.). These become nodes + edges in your internal graph."
                    />
                    <FlowStep
                      index="2"
                      title="Vehicles & deliveries"
                      body="Each test instance defines vehicles (capacity, start time, depot) and deliveries (coordinate, demand, tags). Think of it as a fake day in your city."
                    />
                    <FlowStep
                      index="3"
                      title="Optimisation pass"
                      body="Your PHP service calls into heuristics like Clarke–Wright (for VRP) and Dijkstra (for intra-route shortest paths). It produces a set of ordered stops per vehicle."
                    />
                    <FlowStep
                      index="4"
                      title="Projection to visuals"
                      body="The routes get normalised into a compact coordinate space and passed as textures & buffers into the WebGL layers."
                    />
                    <FlowStep
                      index="5"
                      title="Neon narrative"
                      body="The same data is now three stories: swarm, point cloud, and globe, all driven by the same underlying numbers."
                    />
                  </div>

                  <div>
                    <CodeBlock language="laravel · high level">
                      {`// app/Services/VrpRunService.php (conceptual)
public function runSandbox(int $instanceId): SandboxResult
{
    $instance   = Instance::with(['vehicles', 'deliveries'])->findOrFail($instanceId);

    // 1) Build graph from your road JSON
    $graph      = $this->roadRepository->buildGraphFromStoredJson(
        penalties: $instance->penalties ?? []
    );

    // 2) Precompute depot-centric shortest paths (Dijkstra)
    $shortest   = $this->shortestPathService->allPairsFromDepot($graph, $instance->depot_node_id);

    // 3) Run Clarke–Wright or other heuristic for VRP
    $routes     = $this->vrpSolver->buildRoutesUsingClarkeWright(
        graph:        $graph,
        depotNode:    $instance->depot_node_id,
        vehicles:     $instance->vehicles,
        deliveries:   $instance->deliveries,
        shortestMeta: $shortest,
    );

    // 4) Flatten + normalise for the front-end
    return SandboxResult::fromRoutesAndGraph($routes, $graph, $shortest);
}`}
                    </CodeBlock>
                    <Callout icon={Server} title="This isn’t strict code, it’s the mental API." tone="info">
                      The exact function names are up to you. What matters is
                      the shape: **graph → shortest paths → VRP solver → visual
                      payload.**
                    </Callout>
                  </div>
                </div>
              </Glass>

              {/* 3. VISUAL LAYERS */}
              <Glass id="visuals" className="p-4 md:p-6 bg-black/80">
                <SectionLabel>3 · Visual layers</SectionLabel>
                <h2 className="text-lg md:text-xl font-semibold tracking-tight mb-3">
                  Swarm, point cloud, globe – three ways of listening.
                </h2>
                <p className="text-[13px] text-white/85 mb-4">
                  The visuals aren’t random art. Each layer is tuned to answer a
                  different question when you stare at it for a few seconds.
                </p>

                <div className="grid gap-4 md:grid-cols-3 text-[12px]">
                  <Glass className="p-3 bg-black/80 border-pink-400/30">
                    <div className="flex items-center gap-2 mb-2">
                      <Eye className="h-3.5 w-3.5 text-pink-300" />
                      <span className="font-semibold text-[12px]">
                        3.1 · Swarm (hero field)
                      </span>
                    </div>
                    <p className="text-white/80 mb-2">
                      A depth-of-field particle field that reacts to time,
                      focus, and motion. It’s not literal geography – it’s the
                      **emotional temperature** of your current run.
                    </p>
                    <ul className="space-y-1 text-white/70 list-disc list-inside">
                      <li>Density hints at how “busy” your universe feels.</li>
                      <li>Subtle flickers can encode load, penalties, or risk.</li>
                      <li>Transitions react to your “introspect” state.</li>
                    </ul>
                  </Glass>

                  <Glass className="p-3 bg-black/80">
                    <div className="flex items-center gap-2 mb-2">
                      <Grid3X3 className="h-3.5 w-3.5 text-pink-300" />
                      <span className="font-semibold text-[12px]">
                        3.2 · Point cloud (cluster map)
                      </span>
                    </div>
                    <p className="text-white/80 mb-2">
                      A point cloud where each dot stands in for a stop or
                      micro-cluster. You use it to spot **imbalances** quickly.
                    </p>
                    <ul className="space-y-1 text-white/70 list-disc list-inside">
                      <li>Bright patches hint at overloaded areas.</li>
                      <li>Empty rings show deserts your logic might ignore.</li>
                      <li>Subtle vertical “breathing” encodes rhythm over time.</li>
                    </ul>
                  </Glass>

                  <Glass className="p-3 bg-black/80">
                    <div className="flex items-center gap-2 mb-2">
                      <Globe2 className="h-3.5 w-3.5 text-pink-300" />
                      <span className="font-semibold text-[12px]">
                        3.3 · Globe (network scale)
                      </span>
                    </div>
                    <p className="text-white/80 mb-2">
                      A rotating globe with glowing nodes & links. It’s your
                      reminder that this same logic could live across cities.
                    </p>
                    <ul className="space-y-1 text-white/70 list-disc list-inside">
                      <li>Nodes = key depots/regions you care about.</li>
                      <li>Link opacity = relationship intensity or traffic.</li>
                      <li>Slow rotation = “this is bigger than one map tile”.</li>
                    </ul>
                  </Glass>
                </div>

                <Divider />

                <h3 className="text-sm md:text-base font-semibold mb-1 flex items-center gap-2">
                  <Code2 className="h-4 w-4 text-pink-300" />
                  Under the hood: the GL pipeline (simplified).
                </h3>
                <CodeBlock language="tsx · react-three-fiber">
                  {`// Hero GL: high-level pipeline
<Canvas camera={{ position: [1.26, 2.66, -1.81], fov: 50 }}>
  {/* Background + fog */}
  <color attach="background" args={["#000"]} />
  {/* Particle simulation + point material */}
  <Particles
    speed={speed}
    focus={focus}
    aperture={aperture}
    size={size}
    noiseScale={noiseScale}
    noiseIntensity={noiseIntensity}
    timeScale={timeScale}
    pointSize={pointSize}
    opacity={opacity}
    planeScale={planeScale}
    useManualTime={useManualTime}
    manualTime={manualTime}
    introspect={hovering}
  />
  {/* Post-processing vignette */}
  <Effects multisamping={0} disableGamma>
    <shaderPass
      args={[VignetteShader]}
      uniforms-darkness-value={vignetteDarkness}
      uniforms-offset-value={vignetteOffset}
    />
  </Effects>
</Canvas>`}
                </CodeBlock>
              </Glass>

              {/* 4. ALGORITHMS */}
              <Glass id="algorithms" className="p-4 md:p-6 bg-black/80">
                <SectionLabel>4 · Algorithms</SectionLabel>
                <h2 className="text-lg md:text-xl font-semibold tracking-tight mb-3">
                  Clarke–Wright & Dijkstra as characters in your story.
                </h2>
                <p className="text-[13px] text-white/85 mb-4">
                  Instead of thinking of them as dry algorithms, this lab treats
                  them as **characters** with jobs:
                  <br />
                  Clarke–Wright is the friend obsessed with saving fuel. Dijkstra
                  is the friend who never lies about distance.
                </p>

                <div className="grid lg:grid-cols-[1.3fr_1.2fr] gap-5 items-start">
                  {/* Clarke–Wright */}
                  <Glass className="p-4 bg-black/75 border-pink-400/40">
                    <div className="flex items-center gap-2 mb-2">
                      <Route className="h-4 w-4 text-pink-300" />
                      <span className="text-sm font-semibold">
                        4.1 · Clarke–Wright, the fuel accountant.
                      </span>
                    </div>
                    <p className="text-[12px] text-white/85 mb-3">
                      You start with the naive world: one tiny route per stop.
                      Clarke–Wright walks in and says: “What if we carpool?”
                    </p>
                    <CodeBlock language="pseudo · clarke–wright">
                      {`1. Start with one route per customer: Depot → i → Depot
2. For every pair (i, j), compute the savings:
   S(i, j) = d(0, i) + d(0, j) − d(i, j)
3. Sort all pairs by S(i, j) in descending order.
4. For each pair (i, j) in that order:
   - If i and j are at the ends of two different routes
   - And merging those routes doesn't break capacity/timing
     → join them into a single route: Depot → ... i j ... → Depot
5. Stop when no more valid merges exist.`}
                    </CodeBlock>
                    <Callout icon={GitBranch} title="How the lab uses this.">
                      In your lab, this doesn’t have to be the final word. You
                      can:
                      <ul className="list-disc list-inside mt-1 space-y-0.5">
                        <li>Use Clarke–Wright to propose an initial routing.</li>
                        <li>Hand those routes to other heuristics or local search.</li>
                        <li>Replay intermediate states as separate visual runs.</li>
                      </ul>
                    </Callout>
                  </Glass>

                  {/* Dijkstra */}
                  <Glass className="p-4 bg-black/75">
                    <div className="flex items-center gap-2 mb-2">
                      <Brain className="h-4 w-4 text-pink-300" />
                      <span className="text-sm font-semibold">
                        4.2 · Dijkstra, the wavefront of certainty.
                      </span>
                    </div>
                    <p className="text-[12px] text-white/85 mb-3">
                      Dijkstra is the friend who walks through your graph with
                      sticky notes, always updating them with the best distance
                      found so far – and never having to go back on a promise.
                    </p>
                    <CodeBlock language="pseudo · dijkstra">
                      {`given graph G(V, E), source s:
1. For all v in V:
   dist[v] = +∞
   prev[v] = undefined
2. dist[s] = 0
3. Q = all nodes in V (a priority queue keyed by dist)
4. while Q is not empty:
   u = node in Q with minimum dist[u]
   remove u from Q
   for each neighbour v of u:
       alt = dist[u] + w(u, v)
       if alt < dist[v]:
           dist[v] = alt
           prev[v] = u
           decrease-key of v in Q
5. The path to any target t is reconstructed by following prev[t] backwards.`}
                    </CodeBlock>
                    <Callout icon={Triangle} title="In your lab, Dijkstra plays two roles.">
                      <ul className="list-disc list-inside mt-1 space-y-0.5">
                        <li>Precomputing distance matrices for Clarke–Wright.</li>
                        <li>Answering “what if we reroute this one edge?” questions inside the lab UI.</li>
                      </ul>
                    </Callout>
                  </Glass>
                </div>
              </Glass>

              {/* 5. BACKEND / LARAVEL */}
              <Glass id="backend" className="p-4 md:p-6 bg-black/80">
                <SectionLabel>5 · The Laravel brain</SectionLabel>
                <h2 className="text-lg md:text-xl font-semibold tracking-tight mb-3">
                  What the backend actually does (and doesn’t do).
                </h2>
                <p className="text-[13px] text-white/85 mb-4">
                  The backend’s job is not to be cute. It’s there to:
                  <br />
                  **(1) keep the data clean, (2) run the solvers, (3) feed the lab.**
                </p>

                <div className="grid lg:grid-cols-3 gap-4 text-[12px]">
                  <Glass className="p-3.5 bg-black/75">
                    <div className="flex items-center gap-2 mb-1.5">
                      <Database className="h-3.5 w-3.5 text-pink-300" />
                      <span className="font-semibold">5.1 · Data models</span>
                    </div>
                    <ul className="space-y-1 text-white/80 list-disc list-inside">
                      <li>
                        <span className="font-mono text-[11px]">instances</span>{" "}
                        – a “fake day” scenario.
                      </li>
                      <li>
                        <span className="font-mono text-[11px]">vehicles</span>{" "}
                        – capacities, depots, shifts.
                      </li>
                      <li>
                        <span className="font-mono text-[11px]">deliveries</span>{" "}
                        – stops with coordinates, demand, tags.
                      </li>
                      <li>
                        <span className="font-mono text-[11px]">roads</span>{" "}
                        – loaded from your JSON into internal tables or cached graphs.
                      </li>
                    </ul>
                  </Glass>

                  <Glass className="p-3.5 bg-black/75">
                    <div className="flex items-center gap-2 mb-1.5">
                      <Workflow className="h-3.5 w-3.5 text-pink-300" />
                      <span className="font-semibold">5.2 · Services</span>
                    </div>
                    <ul className="space-y-1 text-white/80 list-disc list-inside">
                      <li>Graph builder (roads → adjacency list).</li>
                      <li>Shortest path service (Dijkstra wrappers).</li>
                      <li>VRP solver service (Clarke–Wright & friends).</li>
                      <li>Projection/normalisation for the front-end.</li>
                    </ul>
                  </Glass>

                  <Glass className="p-3.5 bg-black/75">
                    <div className="flex items-center gap-2 mb-1.5">
                      <GaugeCircle className="h-3.5 w-3.5 text-pink-300" />
                      <span className="font-semibold">5.3 · Safety rails</span>
                    </div>
                    <ul className="space-y-1 text-white/80 list-disc list-inside">
                      <li>Everything is tagged as sandbox / non-production.</li>
                      <li>Instances can be re-run without side effects.</li>
                      <li>You can delete or archive runs without fear.</li>
                    </ul>
                  </Glass>
                </div>

                <Divider />

                <h3 className="text-sm md:text-base font-semibold mb-1 flex items-center gap-2">
                  <Terminal className="h-4 w-4 text-pink-300" />
                  A typical “run instance” endpoint.
                </h3>
                <CodeBlock language="php · controller">
                  {`// app/Http/Controllers/InstanceController.php (conceptual)
public function run(int $id)
{
    $instance = Instance::findOrFail($id);

    $result = $this->vrpRunService->runSandbox($instance->id);

    return inertia('Sandbox/Show', [
        'instance'   => $instance,
        'routes'     => $result->routes,
        'nodes'      => $result->nodes,
        'metrics'    => $result->metrics,
        'projection' => $result->projection,
    ]);
}`}
                </CodeBlock>
              </Glass>

              {/* 6. API SURFACE */}
              <Glass id="api" className="p-4 md:p-6 bg-black/80">
                <SectionLabel>6 · API surface</SectionLabel>
                <h2 className="text-lg md:text-xl font-semibold tracking-tight mb-3">
                  Not public API, but a contract between your brain and your UI.
                </h2>
                <p className="text-[13px] text-white/85 mb-4">
                  This lab doesn’t expose a public API (yet). But there is a
                  **mental contract** between your backend and the front-end
                  visuals. It looks roughly like this:
                </p>

                <CodeBlock language="ts · front-end contract">
                  {`// Example of the data shape the front-end expects
type SandboxPayload = {
  instanceId: number
  // Normalised nodes (0..1) used for projection
  nodes: Array<{
    id: number
    x: number
    y: number
    penalties: string[]
  }>
  // Vehicle-level routes
  routes: Array<{
    vehicleId: number
    label: string
    totalDistance: number
    totalTime: number
    stops: Array<{
      nodeId: number
      sequence: number
      arrivalTime: string
      loadAfter: number
    }>
  }>
  // Handy metrics for overlays
  metrics: {
    totalDistance: number
    totalVehiclesUsed: number
    avgRouteLength: number
    maxRouteLoad: number
  }
  projection: {
    // If you ever map to real lat/lng from grid space
    baseLat: number
    baseLng: number
    scale: number
  }
}`}
                </CodeBlock>

                <Callout icon={Layers} title="Nothing stops you from expanding this.">
                  You can layer **more solvers**, **risk scores**, **time
                  windows**, or even **uncertainty bands** on the same contract.
                  As long as the visuals know how to read the fields, the neon
                  will happily gossip about them too.
                </Callout>
              </Glass>

              {/* 7. MENTAL MODEL */}
              <Glass id="mental-model" className="p-4 md:p-6 bg-black/80">
                <SectionLabel>7 · Mental model</SectionLabel>
                <h2 className="text-lg md:text-xl font-semibold tracking-tight mb-3">
                  How to think about this page when you’re tired.
                </h2>
                <p className="text-[13px] text-white/85 mb-4">
                  When your brain is fried, remember this **three-layer
                  stack**:
                </p>

                <div className="grid md:grid-cols-3 gap-4 text-[12px]">
                  <Glass className="p-3 bg-black/75">
                    <div className="flex items-center gap-2 mb-1">
                      <Map className="h-3.5 w-3.5 text-pink-300" />
                      <span className="font-semibold">Layer 1 · Reality-ish</span>
                    </div>
                    <p className="text-white/80">
                      Roads, vehicles, deliveries. Even if they’re fake, they
                      obey some notion of distance, time, and capacity.
                    </p>
                  </Glass>
                  <Glass className="p-3 bg-black/75">
                    <div className="flex items-center gap-2 mb-1">
                      <Brain className="h-3.5 w-3.5 text-pink-300" />
                      <span className="font-semibold">Layer 2 · Logic</span>
                    </div>
                    <p className="text-white/80">
                      Clarke–Wright, Dijkstra, and any other solver you add.
                      Their job is to compress chaos into routes.
                    </p>
                  </Glass>
                  <Glass className="p-3 bg-black/75">
                    <div className="flex items-center gap-2 mb-1">
                      <Sparkles className="h-3.5 w-3.5 text-pink-300" />
                      <span className="font-semibold">Layer 3 · Story</span>
                    </div>
                    <p className="text-white/80">
                      Swarms, point clouds, and globes. Their job is to tell
                      you, in seconds, whether your logic feels sane.
                    </p>
                  </Glass>
                </div>

                <Callout icon={Compass} title="If you forget everything else:">
                  This page is for **feeling** your routes, not just reading
                  numbers. If a run looks wrong here, it probably is.
                </Callout>
              </Glass>

              {/* 8. FUTURE NOTES */}
              <Glass id="future" className="p-4 md:p-6 bg-black/80 mb-6">
                <SectionLabel>8 · Notes for future you</SectionLabel>
                <h2 className="text-lg md:text-xl font-semibold tracking-tight mb-3">
                  Things you might add when you’re bored (and brave).
                </h2>
                <p className="text-[13px] text-white/85 mb-4">
                  This lab is designed to **grow with you**. A few future ideas:
                </p>

                <ul className="text-[12px] text-white/80 space-y-1.5 list-disc list-inside">
                  <li>
                    Add a **timeline scrubber** to replay a day of deliveries in
                    the swarm and point cloud.
                  </li>
                  <li>
                    Overlay **feasible vs. infeasible** routes in different
                    hues, so the neon tells you where you’re breaking rules.
                  </li>
                  <li>
                    Experiment with **probabilistic travel times** and show
                    confidence bands as shimmer intensity.
                  </li>
                  <li>
                    Wire in a **quantum / QAOA solver** on top of the same data
                    contract, just to see how its routes “feel” differently in
                    the visuals.
                  </li>
                </ul>

                <Callout icon={Zap} title="Most important future-proofing rule." tone="ok">
                  Whatever you add, keep the contract simple:
                  <br />
                  **fake or test data in → algorithms → exaggerated, honest
                  visuals out.**
                  <br />
                  If that stays true, this page will always be your favourite
                  place to think.
                </Callout>
              </Glass>
            </section>
          </div>
        </main>

        {/* FOOTER */}
        <footer className="relative z-20 border-t border-white/10 bg-black px-6 md:px-12 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-white/60">
          <span>
            © {new Date().getFullYear()} · Your routing lab documentation, written
            for the future you who forgot how this all works.
          </span>
          <div className="flex flex-wrap items-center gap-2 text-white/45">
            <BookOpen className="h-3.5 w-3.5 text-pink-300" />
            <span>JSON → Laravel → Algorithms → Neon</span>
          </div>
        </footer>
      </div>
    </>
  )
}

// -----------------------------------------------------------------------------
// Tiny subcomponents used above
// -----------------------------------------------------------------------------

const TocItem = ({
  href,
  icon: Icon,
  label,
}: {
  href: string
  icon: LucideIcon
  label: string
}) => (
  <a
    href={href}
    className="flex items-center gap-1.5 rounded-md px-2 py-1 hover:bg-white/5 transition-colors"
  >
    <Icon className="h-3.5 w-3.5 text-pink-300" />
    <span>{label}</span>
  </a>
)

const MiniPillCard = ({
  icon: Icon,
  title,
  body,
}: {
  icon: LucideIcon
  title: string
  body: string
}) => (
  <div className="rounded-xl border border-white/15 bg-black/70 px-3 py-2.5 flex gap-2">
    <div className="mt-0.5">
      <div className="h-6 w-6 rounded-lg border border-pink-400/50 bg-black/70 flex items-center justify-center">
        <Icon className="h-3.5 w-3.5 text-pink-300" />
      </div>
    </div>
    <div className="space-y-0.5">
      <p className="text-[11px] font-semibold text-white/90">{title}</p>
      <p className="text-[11px] text-white/75">{body}</p>
    </div>
  </div>
)

const FlowStep = ({
  index,
  title,
  body,
}: {
  index: string
  title: string
  body: string
}) => (
  <div className="flex gap-2">
    <div className="mt-0.5">
      <div className="h-6 w-6 rounded-full border border-pink-400/60 bg-black/80 text-[10px] font-semibold flex items-center justify-center text-pink-200">
        {index}
      </div>
    </div>
    <div>
      <p className="font-semibold text-[12px] text-white/90 mb-0.5">
        {title}
      </p>
      <p className="text-[11px] text-white/75">{body}</p>
    </div>
  </div>
)

export default Learn