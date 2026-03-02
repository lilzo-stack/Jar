import React from 'react';
import { X, FileText, Image, FileCode, File } from 'lucide-react';
import type { FilePreviewProps } from '@/types';

const getFileIcon = (type: string) => {
  if (type.startsWith('image/')) return <Image className="w-4 h-4" />;
  if (type.includes('javascript') || type.includes('typescript') || type.includes('json') || type.includes('html') || type.includes('css') || type.includes('python') || type.includes('java') || type.includes('cpp') || type.includes('c')) {
    return <FileCode className="w-4 h-4" />;
  }
  if (type.startsWith('text/') || type.includes('pdf') || type.includes('doc') || type.includes('sheet')) {
    return <FileText className="w-4 h-4" />;
  }
  return <File className="w-4 h-4" />;
};

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export const FilePreview: React.FC<FilePreviewProps> = ({
  attachments,
  onRemove,
}) => {
  if (attachments.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 px-4 py-2">
      {attachments.map((file) => (
        <div
          key={file.id}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/50 text-xs group hover:border-cyan-500/30 transition-colors"
        >
          <span className="text-cyan-400">{getFileIcon(file.type)}</span>
          <span className="text-slate-300 max-w-[120px] truncate">{file.name}</span>
          <span className="text-slate-500">{formatFileSize(file.size)}</span>
          <button
            onClick={() => onRemove(file.id)}
            className="ml-1 p-0.5 rounded hover:bg-slate-700 text-slate-500 hover:text-red-400 transition-colors"
            title="Remove file"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      ))}
    </div>
  );
};

export default FilePreview;
