import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Plus, Camera } from 'lucide-react';

interface Story {
  id: string;
  username: string;
  displayName: string;
  avatarUrl?: string;
  hasStory: boolean;
}

interface StoriesSectionProps {
  currentUser?: {
    username: string;
    fullName: string;
    avatarUrl?: string;
  };
  stories: Story[];
  onCreateStory: () => void;
}

const StoriesSection: React.FC<StoriesSectionProps> = ({ currentUser, stories, onCreateStory }) => {
  const mockStories: Story[] = [
    { id: '1', username: 'marie', displayName: 'Marie', hasStory: true },
    { id: '2', username: 'alex', displayName: 'Alex', hasStory: true },
    { id: '3', username: 'sophie', displayName: 'Sophie', hasStory: true },
    { id: '4', username: 'lucas', displayName: 'Lucas', hasStory: true }
  ];

  return (
    <div className="flex items-center gap-4 p-4 bg-white rounded-lg border overflow-x-auto">
      {/* Create Story */}
      <div className="flex flex-col items-center space-y-2 flex-shrink-0 cursor-pointer" onClick={onCreateStory}>
        <div className="relative">
          <Avatar className="h-16 w-16 border-2 border-gray-200">
            <AvatarImage src={currentUser?.avatarUrl} />
            <AvatarFallback className="text-lg">
              {currentUser?.fullName?.charAt(0) || 'T'}
            </AvatarFallback>
          </Avatar>
          <div 
            className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full flex items-center justify-center border-2 border-white cursor-pointer hover:scale-105 transition-transform"
            style={{background: 'var(--gradient-primary)'}}
          >
            <Plus className="h-4 w-4 text-white" />
          </div>
        </div>
        <span className="text-xs font-medium text-gray-600">Votre story</span>
      </div>

      {/* Stories */}
      {mockStories.map((story) => (
        <div key={story.id} className="flex flex-col items-center space-y-2 flex-shrink-0 cursor-pointer">
          <div className="relative">
            <div className="h-16 w-16 rounded-full p-0.5 bg-gradient-to-tr from-pink-500 to-orange-500">
              <Avatar className="h-full w-full border-2 border-white">
                <AvatarImage src={story.avatarUrl} />
                <AvatarFallback className="text-lg bg-gray-100">
                  {story.displayName.charAt(0)}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
          <span className="text-xs font-medium text-gray-600 max-w-[60px] truncate">
            {story.displayName}
          </span>
        </div>
      ))}
    </div>
  );
};

export default StoriesSection;