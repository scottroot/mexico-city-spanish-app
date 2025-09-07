'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, XCircle, RotateCcw, Home } from 'lucide-react';
import CustomQuizGame from '@/components/games/CustomQuizGame';
import { QuizQuestion, QuizResult, QuizConfig } from '@/types/quiz';
import { useLanguage } from '@/contexts/LanguageContext';

export default function QuizGamePage() {
  const { t, language } = useLanguage();
  const router = useRouter();
  
  const [quizData, setQuizData] = useState<{
    config: QuizConfig;
    questions: QuizQuestion[];
  } | null>(null);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Load quiz data from sessionStorage
    const storedQuiz = sessionStorage.getItem('customQuiz');
    if (storedQuiz) {
      try {
        const data = JSON.parse(storedQuiz);
        setQuizData(data);
      } catch (error) {
        console.error('Error parsing quiz data:', error);
        router.push('/quiz');
      }
    } else {
      router.push('/quiz');
    }
    setLoading(false);
  }, [router]);
  
  const handleQuizComplete = (result: QuizResult) => {
    setQuizResult(result);
  };
  
  const handlePlayAgain = () => {
    setQuizResult(null);
    // Reload the same quiz
    if (quizData) {
      sessionStorage.setItem('customQuiz', JSON.stringify(quizData));
      window.location.reload();
    }
  };
  
  const handleGoHome = () => {
    sessionStorage.removeItem('customQuiz');
    router.push('/');
  };
  
  const handleNewQuiz = () => {
    sessionStorage.removeItem('customQuiz');
    router.push('/quiz');
  };
  
  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-orange-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">
            {language === 'es' ? 'Cargando quiz...' : 'Loading quiz...'}
          </p>
        </div>
      </div>
    );
  }
  
  if (!quizData) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-orange-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">
            {language === 'es' ? 'No se encontró el quiz' : 'Quiz not found'}
          </p>
          <Button onClick={() => router.push('/quiz')}>
            {language === 'es' ? 'Crear Nuevo Quiz' : 'Create New Quiz'}
          </Button>
        </div>
      </div>
    );
  }
  
  if (quizResult) {
    // Quiz completed - show results
    const percentage = Math.round((quizResult.score / quizResult.totalQuestions) * 100);
    const isExcellent = percentage >= 90;
    const isGood = percentage >= 70;
    
    return (
      <div className="min-h-full bg-gradient-to-br from-orange-50 to-pink-50 p-4">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className={`w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center ${
              isExcellent ? 'bg-green-100' : isGood ? 'bg-yellow-100' : 'bg-red-100'
            }`}>
              {isExcellent ? (
                <CheckCircle className="w-10 h-10 text-green-600" />
              ) : (
                <XCircle className="w-10 h-10 text-red-600" />
              )}
            </div>
            
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {language === 'es' ? '¡Quiz Completado!' : 'Quiz Completed!'}
            </h1>
            
            <div className="text-6xl font-bold mb-4">
              <span className={isExcellent ? 'text-green-600' : isGood ? 'text-yellow-600' : 'text-red-600'}>
                {percentage}%
              </span>
            </div>
            
            <p className="text-lg text-gray-600 mb-6">
              {isExcellent 
                ? (language === 'es' ? '¡Excelente trabajo!' : 'Excellent work!')
                : isGood 
                ? (language === 'es' ? '¡Buen trabajo!' : 'Good work!')
                : (language === 'es' ? '¡Sigue practicando!' : 'Keep practicing!')
              }
            </p>
          </motion.div>
          
          <Card className="mb-6 bg-white shadow-lg">
            <CardContent className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-orange-600">
                    {quizResult.score}
                  </div>
                  <div className="text-sm text-gray-600">
                    {language === 'es' ? 'Correctas' : 'Correct'}
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-red-600">
                    {quizResult.mistakes}
                  </div>
                  <div className="text-sm text-gray-600">
                    {language === 'es' ? 'Incorrectas' : 'Incorrect'}
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600">
                    {quizResult.totalQuestions}
                  </div>
                  <div className="text-sm text-gray-600">
                    {language === 'es' ? 'Total' : 'Total'}
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    {Math.floor(quizResult.completionTime / 60)}:{(quizResult.completionTime % 60).toString().padStart(2, '0')}
                  </div>
                  <div className="text-sm text-gray-600">
                    {language === 'es' ? 'Tiempo' : 'Time'}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Question Review */}
          <Card className="mb-6 bg-white shadow-lg">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">
                {language === 'es' ? 'Revisión de Preguntas' : 'Question Review'}
              </h3>
              <div className="space-y-3">
                {quizResult.questions.map((question, index) => {
                  const isCorrect = quizResult.correctAnswers[index];
                  const userAnswer = quizResult.userAnswers[index];
                  
                  return (
                    <div
                      key={question.id}
                      className={`p-3 rounded-lg border ${
                        isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        {isCorrect ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-600" />
                        )}
                        <span className="font-medium">
                          {language === 'es' ? `Pregunta ${index + 1}` : `Question ${index + 1}`}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 mb-1">
                        <strong>{language === 'es' ? 'Frase:' : 'Phrase:'}</strong> {question.englishPhrase}
                      </p>
                      <p className="text-sm text-gray-700 mb-1">
                        <strong>{language === 'es' ? 'Tiempo:' : 'Tense:'}</strong> {language === 'es' ? question.tense : question.tenseEnglish}
                      </p>
                      <p className="text-sm text-gray-700 mb-1">
                        <strong>{language === 'es' ? 'Tu respuesta:' : 'Your answer:'}</strong> {userAnswer}
                      </p>
                      {!isCorrect && (
                        <p className="text-sm text-gray-700">
                          <strong>{language === 'es' ? 'Respuesta correcta:' : 'Correct answer:'}</strong> {question.correctAnswer}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={handlePlayAgain}
              className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              {language === 'es' ? 'Jugar de Nuevo' : 'Play Again'}
            </Button>
            <Button
              onClick={handleNewQuiz}
              variant="outline"
            >
              {language === 'es' ? 'Nuevo Quiz' : 'New Quiz'}
            </Button>
            <Button
              onClick={handleGoHome}
              variant="outline"
            >
              <Home className="w-4 h-4 mr-2" />
              {language === 'es' ? 'Inicio' : 'Home'}
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  // Quiz in progress
  return (
    <div className="min-h-full bg-gradient-to-br from-orange-50 to-pink-50">
      <CustomQuizGame
        questions={quizData.questions}
        onComplete={handleQuizComplete}
      />
    </div>
  );
}
