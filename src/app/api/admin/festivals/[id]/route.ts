import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET /api/admin/festivals/[id] - 특정 축제 조회
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const festivalId = params.id;

    // 사용자 인증 확인
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json(
        { success: false, error: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }

    const userRole = session.user.user_metadata?.role;

    // 관리자 권한 확인
    if (!['university_admin', 'super_admin'].includes(userRole)) {
      return NextResponse.json(
        { success: false, error: '관리자 권한이 필요합니다.' },
        { status: 403 }
      );
    }

    const { data, error } = await supabase
      .from('festivals')
      .select('*')
      .eq('id', festivalId)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { success: false, error: '축제를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 대학 관리자는 자기 학교 축제만 조회 가능
    const userUniversity = session.user.user_metadata?.university;
    if (userRole === 'university_admin' && data.university !== userUniversity) {
      return NextResponse.json(
        { success: false, error: '권한이 없습니다.' },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error('Admin festival GET error:', error);
    return NextResponse.json(
      { success: false, error: '축제 조회 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/festivals/[id] - 축제 수정
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const festivalId = params.id;
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

    // 기존 축제 조회
    const { data: existingFestival, error: fetchError } = await supabase
      .from('festivals')
      .select('*')
      .eq('id', festivalId)
      .single();

    if (fetchError || !existingFestival) {
      return NextResponse.json(
        { success: false, error: '축제를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 대학 관리자는 자기 학교 축제만 수정 가능
    if (userRole === 'university_admin' && existingFestival.university !== userUniversity) {
      return NextResponse.json(
        { success: false, error: '자신의 대학 축제만 수정할 수 있습니다.' },
        { status: 403 }
      );
    }

    // 대학 관리자가 university 변경 시도 방지
    if (userRole === 'university_admin' && body.university && body.university !== userUniversity) {
      return NextResponse.json(
        { success: false, error: '대학 정보를 변경할 수 없습니다.' },
        { status: 403 }
      );
    }

    // 날짜 검증
    if (body.start_date && body.end_date) {
      const startDate = new Date(body.start_date);
      const endDate = new Date(body.end_date);

      if (endDate < startDate) {
        return NextResponse.json(
          { success: false, error: '종료일은 시작일보다 이후여야 합니다.' },
          { status: 400 }
        );
      }
    }

    // 수정할 필드 준비
    const updateData: any = {};
    const allowedFields = [
      'name',
      'university',
      'region',
      'start_date',
      'end_date',
      'location',
      'description',
      'lineup',
      'booths',
      'transportation',
      'admission',
    ];

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field];
      }
    }

    // 축제 수정
    const { data, error } = await supabase
      .from('festivals')
      .update(updateData)
      .eq('id', festivalId)
      .select()
      .single();

    if (error) {
      console.error('Festival update error:', error);
      return NextResponse.json(
        { success: false, error: '축제 수정 중 오류가 발생했습니다.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: '축제가 성공적으로 수정되었습니다.',
      data,
    });
  } catch (error) {
    console.error('Admin festival PUT error:', error);
    return NextResponse.json(
      { success: false, error: '축제 수정 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/festivals/[id] - 축제 삭제
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const festivalId = params.id;

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

    // 기존 축제 조회
    const { data: existingFestival, error: fetchError } = await supabase
      .from('festivals')
      .select('*')
      .eq('id', festivalId)
      .single();

    if (fetchError || !existingFestival) {
      return NextResponse.json(
        { success: false, error: '축제를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 대학 관리자는 자기 학교 축제만 삭제 가능
    if (userRole === 'university_admin' && existingFestival.university !== userUniversity) {
      return NextResponse.json(
        { success: false, error: '자신의 대학 축제만 삭제할 수 있습니다.' },
        { status: 403 }
      );
    }

    // 축제 삭제
    const { error } = await supabase
      .from('festivals')
      .delete()
      .eq('id', festivalId);

    if (error) {
      console.error('Festival delete error:', error);
      return NextResponse.json(
        { success: false, error: '축제 삭제 중 오류가 발생했습니다.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: '축제가 성공적으로 삭제되었습니다.',
    });
  } catch (error) {
    console.error('Admin festival DELETE error:', error);
    return NextResponse.json(
      { success: false, error: '축제 삭제 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
