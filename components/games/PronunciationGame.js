import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress as ProgressBar } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Volume2, Play, CheckCircle, XCircle } from 'lucide-react';
import { Progress } from '@/entities/Progress';
import { playTTS, fallbackTTS } from '../../lib/tts-client';

export default function PronunciationGame({ game, onComplete }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [startTime] = useState(Date.now());
  
  const questions = game.content.questions || [];
  const currentQuestion = questions[currentQuestionIndex];
  
  if (!currentQuestion) return null;

  const playAudio = async (text) => {
    console.log('playAudio called with text:', text);
    
    try {
      await playTTS(text);
      console.log('TTS audio played successfully');
    } catch (error) {
      console.error('Error with TTS:', error);
      // Fallback to browser speech synthesis
      fallbackTTS(text);
    }
  };

  const handleAnswerSelect = (answer) => {
    if (showResult) return;
    
    setSelectedAnswer(answer);
    setShowResult(true);
    
    if (answer === currentQuestion.correct_answer) {
      setScore(score + 1);
    } else {
      setMistakes(mistakes + 1);
    }
    
    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedAnswer(null);
        setShowResult(false);
      } else {
        // Game completed
        const completionTime = Math.round((Date.now() - startTime) / 1000);
        const finalScore = score + (answer === currentQuestion.correct_answer ? 1 : 0);
        const finalMistakes = mistakes + (answer === currentQuestion.correct_answer ? 0 : 1);
        
        // Save progress to database
        Progress.create({
          game_id: game.id,
          score: finalScore,
          max_score: questions.length,
          completion_time: completionTime,
          mistakes: finalMistakes
        }).then(result => {
          if (result.success) {
            if (result.message) {
              console.log('Progress info:', result.message);
            } else {
              console.log('Progress saved successfully:', result.data);
            }
          } else {
            console.error('Failed to save progress:', result.error);
          }
        });
        
        onComplete();
      }
    }, 3000);
  };

  const progressPercentage = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600">
            Pregunta {currentQuestionIndex + 1} de {questions.length}
          </span>
          <span className="text-sm font-medium text-gray-800">
            Puntuación: {score}/{questions.length}
          </span>
        </div>
        <ProgressBar value={progressPercentage} className="h-2" />
      </div>

      <Card className="mb-6 bg-gradient-to-br from-purple-50 to-pink-50 border-0 shadow-lg">
        <CardContent className="p-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Volume2 className="w-6 h-6 text-purple-600" />
            <h2 className="text-xl font-bold text-gray-800">
              {currentQuestion.type === 'sinalefa' ? 'Identifica la Sinalefa' : 'División Silábica'}
            </h2>
          </div>
          
          <div className="mb-6">
            <p className="text-lg text-gray-700 mb-4">{currentQuestion.instruction}</p>
            
            <div className="bg-white p-6 rounded-lg shadow-inner mb-4">
              <div className="flex items-center justify-center gap-3 mb-3">
                <span className="text-2xl font-bold text-purple-800">
                  {currentQuestion.phrase}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => playAudio(currentQuestion.phrase)}
                  className="text-purple-600 hover:bg-purple-50"
                >
                  <Play className="w-4 h-4" />
                </Button>
              </div>
              
              {currentQuestion.type === 'sinalefa' && (
                <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                  Escucha cómo se conectan las palabras
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-3">
        <AnimatePresence>
          {currentQuestion.options.map((option, index) => (
            <motion.div
              key={index}
              
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              
            >
              <Button
                variant="outline"
                className={`w-full p-4 h-auto text-left transition-all duration-300 ${
                  showResult
                    ? option === currentQuestion.correct_answer
                      ? 'bg-green-100 border-green-400 text-green-800'
                      : selectedAnswer === option
                      ? 'bg-red-100 border-red-400 text-red-800'
                      : 'bg-gray-50 text-gray-500'
                    : 'hover:bg-purple-50 hover:border-purple-300'
                }`}
                onClick={() => handleAnswerSelect(option)}
                disabled={showResult}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-mono">{option}</span>
                    {/* Audio play button - using div instead of Button to avoid nesting - FIXED */}
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        playAudio(currentQuestion.phrase);
                      }}
                      className="w-8 h-8 text-purple-500 hover:bg-purple-100 rounded-md flex items-center justify-center cursor-pointer transition-colors"
                    >
                      <Volume2 className="w-4 h-4" />
                    </div>
                  </div>
                  {showResult && (
                    <div className="ml-2">
                      {option === currentQuestion.correct_answer ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : selectedAnswer === option ? (
                        <XCircle className="w-5 h-5 text-red-600" />
                      ) : null}
                    </div>
                  )}
                </div>
              </Button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {showResult && (
        <motion.div
          
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          
          className={`mt-6 p-6 rounded-lg shadow-lg border ${
            selectedAnswer === currentQuestion.correct_answer 
              ? 'bg-green-50 border-green-200' 
              : 'bg-red-50 border-red-200'
          }`}
        >
          <div className="flex items-center gap-3 mb-3">
            {selectedAnswer === currentQuestion.correct_answer ? (
              <>
                <CheckCircle className="w-6 h-6 text-green-600" />
                <span className="text-green-800 font-semibold text-lg">¡Perfecto!</span>
              </>
            ) : (
              <>
                <XCircle className="w-6 h-6 text-red-600" />
                <span className="text-red-800 font-semibold text-lg">Intenta otra vez</span>
              </>
            )}
          </div>
          
          {currentQuestion.explanation && (
            <div className="bg-white p-4 rounded-lg border">
              <p className="text-gray-700 mb-2">{currentQuestion.explanation}</p>
              {currentQuestion.type === 'sinalefa' && (
                <p className="text-sm text-gray-600 italic">
                  La sinalefa conecta la vocal final de una palabra con la vocal inicial de la siguiente.
                </p>
              )}
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}