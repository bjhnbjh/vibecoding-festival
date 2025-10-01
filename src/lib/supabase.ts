import { createClient } from '@supabase/supabase-js'

// 환경 변수에서 Supabase 설정 가져오기
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// 환경 변수 검증
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase 환경 변수가 설정되지 않았습니다. .env.local 파일을 확인해주세요.');
  console.error('필수 환경 변수: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY');
}

// 환경 변수 로깅 (디버깅용)
if (typeof window !== 'undefined') {
  console.log('Supabase Config:', {
    url: supabaseUrl,
    keyPrefix: supabaseAnonKey.substring(0, 20) + '...',
    isConfigured: !!(supabaseUrl && supabaseAnonKey)
  });
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
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
