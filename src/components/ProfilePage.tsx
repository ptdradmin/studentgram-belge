import React, { useState } from 'react';
import { Camera, MapPin, Calendar, BookOpen, Users, Heart, MessageCircle, Settings, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface ProfilePageProps {
  currentUser?: {
    username: string;
    fullName: string;
    avatarUrl?: string;
    bio?: string;
    school?: string;
    field?: string;
    year?: string;
    location?: string;
    joinDate?: string;
  };
}

const ProfilePage: React.FC<ProfilePageProps> = ({ currentUser }) => {
  const [activeTab, setActiveTab] = useState<'posts' | 'about' | 'photos'>('posts');

  // Mock data pour la démonstration
  const mockPosts = [
    {
      id: '1',
      content: 'Viens de terminer mon projet de fin d\'études en intelligence artificielle ! 🎓',
      timestamp: '2h',
      likes: 24,
      comments: 8,
      image: null
    },
    {
      id: '2',
      content: 'Quelqu\'un pour un groupe d\'étude en statistiques cette semaine ?',
      timestamp: '1j',
      likes: 12,
      comments: 5,
      image: null
    },
    {
      id: '3',
      content: 'Belle journée sur le campus ! 📚☀️',
      timestamp: '3j',
      likes: 18,
      comments: 3,
      image: '/placeholder.svg'
    }
  ];

  const mockPhotos = [
    '/placeholder.svg',
    '/placeholder.svg',
    '/placeholder.svg',
    '/placeholder.svg',
    '/placeholder.svg',
    '/placeholder.svg'
  ];

  const stats = {
    posts: 42,
    followers: 156,
    following: 89
  };

  const profileData = {
    username: currentUser?.username || 'kevin_vandamme',
    fullName: currentUser?.fullName || 'Kevin Vandamme',
    bio: currentUser?.bio || 'Étudiant en Informatique à l\'ULB 💻 | Passionné par l\'IA et le développement web | Toujours prêt à aider mes collègues étudiants !',
    school: currentUser?.school || 'ULB',
    field: currentUser?.field || 'Master Sciences Informatiques',
    year: currentUser?.year || '2ème année',
    location: currentUser?.location || 'Bruxelles, Belgique',
    joinDate: currentUser?.joinDate || 'Septembre 2023',
    avatarUrl: currentUser?.avatarUrl
  };

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="bg-white rounded-lg border overflow-hidden">
        {/* Cover Photo */}
        <div className="h-48 bg-gradient-to-r from-pink-500 to-orange-500 relative">
          <Button
            variant="outline"
            size="sm"
            className="absolute top-4 right-4 bg-white/90 hover:bg-white"
          >
            <Camera className="h-4 w-4 mr-2" />
            Modifier la couverture
          </Button>
        </div>

        {/* Profile Info */}
        <div className="p-6 relative">
          <div className="flex flex-col md:flex-row md:items-end gap-4 -mt-16 md:-mt-12">
            {/* Avatar */}
            <div className="relative">
              <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
                <AvatarImage src={profileData.avatarUrl} />
                <AvatarFallback className="bg-gradient-to-br from-pink-500 to-orange-500 text-white text-2xl">
                  {profileData.fullName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <Button
                size="sm"
                className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0 bg-white border-2 border-gray-200 hover:bg-gray-50"
              >
                <Camera className="h-4 w-4 text-gray-600" />
              </Button>
            </div>

            {/* Name and Actions */}
            <div className="flex-1 md:ml-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{profileData.fullName}</h1>
                  <p className="text-gray-600">@{profileData.username}</p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {profileData.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Rejoint en {profileData.joinDate}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Message
                  </Button>
                  <Button 
                    size="sm"
                    className="text-white"
                    style={{background: 'var(--gradient-primary)'}}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Modifier le profil
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Bio */}
          <div className="mt-4">
            <p className="text-gray-700 leading-relaxed">{profileData.bio}</p>
          </div>

          {/* Education Info */}
          <div className="mt-4 space-y-2">
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="flex items-center gap-1 text-xs">
                <BookOpen className="h-3 w-3" />
                <span className="truncate max-w-[200px]">{profileData.school}</span>
              </Badge>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="text-xs">
                {profileData.field}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {profileData.year}
              </Badge>
            </div>
          </div>

          {/* Stats */}
          <div className="flex gap-6 mt-6 pt-4 border-t border-gray-100">
            <div className="text-center">
              <div className="text-xl font-bold text-gray-900">{stats.posts}</div>
              <div className="text-sm text-gray-500">Posts</div>
            </div>
            <div className="text-center cursor-pointer hover:text-primary">
              <div className="text-xl font-bold text-gray-900">{stats.followers}</div>
              <div className="text-sm text-gray-500">Abonnés</div>
            </div>
            <div className="text-center cursor-pointer hover:text-primary">
              <div className="text-xl font-bold text-gray-900">{stats.following}</div>
              <div className="text-sm text-gray-500">Abonnements</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg border">
        <div className="flex border-b border-gray-200">
          {[
            { id: 'posts', label: 'Posts', icon: BookOpen },
            { id: 'about', label: 'À propos', icon: Users },
            { id: 'photos', label: 'Photos', icon: Camera }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="p-6">
          {/* Posts Tab */}
          {activeTab === 'posts' && (
            <div className="space-y-4">
              {mockPosts.map(post => (
                <div key={post.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={profileData.avatarUrl} />
                      <AvatarFallback className="bg-gradient-to-br from-pink-500 to-orange-500 text-white">
                        {profileData.fullName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium text-gray-900">{profileData.fullName}</span>
                        <span className="text-sm text-gray-500">@{profileData.username}</span>
                        <span className="text-sm text-gray-500">•</span>
                        <span className="text-sm text-gray-500">{post.timestamp}</span>
                      </div>
                      <p className="text-gray-800 mb-3">{post.content}</p>
                      {post.image && (
                        <img 
                          src={post.image} 
                          alt="Post" 
                          className="rounded-lg max-w-full h-64 object-cover mb-3"
                        />
                      )}
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <button className="flex items-center gap-1 hover:text-red-500 transition-colors">
                          <Heart className="h-4 w-4" />
                          {post.likes}
                        </button>
                        <button className="flex items-center gap-1 hover:text-blue-500 transition-colors">
                          <MessageCircle className="h-4 w-4" />
                          {post.comments}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* About Tab */}
          {activeTab === 'about' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">Informations académiques</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <BookOpen className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="font-medium">{profileData.school}</p>
                      <p className="text-sm text-gray-600">{profileData.field} - {profileData.year}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-gray-400" />
                    <p>{profileData.location}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-gray-400" />
                    <p>Membre depuis {profileData.joinDate}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Centres d'intérêt</h3>
                <div className="flex flex-wrap gap-2">
                  {['Intelligence Artificielle', 'Développement Web', 'Machine Learning', 'Programmation', 'Recherche'].map(interest => (
                    <Badge key={interest} variant="secondary">
                      {interest}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Photos Tab */}
          {activeTab === 'photos' && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {mockPhotos.map((photo, index) => (
                <div key={index} className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
                  <img 
                    src={photo} 
                    alt={`Photo ${index + 1}`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
