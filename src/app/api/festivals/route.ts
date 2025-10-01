import { NextRequest, NextResponse } from 'next/server'
import { getFestivals } from '@/lib/festivals'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const region = searchParams.get('region')
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    const festivals = await getFestivals({
      region: region || undefined,
      search: search || undefined,
    })

    // 페이징 처리
    const totalCount = festivals.length
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedFestivals = festivals.slice(startIndex, endIndex)

    return NextResponse.json({
      success: true,
      data: {
        festivals: paginatedFestivals,
        pagination: {
          page,
          limit,
          totalCount,
          totalPages: Math.ceil(totalCount / limit),
          hasNextPage: endIndex < totalCount,
          hasPreviousPage: page > 1,
        },
      },
    })
  } catch (error) {
    console.error('Error fetching festivals:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch festivals',
      },
      { status: 500 }
    )
  }
}
