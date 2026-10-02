export type UserRole = 'ADMIN' | 'OPERATOR'

export interface User {
  id: string
  operatorCode: string
  name: string
  password: string
  role: UserRole
}

export interface Machine {
  id: string
  name: string
}

export interface LoginFormValues {
  operatorCode: string
  password: string
  machineId: string
}
