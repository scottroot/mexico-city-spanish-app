'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Progress } from '@/entities/Progress'
import type { GameProps } from '@/app/types'
import GameCompletion from '../_components/GameCompletion'
import {
  GameProgressHeader,
  QuestionCard,
  FeedbackCard,
  AnswerButton,
  GameQuestionText,
  GameContainer
} from '../_components/SharedGameComponents'


export const GAME_ID = 'vocab-colors'

export default function VocabularyGame({ game, user }: GameProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
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

  const handleAnswerSelect = (answer: string) => {
    if (showResult) return

    setSelectedAnswer(answer)
    setShowResult(true)

    if (answer === currentQuestion.correct_answer) {
      setScore(score + 1)
    } else {
      setMistakes(mistakes + 1)
    }

    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1)
        setSelectedAnswer(null)
        setShowResult(false)
      } else {
        // Game completed
        const completionTime = Math.round((Date.now() - startTime) / 1000)
        const finalScore = score + (answer === currentQuestion.correct_answer ? 1 : 0)
        const finalMistakes = mistakes + (answer === currentQuestion.correct_answer ? 0 : 1)

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

        setCompleted(true);
      }
    }, 2000)
  }

  return (
    <GameContainer>
      <GameProgressHeader
        currentQuestion={currentQuestionIndex}
        totalQuestions={questions.length}
        score={score}
      />

      <QuestionCard
        gradientFrom="var(--color-vocabulary-from)"
        gradientTo="var(--color-vocabulary-to)"
      >
        <GameQuestionText size="lg">
          {currentQuestion.question}
        </GameQuestionText>
        {currentQuestion.image && (
          <img
            src={currentQuestion.image}
            alt="Pregunta"
            className="mx-auto rounded-lg max-w-xs"
          />
        )}
      </QuestionCard>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AnimatePresence>
          {currentQuestion.options?.map((option: string, index: number) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <AnswerButton
                onClick={() => handleAnswerSelect(option)}
                disabled={showResult}
                isCorrect={showResult && option === currentQuestion.correct_answer}
                isIncorrect={showResult && selectedAnswer === option && option !== currentQuestion.correct_answer}
              >
                {option}
              </AnswerButton>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {showResult && (
        <div className="mt-6">
          <FeedbackCard
            isCorrect={selectedAnswer === currentQuestion.correct_answer}
            explanation={currentQuestion.explanation}
            correctAnswer={selectedAnswer !== currentQuestion.correct_answer ? currentQuestion.correct_answer : undefined}
          />
        </div>
      )}
    </GameContainer>
  )
}
