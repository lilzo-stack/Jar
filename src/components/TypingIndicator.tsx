import React from 'react';
import { Bot } from 'lucide-react';
import type { TypingIndicatorProps } from '@/types';

export const TypingIndicator: React.FC<TypingIndicatorProps> = ({
  isVisible,
}) => {
  if (!isVisible) return null;

  return (
    <div className="flex gap-3 animate-fade-in-up">
      {/* Avatar */}
      <div className="flex-shrink-0 w-9 h-9 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center animate-avatar-pulse">
        <Bot className="w-5 h-5 text-black" />
      </div>

      {/* Typing bubble */}
      <div className="glass border border-cyan-500/20 rounded-2xl rounded-bl-md px-4 py-3">
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-slate-400 mr-2">Jarvis is typing</span>
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-typing-dot"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;
