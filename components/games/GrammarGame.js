import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Progress as ProgressBar } from '@/components/ui/progress';
import { CheckCircle, XCircle, Lightbulb } from 'lucide-react';
import { Progress } from '@/entities/Progress';

export default function GrammarGame({ game, onComplete }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [startTime] = useState(Date.now());
  
  const questions = game.content.questions || [];
  const currentQuestion = questions[currentQuestionIndex];
  
  if (!currentQuestion) return null;

  const handleSubmit = () => {
    if (showResult || !userAnswer.trim()) return;
    
    setShowResult(true);
    
    const isCorrect = userAnswer.toLowerCase().trim() === currentQuestion.correct_answer.toLowerCase().trim();
    
    if (isCorrect) {
      setScore(score + 1);
    } else {
      setMistakes(mistakes + 1);
    }
    
    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setUserAnswer('');
        setShowResult(false);
      } else {
        // Game completed
        const completionTime = Math.round((Date.now() - startTime) / 1000);
        const finalScore = score + (isCorrect ? 1 : 0);
        const finalMistakes = mistakes + (isCorrect ? 0 : 1);
        
        // Save progress to database
        Progress.create({
          game_id: game.id,
          score: finalScore,
          max_score: questions.length,
          completion_time: completionTime,
          mistakes: finalMistakes
        }).then(result => {
          if (result.success) {
            console.log('Progress saved successfully:', result.data);
          } else {
            console.error('Failed to save progress:', result.error);
          }
        });
        
        onComplete();
      }
    }, 3000);
  };

  const isCorrect = showResult && userAnswer.toLowerCase().trim() === currentQuestion.correct_answer.toLowerCase().trim();
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

      <Card className="mb-6 bg-gradient-to-br from-green-50 to-teal-50 border-0 shadow-lg">
        <CardContent className="p-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            {currentQuestion.instruction}
          </h2>
          <div className="bg-white p-4 rounded-lg mb-4 border-l-4 border-green-400">
            <p className="text-lg text-gray-700 font-medium">
              {currentQuestion.sentence}
            </p>
          </div>
          {currentQuestion.hint && (
            <div className="flex items-start gap-2 p-3 bg-yellow-50 rounded-lg">
              <Lightbulb className="w-5 h-5 text-yellow-600 mt-0.5" />
              <p className="text-sm text-yellow-800">{currentQuestion.hint}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex gap-3">
            <Input
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="Escribe tu respuesta aquí..."
              className="flex-1"
              disabled={showResult}
              onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
            />
            <Button 
              onClick={handleSubmit}
              disabled={showResult || !userAnswer.trim()}
              className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600"
            >
              Enviar
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
                <span className="text-green-800 font-semibold text-lg">¡Excelente!</span>
              </>
            ) : (
              <>
                <XCircle className="w-6 h-6 text-red-600" />
                <span className="text-red-800 font-semibold text-lg">No es correcto</span>
              </>
            )}
          </div>
          
          {!isCorrect && (
            <p className="text-gray-700 mb-2">
              <strong>Respuesta correcta:</strong> {currentQuestion.correct_answer}
            </p>
          )}
          
          {currentQuestion.explanation && (
            <div className="bg-white p-4 rounded-lg border">
              <p className="text-gray-700">{currentQuestion.explanation}</p>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}