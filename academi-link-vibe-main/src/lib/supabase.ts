import { supabase } from '@/integrations/supabase/client'
import type { Database } from '@/integrations/supabase/types'

// Re-export the configured supabase client
export { supabase } from '@/integrations/supabase/client'

// Check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  // Since we're using the integrated supabase client, it should always be configured
  return true
}

// Database type aliases
type DBProfile = Database['public']['Tables']['profiles']['Row']
type DBPost = Database['public']['Tables']['posts']['Row']
type DBLike = Database['public']['Tables']['likes']['Row']
type DBComment = Database['public']['Tables']['comments']['Row']

// Insert/Update types for database operations
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert']
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update']
export type PostInsert = Database['public']['Tables']['posts']['Insert']
export type PostUpdate = Database['public']['Tables']['posts']['Update']
export type CommentInsert = Database['public']['Tables']['comments']['Insert']
export type LikeInsert = Database['public']['Tables']['likes']['Insert']

// Application types (camelCase for compatibility with existing components)
export type Profile = {
  id: string
  email: string | null
  fullName: string | null
  username: string
  school: string | null
  level: string | null
  field: string | null
  graduationYear: number | null
  classYear: string | null
  studentId: string | null
  isVerified: boolean | null
  verificationStatus: string | null
  isMinor: boolean | null
  parentEmail: string | null
  bio: string | null
  avatarUrl: string | null
  coverUrl: string | null
  accountPrivate: boolean | null
  allowMessages: boolean | null
  showEmail: boolean | null
  createdAt: string | null
  updatedAt: string | null
  lastActive: string | null
  displayName: string | null
  university: string | null
  isBanned: boolean | null
  banReason: string | null
  bannedAt: string | null
  banExpiresAt: string | null
  isVerifiedStudent: boolean | null
  postsCount: number | null
  followersCount: number | null
  followingCount: number | null
  warningCount: number | null
  lastWarningAt: string | null
  adminNotes: string | null
  bannedBy: string | null
}

export type Post = {
  id: string
  userId: string | null
  content: string | null
  imageUrl: string | null
  videoUrl: string | null
  type: string | null
  title: string | null
  academicLevel: string | null
  relatedCourse: string | null
  tags: string[] | null
  isPublic: boolean | null
  isModerated: boolean | null
  moderationStatus: string | null
  moderationNotes: string | null
  likesCount: number | null
  commentsCount: number | null
  sharesCount: number | null
  createdAt: string | null
  updatedAt: string | null
  // Related data
  profiles?: Profile
  likes?: Like[]
  comments?: Comment[]
}

export type Like = {
  id: string
  postId: string
  userId: string
  createdAt: string | null
}

export type Comment = {
  id: string
  postId: string
  userId: string
  parentId: string | null
  content: string
  isModerated: boolean | null
  moderationStatus: string | null
  createdAt: string | null
  updatedAt: string | null
  profiles?: Profile
}

export type Follow = {
  id: string
  followerId: string
  followingId: string
  followType: string | null
  isAccepted: boolean | null
  showInFeed: boolean | null
  createdAt: string | null
}

export type Story = {
  id: string
  userId: string
  content: string | null
  imageUrl: string | null
  videoUrl: string | null
  musicUrl: string | null
  backgroundColor: string | null
  textColor: string | null
  isPublic: boolean | null
  viewsCount: number | null
  createdAt: string | null
  expiresAt: string | null
  profiles?: Profile
}

export type Notification = {
  id: string
  userId: string
  type: string
  title: string
  message: string | null
  relatedId: string | null
  relatedType: string | null
  isRead: boolean | null
  metadata: any
  createdAt: string | null
}

// Helper functions to convert between DB types and app types
const convertDBProfileToProfile = (dbProfile: DBProfile): Profile => ({
  id: dbProfile.id,
  email: dbProfile.email,
  fullName: dbProfile.full_name,
  username: dbProfile.username,
  school: dbProfile.school,
  level: dbProfile.level,
  field: dbProfile.field,
  graduationYear: dbProfile.graduation_year,
  classYear: dbProfile.class_year,
  studentId: dbProfile.student_id,
  isVerified: dbProfile.is_verified,
  verificationStatus: dbProfile.verification_status,
  isMinor: dbProfile.is_minor,
  parentEmail: dbProfile.parent_email,
  bio: dbProfile.bio,
  avatarUrl: dbProfile.avatar_url,
  coverUrl: dbProfile.cover_url,
  accountPrivate: dbProfile.account_private,
  allowMessages: dbProfile.allow_messages,
  showEmail: dbProfile.show_email,
  createdAt: dbProfile.created_at,
  updatedAt: dbProfile.updated_at,
  lastActive: dbProfile.last_active,
  displayName: dbProfile.display_name,
  university: dbProfile.university,
  isBanned: dbProfile.is_banned,
  banReason: dbProfile.ban_reason,
  bannedAt: dbProfile.banned_at,
  banExpiresAt: dbProfile.ban_expires_at,
  isVerifiedStudent: dbProfile.is_verified_student,
  postsCount: dbProfile.posts_count,
  followersCount: dbProfile.followers_count,
  followingCount: dbProfile.following_count,
  warningCount: dbProfile.warning_count,
  lastWarningAt: dbProfile.last_warning_at,
  adminNotes: dbProfile.admin_notes,
  bannedBy: dbProfile.banned_by
})

