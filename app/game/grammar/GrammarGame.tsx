'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Lightbulb } from 'lucide-react'
import { Progress } from '@/entities/Progress'
import type { GameProps } from '@/app/types'
import GameCompletion from '../_components/GameCompletion'
import {
  GameProgressHeader,
  QuestionCard,
  FeedbackCard,
  GameQuestionText,
  GameContainer
} from '../_components/SharedGameComponents'


export const GAME_ID = 'grammar-ser-estar';

export default function GrammarGame({ game, user }: GameProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [userAnswer, setUserAnswer] = useState('')
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)
  const [mistakes, setMistakes] = useState(0)
  const [startTime] = useState(Date.now())
  const [completed, setCompleted] = useState(false)

  if (completed) {
    return <GameCompletion gameTitle={game.title} onPlayAgain={() => setCompleted(false)} user={user} />
  }

  const questions = game.content.questions || []
  const currentQuestion = questions[currentQuestionIndex]

  if (!currentQuestion) return null

  const handleSubmit = () => {
    if (showResult || !userAnswer.trim()) return

    setShowResult(true)

    const isCorrect = userAnswer.toLowerCase().trim() === currentQuestion.correct_answer.toLowerCase().trim()

    if (isCorrect) {
      setScore(score + 1)
    } else {
      setMistakes(mistakes + 1)
    }

    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1)
        setUserAnswer('')
        setShowResult(false)
      } else {
        // Game completed
        const completionTime = Math.round((Date.now() - startTime) / 1000)
        const finalScore = score + (isCorrect ? 1 : 0)
        const finalMistakes = mistakes + (isCorrect ? 0 : 1)

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
              console.log('Progress info:', result.message)
            } else {
              console.log('Progress saved successfully:', result.data)
            }
          } else {
            console.error('Failed to save progress:', result.error)
          }
        })

        setCompleted(true)
      }
    }, 3000)
  }

  const isCorrect = showResult && userAnswer.toLowerCase().trim() === currentQuestion.correct_answer.toLowerCase().trim()

  return (
    <GameContainer>
      <GameProgressHeader
        currentQuestion={currentQuestionIndex}
        totalQuestions={questions.length}
        score={score}
      />

      <QuestionCard
        gradientFrom="var(--color-grammar-from)"
        gradientTo="var(--color-grammar-to)"
      >
        <GameQuestionText size="md">
          {currentQuestion.instruction}
        </GameQuestionText>
        <div className="bg-white p-4 rounded-lg mb-4 border-l-4 border-brand-teal">
          <p className="text-lg text-neutral-700 font-medium">
            {currentQuestion.sentence}
          </p>
        </div>
        {currentQuestion.hint && (
          <div className="flex items-start gap-2 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
            <Lightbulb className="w-5 h-5 text-yellow-600 mt-0.5" />
            <p className="text-sm text-yellow-800">{currentQuestion.hint}</p>
          </div>
        )}
      </QuestionCard>

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
        <div className="mt-6">
          <FeedbackCard
            isCorrect={isCorrect}
            explanation={currentQuestion.explanation}
            correctAnswer={!isCorrect ? currentQuestion.correct_answer : undefined}
          />
        </div>
      )}
    </GameContainer>
  )
}
