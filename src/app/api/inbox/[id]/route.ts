import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// POST /api/inbox/[id] - 읽음 처리 또는 첨부물 수령
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { action } = await request.json();
    const messageId = params.id;

    // 사용자 인증 확인
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json(
        { success: false, error: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // 메시지 조회
    const { data: message, error: fetchError } = await supabase
      .from('inbox')
      .select('*')
      .eq('id', messageId)
      .eq('user_id', userId)
      .single();

    if (fetchError || !message) {
      return NextResponse.json(
        { success: false, error: '메시지를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 읽음 처리
    if (action === 'read') {
      const { error: updateError } = await supabase
        .from('inbox')
        .update({
          is_read: true,
          read_at: new Date().toISOString()
        })
        .eq('id', messageId)
        .eq('user_id', userId);

      if (updateError) {
        console.error('Mark as read error:', updateError);
        return NextResponse.json(
          { success: false, error: '읽음 처리 중 오류가 발생했습니다.' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        message: '메시지를 읽음으로 처리했습니다.',
      });
    }

    // 첨부물 수령
    if (action === 'claim') {
      if (message.is_claimed) {
        return NextResponse.json(
          { success: false, error: '이미 수령한 첨부물입니다.' },
          { status: 400 }
        );
      }

      if (!message.attachment_type) {
        return NextResponse.json(
          { success: false, error: '수령할 첨부물이 없습니다.' },
          { status: 400 }
        );
      }

      // 만료 확인
      if (message.expires_at && new Date(message.expires_at) < new Date()) {
        return NextResponse.json(
          { success: false, error: '만료된 메시지입니다.' },
          { status: 400 }
        );
      }

      // 첨부물 타입에 따라 처리
      let attachmentData = null;

      if (message.attachment_type === 'coupon') {
        // 쿠폰 수령 처리 (user_coupons 테이블에 추가)
        // TODO: 실제 쿠폰 시스템 구현 시 연동
        attachmentData = {
          type: 'coupon',
          ...message.attachment_data
        };
      } else if (message.attachment_type === 'point') {
        // 포인트 수령 처리
        // TODO: 포인트 시스템 구현 시 연동
        attachmentData = {
          type: 'point',
          ...message.attachment_data
        };
      }

      // 수령 처리
      const { error: claimError } = await supabase
        .from('inbox')
        .update({
          is_claimed: true,
          is_read: true,
          claimed_at: new Date().toISOString(),
          read_at: message.read_at || new Date().toISOString()
        })
        .eq('id', messageId)
        .eq('user_id', userId);

      if (claimError) {
        console.error('Claim attachment error:', claimError);
        return NextResponse.json(
          { success: false, error: '첨부물 수령 중 오류가 발생했습니다.' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        message: '첨부물을 받았습니다!',
        data: attachmentData,
      });
    }

    return NextResponse.json(
      { success: false, error: '올바르지 않은 요청입니다.' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Inbox message action error:', error);
    return NextResponse.json(
      { success: false, error: '요청 처리 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// DELETE /api/inbox/[id] - 메시지 삭제
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const messageId = params.id;

    // 사용자 인증 확인
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json(
        { success: false, error: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // 메시지 삭제
    const { error } = await supabase
      .from('inbox')
      .delete()
      .eq('id', messageId)
      .eq('user_id', userId);

    if (error) {
      console.error('Delete message error:', error);
      return NextResponse.json(
        { success: false, error: '메시지 삭제 중 오류가 발생했습니다.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: '메시지가 삭제되었습니다.',
    });
  } catch (error) {
    console.error('Inbox DELETE error:', error);
    return NextResponse.json(
      { success: false, error: '메시지 삭제 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
