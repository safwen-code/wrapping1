import { z } from 'zod'

export const loginSchema = z.object({
  operatorCode: z.string().min(1, 'Operator Code is required'),

  password: z.string().min(1, 'Password is required'),

  machineId: z.string().min(1, 'Machine is required'),
})

export type LoginSchema = z.infer<typeof loginSchema>
