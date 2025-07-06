import { useNavigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import Navigation from './Navigation';
import { useState, useEffect } from 'react';
import useStore from '../../store';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const { user, logout } = useStore.auth();
  const navigate = useNavigate();
  const [pageTransition, setPageTransition] = useState(false);
  
  // Effect for page transition animation
  useEffect(() => {
    setPageTransition(true);
    return () => setPageTransition(false);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-900">Chat Project</h1>

          <div className="flex items-center">
            {/* Navigation */}
            <Navigation
              items={[
                { path: '/chat', label: 'Chat' },
                { path: '/data', label: 'Data Management' }
              ]}
            />

            {/* User info and logout */}
            <div className="ml-4 flex items-center space-x-3 pl-3 border-l border-gray-200">
              {user?.avatar && (
                <img 
                  src={user.avatar} 
                  alt={user.name || 'User'} 
                  className="h-8 w-8 rounded-full"
                />
              )}
              <span className="text-sm text-gray-700">{user?.name || user?.email}</span>
              <button 
                onClick={handleLogout}
                className="ml-2 px-3 py-1 text-xs font-medium text-red-600 hover:text-red-800"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content with transition effect */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div 
          className={`transition-opacity duration-300 ${
            pageTransition ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {children}
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
