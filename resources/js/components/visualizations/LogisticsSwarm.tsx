import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, Shuffle } from 'lucide-react';

export const LogisticsSwarm = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [mode, setMode] = useState<'chaos' | 'order'>('chaos');

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d', { alpha: false });
        if (!ctx) return;

        // --- CONFIG ---
        let width = 0;
        let height = 0;
        const PARTICLE_COUNT = 300;
        const TRAIL_LENGTH = 15;
        
        interface Particle {
            x: number;
            y: number;
            vx: number;
            vy: number;
            history: {x: number, y: number}[];
            hue: number;
            speed: number;
        }

        const particles: Particle[] = [];
        
        // --- INITIALIZATION ---
        const resize = () => {
            const parent = canvas.parentElement;
            if (parent) {
                canvas.width = parent.clientWidth;
                canvas.height = parent.clientHeight || 500;
                width = canvas.width;
                height = canvas.height;
                initParticles();
            }
        };

        const initParticles = () => {
            particles.length = 0;
            for (let i = 0; i < PARTICLE_COUNT; i++) {
                particles.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    vx: (Math.random() - 0.5) * 2,
                    vy: (Math.random() - 0.5) * 2,
                    history: [],
                    hue: Math.random() * 60 + 240, // Blue to Purple
                    speed: Math.random() * 2 + 1
                });
            }
        };

        // --- PHYSICS ENGINE ---
        const update = () => {
            // Clear with trail effect
            ctx.fillStyle = 'rgba(2, 6, 23, 0.2)'; // Fade out trails
            ctx.fillRect(0, 0, width, height);

            particles.forEach(p => {
                // 1. Move
                p.x += p.vx * p.speed;
                p.y += p.vy * p.speed;

                // 2. Mode Behavior
                if (mode === 'order') {
                    // FLOW FIELD (Quantum Optimization)
                    // Create a smooth flow towards the center-right
                    const angle = Math.cos(p.x * 0.005) + Math.sin(p.y * 0.005);
                    p.vx += Math.cos(angle) * 0.1;
                    p.vy += Math.sin(angle) * 0.1;
                    
                    // Gentle pull to center to keep them on screen
                    const dx = width/2 - p.x;
                    const dy = height/2 - p.y;
                    p.vx += dx * 0.0001;
                    p.vy += dy * 0.0001;

                    // Limit speed
                    const speed = Math.sqrt(p.vx*p.vx + p.vy*p.vy);
                    if (speed > 3) {
                        p.vx = (p.vx / speed) * 3;
                        p.vy = (p.vy / speed) * 3;
                    }
                    
                    // Sync Colors (Cyan/Green)
                    p.hue = 160 + (speed * 20); 

                } else {
                    // CHAOS (Classical Brute Force)
                    // Random jitter
                    p.vx += (Math.random() - 0.5) * 0.5;
                    p.vy += (Math.random() - 0.5) * 0.5;
                    
                    // Bounce off walls
                    if (p.x < 0 || p.x > width) p.vx *= -1;
                    if (p.y < 0 || p.y > height) p.vy *= -1;

                    // Colors (Red/Purple warning)
                    p.hue = 340 + (Math.random() * 40); 
                }

                // 3. Store History
                p.history.push({ x: p.x, y: p.y });
                if (p.history.length > TRAIL_LENGTH) p.history.shift();

                // 4. Draw
                ctx.beginPath();
                if (p.history.length > 1) {
                    ctx.moveTo(p.history[0].x, p.history[0].y);
                    for (let i = 1; i < p.history.length; i++) {
                        ctx.lineTo(p.history[i].x, p.history[i].y);
                    }
                }
                ctx.strokeStyle = `hsla(${p.hue}, 100%, 50%, 0.8)`;
                ctx.lineWidth = 2;
                ctx.stroke();
                
                // Head
                ctx.fillStyle = `white`;
                ctx.fillRect(p.x - 1, p.y - 1, 2, 2);
            });

            requestAnimationFrame(update);
        };

        window.addEventListener('resize', resize);
        resize();
        update();

        return () => window.removeEventListener('resize', resize);
    }, [mode]);

    return (
        <div className="relative w-full h-[500px] bg-slate-950 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl">
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
            
            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />

            {/* Controls */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-4 z-20 bg-slate-900/80 backdrop-blur-md p-2 rounded-full border border-white/10">
                <button 
                    onClick={() => setMode('chaos')}
                    className={`flex items-center gap-2 px-6 py-2 rounded-full font-bold transition-all ${mode === 'chaos' ? 'bg-red-500/20 text-red-400 border border-red-500/50' : 'text-slate-400 hover:text-white'}`}
                >
                    <Shuffle className="w-4 h-4" />
                    Classical Chaos
                </button>
                <div className="w-[1px] bg-white/10 my-1" />
                <button 
                    onClick={() => setMode('order')}
                    className={`flex items-center gap-2 px-6 py-2 rounded-full font-bold transition-all ${mode === 'order' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50' : 'text-slate-400 hover:text-white'}`}
                >
                    <Zap className="w-4 h-4" />
                    Quantum Flow
                </button>
            </div>
            
            {/* HUD */}
            <div className="absolute top-6 left-6 font-mono text-xs">
                 <div className="flex items-center gap-2 text-slate-400 mb-1">
                    <div className={`w-2 h-2 rounded-full animate-pulse ${mode === 'order' ? 'bg-cyan-400' : 'bg-red-500'}`} />
                    SWARM STATUS
                 </div>
                 <div className={`text-xl font-bold ${mode === 'order' ? 'text-cyan-400' : 'text-red-500'}`}>
                    {mode === 'order' ? 'OPTIMIZED' : 'DIVERGENT'}
                 </div>
            </div>
        </div>
    );
};