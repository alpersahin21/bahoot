<template>
  <div class="bouncing-bahar">
    <!-- Bouncing circle with Bahar's face -->
    <div class="bahar-circle">
      <div class="face-container">
        <!-- Placeholder for Bahar's photo - user can replace with actual image -->
        <div class="placeholder-face">
          <img 
            v-if="!imageError"
            src="/assets/photos/bahar-face.png" 
            alt="Bahar" 
            class="face-image"
            @error="handleImageError"
            @load="handleImageLoad"
          />
          <div v-else class="emoji-fallback">
            🥰
          </div>
        </div>
        <!-- When you have Bahar's photo, replace above with: -->
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const imageError = ref(false)

const handleImageLoad = () => {
  imageError.value = false
}

const handleImageError = () => {
  imageError.value = true
}
</script>

<style scoped>
.bouncing-bahar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
  z-index: 9999;
  overflow: hidden;
}

.bahar-circle {
  position: absolute;
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%);
  border-radius: 50%;
  border: 4px solid white;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  animation: bounce 45s infinite linear;
  transition: none; /* Disable transitions for smooth animation */
}

.face-container {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.9);
}

.placeholder-face {
  font-size: 32px;
  filter: hue-rotate(10deg);
}

.emoji-fallback {
  font-size: 32px;
  filter: hue-rotate(10deg);
}

.face-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

@keyframes bounce {
  0% {
    top: 5vh;
    left: 5vw;
    transform: rotate(0deg);
  }
  12.5% {
    top: 25vh;
    left: 30vw;
    transform: rotate(45deg);
  }
  25% {
    top: 70vh;
    left: 70vw;
    transform: rotate(90deg);
  }
  37.5% {
    top: 80vh;
    left: 40vw;
    transform: rotate(135deg);
  }
  50% {
    top: 45vh;
    left: 10vw;
    transform: rotate(180deg);
  }
  62.5% {
    top: 15vh;
    left: 60vw;
    transform: rotate(225deg);
  }
  75% {
    top: 65vh;
    left: 85vw;
    transform: rotate(270deg);
  }
  87.5% {
    top: 10vh;
    left: 25vw;
    transform: rotate(315deg);
  }
  100% {
    top: 5vh;
    left: 5vw;
    transform: rotate(360deg);
  }
}

/* More realistic screensaver bouncing */
@media (prefers-reduced-motion: no-preference) {
  .bahar-circle {
    animation: bounce 45s infinite linear;
  }
}

/* Respect motion preferences */
@media (prefers-reduced-motion: reduce) {
  .bahar-circle {
    animation: none;
    top: 20px;
    right: 20px;
  }
}
</style>
