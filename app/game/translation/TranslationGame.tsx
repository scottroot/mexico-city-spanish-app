'use client';

import Image from 'next/image';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Progress as ProgressBar } from '@/components/ui/progress';
import { CheckCircle, X as XIcon, Loader2 } from 'lucide-react';
import StudyGuideModal from './StudyGuideModal';

interface Question {
  questionId: string;
  gptPhraseToTranslate: string;
}

import { TranslationDirection } from './TranslationGameStart';

interface TranslationGameProps {
  customFocus?: string;
  translationDirection: TranslationDirection;
  onComplete: () => void;
  resumeQuizId?: string | null;
}

export default function TranslationGame({ customFocus, translationDirection, onComplete, resumeQuizId }: TranslationGameProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [isLoadingQuestion, setIsLoadingQuestion] = useState(true);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; feedback: string; correctAnswer?: string } | null>(null);
  const [quizId, setQuizId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [quizHistory, setQuizHistory] = useState<{
    question: string;
    userAnswer: string;
    isCorrect: boolean;
    feedback: string;
    correctAnswer?: string;
  }[]>([]);
  const [showStudyGuideForQuiz, setShowStudyGuideForQuiz] = useState<string | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const loadingRef = useRef(false);

  // Initialize quiz on mount and when props change
  useEffect(() => {
    let isMounted = true;

    const initializeQuiz = async () => {
      try {
        setIsLoadingQuestion(true);
        setError(null);

        if (resumeQuizId) {
          // Resume existing quiz
          const resumeResponse = await fetch(`/api/translation/quizzes/${resumeQuizId}`);

          if (!resumeResponse.ok) {
            throw new Error('Failed to load quiz');
          }

          const { quiz } = await resumeResponse.json();

          if (!isMounted) return;

          // Restore state from saved quiz
          setQuizId(quiz.id);
          setScore(quiz.score || 0);
          setMistakes(quiz.mistakes_count || 0);
          setCurrentQuestionIndex(quiz.questions_count || 0);

          // Restore quiz history if available
          if (quiz.quiz_history && Array.isArray(quiz.quiz_history)) {
            setQuizHistory(quiz.quiz_history);
          }

          // Load next question
          await loadQuestion();
        } else {
          // Create new quiz session
          const quizResponse = await fetch('/api/translation/quizzes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ customFocus, translationDirection }),
          });

          if (!quizResponse.ok) {
            throw new Error('Failed to create quiz session');
          }

          const quizData = await quizResponse.json();

          if (!isMounted) return;

          setQuizId(quizData.quizId);

          // Load first question
          await loadQuestion();
        }
      } catch (err) {
        if (!isMounted) return;
        console.error('Error initializing quiz:', err);
        setError(err instanceof Error ? err.message : 'Failed to initialize quiz');
        setIsLoadingQuestion(false);
      }
    };

    // Reset state for new quiz
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setScore(0);
    setMistakes(0);
    setUserAnswer('');
    setShowResult(false);
    setFeedback(null);
    setQuizId(null);
    setQuizHistory([]);

    initializeQuiz();

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customFocus, translationDirection, resumeQuizId]);

  const loadQuestion = useCallback(async () => {
    if (loadingRef.current) return;

    loadingRef.current = true;
    setIsLoadingQuestion(true);
    setError(null);
    setUserAnswer('');

    try {
      // Extract previous phrases from questions state
      const previousPhrases = questions.map(q => q.gptPhraseToTranslate);

      const response = await fetch('/api/translation/generate-question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customFocus,
          translationDirection,
          previousPhrases, // Pass previous phrases to avoid repetition
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate question');
      }

      const data = await response.json();
      const newQuestion: Question = {
        questionId: data.questionId,
        gptPhraseToTranslate: data.phrase,
      };

      setQuestions((prev) => [...prev, newQuestion]);
      setCurrentQuestionIndex((prev) => prev + (prev === 0 && questions.length === 0 ? 0 : 1));
      setIsLoadingQuestion(false);
    } catch (err) {
      console.error('Error loading question:', err);
      setError(err instanceof Error ? err.message : 'Failed to load question');
      setIsLoadingQuestion(false);
    } finally {
      loadingRef.current = false;
    }
  }, [questions, customFocus, translationDirection]);

  const updateQuizStats = async (questionsCount: number, currentScore: number, updatedHistory?: any[]) => {
    if (!quizId) return;

    try {
      const payload: any = {
        questions_count: questionsCount,
        score: currentScore,
      };

      // Save quiz_history if provided (for resume functionality)
      if (updatedHistory) {
        payload.quiz_history = updatedHistory;
        payload.mistakes_count = updatedHistory.filter(h => !h.isCorrect).length;
      }

      await fetch(`/api/translation/quizzes/${quizId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } catch (err) {
      console.error('Error updating quiz:', err);
    }
  };

  const handleSubmit = async () => {
    if (showResult || !userAnswer.trim() || isEvaluating) return;

    setIsEvaluating(true);
    setError(null);

    try {
      const currentQuestion = questions[currentQuestionIndex];
      const response = await fetch('/api/translation/evaluate-answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionId: currentQuestion.questionId,
          userTranslation: userAnswer.trim(),
          translationDirection,
          gptPhraseToTranslate: currentQuestion.gptPhraseToTranslate,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to evaluate answer');
      }

      const result = await response.json();
      setFeedback(result);
      setShowResult(true);

      // Build new history entry
      const newHistoryEntry = {
        question: currentQuestion.gptPhraseToTranslate,
        userAnswer: userAnswer.trim(),
        isCorrect: result.isCorrect,
        feedback: result.feedback,
        correctAnswer: result.correctAnswer
      };

      // Update quiz history state
      const updatedHistory = [...quizHistory, newHistoryEntry];
      setQuizHistory(updatedHistory);

      const answeredCount = currentQuestionIndex + 1;
      let newScore = score;

      if (result.isCorrect) {
        newScore = score + 1;
        setScore(newScore);
      } else {
        setMistakes((prev) => prev + 1);
      }

      // Update quiz stats AND save history to database
      await updateQuizStats(answeredCount, newScore, updatedHistory);

      setIsEvaluating(false);
    } catch (err) {
      console.error('Error evaluating answer:', err);
      setError(err instanceof Error ? err.message : 'Failed to evaluate answer');
      setIsEvaluating(false);
    }
  };

  const handleNext = useCallback(async () => {
    setUserAnswer('');
    setShowResult(false);
    setFeedback(null);
    await loadQuestion();
  }, [loadQuestion]);

  const handleFinish = async () => {
    if (quizId) {
      const finalScore = feedback?.isCorrect ? score + 1 : score;
      const mistakes = quizHistory.filter(h => !h.isCorrect);

      let studyGuide = null;

      // Generate study guide if user made mistakes
      if (mistakes.length > 0) {
        try {
          const response = await fetch('/api/translation/generate-study-guide', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              mistakes,
              translationDirection,
              customFocus
            })
          });

          if (response.ok) {
            const data = await response.json();
            studyGuide = data.studyGuide;
          }
        } catch (err) {
          console.error('Error generating study guide:', err);
        }
      }

      // Update quiz with final stats + study guide
      await fetch(`/api/translation/quizzes/${quizId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          completed: true,
          score: finalScore,
          questions_count: currentQuestionIndex + 1,
          study_guide: studyGuide,
          mistakes_count: mistakes.length
        }),
      }).catch((err) => console.error('Error completing quiz:', err));

      // Show study guide modal if one was generated
      if (studyGuide) {
        setShowStudyGuideForQuiz(quizId);
        return; // Don't call onComplete() yet - wait for modal to close
      }
    }

    onComplete();
  };

  // Auto-focus input when ready
  useEffect(() => {
    if (!showResult && !isLoadingQuestion && questions.length > 0) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [showResult, isLoadingQuestion, questions.length]);

  // Handle Enter key to move to next question when result is shown
  useEffect(() => {
    if (!showResult) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey && !isLoadingQuestion && !isEvaluating) {
        e.preventDefault();
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [showResult, isLoadingQuestion, isEvaluating, handleNext]);

  if (isLoadingQuestion && questions.length === 0) {
    return (
      <div className="h-full max-w-2xl mx-auto p-4 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-orange-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading question...</p>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  if (!currentQuestion) {
    return (
      <div className="h-full max-w-2xl mx-auto p-4 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-orange-500 mx-auto mb-4" />
          <p className="text-gray-600">Generating question...</p>
        </div>
      </div>
    );
  }

  const progressPercentage = Math.min(((currentQuestionIndex + 1) * 10), 100);

  return (
    <div className="h-full w-full max-w-3xl mx-auto p-4 overflow-y-auto">
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600">
            Question {currentQuestionIndex + 1}
          </span>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-800">
              Score: {score}
            </span>
            <Button
              onClick={handleFinish}
              variant="ghost"
              size="sm"
              className="text-xs text-gray-400 hover:text-gray-600 h-7 px-2 cursor-pointer"
            >
              End Quiz
            </Button>
          </div>
        </div>
        <ProgressBar value={progressPercentage} className="h-2" />
      </div>

      <Card className="mb-6 bg-gradient-to-br from-orange-50 to-pink-50 border-0 shadow-lg">
        <CardContent className="p-6 2xl:p-8">
          {isLoadingQuestion ? (
            <>
              <div className="bg-white p-6 rounded-lg border-l-4 border-orange-400">
                <div className="space-y-3">
                  <div className="h-8 bg-gray-200 rounded animate-pulse w-full"></div>
                  <div className="h-8 bg-gray-200 rounded animate-pulse w-full"></div>
                </div>
              </div>
              <div className="mt-4 flex justify-center">
                <div className="h-4 bg-gray-200 rounded animate-pulse w-full max-w-xs"></div>
              </div>
            </>
          ) : (
            <>
              <div className="bg-white p-6 rounded-lg border-l-4 border-orange-400">
                <p className="text-2xl text-gray-800 font-medium text-center">
                  {currentQuestion.gptPhraseToTranslate}
                </p>
              </div>
              <p className="text-sm text-gray-600 text-center mt-4">
                {translationDirection === 'es_to_en'
                  ? 'Translate this phrase to English'
                  : 'Translate this phrase to Spanish'}
              </p>
            </>
          )}
        </CardContent>
      </Card>

      <Card className="mb-6 border-0 shadow-lg">
        <CardContent className="p-0">
          <div className="relative bg-white rounded-lg border border-gray-200 shadow-sm">
            <textarea
              ref={inputRef}
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder={
                translationDirection === 'es_to_en'
                  ? 'Type your English translation...'
                  : 'Type your Spanish translation...'
              }
              className="w-full px-4 py-3 pr-20 min-h-[60px] max-h-[120px] resize-none border-0 text-lg rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 text-gray-800 placeholder:text-gray-400 transition-all duration-200 disabled:bg-gray-50 disabled:cursor-not-allowed"
              disabled={showResult || isEvaluating || isLoadingQuestion}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey && !showResult && !isEvaluating && !isLoadingQuestion && userAnswer.trim()) {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
              rows={2}
            />
            <div className="absolute bottom-2 right-2">
              <Button
                onClick={handleSubmit}
                disabled={showResult || !userAnswer.trim() || isEvaluating}
                size="sm"
                className="h-9 w-9 p-0 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 active:scale-95 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-lg flex items-center justify-center cursor-pointer"
                title="Send"
              >
                {isEvaluating ? (
                  <Loader2 className="w-5 h-5 animate-spin text-white" />
                ) : (
                  <svg
                    className="w-5 h-5 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                  </svg>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {showResult && feedback && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-6 rounded-lg shadow-lg border ${
            feedback.isCorrect
              ? 'bg-green-50 border-green-200'
              : 'bg-red-50 border-red-200'
          }`}
        >
          <div className="flex items-center gap-3 mb-3">
            {feedback.isCorrect ? (
              // <>
              //   <CheckCircle className="w-6 h-6 text-green-600" />
              //   <span className="text-green-800 font-semibold text-lg">Correct!</span>
              // </>
              <div className='flex justify-between w-full'>
                <div className='flex items-center gap-3'>
                  {/* ✅ */}
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  <span className="text-green-700 font-semibold text-2xl">Correct!</span>
                </div>
                <div className='flex max-h-[65px] overflow-visible'>
                  <div className="-mt-2.5">
                    <Image
                      id="proud"
                      src="/images/coyote-sitting-thrilled-and-proud.webp"
                      width={80}
                      height={100}
                      alt="Coyote Very Proud of your correct translation."
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className='flex justify-between w-full'>
                <div className='flex items-center gap-3'>
                  {/* <span className="text-xl">❌</span> */}
                  
                  <XIcon className="w-6 h-6 text-red-600" />
                  <span className="text-red-600 font-semibold text-2xl">Not quite right</span>
                </div>
                <div className='flex max-h-[65px] overflow-visible'>
                  <div className="-mt-2.5">
                    {(feedback?.feedback.match(/<li>/g) || []).length >= 4
                      ? <Image
                        id="very-sad"
                        src="/images/coyote-sitting-very-sad.webp"
                        width={80}
                        height={100}
                        alt="Coyote Sitting Very Sad"
                      />
                      : <Image
                        id="disappointed"
                        src="/images/coyote-sitting-disappointed.webp"
                        width={80}
                        height={100}
                        alt="Coyote Sitting Disappointed"
                      />
                    }
                  </div>
                </div>
              </div>
          )}
          </div>

          {feedback.feedback && (
            <div className="block bg-white py-4 px-2 rounded-lg border border-2 border-red-600 mb-4">
              <span
                className="text-lg [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:pl-6 [&_li]:ml-2"
                dangerouslySetInnerHTML={{ __html: feedback.feedback.replaceAll("•", "").trim() }}
              />
            </div>
          )}

          {!feedback.isCorrect && feedback.correctAnswer && (
            // <div
            //   className="text-gray-700 mb-6 text-lg"
            //   dangerouslySetInnerHTML={{ __html: `<strong>👉 Correct answer:</strong><br/>${feedback.correctAnswer}` }}
            // />
            <div className="flex flex-col gap-2 mb-6 ">
              {/* <div className="flex gap-3 text-gray-700 text-2xl font-bold"> */}
              <div className="flex gap-3 text-gray-600 text-2xl font-medium my-2">
                <span>👉</span>
                <span>Correct answer:</span>
              </div>
              <div className="relative block w-fit">
                <div
                  className="relative block px-6 py-1.5 text-black text-2xl [&_strong]:font-medium z-10"
                  // dangerouslySetInnerHTML={{ __html: `👉  ${feedback.correctAnswer}` }}
                  dangerouslySetInnerHTML={{ __html: feedback.correctAnswer }}
                />
                <div className='absolute inset-0 rounded-sm overflow-hidden w-full h-full bg-yellow-200/50 -skew-x-20'>
                  {/* <div className='w-full h-full bg-yellow-200/70 -skew-x-24 px-2' /> */}
                </div>
              </div>

            </div>
          )}

          <div className="flex justify-between md:justify-evenly items-center">
            <div className="max-md:hidden w-1/3" />
            <Button
              onClick={handleNext}
              className="text-lg bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 cursor-pointer"
              size="lg"
            >
              Next Question
            </Button>
            <div className="flex gap-1.5 items-center justify-end md:w-1/3 text-sm text-gray-500 no-select leading-none">
              Or, press <code className=" rounded-sm leading-none px-1.5 py-1 border border-gray-500 bg-gray-50">Enter</code> to continue
            </div>
          </div>
        </motion.div>
      )}

      <StudyGuideModal
        quizId={showStudyGuideForQuiz}
        onComplete={() => {
          setShowStudyGuideForQuiz(null);
          onComplete();
        }}
      />
    </div>
  );
}
