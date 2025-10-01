'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('이메일 인증을 처리하고 있습니다...');

  useEffect(() => {
    const handleEmailConfirmation = async () => {
      try {
        // URL 해시에서 토큰 추출 (Supabase는 해시 프래그먼트 사용)
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');
        const type = hashParams.get('type');

        console.log('Callback params:', { accessToken: !!accessToken, refreshToken: !!refreshToken, type });

        // access_token이 있으면 이메일 인증 성공
        if (accessToken && refreshToken) {
          // Supabase 세션 설정
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (error) {
            console.error('세션 설정 오류:', error);
            setStatus('error');
            setMessage('이메일 인증에 실패했습니다. 다시 시도해주세요.');
            setTimeout(() => router.push('/login'), 3000);
            return;
          }

          if (data.session && data.user) {
            const userData = {
              id: data.user.id,
              email: data.user.email || '',
              name: data.user.user_metadata?.name || '',
              university: data.user.user_metadata?.university,
              createdAt: data.user.created_at,
            };

            localStorage.setItem('festivalhub_user', JSON.stringify(userData));

            setStatus('success');
            setMessage('이메일 인증이 완료되었습니다! 홈으로 이동합니다...');

            setTimeout(() => {
              router.push('/');
            }, 2000);
          }
        } else {
          // 토큰이 없으면 기존 세션 확인
          const { data: { session } } = await supabase.auth.getSession();

          if (session) {
            const userData = {
              id: session.user.id,
              email: session.user.email || '',
              name: session.user.user_metadata?.name || '',
              university: session.user.user_metadata?.university,
              createdAt: session.user.created_at,
            };

            localStorage.setItem('festivalhub_user', JSON.stringify(userData));

            setStatus('success');
            setMessage('이미 인증되었습니다! 홈으로 이동합니다...');

            setTimeout(() => {
              router.push('/');
            }, 2000);
          } else {
            setStatus('error');
            setMessage('인증 토큰을 찾을 수 없습니다. 다시 시도해주세요.');
            setTimeout(() => router.push('/login'), 3000);
          }
        }
      } catch (error) {
        console.error('인증 처리 오류:', error);
        setStatus('error');
        setMessage('오류가 발생했습니다. 다시 시도해주세요.');
        setTimeout(() => router.push('/login'), 3000);
      }
    };

    handleEmailConfirmation();
  }, [router, searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-festival-50 via-white to-sunset-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          {status === 'loading' && (
            <>
              <div className="w-16 h-16 border-4 border-festival-200 border-t-festival-600 rounded-full animate-spin mx-auto mb-6"></div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">처리 중...</h2>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">인증 완료!</h2>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">인증 실패</h2>
            </>
          )}

          <p className="text-gray-600">{message}</p>
        </div>
      </div>
    </div>
  );
}
