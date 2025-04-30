export interface User {
  id: number
  email: string
  phone: string
  isActived: boolean
  role: string
  provider: string
  profile: Profile
}

export interface Profile {
  id: number
  fullName: string
  avatarUrl: string
  gender: number
  birthday: string
}

export interface AuthUser {
  accessToken: string
  refreshToken: string
}
