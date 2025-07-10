import { useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useEffect } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import useStore from '../../store';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const location = useLocation();
  const { sidebarCollapsed } = useStore.ui();
  const [pageTransition, setPageTransition] = useState(false);
  
  // Effect for page transition animation
  useEffect(() => {
    setPageTransition(true);
    return () => setPageTransition(false);
  }, []);

  // Get page title based on current route
  const getPageTitle = () => {
    switch (location.pathname) {
      case '/chat':
        return 'Chat';
      case '/data':
        return 'Data Management';
      case '/settings':
        return 'Settings';
      default:
        return 'Dashboard';
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-base text-white">
      {/* Sidebar */}
      <Sidebar 
        isCollapsed={sidebarCollapsed} 
        onToggle={() => {}} // This prop is no longer used, handled internally
      />

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header title={getPageTitle()} />

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto">
          <div 
            className={`transition-opacity duration-300 ${
              pageTransition ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default MainLayout;