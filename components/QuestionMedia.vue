<template>
  <div class="relative w-full rounded-xl overflow-hidden bg-gradient-to-br from-purple-400 to-pink-400">
    <!-- Image Display -->
    <div
      v-if="question.photo && !question.video"
      class="w-full h-72 sm:h-48 md:h-64 relative"
    >
      <img 
        :src="`/assets/photos/${question.photo}`"
        :alt="question.text"
        class="w-full h-full object-cover"
        loading="lazy"
      />
      <div class="absolute inset-0 bg-black/10"></div>
    </div>

    <!-- Video Display -->
    <div
      v-else-if="question.video"
      class="w-full h-72 sm:h-48 md:h-64 relative bg-black"
    >
      <video
        ref="videoElement"
        :src="`/assets/videos/${question.video}`"
        class="w-full h-full object-cover"
        :controls="false"
        :muted="true"
        :loop="true"
        :autoplay="true"
        playsinline
        @loadstart="onVideoLoadStart"
        @loadeddata="onVideoLoaded"
        @error="onVideoError"
      />
      <div class="absolute inset-0 bg-black/10"></div>
    </div>

    <!-- Fallback Gradient -->
    <div
      v-else
      class="w-full h-72 sm:h-48 md:h-64 bg-gradient-to-br from-purple-400 to-pink-400"
    ></div>

    <!-- Question Text Overlay -->
    <div v-if="!hideQuestionText" class="absolute inset-0 flex items-center justify-center p-3 sm:p-4 md:p-6">
      <div class="text-center bg-black/50 rounded-lg backdrop-blur-sm p-3 sm:p-4 md:p-6 max-w-full mx-2">
        <h2 class="text-base sm:text-lg md:text-2xl font-bold text-white leading-tight">
          {{ question.text }}
        </h2>
        <!-- Media Type Indicator (for debugging/development) -->
        <div v-if="showMediaInfo" class="text-xs text-white/70 mt-2">
          {{ question.video ? `Video: ${question.video}` : question.photo ? `Photo: ${question.photo}` : 'No media' }}
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div
      v-if="isLoading"
      class="absolute inset-0 flex items-center justify-center bg-black/20"
    >
      <div class="text-white text-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
        <div class="text-sm">Loading media...</div>
      </div>
    </div>

    <!-- Error State -->
    <div
      v-if="hasError"
      class="absolute inset-0 flex items-center justify-center bg-red-500/20"
    >
      <div class="text-white text-center p-4">
        <div class="text-2xl mb-2">⚠️</div>
        <div class="text-sm">Media failed to load</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import type { Question } from '../data/questions'

interface Props {
  question: Question
  showMediaInfo?: boolean
  hideQuestionText?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showMediaInfo: false,
  hideQuestionText: false
})

// State
const videoElement = ref<HTMLVideoElement | null>(null)
const isLoading = ref(false)
const hasError = ref(false)

// Methods
const onVideoLoadStart = () => {
  isLoading.value = true
  hasError.value = false
}

const onVideoLoaded = () => {
  isLoading.value = false
  hasError.value = false
  
  // Ensure video plays
  if (videoElement.value) {
    videoElement.value.play().catch(() => {
      // Silent fail for autoplay restrictions
    })
  }
}

const onVideoError = () => {
  isLoading.value = false
  hasError.value = true
}

const resetVideo = () => {
  if (videoElement.value && props.question.video) {
    videoElement.value.currentTime = 0
    videoElement.value.play().catch(() => {
      // Silent fail for autoplay restrictions
    })
  }
}

// Lifecycle
onMounted(() => {
  if (props.question.video && videoElement.value) {
    resetVideo()
  }
})

onUnmounted(() => {
  if (videoElement.value) {
    videoElement.value.pause()
  }
})

// Watch for question changes
watch(() => props.question.id, () => {
  hasError.value = false
  isLoading.value = false
  
  if (props.question.video) {
    setTimeout(() => {
      resetVideo()
    }, 100)
  }
})
</script>

<style scoped>
/* Ensure video covers the container properly */
video {
  object-fit: cover;
}

/* Responsive text sizing */
@media (max-width: 640px) {
  h2 {
    font-size: 1.125rem; /* text-lg */
    line-height: 1.75rem;
  }
}

@media (min-width: 641px) {
  h2 {
    font-size: 1.5rem; /* text-2xl */
    line-height: 2rem;
  }
}
</style>
