# FestivalHub - 기술 아키텍처

## 6. 기술 스택 및 아키텍처 (Tech Stack)

### 6.1 플랫폼
- **웹**: Next.js 14+ (App Router) 기반 반응형 웹사이트
- **모바일 앱**: React Native (크로스플랫폼)
- **백엔드**: Node.js/Express 또는 Python/FastAPI
- **데이터베이스**: Supabase (PostgreSQL)

### 6.2 핵심 기술 스택
- **프론트엔드**: TypeScript, React, Next.js, Tailwind CSS
- **백엔드**: Node.js, Express.js, JWT 인증
- **데이터베이스**: Supabase (Auth, Database, Storage)
- **실시간**: Supabase Realtime
- **지도**: Google Maps API
- **인프라**: Vercel (배포), AWS S3 (파일 저장)

### 6.3 데이터베이스 스키마

#### 주요 테이블
- **users**: 사용자 정보 (Supabase Auth 연동)
- **festivals**: 축제 기본 정보
- **favorites**: 사용자 즐겨찾기
- **coupons**: 쿠폰/할인 정보
- **reviews**: 사용자 후기 및 평점
- **posts**: 커뮤니티 게시물

### 6.4 API 명세 (Festival Data API)

#### GET /api/festivals
**목적**: 축제 목록 조회
**파라미터**: page, limit, region, date, university
**응답**:
```json
{
  "success": true,
  "data": {
    "festivals": [
      {
        "id": "uuid",
        "name": "2025 봄 축제",
        "university": "서울대학교",
        "startDate": "2025-05-15",
        "endDate": "2025-05-17",
        "location": "서울대 운동장",
        "description": "봄을 맞이하는 대학 축제",
        "lineup": [...],
        "booths": [...],
        "transportation": {...},
        "admission": {...}
      }
    ],
    "totalCount": 150,
    "hasNextPage": true
  }
}
```

#### POST /api/festivals/{id}/favorite
**목적**: 축제 즐겨찾기 추가/제거
**응답**:
```json
{
  "success": true,
  "message": "축제가 즐겨찾기에 추가되었습니다"
}
```

#### GET /api/festivals/{id}/coupons
**목적**: 축제 관련 쿠폰 조회
**응답**:
```json
{
  "success": true,
  "data": {
    "coupons": [
      {
        "id": "uuid",
        "title": "맥주 50% 할인",
        "description": "축제 기간 내 사용 가능",
        "vendor": "축제 협력 업체",
        "validUntil": "2025-05-17T23:59:59Z",
        "qrCode": "base64_encoded_qr_code"
      }
    ]
  }
}
```

### 6.5 시스템 아키텍처

#### 데이터 흐름
1. **사용자 요청** → Next.js API Routes → Supabase Database
2. **실시간 업데이트** → Supabase Realtime → 클라이언트 웹소켓
3. **파일 업로드** → 클라이언트 → Supabase Storage
4. **지도 서비스** → Google Maps API → 위치 기반 기능

#### 보안 고려사항
- JWT 기반 인증/인가
- API Rate Limiting
- 입력 데이터 검증 및 Sanitization
- CORS 설정
- HTTPS 강제 적용

---

*작성일: 2024년 9월 25일*
*버전: 1.0*
*작성자: FestivalHub 팀*
