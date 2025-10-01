import { NextRequest, NextResponse } from 'next/server'
import { SignupCredentials } from '@/types/user'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const credentials: SignupCredentials = await request.json()

    // 입력 검증
    if (!credentials.email || !credentials.password || !credentials.name) {
      return NextResponse.json(
        {
          success: false,
          error: '필수 정보를 모두 입력해주세요.',
        },
        { status: 400 }
      )
    }

    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(credentials.email)) {
      return NextResponse.json(
        {
          success: false,
          error: '올바른 이메일 형식이 아닙니다.',
        },
        { status: 400 }
      )
    }

    // 비밀번호 길이 검증
    if (credentials.password.length < 8) {
      return NextResponse.json(
        {
          success: false,
          error: '비밀번호는 최소 8자 이상이어야 합니다.',
        },
        { status: 400 }
      )
    }

    // Supabase로 회원가입
    const { data, error } = await supabase.auth.signUp({
      email: credentials.email,
      password: credentials.password,
      options: {
        data: {
          name: credentials.name,
          university: credentials.university,
        },
      },
    })

    if (error) {
      return NextResponse.json(
        {
          success: false,
          error: error.message,
        },
        { status: 400 }
      )
    }

    if (data.user) {
      const user = {
        id: data.user.id,
        email: data.user.email || '',
        name: credentials.name,
        university: credentials.university,
        createdAt: data.user.created_at,
      }

      return NextResponse.json({
        success: true,
        message: '회원가입이 완료되었습니다.',
        data: {
          user,
          session: data.session,
        },
      })
    }

    return NextResponse.json(
      {
        success: false,
        error: '회원가입에 실패했습니다.',
      },
      { status: 500 }
    )
  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      {
        success: false,
        error: '회원가입 중 오류가 발생했습니다.',
      },
      { status: 500 }
    )
  }
}
