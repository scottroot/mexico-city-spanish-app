import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, MessageSquare, Volume2, ShoppingCart } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import Image from 'next/image';

const iconMap = {
  vocabulary: BookOpen,
  grammar: MessageSquare,
  pronunciation: Volume2,
  shopping: ShoppingCart
};

const colorMap = {
  vocabulary: 'from-blue-400 to-blue-600',
  grammar: 'from-green-400 to-green-600',
  pronunciation: 'from-purple-400 to-purple-600',
  shopping: 'from-orange-400 to-orange-600'
};

const difficultyColors = {
  beginner: 'bg-green-100 text-green-700',
  intermediate: 'bg-yellow-100 text-yellow-700',
  advanced: 'bg-red-100 text-red-700'
};

export default function GameCard({ game, progress }) {
  const { t } = useLanguage();
  const Icon = iconMap[game.type];
  const gradientClass = colorMap[game.type];
  
  const averageScore = progress.length > 0 
    ? Math.round(progress.reduce((sum, p) => sum + (p.score / p.max_score * 100), 0) / progress.length)
    : 0;

  return (
    <motion.div
      
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      
      // onClick={onClick}
      className="cursor-pointer"
    >
      <Card className="overflow-hidden bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 border-0">
        <div className={`h-24 bg-gradient-to-r ${gradientClass} flex items-center justify-center relative overflow-hidden`}>
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute inset-0 w-full h-full flex items-center justify-center">
            <div className="relative w-full h-full">
              <Image fill src={game.image_url} alt={game.title} className="w-10 h-10 object-cover object-top" />
              {/* {JSON.stringify(game)} */}
            </div>
          </div>
          {/* <Icon className="w-10 h-10 text-white relative z-10" /> */}
          <div className="absolute top-2 right-2">
            <Badge className={`${difficultyColors[game.difficulty]} border-0 text-xs`}>
              {t(`games.${game.difficulty}`)}
            </Badge>
          </div>
        </div>
        <CardContent className="p-4">
          <h3 className="font-bold text-lg text-gray-800 mb-2">{game.title}</h3>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500 capitalize">{t(`games.${game.type}`)}</span>
            {progress.length > 0 && (
              <div className="flex items-center gap-2">
                <div className="w-12 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full bg-gradient-to-r ${gradientClass} transition-all duration-300`}
                    style={{ width: `${averageScore}%` }}
                  ></div>
                </div>
                <span className="text-gray-600 font-medium">{averageScore}%</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}