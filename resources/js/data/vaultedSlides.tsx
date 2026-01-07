import React from "react";
import { BlockMath, InlineMath } from "react-katex";
import { 
    Activity, Server, Cpu, Check, X, TrendingUp, Zap, 
    Database, AlertTriangle, Lock, Network, GitBranch,
    DollarSign, Users, BookOpen, Map, Settings,
    ArrowRight, FileText, Share2
} from "lucide-react";
import "katex/dist/katex.min.css"; // Ensure you have this installed

interface Slide {
    id: string;
    category: string;
    title: string;
    subtitle?: string;
    layout?: string;
    content: React.ReactNode;
    notes?: string;
}

export const vaultedSlides: Slide[] = [
    // ==========================================
    // SECTION 1: THE MATHEMATICAL FOUNDATION
    // ==========================================

    // --- 1. COMPLEXITY PROOF ---
    {
        id: "math_complexity",
        category: "Q. Math / Complexity",
        title: "Combinatorial Explosion",
        subtitle: "Why Classical Exhaustive Search Fails",
        layout: "split_text_visual",
        content: (
            <div className="flex flex-col justify-center gap-6 h-full">
                <div className="space-y-4">
                    <p className="text-slate-300">
                        The solution space ($S$) for a Multi-Vehicle Routing Problem grows super-exponentially based on the number of vehicles ($k$) and customers ($n$).
                    </p>
                    <div className="p-4 bg-slate-800 rounded-lg border border-slate-700 shadow-lg">
                        <div className="text-xs text-slate-500 mb-2 uppercase tracking-wider">Solution Space Formula (Eq 2.3)</div>
                        <BlockMath math="S = k^n \times \prod_{i=1}^{k} (n_i!)" />
                    </div>
                    <p className="text-sm text-slate-400">
                        <strong>Example:</strong> For just 10 vehicles and 100 customers:
                    </p>
                    <div className="text-center p-4 bg-red-900/20 border border-red-500/30 rounded font-mono text-red-200 text-lg">
                        <InlineMath math="10^{100} \times 10^{65} = 10^{165}" /> Possibilities
                    </div>
                    <p className="text-xs text-slate-500 text-center italic">
                        *Exceeds the number of atoms in the observable universe ($10^{80}$).
                    </p>
                </div>
            </div>
        ),
        notes: "Source: Eq 2.3 in documentation. Use this to shut down any suggestion of 'brute force' on classical computers."
    },

    // --- 2. QUBO FORMULATION ---
    {
        id: "qubo_deep_dive",
        category: "Q. Formulation",
        title: "QUBO & Hamiltonian Mapping",
        subtitle: "Translating Logic to Energy States",
        layout: "math_deep_dive",
        content: (
            <div className="h-full flex flex-col justify-center space-y-6">
                <div className="bg-slate-900 p-6 rounded-xl border border-slate-700 shadow-md">
                    <div className="text-xs text-blue-400 uppercase tracking-widest mb-2 font-bold">1. Objective Function</div>
                    <BlockMath math="f(x) = x^{\top}Qx + c^{\top}x" />
                    <p className="text-xs text-slate-400 mt-2">
                        We map constraints to high-cost penalties in the $Q$ matrix. Infeasible routes (e.g., disjoint loops) get assigned massive energy values.
                    </p>
                </div>

                <div className="bg-slate-900 p-6 rounded-xl border border-purple-500/30 shadow-md">
                    <div className="text-xs text-purple-400 uppercase tracking-widest mb-2 font-bold">2. Ising Hamiltonian Conversion</div>
                    <BlockMath math="x_i \to \frac{1 - Z_i}{2}" />
                    <p className="text-xs text-slate-400 mt-2">
                        Binary variables ($0,1$) are mapped to Spin operators ($+1, -1$) for the quantum processor.
                    </p>
                </div>
            </div>
        )
    },

    // --- 3. QAOA MECHANICS ---
    {
        id: "qaoa_mechanics",
        category: "Q. Algorithm",
        title: "QAOA: Under the Hood",
        subtitle: "The Cost and Mixer Hamiltonians",
        layout: "split_text_visual",
        content: (
            <div className="space-y-6">
                <div className="p-4 bg-slate-900 border-l-4 border-blue-500 rounded-r-xl shadow-lg">
                    <h4 className="text-blue-400 font-bold mb-2 flex items-center gap-2"><Settings className="w-4 h-4"/> The Phase Separator (<InlineMath math="H_C" />)</h4>
                    <p className="text-sm text-slate-300 mb-2">Encodes the problem constraints. It adds a phase to solutions based on their cost.</p>
                    <BlockMath math="U(H_C, \gamma) = e^{-i\gamma H_C}" />
                </div>

                <div className="p-4 bg-slate-900 border-l-4 border-purple-500 rounded-r-xl shadow-lg">
                    <h4 className="text-purple-400 font-bold mb-2 flex items-center gap-2"><Share2 className="w-4 h-4"/> The Mixer (<InlineMath math="H_M" />)</h4>
                    <p className="text-sm text-slate-300 mb-2">Driven by Pauli-X gates (<InlineMath math="\hat{X}" />). It enables transitions between states (quantum tunneling) to escape local minima.</p>
                    <BlockMath math="U(H_M, \beta) = e^{-i\beta \sum X_i}" />
                </div>
                
                <div className="text-xs text-slate-500 italic text-center">
                    "We alternate these two operators <InlineMath math="p" /> times to amplify the probability of the optimal bitstring."
                </div>
            </div>
        )
    },

    // ==========================================
    // SECTION 2: COMPARATIVE ANALYSIS (DEFENSE)
    // ==========================================

    // --- 4. WHY NOT VQE? ---
    {
        id: "why_not_vqe",
        category: "Q. Alternatives",
        title: "Defense: Rejection of VQE",
        subtitle: "Why Variational Quantum Eigensolvers were unsuitable",
        layout: "center",
        content: (
            <div className="grid grid-cols-2 gap-8 w-full max-w-5xl">
                {/* VQE (Bad) */}
                <div className="p-6 bg-red-900/10 border border-red-500/30 rounded-xl relative">
                    <div className="absolute -top-3 left-4 bg-slate-950 px-2 text-red-400 font-bold text-xs uppercase">VQE (Rejected)</div>
                    <ul className="space-y-6 mt-2">
                        <li className="flex gap-3">
                            <div className="mt-1"><X className="w-6 h-6 text-red-500"/></div>
                            <div>
                                <strong className="text-slate-200">Black Box Ansatz</strong>
                                <p className="text-xs text-slate-400 mt-1">Structure often doesn't map cleanly to graph problems. It guesses broadly rather than specifically.</p>
                            </div>
                        </li>
                        <li className="flex gap-3">
                            <div className="mt-1"><X className="w-6 h-6 text-red-500"/></div>
                            <div>
                                <strong className="text-slate-200">Barren Plateaus</strong>
                                <p className="text-xs text-slate-400 mt-1">Gradient vanishes in deep circuits, making training impossible as the parameter landscape becomes flat.</p>
                            </div>
                        </li>
                    </ul>
                </div>

                {/* QAOA (Good) */}
                <div className="p-6 bg-green-900/10 border border-green-500/30 rounded-xl relative">
                    <div className="absolute -top-3 left-4 bg-slate-950 px-2 text-green-400 font-bold text-xs uppercase">QAOA (Selected)</div>
                    <ul className="space-y-6 mt-2">
                        <li className="flex gap-3">
                            <div className="mt-1"><Check className="w-6 h-6 text-green-500"/></div>
                            <div>
                                <strong className="text-slate-200">Problem-Aware</strong>
                                <p className="text-xs text-slate-400 mt-1">The Hamiltonian explicitly encodes the VRP graph structure, ensuring the search is relevant.</p>
                            </div>
                        </li>
                        <li className="flex gap-3">
                            <div className="mt-1"><Check className="w-6 h-6 text-green-500"/></div>
                            <div>
                                <strong className="text-slate-200">Shallow Depth</strong>
                                <p className="text-xs text-slate-400 mt-1">Effective even at $p=1$ or $p=2$, fitting current NISQ hardware limits.</p>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        )
    },

    // --- 5. WHY NOT ANNEALING? ---
    {
        id: "why_not_annealing",
        category: "Q. Alternatives",
        title: "Defense: Rejection of Annealing",
        subtitle: "The 'Minor Embedding' Problem",
        layout: "center",
        content: (
            <div className="flex flex-col items-center justify-center h-full gap-8">
                <div className="flex gap-12 items-center">
                    {/* Logical Graph */}
                    <div className="text-center">
                        <div className="w-32 h-32 border-2 border-dashed border-blue-500 rounded-full flex items-center justify-center text-blue-300 font-bold text-sm mb-2 bg-blue-500/10">
                            Logical Graph<br/>(All-to-All)
                        </div>
                        <p className="text-xs text-slate-500">VRP requires full connectivity</p>
                    </div>

                    <ArrowRight className="w-8 h-8 text-slate-600" />

                    {/* Physical Graph */}
                    <div className="text-center">
                        <div className="w-32 h-32 border-2 border-red-500 rounded-lg grid grid-cols-3 gap-1 p-2 bg-red-900/10">
                            {[...Array(9)].map((_, i) => <div key={i} className="bg-red-500/50 rounded-full w-full h-full"></div>)}
                        </div>
                        <div className="text-red-400 font-bold text-sm mt-2">Physical Chimera Graph</div>
                        <p className="text-xs text-slate-500">Sparse connectivity</p>
                    </div>
                </div>

                <div className="p-4 bg-slate-800 rounded-xl max-w-2xl text-center border border-yellow-500/20">
                    <h4 className="text-yellow-400 font-bold mb-1"><AlertTriangle className="w-4 h-4 inline mr-2"/>The Embedding Penalty</h4>
                    <p className="text-sm text-slate-300">
                        To map our VRP to D-Wave, we must use <strong>chains of physical qubits</strong> to represent a single logical variable. 
                        This increases qubit usage quadratically and introduces "Chain Break" errors.
                    </p>
                </div>
            </div>
        )
    },

    // ==========================================
    // SECTION 3: ENGINEERING & CONSTRAINTS
    // ==========================================

    // --- 6. HARDWARE CONSTRAINTS ---
    {
        id: "hardware_constraints",
        category: "Q. Hardware",
        title: "NISQ Hardware Limitations",
        subtitle: "Why we cannot simply 'scale up' yet",
        layout: "grid_cards",
        content: (
            <div className="grid grid-cols-2 gap-6 w-full max-w-4xl">
                <div className="p-6 bg-slate-900 border border-red-500/30 rounded-xl">
                    <div className="flex items-center gap-3 mb-2 text-red-400">
                        <Database className="w-5 h-5"/>
                        <h3 className="font-bold">Classical Simulation Limit</h3>
                    </div>
                    <p className="text-sm text-slate-300 mb-2">
                        State vector simulation RAM usage grows exponentially:
                    </p>
                    <div className="text-xs font-mono bg-black p-2 rounded text-red-200 border border-red-900">
                        Memory = $2^N \times 16$ Bytes
                    </div>
                    <p className="text-xs text-slate-500 mt-2">16GB RAM $\approx$ 30 Qubits Max.</p>
                </div>

                <div className="p-6 bg-slate-900 border border-purple-500/30 rounded-xl">
                    <div className="flex items-center gap-3 mb-2 text-purple-400">
                        <Activity className="w-5 h-5"/>
                        <h3 className="font-bold">Coherence Time ($T_1$)</h3>
                    </div>
                    <p className="text-sm text-slate-300 mb-2">
                        Circuit depth is capped at <strong>~100 layers</strong>. Exceeding this causes qubit relaxation (data loss) before measurement.
                    </p>
                    <div className="w-full bg-slate-800 h-2 rounded-full mt-4 overflow-hidden">
                        <div className="bg-purple-500 w-3/4 h-full" />
                    </div>
                    <div className="text-[10px] text-right text-purple-400 mt-1">Decoherence Threshold</div>
                </div>
            </div>
        )
    },

    // --- 7. ERROR MITIGATION ---
    {
        id: "error_mitigation",
        category: "Q. Reliability",
        title: "Error Mitigation Strategy",
        subtitle: "Zero-Noise Extrapolation (ZNE)",
        layout: "split_text_visual",
        content: (
            <div className="flex flex-col gap-6 h-full justify-center">
                <div className="bg-slate-900 p-6 rounded-xl border border-slate-700">
                    <h4 className="text-purple-400 font-bold mb-4 flex gap-2"><TrendingUp /> Richardson Extrapolation</h4>
                    <p className="text-slate-300 text-sm mb-4">
                        We cannot measure at zero noise. Instead, we intentionally <strong>amplify</strong> the noise (scaling $\lambda = 1, 3, 5$) and fit a curve to extrapolate back to zero.
                    </p>
                    <div className="h-32 w-full bg-slate-800 rounded relative overflow-hidden border border-slate-700">
                        {/* Curve diagram */}
                        <svg className="w-full h-full overflow-visible p-4">
                            <path d="M 40 100 Q 150 80 300 30" fill="none" stroke="#ef4444" strokeWidth="2" strokeDasharray="4 4" />
                            
                            {/* Points */}
                            <circle cx="40" cy="100" r="4" fill="#a855f7" stroke="white" strokeWidth="1"/>
                            <text x="50" y="110" fill="#a855f7" fontSize="12" fontWeight="bold">Target (Zero Noise)</text>
                            
                            <circle cx="150" cy="80" r="4" fill="#94a3b8" />
                            <text x="150" y="70" fill="#94a3b8" fontSize="10" textAnchor="middle">Scale=1</text>
                            
                            <circle cx="260" cy="45" r="4" fill="#94a3b8" />
                            <text x="260" y="35" fill="#94a3b8" fontSize="10" textAnchor="middle">Scale=3</text>
                        </svg>
                    </div>
                </div>
            </div>
        )
    },

    // --- 8. SYSTEM ARCHITECTURE ---
    {
        id: "full_stack",
        category: "Q. Architecture",
        title: "Three-Tier Hybrid Architecture",
        subtitle: "Decoupling Quantum Execution from Client Access",
        layout: "center",
        content: (
            <div className="w-full max-w-6xl flex justify-between items-center bg-slate-900 p-8 rounded-2xl border border-slate-700 shadow-xl">
                {/* Tier 1 */}
                <div className="text-center w-1/3 group">
                    <div className="mx-auto w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-400 mb-4 group-hover:bg-blue-500/30 transition-colors"><Users className="w-8 h-8"/></div>
                    <h4 className="font-bold text-white text-lg">Presentation Layer</h4>
                    <p className="text-sm text-slate-400 mt-1">Flutter (Mobile) & React (Admin)</p>
                    <div className="text-[10px] bg-blue-900/40 text-blue-200 px-2 py-1 rounded mt-3 inline-block">Real-time WebSockets</div>
                </div>

                <div className="h-[2px] flex-1 bg-slate-600 relative">
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] bg-slate-950 px-2 text-slate-400 border border-slate-700 rounded-full">HTTPS / JSON</div>
                </div>

                {/* Tier 2 */}
                <div className="text-center w-1/3 group">
                    <div className="mx-auto w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center text-white mb-4 group-hover:bg-slate-600 transition-colors"><Server className="w-8 h-8"/></div>
                    <h4 className="font-bold text-white text-lg">Logic Layer</h4>
                    <p className="text-sm text-slate-400 mt-1">Laravel Backend</p>
                    <div className="text-[10px] bg-slate-700 text-slate-200 px-2 py-1 rounded mt-3 inline-block">Auth & Job Queues</div>
                </div>

                <div className="h-[2px] flex-1 bg-slate-600 relative">
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] bg-slate-950 px-2 text-slate-400 border border-slate-700 rounded-full">Python Subprocess</div>
                </div>

                {/* Tier 3 */}
                <div className="text-center w-1/3 group">
                    <div className="mx-auto w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center text-purple-400 mb-4 group-hover:bg-purple-500/30 transition-colors"><Cpu className="w-8 h-8"/></div>
                    <h4 className="font-bold text-white text-lg">Compute Layer</h4>
                    <p className="text-sm text-slate-400 mt-1">Qiskit / IBM Cloud</p>
                    <div className="text-[10px] bg-purple-900/40 text-purple-200 px-2 py-1 rounded mt-3 inline-block">Circuit Execution</div>
                </div>
            </div>
        ),
        notes: "Reference Section 3.1.5. Explain how this decoupling allows the app to stay responsive while the quantum job sits in a queue."
    },

    // --- 9. SECURITY ---
    {
        id: "security_rbac",
        category: "Q. Security",
        title: "Security Implementation",
        subtitle: "Role-Based Access Control (RBAC)",
        layout: "center",
        content: (
            <div className="grid grid-cols-2 gap-8 w-full max-w-4xl">
                <div className="p-6 bg-slate-800 rounded-xl border border-green-500/20 shadow-md">
                    <div className="flex items-center gap-3 mb-4 text-green-400">
                        <Lock className="w-6 h-6"/>
                        <h3 className="font-bold">Access Control Matrix</h3>
                    </div>
                    <ul className="text-sm text-slate-300 space-y-3">
                        <li className="flex justify-between border-b border-white/5 pb-2">
                            <span>System Admin</span>
                            <span className="text-green-400 font-mono text-xs bg-green-900/20 px-2 py-1 rounded">RW: All Routes, Config</span>
                        </li>
                        <li className="flex justify-between border-b border-white/5 pb-2">
                            <span>Driver</span>
                            <span className="text-yellow-500 font-mono text-xs bg-yellow-900/20 px-2 py-1 rounded">R: Assigned Route Only</span>
                        </li>
                        <li className="flex justify-between pt-2">
                            <span>Public Guest</span>
                            <span className="text-red-500 font-mono text-xs bg-red-900/20 px-2 py-1 rounded">No Access</span>
                        </li>
                    </ul>
                </div>
                <div className="p-6 bg-slate-800 rounded-xl border border-blue-500/20 shadow-md">
                    <div className="flex items-center gap-3 mb-4 text-blue-400">
                        <Network className="w-6 h-6"/>
                        <h3 className="font-bold">API Security</h3>
                    </div>
                    <p className="text-sm text-slate-300 leading-relaxed">
                        Communications between the Flutter App and Laravel Backend are secured using <strong>Laravel Sanctum Tokens</strong>.
                        <br/><br/>
                        Sensitive route data is never exposed to unauthenticated endpoints, and Quantum Job IDs are salted to prevent enumeration.
                    </p>
                </div>
            </div>
        )
    },

    // ==========================================
    // SECTION 4: DATA & RESULTS
    // ==========================================

    // --- 10. TEST METRICS ---
    {
        id: "test_metrics",
        category: "Q. Validation",
        title: "Validation Metrics",
        subtitle: "Requirements Verification Matrix (Table 4.3)",
        layout: "center",
        content: (
            <div className="w-full max-w-5xl">
                <table className="w-full text-left border-collapse bg-slate-900 rounded-lg overflow-hidden shadow-lg border border-slate-700">
                    <thead className="bg-slate-800 text-slate-400 text-xs uppercase tracking-wider">
                        <tr>
                            <th className="py-4 px-6 font-semibold">Requirement</th>
                            <th className="py-4 px-6 font-semibold">Target</th>
                            <th className="py-4 px-6 font-semibold">Achieved</th>
                            <th className="py-4 px-6 font-semibold">Status</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm text-slate-300 divide-y divide-slate-700">
                        <tr className="hover:bg-slate-800/50 transition-colors">
                            <td className="py-4 px-6">Multi-Objective</td>
                            <td className="py-4 px-6">Distance + Time</td>
                            <td className="py-4 px-6">Weighted Sum</td>
                            <td className="py-4 px-6 text-green-400 font-bold"><Check className="w-4 h-4 inline mr-1"/> PASS</td>
                        </tr>
                        <tr className="hover:bg-slate-800/50 transition-colors">
                            <td className="py-4 px-6">Constraints</td>
                            <td className="py-4 px-6">Capacity, Windows</td>
                            <td className="py-4 px-6">Soft Penalty Terms</td>
                            <td className="py-4 px-6 text-green-400 font-bold"><Check className="w-4 h-4 inline mr-1"/> PASS</td>
                        </tr>
                        <tr className="hover:bg-slate-800/50 transition-colors">
                            <td className="py-4 px-6">Testing Scope</td>
                            <td className="py-4 px-6">2 Instances</td>
                            <td className="py-4 px-6">5/7 Node Sets</td>
                            <td className="py-4 px-6 text-green-400 font-bold"><Check className="w-4 h-4 inline mr-1"/> PASS</td>
                        </tr>
                        <tr className="hover:bg-slate-800/50 transition-colors">
                            <td className="py-4 px-6">Cloud Execution</td>
                            <td className="py-4 px-6">IBM Quantum</td>
                            <td className="py-4 px-6 font-mono text-xs">ibm_brisbane</td>
                            <td className="py-4 px-6 text-green-400 font-bold"><Check className="w-4 h-4 inline mr-1"/> PASS</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        )
    },

    // --- 11. FINANCIAL ANALYSIS ---
    {
        id: "financials",
        category: "Q. Business",
        title: "Operational Cost Matrix",
        subtitle: "Prototype vs Production Economics",
        layout: "center",
        content: (
            <div className="grid grid-cols-2 gap-8 w-full max-w-4xl mx-auto">
                {/* Prototype */}
                <div className="p-6 bg-slate-800 rounded-xl border border-slate-700 shadow-lg">
                    <div className="text-xs uppercase text-slate-500 mb-2 font-bold tracking-wider">Current State (Prototype)</div>
                    <div className="text-4xl font-bold text-white mb-1">$1.60 <span className="text-sm font-normal text-slate-400">/ run</span></div>
                    <div className="text-xs text-red-400 mb-4 bg-red-900/20 inline-block px-2 py-1 rounded mt-2">High Research Overhead</div>
                    <ul className="text-sm text-slate-300 space-y-3 mt-4">
                        <li className="flex items-center gap-2"><div className="w-1 h-1 bg-slate-400 rounded-full"></div> IBM Cloud Pay-As-You-Go</li>
                        <li className="flex items-center gap-2"><div className="w-1 h-1 bg-slate-400 rounded-full"></div> 4000 Shots per circuit</li>
                        <li className="flex items-center gap-2"><div className="w-1 h-1 bg-slate-400 rounded-full"></div> Unoptimized Circuit Depth</li>
                    </ul>
                </div>

                {/* Production */}
                <div className="p-6 bg-green-900/10 rounded-xl border border-green-500/30 shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10"><DollarSign className="w-24 h-24 text-green-500"/></div>
                    <div className="text-xs uppercase text-green-400 mb-2 font-bold tracking-wider">Projected (Production)</div>
                    <div className="text-4xl font-bold text-white mb-1">$0.02 <span className="text-sm font-normal text-slate-400">/ run</span></div>
                    <div className="text-xs text-green-400 mb-4 bg-green-900/20 inline-block px-2 py-1 rounded mt-2">Economies of Scale</div>
                    <ul className="text-sm text-slate-300 space-y-3 mt-4 relative z-10">
                        <li className="flex items-center gap-2"><Check className="w-3 h-3 text-green-500"/> Reserved Instance Pricing</li>
                        <li className="flex items-center gap-2"><Check className="w-3 h-3 text-green-500"/> Hybrid Solver (Offload heavy lift)</li>
                        <li className="flex items-center gap-2"><Check className="w-3 h-3 text-green-500"/> Warm-starting QAOA parameters</li>
                    </ul>
                </div>
            </div>
        )
    },

    // ==========================================
    // SECTION 5: FUTURE & STANDARDS
    // ==========================================

    // --- 12. STANDARDS ---
    {
        id: "standards_iso",
        category: "Q. Standards",
        title: "Engineering Standards",
        subtitle: "ISO/IEC 25010 & IEEE 829 Compliance",
        layout: "split_text_visual",
        content: (
            <div className="flex flex-col gap-6 justify-center h-full">
                <div className="flex items-start gap-4 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                    <div className="p-3 bg-blue-500/20 rounded text-blue-400"><BookOpen className="w-6 h-6"/></div>
                    <div>
                        <h4 className="text-lg font-bold text-white">ISO/IEC 25010</h4>
                        <p className="text-sm text-slate-400">Software Quality Models</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                            <span className="px-2 py-1 bg-slate-900 text-xs rounded border border-slate-600 text-slate-300">Reliability</span>
                            <span className="px-2 py-1 bg-slate-900 text-xs rounded border border-slate-600 text-slate-300">Usability</span>
                            <span className="px-2 py-1 bg-slate-900 text-xs rounded border border-slate-600 text-slate-300">Performance</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                    <div className="p-3 bg-purple-500/20 rounded text-purple-400"><FileText className="w-6 h-6"/></div>
                    <div>
                        <h4 className="text-lg font-bold text-white">IEEE 829</h4>
                        <p className="text-sm text-slate-400">Software Test Documentation</p>
                        <p className="text-xs text-slate-500 mt-2 italic">
                            All unit tests, integration scenarios (Laravel-Qiskit handshake), and validation metrics are formally documented in the thesis appendix.
                        </p>
                    </div>
                </div>
            </div>
        )
    },

    // --- 13. FUTURE ROADMAP ---
    {
        id: "future_roadmap",
        category: "Q. Roadmap",
        title: "Future Work",
        subtitle: "Towards Dynamic Quantum VRP",
        layout: "grid_cards",
        content: (
            <div className="grid grid-cols-2 gap-6 w-full max-w-4xl">
                <div className="p-6 bg-slate-900 border border-blue-500/30 rounded-xl group hover:border-blue-500/60 transition-colors">
                    <div className="flex items-center gap-3 mb-3 text-blue-400">
                        <Database className="w-6 h-6"/>
                        <h3 className="font-bold">QRAM Integration</h3>
                    </div>
                    <p className="text-sm text-slate-300">
                        Loading real-time traffic data into quantum states using logarithmic depth circuits ($O(\log N)$) instead of rebuilding the Hamiltonian every time.
                    </p>
                </div>

                <div className="p-6 bg-slate-900 border border-yellow-500/30 rounded-xl group hover:border-yellow-500/60 transition-colors">
                    <div className="flex items-center gap-3 mb-3 text-yellow-400">
                        <Zap className="w-6 h-6"/>
                        <h3 className="font-bold">Dynamic Re-routing</h3>
                    </div>
                    <p className="text-sm text-slate-300">
                        Using VQE to adjust routes on-the-fly when edge weights change (e.g., accidents) without full re-computation.
                    </p>
                </div>
            </div>
        )
    },

    // --- 14. TEAM ROLES ---
    {
        id: "team_roles",
        category: "Q. Admin",
        title: "Team Load Distribution",
        subtitle: "Contribution Matrix (Table 1.1)",
        layout: "center",
        content: (
            <div className="w-full max-w-4xl">
                <table className="w-full text-left border-collapse bg-slate-900 rounded-lg shadow-lg">
                    <thead className="bg-slate-800 text-slate-400 text-xs uppercase tracking-wider">
                        <tr>
                            <th className="py-4 px-6">Task</th>
                            <th className="py-4 px-6 text-purple-400 font-bold">Leen</th>
                            <th className="py-4 px-6 text-blue-400 font-bold">Abdulrahman</th>
                            <th className="py-4 px-6 text-green-400 font-bold">Malak</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm text-slate-300 divide-y divide-slate-800">
                        <tr>
                            <td className="py-4 px-6 font-bold">Introduction</td>
                            <td className="py-4 px-6">70%</td>
                            <td className="py-4 px-6">10%</td>
                            <td className="py-4 px-6">20%</td>
                        </tr>
                        <tr>
                            <td className="py-4 px-6 font-bold">Design Process</td>
                            <td className="py-4 px-6">30%</td>
                            <td className="py-4 px-6">40%</td>
                            <td className="py-4 px-6">30%</td>
                        </tr>
                        <tr>
                            <td className="py-4 px-6 font-bold">Literature Review</td>
                            <td className="py-4 px-6">35%</td>
                            <td className="py-4 px-6">30%</td>
                            <td className="py-4 px-6">35%</td>
                        </tr>
                        <tr>
                            <td className="py-4 px-6 font-bold">Implementation</td>
                            <td className="py-4 px-6"><span className="bg-purple-900/30 text-purple-200 px-2 py-1 rounded text-xs">Backend/API</span></td>
                            <td className="py-4 px-6"><span className="bg-blue-900/30 text-blue-200 px-2 py-1 rounded text-xs">Mobile App</span></td>
                            <td className="py-4 px-6"><span className="bg-green-900/30 text-green-200 px-2 py-1 rounded text-xs">Quantum Algo</span></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        ),
        notes: "Source: Table 1.1 in documentation. Be ready to defend your specific contribution."
    },

    // --- 15. QML ALTERNATIVE ---
    {
        id: "qml_alternative",
        category: "Q. Alternatives",
        title: "Quantum Machine Learning?",
        subtitle: "Why we didn't use Quantum Neural Networks",
        layout: "center",
        content: (
            <div className="flex gap-8 items-center justify-center max-w-5xl">
                <div className="p-6 bg-slate-900 border border-slate-700 rounded-xl flex-1 h-64 shadow-lg">
                    <h4 className="font-bold text-white mb-2 text-lg">QML Approach</h4>
                    <p className="text-xs text-slate-400 mb-4">Training a QNN to predict paths based on historical data.</p>
                    <ul className="space-y-3 text-sm text-red-300">
                        <li className="flex gap-2 items-center"><X className="w-4 h-4 bg-red-900/50 rounded-full p-0.5"/> Requires Massive Datasets</li>
                        <li className="flex gap-2 items-center"><X className="w-4 h-4 bg-red-900/50 rounded-full p-0.5"/> Black Box Decision Making</li>
                        <li className="flex gap-2 items-center"><X className="w-4 h-4 bg-red-900/50 rounded-full p-0.5"/> Hard to enforce strict constraints</li>
                    </ul>
                </div>
                
                <div className="text-slate-500 font-bold text-2xl">VS</div>

                <div className="p-6 bg-slate-900 border border-green-500/30 rounded-xl flex-1 h-64 shadow-lg shadow-green-900/10">
                    <h4 className="font-bold text-white mb-2 text-lg">Our QAOA Approach</h4>
                    <p className="text-xs text-slate-400 mb-4">Direct mathematical optimization of the Hamiltonian.</p>
                    <ul className="space-y-3 text-sm text-green-300">
                        <li className="flex gap-2 items-center"><Check className="w-4 h-4 bg-green-900/50 rounded-full p-0.5"/> No Training Data Needed</li>
                        <li className="flex gap-2 items-center"><Check className="w-4 h-4 bg-green-900/50 rounded-full p-0.5"/> Transparent Energy Landscape</li>
                        <li className="flex gap-2 items-center"><Check className="w-4 h-4 bg-green-900/50 rounded-full p-0.5"/> Guaranteed Constraint Penalty</li>
                    </ul>
                </div>
            </div>
        )
    },

    // --- 16. TSP PIPELINE ---
    {
        id: "tsp_pipeline",
        category: "Q. Implementation",
        title: "TSP Implementation Pipeline",
        subtitle: "Data Flow for the Quantum Solver",
        layout: "center",
        content: (
            <div className="flex flex-col items-center gap-6 w-full">
                <div className="flex gap-4 items-center">
                    <div className="bg-slate-800 p-4 rounded-lg text-center w-40 border border-slate-600 shadow-md">
                        <div className="text-xs text-slate-500 uppercase font-bold mb-1">Input</div>
                        <div className="font-mono text-white text-sm">Distance Matrix</div>
                    </div>
                    <ArrowRight className="text-slate-600"/>
                    <div className="bg-slate-800 p-4 rounded-lg text-center w-40 border border-purple-500/50 shadow-md shadow-purple-900/20">
                        <div className="text-xs text-slate-500 uppercase font-bold mb-1">Model</div>
                        <div className="font-mono text-purple-400 text-sm">Quadratic Program</div>
                    </div>
                    <ArrowRight className="text-slate-600"/>
                    <div className="bg-slate-800 p-4 rounded-lg text-center w-40 border border-blue-500/50 shadow-md shadow-blue-900/20">
                        <div className="text-xs text-slate-500 uppercase font-bold mb-1">Solver</div>
                        <div className="font-mono text-blue-400 text-sm">QAOA (SPSA)</div>
                    </div>
                </div>
                
                <div className="h-8 w-[1px] bg-slate-600"></div>

                <div className="bg-slate-900 border border-slate-700 p-6 rounded-xl w-full max-w-2xl text-center relative">
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-slate-950 px-3 text-xs text-slate-500 uppercase tracking-widest">Post-Processing</div>
                    <p className="text-sm text-slate-300 flex items-center justify-center gap-2">
                        Decode bitstring <ArrowRight className="w-3 h-3"/> Filter Feasible Routes <ArrowRight className="w-3 h-3"/> Select Minimum Cost
                    </p>
                </div>
            </div>
        ),
        notes: "Source: Figure 3.5 in documentation. Explain that we don't just take the first result; we sample and filter."
    },

    // --- 17. BATTERY CONSTRAINTS ---
    {
        id: "commercial_constraints",
        category: "Q. Commercial",
        title: "Commercial Constraints",
        subtitle: "Driver App Performance",
        layout: "center",
        content: (
            <div className="flex items-center justify-center gap-8">
                <div className="p-6 bg-slate-900 border border-slate-700 rounded-xl w-72 h-48 flex flex-col justify-between hover:border-yellow-500/50 transition-colors">
                    <div className="flex items-center gap-3 text-yellow-400">
                        <Zap className="w-6 h-6"/>
                        <h4 className="font-bold">Battery Life</h4>
                    </div>
                    <p className="text-sm text-slate-300">
                        Driver app is optimized to minimize polling. Real-time updates use <strong>WebSockets</strong> instead of HTTP polling to save energy for 8-hour shifts.
                    </p>
                </div>
                <div className="p-6 bg-slate-900 border border-slate-700 rounded-xl w-72 h-48 flex flex-col justify-between hover:border-blue-500/50 transition-colors">
                    <div className="flex items-center gap-3 text-blue-400">
                        <Network className="w-6 h-6"/>
                        <h4 className="font-bold">Network Reliability</h4>
                    </div>
                    <p className="text-sm text-slate-300">
                        App caches route data locally (SQLite) to handle variable network conditions in remote delivery zones.
                    </p>
                </div>
            </div>
        )
    },

    // --- 18. CODE SNIPPET ---
    {
        id: "code_sample",
        category: "Q. Code",
        title: "Cost Function Implementation",
        subtitle: "Python / Qiskit Optimization",
        layout: "code_snippet",
        content: (
            <div className="w-full max-w-3xl bg-[#1e1e1e] p-6 rounded-xl border border-slate-700 font-mono text-xs text-blue-300 overflow-hidden shadow-2xl">
                <div className="flex gap-2 mb-4 border-b border-white/10 pb-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="ml-2 text-slate-500">optimization.py</span>
                </div>
                <div><span className="text-purple-400">def</span> <span className="text-yellow-300">cost_function</span>(x):</div>
                <div className="pl-4">
                    <span className="text-slate-500">"""Calculates energy for a given bitstring."""</span>
                </div>
                <div className="pl-4">
                    total_dist = <span className="text-orange-300">0</span>
                </div>
                <div className="pl-4">
                    <span className="text-purple-400">for</span> i <span className="text-purple-400">in</span> <span className="text-yellow-300">range</span>(n):
                </div>
                <div className="pl-8">
                    <span className="text-purple-400">for</span> j <span className="text-purple-400">in</span> <span className="text-yellow-300">range</span>(n):
                </div>
                <div className="pl-12">
                    <span className="text-purple-400">if</span> x[i, j] == <span className="text-orange-300">1</span>:
                </div>
                <div className="pl-16">
                    total_dist += distance_matrix[i][j]
                </div>
                <div className="pl-4 mt-2">
                    <span className="text-slate-500"># Add Penalty for constraint violation (Lagrange Multiplier)</span>
                </div>
                <div className="pl-4">
                    penalty = lambda_val * (<span className="text-yellow-300">sum</span>(x) - <span className="text-orange-300">1</span>)**<span className="text-orange-300">2</span>
                </div>
                <div className="pl-4 mt-2">
                    <span className="text-purple-400">return</span> total_dist + penalty
                </div>
            </div>
        )
    },

    // --- 19. DATA SOURCE (Essential Missing Slide) ---
    {
        id: "data_source",
        category: "Q. Data",
        title: "Data Acquisition",
        subtitle: "Building the Distance Matrix",
        layout: "center",
        content: (
            <div className="flex flex-col items-center justify-center gap-8 w-full max-w-5xl">
                <div className="grid grid-cols-2 gap-8 w-full">
                     <div className="bg-slate-900 p-6 rounded-xl border border-slate-700 flex flex-col gap-4">
                        <div className="flex items-center gap-3 text-green-400 font-bold border-b border-white/10 pb-2">
                            <Map className="w-5 h-5"/> OpenStreetMap (OSM)
                        </div>
                        <p className="text-sm text-slate-300">
                            We do not calculate Euclidean (straight-line) distance. We extract real road-network topology nodes from OSM to ensure physical feasibility.
                        </p>
                     </div>

                     <div className="bg-slate-900 p-6 rounded-xl border border-slate-700 flex flex-col gap-4">
                        <div className="flex items-center gap-3 text-blue-400 font-bold border-b border-white/10 pb-2">
                            <GitBranch className="w-5 h-5"/> OSRM Engine
                        </div>
                        <p className="text-sm text-slate-300">
                            The <strong>Open Source Routing Machine</strong> computes the all-to-all travel time matrix, which serves as the weights (<InlineMath math="w_{ij}" />) for our quantum graph.
                        </p>
                     </div>
                </div>

                <div className="w-full bg-slate-800 p-4 rounded-lg text-center border border-slate-600">
                    <code className="text-xs text-blue-300 font-mono">
                        GET /table/v1/driving/lat,lon;lat,lon;...?annotations=distance,duration
                    </code>
                </div>
            </div>
        )
    },

    // --- 20. CIRCUIT VISUALIZATION (Essential Missing Slide) ---
    {
        id: "circuit_vis",
        category: "Q. Circuit",
        title: "Circuit Composition",
        subtitle: "The Anatomy of a QAOA Layer",
        layout: "center",
        content: (
            <div className="flex flex-col items-center justify-center w-full max-w-5xl bg-white/5 p-8 rounded-xl border border-white/10">
                <div className="flex items-center gap-1 w-full overflow-x-auto pb-4">
                    {/* H Layer */}
                    <div className="flex flex-col gap-2 items-center">
                        <div className="w-12 h-12 border-2 border-blue-400 bg-blue-900/50 flex items-center justify-center text-white font-bold rounded">H</div>
                        <span className="text-[10px] text-slate-400 uppercase">Superposition</span>
                    </div>

                    <div className="w-8 h-[2px] bg-slate-500"></div>

                    {/* Cost Layer */}
                    <div className="flex flex-col gap-2 items-center relative">
                        <div className="w-16 h-12 border-2 border-purple-500 bg-purple-900/50 flex items-center justify-center text-white font-bold rounded">Rzz</div>
                        <span className="text-[10px] text-purple-400 uppercase">Cost ($\gamma$)</span>
                        <div className="absolute -top-6 text-[10px] text-slate-500">Problem Hamiltonian</div>
                    </div>

                    <div className="w-8 h-[2px] bg-slate-500"></div>

                    {/* Mixer Layer */}
                    <div className="flex flex-col gap-2 items-center relative">
                        <div className="w-16 h-12 border-2 border-green-500 bg-green-900/50 flex items-center justify-center text-white font-bold rounded">Rx</div>
                        <span className="text-[10px] text-green-400 uppercase">Mixer ($\beta$)</span>
                        <div className="absolute -top-6 text-[10px] text-slate-500">Mixer Hamiltonian</div>
                    </div>

                    <div className="w-8 h-[2px] bg-slate-500"></div>

                    {/* Measurement */}
                    <div className="flex flex-col gap-2 items-center">
                        <div className="w-12 h-12 border-2 border-slate-600 bg-black flex items-center justify-center text-white font-bold rounded relative">
                            <div className="w-8 h-4 border-b-2 border-white rounded-b-full"></div>
                            <div className="absolute top-3 w-[2px] h-3 bg-white transform rotate-12"></div>
                        </div>
                        <span className="text-[10px] text-slate-400 uppercase">Measure</span>
                    </div>
                </div>
                <p className="text-xs text-slate-400 mt-4 max-w-lg text-center">
                    A single layer ($p=1$) consists of Hadamard gates for superposition, followed by the Cost unitary (entangling gates encoding the VRP graph) and the Mixer unitary (single qubit rotations).
                </p>
            </div>
        )
    }
];