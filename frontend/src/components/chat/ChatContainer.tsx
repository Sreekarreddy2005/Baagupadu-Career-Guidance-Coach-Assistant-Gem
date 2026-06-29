'use client';

import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Send, Mic, MicOff } from 'lucide-react';
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
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isTyping = agentState === 'typing' || agentState === 'thinking';

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!input.trim() || isTyping) return;
    sendMessage(input.trim());
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
  };

  return (
    <div className="flex flex-col h-full">
      {/* Phase progress header */}
      <div className="px-4 pt-4 pb-3 border-b border-white/5 flex-shrink-0">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider">
            Your Journey
          </h3>
        </div>
        <PhaseProgress />
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scrollbar-thin scrollbar-thumb-white/10">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))}
        </AnimatePresence>

        {isTyping && (
          <motion.div
            key="typing"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <TypingIndicator />
          </motion.div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input area */}
      <div className="flex-shrink-0 p-4 border-t border-white/5">
        <div className="relative flex items-end gap-3">
          {/* Textarea */}
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={handleTextareaChange}
              onKeyDown={handleKeyDown}
              placeholder="Share your thoughts with Sahayam..."
              rows={1}
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3.5 text-white placeholder-white/25 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/40 transition-all duration-200 scrollbar-hide leading-relaxed"
              style={{ minHeight: '52px', maxHeight: '120px' }}
            />
          </div>

          {/* Voice button */}
          <button
            onClick={() => setIsRecording((p) => !p)}
            aria-label="Toggle voice input"
            className={`flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-200 ${
              isRecording
                ? 'bg-rose-500 shadow-lg shadow-rose-500/40'
                : 'bg-white/5 border border-white/10 hover:bg-white/10'
            }`}
          >
            {isRecording ? (
              <MicOff className="w-5 h-5 text-white" />
            ) : (
              <Mic className="w-5 h-5 text-white/60" />
            )}
          </button>

          {/* Send button */}
          <motion.button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            aria-label="Send message"
            whileTap={{ scale: 0.93 }}
            className="flex-shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
          >
            <Send className="w-5 h-5 text-white" />
          </motion.button>
        </div>
        <p className="text-white/20 text-xs mt-2 text-center">
          Press Enter to send · Shift+Enter for newline
        </p>
      </div>
    </div>
  );
}
