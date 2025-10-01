import { supabase } from './supabase'
import { Festival, FestivalFilters } from '@/types/festival'

// 더미 축제 데이터 - 20개 학교
const DUMMY_FESTIVALS: Festival[] = [
  {
    id: '1',
    name: '건국대학교 봄 축제',
    university: '건국대학교',
    region: '서울',
    startDate: '2025-05-15T10:00:00Z',
    endDate: '2025-05-17T22:00:00Z',
    location: '건국대학교 중앙광장',
    description: '건국대학교의 대표 봄 축제! 다양한 공연과 부스가 준비되어 있습니다.',
    lineup: [
      { artist: '아이유', time: '19:00', stage: '메인 스테이지' },
      { artist: 'BTS', time: '20:00', stage: '메인 스테이지' },
      { artist: '트와이스', time: '21:00', stage: '메인 스테이지' }
    ],
    booths: [
      { name: '맥주 부스', category: '음료', location: 'A구역', operatingHours: '12:00-22:00' },
      { name: '닭꼬치', category: '음식', location: 'B구역', operatingHours: '12:00-22:00' }
    ],
    transportation: {
      parking: '학교 주차장 이용 가능',
      publicTransport: '2호선 건대입구역 도보 10분'
    },
    admission: {
      fee: 0,
      currency: 'KRW',
      notes: '학생증 지참'
    },
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    name: '연세대학교 봄 축제',
    university: '연세대학교',
    region: '서울',
    startDate: '2025-05-20T10:00:00Z',
    endDate: '2025-05-22T22:00:00Z',
    location: '연세대학교 노천극장',
    description: '연세대학교 봄 축제 - 아카라카!',
    lineup: [
      { artist: '블랙핑크', time: '19:00', stage: '메인 스테이지' },
      { artist: '엑소', time: '20:00', stage: '메인 스테이지' }
    ],
    booths: [
      { name: '카페 부스', category: '음료', location: 'C구역', operatingHours: '12:00-22:00' },
      { name: '타코', category: '음식', location: 'D구역', operatingHours: '12:00-22:00' }
    ],
    transportation: {
      parking: '학교 주차장 이용 가능',
      publicTransport: '2호선 신촌역 도보 5분'
    },
    admission: {
      fee: 0,
      currency: 'KRW',
      notes: '학생증 지참'
    },
    createdAt: '2024-01-20T10:00:00Z',
    updatedAt: '2024-01-20T10:00:00Z'
  },
  {
    id: '3',
    name: '서울대학교 봄 축제',
    university: '서울대학교',
    region: '서울',
    startDate: '2025-05-25T10:00:00Z',
    endDate: '2025-05-27T22:00:00Z',
    location: '서울대학교 관악캠퍼스',
    description: '서울대학교 대표 축제 - 관악제!',
    lineup: [
      { artist: '뉴진스', time: '19:00', stage: '메인 스테이지' },
      { artist: '세븐틴', time: '20:00', stage: '메인 스테이지' }
    ],
    booths: [
      { name: '전통 음식', category: '음식', location: 'E구역', operatingHours: '12:00-22:00' },
      { name: '커피 트럭', category: '음료', location: 'F구역', operatingHours: '12:00-22:00' }
    ],
    transportation: {
      parking: '학교 주차장 이용 가능',
      publicTransport: '2호선 낙성대역 도보 15분'
    },
    admission: {
      fee: 0,
      currency: 'KRW',
      notes: '학생증 지참'
    },
    createdAt: '2024-01-25T10:00:00Z',
    updatedAt: '2024-01-25T10:00:00Z'
  },
  {
    id: '4',
    name: '부산대학교 봄 축제',
    university: '부산대학교',
    region: '부산',
    startDate: '2025-05-30T10:00:00Z',
    endDate: '2025-06-01T22:00:00Z',
    location: '부산대학교 금정캠퍼스',
    description: '부산대학교 봄 축제 - 바다의 향기와 함께!',
    lineup: [
      { artist: '데이식스', time: '19:00', stage: '메인 스테이지' },
      { artist: '잔나비', time: '20:00', stage: '메인 스테이지' }
    ],
    booths: [
      { name: '해산물', category: '음식', location: 'G구역', operatingHours: '12:00-22:00' },
      { name: '밀면', category: '음식', location: 'H구역', operatingHours: '12:00-22:00' }
    ],
    transportation: {
      parking: '학교 주차장 이용 가능',
      publicTransport: '부산 지하철 1호선 장전역 도보 10분'
    },
    admission: {
      fee: 0,
      currency: 'KRW',
      notes: '학생증 지참'
    },
    createdAt: '2024-01-30T10:00:00Z',
    updatedAt: '2024-01-30T10:00:00Z'
  },
  {
    id: '5',
    name: '경북대학교 봄 축제',
    university: '경북대학교',
    region: '대구',
    startDate: '2025-06-05T10:00:00Z',
    endDate: '2025-06-07T22:00:00Z',
    location: '경북대학교 대구캠퍼스',
    description: '경북대학교 봄 축제 - 대동제!',
    lineup: [
      { artist: '볼빨간사춘기', time: '19:00', stage: '메인 스테이지' },
      { artist: '멜로망스', time: '20:00', stage: '메인 스테이지' }
    ],
    booths: [
      { name: '국밥', category: '음식', location: 'I구역', operatingHours: '12:00-22:00' },
      { name: '막걸리', category: '음료', location: 'J구역', operatingHours: '12:00-22:00' }
    ],
    transportation: {
      parking: '학교 주차장 이용 가능',
      publicTransport: '대구 지하철 2호선 경대병원역 도보 5분'
    },
    admission: {
      fee: 0,
      currency: 'KRW',
      notes: '학생증 지참'
    },
    createdAt: '2024-02-05T10:00:00Z',
    updatedAt: '2024-02-05T10:00:00Z'
  },
  {
    id: '6',
    name: '전남대학교 봄 축제',
    university: '전남대학교',
    region: '광주',
    startDate: '2025-06-10T10:00:00Z',
    endDate: '2025-06-12T22:00:00Z',
    location: '전남대학교 용봉캠퍼스',
    description: '전남대학교 봄 축제 - 빛고을 축제!',
    lineup: [
      { artist: '10CM', time: '19:00', stage: '메인 스테이지' },
      { artist: '혁오', time: '20:00', stage: '메인 스테이지' }
    ],
    booths: [
      { name: '김치찌개', category: '음식', location: 'K구역', operatingHours: '12:00-22:00' },
      { name: '한과', category: '디저트', location: 'L구역', operatingHours: '12:00-22:00' }
    ],
    transportation: {
      parking: '학교 주차장 이용 가능',
      publicTransport: '광주 지하철 1호선 전남대역 도보 3분'
    },
    admission: {
      fee: 0,
      currency: 'KRW',
      notes: '학생증 지참'
    },
    createdAt: '2024-02-10T10:00:00Z',
    updatedAt: '2024-02-10T10:00:00Z'
  },
  {
    id: '7',
    name: '고려대학교 봄 축제',
    university: '고려대학교',
    region: '서울',
    startDate: '2025-05-18T10:00:00Z',
    endDate: '2025-05-20T22:00:00Z',
    location: '고려대학교 중앙광장',
    description: '고려대학교 봄 축제 - 고연전과 함께!',
    lineup: [
      { artist: '레드벨벳', time: '19:00', stage: '메인 스테이지' },
      { artist: 'NCT 127', time: '20:00', stage: '메인 스테이지' }
    ],
    booths: [
      { name: '커피&디저트', category: '음료', location: 'M구역', operatingHours: '12:00-22:00' },
      { name: '분식', category: '음식', location: 'N구역', operatingHours: '12:00-22:00' }
    ],
    transportation: {
      parking: '학교 주차장 이용 가능',
      publicTransport: '6호선 안암역 도보 10분'
    },
    admission: {
      fee: 0,
      currency: 'KRW',
      notes: '학생증 지참'
    },
    createdAt: '2024-02-15T10:00:00Z',
    updatedAt: '2024-02-15T10:00:00Z'
  },
  {
    id: '8',
    name: '이화여자대학교 봄 축제',
    university: '이화여자대학교',
    region: '서울',
    startDate: '2025-05-22T10:00:00Z',
    endDate: '2025-05-24T22:00:00Z',
    location: '이화여자대학교 대강당 앞',
    description: '이화여자대학교 봄 축제 - 봄의 향연!',
    lineup: [
      { artist: '태연', time: '19:00', stage: '메인 스테이지' },
      { artist: '소녀시대', time: '20:00', stage: '메인 스테이지' }
    ],
    booths: [
      { name: '플라워 카페', category: '음료', location: 'O구역', operatingHours: '12:00-22:00' },
      { name: '디저트', category: '디저트', location: 'P구역', operatingHours: '12:00-22:00' }
    ],
    transportation: {
      parking: '학교 주차장 이용 가능',
      publicTransport: '2호선 이대역 도보 5분'
    },
    admission: {
      fee: 0,
      currency: 'KRW',
      notes: '학생증 지참'
    },
    createdAt: '2024-02-20T10:00:00Z',
    updatedAt: '2024-02-20T10:00:00Z'
  },
  {
    id: '9',
    name: '한양대학교 봄 축제',
    university: '한양대학교',
    region: '서울',
    startDate: '2025-05-28T10:00:00Z',
    endDate: '2025-05-30T22:00:00Z',
    location: '한양대학교 노천극장',
    description: '한양대학교 봄 축제 - 한마음 축제!',
    lineup: [
      { artist: '방탄소년단', time: '19:00', stage: '메인 스테이지' },
      { artist: '에스파', time: '20:00', stage: '메인 스테이지' }
    ],
    booths: [
      { name: '전통주', category: '음료', location: 'Q구역', operatingHours: '12:00-22:00' },
      { name: '한식', category: '음식', location: 'R구역', operatingHours: '12:00-22:00' }
    ],
    transportation: {
      parking: '학교 주차장 이용 가능',
      publicTransport: '2호선 한양대역 도보 3분'
    },
    admission: {
      fee: 0,
      currency: 'KRW',
      notes: '학생증 지참'
    },
    createdAt: '2024-02-25T10:00:00Z',
    updatedAt: '2024-02-25T10:00:00Z'
  },
  {
    id: '10',
    name: '성균관대학교 봄 축제',
    university: '성균관대학교',
    region: '서울',
    startDate: '2025-06-02T10:00:00Z',
    endDate: '2025-06-04T22:00:00Z',
    location: '성균관대학교 중앙광장',
    description: '성균관대학교 봄 축제 - 성대제!',
    lineup: [
      { artist: '슈퍼주니어', time: '19:00', stage: '메인 스테이지' },
      { artist: '샤이니', time: '20:00', stage: '메인 스테이지' }
    ],
    booths: [
      { name: '카페', category: '음료', location: 'S구역', operatingHours: '12:00-22:00' },
      { name: '양식', category: '음식', location: 'T구역', operatingHours: '12:00-22:00' }
    ],
    transportation: {
      parking: '학교 주차장 이용 가능',
      publicTransport: '4호선 혜화역 도보 15분'
    },
    admission: {
      fee: 0,
      currency: 'KRW',
      notes: '학생증 지참'
    },
    createdAt: '2024-03-01T10:00:00Z',
    updatedAt: '2024-03-01T10:00:00Z'
  },
  {
    id: '11',
    name: '중앙대학교 봄 축제',
    university: '중앙대학교',
    region: '서울',
    startDate: '2025-05-12T10:00:00Z',
    endDate: '2025-05-14T22:00:00Z',
    location: '중앙대학교 운동장',
    description: '중앙대학교 봄 축제 - 중앙인의 밤!',
    lineup: [
      { artist: '트레저', time: '19:00', stage: '메인 스테이지' },
      { artist: '아이브', time: '20:00', stage: '메인 스테이지' }
    ],
    booths: [
      { name: '주스', category: '음료', location: 'U구역', operatingHours: '12:00-22:00' },
      { name: '치킨', category: '음식', location: 'V구역', operatingHours: '12:00-22:00' }
    ],
    transportation: {
      parking: '학교 주차장 이용 가능',
      publicTransport: '7호선 중대역 도보 10분'
    },
    admission: {
      fee: 0,
      currency: 'KRW',
      notes: '학생증 지참'
    },
    createdAt: '2024-03-05T10:00:00Z',
    updatedAt: '2024-03-05T10:00:00Z'
  },
  {
    id: '12',
    name: '홍익대학교 봄 축제',
    university: '홍익대학교',
    region: '서울',
    startDate: '2025-05-08T10:00:00Z',
    endDate: '2025-05-10T22:00:00Z',
    location: '홍익대학교 운동장',
    description: '홍익대학교 봄 축제 - 홍대 앞 축제!',
    lineup: [
      { artist: '스트레이 키즈', time: '19:00', stage: '메인 스테이지' },
      { artist: '투모로우바이투게더', time: '20:00', stage: '메인 스테이지' }
    ],
    booths: [
      { name: '클럽 DJ', category: '음악', location: 'W구역', operatingHours: '12:00-22:00' },
      { name: '스트릿 푸드', category: '음식', location: 'X구역', operatingHours: '12:00-22:00' }
    ],
    transportation: {
      parking: '학교 주차장 이용 가능',
      publicTransport: '2호선 홍대입구역 도보 5분'
    },
    admission: {
      fee: 0,
      currency: 'KRW',
      notes: '학생증 지참'
    },
    createdAt: '2024-03-10T10:00:00Z',
    updatedAt: '2024-03-10T10:00:00Z'
  },
  {
    id: '13',
    name: '경희대학교 봄 축제',
    university: '경희대학교',
    region: '서울',
    startDate: '2025-05-26T10:00:00Z',
    endDate: '2025-05-28T22:00:00Z',
    location: '경희대학교 평화의 전당',
    description: '경희대학교 봄 축제 - 경희제!',
    lineup: [
      { artist: '엔하이픈', time: '19:00', stage: '메인 스테이지' },
      { artist: '르세라핌', time: '20:00', stage: '메인 스테이지' }
    ],
    booths: [
      { name: '전통차', category: '음료', location: 'Y구역', operatingHours: '12:00-22:00' },
      { name: '퓨전 음식', category: '음식', location: 'Z구역', operatingHours: '12:00-22:00' }
    ],
    transportation: {
      parking: '학교 주차장 이용 가능',
      publicTransport: '1호선 회기역 도보 10분'
    },
    admission: {
      fee: 0,
      currency: 'KRW',
      notes: '학생증 지참'
    },
    createdAt: '2024-03-15T10:00:00Z',
    updatedAt: '2024-03-15T10:00:00Z'
  },
  {
    id: '14',
    name: '동국대학교 봄 축제',
    university: '동국대학교',
    region: '서울',
    startDate: '2025-05-16T10:00:00Z',
    endDate: '2025-05-18T22:00:00Z',
    location: '동국대학교 운동장',
    description: '동국대학교 봄 축제 - 동국제!',
    lineup: [
      { artist: '있지', time: '19:00', stage: '메인 스테이지' },
      { artist: '더보이즈', time: '20:00', stage: '메인 스테이지' }
    ],
    booths: [
      { name: '사찰음식', category: '음식', location: 'AA구역', operatingHours: '12:00-22:00' },
      { name: '티 하우스', category: '음료', location: 'BB구역', operatingHours: '12:00-22:00' }
    ],
    transportation: {
      parking: '학교 주차장 이용 가능',
      publicTransport: '3호선 동대입구역 도보 5분'
    },
    admission: {
      fee: 0,
      currency: 'KRW',
      notes: '학생증 지참'
    },
    createdAt: '2024-03-20T10:00:00Z',
    updatedAt: '2024-03-20T10:00:00Z'
  },
  {
    id: '15',
    name: '숙명여자대학교 봄 축제',
    university: '숙명여자대학교',
    region: '서울',
    startDate: '2025-05-14T10:00:00Z',
    endDate: '2025-05-16T22:00:00Z',
    location: '숙명여자대학교 운동장',
    description: '숙명여자대학교 봄 축제 - 숙명제!',
    lineup: [
      { artist: '여자아이들', time: '19:00', stage: '메인 스테이지' },
      { artist: '스테이씨', time: '20:00', stage: '메인 스테이지' }
    ],
    booths: [
      { name: '디저트 카페', category: '디저트', location: 'CC구역', operatingHours: '12:00-22:00' },
      { name: '플라워 숍', category: '기타', location: 'DD구역', operatingHours: '12:00-22:00' }
    ],
    transportation: {
      parking: '학교 주차장 이용 가능',
      publicTransport: '4호선 숙대입구역 도보 3분'
    },
    admission: {
      fee: 0,
      currency: 'KRW',
      notes: '학생증 지참'
    },
    createdAt: '2024-03-25T10:00:00Z',
    updatedAt: '2024-03-25T10:00:00Z'
  },
  {
    id: '16',
    name: '서강대학교 봄 축제',
    university: '서강대학교',
    region: '서울',
    startDate: '2025-05-21T10:00:00Z',
    endDate: '2025-05-23T22:00:00Z',
    location: '서강대학교 중앙광장',
    description: '서강대학교 봄 축제 - 서강제!',
    lineup: [
      { artist: '드림캐쳐', time: '19:00', stage: '메인 스테이지' },
      { artist: '에버글로우', time: '20:00', stage: '메인 스테이지' }
    ],
    booths: [
      { name: '와인 바', category: '음료', location: 'EE구역', operatingHours: '12:00-22:00' },
      { name: '이탈리아 음식', category: '음식', location: 'FF구역', operatingHours: '12:00-22:00' }
    ],
    transportation: {
      parking: '학교 주차장 이용 가능',
      publicTransport: '6호선 대흥역 도보 10분'
    },
    admission: {
      fee: 0,
      currency: 'KRW',
      notes: '학생증 지참'
    },
    createdAt: '2024-03-30T10:00:00Z',
    updatedAt: '2024-03-30T10:00:00Z'
  },
  {
    id: '17',
    name: '인하대학교 봄 축제',
    university: '인하대학교',
    region: '인천',
    startDate: '2025-05-19T10:00:00Z',
    endDate: '2025-05-21T22:00:00Z',
    location: '인하대학교 운동장',
    description: '인하대학교 봄 축제 - 인하제!',
    lineup: [
      { artist: '펜타곤', time: '19:00', stage: '메인 스테이지' },
      { artist: '오마이걸', time: '20:00', stage: '메인 스테이지' }
    ],
    booths: [
      { name: '바다 음식', category: '음식', location: 'GG구역', operatingHours: '12:00-22:00' },
      { name: '커피 카트', category: '음료', location: 'HH구역', operatingHours: '12:00-22:00' }
    ],
    transportation: {
      parking: '학교 주차장 이용 가능',
      publicTransport: '인천 지하철 1호선 인하대역 도보 5분'
    },
    admission: {
      fee: 0,
      currency: 'KRW',
      notes: '학생증 지참'
    },
    createdAt: '2024-04-05T10:00:00Z',
    updatedAt: '2024-04-05T10:00:00Z'
  },
  {
    id: '18',
    name: '한국외국어대학교 봄 축제',
    university: '한국외국어대학교',
    region: '서울',
    startDate: '2025-05-23T10:00:00Z',
    endDate: '2025-05-25T22:00:00Z',
    location: '한국외국어대학교 운동장',
    description: '한국외국어대학교 봄 축제 - 외대제!',
    lineup: [
      { artist: '에이티즈', time: '19:00', stage: '메인 스테이지' },
      { artist: '드리핀', time: '20:00', stage: '메인 스테이지' }
    ],
    booths: [
      { name: '세계 음료', category: '음료', location: 'II구역', operatingHours: '12:00-22:00' },
      { name: '인터내셔널 푸드', category: '음식', location: 'JJ구역', operatingHours: '12:00-22:00' }
    ],
    transportation: {
      parking: '학교 주차장 이용 가능',
      publicTransport: '1호선 외대앞역 도보 3분'
    },
    admission: {
      fee: 0,
      currency: 'KRW',
      notes: '학생증 지참'
    },
    createdAt: '2024-04-10T10:00:00Z',
    updatedAt: '2024-04-10T10:00:00Z'
  },
  {
    id: '19',
    name: '충남대학교 봄 축제',
    university: '충남대학교',
    region: '대전',
    startDate: '2025-05-24T10:00:00Z',
    endDate: '2025-05-26T22:00:00Z',
    location: '충남대학교 운동장',
    description: '충남대학교 봄 축제 - 충대제!',
    lineup: [
      { artist: '더 로즈', time: '19:00', stage: '메인 스테이지' },
      { artist: '김재환', time: '20:00', stage: '메인 스테이지' }
    ],
    booths: [
      { name: '충청도 음식', category: '음식', location: 'KK구역', operatingHours: '12:00-22:00' },
      { name: '전통주', category: '음료', location: 'LL구역', operatingHours: '12:00-22:00' }
    ],
    transportation: {
      parking: '학교 주차장 이용 가능',
      publicTransport: '대전 지하철 1호선 유성온천역 도보 15분'
    },
    admission: {
      fee: 0,
      currency: 'KRW',
      notes: '학생증 지참'
    },
    createdAt: '2024-04-15T10:00:00Z',
    updatedAt: '2024-04-15T10:00:00Z'
  },
  {
    id: '20',
    name: '전북대학교 봄 축제',
    university: '전북대학교',
    region: '전주',
    startDate: '2025-05-27T10:00:00Z',
    endDate: '2025-05-29T22:00:00Z',
    location: '전북대학교 운동장',
    description: '전북대학교 봄 축제 - 전대제!',
    lineup: [
      { artist: '하이라이트', time: '19:00', stage: '메인 스테이지' },
      { artist: '비투비', time: '20:00', stage: '메인 스테이지' }
    ],
    booths: [
      { name: '전라도 음식', category: '음식', location: 'MM구역', operatingHours: '12:00-22:00' },
      { name: '한옥 카페', category: '음료', location: 'NN구역', operatingHours: '12:00-22:00' }
    ],
    transportation: {
      parking: '학교 주차장 이용 가능',
      publicTransport: '전주 시내버스 전북대 정류장'
    },
    admission: {
      fee: 0,
      currency: 'KRW',
      notes: '학생증 지참'
    },
    createdAt: '2024-04-20T10:00:00Z',
    updatedAt: '2024-04-20T10:00:00Z'
  }
]

