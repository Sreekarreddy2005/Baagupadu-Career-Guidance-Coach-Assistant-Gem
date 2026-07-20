'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import AnimatedBackground from '@/components/ui/AnimatedBackground';
import AgentAvatar from '@/components/agent/AgentAvatar';
import ChatContainer from '@/components/chat/ChatContainer';
import PersonaVisualization from '@/components/visualization/PersonaVisualization';
import { useChatStore } from '@/lib/store/chatStore';
import { useUserProfileStore } from '@/stores/userProfileStore';
import { PHASES } from '@/types';
import { Sparkles, LayoutDashboard, MessageSquare, Wrench, Map as MapIcon, Settings, RefreshCw, Plus, MoreHorizontal } from 'lucide-react';
import Sidebar3DAvatar from '@/components/agent/Sidebar3DAvatar';
import CareerRoadmap from '@/components/visualization/CareerRoadmap';
import { HealthWidget } from '@/components/chat/HealthWidget';
import { LedgerWidget } from '@/components/chat/LedgerWidget';
import { AccountabilityTracker } from '@/components/chat/AccountabilityTracker';
import { SankalpamWidget } from '@/components/chat/SankalpamWidget';
import { QualitySignalBoard } from '@/components/chat/QualitySignalBoard';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { useAuth, UserButton } from '@clerk/nextjs';
import { resetSahayamChat } from '@/lib/api';
import RollingBanner from '@/components/ui/RollingBanner';
import ProfileEditModal from '@/components/chat/ProfileEditModal';

