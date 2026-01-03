import React, { useEffect, useRef } from "react";
import { Network, Share2, Activity } from "lucide-react";

export const NetworkComplexity = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // --- CONFIG ---
    // High DPI setup for crisp lines
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;
    const cx = width / 2;
    const cy = height / 2;

    // --- 3D SETUP ---
    const NODE_COUNT = 40;
    const CONNECTION_DIST = 100;
    
    // Generate random 3D points
    const nodes = Array.from({ length: NODE_COUNT }).map(() => ({
      x: (Math.random() - 0.5) * width * 0.8,
      y: (Math.random() - 0.5) * height * 0.6,
      z: (Math.random() - 0.5) * width * 0.8,
    }));

    let angleY = 0;
    let angleX = 0;

    // 3D Projection Helper
    const project = (x: number, y: number, z: number) => {
      const fov = 400;
      const scale = fov / (fov + z);
      return {
        x: cx + x * scale,
        y: cy + y * scale,
        scale: scale,
        z: z
      };
    };

    const rotate = (n: typeof nodes[0]) => {
      // Rotate Y
      let x1 = n.x * Math.cos(angleY) - n.z * Math.sin(angleY);
      let z1 = n.z * Math.cos(angleY) + n.x * Math.sin(angleY);
      
      // Rotate X (Slight tilt)
      let y2 = n.y * Math.cos(angleX) - z1 * Math.sin(angleX);
      let z2 = z1 * Math.cos(angleX) + n.y * Math.sin(angleX);

      return { x: x1, y: y2, z: z2 };
    };

    // --- RENDER LOOP ---
    let frameId = 0;
    const render = () => {
      ctx.clearRect(0, 0, width, height);
      
      // Slow, calm rotation
      angleY += 0.002; 
      angleX = Math.sin(angleY * 0.5) * 0.2; // Gentle swaying

      // 1. Calculate projected positions first
      const projectedNodes = nodes.map(n => {
        const r = rotate(n);
        return project(r.x, r.y, r.z);
      });

      // 2. Draw Connections (The "Web")
      ctx.lineWidth = 0.5;
      for (let i = 0; i < projectedNodes.length; i++) {
        for (let j = i + 1; j < projectedNodes.length; j++) {
          const p1 = projectedNodes[i];
          const p2 = projectedNodes[j];
          
          // Calculate 2D distance
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          // Only connect close nodes
          if (dist < CONNECTION_DIST) {
            // Opacity based on distance (fade out far connections)
            // AND depth (fade out back connections)
            const alphaDist = 1 - (dist / CONNECTION_DIST);
            const alphaDepth = Math.max(0.1, p1.scale * p2.scale * 0.5); 
            
            ctx.strokeStyle = `rgba(255, 255, 255, ${alphaDist * alphaDepth})`;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      // 3. Draw Nodes (The Cities)
      projectedNodes.forEach(p => {
        // Size based on depth
        const radius = Math.max(1, 3 * p.scale);
        const alpha = Math.max(0.2, p.scale); // Fade back nodes

        ctx.fillStyle = `rgba(168, 85, 247, ${alpha})`; // Purple dots
        ctx.beginPath();
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
        ctx.fill();

        // White core
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, radius * 0.4, 0, Math.PI * 2);
        ctx.fill();
      });

      frameId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(frameId);
  }, []);

  return (
    <div className="relative w-full h-[450px] bg-slate-900 rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
      {/* 1. The Canvas (Visual) */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" style={{ width: '100%', height: '100%' }} />

      {/* 2. Soft Gradient Overlay (Vignette) */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(15,23,42,0.8)_100%)] pointer-events-none" />

      {/* 3. The Information HUD (Data) */}
      <div className="absolute top-6 left-6 space-y-4 z-10">
          <div className="flex items-center gap-2 text-purple-400 mb-1">
             <Share2 className="w-4 h-4" />
             <span className="text-xs font-bold uppercase tracking-widest">Route Complexity</span>
          </div>
          
          <div className="bg-slate-950/80 backdrop-blur border border-white/10 p-4 rounded-xl w-64">
             <div className="flex justify-between items-center mb-2">
                 <span className="text-slate-400 text-xs uppercase">Cities (N)</span>
                 <span className="text-white font-mono font-bold">50</span>
             </div>
             {/* Progress Bar visual for Exponential Growth */}
             <div className="w-full h-1 bg-slate-800 rounded-full mb-4 overflow-hidden">
                 <div className="h-full bg-red-500 w-full animate-pulse" />
             </div>

             <div className="flex justify-between items-center">
                 <span className="text-slate-400 text-xs uppercase">Possible Routes</span>
                 <span className="text-red-400 font-mono font-bold">3.04 × 10⁶⁴</span>
             </div>
             <div className="text-[10px] text-slate-500 mt-2 leading-tight">
                 "Exceeds the number of atoms in the visible universe."
             </div>
          </div>
      </div>

      <div className="absolute bottom-6 right-6 flex items-center gap-3">
          <div className="text-right">
              <div className="text-2xl font-black text-white">O(N!)</div>
              <div className="text-[10px] text-slate-500 uppercase tracking-widest">Factorial Time</div>
          </div>
          <div className="p-3 bg-red-500/10 rounded-full border border-red-500/20">
              <Activity className="w-6 h-6 text-red-500" />
          </div>
      </div>
    </div>
  );
};