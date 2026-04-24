export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string | null
          full_name: string
          age: number | null
          bio: string | null
          gym_name: string | null
          location: unknown | null
          avatar_url: string | null
          photos: string[]
          goals: string[]
          schedule: string[]
          train_days: number
          looking_for: 'partner' | 'date' | 'both'
          gender: string | null
          show_gender: string[]
          pr_squat: number | null
          pr_bench: number | null
          pr_deadlift: number | null
          weekly_km: number | null
          verified: boolean
          strava_id: string | null
          strava_token: string | null
          is_active: boolean
          last_seen: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username?: string | null
          full_name: string
          age?: number | null
          bio?: string | null
          gym_name?: string | null
          location?: unknown | null
          avatar_url?: string | null
          photos?: string[]
          goals?: string[]
          schedule?: string[]
          train_days?: number
          looking_for?: 'partner' | 'date' | 'both'
          gender?: string | null
          show_gender?: string[]
          pr_squat?: number | null
          pr_bench?: number | null
          pr_deadlift?: number | null
          weekly_km?: number | null
          verified?: boolean
          strava_id?: string | null
          strava_token?: string | null
          is_active?: boolean
          last_seen?: string
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>
        Relationships: []
      }
      live_status: {
        Row: {
          user_id: string
          at_gym: boolean
          gym_name: string | null
          checked_in_at: string | null
          expires_at: string | null
        }
        Insert: {
          user_id: string
          at_gym?: boolean
          gym_name?: string | null
          checked_in_at?: string | null
          expires_at?: string | null
        }
        Update: {
          at_gym?: boolean
          gym_name?: string | null
          checked_in_at?: string | null
          expires_at?: string | null
        }
        Relationships: []
      }
      swipes: {
        Row: {
          id: string
          swiper_id: string
          swiped_id: string
          direction: 'like' | 'pass' | 'super'
          created_at: string
        }
        Insert: {
          id?: string
          swiper_id: string
          swiped_id: string
          direction: 'like' | 'pass' | 'super'
          created_at?: string
        }
        Update: { direction?: 'like' | 'pass' | 'super' }
        Relationships: []
      }
      matches: {
        Row: {
          id: string
          user1_id: string
          user2_id: string
          is_super: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user1_id: string
          user2_id: string
          is_super?: boolean
          created_at?: string
        }
        Update: { is_super?: boolean }
        Relationships: []
      }
      messages: {
        Row: {
          id: string
          match_id: string
          sender_id: string
          text: string
          read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          match_id: string
          sender_id: string
          text: string
          read?: boolean
          created_at?: string
        }
        Update: { read?: boolean }
        Relationships: []
      }
      groups: {
        Row: {
          id: string
          creator_id: string
          name: string
          description: string | null
          workout_type: string | null
          scheduled_at: string | null
          location_name: string | null
          location: unknown | null
          max_members: number
          cover_url: string | null
          is_public: boolean
          created_at: string
        }
        Insert: {
          id?: string
          creator_id: string
          name: string
          description?: string | null
          workout_type?: string | null
          scheduled_at?: string | null
          location_name?: string | null
          location?: unknown | null
          max_members?: number
          cover_url?: string | null
          is_public?: boolean
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['groups']['Insert']>
        Relationships: []
      }
      group_members: {
        Row: {
          group_id: string
          user_id: string
          joined_at: string
        }
        Insert: {
          group_id: string
          user_id: string
          joined_at?: string
        }
        Update: { joined_at?: string }
        Relationships: []
      }
      leaderboard: {
        Row: {
          id: string
          user_id: string
          week: string
          points: number
          workouts: number
          matches_made: number
        }
        Insert: {
          id?: string
          user_id: string
          week: string
          points?: number
          workouts?: number
          matches_made?: number
        }
        Update: Partial<Database['public']['Tables']['leaderboard']['Insert']>
        Relationships: []
      }
      push_tokens: {
        Row: {
          id: string
          user_id: string
          token: string
          platform: 'ios' | 'android' | 'web' | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          token: string
          platform?: 'ios' | 'android' | 'web' | null
          created_at?: string
        }
        Update: { platform?: 'ios' | 'android' | 'web' | null }
        Relationships: []
      }
      blocks: {
        Row: {
          blocker_id: string
          blocked_id: string
          created_at: string
        }
        Insert: {
          blocker_id: string
          blocked_id: string
          created_at?: string
        }
        Update: { created_at?: string }
        Relationships: []
      }
      reports: {
        Row: {
          id: string
          reporter_id: string
          reported_id: string
          reason: string
          details: string | null
          status: 'pending' | 'reviewed' | 'resolved'
          created_at: string
        }
        Insert: {
          id?: string
          reporter_id: string
          reported_id: string
          reason: string
          details?: string | null
          status?: 'pending' | 'reviewed' | 'resolved'
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['reports']['Insert']>
        Relationships: []
      }
    }
    Views: {
      leaderboard_weekly: {
        Row: {
          user_id: string
          full_name: string
          avatar_url: string | null
          points: number
          workouts: number
          week: string
          rank: number
        }
        Relationships: []
      }
      matches_with_profiles: {
        Row: {
          match_id: string
          created_at: string
          is_super: boolean
          user1_id: string
          user1_name: string
          user1_avatar: string | null
          user2_id: string
          user2_name: string
          user2_avatar: string | null
          last_message: string | null
          last_message_at: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      add_leaderboard_points: {
        Args: { p_user_id: string; p_points: number; p_type: string }
        Returns: void
      }
    }
  }
}
