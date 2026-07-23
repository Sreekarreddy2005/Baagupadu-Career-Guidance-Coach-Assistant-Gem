'use client';

import { useState, useRef, useEffect, KeyboardEvent, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Mic, MicOff, Send } from 'lucide-react';
import ChatMessage from './ChatMessage';
import TypingIndicator from './TypingIndicator';
import PhaseProgress from './PhaseProgress';
import { useChatStore } from '@/lib/store/chatStore';
import { useUserProfileStore } from '@/stores/userProfileStore';
import { useDemoChat } from '@/hooks/useChat';

// Phase-aware placeholders — change what the textarea hints at based on current phase
const PHASE_PLACEHOLDERS: Record<string, string> = {
  trust:      "Tell me a little about yourself — what's on your mind lately?",
  childhood:  "Tell me about a moment from your childhood that still stays with you…",
  teenage:    "What did you want to be at 16? What was driving you then?",
  adult:      "What have you been building toward in your adult life?",
  synthesis:  "Anything you'd like to add before I put your picture together?",
  guidance:   "What does your ideal version of success look like to you?",
};
const DEFAULT_PLACEHOLDER = "Share whatever's on your mind…";

export default function ChatContainer() {
  const { messages, agentState, currentPhase } = useChatStore();
  const { profile } = useUserProfileStore();
  const { sendMessage } = useDemoChat();
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isTyping   = agentState === 'typing';
  const isThinking = agentState === 'thinking';
  const isBusy     = isTyping || isThinking;
  const hasInput   = input.trim().length > 0;

  // Phase-aware placeholder
  const placeholder = PHASE_PLACEHOLDERS[currentPhase] ?? DEFAULT_PLACEHOLDER;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isBusy]);

  const handleSend = () => {
    if (!hasInput || isBusy) return;
    sendMessage(input.trim());
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      // Fix #14 — return focus to textarea after send
      textareaRef.current.focus();
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 110)}px`;
  };

  return (
    <div className="flex flex-col h-full relative">

      {/* ── Phase progress header ── */}
      <div
        className="px-5 pt-5 pb-4 flex-shrink-0"
        style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}
      >
        <PhaseProgress />
      </div>

      {/* ── Message list — role="log" for screen readers ── */}
      <div
        role="log"
        aria-label="Conversation with Sahayam"
        aria-live="polite"
        className="flex-1 overflow-y-auto px-5 py-8 scrollbar-thin flex flex-col items-center relative"
      >
        <div className="w-full max-w-3xl space-y-6 flex-1 flex flex-col justify-end">
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} />
            ))}
          </AnimatePresence>

          <AnimatePresence>
            {isBusy && (
              <motion.div
                key="typing"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
              >
                <TypingIndicator agentState={agentState} />
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={bottomRef} className="h-6" aria-hidden="true" />
        </div>
      </div>

      {/* ── Input area ── */}
      <div className="flex-shrink-0 p-4 border-t border-black/5 bg-[var(--color-surface)]/30 backdrop-blur-md flex justify-center pb-6">
        <motion.div
          className="relative w-full max-w-3xl flex items-end gap-3 rounded-2xl p-2 bg-white border border-black/10 shadow-sm"
          animate={isFocused ? {
            borderColor: 'var(--color-secondary)',
            boxShadow: '0 0 0 2px rgba(99,102,241,0.15)',
          } : {
            borderColor: 'rgba(0,0,0,0.1)',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          }}
          transition={{ duration: 0.15 }}
        >
          {/* Textarea */}
          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder}
            rows={1}
            aria-label="Message Sahayam"
            aria-multiline="true"
            className="flex-1 bg-transparent text-[var(--color-text)] placeholder-[var(--color-text-muted)]/60 text-sm resize-none focus:outline-none leading-relaxed py-2 px-3 scrollbar-hide"
            style={{ minHeight: '40px', maxHeight: '110px' }}
          />

          {/* Voice button */}
          <button
            onClick={() => setIsRecording((p) => !p)}
            aria-label={isRecording ? 'Stop recording' : 'Start voice input'}
            aria-pressed={isRecording}
            className={`flex-shrink-0 p-2 rounded-lg transition-colors ${
              isRecording
                ? 'text-red-500 bg-red-50'
                : 'text-[var(--color-text-muted)] hover:text-[var(--color-secondary)] hover:bg-[var(--color-secondary)]/5'
            }`}
          >
            {isRecording ? <MicOff className="w-5 h-5" aria-hidden="true" /> : <Mic className="w-5 h-5" aria-hidden="true" />}
          </button>

          {/* Send button — Fix #2: use brand color, not blue-500 */}
          <button
            onClick={handleSend}
            disabled={!hasInput || isBusy}
            aria-label="Send message"
            className="flex-shrink-0 flex items-center gap-2 bg-[var(--color-secondary)] hover:bg-[#5658d6] active:scale-95 text-white font-semibold text-sm px-4 py-2.5 rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-sm shadow-[var(--color-secondary)]/20"
          >
            <Send className="w-4 h-4" aria-hidden="true" />
            <span>Send</span>
          </button>
        </motion.div>

        {/* Hint */}
        <p className="absolute bottom-2 text-center text-[var(--color-text-muted)] opacity-50 text-[11px]">
          Enter to send · Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}
