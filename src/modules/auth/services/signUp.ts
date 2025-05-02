import { api } from "@/configs/api"
import { User } from "@/types/user"
import { useMutation } from "@tanstack/react-query"
import { SendVerifyCodeDto } from "./verifyCode"

export interface SignUpDto {
  email: string
  fullName: string
  password: string
}

interface SignUpResponse {
  user: User
  accessToken: string
  refreshToken: string
}

async function signUp(data: SignUpDto) {
  return (await api.post<SignUpResponse>("/auth/sign-up", data)).data
}

export function useSignUp() {
  return useMutation({
    mutationFn: signUp,
  })
}

interface ExistUserDto extends SendVerifyCodeDto {}

interface ExistUserResponse {
  existed: boolean
}

async function existUser(data: ExistUserDto) {
  return (await api.post<ExistUserResponse>("/user/exist", data)).data
}

export function useExistUser() {
  return useMutation({
    mutationFn: existUser,
  })
}
