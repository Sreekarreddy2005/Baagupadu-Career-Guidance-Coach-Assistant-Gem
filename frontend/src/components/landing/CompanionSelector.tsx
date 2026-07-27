'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Check, Sparkles } from 'lucide-react';
import { COMPANIONS } from '@/lib/companions';
import { useCompanionStore } from '@/lib/store/companionStore';

export default function CompanionSelector() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);
  const { setActiveCompanionId, activeCompanionId } = useCompanionStore();

  // Initialize index based on global store if possible
  useEffect(() => {
    const idx = COMPANIONS.findIndex(c => c.id === activeCompanionId);
    if (idx !== -1) setCurrentIndex(idx);
  }, []);

  const activeCompanion = COMPANIONS[currentIndex];

  const handleNext = () => {
    if (isGenerating || isGenerated) return;
    setCurrentIndex((prev) => (prev + 1) % COMPANIONS.length);
  };

  const handlePrev = () => {
    if (isGenerating || isGenerated) return;
    setCurrentIndex((prev) => (prev - 1 + COMPANIONS.length) % COMPANIONS.length);
  };

  const handleSelect = () => {
    setIsGenerating(true);
    // Set the global state
    setActiveCompanionId(activeCompanion.id);
    
    // Simulate generation delay
    setTimeout(() => {
      setIsGenerating(false);
      setIsGenerated(true);
    }, 3000);
  };

  return (
    <div className="w-full max-w-[500px] mx-auto relative flex flex-col items-center justify-center -mt-10">
      
      {/* ── BACKGROUND GLOWS ── */}
      <AnimatePresence>
        {!isGenerated && !isGenerating && (
          <motion.div
            key="static-glow"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full blur-[60px] -z-10 bg-[var(--color-secondary)]"
          />
        )}
      </AnimatePresence>

      {/* ── GENERATING ANIMATION (Apple Image Playground Style) ── */}
      {isGenerating && (
        <div className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none">
          <motion.div
            animate={{ 
              scale: [1, 2.5], 
              opacity: [0.8, 0],
              borderWidth: ["10px", "2px"]
            }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
            className="absolute w-[150px] h-[150px] rounded-full border-solid"
            style={{ borderColor: activeCompanion.color }}
          />
          <motion.div
            animate={{ 
              scale: [1, 2], 
              opacity: [0.6, 0],
              borderWidth: ["8px", "1px"]
            }}
            transition={{ duration: 1.5, delay: 0.5, repeat: Infinity, ease: "easeOut" }}
            className="absolute w-[150px] h-[150px] rounded-full border-solid"
            style={{ borderColor: activeCompanion.color }}
          />
          <motion.div
            animate={{ 
              scale: [1, 1.5], 
              opacity: [1, 0.2]
            }}
            transition={{ duration: 1, repeat: Infinity, repeatType: 'reverse', ease: "easeInOut" }}
            className="absolute w-[150px] h-[150px] rounded-full blur-[20px]"
            style={{ backgroundColor: activeCompanion.color }}
          />
        </div>
      )}

      {/* ── SUCCESS ANIMATION (Locked In) ── */}
      {isGenerated && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.15 }}
          transition={{ type: 'spring', damping: 15 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full blur-[50px] -z-10 bg-[var(--color-secondary)]"
        />
      )}

      {/* ── CAROUSEL IMAGE VIEWER ── */}
      <div className="relative w-full h-[650px] flex items-center justify-center overflow-visible z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCompanion.id}
            initial={{ opacity: 0, x: 50, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1.15 }}
            exit={{ opacity: 0, x: -50, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="absolute w-full h-full flex justify-center items-end pb-8"
            // Make image draggable
            drag={!isGenerating && !isGenerated ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={(e, { offset, velocity }) => {
              const swipe = swipePower(offset.x, velocity.x);
              if (swipe < -swipeConfidenceThreshold) handleNext();
              else if (swipe > swipeConfidenceThreshold) handlePrev();
            }}
          >
            {/* The Image is completely free-standing (no bg or box), wrapped in the persona idle animation */}
            <motion.div 
              className="w-full h-full flex justify-center items-end"
              animate={activeCompanion.animation}
            >
              <img
                src={activeCompanion.image}
                alt={activeCompanion.name}
                className="w-auto h-full object-contain select-none object-bottom"
                draggable={false}
                style={{
                  WebkitUserDrag: 'none'
                }}
              />
            </motion.div>

            {/* ── FLOATING LABELS ── */}
            <AnimatePresence>
              {!isGenerating && !isGenerated && activeCompanion.labels.map((label, idx) => (
                <motion.div
                  key={`${activeCompanion.id}-label-${idx}`}
                  initial={{ opacity: 0, scale: 0.8, filter: 'blur(10px)' }}
                  animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, scale: 0.8, filter: 'blur(10px)' }}
                  transition={{ delay: 0.2 + idx * 0.1, duration: 0.5, type: 'spring' }}
                  className="absolute z-20 pointer-events-none"
                  style={{ top: label.top, left: label.left, right: label.right }}
                >
                  <div className="flex items-center gap-2">
                    {/* Tiny glowing dot connector */}
                    {label.right && (
                      <div className="w-1.5 h-1.5 rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)]" style={{ backgroundColor: activeCompanion.color }} />
                    )}
                    
                    {/* The beautiful minimal text tag */}
                    <div className="px-3 py-1.5 rounded-full bg-white/5 dark:bg-black/20 backdrop-blur-md border border-white/10 shadow-[0_4px_15px_rgba(0,0,0,0.05)] text-[11px] font-semibold tracking-wider uppercase text-[var(--color-text-muted)] whitespace-nowrap">
                      {label.text}
                    </div>

                    {label.left && (
                      <div className="w-1.5 h-1.5 rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)]" style={{ backgroundColor: activeCompanion.color }} />
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── FLOATING TEXT & CONTROLS ── */}
      <div className="w-full relative z-20 mt-8 min-h-[140px] flex flex-col items-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCompanion.id + (isGenerating ? '-gen' : '') + (isGenerated ? '-done' : '')}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="text-center w-full flex flex-col items-center"
          >
            {isGenerating ? (
              <div className="flex flex-col items-center gap-3 mt-4">
                <h3 className="text-[22px] font-bold tracking-tight text-[var(--color-text)]">
                  Synthesizing Persona...
                </h3>
                <p className="text-[15px] font-medium text-[var(--color-text-muted)]">
                  Aligning emotional core with {activeCompanion.name}.
                </p>
              </div>
            ) : isGenerated ? (
              <div className="flex flex-col items-center gap-4 mt-2">
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-white bg-[var(--color-secondary)] shadow-[0_0_20px_rgba(99,102,241,0.3)]">
                  <Check className="w-6 h-6" />
                </div>
                <h3 className="text-[24px] font-bold tracking-tight text-[var(--color-text)]">
                  Your Sahayam is ready.
                </h3>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center gap-6 mb-4 w-full">
                  <button onClick={handlePrev} className="p-2.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-[var(--color-text-muted)] hover:text-[var(--color-text)]">
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <h3 className="text-[28px] font-black tracking-tight text-[var(--color-text)] min-w-[220px]">
                    {activeCompanion.name}
                  </h3>
                  <button onClick={handleNext} className="p-2.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-[var(--color-text-muted)] hover:text-[var(--color-text)]">
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </div>
                <p className="text-[15px] font-medium text-[var(--color-text-muted)] max-w-[340px] mx-auto leading-[1.6] h-[72px]">
                  {activeCompanion.description}
                </p>
                <button
                  onClick={handleSelect}
                  className="mt-6 px-10 py-3.5 rounded-full text-white text-[15px] font-bold shadow-[0_8px_20px_rgba(99,102,241,0.25)] hover:shadow-[0_12px_25px_rgba(99,102,241,0.35)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 bg-[var(--color-secondary)] flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  Select Companion
                </button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

    </div>
  );
}

// Swipe utility functions
const swipeConfidenceThreshold = 10000;
const swipePower = (offset: number, velocity: number) => {
  return Math.abs(offset) * velocity;
};
