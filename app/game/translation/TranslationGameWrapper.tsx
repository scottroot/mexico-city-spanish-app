'use client';

import React, { useState } from 'react';
import TranslationGameStart, { TranslationDirection } from './TranslationGameStart';
import TranslationGame from './TranslationGame';
import type { UserData } from '@/app/types';
import GameCompletion from '../_components/GameCompletion';


export default function TranslationGameWrapper({ user }: { user: UserData }) {
  const [started, setStarted] = useState(false);
  const [customFocus, setCustomFocus] = useState<string | undefined>();
  const [resumeQuizId, setResumeQuizId] = useState<string | null>(null);
  // Temporarily disabled: Spanish to English option - fixed to English to Spanish only
  const [translationDirection, setTranslationDirection] = useState<TranslationDirection>('en_to_es');
  const [completed, setCompleted] = useState(false)

  if (completed) {
    return <GameCompletion gameTitle="Translation Game" onPlayAgain={() => setCompleted(false)} user={user} />
  }
  
  const handleStart = (focus?: string, direction?: TranslationDirection) => {
    setCustomFocus(focus);
    setTranslationDirection(direction || 'en_to_es'); // Default to English to Spanish
    setResumeQuizId(null); // Clear resume ID for new quiz
    setStarted(true);
  };

  const handleResume = (quizId: string) => {
    setResumeQuizId(quizId);
    setStarted(true);
  };

  const handleComplete = () => {
    setStarted(false);
    setCustomFocus(undefined);
    setResumeQuizId(null);
    setTranslationDirection('en_to_es');
    setCompleted(true);
  };

  if (!started) {
    return <TranslationGameStart user={user} onStart={handleStart} onResumeQuiz={handleResume} />;
  }

  return (
    <TranslationGame
      customFocus={customFocus}
      translationDirection={translationDirection}
      onComplete={handleComplete}
      resumeQuizId={resumeQuizId}
    />
  );
}

