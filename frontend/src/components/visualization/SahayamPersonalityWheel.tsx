'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

const traits = [
  { label: 'Close Friend', percentage: 40, color: '#FF6B8A', why: 'To create emotional safety during trust building.', when: 'Childhood & Teenage phases' },
  { label: 'Mentor', percentage: 25, color: '#6C3CE1', why: 'To provide objective, actionable guidance.', when: 'Career Guidance phase' },
  { label: 'Curious Explorer', percentage: 20, color: '#00CEC9', why: 'To ask probing questions without judgment.', when: 'Adult & Synthesis phases' },
  { label: 'Career Coach', percentage: 10, color: '#FFB84D', why: 'To hold you accountable and push boundaries.', when: 'Roadmap planning' },
  { label: 'Storyteller', percentage: 5, color: '#6DD5B8', why: 'To reflect your journey back to you beautifully.', when: 'Persona Synthesis' },
];

export default function SahayamPersonalityWheel() {
  const [activeTrait, setActiveTrait] = useState(traits[0]);

  return (
    <div className="relative w-full max-w-sm mx-auto aspect-square flex items-center justify-center mt-12 mb-8">
      {/* Background ring */}
      <div className="absolute inset-4 rounded-full border-2 border-dashed border-[var(--glass-border)] opacity-60 animate-[spin_60s_linear_infinite]" />
      <div className="absolute inset-0 rounded-full border border-[var(--glass-border)] opacity-30" />
      
      {/* Central info area */}
      <div 
        className="absolute inset-10 rounded-full bg-white/70 shadow-inner flex flex-col items-center justify-center p-6 text-center border border-[var(--color-surface)] z-10 transition-all duration-500 overflow-hidden" 
        style={{ boxShadow: `0 0 50px ${activeTrait.color}30 inset` }}
      >
         <motion.div
           key={activeTrait.label}
           initial={{ opacity: 0, scale: 0.9 }}
           animate={{ opacity: 1, scale: 1 }}
           className="w-full flex flex-col items-center justify-center relative z-10"
         >
           <h4 className="text-xl font-bold mb-2 tracking-tight" style={{ color: activeTrait.color }}>{activeTrait.label}</h4>
           <div className="text-[64px] font-black opacity-[0.04] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10">{activeTrait.percentage}%</div>
           <p className="text-[13px] text-[var(--color-text-muted)] font-medium mb-2 leading-tight"><strong>Why:</strong> {activeTrait.why}</p>
           <p className="text-[13px] text-[var(--color-text-muted)] font-medium leading-tight"><strong>When:</strong> {activeTrait.when}</p>
         </motion.div>
      </div>

      {/* Orbiting nodes */}
      {traits.map((trait, i) => {
        const angle = (i * (360 / traits.length)) * (Math.PI / 180);
        const radius = 50; // percentage
        const x = 50 + radius * Math.cos(angle - Math.PI / 2);
        const y = 50 + radius * Math.sin(angle - Math.PI / 2);
        const isActive = activeTrait.label === trait.label;
        
        return (
          <motion.button
            key={trait.label}
            onHoverStart={() => setActiveTrait(trait)}
            onClick={() => setActiveTrait(trait)}
            className="absolute w-14 h-14 -ml-7 -mt-7 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 z-20 group outline-none cursor-pointer"
            suppressHydrationWarning
            style={{ 
              left: `${x}%`, 
              top: `${y}%`,
              backgroundColor: isActive ? trait.color : 'white',
              border: `2px solid ${trait.color}`,
              transform: isActive ? 'scale(1.2)' : 'scale(1)'
            }}
          >
             <span className={`text-[12px] font-extrabold ${isActive ? 'text-white' : 'text-[var(--color-text)]'}`}>{trait.percentage}%</span>
             
             {/* Node label tooltip */}
             <div className="absolute -bottom-8 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap text-[13px] font-bold bg-white px-3 py-1 rounded-full shadow-md text-[var(--color-text)] pointer-events-none">
               {trait.label}
             </div>
          </motion.button>
        )
      })}
    </div>
  )
}
