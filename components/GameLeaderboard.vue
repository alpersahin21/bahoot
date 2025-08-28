<template>
  <div class="card">
    <div class="text-center mb-6">
      <h3 class="text-2xl font-bold text-gray-800 mb-2">
        {{ final ? '🏆 Final Results' : '📊 Current Leaderboard' }}
      </h3>
      <p class="text-gray-600">
        {{ final ? 'Thanks for playing Bahoot!' : 'Live standings' }}
      </p>
    </div>

    <div v-if="players.length === 0" class="text-center text-gray-500 py-8">
      No players yet
    </div>

    <div v-else class="space-y-3">
      <div 
        v-for="(player, index) in players" 
        :key="player.id"
        :class="[
          'flex items-center justify-between p-4 rounded-xl transition-all duration-300',
          getRankStyle(index)
        ]"
      >
        <!-- Rank and Player Info -->
        <div class="flex items-center space-x-4">
          <!-- Rank Badge -->
          <div :class="[
            'w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg',
            getRankBadgeStyle(index)
          ]">
            {{ getRankEmoji(index) }}
          </div>
          
          <!-- Player Details -->
          <div>
            <div class="font-bold text-lg text-gray-800">
              {{ player.nickname }}
            </div>
            <div v-if="player.responseTime && !final" class="text-sm text-gray-500">
              ⏱️ {{ player.responseTime.toFixed(1) }}s response
            </div>
          </div>
        </div>

        <!-- Score -->
        <div class="text-right">
          <div class="text-2xl font-bold text-purple-600">
            {{ player.score }}
          </div>
          <div class="text-sm text-gray-500">
            points
          </div>
        </div>
      </div>
    </div>

    <!-- Winner Celebration -->
    <div v-if="final && players.length > 0" class="mt-8 text-center">
      <div class="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl p-6 text-white">
        <div class="text-3xl mb-2">🎉</div>
        <div class="text-xl font-bold mb-1">
          Congratulations {{ players[0].nickname }}!
        </div>
        <div class="text-lg opacity-90">
          Winner of Bahoot for Bahar! 💕
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
}

const props = withDefaults(defineProps<Props>(), {
  final: false
})

// Methods
const getRankStyle = (index: number) => {
  switch (index) {
    case 0:
      return 'bg-gradient-to-r from-yellow-100 to-yellow-200 border-2 border-yellow-300'
    case 1:
      return 'bg-gradient-to-r from-gray-100 to-gray-200 border-2 border-gray-300'
    case 2:
      return 'bg-gradient-to-r from-orange-100 to-orange-200 border-2 border-orange-300'
    default:
      return 'bg-gray-50 border border-gray-200'
  }
}

const getRankBadgeStyle = (index: number) => {
  switch (index) {
    case 0:
      return 'bg-yellow-500 text-white'
    case 1:
      return 'bg-gray-400 text-white'
    case 2:
      return 'bg-orange-500 text-white'
    default:
      return 'bg-purple-500 text-white'
  }
}

const getRankEmoji = (index: number) => {
  switch (index) {
    case 0:
      return '🥇'
    case 1:
      return '🥈'
    case 2:
      return '🥉'
    default:
      return index + 1
  }
}
</script>
