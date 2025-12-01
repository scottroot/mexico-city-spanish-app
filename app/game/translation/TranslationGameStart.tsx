'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import PastQuizzesList from './PastQuizzesList';
import StudyGuideModal from './StudyGuideModal';
import { createClient } from '@/utils/supabase/client';
import { focusAreas } from './focus-areas';
import { UserData } from '@/utils/supabase/auth';


export interface PastQuiz {
  id: string;
  custom_focus: string | null;
  translation_direction: TranslationDirection | null;
  questions_count: number;
  score: number;
  completed: boolean;
  created_at: string;
  study_guide: string | null;
  mistakes_count: number;
  focus_display_name: string | null;
}

export type TranslationDirection = 'es_to_en' | 'en_to_es';

interface TranslationGameStartProps {
  user: UserData;
  onStart: (customFocus?: string, direction?: TranslationDirection) => void;
  onResumeQuiz: (quizId: string) => void;
}

export default function TranslationGameStart({ user, onStart, onResumeQuiz }: TranslationGameStartProps) {
  const [selectedFocusArea, setSelectedFocusArea] = useState<string>('');
  const [customFocus, setCustomFocus] = useState('');
  // Temporarily disabled: Spanish to English option
  // const [translationDirection, setTranslationDirection] = useState<TranslationDirection>('es_to_en');
  const [translationDirection] = useState<TranslationDirection>('en_to_es'); // Fixed to English to Spanish only
  const [pastQuizzes, setPastQuizzes] = useState<PastQuiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewStudyGuideQuizId, setViewStudyGuideQuizId] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      // Load past quizzes
      try {
        const response = await fetch('/api/translation/quizzes');
        if (response.ok) {
          const data = await response.json();
          setPastQuizzes(data.quizzes || []);
        }
      } catch (error) {
        console.error('Error loading past quizzes:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [user.isLoggedIn]);

  const handleStartDefault = () => {
    onStart(undefined, translationDirection);
  };

  const handleStartCustom = () => {
    // Use selected focus area prompt if available, otherwise use custom input
    let focusToUse = '';
    if (selectedFocusArea) {
      const focusArea = focusAreas.find(fa => fa.name === selectedFocusArea);
      focusToUse = focusArea?.prompt || '';
    } else if (customFocus.trim()) {
      focusToUse = customFocus.trim();
    }
    
    if (focusToUse) {
      onStart(focusToUse, translationDirection);
    }
  };

  const handleFocusAreaChange = (value: string) => {
    setSelectedFocusArea(value);
    // Clear custom focus when a predefined area is selected
    if (value) {
      setCustomFocus('');
    }
  };

  const handleCustomFocusChange = (value: string) => {
    setCustomFocus(value);
    // Clear selected focus area when typing custom focus
    if (value) {
      setSelectedFocusArea('');
    }
  };

  const handleStartSimilar = (focus: string | null, direction?: TranslationDirection) => {
    onStart(focus || undefined, direction || translationDirection);
  };

  const handleViewStudyGuide = (quizId: string) => {
    setViewStudyGuideQuizId(quizId);
  };

  // Validate custom focus input
  const validateCustomFocus = (text: string): { valid: boolean; error?: string } => {
    const trimmed = text.trim();

    if (trimmed.length === 0) return { valid: true }; // Empty is OK (will use default)

    if (trimmed.length < 10) {
      return { valid: false, error: 'Custom focus must be at least 10 characters' };
    }

    if (trimmed.length > 500) {
      return { valid: false, error: 'Custom focus must be less than 500 characters' };
    }

    // Basic check for suspicious patterns (SQL injection, XSS attempts)
    const suspiciousPatterns = [
      /<script/i,
      /javascript:/i,
      /on\w+\s*=/i, // event handlers like onclick=
      /INSERT\s+INTO/i,
      /DELETE\s+FROM/i,
      /DROP\s+TABLE/i,
      /SELECT\s+\*/i,
    ];

    for (const pattern of suspiciousPatterns) {
      if (pattern.test(trimmed)) {
        return { valid: false, error: 'Invalid characters detected in custom focus' };
      }
    }

    return { valid: true };
  };

  // Unified start handler
  const handleStart = () => {
    // Check if custom text is being used
    if (customFocus.trim()) {
      const validation = validateCustomFocus(customFocus.trim());
      if (!validation.valid) {
        toast.error(validation.error || 'Invalid custom focus');
        return;
      }
    }

    if (selectedFocusArea || customFocus.trim()) {
      handleStartCustom();
    } else {
      handleStartDefault();
    }
  };

  // Determine button state (without expensive validation)
  const getButtonConfig = () => {
    if (selectedFocusArea) {
      return {
        text: `Start with "${selectedFocusArea}"`,
        variant: 'default' as const,
        className: 'w-full text-white bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600',
      };
    }

    if (customFocus.trim()) {
      return {
        text: 'Start Custom Quiz',
        variant: 'default' as const,
        className: 'w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600',
      };
    }

    return {
      text: 'Start with Default Settings',
      variant: 'default' as const,
      className: 'w-full text-white bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600',
    };
  };

  const buttonConfig = getButtonConfig();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Card className="mb-6 bg-gradient-to-br from-orange-50 to-pink-50 border-0 shadow-lg">
        <CardContent className="p-8">
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles className="w-8 h-8 text-orange-500" />
              <h1 className="text-3xl font-bold text-gray-800">Translation Practice</h1>
            </div>
            <p className="text-gray-600 mb-6">
              Practice translating English phrases to Spanish. Optionally specify what you want to practice.
            </p>
          </div>

          {/* Translation Direction Toggle - Temporarily disabled, only English to Spanish available */}
          {/* <div className="mb-6 p-4 bg-white rounded-lg border border-gray-200">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Translation Direction
            </label>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setTranslationDirection('es_to_en')}
                className={`flex-1 px-4 py-3 rounded-lg border-2 transition-all ${
                  translationDirection === 'es_to_en'
                    ? 'border-orange-500 bg-orange-50 text-orange-700 font-semibold'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="text-sm font-medium mb-1">Spanish → English</div>
                <div className="text-xs text-gray-500">Translate Spanish to English</div>
              </button>
              <button
                type="button"
                onClick={() => setTranslationDirection('en_to_es')}
                className={`flex-1 px-4 py-3 rounded-lg border-2 transition-all ${
                  translationDirection === 'en_to_es'
                    ? 'border-orange-500 bg-orange-50 text-orange-700 font-semibold'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="text-sm font-medium mb-1">English → Spanish</div>
                <div className="text-xs text-gray-500">Translate English to Spanish</div>
              </button>
            </div>
          </div> */}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select a Focus Area (optional)
              </label>
              <select
                value={selectedFocusArea}
                onChange={(e) => handleFocusAreaChange(e.target.value)}
                className="w-full px-4 py-3 mb-3 bg-white border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
              >
                <option value="">Choose a focus area...</option>
                {focusAreas.map((area) => (
                  <option key={area.name} value={area.name}>
                    {area.name}
                  </option>
                ))}
              </select>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm mb-3">
                  <span className="px-2 bg-white text-gray-500">or type your own</span>
                </div>
              </div>

              <Input
                type="text"
                placeholder="e.g., 'direct and indirect objects with prepositions' or 'restaurant scenarios'"
                value={customFocus}
                onChange={(e) => handleCustomFocusChange(e.target.value)}
                className="mb-4 bg-white text-gray-800"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleStart();
                  }
                }}
              />

              <Button
                onClick={handleStart}
                className={buttonConfig.className}
                size="lg"
              >
                {buttonConfig.text}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>

              {/* Validation hint */}
              {customFocus.trim() && customFocus.trim().length < 10 && (
                <p className="text-xs text-gray-500 mt-2">
                  Tip: Custom focus works best with at least 10 characters
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <PastQuizzesList
        quizzes={pastQuizzes}
        onStartSimilar={handleStartSimilar}
        onViewStudyGuide={handleViewStudyGuide}
        onResumeQuiz={onResumeQuiz}
      />

      <StudyGuideModal
        quizId={viewStudyGuideQuizId}
        onComplete={() => setViewStudyGuideQuizId(null)}
      />
    </div>
  );
}

