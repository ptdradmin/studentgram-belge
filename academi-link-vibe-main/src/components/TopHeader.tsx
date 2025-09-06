import React from 'react';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Plus, 
  Heart, 
  Sun, 
  Settings,
  GraduationCap 
} from 'lucide-react';

interface TopHeaderProps {
  currentUser?: {
    username: string;
    fullName: string;
    avatarUrl?: string;
  };
  onSignOut: () => void;
}

const TopHeader: React.FC<TopHeaderProps> = ({ currentUser, onSignOut }) => {
  return (
    <header className="fixed top-0 left-64 right-0 h-16 bg-white border-b border-gray-200 z-40">
      <div className="flex items-center justify-between h-full px-6">
        {/* Search Bar */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Rechercher des étudiants, des posts..."
              className="pl-10 bg-gray-50 border-gray-200 focus:bg-white transition-colors"
            />
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          {/* Action Buttons */}
          <Button variant="ghost" size="sm" className="h-10 w-10 p-0">
            <Plus className="h-5 w-5" />
          </Button>
          
          <div className="relative">
            <Button variant="ghost" size="sm" className="h-10 w-10 p-0">
              <Heart className="h-5 w-5" />
            </Button>
            <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-red-500 text-white text-xs">
              3
            </Badge>
          </div>

          <Button variant="ghost" size="sm" className="h-10 w-10 p-0">
            <Sun className="h-5 w-5" />
          </Button>

          <Button variant="ghost" size="sm" className="h-10 w-10 p-0">
            <Settings className="h-5 w-5" />
          </Button>

          {/* User Avatar */}
          {currentUser && (
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8 ring-2 ring-pink-200">
                <AvatarImage src={currentUser.avatarUrl} />
                <AvatarFallback 
                  className="text-sm font-bold text-white"
                  style={{background: 'var(--gradient-primary)'}}
                >
                  {currentUser.fullName?.split(' ').map(n => n[0]).join('') || 'KV'}
                </AvatarFallback>
              </Avatar>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default TopHeader;