'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Volume2, Play } from 'lucide-react'
import { playTTS, fallbackTTS } from '@/lib/tts-client'
import { Progress } from '@/entities/Progress'
import type { GameProps } from '@/app/types'
import GameCompletion from '../_components/GameCompletion'
import {
  GameProgressHeader,
  QuestionCard,
  FeedbackCard,
  AnswerButton
} from '../_components/SharedGameComponents'

export const GAME_ID = 'pronunciation-sinalefa'

export default function PronunciationGame({ game, user }: GameProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [startTime] = useState(Date.now());
  const [completed, setCompleted] = useState(false)

  if (completed) {
    return <GameCompletion gameTitle={game.title} onPlayAgain={() => setCompleted(false)} user={user} />
  }
  
  const questions = game.content.questions || [];
  const currentQuestion = questions[currentQuestionIndex];
  
  if (!currentQuestion) return null;

  const playAudio = async (text: string) => {
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

  const handleAnswerSelect = (answer: string) => {
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

        setCompleted(true);
      }
    }, 3000);
  };

  return (
    <div className="h-full max-w-2xl mx-auto p-4 overflow-y-auto">
      <GameProgressHeader
        currentQuestion={currentQuestionIndex}
        totalQuestions={questions.length}
        score={score}
      />

      <QuestionCard
        gradientFrom="var(--color-pronunciation-from)"
        gradientTo="var(--color-pronunciation-to)"
      >
        <div className="flex items-center justify-center gap-2 mb-4">
          <Volume2 className="w-6 h-6 text-brand-purple" />
          <h2 className="text-xl font-bold text-neutral-800">
            {currentQuestion.type === 'sinalefa' ? 'Identifica la Sinalefa' : 'División Silábica'}
          </h2>
        </div>

        <p className="text-lg text-neutral-700 mb-4 text-center">{currentQuestion.instruction}</p>

        <div className="bg-white p-6 rounded-lg shadow-inner mb-4">
          <div className="flex items-center justify-center gap-3 mb-3">
            <span className="text-2xl font-bold text-brand-purple">
              {currentQuestion.phrase}
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                if (!currentQuestion.phrase) {
                  console.error('TTS | PronunciationGame | No phrase found for current question');
                  return;
                };
                playAudio(currentQuestion.phrase)
              }}
              className="text-brand-purple hover:bg-purple-50"
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
      </QuestionCard>

      <div className="grid grid-cols-1 gap-3">
        <AnimatePresence>
          {currentQuestion.options?.map((option: string, index: number) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <AnswerButton
                onClick={() => handleAnswerSelect(option)}
                disabled={showResult}
                isCorrect={showResult && option === currentQuestion.correct_answer}
                isIncorrect={showResult && selectedAnswer === option && option !== currentQuestion.correct_answer}
              >
                <div className="flex items-center gap-3 w-full">
                  <span className="text-lg font-mono flex-1">{option}</span>
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!currentQuestion.phrase) {
                        console.error('TTS | PronunciationGame | No phrase found for current question');
                        return;
                      };
                      playAudio(currentQuestion.phrase);
                    }}
                    className="w-8 h-8 text-brand-purple hover:bg-purple-100 rounded-md flex items-center justify-center cursor-pointer transition-colors"
                  >
                    <Volume2 className="w-4 h-4" />
                  </div>
                </div>
              </AnswerButton>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {showResult && (
        <div className="mt-6">
          <FeedbackCard
            isCorrect={selectedAnswer === currentQuestion.correct_answer}
            explanation={
              currentQuestion.explanation && currentQuestion.type === 'sinalefa'
                ? `${currentQuestion.explanation}\n\nLa sinalefa conecta la vocal final de una palabra con la vocal inicial de la siguiente.`
                : currentQuestion.explanation
            }
            correctAnswer={selectedAnswer !== currentQuestion.correct_answer ? currentQuestion.correct_answer : undefined}
          />
        </div>
      )}
    </div>
  );
}