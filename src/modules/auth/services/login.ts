import { api } from "@/configs/api"
import { User } from "@/types/user"
import { useMutation } from "@tanstack/react-query"

export interface LoginDto {
  credential: string
  password: string
}

export interface LoginResponse {
  user: User
  access_token: string
  refresh_token: string
}

async function login(data: LoginDto) {
  return (await api.post<API.BaseResponse<LoginResponse>>("/auth/login", data)).data.data
}

export function useLogin() {
  return useMutation({
    mutationFn: login,
  })
}
