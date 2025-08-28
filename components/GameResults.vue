<template>
  <div class="space-y-6">
    <!-- Final Celebration -->
    <div v-if="final" class="card text-center">
      <div class="text-6xl mb-4">🎉</div>
      <h2 class="text-3xl font-bold text-gray-800 mb-4">
        Game Complete!
      </h2>
      <p class="text-lg text-gray-600 mb-6">
        What an amazing game for Bahar! 💕
      </p>
      
      <!-- Confetti Animation -->
      <div class="relative">
        <div class="text-8xl animate-bounce">🎊</div>
      </div>
    </div>

    <!-- Leaderboard -->
    <GameLeaderboard :players="players" :final="final" />



    <!-- Thank You Message -->
    <div v-if="final" class="card bg-gradient-to-r from-pink-50 to-purple-50 border-2 border-pink-200">
      <div class="text-center">
        <h3 class="text-2xl font-bold text-gray-800 mb-4">
          💕 Thank You for Playing!
        </h3>
        <div class="max-w-md mx-auto text-gray-700 leading-relaxed">
          <p class="mb-4">
            This special game was created to celebrate our wonderful friend Bahar. 
            Your participation made this farewell even more memorable!
          </p>
          <p class="font-semibold text-pink-600">
            Bahar, we'll miss you so much! Safe travels and stay amazing! 🌟
          </p>
        </div>
        
        <!-- Signature -->
        <div class="mt-6 pt-4 border-t border-pink-200 text-sm text-gray-500">
          Made with 💕 by friends who care
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Player {
  id: string
  nickname: string
  score: number
  hasAnswered?: boolean
  responseTime?: number
}

interface Props {
  players: Player[]
  final?: boolean
  totalQuestions?: number
}

const props = withDefaults(defineProps<Props>(), {
  final: false,
  totalQuestions: 0
})

// Computed
const highestScore = computed(() => {
  if (props.players.length === 0) return 0
  const scores = props.players.map(p => p.score || 0).filter(score => !isNaN(score))
  return scores.length > 0 ? Math.max(...scores) : 0
})

const averageScore = computed(() => {
  if (props.players.length === 0) return 0
  const scores = props.players.map(p => p.score || 0).filter(score => !isNaN(score))
  if (scores.length === 0) return 0
  const total = scores.reduce((sum, score) => sum + score, 0)
  return Math.round(total / scores.length)
})

</script>
