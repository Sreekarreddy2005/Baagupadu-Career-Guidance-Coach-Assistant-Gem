'use client';

import React from 'react';
import { Shield, FileText, Download, BookOpen } from 'lucide-react';
import { useUserProfileStore } from '@/stores/userProfileStore';
import { useChatStore } from '@/lib/store/chatStore';

export const LedgerWidget: React.FC = () => {
  const { profile } = useUserProfileStore();
  const { currentPhase } = useChatStore();

  const handleDownloadPersona = () => {
    if (!profile?.persona) return;
    const blob = new Blob([JSON.stringify(profile.persona, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'baagupadu_user_persona.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full bg-[#f8f9fa] rounded-2xl p-6 border border-black/5 shadow-sm">
      
      {/* Header section */}
      <div className="flex justify-between items-start mb-6">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-bold tracking-widest text-amber-700 uppercase">
            The Ledger
          </span>
          <h2 className="text-xl font-serif font-bold text-slate-800">
            Growth notes
          </h2>
        </div>
        <div className="w-8 h-8 rounded-lg bg-slate-200/60 flex items-center justify-center text-slate-600">
          <Shield size={16} />
        </div>
      </div>

      {/* Document Links */}
      <div className="flex flex-col gap-4">
        
        {/* Structured Report */}
        <button className="w-full flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200 hover:border-blue-300 hover:shadow-sm transition-all group">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600 group-hover:bg-blue-100 transition-colors">
              <FileText size={16} />
            </div>
            <div className="flex flex-col items-start">
              <span className="text-sm font-bold text-slate-800">View structured report</span>
              <span className="text-[10px] text-slate-500 font-medium">Detailed session summary</span>
            </div>
          </div>
          <BookOpen size={14} className="text-slate-400 group-hover:text-blue-500 transition-colors" />
        </button>

        {/* User Persona Download */}
        <button 
          onClick={handleDownloadPersona}
          disabled={!profile?.persona || Object.keys(profile.persona).length === 0}
          className="w-full flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200 hover:border-amber-300 hover:shadow-sm transition-all group disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-slate-200"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-50 text-amber-600 group-hover:bg-amber-100 transition-colors">
              <Download size={16} />
            </div>
            <div className="flex flex-col items-start">
              <span className="text-sm font-bold text-slate-800">Download Persona</span>
              <span className="text-[10px] text-slate-500 font-medium">JSON format export</span>
            </div>
          </div>
          <Download size={14} className="text-slate-400 group-hover:text-amber-500 transition-colors" />
        </button>

      </div>

      {/* Footer text */}
      <div className="mt-5 pt-4 border-t border-slate-200/60">
        <p className="text-[11px] leading-relaxed text-slate-500 flex items-center gap-2">
          <BookOpen size={12} className="text-slate-400 flex-shrink-0" />
          <span className="font-semibold text-slate-700 flex-shrink-0">Current theme:</span> 
          <span className="truncate">
            {currentPhase === 'discovery' && 'Childhood patterns and early influences'}
            {currentPhase === 'exploration' && 'Teenage and adult experiences'}
            {currentPhase === 'synthesis' && 'Extracting behavioral patterns and traits'}
            {currentPhase === 'guidance' && 'Career trajectory and future direction'}
          </span>
        </p>
      </div>

    </div>
  );
};
