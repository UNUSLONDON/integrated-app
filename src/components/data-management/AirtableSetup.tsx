import React, { useState } from 'react';
import { Key, Database, ExternalLink, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import type { AirtableConfig } from '../../types/airtable';
import useStore from '../../store';

interface AirtableSetupProps {
  onConfigSave: (config: AirtableConfig) => void;
}

export const AirtableSetup: React.FC<AirtableSetupProps> = ({ onConfigSave }) => {
  const { isLoading } = useStore.airtable();
  // Pre-fill with the provided credentials
  const [accessToken, setAccessToken] = useState('patN81ENGC9FHRiYa.8a973bd90a28ab5323678542d6a5ff5971c9545167894c215a693c8ab6df2fe1');
  const [baseInput, setBaseInput] = useState('https://airtable.com/appSEkiPjdf1a4xNw/tblEklH6GWRsDgmnT');
  const [showInstructions, setShowInstructions] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const extractBaseId = (input: string): string => {
    // If it's already a base ID (starts with 'app')
    if (input.startsWith('app')) {
      return input;
    }
    
    // If it's a URL, extract the base ID
    const urlMatch = input.match(/airtable\.com\/([^\/]+)/);
    if (urlMatch) {
      return urlMatch[1];
    }
    
    return input;
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    
    if (!accessToken.trim()) {
      newErrors.accessToken = 'Personal access token is required';
    }
    
    if (!baseInput.trim()) {
      newErrors.baseInput = 'Base ID or URL is required';
    } else {
      const baseId = extractBaseId(baseInput);
      if (!baseId.startsWith('app')) {
        newErrors.baseInput = 'Invalid base ID or URL';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    const config: AirtableConfig = {
      accessToken: accessToken.trim(),
      baseId: extractBaseId(baseInput),
    };
    
    onConfigSave(config);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-[#1E2A3A] rounded-lg border border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-lg font-semibold mb-2">Airtable Setup</h4>
              <p className="text-[#94A3B8] text-sm">Connect your Airtable account to start managing your data</p>
            </div>
            <button
              onClick={() => setShowInstructions(!showInstructions)}
              className="text-[#3B82F6] hover:text-[#3B82F6]/80 text-sm flex items-center transition-colors"
            >
              <ExternalLink className="w-4 h-4 mr-1" />
              Setup Instructions
            </button>
          </div>
        </div>

        {showInstructions && (
          <div className="p-6 bg-[#121A24] border-b border-gray-700">
            <h5 className="font-semibold mb-3 text-[#FF6B2B]">How to get your Airtable Personal Access Token:</h5>
            <ol className="list-decimal list-inside space-y-2 text-sm text-[#94A3B8]">
              <li>Go to <a href="https://airtable.com/create/tokens" target="_blank" rel="noopener noreferrer" className="text-[#3B82F6] hover:underline">airtable.com/create/tokens</a></li>
              <li>Click "Create token"</li>
              <li>Give your token a name (e.g., "My App Integration")</li>
              <li>Add the following scopes: <code className="bg-[#1E2A3A] px-2 py-1 rounded text-xs">data.records:read</code>, <code className="bg-[#1E2A3A] px-2 py-1 rounded text-xs">data.records:write</code>, <code className="bg-[#1E2A3A] px-2 py-1 rounded text-xs">schema.bases:read</code></li>
              <li>Select the bases you want to access</li>
              <li>Click "Create token" and copy the generated token</li>
            </ol>
            <div className="mt-4 p-3 bg-yellow-900/30 border border-yellow-700 rounded-lg">
              <div className="flex items-center">
                <AlertCircle className="w-4 h-4 text-yellow-400 mr-2" />
                <span className="text-yellow-400 text-sm font-medium">Important:</span>
              </div>
              <p className="text-yellow-400 text-sm mt-1">Keep your token secure and never share it publicly. This token gives access to your Airtable data.</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label htmlFor="accessToken" className="block text-sm font-medium mb-2">
              Personal Access Token *
            </label>
            <div className="relative">
              <Key className="absolute left-3 top-3 w-5 h-5 text-[#94A3B8]" />
              <input
                type="password"
                id="accessToken"
                value={accessToken}
                onChange={(e) => setAccessToken(e.target.value)}
                placeholder="pat..."
                className={`w-full bg-[#121A24] border rounded-lg py-2.5 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-[#FF6B2B]/50 transition-colors ${
                  errors.accessToken ? 'border-red-500' : 'border-gray-700'
                }`}
              />
            </div>
            {errors.accessToken && (
              <p className="mt-1 text-sm text-red-400">{errors.accessToken}</p>
            )}
          </div>

          <div>
            <label htmlFor="baseInput" className="block text-sm font-medium mb-2">
              Base ID or URL *
            </label>
            <div className="relative">
              <Database className="absolute left-3 top-3 w-5 h-5 text-[#94A3B8]" />
              <input
                type="text"
                id="baseInput"
                value={baseInput}
                onChange={(e) => setBaseInput(e.target.value)}
                placeholder="appXXXXXXXXXXXXXX or https://airtable.com/appXXXXXXXXXXXXXX"
                className={`w-full bg-[#121A24] border rounded-lg py-2.5 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-[#FF6B2B]/50 transition-colors ${
                  errors.baseInput ? 'border-red-500' : 'border-gray-700'
                }`}
              />
            </div>
            {errors.baseInput && (
              <p className="mt-1 text-sm text-red-400">{errors.baseInput}</p>
            )}
            <p className="mt-1 text-sm text-[#94A3B8]">
              Enter your Airtable base ID or the full URL of your base
            </p>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className="bg-[#FF6B2B] hover:bg-[#FF6B2B]/90 text-white px-6 py-2.5 rounded-lg flex items-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Connect to Airtable
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
