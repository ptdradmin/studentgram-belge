// API utility functions for StudentGram
export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  success: boolean;
}

export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  bio?: string;
  followersCount: number;
  followingCount: number;
  postsCount: number;
  isFollowing?: boolean;
}

export interface Post {
  id: string;
  userId: string;
  username?: string;
  avatar?: string;
  content: string;
  imageUrl?: string;
  videoUrl?: string;
  type: 'general' | 'academic' | 'achievement' | 'help' | 'social';
  tags: string[];
  isPublic: boolean;
  relatedCourse?: string;
  academicLevel?: string;
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  isLiked?: boolean;
  isSaved?: boolean;
  isModerated: boolean;
  moderationStatus: 'approved' | 'pending' | 'rejected';
  moderationNotes?: string;
  createdAt: string;
  updatedAt: string;
}

// Mock API functions for testing
export const getUserProfile = async (userId: string): Promise<ApiResponse<User>> => {
  // Mock implementation
  return {
    success: true,
    data: {
      id: userId,
      username: 'testuser',
      email: 'test@example.com',
      followersCount: 100,
      followingCount: 50,
      postsCount: 25,
      isFollowing: false,
    }
  };
};

export const getUserPosts = async (userId: string): Promise<ApiResponse<Post[]>> => {
  // Mock implementation
  return {
    success: true,
    data: []
  };
};

export const followUser = async (userId: string): Promise<ApiResponse> => {
  // Mock implementation
  return { success: true };
};

export const unfollowUser = async (userId: string): Promise<ApiResponse> => {
  // Mock implementation
  return { success: true };
};

export const updateUserProfile = async (data: Partial<User>): Promise<ApiResponse<User>> => {
  // Mock implementation
  return {
    success: true,
    data: data as User
  };
};

export const getFeedPosts = async (): Promise<Post[]> => {
  console.log('API call: getFeedPosts');
  
  // Simuler un délai réseau
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Retourner des données de test
  return [
    {
      id: '1',
      userId: 'user1',
      username: 'alice_m',
      avatar: 'A',
      content: 'Super cours de programmation aujourd\'hui ! #React',
      type: 'academic' as const,
      tags: ['React', 'programmation', 'cours'],
      isPublic: true,
      relatedCourse: 'Développement Web',
      academicLevel: 'Supérieur',
      createdAt: new Date(Date.now() - 3600 * 1000 * 2).toISOString(), // 2 hours ago
      updatedAt: new Date(Date.now() - 3600 * 1000 * 2).toISOString(),
      likesCount: 42,
      commentsCount: 5,
      sharesCount: 3,
      isLiked: true,
      isSaved: false,
      isModerated: true,
      moderationStatus: 'approved' as const,
    },
    {
      id: '2',
      userId: 'user2',
      username: 'bob_d',
      avatar: 'B',
      content: 'Pause café bien méritée entre deux révisions.',
      imageUrl: 'https://via.placeholder.com/600x400.png?text=Pause+Café',
      type: 'social' as const,
      tags: ['pause', 'café', 'révisions'],
      isPublic: true,
      createdAt: new Date(Date.now() - 3600 * 1000 * 5).toISOString(), // 5 hours ago
      updatedAt: new Date(Date.now() - 3600 * 1000 * 5).toISOString(),
      likesCount: 108,
      commentsCount: 12,
      sharesCount: 8,
      isLiked: false,
      isSaved: true,
      isModerated: true,
      moderationStatus: 'approved' as const,
    },
    {
      id: '3',
      userId: 'user3',
      username: 'claire_l',
      avatar: 'C',
      content: 'Projet de fin d\'année terminé ! 🎉 Merci à toute l\'équipe pour cette collaboration fantastique.',
      type: 'achievement' as const,
      tags: ['projet', 'fin-année', 'équipe'],
      isPublic: true,
      relatedCourse: 'Projet Intégré',
      academicLevel: 'Supérieur',
      createdAt: new Date(Date.now() - 3600 * 1000 * 8).toISOString(), // 8 hours ago
      updatedAt: new Date(Date.now() - 3600 * 1000 * 8).toISOString(),
      likesCount: 156,
      commentsCount: 23,
      sharesCount: 15,
      isLiked: true,
      isSaved: false,
      isModerated: true,
      moderationStatus: 'approved' as const,
    }
  ];
};
