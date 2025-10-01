import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET /api/admin/festivals - 관리자용 축제 목록 조회
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const university = searchParams.get('university');

    // 사용자 인증 확인
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json(
        { success: false, error: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }

    const userRole = session.user.user_metadata?.role;
    const userUniversity = session.user.user_metadata?.university;

    // 관리자 권한 확인
    if (!['university_admin', 'super_admin'].includes(userRole)) {
      return NextResponse.json(
        { success: false, error: '관리자 권한이 필요합니다.' },
        { status: 403 }
      );
    }

    // 쿼리 빌더
    let query = supabase
      .from('festivals')
      .select('*')
      .order('created_at', { ascending: false });

    // 대학 관리자는 자기 학교만 조회
    if (userRole === 'university_admin') {
      query = query.eq('university', userUniversity);
    } else if (university) {
      // 최고 관리자가 특정 대학으로 필터링
      query = query.eq('university', university);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Festivals query error:', error);
      return NextResponse.json(
        { success: false, error: '축제 목록 조회 중 오류가 발생했습니다.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: data || [],
    });
  } catch (error) {
    console.error('Admin festivals GET error:', error);
    return NextResponse.json(
      { success: false, error: '축제 목록 조회 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// POST /api/admin/festivals - 축제 등록
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // 사용자 인증 확인
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json(
        { success: false, error: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }

    const userRole = session.user.user_metadata?.role;
    const userUniversity = session.user.user_metadata?.university;

    // 관리자 권한 확인
    if (!['university_admin', 'super_admin'].includes(userRole)) {
      return NextResponse.json(
        { success: false, error: '관리자 권한이 필요합니다.' },
        { status: 403 }
      );
    }

    // 대학 관리자는 자기 학교만 등록 가능
    if (userRole === 'university_admin' && body.university !== userUniversity) {
      return NextResponse.json(
        { success: false, error: '자신의 대학 축제만 등록할 수 있습니다.' },
        { status: 403 }
      );
    }

    // 필수 필드 검증
    const requiredFields = ['name', 'university', 'region', 'start_date', 'end_date', 'location'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, error: `${field} 필드는 필수입니다.` },
          { status: 400 }
        );
      }
    }

    // 날짜 검증
    const startDate = new Date(body.start_date);
    const endDate = new Date(body.end_date);

    if (endDate < startDate) {
      return NextResponse.json(
        { success: false, error: '종료일은 시작일보다 이후여야 합니다.' },
        { status: 400 }
      );
    }

    // 축제 등록
    const { data, error } = await supabase
      .from('festivals')
      .insert({
        name: body.name,
        university: body.university,
        region: body.region,
        start_date: body.start_date,
        end_date: body.end_date,
        location: body.location,
        description: body.description || null,
        lineup: body.lineup || null,
        booths: body.booths || null,
        transportation: body.transportation || null,
        admission: body.admission || null,
        created_by: session.user.id,
      })
      .select()
      .single();

    if (error) {
      console.error('Festival insert error:', error);
      return NextResponse.json(
        { success: false, error: '축제 등록 중 오류가 발생했습니다.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: '축제가 성공적으로 등록되었습니다.',
      data,
    });
  } catch (error) {
    console.error('Admin festivals POST error:', error);
    return NextResponse.json(
      { success: false, error: '축제 등록 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