export async function getFestivals(filters?: FestivalFilters) {
  // 더미 데이터 반환 (Supabase 연결 전까지)
  let festivals = [...DUMMY_FESTIVALS]

  // 지역 필터링
  if (filters?.region) {
    festivals = festivals.filter(festival => festival.region === filters.region)
  }

  // 검색 필터링
  if (filters?.search) {
    const searchTerm = filters.search.toLowerCase()
    festivals = festivals.filter(festival =>
      festival.name.toLowerCase().includes(searchTerm) ||
      festival.description.toLowerCase().includes(searchTerm) ||
      festival.university.toLowerCase().includes(searchTerm)
    )
  }

  // 날짜 필터링 (향후 구현)
  if (filters?.date) {
    // TODO: 날짜별 필터링 로직 구현
  }

  return festivals

  // 실제 Supabase 구현 (환경 변수 설정 후 활성화)
  /*
  try {
    let query = supabase
      .from('festivals')
      .select('*')
      .order('start_date', { ascending: true })

    if (filters?.region) {
      query = query.eq('region', filters.region)
    }

    if (filters?.search) {
      query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%,university.ilike.%${filters.search}%`)
    }

    const { data, error } = await query

    if (error) {
      console.error('Supabase query error:', error)
      // 에러 발생 시 더미 데이터로 폴백
      return getFestivalsFromDummy(filters)
    }

    return (data || []) as Festival[]
  } catch (error) {
    console.error('Failed to fetch festivals from Supabase:', error)
    // 에러 발생 시 더미 데이터로 폴백
    return getFestivalsFromDummy(filters)
  }
  */
}

