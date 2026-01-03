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

    // 1. Setup
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    const initParticles = () => {
      particlesRef.current = [];
      const numberOfParticles = (canvas.width * canvas.height) / 9000; // Adjust density
      for (let i = 0; i < numberOfParticles; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const colors = ['rgba(168, 85, 247,', 'rgba(34, 211, 238,', 'rgba(255, 255, 255,'];
        const colorBase = colors[Math.floor(Math.random() * colors.length)];
        
        particlesRef.current.push({
          x,
          y,
          baseX: x,
          baseY: y,
          vx: (Math.random() - 0.5) * 0.5, // Slow drift velocity
          vy: (Math.random() - 0.5) * 0.5,
          radius: Math.random() * 2 + 0.5,
          color: colorBase,
          density: (Math.random() * 30) + 1,
        });
      }
    };

    // 2. Animation Loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw connecting lines first (subtle web effect)
      connectParticles(ctx);

      // Update and draw particles
      particlesRef.current.forEach(p => {
        // Physics - Mouse interaction
        let dx = mouseRef.current.x - p.x;
        let dy = mouseRef.current.y - p.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        let forceDirectionX = dx / distance;
        let forceDirectionY = dy / distance;
        let maxDistance = mouseRef.current.radius;
        let force = (maxDistance - distance) / maxDistance;
        let directionX = forceDirectionX * force * p.density;
        let directionY = forceDirectionY * force * p.density;

        if (distance < mouseRef.current.radius) {
          // Attract to mouse
          p.x += directionX;
          p.y += directionY;
        } else {
          // Return to base position (drift back)
          if (p.x !== p.baseX) {
              let dx = p.x - p.baseX;
              p.x -= dx/20;
          }
          if (p.y !== p.baseY) {
              let dy = p.y - p.baseY;
              p.y -= dy/20;
          }
        }

        // Apply drift drift
        p.x += p.vx;
        p.y += p.vy;

        // Draw particle with glowing opacity based on mouse proximity
        const opacity = 1 - (distance / 200);
        const finalOpacity = opacity > 0 ? opacity : 0.1;
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        // Add a glow effect
        ctx.shadowBlur = 15;
        ctx.shadowColor = p.color + '1)';
        ctx.fillStyle = p.color + finalOpacity + ')';
        ctx.fill();
        ctx.shadowBlur = 0; // Reset shadow for next elements
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    const connectParticles = (ctx: CanvasRenderingContext2D) => {
        for (let a = 0; a < particlesRef.current.length; a++) {
            for (let b = a; b < particlesRef.current.length; b++) {
                let distance = (( particlesRef.current[a].x - particlesRef.current[b].x) * ( particlesRef.current[a].x - particlesRef.current[b].x))
                             + (( particlesRef.current[a].y - particlesRef.current[b].y) * ( particlesRef.current[a].y - particlesRef.current[b].y));
                // If particles are close, draw a line
                if (distance < (canvas.width/7) * (canvas.height/7)) {
                    let opacityValue = 1 - (distance/10000);
                    ctx.strokeStyle = 'rgba(168, 85, 247,' + opacityValue * 0.2 + ')'; // Very subtle purple lines
                    ctx.lineWidth = 0.5;
                    ctx.beginPath();
                    ctx.moveTo(particlesRef.current[a].x, particlesRef.current[a].y);
                    ctx.lineTo(particlesRef.current[b].x, particlesRef.current[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    // 3. Event Listeners
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', (e) => {
        mouseRef.current.x = e.x;
        mouseRef.current.y = e.y;
    });
    window.addEventListener('mouseout', () => {
        mouseRef.current.x = -1000;
        mouseRef.current.y = -1000;
    })

    // Initialize
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
      className="fixed inset-0 pointer-events-none z-0 mix-blend-screen"
      style={{ filter: 'blur(1px)' }} // Subtle softness
    />
  );
};