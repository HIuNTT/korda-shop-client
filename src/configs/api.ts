import { refreshToken } from "@/modules/auth/services/refreshToken"
import { useUser } from "@/stores/user"
import axios, { AxiosError } from "axios"
import { toast } from "sonner"

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

api.interceptors.request.use((config) => {
  const accessToken = useUser.getState().auth.access_token
  if (accessToken) {
    config.headers["Authorization"] = `Bearer ${accessToken}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const config = error.config

    if (error.response?.status === 401 && config?.url !== "/auth/refresh-token") {
      const token = useUser.getState().auth.refresh_token
      if (token) {
        try {
          const data = await refreshToken({ refresh_token: token })
          if (data) {
            useUser.getState().setToken(data)
            return api(config!)
          }
        } catch (err) {
          toast.error("Vui lòng đăng nhập lại!")
          useUser.getState().clear()
        }
      }
    }

    return Promise.reject(error)
  },
)
