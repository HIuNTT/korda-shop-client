import { create } from "zustand"

interface SignUpFormData {
  email: string
  fullName: string
  password: string
}

interface SignUpState {
  step: number
  data: SignUpFormData
  incStep: () => void
  decStep: () => void
  setData: (data: Partial<SignUpFormData>) => void
  reset: () => void
}

const initialSignUpState: Omit<SignUpState, "incStep" | "decStep" | "setData" | "reset"> = {
  step: 0,
  data: {
    email: "",
    fullName: "",
    password: "",
  },
}

export const useSignUpStore = create<SignUpState>()((set) => ({
  ...initialSignUpState,
  incStep: () => set((state) => ({ step: state.step + 1 })),
  decStep: () => set((state) => ({ step: state.step - 1 })),
  setData: (data) => set((state) => ({ data: { ...state.data, ...data } })),
  reset: () => set({ ...initialSignUpState }),
}))
