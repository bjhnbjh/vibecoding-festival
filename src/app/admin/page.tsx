'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { isUniversityAdmin, isSuperAdmin } from '@/lib/auth';
import Link from 'next/link';
import {
  Plus,
  List,
  Users,
  Settings,
  BarChart,
  Calendar,
  Mail,
  Award
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AdminPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && (!user || !isUniversityAdmin(user))) {
      router.push('/');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-festival-600"></div>
      </div>
    );
  }

  if (!user || !isUniversityAdmin(user)) {
    return null;
  }

  const adminCards = [
    {
      title: '축제 등록',
      description: '새로운 축제를 등록합니다',
      icon: Plus,
      href: '/admin/festivals/new',
      color: 'from-blue-500 to-blue-600',
    },
    {
      title: '축제 관리',
      description: '등록된 축제를 수정하거나 삭제합니다',
      icon: List,
      href: '/admin/festivals',
      color: 'from-purple-500 to-purple-600',
    },
    {
      title: '통계',
      description: '축제 조회수 및 통계를 확인합니다',
      icon: BarChart,
      href: '/admin/stats',
      color: 'from-green-500 to-green-600',
    },
    {
      title: '우편함 관리',
      description: '사용자에게 쿠폰 및 알림을 발송합니다',
      icon: Mail,
      href: '/admin/inbox',
      color: 'from-pink-500 to-pink-600',
    },
  ];

  // 최고 관리자 전용 카드
  const superAdminCards = [
    {
      title: '사용자 관리',
      description: '사용자 및 권한을 관리합니다',
      icon: Users,
      href: '/admin/users',
      color: 'from-red-500 to-red-600',
    },
    {
      title: '시스템 설정',
      description: '시스템 전반의 설정을 관리합니다',
      icon: Settings,
      href: '/admin/settings',
      color: 'from-gray-500 to-gray-600',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            관리자 대시보드
          </h1>
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <Award className="w-5 h-5" />
            <span>
              {user.role === 'super_admin'
                ? '최고 관리자'
                : `${user.university} 관리자`}
            </span>
          </div>
        </div>

        {/* 관리자 카드 그리드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {adminCards.map((card) => {
            const Icon = card.icon;
            return (
              <Link
                key={card.href}
                href={card.href}
                className="block group"
              >
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 dark:border-gray-700 hover:border-festival-400">
                  <div className={`w-12 h-12 bg-gradient-to-br ${card.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {card.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {card.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>

        {/* 최고 관리자 전용 섹션 */}
        {isSuperAdmin(user) && (
          <>
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                최고 관리자 전용
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {superAdminCards.map((card) => {
                const Icon = card.icon;
                return (
                  <Link
                    key={card.href}
                    href={card.href}
                    className="block group"
                  >
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 dark:border-gray-700 hover:border-red-400">
                      <div className={`w-12 h-12 bg-gradient-to-br ${card.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        {card.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {card.description}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </>
        )}

        {/* 빠른 통계 */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            빠른 통계
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <Calendar className="w-8 h-8 text-festival-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900 dark:text-white">-</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">등록된 축제</p>
            </div>
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <Users className="w-8 h-8 text-festival-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900 dark:text-white">-</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">총 방문자</p>
            </div>
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <Award className="w-8 h-8 text-festival-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900 dark:text-white">-</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">즐겨찾기</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
