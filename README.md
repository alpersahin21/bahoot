# 🎯 Bahoot - A Farewell Game for Bahar 💕

A special Kahoot-style multiplayer game created as a farewell gift for our dear friend Bahar. Players can join rooms, answer questions about Bahar, and compete in real-time!

## ✨ Features

- 🎮 **Real-time Multiplayer** - Multiple players can join and play simultaneously
- 🖼️ **Custom Photo Backgrounds** - Each question features Bahar's photos
- 📊 **Live Leaderboard** - Real-time scoring and rankings
- 🎯 **Easy Room System** - Simple room codes for joining games
- 💫 **Modern UI** - Beautiful, responsive design with Tailwind CSS
- 🔥 **Firebase Integration** - Real-time database for live gameplay
- 🚀 **Vercel Ready** - Optimized for deployment on Vercel

## 🛠️ Tech Stack

- **Frontend**: Nuxt 3 + Vue 3 + TypeScript
- **Styling**: Tailwind CSS
- **Real-time**: Firebase Realtime Database
- **Deployment**: Vercel
- **Questions**: Static JSON file (easily customizable)

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Firebase project (free tier)
- Vercel account (for deployment)

### 1. Installation

\`\`\`bash

# Clone the repository

git clone <your-repo-url>
cd bahoot

# Install dependencies

npm install
\`\`\`

### 2. Firebase Setup

1. Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable **Realtime Database** in your project
3. Set up database rules (for development):
   \`\`\`json
   {
   "rules": {
   "games": {
   ".read": true,
   ".write": true
   }
   }
   }
   \`\`\`
4. Get your Firebase config from Project Settings
5. Create \`.env\` file:

\`\`\`bash

# Copy environment template

cp .env.example .env

# Add your Firebase configuration

FIREBASE_API_KEY=your_api_key_here
FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
FIREBASE_DATABASE_URL=https://your_project_id-default-rtdb.firebaseio.com/
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id
\`\`\`

### 3. Add Bahar's Photos

Add Bahar's photos to \`public/assets/photos/\` with these exact names:

- \`bahar-hobby.jpg\` - For the hobby question
- \`bahar-city.jpg\` - For the city question
- \`bahar-color.jpg\` - For the color question
- \`bahar-happy.jpg\` - For the happiness question
- \`bahar-food.jpg\` - For the food question
- \`bahar-friends.jpg\` - For the friends question
- \`bahar-best.jpg\` - For the best thing question
- \`bahar-farewell.jpg\` - For the farewell question

### 4. Customize Questions

Edit \`data/questions.ts\` to customize questions about Bahar:

\`\`\`typescript
export const questions: Question[] = [
{
id: 1,
text: "What's Bahar's favorite hobby?",
answers: ["Photography", "Reading", "Cooking", "Traveling"],
correct: 0, // Index of correct answer
photo: "bahar-hobby.jpg",
timeLimit: 20 // seconds
},
// Add more questions...
]
\`\`\`

### 5. Development

\`\`\`bash

# Start development server

npm run dev

# Open http://localhost:3000

\`\`\`

## 🎮 How to Play

### For Game Host:

1. Go to the homepage
2. Click "Host a Game"
3. Enter your name and select number of questions
4. Share the room code with players
5. Start the game when everyone joins
6. Control the game flow (show results, next question)

### For Players:

1. Go to the homepage
2. Click "Join Game"
3. Enter the room code and your nickname
4. Wait for the host to start
5. Answer questions as fast as you can!
6. Check the live leaderboard

## 🚀 Deployment to Vercel

### Automatic Deployment:

1. Push your code to GitHub
2. Connect your repo to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy! 🎉

### Manual Deployment:

\`\`\`bash

# Install Vercel CLI

npm i -g vercel

# Login and deploy

vercel

# Add environment variables when prompted

\`\`\`

### Environment Variables for Vercel:

Add these in your Vercel dashboard under Settings → Environment Variables:

- \`FIREBASE_API_KEY\`
- \`FIREBASE_AUTH_DOMAIN\`
- \`FIREBASE_DATABASE_URL\`
- \`FIREBASE_PROJECT_ID\`
- \`FIREBASE_STORAGE_BUCKET\`
- \`FIREBASE_MESSAGING_SENDER_ID\`
- \`FIREBASE_APP_ID\`

## 📱 Game Features

### Real-time Multiplayer

- Multiple players can join using room codes
- Live player count and status updates
- Real-time answer submission and scoring

### Question System

- Customizable questions in \`data/questions.ts\`
- Photo backgrounds for each question
- Configurable time limits
- Multiple choice answers with color coding

### Scoring System

- Points based on speed and accuracy
- Faster answers get bonus points
- Live leaderboard updates
- Final results with celebrations

### Host Controls

- Start/stop games
- Skip questions
- View player progress
- Control game flow

## 🎨 Customization

### Adding More Questions

Edit \`data/questions.ts\` and add your questions:

\`\`\`typescript
{
id: 9,
text: "Your custom question?",
answers: ["Option 1", "Option 2", "Option 3", "Option 4"],
correct: 0,
photo: "your-photo.jpg",
timeLimit: 15
}
\`\`\`

### Changing Colors/Styling

Modify \`assets/css/main.css\` or use Tailwind classes in components.

### Firebase Rules (Production)

For production, set up proper Firebase security rules:

\`\`\`json
{
"rules": {
"games": {
"$gameId": {
        ".read": true,
        ".write": "auth != null || root.child('games').child($gameId).child('host').val() == null"
}
}
}
}
\`\`\`

## 🤝 Contributing

This is a personal farewell project for Bahar, but feel free to fork and adapt it for your own farewell games!

## 📝 License

Made with 💕 for Bahar. Feel free to use this code for your own farewell projects.

---

## 💕 Special Thanks

This project was created with love as a farewell gift for Bahar. Thank you for all the wonderful memories, and we'll miss you so much! Safe travels and stay amazing! 🌟

**Bahoot** - Because every farewell deserves a celebration! 🎉
