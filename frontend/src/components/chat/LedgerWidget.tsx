'use client';

import React, { useState } from 'react';
import { Shield, FileText, Download, BookOpen } from 'lucide-react';
import { useUserProfileStore } from '@/stores/userProfileStore';
import { useChatStore } from '@/lib/store/chatStore';
import { StructuredReportModal } from '@/components/visualization/StructuredReportModal';
import { MessageSquare } from 'lucide-react';
import { useAuth } from '@clerk/nextjs';

export const LedgerWidget: React.FC = () => {
  const { profile } = useUserProfileStore();
  const { currentPhase, messages } = useChatStore();
  const { getToken } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDownloadTranscript = () => {
    if (!messages || messages.length === 0) return;
    
    let transcriptText = "=== SAHAYAM CAREER COACH TRANSCRIPT ===\n\n";
    
    messages.forEach((msg) => {
      const role = msg.sender === 'user' ? 'You' : 'Sahayam';
      const time = new Date(msg.timestamp).toLocaleString();
      transcriptText += `[${time}] ${role}:\n${msg.text}\n\n`;
    });
    
    const blob = new Blob([transcriptText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sahayam_transcript_${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadPersona = () => {
    if (!profile?.persona) return;
    
    let reportText = "=== TOTAL BRAIN PERSONA ===\n\n";
    const p = profile.persona;
    
    if (p.coverage_matrix) {
      const c = p.coverage_matrix;
      reportText += `=== BRAIN MAPPING COVERAGE ===\n`;
      reportText += `Overall Mapped: ${c.overall_score || 0}%\n`;
      reportText += `- Cognitive Capabilities: ${c.cognitive_capabilities || 0}%\n`;
      reportText += `- Curiosity & Enthusiasm: ${c.curiosity_and_enthusiasm || 0}%\n`;
      reportText += `- Habits & Routines: ${c.habits_and_routines || 0}%\n`;
      reportText += `- Free Time Preferences: ${c.free_time_preferences || 0}%\n`;
      reportText += `- Lifestyle & Environment: ${c.lifestyle_and_environment || 0}%\n\n`;
    }

    if (p.traits_uncovered?.length) {
      const weights = p.trait_weights || {};
      reportText += `TRAITS UNCOVERED:\n${p.traits_uncovered.map((t: string) => `- ${t} [Confidence: ${Math.round((weights[t] || 0.35) * 100)}%]`).join('\n')}\n\n`;
    }
    if (p.thinking_style) reportText += `THINKING STYLE:\n${p.thinking_style}\n\n`;
    if (p.emotional_drivers?.length) reportText += `EMOTIONAL DRIVERS:\n${p.emotional_drivers.map((d: string) => `- ${d}`).join('\n')}\n\n`;
    if (p.values?.length) reportText += `CORE VALUES:\n${p.values.map((v: string) => `- ${v}`).join('\n')}\n\n`;
    if (p.resilience_pattern) reportText += `RESILIENCE PATTERN:\n${p.resilience_pattern}\n\n`;
    if (p.social_style) reportText += `SOCIAL STYLE:\n${p.social_style}\n\n`;
    if (p.self_image) reportText += `SELF IMAGE:\n${p.self_image}\n\n`;
    if (p.energy_sources?.length) reportText += `ENERGY SOURCES:\n${p.energy_sources.map((e: string) => `- ${e}`).join('\n')}\n\n`;
    if (p.cognitive_capabilities?.length) reportText += `COGNITIVE CAPABILITIES:\n${p.cognitive_capabilities.map((c: string) => `- ${c}`).join('\n')}\n\n`;
    if (p.curiosity_and_enthusiasm?.length) reportText += `CURIOSITY & ENTHUSIASM:\n${p.curiosity_and_enthusiasm.map((c: string) => `- ${c}`).join('\n')}\n\n`;
    if (p.habits_and_routines?.length) reportText += `HABITS & ROUTINES:\n${p.habits_and_routines.map((h: string) => `- ${h}`).join('\n')}\n\n`;
    if (p.free_time_preferences?.length) reportText += `FREE TIME PREFERENCES:\n${p.free_time_preferences.map((f: string) => `- ${f}`).join('\n')}\n\n`;
    if (p.lifestyle_and_environment?.length) reportText += `LIFESTYLE & ENVIRONMENT:\n${p.lifestyle_and_environment.map((l: string) => `- ${l}`).join('\n')}\n\n`;
    
    if (p.mental_graph_edges?.length) {
      reportText += `MENTAL GRAPH EDGES (MINI GRAPHRAG):\n`;
      reportText += p.mental_graph_edges.map((e: any) => `[${e.source}] --(${e.relation})--> [${e.target}]`).join('\n') + '\n\n';
    }

    const blob = new Blob([reportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `total_brain_persona_${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const coverage = profile?.persona?.coverage_matrix;
  const overallCoverage = coverage?.overall_score || 0;

  return (
    <>
      <div className="w-full bg-[#f8f9fa] rounded-2xl p-6 border border-black/5 shadow-sm">
      
      {/* Header section */}
      <div className="flex justify-between items-start mb-4">
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

      {/* Brain Map Coverage Progress Card */}
      <div className="mb-5 p-3.5 rounded-xl bg-gradient-to-br from-amber-500/10 to-orange-500/5 border border-amber-200/60">
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-xs font-semibold text-amber-900">Brain Mapping Progress</span>
          <span className="text-xs font-bold text-amber-700">{overallCoverage}%</span>
        </div>
        <div className="w-full h-2 bg-amber-100/80 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${Math.max(5, overallCoverage)}%` }}
          />
        </div>
      </div>

      {/* Document Links */}
      <div className="flex flex-col gap-3">
        
        {/* Structured Report */}
        <button 
          onClick={() => setIsModalOpen(true)}
          className="w-full flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-sm transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 group-hover:bg-indigo-100 transition-colors">
              <FileText size={16} />
            </div>
            <div className="flex flex-col items-start">
              <span className="text-sm font-semibold text-slate-800">View structured report</span>
              <span className="text-[10px] text-slate-500 font-medium">Detailed session summary</span>
            </div>
          </div>
          <BookOpen size={14} className="text-slate-400 group-hover:text-indigo-500 transition-colors" />
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
              <span className="text-sm font-semibold text-slate-800">Download Persona</span>
              <span className="text-[10px] text-slate-500 font-medium">JSON format export</span>
            </div>
          </div>
          <Download size={14} className="text-slate-400 group-hover:text-amber-500 transition-colors" />
        </button>

        {/* Download Transcript */}
        <button 
          onClick={handleDownloadTranscript}
          className="w-full flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200 hover:border-purple-300 hover:shadow-sm transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-50 text-purple-600 group-hover:bg-purple-100 transition-colors">
              <MessageSquare size={16} />
            </div>
            <div className="flex flex-col items-start">
              <span className="text-sm font-semibold text-slate-800">Download Transcript</span>
              <span className="text-[10px] text-slate-500 font-medium">Text file export</span>
            </div>
          </div>
          <Download size={14} className="text-slate-400 group-hover:text-purple-500 transition-colors" />
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
      
      <StructuredReportModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
};
