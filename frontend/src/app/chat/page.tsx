'use client';

import { AnimatePresence, motion } from 'framer-motion';
import AnimatedBackground from '@/components/ui/AnimatedBackground';
import AgentAvatar from '@/components/agent/AgentAvatar';
import ChatContainer from '@/components/chat/ChatContainer';
import PersonaVisualization from '@/components/visualization/PersonaVisualization';
import { useChatStore } from '@/lib/store/chatStore';
import { PHASES } from '@/types';
import { Sparkles, Menu } from 'lucide-react';

export default function ChatPage() {
  const { currentPhase, showVisualization } = useChatStore();
  const phaseConfig = PHASES.find((p) => p.id === currentPhase) ?? PHASES[0];

  return (
    <>
      <AnimatedBackground />

      {/* Persona result modal */}
      <AnimatePresence>
        {showVisualization && <PersonaVisualization />}
      </AnimatePresence>

      <div className="min-h-screen flex flex-col">
        {/* Top nav */}
        <header className="flex-shrink-0 flex items-center justify-between px-6 py-4 border-b border-white/5 backdrop-blur-sm bg-black/10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-white font-semibold text-lg tracking-tight">Baagupadu</span>
          </div>
          <div className="flex items-center gap-3">
            <motion.span
              key={phaseConfig.label}
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-white/40 text-sm hidden sm:block"
            >
              {phaseConfig.bgDescription}
            </motion.span>
            <button className="p-2 hover:bg-white/5 rounded-xl transition-colors">
              <Menu className="w-5 h-5 text-white/50" />
            </button>
          </div>
        </header>

        {/* Main layout */}
        <main className="flex-1 flex overflow-hidden">
          {/* Left: Agent panel */}
          <div className="hidden lg:flex flex-col items-center justify-center w-[38%] xl:w-[35%] p-10 border-r border-white/5">
            <div className="w-full max-w-xs">
              <AgentAvatar />
            </div>

            {/* Phase info below agent */}
            <motion.div
              key={currentPhase}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mt-14 text-center"
            >
              <p className="text-white/30 text-xs uppercase tracking-widest mb-1">Current Phase</p>
              <p className="text-white/80 font-semibold text-lg">
                {phaseConfig.label}
              </p>
              <p className="text-white/30 text-sm mt-1">{phaseConfig.bgDescription}</p>
            </motion.div>
          </div>

          {/* Right: Chat panel */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Mobile agent strip */}
            <div className="lg:hidden flex items-center gap-4 px-4 py-3 border-b border-white/5">
              <div className="w-14 h-14 flex-shrink-0">
                <AgentAvatar />
              </div>
              <div>
                <p className="text-white/80 font-semibold text-sm">Sahayam</p>
                <p className="text-white/30 text-xs">{phaseConfig.label}</p>
              </div>
            </div>

            {/* Glass chat panel */}
            <div className="flex-1 m-4 lg:m-6 bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
              <ChatContainer />
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
