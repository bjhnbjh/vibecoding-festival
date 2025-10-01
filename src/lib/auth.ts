import { User, UserRole } from '@/types/user';

/**
 * 사용자가 최고 관리자인지 확인
 */
export function isSuperAdmin(user: User | null): boolean {
  return user?.role === 'super_admin';
}

/**
 * 사용자가 대학 관리자 이상인지 확인
 */
export function isUniversityAdmin(user: User | null): boolean {
  return user?.role === 'university_admin' || user?.role === 'super_admin';
}

/**
 * 사용자가 특정 역할인지 확인
 */
export function hasRole(user: User | null, role: UserRole): boolean {
  return user?.role === role;
}

/**
 * 사용자가 특정 대학의 관리자인지 확인
 */
export function isUniversityAdminOf(user: User | null, university: string): boolean {
  if (!user || !university) return false;

  // 최고 관리자는 모든 대학 접근 가능
  if (user.role === 'super_admin') return true;

  // 대학 관리자는 자기 학교만 접근 가능
  if (user.role === 'university_admin') {
    return user.university === university;
  }

  return false;
}

/**
 * 사용자가 특정 축제를 수정할 권한이 있는지 확인
 */
export function canEditFestival(user: User | null, festivalUniversity: string): boolean {
  return isUniversityAdminOf(user, festivalUniversity);
}

/**
 * 역할에 따른 권한 레벨 반환 (숫자가 높을수록 높은 권한)
 */
export function getRoleLevel(role: UserRole): number {
  switch (role) {
    case 'super_admin':
      return 3;
    case 'university_admin':
      return 2;
    case 'user':
      return 1;
    default:
      return 0;
  }
}

/**
 * 사용자가 특정 권한 레벨 이상인지 확인
 */
export function hasMinimumRole(user: User | null, minimumRole: UserRole): boolean {
  if (!user) return false;
  return getRoleLevel(user.role) >= getRoleLevel(minimumRole);
}
