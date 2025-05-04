import { AuthUser, User } from "@/types/user"
import { create } from "zustand"
import { persist } from "zustand/middleware"

interface UserState {
  auth: AuthUser
  user: User
  setToken: (auth: AuthUser) => void
  setUser: (user: User) => void
  clear: () => void
}

const initialUserState: Omit<UserState, "setToken" | "setUser" | "clear"> = {
  auth: {
    accessToken: "",
    refreshToken: "",
  },
  user: {
    id: NaN,
    email: "",
    isActived: true,
    phone: "",
    provider: "",
    role: "",
    profile: {
      id: NaN,
      fullName: "",
      avatarUrl: "",
      birthday: "",
      gender: NaN,
    },
  },
}

export const useUser = create<UserState>()(
  persist(
    (set) => ({
      ...initialUserState,
      setToken: (auth) => set({ auth }),
      setUser: (user) => set((state) => ({ user: { ...state.user, ...user } })),
      clear: () => set({ ...initialUserState }),
    }),
    {
      name: "user",
      partialize: (state) => ({ auth: state.auth }),
    },
  ),
)
