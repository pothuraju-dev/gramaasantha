/* eslint-env node */

import { fakerEN_US as faker } from '@faker-js/faker'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.SERVICE_ROLE_KEY)

const logErrorAndExit = (tableName, error) => {
  console.error(
    `An error occurred in table '${tableName}' with code ${error.code}: ${error.message}`
  )
  process.exit(1)
}

const logStep = (stepMessage) => {
  console.log(stepMessage)
}

// 1. Seed Categories
const seedCategories = async () => {
  logStep('Seeding categories...')

  const categories = [
    {
      name_en: 'Vegetables',
      name_te: 'కూరగాయలు',
      slug: 'vegetables',
      image_url: null,
    },
    {
      name_en: 'Fruits',
      name_te: 'పండ్లు',
      slug: 'fruits',
      image_url: null,
    },
    {
      name_en: 'Groceries',
      name_te: 'కిరాణా',
      slug: 'groceries',
      image_url: null,
    },
    {
      name_en: 'Meat',
      name_te: 'మాంసం',
      slug: 'meat',
      image_url: null,
    }
  ]

  const { data, error } = await supabase.from('categories').insert(categories).select('id')

  if (error) return logErrorAndExit('Categories', error)

  logStep('Categories seeded successfully.')

  return data.map(category => category.id) // Return array of category IDs
}

// 2. Seed Products
const seedProducts = async (categoryIds, numProducts = 20) => {
  logStep('Seeding products...')

  const products = []

  for (let i = 0; i < numProducts; i++) {
    const name = faker.commerce.productName()
    const price = faker.number.float({ min: 10, max: 200, precision: 0.5 })
    const stock = faker.number.float({ min: 10, max: 100, precision: 0.5 })
    const category_id = faker.helpers.arrayElement(categoryIds)

    products.push({
      name: name,
      description: faker.commerce.productDescription(),
      price_per_kg: price,
      stock: stock,
      category_id: category_id,
      image_url: null
    })
  }

  const { data, error } = await supabase.from('products').insert(products).select('id')

  if (error) return logErrorAndExit('Products', error)

  logStep('Products seeded successfully.')

  return data.map(product => product.id) // Return array of product IDs
}

// 3. Seed Orders
const seedOrders = async (numOrders = 10) => {
  logStep('Seeding orders...')

  const orders = []

  for (let i = 0; i < numOrders; i++) {
    orders.push({
      user_id: null, // (You can link a user ID later if needed)
      order_status: faker.helpers.arrayElement(['pending', 'confirmed', 'delivered']),
      total_amount: faker.number.float({ min: 100, max: 1000, precision: 0.01 }),
      delivery_address: faker.location.streetAddress(),
      phone_number: faker.phone.number('9#########'), // Indian mobile style
      placed_at: faker.date.recent()
    })
  }

  const { data, error } = await supabase.from('orders').insert(orders).select('id')

  if (error) return logErrorAndExit('Orders', error)

  logStep('Orders seeded successfully.')

  return data.map(order => order.id) // Return array of order IDs
}

// 4. Seed Order Items
const seedOrderItems = async (orderIds, productIds) => {
  logStep('Seeding order items...')

  const orderItems = []

  for (let i = 0; i < orderIds.length; i++) {
    const numberOfItems = faker.number.int({ min: 1, max: 5 })

    for (let j = 0; j < numberOfItems; j++) {
      const product_id = faker.helpers.arrayElement(productIds)
      const quantity_kg = faker.number.float({ min: 0.5, max: 5, precision: 0.5 })
      const price_per_kg = faker.number.float({ min: 10, max: 200, precision: 0.5 })
      const total_price = (price_per_kg * quantity_kg).toFixed(2)

      orderItems.push({
        order_id: orderIds[i],
        product_id: product_id,
        quantity_kg: quantity_kg,
        price_per_kg: price_per_kg,
        total_price: total_price
      })
    }
  }

  const { error } = await supabase.from('order_items').insert(orderItems)

  if (error) return logErrorAndExit('Order Items', error)

  logStep('Order items seeded successfully.')
}

// Full Seeder
const seedDatabase = async () => {
  const categoryIds = await seedCategories()
  const productIds = await seedProducts(categoryIds)
  const orderIds = await seedOrders()
  await seedOrderItems(orderIds, productIds)
}

seedDatabase()