import React, { useEffect, useRef } from "react";

export const BlochSphere = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Retina Scaling
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const r = 140; // Size

    let angleY = 0;
    let angleX = 0.3; // Slight tilt to see volume

    const rotate3D = (x: number, y: number, z: number) => {
        // Rotate Y
        let x1 = x * Math.cos(angleY) - z * Math.sin(angleY);
        let z1 = z * Math.cos(angleY) + x * Math.sin(angleY);
        // Rotate X
        let y2 = y * Math.cos(angleX) - z1 * Math.sin(angleX);
        let z2 = z1 * Math.cos(angleX) + y * Math.sin(angleX);
        return { x: x1, y: y2, z: z2 };
    };

    const draw = () => {
        ctx.clearRect(0, 0, rect.width, rect.height);
        angleY += 0.008;

        // 1. Sphere Glow
        const grad = ctx.createRadialGradient(cx, cy, r * 0.4, cx, cy, r * 1.2);
        grad.addColorStop(0, "rgba(168, 85, 247, 0.2)");
        grad.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.fill();

        // 2. Wireframe Drawing Function
        const drawRing = (type: 'lat' | 'lon', offset: number, color: string) => {
            ctx.beginPath();
            let firstPoint = true;
            
            // We draw the ring in small segments to handle 3D perspective
            for (let i = 0; i <= 60; i++) {
                const theta = (i / 60) * Math.PI * 2;
                let x, y, z;

                if (type === 'lon') { // Vertical
                    x = r * Math.sin(theta) * Math.cos(offset);
                    y = r * Math.cos(theta);
                    z = r * Math.sin(theta) * Math.sin(offset);
                } else { // Horizontal (Latitude)
                    const latR = r * Math.sin(offset);
                    const latY = r * Math.cos(offset);
                    x = latR * Math.cos(theta);
                    y = latY;
                    z = latR * Math.sin(theta);
                }

                const p = rotate3D(x, y, z);
                // Perspective
                const scale = 500 / (500 - p.z);
                const screenX = cx + p.x * scale;
                const screenY = cy + p.y * scale;

                if (firstPoint) {
                    ctx.moveTo(screenX, screenY);
                    firstPoint = false;
                } else {
                    ctx.lineTo(screenX, screenY);
                }
            }
            
            // Hack for simple depth: entire ring gets one opacity based on center depth? 
            // Better: use a generic opacity that looks good for wireframes
            ctx.strokeStyle = color;
            ctx.lineWidth = 1;
            ctx.stroke();
        };

        // Draw Longitude Lines (Meridians)
        for (let i = 0; i < 6; i++) {
            // Calculate center of this ring to determine if it's "behind"
            const centerP = rotate3D(r * Math.cos(i * Math.PI/3), 0, r * Math.sin(i * Math.PI/3));
            const isBack = centerP.z > 0; // Simple depth check
            const opacity = isBack ? 0.1 : 0.4;
            drawRing('lon', (i * Math.PI) / 6, `rgba(168, 85, 247, ${opacity})`);
        }

        // Draw Equator & Latitudes
        drawRing('lat', Math.PI / 2, "rgba(34, 211, 238, 0.8)"); // Equator (Cyan)
        drawRing('lat', Math.PI / 4, "rgba(168, 85, 247, 0.2)"); // Upper
        drawRing('lat', 3 * Math.PI / 4, "rgba(168, 85, 247, 0.2)"); // Lower

        // 3. The Qubit Vector |ψ⟩
        const vec = rotate3D(r * 0.7, -r * 0.7, 0); // 45 deg vector
        const scale = 500 / (500 - vec.z);
        const vx = cx + vec.x * scale;
        const vy = cy + vec.y * scale;

        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(vx, vy);
        ctx.stroke();

        // Tip
        ctx.fillStyle = "#fff";
        ctx.beginPath();
        ctx.arc(vx, vy, 5, 0, Math.PI*2);
        ctx.fill();
        ctx.shadowColor = "#22d3ee";
        ctx.shadowBlur = 15;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Labels
        ctx.fillStyle = "#fff";
        ctx.font = "bold 12px monospace";
        ctx.fillText("|0⟩", cx - 10, cy - r - 20);
        ctx.fillText("|1⟩", cx - 10, cy + r + 30);

        requestAnimationFrame(draw);
    };

    draw();
  }, []);

  return (
    <div className="w-full h-[400px] flex items-center justify-center bg-slate-900/30 rounded-3xl border border-white/5 backdrop-blur-sm">
        <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
};