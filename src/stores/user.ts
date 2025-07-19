import { Roles } from "@/constants/role"
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
    access_token: "",
    refresh_token: "",
  },
  user: {
    id: NaN,
    email: "",
    is_actived: true,
    phone: "",
    provider: "",
    role: Roles.USER,
    profile: {
      id: NaN,
      full_name: "",
      avatar_url: "",
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
