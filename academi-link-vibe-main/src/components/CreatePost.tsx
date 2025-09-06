import React, { useState, useRef } from 'react';
import { 
  Camera, 
  Image as ImageIcon, 
  Smile, 
  MapPin, 
  Users, 
  GraduationCap,
  X,
  Upload
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Profile, createPost, uploadFile, getPublicUrl, isSupabaseConfigured } from '@/lib/supabase';

interface CreatePostProps {
  currentUser: Profile;
  onPostCreated: () => void;
}

const CreatePost: React.FC<CreatePostProps> = ({ currentUser, onPostCreated }) => {
  const [content, setContent] = useState('');
  const [postType, setPostType] = useState<'general' | 'academic' | 'achievement' | 'help' | 'social'>('general');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [relatedCourse, setRelatedCourse] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [isPublic, setIsPublic] = useState(!currentUser.isMinor); // Private by default for minors
  const [loading, setLoading] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "Fichier trop volumineux",
          description: "L'image doit faire moins de 5 MB.",
          variant: "destructive"
        });
        return;
      }

      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const addTag = () => {
    if (tagInput.trim() && tags.length < 5 && !tags.includes(tagInput.trim())) {
      setTags(prev => [...prev, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(prev => prev.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim() && !selectedImage) {
      toast({
        title: "Contenu requis",
        description: "Ajoute du texte ou une image à ton post.",
        variant: "destructive"
      });
      return;
    }

    if (!isSupabaseConfigured()) {
      toast({
        title: "Configuration requise",
        description: "Supabase doit être configuré pour publier des posts.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      let imageUrl = null;

      // Upload image if selected
      if (selectedImage) {
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${selectedImage.name.split('.').pop()}`;
        const filePath = `posts/${currentUser.id}/${fileName}`;
        
        const { error: uploadError } = await uploadFile('posts', filePath, selectedImage);
        
        if (uploadError) {
          toast({
            title: "Erreur d'upload",
            description: "Impossible d'uploader l'image. Réessaie.",
            variant: "destructive"
          });
          return;
        }

        const { data: urlData } = getPublicUrl('posts', filePath);
        imageUrl = urlData.publicUrl;
      }

      // Create post
      const postData = {
        user_id: currentUser.id,
        content: content.trim(),
        image_url: imageUrl,
        type: postType,
        tags,
        is_public: isPublic,
        related_course: relatedCourse.trim() || null,
        academic_level: currentUser.level,
        likes_count: 0,
        comments_count: 0,
        shares_count: 0,
        is_moderated: false,
        moderation_status: currentUser.isMinor ? 'pending' : 'approved' as 'approved' | 'pending' | 'rejected'
      };

      const { error } = await createPost(postData);

      if (error) {
        toast({
          title: "Erreur de publication",
          description: error.message,
          variant: "destructive"
        });
        return;
      }

      // Reset form
      setContent('');
      setSelectedImage(null);
      setImagePreview(null);
      setRelatedCourse('');
      setTags([]);
      setTagInput('');
      setPostType('general');
      
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      toast({
        title: "Post publié!",
        description: currentUser.isMinor 
          ? "Ton post est en cours de vérification par nos modérateurs."
          : "Ton post a été publié avec succès!",
      });

      onPostCreated();

    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur inattendue s'est produite.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const postTypes = [
    { value: 'general' as const, label: 'Général', icon: '💬' },
    { value: 'academic' as const, label: 'Académique', icon: '📚' },
    { value: 'achievement' as const, label: 'Réussite', icon: '🏆' },
    { value: 'help' as const, label: 'Aide', icon: '🤝' },
    { value: 'social' as const, label: 'Social', icon: '🎉' }
  ];

  const handlePostTypeChange = (value: string) => {
    setPostType(value as 'general' | 'academic' | 'achievement' | 'help' | 'social');
  };

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader className="pb-3">
        <div className="flex items-center space-x-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={currentUser.avatarUrl || ''} alt={currentUser.fullName} />
            <AvatarFallback>
              {currentUser.fullName.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-sm">{currentUser.fullName}</h3>
              <Badge className="badge-verified text-xs">
                <GraduationCap className="h-3 w-3 mr-1" />
                {currentUser.level === 'secondary' ? 'Secondaire' :
                 currentUser.level === 'higher' ? 'Supérieur' : 'Université'}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">@{currentUser.username}</p>
          </div>
        </div>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {/* Post Type Selection */}
          <div>
            <Label className="text-sm font-medium">Type de post</Label>
            <Select value={postType} onValueChange={handlePostTypeChange}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {postTypes.map(type => (
                  <SelectItem key={type.value} value={type.value}>
                    <span className="flex items-center gap-2">
                      <span>{type.icon}</span>
                      {type.label}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Content Input */}
          <div>
            <Textarea
              placeholder={`Quoi de neuf ${currentUser.fullName.split(' ')[0]}? Partage tes pensées avec la communauté étudiante...`}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
              maxLength={2000}
              className="resize-none"
            />
            <div className="text-right text-xs text-muted-foreground mt-1">
              {content.length}/2000
            </div>
          </div>

          {/* Related Course (for academic posts) */}
          {postType === 'academic' && (
            <div>
              <Label htmlFor="course" className="text-sm font-medium">Cours/Matière</Label>
              <Input
                id="course"
                placeholder="Ex: Mathématiques, Histoire, Programmation..."
                value={relatedCourse}
                onChange={(e) => setRelatedCourse(e.target.value)}
                className="mt-1"
              />
            </div>
          )}

          {/* Image Preview */}
          {imagePreview && (
            <div className="relative">
              <img 
                src={imagePreview} 
                alt="Aperçu" 
                className="w-full rounded-lg max-h-64 object-cover"
              />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2 h-6 w-6 p-0"
                onClick={removeImage}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}

          {/* Tags */}
          <div>
            <Label className="text-sm font-medium">Tags (optionnel)</Label>
            <div className="flex gap-2 mt-1">
              <Input
                placeholder="Ajouter un tag..."
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addTag();
                  }
                }}
                className="flex-1"
              />
              <Button type="button" variant="outline" size="sm" onClick={addTag}>
                Ajouter
              </Button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    #{tag}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-auto w-auto p-0 ml-1 hover:bg-transparent"
                      onClick={() => removeTag(tag)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Privacy Warning for Minors */}
          {currentUser.isMinor && (
            <div className="p-3 bg-warning/10 border border-warning/20 rounded-lg">
              <p className="text-sm text-warning-foreground flex items-center gap-2">
                <GraduationCap className="h-4 w-4" />
                Tes posts sont automatiquement privés et vérifiés pour ta sécurité.
              </p>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={loading}
            >
              <ImageIcon className="h-4 w-4" />
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
            />
            
            <Button type="button" variant="ghost" size="sm" disabled>
              <Smile className="h-4 w-4" />
            </Button>
          </div>

          <Button 
            type="submit" 
            disabled={loading || (!content.trim() && !selectedImage)}
            className="px-6"
          >
            {loading ? "Publication..." : "Publier"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default CreatePost;