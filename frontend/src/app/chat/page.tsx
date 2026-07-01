'use client';

import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import AnimatedBackground from '@/components/ui/AnimatedBackground';
import AgentAvatar from '@/components/agent/AgentAvatar';
import ChatContainer from '@/components/chat/ChatContainer';
import PersonaVisualization from '@/components/visualization/PersonaVisualization';
import { useChatStore } from '@/lib/store/chatStore';
import { PHASES } from '@/types';
import { Sparkles, LayoutDashboard, MessageSquare, Wrench, Map as MapIcon, Settings, RefreshCw } from 'lucide-react';
import Sidebar3DAvatar from '@/components/agent/Sidebar3DAvatar';
import CareerRoadmap from '@/components/visualization/CareerRoadmap';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

export default function ChatPage() {
  const { currentPhase, showVisualization, agentState } = useChatStore();
  const phaseConfig = PHASES.find((p) => p.id === currentPhase) ?? PHASES[0];

  return (
    <>
      <AnimatedBackground />

      {/* Persona modal */}
      <AnimatePresence>
        {showVisualization && <PersonaVisualization />}
      </AnimatePresence>

      <div className="min-h-screen flex overflow-hidden bg-background" style={{ height: '100dvh' }}>
        {/* ── Left Sidebar (Column 1) ── */}
        <aside className="hidden lg:flex flex-col w-64 flex-shrink-0 bg-white border-r border-black/5 p-6 z-10 shadow-sm relative">
          <div className="flex items-center justify-between mb-8">
            <Link href="/" className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br from-[var(--color-secondary)] to-[#818CF8]">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-[16px] text-[var(--color-text)]">Baagupadu</span>
            </Link>
            <ThemeToggle />
          </div>

          <div className="flex-1 overflow-y-auto scrollbar-hide flex flex-col items-center">
            {/* Agent Sidebar visual */}
            <div className="w-full relative mb-4">
               <Sidebar3DAvatar agentState={agentState} />
            </div>
            
            <div className="text-center mb-8">
              <h2 className="text-[var(--color-text)] font-semibold text-lg flex items-center justify-center gap-2">
                Sahayam
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              </h2>
              <p className="text-[var(--color-text-muted)] text-sm">Career Guide</p>
            </div>

            {/* Navigation Menu */}
            <nav className="w-full space-y-1">
              {[
                { icon: <LayoutDashboard size={18} />, label: 'Dashboard', active: false },
                { icon: <MessageSquare size={18} />, label: 'Chat', active: true },
                { icon: <Wrench size={18} />, label: 'Skills', active: false },
                { icon: <MapIcon size={18} />, label: 'Roadmap', active: false },
                { icon: <Settings size={18} />, label: 'Settings', active: false },
              ].map((item) => (
                <button
                  key={item.label}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all font-medium text-sm ${
                    item.active
                      ? 'bg-[var(--color-secondary)] text-white shadow-md'
                      : 'text-[var(--color-text-muted)] hover:bg-black/5 hover:text-[var(--color-text)]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                  {item.active && (
                    <span className="bg-white/20 text-white text-[10px] uppercase px-2 py-0.5 rounded-full font-bold tracking-wider">
                      Active
                    </span>
                  )}
                </button>
              ))}
            </nav>
            
            <div className="w-full mt-8 pt-6 border-t border-black/5">
              <button
                onClick={() => {
                  if (confirm('Are you sure you want to restart your journey? All chat history will be lost.')) {
                    useChatStore.getState().clearMessages();
                  }
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors font-medium text-sm"
              >
                <RefreshCw size={16} />
                Restart Journey
              </button>
            </div>
          </div>
        </aside>

        {/* ── Middle Column (Chat & Progress) (Column 2) ── */}
        <main className="flex-1 flex flex-col overflow-hidden relative z-0">
          <ChatContainer />
        </main>

        {/* ── Right Column (Roadmap) (Column 3) ── */}
        <aside className="hidden xl:flex flex-col w-[380px] flex-shrink-0 bg-white border-l border-black/5 p-6 overflow-y-auto scrollbar-hide z-10">
          <CareerRoadmap />
        </aside>
      </div>
    </>
  );
}
