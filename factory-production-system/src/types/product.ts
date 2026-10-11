export type ProductStatus = 'CONFIRMED' | 'NOT_CONFIRMED'

export interface Product {
  id: string
  number: string

  dirtyHeight: number
  dirtyWidth: number

  cleanHeight: number
  cleanWidth: number

  big: boolean
  small: boolean

  status: ProductStatus

  machineId: string
  operatorId: string
  operatorName: string

  createdAt: string
}

export interface CreateProductInput {
  number: string

  dirtyHeight: number
  dirtyWidth: number

  cleanHeight: number
  cleanWidth: number

  big: boolean
  small: boolean

  status: ProductStatus
}
