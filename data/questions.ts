export interface Question {
  id: number
  text: string
  answers: string[]
  correct: number
  photo: string
  timeLimit?: number
}

export const questions: Question[] = [
  {
    id: 1,
    text: "What's Bahar's favorite hobby?",
    answers: ["Photography", "Reading", "Cooking", "Traveling"],
    correct: 0,
    photo: "bahar-hobby.jpg",
    timeLimit: 30
  },
  {
    id: 2,
    text: "Which city does Bahar love the most?",
    answers: ["Istanbul", "Paris", "New York", "Tokyo"],
    correct: 0,
    photo: "bahar-city.jpg",
    timeLimit: 30
  },
  {
    id: 3,
    text: "What's Bahar's favorite color?",
    answers: ["Blue", "Purple", "Pink", "Green"],
    correct: 1,
    photo: "bahar-color.jpg",
    timeLimit: 30
  },
  {
    id: 4,
    text: "What does Bahar do when she's happy?",
    answers: ["Sings", "Dances", "Takes photos", "All of the above"],
    correct: 3,
    photo: "bahar-happy.jpg",
    timeLimit: 30
  },
  {
    id: 5,
    text: "What's Bahar's favorite food?",
    answers: ["Pizza", "Sushi", "Turkish Delight", "Pasta"],
    correct: 2,
    photo: "bahar-food.jpg",
    timeLimit: 30
  },
  {
    id: 6,
    text: "How does Bahar make everyone feel?",
    answers: ["Happy", "Inspired", "Loved", "All of the above"],
    correct: 3,
    photo: "bahar-friends.jpg",
    timeLimit: 30
  },
  {
    id: 7,
    text: "What's the best thing about Bahar?",
    answers: ["Her smile", "Her kindness", "Her energy", "Everything"],
    correct: 3,
    photo: "bahar-best.jpg",
    timeLimit: 30
  },
  {
    id: 8,
    text: "What will we miss most about Bahar?",
    answers: ["Her jokes", "Her hugs", "Her presence", "Everything about her"],
    correct: 3,
    photo: "bahar-farewell.jpg",
    timeLimit: 30
  }
]

export const getRandomQuestions = (count: number = 5): Question[] => {
  const shuffled = [...questions].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, Math.min(count, questions.length))
}
