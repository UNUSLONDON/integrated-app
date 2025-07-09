import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  MessageCircle, 
  Database, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  ChevronDown,
  ChevronUp,
  MoreVertical,
  LayoutDashboard,
  Bot,
  Calendar,
  CheckSquare,
  FileText,
  Eye,
  Clock,
  AlertCircle,
  X,
  Puzzle,
  User,
  Sliders
} from 'lucide-react';
import useStore from '../../store';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

interface MenuItem {
  path: string;
  label: string;
  icon: React.ComponentType<any>;
}

interface MenuSection {
  title: string;
  items: MenuItem[];
  defaultExpanded?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, onToggle }) => {
  const { user, logout } = useStore.auth();
  
  // Track which sections are expanded
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    main: true,
    content: true,
    settings: true
  });

  const toggleSection = (sectionKey: string) => {
    // Allow section toggle even when collapsed for better UX
    
    setExpandedSections(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey]
    }));
  };

  const menuSections: MenuSection[] = [
    {
      title: 'Main',
      items: [
        { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/chat', label: 'AI Assistant', icon: Bot },
        { path: '/calendar', label: 'Content Calendar', icon: Calendar },
        { path: '/tasks', label: 'Tasks', icon: CheckSquare },
      ]
    },
    {
      title: 'Content',
      items: [
        { path: '/content/all', label: 'All Posts', icon: FileText },
        { path: '/content/published', label: 'Published', icon: Eye },
        { path: '/content/scheduled', label: 'Scheduled', icon: Clock },
        { path: '/content/pending', label: 'Pending', icon: AlertCircle },
        { path: '/content/rejected', label: 'Rejected', icon: X },
      ]
    },
    {
      title: 'Settings',
      items: [
        { path: '/settings/integrations', label: 'Integrations', icon: Puzzle },
        { path: '/settings/account', label: 'Account Settings', icon: User },
        { path: '/settings/advanced', label: 'Advanced Settings', icon: Sliders },
      ]
    }
  ];

  // Keep the legacy data item for backward compatibility
  const legacyDataItem = { path: '/data', label: 'Data', icon: Database };

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
      <nav className="mt-4 flex-1 overflow-y-auto">
        <div className="space-y-1 px-2">
          {menuSections.map((section) => {
            const sectionKey = section.title.toLowerCase();
            const isExpanded = expandedSections[sectionKey];
            
            return (
              <div key={section.title}>
                {/* Section Header */}
                <button
                  onClick={() => toggleSection(sectionKey)}
                  className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-darkText hover:text-white transition-colors uppercase tracking-wider ${
                    isCollapsed ? 'justify-center' : ''
                  }`}
                  title={isCollapsed ? section.title : undefined}
                >
                  {!isCollapsed && <span>{section.title}</span>}
                  {!isCollapsed && (
                    isExpanded ? (
                      <ChevronUp className="w-3 h-3" />
                    ) : (
                      <ChevronDown className="w-3 h-3" />
                    )
                  )}
                  {isCollapsed && (
                    <div className="w-6 h-0.5 bg-darkText rounded-full" />
                  )}
                </button>
                
                {/* Section Items */}
                <div className={`space-y-1 transition-all duration-200 overflow-hidden ${
                  !isExpanded ? 'max-h-0 opacity-0' : 'max-h-96 opacity-100'
                }`}>
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    return (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                          `flex items-center px-4 py-2 rounded-lg transition-colors ${
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
                    );
                  })}
                </div>
              </div>
            );
          })}
          
          {/* Legacy Data Item - keeping for backward compatibility */}
          <div className="pt-2 border-t border-gray-800 mt-2">
            <NavLink
              to={legacyDataItem.path}
              className={({ isActive }) =>
                `flex items-center px-4 py-2 rounded-lg transition-colors ${
                  isActive
                    ? 'text-primary bg-primary/20'
                    : 'text-darkText hover:bg-gray-800 hover:text-white'
                } ${isCollapsed ? 'justify-center' : ''}`
              }
              title={isCollapsed ? legacyDataItem.label : undefined}
            >
              <legacyDataItem.icon className="w-5 h-5 flex-shrink-0" />
              {!isCollapsed && <span className="ml-3">{legacyDataItem.label}</span>}
            </NavLink>
          </div>
        </div>
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