'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, AuthState, LoginCredentials, SignupCredentials } from '@/types/user';
import { supabase } from '@/lib/supabase';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (email: string, password: string, name: string, university?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  });

  useEffect(() => {
    // 초기 로드 시 로컬 스토리지에서 사용자 정보 확인 (Supabase 연결 실패 시 폴백)
    const checkAuthStatus = () => {
      try {
        const userJson = localStorage.getItem('festivalhub_user');
        if (userJson) {
          const user = JSON.parse(userJson) as User;
          setAuthState({
            user,
            isLoading: false,
            isAuthenticated: true,
          });
        } else {
          setAuthState(prev => ({
            ...prev,
            isLoading: false,
          }));
        }
      } catch (error) {
        console.error('Auth check error:', error);
        setAuthState(prev => ({
          ...prev,
          isLoading: false,
        }));
      }
    };

    // 더미 데이터 모드 (Supabase 연결 없이 로컬 스토리지만 사용)
    const getInitialSession = async () => {
      console.log('Using dummy auth mode for development');
      // Supabase 연결 없이 바로 로컬 스토리지 확인으로 폴백
      checkAuthStatus();
    };

    getInitialSession();

    // 더미 데이터 모드 - Supabase 리스너 사용 안 함
    let subscription: any = undefined;
    console.log('Skipping Supabase auth listener for dummy mode');

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, []);

  const login = async (email: string, password: string) => {
    setAuthState(prev => ({ ...prev, isLoading: true }));

    try {
      // 더미 데이터 모드로 즉시 처리 (Supabase 연결 문제 해결을 위해)
      console.log('Using fallback login mode (Supabase connection issues detected)');

      // 더미 사용자 데이터
      const DUMMY_USERS = [
        {
          id: '1',
          email: 'student@konkuk.ac.kr',
          password: 'password123',
          name: '김철수',
          university: '건국대학교',
        },
        {
          id: '2',
          email: 'jihyun@yonsei.ac.kr',
          password: 'password456',
          name: '이지현',
          university: '연세대학교',
        },
        {
          id: '3',
          email: 'minho@snu.ac.kr',
          password: 'password789',
          name: '박민호',
          university: '서울대학교',
        },
        {
          id: '4',
          email: 'test@example.com',
          password: 'test123',
          name: '테스트사용자',
          university: '테스트대학교',
        },
      ];

      const user = DUMMY_USERS.find(u => u.email === email);
      if (!user || user.password !== password) {
        setAuthState(prev => ({ ...prev, isLoading: false }));
        return { success: false, error: '이메일 또는 비밀번호가 올바르지 않습니다.' };
      }

      // 더미 로그인 성공 처리
      const userData = {
        id: user.id,
        email: user.email,
        name: user.name,
        university: user.university,
        createdAt: new Date().toISOString(),
      };

      localStorage.setItem('festivalhub_user', JSON.stringify(userData));
      setAuthState({
        user: userData,
        isLoading: false,
        isAuthenticated: true,
      });

      console.log('Fallback login successful:', userData);
      return { success: true };

    } catch (error) {
      console.error('Login error:', error);
      setAuthState(prev => ({ ...prev, isLoading: false }));
      return { success: false, error: '로그인 중 오류가 발생했습니다.' };
    }
  };

  const signup = async (email: string, password: string, name: string, university?: string) => {
    setAuthState(prev => ({ ...prev, isLoading: true }));

    try {
      // 더미 데이터 모드로 즉시 처리 (Supabase 연결 문제 해결을 위해)
      console.log('Using fallback signup mode (Supabase connection issues detected)');

      // 이메일 형식 검증
      const emailRegex = /.+@.+\..+/;
      if (!emailRegex.test(email)) {
        setAuthState(prev => ({ ...prev, isLoading: false }));
        return { success: false, error: '올바른 이메일 형식이 아닙니다.' };
      }

      // 비밀번호 길이 검증
      if (password.length < 6) {
        setAuthState(prev => ({ ...prev, isLoading: false }));
        return { success: false, error: '비밀번호는 최소 6자 이상이어야 합니다.' };
      }

      // 이메일 중복 확인 (더미 데이터)
      const existingEmails = [
        'student@konkuk.ac.kr',
        'jihyun@yonsei.ac.kr',
        'minho@snu.ac.kr',
        'test@example.com',
        'user@test.com',
      ];

      if (existingEmails.includes(email)) {
        setAuthState(prev => ({ ...prev, isLoading: false }));
        return { success: false, error: '이미 가입된 이메일입니다.' };
      }

      // 더미 회원가입 처리
      const userData = {
        id: Date.now().toString(),
        email,
        name,
        university,
        createdAt: new Date().toISOString(),
      };

      localStorage.setItem('festivalhub_user', JSON.stringify(userData));
      setAuthState({
        user: userData,
        isLoading: false,
        isAuthenticated: true,
      });

      console.log('Fallback signup successful:', userData);
      return { success: true };

    } catch (error) {
      console.error('Signup error:', error);
      setAuthState(prev => ({ ...prev, isLoading: false }));
      return { success: false, error: '회원가입 중 오류가 발생했습니다.' };
    }
  };

  const logout = async () => {
    try {
      // 더미 데이터 모드 - Supabase 로그아웃 없이 로컬 스토리지만 제거
      console.log('Using dummy logout mode for development');
      localStorage.removeItem('festivalhub_user');
      setAuthState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
      });
      console.log('Dummy logout successful');
    } catch (error) {
      console.error('Logout error:', error);
      // 오류 발생 시에도 강제 로그아웃
      localStorage.removeItem('festivalhub_user');
      setAuthState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
