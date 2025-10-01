import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET /api/inbox - 우편함 목록 조회
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const isRead = searchParams.get('is_read');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    // 사용자 인증 확인
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json(
        { success: false, error: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // 쿼리 빌더 시작
    let query = supabase
      .from('inbox')
      .select('*', { count: 'exact' })
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    // 필터 적용
    if (type) {
      query = query.eq('type', type);
    }

    if (isRead !== null) {
      query = query.eq('is_read', isRead === 'true');
    }

    // 만료되지 않은 메시지만 (또는 만료 시간이 없는 메시지)
    query = query.or(`expires_at.is.null,expires_at.gt.${new Date().toISOString()}`);

    // 페이지네이션
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) {
      console.error('Inbox query error:', error);
      return NextResponse.json(
        { success: false, error: '우편함 조회 중 오류가 발생했습니다.' },
        { status: 500 }
      );
    }

    // 읽지 않은 메시지 개수 조회
    const { count: unreadCount } = await supabase
      .from('inbox')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('is_read', false)
      .or(`expires_at.is.null,expires_at.gt.${new Date().toISOString()}`);

    return NextResponse.json({
      success: true,
      data: {
        items: data || [],
        totalCount: count || 0,
        unreadCount: unreadCount || 0,
        hasNextPage: (count || 0) > page * limit,
        currentPage: page,
      },
    });
  } catch (error) {
    console.error('Inbox GET error:', error);
    return NextResponse.json(
      { success: false, error: '우편함 조회 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// POST /api/inbox - 모두 읽음 처리
export async function POST(request: NextRequest) {
  try {
    const { action } = await request.json();

    if (action !== 'read-all') {
      return NextResponse.json(
        { success: false, error: '올바르지 않은 요청입니다.' },
        { status: 400 }
      );
    }

    // 사용자 인증 확인
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json(
        { success: false, error: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // 모든 안읽은 메시지를 읽음으로 처리
    const { error, count } = await supabase
      .from('inbox')
      .update({
        is_read: true,
        read_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .eq('is_read', false);

    if (error) {
      console.error('Mark all as read error:', error);
      return NextResponse.json(
        { success: false, error: '읽음 처리 중 오류가 발생했습니다.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: '모든 메시지를 읽음으로 처리했습니다.',
      data: { count },
    });
  } catch (error) {
    console.error('Inbox POST error:', error);
    return NextResponse.json(
      { success: false, error: '요청 처리 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
