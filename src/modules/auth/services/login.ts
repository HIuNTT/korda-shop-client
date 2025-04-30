import { api } from "@/configs/api"
import { User } from "@/types/user"
import { useMutation } from "@tanstack/react-query"

export interface LoginDto {
  credential: string
  password: string
}

export interface LoginResponse {
  user: User
  accessToken: string
  refreshToken: string
}

async function login(data: LoginDto) {
  return (await api.post<LoginResponse>("/auth/login", data)).data
}

export function useLogin() {
  return useMutation({
    mutationFn: login,
  })
}
