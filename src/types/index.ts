export interface FileAttachment {
  id: string;
  name: string;
  type: string;
  size: number;
  content?: string;
  dataUrl?: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  attachments?: FileAttachment[];
}

export interface ChatState {
  messages: Message[];
  isTyping: boolean;
  inputValue: string;
}

export interface TypingIndicatorProps {
  isVisible: boolean;
}

export interface ChatBubbleProps {
  message: Message;
  isLatest?: boolean;
}

export interface HeaderProps {
  title?: string;
  subtitle?: string;
  isOnline?: boolean;
}

export interface InputBarProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  onCancel?: () => void;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  disabled?: boolean;
  isStreaming?: boolean;
  placeholder?: string;
  onFileSelect?: (files: FileList) => void;
  attachments?: FileAttachment[];
  onRemoveAttachment?: (id: string) => void;
}

export interface ChatAreaProps {
  messages: Message[];
  isTyping: boolean;
  streamingContent?: string;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
}

export interface FilePreviewProps {
  attachments: FileAttachment[];
  onRemove: (id: string) => void;
}
