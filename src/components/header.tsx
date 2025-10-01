'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Sparkles, User, LogOut, Heart, Search, Settings, Menu, X } from 'lucide-react';

export function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="relative z-50 glass-effect border-b border-white/10 dark:border-gray-700/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="relative">
              <Sparkles className="w-8 h-8 text-festival-500 animate-pulse-slow" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-sunset-400 rounded-full animate-ping"></div>
            </div>
            <h1 className="text-2xl font-bold gradient-text font-playfair">
              FestivalHub
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {isAuthenticated ? (
              <>
                <Link
                  href="/festivals"
                  className="text-gray-700 dark:text-gray-300 hover:text-festival-600 dark:hover:text-festival-400 transition-colors duration-200 font-medium"
                >
                  축제 목록
                </Link>
                <Link
                  href="/favorites"
                  className="text-gray-700 dark:text-gray-300 hover:text-festival-600 dark:hover:text-festival-400 transition-colors duration-200 font-medium"
                >
                  즐겨찾기
                </Link>

                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-festival-600 dark:hover:text-festival-400 transition-colors duration-200"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-festival-400 to-festival-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-semibold">
                        {user?.name?.charAt(0) || 'U'}
                      </span>
                    </div>
                    <span className="font-medium">{user?.name || '사용자'}</span>
                  </button>

                  {/* Dropdown Menu */}
                  {isMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 dark:border-gray-700/20 py-2">
                      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</p>
                        {user?.university && (
                          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">🎓 {user.university}</p>
                        )}
                      </div>

                      <div className="py-1">
                        <Link
                          href="/profile"
                          className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <User className="w-4 h-4" />
                          <span>프로필</span>
                        </Link>
                        <Link
                          href="/favorites"
                          className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <Heart className="w-4 h-4" />
                          <span>즐겨찾기</span>
                        </Link>
                      </div>

                      <div className="border-t border-gray-200 dark:border-gray-700 pt-1">
                        <button
                          onClick={handleLogout}
                          className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>로그아웃</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-gray-700 dark:text-gray-300 hover:text-festival-600 dark:hover:text-festival-400 transition-colors duration-200 font-medium"
                >
                  로그인
                </Link>
                <Link href="/signup">
                  <Button className="bg-gradient-to-r from-festival-500 to-festival-600 hover:from-festival-600 hover:to-festival-700 text-white">
                    회원가입
                  </Button>
                </Link>
              </>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-white/10 dark:border-gray-700/20 py-4">
            <nav className="flex flex-col space-y-4">
              {isAuthenticated ? (
                <>
                  <Link
                    href="/festivals"
                    className="text-gray-700 dark:text-gray-300 hover:text-festival-600 dark:hover:text-festival-400 transition-colors duration-200 font-medium px-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    축제 목록
                  </Link>
                  <Link
                    href="/favorites"
                    className="text-gray-700 dark:text-gray-300 hover:text-festival-600 dark:hover:text-festival-400 transition-colors duration-200 font-medium px-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    즐겨찾기
                  </Link>

                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                    <div className="px-2 mb-4">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</p>
                    </div>

                    <Link
                      href="/profile"
                      className="flex items-center space-x-3 px-2 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 rounded-lg"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <User className="w-4 h-4" />
                      <span>프로필</span>
                    </Link>
                    <Link
                      href="/favorites"
                      className="flex items-center space-x-3 px-2 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 rounded-lg"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Heart className="w-4 h-4" />
                      <span>즐겨찾기</span>
                    </Link>

                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      className="flex items-center space-x-3 w-full px-2 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200 rounded-lg mt-2"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>로그아웃</span>
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="text-gray-700 dark:text-gray-300 hover:text-festival-600 dark:hover:text-festival-400 transition-colors duration-200 font-medium px-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    로그인
                  </Link>
                  <Link href="/signup" onClick={() => setIsMenuOpen(false)}>
                    <Button className="bg-gradient-to-r from-festival-500 to-festival-600 hover:from-festival-600 hover:to-festival-700 text-white mx-2">
                      회원가입
                    </Button>
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
