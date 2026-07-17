'use client';

import React from 'react';
import { Flame, Star, Award } from 'lucide-react';
import { useUserProfileStore } from '@/stores/userProfileStore';

export const SankalpamWidget: React.FC = () => {
  const { profile } = useUserProfileStore();
  
  // Base points for starting
  let points = 50;
  
  // Add points based on completed phases
  const currentPhase = profile?.session_progress?.current_phase;
  if (currentPhase === 'exploration') points += 100;
  if (currentPhase === 'synthesis') points += 250;
  if (currentPhase === 'guidance') points += 500;
  if (currentPhase === 'completed') points += 1000;
  
  // Extra points if they have a persona
  if (profile?.persona?.archetype) points += 200;

  return (
    <div className="w-full bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-6 border border-orange-100 shadow-sm mt-6 relative overflow-hidden">
      
      {/* Decorative background element */}
      <div className="absolute -right-6 -top-6 text-orange-200 opacity-30 transform rotate-12 pointer-events-none">
        <Flame size={120} />
      </div>

      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-bold tracking-widest text-orange-700 uppercase">
            Your Energy
          </span>
          <h2 className="text-xl font-serif font-bold text-slate-800 flex items-center gap-2">
            Sankalpam Points <Flame size={18} className="text-orange-500" />
          </h2>
        </div>
      </div>

      <div className="flex items-end gap-2 relative z-10 mb-4">
        <span className="text-4xl font-black text-orange-600 tabular-nums tracking-tight">{points}</span>
        <span className="text-sm font-bold text-orange-800/60 mb-1">SP</span>
      </div>
      
      <div className="w-full h-2 bg-orange-200/50 rounded-full overflow-hidden mb-3 relative z-10">
        <div 
          className="h-full bg-gradient-to-r from-orange-400 to-amber-500 rounded-full" 
          style={{ width: `${Math.min(100, (points / 2000) * 100)}%` }} 
        />
      </div>
      
      <div className="flex justify-between items-center text-[10px] font-bold text-orange-800/50 uppercase tracking-widest relative z-10">
        <span className="flex items-center gap-1"><Star size={10} /> Novice</span>
        <span className="flex items-center gap-1">Sadhaka <Award size={10} /></span>
      </div>

    </div>
  );
};
