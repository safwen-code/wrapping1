import { products } from '@/mocks/products'

import { CreateProductInput, Product } from '@/types/product'

export const productService = {
  getProductsByMachine: async (machineId: string): Promise<Product[]> => {
    await new Promise((resolve) => setTimeout(resolve, 500))

    return products.filter((product) => product.machineId === machineId)
  },

  createProduct: async (
    data: CreateProductInput,
    machineId: string,
    operatorId: string,
    operatorName: string,
  ): Promise<Product> => {
    await new Promise((resolve) => setTimeout(resolve, 500))

    const product: Product = {
      id: crypto.randomUUID(),

      number: data.number,

      height: data.height,

      big: data.big,

      small: data.small,

      status: data.status,

      machineId,

      operatorId,

      operatorName,

      createdAt: new Date().toISOString(),
    }

    products.unshift(product)

    return product
  },
}
