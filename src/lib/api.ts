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
