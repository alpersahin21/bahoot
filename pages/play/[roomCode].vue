<template>
  <div class="min-h-screen p-4">
    <div class="max-w-2xl mx-auto">
      <!-- Header -->
      <div class="bg-white rounded-2xl shadow-xl p-3 mb-4">
        <div class="flex justify-between items-center">
          <div>
            <div>
              <BahootLogo size="small" :animated="false" variant="purple" />
            </div>
            <p class="text-sm text-gray-600">Oda: {{ roomCode }}</p>
          </div>
          <div class="text-right" v-if="currentPlayer">
            <div class="text-sm text-gray-500">{{ currentPlayer.nickname }}</div>
            <div class="text-xl font-bold text-purple-600">Skor: {{ currentPlayer.score }}</div>
          </div>
        </div>
      </div>

      <!-- Connection Status -->
      <div v-if="!gameRoom.isConnected" class="card text-center">
        <div class="text-gray-500">
          ⏳ Oyuna bağlanılıyor...
        </div>
      </div>

      <!-- Game not found -->
      <div v-else-if="!gameState" class="card text-center">
        <div class="text-red-500 mb-4">
          ❌ Oyun odası bulunamadı
        </div>
        <button 
          @click="navigateTo('/')"
          class="btn-primary"
        >
          🏠 Ana Sayfaya Dön
        </button>
      </div>

      <!-- Waiting for game to start -->
      <div v-else-if="gameState.status === 'waiting'" class="card text-center">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">
          🎮 Oyunun başlaması bekleniyor...
        </h2>
        <p class="text-gray-600 mb-6">
          HADİ ABİ İNSANLAR GELSİN DE BAŞLAYALIM LETS GOOOO 🔥🔥🔥
        </p>
        <div class="bg-purple-50 rounded-xl p-4">
          <div class="text-lg font-semibold text-purple-700 mb-2">
            Baharın en yakın arkadaşları: {{ playersCount }}
          </div>
          <div class="flex flex-wrap justify-center gap-2">
            <span 
              v-for="player in players" 
              :key="player.id"
              class="bg-purple-200 text-purple-800 px-3 py-1 rounded-full text-sm"
            >
              {{ player.nickname }}
            </span>
          </div>
        </div>

        <!-- Waiting Photos -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
          <div class="flex justify-center">
            <img 
              src="/assets/photos/waiting-photo1.jpeg" 
              alt="Bahar Photo 1" 
              class="w-48 h-48 sm:w-40 sm:h-40 md:w-48 md:h-48 rounded-xl photo-display border-2 border-white/20"
              loading="lazy"
            />
          </div>
          <div class="flex justify-center">
            <img 
              src="/assets/photos/waiting-photo2.jpeg" 
              alt="Bahar Photo 2" 
              class="w-48 h-48 sm:w-40 sm:h-40 md:w-48 md:h-48 rounded-xl photo-display border-2 border-white/20"
              loading="lazy"
            />
          </div>
        </div>
      </div>

      <!-- Game Playing -->
      <div v-else-if="gameState.status === 'playing'" class="space-y-4">
        <!-- Current Question -->
        <div v-if="currentQuestion" class="card">
          <!-- Question Counter -->
          <div class="text-center mb-3 pt-2">
            <div class="text-sm text-gray-500">
              Soru {{ gameState.currentQuestion + 1 }} / {{ gameState.questionCount }}
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div 
                class="bg-purple-600 h-2 rounded-full transition-all duration-300"
                :style="{ width: `${((gameState.currentQuestion + 1) / gameState.questionCount) * 100}%` }"
              ></div>
            </div>
          </div>

          <!-- Question Text -->
          <div class="text-center mb-4">
            <h2 class="text-xl md:text-2xl font-bold text-gray-800 px-4">
              {{ currentQuestion.text }}
            </h2>
          </div>

          <!-- Question Media -->
          <div class="mb-4">
            <QuestionMedia :question="currentQuestion" :hide-question-text="true" />
          </div>

          <!-- Timer -->
          <div v-if="timeLeft > 0 && !currentPlayer?.hasAnswered" class="text-center mb-4">
            <div class="text-2xl font-bold text-gray-800 mb-2">⏰ {{ timeLeft }}s</div>
            <div class="w-full bg-gray-200 rounded-full h-3">
              <div 
                class="bg-gradient-to-r from-green-500 to-yellow-500 to-red-500 h-3 rounded-full transition-all duration-1000"
                :style="{ width: `${(timeLeft / (currentQuestion.timeLimit || 30)) * 100}%` }"
              ></div>
            </div>
          </div>

          <!-- Answer Status -->
          <div v-if="currentPlayer?.hasAnswered" class="text-center mb-4">
            <div v-if="currentPlayer.isCorrect === true" class="text-green-600 font-bold text-xl mb-2">
              ✅ Doğru! +{{ currentPlayer.questionPoints }} puan
            </div>
            <div v-else-if="currentPlayer.isCorrect === false" class="text-red-600 font-bold text-xl mb-2">
              ❌ Yanlış! 0 puan
            </div>
            <div v-else class="text-blue-600 font-bold text-xl mb-2">
              📤 Cevap Gönderildi!
            </div>
            <div class="text-gray-600">
              Diğer oyuncular bekleniyor...
            </div>
          </div>

          <!-- Answer Options -->
          <div v-else-if="timeLeft > 0" class="grid grid-cols-2 gap-3">
            <button
              v-for="(answer, index) in currentQuestion.answers"
              :key="index"
              @click="submitAnswer(index)"
              :class="[
                'answer-btn text-center',
                index === 0 ? 'answer-red' : '',
                index === 1 ? 'answer-blue' : '',
                index === 2 ? 'answer-yellow' : '',
                index === 3 ? 'answer-green' : ''
              ]"
            >
              <div class="flex flex-col items-center justify-center p-2">
                <div class="w-8 h-8 bg-white/20 flex items-center justify-center mb-2 font-bold text-lg"
                     :class="{
                       'triangle-shape': index === 0,
                       'diamond-shape': index === 1,
                       'circle-shape rounded-full': index === 2,
                       'square-shape': index === 3
                     }">
                  <span v-if="index === 0" class="triangle-icon">▲</span>
                  <span v-else-if="index === 1" class="diamond-icon">♦</span>
                  <span v-else-if="index === 2" class="circle-icon">●</span>
                  <span v-else-if="index === 3" class="square-icon">■</span>
                </div>
                <span class="text-sm md:text-base leading-tight">{{ answer }}</span>
              </div>
            </button>
          </div>

          <!-- Time's Up -->
          <div v-else class="text-center text-red-600 font-bold">
            ⏰ Süre Doldu!
          </div>
        </div>

        <!-- Show Results -->
        <div v-if="gameState.showResults && currentQuestion" class="card">
          <div class="text-center mb-6">
            <h3 class="text-xl font-bold text-gray-800 mb-2"> Soru Sonuçları</h3>
            <div class="text-lg text-green-600 font-semibold">
              ✅ Doğru Cevap: {{ currentQuestion.answers[currentQuestion.correct] }}
            </div>
          </div>
          
          <!-- Current Leaderboard -->
          <GameLeaderboard :players="players" />
        </div>
      </div>

      <!-- Game Finished -->
      <div v-else-if="gameState.status === 'finished'" class="space-y-6">
        <div class="card text-center">
          <h2 class="text-3xl font-bold text-gray-800 mb-4">
            🎉 Oyun Tamamlandı!
          </h2>
          <p class="text-lg text-gray-600 mb-6">
            Bahar için Bahoot oynadığınız için teşekkürler! 💕
          </p>
          
          <!-- End Game Photo -->
          <div class="flex justify-center mb-6">
            <img 
              src="/assets/photos/endgame-photo.jpeg" 
              alt="Bahar Endgame Photo" 
              class="w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 rounded-xl photo-display border-2 border-purple-200/50"
              loading="lazy"
            />
          </div>
        </div>

        <!-- Final Results -->
        <GameLeaderboard :players="players" :final="true" />

        <!-- Back to Home Button -->
        <div class="text-center">
          <button 
            @click="navigateTo('/')"
            class="btn-primary"
          >
            🏠 Ana Sayfaya Dön
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { useRoute, navigateTo, createError } from 'nuxt/app'
import { questions } from '../../data/questions'
import { useGameRoom } from '../../composables/useGameRoom'

