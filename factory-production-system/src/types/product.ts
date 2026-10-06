export type ProductStatus = 'BIG' | 'SMALL' | 'CONFIRM'

export interface Product {
  id: string

  number: string

  height: number

  big: number

  small: number

  status: ProductStatus

  machineId: string

  operatorId: string

  operatorName: string

  createdAt: string
}

export interface CreateProductInput {
  number: string

  height: number

  big: number

  small: number

  status: ProductStatus
}
