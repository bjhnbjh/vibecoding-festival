import { NextRequest, NextResponse } from 'next/server'
import { addToFavorites, removeFromFavorites } from '@/lib/festivals'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 임시로 더미 사용자 ID 사용 (실제로는 인증 미들웨어에서 가져와야 함)
    const userId = 'temp-user-id'

    await addToFavorites(userId, params.id)

    return NextResponse.json({
      success: true,
      message: '축제가 즐겨찾기에 추가되었습니다',
    })
  } catch (error) {
    console.error('Error adding to favorites:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to add to favorites',
      },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 임시로 더미 사용자 ID 사용 (실제로는 인증 미들웨어에서 가져와야 함)
    const userId = 'temp-user-id'

    await removeFromFavorites(userId, params.id)

    return NextResponse.json({
      success: true,
      message: '축제가 즐겨찾기에서 제거되었습니다',
    })
  } catch (error) {
    console.error('Error removing from favorites:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to remove from favorites',
      },
      { status: 500 }
    )
  }
}
