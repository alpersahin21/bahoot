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
import { ref, computed, watch } from 'vue'
import { useHead, useRoute } from 'nuxt/app'

const route = useRoute()

// Global music state - always start with lobby
const musicGameState = ref('lobby')

// Provide method to update music state from child components
const updateMusicState = (newState) => {
  console.log('Updating music state to:', newState)
  musicGameState.value = newState
}

// Expose globally
if (process.client) {
  (window as any).updateMusicState = updateMusicState
}

// Determine game state based on current route
const currentGameState = computed(() => {
  const path = route.path
  if (path === '/') {
    // Always reset to lobby when on homepage
    return 'lobby'
  }
  if (path.includes('/host/')) return musicGameState.value || 'waiting'
  if (path.includes('/play/')) return musicGameState.value || 'playing'
  return 'lobby'
})

// Watch for route changes to properly reset music state
watch(() => route.path, (newPath, oldPath) => {
  console.log('Route changed:', oldPath, '->', newPath)
  
  // Reset music state when navigating back to homepage
  if (newPath === '/') {
    console.log('Navigating to homepage, resetting music state to lobby')
    musicGameState.value = 'lobby'
    // Force update using the global function too
    if (process.client && (window as any).updateMusicState) {
      (window as any).updateMusicState('lobby')
    }
  }
}, { immediate: false })

// Debug watcher
watch(currentGameState, (newState, oldState) => {
  console.log('App game state changed:', oldState, '->', newState)
}, { immediate: true })

useHead({
  title: 'Bahoot - A Farewell Game for Bahar 💕',
  meta: [
    { name: 'description', content: 'A special Kahoot-style game created for Bahar' }
  ]
})
</script>
