<template>
  <div class="game-container">
    <div class="bg-shapes">
      <div class="shape shape-1"></div>
      <div class="shape shape-2"></div>
      <div class="shape shape-3"></div>
    </div>

    <div class="container">
      <!-- Welcome Screen -->
      <div v-if="currentScreen === 'welcome'" class="welcome-screen fade-in-up">
        <div class="logo-section">
          <h1 class="logo">BAHOOT</h1>
          <p class="subtitle">Bahar için özel veda oyunu</p>
        </div>

        <div class="game-card">
          <div class="input-group">
            <label class="input-label">Oyun Kodu</label>
            <input
              v-model="gameCode"
              type="text"
              class="game-input"
              placeholder="Oyun kodunu girin"
              @keypress.enter="focusPlayerName"
            >
          </div>

          <div class="input-group">
            <label class="input-label">İsminiz</label>
            <input
              ref="playerNameInput"
              v-model="playerName"
              type="text"
              class="game-input"
              placeholder="İsminizi girin"
              @keypress.enter="joinGame"
            >
          </div>

          <button class="btn-primary" @click="joinGame">Oyuna Katıl</button>
          <button class="btn-secondary" @click="createGame">Yeni Oyun Oluştur</button>
        </div>
      </div>

      <!-- Question Screen -->
      <div v-if="currentScreen === 'question'" class="question-screen fade-in-up">
        <div class="question-card">
          <div class="question-header">
            <span class="question-number">Soru {{ currentQuestionIndex + 1 }}/{{ questions.length }}</span>
            <span :class="['timer', timerClass]">{{ timeLeft }}</span>
          </div>

          <!-- Media Content (Image or Video) -->
          <div v-if="currentQuestion.type === 'image' && currentQuestion.image" class="media-container">
            <img
              :src="currentQuestion.image"
              :alt="'Soru ' + (currentQuestionIndex + 1) + ' görseli'"
              class="question-image"
              @error="onImageError"
              @load="onImageLoad"
            >
          </div>

          <div v-if="currentQuestion.type === 'video' && currentQuestion.video && !currentQuestion.videoAfterAnswer" class="media-container">
            <video
              :src="currentQuestion.video"
              class="question-video"
              controls
              muted
              preload="metadata"
              playsinline
              @error="onVideoError"
              @loadeddata="onVideoLoad"
              @canplay="onVideoCanPlay"
            >
              <source :src="currentQuestion.video" type="video/mp4">
              <source :src="currentQuestion.video" type="video/webm">
              <source :src="currentQuestion.video" type="video/ogg">
              Tarayıcınız video formatını desteklemiyor.
            </video>
          </div>

          <h2 class="question-text">
            {{ currentQuestion.question }}
          </h2>

          <div class="answers-grid">
            <div
              v-for="(option, index) in currentQuestion.options"
              :key="index"
              :class="['answer-option', getAnswerClass(index)]"
              @click="selectAnswer(index)"
            >
              <span class="answer-icon">{{ answerIcons[index] }}</span>
              <span class="answer-text">{{ option }}</span>
            </div>
          </div>

          <div class="progress-container">
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: progressPercentage + '%' }"></div>
            </div>
            <span class="progress-text">{{ currentQuestionIndex + 1 }}/{{ questions.length }}</span>
          </div>
        </div>
      </div>

      <!-- Video Screen (After Answer) -->
      <div v-if="currentScreen === 'video'" class="video-screen fade-in-up">
        <div class="video-card">
          <div class="video-header">
            <h3 class="video-title">🎬 Bahar'dan Özel Video</h3>
          </div>

          <div class="video-container">
            <video
              :src="currentVideoSrc"
              class="full-video"
              controls
              autoplay
              preload="metadata"
              @ended="onVideoEnded"
              @error="onVideoError"
              @loadeddata="onVideoLoad"
            >
              Tarayıcınız video formatını desteklemiyor.
            </video>
          </div>

          <div class="video-actions">
            <button class="btn-secondary" @click="skipVideo">Videoyu Geç</button>
          </div>
        </div>
      </div>

      <!-- Results Screen -->
      <div v-if="currentScreen === 'results'" class="results-screen fade-in-up">
        <div class="game-card">
          <div class="results-content">
            <h2 class="results-title">🎉 Oyun Bitti!</h2>
            <div class="score-display">
              <div class="score-item">
                <span class="score-label">Doğru Cevaplar:</span>
                <span class="score-value">{{ correctAnswers }}</span>
              </div>
              <div class="score-item">
                <span class="score-label">Toplam Skor:</span>
                <span class="score-value">{{ score.toLocaleString() }}</span>
              </div>
            </div>
            <p class="farewell-message">
              Bahar için oynadığın için teşekkürler! 💜<br>
              Seni çok özleyeceğiz!
            </p>
            <button class="btn-primary" @click="restartGame">Tekrar Oyna</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Notification -->
    <div
      v-if="notification.show"
      :class="['notification', `notification-${notification.type}`]"
    >
      {{ notification.message }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

// State
const currentScreen = ref('welcome')
const gameCode = ref('')
const playerName = ref('')
const currentQuestionIndex = ref(0)
const timeLeft = ref(30)
const score = ref(0)
const correctAnswers = ref(0)
const selectedAnswer = ref(null)
const showCorrectAnswer = ref(false)
const notification = ref({ show: false, message: '', type: 'info' })
const currentVideoSrc = ref('') // Video için kaynak

// Refs
const playerNameInput = ref(null)

// Timer
let timerInterval = null

// Questions - Test için daha detaylı debug
const questions = ref([
  {
    question: "Bahar'ın en sevdiği yemek hangisidir?",
    options: ["Mantı", "Pizza", "Döner", "Pasta"],
    correct: 0,
    image: "/assets/photos/bahar-food.jpg",
    type: "image"
  },
  {
    question: "Bahar hangi şehirde doğdu?",
    options: ["İstanbul", "Ankara", "İzmir", "Bursa"],
    correct: 1,
    video: "/assets/videos/bahar-memories.mp4",
    type: "video",
    videoAfterAnswer: true // CEVAP SONRASI video
  },
  {
    question: "Bu fotoğrafta Bahar kaç yaşında?",
    options: ["22", "23", "24", "25"],
    correct: 2,
    image: "/assets/photos/bahar-birthday.jpg",
    type: "image"
  },
  {
    question: "Bahar'ın en sevdiği renk nedir?",
    options: ["Mavi", "Pembe", "Yeşil", "Mor"],
    correct: 3,
    type: "text"
  },
  {
    question: "Bahar'ın hobisini gösteren video:",
    options: ["Resim yapmak", "Kitap okumak", "Müzik dinlemek", "Yüzmek"],
    correct: 1,
    video: "/assets/videos/bahar-hobby.mp4",
    type: "video",
    videoAfterAnswer: false // SORUYLA BİRLİKTE video - Bu çalışmıyor denmişti
  }
])

// Computed
const currentQuestion = computed(() => questions.value[currentQuestionIndex.value])
const progressPercentage = computed(() => ((currentQuestionIndex.value) / questions.value.length) * 100)
const timerClass = computed(() => {
  if (timeLeft.value <= 5) return 'danger'
  if (timeLeft.value <= 10) return 'warning'
  return ''
})

const answerIcons = ['△', '◇', '○', '□']

// Methods
const focusPlayerName = () => {
  playerNameInput.value?.focus()
}

const joinGame = () => {
  if (!gameCode.value.trim() || !playerName.value.trim()) {
    showNotification('Lütfen oyun kodu ve isminizi girin!', 'error')
    return
  }
  currentScreen.value = 'question'
  startTimer()
}

const createGame = () => {
  const randomCode = Math.floor(1000 + Math.random() * 9000)
  gameCode.value = randomCode.toString()
  playerNameInput.value?.focus()
  showNotification(`Yeni oyun kodu: ${randomCode}`, 'success')
}

const selectAnswer = (optionIndex) => {
  if (selectedAnswer.value !== null) return

  selectedAnswer.value = optionIndex
  clearTimer()

  const isCorrect = optionIndex === currentQuestion.value.correct
  if (isCorrect) {
    score.value += Math.max(1000 - (30 - timeLeft.value) * 10, 100)
    correctAnswers.value++
    showNotification('Doğru! 🎉', 'success')
  } else {
    showNotification('Yanlış! 😔', 'error')
  }

  showCorrectAnswer.value = true

  setTimeout(() => {
    // Eğer cevap sonrası video varsa, önce videoyu göster
    if (currentQuestion.value.videoAfterAnswer && currentQuestion.value.video) {
      showVideo()
    } else {
      nextQuestion()
    }
  }, 2000)
}

const nextQuestion = () => {
  if (currentQuestionIndex.value < questions.value.length - 1) {
    currentQuestionIndex.value++
    selectedAnswer.value = null
    showCorrectAnswer.value = false
    startTimer()
  } else {
    endGame()
  }
}

const endGame = () => {
  clearTimer()
  currentScreen.value = 'results'

  if (correctAnswers.value >= Math.floor(questions.value.length * 0.7)) {
    showNotification('Harika performans! 🎉', 'success')
  } else if (correctAnswers.value >= Math.floor(questions.value.length * 0.5)) {
    showNotification('İyi iş çıkardın! 👏', 'success')
  } else {
    showNotification('Bir dahaki sefere daha iyi olacak! 💪', 'info')
  }
}

const restartGame = () => {
  currentScreen.value = 'welcome'
  gameCode.value = ''
  playerName.value = ''
  currentQuestionIndex.value = 0
  timeLeft.value = 30
  score.value = 0
  correctAnswers.value = 0
  selectedAnswer.value = null
  showCorrectAnswer.value = false
  currentVideoSrc.value = ''
  clearTimer()
}

// Video Functions
const showVideo = () => {
  currentVideoSrc.value = currentQuestion.value.video
  currentScreen.value = 'video'
}

const onVideoEnded = () => {
  console.log('Video ended, moving to next question')
  proceedToNextQuestion()
}

const skipVideo = () => {
  console.log('Video skipped, moving to next question')
  proceedToNextQuestion()
}

const proceedToNextQuestion = () => {
  // Video ekranından çık
  currentScreen.value = 'question'
  currentVideoSrc.value = ''

  // Sonraki soruya geç
  if (currentQuestionIndex.value < questions.value.length - 1) {
    currentQuestionIndex.value++
    selectedAnswer.value = null
    showCorrectAnswer.value = false
    startTimer()
  } else {
    endGame()
  }
}

const onImageLoad = (event) => {
  console.log('Resim yüklendi:', event.target.src)
}

const onVideoLoad = (event) => {
  console.log('Video yüklendi:', event.target.src)
}

const onVideoCanPlay = (event) => {
  console.log('Video oynatılabilir:', event.target.src)
}

const onImageError = (event) => {
  console.warn('Resim yüklenemedi:', event.target.src)
  showNotification('Resim yüklenemedi: ' + event.target.src.split('/').pop(), 'warning')
  // Resmi gizle
  event.target.style.display = 'none'
}

const onVideoError = (event) => {
  console.error('Video yüklenemedi:', event.target.src)
  console.error('Video hata detayı:', event.target.error)

  const fileName = event.target.src.split('/').pop()
  showNotification(`Video yüklenemedi: ${fileName}`, 'error')

  // Video elementini placeholder ile değiştir
  const placeholder = document.createElement('div')
  placeholder.className = 'video-placeholder'
  placeholder.innerHTML = `
    <div style="
      background: #f8f9fa;
      border: 2px dashed #dee2e6;
      border-radius: 12px;
      padding: 40px;
      text-align: center;
      color: #6c757d;
      min-height: 200px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    ">
      <div style="font-size: 2rem; margin-bottom: 10px;">🎬</div>
      <div>Video bulunamadı</div>
      <div style="font-size: 0.8rem; margin-top: 5px;">${fileName}</div>
    </div>
  `
  event.target.parentNode.appendChild(placeholder)
  event.target.style.display = 'none'

  // Video yüklenemediyse ve video ekranındaysak sonraki soruya geç
  if (currentScreen.value === 'video') {
    setTimeout(() => {
      proceedToNextQuestion()
    }, 3000)
  }
}

const startTimer = () => {
  timeLeft.value = 30
  timerInterval = setInterval(() => {
    timeLeft.value--
    if (timeLeft.value <= 0) {
      clearTimer()
      showNotification('Süre doldu! ⏰', 'warning')
      setTimeout(() => {
        nextQuestion()
      }, 2000)
    }
  }, 1000)
}

const clearTimer = () => {
  if (timerInterval) {
    clearInterval(timerInterval)
    timerInterval = null
  }
}

const getAnswerClass = (index) => {
  if (selectedAnswer.value === null) return ''

  if (showCorrectAnswer.value) {
    if (index === currentQuestion.value.correct) return 'correct'
    if (index === selectedAnswer.value && index !== currentQuestion.value.correct) return 'incorrect'
  }

  if (index === selectedAnswer.value) return 'selected'
  return ''
}

const showNotification = (message, type = 'info') => {
  notification.value = { show: true, message, type }
  setTimeout(() => {
    notification.value.show = false
  }, 3000)
}

// Keyboard shortcuts
onMounted(() => {
  const handleKeydown = (e) => {
    // ESC tuşu - sadece question ekranındayken ana ekrana dön
    if (e.key === 'Escape' && currentScreen.value !== 'welcome') {
      const confirmRestart = confirm('Ana ekrana dönmek istediğinizden emin misiniz?')
      if (confirmRestart) {
        restartGame()
      }
    }

    // Sayı tuşları - sadece question ekranındayken cevap seç
    if (currentScreen.value === 'question' && ['1', '2', '3', '4'].includes(e.key)) {
      const answerIndex = parseInt(e.key) - 1
      selectAnswer(answerIndex)
    }

    // Video ekranında SPACE veya ENTER ile video geç
    if (currentScreen.value === 'video' && (e.key === ' ' || e.key === 'Enter')) {
      e.preventDefault()
      skipVideo()
    }
  }

  document.addEventListener('keydown', handleKeydown)

  onBeforeUnmount(() => {
    document.removeEventListener('keydown', handleKeydown)
    clearTimer()
  })
})
</script>

<style scoped>
/* Import font */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;900&display=swap');

/* Reset ve base styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.game-container {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  overflow-x: hidden;
  position: relative;
}

/* Animated background elements */
.bg-shapes {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  pointer-events: none;
  z-index: 0;
}

.shape {
  position: absolute;
  opacity: 0.1;
  animation: float 20s infinite linear;
}

.shape-1 {
  width: 200px;
  height: 200px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  top: 10%;
  left: -100px;
  animation-delay: 0s;
}

.shape-2 {
  width: 150px;
  height: 150px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 30px;
  top: 60%;
  right: -75px;
  animation-delay: -10s;
  transform: rotate(45deg);
}

.shape-3 {
  width: 100px;
  height: 100px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  top: 80%;
  left: 20%;
  animation-delay: -5s;
}

@keyframes float {
  0% { transform: translateY(0px) rotate(0deg); }
  33% { transform: translateY(-20px) rotate(120deg); }
  66% { transform: translateY(-10px) rotate(240deg); }
  100% { transform: translateY(0px) rotate(360deg); }
}

/* Main container */
.container {
  position: relative;
  z-index: 1;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

/* Logo section */
.logo-section {
  text-align: center;
  margin-bottom: 40px;
}

.logo {
  font-size: 4rem;
  font-weight: 900;
  color: white;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  margin-bottom: 10px;
  letter-spacing: -2px;
}

.subtitle {
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.2rem;
  font-weight: 300;
  letter-spacing: 1px;
}

/* Game card */
.game-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 40px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  max-width: 500px;
  width: 100%;
  transition: all 0.3s ease;
}

.game-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.3);
}

