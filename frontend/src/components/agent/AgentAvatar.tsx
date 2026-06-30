'use client';

import { motion, TargetAndTransition } from 'framer-motion';
import { useChatStore } from '@/lib/store/chatStore';
import { AgentState, PHASES } from '@/types';
import { agentEntranceVariants } from '@/lib/utils/animations';
import SahayamCharacter from './SahayamCharacter';

/* ── Animation helpers ── */
function getBodyAnim(state: AgentState): TargetAndTransition {
  switch (state) {
    case 'listening':
      // Lean in, gentle tilt
      return { rotate: [0, 4, 2], scale: [1, 1.05, 1.03], y: [0, 5, 2], transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' as const } };
    case 'thinking':
      // Tilt head, float up
      return { rotate: [0, -6, 6, 0], y: [0, -12, -6, 0], transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' as const } };
    case 'typing':
      // Slight bounce
      return { scale: [1, 1.02, 1], y: [0, -4, 0], transition: { duration: 1, repeat: Infinity, ease: 'easeInOut' as const } };
    case 'celebrating':
      return { scale: [1, 1.15, 1.08, 1.12, 1], rotate: [-5, 5, -3, 3, 0], transition: { duration: 0.8, ease: 'easeOut' as const } };
    case 'emphasizing':
      // Quick lean in
      return { scale: [1, 1.08, 1], y: [0, 4, 0], transition: { duration: 0.6, repeat: 2, ease: 'easeInOut' as const } };
    default: // idle
      // Gentle breathing
      return { y: [0, -10, 0], scale: [1, 1.02, 1], transition: { duration: 5, repeat: Infinity, ease: 'easeInOut' as const } };
  }
}

function getGlow(state: AgentState, phaseColor: string): [string, string, number] {
  switch (state) {
    case 'listening':   return ['#6C3CE1', '#FF6B8A', 0.6];
    case 'thinking':   return ['#FFB84D', phaseColor, 0.7];
    case 'typing':     return ['#6C3CE1', '#00CEC9', 0.5];
    case 'celebrating':return ['#FFB84D', '#FF6B8A', 0.85];
    case 'emphasizing':return ['#FF6B8A', phaseColor, 0.75];
    default:           return [phaseColor, '#2D1B69', 0.5];
  }
}

/* ── Thought Bubble ── */
function ThoughtBubble({ delay, x, text, emoji }: { delay: number; x: number; text: string; emoji: string }) {
  return (
    <motion.div
      className="absolute text-white/90 text-sm font-medium backdrop-blur-md rounded-full px-4 py-2 pointer-events-none whitespace-nowrap z-20 shadow-xl flex items-center gap-2"
      style={{
        left: `${x}%`,
        bottom: '108%',
        background: 'rgba(108,60,225,0.3)',
        border: '1px solid rgba(108,60,225,0.4)',
      }}
      initial={{ opacity: 0, y: 10, scale: 0.8 }}
      animate={{ opacity: [0, 1, 0.8, 0], y: [10, -25, -50, -80], scale: [0.8, 1, 0.95, 0.85] }}
      transition={{ duration: 4, delay, repeat: Infinity, repeatDelay: 3 }}
    >
      <span>{emoji}</span> {text}
    </motion.div>
  );
}

/* ── Sparkle burst (celebrating) ── */
function Sparkles() {
  const sparks = Array.from({ length: 12 }, (_, i) => ({
    angle: (i / 12) * 360,
    distance: 70 + Math.random() * 50,
    delay: Math.random() * 0.4,
  }));
  return (
    <div className="absolute inset-0 pointer-events-none z-30">
      {sparks.map((s, i) => (
        <motion.div
          key={i}
          className="absolute w-2.5 h-2.5 rounded-full"
          style={{
            background: i % 2 === 0 ? '#FFB84D' : '#FF6B8A',
            left: '50%', top: '30%',
            boxShadow: '0 0 10px rgba(255,184,77,0.8)'
          }}
          initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
          animate={{
            x: Math.cos((s.angle * Math.PI) / 180) * s.distance,
            y: Math.sin((s.angle * Math.PI) / 180) * s.distance - 40,
            opacity: 0,
            scale: 0,
          }}
          transition={{ duration: 1, delay: s.delay, ease: 'easeOut' as const }}
        />
      ))}
    </div>
  );
}

/* ── Main Avatar ── */
export default function AgentAvatar({ size = 'full' }: { size?: 'full' | 'sm' }) {
  const { agentState, currentPhase } = useChatStore();
  const phaseConfig = PHASES.find((p) => p.id === currentPhase) ?? PHASES[0];
  
  const [glowA, glowB, glowOpacity] = getGlow(agentState, phaseConfig.moodColor);
  const isSm = size === 'sm';

  const thoughts = [
    { text: 'Listening deeply...', x: 5, delay: 0, emoji: '👂' },
    { text: 'Understanding...', x: 45, delay: 1.5, emoji: '🧠' },
    { text: 'Reflecting...', x: 68, delay: 3, emoji: '💭' },
  ];

  return (
    <motion.div
      className={`relative flex flex-col items-center select-none ${isSm ? '' : 'pb-10 pt-4'}`}
      variants={agentEntranceVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Thought bubbles */}
      {agentState === 'thinking' && !isSm && (
        <div className="relative w-full">
          {thoughts.map((t) => (
            <ThoughtBubble key={t.text} text={t.text} x={t.x} delay={t.delay} emoji={t.emoji} />
          ))}
        </div>
      )}

      {/* Sparkle burst on celebration */}
      {agentState === 'celebrating' && !isSm && <Sparkles />}

      {/* ── Outer ambient glow ── */}
      <motion.div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: isSm ? '140%' : '140%',
          height: isSm ? '140%' : '140%',
          background: `radial-gradient(circle, ${glowA}55 0%, ${glowB}22 50%, transparent 75%)`,
          filter: 'blur(35px)',
          zIndex: 0,
        }}
        animate={{ scale: [1, 1.15, 1], opacity: [glowOpacity * 0.7, glowOpacity, glowOpacity * 0.7] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' as const }}
      />

      {/* ── Secondary inner glow ring ── */}
      <motion.div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: '95%', height: '95%',
          border: `1.5px solid ${glowA}66`,
          filter: `drop-shadow(0 0 16px ${glowA}90)`,
          zIndex: 1,
        }}
        animate={{ scale: [1, 1.08, 1], opacity: [0.4, 0.9, 0.4] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' as const }}
      />

      {/* ── Agent body ── */}
      <motion.div
        className="relative z-10 w-full flex items-center justify-center"
      >
        <SahayamCharacter mode={isSm ? 'sidebar' : 'hero'} />
      </motion.div>

      {/* ── Dynamic State & Phase Label ── */}
      {!isSm && (
        <motion.div
          key={agentState + currentPhase}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mt-6 flex flex-col items-center gap-1.5"
        >
          {/* Action State */}
          {agentState !== 'idle' && (
            <div 
              className="text-xs font-bold tracking-widest uppercase flex items-center gap-1.5 px-3 py-1 rounded-full"
              style={{ color: glowA, backgroundColor: `${glowA}1A`, border: `1px solid ${glowA}40` }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
              {agentState === 'listening' ? 'Listening...' : 
               agentState === 'thinking' ? 'Understanding...' : 
               agentState === 'typing' ? 'Responding...' : 
               agentState === 'celebrating' ? 'Celebrating!' : 'Present'}
            </div>
          )}
          
          {/* Phase Mood */}
          <div 
            className="text-sm font-medium flex items-center gap-2 px-4 py-1.5 rounded-full shadow-lg"
            style={{ 
              background: 'rgba(255,255,255,0.05)', 
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: phaseConfig.moodColor
            }}
          >
            <span>{phaseConfig.agentEmoji}</span>
            <span>{phaseConfig.agentMood}</span>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
