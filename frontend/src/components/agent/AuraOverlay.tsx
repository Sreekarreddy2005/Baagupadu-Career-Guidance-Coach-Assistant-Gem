'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Map, Search, Target, Brain, ArrowRight } from 'lucide-react';

const LABELS = [
  { text: "Conversations, Not Surveys", icon: MessageCircle },
  { text: "Actionable Career Roadmaps", icon: Map },
  { text: "Curing the Information Paradox", icon: Search },
  { text: "Gamified Accountability", icon: Target },
  { text: "Life-Stage Pattern Recognition", icon: Brain },
  { text: "Bridging Knowing & Doing", icon: ArrowRight },
];

interface AuraOverlayProps {
  mode?: 'hero' | 'sidebar' | 'dashboard';
  auraColor?: string; // hex or rgba — the primary glow color
}

export default function AuraOverlay({ mode = 'hero', auraColor }: AuraOverlayProps) {
  const showLabels = mode === 'hero';
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Parse auraColor into rgba values for the gradient
  // Default: indigo (#6366F1) → cyan (#06B6D4)
  const primaryColor = auraColor ?? '#6366F1';
  const secondaryColor = auraColor
    ? `${auraColor}88` // semi-transparent version of same hue
    : '#06B6D4';

  // Convert hex to rgba string for use in gradient
  const hexToRgba = (hex: string, alpha: number): string => {
    const h = hex.replace('#', '');
    const r = parseInt(h.substring(0, 2), 16);
    const g = parseInt(h.substring(2, 4), 16);
    const b = parseInt(h.substring(4, 6), 16);
    return `rgba(${r},${g},${b},${alpha})`;
  };

  const isHex = primaryColor.startsWith('#');
  const core = isHex ? hexToRgba(primaryColor, 0.65) : 'rgba(99,102,241,0.6)';
  const mid  = isHex ? hexToRgba(primaryColor, 0.35) : 'rgba(6,182,212,0.35)';
  const ring = isHex ? hexToRgba(primaryColor, 0.20) : 'rgba(6,182,212,0.3)';

  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-visible">
      {/* ── Luminous Aura Glow — color-reactive ── */}
      <motion.div
        key={`core-${primaryColor}`}
        className="absolute rounded-full -z-10"
        style={{
          width: '100%',
          height: '100%',
          maxWidth: '550px',
          maxHeight: '550px',
          aspectRatio: '1/1',
          background: `radial-gradient(circle, ${core} 0%, ${mid} 40%, transparent 70%)`,
          filter: 'blur(40px)',
          mixBlendMode: 'normal',
        }}
        initial={{ opacity: 0.7, scale: 0.7 }}
        animate={{ scale: [0.7, 1.1, 0.7], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        key={`ring-${primaryColor}`}
        className="absolute rounded-full -z-10"
        style={{
          width: '120%',
          height: '120%',
          maxWidth: '700px',
          maxHeight: '700px',
          aspectRatio: '1/1',
          background: `radial-gradient(circle, ${ring} 0%, ${mid} 50%, transparent 75%)`,
          filter: 'blur(60px)',
          mixBlendMode: 'normal',
        }}
        initial={{ opacity: 0.5, scale: 1.1 }}
        animate={{ scale: [1.1, 0.8, 1.1], opacity: [0.5, 0.9, 0.5] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />

      {/* ── Expanded Orbital Labels (hero only) ── */}
      {showLabels && (
        <div className="absolute w-[550px] h-[550px] z-20">
          <style>{`
            @keyframes orbit {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
            @keyframes counter-orbit {
              from { transform: rotate(0deg); }
              to { transform: rotate(-360deg); }
            }
            .orbit-container {
              animation: orbit 35s linear infinite;
            }
            .counter-orbit {
              animation: counter-orbit 35s linear infinite;
            }
            .paused {
              animation-play-state: paused !important;
            }
          `}</style>
          
          <div className={`w-full h-full relative orbit-container ${hoveredIndex !== null ? 'paused' : ''}`}>
            {LABELS.map((item, idx) => {
              const angle = (idx / LABELS.length) * Math.PI * 2;
              const radius = 230;
              const x = (Math.cos(angle) * radius).toFixed(3);
              const y = (Math.sin(angle) * radius).toFixed(3);
              
              const isHovered = hoveredIndex === idx;
              const isOtherHovered = hoveredIndex !== null && hoveredIndex !== idx;
              
              return (
                <div 
                  key={idx}
                  className="absolute top-1/2 left-1/2"
                  style={{ transform: `translate(-50%, -50%) translate(${x}px, ${y}px)` }}
                >
                  <div className={`flex items-center justify-center counter-orbit ${hoveredIndex !== null ? 'paused' : ''}`}>
                    <div
                      onMouseEnter={() => setHoveredIndex(idx)}
                      onMouseLeave={() => setHoveredIndex(null)}
                      className="pointer-events-auto flex items-center gap-2 px-5 py-2.5 bg-white/90 backdrop-blur-md rounded-full shadow-[0_8px_30px_rgba(99,102,241,0.15)] border border-[var(--color-secondary)]/20 font-semibold text-sm whitespace-nowrap cursor-pointer select-none transition-all duration-300"
                      style={{
                        transform: isHovered ? 'scale(1.15)' : 'scale(1)',
                        opacity: isOtherHovered ? 0.5 : 1,
                        color: isHovered ? 'var(--color-secondary)' : '#475569',
                        borderColor: isHovered ? 'var(--color-secondary)' : 'rgba(99,102,241,0.2)',
                        zIndex: isHovered ? 50 : 10
                      }}
                    >
                      <item.icon className="w-4 h-4" style={{ color: isHovered ? 'var(--color-secondary)' : '#6366F1' }} />
                      {item.text}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
