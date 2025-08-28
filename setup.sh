#!/bin/bash

echo "🎯 Setting up Bahoot - A Farewell Game for Bahar 💕"
echo "================================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ and try again."
    exit 1
fi

# Check Node version
NODE_VERSION=$(node -v | cut -d 'v' -f 2 | cut -d '.' -f 1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version must be 18 or higher. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cp .env.example .env
    echo "⚠️  Please edit .env file with your Firebase configuration"
else
    echo "✅ .env file already exists"
fi

# Create photos directory
mkdir -p public/assets/photos
echo "📸 Photo directory created at public/assets/photos/"

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. 🔥 Set up Firebase project and update .env file"
echo "2. 📸 Add Bahar's photos to public/assets/photos/"
echo "3. ✏️  Customize questions in data/questions.ts"
echo "4. 🚀 Run 'npm run dev' to start development server"
echo ""
echo "Need help? Check the README.md file for detailed instructions!"
echo ""
echo "Made with 💕 for Bahar's farewell"
