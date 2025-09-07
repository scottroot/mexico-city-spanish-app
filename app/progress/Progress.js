'use client'

import React, { useState, useEffect } from 'react';
import { Progress } from '../../entities/Progress';
import { Game } from '../../entities/Game';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Trophy, Clock, Target, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useLanguage } from '../../contexts/LanguageContext';

export default function ProgressPage() {
  const [progress, setProgress] = useState([]);
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    const loadData = async () => {
      try {
        console.log('ProgressPage: Starting to load data...');
        
        // Load games (this should work with mock data)
        console.log('ProgressPage: Loading games...');
        const gamesData = await Game.list();
        console.log('ProgressPage: Games loaded:', gamesData.length);
        setGames(gamesData);

        // Load progress data using new Progress entity
        console.log('ProgressPage: Loading progress data...');
        const progressResult = await Progress.list();
        console.log('ProgressPage: Progress result:', progressResult);
        
        if (progressResult.success) {
          setProgress(progressResult.data);
          console.log('ProgressPage: Progress data set:', progressResult.data.length, 'items');
        } else {
          console.error('Error loading progress:', progressResult.error);
          setProgress([]);
        }
      } catch (error) {
        console.error('Error loading data:', error);
        // Set empty arrays as fallback
        setGames([]);
        setProgress([]);
      } finally {
        console.log('ProgressPage: Setting loading to false');
        setLoading(false);
      }
    };

    loadData();
  }, []); // Empty dependency array to run only once

  const getGameTitle = (gameId) => {
    const game = games.find(g => g.id === gameId);
    return game ? game.title : t('progress.unknownGame');
  };

  const getGameType = (gameId) => {
    const game = games.find(g => g.id === gameId);
    return game ? game.type : 'unknown';
  };

  const getOverallStats = () => {
    if (progress.length === 0) return { avgScore: 0, totalGames: 0, avgTime: 0, bestScore: 0 };

    const avgScore = Math.round(progress.reduce((sum, p) => sum + (p.score / p.max_score * 100), 0) / progress.length);
    const avgTime = Math.round(progress.reduce((sum, p) => sum + (p.completion_time || 0), 0) / progress.length);
    const bestScore = Math.max(...progress.map(p => Math.round(p.score / p.max_score * 100)));

    return {
      avgScore,
      totalGames: progress.length,
      avgTime,
      bestScore
    };
  };

  const typeColors = {
    vocabulary: 'bg-blue-100 text-blue-800',
    grammar: 'bg-green-100 text-green-800',
    pronunciation: 'bg-purple-100 text-purple-800'
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  const stats = getOverallStats();

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent mb-4">
            {t('progress.title')}
          </h1>
          <p className="text-xl text-gray-600">
            {t('progress.subtitle')}
          </p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <motion.div
            
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            
          >
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <CardContent className="p-6 pt-6 flex items-center">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-blue-600 text-sm font-medium">{t('progress.averageScore')}</p>
                    <p className="text-2xl font-bold text-blue-800">{stats.avgScore}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            
          >
            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <CardContent className="p-6 pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                    <Trophy className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-green-600 text-sm font-medium">{t('progress.gamesCompleted')}</p>
                    <p className="text-2xl font-bold text-green-800">{stats.totalGames}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            
          >
            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
              <CardContent className="p-6 pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-purple-600 text-sm font-medium">{t('progress.averageTime')}</p>
                    <p className="text-2xl font-bold text-purple-800">{stats.avgTime}s</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            
          >
            <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
              <CardContent className="p-6 pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-orange-600 text-sm font-medium">{t('progress.bestScore')}</p>
                    <p className="text-2xl font-bold text-orange-800">{stats.bestScore}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Recent Games */}
        <motion.div
          
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-800">
                {t('progress.recentGames')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {progress.length > 0 ? (
                <div className="space-y-4">
                  {progress.slice(0, 10).map((item, index) => (
                    <motion.div
                      key={item.id}
                      
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                      
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-pink-400 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-sm">
                            {Math.round(item.score / item.max_score * 100)}%
                          </span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800">
                            {getGameTitle(item.game_id)}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {item.created_at ? format(new Date(item.created_at), 'PPP', { locale: es }) : 'Fecha no disponible'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className={typeColors[getGameType(item.game_id)]}>
                          {getGameType(item.game_id)}
                        </Badge>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-700">
                            {item.score}/{item.max_score} {t('progress.points')}
                          </p>
                          <p className="text-xs text-gray-500">
                            {item.completion_time}s • {item.mistakes} {t('progress.errors')}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">
                    {t('progress.noGamesPlayed')}
                  </p>
                  <p className="text-gray-400">
                    {t('progress.startLearning')}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}