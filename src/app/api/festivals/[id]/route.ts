import { NextRequest, NextResponse } from 'next/server'
import { getFestivalById } from '@/lib/festivals'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const festival = await getFestivalById(params.id)

    if (!festival) {
      return NextResponse.json(
        {
          success: false,
          error: 'Festival not found',
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        festival,
      },
    })
  } catch (error) {
    console.error('Error fetching festival:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch festival',
      },
      { status: 500 }
    )
  }
}
