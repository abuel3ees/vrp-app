import React, { useEffect, useState } from 'react'
import { Atom, Loader2, Network, Server, Cpu, MapPin } from 'lucide-react'
import { cn } from '@/lib/utils'

interface LoadingOverlayProps {
  isLoading: boolean
  type: 'quantum' | 'classical' | null
}

export function LoadingOverlay({ isLoading, type }: LoadingOverlayProps) {
  const [message, setMessage] = useState('')

  // Quantum-themed messages
  const quantumMessages = [
    "Initializing Qiskit Environment...",
    "Mapping VRP to Qubits...",
    "Optimizing Quantum Circuit...",
    "Running QAOA Algorithm...",
    "Measuring Superposition...",
    "Collapsing Wavefunction...",
    "Decoding Bitstrings..."
  ]

  // Classical-themed messages
  const classicalMessages = [
    "Initializing OR-Tools...",
    "Loading Distance Matrix...",
    "Calculating Heuristic Paths...",
    "Optimizing Local Search...",
    "Reducing Travel Cost...",
    "Finalizing Routes..."
  ]

  // Cycle through messages to make it feel alive
  useEffect(() => {
    if (!isLoading) return
    
    const messages = type === 'quantum' ? quantumMessages : classicalMessages
    setMessage(messages[0])

    const interval = setInterval(() => {
      setMessage(prev => {
        const currentIndex = messages.indexOf(prev)
        return messages[(currentIndex + 1) % messages.length]
      })
    }, 2000) // Change text every 2 seconds

    return () => clearInterval(interval)
  }, [isLoading, type])

  if (!isLoading || !type) return null

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm transition-all animate-in fade-in duration-300">
      
      {/* --- QUANTUM THEME --- */}
      {type === 'quantum' && (
        <div className="flex flex-col items-center space-y-8">
          <div className="relative">
            {/* Outer spinning ring */}
            <div className="absolute inset-0 rounded-full border-4 border-t-purple-500 border-r-transparent border-b-blue-500 border-l-transparent animate-spin-slow h-32 w-32" />
            
            {/* Inner pulsing core */}
            <div className="h-32 w-32 flex items-center justify-center rounded-full bg-slate-900/50 shadow-[0_0_40px_-10px_rgba(168,85,247,0.5)]">
               <Atom className="h-16 w-16 text-purple-400 animate-pulse" />
            </div>
            
            {/* Orbital particles */}
            <div className="absolute top-0 left-0 h-32 w-32 animate-reverse-spin">
                <div className="absolute top-2 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full bg-blue-400 shadow-[0_0_10px_rgba(96,165,250,0.8)]" />
            </div>
          </div>

          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
              Quantum Solver Active
            </h2>
            <p className="text-muted-foreground font-mono text-sm animate-pulse">
              {message}
            </p>
          </div>
        </div>
      )}

      {/* --- CLASSICAL THEME --- */}
      {type === 'classical' && (
        <div className="flex flex-col items-center space-y-8">
          <div className="relative">
            {/* Connecting Nodes Animation */}
            <div className="h-32 w-32 grid grid-cols-2 grid-rows-2 gap-2 animate-pulse">
                <div className="bg-amber-500/20 rounded-lg flex items-center justify-center border border-amber-500/50">
                    <MapPin className="text-amber-500 h-6 w-6" />
                </div>
                <div className="bg-emerald-500/20 rounded-lg flex items-center justify-center border border-emerald-500/50">
                    <Network className="text-emerald-500 h-6 w-6" />
                </div>
                <div className="bg-blue-500/20 rounded-lg flex items-center justify-center border border-blue-500/50">
                    <Server className="text-blue-500 h-6 w-6" />
                </div>
                <div className="bg-orange-500/20 rounded-lg flex items-center justify-center border border-orange-500/50">
                    <Cpu className="text-orange-500 h-6 w-6" />
                </div>
            </div>
            
            {/* Loading Spinner Overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
                 <Loader2 className="h-10 w-10 text-foreground animate-spin" />
            </div>
          </div>

          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              Classical Optimization
            </h2>
            <p className="text-muted-foreground font-mono text-sm">
              {message}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}