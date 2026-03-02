import React, { useState, useRef, useCallback } from 'react';
import { OpenRouter } from '@openrouter/sdk';
import { Header } from './components/Header';
import { ChatArea } from './components/ChatArea';
import { InputBar } from './components/InputBar';
import type { Message, FileAttachment } from './types';
import './App.css';

// OpenRouter API Configuration
const openrouter = new OpenRouter({
  apiKey: 'sk-or-v1-00000000000000000000000000000000000000000000000000', // Replace with your actual key
});

// Generate unique ID
const generateId = () => Math.random().toString(36).substring(2, 9);

// Initial welcome message
const getWelcomeMessage = (): Message => ({
  id: generateId(),
  role: 'assistant',
  content: "Hello! I'm Jarvis, your personal AI assistant powered by OpenRouter (Qwen3 Coder). I can read and analyze your files! Upload documents, code, or images and I'll help you with them.",
  timestamp: new Date(),
});

// Read file as text
const readFileAsText = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target?.result as string);
    reader.onerror = (e) => reject(e);
    reader.readAsText(file);
  });
};

// Read file as data URL (for images)
const readFileAsDataURL = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target?.result as string);
    reader.onerror = (e) => reject(e);
    reader.readAsDataURL(file);
  });
};

// Process files for upload
const processFiles = async (files: FileList): Promise<FileAttachment[]> => {
  const attachments: FileAttachment[] = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const attachment: FileAttachment = {
      id: generateId(),
      name: file.name,
      type: file.type,
      size: file.size,
    };

    try {
      if (file.type.startsWith('image/')) {
        attachment.dataUrl = await readFileAsDataURL(file);
      } else if (
        file.type.startsWith('text/') ||
        file.type.includes('json') ||
        file.type.includes('javascript') ||
        file.name.match(/\.(txt|md|json|js|ts|jsx|tsx|py|java|cpp|c|h|html|css|csv|xml|yaml|yml)$/i)
      ) {
        attachment.content = await readFileAsText(file);
      }
    } catch (error) {
      console.error(`Error reading file ${file.name}:`, error);
    }

    attachments.push(attachment);
  }

  return attachments;
};

// Build prompt with file content
const buildPromptWithFiles = (userMessage: string, attachments: FileAttachment[]): string => {
  let prompt = userMessage || 'Please analyze the attached file(s).';

  if (attachments.length > 0) {
    prompt += '\n\n---\n\n';
    prompt += `Attached ${attachments.length} file(s):\n\n`;

    attachments.forEach((file, index) => {
      prompt += `[File ${index + 1}: ${file.name}]\n`;
      
      if (file.content) {
        prompt += '```\n';
        const maxLength = 5000;
        const content = file.content.length > maxLength 
          ? file.content.substring(0, maxLength) + '\n... (truncated)' 
          : file.content;
        prompt += content;
        prompt += '\n```\n\n';
      } else if (file.type.startsWith('image/')) {
        prompt += '[Image file attached for reference]\n\n';
      } else {
        prompt += `[Binary file: ${file.type || 'unknown type'}]\n\n`;
      }
    });
  }

  return prompt;
};

