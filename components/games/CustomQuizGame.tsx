'use client';

/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Progress as ProgressBar } from '@/components/ui/progress';
import { CheckCircle, XCircle, Eye, EyeOff, Volume2 } from 'lucide-react';
import { Progress } from '@/entities/Progress';
import { QuizQuestion, QuizResult } from '@/types/quiz';
import { useLanguage } from '@/contexts/LanguageContext';

interface CustomQuizGameProps {
  questions: QuizQuestion[];
  onComplete: (result: QuizResult) => void;
}

export default function CustomQuizGame({ questions, onComplete }: CustomQuizGameProps) {
  const { t, language } = useLanguage();
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [showInfinitive, setShowInfinitive] = useState(false);
  const [score, setScore] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [correctAnswers, setCorrectAnswers] = useState<boolean[]>([]);
  const [startTime] = useState(Date.now());
  
  const currentQuestion = questions[currentQuestionIndex];
  
  // Debug logging
  console.log('Quiz Debug:', {
    totalQuestions: questions.length,
    currentIndex: currentQuestionIndex,
    currentQuestion: currentQuestion?.id
  });
  
  if (!currentQuestion) return null;
  
  const handleSubmit = () => {
    if (showResult || !userAnswer.trim()) return;
    
    setShowResult(true);
    
    const isCorrect = userAnswer.toLowerCase().trim() === currentQuestion.correctAnswer.toLowerCase().trim();
    
    if (isCorrect) {
      setScore(score + 1);
    } else {
      setMistakes(mistakes + 1);
    }
    
    // Store the answer
    setUserAnswers(prev => [...prev, userAnswer]);
    setCorrectAnswers(prev => [...prev, isCorrect]);
    
    // If answer is correct, auto-advance after 1 second
    // If answer is wrong, wait for user to click "Next Question"
    if (isCorrect) {
      setTimeout(() => {
        if (currentQuestionIndex < questions.length - 1) {
          setCurrentQuestionIndex(currentQuestionIndex + 1);
          setUserAnswer('');
          setShowResult(false);
          setShowInfinitive(false);
        } else {
          // Quiz completed
          console.log('Quiz completed!', {
            currentIndex: currentQuestionIndex,
            totalQuestions: questions.length,
            isCorrect
          });
          const completionTime = Math.round((Date.now() - startTime) / 1000);
          const finalScore = score + (isCorrect ? 1 : 0);
          const finalMistakes = mistakes + (isCorrect ? 0 : 1);
          
          const result: QuizResult = {
            score: finalScore,
            totalQuestions: questions.length,
            mistakes: finalMistakes,
            completionTime,
            questions,
            userAnswers: [...userAnswers, userAnswer],
            correctAnswers: [...correctAnswers, isCorrect]
          };
          
          // Save progress to database
          Progress.create({
            game_id: 'custom_quiz',
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
          
          onComplete(result);
        }
      }, 1000);
    }
  };
  
  const handleRevealInfinitive = () => {
    setShowInfinitive(!showInfinitive);
  };
  
  const playAudio = async (text: string) => {
    try {
      // Provide natural context for better pronunciation
      const contextText = `${currentQuestion.pronoun} ${text}`;
      const response = await fetch(`/api/tts?text=${encodeURIComponent(contextText)}`);
      if (response.ok) {
        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        audio.play();
      }
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  };
  
  const isCorrect = showResult && userAnswer.toLowerCase().trim() === currentQuestion.correctAnswer.toLowerCase().trim();
  const progressPercentage = ((currentQuestionIndex + 1) / questions.length) * 100;
  
  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600">
            {language === 'es' 
              ? `Pregunta ${currentQuestionIndex + 1} de ${questions.length}`
              : `Question ${currentQuestionIndex + 1} of ${questions.length}`
            }
          </span>
          <span className="text-sm font-medium text-gray-800">
            {language === 'es' 
              ? `Puntuación: ${score}/${questions.length}`
              : `Score: ${score}/${questions.length}`
            }
          </span>
        </div>
        <ProgressBar value={progressPercentage} className="h-2" />
      </div>

      <Card className="mb-6 bg-gradient-to-br from-orange-50 to-pink-50 border-0 shadow-lg">
        <CardContent className="p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {currentQuestion.englishPhrase}
            </h2>
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="text-lg text-gray-600">
                {language === 'es' ? currentQuestion.tense : currentQuestion.tenseEnglish}
              </span>
              <span className="text-gray-400">-</span>
              <span className="text-lg text-gray-600">
                {language === 'es' ? currentQuestion.mood : currentQuestion.moodEnglish}
              </span>
            </div>
            
            {/* Reveal Infinitive Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleRevealInfinitive}
              className="mb-4"
            >
              {showInfinitive ? (
                <>
                  <EyeOff className="w-4 h-4 mr-2" />
                  {language === 'es' ? 'Ocultar Infinitivo' : 'Hide Infinitive'}
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4 mr-2" />
                  {language === 'es' ? 'Revelar Infinitivo' : 'Reveal Infinitive'}
                </>
              )}
            </Button>
            
            {showInfinitive && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-4 rounded-lg border border-orange-200 mb-4"
              >
                <div className="flex items-center justify-center gap-2">
                  <span className="text-lg font-medium text-orange-700">
                    {currentQuestion.infinitive}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => playAudio(currentQuestion.infinitive)}
                    className="p-1"
                  >
                    <Volume2 className="w-4 h-4 text-orange-600" />
                  </Button>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {currentQuestion.infinitiveEnglish}
                </p>
              </motion.div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex gap-3">
            <Input
              value={userAnswer}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUserAnswer(e.target.value)}
              placeholder={language === 'es' ? 'Escribe tu respuesta aquí...' : 'Type your answer here...'}
              className="flex-1"
              disabled={showResult}
              onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && handleSubmit()}
            />
            <Button 
              onClick={handleSubmit}
              disabled={showResult || !userAnswer.trim()}
              className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600"
            >
              {language === 'es' ? 'Enviar' : 'Submit'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {showResult && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-6 rounded-lg shadow-lg border ${
            isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
          }`}
        >
          <div className="flex items-center gap-3 mb-3">
            {isCorrect ? (
              <>
                <CheckCircle className="w-6 h-6 text-green-600" />
                <span className="text-green-800 font-semibold text-lg">
                  {language === 'es' ? '¡Excelente!' : 'Excellent!'}
                </span>
              </>
            ) : (
              <>
                <XCircle className="w-6 h-6 text-red-600" />
                <span className="text-red-800 font-semibold text-lg">
                  {language === 'es' ? 'No es correcto' : 'Not correct'}
                </span>
              </>
            )}
          </div>
          
          {!isCorrect && (
            <div className="mb-4">
              <p className="text-gray-700 mb-2">
                <strong>{language === 'es' ? 'Respuesta correcta:' : 'Correct answer:'}</strong>
              </p>
              <div className="flex items-center gap-2">
                <span className="text-lg font-medium text-gray-800">
                  {currentQuestion.pronoun} {currentQuestion.correctAnswer}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => playAudio(currentQuestion.correctAnswer)}
                  className="p-1"
                >
                  <Volume2 className="w-4 h-4 text-gray-600" />
                </Button>
              </div>
            </div>
          )}
          
          <div className="bg-white p-4 rounded-lg border">
            <p className="text-gray-700 mb-2">
              <strong>{language === 'es' ? 'Explicación:' : 'Explanation:'}</strong>
            </p>
            <p className="text-gray-600">
              {currentQuestion.explanation}
            </p>
            <div className="mt-2 text-sm text-gray-500">
              <p>
                <strong>{language === 'es' ? 'Verbo:' : 'Verb:'}</strong> {currentQuestion.infinitive} ({currentQuestion.infinitiveEnglish})
              </p>
            </div>
          </div>
          
          {/* Show Next Question button when answer is wrong */}
          {!isCorrect && currentQuestionIndex < questions.length - 1 && (
            <div className="mt-4 flex justify-center">
              <Button
                onClick={() => {
                  setCurrentQuestionIndex(currentQuestionIndex + 1);
                  setUserAnswer('');
                  setShowResult(false);
                  setShowInfinitive(false);
                }}
                className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600"
              >
                {language === 'es' ? 'Siguiente Pregunta' : 'Next Question'}
              </Button>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
