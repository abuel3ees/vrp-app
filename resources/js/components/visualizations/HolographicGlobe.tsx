import React, { useEffect, useRef } from "react";

export const HolographicGlobe = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // High DPI
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;
    const cx = width / 2;
    const cy = height / 2;
    const r = Math.min(width, height) * 0.35;

    let angleY = 0;

    // --- GEOMETRY GENERATION ---
    const DOT_COUNT = 600;
    const dots: {lat: number, lon: number}[] = [];
    
    // Fibonacci Sphere distribution for even dot placement
    const phi = Math.PI * (3 - Math.sqrt(5)); 
    for (let i = 0; i < DOT_COUNT; i++) {
        const y = 1 - (i / (DOT_COUNT - 1)) * 2;
        const radiusAtY = Math.sqrt(1 - y * y);
        const theta = phi * i;
        const x = Math.cos(theta) * radiusAtY;
        const z = Math.sin(theta) * radiusAtY;
        // Store as 3D point directly
        dots.push({ lat: x, lon: y }); // Storing x/y/z normalized relative to radius actually
    }
    
    // Convert to 3D points
    const points = Array.from({length: DOT_COUNT}, (_, i) => {
        const y = 1 - (i / (DOT_COUNT - 1)) * 2; // y goes from 1 to -1
        const radiusAtY = Math.sqrt(1 - y * y);
        const theta = phi * i;
        const x = Math.cos(theta) * radiusAtY;
        const z = Math.sin(theta) * radiusAtY;
        return { x: x * r, y: y * r, z: z * r };
    });

    // Generate Connections (Arcs)
    const links = [];
    for(let i=0; i<8; i++) {
        const start = Math.floor(Math.random() * DOT_COUNT);
        const end = Math.floor(Math.random() * DOT_COUNT);
        links.push({ start, end, progress: Math.random() });
    }

    // --- 3D MATH ---
    const rotateY = (x: number, y: number, z: number, angle: number) => ({
        x: x * Math.cos(angle) - z * Math.sin(angle),
        y: y,
        z: z * Math.cos(angle) + x * Math.sin(angle)
    });

    // --- RENDER LOOP ---
    const draw = () => {
        ctx.clearRect(0, 0, width, height);
        angleY += 0.002;

        // 1. Draw Globe Atmosphere
        const grad = ctx.createRadialGradient(cx, cy, r * 0.8, cx, cy, r * 1.5);
        grad.addColorStop(0, "rgba(34, 211, 238, 0.1)");
        grad.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = grad;
        ctx.fillRect(0,0,width,height);

        // 2. Draw Dots
        points.forEach(p => {
            const rot = rotateY(p.x, p.y, p.z, angleY);
            // Project
            const zScale = 400 / (400 - rot.z);
            const x2d = cx + rot.x * zScale;
            const y2d = cy + rot.y * zScale;

            // Only draw front-facing dots
            if (rot.z < 0) return;

            const alpha = Math.max(0.1, (rot.z + r) / (2 * r)); // Depth fade
            
            ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.6})`;
            ctx.beginPath();
            ctx.arc(x2d, y2d, 1.5 * zScale, 0, Math.PI*2);
            ctx.fill();
        });

        // 3. Draw Arcs (Flight Paths)
        links.forEach(l => {
            const p1 = points[l.start];
            const p2 = points[l.end];
            
            // Rotate start/end
            const r1 = rotateY(p1.x, p1.y, p1.z, angleY);
            const r2 = rotateY(p2.x, p2.y, p2.z, angleY);

            // Don't draw if both behind globe
            if (r1.z < -r/2 && r2.z < -r/2) return;

            // Simple Quadratic Bezier control point (elevated)
            // Midpoint of straight line
            const mx = (r1.x + r2.x) / 2;
            const my = (r1.y + r2.y) / 2;
            const mz = (r1.z + r2.z) / 2;
            
            // Extrude control point outwards
            const len = Math.sqrt(mx*mx + my*my + mz*mz);
            const elevation = 1.5; // How high the arc goes
            const cx3 = (mx / len) * (r * elevation);
            const cy3 = (my / len) * (r * elevation);
            const cz3 = (mz / len) * (r * elevation);

            // Project 3 points
            const proj = (x:number, y:number, z:number) => {
                const s = 400/(400-z);
                return { x: cx + x*s, y: cy + y*s };
            }

            const start2d = proj(r1.x, r1.y, r1.z);
            const end2d = proj(r2.x, r2.y, r2.z);
            const mid2d = proj(cx3, cy3, cz3);

            // Draw Curve
            ctx.beginPath();
            ctx.moveTo(start2d.x, start2d.y);
            ctx.quadraticCurveTo(mid2d.x, mid2d.y, end2d.x, end2d.y);
            
            // Gradient Stroke
            const gradient = ctx.createLinearGradient(start2d.x, start2d.y, end2d.x, end2d.y);
            gradient.addColorStop(0, "rgba(168, 85, 247, 0)");
            gradient.addColorStop(0.5, "rgba(34, 211, 238, 0.8)");
            gradient.addColorStop(1, "rgba(168, 85, 247, 0)");
            
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 2;
            ctx.stroke();

            // Moving Packet
            l.progress += 0.005;
            if(l.progress > 1) l.progress = 0;
            
            // Calculate point on curve (Quadratic Bezier formula)
            const t = l.progress;
            const tx = (1-t)*(1-t)*start2d.x + 2*(1-t)*t*mid2d.x + t*t*end2d.x;
            const ty = (1-t)*(1-t)*start2d.y + 2*(1-t)*t*mid2d.y + t*t*end2d.y;

            ctx.fillStyle = "#fff";
            ctx.beginPath();
            ctx.arc(tx, ty, 2, 0, Math.PI*2);
            ctx.fill();
            ctx.shadowColor = "#fff";
            ctx.shadowBlur = 10;
            ctx.fill();
            ctx.shadowBlur = 0;
        });

        // 4. Ring Scanner
        const ringY = Math.sin(angleY * 2) * r;
        const ringScale = Math.sqrt(1 - (ringY*ringY)/(r*r)); // Radius at height Y
        const ringR = r * ringScale;
        
        ctx.beginPath();
        // Draw ellipse manually or use scale
        for(let i=0; i<=60; i++) {
            const theta = (i/60) * Math.PI*2;
            const rx = Math.cos(theta) * ringR;
            const rz = Math.sin(theta) * ringR;
            
            const rot = rotateY(rx, ringY, rz, angleY); // Actually no rotateY needed for ring if it scans vertically? 
            // Let's just project it directly without globe rotation to make it look like a scanner
            // Or rotate with globe. Let's scan UP/DOWN
            
            // Project
            const zScale = 400 / (400 - rz); // simple projection
            const x2d = cx + rx * zScale;
            const y2d = cy + ringY * zScale; // ringY moves up/down
            
            if(i===0) ctx.moveTo(x2d, y2d);
            else ctx.lineTo(x2d, y2d);
        }
        ctx.strokeStyle = "rgba(168, 85, 247, 0.2)";
        ctx.stroke();

        requestAnimationFrame(draw);
    };

    draw();
  }, []);

  return (
    <div className="relative w-full h-[500px] flex items-center justify-center">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
        <div className="absolute bottom-6 flex flex-col items-center">
             <div className="text-[10px] text-cyan-400 font-mono tracking-[0.3em] uppercase mb-1">Global Coverage</div>
             <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
        </div>
    </div>
  );
};