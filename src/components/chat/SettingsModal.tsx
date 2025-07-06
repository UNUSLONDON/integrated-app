import React, { useState } from 'react';
import { X, Plus, Trash2, Save } from 'lucide-react';
import useStore from '../../store';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose
}) => {
  const {
    models,
    addModel,
    deleteModel,
    updateModelAvatar,
    getCurrentModel
  } = useStore.chat();
  
  const currentModel = getCurrentModel();
  
  const [newModelName, setNewModelName] = useState('');
  const [newModelWebhook, setNewModelWebhook] = useState('');
  const [newModelAvatar, setNewModelAvatar] = useState('');
  const [avatarUrl, setAvatarUrl] = useState(currentModel?.avatar || '');

  if (!isOpen) return null;

  const handleAddModel = () => {
    if (newModelName.trim() && newModelWebhook.trim()) {
      addModel(newModelName, newModelWebhook, newModelAvatar);
      setNewModelName('');
      setNewModelWebhook('');
      setNewModelAvatar('');
    }
  };

  const handleSaveAvatar = () => {
    if (avatarUrl.trim() && currentModel) {
      updateModelAvatar(currentModel.id, avatarUrl);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <h2 className="text-xl font-bold text-white">Chat Settings</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Bot Avatar Section */}
          <div className="bg-slate-700/30 rounded-xl p-4">
            <h3 className="text-lg font-semibold text-white mb-4">Bot Avatar</h3>
            <div className="space-y-3">
              <input
                type="text"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="Enter bot avatar URL"
                className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <button
                onClick={handleSaveAvatar}
                className="flex items-center space-x-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>Save Avatar</span>
              </button>
            </div>
          </div>

          {/* AI Model Management Section */}
          <div className="bg-slate-700/30 rounded-xl p-4">
            <h3 className="text-lg font-semibold text-white mb-4">AI Model Management</h3>
            
            {/* Existing Models */}
            <div className="space-y-3 mb-4">
              {models.map(model => (
                <div key={model.id} className="flex items-center justify-between bg-slate-600/50 rounded-lg p-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-cover bg-center border border-slate-500"
                         style={{ backgroundImage: `url(${model.avatar})` }} />
                    <div>
                      <div className="text-white font-medium">{model.name}</div>
                      <div className="text-slate-400 text-sm truncate max-w-64">{model.webhook}</div>
                    </div>
                  </div>
                  {models.length > 1 && (
                    <button
                      onClick={() => deleteModel(model.id)}
                      className="text-slate-400 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Add New Model */}
            <div className="space-y-3 border-t border-slate-600 pt-4">
              <input
                type="text"
                value={newModelName}
                onChange={(e) => setNewModelName(e.target.value)}
                placeholder="Model Name"
                className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <input
                type="text"
                value={newModelWebhook}
                onChange={(e) => setNewModelWebhook(e.target.value)}
                placeholder="Webhook URL"
                className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <input
                type="text"
                value={newModelAvatar}
                onChange={(e) => setNewModelAvatar(e.target.value)}
                placeholder="Model Avatar URL (optional)"
                className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <button
                onClick={handleAddModel}
                className="flex items-center space-x-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Model</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
