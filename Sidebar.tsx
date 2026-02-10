import React from 'react';
import { AppRoute } from '../types';
import { LayoutDashboard, PenTool, LogOut, Settings, Image as ImageIcon } from 'lucide-react';

interface SidebarProps {
  currentRoute: AppRoute;
  onNavigate: (route: AppRoute) => void;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentRoute, onNavigate, onLogout }) => {
  const navItemClass = (route: AppRoute) => `
    flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors cursor-pointer
    ${currentRoute === route ? 'bg-brand-gold text-white shadow-md' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}
  `;

  return (
    <div className="w-64 bg-brand-dark h-screen flex flex-col fixed left-0 top-0 border-r border-gray-800">
      <div className="p-8">
        <h1 className="text-3xl font-serif font-bold text-white tracking-wider">VELARA</h1>
        <p className="text-xs text-brand-gold uppercase tracking-widest mt-1">Admin Panel</p>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
        <div 
          onClick={() => onNavigate(AppRoute.DASHBOARD)}
          className={navItemClass(AppRoute.DASHBOARD)}
        >
          <LayoutDashboard size={20} />
          <span className="font-medium">Dashboard</span>
        </div>

        <div 
          onClick={() => onNavigate(AppRoute.EDITOR)}
          className={navItemClass(AppRoute.EDITOR)}
        >
          <PenTool size={20} />
          <span className="font-medium">Write Article</span>
        </div>

        <div className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white cursor-not-allowed opacity-50">
          <ImageIcon size={20} />
          <span className="font-medium">Media Library</span>
        </div>
        
        <div className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white cursor-not-allowed opacity-50">
          <Settings size={20} />
          <span className="font-medium">Settings</span>
        </div>
      </nav>

      <div className="p-4 border-t border-gray-800">
        <button 
          onClick={onLogout}
          className="flex items-center space-x-3 px-4 py-3 w-full text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
        >
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};
