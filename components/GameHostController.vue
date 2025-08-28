<template>
  <div class="space-y-6">
    <!-- Current Question Display -->
    <div class="card">
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

      <!-- Question Content -->
      <div v-if="currentQuestion" class="text-center">
        <!-- Question Background -->
        <div 
          class="w-full h-48 bg-gradient-to-br from-purple-400 to-pink-400 rounded-xl mb-6 flex items-center justify-center text-white relative overflow-hidden"
          :style="backgroundImageStyle"
        >
          <div class="absolute inset-0 bg-black/40"></div>
          <div class="relative z-10 text-center p-6">
            <h2 class="text-2xl font-bold mb-4">{{ currentQuestion.text }}</h2>
            <div class="text-sm opacity-90">
              Photo: {{ currentQuestion.photo }}
            </div>
          </div>
        </div>

        <!-- Answer Options Preview -->
        <div class="grid grid-cols-2 gap-3 mb-6">
          <div 
            v-for="(answer, index) in currentQuestion.answers"
            :key="index"
            :class="[
              'p-3 rounded-lg font-semibold text-white',
              index === 0 ? 'bg-red-500' : '',
              index === 1 ? 'bg-blue-500' : '',
              index === 2 ? 'bg-yellow-500' : '',
              index === 3 ? 'bg-green-500' : ''
            ]"
          >
            <div class="flex items-center justify-center">
              <span class="mr-2">{{ index + 1 }}.</span>
              {{ answer }}
            </div>
          </div>
        </div>

        <!-- Correct Answer Indicator -->
        <div class="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
          <div class="text-sm text-green-600 font-semibold">
            ✅ Correct Answer: {{ currentQuestion.answers[currentQuestion.correct] }}
          </div>
        </div>
      </div>
    </div>

    <!-- Game Controls -->
    <div class="card">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-xl font-bold text-gray-800">🎮 Game Controls</h3>
        <div class="text-sm text-gray-600">
          {{ answeredCount }} / {{ playersCount }} answered
        </div>
      </div>

      <!-- Timer Display -->
      <div v-if="timeLeft > 0" class="text-center mb-6">
        <div class="text-3xl font-bold text-gray-800 mb-2">⏰ {{ timeLeft }}s</div>
        <div class="w-full bg-gray-200 rounded-full h-4">
          <div 
            class="bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 h-4 rounded-full transition-all duration-1000"
            :style="{ width: `${(timeLeft / (currentQuestion?.timeLimit || 20)) * 100}%` }"
          ></div>
        </div>
      </div>

      <!-- Control Buttons -->
      <div class="flex space-x-3">
        <button 
          v-if="!gameState.showResults && timeLeft <= 0"
          @click="$emit('showResults')"
          class="btn-secondary flex-1"
        >
          📊 Show Results
        </button>
        
        <button 
          v-if="gameState.showResults"
          @click="handleNextQuestion"
          class="btn-primary flex-1"
        >
          {{ isLastQuestion ? '🏁 Finish Game' : '➡️ Next Question' }}
        </button>
        
        <button 
          v-if="timeLeft > 0"
          @click="forceShowResults"
          class="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-400 transition-colors"
        >
          ⏭️ Skip Timer
        </button>
      </div>
    </div>

    <!-- Live Player Status -->
    <div class="card">
      <h3 class="text-xl font-bold text-gray-800 mb-4">👥 Player Status</h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div 
          v-for="player in players" 
          :key="player.id"
          :class="[
            'rounded-lg p-3 border-2 transition-all duration-300',
            player.hasAnswered 
              ? 'bg-green-50 border-green-200' 
              : 'bg-gray-50 border-gray-200'
          ]"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <div :class="[
                'w-3 h-3 rounded-full mr-3',
                player.hasAnswered ? 'bg-green-500' : 'bg-gray-400'
              ]"></div>
              <span class="font-semibold">{{ player.nickname }}</span>
            </div>
            <div class="text-sm font-bold text-purple-600">
              {{ player.score }} pts
            </div>
          </div>
          <div v-if="player.hasAnswered" class="text-xs mt-1 flex items-center justify-between">
            <span v-if="player.responseTime" class="text-gray-500">
              ⏱️ {{ player.responseTime.toFixed(1) }}s
            </span>
            <span v-if="player.isCorrect === true" class="text-green-600 font-semibold">
              ✅ +{{ player.questionPoints }}
            </span>
            <span v-else-if="player.isCorrect === false" class="text-red-600 font-semibold">
              ❌ 0pts
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Show Question Results -->
    <div v-if="gameState.showResults">
      <GameLeaderboard :players="players" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onUnmounted } from 'vue'
import type { GameState } from '../composables/useGameRoom'

interface Props {
  roomCode: string
  gameState: GameState
}

const props = defineProps<Props>()
const emit = defineEmits<{
  nextQuestion: []
  showResults: []
}>()

// State
const timeLeft = ref(0)
let timerInterval: NodeJS.Timeout | null = null

// Computed
const currentQuestion = computed(() => {
  if (!props.gameState?.questions) return null
  return props.gameState.questions[props.gameState.currentQuestion]
})

const players = computed(() => {
  if (!props.gameState?.players) return []
  return Object.entries(props.gameState.players)
    .map(([id, player]) => ({ id, ...player }))
    .sort((a, b) => b.score - a.score)
})

const playersCount = computed(() => players.value.length)

const answeredCount = computed(() => {
  return players.value.filter(p => p.hasAnswered).length
})

const isLastQuestion = computed(() => {
  return props.gameState.currentQuestion >= props.gameState.questionCount - 1
})

const backgroundImageStyle = computed(() => {
  if (!currentQuestion.value?.photo) return {}
  
  return {
    backgroundImage: `url('/assets/photos/${currentQuestion.value.photo}'), linear-gradient(135deg, #667eea 0%, #764ba2 100%)`,
    backgroundSize: 'cover',
    backgroundPosition: 'center'
  }
})

// Methods
const handleNextQuestion = () => {
  emit('nextQuestion')
}

const forceShowResults = () => {
  stopTimer()
  emit('showResults')
}

const startTimer = () => {
  if (!currentQuestion.value) return
  
  timeLeft.value = currentQuestion.value.timeLimit || 20
  
  timerInterval = setInterval(() => {
    timeLeft.value--
    if (timeLeft.value <= 0) {
      clearInterval(timerInterval!)
      timerInterval = null
      // Auto show results when time is up
      if (!props.gameState.showResults) {
        emit('showResults')
      }
    }
  }, 1000)
}

const stopTimer = () => {
  if (timerInterval) {
    clearInterval(timerInterval)
    timerInterval = null
  }
}

// Watch for question changes
watch(() => props.gameState.currentQuestion, () => {
  stopTimer()
  if (!props.gameState.showResults) {
    nextTick(() => startTimer())
  }
}, { immediate: true })

watch(() => props.gameState.showResults, (showResults) => {
  if (showResults) {
    stopTimer()
  }
})

// Lifecycle
onUnmounted(() => {
  stopTimer()
})
</script>
