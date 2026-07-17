'use client';

import React from 'react';
import { Activity, Zap, Heart, Compass, CheckCircle2 } from 'lucide-react';
import { useUserProfileStore } from '@/stores/userProfileStore';

export const QualitySignalBoard: React.FC = () => {
  const { profile } = useUserProfileStore();
  const signals = profile?.guidance?.quality_signals;

  if (!signals || Object.keys(signals).length === 0) return null;

  const renderIcon = (key: string) => {
    switch(key.toLowerCase()) {
      case 'empathy_score': return <Heart size={16} className="text-rose-500" />;
      case 'user_resonance': return <Zap size={16} className="text-amber-500" />;
      case 'routine_adherence': return <CheckCircle2 size={16} className="text-emerald-500" />;
      case 'clarity': return <Compass size={16} className="text-blue-500" />;
      default: return <Activity size={16} className="text-slate-500" />;
    }
  };

  return (
    <div className="w-full bg-white rounded-2xl p-5 border border-slate-100 shadow-sm mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
          <Activity size={16} className="text-indigo-500" />
          Session Quality Signals
        </h3>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        {Object.entries(signals).map(([key, value], idx) => (
          <div key={idx} className="bg-slate-50 rounded-xl p-3 flex flex-col gap-1 border border-slate-100">
            <div className="flex items-center gap-2">
              {renderIcon(key)}
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                {key.replace('_', ' ')}
              </span>
            </div>
            <span className="text-sm font-semibold text-slate-800 ml-6">
              {String(value)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
