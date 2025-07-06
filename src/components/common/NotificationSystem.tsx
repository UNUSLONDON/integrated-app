import { useState, useEffect, createContext, useContext } from 'react';
import type { ReactNode } from 'react';

type NotificationType = 'success' | 'error' | 'info' | 'warning';

interface Notification {
  id: string;
  message: string;
  type: NotificationType;
  duration: number;
}

interface NotificationContextType {
  showNotification: (message: string, type: NotificationType, duration?: number) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider = ({ children }: NotificationProviderProps) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const showNotification = (
    message: string, 
    type: NotificationType = 'info', 
    duration: number = 3000
  ) => {
    const id = Math.random().toString(36).substring(2, 9);
    setNotifications((prev) => [...prev, { id, message, type, duration }]);
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id));
  };

  // Remove notifications after their duration
  useEffect(() => {
    if (notifications.length > 0) {
      const timers = notifications.map((notification) => {
        return setTimeout(() => {
          removeNotification(notification.id);
        }, notification.duration);
      });

      return () => {
        timers.forEach((timer) => clearTimeout(timer));
      };
    }
  }, [notifications]);

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      
      {/* Notification display */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`px-4 py-3 rounded-md shadow-lg transition-all duration-300 max-w-md transform translate-x-0 
              ${notification.type === 'success' ? 'bg-green-50 text-green-800 border-l-4 border-green-500' : ''}
              ${notification.type === 'error' ? 'bg-red-50 text-red-800 border-l-4 border-red-500' : ''}
              ${notification.type === 'warning' ? 'bg-yellow-50 text-yellow-800 border-l-4 border-yellow-500' : ''}
              ${notification.type === 'info' ? 'bg-blue-50 text-blue-800 border-l-4 border-blue-500' : ''}
            `}
          >
            <div className="flex justify-between items-center">
              <p>{notification.message}</p>
              <button
                onClick={() => removeNotification(notification.id)}
                className="text-gray-500 hover:text-gray-700"
              >
                &times;
              </button>
            </div>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
};
