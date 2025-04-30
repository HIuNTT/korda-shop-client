import { api } from "@/configs/api"
import { User } from "@/types/user"
import { useMutation } from "@tanstack/react-query"

export interface GoogleLoginDto {
  code: string
}

export interface GoogleLoginResponse {
  user: User
  accessToken: string
  refreshToken: string
}
async function googleLogin(data: GoogleLoginDto) {
  return (await api.post<GoogleLoginResponse>("/auth/user/google", data)).data
}

export function useGoogleLogin() {
  return useMutation({
    mutationFn: googleLogin,
  })
}
