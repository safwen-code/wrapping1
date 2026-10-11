import { products } from '@/mocks/products'

import { CreateProductInput, Product } from '@/types/product'

export const productService = {
  async getProductsByMachine(machineId: string): Promise<Product[]> {
    await new Promise((resolve) => setTimeout(resolve, 300))

    return products.filter((product) => product.machineId === machineId)
  },

  async createProduct(
    data: CreateProductInput,
    machineId: string,
    operatorId: string,
    operatorName: string,
  ): Promise<Product> {
    await new Promise((resolve) => setTimeout(resolve, 300))

    const product: Product = {
      id: crypto.randomUUID(),

      ...data,

      machineId,
      operatorId,
      operatorName,

      createdAt: new Date().toISOString(),
    }

    products.unshift(product)

    return product
  },
}