// 더미 데이터에서 가져오는 함수 (Supabase 연결 실패 시 사용)
function getFestivalsFromDummy(filters?: FestivalFilters): Festival[] {
  let festivals = [...DUMMY_FESTIVALS]

  // 지역 필터링
  if (filters?.region) {
    festivals = festivals.filter(festival => festival.region === filters.region)
  }

  // 검색 필터링
  if (filters?.search) {
    const searchTerm = filters.search.toLowerCase()
    festivals = festivals.filter(festival =>
      festival.name.toLowerCase().includes(searchTerm) ||
      festival.description.toLowerCase().includes(searchTerm) ||
      festival.university.toLowerCase().includes(searchTerm)
    )
  }

  return festivals
}

export async function getFestivalById(id: string) {
  // 더미 데이터에서 특정 축제 찾기
  const festival = DUMMY_FESTIVALS.find(f => f.id === id)

  if (!festival) {
    throw new Error('Festival not found')
  }

  return festival

  // 실제 Supabase 구현 (나중에 활성화)
  /*
  const { data, error } = await supabase
    .from('festivals')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    throw new Error(`Failed to fetch festival: ${error.message}`)
  }

  return data as Festival
  */
}

export async function getFavoriteFestivals(userId: string) {
  // 로컬 스토리지에서 즐겨찾기 확인 (Supabase 연결 전까지)
  try {
    const favorites = JSON.parse(localStorage.getItem(`favorites_${userId}`) || '[]')

    if (favorites.length === 0) {
      return []
    }

    const favoriteFestivals = DUMMY_FESTIVALS.filter(festival =>
      favorites.includes(festival.id)
    )

    return favoriteFestivals
  } catch (error) {
    console.error('Error getting favorites from localStorage:', error)
    return []
  }

  // 실제 Supabase 구현 (환경 변수 설정 후 활성화)
  /*
  try {
    const { data, error } = await supabase
      .from('favorites')
      .select(`
        *,
        festivals (*)
      `)
      .eq('user_id', userId)

    if (error) {
      console.error('Supabase favorites query error:', error)
      // 에러 발생 시 로컬 스토리지로 폴백
      return getFavoriteFestivalsFromLocal(userId)
    }

    return data?.map(item => item.festivals).filter(Boolean) || []
  } catch (error) {
    console.error('Failed to fetch favorite festivals from Supabase:', error)
    // 에러 발생 시 로컬 스토리지로 폴백
    return getFavoriteFestivalsFromLocal(userId)
  }
  */
}

