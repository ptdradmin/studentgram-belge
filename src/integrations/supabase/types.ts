export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      comments: {
        Row: {
          content: string
          created_at: string | null
          id: string
          is_moderated: boolean | null
          moderation_status: string | null
          parent_id: string | null
          post_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          is_moderated?: boolean | null
          moderation_status?: string | null
          parent_id?: string | null
          post_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          is_moderated?: boolean | null
          moderation_status?: string | null
          parent_id?: string | null
          post_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comments_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts_with_details"
            referencedColumns: ["id"]
          },
        ]
      }
      follows: {
        Row: {
          created_at: string | null
          follow_type: string | null
          follower_id: string
          following_id: string
          id: string
          notifications_enabled: boolean | null
          show_in_feed: boolean | null
        }
        Insert: {
          created_at?: string | null
          follow_type?: string | null
          follower_id: string
          following_id: string
          id?: string
          notifications_enabled?: boolean | null
          show_in_feed?: boolean | null
        }
        Update: {
          created_at?: string | null
          follow_type?: string | null
          follower_id?: string
          following_id?: string
          id?: string
          notifications_enabled?: boolean | null
          show_in_feed?: boolean | null
        }
        Relationships: []
      }
      group_memberships: {
        Row: {
          group_id: string
          id: string
          joined_at: string | null
          role: string | null
          status: string | null
          user_id: string
        }
        Insert: {
          group_id: string
          id?: string
          joined_at?: string | null
          role?: string | null
          status?: string | null
          user_id: string
        }
        Update: {
          group_id?: string
          id?: string
          joined_at?: string | null
          role?: string | null
          status?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_memberships_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_memberships_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      groups: {
        Row: {
          academic_year: string | null
          created_at: string | null
          created_by: string
          description: string | null
          field: string | null
          group_type: string
          id: string
          is_public: boolean | null
          join_approval: boolean | null
          level: string | null
          max_members: number | null
          members_count: number | null
          moderators: string[] | null
          name: string
          posts_count: number | null
          school: string | null
          updated_at: string | null
        }
        Insert: {
          academic_year?: string | null
          created_at?: string | null
          created_by: string
          description?: string | null
          field?: string | null
          group_type: string
          id?: string
          is_public?: boolean | null
          join_approval?: boolean | null
          level?: string | null
          max_members?: number | null
          members_count?: number | null
          moderators?: string[] | null
          name: string
          posts_count?: number | null
          school?: string | null
          updated_at?: string | null
        }
        Update: {
          academic_year?: string | null
          created_at?: string | null
          created_by?: string
          description?: string | null
          field?: string | null
          group_type?: string
          id?: string
          is_public?: boolean | null
          join_approval?: boolean | null
          level?: string | null
          max_members?: number | null
          members_count?: number | null
          moderators?: string[] | null
          name?: string
          posts_count?: number | null
          school?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "groups_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      likes: {
        Row: {
          created_at: string | null
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts_with_details"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          is_read: boolean | null
          message: string
          notify_parent: boolean | null
          parent_notified: boolean | null
          priority: string | null
          related_group_id: string | null
          related_post_id: string | null
          related_user_id: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          notify_parent?: boolean | null
          parent_notified?: boolean | null
          priority?: string | null
          related_group_id?: string | null
          related_post_id?: string | null
          related_user_id?: string | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          notify_parent?: boolean | null
          parent_notified?: boolean | null
          priority?: string | null
          related_group_id?: string | null
          related_post_id?: string | null
          related_user_id?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_related_group_id_fkey"
            columns: ["related_group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_related_post_id_fkey"
            columns: ["related_post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_related_post_id_fkey"
            columns: ["related_post_id"]
            isOneToOne: false
            referencedRelation: "posts_with_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_related_user_id_fkey"
            columns: ["related_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      posts: {
        Row: {
          academic_level: string | null
          comments_count: number | null
          content: string | null
          created_at: string | null
          id: string
          image_url: string | null
          is_moderated: boolean | null
          is_public: boolean | null
          likes_count: number | null
          moderation_notes: string | null
          moderation_status: string | null
          related_course: string | null
          shares_count: number | null
          tags: string[] | null
          title: string | null
          type: string | null
          updated_at: string | null
          user_id: string | null
          video_url: string | null
        }
        Insert: {
          academic_level?: string | null
          comments_count?: number | null
          content?: string | null
          created_at?: string | null
          id?: string
          image_url?: string | null
          is_moderated?: boolean | null
          is_public?: boolean | null
          likes_count?: number | null
          moderation_notes?: string | null
          moderation_status?: string | null
          related_course?: string | null
          shares_count?: number | null
          tags?: string[] | null
          title?: string | null
          type?: string | null
          updated_at?: string | null
          user_id?: string | null
          video_url?: string | null
        }
        Update: {
          academic_level?: string | null
          comments_count?: number | null
          content?: string | null
          created_at?: string | null
          id?: string
          image_url?: string | null
          is_moderated?: boolean | null
          is_public?: boolean | null
          likes_count?: number | null
          moderation_notes?: string | null
          moderation_status?: string | null
          related_course?: string | null
          shares_count?: number | null
          tags?: string[] | null
          title?: string | null
          type?: string | null
          updated_at?: string | null
          user_id?: string | null
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "posts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          account_private: boolean | null
          allow_messages: boolean | null
          avatar_url: string | null
          bio: string | null
          class_year: string | null
          cover_url: string | null
          created_at: string | null
          display_name: string | null
          email: string | null
          field: string | null
          followers_count: number | null
          following_count: number | null
          full_name: string | null
          graduation_year: number | null
          id: string
          is_minor: boolean | null
          is_verified: boolean | null
          is_verified_student: boolean | null
          last_active: string | null
          level: string | null
          parent_email: string | null
          posts_count: number | null
          school: string | null
          show_email: boolean | null
          student_id: string | null
          university: string | null
          updated_at: string | null
          username: string
          verification_status: string | null
        }
        Insert: {
          account_private?: boolean | null
          allow_messages?: boolean | null
          avatar_url?: string | null
          bio?: string | null
          class_year?: string | null
          cover_url?: string | null
          created_at?: string | null
          display_name?: string | null
          email?: string | null
          field?: string | null
          followers_count?: number | null
          following_count?: number | null
          full_name?: string | null
          graduation_year?: number | null
          id: string
          is_minor?: boolean | null
          is_verified?: boolean | null
          is_verified_student?: boolean | null
          last_active?: string | null
          level?: string | null
          parent_email?: string | null
          posts_count?: number | null
          school?: string | null
          show_email?: boolean | null
          student_id?: string | null
          university?: string | null
          updated_at?: string | null
          username: string
          verification_status?: string | null
        }
        Update: {
          account_private?: boolean | null
          allow_messages?: boolean | null
          avatar_url?: string | null
          bio?: string | null
          class_year?: string | null
          cover_url?: string | null
          created_at?: string | null
          display_name?: string | null
          email?: string | null
          field?: string | null
          followers_count?: number | null
          following_count?: number | null
          full_name?: string | null
          graduation_year?: number | null
          id?: string
          is_minor?: boolean | null
          is_verified?: boolean | null
          is_verified_student?: boolean | null
          last_active?: string | null
          level?: string | null
          parent_email?: string | null
          posts_count?: number | null
          school?: string | null
          show_email?: boolean | null
          student_id?: string | null
          university?: string | null
          updated_at?: string | null
          username?: string
          verification_status?: string | null
        }
        Relationships: []
      }
      safety_reports: {
        Row: {
          action_taken: string | null
          created_at: string | null
          description: string | null
          id: string
          reason: string
          reported_by: string
          reported_comment: string | null
          reported_post: string | null
          reported_user: string | null
          resolved_at: string | null
          review_notes: string | null
          reviewed_by: string | null
          severity: string | null
          status: string | null
        }
        Insert: {
          action_taken?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          reason: string
          reported_by: string
          reported_comment?: string | null
          reported_post?: string | null
          reported_user?: string | null
          resolved_at?: string | null
          review_notes?: string | null
          reviewed_by?: string | null
          severity?: string | null
          status?: string | null
        }
        Update: {
          action_taken?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          reason?: string
          reported_by?: string
          reported_comment?: string | null
          reported_post?: string | null
          reported_user?: string | null
          resolved_at?: string | null
          review_notes?: string | null
          reviewed_by?: string | null
          severity?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "safety_reports_reported_by_fkey"
            columns: ["reported_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "safety_reports_reported_comment_fkey"
            columns: ["reported_comment"]
            isOneToOne: false
            referencedRelation: "comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "safety_reports_reported_post_fkey"
            columns: ["reported_post"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "safety_reports_reported_post_fkey"
            columns: ["reported_post"]
            isOneToOne: false
            referencedRelation: "posts_with_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "safety_reports_reported_user_fkey"
            columns: ["reported_user"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      stories: {
        Row: {
          content: string | null
          created_at: string | null
          expires_at: string | null
          id: string
          image_url: string | null
          is_public: boolean | null
          story_type: string | null
          user_id: string
          video_url: string | null
          viewers: string[] | null
          viewers_only: string[] | null
          views_count: number | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          image_url?: string | null
          is_public?: boolean | null
          story_type?: string | null
          user_id: string
          video_url?: string | null
          viewers?: string[] | null
          viewers_only?: string[] | null
          views_count?: number | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          image_url?: string | null
          is_public?: boolean | null
          story_type?: string | null
          user_id?: string
          video_url?: string | null
          viewers?: string[] | null
          viewers_only?: string[] | null
          views_count?: number | null
        }
        Relationships: []
      }
      users: {
        Row: {
          avatar_url: string | null
          bio: string | null
          display_name: string | null
          followers_count: number | null
          following_count: number | null
          id: string
          posts_count: number | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          display_name?: string | null
          followers_count?: number | null
          following_count?: number | null
          id: string
          posts_count?: number | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          display_name?: string | null
          followers_count?: number | null
          following_count?: number | null
          id?: string
          posts_count?: number | null
          username?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      posts_with_details: {
        Row: {
          avatar_url: string | null
          comment_count: number | null
          comments_count: number | null
          content: string | null
          created_at: string | null
          display_name: string | null
          id: string | null
          image_url: string | null
          is_verified_student: boolean | null
          like_count: number | null
          likes_count: number | null
          title: string | null
          university: string | null
          user_id: string | null
          username: string | null
        }
        Relationships: [
          {
            foreignKeyName: "posts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      cleanup_expired_stories: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