const route = useRoute()
const roomCode = route.params.roomCode as string
const playerId = route.query.playerId as string

// Game room management
const gameRoom = useGameRoom(roomCode)
const { gameState } = gameRoom

// State
const timeLeft = ref(0)
let timerInterval: NodeJS.Timeout | null = null

// Computed
const playersCount = computed(() => gameRoom.getPlayersCount.value)
const players = computed(() => gameRoom.getLeaderboard.value)

const currentPlayer = computed(() => {
  if (!gameState.value?.players || !playerId) return null
  return gameState.value.players[playerId]
})

const currentQuestion = computed(() => {
  if (!gameState.value?.questions) return null
  return gameState.value.questions[gameState.value.currentQuestion]
})



// Methods
const submitAnswer = async (answerIndex: number) => {
  if (!currentPlayer.value || currentPlayer.value.hasAnswered) return
  
  await gameRoom.playerAnswer(playerId, answerIndex)
}

const startTimer = () => {
  if (!currentQuestion.value || !gameState.value?.questionStartTime) return
  
  // Calculate how much time has already passed since question started
  const elapsed = (Date.now() - gameState.value.questionStartTime) / 1000
  const totalTime = currentQuestion.value.timeLimit || 30
  timeLeft.value = Math.max(0, Math.ceil(totalTime - elapsed))
  
  if (timeLeft.value <= 0) return
  
  timerInterval = setInterval(() => {
    if (!gameState.value?.questionStartTime) return
    const elapsed = (Date.now() - gameState.value.questionStartTime) / 1000
    const remaining = Math.max(0, Math.ceil(totalTime - elapsed))
    timeLeft.value = remaining
    
    if (remaining <= 0) {
      clearInterval(timerInterval!)
      timerInterval = null
    }
  }, 100)
}

