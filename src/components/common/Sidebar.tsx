import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  MessageCircle, 
  Database, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  MoreVertical
} from 'lucide-react';
import useStore from '../../store';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, onToggle }) => {
  const { user, logout } = useStore.auth();

  const navigationItems = [
    {
      path: '/chat',
      label: 'Chat',
      icon: MessageCircle,
    },
    {
      path: '/data',
      label: 'Data',
      icon: Database,
    },
    {
      path: '/settings',
      label: 'Settings',
      icon: Settings,
    },
  ];

  return (
    <aside className={`${isCollapsed ? 'w-16' : 'w-64'} bg-surface border-r border-gray-800 flex-shrink-0 transition-all duration-300 ease-in-out flex flex-col`}>
      {/* Header with Logo and Toggle */}
      <div className="p-4 border-b border-gray-800 flex items-center justify-between">
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : ''}`}>
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
            <MessageCircle className="text-primary w-5 h-5" />
          </div>
          {!isCollapsed && (
            <h1 className="ml-3 text-xl font-bold tracking-tight text-white relative">
              <span className="relative z-10">ChatAI</span>
              <span className="absolute -bottom-1 left-0 right-0 h-2 bg-primary/20 z-0 transform -rotate-1"></span>
            </h1>
          )}
        </div>
        
        <button
          onClick={onToggle}
          className="p-1.5 rounded-lg text-darkText hover:text-white hover:bg-gray-800 transition-colors"
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="mt-4 flex-1">
        <ul className="space-y-1 px-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? 'text-primary bg-primary/20'
                        : 'text-darkText hover:bg-gray-800 hover:text-white'
                    } ${isCollapsed ? 'justify-center' : ''}`
                  }
                  title={isCollapsed ? item.label : undefined}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {!isCollapsed && <span className="ml-3">{item.label}</span>}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Profile Section */}
      <div className="border-t border-gray-800 p-4">
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : ''}`}>
          {user?.avatar && (
            <img 
              src={user.avatar} 
              alt={user.name || 'User'} 
              className="w-10 h-10 rounded-full flex-shrink-0"
            />
          )}
          {!isCollapsed && (
            <>
              <div className="ml-3 flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {user?.name || user?.email?.split('@')[0] || 'User'}
                </p>
                <p className="text-xs text-darkText truncate">Pro Plan</p>
              </div>
              <button 
                onClick={logout}
                className="ml-2 text-darkText hover:text-white transition-colors"
                title="More options"
              >
                <MoreVertical className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;