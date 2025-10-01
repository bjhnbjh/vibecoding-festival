export interface Festival {
  id: string
  name: string
  university: string
  region: string  // 지역 정보 추가
  startDate: string
  endDate: string
  location: string
  description: string
  lineup: Lineup[]
  booths: Booth[]
  transportation: Transportation
  admission: Admission
  createdAt: string
  updatedAt: string
}

export interface Lineup {
  artist: string
  time: string
  stage: string
}

export interface Booth {
  name: string
  category: string
  location: string
  operatingHours: string
}

export interface Transportation {
  parking: string
  publicTransport: string
}

export interface Admission {
  fee: number
  currency: string
  notes: string
}

export interface FestivalFilters {
  region?: string
  date?: string
  university?: string
  search?: string
}

export interface Favorite {
  id: string
  userId: string
  festivalId: string
  createdAt: string
}

export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  university?: string
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
}