export default function ChatPage() {
  const { currentPhase, showVisualization, agentState, activeSessionId, setActiveSessionId, clearMessages, setMessages } = useChatStore();
  const { profile, loadProfile, isLoading } = useUserProfileStore();
  const { getToken } = useAuth();
  const router = useRouter();
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  
  const phaseConfig = PHASES.find((p) => p.id === currentPhase) ?? PHASES[0];

  useEffect(() => {
    async function initProfile() {
      const token = await getToken();
      if (token) {
        await loadProfile(token);
      }
    }
    initProfile();
  }, [getToken, loadProfile]);

  useEffect(() => {
    if (!isLoading && profile) {
      if (!profile.life_stage_data?.demographics) {
        router.push('/onboarding');
      }
    }
  }, [profile, isLoading, router]);

  const sessions = useMemo(() => {
    return Object.entries(profile?.conversation_memory?.sessions || {});
  }, [profile?.conversation_memory?.sessions]);

  if (isLoading || (!isLoading && profile && !profile.life_stage_data?.demographics)) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4">
        {/* AI-native loading glow */}
        <div className="relative w-16 h-16 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-t-2 border-[var(--color-secondary)] animate-spin" />
          <div className="w-8 h-8 rounded-full bg-[var(--color-secondary)]/20 animate-pulse" />
          <Sparkles className="absolute text-[var(--color-secondary)] w-5 h-5 animate-pulse" />
        </div>
        <p className="text-[var(--color-text-muted)] font-medium tracking-wide animate-pulse">Waking Sahayam...</p>
      </div>
    );
  }

  const healthMetrics = profile?.session_progress?.health_metrics;

  return (
    <>
      <AnimatedBackground />
      
      <ProfileEditModal 
        isOpen={isProfileModalOpen} 
        onClose={() => setIsProfileModalOpen(false)} 
      />

      {/* Persona modal */}
      <AnimatePresence>
        {showVisualization && <PersonaVisualization />}
      </AnimatePresence>

      <div className="flex flex-col overflow-hidden bg-background" style={{ height: '100dvh' }}>
        <RollingBanner message="Welcome back! Start a new chat to test your offline AI." />
        
        <div className="flex flex-1 overflow-hidden">
          {/* ── Left Sidebar (Column 1) ── */}
        <aside className="hidden lg:flex flex-col w-64 flex-shrink-0 bg-white border-r border-black/5 p-6 z-10 shadow-sm relative">
          <div className="flex items-center justify-between mb-8">
            <Link href="/" className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br from-[var(--color-secondary)] to-[#818CF8]">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-[16px] text-[var(--color-text)]">Baagupadu</span>
            </Link>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <UserButton afterSignOutUrl="/" />
            </div>
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
                { icon: <LayoutDashboard size={18} />, label: 'Dashboard', active: false, action: null },
                { icon: <MessageSquare size={18} />, label: 'Chat', active: true, action: null },
                { icon: <Wrench size={18} />, label: 'Skills', active: false, action: null },
                { icon: <MapIcon size={18} />, label: 'Roadmap', active: false, action: null },
                { icon: <Settings size={18} />, label: 'Settings', active: false, action: () => setIsProfileModalOpen(true) },
              ].map((item) => {
                if (item.action) {
                  return (
                    <button
                      key={item.label}
                      onClick={item.action}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all font-medium text-sm text-[var(--color-text-muted)] hover:bg-black/5 hover:text-[var(--color-text)]`}
                    >
                      <div className="flex items-center gap-3">
                        {item.icon}
                        <span>{item.label}</span>
                      </div>
                    </button>
                  );
                }
                return (
                <Link
                  key={item.label}
                  href={'#'}
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
                </Link>
                );
              })}
            </nav>
            
            {/* Recent Sessions (Real Data) */}
            <div className="w-full mt-6 flex flex-col">
              <div className="flex items-center justify-between px-2 mb-2">
                <span className="text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider">Recent Sessions</span>
              </div>
              
              <button 
                onClick={async () => {
                  if (confirm('Start a new exploration? This will reset your current persona and roadmap.')) {
                    clearMessages();
                    const token = await getToken();
                    if (token) {
                      await resetSahayamChat(token);
                      await loadProfile(token);
                    }
                    const newId = crypto.randomUUID();
                    setActiveSessionId(newId);
                  }
                }}
                className="w-full flex items-center gap-2 px-3 py-2 mb-2 rounded-lg border border-black/10 text-[var(--color-text)] hover:bg-[var(--color-secondary)] hover:text-white hover:border-[var(--color-secondary)] transition-all font-medium text-sm group shadow-sm"
              >
                <Plus size={16} className="text-[var(--color-secondary)] group-hover:text-white transition-colors" />
                New Chat
              </button>

              <div className="space-y-1 overflow-y-auto max-h-[220px] scrollbar-hide pr-1 -mx-2 px-2">
                {sessions.map(([id, session]: [string, any]) => {
                  const isActive = id === activeSessionId;
                  return (
                    <div 
                      key={id}
                      onClick={() => {
                        setActiveSessionId(id);
                        // Convert DB serialized messages back to ChatMessage UI format
                        const loadedMessages = (session.messages || []).map((m: any, idx: number) => ({
                          id: `msg-${id}-${idx}`,
                          sender: m.role,
                          text: m.content,
                          timestamp: m.timestamp ? new Date(m.timestamp).getTime() : Date.now() - (session.messages.length - idx) * 1000,
                          phase: 'exploration'
                        }));
                        if (loadedMessages.length > 0) {
                          setMessages(loadedMessages);
                        } else {
                          clearMessages();
                        }
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer group transition-colors ${
                        isActive 
                          ? 'bg-[var(--color-secondary)]/10 text-[var(--color-secondary)]' 
                          : 'text-[var(--color-text-muted)] hover:bg-black/5 hover:text-[var(--color-text)]'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate pr-2">
                        <MessageSquare size={14} className={`flex-shrink-0 ${isActive ? '' : 'opacity-70 group-hover:opacity-100'}`} />
                        <span className={`text-[13px] truncate ${isActive ? 'font-medium' : ''}`}>
                          {session.title || 'Career Chat'}
                        </span>
                      </div>
                      {!isActive && (
                        <MoreHorizontal size={14} className="opacity-0 group-hover:opacity-100 flex-shrink-0 text-[var(--color-text-muted)] hover:text-[var(--color-text)]" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </aside>

        {/* ── Middle Column (Chat & Progress) (Column 2) ── */}
        <main className="flex-1 flex flex-col overflow-hidden relative z-0">
          <ChatContainer />
        </main>

        {/* ── Right Column (Roadmap & Metrics) (Column 3) ── */}
        <aside className="hidden xl:flex flex-col w-[380px] flex-shrink-0 bg-white border-l border-black/5 p-6 overflow-y-auto scrollbar-hide z-10 space-y-6">
          <CareerRoadmap />
          
          <div className="w-full h-px bg-black/5 my-2"></div>
          
          <SankalpamWidget />
          <QualitySignalBoard />
          <LedgerWidget />
          <AccountabilityTracker />
          <HealthWidget metrics={healthMetrics} />
        </aside>
      </div>
      </div>
    </>
  );
}
