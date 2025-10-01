-- 우편함(Inbox) 테이블 생성
CREATE TABLE IF NOT EXISTS inbox (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- 메시지 정보
  type VARCHAR(50) NOT NULL CHECK (type IN ('coupon', 'notification', 'reward', 'event')),
  title VARCHAR(200) NOT NULL,
  message TEXT NOT NULL,

  -- 첨부물 정보
  attachment_type VARCHAR(50), -- 'coupon', 'point', 'badge'
  attachment_id UUID,
  attachment_data JSONB,

  -- 상태
  is_read BOOLEAN DEFAULT FALSE,
  is_claimed BOOLEAN DEFAULT FALSE,

  -- 만료
  expires_at TIMESTAMP WITH TIME ZONE,

  -- 메타데이터
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  read_at TIMESTAMP WITH TIME ZONE,
  claimed_at TIMESTAMP WITH TIME ZONE
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_inbox_user_id ON inbox(user_id);
CREATE INDEX IF NOT EXISTS idx_inbox_created_at ON inbox(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_inbox_is_read ON inbox(is_read);
CREATE INDEX IF NOT EXISTS idx_inbox_type ON inbox(type);

-- Row Level Security 활성화
ALTER TABLE inbox ENABLE ROW LEVEL SECURITY;

-- RLS 정책: 사용자는 자신의 우편함만 조회 가능
CREATE POLICY "Users can view their own inbox"
ON inbox FOR SELECT
USING (auth.uid() = user_id);

-- RLS 정책: 사용자는 자신의 메시지만 업데이트 가능
CREATE POLICY "Users can update their own inbox"
ON inbox FOR UPDATE
USING (auth.uid() = user_id);

-- RLS 정책: 사용자는 자신의 메시지만 삭제 가능
CREATE POLICY "Users can delete their own inbox"
ON inbox FOR DELETE
USING (auth.uid() = user_id);

-- 시스템/관리자가 우편함에 메시지 추가 가능 (service_role로 실행)
-- 별도의 정책 없이 service_role 키로 직접 삽입

-- 샘플 데이터 (테스트용)
-- 실제 user_id는 Supabase Auth에서 생성된 ID로 교체 필요
/*
INSERT INTO inbox (user_id, type, title, message, attachment_type, attachment_data) VALUES
(
  'user-uuid-here',
  'event',
  '🎉 FestivalHub에 오신 것을 환영합니다!',
  '회원가입을 축하드립니다! 첫 축제 방문 시 사용 가능한 환영 쿠폰을 드립니다.',
  'coupon',
  '{"coupon_code": "WELCOME2025", "discount_rate": 10, "description": "첫 축제 방문 10% 할인"}'::jsonb
);
*/

-- 만료된 메시지 자동 정리 함수 (선택사항)
CREATE OR REPLACE FUNCTION cleanup_expired_inbox()
RETURNS void AS $$
BEGIN
  DELETE FROM inbox
  WHERE expires_at IS NOT NULL
    AND expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- 읽은 메시지 자동 정리 함수 (30일 지난 읽은 메시지 삭제)
CREATE OR REPLACE FUNCTION cleanup_old_read_inbox()
RETURNS void AS $$
BEGIN
  DELETE FROM inbox
  WHERE is_read = TRUE
    AND read_at < NOW() - INTERVAL '30 days';
END;
$$ LANGUAGE plpgsql;

COMMENT ON TABLE inbox IS '사용자 우편함 (쿠폰, 알림, 보상 등)';
COMMENT ON COLUMN inbox.type IS '메시지 타입: coupon, notification, reward, event';
COMMENT ON COLUMN inbox.attachment_type IS '첨부물 타입: coupon, point, badge';
COMMENT ON COLUMN inbox.is_claimed IS '첨부물 수령 여부';
