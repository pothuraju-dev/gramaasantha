import { orderItemsQuery, deleteOrderItemQuery } from '@/utils/supaQueries'
import { useMemoize } from '@vueuse/core'
import type { OrderItemsWithProduct } from '@/utils/supaQueries'

export const useOrderItemsStore = defineStore('order-items-store', () => {
  const orderItems = ref<OrderItemsWithProduct | null>(null)

  const loadOrderItems = useMemoize(async (key: string) => await orderItemsQuery)

  interface ValidateCacheParams {
    ref: typeof orderItems
    query: typeof orderItemsQuery
    key: string
    loaderFn: typeof loadOrderItems
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

  const getOrderItems = async () => {
    orderItems.value = null

    const { data, error, status } = await loadOrderItems('order-items')

    if (error) useErrorStore().setError({ error, customCode: status })

    if (data) orderItems.value = data

    validateCache({
      ref: orderItems,
      query: orderItemsQuery,
      key: 'order-items',
      loaderFn: loadOrderItems
    })
  }

  const deleteOrderItem = async (id: string) => {
    await deleteOrderItemQuery(id)
  }

  return {
    orderItems,
    getOrderItems,
    deleteOrderItem
  }
})
