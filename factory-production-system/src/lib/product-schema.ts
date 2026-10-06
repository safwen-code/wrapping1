import { z } from 'zod'

export const productSchema = z.object({
  number: z.string().min(1, 'Product number is required'),

  height: z.coerce.number().positive('Height must be greater than 0'),

  big: z.coerce.number().positive('Big must be greater than 0'),

  small: z.coerce.number().positive('Small must be greater than 0'),

  status: z.enum(['BIG', 'SMALL', 'CONFIRM']),
})

export type ProductFormValues = z.infer<typeof productSchema>
