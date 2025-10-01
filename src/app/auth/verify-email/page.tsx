'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Mail, CheckCircle, RefreshCw } from 'lucide-react';

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);

  useEffect(() => {
    const emailParam = searchParams.get('email');
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [searchParams]);

  const handleResendEmail = async () => {
    setResending(true);
    try {
      // Supabase에서 이메일 재전송 로직 추가 가능
      // 현재는 UI만 표시
      await new Promise(resolve => setTimeout(resolve, 1000));
      setResent(true);
      setTimeout(() => setResent(false), 3000);
    } catch (error) {
      console.error('이메일 재전송 오류:', error);
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-festival-50 via-white to-sunset-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 text-center">
          {/* 아이콘 */}
          <div className="w-20 h-20 bg-gradient-to-br from-festival-400 to-festival-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Mail className="w-10 h-10 text-white" />
          </div>

          {/* 제목 */}
          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            이메일을 확인해주세요
          </h1>

          {/* 설명 */}
          <div className="space-y-3 mb-8">
            <p className="text-gray-600">
              회원가입이 거의 완료되었습니다!
            </p>
            <p className="text-gray-600">
              <strong className="text-festival-600">{email}</strong>로<br />
              인증 이메일을 보내드렸습니다.
            </p>
            <p className="text-sm text-gray-500">
              이메일의 인증 링크를 클릭하여 회원가입을 완료해주세요.
            </p>
          </div>

          {/* 체크리스트 */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">📋 다음 단계:</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <span>이메일 받은편지함을 확인하세요</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <span>스팸 또는 프로모션 폴더도 확인해보세요</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <span>"이메일 인증" 버튼을 클릭하세요</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <span>인증 완료 후 로그인하세요</span>
              </li>
            </ul>
          </div>

          {/* 이메일 재전송 */}
          <div className="space-y-3">
            {resent ? (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
                ✅ 인증 이메일이 재전송되었습니다!
              </div>
            ) : (
              <Button
                onClick={handleResendEmail}
                disabled={resending}
                variant="outline"
                className="w-full"
              >
                {resending ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    전송 중...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    인증 이메일 다시 보내기
                  </>
                )}
              </Button>
            )}

            <Link href="/login">
              <Button className="w-full bg-gradient-to-r from-festival-500 to-festival-600 hover:from-festival-600 hover:to-festival-700 text-white">
                로그인 페이지로 이동
              </Button>
            </Link>
          </div>

          {/* 추가 도움말 */}
          <p className="text-xs text-gray-500 mt-6">
            이메일이 도착하지 않나요?<br />
            이메일 주소를 올바르게 입력했는지 확인하거나 잠시 후 다시 시도해주세요.
          </p>
        </div>
      </div>
    </div>
  );
}
