'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, Target, RotateCcw, BookOpen, Play } from 'lucide-react';
import { format } from 'date-fns';

import { TranslationDirection, PastQuiz } from './TranslationGameStart';

interface PastQuizzesListProps {
  quizzes: PastQuiz[];
  onStartSimilar: (customFocus: string | null, direction?: TranslationDirection) => void;
  onViewStudyGuide: (quizId: string) => void;
  onResumeQuiz: (quizId: string) => void;
}

export default function PastQuizzesList({ quizzes, onStartSimilar, onViewStudyGuide, onResumeQuiz }: PastQuizzesListProps) {
  if (quizzes.length === 0) {
    return null;
  }

  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Past Quizzes</h3>
      <div className="space-y-3">
        {quizzes.map((quiz) => (
          <Card key={quiz.id} className="border border-gray-200">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">
                      {format(new Date(quiz.created_at), 'MMM d, yyyy')}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-1">
                    {quiz.translation_direction && (
                      <span className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-700 font-medium">
                        {quiz.translation_direction === 'es_to_en' ? 'ES → EN' : 'EN → ES'}
                      </span>
                    )}
                    {(quiz.focus_display_name || quiz.custom_focus) && (
                      <p className="text-sm font-medium text-gray-800">
                        Focus: {
                          quiz.focus_display_name ||
                          (quiz.custom_focus && quiz.custom_focus.length > 40
                            ? quiz.custom_focus.substring(0, 40) + '...'
                            : quiz.custom_focus) ||
                          'General Practice'
                        }
                      </p>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Target className="w-4 h-4" />
                      <span>
                        {quiz.completed
                          ? `${quiz.score}/${quiz.questions_count} correct`
                          : `${quiz.questions_count} questions attempted`}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="ml-4 flex flex-col gap-2">
                  {!quiz.completed ? (
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => onResumeQuiz(quiz.id)}
                      className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Resume Quiz
                    </Button>
                  ) : quiz.study_guide ? (
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => onViewStudyGuide(quiz.id)}
                      className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white"
                    >
                      <BookOpen className="w-4 h-4 mr-2" />
                      View Study Guide
                    </Button>
                  ) : null}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onStartSimilar(quiz.custom_focus, quiz.translation_direction || undefined)}
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Start Similar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

