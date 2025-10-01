import { NextRequest, NextResponse } from 'next/server'
import { getFavoriteFestivals } from '@/lib/festivals'

export async function GET(request: NextRequest) {
  try {
    // 임시로 더미 사용자 ID 사용 (실제로는 인증 미들웨어에서 가져와야 함)
    const userId = 'temp-user-id'

    const favorites = await getFavoriteFestivals(userId)

    return NextResponse.json({
      success: true,
      data: {
        favorites,
      },
    })
  } catch (error) {
    console.error('Error fetching favorites:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch favorites',
      },
      { status: 500 }
    )
  }
}
