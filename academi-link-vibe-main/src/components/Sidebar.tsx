import React from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Home, 
  Search, 
  Compass, 
  Heart, 
  MessageCircle, 
  Bookmark, 
  User, 
  Settings,
  GraduationCap
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  currentUser?: {
    username: string;
    fullName: string;
    avatarUrl?: string;
  };
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange, currentUser }) => {
  const menuItems = [
    { id: 'home', label: 'Accueil', icon: Home },
    { id: 'search', label: 'Rechercher', icon: Search },
    { id: 'explorer', label: 'Explorer', icon: Compass },
    { id: 'notifications', label: 'Notifications', icon: Heart },
    { id: 'messages', label: 'Messages', icon: MessageCircle },
    { id: 'saved', label: 'Enregistrés', icon: Bookmark },
    { id: 'profile', label: 'Profil', icon: User },
    { id: 'settings', label: 'Paramètres', icon: Settings }
  ];

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 z-50 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div 
            className="h-8 w-8 rounded-lg flex items-center justify-center"
            style={{background: 'var(--gradient-primary)'}}
          >
            <GraduationCap className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-pink-600 to-orange-600 bg-clip-text text-transparent">
            StudentGram
          </span>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <Button
              key={item.id}
              variant={isActive ? "default" : "ghost"}
              className={`w-full justify-start h-12 text-left px-4 ${
                isActive 
                  ? 'text-white font-medium shadow-sm' 
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
              style={isActive ? {background: 'var(--gradient-primary)'} : {}}
              onClick={() => onTabChange(item.id)}
            >
              <Icon className="h-5 w-5 mr-4" />
              {item.label}
            </Button>
          );
        })}
      </nav>

      {/* User Profile Section */}
      {currentUser && (
        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center gap-3 p-2">
            <Avatar className="h-10 w-10">
              <AvatarImage src={currentUser.avatarUrl} />
              <AvatarFallback className="bg-gradient-to-br from-pink-500 to-orange-500 text-white">
                {currentUser.fullName?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 truncate">
                {currentUser.fullName}
              </p>
              <p className="text-sm text-gray-500 truncate">
                @{currentUser.username}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;