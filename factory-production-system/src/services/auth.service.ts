import { users } from '@/mocks/users'
import { LoginFormValues } from '@/types/auth'

export const authService = {
  login: async (data: LoginFormValues) => {
    await new Promise((resolve) => setTimeout(resolve, 500))

    const user = users.find(
      (u) =>
        u.operatorCode === data.operatorCode && u.password === data.password,
    )

    if (!user) {
      throw new Error('Invalid credentials')
    }

    return {
      token: 'fake-jwt-token',
      user,
      machineId: data.machineId,
    }
  },
}
