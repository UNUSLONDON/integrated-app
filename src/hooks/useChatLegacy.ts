/**
 * This hook provides backward compatibility between the old useChat hook
 * and the new Zustand chat store. It's useful during migration to avoid
 * breaking existing components.
 * 
 * @deprecated Use useStore.chat() directly instead
 */

import useStore from '../store';

export const useChat = () => {
  return useStore.chat();
};

export default useChat;
