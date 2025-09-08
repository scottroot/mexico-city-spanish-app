'use client';

/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { X, Search, Heart, BookOpen, ChevronDown } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Favorites } from '@/entities/Favorites';
import { QuizConfig, TenseOption, VerbOption, QuestionCountOption, PronounOption } from '@/types/quiz';

export default function CustomQuizPage() {
  const { language } = useLanguage();
  const router = useRouter();
  
  // State for quiz configuration
  const [config, setConfig] = useState<QuizConfig>({
    selectedTenseMoods: [],
    verbSelection: 'favorites',
    customVerbs: [],
    selectedPronouns: ['yo', 'tú', 'él', 'nosotros', 'ustedes', 'ellos'], // Default pronouns
    questionCount: 10
  });
  
  // State for available data
  const [availableVerbs, setAvailableVerbs] = useState<VerbOption[]>([]);
  const [favoriteVerbs, setFavoriteVerbs] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isTenseModalOpen, setIsTenseModalOpen] = useState(false);
  const [isVerbModalOpen, setIsVerbModalOpen] = useState(false);
  const [verbModalSearchTerm, setVerbModalSearchTerm] = useState('');
  
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
  
  // Load available verbs, favorites, and quiz preferences on component mount
  useEffect(() => {
    loadVerbs();
    loadFavorites();
    loadQuizPreferences();
  }, []);

  // Clean up selectedTenseMoods to remove duplicates
  useEffect(() => {
    if (config.selectedTenseMoods.length > 0) {
      const uniqueTenseMoods = [...new Set(config.selectedTenseMoods)];
      if (uniqueTenseMoods.length !== config.selectedTenseMoods.length) {
        setConfig(prev => ({
          ...prev,
          selectedTenseMoods: uniqueTenseMoods
        }));
      }
    }
  }, [config.selectedTenseMoods]);
  
  const loadVerbs = async () => {
    try {
      const response = await fetch('/api/verbs');
      if (response.ok) {
        const data = await response.json();
        setAvailableVerbs(data.map((verb: any) => ({
          infinitive: verb.infinitive,
          infinitiveEnglish: verb.infinitive_english
        })));
      }
    } catch (error) {
      console.error('Error loading verbs:', error);
    }
  };
  
  const loadFavorites = async () => {
    try {
      const result = await Favorites.getUserFavorites();
      if (result.success && result.data) {
        setFavoriteVerbs(result.data);
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  };
  
  const loadQuizPreferences = async () => {
    try {
      const response = await fetch('/api/quiz-preferences');
      if (response.ok) {
        const data = await response.json();
        if (data.config) {
          // Clean up selectedTenseMoods to remove duplicates and fix format
          const cleanedTenseMoods = data.config.selectedTenseMoods
            ? [...new Set(data.config.selectedTenseMoods)] // Remove duplicates
            : [];
          
          setConfig({
            ...data.config,
            selectedTenseMoods: cleanedTenseMoods
          });
        }
      }
    } catch (error) {
      console.error('Error loading quiz preferences:', error);
    }
  };
  
  const saveQuizPreferences = async (configToSave: QuizConfig) => {
    try {
      console.log('Saving quiz preferences:', configToSave);
      const response = await fetch('/api/quiz-preferences', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(configToSave),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Failed to save quiz preferences:', response.status, errorData);
        throw new Error(`Failed to save preferences: ${errorData.error || 'Unknown error'}`);
      }
      
      const result = await response.json();
      console.log('Quiz preferences saved successfully:', result);
    } catch (error) {
      console.error('Error saving quiz preferences:', error);
      throw error; // Re-throw to let the caller handle it
    }
  };
  
  const handleTenseToggle = (tense: TenseOption) => {
    const tenseKey = `${tense.value}-${tense.mood}`;
    const isSelected = config.selectedTenseMoods.includes(tenseKey);
    
    if (isSelected) {
      setConfig(prev => ({
        ...prev,
        selectedTenseMoods: prev.selectedTenseMoods.filter(tm => tm !== tenseKey)
      }));
    } else {
      setConfig(prev => ({
        ...prev,
        selectedTenseMoods: [...prev.selectedTenseMoods, tenseKey]
      }));
    }
  };

  const handleSelectAllTenses = () => {
    const allTenseKeys = tenseOptions.map(tense => `${tense.value}-${tense.mood}`);
    const allSelected = allTenseKeys.every(key => config.selectedTenseMoods.includes(key));
    
    if (allSelected) {
      // Deselect all
      setConfig(prev => ({
        ...prev,
        selectedTenseMoods: []
      }));
    } else {
      // Select all
      setConfig(prev => ({
        ...prev,
        selectedTenseMoods: allTenseKeys
      }));
    }
  };
  
  const handleVerbToggle = (verb: VerbOption) => {
    const isSelected = config.customVerbs.includes(verb.infinitive);
    
    if (isSelected) {
      setConfig(prev => ({
        ...prev,
        customVerbs: prev.customVerbs.filter(v => v !== verb.infinitive)
      }));
    } else {
      setConfig(prev => ({
        ...prev,
        customVerbs: [...prev.customVerbs, verb.infinitive]
      }));
    }
  };
  
  const handlePronounToggle = (pronoun: PronounOption) => {
    const isSelected = config.selectedPronouns.includes(pronoun.value);
    
    if (isSelected) {
      setConfig(prev => ({
        ...prev,
        selectedPronouns: prev.selectedPronouns.filter(p => p !== pronoun.value)
      }));
    } else {
      setConfig(prev => ({
        ...prev,
        selectedPronouns: [...prev.selectedPronouns, pronoun.value]
      }));
    }
  };
  
  const handleStartQuiz = async () => {
    if (config.selectedTenseMoods.length === 0) {
      setError('Please select at least one tense and mood');
      return;
    }
    
    if (config.verbSelection === 'custom' && config.customVerbs.length === 0) {
      setError('Please select at least one verb');
      return;
    }
    
    if (config.selectedPronouns.length === 0) {
      setError('Please select at least one pronoun');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Try to save quiz preferences before starting the quiz
      try {
        await saveQuizPreferences(config);
      } catch (prefError) {
        console.warn('Failed to save quiz preferences, continuing with quiz:', prefError);
        // Continue with quiz even if preferences saving fails
      }
      
      const response = await fetch('/api/quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config),
      });
      
      if (response.ok) {
        const data = await response.json();
        // Store quiz data in sessionStorage and navigate to quiz game
        sessionStorage.setItem('customQuiz', JSON.stringify({
          config,
          questions: data.questions
        }));
        router.push('/quiz/game');
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to generate quiz');
      }
    } catch (error) {
      console.error('Error starting quiz:', error);
      setError('Failed to start quiz');
    } finally {
      setLoading(false);
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
    <div className="min-h-full bg-gradient-to-br from-orange-50 to-pink-50 p-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            {language === 'es' ? 'Quiz Personalizado' : 'Custom Quiz'}
          </h1>
          <p className="text-lg text-gray-600">
            {language === 'es' 
              ? 'Crea tu propio quiz de conjugaciones verbales'
              : 'Create your own verb conjugation quiz'
            }
          </p>
        </motion.div>
        
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg"
          >
            <div className="flex items-center gap-2">
              <X className="w-5 h-5 text-red-600" />
              <span className="text-red-800">{error}</span>
            </div>
          </motion.div>
        )}

        {/* Quick Start Quiz Button */}
        <div className="text-center mb-8">
          <Button
            onClick={handleStartQuiz}
            disabled={loading || config.selectedTenseMoods.length === 0 || 
                     (config.verbSelection === 'custom' && config.customVerbs.length === 0) ||
                     (config.verbSelection === 'favorites' && favoriteVerbs.length === 0) ||
                     config.selectedPronouns.length === 0}
            className="rounded-full border border-orange-500 text-orange-500 hover:text-orange-600 
            leading-none text-lg"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="flex w-4 h-4 border-2 border-orange-500 border-t-transparent 
                rounded-full animate-spin" />
                <div className="w-[18ch] text-center">
                  {language === 'es' ? 'Generando Quiz...' : 'Generating Quiz...'}
                </div>
                <div className="flex w-4 h-4" />
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <div className="flex w-4 h-4" />
                <div className="w-[18ch] text-center">
                  {language === 'es' ? 'Iniciar Quiz Rápido' : 'Quick Start Quiz'}
                </div>
                <div className="flex w-4 h-4" />
              </div>
            )}
          </Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Tense Selection */}
          <Card className="bg-white shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-orange-600" />
                {language === 'es' ? 'Seleccionar Tiempos' : 'Select Tenses'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button
                  onClick={() => setIsTenseModalOpen(true)}
                  variant="outline"
                  className="w-full justify-between"
                >
                  <span>
                    {language === 'es' ? 'Seleccionar Tiempos' : 'Select Tenses'}
                  </span>
                  <ChevronDown className="w-4 h-4" />
                </Button>
                
                {config.selectedTenseMoods.length > 0 && (
                  <div>
                    <p className="text-sm text-gray-600 mb-2">
                      {language === 'es' ? 'Tiempos seleccionados:' : 'Selected tenses:'} {config.selectedTenseMoods.length}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {config.selectedTenseMoods.slice(0, 6).map((tenseKey) => {
                        const [tense, mood] = tenseKey.split('-');
                        const tenseOption = tenseOptions.find(t => t.value === tense && t.mood === mood);
                        return (
                          <Badge key={tenseKey} variant="secondary" className="text-xs">
                            {language === 'es' ? tenseOption?.label : tenseOption?.labelEnglish}
                          </Badge>
                        );
                      })}
                      {config.selectedTenseMoods.length > 6 && (
                        <Badge variant="secondary" className="text-xs">
                          +{config.selectedTenseMoods.length - 6} más
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          {/* Verb Selection */}
          <Card className="bg-white shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-pink-600" />
                {language === 'es' ? 'Seleccionar Verbos' : 'Select Verbs'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Verb Selection Type */}
                <div className="flex gap-2">
                  <Button
                    variant={config.verbSelection === 'favorites' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setConfig(prev => ({ ...prev, verbSelection: 'favorites' }))}
                    className={config.verbSelection === 'favorites' ? 'bg-pink-500' : ''}
                  >
                    {language === 'es' ? 'Favoritos' : 'Favorites'}
                    {favoriteVerbs.length > 0 && (
                      <Badge variant="secondary" className="ml-2">
                        {favoriteVerbs.length}
                      </Badge>
                    )}
                  </Button>
                  <Button
                    variant={config.verbSelection === 'custom' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setConfig(prev => ({ ...prev, verbSelection: 'custom' }))}
                    className={config.verbSelection === 'custom' ? 'bg-pink-500' : ''}
                  >
                    {language === 'es' ? 'Personalizado' : 'Custom'}
                  </Button>
                </div>
                
                {/* Custom Verb Selection */}
                {config.verbSelection === 'custom' && (
                  <div>
                    <Button
                      onClick={() => setIsVerbModalOpen(true)}
                      variant="outline"
                      className="w-full justify-between"
                    >
                      <span>
                        {language === 'es' ? 'Seleccionar Verbos' : 'Select Verbs'}
                      </span>
                      <ChevronDown className="w-4 h-4" />
                    </Button>
                    
                    {config.customVerbs.length > 0 && (
                      <div className="mt-3">
                        <p className="text-sm text-gray-600 mb-2">
                          {language === 'es' ? 'Verbos seleccionados:' : 'Selected verbs:'} {config.customVerbs.length}
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {config.customVerbs.slice(0, 6).map((verb) => (
                            <Badge key={verb} variant="secondary" className="text-xs">
                              {verb}
                            </Badge>
                          ))}
                          {config.customVerbs.length > 6 && (
                            <Badge variant="secondary" className="text-xs">
                              +{config.customVerbs.length - 6} más
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
                
                {/* Favorites Info */}
                {config.verbSelection === 'favorites' && (
                  <div>
                    {favoriteVerbs.length > 0 ? (
                      <div>
                        <p className="text-sm text-gray-600 mb-2">
                          {language === 'es' ? 'Verbos favoritos:' : 'Favorite verbs:'} {favoriteVerbs.length}
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {favoriteVerbs.slice(0, 6).map((verb) => (
                            <Badge key={verb} variant="secondary" className="text-xs">
                              {verb}
                            </Badge>
                          ))}
                          {favoriteVerbs.length > 6 && (
                            <Badge variant="secondary" className="text-xs">
                              +{favoriteVerbs.length - 6} más
                            </Badge>
                          )}
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">
                        {language === 'es' 
                          ? 'No tienes verbos favoritos. Ve a Verbos para agregar algunos.'
                          : 'No favorite verbs. Go to Verbs to add some.'
                        }
                      </p>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Pronoun Selection */}
        <Card className="mt-6 bg-white shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-blue-600" />
              {language === 'es' ? 'Seleccionar Pronombres' : 'Select Pronouns'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                {language === 'es' 
                  ? 'Selecciona los pronombres que quieres practicar:'
                  : 'Select the pronouns you want to practice:'
                }
              </p>
              <div className="flex flex-wrap gap-2">
                {pronounOptions.map((pronoun) => {
                  const isSelected = config.selectedPronouns.includes(pronoun.value);
                  return (
                    <Badge
                      key={pronoun.value}
                      variant="secondary"
                      className={`cursor-pointer transition-colors ${
                        isSelected 
                          ? 'bg-blue-500 text-white border-blue-500 hover:bg-blue-600' 
                          : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-blue-50 hover:border-blue-300'
                      }`}
                      onClick={() => handlePronounToggle(pronoun)}
                    >
                      {language === 'es' ? pronoun.label : pronoun.labelEnglish}
                    </Badge>
                  );
                })}
              </div>
              {/* {config.selectedPronouns.length > 0 && (
                <div className="mt-3">
                  <p className="text-sm text-gray-600 mb-2">
                    {language === 'es' ? 'Pronombres seleccionados:' : 'Selected pronouns:'} {config.selectedPronouns.length}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {config.selectedPronouns.slice(0, 6).map((pronoun) => {
                      const pronounOption = pronounOptions.find(p => p.value === pronoun);
                      return (
                        <Badge key={pronoun} variant="secondary" className="text-xs">
                          {language === 'es' ? pronounOption?.label : pronounOption?.labelEnglish}
                        </Badge>
                      );
                    })}
                    {config.selectedPronouns.length > 6 && (
                      <Badge variant="secondary" className="text-xs">
                        +{config.selectedPronouns.length - 6} más
                      </Badge>
                    )}
                  </div>
                </div>
              )} */}
            </div>
          </CardContent>
        </Card>
        
        {/* Question Count Selection */}
        <Card className="mt-6 bg-white shadow-lg">
          <CardHeader>
            <CardTitle>
              {language === 'es' ? 'Número de Preguntas' : 'Number of Questions'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {questionCountOptions.map((option) => (
                <Button
                  key={option.value}
                  variant={config.questionCount === option.value ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setConfig(prev => ({ ...prev, questionCount: option.value }))}
                  className={config.questionCount === option.value ? 'bg-orange-500' : ''}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
        
        {/* Start Quiz Button */}
        <div className="mt-8 text-center">
          <Button
            onClick={handleStartQuiz}
            disabled={loading || config.selectedTenseMoods.length === 0 || 
                     (config.verbSelection === 'custom' && config.customVerbs.length === 0) ||
                     (config.verbSelection === 'favorites' && favoriteVerbs.length === 0) ||
                     config.selectedPronouns.length === 0}
            className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white px-8 py-3 text-lg"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                {language === 'es' ? 'Generando Quiz...' : 'Generating Quiz...'}
              </div>
            ) : (
              language === 'es' ? 'Iniciar Quiz' : 'Start Quiz'
            )}
          </Button>
        </div>
      </div>
      
      {/* Tense Selection Modal */}
      {isTenseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setIsTenseModalOpen(false)}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="relative bg-white rounded-t-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden"
          >
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-800">
                  {language === 'es' ? 'Seleccionar Tiempos' : 'Select Tenses'}
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsTenseModalOpen(false)}
                  className="p-2"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>
            
            {/* Content */}
            <div className="px-6 py-4 max-h-[60vh] overflow-y-auto">
              <div className="space-y-6">
                {/* Select All Tenses */}
                <div className="border-b border-gray-200 pb-4">
                  <label className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                    <input
                      type="checkbox"
                      checked={tenseOptions.every(tense => config.selectedTenseMoods.includes(`${tense.value}-${tense.mood}`))}
                      onChange={handleSelectAllTenses}
                      className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">
                        {language === 'es' ? 'Seleccionar Todos' : 'Select All'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {language === 'es' 
                          ? 'Seleccionar o deseleccionar todos los tiempos'
                          : 'Select or deselect all tenses'
                        }
                      </div>
                    </div>
                  </label>
                </div>
                
                {Object.entries(tensesByMood).map(([mood, tenses]) => (
                  <div key={mood}>
                    <h3 className="font-semibold text-gray-800 mb-3 text-lg">
                      {language === 'es' ? mood : tenses[0].moodEnglish}
                    </h3>
                    <div className="space-y-2">
                      {tenses.map((tense) => {
                        const tenseKey = `${tense.value}-${tense.mood}`;
                        const isSelected = config.selectedTenseMoods.includes(tenseKey);
                        return (
                          <label
                            key={tenseKey}
                            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                          >
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => handleTenseToggle(tense)}
                              className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                            />
                            <div className="flex-1">
                              <div className="font-medium text-gray-900">
                                {language === 'es' ? tense.label : tense.labelEnglish}
                              </div>
                              {language === 'es' && (
                                <div className="text-sm text-gray-500">
                                  {tense.labelEnglish}
                                </div>
                              )}
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Footer */}
            <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  {config.selectedTenseMoods.length} {language === 'es' ? 'tiempos seleccionados' : 'tenses selected'}
                </span>
                <Button
                  onClick={() => setIsTenseModalOpen(false)}
                  className="bg-orange-500 hover:bg-orange-600 text-white"
                >
                  {language === 'es' ? 'Confirmar' : 'Confirm'}
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
      
      {/* Verb Selection Modal */}
      {isVerbModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setIsVerbModalOpen(false)}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="relative bg-white rounded-t-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden"
          >
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-800">
                  {language === 'es' ? 'Seleccionar Verbos' : 'Select Verbs'}
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsVerbModalOpen(false)}
                  className="p-2"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>
            
            {/* Search */}
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder={language === 'es' ? 'Buscar verbos...' : 'Search verbs...'}
                  value={verbModalSearchTerm}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setVerbModalSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            {/* Content */}
            <div className="px-6 py-4 max-h-[50vh] overflow-y-auto">
              <div className="space-y-2">
                {availableVerbs
                  .filter(verb =>
                    verb.infinitive.toLowerCase().includes(verbModalSearchTerm.toLowerCase()) ||
                    verb.infinitiveEnglish.toLowerCase().includes(verbModalSearchTerm.toLowerCase())
                  )
                  .slice(0, 100)
                  .map((verb) => {
                    const isSelected = config.customVerbs.includes(verb.infinitive);
                    return (
                      <label
                        key={verb.infinitive}
                        className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleVerbToggle(verb)}
                          className="w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
                        />
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">
                            {verb.infinitive}
                          </div>
                          <div className="text-sm text-gray-500">
                            {verb.infinitiveEnglish}
                          </div>
                        </div>
                      </label>
                    );
                  })}
              </div>
            </div>
            
            {/* Footer */}
            <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  {config.customVerbs.length} {language === 'es' ? 'verbos seleccionados' : 'verbs selected'}
                </span>
                <Button
                  onClick={() => setIsVerbModalOpen(false)}
                  className="bg-pink-500 hover:bg-pink-600 text-white"
                >
                  {language === 'es' ? 'Confirmar' : 'Confirm'}
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
