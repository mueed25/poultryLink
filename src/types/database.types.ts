// src/types/database.types.ts
// This is a minimal example - typically you'd generate this from your Supabase schema
// You can use Supabase CLI to generate this file automatically

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
      // Define your database tables here if needed
      // For example:
      // profiles: {
      //   Row: {
      //     id: string
      //     user_id: string
      //     username: string | null
      //     avatar_url: string | null
      //     updated_at: string | null
      //   }
      //   Insert: {
      //     id?: string
      //     user_id: string
      //     username?: string | null
      //     avatar_url?: string | null
      //     updated_at?: string | null
      //   }
      //   Update: {
      //     id?: string
      //     user_id?: string
      //     username?: string | null
      //     avatar_url?: string | null
      //     updated_at?: string | null
      //   }
      // }
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