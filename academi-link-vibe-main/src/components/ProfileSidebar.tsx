import React from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { MapPin, Calendar, GraduationCap } from 'lucide-react';

interface ProfileSidebarProps {
  currentUser?: {
    username: string;
    fullName: string;
    avatarUrl?: string;
    school?: string;
    level?: string;
    isVerified?: boolean;
    bio?: string;
  };
}

const ProfileSidebar: React.FC<ProfileSidebarProps> = ({ currentUser }) => {
  if (!currentUser) return null;

  return (
    <div className="w-80 bg-white rounded-lg border border-gray-200 h-fit">
      {/* Profile Header */}
      <div className="p-6 text-center">
        <div className="relative inline-block">
          <Avatar className="h-24 w-24 mx-auto border-4 border-white shadow-lg">
            <AvatarImage src={currentUser.avatarUrl} />
            <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-pink-500 to-orange-500 text-white">
              {currentUser.fullName?.charAt(0) || 'U'}
            </AvatarFallback>
          </Avatar>
          {currentUser.isVerified && (
            <div className="absolute -bottom-1 -right-1 h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white">
              <GraduationCap className="h-4 w-4 text-white" />
            </div>
          )}
        </div>

        <div className="mt-4">
          <h3 className="text-xl font-bold text-gray-900">{currentUser.fullName}</h3>
          <p className="text-gray-600">@{currentUser.username}</p>
          
          {currentUser.isVerified && (
            <Badge className="mt-2 bg-gradient-to-r from-pink-500 to-orange-500 text-white border-0">
              Administrateur
            </Badge>
          )}
        </div>

        {/* School Info */}
        {currentUser.school && (
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-center text-sm text-gray-600">
              <MapPin className="h-4 w-4 mr-1" />
              {currentUser.school}
            </div>
            {currentUser.level && (
              <div className="flex items-center justify-center text-sm text-gray-600">
                <Calendar className="h-4 w-4 mr-1" />
                Rejoint en janvier 2024
              </div>
            )}
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="px-6 pb-4">
        <div className="flex justify-center gap-8">
          <div className="text-center">
            <div className="text-xl font-bold text-gray-900">0</div>
            <div className="text-sm text-gray-600">Publications</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-gray-900">0</div>
            <div className="text-sm text-gray-600">Abonnés</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-gray-900">0</div>
            <div className="text-sm text-gray-600">Abonnements</div>
          </div>
        </div>
      </div>

      {/* Edit Profile Button */}
      <div className="p-6 pt-0">
        <Button 
          className="w-full font-semibold text-white border-0 shadow-sm hover:shadow-md transition-all duration-300"
          style={{background: 'var(--gradient-primary)'}}
        >
          Modifier le profil
        </Button>
      </div>
    </div>
  );
};

export default ProfileSidebar;