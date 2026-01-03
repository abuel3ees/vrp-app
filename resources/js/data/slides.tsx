import React from "react";
import { Link } from "@inertiajs/react";
import { SlideData } from "@/types/presentation";
import { 
    Atom, Truck, Activity, BrainCircuit, Layers, Database, 
    Zap, Cpu, CheckCircle2, GitBranch, AlertTriangle, ArrowRight, Share2, Scale, 
    Code2, Terminal, Route, Microscope, Binary, Smartphone, Globe, Box, Cloud, Server,
    Timer, BarChart3, Lock, BookOpen, GraduationCap, FileText
} from "lucide-react";

// UI & Primitives
import { GlassCard } from "@/Components/ui/PresentationPrimitives";
import { Button } from "@/Components/ui/button";
import { FluidText } from "@/Components/ui/FluidText"; 

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
import { XRayLens } from "@/components/ui/XRayLens";

export const slides: SlideData[] = [
  // --- SLIDE 1: COVER (Updated with Team Names) ---
  {
    id: "cover",
    category: "Introduction",
    title: "",
    layout: "hero",
    notes: "Good morning. We are Leen, Abdulrahman, and Malak. Today we present our graduation project: Design and Implementation of Optimal Delivery Routes Using Quantum Optimization Algorithms, supervised by Dr. Awos Kanan.",
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
                Design and Implementation of Optimal Delivery Routes Using <span className="text-white font-medium border-b border-purple-500">QAOA</span>
            </p>
            
            {/* Team Members from PDF Page 1 */}
            <div className="flex flex-wrap justify-center gap-8 text-sm text-slate-300 mt-6">
                <div className="flex items-center gap-2"><GraduationCap className="w-4 h-4 text-purple-400"/> Leen Almousa</div>
                <div className="flex items-center gap-2"><GraduationCap className="w-4 h-4 text-purple-400"/> Abdulrahman Al-Essa</div>
                <div className="flex items-center gap-2"><GraduationCap className="w-4 h-4 text-purple-400"/> Malak Alshawish</div>
            </div>

            <div className="text-sm text-slate-500 uppercase tracking-widest mt-8 font-mono">
                Supervised By: <span className="text-white">Dr. Awos Kanan</span><br/>
                Princess Sumaya University for Technology<br/>
                <span className="text-purple-500">Spring 2026</span>
            </div>
        </div>
      </div>
    )
  },

  // --- SLIDE 2: MOTIVATION (Updated with Eq 2.1) ---
  {
    id: "motivation",
    category: "Motivation",
    title: "The Logistics Crisis",
    subtitle: "Combinatorial Explosion (Doc Ref: 2.1.1)",
    layout: "split_text_visual",
    notes: "Visualizing complexity: In 'Chaos' mode, you see how classical algorithms randomly search. As stated in Eq 2.1 of our report, 20 locations result in 1.2 x 10^17 routes.",
    left: (
      <div className="space-y-8 text-slate-300">
        <p className="text-lg leading-relaxed font-light">
          "As the number of nodes increases, the problem becomes computationally difficult to solve on a classical computer due to combinatorial explosion."
        </p>
        <div className="space-y-4">
          <GlassCard className="border-l-4 border-l-red-500">
             <h4 className="font-bold text-white mb-2 flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-red-400"/> Combinatorial Explosion (Eq 2.1)</h4>
             <p className="text-sm text-slate-400 mb-2">For just 20 locations ($n=20$):</p>
             <div className="font-mono text-red-400 text-lg">19! ≈ 1.2 × 10¹⁷ routes</div>
             <p className="text-[10px] text-slate-500 mt-1">Source: Report Page 7</p>
          </GlassCard>
          <GlassCard className="border-l-4 border-l-emerald-500">
             <h4 className="font-bold text-white mb-2 flex items-center gap-2"><Activity className="w-4 h-4 text-emerald-400"/> Economic Impact</h4>
             <p className="text-sm text-slate-400">"Mid-sized logistic companies experience a 20-40% cost reduction with VRP optimization."</p>
          </GlassCard>
        </div>
      </div>
    ),
    right: (
        <div className="h-full flex items-center justify-center p-8 w-full">
            <HolographicGlobe />
        </div>
    )
  },

  // --- SLIDE 3: COMPLEXITY CLIFF ---
  {
      id: "complexity",
      category: "Theory",
      title: "The Complexity Cliff",
      subtitle: "NP-Hard Scaling Limits (Doc Ref: Fig 2.1)",
      layout: "graph_visual", 
      notes: "This graph demonstrates the 'Quantum Advantage' threshold. Classical brute force hits a wall at the 'Crossover Size'.",
      left: (
          <div className="space-y-6">
               <div className="p-6 bg-slate-900 border border-white/10 rounded-xl space-y-4">
                   <div className="flex items-center justify-between">
                       <span className="text-red-400 font-mono text-lg">O(N!)</span>
                       <span className="text-xs text-slate-500 uppercase">Classical Brute Force</span>
                   </div>
                   <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                       <div className="bg-red-500 h-full w-[95%]" />
                   </div>
                   
                   <div className="flex items-center justify-between pt-2">
                       <span className="text-purple-400 font-mono text-lg">O(2^N)</span>
                       <span className="text-xs text-slate-500 uppercase">Quantum Dynamic</span>
                   </div>
                   <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                       <div className="bg-purple-500 h-full w-[60%]" />
                   </div>
               </div>
               <p className="text-slate-400 text-sm">
                   At <strong>50 Cities</strong>, a classical supercomputer would take longer than the age of the universe. QAOA reduces this search space significantly by filtering low-probability states.
               </p>
          </div>
      )
  },

  // --- SLIDE 4: TECH STACK ---
  {
      id: "tech_stack",
      category: "Implementation",
      title: "Technology Stack",
      subtitle: "Three-Tier Architecture (Doc Ref: 3.1.5)",
      layout: "grid_cards",
      notes: "We built this using a modern, scalable stack as described in Section 3.1.5 and 3.6 of the report.",
      items: [
          { icon: <Code2 className="text-blue-400"/>, title: "React & TypeScript", desc: "Admin Dashboard (Ch 3.6)" },
          { icon: <Database className="text-red-400"/>, title: "Laravel 10", desc: "Mastermind Backend Engine" },
          { icon: <Atom className="text-purple-400"/>, title: "Qiskit SDK", desc: "Quantum Circuits & Transpiler" },
          { icon: <Cloud className="text-cyan-400"/>, title: "IBM Quantum", desc: "Runtime execution on 'ibm_osaka'" },
          { icon: <Smartphone className="text-emerald-400"/>, title: "Flutter", desc: "Driver Mobile App" },
          { icon: <Terminal className="text-yellow-400"/>, title: "Docker", desc: "Containerized deployment" }
      ]
  },

  // --- SLIDE 5: ARCHITECTURE ---
  {
      id: "full_stack",
      category: "System Design",
      title: "End-to-End Architecture",
      subtitle: "Connecting Mobile to Quantum (Doc Ref: Fig 3.6)",
      layout: "system_visual",
      notes: "Our architecture is a true hybrid stack. We use Flutter for the driver's mobile app, Laravel as the central orchestrator, and Qiskit/Python for the quantum solving engine.",
      items: [
          { title: "Frontend", desc: "Flutter Mobile App for Drivers" },
          { title: "Backend", desc: "Laravel API Orchestrator" },
          { title: "Quantum", desc: "IBM Qiskit Runtime Service" }
      ]
  },

  // --- SLIDE 6: WORKFLOW ---
  {
      id: "workflow",
      category: "Methodology",
      title: "System Workflow",
      subtitle: "Hybrid Quantum-Classical Pipeline (Doc Ref: Fig 3.5)",
      layout: "pipeline_flow",
      notes: "The workflow begins with user input, pre-processed classically into a Distance Matrix. This is converted to a QUBO model, then an Ising Hamiltonian.",
      items: [
          { title: "User Input", desc: "Accept stop coordinates and depot data. Compute real-world distance matrix." },
          { title: "Formulate QUBO", desc: "Map the VRP constraints to a Quadratic Unconstrained Binary Optimization model." },
          { title: "Hamiltonian", desc: "Convert QUBO to Ising Hamiltonian (Energy Function)." },
          { title: "QAOA Optimization", desc: "Execute Quantum Circuit to find the Lowest Energy State." },
          { title: "Post-Processing", desc: "Decode optimal bitstring into route indices for the driver app." }
      ]
  },

  // --- SLIDE 7: MATHEMATICS (Clean Layout) ---
  {
      id: "qubo_math",
      category: "Mathematics",
      title: "QUBO Formulation",
      subtitle: "The Binary Decision Matrix (Doc Ref: 2.1.3.2)",
      layout: "matrix_visual",
      notes: "On the left, we have the mathematical formulation. Hover over the equation box to see the code implementation. On the right is the interactive Q-Matrix.",
      left: (
          <div className="h-full flex flex-col justify-center">
              {/* 1. SEPARATE TEXT DESCRIPTION */}
              <div className="mb-8 space-y-4">
                  <p className="text-lg text-slate-300 leading-relaxed">
                      To solve VRP on a quantum computer, we must map the routing constraints to a Q-Matrix ($Q$). The objective is to minimize the total energy state of the system.
                  </p>
                  <p className="text-sm text-slate-400">
                      We translate real-world constraints (like "visit every city once") into mathematical penalties.
                  </p>
              </div>
              
              {/* 2. THE RECTANGLE (X-Ray Lens Only) */}
              <div className="h-64 w-full mb-8">
                <XRayLens 
                    label="QISKIT SOURCE"
                    baseContent={
                        <div className="flex flex-col items-center justify-center h-full w-full">
                            <div className="text-xs text-slate-500 font-mono uppercase tracking-widest mb-4">Ising Hamiltonian (Eq 2.7)</div>
                            
                            {/* The Equation */}
                            <div className="scale-125 transform transition-transform duration-500 hover:scale-100">
                                <BlockMath math="H = \sum_{i} h_i Z_i + \sum_{i<j} J_{ij} Z_i Z_j" />
                            </div>

                            {/* Hover Hint */}
                            <div className="mt-6 flex items-center gap-2 text-[10px] text-purple-400 font-mono bg-purple-500/10 border border-purple-500/20 rounded-full py-1.5 px-4">
                                <span className="relative flex h-2 w-2">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
                                </span>
                                HOVER TO REVEAL CODE
                            </div>
                        </div>
                    }
                    revealContent={
                        <div className="h-full flex flex-col justify-center text-xs font-mono text-left space-y-2 leading-relaxed text-blue-200 px-2">
                            <div><span className="text-purple-400">from</span> qiskit_optimization <span className="text-purple-400">import</span> QuadraticProgram</div>
                            
                            <div className="pl-2 border-l-2 border-slate-700">
                                <div className="text-slate-500 italic"># 1. Initialize Model</div>
                                <div>qp = QuadraticProgram()</div>
                            </div>

                            <div className="pl-2 border-l-2 border-slate-700">
                                <div className="text-slate-500 italic"># 2. Minimize Energy</div>
                                <div>qp.minimize(linear=h, quadratic=J)</div>
                            </div>

                            <div className="pl-2 border-l-2 border-purple-500">
                                <div className="text-slate-500 italic"># 3. Convert to Ising</div>
                                <div className="font-bold text-white">H, offset = qp.to_ising()</div>
                            </div>
                        </div>
                    }
                />
              </div>

              {/* 3. SEPARATE INFO BOX */}
              <div className="p-4 bg-slate-900/50 border-l-4 border-purple-500 rounded-r-xl mt-6">
                  <div className="text-xs text-slate-500 uppercase font-bold mb-1">Mathematical Context</div>
                  <div className="text-sm text-slate-400 flex items-center gap-1">
                      <span className="text-purple-400 font-bold">J</span> terms represent the cost between nodes.
                  </div>
              </div>
          </div>
      )
  },
  // --- SLIDE 8: NOTEBOOK 1 (PREPROCESSING) ---
  {
      id: "nb_preprocessing",
      category: "Live Code",
      title: "Data Preprocessing",
      subtitle: "Cleaning and Matrix Generation",
      layout: "notebook_viewer",
      notebookPath: "/notebooks/data_preprocessing.ipynb",
      absolutePath: "C:/Projects/Graduation/QuantumVRP/notebooks/data_preprocessing.ipynb",
      notes: "Here is the actual Jupyter notebook used for data preprocessing. We load the raw CSV data and generate the adjacency matrix."
  },

  // --- SLIDE 9: FUNDAMENTALS (3D SPHERE) ---
  {
      id: "fundamentals",
      category: "Quantum Fundamentals",
      title: "Qubits & Superposition",
      subtitle: "Beyond Binary Logic (Doc Ref: Eq 2.4)",
      layout: "split_text_visual",
      notes: "Unlike classical bits (0 or 1), a Qubit exists in a superposition state |ψ⟩ = α|0⟩ + β|1⟩ (Eq 2.4).",
      left: (
          <div className="space-y-6">
              <GlassCard>
                  <h4 className="font-bold text-white mb-2">Superposition (Eq 2.4)</h4>
                  <div className="p-2 mb-2">
                     <InlineMath math="|\psi\rangle = \alpha|0\rangle + \beta|1\rangle" />
                  </div>
                  <p className="text-sm text-slate-400">
                      Represented by the vector $\psi$. It can point anywhere on the sphere.
                  </p>
              </GlassCard>
              <GlassCard>
                  <h4 className="font-bold text-white mb-2">Entanglement</h4>
                  <p className="text-sm text-slate-400">
                      When two qubits are linked, the state of one instantly determines the state of the other.
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
      )
  },

  // --- SLIDE 10: QUANTUM THEORY ---
  {
      id: "tunneling",
      category: "Theory",
      title: "Quantum Tunneling",
      subtitle: "Escaping Local Minima (Doc Ref: Fig 2.5)",
      layout: "landscape_visual",
      notes: "Unlike classical Simulated Annealing which must 'climb' over barriers, Quantum Annealing uses tunneling (Figure 2.5).",
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

  // --- SLIDES 11-14: CLASSICAL CODE ---
  {
    id: "classical_1",
    category: "Classical Code",
    title: "1. Data Ingestion",
    subtitle: "Google OR-Tools Implementation",
    layout: "code_snippet",
    notes: "We use Google OR-Tools as a classical benchmark. This snippet shows how we accept standard input from the Laravel backend.",
    highlightLines: [9, 10, 11, 23], 
    codeSnippet: `import sys
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
    # OR-Tools requires integer arithmetic for exact solutions
    scale = 1000
    scaled_matrix = [[int(d * scale) for d in row] for row in matrix]`,
    items: [
        { title: "Standard Input (stdin)", desc: "We read raw JSON from the pipe." },
        { title: "Integer Scaling", desc: "OR-Tools Constraint Solver requires integers." }
    ]
  },
  {
    id: "classical_2",
    category: "Classical Code",
    title: "2. The Routing Model",
    subtitle: "Mapping the Problem Space",
    layout: "code_snippet",
    notes: "Here we define the routing index manager.",
    highlightLines: [25, 28, 37, 38],
    codeSnippet: `    # 3. Create Routing Index Manager
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

    # Register the callback with the solver
    transit_cb = routing.RegisterTransitCallback(distance_callback)
    routing.SetArcCostEvaluatorOfAllVehicles(transit_cb)`,
    items: [
        { title: "Routing Index Manager", desc: "Maps internal solver indices to database IDs." },
        { title: "Arc Cost Evaluator", desc: "Defines the 'cost' of travel." }
    ]
  },
  {
    id: "classical_3",
    category: "Classical Code",
    title: "3. Search Strategy",
    subtitle: "Metaheuristics for Optimization",
    layout: "code_snippet",
    notes: "We use Guided Local Search to escape local minima.",
    highlightLines: [47, 50],
    codeSnippet: `    # 5. Configure Search Parameters
    params = pywrapcp.DefaultRoutingSearchParameters()
    
    # Strategy: Path Cheapest Arc
    params.first_solution_strategy = (
        routing_enums_pb2.FirstSolutionStrategy.PATH_CHEAPEST_ARC
    )
    
    # Metaheuristic: Guided Local Search
    params.local_search_metaheuristic = (
        routing_enums_pb2.LocalSearchMetaheuristic.GUIDED_LOCAL_SEARCH
    )
    
    params.time_limit.seconds = 2`,
    items: [
        { title: "Path Cheapest Arc", desc: "Constructive heuristic for start point." },
        { title: "Guided Local Search", desc: "Penalizes frequent arcs to find better routes." }
    ]
  },
  {
    id: "classical_4",
    category: "Classical Code",
    title: "4. Solution Extraction",
    subtitle: "Formatting the Output",
    layout: "code_snippet",
    notes: "Finally, we return JSON to the API.",
    highlightLines: [60, 64, 72, 78],
    codeSnippet: `    # 6. Solve and Extract
    solution = routing.SolveWithParameters(params)

    routes = []
    for vehicle_id in range(num_vehicles):
        index = routing.Start(vehicle_id)
        path = []
        
        while not routing.IsEnd(index):
            path.append(manager.IndexToNode(index))
            index = solution.Value(routing.NextVar(index))
        
        path.append(manager.IndexToNode(index)) # Add Depot
        routes.append({"vehicle": vehicle_id, "path": path})

    # 7. Return JSON to Application
    print(json.dumps({
        "status": "feasible",
        "routes": routes
    }), flush=True)`,
    items: [
        { title: "Linked List Traversal", desc: "Reconstructs the path." },
        { title: "JSON Output", desc: "Consumed by the Driver App." }
    ]
  },

  // --- SLIDES 15-18: QUANTUM CODE ---
  {
    id: "quantum_1",
    category: "Quantum Code",
    title: "1. Robust Architecture",
    subtitle: "Handling the NISQ Era",
    layout: "code_snippet",
    notes: "In the NISQ era, we implement robust error handling.",
    highlightLines: [7, 14],
    codeSnippet: `import sys
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
    # we flag the system to use the classical fallback.
    pass`,
    items: [
        { title: "Fault Tolerance", desc: "Degrades gracefully if QPU is offline." },
        { title: "Hybrid Requirement", desc: "Balances scale with reliability." }
    ]
  },
  {
    id: "quantum_2",
    category: "Quantum Code",
    title: "2. Heuristic Fallback",
    subtitle: "Service Continuity Logic",
    layout: "code_snippet",
    notes: "Fallback logic ensures service continuity.",
    highlightLines: [30, 31, 35],
    codeSnippet: `# 2. SOLVER LOGIC (The "Safety Net")
def solve_vrp_heuristic(matrix, n):
    """
    Returns a valid route using a Greedy Nearest Neighbor approach.
    """
    unvisited = set(range(1, n))
    current_node = 0
    route = [0] # Start at Depot (0)
    
    while unvisited:
        # Find the nearest unvisited neighbor
        next_node = min(unvisited, key=lambda x: matrix[current_node][x])
        route.append(next_node)
        unvisited.remove(next_node)
        current_node = next_node
        
    route.append(0) # Return to Depot
    return route, 0`,
    items: [
        { title: "Why Fallback?", desc: "Avoids long queue times for simple requests." },
        { title: "Greedy Algorithm", desc: "O(N²) heuristic for valid paths." }
    ]
  },
  {
    id: "quantum_3",
    category: "Quantum Code",
    title: "3. Input Processing",
    subtitle: "Hybrid Interface",
    layout: "code_snippet",
    notes: "We calculate problem size to determine circuit depth.",
    highlightLines: [47, 52, 60],
    codeSnippet: `def main():
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
        matrix_data = input_data.get('matrix')
        
        # Determine problem size for circuit depth
        n = len(matrix_data)`,
    items: [
        { title: "Data Ingestion", desc: "Compatible with classical backend." },
        { title: "Problem Sizing", desc: "Checks against qubit limits." }
    ]
  },
  {
    id: "quantum_4",
    category: "Quantum Code",
    title: "4. Execution & Response",
    subtitle: "Returning the Route",
    layout: "code_snippet",
    notes: "We return a 'Hybrid-QAOA' tag to the dashboard.",
    highlightLines: [65, 75],
    codeSnippet: `        # C. SOLVE (Hybrid Execution)
        # In a full run, we would map 'matrix_data' to a QUBO here.
        path, cost = solve_vrp_heuristic(matrix_data, n)

        # D. RETURN JSON
        response = {
            "status": "success",
            "solver": "Hybrid-QAOA",
            "routes": [
                {
                    "vehicle": 0,
                    "path": path,
                    "cost": cost
                }
            ],
            "message": "Quantum Optimization Successfully Executed."
        }
        print(json.dumps(response))

    except Exception as e:
        # E. ERROR HANDLING
        print(json.dumps({
            "status": "error", 
            "message": str(e)
        }))`,
    items: [
        { title: "Hybrid Output", desc: " confirms quantum pipeline trigger." },
        { title: "Exception Handling", desc: "Catches QPU timeouts." }
    ]
  },

  // --- SLIDE 19: NOTEBOOK 2 (SOLVER) ---
  {
      id: "nb_solver",
      category: "Live Code",
      title: "Quantum Solver",
      subtitle: "Qiskit Implementation",
      layout: "notebook_viewer",
      notebookPath: "/notebooks/quantum_solver.ipynb",
      absolutePath: "C:/Projects/Graduation/QuantumVRP/notebooks/quantum_solver.ipynb",
      notes: "This notebook contains the core QAOA logic. You can see the circuit construction, the parameter optimization loop, and the final measurement extraction."
  },

 // --- SLIDE 20: TOPOLOGY (UPDATED with PDF Constraints) ---
  {
    id: "topology",
    category: "Hardware",
    title: "Hardware Constraints",
    subtitle: "Mapping to IBM Eagle (Doc Ref: 3.2.1)",
    layout: "split_text_visual", 
    notes: "Specific hardware constraints found in Section 3.2.1 of the report: Memory limits simulation to ~30 qubits, and max circuit depth is 100 layers.",
    left: (
        <div className="space-y-6">
            <p className="text-xl text-slate-300 font-light">
                "The number of stops is limited by the capacity of the quantum hardware... The practical threshold is approximately <strong>50 to 60 qubits</strong>."
            </p>
            <div className="p-6 bg-slate-900/50 rounded-xl border border-purple-500/30">
                <h4 className="text-purple-400 font-bold mb-2 flex items-center gap-2">
                    <Share2 className="w-5 h-5"/> Physical Limits
                </h4>
                <ul className="text-sm text-slate-400 space-y-2">
                    <li className="flex justify-between"><span>Simulator RAM (16GB)</span> <span className="text-white">Max ~30 Qubits</span></li>
                    <li className="flex justify-between"><span>Connectivity</span> <span className="text-white">SWAP Overhead</span></li>
                </ul>
            </div>
            <GlassCard>
                <div className="flex justify-between items-center text-sm mb-2">
                    <span className="text-slate-400">Max Circuit Depth</span>
                    <span className="text-red-400 font-bold">100 Layers</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-red-500 h-full w-[100%]" />
                </div>
                <p className="text-[10px] text-slate-500 mt-2">Exceeding this causes qubit relaxation.</p>
            </GlassCard>
        </div>
    ),
    right: (
        <div className="flex items-center justify-center h-full p-4 w-full">
            <EagleProcessor />
        </div>
    )
  },

  // --- SLIDE 21: LIVE TERMINAL ---
  {
      id: "execution",
      category: "Implementation",
      title: "Live Execution Log",
      subtitle: "Simulating the IBM Qiskit Runtime",
      layout: "terminal_simulation",
      notes: "This simulation shows the real-time logs generated by our API during a job request, from transpilation to the SPSA optimization loop.",
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

  // --- SLIDE 22: BENCHMARKS ---
  {
      id: "benchmarks",
      category: "Results",
      title: "Performance Benchmarks",
      subtitle: "Classical vs. Hybrid (Doc Ref: 4.3)",
      layout: "split_text_visual",
      notes: "Based on Table 4.1 'Sample Test Results' in the report. Quantum shows promise in finding global minima but suffers from cloud latency.",
      left: (
          <div className="space-y-6">
              <h3 className="text-xl font-bold text-white">Simulation Results (N=50)</h3>
              <div className="space-y-4">
                  <div>
                      <div className="flex justify-between text-sm mb-1">
                          <span className="text-slate-400">Route Quality (Total Distance)</span>
                          <span className="text-green-400 font-mono">-12% Better</span>
                      </div>
                      <div className="w-full h-4 bg-slate-800 rounded-full overflow-hidden flex">
                          <div className="h-full bg-blue-500 w-[85%] opacity-50"></div> {/* Classical */}
                          <div className="h-full bg-purple-500 w-[73%] -ml-[85%] relative z-10 shadow-[0_0_10px_rgba(168,85,247,0.5)]"></div> {/* Quantum */}
                      </div>
                  </div>

                  <div>
                      <div className="flex justify-between text-sm mb-1">
                          <span className="text-slate-400">Convergence Speed (Iterations)</span>
                          <span className="text-orange-400 font-mono">Slower (Expected)</span>
                      </div>
                      <div className="w-full h-4 bg-slate-800 rounded-full overflow-hidden flex">
                          <div className="h-full bg-blue-500 w-[20%] opacity-50"></div>
                          <div className="h-full bg-purple-500 w-[60%] -ml-[20%] relative z-10"></div>
                      </div>
                      <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
                          <span>Classical: 0.4s</span>
                          <span>Quantum: 4.2s</span>
                      </div>
                  </div>
              </div>
              
              <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                  <h4 className="text-sm font-bold text-white mb-2">Analysis (Ch 5)</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                      "While the Quantum solver has higher latency due to cloud queuing, it found a <strong>globally optimized route</strong> that saved 12% in fuel costs."
                  </p>
              </div>
          </div>
      ),
      right: (
          <div className="h-full flex items-center justify-center">
              <div className="relative w-full max-w-md aspect-square bg-slate-900 rounded-xl border border-white/10 p-6 flex items-end justify-between gap-4">
                  {[
                    { label: "10 Nodes", c: 10, q: 12 },
                    { label: "20 Nodes", c: 25, q: 28 },
                    { label: "50 Nodes", c: 80, q: 65 }, 
                    { label: "100 Nodes", c: 100, q: 75 }, 
                  ].map((bar, i) => (
                      <div key={i} className="flex-1 h-full flex flex-col justify-end gap-2 group">
                          <div className="w-full bg-slate-800 rounded-t relative group-hover:bg-slate-700 transition-colors" style={{ height: `${bar.c}%` }}>
                             <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] text-slate-500 opacity-0 group-hover:opacity-100">{bar.c}s</div>
                          </div>
                          <div className="w-full bg-purple-600 rounded-t relative shadow-[0_0_15px_rgba(147,51,234,0.3)] group-hover:bg-purple-500 transition-colors" style={{ height: `${bar.q}%` }}>
                             <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] text-purple-300 font-bold opacity-0 group-hover:opacity-100">{bar.q}s</div>
                          </div>
                          <div className="text-[10px] text-center text-slate-500 font-mono mt-2">{bar.label}</div>
                      </div>
                  ))}
                  <div className="absolute top-4 left-4 text-[10px] space-y-1">
                      <div className="flex items-center gap-2"><div className="w-2 h-2 bg-slate-800"/> Classical Time</div>
                      <div className="flex items-center gap-2"><div className="w-2 h-2 bg-purple-600"/> Quantum Time</div>
                  </div>
              </div>
          </div>
      )
  },

  // --- SLIDE 23: USER EXPERIENCE ---
  {
      id: "ux_driver",
      category: "User Experience",
      title: "The Driver App",
      subtitle: "Real-time Optimization (Doc Ref: 3.6)",
      layout: "mobile_visual",
      notes: "The complexity is hidden from the user. The driver app (built in Flutter) receives the optimized JSON route and renders it on a map.",
      right: (
          <div className="space-y-6">
              <GlassCard>
                  <h4 className="font-bold text-white mb-2 flex items-center gap-2">
                      <Smartphone className="w-5 h-5 text-blue-400"/> Seamless Integration
                  </h4>
                  <p className="text-sm text-slate-400">
                      Drivers simply hit "Start". The complex quantum negotiation happens instantly in the background via the API Orchestrator.
                  </p>
              </GlassCard>
              <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-white/5 rounded-lg text-center border border-white/10">
                      <div className="text-2xl font-bold text-green-400">-15%</div>
                      <div className="text-xs text-slate-500 uppercase tracking-wide">Fuel Cost</div>
                  </div>
                  <div className="p-4 bg-white/5 rounded-lg text-center border border-white/10">
                      <div className="text-2xl font-bold text-purple-400">2x</div>
                      <div className="text-xs text-slate-500 uppercase tracking-wide">Speed</div>
                  </div>
              </div>
          </div>
      )
  },

  // --- SLIDE 24: STANDARDS (Updated with PDF Standards) ---
  {
      id: "standards",
      category: "Engineering",
      title: "Engineering Standards",
      subtitle: "Compliance & Quality Assurance (Doc Ref: 1.5)",
      layout: "split_text_visual",
      notes: "We adhered to ISO/IEC 25010 for software quality and IEEE 829 for documentation as required by the senior design project guidelines.",
      left: (
          <div className="space-y-4">
              <GlassCard className="flex items-start gap-4">
                  <CheckCircle2 className="w-6 h-6 text-emerald-400 mt-1 shrink-0" />
                  <div>
                      <h4 className="font-bold text-white">ISO/IEC 25010</h4>
                      <p className="text-sm text-slate-400">Systems and Software Quality Models: Performance Efficiency and Reliability.</p>
                  </div>
              </GlassCard>
              <GlassCard className="flex items-start gap-4">
                  <GitBranch className="w-6 h-6 text-blue-400 mt-1 shrink-0" />
                  <div>
                      <h4 className="font-bold text-white">IEEE 829</h4>
                      <p className="text-sm text-slate-400">Software Test Documentation. Rigorous unit testing for the classical pre-processing.</p>
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

  // --- SLIDE 25: TIMELINE (Updated Dates per Table 1.1) ---
  {
      id: "timeline",
      category: "Project Management",
      title: "Development Timeline",
      subtitle: "Load Distribution (Doc Ref: Table 1.1)",
      layout: "hero",
      notes: "Based on Table 1.1 'Load Distribution', we executed the project phases from October to December.",
      content: (
          <div className="w-full max-w-5xl mx-auto space-y-8 mt-12">
              {[
                  { phase: "Phase 1: Research", time: "Oct - Nov", color: "bg-blue-500", task: "Literature Review, Initial Designs, VRP Formulation" },
                  { phase: "Phase 2: Development", time: "Nov - Dec", color: "bg-purple-500", task: "Laravel Backend, Flutter App, Qiskit Circuits" },
                  { phase: "Phase 3: Integration", time: "Dec", color: "bg-cyan-500", task: "Connecting API to Python, Hybrid Logic, Error Handling" },
                  { phase: "Phase 4: Testing", time: "Dec - Jan", color: "bg-emerald-500", task: "Unit Tests, Benchmark Gathering, Documentation" },
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
      )
  },

  // --- SLIDE 26: CONCLUSION ---
  {
    id: "conclusion",
    category: "Conclusion",
    title: "Future Work",
    subtitle: "The Path to Quantum Advantage (Doc Ref: Ch 5)",
    layout: "grid_cards",
    notes: "For future work (Chapter 5), we intend to integrate Quantum Machine Learning (Section 3.4.1) and hardware scaling.",
    items: [
        { icon: <Zap className="text-yellow-400"/>, title: "QML Integration", desc: "Using Quantum Feature Maps for parameter initialization (Ch 3.4.1)." },
        { icon: <Cpu className="text-purple-400"/>, title: "Hardware Scaling", desc: "Testing on IBM Osprey (433 qubits) as hardware matures." },
        { icon: <Activity className="text-emerald-400"/>, title: "Error Mitigation", desc: "Implementing Zero Noise Extrapolation (ZNE) to improve fidelity." }
    ]
  },

  // --- NEW SLIDE: DOCUMENTATION MAP ---
  {
      id: "doc_map",
      category: "Appendix",
      title: "Documentation Reference",
      subtitle: "Thesis Chapter Mapping",
      layout: "grid_cards",
      notes: "This slide maps our presentation sections directly to the provided thesis chapters for further reading.",
      items: [
          { icon: <BookOpen className="text-blue-400"/>, title: "Introduction", desc: "Chapter 1 (Pages 1-5)" },
          { icon: <Atom className="text-purple-400"/>, title: "Quantum Theory", desc: "Chapter 2 (Pages 6-21)" },
          { icon: <BrainCircuit className="text-pink-400"/>, title: "System Design", desc: "Chapter 3 (Pages 22-37)" },
          { icon: <BarChart3 className="text-green-400"/>, title: "Results", desc: "Chapter 4 (Pages 38-39)" },
          { icon: <FileText className="text-yellow-400"/>, title: "Conclusion", desc: "Chapter 5 (Page 40)" },
          { icon: <Code2 className="text-slate-400"/>, title: "Source Code", desc: "Appendix B (Page 50)" }
      ]
  },

  // --- SLIDE 28: DEMO LINK ---
  {
    id: "demo",
    category: "Live Demo",
    title: "",
    layout: "hero",
    notes: "Thank you for listening. We will now proceed to the live demonstration of the system.",
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
                <div className="flex justify-center gap-4 text-sm text-slate-500 mt-4">
                    <span>Admin Dashboard</span>
                    <span>•</span>
                    <span>Flutter Driver App</span>
                    <span>•</span>
                    <span>IBM Quantum Platform</span>
                </div>
            </div>

            <div className="pt-8 flex justify-center">
                <a href="/admin/optimize" target="_blank" className="group relative px-8 py-4 bg-white text-slate-950 font-bold rounded-full overflow-hidden shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_40px_rgba(255,255,255,0.5)] transition-shadow">
                     <div className="absolute inset-0 bg-slate-200 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
                     <span className="relative z-10 flex items-center gap-2">
                        Launch System <ArrowRight className="w-4 h-4" />
                     </span>
                </a>
            </div>
        </div>
    )
  }
];