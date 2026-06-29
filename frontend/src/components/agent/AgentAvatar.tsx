'use client';

import { motion, TargetAndTransition } from 'framer-motion';
import { useChatStore } from '@/lib/store/chatStore';
import { AgentState } from '@/types';
import {
  breathingAnimation,
  listeningAnimation,
  thinkingAnimation,
  celebratingAnimation,
  agentEntranceVariants,
} from '@/lib/utils/animations';

function getBodyAnimation(state: AgentState): TargetAndTransition {
  switch (state) {
    case 'listening':
      return listeningAnimation;
    case 'thinking':
      return thinkingAnimation;
    case 'celebrating':
      return celebratingAnimation;
    default:
      return breathingAnimation;
  }
}

function getGlowColors(state: AgentState) {
  switch (state) {
    case 'listening':
      return ['#60A5FA', '#818CF8'];
    case 'thinking':
      return ['#C084FC', '#E879F9'];
    case 'typing':
      return ['#34D399', '#10B981'];
    case 'celebrating':
      return ['#F59E0B', '#EC4899'];
    case 'emphasizing':
      return ['#EC4899', '#F43F5E'];
    default:
      return ['#7C3AED', '#4F46E5'];
  }
}

function ThoughtBubble({ delay, x, text }: { delay: number; x: number; text: string }) {
  return (
    <motion.div
      className="absolute text-white/70 text-xs font-medium bg-white/10 backdrop-blur-sm rounded-full px-3 py-1.5 pointer-events-none whitespace-nowrap"
      style={{ left: `${x}%`, bottom: '100%' }}
      initial={{ opacity: 0, y: 10, scale: 0.8 }}
      animate={{ opacity: [0, 0.8, 0], y: [10, -30, -60], scale: [0.8, 1, 0.9] }}
      transition={{ duration: 3, delay, repeat: Infinity, repeatDelay: 4 }}
    >
      {text}
    </motion.div>
  );
}

const THOUGHTS = [
  { text: 'Interesting...', x: 10, delay: 0 },
  { text: 'Hmm, tell me more', x: 50, delay: 1.2 },
  { text: 'I see a pattern!', x: 70, delay: 2.5 },
];

