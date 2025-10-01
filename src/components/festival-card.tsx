'use client';

import Image from 'next/image'
import Link from 'next/link'
import { Button } from './ui/button'
import { Festival } from '@/types/festival'
import { Calendar, MapPin, Users, Clock, Star, Sparkles, Heart } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useState, useEffect } from 'react'

interface FestivalCardProps {
  festival: Festival
}

export function FestivalCard({ festival }: FestivalCardProps) {
  const { user, isAuthenticated } = useAuth()
  const [isFavorite, setIsFavorite] = useState(false)
  const [isLoadingFavorite, setIsLoadingFavorite] = useState(false)

  const daysUntilStart = Math.ceil((new Date(festival.startDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))

  // 즐겨찾기 상태 확인
  useEffect(() => {
    if (user && isAuthenticated) {
      // 실제로는 API 호출로 즐겨찾기 상태를 확인해야 합니다
      // 지금은 임시로 로컬 스토리지에서 확인
      const favorites = JSON.parse(localStorage.getItem(`favorites_${user.id}`) || '[]')
      setIsFavorite(favorites.includes(festival.id))
    }
  }, [user, isAuthenticated, festival.id])

  const toggleFavorite = async () => {
    if (!user || !isAuthenticated) return

    setIsLoadingFavorite(true)

    try {
      // 실제로는 API 호출로 즐겨찾기를 토글해야 합니다
      const favoritesKey = `favorites_${user.id}`
      const favorites = JSON.parse(localStorage.getItem(favoritesKey) || '[]')

      if (isFavorite) {
        // 즐겨찾기 제거
        const newFavorites = favorites.filter((id: string) => id !== festival.id)
        localStorage.setItem(favoritesKey, JSON.stringify(newFavorites))
        setIsFavorite(false)
      } else {
        // 즐겨찾기 추가
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

  return (
    <div className="group relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl card-hover border border-white/20 dark:border-gray-700/20 overflow-hidden h-full flex flex-col">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-festival-500/5 via-transparent to-sunset-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

      {/* Status badge */}
      <div className="absolute top-4 right-4 z-10 flex flex-col items-end space-y-2">
        {isAuthenticated && (
          <button
            onClick={toggleFavorite}
            disabled={isLoadingFavorite}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${
              isFavorite
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : 'bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-600 dark:text-gray-400'
            } shadow-lg`}
          >
            {isLoadingFavorite ? (
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
            )}
          </button>
        )}

        {daysUntilStart < 0 ? (
          <div className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 px-3 py-1 rounded-full text-xs font-medium">
            종료됨
          </div>
        ) : daysUntilStart === 0 ? (
          <div className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-3 py-1 rounded-full text-xs font-medium animate-pulse">
            진행중
          </div>
        ) : daysUntilStart <= 7 ? (
          <div className="bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 px-3 py-1 rounded-full text-xs font-medium">
            D-{daysUntilStart}
          </div>
        ) : (
          <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full text-xs font-medium">
            예정
          </div>
        )}
      </div>

      <div className="p-6 flex flex-col flex-1">
        {/* Header */}
        <div className="mb-4 flex-shrink-0">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-festival-600 dark:group-hover:text-festival-400 transition-colors duration-300 line-clamp-2">
                {festival.name}
              </h3>
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                  🎓 {festival.university}
                </p>
                <div className="px-2 py-1 bg-festival-100 dark:bg-festival-900/30 text-festival-700 dark:text-festival-300 rounded-md text-xs font-medium flex-shrink-0">
                  📍 {festival.region}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-1 ml-3 flex-shrink-0">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">4.8</span>
            </div>
          </div>
        </div>

        {/* Date and Location */}
        <div className="space-y-3 mb-4 flex-shrink-0">
          <div className="flex items-start text-sm text-gray-600 dark:text-gray-400">
            <div className="w-8 h-8 bg-gradient-to-br from-festival-400 to-festival-600 rounded-lg flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
              <Calendar className="w-4 h-4 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-medium">
                {new Date(festival.startDate).toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' })} - {new Date(festival.endDate).toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' })}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-500">
                {daysUntilStart < 0 ? '종료' : daysUntilStart === 0 ? '오늘부터' : `${daysUntilStart}일 남음`}
              </div>
            </div>
          </div>

          <div className="flex items-start text-sm text-gray-600 dark:text-gray-400">
            <div className="w-8 h-8 bg-gradient-to-br from-ocean-400 to-ocean-600 rounded-lg flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
              <MapPin className="w-4 h-4 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-medium truncate">{festival.location}</div>
              <div className="text-xs text-gray-500 dark:text-gray-500">축제 장소</div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="mb-6 flex-1 min-h-0">
          <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed line-clamp-3">
            {festival.description}
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700 mt-auto">
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <div className="w-6 h-6 bg-gradient-to-br from-spring-400 to-spring-600 rounded-md flex items-center justify-center mr-2 flex-shrink-0">
              <Users className="w-3 h-3 text-white" />
            </div>
            <span className="font-medium">{festival.lineup.length}개 공연</span>
          </div>

          <Link href={`/festivals/${festival.id}`}>
            <Button size="sm" className="bg-gradient-to-r from-festival-500 to-festival-600 hover:from-festival-600 hover:to-festival-700 text-white shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105">
              <Sparkles className="w-3 h-3 mr-1" />
              자세히 보기
            </Button>
          </Link>
        </div>
      </div>

      {/* Hover effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-festival-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
    </div>
  )
}
