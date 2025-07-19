import { api } from "@/configs/api"

interface RefreshTokenDto {
  refresh_token: string
}

interface RefreshTokenResponse {
  access_token: string
  refresh_token: string
}

export async function refreshToken(data: RefreshTokenDto) {
  return (await api.post<API.BaseResponse<RefreshTokenResponse>>("/auth/refresh-token", data)).data
    .data
}
