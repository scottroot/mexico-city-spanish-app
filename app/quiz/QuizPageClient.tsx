'use client';

// no /* eslint-disable @typescript-eslint/ban-ts-comment */
// no // @ts-nocheck
import React, { use, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useHookstate } from '@hookstate/core';
import { localstored } from '@hookstate/localstored';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { X, Sparkles } from 'lucide-react';
import { QuizConfig, TenseOption, VerbOption, QuestionCountOption, PronounOption } from '@/types/quiz';
import { VERB_GROUPS, defaultConfig, getVerbGroupById } from '@/app/quiz/verb-groups';
import PresetGroupSelector from './_components/PresetGroupSelector';
import { VerbSelectionModal, TenseSelectionModal, PronounSelectionModal } from './_components/modals';


// API wrapper function for saving preferences
async function fetchSaveQuizPreferences(config: QuizConfig): Promise<boolean> {
  try {
    const response = await fetch('/api/quiz-preferences', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(config),
    });

    if (!response.ok) {
      // 401 is expected when user isn't logged in - handle silently
      if (response.status !== 401) {
        const errorData = await response.json();
        console.error('Failed to save quiz preferences:', response.status, errorData);
      }
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error saving quiz preferences:', error);
    return false;
  }
}

interface QuizPageClientProps {
  initialVerbs: VerbOption[];
  initialFavorites: string[];
  initialPreferences: QuizConfig | null;
}

