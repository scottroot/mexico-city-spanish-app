
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
import { useLanguage } from '../../contexts/LanguageContext';

export default function GamePage() {
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [gameCompleted, setGameCompleted] = useState(false);
  const router = useRouter();
  const { t } = useLanguage();

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
        <p className="text-gray-500">{t('game.gameNotFound')}</p>
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
          <h2 className="text-3xl font-bold text-gray-800 mb-4">{t('game.congratulations')}</h2>
          <p className="text-gray-600 mb-8">
            {t('game.gameCompleted')} <strong>{game.title}</strong>
          </p>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => router.push('/')}
              className="flex-1"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t('game.back')}
            </Button>
            <Button
              onClick={handlePlayAgain}
              className="flex-1 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              {t('game.playAgain')}
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
      default:
        return <div>{t('game.unsupportedGameType')}</div>;
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => router.push('/')}
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-xl font-bold text-gray-800">{game.title}</h1>
              <p className="text-sm text-gray-500 capitalize">
                {t(`games.${game.type}`)} • {t(`games.${game.difficulty}`)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Game Content */}
      <div className="pt-8">
        {renderGame()}
      </div>
    </div>
  );
}
