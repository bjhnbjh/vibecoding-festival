import { NextRequest, NextResponse } from 'next/server'
import { LoginCredentials } from '@/types/user'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const credentials: LoginCredentials = await request.json()

    // 입력 검증
    if (!credentials.email || !credentials.password) {
      return NextResponse.json(
        {
          success: false,
          error: '이메일과 비밀번호를 입력해주세요.',
        },
        { status: 400 }
      )
    }

    // Supabase로 로그인
    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    })

    if (error) {
      return NextResponse.json(
        {
          success: false,
          error: error.message,
        },
        { status: 401 }
      )
    }

    if (data.user) {
      const user = {
        id: data.user.id,
        email: data.user.email || '',
        name: data.user.user_metadata?.name || data.user.email?.split('@')[0] || '사용자',
        avatar: data.user.user_metadata?.avatar_url,
        university: data.user.user_metadata?.university,
        createdAt: data.user.created_at,
      }

      return NextResponse.json({
        success: true,
        message: '로그인 성공',
        data: {
          user,
          session: data.session,
        },
      })
    }

    return NextResponse.json(
      {
        success: false,
        error: '로그인에 실패했습니다.',
      },
      { status: 401 }
    )
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      {
        success: false,
        error: '로그인 중 오류가 발생했습니다.',
      },
      { status: 500 }
    )
  }
}
