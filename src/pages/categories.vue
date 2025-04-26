<template>
  <div class="p-8">
    <h1 class="text-2xl font-bold mb-6">Categories</h1>

    <div v-if="loading" class="text-gray-500">Loading categories...</div>

    <div v-else-if="categories && categories.length > 0" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      <div v-for="category in categories" :key="categories.id" class="border rounded p-4 shadow hover:shadow-lg transition">
        <div class="text-lg font-semibold">{{ category.name_en }}</div>
        <div class="text-sm text-gray-500">{{ category.name_te }}</div>
      </div>
    </div>

    <div v-else class="text-gray-500">No products found.</div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'

const categoriesStore = useCategoriesStore()
const { categories } = storeToRefs(categoriesStore)

const loading = ref(true)

const fetchCategories = async () => {
  await categoriesStore.getCategories()
  loading.value = false
}

onMounted(() => {
  fetchCategories()
})
</script>
