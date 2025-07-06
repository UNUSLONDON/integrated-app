import React from 'react';
import { Settings, MessageCircle } from 'lucide-react';
import type { User } from '../../types/auth';

interface ChatHeaderProps {
  user: User;
  onSettingsClick: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ user, onSettingsClick }) => {
  return (
    <header className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="inline-flex items-center justify-center w-10 h-10 bg-orange-500 rounded-xl">
            <MessageCircle className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">
              Chat<span className="text-orange-500">AI</span>
            </h1>
            <p className="text-sm text-slate-400">AI-Powered Conversations</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-cover bg-center border-2 border-slate-600" 
                 style={{ backgroundImage: `url(${user.avatar})` }} />
            <span className="text-slate-300 font-medium">{user.name}</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={onSettingsClick}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-all"
              title="Settings"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
