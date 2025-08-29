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
import type { GameState } from './composables/useGameRoom'

const route = useRoute()

// This ref will now hold the entire gameState object from Firebase
const liveGameState = ref<GameState | null>(null)

// Provide method to update music state from child components
const updateMusicState = (newState: GameState | null) => {
  liveGameState.value = newState
}

// Expose globally
if (process.client) {
  (window as any).updateMusicState = updateMusicState
}

// Determine music state based on the live game state or route
const currentGameState = computed(() => {
  const path = route.path
  
  // 1. Homepage is always lobby music
  if (path === '/') {
    return 'lobby'
  }

  // 2. If we have a live game state, use it to determine the music
  if (liveGameState.value) {
    const state = liveGameState.value
    // Game over screen is the ONLY time for results music
    if (state.status === 'finished') {
      return 'results'
    }
    // During gameplay (including showing results), it's always gameplay music
    if (state.status === 'playing') {
      return 'playing'
    }
    // While waiting for players, it's lobby music
    if (state.status === 'waiting') {
      return 'waiting'
    }
  }

  // 3. Fallback based on route (for initial load before gameState is available)
  if (path.includes('/host/') || path.includes('/play/')) {
    return 'waiting' // Default to waiting/lobby music for game pages
  }
  
  return 'lobby' // Default fallback
})

// Watch for route changes to properly reset music state
watch(() => route.path, (newPath, oldPath) => {
  console.log('Route changed:', oldPath, '->', newPath)
  
  // Reset music state when navigating back to homepage
  if (newPath === '/') {
    console.log('Navigating to homepage, resetting music state to lobby')
    liveGameState.value = null // Clear the live game state
  }
}, { immediate: true })

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
