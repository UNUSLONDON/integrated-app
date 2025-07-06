// Message-related types for chat interface
export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  mediaUrls?: string[];
  attachments?: string[];
}

export interface ChatModel {
  id: string;
  name: string;
  webhook: string;
  avatar: string;
  description?: string;
}

export interface ChatState {
  messages: Message[];
  models: ChatModel[];
  currentModelId: string;
  isLoading: boolean;
  attachedFiles: File[];
}

export interface ChatContextType extends ChatState {
  sendMessage: (content: string) => Promise<void>;
  clearMessages: () => void;
  setCurrentModel: (modelId: string) => void;
  getCurrentModel: () => ChatModel | undefined;
  addModel: (name: string, webhook: string, avatar: string) => void;
  deleteModel: (modelId: string) => void;
  updateModelAvatar: (avatar: string) => void;
  setAttachedFiles: (files: File[]) => void;
}
