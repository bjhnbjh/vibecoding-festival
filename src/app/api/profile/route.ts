import { NextRequest, NextResponse } from 'next/server';

interface UserProfile {
  id: string;
  email: string;
  name: string;
  school: string;
  favoriteCount: number;
  couponCount: number;
  joinedAt: string;
}

// 더미 데이터 모드에서 사용자 정보 가져오기
function getUserFromStorage(): any {
  if (typeof window !== 'undefined') {
    try {
      const userJson = localStorage.getItem('festivalhub_user');
      return userJson ? JSON.parse(userJson) : null;
    } catch (error) {
      console.error('Error getting user from storage:', error);
      return null;
    }
  }
  return null;
}

// 더미 즐겨찾기 수 가져오기
function getDummyFavoriteCount(userId: string): number {
  // 실제 구현 시에는 데이터베이스에서 가져와야 함
  const favoritesMap: Record<string, number> = {
    '1': 5,
    '2': 3,
    '3': 7,
    '4': 2,
  };
  return favoritesMap[userId] || 0;
}

// 더미 쿠폰 수 가져오기
function getDummyCouponCount(userId: string): number {
  // 실제 구현 시에는 데이터베이스에서 가져와야 함
  const couponsMap: Record<string, number> = {
    '1': 3,
    '2': 1,
    '3': 4,
    '4': 1,
  };
  return couponsMap[userId] || 0;
}

export async function GET(request: NextRequest) {
  try {
    // 더미 데이터 모드에서 사용자 정보 가져오기
    const user = getUserFromStorage();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: '사용자를 찾을 수 없습니다.',
        },
        { status: 401 }
      );
    }

    // 프로필 정보 구성
    const profile: UserProfile = {
      id: user.id,
      email: user.email,
      name: user.name || '',
      school: user.university || '',
      favoriteCount: getDummyFavoriteCount(user.id),
      couponCount: getDummyCouponCount(user.id),
      joinedAt: user.createdAt,
    };

    return NextResponse.json({
      success: true,
      data: profile,
    });
  } catch (error) {
    console.error('프로필 조회 오류:', error);
    return NextResponse.json(
      {
        success: false,
        error: '프로필을 불러오는 중 오류가 발생했습니다.',
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    // 더미 데이터 모드에서 사용자 정보 가져오기
    const user = getUserFromStorage();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: '사용자를 찾을 수 없습니다.',
        },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, school } = body;

    // 입력 검증
    if (!name || name.trim().length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: '이름을 입력해주세요.',
        },
        { status: 400 }
      );
    }

    if (!school || school.trim().length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: '학교명을 입력해주세요.',
        },
        { status: 400 }
      );
    }

    // 더미 데이터 모드에서 사용자 정보 업데이트
    const updatedUser = {
      ...user,
      name: name.trim(),
      university: school.trim(),
    };

    // 로컬 스토리지에 업데이트된 정보 저장
    if (typeof window !== 'undefined') {
      localStorage.setItem('festivalhub_user', JSON.stringify(updatedUser));
    }

    // 업데이트된 프로필 정보 반환
    const updatedProfile: UserProfile = {
      id: updatedUser.id,
      email: updatedUser.email,
      name: updatedUser.name,
      school: updatedUser.university,
      favoriteCount: getDummyFavoriteCount(updatedUser.id),
      couponCount: getDummyCouponCount(updatedUser.id),
      joinedAt: updatedUser.createdAt,
    };

    return NextResponse.json({
      success: true,
      data: updatedProfile,
      message: '프로필이 성공적으로 업데이트되었습니다.',
    });
  } catch (error) {
    console.error('프로필 업데이트 오류:', error);
    return NextResponse.json(
      {
        success: false,
        error: '프로필 업데이트 중 오류가 발생했습니다.',
      },
      { status: 500 }
    );
  }
}
