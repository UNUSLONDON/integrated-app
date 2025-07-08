import React, { useState } from 'react';
import type { User } from '../../types/auth';
import useStore from '../../store';
import { ModelSelector } from './ModelSelector';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { SettingsModal } from './SettingsModal';
import { Settings } from 'lucide-react';

interface ChatInterfaceProps {
  user: User;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ user }) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  // Access chat store
  const {
    messages,
    models,
    currentModelId,
    isLoading,
    attachedFiles,
    sendMessage,
    setCurrentModel,
    setAttachedFiles,
    getCurrentModel
  } = useStore.chat();

  const currentModel = getCurrentModel();

  return (
    <div className="h-full bg-base flex flex-col">
      {/* Chat Header */}
      <div className="bg-surface/50 backdrop-blur-sm border-b border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="inline-flex items-center justify-center w-10 h-10 bg-primary/20 rounded-xl">
              <span className="text-primary text-xl">🤖</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">
                AI Assistant
              </h1>
              <p className="text-sm text-darkText">Powered by {currentModel?.name || 'AI'}</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="p-2 text-darkText hover:text-white hover:bg-gray-700 rounded-lg transition-all"
              title="Settings"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full">
        <div className="p-6 pb-0">
          <ModelSelector
            models={models}
            currentModelId={currentModelId}
            onModelChange={setCurrentModel}
          />
        </div>

        <MessageList
          messages={messages}
          user={user}
          currentModel={currentModel}
          isLoading={isLoading}
        />

        <MessageInput
          onSendMessage={sendMessage}
          attachedFiles={attachedFiles}
          onFilesChange={setAttachedFiles}
          placeholder={`Message ${currentModel?.name || 'AI'}...`}
          disabled={isLoading}
        />
      </div>

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
};