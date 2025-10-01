'use client';

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { FestivalCard } from '@/components/festival-card'
import { Festival, FestivalFilters } from '@/types/festival'
import { Search, Filter, MapPin, Calendar, Sparkles, ArrowLeft } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

function FestivalsListContent() {
  const { isAuthenticated } = useAuth()
  const [festivals, setFestivals] = useState<Festival[]>([])
  const [filteredFestivals, setFilteredFestivals] = useState<Festival[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRegion, setSelectedRegion] = useState<string>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const itemsPerPage = 12

  const regions = [
    { value: 'all', label: '전체 지역' },
    { value: '서울', label: '서울' },
    { value: '부산', label: '부산' },
    { value: '대구', label: '대구' },
    { value: '인천', label: '인천' },
    { value: '광주', label: '광주' },
    { value: '대전', label: '대전' },
    { value: '울산', label: '울산' },
    { value: '세종', label: '세종' },
    { value: '경기', label: '경기' },
    { value: '강원', label: '강원' },
    { value: '충북', label: '충북' },
    { value: '충남', label: '충남' },
    { value: '전북', label: '전북' },
    { value: '전남', label: '전남' },
    { value: '경북', label: '경북' },
    { value: '경남', label: '경남' },
    { value: '제주', label: '제주' }
  ]

  useEffect(() => {
    const fetchFestivals = async () => {
      try {
        setIsLoading(true)
        const response = await fetch('/api/festivals')

        if (!response.ok) {
          throw new Error('Failed to fetch festivals')
        }

        const result = await response.json()

        if (result.success) {
          setFestivals(result.data.festivals)
          setFilteredFestivals(result.data.festivals)
          setTotalPages(Math.ceil(result.data.festivals.length / itemsPerPage))
        }
      } catch (error) {
        console.error('Error fetching festivals:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchFestivals()
  }, [])

  useEffect(() => {
    let filtered = festivals

    // 검색어 필터링
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      filtered = filtered.filter(festival =>
        festival.name.toLowerCase().includes(searchLower) ||
        festival.description.toLowerCase().includes(searchLower) ||
        festival.university.toLowerCase().includes(searchLower)
      )
    }

    // 지역 필터링
    if (selectedRegion !== 'all') {
      filtered = filtered.filter(festival => festival.region === selectedRegion)
    }

    // 날짜순 정렬 (다가오는 축제 우선)
    filtered.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())

    setFilteredFestivals(filtered)
    setTotalPages(Math.ceil(filtered.length / itemsPerPage))
    setCurrentPage(1) // 필터 변경 시 첫 페이지로 이동
  }, [searchTerm, selectedRegion, festivals])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const paginatedFestivals = filteredFestivals.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const upcomingFestivals = filteredFestivals.filter(festival => {
    const daysUntilStart = Math.ceil((new Date(festival.startDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    return daysUntilStart >= 0 && daysUntilStart <= 30 // 30일 이내 예정된 축제
  })

  const featuredFestivals = filteredFestivals.filter(festival => {
    const daysUntilStart = Math.ceil((new Date(festival.startDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    return daysUntilStart >= 0 && daysUntilStart <= 7 // 7일 이내 예정된 축제 (특별 추천)
  })

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-festival-50 via-white to-sunset-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="relative bg-gradient-to-r from-festival-600 via-festival-500 to-sunset-500 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <Link href="/" className="inline-flex items-center text-white/90 hover:text-white transition-colors mb-6">
              <ArrowLeft className="w-5 h-5 mr-2" />
              홈으로 돌아가기
            </Link>

            <h1 className="text-4xl md:text-6xl font-bold mb-4">🎪 모든 대학 축제</h1>
            <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
              전국 대학생들이 모든 대학 축제 정보를 쉽게 찾고 참여할 수 있는 통합 플랫폼
            </p>

            <div className="flex items-center justify-center space-x-6 text-white/90">
              <div className="flex items-center">
                <Sparkles className="w-5 h-5 mr-2 text-yellow-300" />
                <span className="font-semibold">{filteredFestivals.length}개 축제</span>
              </div>
              <div className="flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                <span>{regions.length - 1}개 지역</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="축제명, 학교명으로 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-white/20 dark:border-gray-700/20 rounded-xl focus:ring-2 focus:ring-festival-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />
            </div>

            {/* Region Filter */}
            <div className="md:w-64">
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="w-full px-4 py-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-white/20 dark:border-gray-700/20 rounded-xl focus:ring-2 focus:ring-festival-500 focus:border-transparent text-gray-900 dark:text-white"
              >
                {regions.map((region) => (
                  <option key={region.value} value={region.value}>
                    {region.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Filter Tags */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedRegion === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedRegion('all')}
              className={selectedRegion === 'all' ? 'bg-festival-500 text-white' : ''}
            >
              전체
            </Button>
            {regions.slice(1, 6).map((region) => (
              <Button
                key={region.value}
                variant={selectedRegion === region.value ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedRegion(region.value)}
                className={selectedRegion === region.value ? 'bg-festival-500 text-white' : ''}
              >
                {region.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Featured Festivals */}
        {featuredFestivals.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center mb-6">
              <Sparkles className="w-6 h-6 text-yellow-500 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                🔥 특별 추천 축제
              </h2>
              <span className="ml-3 px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 rounded-full text-sm font-medium">
                {featuredFestivals.length}개
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {featuredFestivals.slice(0, 6).map((festival) => (
                <FestivalCard key={festival.id} festival={festival} />
              ))}
            </div>
          </section>
        )}

        {/* Upcoming Festivals */}
        {upcomingFestivals.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center mb-6">
              <Calendar className="w-6 h-6 text-blue-500 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                📅 다가오는 축제
              </h2>
              <span className="ml-3 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium">
                {upcomingFestivals.length}개
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {upcomingFestivals.slice(0, 6).map((festival) => (
                <FestivalCard key={festival.id} festival={festival} />
              ))}
            </div>
          </section>
        )}

        {/* All Festivals */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                🎪 모든 축제
              </h2>
              <span className="ml-3 px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm font-medium">
                {filteredFestivals.length}개
              </span>
            </div>

            {isAuthenticated && (
              <Link href="/favorites">
                <Button variant="outline" size="sm">
                  <Sparkles className="w-4 h-4 mr-2" />
                  즐겨찾기 보기
                </Button>
              </Link>
            )}
          </div>

          {paginatedFestivals.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedFestivals.map((festival) => (
                  <FestivalCard key={festival.id} festival={festival} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-12">
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      이전
                    </Button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <Button
                        key={page}
                        variant={currentPage === page ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handlePageChange(page)}
                        className={currentPage === page ? 'bg-festival-500 text-white' : ''}
                      >
                        {page}
                      </Button>
                    ))}

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      다음
                    </Button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                검색 결과가 없습니다
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                다른 검색어로 시도하거나 필터를 변경해보세요.
              </p>
              <Button
                onClick={() => {
                  setSearchTerm('')
                  setSelectedRegion('all')
                }}
                className="bg-gradient-to-r from-festival-500 to-festival-600 hover:from-festival-600 hover:to-festival-700 text-white"
              >
                모든 축제 보기
              </Button>
            </div>
          )}
        </section>
      </main>
    </div>
  )
}

export default function FestivalsList() {
  return <FestivalsListContent />
}
