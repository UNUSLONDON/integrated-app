import React from 'react';
import { Puzzle, User, Sliders, Settings } from 'lucide-react';
import useStore from '../store';

interface SettingsPageProps {
  type?: 'integrations' | 'account' | 'advanced';
}

const SettingsPage: React.FC<SettingsPageProps> = ({ type = 'integrations' }) => {
  const { config, clearData } = useStore.airtable();
  const { addNotification } = useStore.ui();

  const handleDisconnectAirtable = () => {
    clearData();
    addNotification({
      type: 'success',
      message: 'Airtable disconnected successfully'
    });
  };

  const getPageTitle = () => {
    switch (type) {
      case 'account': return 'Account Settings';
      case 'advanced': return 'Advanced Settings';
      default: return 'Integrations';
    }
  };

  const getPageIcon = () => {
    switch (type) {
      case 'account': return <User className="w-8 h-8 text-primary" />;
      case 'advanced': return <Sliders className="w-8 h-8 text-primary" />;
      default: return <Puzzle className="w-8 h-8 text-primary" />;
    }
  };

  const getPageDescription = () => {
    switch (type) {
      case 'account': return 'Manage your profile, preferences, and account security.';
      case 'advanced': return 'Configure advanced features and system preferences.';
      default: return 'Connect and manage your third-party integrations.';
    }
  };

  const renderIntegrationsContent = () => (
    <div className="space-y-6">
      <div className="bg-surface rounded-lg border border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Available Integrations</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { 
              name: 'Airtable', 
              status: config ? 'connected' : 'available', 
              icon: '📊',
              onAction: config ? handleDisconnectAirtable : () => window.location.href = '/data'
            },
            { name: 'Google Analytics', status: 'available', icon: '📈', onAction: () => {} },
            { name: 'Slack', status: 'available', icon: '💬', onAction: () => {} },
            { name: 'Twitter', status: 'available', icon: '🐦', onAction: () => {} },
            { name: 'LinkedIn', status: 'available', icon: '💼', onAction: () => {} },
            { name: 'WordPress', status: 'available', icon: '📝', onAction: () => {} },
          ].map((integration) => (
            <div key={integration.name} className="bg-base rounded-lg p-4 border border-gray-700">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{integration.icon}</span>
                  <span className="text-white font-medium">{integration.name}</span>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  integration.status === 'connected' 
                    ? 'text-green-400 bg-green-400/20' 
                    : 'text-gray-400 bg-gray-400/20'
                }`}>
                  {integration.status}
                </span>
              </div>
              <button 
                onClick={integration.onAction}
                className={`w-full py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                integration.status === 'connected'
                  ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                  : 'bg-primary/20 text-primary hover:bg-primary/30'
              }`}
              >
                {integration.status === 'connected' ? 'Disconnect' : 'Connect'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderAccountContent = () => (
    <div className="space-y-6">
      <div className="bg-surface rounded-lg border border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Profile Information</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-darkText mb-2">Full Name</label>
            <input
              type="text"
              defaultValue="Demo User"
              className="w-full bg-base border border-gray-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-darkText mb-2">Email</label>
            <input
              type="email"
              defaultValue="demo@chatapp.com"
              className="w-full bg-base border border-gray-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-darkText mb-2">Role</label>
            <select className="w-full bg-base border border-gray-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/50">
              <option>Admin</option>
              <option>Editor</option>
              <option>Author</option>
            </select>
          </div>
        </div>
        <div className="mt-6">
          <button className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg transition-colors">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );

  const renderAdvancedContent = () => (
    <div className="space-y-6">
      <div className="bg-surface rounded-lg border border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">System Preferences</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-white font-medium">Auto-save drafts</h4>
              <p className="text-darkText text-sm">Automatically save your work every 30 seconds</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-white font-medium">Email notifications</h4>
              <p className="text-darkText text-sm">Receive email updates about your content</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-white font-medium">Dark mode</h4>
              <p className="text-darkText text-sm">Use dark theme across the application</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (type) {
      case 'account': return renderAccountContent();
      case 'advanced': return renderAdvancedContent();
      default: return renderIntegrationsContent();
    }
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          {getPageIcon()}
          <h1 className="text-3xl font-bold text-white">{getPageTitle()}</h1>
        </div>
        <p className="text-darkText">{getPageDescription()}</p>
      </div>

      {renderContent()}
    </div>
  );
};

export default SettingsPage;