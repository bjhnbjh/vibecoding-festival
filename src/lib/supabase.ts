import { createClient } from '@supabase/supabase-js'

// 더미 데이터 모드 (환경 변수와 무관하게 더미 데이터만 사용)
const supabaseUrl = 'https://dummy-project.supabase.co'
const supabaseAnonKey = 'dummy-key-for-development-only'

// 환경 변수 로깅 (디버깅용)
if (typeof window !== 'undefined') {
  console.log('Supabase Config:', {
    url: supabaseUrl,
    key: supabaseAnonKey.substring(0, 20) + '...'
  });
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
  },
})

// 데이터베이스 타입 정의
export type Database = {
  public: {
    Tables: {
      festivals: {
        Row: {
          id: string
          name: string
          university: string
          region: string
          start_date: string
          end_date: string
          location: string
          description: string
          lineup: any
          booths: any
          transportation: any
          admission: any
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          university: string
          region: string
          start_date: string
          end_date: string
          location: string
          description: string
          lineup: any
          booths: any
          transportation: any
          admission: any
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          university?: string
          region?: string
          start_date?: string
          end_date?: string
          location?: string
          description?: string
          lineup?: any
          booths?: any
          transportation?: any
          admission?: any
          created_at?: string
          updated_at?: string
        }
      }
      favorites: {
        Row: {
          id: string
          user_id: string
          festival_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          festival_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          festival_id?: string
          created_at?: string
        }
      }
    }
  }
}
