'use client';

import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export default function AmbientBackground() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isDark = resolvedTheme === 'dark';

  return (
    <div className="fixed inset-0 -z-50 pointer-events-none overflow-hidden bg-[var(--color-background)] transition-colors duration-700">
      
      {/* Base Gradient Layer */}
      <div className={`absolute inset-0 transition-opacity duration-1000 ${isDark ? 'opacity-100' : 'opacity-0'}`}>
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800" />
      </div>
      <div className={`absolute inset-0 transition-opacity duration-1000 ${isDark ? 'opacity-0' : 'opacity-100'}`}>
        <div className="absolute inset-0 bg-gradient-to-br from-[#f8fbff] to-[#fffaf0]" />
      </div>

      {/* Floating Animated Orbs */}
      <motion.div
        animate={{
          x: [0, 50, -20, 0],
          y: [0, -30, 40, 0],
          scale: [1, 1.1, 0.9, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
        className={`absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full mix-blend-multiply filter blur-[100px] opacity-60 ${isDark ? 'bg-indigo-900/40 mix-blend-screen' : 'bg-blue-200'}`}
      />

      <motion.div
        animate={{
          x: [0, -40, 30, 0],
          y: [0, 50, -20, 0],
          scale: [1, 0.9, 1.1, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear"
        }}
        className={`absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full mix-blend-multiply filter blur-[120px] opacity-60 ${isDark ? 'bg-sky-900/40 mix-blend-screen' : 'bg-sky-100'}`}
      />

      <motion.div
        animate={{
          x: [0, 30, -50, 0],
          y: [0, -40, 30, 0],
          scale: [1, 1.2, 0.8, 1],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "linear"
        }}
        className={`absolute top-[40%] left-[60%] w-[40vw] h-[40vw] rounded-full mix-blend-multiply filter blur-[80px] opacity-40 ${isDark ? 'bg-slate-800/50 mix-blend-screen' : 'bg-orange-50'}`}
      />
    </div>
  );
}
