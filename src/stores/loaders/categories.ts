import { categoriesQuery } from '@/utils/supaQueries'
import { useMemoize } from '@vueuse/core'
import type { Categories } from '@/utils/supaQueries'

export const useCategoriesStore = defineStore('categories-store', () => {
  const categories = ref<Categories | null>(null)

  const loadCategories = useMemoize(async (key: string) => await categoriesQuery)

  interface ValidateCacheParams {
    ref: typeof categories
    query: typeof categoriesQuery
    key: string
    loaderFn: typeof loadCategories
  }

  const validateCache = ({ ref, query, key, loaderFn }: ValidateCacheParams) => {
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

  const getCategories = async () => {
    categories.value = null

    const { data, error, status } = await loadCategories('categories')

    if (error) useErrorStore().setError({ error, customCode: status })

    if (data) categories.value = data

    validateCache({
      ref: categories,
      query: categoriesQuery,
      key: 'categories',
      loaderFn: loadCategories
    })
  }

  return {
    categories,
    getCategories
  }
})
