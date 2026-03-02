import React, { useRef, useState } from 'react';
import { Send, Mic, Paperclip, Square } from 'lucide-react';
import { FilePreview } from './FilePreview';
import type { InputBarProps } from '@/types';

export const InputBar: React.FC<InputBarProps> = ({
  value,
  onChange,
  onSend,
  onCancel,
  onKeyDown,
  disabled = false,
  isStreaming = false,
  placeholder = 'Ask Jarvis anything...',
  onFileSelect,
  attachments = [],
  onRemoveAttachment,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  const handleSend = () => {
    if ((value.trim() || attachments.length > 0) && !disabled) {
      onSend();
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
    onKeyDown?.(e);
  };

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0 && onFileSelect) {
      onFileSelect(files);
    }
    e.target.value = '';
  };

  const hasContent = value.trim() || attachments.length > 0;

  return (
    <div className="glass-strong border-t border-cyan-500/10">
      {/* File attachments preview */}
      {attachments.length > 0 && onRemoveAttachment && (
        <FilePreview attachments={attachments} onRemove={onRemoveAttachment} />
      )}

      <div className="px-4 py-4">
        <div className="max-w-4xl mx-auto">
          <div
            className={`relative flex items-center gap-3 rounded-2xl border transition-all duration-300 ${
              isFocused
                ? 'border-cyan-400/60 bg-slate-900/80 shadow-[0_0_20px_rgba(34,211,238,0.15)]'
                : 'border-slate-700/50 bg-slate-900/50'
            }`}
          >
            {/* File upload button */}
            <button
              type="button"
              onClick={handleFileClick}
              disabled={disabled}
              className="ml-2 p-2.5 rounded-xl text-slate-400 hover:text-cyan-400 hover:bg-cyan-400/10 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Attach file"
            >
              <Paperclip className="w-5 h-5" />
            </button>

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileChange}
              multiple
              accept=".txt,.md,.json,.js,.ts,.jsx,.tsx,.py,.java,.cpp,.c,.html,.css,.csv,.pdf,.doc,.docx,image/*"
              className="hidden"
            />

            {/* Input field */}
            <input
              ref={inputRef}
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              disabled={disabled}
              placeholder={isStreaming ? 'Jarvis is thinking...' : placeholder}
              className="flex-1 bg-transparent py-3.5 text-sm text-white placeholder:text-slate-500 outline-none disabled:opacity-50"
            />

            {/* Action buttons */}
            <div className="flex items-center gap-1 pr-2">
              {/* Microphone button */}
              <button
                type="button"
                disabled={disabled}
                className="p-2.5 rounded-xl text-slate-400 hover:text-cyan-400 hover:bg-cyan-400/10 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Voice input (coming soon)"
              >
                <Mic className="w-5 h-5" />
              </button>

              {/* Send or Cancel button */}
              {isStreaming ? (
                <button
                  type="button"
                  onClick={onCancel}
                  className="p-2.5 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500/30 hover:scale-105 active:scale-95 transition-all duration-200 animate-pulse"
                  title="Stop generating"
                >
                  <Square className="w-5 h-5 fill-current" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSend}
                  disabled={disabled || !hasContent}
                  className={`p-2.5 rounded-xl transition-all duration-200 ${
                    hasContent && !disabled
                      ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-black hover:shadow-[0_0_15px_rgba(34,211,238,0.4)] hover:scale-105 active:scale-95'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                  title="Send message"
                >
                  <Send className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Focus glow effect */}
            {isFocused && (
              <div className="absolute inset-0 rounded-2xl bg-cyan-400/5 blur-xl -z-10 pointer-events-none" />
            )}
          </div>

          {/* Helper text */}
          <p className="text-[10px] text-slate-500 text-center mt-2">
            {isStreaming 
              ? 'Click the stop button to cancel' 
              : 'Press Enter to send • Shift + Enter for new line • Attach files for analysis'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default InputBar;
