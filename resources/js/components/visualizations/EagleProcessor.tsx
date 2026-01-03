import React, { useEffect, useRef } from 'react';

export const EagleProcessor = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d', { alpha: false }); // Optimize for speed
        if (!ctx) return;

        // --- CONFIGURATION ---
        const HEX_SIZE = 18;     // Size of each qubit hex
        const SPACING_X = 35;    // Horizontal density
        const SPACING_Y = 30;    // Vertical density
        const PACKET_COUNT = 40; // How many data bits are flying around
        const PULSE_SPEED = 0.02;

        let width = 0;
        let height = 0;
        let time = 0;

        // --- ENTITIES ---
        interface Qubit {
            x: number;
            y: number;
            active: number; // 0 to 1 intensity
            neighbors: Qubit[];
        }
        
        interface Packet {
            current: Qubit;
            target: Qubit;
            progress: number; // 0 to 1
            speed: number;
        }

        let qubits: Qubit[] = [];
        let packets: Packet[] = [];

        // --- SETUP ---
        const resize = () => {
            const parent = canvas.parentElement;
            if (parent) {
                canvas.width = parent.clientWidth;
                canvas.height = 500; // Fixed height
                width = canvas.width;
                height = canvas.height;
            }
            initTopology();
        };

        const initTopology = () => {
            qubits = [];
            packets = [];
            
            // 1. Generate Heavy-Hex Lattice (Approximation)
            const rows = Math.ceil(height / SPACING_Y) + 2;
            const cols = Math.ceil(width / SPACING_X) + 2;

            const grid: Qubit[][] = [];

            for(let r = 0; r < rows; r++) {
                grid[r] = [];
                for(let c = 0; c < cols; c++) {
                    const xOffset = (r % 2) * (SPACING_X / 2);
                    const x = c * SPACING_X + xOffset - 20;
                    const y = r * SPACING_Y - 20;
                    
                    // Only create qubits in a central "Chip" shape to look realistic
                    // Create a mask to cut off corners
                    const distX = Math.abs(x - width/2);
                    const distY = Math.abs(y - height/2);
                    if (distX < width/2 - 20 && distY < height/2 - 20) {
                        const q: Qubit = { x, y, active: 0, neighbors: [] };
                        qubits.push(q);
                        grid[r][c] = q;
                    }
                }
            }

            // 2. Connect Neighbors (Hexagonal Connectivity)
            for(let r = 0; r < rows; r++) {
                for(let c = 0; c < cols; c++) {
                    const q = grid[r]?.[c];
                    if (!q) continue;

                    // Odd rows connect differently than even rows in hex grids
                    const candidates = [
                        { r: r, c: c + 1 },      // Right
                        { r: r + 1, c: c },      // Bottom Right (even) or Bottom Left (odd)
                        { r: r + 1, c: c + (r % 2 === 0 ? -1 : 1) } 
                    ];

                    candidates.forEach(pos => {
                        const neighbor = grid[pos.r]?.[pos.c];
                        if (neighbor) {
                            q.neighbors.push(neighbor);
                            neighbor.neighbors.push(q); // Bi-directional
                        }
                    });
                }
            }

            // 3. Spawn Initial Packets
            for(let i=0; i < PACKET_COUNT; i++) {
                spawnPacket();
            }
        };

        const spawnPacket = () => {
            if (qubits.length === 0) return;
            const start = qubits[Math.floor(Math.random() * qubits.length)];
            if (start.neighbors.length > 0) {
                packets.push({
                    current: start,
                    target: start.neighbors[Math.floor(Math.random() * start.neighbors.length)],
                    progress: 0,
                    speed: 0.05 + Math.random() * 0.05 // Random speed
                });
            }
        };

        // --- RENDER LOOP ---
        const draw = () => {
            // 1. Darken Background (Trails effect)
            ctx.fillStyle = '#020617'; // Slate-950
            ctx.fillRect(0, 0, width, height);

            time += PULSE_SPEED;

            // 2. Draw Connections (The Circuit Board)
            ctx.lineWidth = 1;
            ctx.strokeStyle = 'rgba(30, 41, 59, 0.5)'; // Subtle slate lines
            ctx.beginPath();
            qubits.forEach(q => {
                q.neighbors.forEach(n => {
                    // Only draw one way to avoid double draw
                    if (q.x < n.x || (q.x === n.x && q.y < n.y)) {
                        ctx.moveTo(q.x, q.y);
                        ctx.lineTo(n.x, n.y);
                    }
                });
            });
            ctx.stroke();

            // 3. Update & Draw Packets (The Data Flow)
            ctx.lineWidth = 2;
            packets.forEach((p, index) => {
                p.progress += p.speed;
                
                // Calculate position
                const curX = p.current.x + (p.target.x - p.current.x) * p.progress;
                const curY = p.current.y + (p.target.y - p.current.y) * p.progress;

                // Draw Head
                ctx.shadowBlur = 10;
                ctx.shadowColor = '#a855f7'; // Purple glow
                ctx.fillStyle = '#fff';
                ctx.beginPath();
                ctx.arc(curX, curY, 1.5, 0, Math.PI*2);
                ctx.fill();
                ctx.shadowBlur = 0; // Reset

                // Packet Reached Destination?
                if (p.progress >= 1) {
                    // Flash the target node
                    p.target.active = 1.0; 

                    // Pick new target
                    p.current = p.target;
                    const next = p.current.neighbors[Math.floor(Math.random() * p.current.neighbors.length)];
                    if (next) {
                        p.target = next;
                        p.progress = 0;
                    } else {
                        // Dead end (shouldn't happen in grid but safe fallback)
                        packets.splice(index, 1);
                        spawnPacket();
                    }
                }
            });

            // 4. Draw Qubits (The Nodes)
            qubits.forEach(q => {
                // Decay activity
                if (q.active > 0) q.active -= 0.02;
                
                // Base pulse based on position (Wave effect)
                const wave = (Math.sin(q.x * 0.01 + time) + Math.cos(q.y * 0.01 + time)) * 0.1;
                const brightness = Math.max(0, q.active + wave);

                if (brightness > 0.05) {
                    const colorVal = Math.floor(brightness * 255);
                    // Mix Cyan and Purple based on activity
                    const r = 168; 
                    const g = 85 + (brightness * 100); 
                    const b = 247;
                    
                    ctx.fillStyle = `rgba(${r},${g},${b},${brightness})`;
                    ctx.beginPath();
                    ctx.arc(q.x, q.y, 2 + brightness * 2, 0, Math.PI*2);
                    ctx.fill();
                }
            });

            requestAnimationFrame(draw);
        };

        // --- RUN ---
        window.addEventListener('resize', resize);
        resize();
        draw();

        return () => window.removeEventListener('resize', resize);
    }, []);

    return (
        <div className="relative w-full h-full min-h-[500px] bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
            {/* The High-Performance Canvas */}
            <canvas ref={canvasRef} className="absolute inset-0 block w-full h-full" />
            
            {/* Overlay: Vignette & Scanlines for that 'Monitor' look */}
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.6)_100%)]" />
            <div className="absolute inset-0 pointer-events-none opacity-20" style={{ backgroundImage: "linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))", backgroundSize: "100% 2px, 3px 100%" }} />
            
            {/* UI Overlay */}
            <div className="absolute top-6 left-6 z-10 flex flex-col gap-1">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_#22c55e]" />
                    <span className="text-xs font-mono text-green-500 font-bold tracking-widest uppercase">System Online</span>
                </div>
                <h3 className="text-2xl font-black text-white tracking-tighter">IBM EAGLE <span className="text-slate-600 text-lg">127Q</span></h3>
            </div>

            <div className="absolute bottom-6 right-6 z-10 text-right">
                <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-1">Coherence Map</div>
                <div className="flex items-center gap-1 justify-end">
                    <div className="w-16 h-1 bg-gradient-to-r from-slate-800 to-purple-500 rounded" />
                    <span className="text-xs font-bold text-purple-400">98%</span>
                </div>
            </div>
        </div>
    );
};