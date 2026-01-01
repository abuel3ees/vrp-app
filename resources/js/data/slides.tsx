import React from "react";
import { Link } from "@inertiajs/react";
import { SlideData } from "@/types/presentation";
import { 
    Atom, Truck, Activity, BrainCircuit, Layers, Database, 
    Zap, Cpu, CheckCircle2, GitBranch, AlertTriangle, ArrowRight, Share2, Scale 
} from "lucide-react";

// Visualizations
import { BlochSphere } from "@/Components/visualizations/BlochSphere";
import { VrpMapVisualizer } from "@/Components/visualizations/VrpMapVisualizer";
import { TerminalSimulator } from "@/Components/visualizations/TerminalSimulator";
import { GlassCard } from "@/Components/ui/PresentationPrimitives";
import { Button } from "@/Components/ui/button";

// Math Typesetting
import { InlineMath, BlockMath } from "react-katex";

export const slides: SlideData[] = [
  // --- SLIDE 1: COVER ---
  {
    id: "cover",
    category: "Introduction",
    title: "",
    layout: "hero",
    content: (
      <div className="text-center space-y-10 z-10 relative mt-10">
        <div className="flex justify-center">
             <div className="relative h-48 w-48">
                <div className="absolute inset-0 rounded-full border-[3px] border-dashed border-purple-500/30 animate-[spin_10s_linear_infinite]" />
                <div className="absolute inset-4 rounded-full border-[2px] border-cyan-400/30 animate-[spin_5s_linear_infinite_reverse]" />
                <div className="h-full w-full rounded-full bg-slate-900/50 backdrop-blur-xl flex items-center justify-center border border-white/10 shadow-[0_0_80px_-20px_rgba(168,85,247,0.6)]">
                    <Atom className="h-24 w-24 text-white animate-pulse" />
                </div>
            </div>
        </div>
        <div className="space-y-6">
            <h1 className="text-5xl md:text-7xl font-black tracking-tight text-white leading-[0.9]">
                QUANTUM<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-fuchsia-400 to-cyan-400">LOGISTICS</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-400 font-light max-w-3xl mx-auto">
                Design and Implementation of Optimal Delivery Routes Using <span className="text-white font-medium border-b border-purple-500">QAOA</span>
            </p>
            <div className="text-sm text-slate-500 uppercase tracking-widest mt-8 font-mono">
                Princess Sumaya University for Technology<br/>
                <span className="text-purple-500">Spring 2026</span>
            </div>
        </div>
      </div>
    )
  },

  // --- SLIDE 2: MOTIVATION ---
  {
    id: "motivation",
    category: "Motivation",
    title: "The Logistics Crisis",
    subtitle: "Why Classical Computers Fail",
    layout: "split_text_visual",
    left: (
      <div className="space-y-8 text-slate-300">
        <p className="text-lg leading-relaxed font-light">
          "As the number of nodes increases, the problem becomes computationally difficult to solve on a classical computer and requires an unreasonably large amount of time."
        </p>
        <div className="space-y-4">
          <GlassCard className="border-l-4 border-l-red-500">
             <h4 className="font-bold text-white mb-2 flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-red-400"/> Combinatorial Explosion</h4>
             <p className="text-sm text-slate-400 mb-2">For a single vehicle visiting 20 locations:</p>
             <div className="font-mono text-red-400 text-lg">19! ≈ 1.2 × 10¹⁷ routes</div>
          </GlassCard>
          <GlassCard className="border-l-4 border-l-emerald-500">
             <h4 className="font-bold text-white mb-2 flex items-center gap-2"><Activity className="w-4 h-4 text-emerald-400"/> Economic Impact</h4>
             <p className="text-sm text-slate-400">"Mid-sized logistic companies experience a 20-40% reduction in cost within six months of VRP implementation."</p>
          </GlassCard>
        </div>
      </div>
    ),
    right: (
        <div className="h-full flex items-center justify-center p-8">
            <VrpMapVisualizer />
        </div>
    )
  },

  // --- SLIDE 3: WORKFLOW ---
  {
      id: "workflow",
      category: "Methodology",
      title: "System Workflow",
      subtitle: "Hybrid Quantum-Classical Pipeline",
      layout: "pipeline_flow",
      items: [
          { title: "User Input", desc: "Accept stop coordinates and depot data. Compute real-world distance matrix." },
          { title: "Formulate QUBO", desc: "Map the VRP constraints to a Quadratic Unconstrained Binary Optimization model." },
          { title: "Hamiltonian", desc: "Convert QUBO to Ising Hamiltonian (Energy Function)." },
          { title: "QAOA Optimization", desc: "Execute Quantum Circuit to find the Lowest Energy State." },
          { title: "Post-Processing", desc: "Decode optimal bitstring into route indices for the driver app." }
      ]
  },

  // --- SLIDE 4: QUANTUM THEORY ---
  {
      id: "tunneling",
      category: "Theory",
      title: "Quantum Tunneling",
      subtitle: "Escaping Local Minima",
      layout: "landscape_visual",
      left: (
          <div className="space-y-6">
              <p className="text-lg text-slate-300">
                  "Quantum algorithms aim to escape the local minima that often trap classical solvers by traversing the energy landscape via quantum tunneling."
              </p>
              <div className="bg-slate-900/50 p-6 rounded-xl border border-white/10">
                  <h4 className="font-bold text-purple-400 mb-4 text-sm uppercase tracking-wider">Algorithm Comparison</h4>
                  <ul className="space-y-4 text-sm">
                      <li className="flex gap-3">
                          <div className="w-2 h-2 bg-red-500 rounded-full mt-1.5 shadow-[0_0_10px_red]"/>
                          <div className="text-slate-400">
                            <strong className="text-white block">Simulated Annealing</strong> 
                            Relies on thermal jumps to escape minima (Slow).
                          </div>
                      </li>
                      <li className="flex gap-3">
                          <div className="w-2 h-2 bg-cyan-400 rounded-full mt-1.5 shadow-[0_0_10px_cyan]"/>
                          <div className="text-slate-400">
                            <strong className="text-white block">Quantum Annealing</strong>
                            Uses tunneling to pass through barriers directly (Fast).
                          </div>
                      </li>
                  </ul>
              </div>
          </div>
      )
  },

  // --- SLIDE 5: CODE IMPLEMENTATION ---
  {
    id: "code_qaoa",
    category: "Implementation",
    title: "QAOA Implementation",
    subtitle: "Hybrid Quantum-Classical Code",
    layout: "code_snippet",
    codeSnippet: `def run_qaoa_tsp(distance_matrix):
    # 1. Problem Mapping
    # Convert distance matrix to QUBO
    qubo = to_quadratic_program(distance_matrix)
    op, offset = qubo.to_ising()

    # 2. Hybrid Optimization
    # SPSA optimizer tunes parameters (beta, gamma)
    optimizer = SPSA(maxiter=100)
    
    # 3. Execution on IBMQ
    # Using Qiskit Runtime Primitives
    sampler = BackendSampler(backend="ibm_osaka")
    qaoa = QAOA(sampler=sampler, optimizer=optimizer)
    
    # 4. Result Interpretation
    result = qaoa.compute_minimum_eigenvalue(op)
    
    # Decode bitstring (e.g., "10110") to route
    return decode_route(result.eigenstate)`,
    items: [
        { title: "SPSA Optimizer", desc: "Simultaneous Perturbation Stochastic Approximation acts as the classical feedback mechanism." },
        { title: "BackendSampler", desc: "Executes the circuit on IBMQ hardware and returns quasi-probabilities." },
        { title: "Eigenvalue", desc: "The lowest energy state corresponds to the optimal route." }
    ]
  },

  // --- SLIDE 6: TOPOLOGY ---
  {
    id: "topology",
    category: "Hardware",
    title: "Hardware Constraints",
    subtitle: "Mapping to IBM Eagle (127 Qubits)",
    layout: "graph_visual",
    left: (
        <div className="space-y-6">
            <p className="text-xl text-slate-300 font-light">
                "The number of stops is limited by the capacity of the quantum hardware... The practical threshold is approximately 50 to 60 qubits."
            </p>
            <div className="p-6 bg-slate-900/50 rounded-xl border border-purple-500/30">
                <h4 className="text-purple-400 font-bold mb-2 flex items-center gap-2">
                    <Share2 className="w-5 h-5"/> SWAP Overhead
                </h4>
                <p className="text-sm text-slate-400">
                    Quantum chips are not fully connected. We must swap qubits to entangle distant nodes. This increases circuit depth and noise.
                </p>
            </div>
            <GlassCard>
                <div className="flex justify-between items-center text-sm mb-2">
                    <span className="text-slate-400">Max Circuit Depth</span>
                    <span className="text-red-400 font-bold">100 Layers</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-red-500 h-full w-[80%]" />
                </div>
                <p className="text-[10px] text-slate-500 mt-2">Exceeding this causes qubit relaxation.</p>
            </GlassCard>
        </div>
    )
  },

  // --- SLIDE 7: LIVE TERMINAL ---
  {
      id: "execution",
      category: "Implementation",
      title: "Live Execution Log",
      subtitle: "Simulating the IBM Qiskit Runtime",
      layout: "terminal_simulation",
      content: (
          <TerminalSimulator logs={[
              "<span class='text-blue-400'>INFO</span>: Connecting to IBMQ Provider...",
              "<span class='text-blue-400'>INFO</span>: Backend selected: <span class='text-yellow-300'>ibm_osaka</span> (127 qubits)",
              "<span class='text-green-400'>SUCCESS</span>: Transpilation complete. Layout: Heavy-Hex.",
              "---------------------------------------------------",
              "Optimization Loop (SPSA):",
              "Iter 1: Energy = -24.50 | γ=0.1, β=0.5",
              "Iter 2: Energy = -32.12 | γ=0.15, β=0.4",
              "Iter 3: Energy = -38.99 | γ=0.18, β=0.35",
              "...",
              "<span class='text-purple-400'>CONVERGENCE</span>: Minimal energy found at -42.5",
              "---------------------------------------------------",
              "Decoding bitstring 101100...",
              "<span class='text-green-400'>RESULT</span>: Optimal Route: Depot -> Node 2 -> Node 5 -> Depot",
              "Total Distance: 14.2 km"
          ]} />
      )
  },

  // --- SLIDE 8: ENGINEERING STANDARDS ---
  {
      id: "standards",
      category: "Engineering",
      title: "Engineering Standards",
      subtitle: "Compliance & Quality Assurance",
      layout: "split_text_visual",
      left: (
          <div className="space-y-4">
              <GlassCard className="flex items-start gap-4">
                  <CheckCircle2 className="w-6 h-6 text-emerald-400 mt-1 shrink-0" />
                  <div>
                      <h4 className="font-bold text-white">ISO/IEC 25010</h4>
                      <p className="text-sm text-slate-400">Systems and Software Quality Models. Focused on Performance Efficiency and Reliability.</p>
                  </div>
              </GlassCard>
              <GlassCard className="flex items-start gap-4">
                  <GitBranch className="w-6 h-6 text-blue-400 mt-1 shrink-0" />
                  <div>
                      <h4 className="font-bold text-white">IEEE 829</h4>
                      <p className="text-sm text-slate-400">Software Test Documentation. Rigorous unit testing for the classical pre-processing and VQE output validation.</p>
                  </div>
              </GlassCard>
              <GlassCard className="flex items-start gap-4">
                  <Scale className="w-6 h-6 text-purple-400 mt-1 shrink-0" />
                  <div>
                      <h4 className="font-bold text-white">Scalability</h4>
                      <p className="text-sm text-slate-400">"Modular codebase based on open-source frameworks for long-term adaptability."</p>
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
                      <div className="flex justify-between"><span>Unit Tests</span> <span className="text-green-600 font-bold">PASS</span></div>
                      <div className="flex justify-between"><span>Integration</span> <span className="text-green-600 font-bold">PASS</span></div>
                      <div className="flex justify-between"><span>Quantum Sim</span> <span className="text-green-600 font-bold">PASS</span></div>
                      <div className="flex justify-between border-t pt-2 mt-2"><span>Latency</span> <span className="text-orange-500 font-bold">240ms</span></div>
                  </div>
                  <div className="mt-8 text-center">
                      <div className="inline-block border-2 border-green-600 text-green-600 font-black text-xl px-2 py-1 -rotate-12 opacity-50">
                          APPROVED
                      </div>
                  </div>
              </div>
          </div>
      )
  },

  // --- SLIDE 9: CONCLUSION ---
  {
    id: "conclusion",
    category: "Conclusion",
    title: "Future Work",
    subtitle: "The Path to Quantum Advantage",
    layout: "grid_cards",
    items: [
        {
            icon: <Zap className="text-yellow-400"/>,
            title: "QML Integration",
            desc: "Using Quantum Feature Maps to predict initial parameters instead of random starting points."
        },
        {
            icon: <Cpu className="text-purple-400"/>,
            title: "Hardware Scaling",
            desc: "Testing on IBM Eagle (127 qubits) and Osprey (433 qubits) processors."
        },
        {
            icon: <Activity className="text-emerald-400"/>,
            title: "Error Mitigation",
            desc: "Implementing Zero Noise Extrapolation (ZNE) to improve result fidelity."
        }
    ]
  },

  // --- SLIDE 10: DEMO LINK ---
  {
    id: "demo",
    category: "Live Demo",
    title: "",
    layout: "hero",
    content: (
        <div className="text-center space-y-12 z-10 relative">
            <div className="inline-flex p-12 bg-slate-900/50 backdrop-blur-2xl rounded-full border border-purple-500 shadow-[0_0_120px_-20px_rgba(168,85,247,0.6)] group hover:scale-105 transition-transform cursor-pointer">
                <Atom className="h-24 w-24 text-cyan-400 animate-[spin_10s_linear_infinite]" />
            </div>
            
            <div className="space-y-6">
                <h2 className="text-6xl font-black text-white">Project Demonstration</h2>
                <p className="text-2xl text-slate-400 max-w-2xl mx-auto font-light">
                    Comparing <span className="text-blue-400 font-bold">Classical</span> vs. <span className="text-purple-400 font-bold">Quantum</span> Performance
                </p>
                <p className="text-sm text-slate-500">
                   "Demonstration of system functionality (driver app + admin dashboard)"
                </p>
            </div>

            <div className="pt-8">
                <Link href="/admin/optimize"> 
                    <Button size="lg" className="h-20 px-16 text-2xl rounded-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 shadow-[0_0_40px_rgba(168,85,247,0.4)] hover:shadow-[0_0_60px_rgba(34,211,238,0.6)] transition-all border-2 border-white/10">
                        Launch System <ArrowRight className="ml-4 h-8 w-8" />
                    </Button>
                </Link>
            </div>
        </div>
    )
  }
];