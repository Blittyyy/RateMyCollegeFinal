export interface Database {
  public: {
    Tables: {
      colleges: {
        Row: {
          id: string
          name: string
          slug: string
          location: string
          description: string
          overall_rating: number
          total_reviews: number
          image_url: string | null
          image_source: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          location: string
          description: string
          overall_rating?: number
          total_reviews?: number
          image_url?: string | null
          image_source?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          location?: string
          description?: string
          overall_rating?: number
          total_reviews?: number
          image_url?: string | null
          image_source?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      users: {
  Row: {
    id: string
    email: string
    name: string
    email_verified: boolean
    verification_type: 'student' | 'alumni' | null
    college_id: string | null
    linkedin_profile_id: string | null
    linkedin_verification_date: string | null
    created_at: string
    updated_at: string
  }
  Insert: {
    id?: string
    email: string
    name: string
    email_verified?: boolean
    verification_type?: 'student' | 'alumni' | null
    college_id?: string | null
    linkedin_profile_id?: string | null
    linkedin_verification_date?: string | null
    created_at?: string
    updated_at?: string
  }
  Update: {
    id?: string
    email?: string
    name?: string
    email_verified?: boolean
    verification_type?: 'student' | 'alumni' | null
    college_id?: string | null
    linkedin_profile_id?: string | null
    linkedin_verification_date?: string | null
    created_at?: string
    updated_at?: string
  }
}
      verification_tokens: {
        Row: {
          id: string
          user_id: string
          token: string
          type: 'email_verification' | 'password_reset'
          expires_at: string
          used: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          token: string
          type: 'email_verification' | 'password_reset'
          expires_at: string
          used?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          token?: string
          type?: 'email_verification' | 'password_reset'
          expires_at?: string
          used?: boolean
          created_at?: string
        }
      }
      reviews: {
        Row: {
          id: string
          college_id: string
          user_id: string
          category: string | null
          rating: number
          overall_rating: number
          comment: string
          tags: string[] | null
          anonymous: boolean
          helpful_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          college_id: string
          user_id: string
          category?: string | null
          rating: number
          overall_rating: number
          comment: string
          tags?: string[] | null
          anonymous?: boolean
          helpful_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          college_id?: string
          user_id?: string
          category?: string | null
          rating?: number
          overall_rating?: number
          comment?: string
          tags?: string[] | null
          anonymous?: boolean
          helpful_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      college_ratings: {
        Row: {
          id: string
          college_id: string
          category: string
          average_rating: number
          review_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          college_id: string
          category: string
          average_rating: number
          review_count: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          college_id?: string
          category?: string
          average_rating?: number
          review_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      helpful_votes: {
        Row: {
          id: string
          review_id: string
          user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          review_id: string
          user_id: string
          created_at?: string
        }
        Update: {
          id?: string
          review_id?: string
          user_id?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
} 