export default function AgentAvatar() {
  const { agentState } = useChatStore();
  const [glowA, glowB] = getGlowColors(agentState);
  const bodyAnim = getBodyAnimation(agentState);

  return (
    <motion.div
      className="relative flex items-center justify-center select-none"
      variants={agentEntranceVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Thought bubbles (only when thinking) */}
      {agentState === 'thinking' &&
        THOUGHTS.map((t) => (
          <ThoughtBubble key={t.text} text={t.text} x={t.x} delay={t.delay} />
        ))}

      {/* Outer glow ring */}
      <motion.div
        className="absolute rounded-full blur-3xl opacity-40"
        style={{
          width: '120%',
          height: '120%',
          background: `radial-gradient(circle, ${glowA}, ${glowB}, transparent 70%)`,
        }}
        animate={{ scale: [1, 1.08, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Main agent body */}
      <motion.div
        className="relative z-10"
        animate={bodyAnim}
      >
        <svg
          viewBox="0 0 260 320"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-2xl"
        >
          <defs>
            <radialGradient id="bodyGrad" cx="50%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#818CF8" />
              <stop offset="50%" stopColor="#7C3AED" />
              <stop offset="100%" stopColor="#4F46E5" />
            </radialGradient>
            <radialGradient id="headGrad" cx="50%" cy="35%" r="60%">
              <stop offset="0%" stopColor="#A78BFA" />
              <stop offset="60%" stopColor="#7C3AED" />
              <stop offset="100%" stopColor="#6D28D9" />
            </radialGradient>
            <radialGradient id="glowGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={glowA} stopOpacity="0.6" />
              <stop offset="100%" stopColor={glowB} stopOpacity="0" />
            </radialGradient>
            <filter id="softGlow">
              <feGaussianBlur stdDeviation="4" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Glow halo */}
          <ellipse cx="130" cy="160" rx="110" ry="130" fill="url(#glowGrad)" />

          {/* Body */}
          <rect x="60" y="170" width="140" height="110" rx="30" fill="url(#bodyGrad)" />

          {/* Neck */}
          <rect x="110" y="155" width="40" height="25" rx="10" fill="#6D28D9" />

          {/* Head */}
          <ellipse cx="130" cy="130" rx="70" ry="65" fill="url(#headGrad)" filter="url(#softGlow)" />

          {/* Eyes */}
          {agentState === 'thinking' ? (
            <>
              {/* Squinting thinking eyes */}
              <ellipse cx="104" cy="122" rx="14" ry="8" fill="white" opacity="0.95" />
              <ellipse cx="156" cy="122" rx="14" ry="8" fill="white" opacity="0.95" />
              <ellipse cx="106" cy="122" rx="7" ry="5" fill="#1E1B4B" />
              <ellipse cx="158" cy="122" rx="7" ry="5" fill="#1E1B4B" />
            </>
          ) : agentState === 'listening' ? (
            <>
              {/* Wide open listening eyes */}
              <ellipse cx="104" cy="120" rx="16" ry="18" fill="white" opacity="0.95" />
              <ellipse cx="156" cy="120" rx="16" ry="18" fill="white" opacity="0.95" />
              <ellipse cx="106" cy="121" rx="9" ry="11" fill="#1E1B4B" />
              <ellipse cx="158" cy="121" rx="9" ry="11" fill="#1E1B4B" />
              <circle cx="109" cy="118" r="3" fill="white" opacity="0.8" />
              <circle cx="161" cy="118" r="3" fill="white" opacity="0.8" />
            </>
          ) : agentState === 'celebrating' ? (
            <>
              {/* Happy curved eyes */}
              <path d="M 90 122 Q 104 110 118 122" stroke="white" strokeWidth="4" fill="none" strokeLinecap="round" />
              <path d="M 142 122 Q 156 110 170 122" stroke="white" strokeWidth="4" fill="none" strokeLinecap="round" />
            </>
          ) : (
            <>
              {/* Default calm eyes */}
              <ellipse cx="104" cy="122" rx="15" ry="16" fill="white" opacity="0.95" />
              <ellipse cx="156" cy="122" rx="15" ry="16" fill="white" opacity="0.95" />
              <ellipse cx="106" cy="123" rx="8" ry="9" fill="#1E1B4B" />
              <ellipse cx="158" cy="123" rx="8" ry="9" fill="#1E1B4B" />
              {/* Pupils shine */}
              <circle cx="109" cy="120" r="2.5" fill="white" opacity="0.9" />
              <circle cx="161" cy="120" r="2.5" fill="white" opacity="0.9" />
            </>
          )}

          {/* Subtle smile */}
          <path
            d={agentState === 'celebrating' ? 'M 108 148 Q 130 165 152 148' : 'M 112 148 Q 130 158 148 148'}
            stroke="white"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
            opacity="0.8"
          />

          {/* Body details — subtle lines */}
          <rect x="100" y="195" width="60" height="8" rx="4" fill="white" opacity="0.1" />
          <rect x="88" y="212" width="84" height="8" rx="4" fill="white" opacity="0.08" />

          {/* Arms */}
          <rect x="18" y="175" width="42" height="72" rx="21" fill="url(#bodyGrad)" />
          <rect x="200" y="175" width="42" height="72" rx="21" fill="url(#bodyGrad)" />

          {/* Ears / side nodes */}
          <circle cx="60" cy="130" r="10" fill="#6D28D9" />
          <circle cx="200" cy="130" r="10" fill="#6D28D9" />
          <circle cx="60" cy="130" r="5" fill={glowA} opacity="0.8" />
          <circle cx="200" cy="130" r="5" fill={glowA} opacity="0.8" />
        </svg>
      </motion.div>

      {/* State label */}
      <motion.div
        className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs font-medium tracking-widest uppercase"
        style={{ color: glowA }}
        key={agentState}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
        transition={{ duration: 0.4 }}
      >
        {agentState === 'idle'
          ? 'Present'
          : agentState === 'listening'
          ? 'Listening...'
          : agentState === 'thinking'
          ? 'Thinking...'
          : agentState === 'typing'
          ? 'Responding...'
          : agentState === 'celebrating'
          ? 'Celebrating! 🎉'
          : ''}
      </motion.div>
    </motion.div>
  );
}
