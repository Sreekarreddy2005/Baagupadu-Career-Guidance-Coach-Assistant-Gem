'use client';

import React, { useState } from 'react';
import { Shield, FileText, Download, BookOpen } from 'lucide-react';
import { useUserProfileStore } from '@/stores/userProfileStore';
import { useChatStore } from '@/lib/store/chatStore';
import { StructuredReportModal } from '@/components/visualization/StructuredReportModal';
import { MessageSquare } from 'lucide-react';

export const LedgerWidget: React.FC = () => {
  const { profile } = useUserProfileStore();
  const { currentPhase, messages } = useChatStore();
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

  const handleDownloadPersona = async () => {
    if (!profile?.persona) return;
    
    try {
      const token = await window.Clerk?.session?.getToken();
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const response = await fetch(`${apiUrl}/api/generate-report`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to generate report');
      
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'baagupadu_report.docx';
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading report:', error);
      alert('Sorry, there was an issue generating your report.');
    }
  };

  return (
    <>
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
        <button 
          onClick={() => setIsModalOpen(true)}
          className="w-full flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200 hover:border-blue-300 hover:shadow-sm transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600 group-hover:bg-blue-100 transition-colors">
              <FileText size={16} />
            </div>
            <div className="flex flex-col items-start">
              <span className="text-sm font-semibold text-slate-800">View structured report</span>
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
