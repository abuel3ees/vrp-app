import React, { useState } from "react";
import { Head, router } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IconCpu, IconMapPin, IconBolt, IconTruck, IconPlayerPlay } from "@tabler/icons-react";
// 1. Import the loading overlay
import { LoadingOverlay } from "@/components/loading-overlay";

const INSTANCES = [
  {
    id: "RealWorldPostToy_3_1",
    name: "RealWorldPostToy 3.1",
    category: "Distance Constrained",
    nodes: 4, 
    vehicles: 5,
    difficulty: "Easy",
    description: "Toy instance with 3 delivery points in Brazil grid."
  },
  {
    id: "RealWorldPostToy_5_2",
    name: "RealWorldPostToy 5.2",
    category: "Distance Constrained",
    nodes: 6, 
    vehicles: 5,
    difficulty: "Medium",
    description: "Toy instance with 5 delivery points in Brazil grid."
  }
];

export default function OptimizeIndex() {
  const [selectedSolver, setSelectedSolver] = useState("classical");
  const [processingId, setProcessingId] = useState<string | null>(null);
  // 2. State to track which specific solver animation to show
  const [runningSolverType, setRunningSolverType] = useState<'quantum' | 'classical' | null>(null);

  const handleRun = (instance: typeof INSTANCES[0]) => {
    setProcessingId(instance.id);
    setRunningSolverType(selectedSolver as 'quantum' | 'classical');
    
    router.post('/admin/optimize/run', {
      instance_id: instance.id,
      solver: selectedSolver,
    }, {
      onFinish: () => {
        setProcessingId(null);
        setRunningSolverType(null);
      },
      onError: (errors) => {
        console.error("Optimization error:", errors);
        setProcessingId(null);
        setRunningSolverType(null);
      }
    });
  };

  return (
    <AdminLayout>
      <Head title="Select Instance" />

      {/* 3. Drop the Loading Overlay here. It covers the screen when loading. */}
      <LoadingOverlay 
        isLoading={processingId !== null} 
        type={runningSolverType} 
      />
      
      <div className="flex flex-col gap-6 p-4 md:p-6 max-w-7xl mx-auto w-full">
        
        {/* PAGE HEADER */}
        <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                <IconCpu className="text-slate-500 dark:text-slate-400" size={32} /> 
                Optimization Studio
            </h1>
            <p className="text-slate-500 dark:text-slate-400">
                Select a routing instance and a solver backend to generate optimized delivery paths.
            </p>
        </div>

        {/* CONTROL BAR */}
        <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4 bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
          <div>
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">Select Solver Engine</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Choose the algorithm backend for the calculations.</p>
          </div>
          <div className="w-full md:w-64">
              <Select value={selectedSolver} onValueChange={setSelectedSolver}>
                <SelectTrigger className="w-full bg-slate-50 dark:bg-slate-950 border-slate-300 dark:border-slate-800 text-slate-900 dark:text-slate-100">
                  <SelectValue placeholder="Select Solver" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="classical">
                      <div className="flex items-center gap-2">
                          <IconTruck size={16} className="text-blue-600"/> 
                          <span>Google OR-Tools (Classical)</span>
                      </div>
                  </SelectItem>
                  <SelectItem value="quantum">
                      <div className="flex items-center gap-2">
                          <IconBolt size={16} className="text-purple-600"/> 
                          <span>IBM Qiskit (Quantum)</span>
                      </div>
                  </SelectItem>
                </SelectContent>
              </Select>
          </div>
        </div>

        {/* GRID OF INSTANCES */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {INSTANCES.map((inst) => (
            <Card key={inst.id} className="relative overflow-hidden hover:shadow-lg transition-all border-slate-200 dark:border-slate-800 hover:border-emerald-400/50 group bg-white dark:bg-slate-900">
              <div className="absolute top-0 right-0 p-3 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
                  <IconMapPin size={120} className="text-slate-900 dark:text-white" />
              </div>
              
              <CardHeader>
                <div className="flex justify-between items-start">
                  <Badge variant="outline" className="mb-2 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                      {inst.category}
                  </Badge>
                  <Badge className={
                      inst.difficulty === 'Hard' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200' :
                      inst.difficulty === 'Medium' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200' :
                      'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200'
                  }>
                      {inst.difficulty}
                  </Badge>
                </div>
                <CardTitle className="text-xl text-slate-900 dark:text-slate-100">{inst.name}</CardTitle>
                <CardDescription className="text-slate-500 dark:text-slate-400">{inst.description}</CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex flex-col bg-slate-50 dark:bg-slate-800 p-3 rounded-lg border border-slate-100 dark:border-slate-700">
                          <span className="text-slate-500 dark:text-slate-400 text-xs uppercase font-semibold">Total Nodes</span>
                          <span className="font-bold text-slate-800 dark:text-slate-200 text-lg">{inst.nodes}</span>
                      </div>
                      <div className="flex flex-col bg-slate-50 dark:bg-slate-800 p-3 rounded-lg border border-slate-100 dark:border-slate-700">
                          <span className="text-slate-500 dark:text-slate-400 text-xs uppercase font-semibold">Vehicles</span>
                          <span className="font-bold text-slate-800 dark:text-slate-200 text-lg">{inst.vehicles}</span>
                      </div>
                  </div>
              </CardContent>

              <CardFooter>
                <Button 
                  className="w-full gap-2 bg-slate-900 hover:bg-emerald-600 dark:bg-slate-100 dark:hover:bg-emerald-500 dark:text-slate-900 text-white transition-colors shadow-md hover:shadow-lg"
                  disabled={processingId !== null}
                  onClick={() => handleRun(inst)}
                >
                  {processingId === inst.id ? (
                      <>Processing...</>
                  ) : (
                      <>
                          <IconPlayerPlay size={16} /> 
                          Optimize
                      </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

      </div>
    </AdminLayout>
  );
}