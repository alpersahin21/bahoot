<template>
  <div class="music-controls">
    <!-- Music Control Button -->
    <button 
      @click="toggleMusic" 
      class="music-btn"
      :class="{ active: isPlaying }"
      :title="isPlaying ? 'Mute Music' : 'Play Music'"
    >
      <span v-if="isPlaying">🔊</span>
      <span v-else>🔇</span>
    </button>

    <!-- Volume Slider -->
    <div v-if="isPlaying" class="volume-container">
      <input 
        type="range" 
        min="0" 
        max="100" 
        v-model="volume"
        @input="updateVolume"
        class="volume-slider"
      />
      <span class="volume-text">{{ volume }}%</span>
    </div>

    <!-- Audio Elements -->
    <audio 
      ref="lobbyMusic" 
      loop 
      preload="auto"
      @ended="handleMusicEnd"
      @error="handleMusicError"
      src="/assets/audio/kahoot-lobby.mp3"
    >
    </audio>

    <audio 
      ref="gameplayMusic" 
      loop 
      preload="auto"
      @ended="handleMusicEnd"
      @error="handleMusicError"
      src="/assets/audio/kahoot-gameplay.mp3"
    >
    </audio>

    <audio 
      ref="resultsMusic" 
      loop 
      preload="auto"
      @ended="handleMusicEnd"
      @error="handleMusicError"
      src="/assets/audio/kahoot-results.mp3"
    >
    </audio>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'nuxt/app'

const props = defineProps({
  gameState: {
    type: String,
    default: 'lobby' // 'lobby', 'playing', 'results'
  }
})

const route = useRoute()
const isPlaying = ref(false)
const volume = ref(30) // Start at 30% volume
const currentTrack = ref('lobby')

// Audio refs
const lobbyMusic = ref(null)
const gameplayMusic = ref(null)
const resultsMusic = ref(null)

// Track mapping
const trackMap = {
  lobby: 'lobbyMusic',
  waiting: 'lobbyMusic',
  playing: 'gameplayMusic',
  finished: 'resultsMusic',
  results: 'resultsMusic'
}

const getCurrentAudio = () => {
  const trackRef = trackMap[props.gameState] || 'lobbyMusic'
  return eval(trackRef).value
}

const stopAllMusic = () => {
  [lobbyMusic, gameplayMusic, resultsMusic].forEach(audioRef => {
    if (audioRef.value) {
      audioRef.value.pause()
      audioRef.value.currentTime = 0
    }
  })
}

const playCurrentTrack = async () => {
  if (!isPlaying.value) return
  
  stopAllMusic()
  const audio = getCurrentAudio()
  
  if (audio) {
    audio.volume = volume.value / 100
    try {
      await audio.play()
      currentTrack.value = props.gameState
    } catch (error) {
      console.warn('Could not play music:', error)
      // Fallback: user needs to interact first
      isPlaying.value = false
    }
  }
}

const toggleMusic = async () => {
  isPlaying.value = !isPlaying.value
  
  if (isPlaying.value) {
    await playCurrentTrack()
  } else {
    stopAllMusic()
  }
  
  // Save preference
  localStorage.setItem('bahoot-music-enabled', isPlaying.value.toString())
}

const updateVolume = () => {
  const audio = getCurrentAudio()
  if (audio) {
    audio.volume = volume.value / 100
  }
  // Save volume preference
  localStorage.setItem('bahoot-music-volume', volume.value.toString())
}

const handleMusicEnd = () => {
  // Music ended (shouldn't happen with loop, but just in case)
  console.log('Music track ended')
}

const handleMusicError = (error) => {
  console.warn('Music playback error:', error)
  isPlaying.value = false
}

// Watch for game state changes
watch(() => props.gameState, async (newState) => {
  if (isPlaying.value && newState !== currentTrack.value) {
    await playCurrentTrack()
  }
})

// Load saved preferences
onMounted(() => {
  // Load music preference
  const savedMusicPref = localStorage.getItem('bahoot-music-enabled')
  if (savedMusicPref !== null) {
    isPlaying.value = savedMusicPref === 'true'
  }
  
  // Load volume preference
  const savedVolume = localStorage.getItem('bahoot-music-volume')
  if (savedVolume !== null) {
    volume.value = parseInt(savedVolume)
  }
  
  // Set initial volumes
  [lobbyMusic, gameplayMusic, resultsMusic].forEach(audioRef => {
    if (audioRef.value) {
      audioRef.value.volume = volume.value / 100
    }
  })
})

// Cleanup
onUnmounted(() => {
  stopAllMusic()
})

// Expose controls for parent components
defineExpose({
  toggleMusic,
  stopAllMusic,
  isPlaying: readonly(isPlaying)
})
</script>

<style scoped>
.music-controls {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 10000;
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  padding: 12px 16px;
  border-radius: 25px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.5);
}

.music-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 50%;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 20px;
  color: white;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.music-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
}

.music-btn.active {
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%);
  box-shadow: 0 4px 15px rgba(255, 107, 107, 0.4);
}

.music-btn.active:hover {
  box-shadow: 0 6px 20px rgba(255, 107, 107, 0.6);
}

.volume-container {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 120px;
}

.volume-slider {
  flex: 1;
  height: 6px;
  border-radius: 3px;
  background: #e1e7f5;
  outline: none;
  -webkit-appearance: none;
  cursor: pointer;
}

.volume-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
}

.volume-slider::-moz-range-thumb {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  cursor: pointer;
  border: none;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
}

.volume-text {
  font-size: 12px;
  font-weight: 600;
  color: #667eea;
  min-width: 35px;
  text-align: center;
}

/* Mobile responsiveness */
@media (max-width: 768px) {
  .music-controls {
    top: 10px;
    right: 10px;
    padding: 8px 12px;
  }
  
  .music-btn {
    width: 40px;
    height: 40px;
    font-size: 16px;
  }
  
  .volume-container {
    min-width: 100px;
  }
  
  .volume-text {
    font-size: 10px;
    min-width: 30px;
  }
}

/* Hide on very small screens */
@media (max-width: 480px) {
  .volume-container {
    display: none;
  }
}

/* Respect motion preferences */
@media (prefers-reduced-motion: reduce) {
  .music-btn {
    transition: none;
  }
  
  .music-btn:hover {
    transform: none;
  }
}
</style>