const stopTimer = () => {
  if (timerInterval) {
    clearInterval(timerInterval)
    timerInterval = null
  }
}

// Watch for game state changes - DON'T change music on showResults
// Only change music when game status actually changes to avoid
// switching to results music during intermediate round results
watch(gameState, (newState) => {
  if (process.client && (window as any).updateMusicState) {
    (window as any).updateMusicState(newState)
  }
}, { deep: true })

watch(() => gameState.value?.currentQuestion, () => {
  stopTimer()
  if (gameState.value?.status === 'playing' && !gameState.value?.showResults && gameState.value?.questionStartTime) {
    nextTick(() => startTimer())
  }
})

// Watch for question start time to sync timer
watch(() => gameState.value?.questionStartTime, (startTime) => {
  if (startTime && gameState.value?.status === 'playing' && !gameState.value?.showResults) {
    stopTimer()
    nextTick(() => startTimer())
  }
})

watch(() => gameState.value?.showResults, (showResults) => {
  if (showResults) {
    stopTimer()
  }
})

// Lifecycle
onMounted(() => {
  if (!playerId) {
    navigateTo('/')
    return
  }
  
  gameRoom.connect()
})

onUnmounted(() => {
  stopTimer()
  gameRoom.disconnect()
})

// Redirect if no room code
if (!roomCode) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Room not found'
  })
}
</script>
