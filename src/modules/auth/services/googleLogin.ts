import { api } from "@/configs/api"
import { User } from "@/types/user"
import { useMutation } from "@tanstack/react-query"

export interface GoogleLoginDto {
  code: string
}

export interface GoogleLoginResponse {
  user: User
  access_token: string
  refresh_token: string
}
async function googleLogin(data: GoogleLoginDto) {
  return (await api.post<API.BaseResponse<GoogleLoginResponse>>("/auth/user/google", data)).data
    .data
}

export function useGoogleLogin() {
  return useMutation({
    mutationFn: googleLogin,
  })
}
