import React, { useState, useEffect } from 'react';
import { Camera, MapPin, Calendar, Link as LinkIcon, Edit, Settings, UserPlus, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/lib/i18n';
import { ProfileSkeleton, FeedSkeleton } from '@/components/SkeletonLoaders';
import { InteractiveFeed } from '@/components/InteractiveFeed';

interface UserStats {
  postsCount: number;
  followersCount: number;
  followingCount: number;
}

interface UserProfileData {
  id: string;
  username: string;
  displayName: string;
  bio?: string;
  avatar?: string;
  coverImage?: string;
  location?: string;
  website?: string;
  joinedDate: string;
  isVerified: boolean;
  isFollowing: boolean;
  isOwnProfile: boolean;
  stats: UserStats;
}

interface UserProfileProps {
  userId: string;
  loading?: boolean;
}

export const UserProfile: React.FC<UserProfileProps> = ({ userId, loading = false }) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [activeTab, setActiveTab] = useState('posts');
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);

  useEffect(() => {
    loadProfile();
  }, [userId]);

  const loadProfile = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock profile data
      const mockProfile: UserProfileData = {
        id: userId,
        username: 'marie_student',
        displayName: 'Marie Dubois',
        bio: '🎓 Étudiante en informatique à l\'ULB\n📍 Bruxelles, Belgique\n💻 Passionnée de développement web\n🌟 Toujours prête à apprendre !',
        avatar: '/placeholder.svg',
        coverImage: '/placeholder.svg',
        location: 'Bruxelles, Belgique',
        website: 'https://marie-portfolio.be',
        joinedDate: '2023-09-01',
        isVerified: true,
        isFollowing: false,
        isOwnProfile: userId === 'current_user',
        stats: {
          postsCount: 127,
          followersCount: 892,
          followingCount: 234
        }
      };
      
      setProfile(mockProfile);
      setIsFollowing(mockProfile.isFollowing);
      setFollowersCount(mockProfile.stats.followersCount);
    } catch (error) {
      toast({
        title: t('error'),
        description: t('failed_to_load_profile'),
        variant: 'destructive',
      });
    }
  };

  const handleFollow = async () => {
    const wasFollowing = isFollowing;
    
    // Optimistic update
    setIsFollowing(!wasFollowing);
    setFollowersCount(prev => wasFollowing ? prev - 1 : prev + 1);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      toast({
        title: t('success'),
        description: wasFollowing ? t('user_unfollowed') : t('user_followed'),
      });
    } catch (error) {
      // Revert on error
      setIsFollowing(wasFollowing);
      setFollowersCount(prev => wasFollowing ? prev + 1 : prev - 1);
      
      toast({
        title: t('error'),
        description: t('failed_to_update_follow_status'),
        variant: 'destructive',
      });
    }
  };

  const handleMessage = () => {
    // Navigate to messages with this user
    toast({
      title: t('info'),
      description: t('opening_message_conversation'),
    });
  };

  const formatJoinDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { 
      year: 'numeric', 
      month: 'long' 
    });
  };

  if (loading || !profile) {
    return <ProfileSkeleton />;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Cover Image */}
      <div className="relative h-48 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg overflow-hidden">
        {profile.coverImage && (
          <img 
            src={profile.coverImage} 
            alt="Cover" 
            className="w-full h-full object-cover"
          />
        )}
        {profile.isOwnProfile && (
          <Button 
            variant="secondary" 
            size="sm" 
            className="absolute top-4 right-4"
          >
            <Camera className="h-4 w-4 mr-2" />
            {t('edit_cover')}
          </Button>
        )}
      </div>

      {/* Profile Header */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-end space-y-4 sm:space-y-0 sm:space-x-4">
            {/* Avatar */}
            <div className="relative -mt-16 sm:-mt-12">
              <Avatar className="h-24 w-24 border-4 border-background">
                <AvatarImage src={profile.avatar} alt={profile.displayName} />
                <AvatarFallback className="text-2xl">
                  {profile.displayName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              {profile.isOwnProfile && (
                <Button 
                  variant="secondary" 
                  size="sm" 
                  className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
                >
                  <Camera className="h-4 w-4" />
                </Button>
              )}
            </div>

            {/* Profile Info */}
            <div className="flex-1 space-y-2">
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl font-bold">{profile.displayName}</h1>
                {profile.isVerified && (
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    ✓ {t('verified')}
                  </Badge>
                )}
              </div>
              <p className="text-muted-foreground">@{profile.username}</p>
              
              {profile.bio && (
                <p className="text-sm leading-relaxed whitespace-pre-line max-w-md">
                  {profile.bio}
                </p>
              )}

              {/* Profile metadata */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                {profile.location && (
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-4 w-4" />
                    <span>{profile.location}</span>
                  </div>
                )}
                {profile.website && (
                  <div className="flex items-center space-x-1">
                    <LinkIcon className="h-4 w-4" />
                    <a 
                      href={profile.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {profile.website.replace(/^https?:\/\//, '')}
                    </a>
                  </div>
                )}
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>{t('joined')} {formatJoinDate(profile.joinedDate)}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-2">
              {profile.isOwnProfile ? (
                <>
                  <Button variant="outline">
                    <Edit className="h-4 w-4 mr-2" />
                    {t('edit_profile')}
                  </Button>
                  <Button variant="outline" size="icon">
                    <Settings className="h-4 w-4" />
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    variant={isFollowing ? "outline" : "default"}
                    onClick={handleFollow}
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    {isFollowing ? t('unfollow') : t('follow')}
                  </Button>
                  <Button variant="outline" onClick={handleMessage}>
                    <MessageCircle className="h-4 w-4 mr-2" />
                    {t('message')}
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {/* Stats */}
          <div className="flex items-center space-x-8 border-t pt-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{profile.stats.postsCount}</div>
              <div className="text-sm text-muted-foreground">{t('posts')}</div>
            </div>
            <div className="text-center cursor-pointer hover:bg-muted rounded p-2 -m-2">
              <div className="text-2xl font-bold">{followersCount}</div>
              <div className="text-sm text-muted-foreground">{t('followers')}</div>
            </div>
            <div className="text-center cursor-pointer hover:bg-muted rounded p-2 -m-2">
              <div className="text-2xl font-bold">{profile.stats.followingCount}</div>
              <div className="text-sm text-muted-foreground">{t('following')}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="posts">{t('posts')}</TabsTrigger>
          <TabsTrigger value="media">{t('media')}</TabsTrigger>
          <TabsTrigger value="likes">{t('likes')}</TabsTrigger>
          <TabsTrigger value="about">{t('about')}</TabsTrigger>
        </TabsList>

        <TabsContent value="posts" className="space-y-6">
          <InteractiveFeed 
            posts={[]} // Will be loaded from API
            loading={false}
            hasMore={true}
          />
        </TabsContent>

        <TabsContent value="media" className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            {Array.from({ length: 9 }).map((_, index) => (
              <div key={index} className="aspect-square bg-muted rounded-lg animate-pulse" />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="likes" className="space-y-6">
          <FeedSkeleton count={3} />
        </TabsContent>

        <TabsContent value="about" className="space-y-6">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">{t('about')}</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">{t('bio')}</h4>
                <p className="text-sm text-muted-foreground whitespace-pre-line">
                  {profile.bio || t('no_bio_available')}
                </p>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">{t('details')}</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('username')}</span>
                    <span>@{profile.username}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('joined')}</span>
                    <span>{formatJoinDate(profile.joinedDate)}</span>
                  </div>
                  {profile.location && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t('location')}</span>
                      <span>{profile.location}</span>
                    </div>
                  )}
                  {profile.website && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t('website')}</span>
                      <a 
                        href={profile.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {profile.website.replace(/^https?:\/\//, '')}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
