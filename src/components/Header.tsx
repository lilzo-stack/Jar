import React from 'react';
import { Sparkles } from 'lucide-react';
import type { HeaderProps } from '@/types';

export const Header: React.FC<HeaderProps> = ({
  title = 'Jarvis',
  subtitle = 'AI Assistant',
  isOnline = true,
}) => {
  return (
    <header className="glass-strong sticky top-0 z-50 border-b border-cyan-500/10">
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Left side: Logo and status */}
          <div className="flex items-center gap-4">
            {/* Avatar with glow */}
            <div className="relative">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center animate-avatar-pulse">
                <Sparkles className="w-6 h-6 text-black" />
              </div>
              {/* Online indicator */}
              {isOnline && (
                <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-black rounded-full flex items-center justify-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
                </div>
              )}
            </div>

            {/* Title and subtitle */}
            <div>
              <h1 className="text-xl font-semibold text-white tracking-tight">
                {title}
              </h1>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">{subtitle}</span>
                {isOnline && (
                  <span className="text-xs text-cyan-400 font-medium">
                    Online
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Right side: Decorative elements */}
          <div className="hidden sm:flex items-center gap-2">
            <div className="flex gap-1">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="w-1 h-4 rounded-full bg-cyan-400/30"
                  style={{
                    animation: `pulse-glow 1.5s ease-in-out infinite`,
                    animationDelay: `${i * 0.2}s`,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Subtle gradient line */}
      <div className="h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />
    </header>
  );
};

export default Header;
