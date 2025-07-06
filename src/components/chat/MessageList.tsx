import React, { useEffect, useRef } from 'react';
import type { Message, ChatModel } from '../../types/chat';
import type { User } from '../../types/auth';

interface MessageListProps {
  messages: Message[];
  user: User;
  currentModel?: ChatModel;
  isLoading: boolean;
}

export const MessageList: React.FC<MessageListProps> = ({
  messages,
  user,
  currentModel,
  isLoading
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const renderMediaElement = (url: string) => {
    const fileType = getFileType(url);
    
    if (fileType === 'image') {
      return (
        <img
          src={url}
          alt="Shared image"
          className="max-w-full max-h-64 rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
          onClick={() => window.open(url, '_blank')}
        />
      );
    } else if (fileType === 'pdf') {
      return (
        <div className="border border-slate-600 rounded-lg overflow-hidden">
          <embed src={url} type="application/pdf" width="100%" height="300px" />
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="block p-2 text-orange-400 hover:text-orange-300 text-sm"
          >
            Download PDF
          </a>
        </div>
      );
    }
    
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-orange-400 hover:text-orange-300 underline"
      >
        Open attachment: {url.split('/').pop()}
      </a>
    );
  };

  const getFileType = (url: string) => {
    const lowerUrl = url.toLowerCase();
    if (lowerUrl.match(/\.(jpeg|jpg|gif|png|webp|svg)(\?.*)?$/)) {
      return 'image';
    } else if (lowerUrl.match(/\.(pdf)(\?.*)?$/)) {
      return 'pdf';
    }
    return 'other';
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-4">
      {messages.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">💬</span>
          </div>
          <h3 className="text-lg font-medium text-slate-300 mb-2">Start a conversation</h3>
          <p className="text-slate-500">Send a message to begin chatting with AI</p>
        </div>
      )}

      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex items-start space-x-3 ${
            message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
          }`}
        >
          <div className="w-8 h-8 rounded-full bg-cover bg-center border-2 border-slate-600 flex-shrink-0"
               style={{
                 backgroundImage: message.sender === 'user' 
                   ? `url(${user.avatar})` 
                   : `url(${currentModel?.avatar})`
               }} />
          
          <div className={`max-w-xs lg:max-w-md xl:max-w-lg ${
            message.sender === 'user' 
              ? 'bg-orange-500 text-white' 
              : 'bg-slate-700 text-slate-100'
          } rounded-2xl px-4 py-3 shadow-lg`}>
            <div className="whitespace-pre-wrap break-words">
              {message.text}
            </div>
            
            {message.mediaUrls && message.mediaUrls.length > 0 && (
              <div className="mt-3 space-y-2">
                {message.mediaUrls.map((url, index) => (
                  <div key={index}>
                    {renderMediaElement(url)}
                  </div>
                ))}
              </div>
            )}
            
            <div className={`text-xs mt-2 ${
              message.sender === 'user' ? 'text-orange-100' : 'text-slate-400'
            }`}>
              {message.timestamp.toLocaleTimeString()}
            </div>
          </div>
        </div>
      ))}

      {isLoading && (
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 rounded-full bg-cover bg-center border-2 border-slate-600"
               style={{ backgroundImage: `url(${currentModel?.avatar})` }} />
          <div className="bg-slate-700 rounded-2xl px-4 py-3">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" />
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
            </div>
          </div>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
};
