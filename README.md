# ¡Español Divertido! - Spanish Language Learning App

A fun and interactive Spanish language learning application built with React, featuring vocabulary, grammar, and pronunciation games.

## Features

- 🎮 **Interactive Games**: Vocabulary, grammar, and pronunciation exercises
- 📊 **Progress Tracking**: Monitor your learning progress and achievements
- 🎨 **Beautiful UI**: Modern, responsive design with smooth animations
- 📱 **Mobile Friendly**: Works great on desktop and mobile devices
- 🌎 **Latin American Spanish**: Focus on Latin American Spanish variants

## Tech Stack

- **Next.js 14** - React framework with App Router
- **React 18** - Modern React with hooks
- **Framer Motion** - Smooth animations and transitions
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icons
- **Date-fns** - Date formatting utilities

## Getting Started

### Prerequisites

- Node.js 16.0.0 or higher
- npm 8.0.0 or higher

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Spanish-Language-App
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:3000`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors

## Project Structure

```
├── app/                # Next.js App Router
│   ├── game/           # Game page
│   ├── progress/       # Progress page
│   ├── layout.js       # Root layout
│   ├── page.js         # Home page
│   └── globals.css     # Global styles
├── components/         # React components
│   ├── games/          # Game components
│   ├── ui/             # Reusable UI components
│   └── Layout.js       # Main layout component
├── entities/           # Data models and API layer
└── lib/                # Utility functions
```

## Game Types

### Vocabulary Games
- Multiple choice questions
- Image-based learning
- Color and basic vocabulary

### Grammar Games
- Fill-in-the-blank exercises
- Ser vs Estar practice
- Sentence completion

### Pronunciation Games
- Sinalefa identification
- Syllable division
- Audio pronunciation practice

## Development

The app uses mock data for development. In a production environment, you would replace the mock entities in `entities/` with actual API calls to your backend.

### Key Features Implemented

- Responsive design with mobile-first approach
- Smooth animations using Framer Motion
- Progress tracking and statistics
- Game completion and scoring
- Beautiful gradient designs
- Accessibility considerations

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is licensed under the MIT License.
