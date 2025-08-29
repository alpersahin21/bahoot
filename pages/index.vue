<template>
  <div class="min-h-screen flex items-center justify-center p-4">
    <div class="max-w-md w-full space-y-8">
      <!-- Header -->
      <div class="text-center">
        <!-- Homepage Photo -->
        <div class="mb-4 flex justify-center">
          <img 
            src="/assets/photos/homepage-photo.jpeg" 
            alt="Bahar" 
            class="w-56 h-56 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-full photo-display border-2 border-white/20"
            loading="lazy"
          />
        </div>
        
        <!-- Title -->
        <div class="mb-4">
          <BahootLogo size="large" />
        </div>
        <p class="text-lg sm:text-xl text-white/90 mb-6 sm:mb-8 text-center px-2">
          BAHARI NE KADAR TANIYORSUN??? 🤔😂🎉
        </p>
      </div>

      <!-- Main Card -->
      <div class="card space-y-6">


        <!-- Action Buttons -->
        <div class="space-y-4">
          <button 
            @click="showCreateForm = true"
            class="btn-primary w-full"
          >
            🎮 Oyun Başlat
          </button>
          
          <button 
            @click="showJoinForm = true"
            class="btn-secondary w-full"
          >
            👥 Oyuna Katıl
          </button>
        </div>

        <!-- Create Game Form -->
        <div v-if="showCreateForm" class="space-y-4 pt-4 border-t">
          <h3 class="font-semibold text-gray-800">Yeni Oyun Oluştur</h3>
          <input
            v-model="hostName"
            type="text"
            placeholder="Adınız"
            class="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
          <div class="flex items-center space-x-2">
            <label class="text-sm text-gray-600">Soru Sayısı:</label>
            <select 
              v-model="questionCount" 
              class="p-2 border rounded focus:ring-2 focus:ring-purple-500"
            >
              <option value="3">3 Soru</option>
              <option value="5">5 Soru</option>
              <option value="10">10 Soru</option>
              <option :value="totalQuestions">Tüm {{ totalQuestions }} Soru</option>
            </select>
          </div>
          <div class="flex space-x-2">
            <button 
              @click="createGame" 
              :disabled="!hostName || creating"
              class="btn-primary flex-1 disabled:opacity-50"
            >
              {{ creating ? '⏳ Oluşturuluyor...' : '🚀 Oyunu Başlat' }}
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
          <h3 class="font-semibold text-gray-800">Mevcut Oyuna Katıl</h3>
          <input
            v-model="roomCode"
            type="text"
            placeholder="Oda Kodu (örn. ABC123)"
            class="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent uppercase"
            @input="roomCode = roomCode.toUpperCase()"
          />
          <input
            v-model="playerName"
            type="text"
            placeholder="Takma adınız"
            class="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
          <div class="flex space-x-2">
            <button 
              @click="joinGame" 
              :disabled="!roomCode || !playerName || joining"
              class="btn-primary flex-1 disabled:opacity-50"
            >
              {{ joining ? '⏳ Katılıyor...' : '🎯 Oyuna Katıl' }}
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
        Alper Şahin & Kemal Serbay Uğur sizlere özenle sunar 💕
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { navigateTo } from 'nuxt/app'
import { useFirebase } from '../composables/useFirebase'
import { questions } from '../data/questions'

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

// Computed
const totalQuestions = computed(() => questions.length)

// Methods
const createGame = async () => {
  if (!hostName.value) return
  
  creating.value = true
  error.value = ''
  
  try {
    const code = await createRoom(hostName.value, questionCount.value)
    await navigateTo(`/host/${code}`)
  } catch (err) {
    error.value = 'Oyun oluşturulamadı. Lütfen tekrar deneyin.'
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
    error.value = 'Oyuna katılınamadı. Oda kodunu kontrol edip tekrar deneyin.'
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
