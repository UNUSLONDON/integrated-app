import React, { useState } from 'react';
import type { User } from '../../types/auth';
import useStore from '../../store';
import { ChatHeader } from './ChatHeader';
import { ModelSelector } from './ModelSelector';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { SettingsModal } from './SettingsModal';

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
    <div className="h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col">
      <ChatHeader
        user={user}
        onSettingsClick={() => setIsSettingsOpen(true)}
      />

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
