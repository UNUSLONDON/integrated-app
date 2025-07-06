import React, { useState, useRef } from 'react';
import { Send, Paperclip, X } from 'lucide-react';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  attachedFiles: File[];
  onFilesChange: (files: File[]) => void;
  placeholder?: string;
  disabled?: boolean;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  attachedFiles,
  onFilesChange,
  placeholder = "Type your message...",
  disabled = false
}) => {
  const [message, setMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() || attachedFiles.length > 0) {
      onSendMessage(message);
      setMessage('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newFiles = [...attachedFiles];
    
    files.forEach(file => {
      if (!newFiles.some(f => f.name === file.name)) {
        newFiles.push(file);
      }
    });
    
    onFilesChange(newFiles);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeFile = (index: number) => {
    const newFiles = attachedFiles.filter((_, i) => i !== index);
    onFilesChange(newFiles);
  };

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  };

  return (
    <div className="border-t border-slate-700 bg-slate-800/50 backdrop-blur-sm p-4">
      {attachedFiles.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-2">
          {attachedFiles.map((file, index) => (
            <div key={index} className="flex items-center space-x-2 bg-slate-700 rounded-lg px-3 py-2">
              <span className="text-sm text-slate-300 truncate max-w-32">{file.name}</span>
              <button
                onClick={() => removeFile(index)}
                className="text-slate-400 hover:text-red-400 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex items-end space-x-3">
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              adjustTextareaHeight();
            }}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            disabled={disabled}
            rows={1}
            className="w-full bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 pr-12 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none max-h-32 transition-all"
          />
          
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-orange-400 transition-colors"
          >
            <Paperclip className="w-5 h-5" />
          </button>
          
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>

        <button
          type="submit"
          disabled={disabled || (!message.trim() && attachedFiles.length === 0)}
          className="bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white p-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-orange-500/25"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
};
