'use client'

import React, { useState } from 'react';
import { Game, GameData } from '../../entities/Game';
import { motion } from 'framer-motion';
import { Sparkles, Target, Clock, Wrench, Scissors } from 'lucide-react';
import GameCard from '../../components/games/GameCard';
// import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface HomeProps {
  initialGames: GameData[];
}

export default function GamesComponent({ initialGames }: HomeProps) {
  // const [games] = useState<Game[]>(initialGames.map(gameData => new Game(gameData)));
  const games = initialGames;
  const [progress] = useState([]);

  const getProgressForGame = (gameId: string) => {
    return progress.filter((p: any) => p.game_id === gameId);
  };

  const getTotalScore = () => {
    if (progress.length === 0) return 0;
    return Math.round(progress.reduce((sum: number, p: any) => sum + (p.score / p.max_score * 100), 0) / progress.length);
  };

  // const handleGameClick = (game: Game) => {
  //   router.push(`/game?id=${game.id}`);
  // };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-8 h-8 text-orange-500" />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
              Welcome!
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Experience Spanish learning with interactive games, immersive stories, and intelligent tools designed to improve your ear and accent.
          </p>
        </motion.div>

        {/* Stats Section */}
        {progress.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
          >
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
              <div className="flex items-center gap-3">
                <Target className="w-8 h-8" />
                <div>
                  <p className="text-blue-100">Average Score</p>
                  <p className="text-2xl font-bold">{getTotalScore()}%</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
              <div className="flex items-center gap-3">
                <Sparkles className="w-8 h-8" />
                <div>
                  <p className="text-green-100">Games Completed</p>
                  <p className="text-2xl font-bold">{progress.length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
              <div className="flex items-center gap-3">
                <Clock className="w-8 h-8" />
                <div>
                  <p className="text-purple-100">Best Time</p>
                  <p className="text-2xl font-bold">
                    {Math.min(...progress.map((p: any) => p.completion_time || 999))}s
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Language Tools Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Language Tools
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 2xlg:grid-cols-3 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Link href="/tools/syllabification">
                <div className="bg-white rounded-xl py-2 px-6 shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-200 hover:border-orange-300 cursor-pointer group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                      <Scissors className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                        Syllabification
                      </h3>
                      <p className="text-sm text-gray-600 leading-6 h-12">
                        Learn pronunciation and how to properly blend togther multiple words and stress the right syllable!
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
            
            {/* Placeholder for future tools */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="bg-gray-50 rounded-xl py-2 px-6 border-2 border-dashed border-gray-300">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                    <Wrench className="w-6 h-6 text-gray-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-400">
                      More Tools Coming Soon
                    </h3>
                    <p className="text-sm text-gray-400  leading-6 h-12">
                      Additional language tools will be added here
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Games Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Choose your favorite game
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
            {games.map((game, index) => (
              <motion.div
                key={game.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <Link href={`/game?id=${game.id}`}>
                  <GameCard 
                    game={game}
                    progress={getProgressForGame(game.id)}
                  />
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {games.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">No games available yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
