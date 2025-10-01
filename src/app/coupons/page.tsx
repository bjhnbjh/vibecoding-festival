'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

interface Coupon {
  id: string;
  title: string;
  description: string;
  discount: number;
  validUntil: string;
  status: 'available' | 'used' | 'expired';
  festivalId: string;
  festivalName: string;
}

export default function CouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'available' | 'used' | 'expired'>('available');
  const { user } = useAuth();

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const response = await fetch('/api/coupons');
        if (response.ok) {
          const data = await response.json();
          setCoupons(data);
        }
      } catch (error) {
        console.error('Failed to fetch coupons:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchCoupons();
    } else {
      setIsLoading(false);
    }
  }, [user]);

  const filteredCoupons = coupons.filter(coupon => coupon.status === activeTab);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full text-center">
          <div className="text-6xl mb-4">🎫</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">로그인이 필요합니다</h2>
          <p className="text-gray-600 mb-6">쿠폰을 사용하시려면 로그인해주세요.</p>
          <div className="space-x-4">
            <Link href="/login">
              <Button>로그인</Button>
            </Link>
            <Link href="/signup">
              <Button variant="outline">회원가입</Button>
            </Link>
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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">내 쿠폰</h1>
          <p className="text-gray-600">보유하고 있는 쿠폰들을 확인하고 사용할 수 있습니다.</p>
        </div>

        {/* 탭 메뉴 */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { key: 'available', label: '사용 가능', count: coupons.filter(c => c.status === 'available').length },
                { key: 'used', label: '사용 완료', count: coupons.filter(c => c.status === 'used').length },
                { key: 'expired', label: '만료됨', count: coupons.filter(c => c.status === 'expired').length }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as typeof activeTab)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.key
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label} ({tab.count})
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* 쿠폰 목록 */}
        {filteredCoupons.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredCoupons.map((coupon) => (
              <div key={coupon.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{coupon.title}</h3>
                    <p className="text-sm text-gray-600">{coupon.festivalName}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-green-600">{coupon.discount}%</span>
                    <p className="text-sm text-gray-500">할인</p>
                  </div>
                </div>

                <p className="text-gray-700 mb-4">{coupon.description}</p>

                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-500">
                    유효기간: {new Date(coupon.validUntil).toLocaleDateString('ko-KR')}
                  </div>

                  {coupon.status === 'available' && (
                    <Link href={`/coupons/${coupon.id}`}>
                      <Button size="sm">사용하기</Button>
                    </Link>
                  )}

                  {coupon.status === 'used' && (
                    <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                      사용 완료
                    </span>
                  )}

                  {coupon.status === 'expired' && (
                    <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                      만료됨
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🎫</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {activeTab === 'available' ? '보유한 쿠폰이 없습니다' : '해당하는 쿠폰이 없습니다'}
            </h3>
            <p className="text-gray-600 mb-4">
              {activeTab === 'available'
                ? '축제에 참여하면 쿠폰을 받을 수 있습니다.'
                : '다른 탭을 확인해보세요.'}
            </p>
            <Link href="/festivals">
              <Button>축제 둘러보기</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
