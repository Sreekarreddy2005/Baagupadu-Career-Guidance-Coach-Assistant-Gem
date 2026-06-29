'use client';

import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useChatStore } from '@/lib/store/chatStore';
import { PHASES } from '@/types';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  color: string;
}

export default function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animFrameRef = useRef<number>(0);
  const { currentPhase } = useChatStore();

  const phaseConfig = PHASES.find((p) => p.id === currentPhase) ?? PHASES[0];

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

    // Create particles
    particlesRef.current = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      radius: Math.random() * 3 + 1,
      alpha: Math.random() * 0.5 + 0.1,
      color: phaseConfig.particleColor,
    }));

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle =
          p.color +
          Math.floor(p.alpha * 255)
            .toString(16)
            .padStart(2, '0');
        ctx.fill();
      });

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animate();
    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [phaseConfig.particleColor]);

  // Update particle colors on phase change
  useEffect(() => {
    particlesRef.current.forEach((p) => {
      p.color = phaseConfig.particleColor;
    });
  }, [phaseConfig.particleColor]);

  const gradientStyle = {
    background: `radial-gradient(ellipse at 20% 50%, ${phaseConfig.colors.from}22, transparent 50%),
                 radial-gradient(ellipse at 80% 20%, ${phaseConfig.colors.via}22, transparent 50%),
                 radial-gradient(ellipse at 60% 80%, ${phaseConfig.colors.to}22, transparent 50%),
                 #0F0F1F`,
    transition: 'background 2s ease-in-out',
  };

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <AnimatePresence>
        <motion.div
          key={currentPhase}
          className="absolute inset-0"
          style={gradientStyle}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 2, ease: 'easeInOut' }}
        />
      </AnimatePresence>
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />

      {/* Mesh grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />
    </div>
  );
}
