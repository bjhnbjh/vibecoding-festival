'use client';

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { FestivalCard } from '@/components/festival-card'
import { Festival } from '@/types/festival'
import { Heart, ArrowLeft, Sparkles, Calendar, TrendingUp, Filter } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

function FavoritesContent() {
  const { user, isAuthenticated } = useAuth()
  const [favoriteFestivals, setFavoriteFestivals] = useState<Festival[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState<'all' | 'upcoming' | 'ongoing' | 'ended'>('all')

  useEffect(() => {
    if (!isAuthenticated || !user) {
      setIsLoading(false)
      return
    }

    const fetchFavoriteFestivals = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`/api/festivals?userId=${user.id}`)

        if (!response.ok) {
          throw new Error('Failed to fetch festivals')
        }

        const result = await response.json()

        if (result.success) {
          // 로컬 스토리지에서 즐겨찾기 확인
          const favorites = JSON.parse(localStorage.getItem(`favorites_${user.id}`) || '[]')
          const filtered = result.data.festivals.filter((festival: Festival) =>
            favorites.includes(festival.id)
          )
          setFavoriteFestivals(filtered)
        }
      } catch (error) {
        console.error('Error fetching favorite festivals:', error)
        // 실패 시 로컬 스토리지에서만 가져오기
        const favorites = JSON.parse(localStorage.getItem(`favorites_${user.id}`) || '[]')
        if (favorites.length > 0) {
          // 더미 데이터에서 즐겨찾기 가져오기
          const allFestivals = [
            {
              id: '1',
              name: '건국대학교 봄 축제',
              university: '건국대학교',
              region: '서울',
              startDate: '2025-05-15T10:00:00Z',
              endDate: '2025-05-17T22:00:00Z',
              location: '건국대학교 중앙광장',
              description: '건국대학교의 대표 봄 축제! 다양한 공연과 부스가 준비되어 있습니다.',
              lineup: [
                { artist: '아이유', time: '19:00', stage: '메인 스테이지' },
                { artist: 'BTS', time: '20:00', stage: '메인 스테이지' },
                { artist: '트와이스', time: '21:00', stage: '메인 스테이지' }
              ],
              booths: [
                { name: '맥주 부스', category: '음료', location: 'A구역', operatingHours: '12:00-22:00' },
                { name: '닭꼬치', category: '음식', location: 'B구역', operatingHours: '12:00-22:00' }
              ],
              transportation: {
                parking: '학교 주차장 이용 가능',
                publicTransport: '2호선 건대입구역 도보 10분'
              },
              admission: {
                fee: 0,
                currency: 'KRW',
                notes: '학생증 지참'
              },
              createdAt: '2024-01-15T10:00:00Z',
              updatedAt: '2024-01-15T10:00:00Z'
            },
            {
              id: '2',
              name: '연세대학교 봄 축제',
              university: '연세대학교',
              region: '서울',
              startDate: '2025-05-20T10:00:00Z',
              endDate: '2025-05-22T22:00:00Z',
              location: '연세대학교 노천극장',
              description: '연세대학교 봄 축제 - 아카라카!',
              lineup: [
                { artist: '블랙핑크', time: '19:00', stage: '메인 스테이지' },
                { artist: '엑소', time: '20:00', stage: '메인 스테이지' }
              ],
              booths: [
                { name: '카페 부스', category: '음료', location: 'C구역', operatingHours: '12:00-22:00' },
                { name: '타코', category: '음식', location: 'D구역', operatingHours: '12:00-22:00' }
              ],
              transportation: {
                parking: '학교 주차장 이용 가능',
                publicTransport: '2호선 신촌역 도보 5분'
              },
              admission: {
                fee: 0,
                currency: 'KRW',
                notes: '학생증 지참'
              },
              createdAt: '2024-01-20T10:00:00Z',
              updatedAt: '2024-01-20T10:00:00Z'
            }
          ]

          const filtered = allFestivals.filter((festival: Festival) =>
            favorites.includes(festival.id)
          )
          setFavoriteFestivals(filtered)
        }
      } finally {
        setIsLoading(false)
      }
    }

    fetchFavoriteFestivals()
  }, [isAuthenticated, user])

  const filterFestivals = (festivals: Festival[]) => {
    const now = new Date()

    switch (activeFilter) {
      case 'upcoming':
        return festivals.filter(festival => new Date(festival.startDate) > now)
      case 'ongoing':
        return festivals.filter(festival => {
          const startDate = new Date(festival.startDate)
          const endDate = new Date(festival.endDate)
          return startDate <= now && endDate >= now
        })
      case 'ended':
        return festivals.filter(festival => new Date(festival.endDate) < now)
      default:
        return festivals
    }
  }

  const filteredFestivals = filterFestivals(favoriteFestivals)

  const getFestivalStats = () => {
    const now = new Date()
    const upcoming = favoriteFestivals.filter(f => new Date(f.startDate) > now).length
    const ongoing = favoriteFestivals.filter(f => {
      const startDate = new Date(f.startDate)
      const endDate = new Date(f.endDate)
      return startDate <= now && endDate >= now
    }).length
    const ended = favoriteFestivals.filter(f => new Date(f.endDate) < now).length

    return { upcoming, ongoing, ended }
  }

  const stats = getFestivalStats()

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-festival-50 via-white to-sunset-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="text-6xl mb-6">❤️</div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            로그인이 필요합니다
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            즐겨찾기 기능을 사용하려면 로그인이 필요합니다.
          </p>
          <div className="space-y-3">
            <Link href="/login">
              <Button className="w-full bg-gradient-to-r from-festival-500 to-festival-600 hover:from-festival-600 hover:to-festival-700 text-white">
                로그인하기
              </Button>
            </Link>
            <Link href="/signup">
              <Button variant="outline" className="w-full">
                회원가입하기
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-festival-50 via-white to-sunset-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-festival-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">즐겨찾기 정보를 불러오는 중...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-festival-50 via-white to-sunset-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="relative bg-gradient-to-r from-festival-600 via-festival-500 to-sunset-500 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <Link href="/festivals" className="inline-flex items-center text-white/90 hover:text-white transition-colors mb-6">
              <ArrowLeft className="w-5 h-5 mr-2" />
              축제 목록으로 돌아가기
            </Link>

            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                <Heart className="w-10 h-10 text-white fill-current" />
              </div>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold mb-4">내 즐겨찾기</h1>
            <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
              마음에 드는 축제들을 모아서 관리하고, 중요한 정보를 놓치지 마세요!
            </p>

            <div className="flex items-center justify-center space-x-8 text-white/90">
              <div className="flex items-center">
                <Sparkles className="w-5 h-5 mr-2 text-yellow-300" />
                <span className="font-semibold">{favoriteFestivals.length}개 즐겨찾기</span>
              </div>
              <div className="flex items-center">
                <TrendingUp className="w-5 h-5 mr-2" />
                <span>{stats.upcoming}개 예정</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20 dark:border-gray-700/20">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{favoriteFestivals.length}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">전체 즐겨찾기</div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 text-center border border-blue-100 dark:border-blue-800">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.upcoming}</div>
            <div className="text-sm text-blue-600 dark:text-blue-400">예정된 축제</div>
          </div>

          <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 text-center border border-green-100 dark:border-green-800">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.ongoing}</div>
            <div className="text-sm text-green-600 dark:text-green-400">진행 중</div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 text-center border border-gray-200 dark:border-gray-600">
            <div className="text-2xl font-bold text-gray-600 dark:text-gray-400">{stats.ended}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">종료된 축제</div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            <Button
              variant={activeFilter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveFilter('all')}
              className={activeFilter === 'all' ? 'bg-festival-500 text-white' : ''}
            >
              전체 ({favoriteFestivals.length})
            </Button>

            <Button
              variant={activeFilter === 'upcoming' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveFilter('upcoming')}
              className={activeFilter === 'upcoming' ? 'bg-blue-500 text-white' : ''}
            >
              예정된 축제 ({stats.upcoming})
            </Button>

            <Button
              variant={activeFilter === 'ongoing' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveFilter('ongoing')}
              className={activeFilter === 'ongoing' ? 'bg-green-500 text-white' : ''}
            >
              진행 중 ({stats.ongoing})
            </Button>

            <Button
              variant={activeFilter === 'ended' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveFilter('ended')}
              className={activeFilter === 'ended' ? 'bg-gray-500 text-white' : ''}
            >
              종료된 축제 ({stats.ended})
            </Button>
          </div>
        </div>

        {/* Content */}
        {filteredFestivals.length > 0 ? (
          <>
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {activeFilter === 'all' && '모든 즐겨찾기 축제'}
                {activeFilter === 'upcoming' && '예정된 즐겨찾기 축제'}
                {activeFilter === 'ongoing' && '진행 중인 즐겨찾기 축제'}
                {activeFilter === 'ended' && '종료된 즐겨찾기 축제'}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                총 {filteredFestivals.length}개의 축제가 있습니다.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredFestivals.map((festival) => (
                <FestivalCard key={festival.id} festival={festival} />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-6">💔</div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              {activeFilter === 'all' ? '즐겨찾기한 축제가 없습니다' : '해당 조건에 맞는 축제가 없습니다'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              {activeFilter === 'all'
                ? '마음에 드는 축제를 즐겨찾기에 추가해보세요!'
                : '다른 필터를 선택하거나 새로운 축제를 즐겨찾기해보세요.'
              }
            </p>
            <div className="space-y-3">
              <Link href="/festivals">
                <Button className="bg-gradient-to-r from-festival-500 to-festival-600 hover:from-festival-600 hover:to-festival-700 text-white">
                  <Sparkles className="w-4 h-4 mr-2" />
                  축제 둘러보기
                </Button>
              </Link>

              {activeFilter !== 'all' && (
                <Button
                  variant="outline"
                  onClick={() => setActiveFilter('all')}
                >
                  전체 즐겨찾기 보기
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        {favoriteFestivals.length > 0 && (
          <div className="mt-12 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 dark:border-gray-700/20 p-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 text-center">
              🎯 빠른 작업
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link href="/festivals">
                <Button variant="outline" className="w-full h-16 flex-col space-y-2">
                  <Sparkles className="w-5 h-5" />
                  <span>더 많은 축제 보기</span>
                </Button>
              </Link>

              <Button variant="outline" className="w-full h-16 flex-col space-y-2">
                <Calendar className="w-5 h-5" />
                <span>캘린더 내보내기</span>
              </Button>

              <Button variant="outline" className="w-full h-16 flex-col space-y-2">
                <Filter className="w-5 h-5" />
                <span>알림 설정</span>
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default function Favorites() {
  return <FavoritesContent />
}
