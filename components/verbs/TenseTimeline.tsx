'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Volume2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { playTTS, fallbackTTS } from '../../lib/tts-client';

export default function TenseTimeline() {
  // TTS function using your existing pattern
  const playAudio = async (text: string) => {
    try {
      console.log('Playing TTS for:', text);
      await playTTS(text);
      console.log('TTS audio played successfully');
    } catch (error) {
      console.error('Error with TTS:', error);
      fallbackTTS(text);
    }
  };

  const tenseCategories = [
    {
      title: 'Indicative',
      description: 'Used for facts, statements, and questions',
      tenses: [
        { spanish: 'Presente', english: 'Present', color: 'bg-blue-500' },
        { spanish: 'Pretérito Perfecto', english: 'Present Perfect', color: 'bg-blue-400' },
        { spanish: 'Pretérito Indefinido', english: 'Preterite', color: 'bg-blue-600' },
        { spanish: 'Pretérito Imperfecto', english: 'Imperfect', color: 'bg-blue-300' },
        { spanish: 'Pretérito Pluscuamperfecto', english: 'Past Perfect', color: 'bg-blue-700' },
        { spanish: 'Futuro Simple', english: 'Future', color: 'bg-green-500' },
        { spanish: 'Futuro Perfecto', english: 'Future Perfect', color: 'bg-green-400' },
        { spanish: 'Condicional Simple', english: 'Conditional', color: 'bg-purple-500' },
        { spanish: 'Condicional Perfecto', english: 'Conditional Perfect', color: 'bg-purple-400' }
      ]
    },
    {
      title: 'Subjunctive',
      description: 'Used for desires, doubts, and emotions',
      tenses: [
        { spanish: 'Presente', english: 'Present', color: 'bg-orange-500' },
        { spanish: 'Pretérito Perfecto', english: 'Present Perfect', color: 'bg-orange-400' },
        { spanish: 'Pretérito Imperfecto', english: 'Imperfect', color: 'bg-orange-600' },
        { spanish: 'Pretérito Pluscuamperfecto', english: 'Past Perfect', color: 'bg-orange-700' },
        { spanish: 'Futuro', english: 'Future', color: 'bg-orange-300' },
        { spanish: 'Futuro Perfecto', english: 'Future Perfect', color: 'bg-orange-800' }
      ]
    },
    {
      title: 'Imperative',
      description: 'Used for commands and requests',
      tenses: [
        { spanish: 'Afirmativo', english: 'Affirmative', color: 'bg-pink-500' },
        { spanish: 'Negativo', english: 'Negative', color: 'bg-pink-400' }
      ]
    }
  ];

  return (
    <Card className="mb-8">
      <CardHeader className="bg-gradient-to-r from-orange-500 to-pink-500 text-white">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5" />
          <CardTitle className="text-xl">
            Spanish Tenses
          </CardTitle>
        </div>
        <p className="text-orange-100 text-sm">
          Explore all Spanish verb tenses and their usage
        </p>
      </CardHeader>
      
      <CardContent className="p-6">
        <div className="space-y-8">
          {tenseCategories.map((category, categoryIndex) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: categoryIndex * 0.1 }}
            >
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {category.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {category.description}
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {category.tenses.map((tense, tenseIndex) => (
                  <motion.div
                    key={`${category.title}-${tense.spanish}`}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ 
                      delay: categoryIndex * 0.1 + tenseIndex * 0.05,
                      type: "spring",
                      stiffness: 100
                    }}
                    className="group"
                  >
                    <div className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-all duration-200 hover:border-orange-300">
                      <div className={`w-3 h-3 rounded-full ${tense.color} flex-shrink-0`}></div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-900 truncate">
                            {tense.spanish}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => playAudio(tense.spanish)}
                            className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-orange-100"
                          >
                            <Volume2 className="w-3 h-3 text-orange-500" />
                          </Button>
                        </div>
                        <p className="text-sm text-gray-600 truncate">
                          {tense.english}
                        </p>
                      </div>
                      
                      <Badge 
                        variant="outline" 
                        className="text-xs bg-gray-50 text-gray-600 border-gray-200"
                      >
                        Tense
                      </Badge>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Timeline Visualization */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h4 className="text-md font-semibold text-gray-900 mb-4">
            Time Flow
          </h4>
          
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-orange-500 via-pink-500 to-purple-500"></div>
            
            <div className="space-y-4">
              {[
                { time: 'Past', color: 'bg-red-500', position: 'left-0' },
                { time: 'Present', color: 'bg-orange-500', position: 'left-2' },
                { time: 'Future', color: 'bg-green-500', position: 'left-4' }
              ].map((item, index) => (
                <motion.div
                  key={item.time}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="relative flex items-center"
                >
                  <div className={`absolute ${item.position} w-3 h-3 ${item.color} rounded-full border-2 border-white shadow-sm`}></div>
                  <div className="ml-8">
                    <span className="font-medium text-gray-900">
                      {item.time}
                    </span>
                    <p className="text-sm text-gray-600">
                      {item.time === 'Past' && 'Actions that happened before now'}
                      {item.time === 'Present' && 'Actions happening now or general truths'}
                      {item.time === 'Future' && 'Actions that will happen after now'}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