/* Input styles */
.input-group {
  margin-bottom: 24px;
}

.input-label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #374151;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.game-input {
  width: 100%;
  padding: 16px 20px;
  font-size: 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 16px;
  background: #f9fafb;
  transition: all 0.3s ease;
  outline: none;
}

.game-input:focus {
  border-color: #667eea;
  background: white;
  box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
}

/* Button styles */
.btn-primary {
  width: 100%;
  padding: 16px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 16px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 16px;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
}

.btn-secondary {
  width: 100%;
  padding: 12px 24px;
  background: transparent;
  color: #6b7280;
  border: 2px solid #e5e7eb;
  border-radius: 16px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-secondary:hover {
  border-color: #667eea;
  color: #667eea;
  background: rgba(102, 126, 234, 0.05);
}

/* Question screen */
.question-screen {
  text-align: center;
  max-width: 800px;
  width: 100%;
}

.question-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 30px;
  margin-bottom: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
}

.question-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  padding-bottom: 15px;
  border-bottom: 2px solid #f3f4f6;
}

.question-number {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.9rem;
}

.timer {
  background: #10b981;
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.9rem;
  min-width: 60px;
  transition: all 0.3s ease;
}

.timer.warning {
  background: #f59e0b;
}

.timer.danger {
  background: #ef4444;
  animation: pulse 1s infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

.question-text {
  font-size: 1.3rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 25px;
  line-height: 1.3;
  padding: 0 10px;
}

/* Answer options */
.answers-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 30px;
}

