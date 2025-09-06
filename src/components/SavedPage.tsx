import React, { useState } from 'react';
import { Bookmark, Search, Filter, Heart, MessageCircle, Share, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface SavedPageProps {
  currentUser?: {
    username: string;
    fullName: string;
    avatarUrl?: string;
  };
}

interface SavedPost {
  id: string;
  author: {
    username: string;
    fullName: string;
    avatarUrl?: string;
  };
  content: string;
  timestamp: string;
  likes: number;
  comments: number;
  savedDate: string;
  category: string;
  image?: string;
}

const SavedPage: React.FC<SavedPageProps> = ({ currentUser }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Mock saved posts data
  const savedPosts: SavedPost[] = [
    {
      id: '1',
      author: {
        username: 'marie_dupont',
        fullName: 'Marie Dupont',
        avatarUrl: ''
      },
      content: 'Guide complet sur les algorithmes de tri en Python 🐍. Avec exemples de code et complexité temporelle pour chaque algorithme !',
      timestamp: '2j',
      likes: 45,
      comments: 12,
      savedDate: 'Sauvegardé il y a 2 jours',
      category: 'Informatique',
      image: '/placeholder.svg'
    },
    {
      id: '2',
      author: {
        username: 'jean_martin',
        fullName: 'Jean Martin',
        avatarUrl: ''
      },
      content: 'Mes notes complètes sur l\'anatomie du système nerveux. Parfait pour réviser avant les examens ! 📚',
      timestamp: '1 sem',
      likes: 78,
      comments: 23,
      savedDate: 'Sauvegardé il y a 1 semaine',
      category: 'Médecine'
    },
    {
      id: '3',
      author: {
        username: 'sophie_bernard',
        fullName: 'Sophie Bernard',
        avatarUrl: ''
      },
      content: 'Techniques de mémorisation efficaces pour les études de psychologie. Ces méthodes m\'ont sauvé la vie ! 🧠',
      timestamp: '3j',
      likes: 34,
      comments: 8,
      savedDate: 'Sauvegardé il y a 3 jours',
      category: 'Psychologie'
    },
    {
      id: '4',
      author: {
        username: 'lucas_petit',
        fullName: 'Lucas Petit',
        avatarUrl: ''
      },
      content: 'Ressources gratuites pour apprendre les mathématiques avancées. Une mine d\'or pour tous les étudiants ! 📊',
      timestamp: '5j',
      likes: 56,
      comments: 15,
      savedDate: 'Sauvegardé il y a 5 jours',
      category: 'Mathématiques'
    },
    {
      id: '5',
      author: {
        username: 'emma_moreau',
        fullName: 'Emma Moreau',
        avatarUrl: ''
      },
      content: 'Comment organiser efficacement ses révisions d\'examens ? Mes conseils après 3 ans d\'université 🎓',
      timestamp: '1 sem',
      likes: 92,
      comments: 31,
      savedDate: 'Sauvegardé il y a 1 semaine',
      category: 'Conseils'
    }
  ];

  const categories = ['all', ...Array.from(new Set(savedPosts.map(post => post.category)))];

  const filteredPosts = savedPosts.filter(post => {
    const matchesSearch = post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.author.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleUnsave = (postId: string) => {
    // Ici on ajouterait la logique pour retirer de la sauvegarde
    console.log('Unsaving post:', postId);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-center gap-3 mb-4">
          <Bookmark className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold text-gray-900">Posts sauvegardés</h1>
          <Badge variant="secondary">{savedPosts.length} posts</Badge>
        </div>
        
        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Rechercher dans vos posts sauvegardés..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex gap-2 flex-wrap">
            {categories.map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className={selectedCategory === category ? 'text-white' : ''}
                style={selectedCategory === category ? {background: 'var(--gradient-primary)'} : {}}
              >
                {category === 'all' ? 'Tous' : category}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Saved Posts */}
      <div className="space-y-4">
        {filteredPosts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border">
            <Bookmark className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {searchQuery || selectedCategory !== 'all' 
                ? 'Aucun post trouvé' 
                : 'Aucun post sauvegardé'
              }
            </h3>
            <p className="text-gray-600">
              {searchQuery || selectedCategory !== 'all'
                ? 'Essayez avec d\'autres mots-clés ou changez de catégorie.'
                : 'Sauvegardez des posts intéressants pour les retrouver facilement ici.'
              }
            </p>
          </div>
        ) : (
          filteredPosts.map(post => (
            <div key={post.id} className="bg-white rounded-lg border p-6">
              {/* Post Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={post.author.avatarUrl} />
                    <AvatarFallback className="bg-gradient-to-br from-pink-500 to-orange-500 text-white">
                      {post.author.fullName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-gray-900">{post.author.fullName}</p>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <span>@{post.author.username}</span>
                      <span>•</span>
                      <span>{post.timestamp}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {post.category}
                  </Badge>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Post Content */}
              <div className="mb-4">
                <p className="text-gray-800 leading-relaxed">{post.content}</p>
                {post.image && (
                  <img 
                    src={post.image} 
                    alt="Post content" 
                    className="mt-3 rounded-lg max-w-full h-64 object-cover"
                  />
                )}
              </div>

              {/* Post Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center gap-6">
                  <button className="flex items-center gap-2 text-gray-600 hover:text-red-500 transition-colors">
                    <Heart className="h-4 w-4" />
                    <span className="text-sm">{post.likes}</span>
                  </button>
                  <button className="flex items-center gap-2 text-gray-600 hover:text-blue-500 transition-colors">
                    <MessageCircle className="h-4 w-4" />
                    <span className="text-sm">{post.comments}</span>
                  </button>
                  <button className="flex items-center gap-2 text-gray-600 hover:text-green-500 transition-colors">
                    <Share className="h-4 w-4" />
                    <span className="text-sm">Partager</span>
                  </button>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">{post.savedDate}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleUnsave(post.id)}
                    className="text-primary hover:text-primary/80"
                  >
                    <Bookmark className="h-4 w-4 fill-current" />
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg border p-6">
        <h2 className="text-lg font-semibold mb-4">Actions rapides</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button variant="outline" className="justify-start">
            <Filter className="h-4 w-4 mr-2" />
            Organiser par date
          </Button>
          <Button variant="outline" className="justify-start">
            <Search className="h-4 w-4 mr-2" />
            Recherche avancée
          </Button>
          <Button variant="outline" className="justify-start">
            <Share className="h-4 w-4 mr-2" />
            Exporter la liste
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SavedPage;
