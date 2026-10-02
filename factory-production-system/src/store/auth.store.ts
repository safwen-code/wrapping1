import { create } from 'zustand'
import { User } from '@/types/auth'

interface AuthState {
  token: string | null

  user: User | null

  machineId: string | null

  login: (token: string, user: User, machineId: string) => void

  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,

  user: null,

  machineId: null,

  login: (token, user, machineId) =>
    set({
      token,
      user,
      machineId,
    }),

  logout: () =>
    set({
      token: null,
      user: null,
      machineId: null,
    }),
}))