.answer-option {
  background: white;
  border: 3px solid #e5e7eb;
  border-radius: 16px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
  min-height: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  position: relative;
}

.answer-icon {
  font-size: 1.5rem;
  margin-bottom: 8px;
}

.answer-text {
  font-size: 1rem;
}

.answer-option:nth-child(1) {
  border-color: #ef4444;
  color: #ef4444;
}

.answer-option:nth-child(2) {
  border-color: #3b82f6;
  color: #3b82f6;
}

.answer-option:nth-child(3) {
  border-color: #f59e0b;
  color: #f59e0b;
}

.answer-option:nth-child(4) {
  border-color: #10b981;
  color: #10b981;
}

.answer-option:hover:not(.selected):not(.correct):not(.incorrect) {
  transform: scale(1.05);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.answer-option:nth-child(1):hover:not(.selected):not(.correct):not(.incorrect) {
  background: #ef4444;
  color: white;
}

.answer-option:nth-child(2):hover:not(.selected):not(.correct):not(.incorrect) {
  background: #3b82f6;
  color: white;
}

.answer-option:nth-child(3):hover:not(.selected):not(.correct):not(.incorrect) {
  background: #f59e0b;
  color: white;
}

.answer-option:nth-child(4):hover:not(.selected):not(.correct):not(.incorrect) {
  background: #10b981;
  color: white;
}

.answer-option.selected {
  transform: scale(0.95);
  opacity: 0.7;
}

.answer-option.correct {
  background: #10b981 !important;
  color: white !important;
  border-color: #10b981 !important;
}

.answer-option.incorrect {
  background: #ef4444 !important;
  color: white !important;
  border-color: #ef4444 !important;
}

/* Progress section */
.progress-container {
  display: flex;
  align-items: center;
  gap: 15px;
}

.progress-bar {
  flex: 1;
  height: 8px;
  background: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  width: 0%;
  transition: width 0.3s ease;
}

.progress-text {
  font-weight: 600;
  color: #6b7280;
  font-size: 0.9rem;
}

/* Results Screen */
.results-screen {
  text-align: center;
  max-width: 600px;
  width: 100%;
}

.results-content {
  text-align: center;
}

.results-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 30px;
}

