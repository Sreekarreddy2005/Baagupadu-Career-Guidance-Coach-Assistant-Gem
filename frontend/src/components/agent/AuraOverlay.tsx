'use client';

import React from 'react';
import { motion } from 'framer-motion';

const LABELS = [
  "Deep Self-Discovery",
  "Pattern Recognition",
  "Persona Synthesis",
  "Career Roadmap"
];

export default function AuraOverlay({ mode = 'hero' }: { mode?: 'hero' | 'sidebar' | 'dashboard' }) {
  const showLabels = mode === 'hero';

  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-visible z-20">
      {/* Pulse Aura Layer */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: '100%',
          height: '100%',
          maxWidth: '500px',
          maxHeight: '500px',
          aspectRatio: '1/1',
          background: 'radial-gradient(circle, rgba(99,102,241,0.2) 0%, rgba(99,102,241,0.05) 50%, rgba(99,102,241,0) 70%)',
        }}
        animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute rounded-full"
        style={{
          width: '120%',
          height: '120%',
          maxWidth: '600px',
          maxHeight: '600px',
          aspectRatio: '1/1',
          background: 'radial-gradient(circle, rgba(165,180,252,0.15) 0%, rgba(165,180,252,0.05) 50%, rgba(165,180,252,0) 70%)',
        }}
        animate={{ scale: [1.1, 0.9, 1.1], opacity: [0.3, 0.8, 0.3] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />

      {/* Orbital Labels */}
      {showLabels && (
        <motion.div 
          className="absolute w-[500px] h-[500px]"
          animate={{ rotate: 360 }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        >
          {LABELS.map((label, idx) => {
            const angle = (idx / LABELS.length) * Math.PI * 2;
            const radius = 250;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            
            return (
              <div 
                key={idx}
                className="absolute top-1/2 left-1/2"
                style={{ transform: `translate(-50%, -50%) translate(${x}px, ${y}px)` }}
              >
                {/* Counter rotate to keep text upright */}
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                  className="flex items-center justify-center"
                >
                  <motion.div
                    whileHover={{ scale: 1.1, backgroundColor: 'rgba(99,102,241,1)', color: 'white' }}
                    className="pointer-events-auto px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg border border-indigo-100 font-medium text-indigo-900 text-sm whitespace-nowrap cursor-pointer select-none transition-colors"
                  >
                    {label}
                  </motion.div>
                </motion.div>
              </div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
}
