#!/bin/bash

echo "🚀 Setting up ScreenScene - Movie & Series Community Hub"
echo "=================================================="

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# API key is hardcoded in the project
echo "✅ TMDb API key is already configured in the code"

# Type check
echo "🔍 Running TypeScript type check..."
npm run type-check

echo ""
echo "✅ Setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Run 'npm run dev' to start the development server"
echo "2. Open http://localhost:3000 in your browser"
echo "3. Start browsing movies and TV shows!"
echo ""
echo "🔗 Useful commands:"
echo "   npm run dev      - Start development server"
echo "   npm run build    - Build for production"
echo "   npm run preview  - Preview production build"
echo "   npm run lint     - Run ESLint"
echo ""
echo "Happy coding! 🎬✨"