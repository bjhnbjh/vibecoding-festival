'use client';

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Calendar, MapPin, Star, Search, Sparkles, Music, Users, Zap } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

function HomeContent() {
  const { isAuthenticated, user } = useAuth()

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-festival-300 rounded-full opacity-20 animate-float"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-sunset-400 rounded-full opacity-20 animate-bounce-slow"></div>
        <div className="absolute bottom-40 left-20 w-20 h-20 bg-ocean-400 rounded-full opacity-20 animate-pulse-slow"></div>
        <div className="absolute bottom-20 right-10 w-28 h-28 bg-spring-400 rounded-full opacity-20 animate-float" style={{animationDelay: '2s'}}></div>
      </div>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-festival-100 to-sunset-100 dark:from-festival-900/30 dark:to-sunset-900/30 rounded-full px-6 py-2 mb-8">
            <Zap className="w-5 h-5 text-festival-600" />
            <span className="text-sm font-medium text-festival-700 dark:text-festival-300">실시간 축제 업데이트</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="text-gray-900 dark:text-white block">모든 대학 축제를</span>
            <span className="gradient-text block mt-2">한 곳에서</span>
          </h1>

          <p className="text-xl text-gray-600 dark:text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed">
            🎪 전국 대학생들이 모든 대학 축제 정보를 쉽게 찾고,
            🎵 실시간으로 참여할 수 있는 통합 플랫폼
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            {isAuthenticated ? (
              <>
                <Link href="/festivals">
                  <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-festival-500 to-festival-600 hover:from-festival-600 hover:to-festival-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                    <Search className="w-5 h-5 mr-2" />
                    🎪 축제 둘러보기
                  </Button>
                </Link>
                <Link href="/favorites">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto border-2 border-festival-200 hover:border-festival-400 hover:bg-festival-50 dark:hover:bg-festival-900/20 transition-all duration-300 transform hover:scale-105">
                    <Star className="w-5 h-5 mr-2 text-festival-500" />
                    ⭐ 즐겨찾기 관리
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-festival-500 to-festival-600 hover:from-festival-600 hover:to-festival-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                    <Search className="w-5 h-5 mr-2" />
                    🎪 로그인하고 시작하기
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto border-2 border-festival-200 hover:border-festival-400 hover:bg-festival-50 dark:hover:bg-festival-900/20 transition-all duration-300 transform hover:scale-105">
                    <Star className="w-5 h-5 mr-2 text-festival-500" />
                    ⭐ 무료로 가입하기
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Features */}
        <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="group text-center p-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl card-hover border border-white/20 dark:border-gray-700/20">
            <div className="w-16 h-16 bg-gradient-to-br from-festival-400 to-festival-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
              <Calendar className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              ⚡ 실시간 정보
            </h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              축제 일정 변경과 긴급 공지사항을 실시간으로 받아보세요
            </p>
          </div>

          <div className="group text-center p-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl card-hover border border-white/20 dark:border-gray-700/20">
            <div className="w-16 h-16 bg-gradient-to-br from-ocean-400 to-ocean-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
              <MapPin className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              📍 위치 기반 검색
            </h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              주변 대학 축제와 교통 정보를 쉽게 확인할 수 있습니다
            </p>
          </div>

          <div className="group text-center p-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl card-hover border border-white/20 dark:border-gray-700/20">
            <div className="w-16 h-16 bg-gradient-to-br from-spring-400 to-spring-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
              <Star className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              🎯 맞춤형 추천
            </h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              관심사와 참여 기록을 바탕으로 개인맞춤형 축제를 추천해드립니다
            </p>
          </div>
        </div>

        {/* Additional Features */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-8 bg-gradient-to-br from-festival-50 to-sunset-50 dark:from-festival-900/20 dark:to-sunset-900/20 rounded-2xl border border-festival-100 dark:border-festival-800">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-festival-400 to-festival-600 rounded-xl flex items-center justify-center">
                <Music className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-gray-900 dark:text-white">🎵 라이브 공연 정보</h4>
                <p className="text-gray-600 dark:text-gray-400">실시간 공연 라인업과 아티스트 정보</p>
              </div>
            </div>
            <p className="text-gray-700 dark:text-gray-300">
              인기 아티스트의 공연 일정과 출연진 정보를 실시간으로 확인하세요.
            </p>
          </div>

          <div className="p-8 bg-gradient-to-br from-ocean-50 to-spring-50 dark:from-ocean-900/20 dark:to-spring-900/20 rounded-2xl border border-ocean-100 dark:border-ocean-800">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-ocean-400 to-ocean-600 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-gray-900 dark:text-white">👥 커뮤니티</h4>
                <p className="text-gray-600 dark:text-gray-400">다른 대학생들과 함께하는 축제</p>
              </div>
            </div>
            <p className="text-gray-700 dark:text-gray-300">
              같은 관심사를 가진 대학생들과 함께 축제를 즐기고 소통하세요.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-24 relative overflow-hidden bg-gradient-to-br from-festival-500 via-sunset-500 to-ocean-500 rounded-3xl p-12 md:p-16 text-center shadow-2xl">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <div className="inline-flex items-center space-x-2 bg-white/20 rounded-full px-6 py-2 mb-6">
              <Sparkles className="w-5 h-5 text-white animate-pulse-slow" />
              <span className="text-sm font-medium text-white">지금 바로 시작하세요!</span>
            </div>
            <h3 className="text-4xl md:text-5xl font-bold text-white mb-6">
              🎪 새로운 축제 경험을
              <br />
              <span className="text-yellow-200">시작해보세요</span>
            </h3>
            <p className="text-white/90 mb-10 max-w-2xl mx-auto text-lg leading-relaxed">
              FestivalHub와 함께 모든 대학 축제의 정보를 한 곳에서 만나보세요.
              새로운 축제 경험을 시작해보세요.
            </p>
            {isAuthenticated ? (
              <Link href="/festivals">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto bg-white text-festival-600 hover:bg-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 font-semibold">
                  🎪 축제 목록 보기
                </Button>
              </Link>
            ) : (
              <Link href="/signup">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto bg-white text-festival-600 hover:bg-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 font-semibold">
                  🎪 무료로 시작하기
                </Button>
              </Link>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default function Home() {
  return <HomeContent />
}
