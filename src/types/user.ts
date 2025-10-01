export type UserRole = 'super_admin' | 'university_admin' | 'user';

export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  university?: string
  role: UserRole
  createdAt: string
}

export interface AuthState {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface SignupCredentials {
  email: string
  password: string
  name: string
  university?: string
  role?: UserRole
}