function App() {
  const [messages, setMessages] = useState<Message[]>([getWelcomeMessage()]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [attachments, setAttachments] = useState<FileAttachment[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Add a new message to the chat
  const addMessage = useCallback((role: Message['role'], content: string, messageAttachments?: FileAttachment[]) => {
    const newMessage: Message = {
      id: generateId(),
      role,
      content,
      timestamp: new Date(),
      attachments: messageAttachments,
    };
    setMessages((prev) => [...prev, newMessage]);
    return newMessage;
  }, []);

  // Handle file selection
  const handleFileSelect = useCallback(async (files: FileList) => {
    try {
      const newAttachments = await processFiles(files);
      setAttachments((prev) => [...prev, ...newAttachments]);
    } catch (error) {
      console.error('Error processing files:', error);
      setError('Failed to process files. Please try again.');
    }
  }, []);

  // Remove attachment
  const handleRemoveAttachment = useCallback((id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  }, []);

  // Handle sending a message with streaming
  const handleSend = useCallback(async () => {
    const trimmedInput = inputValue.trim();
    if ((!trimmedInput && attachments.length === 0) || isTyping) return;

    // Clear any previous errors
    setError(null);

    // Add user message with attachments
    const currentAttachments = [...attachments];
    addMessage('user', trimmedInput || `Sent ${attachments.length} file(s)`, currentAttachments);
    
    // Clear input and attachments
    setInputValue('');
    setAttachments([]);

    // Show typing indicator and prepare for streaming
    setIsTyping(true);
    setStreamingContent('');

    // Create abort controller for cancellation
    abortControllerRef.current = new AbortController();

    try {
      // Build prompt with file content
      const fullPrompt = buildPromptWithFiles(trimmedInput, currentAttachments);

      // Format conversation history
      const historyMessages = messages.map((msg) => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
      }));

      // Add the new user message
      historyMessages.push({ role: 'user' as const, content: fullPrompt });

      // Send streaming request to OpenRouter
      const stream = await openrouter.chat.send(
        {
          chatGenerationParams: {
            model: 'qwen/qwen3-coder:free',
            messages: historyMessages,
            stream: true,
            temperature: 0.7,
            maxTokens: 2000,
          },
        },
        {
          signal: abortControllerRef.current.signal,
        }
      );

      let fullResponse = '';

      // Process streaming chunks
      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content;
        if (content) {
          fullResponse += content;
          setStreamingContent(fullResponse);
        }
      }

      // Add the complete AI message
      addMessage('assistant', fullResponse);
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        console.log('Request was aborted');
        if (streamingContent) {
          addMessage('assistant', streamingContent + '\n\n[Response interrupted]');
        }
      } else {
        console.error('OpenRouter API Error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        setError(errorMessage);
        addMessage(
          'assistant',
          `I apologize, but I encountered an error: ${errorMessage}. Please try again.`
        );
      }
    } finally {
      setIsTyping(false);
      setStreamingContent('');
      abortControllerRef.current = null;
    }
  }, [inputValue, attachments, isTyping, messages, streamingContent, addMessage]);

  // Handle canceling the stream
  const handleCancel = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  // Handle input keydown
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.shiftKey) {
      e.preventDefault();
      setInputValue((prev) => prev + '\n');
    }
  }, []);

  return (
    <div className="flex flex-col h-screen bg-black overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] animate-pulse" />
        <div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-[100px] animate-pulse"
          style={{ animationDelay: '1s' }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-400/5 rounded-full blur-[150px]" />

        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(34, 211, 238, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(34, 211, 238, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      {/* Header */}
      <Header title="Jarvis" subtitle="AI Assistant (Qwen3 Coder)" isOnline={true} />

      {/* Error banner */}
      {error && (
        <div className="bg-red-500/20 border-b border-red-500/30 px-4 py-2 text-center">
          <p className="text-xs text-red-400">Error: {error}</p>
        </div>
      )}

      {/* Chat area */}
      <div className="flex-1 relative">
        <ChatArea
          messages={messages}
          isTyping={isTyping}
          streamingContent={streamingContent}
          messagesEndRef={messagesEndRef}
        />
      </div>

      {/* Input bar */}
      <InputBar
        value={inputValue}
        onChange={setInputValue}
        onSend={handleSend}
        onCancel={handleCancel}
        onKeyDown={handleKeyDown}
        disabled={isTyping}
        isStreaming={isTyping}
        placeholder="Ask Jarvis anything or attach files..."
        onFileSelect={handleFileSelect}
        attachments={attachments}
        onRemoveAttachment={handleRemoveAttachment}
      />
    </div>
  );
}

export default App;
