<template>
  <div class="min-h-screen p-4">
    <div class="max-w-2xl mx-auto">
      <!-- Header -->
      <div class="bg-white rounded-2xl shadow-xl p-4 mb-6">
        <div class="flex justify-between items-center">
          <div>
            <h1 class="text-2xl font-bold text-gray-800">🎯 Bahoot</h1>
            <p class="text-sm text-gray-600">Room: {{ roomCode }}</p>
          </div>
          <div class="text-right" v-if="currentPlayer">
            <div class="text-sm text-gray-500">{{ currentPlayer.nickname }}</div>
            <div class="text-xl font-bold text-purple-600">{{ currentPlayer.score }} pts</div>
          </div>
        </div>
      </div>

      <!-- Connection Status -->
      <div v-if="!gameRoom.isConnected" class="card text-center">
        <div class="text-gray-500">
          ⏳ Connecting to game...
        </div>
      </div>

      <!-- Game not found -->
      <div v-else-if="!gameState" class="card text-center">
        <div class="text-red-500 mb-4">
          ❌ Game room not found
        </div>
        <button 
          @click="navigateTo('/')"
          class="btn-primary"
        >
          🏠 Back to Home
        </button>
      </div>

      <!-- Waiting for game to start -->
      <div v-else-if="gameState.status === 'waiting'" class="card text-center">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">
          🎮 Waiting for Game to Start
        </h2>
        <p class="text-gray-600 mb-6">
          The host will start the game soon!
        </p>
        <div class="bg-purple-50 rounded-xl p-4">
          <div class="text-lg font-semibold text-purple-700 mb-2">
            Players in Room: {{ playersCount }}
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
      </div>

      <!-- Game Playing -->
      <div v-else-if="gameState.status === 'playing'" class="space-y-6">
        <!-- Current Question -->
        <div v-if="currentQuestion" class="card">
          <!-- Question Counter -->
          <div class="text-center mb-4">
            <div class="text-sm text-gray-500">
              Question {{ gameState.currentQuestion + 1 }} of {{ gameState.questionCount }}
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div 
                class="bg-purple-600 h-2 rounded-full transition-all duration-300"
                :style="{ width: `${((gameState.currentQuestion + 1) / gameState.questionCount) * 100}%` }"
              ></div>
            </div>
          </div>

          <!-- Question Background Image -->
          <div 
            class="w-full h-40 bg-gradient-to-br from-purple-400 to-pink-400 rounded-xl mb-6 flex items-center justify-center text-white"
            :style="backgroundImageStyle"
          >
            <div class="text-center p-4 bg-black/30 rounded-lg backdrop-blur-sm">
              <h2 class="text-xl font-bold">{{ currentQuestion.text }}</h2>
            </div>
          </div>

          <!-- Timer -->
          <div v-if="timeLeft > 0 && !currentPlayer?.hasAnswered" class="text-center mb-6">
            <div class="text-2xl font-bold text-gray-800 mb-2">⏰ {{ timeLeft }}s</div>
            <div class="w-full bg-gray-200 rounded-full h-3">
              <div 
                class="bg-gradient-to-r from-green-500 to-yellow-500 to-red-500 h-3 rounded-full transition-all duration-1000"
                :style="{ width: `${(timeLeft / (currentQuestion.timeLimit || 20)) * 100}%` }"
              ></div>
            </div>
          </div>

          <!-- Answer Status -->
          <div v-if="currentPlayer?.hasAnswered" class="text-center mb-6">
            <div v-if="currentPlayer.isCorrect === true" class="text-green-600 font-bold text-xl mb-2">
              ✅ Correct! +{{ currentPlayer.questionPoints }} points
            </div>
            <div v-else-if="currentPlayer.isCorrect === false" class="text-red-600 font-bold text-xl mb-2">
              ❌ Incorrect! 0 points
            </div>
            <div v-else class="text-blue-600 font-bold text-xl mb-2">
              📤 Answer Submitted!
            </div>
            <div class="text-gray-600">
              Waiting for other players...
            </div>
          </div>

          <!-- Answer Options -->
          <div v-else-if="timeLeft > 0" class="grid grid-cols-1 gap-3">
            <button
              v-for="(answer, index) in currentQuestion.answers"
              :key="index"
              @click="submitAnswer(index)"
              :class="[
                'answer-btn',
                index === 0 ? 'answer-red' : '',
                index === 1 ? 'answer-blue' : '',
                index === 2 ? 'answer-yellow' : '',
                index === 3 ? 'answer-green' : ''
              ]"
            >
              <div class="flex items-center">
                <div class="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mr-3 font-bold">
                  {{ index + 1 }}
                </div>
                {{ answer }}
              </div>
            </button>
          </div>

          <!-- Time's Up -->
          <div v-else class="text-center text-red-600 font-bold">
            ⏰ Time's Up!
          </div>
        </div>

        <!-- Show Results -->
        <div v-if="gameState.showResults && currentQuestion" class="card">
          <div class="text-center mb-6">
            <h3 class="text-xl font-bold text-gray-800 mb-2">📊 Question Results</h3>
            <div class="text-lg text-green-600 font-semibold">
              ✅ Correct Answer: {{ currentQuestion.answers[currentQuestion.correct] }}
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
            🎉 Game Complete!
          </h2>
          <p class="text-lg text-gray-600 mb-6">
            Thanks for playing Bahoot for Bahar! 💕
          </p>
        </div>

        <!-- Final Results -->
        <GameLeaderboard :players="players" :final="true" />

        <div class="card text-center">
          <button 
            @click="navigateTo('/')"
            class="btn-primary"
          >
            🏠 Play Again
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

const backgroundImageStyle = computed(() => {
  if (!currentQuestion.value?.photo) return {}
  
  // For now, use a placeholder gradient
  // In production, you'd load the actual photo from assets
  return {
    backgroundImage: `url('/assets/photos/${currentQuestion.value.photo}'), linear-gradient(135deg, #667eea 0%, #764ba2 100%)`,
    backgroundSize: 'cover',
    backgroundPosition: 'center'
  }
})

// Methods
const submitAnswer = async (answerIndex: number) => {
  if (!currentPlayer.value || currentPlayer.value.hasAnswered) return
  
  await gameRoom.playerAnswer(playerId, answerIndex)
}

const startTimer = () => {
  if (!currentQuestion.value) return
  
  timeLeft.value = currentQuestion.value.timeLimit || 20
  
  timerInterval = setInterval(() => {
    timeLeft.value--
    if (timeLeft.value <= 0) {
      clearInterval(timerInterval!)
      timerInterval = null
    }
  }, 1000)
}

const stopTimer = () => {
  if (timerInterval) {
    clearInterval(timerInterval)
    timerInterval = null
  }
}

// Watch for game state changes
watch(() => gameState.value?.currentQuestion, () => {
  stopTimer()
  if (gameState.value?.status === 'playing' && !gameState.value?.showResults) {
    nextTick(() => startTimer())
  }
}, { immediate: true })

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
