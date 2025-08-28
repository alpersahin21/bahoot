import type { Question } from '../data/questions'
import { ref, computed, readonly, onUnmounted } from 'vue'
import { useFirebase } from './useFirebase'

export interface GameState {
  host: string
  status: 'waiting' | 'playing' | 'finished'
  currentQuestion: number
  questionCount: number
  createdAt: number
  players: Record<string, Player>
  questions?: Question[]
  currentQuestionData?: Question
  showResults?: boolean
  questionStartTime?: number
}

export interface Player {
  nickname: string
  score: number
  currentAnswer: number | null
  hasAnswered: boolean
  joinedAt: number
  responseTime?: number
  questionPoints?: number
  isCorrect?: boolean
}

export const useGameRoom = (roomCode: string) => {
  const { listenToRoom, updateGameState, submitAnswer } = useFirebase()
  const gameState = ref<GameState | null>(null)
  const isConnected = ref(false)
  
  let unsubscribe: (() => void) | null = null

  const connect = () => {
    unsubscribe = listenToRoom(roomCode, (data) => {
      gameState.value = data
      isConnected.value = !!data
    })
  }

  const disconnect = () => {
    if (unsubscribe) {
      unsubscribe()
      unsubscribe = null
    }
    isConnected.value = false
  }

  const startGame = async (questions: Question[]) => {
    if (!gameState.value) return
    
    const updatedState = {
      ...gameState.value,
      status: 'playing',
      currentQuestion: 0,
      questions,
      questionStartTime: Date.now(),
      showResults: false
    }
    
    await updateGameState(roomCode, updatedState)
  }

  const nextQuestion = async () => {
    if (!gameState.value) return
    
    const nextQuestionIndex = gameState.value.currentQuestion + 1
    const isGameFinished = nextQuestionIndex >= gameState.value.questionCount
    
    const updatedState = {
      ...gameState.value,
      currentQuestion: nextQuestionIndex,
      status: isGameFinished ? 'finished' : 'playing',
      questionStartTime: isGameFinished ? null : Date.now(),
      showResults: false,
      // Reset player answers for next question but keep scores
      players: Object.fromEntries(
        Object.entries(gameState.value.players).map(([id, player]) => [
          id,
          { 
            ...player, 
            currentAnswer: null, 
            hasAnswered: false,
            questionPoints: undefined,
            isCorrect: undefined,
            responseTime: undefined
          }
        ])
      )
    }
    
    await updateGameState(roomCode, updatedState)
  }

  const showQuestionResults = async () => {
    if (!gameState.value) return
    
    const updatedState = {
      ...gameState.value,
      showResults: true
    }
    
    await updateGameState(roomCode, updatedState)
  }

  const playerAnswer = async (playerId: string, answer: number) => {
    if (!gameState.value || !gameState.value.questionStartTime || !gameState.value.questions) return
    
    const currentQuestion = gameState.value.questions[gameState.value.currentQuestion]
    if (!currentQuestion) return
    
    const responseTime = (Date.now() - gameState.value.questionStartTime) / 1000
    await submitAnswer(roomCode, playerId, gameState.value.currentQuestion, answer, responseTime, currentQuestion.correct)
  }

  const getLeaderboard = computed(() => {
    if (!gameState.value?.players) return []
    
    return Object.entries(gameState.value.players)
      .map(([id, player]) => ({ id, ...player }))
      .sort((a, b) => b.score - a.score)
  })

  const getPlayersCount = computed(() => {
    return Object.keys(gameState.value?.players || {}).length
  })

  const getAnsweredCount = computed(() => {
    if (!gameState.value?.players) return 0
    return Object.values(gameState.value.players).filter(p => p.hasAnswered).length
  })

  onUnmounted(() => {
    disconnect()
  })

  return {
    gameState: readonly(gameState),
    isConnected: readonly(isConnected),
    connect,
    disconnect,
    startGame,
    nextQuestion,
    showQuestionResults,
    playerAnswer,
    getLeaderboard,
    getPlayersCount,
    getAnsweredCount
  }
}
