import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import type { ChatModel, Message, ChatState } from '../types/chat';

interface ChatStore extends ChatState {
  sendMessage: (text: string) => Promise<void>;
  clearMessages: () => void;
  setCurrentModel: (modelId: string) => void;
  getCurrentModel: () => ChatModel | undefined;
  addModel: (name: string, webhook: string, avatar: string) => void;
  deleteModel: (modelId: string) => void;
  updateModelAvatar: (modelId: string, avatar: string) => void;
  setAttachedFiles: (files: File[]) => void;
  clearAttachedFiles: () => void;
}

// Default models for the chat interface
const defaultModels: ChatModel[] = [
  {
    id: '1',
    name: 'ChatGPT',
    webhook: 'https://api.example.com/chatgpt',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=gpt&backgroundColor=ffb144',
    description: 'OpenAI GPT model'
  },
  {
    id: '2',
    name: 'Claude',
    webhook: 'https://api.example.com/claude',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=claude&backgroundColor=5436da',
    description: 'Anthropic Claude model'
  }
];

const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
      messages: [],
      models: defaultModels,
      currentModelId: defaultModels[0].id,
      isLoading: false,
      attachedFiles: [],
      
      sendMessage: async (text: string) => {
        const { attachedFiles } = get();
        
        if (!text.trim() && !attachedFiles.length) return;
        
        // Create new user message
        const userMessage: Message = {
          id: uuidv4(),
          text,
          sender: 'user',
          timestamp: new Date(),
          mediaUrls: attachedFiles.length > 0 
            ? attachedFiles.map(file => URL.createObjectURL(file)) 
            : undefined
        };
        
        // Add user message and set loading state
        set(state => ({
          messages: [...state.messages, userMessage],
          attachedFiles: [],
          isLoading: true
        }));
        
        try {
          // In a real app, this would call the AI service API
          await new Promise(resolve => setTimeout(resolve, 1500));
          
          
          const botMessage: Message = {
            id: uuidv4(),
            text: `This is a simulated response to: "${text}"`,
            sender: 'bot',
            timestamp: new Date()
          };
          
          // Add bot response and clear loading state
          set(state => ({
            messages: [...state.messages, botMessage],
            isLoading: false
          }));
          
        } catch (error) {
          console.error('Failed to send message:', error);
          set({ isLoading: false });
        }
      },
      
      clearMessages: () => set({ messages: [] }),
      
      setCurrentModel: (modelId: string) => set({ currentModelId: modelId }),
      
      getCurrentModel: () => {
        const { models, currentModelId } = get();
        return models.find(m => m.id === currentModelId);
      },
      
      addModel: (name: string, webhook: string, avatar: string) => {
        if (!name.trim() || !webhook.trim()) return;
        
        const newModel: ChatModel = {
          id: uuidv4(),
          name,
          webhook,
          avatar: avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${name}`,
          description: `Custom model: ${name}`
        };
        
        set(state => ({
          models: [...state.models, newModel]
        }));
      },
      
      deleteModel: (modelId: string) => {
        set(state => {
          // Don't delete if it's the last model
          if (state.models.length <= 1) return state;
          
          const updatedModels = state.models.filter(model => model.id !== modelId);
          
          // If deleting current model, switch to the first available model
          const needToSwitchModel = state.currentModelId === modelId;
          
          return {
            models: updatedModels,
            currentModelId: needToSwitchModel ? updatedModels[0].id : state.currentModelId
          };
        });
      },
      
      updateModelAvatar: (modelId: string, avatar: string) => {
        set(state => ({
          models: state.models.map(model => 
            model.id === modelId 
              ? { ...model, avatar } 
              : model
          )
        }));
      },
      
      setAttachedFiles: (files: File[]) => set({ attachedFiles: files }),
      
      clearAttachedFiles: () => set({ attachedFiles: [] })
    }),
    {
      name: 'chat-storage',
      partialize: (state) => ({
        messages: state.messages,
        models: state.models,
        currentModelId: state.currentModelId
      })
    }
  )
);

export default useChatStore;
