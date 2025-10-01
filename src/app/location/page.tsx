'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

interface LocationInfo {
  id: string;
  name: string;
  category: 'restaurant' | 'convenience' | 'parking' | 'cafe' | 'shopping' | 'other';
  description: string;
  address: string;
  phone?: string;
  hours?: string;
  rating: number;
  reviewCount: number;
  distance: number; // meters
  imageUrl?: string;
}

function LocationContent() {
  const searchParams = useSearchParams();
  const festivalId = searchParams.get('festival');
  const [locations, setLocations] = useState<LocationInfo[]>([]);
  const [filteredLocations, setFilteredLocations] = useState<LocationInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'distance' | 'rating'>('distance');

  const categories = [
    { key: 'all', label: '전체', icon: '📍' },
    { key: 'restaurant', label: '음식점', icon: '🍽️' },
    { key: 'cafe', label: '카페', icon: '☕' },
    { key: 'convenience', label: '편의점', icon: '🏪' },
    { key: 'parking', label: '주차장', icon: '🅿️' },
    { key: 'shopping', label: '쇼핑', icon: '🛍️' },
    { key: 'other', label: '기타', icon: '📌' }
  ];

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const url = festivalId ? `/api/locations?festival=${festivalId}` : '/api/locations';
        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          setLocations(data);
          setFilteredLocations(data);
        }
      } catch (error) {
        console.error('Failed to fetch locations:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLocations();
  }, [festivalId]);

  useEffect(() => {
    let filtered = locations;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(location => location.category === selectedCategory);
    }

    // 정렬
    filtered.sort((a, b) => {
      if (sortBy === 'distance') {
        return a.distance - b.distance;
      } else {
        return b.rating - a.rating;
      }
    });

    setFilteredLocations(filtered);
  }, [locations, selectedCategory, sortBy]);

  const formatDistance = (meters: number) => {
    if (meters < 1000) {
      return `${meters}m`;
    }
    return `${(meters / 1000).toFixed(1)}km`;
  };

  const getCategoryIcon = (category: string) => {
    const categoryInfo = categories.find(c => c.key === category);
    return categoryInfo?.icon || '📍';
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {festivalId ? '축제 주변' : '상권 정보'}
          </h1>
          <p className="text-gray-600">
            {festivalId
              ? '축제 현장 주변의 편의시설을 확인하세요.'
              : '지역 상권과 편의시설 정보를 제공합니다.'}
          </p>
        </div>

        {/* 필터 및 정렬 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* 카테고리 필터 */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                카테고리
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
              >
                {categories.map(category => (
                  <option key={category.key} value={category.key}>
                    {category.icon} {category.label}
                  </option>
                ))}
              </select>
            </div>

            {/* 정렬 옵션 */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                정렬
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'distance' | 'rating')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="distance">거리순</option>
                <option value="rating">평점순</option>
              </select>
            </div>
          </div>
        </div>

        {/* 장소 목록 */}
        {filteredLocations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLocations.map((location) => (
              <div key={location.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                {location.imageUrl && (
                  <img
                    src={location.imageUrl}
                    alt={location.name}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center">
                      <span className="text-2xl mr-2">{getCategoryIcon(location.category)}</span>
                      <h3 className="text-lg font-semibold text-gray-900">{location.name}</h3>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center">
                        <span className="text-yellow-400">★</span>
                        <span className="text-sm text-gray-600 ml-1">
                          {location.rating.toFixed(1)} ({location.reviewCount})
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm mb-3">{location.description}</p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <span className="mr-2">📍</span>
                      <span>{location.address}</span>
                    </div>

                    <div className="flex items-center text-sm text-gray-500">
                      <span className="mr-2">🚶</span>
                      <span>{formatDistance(location.distance)}</span>
                    </div>

                    {location.phone && (
                      <div className="flex items-center text-sm text-gray-500">
                        <span className="mr-2">📞</span>
                        <span>{location.phone}</span>
                      </div>
                    )}

                    {location.hours && (
                      <div className="flex items-center text-sm text-gray-500">
                        <span className="mr-2">🕒</span>
                        <span>{location.hours}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex space-x-2">
                    <button className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-purple-700 transition-colors">
                      상세보기
                    </button>
                    <button className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors">
                      길찾기
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🏪</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">주변 시설이 없습니다</h3>
            <p className="text-gray-600 mb-4">
              {selectedCategory === 'all'
                ? '현재 위치 주변의 시설 정보를 불러올 수 없습니다.'
                : '선택한 카테고리의 시설이 없습니다.'}
            </p>
            {selectedCategory !== 'all' && (
              <button
                onClick={() => setSelectedCategory('all')}
                className="text-purple-600 hover:text-purple-700 font-medium"
              >
                전체 카테고리 보기
              </button>
            )}
          </div>
        )}

        {/* 지도 영역 (추후 구현) */}
        <div className="mt-12 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">지도에서 보기</h3>
          <div className="h-64 bg-gray-200 rounded-lg flex items-center justify-center">
            <div className="text-center text-gray-500">
              <div className="text-4xl mb-2">🗺️</div>
              <p>지도 기능은 추후 업데이트 예정입니다</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LocationPage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    }>
      <LocationContent />
    </Suspense>
  );
}
