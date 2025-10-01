'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Sparkles, Users, Mail, Lock, User, GraduationCap, Eye, EyeOff } from 'lucide-react';

export default function SignupPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    school: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { signup } = useAuth();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('비밀번호는 최소 6자 이상이어야 합니다.');
      setIsLoading(false);
      return;
    }

    try {
      const result = await signup({
        email: formData.email,
        password: formData.password,
        name: formData.name,
        school: formData.school
      });

      if (result.success) {
        router.push('/login?message=회원가입이 완료되었습니다. 로그인해주세요.');
      } else {
        setError(result.error || '회원가입에 실패했습니다.');
      }
    } catch (err) {
      setError('회원가입 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-festival-300 rounded-full opacity-20 animate-float"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-sunset-400 rounded-full opacity-20 animate-bounce-slow"></div>
        <div className="absolute bottom-40 left-20 w-20 h-20 bg-ocean-400 rounded-full opacity-20 animate-pulse-slow"></div>
        <div className="absolute bottom-20 right-10 w-28 h-28 bg-spring-400 rounded-full opacity-20 animate-float" style={{animationDelay: '2s'}}></div>
      </div>

      {/* Main content */}
      <main className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-festival-100 to-sunset-100 dark:from-festival-900/30 dark:to-sunset-900/30 rounded-full px-6 py-2 mb-8">
            <Sparkles className="w-5 h-5 text-festival-600" />
            <span className="text-sm font-medium text-festival-700 dark:text-festival-300">새로운 축제 경험을 시작하세요!</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            <span className="text-gray-900 dark:text-white block">FestivalHub와 함께</span>
            <span className="gradient-text block mt-2">새로운 시작을</span>
          </h1>

          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed">
            🎪 모든 대학 축제 정보를 한 곳에서 만나보세요
          </p>
        </div>

        <div className="max-w-md mx-auto">
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/20 p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-festival-400 to-festival-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                FestivalHub 회원가입
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                이미 계정이 있으신가요?{' '}
                <Link href="/login" className="font-medium text-festival-600 hover:text-festival-500 transition-colors">
                  로그인하기
                </Link>
              </p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-5">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <Mail className="w-4 h-4 inline mr-2" />
                    이메일
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-festival-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                    placeholder="이메일 주소"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <User className="w-4 h-4 inline mr-2" />
                    이름
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-festival-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                    placeholder="이름"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label htmlFor="school" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <GraduationCap className="w-4 h-4 inline mr-2" />
                    학교 (선택사항)
                  </label>
                  <input
                    id="school"
                    name="school"
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-festival-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                    placeholder="학교명을 입력하세요"
                    value={formData.school}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <Lock className="w-4 h-4 inline mr-2" />
                    비밀번호
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      required
                      className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-festival-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                      placeholder="비밀번호 (최소 6자)"
                      value={formData.password}
                      onChange={handleChange}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <Lock className="w-4 h-4 inline mr-2" />
                    비밀번호 확인
                  </label>
                  <div className="relative">
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-festival-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                      placeholder="비밀번호 확인"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-festival-500 to-festival-600 hover:from-festival-600 hover:to-festival-700 text-white py-3 px-4 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isLoading ? '회원가입 중...' : '🎪 FestivalHub 시작하기'}
                </Button>

                <div className="text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    회원가입 시 FestivalHub의{' '}
                    <Link href="/terms" className="text-festival-600 hover:text-festival-500 underline">
                      이용약관
                    </Link>
                    {' '}및{' '}
                    <Link href="/privacy" className="text-festival-600 hover:text-festival-500 underline">
                      개인정보처리방침
                    </Link>
                    에 동의하게 됩니다.
                  </p>
                </div>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
