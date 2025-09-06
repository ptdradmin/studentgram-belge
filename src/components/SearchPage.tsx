import React, { useState } from 'react';
import { Search, Users, BookOpen, Hash, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface SearchPageProps {
  currentUser?: {
    username: string;
    fullName: string;
    avatarUrl?: string;
  };
}

const SearchPage: React.FC<SearchPageProps> = ({ currentUser }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'users' | 'posts' | 'hashtags' | 'schools'>('all');

  // Mock data pour la démonstration
  const mockUsers = [
    { id: '1', username: 'marie_dupont', fullName: 'Marie Dupont', school: 'ULB', field: 'Informatique', avatarUrl: '' },
    { id: '2', username: 'jean_martin', fullName: 'Jean Martin', school: 'UCL', field: 'Médecine', avatarUrl: '' },
    { id: '3', username: 'sophie_bernard', fullName: 'Sophie Bernard', school: 'UGent', field: 'Psychologie', avatarUrl: '' },
  ];

  const mockPosts = [
    { id: '1', author: 'Marie Dupont', content: 'Quelqu\'un a des notes sur les algorithmes de tri ?', likes: 12 },
    { id: '2', author: 'Jean Martin', content: 'Groupe d\'étude pour l\'examen d\'anatomie ?', likes: 8 },
    { id: '3', author: 'Sophie Bernard', content: 'Présentation de mon projet de fin d\'études', likes: 24 },
  ];

  const mockHashtags = [
    { tag: '#examens', posts: 156 },
    { tag: '#informatique', posts: 89 },
    { tag: '#medecine', posts: 67 },
    { tag: '#psychologie', posts: 45 },
    { tag: '#groupeetude', posts: 123 },
  ];

  const mockSchools = [
    { name: 'Université Libre de Bruxelles (ULB)', students: 1200, location: 'Bruxelles' },
    { name: 'Université Catholique de Louvain (UCL)', students: 980, location: 'Louvain-la-Neuve' },
    { name: 'Universiteit Gent (UGent)', students: 756, location: 'Gand' },
    { name: 'Vrije Universiteit Brussel (VUB)', students: 543, location: 'Bruxelles' },
  ];

  const filteredUsers = mockUsers.filter(user => 
    user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.school.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.field.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredPosts = mockPosts.filter(post =>
    post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredHashtags = mockHashtags.filter(hashtag =>
    hashtag.tag.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredSchools = mockSchools.filter(school =>
    school.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    school.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filters = [
    { id: 'all', label: 'Tout', icon: Search },
    { id: 'users', label: 'Utilisateurs', icon: Users },
    { id: 'posts', label: 'Posts', icon: BookOpen },
    { id: 'hashtags', label: 'Hashtags', icon: Hash },
    { id: 'schools', label: 'Écoles', icon: MapPin },
  ];

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <div className="bg-white rounded-lg border p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Rechercher</h1>
        
        {/* Search Input */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Rechercher des étudiants, posts, hashtags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 py-3 text-lg"
          />
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => {
            const Icon = filter.icon;
            return (
              <Button
                key={filter.id}
                variant={activeFilter === filter.id ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveFilter(filter.id as any)}
                className={`flex items-center gap-2 ${
                  activeFilter === filter.id 
                    ? 'text-white' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                style={activeFilter === filter.id ? {background: 'var(--gradient-primary)'} : {}}
              >
                <Icon className="h-4 w-4" />
                {filter.label}
              </Button>
            );
          })}
        </div>
      </div>

      {/* Search Results */}
      <div className="space-y-6">
        {/* Users Results */}
        {(activeFilter === 'all' || activeFilter === 'users') && filteredUsers.length > 0 && (
          <div className="bg-white rounded-lg border p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Utilisateurs ({filteredUsers.length})
            </h2>
            <div className="space-y-3">
              {filteredUsers.map(user => (
                <div key={user.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={user.avatarUrl} />
                      <AvatarFallback className="bg-gradient-to-br from-pink-500 to-orange-500 text-white">
                        {user.fullName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-gray-900">{user.fullName}</p>
                      <p className="text-sm text-gray-500">@{user.username}</p>
                      <p className="text-xs text-gray-400">{user.field} • {user.school}</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Suivre
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Posts Results */}
        {(activeFilter === 'all' || activeFilter === 'posts') && filteredPosts.length > 0 && (
          <div className="bg-white rounded-lg border p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              Posts ({filteredPosts.length})
            </h2>
            <div className="space-y-3">
              {filteredPosts.map(post => (
                <div key={post.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <p className="text-sm text-gray-600 mb-2">Par {post.author}</p>
                  <p className="text-gray-900 mb-2">{post.content}</p>
                  <p className="text-xs text-gray-500">{post.likes} likes</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Hashtags Results */}
        {(activeFilter === 'all' || activeFilter === 'hashtags') && filteredHashtags.length > 0 && (
          <div className="bg-white rounded-lg border p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Hash className="h-5 w-5 text-primary" />
              Hashtags ({filteredHashtags.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredHashtags.map(hashtag => (
                <div key={hashtag.tag} className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <p className="font-medium text-primary">{hashtag.tag}</p>
                  <p className="text-sm text-gray-500">{hashtag.posts} posts</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Schools Results */}
        {(activeFilter === 'all' || activeFilter === 'schools') && filteredSchools.length > 0 && (
          <div className="bg-white rounded-lg border p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              Établissements ({filteredSchools.length})
            </h2>
            <div className="space-y-3">
              {filteredSchools.map(school => (
                <div key={school.name} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <p className="font-medium text-gray-900">{school.name}</p>
                  <p className="text-sm text-gray-600">{school.location}</p>
                  <p className="text-xs text-gray-500">{school.students} étudiants sur StudentGram</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No Results */}
        {searchQuery && 
         filteredUsers.length === 0 && 
         filteredPosts.length === 0 && 
         filteredHashtags.length === 0 && 
         filteredSchools.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg border">
            <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun résultat trouvé</h3>
            <p className="text-gray-600">
              Essayez avec d'autres mots-clés ou vérifiez l'orthographe.
            </p>
          </div>
        )}

        {/* Popular Searches */}
        {!searchQuery && (
          <div className="bg-white rounded-lg border p-6">
            <h2 className="text-lg font-semibold mb-4">Recherches populaires</h2>
            <div className="flex flex-wrap gap-2">
              {['#examens', '#informatique', '#medecine', '#groupeetude', '#projets'].map(tag => (
                <Button
                  key={tag}
                  variant="outline"
                  size="sm"
                  onClick={() => setSearchQuery(tag)}
                  className="text-primary hover:bg-primary/10"
                >
                  {tag}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
