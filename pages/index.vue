<template>
  <div class="min-h-screen flex items-center justify-center p-4">
    <div class="max-w-md w-full space-y-8">
      <!-- Header -->
      <div class="text-center">
        <h1 class="text-6xl font-bold text-white mb-4">
          🎯 Bahoot
        </h1>
        <p class="text-xl text-white/90 mb-8">
          A farewell game for our dear friend Bahar 💕
        </p>
      </div>

      <!-- Main Card -->
      <div class="card space-y-6">
        <div class="text-center">
          <h2 class="text-2xl font-bold text-gray-800 mb-4">
            Welcome to Bahoot!
          </h2>
          <p class="text-gray-600">
            Choose how you want to play
          </p>
        </div>

        <!-- Action Buttons -->
        <div class="space-y-4">
          <button 
            @click="showCreateForm = true"
            class="btn-primary w-full"
          >
            🎮 Host a Game
          </button>
          
          <button 
            @click="showJoinForm = true"
            class="btn-secondary w-full"
          >
            👥 Join Game
          </button>
        </div>

        <!-- Create Game Form -->
        <div v-if="showCreateForm" class="space-y-4 pt-4 border-t">
          <h3 class="font-semibold text-gray-800">Create New Game</h3>
          <input
            v-model="hostName"
            type="text"
            placeholder="Your name"
            class="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
          <div class="flex items-center space-x-2">
            <label class="text-sm text-gray-600">Questions:</label>
            <select 
              v-model="questionCount" 
              class="p-2 border rounded focus:ring-2 focus:ring-purple-500"
            >
              <option value="3">3 Questions</option>
              <option value="5">5 Questions</option>
              <option value="8">All 8 Questions</option>
            </select>
          </div>
          <div class="flex space-x-2">
            <button 
              @click="createGame" 
              :disabled="!hostName || creating"
              class="btn-primary flex-1 disabled:opacity-50"
            >
              {{ creating ? '⏳ Creating...' : '🚀 Create Game' }}
            </button>
            <button 
              @click="showCreateForm = false"
              class="px-4 py-2 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
        </div>

        <!-- Join Game Form -->
        <div v-if="showJoinForm" class="space-y-4 pt-4 border-t">
          <h3 class="font-semibold text-gray-800">Join Existing Game</h3>
          <input
            v-model="roomCode"
            type="text"
            placeholder="Room Code (e.g. ABC123)"
            class="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent uppercase"
            @input="roomCode = roomCode.toUpperCase()"
          />
          <input
            v-model="playerName"
            type="text"
            placeholder="Your nickname"
            class="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
          <div class="flex space-x-2">
            <button 
              @click="joinGame" 
              :disabled="!roomCode || !playerName || joining"
              class="btn-primary flex-1 disabled:opacity-50"
            >
              {{ joining ? '⏳ Joining...' : '🎯 Join Game' }}
            </button>
            <button 
              @click="showJoinForm = false"
              class="px-4 py-2 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
        </div>

        <!-- Error Message -->
        <div v-if="error" class="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {{ error }}
        </div>
      </div>

      <!-- Footer -->
      <div class="text-center text-white/70 text-sm">
        Made with 💕 for Bahar's farewell
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { navigateTo } from 'nuxt/app'
import { useFirebase } from '../composables/useFirebase'

const { createRoom, joinRoom } = useFirebase()

// State
const showCreateForm = ref(false)
const showJoinForm = ref(false)
const hostName = ref('')
const questionCount = ref(5)
const roomCode = ref('')
const playerName = ref('')
const creating = ref(false)
const joining = ref(false)
const error = ref('')

// Methods
const createGame = async () => {
  if (!hostName.value) return
  
  creating.value = true
  error.value = ''
  
  try {
    const code = await createRoom(hostName.value, questionCount.value)
    await navigateTo(`/host/${code}`)
  } catch (err) {
    error.value = 'Failed to create game. Please try again.'
    console.error(err)
  } finally {
    creating.value = false
  }
}

const joinGame = async () => {
  if (!roomCode.value || !playerName.value) return
  
  joining.value = true
  error.value = ''
  
  try {
    const playerId = await joinRoom(roomCode.value, playerName.value)
    await navigateTo(`/play/${roomCode.value}?playerId=${playerId}`)
  } catch (err) {
    error.value = 'Failed to join game. Check the room code and try again.'
    console.error(err)
  } finally {
    joining.value = false
  }
}

// Reset forms when switching
watch(showCreateForm, (show) => {
  if (show) {
    showJoinForm.value = false
    error.value = ''
  }
})

watch(showJoinForm, (show) => {
  if (show) {
    showCreateForm.value = false
    error.value = ''
  }
})
</script>
