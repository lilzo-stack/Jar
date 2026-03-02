import React, { useState, useEffect } from 'react';
import { User, Bot, FileText, Image, FileCode, File, Download } from 'lucide-react';
import type { ChatBubbleProps } from '@/types';

const getFileIcon = (type: string) => {
  if (type.startsWith('image/')) return <Image className="w-4 h-4" />;
  if (type.includes('javascript') || type.includes('typescript') || type.includes('json') || type.includes('html') || type.includes('css') || type.includes('python') || type.includes('java') || type.includes('cpp') || type.includes('c')) {
    return <FileCode className="w-4 h-4" />;
  }
  if (type.startsWith('text/') || type.includes('pdf') || type.includes('doc')) {
    return <FileText className="w-4 h-4" />;
  }
  return <File className="w-4 h-4" />;
};

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export const ChatBubble: React.FC<ChatBubbleProps> = ({
  message,
  isLatest = false,
}) => {
  const { role, content, timestamp, attachments } = message;
  const isUser = role === 'user';
  const [displayContent, setDisplayContent] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Typing effect for assistant messages
  useEffect(() => {
    if (!isUser && isLatest) {
      setIsTyping(true);
      let index = 0;
      const text = content;
      
      const typeChar = () => {
        if (index < text.length) {
          setDisplayContent(text.slice(0, index + 1));
          index++;
          // Random typing speed for natural feel
          const delay = 15 + Math.random() * 25;
          setTimeout(typeChar, delay);
        } else {
          setIsTyping(false);
        }
      };

      // Small delay before starting to type
      const startTimeout = setTimeout(typeChar, 300);
      return () => clearTimeout(startTimeout);
    } else {
      setDisplayContent(content);
    }
  }, [content, isUser, isLatest]);

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    }).format(date);
  };

  return (
    <div
      className={`flex gap-3 ${
        isUser ? 'flex-row-reverse' : 'flex-row'
      } animate-fade-in-up`}
    >
      {/* Avatar */}
      <div
        className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center ${
          isUser
            ? 'bg-slate-700'
            : 'bg-gradient-to-br from-cyan-400 to-blue-500 animate-avatar-pulse'
        }`}
      >
        {isUser ? (
          <User className="w-5 h-5 text-slate-300" />
        ) : (
          <Bot className="w-5 h-5 text-black" />
        )}
      </div>

      {/* Message content */}
      <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-[80%]`}>
        {/* File attachments */}
        {attachments && attachments.length > 0 && (
          <div className={`flex flex-wrap gap-2 mb-2 ${isUser ? 'justify-end' : 'justify-start'}`}>
            {attachments.map((file) => (
              <div
                key={file.id}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800/80 border border-slate-700/50 hover:border-cyan-500/30 transition-colors group"
              >
                {file.type.startsWith('image/') && file.dataUrl ? (
                  <div className="relative">
                    <img
                      src={file.dataUrl}
                      alt={file.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded">
                      <Download className="w-4 h-4 text-white" />
                    </div>
                  </div>
                ) : (
                  <>
                    <span className="text-cyan-400">{getFileIcon(file.type)}</span>
                    <div className="flex flex-col">
                      <span className="text-xs text-slate-300 max-w-[150px] truncate">{file.name}</span>
                      <span className="text-[10px] text-slate-500">{formatFileSize(file.size)}</span>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Bubble */}
        <div
          className={`relative px-4 py-3 rounded-2xl ${
            isUser
              ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-br-md'
              : 'glass border border-cyan-500/20 text-slate-100 rounded-bl-md'
          }`}
        >
          <p className="text-sm leading-relaxed whitespace-pre-wrap">
            {displayContent}
            {!isUser && isTyping && (
              <span className="inline-block w-1.5 h-4 ml-0.5 bg-cyan-400 animate-pulse" />
            )}
          </p>
          
          {/* Subtle glow for assistant messages */}
          {!isUser && (
            <div className="absolute inset-0 rounded-2xl bg-cyan-400/5 blur-md -z-10" />
          )}
        </div>

        {/* Timestamp */}
        <span className="text-[10px] text-slate-500 mt-1.5 px-1">
          {formatTime(timestamp)}
        </span>
      </div>
    </div>
  );
};

export default ChatBubble;
