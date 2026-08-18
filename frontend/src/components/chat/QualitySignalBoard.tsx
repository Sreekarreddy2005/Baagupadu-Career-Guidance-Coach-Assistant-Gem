'use client';

import React from 'react';
import { Activity, Zap, Heart, Compass, Trophy } from 'lucide-react';
import { useUserProfileStore } from '@/stores/userProfileStore';

export const QualitySignalBoard: React.FC = () => {
  const { profile } = useUserProfileStore();
  const signals = profile?.guidance?.quality_signals;

  const displaySignals = signals && Object.keys(signals).length > 0 
    ? signals 
    : {
        empathy_index: "Pending",
        curiosity_index: "Pending",
        tactical_index: "Pending",
        winning_signal: "Pending"
      };

  const renderIcon = (key: string) => {
    switch(key.toLowerCase()) {
      case 'empathy_index': return <Heart size={16} className="text-rose-500" />;
      case 'curiosity_index': return <Compass size={16} className="text-blue-500" />;
      case 'tactical_index': return <Zap size={16} className="text-amber-500" />;
      case 'winning_signal': return <Trophy size={16} className="text-emerald-500" />;
      default: return <Activity size={16} className="text-slate-500" />;
    }
  };

  return (
    <div className="w-full bg-[#f8f9fa] rounded-2xl p-6 border border-black/5 shadow-sm mb-6">
      <div className="flex justify-between items-start mb-6">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-bold tracking-widest text-indigo-500 uppercase flex items-center gap-2">
            <Activity size={12} /> Live Tracking
          </span>
          <h2 className="text-xl font-serif font-bold text-slate-800">
            Quality Signals
          </h2>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        {Object.entries(displaySignals).map(([key, value], idx) => {
          const isWinner = key === 'winning_signal';
          return (
            <div 
              key={idx} 
              className={`rounded-xl p-3 flex flex-col gap-1 border ${isWinner ? 'col-span-2 bg-emerald-50/50 border-emerald-200 shadow-sm' : 'bg-slate-50 border-slate-100'}`}
            >
              <div className="flex items-center gap-2">
                {renderIcon(key)}
                <span className={`text-[10px] font-bold uppercase tracking-wider ${isWinner ? 'text-emerald-600' : 'text-slate-500'}`}>
                  {key.replace('_', ' ')}
                </span>
              </div>
              <span className={`text-sm font-semibold ml-6 ${isWinner ? 'text-emerald-800' : 'text-slate-800'}`}>
                {String(value)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
