import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          is_premium: boolean
          premium_expires_at: string | null
          polygon_api_key: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          is_premium?: boolean
          premium_expires_at?: string | null
          polygon_api_key?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          is_premium?: boolean
          premium_expires_at?: string | null
          polygon_api_key?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      scans: {
        Row: {
          id: string
          user_id: string
          scan_data: any
          stock_count: number
          market_phase: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          scan_data: any
          stock_count: number
          market_phase: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          scan_data?: any
          stock_count?: number
          market_phase?: string
          created_at?: string
        }
      }
      watchlist: {
        Row: {
          id: string
          user_id: string
          symbol: string
          notes: string | null
          target_price: number | null
          stop_loss: number | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          symbol: string
          notes?: string | null
          target_price?: number | null
          stop_loss?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          symbol?: string
          notes?: string | null
          target_price?: number | null
          stop_loss?: number | null
          created_at?: string
        }
      }
      alerts: {
        Row: {
          id: string
          user_id: string
          symbol: string
          condition: string
          target_value: number
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          symbol: string
          condition: string
          target_value: number
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          symbol?: string
          condition?: string
          target_value?: number
          is_active?: boolean
          created_at?: string
        }
      }
    }
  }
}
