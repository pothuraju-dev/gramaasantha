import {
    productsQuery,
    productQuery,
    updateProductQuery
  } from '@/utils/supaQueries'
  import { useMemoize } from '@vueuse/core'
  import type { ProductsWithCategory, Product } from '@/utils/supaQueries'
  
  export const useProductsStore = defineStore('products-store', () => {
    const products = ref<ProductsWithCategory | null>(null)
    const product = ref<Product | null>(null)
  
    // Memoized loaders
    const loadProducts = useMemoize(async (key: string) => await productsQuery)
    const loadProduct = useMemoize(async (id: string) => await productQuery(id))
  
    interface ValidateCacheParams {
      ref: typeof products | typeof product
      query: typeof productsQuery | typeof productQuery
      key: string
      loaderFn: typeof loadProducts | typeof loadProduct
    }
  
    const validateCache = ({
      ref,
      query,
      key,
      loaderFn
    }: ValidateCacheParams) => {
      if (ref.value) {
        const finalQuery = typeof query === 'function' ? query(key) : query
  
        finalQuery.then(({ data, error }) => {
          if (JSON.stringify(ref.value) === JSON.stringify(data)) {
            return
          } else {
            loaderFn.delete(key)
            if (!error && data) ref.value = data
          }
        })
      }
    }
  
    const getProducts = async () => {
      products.value = null
  
      const { data, error, status } = await loadProducts('products')
  
      if (error) useErrorStore().setError({ error, customCode: status })
  
      if (data) products.value = data
  
      validateCache({
        ref: products,
        query: productsQuery,
        key: 'products',
        loaderFn: loadProducts
      })
    }
  
    const getProduct = async (id: string) => {
      product.value = null
  
      const { data, error, status } = await loadProduct(id)
  
      if (error) useErrorStore().setError({ error, customCode: status })
  
      if (data) product.value = data
  
      validateCache({
        ref: product,
        query: productQuery,
        key: id,
        loaderFn: loadProduct
      })
    }
  
    const updateProduct = async () => {
      if (!product.value) return
  
      const { categories, id, ...productProperties } = product.value
  
      await updateProductQuery(productProperties, id)
    }
  
    return {
      products,
      getProducts,
      getProduct,
      product,
      updateProduct
    }
  })
  