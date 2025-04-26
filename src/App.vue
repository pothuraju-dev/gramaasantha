<script setup>
import { ref, computed } from 'vue'
import Products from "../src/pages/products.vue"
import Categories from "../src/pages/categories.vue"

const routes = {
  '/products': Products,
  '/categories':Categories
}

const currentPath = ref(window.location.hash)

window.addEventListener('hashchange', () => {
  currentPath.value = window.location.hash
})

const currentView = computed(() => {
  return routes[currentPath.value.slice(1) || '/']
})
</script>

<template>
  <a href="/">Home</a> |
  <a href="#/products">Products</a> |
  <a href="#/categories">Categories</a> |
  <component :is="currentView" />
</template>
