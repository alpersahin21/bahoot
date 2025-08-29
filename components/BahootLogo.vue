<template>
  <div class="bahoot-logo">
    <h1 :class="[
      'font-black text-center tracking-wide bahoot-text',
      sizeClass,
      colorClass
    ]">
       BAHOOT
    </h1>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  size?: 'small' | 'medium' | 'large'
  variant?: 'light' | 'dark'
}

const props = withDefaults(defineProps<Props>(), {
  size: 'medium',
  variant: 'light'
})

const sizeClass = computed(() => {
  switch (props.size) {
    case 'small':
      return 'text-xl sm:text-2xl'
    case 'medium':
      return 'text-2xl sm:text-3xl md:text-4xl'
    case 'large':
      return 'text-4xl sm:text-5xl md:text-6xl'
    default:
      return 'text-2xl sm:text-3xl md:text-4xl'
  }
})

const colorClass = computed(() => {
  return props.variant === 'light' ? 'text-white' : 'text-gray-800'
})
</script>

<style scoped>
.bahoot-text {
  font-family: 'Arial Black', Arial, sans-serif;
  text-shadow: 3px 3px 0px rgba(0,0,0,0.3);
}

.bahoot-logo {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