.score-display {
  background: #f9fafb;
  padding: 30px;
  border-radius: 16px;
  margin-bottom: 30px;
}

.score-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.score-item:last-child {
  margin-bottom: 0;
  padding-top: 15px;
  border-top: 2px solid #e5e7eb;
}

.score-label {
  font-size: 1.1rem;
  font-weight: 500;
  color: #6b7280;
}

.score-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #667eea;
}

.farewell-message {
  font-size: 1.1rem;
  color: #6b7280;
  line-height: 1.6;
  margin-bottom: 30px;
}

/* Notification */
.notification {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 15px 25px;
  border-radius: 12px;
  color: white;
  font-weight: 600;
  font-size: 0.9rem;
  z-index: 9999;
  max-width: 300px;
  word-wrap: break-word;
  animation: slideIn 0.3s ease-out;
}

.notification-success {
  background: #10b981;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
}

.notification-error {
  background: #ef4444;
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
}

.notification-warning {
  background: #f59e0b;
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.4);
}

.notification-info {
  background: #3b82f6;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-in-up {
  animation: fadeInUp 0.6s ease-out;
}

/* Media Styles */
.media-container {
  margin-bottom: 25px;
  text-align: center;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  background: #f8f9fa;
}

.question-image {
  max-width: 100%;
  max-height: 320px;
  width: auto;
  height: auto;
  object-fit: cover;
  border-radius: 12px;
  transition: transform 0.3s ease;
  display: block;
  margin: 0 auto;
}

