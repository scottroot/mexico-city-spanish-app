
'use client'

import React, { useState, useEffect } from 'react';
import { Game } from '../../entities/Game';
import { useRouter } from 'next/navigation';
import { Button } from '../../components/ui/button';
import { ArrowLeft, Trophy, RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';
import VocabularyGame from '../../components/games/VocabularyGame';
import GrammarGame from '../../components/games/GrammarGame';
import PronunciationGame from '../../components/games/PronunciationGame';
import ShoppingGame from '../../components/games/ShoppingGame';
import Link from 'next/link';


export default function GamePage() {
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [gameCompleted, setGameCompleted] = useState(false);
  const router = useRouter();

  // Helper function to get game type and difficulty labels
  const getGameTypeLabel = (type) => {
    const typeMap = {
      'vocabulary': 'vocabulary',
      'grammar': 'grammar', 
      'pronunciation': 'pronunciation',
      'shopping': 'shopping'
    };
    return typeMap[type] || type;
  };

  const getDifficultyLabel = (difficulty) => {
    const difficultyMap = {
      'beginner': 'beginner',
      'intermediate': 'intermediate',
      'advanced': 'advanced'
    };
    return difficultyMap[difficulty] || difficulty;
  };

  useEffect(() => {
    const loadGame = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const gameId = urlParams.get('id');
      
      if (!gameId) {
        router.push('/');
        return;
      }


      try {
        const games = await Game.list();
        const foundGame = games.find(g => g.id === gameId);
        
        if (!foundGame) {
          router.push('/');
          return;
        }
        
        setGame(foundGame);
      } catch (error) {
        console.error('Error loading game:', error);
        router.push('/');
      }
      setLoading(false);
    };

    loadGame();
  }, [router]);

  const handleGameComplete = () => {
    setGameCompleted(true);
  };

  const handlePlayAgain = () => {
    setGameCompleted(false);
    // Force re-render by reloading the page
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Game not found</p>
      </div>
    );
  }

  if (gameCompleted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div
          
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          
          className="text-center bg-white rounded-2xl p-8 shadow-2xl max-w-md"
        >
          <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Trophy className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Congratulations!</h2>
          <p className="text-gray-600 mb-8">
            You have completed the game <strong>{game.title}</strong>
          </p>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => router.push('/')}
              className="flex-1"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <Button
              onClick={handlePlayAgain}
              className="flex-1 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Play Again
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  const renderGame = () => {
    switch (game.type) {
      case 'vocabulary':
        return <VocabularyGame game={game} onComplete={handleGameComplete} />;
      case 'grammar':
        return <GrammarGame game={game} onComplete={handleGameComplete} />;
      case 'pronunciation':
        return <PronunciationGame game={game} onComplete={handleGameComplete} />;
      case 'shopping':
        return <ShoppingGame game={game} onComplete={handleGameComplete} />;
      default:
        return <div>Unsupported game type</div>;
    }
  };

  return (
    // <div id="game-container" className="flex flex-col h-full w-full bg-green-500 overflow-y-hidden">
    <div id="game-container" className="h-full w-full">
    {/* Header */}
      <div className="w-full bg-white/80 backdrop-blur-sm border-b border-gray-200 px-4 h-14 max-w-6xl mx-auto flex items-center justify-start gap-3">
        <Link href="/games">
          <Button
            variant="outline"
            size="sm"
            // onClick={() => router.push('/')}
            className="h-8 w-8 p-0"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-sm font-semibold text-gray-800">{game.title}</h1>
          <p className="text-xs text-gray-500 capitalize">
            {getGameTypeLabel(game.type)} • {getDifficultyLabel(game.difficulty)}
          </p>
        </div>
      </div>

      {/* Game Content */}
      <div id="game-content" className="flex flex-col h-full flex-1">
        {renderGame()}
      </div>
    </div>
  );
}
