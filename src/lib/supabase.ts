import { createClient } from '@supabase/supabase-js'

// Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key'

// Create Supabase client with error handling
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  return supabaseUrl !== 'https://placeholder.supabase.co' && 
         supabaseAnonKey !== 'placeholder-key' &&
         supabaseUrl.includes('.supabase.co')
}

// Database types for StudentGram
export type Profile = {
  id: string
  email: string
  fullName: string
  username: string
  school: string
  level: 'secondary' | 'higher' | 'university'
  field?: string
  graduationYear?: number
  classYear?: string
  studentId?: string
  isVerified: boolean
  verificationStatus: 'pending' | 'verified' | 'rejected'
  isMinor: boolean
  parentEmail?: string
  bio?: string
  avatarUrl?: string
  coverUrl?: string
  accountPrivate: boolean
  allowMessages: boolean
  showEmail: boolean
  createdAt: string
  updatedAt: string
  lastActive: string
}

export type Post = {
  id: string
  userId: string
  content: string
  imageUrl?: string
  videoUrl?: string
  type: 'general' | 'academic' | 'achievement' | 'help' | 'social'
  tags: string[]
  isPublic: boolean
  relatedCourse?: string
  academicLevel?: string
  likesCount: number
  commentsCount: number
  sharesCount: number
  isModerated: boolean
  moderationStatus: 'approved' | 'pending' | 'rejected'
  moderationNotes?: string
  createdAt: string
  updatedAt: string
  profiles?: Profile
  likes?: Like[]
  comments?: Comment[]
}

export type Like = {
  id: string
  postId: string
  userId: string
  createdAt: string
}

export type Comment = {
  id: string
  postId: string
  userId: string
  parentId?: string
  content: string
  isModerated: boolean
  moderationStatus: 'approved' | 'pending' | 'rejected'
  createdAt: string
  updatedAt: string
  profiles?: Profile
}

export type Follow = {
  id: string
  followerId: string
  followingId: string
  followType: 'standard' | 'close_friend' | 'mentor' | 'mentee'
  notificationsEnabled: boolean
  showInFeed: boolean
  createdAt: string
}

export type Story = {
  id: string
  userId: string
  content?: string
  imageUrl?: string
  videoUrl?: string
  storyType: 'general' | 'academic' | 'achievement' | 'daily'
  isPublic: boolean
  viewersOnly: string[]
  viewsCount: number
  viewers: string[]
  createdAt: string
  expiresAt: string
  profiles?: Profile
}

export type Notification = {
  id: string
  userId: string
  type: 'like' | 'comment' | 'follow' | 'mention' | 'safety' | 'parent_alert'
  title: string
  message: string
  relatedUserId?: string
  relatedPostId?: string
  relatedGroupId?: string
  isRead: boolean
  priority: 'low' | 'normal' | 'high' | 'critical'
  notifyParent: boolean
  parentNotified: boolean
  createdAt: string
}

// Helper functions for authentication and user management
export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export const signIn = async (email: string, password: string) => {
  return await supabase.auth.signInWithPassword({ email, password })
}

export const signUp = async (email: string, password: string) => {
  return await supabase.auth.signUp({ email, password })
}

export const signOut = async () => {
  return await supabase.auth.signOut()
}

export const resetPassword = async (email: string) => {
  return await supabase.auth.resetPasswordForEmail(email)
}

// Profile management
export const getProfile = async (userId: string) => {
  return await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
}

export const updateProfile = async (userId: string, updates: Partial<Profile>) => {
  return await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
}

// Posts management
export const getFeedPosts = async (limit: number = 20) => {
  return await supabase
    .from('posts')
    .select(`
      *,
      profiles (username, fullName, school, level, field, isVerified, isMinor, avatarUrl),
      likes (id, userId),
      comments (id, content, createdAt, profiles (username, fullName, avatarUrl))
    `)
    .eq('moderationStatus', 'approved')
    .order('createdAt', { ascending: false })
    .limit(limit)
}

export const createPost = async (post: Omit<Post, 'id' | 'createdAt' | 'updatedAt'>) => {
  return await supabase
    .from('posts')
    .insert([post])
    .select()
    .single()
}

// Likes management
export const toggleLike = async (postId: string, userId: string) => {
  const { data: existingLike } = await supabase
    .from('likes')
    .select('id')
    .eq('postId', postId)
    .eq('userId', userId)
    .single()

  if (existingLike) {
    return await supabase
      .from('likes')
      .delete()
      .eq('postId', postId)
      .eq('userId', userId)
  } else {
    return await supabase
      .from('likes')
      .insert([{ postId, userId }])
  }
}

// Comments management
export const addComment = async (comment: Omit<Comment, 'id' | 'createdAt' | 'updatedAt'>) => {
  return await supabase
    .from('comments')
    .insert([comment])
    .select()
    .single()
}

// Storage helpers
export const uploadFile = async (bucket: string, path: string, file: File) => {
  return await supabase.storage
    .from(bucket)
    .upload(path, file)
}

export const getPublicUrl = (bucket: string, path: string) => {
  return supabase.storage
    .from(bucket)
    .getPublicUrl(path)
}