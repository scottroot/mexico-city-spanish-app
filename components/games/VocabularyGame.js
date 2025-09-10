import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress as ProgressBar } from '@/components/ui/progress';
import { CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { Progress } from '@/entities/Progress';

export default function VocabularyGame({ game, onComplete }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [startTime] = useState(Date.now());
  
  const questions = game.content.questions || [];
  const currentQuestion = questions[currentQuestionIndex];
  
  if (!currentQuestion) return null;

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
    }, 2000);
  };

  const progressPercentage = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="h-full max-w-2xl mx-auto p-4 overflow-y-auto">
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

      <Card className="mb-6 bg-gradient-to-br from-orange-50 to-pink-50 border-0 shadow-lg">
        <CardContent className="p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            {currentQuestion.question}
          </h2>
          {currentQuestion.image && (
            <img 
              src={currentQuestion.image} 
              alt="Pregunta" 
              className="mx-auto mb-4 rounded-lg max-w-xs"
            />
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AnimatePresence>
          {currentQuestion.options.map((option, index) => (
            <motion.div
              key={index}
              
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              
            >
              <Button
                variant="outline"
                className={`w-full p-6 h-auto text-left transition-all duration-300 ${
                  showResult
                    ? option === currentQuestion.correct_answer
                      ? 'bg-green-100 border-green-400 text-green-800'
                      : selectedAnswer === option
                      ? 'bg-red-100 border-red-400 text-red-800'
                      : 'bg-gray-50 text-gray-500'
                    : 'hover:bg-orange-50 hover:border-orange-300'
                }`}
                onClick={() => handleAnswerSelect(option)}
                disabled={showResult}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-lg font-medium">{option}</span>
                  {showResult && (
                    <div className="ml-2">
                      {option === currentQuestion.correct_answer ? (
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      ) : selectedAnswer === option ? (
                        <XCircle className="w-6 h-6 text-red-600" />
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
          
          className="mt-6 p-4 bg-white rounded-lg shadow-lg border text-center"
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            {selectedAnswer === currentQuestion.correct_answer ? (
              <>
                <CheckCircle className="w-6 h-6 text-green-600" />
                <span className="text-green-800 font-semibold">¡Correcto!</span>
              </>
            ) : (
              <>
                <XCircle className="w-6 h-6 text-red-600" />
                <span className="text-red-800 font-semibold">Incorrecto</span>
              </>
            )}
          </div>
          {currentQuestion.explanation && (
            <p className="text-gray-600 text-sm">{currentQuestion.explanation}</p>
          )}
        </motion.div>
      )}
    </div>
  );
}