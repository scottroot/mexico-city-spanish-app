'use client';

/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import React, { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useHookstate } from '@hookstate/core';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Progress as ProgressBar } from '@/components/ui/progress';
import { CheckCircle, XCircle, Eye, EyeOff, Volume2, X, AlertCircle } from 'lucide-react';
import { Progress } from '@/entities/Progress';
import { QuizQuestion, QuizResult } from '@/types/quiz';

interface CustomQuizGameProps {
  questions: QuizQuestion[];
  onComplete: (result: QuizResult) => void;
}

export default function CustomQuizGame({ questions, onComplete }: CustomQuizGameProps) {
  const router = useRouter();
  const state = useHookstate({
    currentQuestionIndex: 0,
    userAnswer: '',
    showResult: false,
    showInfinitive: false,
    score: 0,
    mistakes: 0,
    userAnswers: [] as string[],
    correctAnswers: [] as boolean[],
    startTime: Date.now(),
    showQuitConfirm: false
  });

  const inputRef = useRef<HTMLInputElement>(null);
  const currentQuestion = questions[state.currentQuestionIndex.get()];
  
  // Debug logging
  console.log('Quiz Debug:', {
    totalQuestions: questions.length,
    currentIndex: state.currentQuestionIndex.get(),
    currentQuestion: currentQuestion?.id
  });
  
  if (!currentQuestion) return null;
  
  const handleSubmit = () => {
    if (state.showResult.get() || !state.userAnswer.get().trim()) return;

    state.showResult.set(true);

    const isCorrect = state.userAnswer.get().toLowerCase().trim() === currentQuestion.correctAnswer.toLowerCase().trim();

    if(isCorrect) state.score.set(s => s + 1);
    else state.mistakes.set(m => m + 1);

    // Store the answer
    // state.userAnswers.set(prev => [...prev, state.userAnswer.get()]);
    state.userAnswers[state.userAnswers.length].set(state.userAnswer.get());
    // state.correctAnswers.set(prev => [...prev, isCorrect]);
    state.correctAnswers[state.correctAnswers.length].set(isCorrect);
    
    // If answer is correct, auto-advance after 1 second
    // If answer is wrong, wait for user to click "Next Question"
    if (isCorrect) {
      setTimeout(() => {
        const currentIndex = state.currentQuestionIndex.get();
        if (currentIndex < questions.length - 1) {
          // state.userAnswer.set('');
          // state.showResult.set(false);
          // state.showInfinitive.set(false);
          // state.currentQuestionIndex.set(i => i + 1);
          state.merge(prev => ({
            userAnswer: '',
            showResult: false,
            showInfinitive: false,
            currentQuestionIndex: prev.currentQuestionIndex + 1
          }))
        } else {
          // Quiz completed
          console.log('Quiz completed!', {
            currentIndex,
            totalQuestions: questions.length,
            isCorrect
          });
          const completionTime = Math.round((Date.now() - state.startTime.get()) / 1000);
          const finalScore = state.score.get() + (isCorrect ? 1 : 0);
          const finalMistakes = state.mistakes.get() + (isCorrect ? 0 : 1);
          
          const result: QuizResult = {
            score: finalScore,
            totalQuestions: questions.length,
            mistakes: finalMistakes,
            completionTime,
            questions,
            userAnswers: [...state.userAnswers.get(), state.userAnswer.get()],
            correctAnswers: [...state.correctAnswers.get(), isCorrect]
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
    state.showInfinitive.set(s => !s);
  };
  
  const playAudio = async (text: string, includePronoun: boolean = true) => {
    try {
      // For infinitive, don't include pronoun. For conjugations, include pronoun for context
      const contextText = includePronoun ? `${currentQuestion.pronoun} ${text}` : text;
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

  const handleQuitQuiz = () => {
    state.showQuitConfirm.set(true);
  };

  const confirmQuit = () => {
    // Navigate back to quiz setup page
    router.push('/quiz');
  };

  const cancelQuit = () => {
    state.showQuitConfirm.set(false);
  };
  
  const isCorrect = state.showResult.get() && (() => {
    const userAnswerClean = state.userAnswer.get().toLowerCase().trim();
    const correctAnswerClean = currentQuestion.correctAnswer.toLowerCase().trim();

    // Check if user answer matches exactly
    if (userAnswerClean === correctAnswerClean) {
      return true;
    }

    // Check if user answer includes the pronoun + correct answer
    const answerWithPronoun = `${currentQuestion.pronoun.toLowerCase()} ${correctAnswerClean}`;
    if (userAnswerClean === answerWithPronoun) {
      return true;
    }

    return false;
  })();
  const progressPercentage = ((state.currentQuestionIndex.get() + 1) / questions.length) * 100;
  
  // Handle Enter key for "Next Question" when answer is wrong
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && state.showResult.get() && !isCorrect && state.currentQuestionIndex.get() < questions.length - 1) {
        // state.currentQuestionIndex.set(i => i + 1);
        // state.userAnswer.set('');
        // state.showResult.set(false);
        // state.showInfinitive.set(false);
        state.merge(prev => ({
          currentQuestionIndex: prev.currentQuestionIndex + 1,
          userAnswer: '',
          showResult: false,
          showInfinitive: false
        }))
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [state, state.showResult, isCorrect, state.currentQuestionIndex, questions.length]);
  
  // Focus input when question changes
  useEffect(() => {
    if (inputRef.current && !state.showResult.get()) {
      inputRef.current.focus();
    }
  }, [state.currentQuestionIndex, state.showResult]);
  
  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto p-4">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600">
            Question {state.currentQuestionIndex.get() + 1} of {questions.length}
          </span>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-800">
              Score: {state.score.get()}/{questions.length}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleQuitQuiz}
              className="text-red-600 border-red-300 hover:bg-red-50 hover:border-red-400"
            >
              <X className="w-4 h-4 mr-1" />
              Quit
            </Button>
          </div>
        </div>
        <ProgressBar value={progressPercentage} className="h-2" />
      </div>

      <Card id="quiz-card" className="mb-6 bg-gradient-to-br from-orange-50 to-pink-50 border-0 shadow-lg">
        <CardContent className="px-6 py-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {currentQuestion.englishPhrase}
            </h2>
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="text-lg text-gray-600">
                {currentQuestion.tenseEnglish}
              </span>
              <span className="text-gray-400">-</span>
              <span className="text-lg text-gray-600">
                {currentQuestion.moodEnglish}
              </span>
            </div>
            
            {/* Reveal Infinitive Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleRevealInfinitive}
              className="mb-4"
            >
              {state.showInfinitive.get() ? (
                <>
                  <EyeOff className="w-4 h-4 mr-2" />
                  Hide Infinitive
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4 mr-2" />
                  Reveal Infinitive
                </>
              )}
            </Button>

            {state.showInfinitive.get() && (
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
                    onClick={() => playAudio(currentQuestion.infinitive, false)}
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

      <Card id="quiz-input" className="mb-6 border-none bg-none shadow-none">
        <CardContent className="pl-0 pr-0 pt-0 pb-0">
          <div className="flex gap-2">
            <Input
              ref={inputRef}
              value={state.userAnswer.get()}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => state.userAnswer.set(e.target.value)}
              placeholder='Type your answer here...'
              className="flex-1 text-base bg-gray-50 focus:ring-0 focus-visible:ring-0 border-2 border-gray-300 focus-visible:border-orange-500"
              disabled={state.showResult.get()}
              onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && handleSubmit()}
            />
            <Button
              onClick={handleSubmit}
              disabled={state.showResult.get() || !state.userAnswer.get().trim()}
              className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 pt-2 pb-2!"
            >
              Submit
            </Button>
          </div>
        </CardContent>
      </Card>

      {state.showResult.get() && (
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
                  Excellent!
                </span>
              </>
            ) : (
              <>
                <XCircle className="w-6 h-6 text-red-600" />
                <span className="text-red-800 font-semibold text-lg">
                  Not correct
                </span>
              </>
            )}
          </div>
          
          {!isCorrect && (
            <div className="mb-4 flex items-center">
              <p className="text-gray-500 mr-2">
                <strong>Correct answer:</strong>
              </p>
              <div className="flex items-center gap-2">
                <span className="text-lg leading-none font-medium text-gray-800">
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
              <strong>Explanation:</strong>
            </p>
            <p className="text-gray-600">
              {currentQuestion.explanation}
            </p>
            <div className="mt-2 text-sm text-gray-500">
              <p>
                <strong>Verb:</strong> {currentQuestion.infinitive} ({currentQuestion.infinitiveEnglish})
              </p>
            </div>
          </div>
          
          {/* Show Next Question button when answer is wrong */}
          {!isCorrect && (
            <div className="mt-4 flex justify-center">
              {state.currentQuestionIndex.get() < questions.length - 1 ? (
                <Button
                  onClick={() => {
                    // state.currentQuestionIndex.set(i => i + 1);
                    // state.userAnswer.set('');
                    // state.showResult.set(false);
                    // state.showInfinitive.set(false);
                    state.merge(prev => ({
                      currentQuestionIndex: prev.currentQuestionIndex + 1,
                      userAnswer: '',
                      showResult: false,
                      showInfinitive: false
                    }))
                  }}
                  className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600"
                >
                  Next Question
                  <span className="ml-2 text-xs opacity-75">(Enter)</span>
                </Button>
              ) : (
                <Button
                  onClick={() => {
                    const completionTime = Math.round((Date.now() - state.startTime.get()) / 1000);

                    const result: QuizResult = {
                      score: state.score.get(),
                      totalQuestions: questions.length,
                      mistakes: state.mistakes.get() + 1,
                      completionTime,
                      questions,
                      userAnswers: [...state.userAnswers.get(), state.userAnswer.get()],
                      correctAnswers: [...state.correctAnswers.get(), false]
                    };

                    // Save progress to database
                    Progress.create({
                      game_id: 'custom_quiz',
                      score: state.score.get(),
                      max_score: questions.length,
                      completion_time: completionTime,
                      mistakes: state.mistakes.get() + 1
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
                  }}
                  className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600"
                >
                  Finish Quiz
                </Button>
              )}
            </div>
          )}
        </motion.div>
      )}

      {/* Quit Confirmation Modal */}
      {state.showQuitConfirm.get() && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={cancelQuit}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 p-6"
          >
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Quit Quiz?
                </h3>
                <p className="text-sm text-gray-600">
                  Are you sure you want to quit? Your progress will not be saved and you'll need to start over.
                </p>
              </div>
            </div>

            <div className="flex gap-3 justify-end mt-6">
              <Button
                variant="outline"
                onClick={cancelQuit}
                className="border-gray-300"
              >
                Continue Quiz
              </Button>
              <Button
                onClick={confirmQuit}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Quit Quiz
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
