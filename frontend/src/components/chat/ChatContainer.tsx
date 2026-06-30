'use client';

import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Mic, MicOff, Paperclip } from 'lucide-react';
import ChatMessage from './ChatMessage';
import TypingIndicator from './TypingIndicator';
import PhaseProgress from './PhaseProgress';
import { useChatStore } from '@/lib/store/chatStore';
import { useDemoChat } from '@/hooks/useChat';

export default function ChatContainer() {
  const { messages, agentState } = useChatStore();
  const { sendMessage } = useDemoChat();
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isTyping = agentState === 'typing' || agentState === 'thinking';
  const hasInput = input.trim().length > 0;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!hasInput || isTyping) return;
    sendMessage(input.trim());
    setInput('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
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
    <div className="flex flex-col h-full">

      {/* ── Phase progress header ── */}
      <div
        className="px-5 pt-5 pb-4 flex-shrink-0"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
      >
        <PhaseProgress />
      </div>

      {/* ── Message list ── */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3 scrollbar-thin">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))}
        </AnimatePresence>

        <AnimatePresence>
          {isTyping && (
            <motion.div
              key="typing"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              <TypingIndicator />
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={bottomRef} className="h-2" />
      </div>

      {/* ── Input area ── */}
      <div className="flex-shrink-0 p-4 border-t border-black/5">
        <motion.div
          className="relative flex items-end gap-2.5 rounded-2xl p-2 transition-all duration-300 bg-white border border-black/10 shadow-sm"
          animate={isFocused ? {
            borderColor: 'var(--color-secondary)',
            boxShadow: '0 0 0 2px rgba(99,102,241,0.2)',
          } : {}}
        >
          {/* Textarea */}
          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Type your message..."
            rows={1}
            className="flex-1 bg-transparent text-[var(--color-text)] placeholder-[var(--color-text-muted)] text-sm resize-none focus:outline-none leading-relaxed py-2 px-3 scrollbar-hide"
            style={{ minHeight: '40px', maxHeight: '110px' }}
          />

          {/* Paperclip */}
          <button className="flex-shrink-0 p-2 text-[var(--color-text-muted)] hover:text-[var(--color-secondary)] transition-colors">
            <Paperclip className="w-5 h-5" />
          </button>

          {/* Voice button */}
          <button
            onClick={() => setIsRecording((p) => !p)}
            className={`flex-shrink-0 p-2 transition-colors ${
              isRecording ? 'text-red-500' : 'text-[var(--color-text-muted)] hover:text-[var(--color-secondary)]'
            }`}
          >
            {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          {/* Send button */}
          <button
            onClick={handleSend}
            disabled={!hasInput || isTyping}
            className="flex-shrink-0 bg-blue-500 hover:bg-blue-600 text-white font-medium text-sm px-5 py-2.5 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-blue-500/20"
          >
            Send
          </button>
        </motion.div>

        {/* Hint */}
        <p className="text-center text-[var(--color-text-muted)] opacity-60 text-[11px] mt-2">
          Enter to send · Shift+Enter for newline
        </p>
      </div>
    </div>
  );
}
