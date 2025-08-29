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
  title: 'Bahoot - A Farewell Game for Bahar 💕',
  meta: [
    { name: 'description', content: 'A special Kahoot-style game created for Bahar' }
  ]
})
</script>
