'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, AuthState, LoginCredentials, SignupCredentials } from '@/types/user';
import { supabase } from '@/lib/supabase';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (credentials: SignupCredentials) => Promise<{ success: boolean; error?: string }>;
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
    // 초기 세션 확인
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();

        if (session?.user) {
          const userData: User = {
            id: session.user.id,
            email: session.user.email || '',
            name: session.user.user_metadata?.name || '',
            university: session.user.user_metadata?.university,
            role: session.user.user_metadata?.role || 'user',
            createdAt: session.user.created_at,
          };

          localStorage.setItem('festivalhub_user', JSON.stringify(userData));
          setAuthState({
            user: userData,
            isLoading: false,
            isAuthenticated: true,
          });
        } else {
          setAuthState({
            user: null,
            isLoading: false,
            isAuthenticated: false,
          });
        }
      } catch (error) {
        console.error('Session check error:', error);
        setAuthState({
          user: null,
          isLoading: false,
          isAuthenticated: false,
        });
      }
    };

    getInitialSession();

    // Auth 상태 변경 리스너
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event);

      if (session?.user) {
        const userData: User = {
          id: session.user.id,
          email: session.user.email || '',
          name: session.user.user_metadata?.name || '',
          university: session.user.user_metadata?.university,
          role: session.user.user_metadata?.role || 'user',
          createdAt: session.user.created_at,
        };

        localStorage.setItem('festivalhub_user', JSON.stringify(userData));
        setAuthState({
          user: userData,
          isLoading: false,
          isAuthenticated: true,
        });
      } else {
        localStorage.removeItem('festivalhub_user');
        setAuthState({
          user: null,
          isLoading: false,
          isAuthenticated: false,
        });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    setAuthState(prev => ({ ...prev, isLoading: true }));

    try {
      // Supabase Auth를 통한 로그인 시도
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          throw error;
        }

        if (data.user) {
          const userData: User = {
            id: data.user.id,
            email: data.user.email || '',
            name: data.user.user_metadata?.name || '',
            university: data.user.user_metadata?.university,
            role: data.user.user_metadata?.role || 'user',
            createdAt: data.user.created_at,
          };

          localStorage.setItem('festivalhub_user', JSON.stringify(userData));
          setAuthState({
            user: userData,
            isLoading: false,
            isAuthenticated: true,
          });

          console.log('Login successful:', userData);
          return { success: true };
        }
      } catch (supabaseError: any) {
        console.warn('Supabase login failed, using development mode:', supabaseError.message);

        // 이메일 미인증 에러인 경우 안내 메시지
        if (supabaseError.message === 'Email not confirmed') {
          setAuthState(prev => ({ ...prev, isLoading: false }));
          return {
            success: false,
            error: '이메일 인증이 완료되지 않았습니다. 가입 시 받은 인증 이메일을 확인해주세요.'
          };
        }

        // Supabase 연결 실패 시 개발 모드 (로컬 저장소 사용)
        const usersJson = localStorage.getItem('festivalhub_dev_users');

        if (!usersJson) {
          setAuthState(prev => ({ ...prev, isLoading: false }));
          return { success: false, error: '등록된 사용자가 없습니다. 먼저 회원가입해주세요.' };
        }

        const users = JSON.parse(usersJson);
        const foundUser = users.find((u: any) => u.email === email && u.password === password);

        if (!foundUser) {
          setAuthState(prev => ({ ...prev, isLoading: false }));
          return { success: false, error: '이메일 또는 비밀번호가 올바르지 않습니다.' };
        }

        // 비밀번호 제거 후 사용자 정보 설정
        const { password: _, ...userWithoutPassword } = foundUser;

        setAuthState({
          user: userWithoutPassword,
          isLoading: false,
          isAuthenticated: true,
        });

        localStorage.setItem('festivalhub_user', JSON.stringify(userWithoutPassword));
        console.log('Development mode login successful:', userWithoutPassword);
        return { success: true };
      }

      setAuthState(prev => ({ ...prev, isLoading: false }));
      return { success: false, error: '로그인에 실패했습니다.' };

    } catch (error) {
      console.error('Login error:', error);
      setAuthState(prev => ({ ...prev, isLoading: false }));
      return { success: false, error: '로그인 중 오류가 발생했습니다.' };
    }
  };

  const signup = async (credentials: SignupCredentials) => {
    setAuthState(prev => ({ ...prev, isLoading: true }));

    try {
      // 이메일 형식 검증
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(credentials.email)) {
        setAuthState(prev => ({ ...prev, isLoading: false }));
        return { success: false, error: '올바른 이메일 형식이 아닙니다.' };
      }

      // 비밀번호 길이 검증
      if (credentials.password.length < 6) {
        setAuthState(prev => ({ ...prev, isLoading: false }));
        return { success: false, error: '비밀번호는 최소 6자 이상이어야 합니다.' };
      }

      // Supabase Auth를 통한 회원가입 시도
      try {
        const { data, error } = await supabase.auth.signUp({
          email: credentials.email,
          password: credentials.password,
          options: {
            data: {
              name: credentials.name,
              university: credentials.university,
              role: credentials.role || 'user',
            },
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });

        if (error) {
          throw error;
        }

        // 회원가입 성공 (이메일 인증 대기 중)
        console.log('Signup successful, awaiting email confirmation:', data);

        // 이메일 인증이 필요한 경우
        if (data.user && !data.session) {
          setAuthState(prev => ({ ...prev, isLoading: false }));
          return {
            success: true,
            emailConfirmationRequired: true,
            email: credentials.email
          };
        }

        // 이메일 인증이 비활성화된 경우 (즉시 로그인)
        if (data.user && data.session) {
          const userData: User = {
            id: data.user.id,
            email: data.user.email || '',
            name: credentials.name,
            university: credentials.university,
            role: credentials.role || 'user',
            createdAt: data.user.created_at,
          };

          localStorage.setItem('festivalhub_user', JSON.stringify(userData));
          setAuthState({
            user: userData,
            isLoading: false,
            isAuthenticated: true,
          });

          console.log('Signup successful with immediate login:', userData);
          return { success: true };
        }
      } catch (supabaseError: any) {
        console.warn('Supabase signup failed, using development mode:', supabaseError.message);

        // Supabase 연결 실패 시 개발 모드 (로컬 저장소 사용)
        // 기존 사용자 목록 가져오기
        const usersJson = localStorage.getItem('festivalhub_dev_users');
        const users = usersJson ? JSON.parse(usersJson) : [];

        // 이메일 중복 체크
        const existingUser = users.find((u: any) => u.email === credentials.email);
        if (existingUser) {
          setAuthState(prev => ({ ...prev, isLoading: false }));
          return { success: false, error: '이미 가입된 이메일입니다.' };
        }

        // 개발 모드 회원가입 처리
        const newUser = {
          id: `dev_${Date.now()}`,
          email: credentials.email,
          name: credentials.name,
          university: credentials.university,
          role: credentials.role || 'user',
          createdAt: new Date().toISOString(),
          password: credentials.password, // 개발용
        };

        // 사용자 목록에 추가
        users.push(newUser);
        localStorage.setItem('festivalhub_dev_users', JSON.stringify(users));

        // 현재 사용자 정보 저장 (비밀번호 제외)
        const { password: _, ...userData } = newUser;
        localStorage.setItem('festivalhub_user', JSON.stringify(userData));

        setAuthState({
          user: userData,
          isLoading: false,
          isAuthenticated: true,
        });

        console.log('Development mode signup successful:', userData);
        return { success: true };
      }

      setAuthState(prev => ({ ...prev, isLoading: false }));
      return { success: false, error: '회원가입에 실패했습니다.' };

    } catch (error) {
      console.error('Signup error:', error);
      setAuthState(prev => ({ ...prev, isLoading: false }));
      return { success: false, error: '회원가입 중 오류가 발생했습니다.' };
    }
  };

  const logout = async () => {
    try {
      // Supabase Auth를 통한 로그아웃
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error('Supabase logout error:', error);
      }

      // 로컬 스토리지 정리
      localStorage.removeItem('festivalhub_user');
      setAuthState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
      });

      console.log('Logout successful');
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
