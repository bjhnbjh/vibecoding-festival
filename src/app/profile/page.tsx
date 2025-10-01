'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

interface UserProfile {
  id: string;
  email: string;
  name: string;
  school: string;
  favoriteCount: number;
  couponCount: number;
  joinedAt: string;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    school: ''
  });
  const { user, logout } = useAuth();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('/api/profile');
        if (response.ok) {
          const result = await response.json();
          if (result.success && result.data) {
            setProfile(result.data);
            setEditForm({
              name: result.data.name || '',
              school: result.data.school || ''
            });
          } else {
            console.error('프로필 조회 실패:', result.error);
            setProfile(null);
          }
        } else {
          console.error('프로필 조회 응답 오류:', response.status);
          setProfile(null);
        }
      } catch (error) {
        console.error('프로필 조회 중 오류:', error);
        setProfile(null);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchProfile();
    } else {
      setIsLoading(false);
    }
  }, [user]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (profile) {
      setEditForm({
        name: profile.name || '',
        school: profile.school || ''
      });
    }
  };

  const handleSave = async () => {
    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editForm),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setProfile(result.data);
        setIsEditing(false);
        alert('프로필이 성공적으로 업데이트되었습니다.');
      } else {
        alert(result.error || '프로필 업데이트에 실패했습니다.');
      }
    } catch (error) {
      console.error('프로필 업데이트 중 오류:', error);
      alert('프로필 업데이트 중 오류가 발생했습니다.');
    }
  };

  const handleLogout = () => {
    logout();
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full text-center">
          <div className="text-6xl mb-4">👤</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">로그인이 필요합니다</h2>
          <p className="text-gray-600 mb-6">프로필을 확인하시려면 로그인해주세요.</p>
          <div className="space-x-4">
            <Button>로그인</Button>
            <Button variant="outline">회원가입</Button>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">프로필을 불러올 수 없습니다</h2>
          <p className="text-gray-600 mb-6">프로필 정보를 불러오는 중 오류가 발생했습니다.</p>
          <Button onClick={() => window.location.reload()}>다시 시도</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">내 프로필</h1>
          <p className="text-gray-600">개인 정보를 확인하고 수정할 수 있습니다.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 프로필 정보 */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">기본 정보</h2>
                {!isEditing ? (
                  <Button onClick={handleEdit} variant="outline">
                    수정하기
                  </Button>
                ) : (
                  <div className="space-x-2">
                    <Button onClick={handleSave} size="sm">
                      저장
                    </Button>
                    <Button onClick={handleCancel} variant="outline" size="sm">
                      취소
                    </Button>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    이메일
                  </label>
                  <p className="text-gray-900">{profile.email}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    이름
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                    />
                  ) : (
                    <p className="text-gray-900">{profile.name || '등록되지 않음'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    학교
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editForm.school}
                      onChange={(e) => setEditForm(prev => ({ ...prev, school: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                      placeholder="학교명을 입력하세요"
                    />
                  ) : (
                    <p className="text-gray-900">{profile.school || '등록되지 않음'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    가입일
                  </label>
                  <p className="text-gray-900">
                    {new Date(profile.joinedAt).toLocaleDateString('ko-KR')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 통계 및 활동 */}
          <div className="space-y-6">
            {/* 통계 카드 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">활동 통계</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">즐겨찾기</span>
                  <span className="font-semibold text-purple-600">{profile.favoriteCount}개</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">쿠폰</span>
                  <span className="font-semibold text-green-600">{profile.couponCount}개</span>
                </div>
              </div>
            </div>

            {/* 빠른 메뉴 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">빠른 메뉴</h3>
              <div className="space-y-3">
                <a
                  href="/favorites"
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md"
                >
                  🎯 즐겨찾기 관리
                </a>
                <a
                  href="/coupons"
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md"
                >
                  🎫 쿠폰 관리
                </a>
                <a
                  href="/search"
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md"
                >
                  🔍 축제 검색
                </a>
              </div>
            </div>

            {/* 로그아웃 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <Button
                onClick={handleLogout}
                variant="outline"
                className="w-full text-red-600 border-red-300 hover:bg-red-50"
              >
                로그아웃
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
