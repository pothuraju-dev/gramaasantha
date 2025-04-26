<template>
  <div class="p-8">
    <h1 class="text-2xl font-bold mb-6">Products</h1>

    <div v-if="loading" class="text-gray-500">Loading products...</div>

    <div v-else-if="products && products.length > 0" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      <div v-for="product in products" :key="product.id" class="border rounded p-4 shadow hover:shadow-lg transition">
        <div class="text-lg font-semibold">{{ product.name }}</div>
        <div class="text-sm text-gray-500">{{ product.categories?.name_en || 'No Category' }}</div>
        <div class="text-green-700 mt-2 font-bold">₹{{ product.price_per_kg }} /kg</div>
        <div class="text-gray-700 mt-1">{{ product.description }}</div>
      </div>
    </div>

    <div v-else class="text-gray-500">No products found.</div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'

const productsStore = useProductsStore()
const { products } = storeToRefs(productsStore)

const loading = ref(true)

const fetchProducts = async () => {
  await productsStore.getProducts()
  loading.value = false
}

onMounted(() => {
  fetchProducts()
})
</script>
