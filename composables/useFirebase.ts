import { getDatabase, ref, push, set, onValue, off, remove } from 'firebase/database'

export const useFirebase = () => {
  const { $database } = useNuxtApp()

  const createRoom = async (hostName: string, questionCount: number = 5) => {
    try {
      const roomCode = generateRoomCode()
      const roomRef = ref($database, `games/${roomCode}`)
      
      await set(roomRef, {
        host: hostName,
        status: 'waiting',
        currentQuestion: 0,
        questionCount,
        createdAt: Date.now(),
        players: {}
      })
      
      return roomCode
    } catch (error) {
      console.error('Error creating room:', error)
      throw error
    }
  }

  const joinRoom = async (roomCode: string, playerName: string) => {
    try {
      const playerId = generatePlayerId()
      const playerRef = ref($database, `games/${roomCode}/players/${playerId}`)
      
      await set(playerRef, {
        nickname: playerName,
        score: 0,
        currentAnswer: null,
        hasAnswered: false,
        joinedAt: Date.now()
      })
      
      return playerId
    } catch (error) {
      console.error('Error joining room:', error)
      throw error
    }
  }

  const updateGameState = async (roomCode: string, updates: any) => {
    try {
      const gameRef = ref($database, `games/${roomCode}`)
      await set(gameRef, updates)
    } catch (error) {
      console.error('Error updating game state:', error)
      throw error
    }
  }

  const listenToRoom = (roomCode: string, callback: (data: any) => void) => {
    const roomRef = ref($database, `games/${roomCode}`)
    onValue(roomRef, (snapshot) => {
      const data = snapshot.val()
      callback(data)
    })
    
    return () => off(roomRef)
  }

  const submitAnswer = async (roomCode: string, playerId: string, questionId: number, answer: number, responseTime: number) => {
    try {
      const playerRef = ref($database, `games/${roomCode}/players/${playerId}`)
      const points = calculatePoints(responseTime)
      
      await set(playerRef, {
        currentAnswer: answer,
        hasAnswered: true,
        responseTime,
        points
      })
    } catch (error) {
      console.error('Error submitting answer:', error)
      throw error
    }
  }

  const generateRoomCode = (): string => {
    return Math.random().toString(36).substring(2, 8).toUpperCase()
  }

  const generatePlayerId = (): string => {
    return Math.random().toString(36).substring(2, 10)
  }

  const calculatePoints = (responseTime: number, maxTime: number = 20): number => {
    const timeBonus = Math.max(0, (maxTime - responseTime) / maxTime)
    return Math.round(1000 * (0.5 + 0.5 * timeBonus))
  }

  return {
    createRoom,
    joinRoom,
    updateGameState,
    listenToRoom,
    submitAnswer,
    generateRoomCode,
    generatePlayerId,
    calculatePoints
  }
}
