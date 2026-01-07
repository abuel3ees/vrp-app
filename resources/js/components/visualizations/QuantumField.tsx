import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  baseX: number;
  baseY: number;
  density: number;
}

export const QuantumField = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000, radius: 150 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    const initParticles = () => {
      particlesRef.current = [];
      let numberOfParticles = (canvas.width * canvas.height) / 11000;
      if (numberOfParticles > 120) numberOfParticles = 120; // Cap for performance

      for (let i = 0; i < numberOfParticles; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        
        // DARKER PALETTE: Only Deep Purple and Dark Cyan. No White.
        const colors = [
            'rgba(147, 51, 234,', // Purple 600
            'rgba(88, 28, 135,',  // Purple 900
            'rgba(8, 145, 178,'   // Cyan 600
        ];
        const colorBase = colors[Math.floor(Math.random() * colors.length)];
        
        particlesRef.current.push({
          x,
          y,
          baseX: x,
          baseY: y,
          vx: (Math.random() - 0.5) * 0.3, // Slower, heavier movement
          vy: (Math.random() - 0.5) * 0.3,
          radius: Math.random() * 2 + 1,
          color: colorBase,
          density: (Math.random() * 30) + 1,
        });
      }
    };

    const animate = () => {
      // CLEAR RECT: Use a very slight fade effect for trails (optional)
      // or clear completely for crispness. We clear completely for the "Dark" look.
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      connectParticles(ctx);

      particlesRef.current.forEach(p => {
        // Physics
        let dx = mouseRef.current.x - p.x;
        let dy = mouseRef.current.y - p.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < mouseRef.current.radius) {
          const forceDirectionX = dx / distance;
          const forceDirectionY = dy / distance;
          const force = (mouseRef.current.radius - distance) / mouseRef.current.radius;
          const directionX = forceDirectionX * force * p.density;
          const directionY = forceDirectionY * force * p.density;
          p.x -= directionX * 0.2; // Gentle repulsion
          p.y -= directionY * 0.2;
        } else {
          if (p.x !== p.baseX) { let dx = p.x - p.baseX; p.x -= dx/60; }
          if (p.y !== p.baseY) { let dy = p.y - p.baseY; p.y -= dy/60; }
        }

        p.x += p.vx;
        p.y += p.vy;

        // Draw
        // Lower opacity for a darker feel (0.1 to 0.5 max)
        const proximityOp = 1 - (distance / 200);
        const baseOpacity = 0.3; 
        const finalOpacity = proximityOp > 0 ? (baseOpacity + proximityOp * 0.4) : baseOpacity;
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color + finalOpacity + ')';
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    const connectParticles = (ctx: CanvasRenderingContext2D) => {
        const maxDist = (canvas.width/7) * (canvas.height/7);
        for (let a = 0; a < particlesRef.current.length; a++) {
            for (let b = a; b < particlesRef.current.length; b++) {
                let dx = particlesRef.current[a].x - particlesRef.current[b].x;
                let dy = particlesRef.current[a].y - particlesRef.current[b].y;
                let distance = dx * dx + dy * dy;

                if (distance < maxDist) {
                    let opacityValue = 1 - (distance/15000);
                    if (opacityValue > 0) {
                        // Very faint, dark lines
                        ctx.strokeStyle = 'rgba(107, 33, 168,' + (opacityValue * 0.15) + ')'; 
                        ctx.lineWidth = 0.5;
                        ctx.beginPath();
                        ctx.moveTo(particlesRef.current[a].x, particlesRef.current[a].y);
                        ctx.lineTo(particlesRef.current[b].x, particlesRef.current[b].y);
                        ctx.stroke();
                    }
                }
            }
        }
    }

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', (e) => {
        mouseRef.current.x = e.clientX;
        mouseRef.current.y = e.clientY;
    });
    window.addEventListener('mouseout', () => {
        mouseRef.current.x = -1000;
        mouseRef.current.y = -1000;
    })

    resize();
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      // Removed 'mix-blend-screen' to keep the deep blacks
      // Added absolute positioning and z-index
      className="fixed inset-0 pointer-events-none -z-10 bg-[#020617]"
    />
  );
};