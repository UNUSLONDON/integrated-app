import useAuthStore from './authStore';
import useChatStore from './chatStore';
import useAirtableStore from './airtableStore';
import useUIStore from './uiStore';

// Root store that combines all other stores
const useStore = {
  auth: useAuthStore,
  chat: useChatStore,
  airtable: useAirtableStore,
  ui: useUIStore
};

export default useStore;
