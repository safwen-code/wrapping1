import { create } from 'zustand'

import { CreateProductInput, Product } from '@/types/product'

import { productService } from '@/services/product.service'

interface ProductState {
  products: Product[]

  loading: boolean

  error: string | null

  loadProducts: (machineId: string) => Promise<void>

  addProduct: (
    data: CreateProductInput,
    machineId: string,
    operatorId: string,
    operatorName: string,
  ) => Promise<void>

  clearProducts: () => void
}

export const useProductStore = create<ProductState>((set) => ({
  products: [],

  loading: false,

  error: null,

  loadProducts: async (machineId) => {
    try {
      set({
        loading: true,
        error: null,
      })

      const data = await productService.getProductsByMachine(machineId)

      set({
        products: data,
        loading: false,
      })
    } catch {
      set({
        loading: false,
        error: 'Failed to load products',
      })
    }
  },

  addProduct: async (data, machineId, operatorId, operatorName) => {
    try {
      set({
        loading: true,
        error: null,
      })

      const product = await productService.createProduct(
        data,
        machineId,
        operatorId,
        operatorName,
      )

      set((state) => ({
        products: [product, ...state.products],

        loading: false,
      }))
    } catch {
      set({
        loading: false,
        error: 'Failed to create product',
      })

      throw new Error('Failed to create product')
    }
  },

  clearProducts: () => {
    set({
      products: [],
    })
  },
}))