export default function QuizPageClient({
  initialVerbs,
  initialFavorites,
  initialPreferences
}: QuizPageClientProps) {
  const router = useRouter();

  // Initialize config - use server preferences if logged in, otherwise default (with localStorage for guests)
  const configState = useHookstate<QuizConfig>(
    initialPreferences ?? defaultConfig,
    !initialPreferences
      ? localstored({ key: 'quiz-config-guest' })
      : undefined
  );

  const uiState = useHookstate({
    loading: false,
    errorMessage: ''
  });

  const modalsState = useHookstate({
    isTenseModalOpen: false,
    isVerbModalOpen: false,
    isPresetModalOpen: false,
    isPronounModalOpen: false,
    verbModalSearchTerm: ''
  });

  // Data from props (readonly, no state needed)
  const availableVerbs = initialVerbs;
  const favoriteVerbs = initialFavorites;

  // Available tense options - ordered by ranking within each mood
  // NOTE: These values must match exactly what's stored in the database
  const tenseOptions: TenseOption[] = [
    // Indicative - ordered by ranking
    { value: 'Pluscuamperfecto', label: 'Pretérito Pluscuamperfecto', labelEnglish: 'Past Perfect', mood: 'Indicativo', moodEnglish: 'Indicative' },
    { value: 'Imperfecto', label: 'Pretérito Imperfecto', labelEnglish: 'Imperfect', mood: 'Indicativo', moodEnglish: 'Indicative' },
    { value: 'Pretérito', label: 'Pretérito Indefinido', labelEnglish: 'Preterite', mood: 'Indicativo', moodEnglish: 'Indicative' },
    { value: 'Presente perfecto', label: 'Pretérito Perfecto', labelEnglish: 'Present Perfect', mood: 'Indicativo', moodEnglish: 'Indicative' },
    { value: 'Presente', label: 'Presente', labelEnglish: 'Present', mood: 'Indicativo', moodEnglish: 'Indicative' },
    { value: 'Futuro perfecto', label: 'Futuro Perfecto', labelEnglish: 'Future Perfect', mood: 'Indicativo', moodEnglish: 'Indicative' },
    { value: 'Futuro', label: 'Futuro Simple', labelEnglish: 'Future', mood: 'Indicativo', moodEnglish: 'Indicative' },
    { value: 'Condicional perfecto', label: 'Condicional Perfecto', labelEnglish: 'Conditional Perfect', mood: 'Indicativo', moodEnglish: 'Indicative' },
    { value: 'Condicional', label: 'Condicional Simple', labelEnglish: 'Conditional', mood: 'Indicativo', moodEnglish: 'Indicative' },

    // Subjunctive - ordered by ranking
    { value: 'Pluscuamperfecto', label: 'Pretérito Pluscuamperfecto', labelEnglish: 'Past Perfect', mood: 'Subjuntivo', moodEnglish: 'Subjunctive' },
    { value: 'Imperfecto', label: 'Pretérito Imperfecto', labelEnglish: 'Imperfect', mood: 'Subjuntivo', moodEnglish: 'Subjunctive' },
    { value: 'Presente perfecto', label: 'Pretérito Perfecto', labelEnglish: 'Present Perfect', mood: 'Subjuntivo', moodEnglish: 'Subjunctive' },
    { value: 'Presente', label: 'Presente', labelEnglish: 'Present', mood: 'Subjuntivo', moodEnglish: 'Subjunctive' },
    { value: 'Futuro perfecto', label: 'Futuro Perfecto', labelEnglish: 'Future Perfect', mood: 'Subjuntivo', moodEnglish: 'Subjunctive' },
    { value: 'Futuro', label: 'Futuro', labelEnglish: 'Future', mood: 'Subjuntivo', moodEnglish: 'Subjunctive' },

    // Imperative - ordered by ranking
    { value: 'Presente', label: 'Afirmativo', labelEnglish: 'Affirmative', mood: 'Imperativo Afirmativo', moodEnglish: 'Imperative' },
    { value: 'Presente', label: 'Negativo', labelEnglish: 'Negative', mood: 'Imperativo Negativo', moodEnglish: 'Imperative' }
  ];

  // Available pronoun options (vosotros disabled)
  const pronounOptions: PronounOption[] = [
    { value: 'yo', label: 'yo', labelEnglish: 'I' },
    { value: 'tú', label: 'tú', labelEnglish: 'you' },
    { value: 'él', label: 'él', labelEnglish: 'he' },
    { value: 'ella', label: 'ella', labelEnglish: 'she' },
    { value: 'usted', label: 'usted', labelEnglish: 'you (formal)' },
    { value: 'nosotros', label: 'nosotros', labelEnglish: 'we' },
    { value: 'ellos', label: 'ellos', labelEnglish: 'they' },
    { value: 'ellas', label: 'ellas', labelEnglish: 'they' },
    { value: 'ustedes', label: 'ustedes', labelEnglish: 'you all' }
  ];

  // Question count options
  const questionCountOptions: QuestionCountOption[] = [
    { value: 5, label: '5' },
    { value: 10, label: '10' },
    { value: 15, label: '15' },
    { value: 20, label: '20' },
    { value: 25, label: '25' },
    { value: 30, label: '30' },
    { value: 35, label: '35' },
    { value: 40, label: '40' },
    { value: 45, label: '45' },
    { value: 50, label: '50' }
  ];

  const saveQuizPreferences = async (configToSave: QuizConfig) => {
    console.log('Saving quiz preferences:', configToSave);
    const success = await fetchSaveQuizPreferences(configToSave);
    if (!success) {
      throw new Error('Failed to save preferences');
    }
    console.log('Quiz preferences saved successfully');
  };

  const handleTenseToggle = (tense: TenseOption) => {
    const tenseKey = `${tense.value}-${tense.mood}`;
    const isSelected = configState.selectedTenseMoods.get().includes(tenseKey);

    if (isSelected) {
      configState.selectedTenseMoods.set(prev => prev.filter(tm => tm !== tenseKey));
    } else {
      configState.selectedTenseMoods.set(prev => [...prev, tenseKey]);
    }
  };

  const handleSelectAllTenses = () => {
    const allTenseKeys = tenseOptions.map(tense => `${tense.value}-${tense.mood}`);
    const allSelected = allTenseKeys.every(key => configState.selectedTenseMoods.get().includes(key));

    if (allSelected) {
      // Deselect all
      configState.selectedTenseMoods.set([]);
    } else {
      // Select all
      configState.selectedTenseMoods.set(allTenseKeys);
    }
  };

  const handleVerbToggle = (verb: VerbOption) => {
    const isSelected = configState.customVerbs.get().includes(verb.infinitive);

    if (isSelected) {
      configState.customVerbs.set(prev => prev.filter(v => v !== verb.infinitive));
    } else {
      configState.customVerbs.set(prev => [...prev, verb.infinitive]);
    }
  };

  const handlePronounToggle = (pronoun: PronounOption) => {
    const isSelected = configState.selectedPronouns.get().includes(pronoun.value);

    if (isSelected) {
      configState.selectedPronouns.set(prev => prev.filter(p => p !== pronoun.value));
    } else {
      configState.selectedPronouns.set(prev => [...prev, pronoun.value]);
    }
  };

  const handlePresetGroupSelect = (group: typeof VERB_GROUPS[0]) => {
    configState.merge({
      verbSelection: 'preset',
      presetGroupId: group.id,
      customVerbs: group.verbs
    });
    modalsState.isPresetModalOpen.set(false);
  };

  const handleStartQuiz = async () => {
    if (configState.selectedTenseMoods.get().length === 0) {
      uiState.errorMessage.set('Please select at least one tense and mood');
      return;
    }

    if (configState.verbSelection.get() === 'custom' && configState.customVerbs.get().length === 0) {
      uiState.errorMessage.set('Please select at least one verb');
      return;
    }

    if (configState.verbSelection.get() === 'preset' && !configState.presetGroupId.get()) {
      uiState.errorMessage.set('Please select a preset verb group');
      return;
    }

    if (configState.selectedPronouns.get().length === 0) {
      uiState.errorMessage.set('Please select at least one pronoun');
      return;
    }

    uiState.merge({ loading: true, errorMessage: '' });

    try {
      // Try to save quiz preferences before starting the quiz
      try {
        await saveQuizPreferences(JSON.parse(JSON.stringify(configState.get())));
      } catch (prefError) {
        console.warn('Failed to save quiz preferences, continuing with quiz:', prefError);
        // Continue with quiz even if preferences saving fails
      }

      const response = await fetch('/api/quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(configState.get()),
      });

      if (response.ok) {
        const data = await response.json();
        // Store quiz data in sessionStorage and navigate to quiz game
        sessionStorage.setItem('customQuiz', JSON.stringify({
          config: configState.get(),
          questions: data.questions
        }));
        router.push('/quiz/game');
      } else {
        const errorData = await response.json();
        uiState.errorMessage.set(errorData.error || 'Failed to generate quiz');
      }
    } catch (error) {
      console.error('Error starting quiz:', error);
      uiState.errorMessage.set('Failed to start quiz');
    } finally {
      uiState.loading.set(false);
    }
  };

  // Group tenses by mood
  const tensesByMood = tenseOptions.reduce((acc, tense) => {
    if (!acc[tense.mood]) {
      acc[tense.mood] = [];
    }
    acc[tense.mood].push(tense);
    return acc;
  }, {} as Record<string, TenseOption[]>);


  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <h1 className="text-3xl font-bold text-gray-800 mb-1">
            Custom Quiz
          </h1>
          <p className="text-sm text-gray-600">
            Configure your verb conjugation practice
          </p>
        </motion.div>

        {uiState.errorMessage.get() && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg"
          >
            <div className="flex items-center gap-2">
              <X className="w-4 h-4 text-red-600" />
              <span className="text-sm text-red-800">{uiState.errorMessage.get()}</span>
            </div>
          </motion.div>
        )}

        {/* Main Configuration Card */}
        <Card className="bg-white shadow-sm mb-4">
          <CardContent className="p-0">
            {/* Tense Selection */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700">
                  Tenses
                </label>
                <Button
                  onClick={() => modalsState.isTenseModalOpen.set(true)}
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs cursor-pointer"
                >
                  Choose tenses
                </Button>
              </div>
              {configState.selectedTenseMoods.get().length > 0 ? (
                <div>
                  <p className="text-xs text-gray-500 mb-2">
                    {configState.selectedTenseMoods.get().length} tense{configState.selectedTenseMoods.get().length !== 1 ? 's' : ''} selected
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {configState.selectedTenseMoods.get().map((tenseKey) => {
                      const [tense, ...moodParts] = tenseKey.split('-');
                      const mood = moodParts.join('-');
                      const tenseOption = tenseOptions.find(t => t.value === tense && t.mood === mood);
                      return (
                        <span
                          key={tenseKey}
                          className="px-2 py-0.5 text-xs bg-orange-100 text-orange-700 rounded"
                        >
                          {tenseOption?.labelEnglish}
                        </span>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <p className="text-xs text-gray-500">
                  No tenses selected
                </p>
              )}
            </div>

            {/* Pronoun Selection */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700">
                  Pronouns
                </label>
                <Button
                  onClick={() => modalsState.isPronounModalOpen.set(true)}
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs cursor-pointer"
                >
                  Choose pronouns
                </Button>
              </div>
              {configState.selectedPronouns.get().length > 0 ? (
                <div>
                  <p className="text-xs text-gray-500 mb-2">
                    {configState.selectedPronouns.get().length} pronoun{configState.selectedPronouns.get().length !== 1 ? 's' : ''} selected
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {configState.selectedPronouns.get().map((pronounValue) => {
                      const pronounOption = pronounOptions.find(p => p.value === pronounValue);
                      return (
                        <span
                          key={pronounValue}
                          className="px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded"
                        >
                          {pronounOption?.label}
                        </span>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <p className="text-xs text-gray-500">
                  No pronouns selected
                </p>
              )}
            </div>

            {/* Verb Selection */}
            <div className="p-4 border-b border-gray-200">
              <div className="mb-2">
                <label className="text-sm font-medium text-gray-700">
                  Verbs
                </label>
              </div>
              <div className="flex gap-2 mb-3 flex-wrap">
                <button
                  onClick={() => {
                    const top100Group = getVerbGroupById('top-100');
                    if (top100Group) {
                      configState.merge({
                        verbSelection: 'preset',
                        presetGroupId: 'top-100',
                        customVerbs: top100Group.verbs
                      });
                    }
                  }}
                  className={`px-3 py-1.5 text-xs rounded-full transition-colors cursor-pointer ${
                    configState.verbSelection.get() === 'preset' && configState.presetGroupId.get() === 'top-100'
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Top 100
                </button>
                <button
                  onClick={() => !initialPreferences ? null : configState.verbSelection.set('favorites')}
                  disabled={!initialPreferences}
                  title={!initialPreferences ? 'Please log in to use favorites' : ''}
                  className={`px-3 py-1.5 text-xs rounded-full transition-colors ${
                    !initialPreferences
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : configState.verbSelection.get() === 'favorites'
                        ? 'bg-orange-500 text-white cursor-pointer'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 cursor-pointer'
                  }`}
                >
                  Favorites
                </button>
                <button
                  onClick={() => modalsState.isPresetModalOpen.set(true)}
                  className={`px-3 py-1.5 text-xs rounded-full transition-colors cursor-pointer flex items-center gap-1 ${
                    configState.verbSelection.get() === 'preset' && configState.presetGroupId.get() !== 'top-100'
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Sparkles className="w-3 h-3" />
                  Preset Groups
                </button>
                <button
                  onClick={() => {
                    configState.verbSelection.set('custom');
                    modalsState.isVerbModalOpen.set(true);
                  }}
                  className={`px-3 py-1.5 text-xs rounded-full transition-colors cursor-pointer ${
                    configState.verbSelection.get() === 'custom'
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Select my own
                </button>
              </div>

              {configState.verbSelection.get() === 'custom' && (
                <div>
                  {configState.customVerbs.get().length > 0 ? (
                    <>
                      <p className="text-xs text-gray-500 mb-1">
                        {configState.customVerbs.get().length} verb{configState.customVerbs.get().length !== 1 ? 's' : ''} selected
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {configState.customVerbs.get().slice(0, 10).map((verb) => (
                          <span
                            key={verb}
                            className="px-2 py-0.5 text-xs bg-pink-100 text-pink-700 rounded"
                          >
                            {verb}
                          </span>
                        ))}
                        {configState.customVerbs.get().length > 10 && (
                          <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded">
                            +{configState.customVerbs.get().length - 10} more
                          </span>
                        )}
                      </div>
                    </>
                  ) : (
                    <p className="text-xs text-gray-500">
                      No verbs selected
                    </p>
                  )}
                </div>
              )}

              {configState.verbSelection.get() === 'preset' && (
                <div>
                  {configState.presetGroupId.get() ? (
                    <div>
                      <p className="text-xs font-medium text-gray-700 mb-1">
                        {getVerbGroupById(configState.presetGroupId.get() || '')?.name}
                      </p>
                      <p className="text-xs text-gray-500 mb-1">
                        {configState.customVerbs.get().length} verb{configState.customVerbs.get().length !== 1 ? 's' : ''}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {configState.customVerbs.get().slice(0, 10).map((verb) => (
                          <span
                            key={verb}
                            className="px-2 py-0.5 text-xs bg-pink-100 text-pink-700 rounded"
                          >
                            {verb}
                          </span>
                        ))}
                        {configState.customVerbs.get().length > 10 && (
                          <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded">
                            +{configState.customVerbs.get().length - 10} more
                          </span>
                        )}
                      </div>
                    </div>
                  ) : (
                    <Button
                      onClick={() => modalsState.isPresetModalOpen.set(true)}
                      variant="outline"
                      size="sm"
                      className="h-8 text-xs cursor-pointer"
                    >
                      Choose preset group
                    </Button>
                  )}
                </div>
              )}

              {configState.verbSelection.get() === 'favorites' && (
                <div>
                  {favoriteVerbs.length > 0 ? (
                    <div>
                      <p className="text-xs text-gray-500 mb-1">
                        {favoriteVerbs.length} favorite verb{favoriteVerbs.length !== 1 ? 's' : ''}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {favoriteVerbs.slice(0, 10).map((verb) => (
                          <span
                            key={verb}
                            className="px-2 py-0.5 text-xs bg-pink-100 text-pink-700 rounded"
                          >
                            {verb}
                          </span>
                        ))}
                        {favoriteVerbs.length > 10 && (
                          <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded">
                            +{favoriteVerbs.length - 10} more
                          </span>
                        )}
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-gray-500">
                      No favorite verbs yet
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Question Count */}
            <div className="p-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">
                  Number of questions
                </label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => configState.questionCount.set(c => Math.max(5, c - 5))}
                    className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-700 cursor-pointer"
                    disabled={configState.questionCount.get() <= 5}
                  >
                    −
                  </button>
                  <span className="text-lg font-medium text-gray-900 w-12 text-center">
                    {configState.questionCount.get()}
                  </span>
                  <button
                    onClick={() => configState.questionCount.set(c => Math.min(50, c + 5))}
                    className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-700 cursor-pointer"
                    disabled={configState.questionCount.get() >= 50}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Start Quiz Button */}
        <Button
          onClick={handleStartQuiz}
          disabled={uiState.loading.get() || configState.selectedTenseMoods.get().length === 0 ||
                   (configState.verbSelection.get() === 'custom' && configState.customVerbs.get().length === 0) ||
                   (configState.verbSelection.get() === 'favorites' && favoriteVerbs.length === 0) ||
                   (configState.verbSelection.get() === 'preset' && !configState.presetGroupId.get()) ||
                   configState.selectedPronouns.get().length === 0}
          className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white py-3 text-base font-medium cursor-pointer"
        >
          {uiState.loading.get() ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Generating Quiz...
            </div>
          ) : (
            'Start quiz'
          )}
        </Button>
      </div>

      {/* Tense Selection Modal */}
      <TenseSelectionModal
        modalOpen={modalsState.isTenseModalOpen.get()}
        setModalOpen={(open) => modalsState.isTenseModalOpen.set(open)}
        tenseOptions={tenseOptions}
        config={JSON.parse(JSON.stringify(configState.get()))}
        tensesByMood={tensesByMood}
        handleTenseToggle={handleTenseToggle}
        handleSelectAllTenses={handleSelectAllTenses}
      />

      {/* Verb Selection Modal */}
      <VerbSelectionModal
        modalOpen={modalsState.isVerbModalOpen.get()}
        setModalOpen={(open) => modalsState.isVerbModalOpen.set(open)}
        searchTerm={modalsState.verbModalSearchTerm.get()}
        setSearchTerm={(term) => modalsState.verbModalSearchTerm.set(term)}
        availableVerbs={availableVerbs}
        configState={configState}
        handleVerbToggle={handleVerbToggle}
      />

      {/* Pronoun Selection Modal */}
      <PronounSelectionModal
        modalOpen={modalsState.isPronounModalOpen.get()}
        setModalOpen={(open) => modalsState.isPronounModalOpen.set(open)}
        pronounOptions={pronounOptions}
        config={JSON.parse(JSON.stringify(configState.get()))}
        handlePronounToggle={handlePronounToggle}
      />

      {/* Preset Group Selection Modal */}
      <PresetGroupSelector
        isOpen={modalsState.isPresetModalOpen.get()}
        onClose={() => modalsState.isPresetModalOpen.set(false)}
        groups={VERB_GROUPS}
        selectedGroupId={configState.presetGroupId.get() || ''}
        onSelectGroup={handlePresetGroupSelect}
      />
    </div>
  );
}
