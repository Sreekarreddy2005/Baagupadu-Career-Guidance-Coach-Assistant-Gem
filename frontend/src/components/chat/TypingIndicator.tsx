'use client';

import { motion } from 'framer-motion';

export default function TypingIndicator() {
  return (
    <div className="flex items-end gap-2.5">
      {/* Avatar */}
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mb-1 text-white text-xs font-bold shadow-lg"
        style={{
          background: 'linear-gradient(135deg, #2D1B69, #6C3CE1)',
          boxShadow: '0 0 12px rgba(108,60,225,0.4)',
        }}
      >
        S
      </div>

      {/* Bubble */}
      <div
        className="px-5 py-3.5 rounded-2xl rounded-tl-sm flex gap-1.5 items-center"
        style={{
          background: 'linear-gradient(135deg, rgba(108,60,225,0.25) 0%, rgba(45,27,105,0.3) 100%)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(108,60,225,0.3)',
          boxShadow: '0 4px 24px rgba(0,0,0,0.15)',
        }}
      >
        {[0, 0.16, 0.32].map((delay, i) => (
          <motion.div
            key={i}
            className="w-2.5 h-2.5 rounded-full"
            style={{ background: i === 1 ? '#FF6B8A' : '#6C3CE1' }}
            animate={{
              y: [0, -7, 0],
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 0.75,
              delay,
              repeat: Infinity,
              ease: 'easeInOut' as const,
            }}
          />
        ))}
      </div>
    </div>
  );
}
