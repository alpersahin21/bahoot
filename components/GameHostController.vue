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
        <!-- Question Media -->
        <div class="mb-6">
          <QuestionMedia 
            :question="currentQuestion" 
            :show-media-info="true"
          />
        </div>

        <!-- Answer Options Preview -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
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
              <div class="w-6 h-6 bg-white/20 flex items-center justify-center mr-2 text-sm"
                   :class="{
                     'triangle-shape': index === 0,
                     'diamond-shape': index === 1,
                     'circle-shape rounded-full': index === 2,
                     'square-shape': index === 3
                   }">
                <span v-if="index === 0" class="triangle-icon text-sm">▲</span>
                <span v-else-if="index === 1" class="diamond-icon text-sm">♦</span>
                <span v-else-if="index === 2" class="circle-icon text-sm">●</span>
                <span v-else-if="index === 3" class="square-icon text-sm">■</span>
              </div>
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
            :style="{ width: `${(timeLeft / (currentQuestion?.timeLimit || 30)) * 100}%` }"
          ></div>
        </div>
      </div>

      <!-- Control Buttons -->
      <div class="flex space-x-3">
        <button 
          v-if="!gameState.showResults && timeLeft <= 0"
          @click="handleShowResults"
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
          v-if="timeLeft > 0 && !gameState.showResults"
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
    <div v-if="gameState.showResults" class="mt-6">
      <div class="card">
        <h3 class="text-xl font-bold text-gray-800 mb-4">📊 Question Results</h3>
        <div v-if="currentQuestion" class="text-center mb-4">
          <div class="text-lg text-green-600 font-semibold">
            ✅ Correct Answer: {{ currentQuestion.answers[currentQuestion.correct] }}
          </div>
        </div>
        <GameLeaderboard :players="players" />
      </div>
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
  'next-question': []
  'show-results': []
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



// Methods
const handleNextQuestion = () => {
  emit('next-question')
}

const handleShowResults = () => {
  stopTimer()
  emit('show-results')
}

const forceShowResults = () => {
  stopTimer()
  emit('show-results')
}

const startTimer = () => {
  if (!currentQuestion.value || !props.gameState.questionStartTime) return
  
  // Calculate how much time has already passed
  const elapsed = (Date.now() - props.gameState.questionStartTime) / 1000
  const totalTime = currentQuestion.value.timeLimit || 30
  timeLeft.value = Math.max(0, Math.ceil(totalTime - elapsed))
  
  if (timeLeft.value <= 0) {
    emit('show-results')
    return
  }
  
  timerInterval = setInterval(() => {
    if (!props.gameState.questionStartTime) return
    const elapsed = (Date.now() - props.gameState.questionStartTime) / 1000
    const remaining = Math.max(0, Math.ceil(totalTime - elapsed))
    timeLeft.value = remaining
    
    if (remaining <= 0) {
      clearInterval(timerInterval!)
      timerInterval = null
      // Auto show results when time is up
      if (!props.gameState.showResults) {
        emit('show-results')
      }
    }
  }, 100)
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
  if (!props.gameState.showResults && props.gameState.status === 'playing') {
    nextTick(() => startTimer())
  }
})

// Watch for game status changes
watch(() => props.gameState.status, (status) => {
  if (status === 'playing' && !props.gameState.showResults) {
    nextTick(() => startTimer())
  }
})

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
