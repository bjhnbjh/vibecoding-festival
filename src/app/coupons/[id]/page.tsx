'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

interface CouponDetail {
  id: string;
  title: string;
  description: string;
  discount: number;
  validUntil: string;
  status: 'available' | 'used' | 'expired';
  festivalId: string;
  festivalName: string;
  usageInstructions: string;
  termsAndConditions: string;
  qrCode: string;
}

export default function CouponDetailPage() {
  const [coupon, setCoupon] = useState<CouponDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showQR, setShowQR] = useState(false);
  const { id } = useParams();
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const fetchCoupon = async () => {
      try {
        const response = await fetch(`/api/coupons/${id}`);
        if (response.ok) {
          const data = await response.json();
          setCoupon(data);
        } else {
          setError('쿠폰을 찾을 수 없습니다.');
        }
      } catch (error) {
        console.error('Failed to fetch coupon:', error);
        setError('쿠폰을 불러오는 중 오류가 발생했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    if (id && user) {
      fetchCoupon();
    } else {
      setIsLoading(false);
    }
  }, [id, user]);

  const handleUseCoupon = async () => {
    if (!coupon) return;

    try {
      const response = await fetch(`/api/coupons/${id}/use`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setCoupon(prev => prev ? { ...prev, status: 'used' } : null);
        alert('쿠폰이 성공적으로 사용되었습니다!');
      } else {
        alert('쿠폰 사용에 실패했습니다.');
      }
    } catch (error) {
      console.error('Failed to use coupon:', error);
      alert('쿠폰 사용 중 오류가 발생했습니다.');
    }
  };

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

  if (error || !coupon) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">쿠폰을 찾을 수 없습니다</h2>
          <p className="text-gray-600 mb-6">{error || '존재하지 않는 쿠폰입니다.'}</p>
          <Link href="/coupons">
            <Button>쿠폰 목록으로 돌아가기</Button>
          </Link>
        </div>
      </div>
    );
  }

  const isExpired = new Date(coupon.validUntil) < new Date();
  const isUsed = coupon.status === 'used';

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 헤더 */}
        <div className="mb-8">
          <Link href="/coupons" className="text-purple-600 hover:text-purple-700 mb-4 inline-block">
            ← 쿠폰 목록으로 돌아가기
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{coupon.title}</h1>
          <p className="text-gray-600">{coupon.festivalName}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 쿠폰 정보 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <span className="text-3xl font-bold text-green-600">{coupon.discount}%</span>
                <p className="text-gray-600">할인</p>
              </div>
              <div className="text-right">
                {isUsed && (
                  <span className="px-3 py-1 text-sm font-medium bg-gray-100 text-gray-800 rounded-full">
                    사용 완료
                  </span>
                )}
                {isExpired && !isUsed && (
                  <span className="px-3 py-1 text-sm font-medium bg-red-100 text-red-800 rounded-full">
                    만료됨
                  </span>
                )}
                {!isExpired && !isUsed && (
                  <span className="px-3 py-1 text-sm font-medium bg-green-100 text-green-800 rounded-full">
                    사용 가능
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">설명</h3>
                <p className="text-gray-700">{coupon.description}</p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">유효기간</h3>
                <p className="text-gray-700">
                  {new Date(coupon.validUntil).toLocaleDateString('ko-KR')} 까지
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">사용 방법</h3>
                <p className="text-gray-700">{coupon.usageInstructions}</p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">이용 약관</h3>
                <p className="text-sm text-gray-600">{coupon.termsAndConditions}</p>
              </div>
            </div>

            {!isExpired && !isUsed && (
              <div className="mt-6">
                <Button
                  onClick={handleUseCoupon}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  쿠폰 사용하기
                </Button>
              </div>
            )}
          </div>

          {/* QR 코드 영역 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">모바일 쿠폰</h3>

              {showQR ? (
                <div className="mb-4">
                  <div className="w-64 h-64 mx-auto bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-4xl mb-2">📱</div>
                      <p className="text-sm text-gray-600">QR 코드</p>
                      <p className="text-xs text-gray-500 mt-1">현장에서 제시하세요</p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setShowQR(false)}
                    className="mt-4"
                  >
                    QR 코드 숨기기
                  </Button>
                </div>
              ) : (
                <div className="mb-4">
                  <div className="w-64 h-64 mx-auto bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg flex items-center justify-center cursor-pointer hover:from-purple-200 hover:to-blue-200 transition-colors" onClick={() => setShowQR(true)}>
                    <div className="text-center">
                      <div className="text-6xl mb-2">🎫</div>
                      <p className="text-gray-700">QR 코드 보기</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="text-sm text-gray-600">
                <p className="mb-2">💡 사용 팁:</p>
                <ul className="list-disc list-inside space-y-1 text-left">
                  <li>현장에서 매장 직원에게 QR 코드를 보여주세요</li>
                  <li>쿠폰은 1회만 사용 가능합니다</li>
                  <li>유효기간이 지나면 자동으로 만료됩니다</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
