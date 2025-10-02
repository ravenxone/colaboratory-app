export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          twitter: string | null
          linkedin: string | null
          phone: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          twitter?: string | null
          linkedin?: string | null
          phone?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          twitter?: string | null
          linkedin?: string | null
          phone?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      projects: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string
          video_url: string
          user_problem: string
          talked_to_users: boolean
          roles_needed: string[]
          status: 'open' | 'closed'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description: string
          video_url: string
          user_problem: string
          talked_to_users?: boolean
          roles_needed: string[]
          status?: 'open' | 'closed'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string
          video_url?: string
          user_problem?: string
          talked_to_users?: boolean
          roles_needed?: string[]
          status?: 'open' | 'closed'
          created_at?: string
          updated_at?: string
        }
      }
      collaboration_requests: {
        Row: {
          id: string
          project_id: string
          full_name: string
          email: string
          phone: string | null
          skills: string[]
          message: string
          created_at: string
        }
        Insert: {
          id?: string
          project_id: string
          full_name: string
          email: string
          phone?: string | null
          skills: string[]
          message: string
          created_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          full_name?: string
          email?: string
          phone?: string | null
          skills?: string[]
          message?: string
          created_at?: string
        }
      }
    }
  }
}