.question-image:hover {
  transform: scale(1.02);
}

.question-video {
  max-width: 100%;
  max-height: 280px;
  width: 100%;
  border-radius: 12px;
  background: #000;
}

/* Video Screen Styles */
.video-screen {
  text-align: center;
  max-width: 900px;
  width: 100%;
}

.video-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 30px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
}

.video-header {
  margin-bottom: 25px;
}

.video-title {
  font-size: 1.8rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 10px;
}

.video-container {
  margin-bottom: 25px;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.2);
  background: #000;
}

.full-video {
  width: 100%;
  max-height: 450px;
  min-height: 300px;
  border-radius: 16px;
  background: #000;
}

.video-actions {
  display: flex;
  justify-content: center;
  gap: 15px;
}

/* Loading states */
.loading-placeholder {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: 16px;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  font-weight: 500;
}

@keyframes loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
@media (max-width: 768px) {
  .logo {
    font-size: 3rem;
  }

  .game-card {
    padding: 30px 20px;
    border-radius: 20px;
  }

  .answers-grid {
    grid-template-columns: 1fr;
  }

  .question-text {
    font-size: 1.2rem;
  }

  .question-header {
    flex-direction: column;
    gap: 10px;
  }

  .score-item {
    flex-direction: column;
    gap: 5px;
    text-align: center;
  }
}

@media (max-width: 480px) {
  .container {
    padding: 15px;
  }

  .logo {
    font-size: 2.5rem;
  }

  .subtitle {
    font-size: 1rem;
  }

  .game-card {
    padding: 25px 15px;
  }

  .question-card {
    padding: 25px 15px;
  }

  .answer-option {
    min-height: 80px;
    padding: 15px;
  }

  .notification {
    top: 10px;
    right: 10px;
    left: 10px;
    max-width: none;
  }
}
</style>