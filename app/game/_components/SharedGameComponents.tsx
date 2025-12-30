'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Progress as ProgressBar } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { CheckCircle, XCircle } from 'lucide-react'
import clsx from 'clsx'


export function GameContainer({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={clsx("min-h-full h-full max-w-2xl mx-auto p-4 overflow-y-auto", className)}>
      {children}
    </div>
  )
}

interface GameProgressHeaderProps {
  currentQuestion: number
  totalQuestions: number
  score: number
}

export function GameProgressHeader({
  currentQuestion,
  totalQuestions,
  score
}: GameProgressHeaderProps) {
  const progressPercentage = ((currentQuestion + 1) / totalQuestions) * 100

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-neutral-600">
          Question {currentQuestion + 1} of {totalQuestions}
        </span>
        <span className="text-sm font-semibold text-neutral-800">
          Score: {score}/{totalQuestions}
        </span>
      </div>
      <ProgressBar
        value={progressPercentage}
        className="h-2.5 bg-neutral-100"
      />
    </div>
  )
}

interface QuestionCardProps {
  children: React.ReactNode
  gradientFrom: string
  gradientTo: string
}

export function QuestionCard({
  children,
  gradientFrom,
  gradientTo
}: QuestionCardProps) {
  return (
    <Card className="mb-6 border-0 overflow-hidden" style={{ boxShadow: 'var(--shadow-card)' }}>
      <div
        className="h-1.5 w-full"
        style={{
          background: `linear-gradient(90deg, ${gradientFrom} 0%, ${gradientTo} 100%)`
        }}
      />
      <CardContent
        className="p-8"
        style={{
          background: `linear-gradient(135deg, ${gradientFrom}08 0%, ${gradientTo}08 100%)`
        }}
      >
        {children}
      </CardContent>
    </Card>
  )
}

interface FeedbackCardProps {
  isCorrect: boolean
  explanation?: string
  correctAnswer?: string
}

export function FeedbackCard({
  isCorrect,
  explanation,
  correctAnswer
}: FeedbackCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-6 rounded-xl border-2 ${
        isCorrect
          ? 'bg-success/5 border-success/20'
          : 'bg-error/5 border-error/20'
      }`}
      style={{ boxShadow: 'var(--shadow-card)' }}
    >
      <div className="flex items-center gap-3 mb-3">
        {isCorrect ? (
          <>
            <CheckCircle className="w-6 h-6 text-success" />
            <span className="text-success font-semibold text-lg">¡Correcto!</span>
          </>
        ) : (
          <>
            <XCircle className="w-6 h-6 text-error" />
            <span className="text-error font-semibold text-lg">No es correcto</span>
          </>
        )}
      </div>

      {!isCorrect && correctAnswer && (
        <div className="mb-4 p-4 bg-white rounded-lg border border-neutral-200">
          <p className="text-sm font-medium text-neutral-600 mb-1">Respuesta correcta:</p>
          <p className="text-lg font-semibold text-neutral-900">{correctAnswer}</p>
        </div>
      )}

      {explanation && (
        <div className="bg-white p-4 rounded-lg border border-neutral-200">
          <p className="text-neutral-700 text-sm leading-relaxed">{explanation}</p>
        </div>
      )}
    </motion.div>
  )
}

interface AnswerButtonProps {
  children: React.ReactNode
  onClick: () => void
  disabled?: boolean
  isSelected?: boolean
  isCorrect?: boolean
  isIncorrect?: boolean
}

export function AnswerButton({
  children,
  onClick,
  disabled = false,
  isSelected = false,
  isCorrect = false,
  isIncorrect = false
}: AnswerButtonProps) {
  const getButtonStyle = () => {
    if (isCorrect) {
      return 'bg-success/10 border-success text-success-700 hover:bg-success/20'
    }
    if (isIncorrect) {
      return 'bg-error/10 border-error text-error-700 hover:bg-error/20'
    }
    if (isSelected) {
      return 'bg-brand-orange/10 border-brand-orange text-brand-orange hover:bg-brand-orange/20'
    }
    return 'bg-white border-neutral-300 hover:bg-neutral-50 hover:border-neutral-400'
  }

  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      variant="outline"
      className={`
        w-full p-4 h-auto text-left justify-start font-medium text-base
        transition-all duration-200 border-2
        ${getButtonStyle()}
        ${disabled ? 'cursor-not-allowed opacity-60' : 'active:scale-95'}
      `}
      style={{ boxShadow: disabled ? 'none' : 'var(--shadow-button)' }}
    >
      {children}
    </Button>
  )
}

interface GameQuestionTextProps {
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg'
}

export function GameQuestionText({ children, size = 'md' }: GameQuestionTextProps) {
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl'
  }

  return (
    <p className={`${sizeClasses[size]} font-semibold text-neutral-800 text-center mb-6`}>
      {children}
    </p>
  )
}
