<template>
  <div class="min-h-screen">
    <NuxtPage />
    <!-- Bouncing Bahar Easter Egg 😂 -->
    <BouncingBahar />
    <!-- Background Music 🎵 -->
    <BackgroundMusic :gameState="currentGameState" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useHead, useRoute } from 'nuxt/app'

const route = useRoute()

// Determine game state based on current route
const currentGameState = computed(() => {
  const path = route.path
  if (path === '/') return 'lobby'
  if (path.includes('/host/')) return 'waiting'
  if (path.includes('/play/')) return 'playing'
  return 'lobby'
})

useHead({
  title: 'Bahoot - Bahar için özel veda oyunu 💕',
  meta: [
    { name: 'description', content: 'Bahar için özel olarak hazırlanmış Kahoot tarzı oyun' }
  ]
})
</script>

<style>
/* Global styles - main.css'te tanımlananlar burada override edilebilir */
body {
  margin: 0;
  padding: 0;
}
</style>