import React, { useEffect, useRef } from 'react';
import { ChatBubble } from './ChatBubble';
import { TypingIndicator } from './TypingIndicator';
import { Bot } from 'lucide-react';
import type { ChatAreaProps } from '@/types';

export const ChatArea: React.FC<ChatAreaProps> = ({
  messages,
  isTyping,
  streamingContent,
  messagesEndRef,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive or streaming content updates
  useEffect(() => {
    const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
      });
    };

    const timeout = setTimeout(scrollToBottom, 100);
    return () => clearTimeout(timeout);
  }, [messages, isTyping, streamingContent, messagesEndRef]);

  // Welcome message when chat is empty
  if (messages.length === 0 && !isTyping) {
    return (
      <div
        ref={containerRef}
        className="flex-1 flex items-center justify-center px-4"
      >
        <div className="text-center">
          {/* Animated logo */}
          <div className="relative mb-6">
            <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center animate-pulse-glow">
              <svg
                viewBox="0 0 24 24"
                className="w-10 h-10 text-black"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <div className="absolute inset-0 animate-spin" style={{ animationDuration: '8s' }}>
              <div className="absolute top-0 left-1/2 w-2 h-2 rounded-full bg-cyan-400 -translate-x-1/2 -translate-y-1" />
            </div>
            <div className="absolute inset-0 animate-spin" style={{ animationDuration: '12s', animationDirection: 'reverse' }}>
              <div className="absolute bottom-0 left-1/2 w-1.5 h-1.5 rounded-full bg-blue-400 -translate-x-1/2 translate-y-1" />
            </div>
          </div>

          <h2 className="text-2xl font-semibold text-white mb-2">
            Welcome to <span className="text-cyan-400">Jarvis</span>
          </h2>
          <p className="text-slate-400 text-sm max-w-sm mx-auto">
            Your personal AI assistant powered by OpenRouter. Ask me anything or upload files for analysis.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {[
              'Explain quantum computing',
              'Help me write an email',
              'Brainstorm project ideas',
            ].map((suggestion, i) => (
              <button
                key={i}
                className="px-4 py-2 rounded-full text-xs bg-slate-800/50 border border-slate-700 text-slate-400 hover:border-cyan-500/30 hover:text-cyan-400 transition-all duration-200"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto custom-scrollbar px-4 py-6"
    >
      <div className="max-w-4xl mx-auto space-y-6">
        {messages.map((message, index) => (
          <ChatBubble
            key={message.id}
            message={message}
            isLatest={index === messages.length - 1 && message.role === 'assistant'}
          />
        ))}
        
        {/* Streaming message */}
        {isTyping && streamingContent && (
          <div className="flex gap-3 animate-fade-in-up">
            <div className="flex-shrink-0 w-9 h-9 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center animate-avatar-pulse">
              <Bot className="w-5 h-5 text-black" />
            </div>
            <div className="flex flex-col items-start max-w-[80%]">
              <div className="relative px-4 py-3 rounded-2xl glass border border-cyan-500/20 text-slate-100 rounded-bl-md">
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{streamingContent}</p>
                <span className="inline-block w-1.5 h-4 ml-0.5 bg-cyan-400 animate-pulse" />
                <div className="absolute inset-0 rounded-2xl bg-cyan-400/5 blur-md -z-10" />
              </div>
            </div>
          </div>
        )}

        {/* Typing indicator (only when no streaming content yet) */}
        <TypingIndicator isVisible={isTyping && !streamingContent} />
        
        {/* Scroll anchor */}
        <div ref={messagesEndRef} className="h-1" />
      </div>
    </div>
  );
};

export default ChatArea;
