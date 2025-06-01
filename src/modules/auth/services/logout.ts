import { api } from "@/configs/api"
import { useMutation } from "@tanstack/react-query"

interface LogoutDto {
  refresh_token: string
}

async function logout(data: LogoutDto) {
  await api.post("/account/logout", data)
}

export function useLogout() {
  return useMutation({
    mutationFn: logout,
  })
}
