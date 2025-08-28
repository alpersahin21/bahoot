<template>
  <div class="min-h-screen">
    <NuxtPage />
    <!-- Bouncing Bahar Easter Egg 😂 -->
    <BouncingBahar />
  </div>
</template>

<script setup lang="ts">
import { useHead } from 'nuxt/app'

useHead({
  title: 'Bahoot - A Farewell Game for Bahar 💕',
  meta: [
    { name: 'description', content: 'A special Kahoot-style game created for Bahar' }
  ]
})
</script>
