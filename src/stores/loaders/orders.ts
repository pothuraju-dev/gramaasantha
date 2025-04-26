import { ordersQuery, orderQuery, updateOrderQuery } from '@/utils/supaQueries'
import { useMemoize } from '@vueuse/core'
import type { Orders, OrderWithItems } from '@/utils/supaQueries'

export const useOrdersStore = defineStore('orders-store', () => {
  const orders = ref<Orders | null>(null)
  const order = ref<OrderWithItems | null>(null)

  const loadOrders = useMemoize(async (key: string) => await ordersQuery)
  const loadOrder = useMemoize(async (id: string) => await orderQuery(id))

  interface ValidateCacheParams {
    ref: typeof orders | typeof order
    query: typeof ordersQuery | typeof orderQuery
    key: string
    loaderFn: typeof loadOrders | typeof loadOrder
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

  const getOrders = async () => {
    orders.value = null

    const { data, error, status } = await loadOrders('orders')

    if (error) useErrorStore().setError({ error, customCode: status })

    if (data) orders.value = data

    validateCache({
      ref: orders,
      query: ordersQuery,
      key: 'orders',
      loaderFn: loadOrders
    })
  }

  const getOrder = async (id: string) => {
    order.value = null

    const { data, error, status } = await loadOrder(id)

    if (error) useErrorStore().setError({ error, customCode: status })

    if (data) order.value = data

    validateCache({
      ref: order,
      query: orderQuery,
      key: id,
      loaderFn: loadOrder
    })
  }

  const updateOrder = async () => {
    if (!order.value) return

    const { order_items, id, ...orderProperties } = order.value

    await updateOrderQuery(orderProperties, id)
  }

  return {
    orders,
    getOrders,
    getOrder,
    order,
    updateOrder
  }
})
