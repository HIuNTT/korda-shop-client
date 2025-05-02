import { api } from "@/configs/api"
import { useMutation } from "@tanstack/react-query"

export interface SendVerifyCodeDto {
  email: string
}

async function sendVerifyCode(data: SendVerifyCodeDto) {
  return await api.post("/otp/email/send", data)
}

export function useSendVerifyCode() {
  return useMutation({
    mutationFn: sendVerifyCode,
  })
}

export interface VerifyCodeDto {
  email: string
  code: string
}

async function verifyCode(data: VerifyCodeDto) {
  return await api.post("/otp/email/verify", data)
}

export function useVerifyCode() {
  return useMutation({
    mutationFn: verifyCode,
  })
}
