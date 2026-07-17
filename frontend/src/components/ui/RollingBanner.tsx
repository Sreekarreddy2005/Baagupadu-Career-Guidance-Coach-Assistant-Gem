'use client';

import { useState } from 'react';
import { X, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface RollingBannerProps {
  message?: string;
}

export default function RollingBanner({ 
  message = "🚀 Welcome to Baagupadu! Your 100% private, offline AI Career Coach is now live. All data stays on your device." 
}: RollingBannerProps) {
  const [isVisible, setIsVisible] = useState(true);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0, padding: 0, margin: 0 }}
          className="w-full bg-gradient-to-r from-[var(--color-secondary)] to-[#818CF8] text-white overflow-hidden relative z-50 shadow-md"
        >
          <div className="w-full max-w-6xl mx-auto flex items-center justify-between px-4">
            <div className="flex-1 overflow-hidden whitespace-nowrap py-2.5 flex items-center mask-image-edges">
              <div className="animate-marquee inline-block">
                <span className="inline-flex items-center gap-2 font-medium text-[13px] tracking-wide mx-4">
                  <Sparkles size={14} className="text-amber-300" />
                  {message}
                  <Sparkles size={14} className="text-amber-300" />
                </span>
                {/* Duplicate for seamless scrolling */}
                <span className="inline-flex items-center gap-2 font-medium text-[13px] tracking-wide mx-4" aria-hidden="true">
                  <Sparkles size={14} className="text-amber-300" />
                  {message}
                  <Sparkles size={14} className="text-amber-300" />
                </span>
              </div>
            </div>
            
            <button 
              onClick={() => setIsVisible(false)}
              className="flex-shrink-0 p-1.5 hover:bg-white/30 rounded-full transition-all ml-4 z-10 hover:scale-110 active:scale-95"
              aria-label="Close banner"
            >
              <X size={18} className="text-white drop-shadow-sm" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
