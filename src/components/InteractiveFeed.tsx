import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle, Share, Bookmark, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import OptimizedImage from '@/components/OptimizedImage';
import { FeedSkeleton, CommentSkeleton } from '@/components/SkeletonLoaders';
import { useTranslation } from '@/lib/i18n';
import { validatePostData, validateCommentData, safeFilter, sanitizeString } from '@/lib/validation';

interface Comment {
  id: string;
  userId: string;
  username: string;
  avatar?: string;
  content: string;
  createdAt: string;
  likesCount: number;
  isLiked: boolean;
}

interface Post {
  id: string;
  userId: string;
  username: string;
  avatar?: string;
  content: string;
  imageUrl?: string;
  createdAt: string;
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  isLiked: boolean;
  isSaved: boolean;
  comments?: Comment[];
}

interface InteractiveFeedProps {
  posts?: Post[];
  loading?: boolean;
  onLoadMore?: () => void;
  hasMore?: boolean;
}

export const InteractiveFeed: React.FC<InteractiveFeedProps> = ({
  posts = [],
  loading = false,
  onLoadMore,
  hasMore = false
}) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  
  // Validation et filtrage sécurisé des posts
  const validatedPosts = safeFilter<Post>(posts, validatePostData);
  const [localPosts, setLocalPosts] = useState<Post[]>(validatedPosts);
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set());
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [loadingComments, setLoadingComments] = useState<Set<string>>(new Set());

  useEffect(() => {
    const validatedPosts = safeFilter<Post>(posts, validatePostData);
    setLocalPosts(validatedPosts);
  }, [posts]);

  const handleLike = async (postId: string) => {
    setLocalPosts(prev => prev.map(post => {
      if (post.id === postId) {
        const newIsLiked = !post.isLiked;
        return {
          ...post,
          isLiked: newIsLiked,
          likesCount: newIsLiked ? post.likesCount + 1 : post.likesCount - 1
        };
      }
      return post;
    }));

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      toast({
        title: t('success'),
        description: t('post_liked_successfully'),
      });
    } catch (error) {
      // Revert on error
      setLocalPosts(prev => prev.map(post => {
        if (post.id === postId) {
          const revertIsLiked = !post.isLiked;
          return {
            ...post,
            isLiked: revertIsLiked,
            likesCount: revertIsLiked ? post.likesCount + 1 : post.likesCount - 1
          };
        }
        return post;
      }));
      toast({
        title: t('error'),
        description: t('failed_to_like_post'),
        variant: 'destructive',
      });
    }
  };

  const handleSave = async (postId: string) => {
    setLocalPosts(prev => prev.map(post => {
      if (post.id === postId) {
        return { ...post, isSaved: !post.isSaved };
      }
      return post;
    }));

    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      const post = localPosts.find(p => p.id === postId);
      toast({
        title: t('success'),
        description: post?.isSaved ? t('post_unsaved') : t('post_saved'),
      });
    } catch (error) {
      // Revert on error
      setLocalPosts(prev => prev.map(post => {
        if (post.id === postId) {
          return { ...post, isSaved: !post.isSaved };
        }
        return post;
      }));
    }
  };

  const handleShare = async (postId: string) => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'StudentGram Post',
          text: 'Check out this post on StudentGram!',
          url: `${window.location.origin}/post/${postId}`
        });
      } else {
        await navigator.clipboard.writeText(`${window.location.origin}/post/${postId}`);
        toast({
          title: t('success'),
          description: t('link_copied_to_clipboard'),
        });
      }
      
      // Update share count
      setLocalPosts(prev => prev.map(post => {
        if (post.id === postId) {
          return { ...post, sharesCount: post.sharesCount + 1 };
        }
        return post;
      }));
    } catch (error) {
      toast({
        title: t('error'),
        description: t('failed_to_share_post'),
        variant: 'destructive',
      });
    }
  };

  const toggleComments = async (postId: string) => {
    const isExpanded = expandedComments.has(postId);
    
    if (isExpanded) {
      setExpandedComments(prev => {
        const newSet = new Set(prev);
        newSet.delete(postId);
        return newSet;
      });
    } else {
      setExpandedComments(prev => new Set(prev).add(postId));
      
      // Load comments if not already loaded
      const post = localPosts.find(p => p.id === postId);
      if (!post?.comments) {
        setLoadingComments(prev => new Set(prev).add(postId));
        
        try {
          // Simulate API call to load comments
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Mock comments data
          const mockComments: Comment[] = [
            {
              id: '1',
              userId: 'user1',
              username: 'alice_student',
              avatar: '/placeholder.svg',
              content: 'Super intéressant ! Merci pour le partage 👍',
              createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
              likesCount: 3,
              isLiked: false
            },
            {
              id: '2',
              userId: 'user2',
              username: 'bob_etudiant',
              content: 'Je suis totalement d\'accord avec toi sur ce point.',
              createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
              likesCount: 1,
              isLiked: true
            }
          ];
          
          setLocalPosts(prev => prev.map(p => 
            p.id === postId ? { ...p, comments: mockComments } : p
          ));
        } catch (error) {
          toast({
            title: t('error'),
            description: t('failed_to_load_comments'),
            variant: 'destructive',
          });
        } finally {
          setLoadingComments(prev => {
            const newSet = new Set(prev);
            newSet.delete(postId);
            return newSet;
          });
        }
      }
    }
  };

  const handleAddComment = async (postId: string) => {
    const commentText = sanitizeString(commentInputs[postId]?.trim(), 500);
    if (!commentText) return;

    try {
      // Simuler l'ajout d'un commentaire
      const newComment: Comment = {
        id: Date.now().toString(),
        userId: 'current-user',
        username: 'Vous',
        content: commentText,
        createdAt: new Date().toISOString(),
        likesCount: 0,
        isLiked: false
      };

      // Valider le commentaire avant de l'ajouter
      const validation = validateCommentData(newComment);
      if (!validation.isValid) {
        console.warn('Invalid comment data:', validation.errors);
        toast({
          title: 'Commentaire invalide',
          description: validation.errors[0],
          variant: 'destructive'
        });
        return;
      }

      setLocalPosts(prev => prev.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            comments: [...(post.comments || []), newComment],
            commentsCount: (post.commentsCount || 0) + 1
          };
        }
        return post;
      }));

      // Vider le champ de commentaire
      setCommentInputs(prev => ({
        ...prev,
        [postId]: ''
      }));

      toast({
        title: 'Commentaire ajouté avec succès',
        variant: 'default'
      });

    } catch (error) {
      console.error('Error adding comment:', error);
      toast({
        title: 'Échec de l\'ajout du commentaire',
        variant: 'destructive'
      });
    }
  };

  const formatTimeAgo = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Date invalide';
      }
      
      const now = new Date();
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
      
      if (diffInMinutes < 1) return 'À l\'instant';
      if (diffInMinutes < 60) return `Il y a ${diffInMinutes} min`;
      
      const diffInHours = Math.floor(diffInMinutes / 60);
      if (diffInHours < 24) return `Il y a ${diffInHours}h`;
      
      const diffInDays = Math.floor(diffInHours / 24);
      if (diffInDays < 7) return `Il y a ${diffInDays}j`;
      
      return date.toLocaleDateString();
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Date invalide';
    }
  };

  if (loading && localPosts.length === 0) {
    return <FeedSkeleton count={5} />;
  }

  return (
    <div className="space-y-6">
      {localPosts.map((post) => (
        <Card key={post.id} className="w-full">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarImage src={post.avatar} alt={post.username || 'User'} />
                  <AvatarFallback>{post.username?.charAt(0)?.toUpperCase() || 'U'}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-sm">{post.username || 'Utilisateur anonyme'}</p>
                  <p className="text-xs text-muted-foreground">{post.createdAt ? formatTimeAgo(post.createdAt) : 'Date inconnue'}</p>
                </div>
              </div>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Post content */}
            <p className="text-sm leading-relaxed">{post.content || 'Contenu non disponible'}</p>

            {/* Post image */}
            {post.imageUrl && (
              <OptimizedImage
                src={post.imageUrl}
                alt="Post image"
                className="w-full rounded-lg"
              />
            )}

            {/* Action buttons */}
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleLike(post.id)}
                  className={post.isLiked ? 'text-red-500' : ''}
                >
                  <Heart className={`h-5 w-5 ${post.isLiked ? 'fill-current' : ''}`} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleComments(post.id)}
                >
                  <MessageCircle className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleShare(post.id)}
                >
                  <Share className="h-5 w-5" />
                </Button>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleSave(post.id)}
                className={post.isSaved ? 'text-blue-500' : ''}
              >
                <Bookmark className={`h-5 w-5 ${post.isSaved ? 'fill-current' : ''}`} />
              </Button>
            </div>

            {/* Like and comment counts */}
            <div className="space-y-1 text-sm text-muted-foreground">
              {post.likesCount > 0 && (
                <p>{t('likes_count', { count: post.likesCount })}</p>
              )}
              {post.commentsCount > 0 && (
                <button
                  onClick={() => toggleComments(post.id)}
                  className="hover:underline"
                >
                  {t('view_comments', { count: post.commentsCount })}
                </button>
              )}
            </div>

            {/* Comments section */}
            {expandedComments.has(post.id) && (
              <div className="space-y-4 border-t pt-4">
                {loadingComments.has(post.id) ? (
                  <CommentSkeleton count={2} />
                ) : (
                  <>
                    {post.comments?.filter(comment => comment && comment.id)?.map((comment) => (
                      <div key={comment.id} className="flex items-start space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={comment.avatar} alt={comment.username || 'User'} />
                          <AvatarFallback>{comment.username?.charAt(0)?.toUpperCase() || 'U'}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-1">
                          <div className="bg-muted rounded-lg p-3">
                            <p className="font-semibold text-xs">{comment.username || 'Utilisateur anonyme'}</p>
                            <p className="text-sm">{comment.content || 'Commentaire non disponible'}</p>
                          </div>
                          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                            <span>{comment.createdAt ? formatTimeAgo(comment.createdAt) : 'Date inconnue'}</span>
                            <button className="hover:underline">
                              J'aime {(comment.likesCount || 0) > 0 && `(${comment.likesCount})`}
                            </button>
                            <button className="hover:underline">Répondre</button>
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Add comment input */}
                    <div className="flex items-start space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>V</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-2">
                        <Textarea
                          placeholder="Écrivez un commentaire..."
                          value={commentInputs[post.id] || ''}
                          onChange={(e) => setCommentInputs(prev => ({
                            ...prev,
                            [post.id]: e.target.value
                          }))}
                          className="min-h-[60px] resize-none"
                        />
                        <Button
                          size="sm"
                          onClick={() => handleAddComment(post.id)}
                          disabled={!commentInputs[post.id]?.trim()}
                        >
                          Publier
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      ))}

      {/* Load more button */}
      {hasMore && (
        <div className="text-center py-4">
          <Button onClick={onLoadMore} variant="outline">
            Charger plus
          </Button>
        </div>
      )}

      {loading && localPosts.length > 0 && (
        <FeedSkeleton count={2} />
      )}
    </div>
  );
};
