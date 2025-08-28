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

    <!-- Game Statistics -->
    <div v-if="final" class="card">
      <h3 class="text-xl font-bold text-gray-800 mb-4">📈 Game Statistics</h3>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="text-center p-4 bg-purple-50 rounded-lg">
          <div class="text-2xl font-bold text-purple-600">{{ players.length }}</div>
          <div class="text-sm text-gray-600">Players</div>
        </div>
        <div class="text-center p-4 bg-blue-50 rounded-lg">
          <div class="text-2xl font-bold text-blue-600">{{ totalQuestions }}</div>
          <div class="text-sm text-gray-600">Questions</div>
        </div>
        <div class="text-center p-4 bg-green-50 rounded-lg">
          <div class="text-2xl font-bold text-green-600">{{ highestScore }}</div>
          <div class="text-sm text-gray-600">High Score</div>
        </div>
        <div class="text-center p-4 bg-pink-50 rounded-lg">
          <div class="text-2xl font-bold text-pink-600">{{ averageScore }}</div>
          <div class="text-sm text-gray-600">Avg Score</div>
        </div>
      </div>
    </div>

    <!-- Share Results -->
    <div v-if="final" class="card text-center">
      <h3 class="text-xl font-bold text-gray-800 mb-4">📱 Share Your Results</h3>
      <p class="text-gray-600 mb-4">
        Share your Bahoot experience with friends!
      </p>
      <div class="flex justify-center space-x-3">
        <button 
          @click="shareResults"
          class="btn-secondary"
        >
          📤 Share Results
        </button>
        <button 
          @click="downloadResults"
          class="bg-green-500 text-white px-6 py-3 rounded-xl hover:bg-green-400 transition-colors"
        >
          💾 Download
        </button>
      </div>
    </div>

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
  return props.players.length > 0 ? Math.max(...props.players.map(p => p.score)) : 0
})

const averageScore = computed(() => {
  if (props.players.length === 0) return 0
  const total = props.players.reduce((sum, p) => sum + p.score, 0)
  return Math.round(total / props.players.length)
})

// Methods
const shareResults = async () => {
  const winner = props.players[0]
  const text = `🎯 Just played Bahoot for Bahar! 💕\n\n🏆 Winner: ${winner?.nickname} with ${winner?.score} points!\n\nWhat a fun farewell game! 🎉`
  
  if (navigator.share) {
    try {
      await navigator.share({
        title: 'Bahoot Results',
        text,
        url: window.location.origin
      })
    } catch (err) {
      console.log('Share cancelled')
    }
  } else {
    // Fallback to clipboard
    try {
      await navigator.clipboard.writeText(text)
      alert('Results copied to clipboard!')
    } catch (err) {
      console.error('Failed to copy results')
    }
  }
}

const downloadResults = () => {
  const winner = props.players[0]
  const results = `
BAHOOT RESULTS - A Farewell Game for Bahar 💕
===============================================

🏆 WINNER: ${winner?.nickname} - ${winner?.score} points

📊 FINAL LEADERBOARD:
${props.players.map((p, i) => `${i + 1}. ${p.nickname} - ${p.score} points`).join('\n')}

📈 GAME STATS:
- Total Players: ${props.players.length}
- Total Questions: ${props.totalQuestions}
- Highest Score: ${highestScore.value}
- Average Score: ${averageScore.value}

💕 Thank you for making Bahar's farewell special!

Generated at: ${new Date().toLocaleString()}
  `.trim()

  const blob = new Blob([results], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `bahoot-results-${new Date().toISOString().split('T')[0]}.txt`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
</script>
