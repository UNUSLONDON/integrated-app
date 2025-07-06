import React from 'react';
import { ChevronDown } from 'lucide-react';
import type { ChatModel } from '../../types/chat';

interface ModelSelectorProps {
  models: ChatModel[];
  currentModelId: string;
  onModelChange: (modelId: string) => void;
}

export const ModelSelector: React.FC<ModelSelectorProps> = ({
  models,
  currentModelId,
  onModelChange
}) => {
  const currentModel = models.find(m => m.id === currentModelId);

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <label htmlFor="model-select" className="text-sm font-medium text-slate-300">
            AI Model:
          </label>
          <div className="relative">
            <select
              id="model-select"
              value={currentModelId}
              onChange={(e) => onModelChange(e.target.value)}
              className="appearance-none bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 pr-8 text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              {models.map(model => (
                <option key={model.id} value={model.id}>
                  {model.name}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        </div>
        
        {currentModel && (
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-full bg-cover bg-center border border-slate-600"
                 style={{ backgroundImage: `url(${currentModel.avatar})` }} />
            <span className="text-sm text-slate-400">{currentModel.name}</span>
          </div>
        )}
      </div>
    </div>
  );
};
