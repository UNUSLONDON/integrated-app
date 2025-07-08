import React from 'react';
import { Search, Bell } from 'lucide-react';
import useStore from '../../store';

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  const { user } = useStore.auth();

  return (
    <header className="bg-surface border-b border-gray-800 p-4 flex items-center justify-between">
      <div className="text-xl font-semibold text-white">{title}</div>
      
      <div className="flex items-center space-x-4">
        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            className="bg-base border border-gray-700 rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-lightText placeholder-darkText w-64"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-darkText w-4 h-4" />
        </div>

        {/* Notifications */}
        <div className="relative">
          <button className="relative text-darkText hover:text-white transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
              3
            </span>
          </button>
        </div>

        {/* User Avatar */}
        <div>
          {user?.avatar && (
            <img 
              src={user.avatar} 
              alt={user.name || 'User'} 
              className="w-8 h-8 rounded-full cursor-pointer"
            />
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;