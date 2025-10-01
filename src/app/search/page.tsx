'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { FestivalCard } from '@/components/festival-card';
import { Festival } from '@/types/festival';

function SearchContent() {
  const searchParams = useSearchParams();
  const [festivals, setFestivals] = useState<Festival[]>([]);
  const [filteredFestivals, setFilteredFestivals] = useState<Festival[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const regions = ['서울', '부산', '대구', '인천', '광주', '대전', '울산', '세종', '경기', '강원', '충북', '충남', '전북', '전남', '경북', '경남', '제주'];
  const categories = ['문화예술', '음악', '스포츠', '학술', '봉사', '기타'];

  useEffect(() => {
    const fetchFestivals = async () => {
      try {
        const response = await fetch('/api/festivals');
        if (response.ok) {
          const data = await response.json();
          setFestivals(data);
          setFilteredFestivals(data);
        }
      } catch (error) {
        console.error('Failed to fetch festivals:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFestivals();
  }, []);

  useEffect(() => {
    let filtered = festivals;

    if (searchTerm) {
      filtered = filtered.filter(festival =>
        festival.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        festival.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedRegion) {
      filtered = filtered.filter(festival => festival.region === selectedRegion);
    }

    if (selectedCategory) {
      filtered = filtered.filter(festival => festival.category === selectedCategory);
    }

    setFilteredFestivals(filtered);
  }, [festivals, searchTerm, selectedRegion, selectedCategory]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 검색 헤더 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">축제 검색</h1>

          {/* 검색 폼 */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <input
                  type="text"
                  placeholder="축제명 또는 설명으로 검색..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div>
                <select
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="">지역 선택</option>
                  {regions.map(region => (
                    <option key={region} value={region}>{region}</option>
                  ))}
                </select>
              </div>
              <div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="">카테고리 선택</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* 검색 결과 */}
        <div className="mb-6">
          <p className="text-gray-600">
            총 {filteredFestivals.length}개의 축제가 검색되었습니다.
          </p>
        </div>

        {/* 축제 목록 */}
        {filteredFestivals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFestivals.map((festival) => (
              <FestivalCard key={festival.id} festival={festival} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🔍</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">검색 결과가 없습니다</h3>
            <p className="text-gray-600 mb-4">다른 검색어로 시도해보세요.</p>
            <Link
              href="/festivals"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700"
            >
              전체 축제 보기
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}
