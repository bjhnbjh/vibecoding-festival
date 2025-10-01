# 우편함(Inbox) 시스템 설계

## 개요
우편함 시스템은 쿠폰, 알림, 이벤트 보상 등을 사용자에게 전달하는 통합 메시징 시스템입니다.

## 데이터베이스 스키마

### inbox 테이블
```sql
CREATE TABLE inbox (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- 메시지 정보
  type VARCHAR(50) NOT NULL, -- 'coupon', 'notification', 'reward', 'event'
  title VARCHAR(200) NOT NULL,
  message TEXT NOT NULL,

  -- 첨부물 정보
  attachment_type VARCHAR(50), -- 'coupon', 'point', 'badge'
  attachment_id UUID, -- 쿠폰 ID, 포인트 ID 등
  attachment_data JSONB, -- 추가 데이터 (쿠폰 정보, 포인트 수 등)

  -- 상태
  is_read BOOLEAN DEFAULT FALSE,
  is_claimed BOOLEAN DEFAULT FALSE, -- 첨부물 수령 여부

  -- 만료
  expires_at TIMESTAMP WITH TIME ZONE,

  -- 메타데이터
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  read_at TIMESTAMP WITH TIME ZONE,
  claimed_at TIMESTAMP WITH TIME ZONE,

  -- 인덱스
  INDEX idx_inbox_user_id (user_id),
  INDEX idx_inbox_created_at (created_at DESC),
  INDEX idx_inbox_is_read (is_read)
);
```

## 우편함 타입

### 1. 쿠폰 지급 (`type: 'coupon'`)
```json
{
  "type": "coupon",
  "title": "🎫 봄 축제 할인 쿠폰",
  "message": "건국대학교 봄 축제에서 사용 가능한 20% 할인 쿠폰이 도착했습니다!",
  "attachment_type": "coupon",
  "attachment_id": "coupon-uuid",
  "attachment_data": {
    "coupon_code": "SPRING2025",
    "discount_rate": 20,
    "festival_id": "festival-uuid"
  }
}
```

### 2. 알림 (`type: 'notification'`)
```json
{
  "type": "notification",
  "title": "📢 축제 일정 변경 안내",
  "message": "건국대학교 봄 축제가 날씨로 인해 하루 연기되었습니다.",
  "attachment_type": null
}
```

### 3. 보상 (`type: 'reward'`)
```json
{
  "type": "reward",
  "title": "🎁 출석 체크 보상",
  "message": "7일 연속 출석 달성! 포인트 100점을 받으세요.",
  "attachment_type": "point",
  "attachment_data": {
    "points": 100,
    "reason": "7일 연속 출석"
  }
}
```

### 4. 이벤트 (`type: 'event'`)
```json
{
  "type": "event",
  "title": "🎉 신규 회원 환영 쿠폰",
  "message": "FestivalHub에 가입해주셔서 감사합니다! 환영 쿠폰을 받아가세요.",
  "attachment_type": "coupon",
  "attachment_id": "welcome-coupon-uuid"
}
```

## API 엔드포인트

### GET /api/inbox
받은편지함 목록 조회
```typescript
Query Parameters:
- type?: 'coupon' | 'notification' | 'reward' | 'event'
- is_read?: boolean
- page?: number
- limit?: number

Response:
{
  "success": true,
  "data": {
    "items": [...],
    "totalCount": 25,
    "unreadCount": 5,
    "hasNextPage": true
  }
}
```

### POST /api/inbox/[id]/read
읽음 처리
```typescript
Response:
{
  "success": true,
  "message": "메시지를 읽음으로 처리했습니다."
}
```

### POST /api/inbox/[id]/claim
첨부물 수령
```typescript
Response:
{
  "success": true,
  "message": "쿠폰을 받았습니다!",
  "data": {
    "coupon": {...}
  }
}
```

### DELETE /api/inbox/[id]
메시지 삭제
```typescript
Response:
{
  "success": true,
  "message": "메시지가 삭제되었습니다."
}
```

### POST /api/inbox/read-all
모두 읽음 처리
```typescript
Response:
{
  "success": true,
  "message": "모든 메시지를 읽음으로 처리했습니다.",
  "data": {
    "count": 5
  }
}
```

## UI 컴포넌트

### 우편함 페이지 (/inbox)
- 메시지 목록 (읽음/안읽음 구분)
- 필터 (전체/쿠폰/알림/보상)
- 첨부물 수령 버튼
- 읽음/삭제 액션

### 헤더 알림 배지
- 안읽은 메시지 개수 표시
- 클릭 시 우편함으로 이동
- 새 메시지 도착 시 애니메이션

### 쿠폰 지급 플로우
1. 관리자/시스템이 쿠폰 생성
2. 우편함에 쿠폰 메시지 전송
3. 사용자가 우편함에서 확인
4. "받기" 버튼 클릭 → 쿠폰함으로 이동
5. 쿠폰 사용 가능

## 통합 지점

### 쿠폰 시스템 연동
- 쿠폰 발급 시 자동으로 우편함 메시지 생성
- 우편함에서 수령 시 user_coupons 테이블에 추가

### 알림 시스템 연동
- 축제 일정 변경, 좋아하는 축제 시작 등
- 푸시 알림과 우편함 동시 발송

### 이벤트 시스템 연동
- 회원가입, 첫 즐겨찾기 등 이벤트 달성 시
- 보상 자동 지급

## 보안 및 검증

### Row Level Security (RLS)
```sql
-- 사용자는 자신의 우편함만 조회 가능
CREATE POLICY "Users can view their own inbox"
ON inbox FOR SELECT
USING (auth.uid() = user_id);

-- 사용자는 자신의 메시지만 업데이트 가능
CREATE POLICY "Users can update their own inbox"
ON inbox FOR UPDATE
USING (auth.uid() = user_id);

-- 사용자는 자신의 메시지만 삭제 가능
CREATE POLICY "Users can delete their own inbox"
ON inbox FOR DELETE
USING (auth.uid() = user_id);
```

### 만료 처리
- 만료된 메시지는 자동으로 필터링
- 매일 자동으로 30일 지난 읽은 메시지 삭제

## 향후 확장

- [ ] 푸시 알림 연동 (FCM)
- [ ] 이메일 알림 연동
- [ ] 메시지 템플릿 시스템
- [ ] 대량 발송 시스템 (전체 공지)
- [ ] 메시지 예약 발송
- [ ] 사용자 세그먼트별 타겟팅