// 로컬 스토리지에서 즐겨찾기 가져오는 함수 (Supabase 연결 실패 시 사용)
function getFavoriteFestivalsFromLocal(userId: string): Festival[] {
  try {
    const favorites = JSON.parse(localStorage.getItem(`favorites_${userId}`) || '[]')

    if (favorites.length === 0) {
      return []
    }

    return DUMMY_FESTIVALS.filter(festival =>
      favorites.includes(festival.id)
    )
  } catch (error) {
    console.error('Error getting favorites from localStorage:', error)
    return []
  }
}

export async function addToFavorites(userId: string, festivalId: string) {
  // 로컬 스토리지에 즐겨찾기 추가 (Supabase 연결 전까지)
  try {
    const favoritesKey = `favorites_${userId}`
    const favorites = JSON.parse(localStorage.getItem(favoritesKey) || '[]')

    if (!favorites.includes(festivalId)) {
      favorites.push(festivalId)
      localStorage.setItem(favoritesKey, JSON.stringify(favorites))
    }

    return { id: Date.now().toString(), user_id: userId, festival_id: festivalId, created_at: new Date().toISOString() }
  } catch (error) {
    console.error('Error adding to localStorage favorites:', error)
    throw new Error('Failed to add to favorites')
  }

  // 실제 Supabase 구현 (환경 변수 설정 후 활성화)
  /*
  try {
    const { data, error } = await supabase
      .from('favorites')
      .insert({
        user_id: userId,
        festival_id: festivalId
      })
      .select()
      .single()

    if (error) {
      console.error('Supabase add to favorites error:', error)
      // 에러 발생 시 로컬 스토리지로 폴백
      return addToFavoritesLocal(userId, festivalId)
    }

    return data
  } catch (error) {
    console.error('Failed to add to Supabase favorites:', error)
    // 에러 발생 시 로컬 스토리지로 폴백
    return addToFavoritesLocal(userId, festivalId)
  }
  */
}

