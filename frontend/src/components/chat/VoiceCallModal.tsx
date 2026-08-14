'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Activity,
  AudioLines,
  Captions,
  CaptionsOff,
  ChevronDown,
  Cpu,
  Mic,
  MicOff,
  PhoneOff,
  Radio,
  ShieldCheck,
  Sparkles,
  Volume2,
  VolumeX,
  Waves,
} from 'lucide-react';
import { useVoiceAgent } from '@/hooks/useVoiceAgent';
import { useChatStore } from '@/lib/store/chatStore';

interface VoiceCallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const STATE_COPY = {
  idle: { label: 'READY', detail: 'Waiting for your next thought', color: 'text-slate-300', glow: 'rgba(100, 116, 139, 0.3)' },
  listening: { label: 'LISTENING', detail: 'Sahayam is hearing you', color: 'text-cyan-300', glow: 'rgba(34, 211, 238, 0.55)' },
  thinking: { label: 'THINKING', detail: 'Connecting the important signals', color: 'text-violet-300', glow: 'rgba(139, 92, 246, 0.55)' },
  speaking: { label: 'SPEAKING', detail: 'Sahayam is responding', color: 'text-emerald-300', glow: 'rgba(52, 211, 153, 0.55)' },
} as const;

export default function VoiceCallModal({ isOpen, onClose }: VoiceCallModalProps) {
  const {
    voiceState,
    micVolume,
    isMicMuted,
    isSpeakerMuted,
    interimTranscript,
    hasPermission,
    toggleMicMute,
    toggleSpeakerMute,
  } = useVoiceAgent(isOpen);
  const { messages, agentState, currentPhase } = useChatStore();
  const [showCaptions, setShowCaptions] = useState(true);
  const transcriptEndRef = useRef<HTMLDivElement>(null);
  const status = STATE_COPY[voiceState];
  const recentMessages = messages.slice(-16);
  const latestUserMessage = [...messages].reverse().find((message) => message.sender === 'user');

  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, interimTranscript]);

  if (!isOpen) return null;

  const activity = voiceState === 'listening'
    ? 'Voice channel is open'
    : voiceState === 'thinking'
      ? 'Analysing your response'
      : voiceState === 'speaking'
        ? 'Delivering Sahayam response'
        : agentState === 'typing'
          ? 'Preparing a response'
          : 'Session standing by';

  return (
    <AnimatePresence>
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        aria-label="Sahayam live voice session"
        className="fixed inset-0 z-[100] overflow-hidden bg-[#030711] text-white"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_46%,rgba(14,116,144,0.2),transparent_24%),radial-gradient(circle_at_18%_82%,rgba(79,70,229,0.16),transparent_28%),linear-gradient(145deg,#02050c_5%,#071324_50%,#02050c_100%)]" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.14] [background-image:linear-gradient(rgba(103,232,249,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(103,232,249,0.2)_1px,transparent_1px)] [background-size:44px_44px]" />

        <div className="relative flex h-full flex-col">
          <header className="flex h-[76px] shrink-0 items-center justify-between border-b border-cyan-100/10 px-4 sm:px-7">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl border border-cyan-300/30 bg-cyan-300/10 text-cyan-200 shadow-[0_0_24px_rgba(34,211,238,0.2)]">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-200">Sahayam Live</p>
                <p className="text-xs text-slate-400">Your personal career companion</p>
              </div>
            </div>

            <div className="hidden items-center gap-3 md:flex">
              <div className="flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/5 px-3 py-1.5 text-[11px] font-medium text-emerald-200">
                <ShieldCheck className="h-3.5 w-3.5" /> Private session
              </div>
              <div className="flex items-center gap-2 font-mono text-[10px] tracking-wider text-slate-500">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-300" /> VOICE ONLINE
              </div>
            </div>

            <button onClick={onClose} className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-300 transition hover:bg-white/10" aria-label="Exit voice session">
              Exit <ChevronDown className="ml-1 inline h-3.5 w-3.5" />
            </button>
          </header>

          <main className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[minmax(0,1fr)_390px]">
            <div className="relative flex min-h-0 flex-col items-center justify-center overflow-hidden px-5 py-7 sm:px-10">
              <div className="absolute left-6 top-6 hidden text-[10px] font-mono uppercase tracking-[0.2em] text-cyan-200/45 xl:block">Neural presence / {currentPhase}</div>
              <div className="relative grid h-[min(52vw,500px)] w-[min(52vw,500px)] min-h-[260px] min-w-[260px] place-items-center">
                {[1, 0.78, 0.58].map((scale, index) => (
                  <motion.div
                    key={scale}
                    animate={{ rotate: index % 2 === 0 ? 360 : -360, scale: voiceState === 'listening' ? scale + (micVolume / 1000) : scale }}
                    transition={{ rotate: { duration: 24 + index * 10, repeat: Infinity, ease: 'linear' }, scale: { duration: 0.18 } }}
                    className="absolute rounded-full border border-cyan-200/20"
                    style={{ width: `${scale * 100}%`, height: `${scale * 100}%`, borderStyle: index === 1 ? 'dashed' : 'solid' }}
                  />
                ))}
                <motion.div
                  animate={{ scale: voiceState === 'listening' ? 1 + micVolume / 360 : voiceState === 'speaking' ? [1, 1.08, 0.98, 1.04, 1] : [1, 1.025, 1] }}
                  transition={{ duration: voiceState === 'listening' ? 0.15 : 1.8, repeat: voiceState === 'thinking' || voiceState === 'speaking' ? Infinity : 0 }}
                  className="relative grid h-[42%] w-[42%] place-items-center rounded-full border border-cyan-100/50 bg-[radial-gradient(circle_at_35%_30%,#d5fbff_0%,#31c6e8_15%,#126e9b_42%,#071a36_72%)] shadow-[0_0_40px_rgba(103,232,249,0.6),inset_0_0_32px_rgba(255,255,255,0.45)]"
                  style={{ boxShadow: `0 0 65px ${status.glow}, inset 0 0 32px rgba(255,255,255,0.45)` }}
                >
                  <div className="grid h-[74%] w-[74%] place-items-center rounded-full border border-white/30 bg-[#061326]/65 text-center backdrop-blur-md">
                    <Cpu className="mb-1 h-7 w-7 text-cyan-100" />
                    <span className="text-[10px] font-bold tracking-[0.22em] text-white">SAHAYAM</span>
                  </div>
                </motion.div>
              </div>

              <div className="mt-2 text-center">
                <div className={`flex items-center justify-center gap-2 text-xs font-bold tracking-[0.22em] ${status.color}`}><Radio className="h-3.5 w-3.5" /> {status.label}</div>
                <p className="mt-2 text-sm text-slate-400">{status.detail}</p>
              </div>

              <div className="mt-6 min-h-14 max-w-xl text-center">
                {interimTranscript ? (
                  <p className="rounded-2xl border border-cyan-300/25 bg-cyan-300/[0.07] px-5 py-3 text-sm leading-relaxed text-cyan-50">&quot;{interimTranscript}&quot;</p>
                ) : (
                  <p className="text-sm text-slate-500">{isMicMuted ? 'Your microphone is muted.' : voiceState === 'listening' ? 'Speak naturally. Your words appear here as you speak.' : latestUserMessage ? `You said: “${latestUserMessage.text}”` : 'Start speaking when you are ready.'}</p>
                )}
              </div>

              <div className="absolute bottom-5 left-5 right-5 hidden grid-cols-3 gap-3 sm:grid">
                <StatusCard icon={<AudioLines className="h-4 w-4" />} label="Input" value={isMicMuted ? 'Muted' : `${micVolume}% signal`} />
                <StatusCard icon={<Activity className="h-4 w-4" />} label="Activity" value={activity} />
                <StatusCard icon={<Waves className="h-4 w-4" />} label="Output" value={isSpeakerMuted ? 'Muted' : 'Voice enabled'} />
              </div>
            </div>

            <aside className="flex min-h-0 flex-col border-t border-cyan-100/10 bg-[#06101d]/80 lg:border-l lg:border-t-0">
              <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
                <div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-100">Conversation</p><p className="mt-0.5 text-[11px] text-slate-500">Everything said in this session</p></div>
                <button onClick={() => setShowCaptions((visible) => !visible)} className="rounded-lg p-2 text-cyan-200 hover:bg-cyan-300/10" aria-label="Toggle conversation captions" aria-pressed={showCaptions}>
                  {showCaptions ? <Captions className="h-4 w-4" /> : <CaptionsOff className="h-4 w-4" />}
                </button>
              </div>

              <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-5">
                {showCaptions ? recentMessages.map((message) => (
                  <motion.article key={message.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={message.sender === 'user' ? 'ml-8' : 'mr-5'}>
                    <p className={`mb-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] ${message.sender === 'user' ? 'text-cyan-300' : message.sender === 'agent' ? 'text-violet-300' : 'text-rose-300'}`}>{message.sender === 'user' ? 'You' : message.sender === 'agent' ? 'Sahayam' : 'System'}</p>
                    <p className={`rounded-2xl px-3.5 py-3 text-[13px] leading-relaxed ${message.sender === 'user' ? 'rounded-tr-sm bg-cyan-400/15 text-cyan-50' : 'rounded-tl-sm border border-white/8 bg-white/[0.045] text-slate-300'}`}>{message.text}</p>
                  </motion.article>
                )) : <p className="pt-10 text-center text-sm text-slate-500">Captions are hidden.</p>}
                {showCaptions && interimTranscript && <p className="mr-5 rounded-2xl border border-dashed border-cyan-300/25 px-3.5 py-3 text-[13px] italic text-cyan-200/70">You: {interimTranscript}</p>}
                <div ref={transcriptEndRef} />
              </div>

              <div className="border-t border-white/10 px-5 py-3.5">
                <div className="flex items-center gap-2 text-[11px] text-slate-400"><Sparkles className="h-3.5 w-3.5 text-violet-300" /><span>{activity}</span><span className="ml-auto font-mono text-slate-600">{hasPermission === false ? 'MIC BLOCKED' : 'LIVE'}</span></div>
              </div>
            </aside>
          </main>

          <footer className="flex shrink-0 items-center justify-center gap-3 border-t border-cyan-100/10 bg-[#040a13]/90 px-4 py-4 sm:gap-5">
            <ControlButton onClick={toggleMicMute} label={isMicMuted ? 'Unmute mic' : 'Mute mic'} active={!isMicMuted} icon={isMicMuted ? <MicOff /> : <Mic />} />
            <ControlButton onClick={toggleSpeakerMute} label={isSpeakerMuted ? 'Enable voice' : 'Mute voice'} active={!isSpeakerMuted} icon={isSpeakerMuted ? <VolumeX /> : <Volume2 />} />
            <button onClick={onClose} className="flex h-14 items-center gap-2 rounded-full bg-rose-500 px-5 text-sm font-semibold text-white shadow-[0_0_24px_rgba(244,63,94,0.28)] transition hover:bg-rose-400"><PhoneOff className="h-4 w-4" /> End session</button>
          </footer>
        </div>
      </motion.section>
    </AnimatePresence>
  );
}

function StatusCard({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return <div className="flex items-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.025] px-3 py-2"><span className="text-cyan-300">{icon}</span><div className="min-w-0"><p className="text-[9px] uppercase tracking-wider text-slate-600">{label}</p><p className="truncate text-[11px] text-slate-300">{value}</p></div></div>;
}

function ControlButton({ onClick, label, active, icon }: { onClick: () => void; label: string; active: boolean; icon: ReactNode }) {
  return <button onClick={onClick} className={`grid h-14 min-w-14 place-items-center rounded-full border transition sm:flex sm:w-auto sm:gap-2 sm:px-5 ${active ? 'border-cyan-300/30 bg-cyan-300/10 text-cyan-100 hover:bg-cyan-300/20' : 'border-rose-300/30 bg-rose-400/10 text-rose-200 hover:bg-rose-400/20'}`} aria-label={label} title={label}><span className="h-5 w-5">{icon}</span><span className="hidden text-xs font-medium sm:inline">{label}</span></button>;
}
