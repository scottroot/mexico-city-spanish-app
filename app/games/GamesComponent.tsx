'use client'

import React, { useState, useEffect } from 'react'
import type { GameData, UserData } from '@/app/types'
import { motion } from 'framer-motion'
import { Target, Trophy, Zap, Scissors } from 'lucide-react'
import GameCard from './_components/GameCard'
import Link from 'next/link'
import { Progress } from '@/entities/Progress'


export default function GamesComponent({ initialGames, user }: { initialGames: GameData[], user: UserData }) {
  const games = initialGames;
  const [progress, setProgress] = useState<any[]>([]);

  const getProgressForGame = (gameId: string) => {
    return progress.filter((p: any) => p.game_id === gameId);
  };

  const getTotalScore = () => {
    if (progress.length === 0) return 0
    return Math.round(progress.reduce((sum: number, p: any) => sum + (p.score / p.max_score * 100), 0) / progress.length)
  }

  const getGamesCompleted = () => {
    return progress.length
  }

  const getBestStreak = () => {
    // Placeholder - would need actual streak calculation
    return progress.length > 0 ? Math.min(7, progress.length) : 0
  }

  // Fetch progress on mount
  useEffect(() => {
    Progress.list().then(result => {
      if (result.success && result.data) {
        setProgress(result.data)
      }
    })
  }, [])

  return (
    <div className="flex min-h-fit h-screen p-4 md:p-8 pb-20 bg-gradient-to-br from-orange-50/30 via-white to-teal-50/30">
      <div className="max-w-5xl mx-auto">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-brand-orange to-brand-teal bg-clip-text text-transparent mb-4">
            Interactive Games
          </h1>
          <p className="text-lg text-neutral-700 max-w-3xl">
            Master Mexico City Spanish through interactive exercises designed to improve your vocabulary, grammar, and pronunciation.
          </p>
        </motion.div>

        {/* Stats Section */}
        {progress.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12"
          >
            <div className="bg-gradient-to-br from-orange-500 to-pink-500 rounded-xl p-6 text-white" style={{ boxShadow: 'var(--shadow-card-hover)' }}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-white/90 mb-1">Average Score</p>
                  <p className="text-4xl font-bold">{getTotalScore()}%</p>
                </div>
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <Target className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-teal-500 to-green-500 rounded-xl p-6 text-white" style={{ boxShadow: 'var(--shadow-card-hover)' }}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-white/90 mb-1">Games Completed</p>
                  <p className="text-4xl font-bold">{getGamesCompleted()}</p>
                </div>
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl p-6 text-white" style={{ boxShadow: 'var(--shadow-card-hover)' }}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-white/90 mb-1">Current Streak</p>
                  <p className="text-4xl font-bold">{getBestStreak()}</p>
                  <p className="text-sm font-medium text-white/80">days</p>
                </div>
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Games Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-neutral-900">
              All Games
            </h2>
            <span className="text-sm text-neutral-500">
              {games.length} available
            </span>
          </div>
          
          <div 
            className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-20"
          >
            {games.map((game, index) => (
              <motion.div
                key={game.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <Link href={`/game/${game.type}`}>
                  <GameCard
                    user={user}
                    game={game}
                    progress={getProgressForGame(game.id)}
                  />
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Language Tools Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-12 mt-16"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-neutral-900">
              Learning Tools
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href="/tools/syllabification">
              <motion.div
                whileHover={{ scale: 1.02, y: -2 }}
                className="bg-gradient-to-br from-blue-500 to-teal-500 rounded-xl p-6 text-white cursor-pointer group"
                style={{ boxShadow: 'var(--shadow-card-hover)' }}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center group-hover:bg-white/30 transition-colors">
                    <Scissors className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">
                      Syllabification Tool
                    </h3>
                    <p className="text-sm text-white/90">
                      Practice breaking words into syllables and master proper stress patterns
                    </p>
                  </div>
                </div>
              </motion.div>
            </Link>
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
