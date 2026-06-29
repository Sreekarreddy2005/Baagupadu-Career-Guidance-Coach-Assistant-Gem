'use client';

import { motion } from 'framer-motion';

export default function TypingIndicator() {
  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0 mt-1">
        <span className="text-white text-xs font-bold">S</span>
      </div>
      <div className="bg-white/5 border border-white/10 rounded-2xl rounded-tl-sm px-5 py-4 flex gap-2 items-center">
        {[0, 0.18, 0.36].map((delay, i) => (
          <motion.div
            key={i}
            className="w-2.5 h-2.5 rounded-full bg-indigo-400"
            animate={{ y: [0, -6, 0], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 0.7, delay, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}
      </div>
    </div>
  );
}
