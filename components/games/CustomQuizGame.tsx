'use client';

/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Progress as ProgressBar } from '@/components/ui/progress';
import { CheckCircle, XCircle, Eye, EyeOff, Volume2 } from 'lucide-react';
import { Progress } from '@/entities/Progress';
import { QuizQuestion, QuizResult } from '@/types/quiz';

interface CustomQuizGameProps {
  questions: QuizQuestion[];
  onComplete: (result: QuizResult) => void;
}

export default function CustomQuizGame({ questions, onComplete }: CustomQuizGameProps) {
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [showInfinitive, setShowInfinitive] = useState(false);
  const [score, setScore] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [correctAnswers, setCorrectAnswers] = useState<boolean[]>([]);
  const [startTime] = useState(Date.now());
  
  const inputRef = useRef<HTMLInputElement>(null);
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
        setCurrentQuestionIndex(prevIndex => {
          if (prevIndex < questions.length - 1) {
            setUserAnswer('');
            setShowResult(false);
            setShowInfinitive(false);
            return prevIndex + 1;
          } else {
            // Quiz completed
            console.log('Quiz completed!', {
              currentIndex: prevIndex,
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
            return prevIndex;
          }
        });
      }, 1000);
    }
  };
  
  const handleRevealInfinitive = () => {
    setShowInfinitive(!showInfinitive);
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
  
  const isCorrect = showResult && (() => {
    const userAnswerClean = userAnswer.toLowerCase().trim();
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
  const progressPercentage = ((currentQuestionIndex + 1) / questions.length) * 100;
  
  // Handle Enter key for "Next Question" when answer is wrong
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && showResult && !isCorrect && currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setUserAnswer('');
        setShowResult(false);
        setShowInfinitive(false);
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [showResult, isCorrect, currentQuestionIndex, questions.length]);
  
  // Focus input when question changes
  useEffect(() => {
    if (inputRef.current && !showResult) {
      inputRef.current.focus();
    }
  }, [currentQuestionIndex, showResult]);
  
  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600">
            Question {currentQuestionIndex + 1} of {questions.length}
          </span>
          <span className="text-sm font-medium text-gray-800">
            Score: {score}/{questions.length}
          </span>
        </div>
        <ProgressBar value={progressPercentage} className="h-2" />
      </div>

      <Card className="mb-6 bg-gradient-to-br from-orange-50 to-pink-50 border-0 shadow-lg">
        <CardContent className="px-6 py-0">
          <div className="text-center mb-6">
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
              {showInfinitive ? (
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

      <Card className="mb-6">
        <CardContent className="pl-0 pr-0 pt-0 pb-0">
          <div className="flex gap-0">
            <Input
              ref={inputRef}
              value={userAnswer}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUserAnswer(e.target.value)}
              placeholder='Type your answer here...'
              className="flex-1 text-base bg-gray-50"
              disabled={showResult}
              onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && handleSubmit()}
            />
            <Button 
              onClick={handleSubmit}
              disabled={showResult || !userAnswer.trim()}
              className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 pt-2 pb-2!"
            >
              Submit
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
              {currentQuestionIndex < questions.length - 1 ? (
                <Button
                  onClick={() => {
                    setCurrentQuestionIndex(currentQuestionIndex + 1);
                    setUserAnswer('');
                    setShowResult(false);
                    setShowInfinitive(false);
                  }}
                  className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600"
                >
                  Next Question
                  <span className="ml-2 text-xs opacity-75">(Enter)</span>
                </Button>
              ) : (
                <Button
                  onClick={() => {
                    const completionTime = Math.round((Date.now() - startTime) / 1000);

                    const result: QuizResult = {
                      score,
                      totalQuestions: questions.length,
                      mistakes: mistakes + 1,
                      completionTime,
                      questions,
                      userAnswers: [...userAnswers, userAnswer],
                      correctAnswers: [...correctAnswers, false]
                    };

                    // Save progress to database
                    Progress.create({
                      game_id: 'custom_quiz',
                      score,
                      max_score: questions.length,
                      completion_time: completionTime,
                      mistakes: mistakes + 1
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
    </div>
  );
}
