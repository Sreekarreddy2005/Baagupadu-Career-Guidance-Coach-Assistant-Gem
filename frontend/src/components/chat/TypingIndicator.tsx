'use client';

import { motion } from 'framer-motion';

interface Props {
  agentState?: string;
}

export default function TypingIndicator({ agentState = 'typing' }: Props) {
  const isThinking = agentState === 'thinking';

  return (
    <div
      className="flex items-end gap-2.5"
      role="status"
      aria-label={isThinking ? 'Sahayam is thinking…' : 'Sahayam is typing…'}
    >
      {/* Avatar */}
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mb-1 text-white text-xs font-bold shadow-lg"
        aria-hidden="true"
        style={{
          background: isThinking
            ? 'linear-gradient(135deg, #6C3CE1, #06B6D4)'
            : 'linear-gradient(135deg, var(--color-secondary), #818CF8)',
          boxShadow: isThinking
            ? '0 0 12px rgba(6,182,212,0.4)'
            : '0 0 12px rgba(99,102,241,0.3)',
          transition: 'all 0.4s ease',
        }}
      >
        S
      </div>

      {/* Bubble */}
      <div
        className="px-5 py-3.5 rounded-2xl rounded-tl-sm flex flex-col gap-2 items-start min-w-[80px]"
        style={isThinking ? {
          background: 'linear-gradient(135deg, rgba(6,182,212,0.12) 0%, rgba(99,102,241,0.15) 100%)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(6,182,212,0.25)',
          boxShadow: '0 4px 24px rgba(6,182,212,0.08)',
          transition: 'all 0.4s ease',
        } : {
          background: 'linear-gradient(135deg, rgba(99,102,241,0.1) 0%, rgba(129,140,248,0.12) 100%)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(99,102,241,0.2)',
          boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
          transition: 'all 0.4s ease',
        }}
      >
        {/* Dots */}
        <div className="flex gap-1.5 items-center">
          {[0, 0.18, 0.36].map((delay, i) => (
            <motion.div
              key={i}
              className="rounded-full"
              style={{
                width: isThinking ? '8px' : '10px',
                height: isThinking ? '8px' : '10px',
                background: isThinking
                  ? i === 1 ? '#06B6D4' : '#6366F1'
                  : i === 1 ? '#FF6B8A' : '#6C3CE1',
              }}
              animate={isThinking ? {
                // Thinking: slower, pulsing scale — "deep in thought"
                scale: [1, 1.4, 1],
                opacity: [0.4, 1, 0.4],
                y: [0, -3, 0],
              } : {
                // Typing: bouncing — "actively composing"
                y: [0, -7, 0],
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: isThinking ? 1.2 : 0.75,
                delay: isThinking ? delay * 1.5 : delay,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>

        {/* State label — "Thinking…" vs nothing for typing */}
        {isThinking && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-[10px] font-semibold tracking-wider uppercase"
            style={{ color: '#06B6D4' }}
          >
            Reflecting…
          </motion.p>
        )}
      </div>
    </div>
  );
}