const convertDBPostToPost = (dbPost: any): Post => ({
  id: dbPost.id,
  userId: dbPost.user_id,
  content: dbPost.content,
  imageUrl: dbPost.image_url,
  videoUrl: dbPost.video_url,
  type: dbPost.type,
  title: dbPost.title,
  academicLevel: dbPost.academic_level,
  relatedCourse: dbPost.related_course,
  tags: dbPost.tags,
  isPublic: dbPost.is_public,
  isModerated: dbPost.is_moderated,
  moderationStatus: dbPost.moderation_status,
  moderationNotes: dbPost.moderation_notes,
  likesCount: dbPost.likes_count,
  commentsCount: dbPost.comments_count,
  sharesCount: dbPost.shares_count,
  createdAt: dbPost.created_at,
  updatedAt: dbPost.updated_at,
  profiles: dbPost.profiles ? convertDBProfileToProfile(dbPost.profiles) : undefined,
  likes: dbPost.likes?.map((like: DBLike) => ({
    id: like.id,
    postId: like.post_id,
    userId: like.user_id,
    createdAt: like.created_at
  })),
  comments: dbPost.comments?.map((comment: DBComment) => ({
    id: comment.id,
    postId: comment.post_id,
    userId: comment.user_id,
    parentId: comment.parent_id,
    content: comment.content,
    isModerated: comment.is_moderated,
    moderationStatus: comment.moderation_status,
    createdAt: comment.created_at,
    updatedAt: comment.updated_at
  }))
})

// Helper functions for authentication and user management
export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export const signIn = async (email: string, password: string) => {
  return await supabase.auth.signInWithPassword({ email, password })
}

export const signUp = async (email: string, password: string) => {
  const redirectUrl = `${window.location.origin}/`
  return await supabase.auth.signUp({ 
    email, 
    password,
    options: {
      emailRedirectTo: redirectUrl
    }
  })
}

export const signOut = async () => {
  return await supabase.auth.signOut()
}

export const resetPassword = async (email: string) => {
  return await supabase.auth.resetPasswordForEmail(email)
}

// Profile management
export const getProfile = async (userId: string) => {
  const result = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  
  if (result.data) {
    const converted = convertDBProfileToProfile(result.data)
    return {
      ...result,
      data: converted as Profile
    }
  }
  return { ...result, data: null } as { data: Profile | null; error: any }
}

export const updateProfile = async (userId: string, updates: ProfileUpdate) => {
  const result = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single()
  
  if (result.data) {
    const converted = convertDBProfileToProfile(result.data)
    return {
      ...result,
      data: converted as Profile
    }
  }
  return { ...result, data: null } as { data: Profile | null; error: any }
}

// Posts management
export const getFeedPosts = async (limit: number = 20) => {
  // Get posts first
  const { data: posts, error } = await supabase
    .from('posts')
    .select('*')
    .eq('is_public', true)
    .order('created_at', { ascending: false })
    .limit(limit)
  
  if (error || !posts) {
    return { data: [], error }
  }

  // Get unique user IDs
  const userIds = [...new Set(posts.map(post => post.user_id).filter(Boolean))]
  
  // Get profiles for these users
  const { data: profiles } = await supabase
    .from('profiles')
    .select('*')
    .in('id', userIds)
  
  // Combine posts with their profiles
  const postsWithProfiles = posts.map(post => ({
    ...post,
    profiles: profiles?.find(profile => profile.id === post.user_id) || null
  }))

  const converted = postsWithProfiles.map(convertDBPostToPost)
  return {
    data: converted as Post[],
    error: null
  }
}

export const createPost = async (post: PostInsert) => {
  const { data, error } = await supabase
    .from('posts')
    .insert([post])
    .select()
    .single()
  
  if (error || !data) {
    return { data: null, error }
  }

  // Get the profile for this post
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', data.user_id)
    .single()

  const postWithProfile = {
    ...data,
    profiles: profile || null
  }

  const converted = convertDBPostToPost(postWithProfile)
  return {
    data: converted as Post,
    error: null
  }
}

// Likes management
export const toggleLike = async (postId: string, userId: string) => {
  const { data: existingLike } = await supabase
    .from('likes')
    .select('id')
    .eq('post_id', postId)
    .eq('user_id', userId)
    .single()

  if (existingLike) {
    return await supabase
      .from('likes')
      .delete()
      .eq('post_id', postId)
      .eq('user_id', userId)
  } else {
    return await supabase
      .from('likes')
      .insert([{ post_id: postId, user_id: userId }])
  }
}

// Comments management
export const addComment = async (comment: CommentInsert) => {
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