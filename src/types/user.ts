import { RoleTypes } from "@/constants/role"

export interface User {
  id: number
  email: string
  phone: string
  is_actived: boolean
  role: RoleTypes
  provider: string
  profile: Profile
}

export interface Profile {
  id: number
  full_name: string
  avatar_url: string
  gender: number
  birthday: string
}

export interface AuthUser {
  access_token: string
  refresh_token: string
}
