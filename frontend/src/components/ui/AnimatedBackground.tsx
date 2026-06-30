'use client';

import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useChatStore } from '@/lib/store/chatStore';
import { PHASES } from '@/types';

interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  radius: number;
  alpha: number;
  color: string;
  twinkle: number;
  twinkleSpeed: number;
}

export default function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const frameRef = useRef<number>(0);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const { currentPhase } = useChatStore();

  const phaseConfig = PHASES.find((p) => p.id === currentPhase) ?? PHASES[0];
  const colors = phaseConfig.gradient;
  const particleColors = phaseConfig.particleColors;

  // Mouse parallax
  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight };
    };
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  // Canvas particle system
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Init 80 particles
    particlesRef.current = Array.from({ length: 80 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      radius: Math.random() * 2.5 + 0.5,
      alpha: Math.random() * 0.4 + 0.05,
      color: particleColors[Math.floor(Math.random() * particleColors.length)],
      twinkle: Math.random() * Math.PI * 2,
      twinkleSpeed: 0.02 + Math.random() * 0.03,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const { x: mx, y: my } = mouseRef.current;

      particlesRef.current.forEach((p) => {
        // Gentle drift toward mouse with parallax
        const dx = mx * canvas.width - p.x;
        const dy = my * canvas.height - p.y;
        p.vx += dx * 0.00008;
        p.vy += dy * 0.00008;

        // Damping
        p.vx *= 0.995;
        p.vy *= 0.995;

        p.x += p.vx;
        p.y += p.vy;

        // Wrap edges
        if (p.x < -10) p.x = canvas.width + 10;
        if (p.x > canvas.width + 10) p.x = -10;
        if (p.y < -10) p.y = canvas.height + 10;
        if (p.y > canvas.height + 10) p.y = -10;

        // Twinkling
        p.twinkle += p.twinkleSpeed;
        const alpha = p.alpha * (0.6 + 0.4 * Math.sin(p.twinkle));

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color + Math.floor(alpha * 255).toString(16).padStart(2, '0');
        ctx.fill();
      });

      frameRef.current = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener('resize', resize);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Update particle colors on phase change
  useEffect(() => {
    particlesRef.current.forEach((p) => {
      p.color = particleColors[Math.floor(Math.random() * particleColors.length)];
    });
  }, [particleColors]);

  const [c0, c1, c2] = colors;
  const gradient = `
    radial-gradient(ellipse at 10% 40%, ${c0}18 0%, transparent 45%),
    radial-gradient(ellipse at 90% 20%, ${c1}18 0%, transparent 45%),
    radial-gradient(ellipse at 50% 85%, ${c2}15 0%, transparent 40%),
    radial-gradient(ellipse at 50% 50%, rgba(10,10,26,0.95) 0%, #0A0A1A 100%)
  `;

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Phase-keyed gradient */}
      <AnimatePresence>
        <motion.div
          key={currentPhase + '-bg'}
          className="absolute inset-0"
          style={{ background: gradient }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.8, ease: 'easeInOut' }}
        />
      </AnimatePresence>

      {/* Large soft orbs that move with mouse */}
      <motion.div
        className="absolute rounded-full blur-[140px] pointer-events-none"
        style={{
          width: 500, height: 500,
          background: `radial-gradient(circle, ${c0}25, transparent 70%)`,
          left: '-10%', top: '10%',
        }}
        animate={{
          x: (mouseRef.current.x - 0.5) * -40,
          y: (mouseRef.current.y - 0.5) * -20,
        }}
        transition={{ type: 'spring', stiffness: 30, damping: 30 }}
      />
      <motion.div
        className="absolute rounded-full blur-[140px] pointer-events-none"
        style={{
          width: 400, height: 400,
          background: `radial-gradient(circle, ${c1}20, transparent 70%)`,
          right: '-5%', top: '30%',
        }}
        animate={{
          x: (mouseRef.current.x - 0.5) * 30,
          y: (mouseRef.current.y - 0.5) * 25,
        }}
        transition={{ type: 'spring', stiffness: 25, damping: 30 }}
      />

      {/* Particle canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 particles" />

      {/* Subtle mesh grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.15]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }}
      />

      {/* Bottom vignette */}
      <div className="absolute inset-x-0 bottom-0 h-40 pointer-events-none"
        style={{ background: 'linear-gradient(to top, rgba(10,10,26,0.9), transparent)' }} />
    </div>
  );
}
