import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { ChatModel, Message, ChatState } from '../types/chat';

// Default models for the chat interface
const defaultModels: ChatModel[] = [
  {
    id: '1',
    name: 'ChatGPT',
    webhook: 'https://api.example.com/chatgpt',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=gpt&backgroundColor=ffb144'
  },
  {
    id: '2',
    name: 'Claude',
    webhook: 'https://api.example.com/claude',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=claude&backgroundColor=5436da'
  }
];

export const useChat = () => {
  // Get models from localStorage or use defaults
  const getInitialModels = (): ChatModel[] => {
    const savedModels = localStorage.getItem('chatModels');
    return savedModels ? JSON.parse(savedModels) : defaultModels;
  };

  // Get current model ID from localStorage or use the first model
  const getInitialModelId = (): string => {
    const savedModelId = localStorage.getItem('currentModelId');
    const models = getInitialModels();
    return (savedModelId && models.some(m => m.id === savedModelId)) 
      ? savedModelId 
      : models[0].id;
  };

  // Get messages from localStorage or start with empty array
  const getInitialMessages = (): Message[] => {
    const savedMessages = localStorage.getItem('chatMessages');
    if (savedMessages) {
      // Convert string timestamps back to Date objects
      const parsedMessages = JSON.parse(savedMessages);
      return parsedMessages.map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      }));
    }
    return [];
  };

  const [state, setState] = useState<ChatState>({
    messages: getInitialMessages(),
    models: getInitialModels(),
    currentModelId: getInitialModelId(),
    isLoading: false,
    attachedFiles: []
  });

  // Save models to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('chatModels', JSON.stringify(state.models));
  }, [state.models]);

  // Save current model ID to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('currentModelId', state.currentModelId);
  }, [state.currentModelId]);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('chatMessages', JSON.stringify(state.messages));
  }, [state.messages]);

  const getCurrentModel = () => {
    return state.models.find(m => m.id === state.currentModelId);
  };

  const sendMessage = async (text: string) => {
    if (!text.trim() && !state.attachedFiles.length) return;

    // Create new user message
    const userMessage: Message = {
      id: uuidv4(),
      text,
      sender: 'user',
      timestamp: new Date(),
      mediaUrls: state.attachedFiles.length > 0 ? state.attachedFiles.map(file => URL.createObjectURL(file)) : undefined
    };

    // Add user message to the state
    setState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      attachedFiles: [],
      isLoading: true
    }));

    // Simulate bot response after a delay
    setTimeout(() => {
      const botMessage: Message = {
        id: uuidv4(),
        text: `This is a simulated response to: "${text}"`,
        sender: 'bot',
        timestamp: new Date()
      };

      setState(prev => ({
        ...prev,
        messages: [...prev.messages, botMessage],
        isLoading: false
      }));
    }, 1500);
  };

  const addModel = (name: string, webhook: string, avatar: string) => {
    const newModel: ChatModel = {
      id: uuidv4(),
      name,
      webhook,
      avatar: avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${name}`
    };

    setState(prev => ({
      ...prev,
      models: [...prev.models, newModel]
    }));
  };

  const deleteModel = (modelId: string) => {
    setState(prev => {
      // Don't delete if it's the last model
      if (prev.models.length <= 1) return prev;

      const updatedModels = prev.models.filter(model => model.id !== modelId);
      
      // If deleting current model, switch to the first available model
      const needToSwitchModel = prev.currentModelId === modelId;
      
      return {
        ...prev,
        models: updatedModels,
        currentModelId: needToSwitchModel ? updatedModels[0].id : prev.currentModelId
      };
    });
  };

  const setCurrentModel = (modelId: string) => {
    setState(prev => ({
      ...prev,
      currentModelId: modelId
    }));
  };

  const updateModelAvatar = (avatar: string) => {
    setState(prev => ({
      ...prev,
      models: prev.models.map(model => 
        model.id === prev.currentModelId 
          ? { ...model, avatar } 
          : model
      )
    }));
  };

  const setAttachedFiles = (files: File[]) => {
    setState(prev => ({
      ...prev,
      attachedFiles: files
    }));
  };

  return {
    ...state,
    getCurrentModel,
    sendMessage,
    addModel,
    deleteModel,
    setCurrentModel,
    updateModelAvatar,
    setAttachedFiles
  };
};
