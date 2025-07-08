import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type NotificationType = 'success' | 'error' | 'info' | 'warning';

interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  duration?: number;
}

interface UIState {
  notifications: Notification[];
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;
  currentTheme: 'light' | 'dark';
  isMobile: boolean;
}

interface UIStore extends UIState {
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebarCollapse: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
  setIsMobile: (isMobile: boolean) => void;
}

const useUIStore = create<UIStore>()(
  persist(
    (set) => ({
      notifications: [],
      sidebarOpen: true,
      sidebarCollapsed: false,
      currentTheme: 'dark',
      isMobile: window.innerWidth < 768,
      
      addNotification: (notification) => {
        const id = Math.random().toString(36).substring(2, 9);
        const newNotification = { ...notification, id };
        
        set((state) => ({
          notifications: [...state.notifications, newNotification]
        }));
        
        if (notification.duration !== Infinity) {
          // Auto-remove notification after duration (default: 5000ms)
          setTimeout(() => {
            set((state) => ({
              notifications: state.notifications.filter((n) => n.id !== id)
            }));
          }, notification.duration || 5000);
        }
        
        return id;
      },
      
      removeNotification: (id) => {
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id)
        }));
      },
      
      clearNotifications: () => {
        set({ notifications: [] });
      },
      
      toggleSidebar: () => {
        set((state) => ({
          sidebarOpen: !state.sidebarOpen
        }));
      },
      
      setSidebarOpen: (open) => {
        set({ sidebarOpen: open });
      },
      
      toggleSidebarCollapse: () => {
        set((state) => ({
          sidebarCollapsed: !state.sidebarCollapsed
        }));
      },
      
      setSidebarCollapsed: (collapsed) => {
        set({ sidebarCollapsed: collapsed });
      },
      
      toggleTheme: () => {
        set((state) => {
          const newTheme = state.currentTheme === 'light' ? 'dark' : 'light';
          document.documentElement.classList.toggle('dark', newTheme === 'dark');
          return { currentTheme: newTheme };
        });
      },
      
      setTheme: (theme) => {
        document.documentElement.classList.toggle('dark', theme === 'dark');
        set({ currentTheme: theme });
      },
      
      setIsMobile: (isMobile) => {
        set({ isMobile });
      }
    }),
    {
      name: 'ui-storage',
      partialize: (state) => ({
        sidebarCollapsed: state.sidebarCollapsed,
        currentTheme: state.currentTheme
      })
    }
  )
);

// Initialize theme based on stored preference
const initializeTheme = () => {
  const theme = useUIStore.getState().currentTheme;
  document.documentElement.classList.toggle('dark', theme === 'dark');
};

// Set up window resize listener for mobile detection
const setupMobileDetection = () => {
  const handleResize = () => {
    useUIStore.getState().setIsMobile(window.innerWidth < 768);
  };
  
  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);
};

// Call these functions when the store is imported
initializeTheme();
setupMobileDetection();

export default useUIStore;