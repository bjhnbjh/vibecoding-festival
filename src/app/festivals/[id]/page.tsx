'use client';

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Festival } from '@/types/festival'
import { Calendar, MapPin, Users, Clock, Star, Sparkles, Heart, ArrowLeft, Navigation, Share2, Music, Utensils, Car, Train } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

function FestivalDetailContent() {
  const params = useParams()
  const { user, isAuthenticated } = useAuth()
  const [festival, setFestival] = useState<Festival | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isFavorite, setIsFavorite] = useState(false)
  const [isLoadingFavorite, setIsLoadingFavorite] = useState(false)

  useEffect(() => {
    const fetchFestival = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`/api/festivals/${params.id}`)

        if (!response.ok) {
          throw new Error('Failed to fetch festival')
        }

        const result = await response.json()

        if (result.success) {
          setFestival(result.data.festival)
        }
      } catch (error) {
        console.error('Error fetching festival:', error)
      } finally {
        setIsLoading(false)
      }
    }

    if (params.id) {
      fetchFestival()
    }
  }, [params.id])

  // 즐겨찾기 상태 확인
  useEffect(() => {
    if (user && isAuthenticated && festival) {
      const favorites = JSON.parse(localStorage.getItem(`favorites_${user.id}`) || '[]')
      setIsFavorite(favorites.includes(festival.id))
    }
  }, [user, isAuthenticated, festival])

  const toggleFavorite = async () => {
    if (!user || !isAuthenticated || !festival) return

    setIsLoadingFavorite(true)

    try {
      const favoritesKey = `favorites_${user.id}`
      const favorites = JSON.parse(localStorage.getItem(favoritesKey) || '[]')

      if (isFavorite) {
        const newFavorites = favorites.filter((id: string) => id !== festival.id)
        localStorage.setItem(favoritesKey, JSON.stringify(newFavorites))
        setIsFavorite(false)
      } else {
        favorites.push(festival.id)
        localStorage.setItem(favoritesKey, JSON.stringify(favorites))
        setIsFavorite(true)
      }
    } catch (error) {
      console.error('즐겨찾기 토글 중 오류:', error)
    } finally {
      setIsLoadingFavorite(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    })
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-festival-50 via-white to-sunset-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-festival-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">축제 정보를 불러오는 중...</p>
        </div>
      </div>
    )
  }

  if (!festival) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-festival-50 via-white to-sunset-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🎪</div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">축제를 찾을 수 없습니다</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">요청하신 축제 정보를 찾을 수 없습니다.</p>
          <Link href="/festivals">
            <Button className="bg-gradient-to-r from-festival-500 to-festival-600 hover:from-festival-600 hover:to-festival-700 text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              축제 목록으로 돌아가기
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const daysUntilStart = Math.ceil((new Date(festival.startDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))

  return (
    <div className="min-h-screen bg-gradient-to-br from-festival-50 via-white to-sunset-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="relative bg-gradient-to-r from-festival-600 via-festival-500 to-sunset-500 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-6">
            <Link href="/festivals" className="inline-flex items-center text-white/90 hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5 mr-2" />
              뒤로가기
            </Link>

            <div className="flex items-center space-x-3">
              <Button variant="secondary" size="sm" className="bg-white/20 hover:bg-white/30 text-white border-white/30">
                <Share2 className="w-4 h-4 mr-2" />
                공유하기
              </Button>

              {isAuthenticated && (
                <button
                  onClick={toggleFavorite}
                  disabled={isLoadingFavorite}
                  className={`p-2 rounded-full transition-all duration-200 ${
                    isFavorite
                      ? 'bg-red-500 hover:bg-red-600 text-white'
                      : 'bg-white/20 hover:bg-white/30 text-white'
                  }`}
                >
                  {isLoadingFavorite ? (
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
                  )}
                </button>
              )}
            </div>
          </div>

          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">{festival.name}</h1>
            <p className="text-xl text-white/90 mb-6">{festival.description}</p>

            <div className="flex items-center justify-center space-x-6 text-white/90">
              <div className="flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                <span>{festival.university} • {festival.region}</span>
              </div>
              <div className="flex items-center">
                <Star className="w-5 h-5 mr-2 text-yellow-300 fill-current" />
                <span>4.8</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Status Badge */}
        <div className="flex justify-center mb-8">
          {daysUntilStart < 0 ? (
            <div className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 px-6 py-3 rounded-full text-lg font-medium">
              🎪 축제가 종료되었습니다
            </div>
          ) : daysUntilStart === 0 ? (
            <div className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-6 py-3 rounded-full text-lg font-medium animate-pulse">
              🎊 축제가 진행 중입니다!
            </div>
          ) : daysUntilStart <= 7 ? (
            <div className="bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 px-6 py-3 rounded-full text-lg font-medium">
              ⏰ D-{daysUntilStart}일 남음
            </div>
          ) : (
            <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-6 py-3 rounded-full text-lg font-medium">
              📅 예정된 축제
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Basic Information */}
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 dark:border-gray-700/20 p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                <Calendar className="w-6 h-6 mr-3 text-festival-600" />
                기본 정보
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">축제 기간</label>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {formatDate(festival.startDate)} - {formatDate(festival.endDate)}
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">장소</label>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                      <MapPin className="w-5 h-5 mr-2 text-festival-600" />
                      {festival.location}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">입장료</label>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {festival.admission.fee === 0 ? '무료' : `${festival.admission.fee.toLocaleString()} ${festival.admission.currency}`}
                    </p>
                    {festival.admission.notes && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {festival.admission.notes}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">공연 수</label>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                      <Music className="w-5 h-5 mr-2 text-festival-600" />
                      {festival.lineup.length}개 공연
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Lineup */}
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 dark:border-gray-700/20 p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                <Music className="w-6 h-6 mr-3 text-festival-600" />
                라인업
              </h2>

              <div className="space-y-4">
                {festival.lineup.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gradient-to-r from-festival-50 to-sunset-50 dark:from-festival-900/20 dark:to-sunset-900/20 rounded-xl border border-festival-100 dark:border-festival-800">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-festival-400 to-festival-600 rounded-xl flex items-center justify-center mr-4">
                        <Music className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 dark:text-white">{item.artist}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{item.stage}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900 dark:text-white">{item.time}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">공연 시간</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Booths */}
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 dark:border-gray-700/20 p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                <Utensils className="w-6 h-6 mr-3 text-festival-600" />
                부스 정보
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {festival.booths.map((booth, index) => (
                  <div key={index} className="p-4 bg-gradient-to-r from-ocean-50 to-spring-50 dark:from-ocean-900/20 dark:to-spring-900/20 rounded-xl border border-ocean-100 dark:border-ocean-800">
                    <h3 className="font-bold text-gray-900 dark:text-white mb-2">{booth.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{booth.category}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{booth.location}</p>
                    <p className="text-sm font-medium text-festival-600 dark:text-festival-400">{booth.operatingHours}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Transportation */}
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 dark:border-gray-700/20 p-8">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                <Navigation className="w-5 h-5 mr-2 text-festival-600" />
                교통 정보
              </h2>

              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                    <Car className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">주차</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{festival.transportation.parking}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                    <Train className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">대중교통</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{festival.transportation.publicTransport}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 dark:border-gray-700/20 p-8">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">빠른 작업</h2>

              <div className="space-y-3">
                <Button className="w-full justify-start bg-gradient-to-r from-festival-500 to-festival-600 hover:from-festival-600 hover:to-festival-700 text-white">
                  <Calendar className="w-4 h-4 mr-2" />
                  캘린더에 추가
                </Button>

                <Button variant="outline" className="w-full justify-start">
                  <MapPin className="w-4 h-4 mr-2" />
                  지도에서 보기
                </Button>

                <Button variant="outline" className="w-full justify-start">
                  <Users className="w-4 h-4 mr-2" />
                  커뮤니티 참여
                </Button>
              </div>
            </div>

            {/* Festival Stats */}
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 dark:border-gray-700/20 p-8">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">축제 통계</h2>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">참여자 수</span>
                  <span className="font-bold text-gray-900 dark:text-white">예상 10,000명</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">부스 수</span>
                  <span className="font-bold text-gray-900 dark:text-white">{festival.booths.length}개</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">공연 수</span>
                  <span className="font-bold text-gray-900 dark:text-white">{festival.lineup.length}개</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">지속 시간</span>
                  <span className="font-bold text-gray-900 dark:text-white">3일</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default function FestivalDetail() {
  return <FestivalDetailContent />
}