// 로컬 스토리지에 즐겨찾기 추가하는 함수 (Supabase 연결 실패 시 사용)
function addToFavoritesLocal(userId: string, festivalId: string) {
  try {
    const favoritesKey = `favorites_${userId}`
    const favorites = JSON.parse(localStorage.getItem(favoritesKey) || '[]')

    if (!favorites.includes(festivalId)) {
      favorites.push(festivalId)
      localStorage.setItem(favoritesKey, JSON.stringify(favorites))
    }

    return { id: Date.now().toString(), user_id: userId, festival_id: festivalId, created_at: new Date().toISOString() }
  } catch (error) {
    console.error('Error adding to localStorage favorites:', error)
    throw new Error('Failed to add to favorites')
  }
}

export async function removeFromFavorites(userId: string, festivalId: string) {
  // 로컬 스토리지에서 즐겨찾기 제거 (Supabase 연결 전까지)
  try {
    const favoritesKey = `favorites_${userId}`
    const favorites = JSON.parse(localStorage.getItem(favoritesKey) || '[]')

    const newFavorites = favorites.filter((id: string) => id !== festivalId)
    localStorage.setItem(favoritesKey, JSON.stringify(newFavorites))
  } catch (error) {
    console.error('Error removing from localStorage favorites:', error)
    throw new Error('Failed to remove from favorites')
  }

  // 실제 Supabase 구현 (환경 변수 설정 후 활성화)
  /*
  try {
    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', userId)
      .eq('festival_id', festivalId)

    if (error) {
      console.error('Supabase remove from favorites error:', error)
      // 에러 발생 시 로컬 스토리지로 폴백
      return removeFromFavoritesLocal(userId, festivalId)
    }
  } catch (error) {
    console.error('Failed to remove from Supabase favorites:', error)
    // 에러 발생 시 로컬 스토리지로 폴백
    return removeFromFavoritesLocal(userId, festivalId)
  }
  */
}

// 로컬 스토리지에서 즐겨찾기 제거하는 함수 (Supabase 연결 실패 시 사용)
function removeFromFavoritesLocal(userId: string, festivalId: string) {
  try {
    const favoritesKey = `favorites_${userId}`
    const favorites = JSON.parse(localStorage.getItem(favoritesKey) || '[]')

    const newFavorites = favorites.filter((id: string) => id !== festivalId)
    localStorage.setItem(favoritesKey, JSON.stringify(newFavorites))
  } catch (error) {
    console.error('Error removing from localStorage favorites:', error)
    throw new Error('Failed to remove from favorites')
  }
}
