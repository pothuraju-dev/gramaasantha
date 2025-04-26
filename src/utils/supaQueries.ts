import { supabase } from '@/lib/supabaseClient'
import type { QueryData } from '@supabase/supabase-js'

/** ===========================
 * Categories Queries
 * ============================ **/

export const categoriesQuery = supabase.from('categories').select(`
  id,
  name_en,
  name_te,
  slug,
  image_url,
  is_active,
  created_at,
  updated_at
`)
export type Categories = QueryData<typeof categoriesQuery>

/** ===========================
 * Products Queries
 * ============================ **/

export const productsQuery = supabase.from('products').select(`
  *,
  categories (
    id,
    name_en,
    name_te,
    slug
  )
`)
export type ProductsWithCategory = QueryData<typeof productsQuery>

export const productQuery = (id: string) =>
  supabase.from('products').select(`
    *,
    categories (
      id,
      name_en,
      name_te
    )
  `).eq('id', id).single()
export type Product = QueryData<ReturnType<typeof productQuery>>

export const updateProductQuery = (updatedProduct = {}, id: string) => {
  return supabase.from('products').update(updatedProduct).eq('id', id)
}

export const deleteProductQuery = (id: string) => {
  return supabase.from('products').delete().eq('id', id)
}

/** ===========================
 * Orders Queries
 * ============================ **/

export const ordersQuery = supabase.from('orders').select(`
  id,
  user_id,
  order_status,
  total_amount,
  delivery_address,
  phone_number,
  placed_at
`)
export type Orders = QueryData<typeof ordersQuery>

export const orderQuery = (id: string) =>
  supabase.from('orders').select(`
    *,
    order_items (
      id,
      product_id,
      quantity_kg,
      price_per_kg,
      total_price
    )
  `).eq('id', id).single()
export type OrderWithItems = QueryData<ReturnType<typeof orderQuery>>

export const updateOrderQuery = (updatedOrder = {}, id: string) => {
  return supabase.from('orders').update(updatedOrder).eq('id', id)
}

/** ===========================
 * Order Items Queries
 * ============================ **/

export const orderItemsQuery = supabase.from('order_items').select(`
  *,
  products (
    id,
    name,
    price_per_kg,
    image_url
  )
`)
export type OrderItemsWithProduct = QueryData<typeof orderItemsQuery>

export const deleteOrderItemQuery = (id: string) => {
  return supabase.from('order_items').delete().eq('id', id)
}