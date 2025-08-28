<template>
  <div class="min-h-screen p-4">
    <div class="max-w-4xl mx-auto">
      <!-- Header -->
      <div class="bg-white rounded-2xl shadow-xl p-6 mb-6">
        <div class="flex justify-between items-center">
          <div>
            <h1 class="text-3xl font-bold text-gray-800">🎯 Bahoot Host</h1>
            <p class="text-gray-600">Room Code: <span class="font-mono text-2xl font-bold text-purple-600">{{ roomCode }}</span></p>
          </div>
          <div class="text-right">
            <div class="text-sm text-gray-500">Players Online</div>
            <div class="text-3xl font-bold text-green-600">{{ playersCount }}</div>
          </div>
        </div>
      </div>

      <!-- Game Status -->
      <div v-if="!gameRoom.isConnected" class="card text-center">
        <div class="text-gray-500">
          ⏳ Connecting to game room...
        </div>
      </div>

      <!-- Waiting for Players -->
      <div v-else-if="gameState?.status === 'waiting'" class="space-y-6">
        <div class="card">
          <div class="text-center mb-6">
            <h2 class="text-2xl font-bold text-gray-800 mb-2">Waiting for Players</h2>
            <p class="text-gray-600">Share the room code with players to join!</p>
          </div>
          
          <div class="bg-purple-50 rounded-xl p-6 text-center mb-6">
            <div class="text-lg text-purple-600 font-semibold mb-2">Room Code</div>
            <div class="text-5xl font-bold text-purple-700 font-mono tracking-wider mb-4">
              {{ roomCode }}
            </div>
            <button 
              @click="copyRoomCode"
              class="btn-secondary"
            >
              {{ copied ? '✅ Copied!' : '📋 Copy Code' }}
            </button>
          </div>

          <button 
            @click="startGame"
            :disabled="playersCount === 0"
            class="btn-primary w-full disabled:opacity-50"
          >
            🚀 Start Game ({{ playersCount }} players)
          </button>
        </div>

        <!-- Players List -->
        <div class="card">
          <h3 class="text-xl font-bold text-gray-800 mb-4">👥 Players Joined</h3>
          <div v-if="playersCount === 0" class="text-center text-gray-500 py-8">
            No players yet. Share the room code!
          </div>
          <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div 
              v-for="player in players" 
              :key="player.id"
              class="bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-3 flex items-center"
            >
              <div class="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold mr-3">
                {{ player.nickname.charAt(0).toUpperCase() }}
              </div>
              <div>
                <div class="font-semibold text-gray-800">{{ player.nickname }}</div>
                <div class="text-sm text-gray-500">Joined {{ formatTime(player.joinedAt) }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Game Playing -->
      <div v-else-if="gameState?.status === 'playing'" class="space-y-6">
        <GameHostController
          :room-code="roomCode"
          :game-state="gameState"
          @next-question="handleNextQuestion"
          @show-results="handleShowResults"
        />
      </div>

      <!-- Game Finished -->
      <div v-else-if="gameState?.status === 'finished'" class="space-y-6">
        <GameResults
          :players="players"
          :final="true"
        />
        
        <div class="card text-center">
          <h2 class="text-2xl font-bold text-gray-800 mb-4">🎉 Game Complete!</h2>
          <p class="text-gray-600 mb-6">Thanks for playing Bahoot!</p>
          <button 
            @click="navigateTo('/')"
            class="btn-primary"
          >
            🏠 Back to Home
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { questions, getRandomQuestions } from '~/data/questions'

const route = useRoute()
const roomCode = route.params.roomCode as string

// Game room management
const gameRoom = useGameRoom(roomCode)
const { gameState } = gameRoom

// State
const copied = ref(false)

// Computed
const playersCount = computed(() => gameRoom.getPlayersCount.value)
const players = computed(() => gameRoom.getLeaderboard.value)

// Methods
const copyRoomCode = async () => {
  try {
    await navigator.clipboard.writeText(roomCode)
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  } catch (err) {
    console.error('Failed to copy room code:', err)
  }
}

const startGame = async () => {
  const gameQuestions = getRandomQuestions(gameState.value?.questionCount || 5)
  await gameRoom.startGame(gameQuestions)
}

const handleNextQuestion = () => {
  gameRoom.nextQuestion()
}

const handleShowResults = () => {
  gameRoom.showQuestionResults()
}

const formatTime = (timestamp: number) => {
  return new Date(timestamp).toLocaleTimeString()
}

// Lifecycle
onMounted(() => {
  gameRoom.connect()
})

onUnmounted(() => {
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
