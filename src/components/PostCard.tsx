import React, { useState } from 'react';
import { 
  Heart, 
  MessageCircle, 
  Share, 
  Bookmark, 
  MoreHorizontal,
  Shield,
  GraduationCap,
  Clock,
  MapPin
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Post, Profile } from '@/lib/supabase';

interface PostCardProps {
  post: Post;
  currentUser?: Profile | null;
  onLike: (postId: string) => void;
  onComment: (postId: string) => void;
  onShare: (postId: string) => void;
  onSave: (postId: string) => void;
}

const PostCard: React.FC<PostCardProps> = ({ 
  post, 
  currentUser, 
  onLike, 
  onComment, 
  onShare, 
  onSave 
}) => {
  const [isLiked, setIsLiked] = useState(
    currentUser ? post.likes?.some(like => like.userId === currentUser.id) : false
  );
  const [likesCount, setLikesCount] = useState(post.likesCount || 0);
  const [isSaved, setIsSaved] = useState(false); // This would come from a saved posts query

  const profile = post.profiles as Profile;

  const handleLike = async () => {
    if (!currentUser) return;
    
    const newLikedState = !isLiked;
    setIsLiked(newLikedState);
    setLikesCount(prev => newLikedState ? prev + 1 : prev - 1);
    
    try {
      await onLike(post.id);
    } catch (error) {
      // Revert on error
      setIsLiked(!newLikedState);
      setLikesCount(prev => newLikedState ? prev - 1 : prev + 1);
    }
  };

  const handleSave = async () => {
    setIsSaved(!isSaved);
    try {
      await onSave(post.id);
    } catch (error) {
      setIsSaved(!isSaved);
    }
  };

  const getLevelBadgeClass = (level: string) => {
    switch (level) {
      case 'secondary': return 'badge-secondary';
      case 'higher': return 'badge-higher';
      case 'university': return 'badge-university';
      default: return 'badge-secondary';
    }
  };

  const getPostTypeBadge = (type: string) => {
    const types = {
      academic: { label: 'Académique', className: 'bg-blue-100 text-blue-800' },
      achievement: { label: 'Réussite', className: 'bg-green-100 text-green-800' },
      help: { label: 'Aide', className: 'bg-yellow-100 text-yellow-800' },
      social: { label: 'Social', className: 'bg-purple-100 text-purple-800' },
      general: { label: 'Général', className: 'bg-gray-100 text-gray-800' }
    };
    return types[type as keyof typeof types] || types.general;
  };

  const timeAgo = formatDistanceToNow(new Date(post.createdAt), { 
    addSuffix: true,
    locale: fr 
  });

  return (
    <Card className="post-card w-full max-w-lg mx-auto">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={profile?.avatarUrl || ''} alt={profile?.fullName || ''} />
              <AvatarFallback>
                {profile?.fullName?.split(' ').map(n => n[0]).join('') || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-sm truncate">{profile?.fullName}</h3>
                {profile?.isVerified && (
                  <Shield className="h-4 w-4 text-verified" />
                )}
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>@{profile?.username}</span>
                <span>•</span>
                <span>{timeAgo}</span>
                {profile?.isMinor && (
                  <>
                    <span>•</span>
                    <Badge variant="outline" className="text-xs px-1">
                      <Shield className="h-2 w-2 mr-1" />
                      Protégé
                    </Badge>
                  </>
                )}
              </div>
              <div className="flex items-center gap-2 mt-1">
                {profile?.level && (
                  <Badge className={`${getLevelBadgeClass(profile.level)} text-xs`}>
                    <GraduationCap className="h-3 w-3 mr-1" />
                    {profile.level === 'secondary' ? 'Secondaire' :
                     profile.level === 'higher' ? 'Supérieur' : 'Université'}
                  </Badge>
                )}
                {profile?.school && (
                  <div className="flex items-center text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3 mr-1" />
                    {profile.school}
                  </div>
                )}
              </div>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Signaler le contenu</DropdownMenuItem>
              {currentUser?.id === post.userId && (
                <>
                  <DropdownMenuItem>Modifier</DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive">Supprimer</DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Post Type and Academic Info */}
        <div className="flex items-center gap-2 mt-2">
          <Badge variant="outline" className={getPostTypeBadge(post.type).className}>
            {getPostTypeBadge(post.type).label}
          </Badge>
          {post.relatedCourse && (
            <Badge variant="outline" className="text-xs">
              {post.relatedCourse}
            </Badge>
          )}
          {post.moderationStatus === 'pending' && (
            <Badge variant="outline" className="bg-yellow-100 text-yellow-800 text-xs">
              <Clock className="h-3 w-3 mr-1" />
              En vérification
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="pb-3">
        <div className="space-y-3">
          <p className="text-sm whitespace-pre-wrap break-words">{post.content}</p>
          
          {post.imageUrl && (
            <div className="rounded-lg overflow-hidden bg-muted">
              <img 
                src={post.imageUrl} 
                alt="Post content" 
                className="w-full h-auto object-cover max-h-96"
                loading="lazy"
              />
            </div>
          )}

          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {post.tags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  #{tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="pt-0">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              className={`h-8 px-3 ${isLiked ? 'text-social-like' : 'text-muted-foreground'}`}
              onClick={handleLike}
              disabled={!currentUser}
            >
              <Heart 
                className={`h-4 w-4 mr-1 ${isLiked ? 'fill-current' : ''}`} 
              />
              <span className="text-xs">{likesCount}</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-3 text-social-comment"
              onClick={() => onComment(post.id)}
              disabled={!currentUser}
            >
              <MessageCircle className="h-4 w-4 mr-1" />
              <span className="text-xs">{post.commentsCount || 0}</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-3 text-social-share"
              onClick={() => onShare(post.id)}
              disabled={!currentUser}
            >
              <Share className="h-4 w-4 mr-1" />
              <span className="text-xs">{post.sharesCount || 0}</span>
            </Button>
          </div>

          <Button
            variant="ghost"
            size="sm"
            className={`h-8 w-8 p-0 ${isSaved ? 'text-social-save' : 'text-muted-foreground'}`}
            onClick={handleSave}
            disabled={!currentUser}
          >
            <Bookmark className={`h-4 w-4 ${isSaved ? 'fill-current' : ''}`} />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default PostCard;