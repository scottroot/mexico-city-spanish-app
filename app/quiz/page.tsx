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
import { CheckCircle, X, Search, Heart, BookOpen } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Favorites } from '@/entities/Favorites';
import { QuizConfig, TenseOption, VerbOption, QuestionCountOption } from '@/types/quiz';

export default function CustomQuizPage() {
  const { t, language } = useLanguage();
  const router = useRouter();
  
  // State for quiz configuration
  const [config, setConfig] = useState<QuizConfig>({
    selectedTenses: [],
    selectedMoods: [],
    verbSelection: 'favorites',
    customVerbs: [],
    questionCount: 10
  });
  
  // State for available data
  const [availableVerbs, setAvailableVerbs] = useState<VerbOption[]>([]);
  const [favoriteVerbs, setFavoriteVerbs] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Available tense options
  const tenseOptions: TenseOption[] = [
    { value: 'Presente', label: 'Presente', labelEnglish: 'Present', mood: 'Indicativo', moodEnglish: 'Indicative' },
    { value: 'Pretérito', label: 'Pretérito', labelEnglish: 'Preterite', mood: 'Indicativo', moodEnglish: 'Indicative' },
    { value: 'Imperfecto', label: 'Imperfecto', labelEnglish: 'Imperfect', mood: 'Indicativo', moodEnglish: 'Indicative' },
    { value: 'Futuro', label: 'Futuro', labelEnglish: 'Future', mood: 'Indicativo', moodEnglish: 'Indicative' },
    { value: 'Condicional', label: 'Condicional', labelEnglish: 'Conditional', mood: 'Indicativo', moodEnglish: 'Indicative' },
    { value: 'Presente', label: 'Presente', labelEnglish: 'Present', mood: 'Subjuntivo', moodEnglish: 'Subjunctive' },
    { value: 'Imperfecto', label: 'Imperfecto', labelEnglish: 'Imperfect', mood: 'Subjuntivo', moodEnglish: 'Subjunctive' },
    { value: 'Futuro', label: 'Futuro', labelEnglish: 'Future', mood: 'Subjuntivo', moodEnglish: 'Subjunctive' },
    { value: 'Presente', label: 'Presente', labelEnglish: 'Present', mood: 'Imperativo', moodEnglish: 'Imperative' }
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
  
  // Load available verbs and favorites on component mount
  useEffect(() => {
    loadVerbs();
    loadFavorites();
  }, []);
  
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
  
  const handleTenseToggle = (tense: TenseOption) => {
    const tenseKey = `${tense.value}-${tense.mood}`;
    const isSelected = config.selectedTenses.includes(tense.value) && 
                      config.selectedMoods.includes(tense.mood);
    
    if (isSelected) {
      setConfig(prev => ({
        ...prev,
        selectedTenses: prev.selectedTenses.filter(t => t !== tense.value),
        selectedMoods: prev.selectedMoods.filter(m => m !== tense.mood)
      }));
    } else {
      setConfig(prev => ({
        ...prev,
        selectedTenses: [...new Set([...prev.selectedTenses, tense.value])],
        selectedMoods: [...new Set([...prev.selectedMoods, tense.mood])]
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
  
  const handleStartQuiz = async () => {
    if (config.selectedTenses.length === 0 || config.selectedMoods.length === 0) {
      setError('Please select at least one tense and mood');
      return;
    }
    
    if (config.verbSelection === 'custom' && config.customVerbs.length === 0) {
      setError('Please select at least one verb');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
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
  
  // Filter verbs based on search term
  const filteredVerbs = availableVerbs.filter(verb =>
    verb.infinitive.toLowerCase().includes(searchTerm.toLowerCase()) ||
    verb.infinitiveEnglish.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
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
                {Object.entries(tensesByMood).map(([mood, tenses]) => (
                  <div key={mood}>
                    <h4 className="font-semibold text-gray-700 mb-2">
                      {language === 'es' ? mood : tenses[0].moodEnglish}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {tenses.map((tense) => {
                        const isSelected = config.selectedTenses.includes(tense.value) && 
                                          config.selectedMoods.includes(tense.mood);
                        return (
                          <Badge
                            key={`${tense.value}-${tense.mood}`}
                            variant={isSelected ? "default" : "outline"}
                            className={`cursor-pointer transition-colors ${
                              isSelected 
                                ? 'bg-orange-500 text-white' 
                                : 'hover:bg-orange-50 hover:border-orange-300'
                            }`}
                            onClick={() => handleTenseToggle(tense)}
                          >
                            {language === 'es' ? tense.label : tense.labelEnglish}
                          </Badge>
                        );
                      })}
                    </div>
                  </div>
                ))}
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
                    <div className="relative mb-3">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        placeholder={language === 'es' ? 'Buscar verbos...' : 'Search verbs...'}
                        value={searchTerm}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <div className="max-h-60 overflow-y-auto space-y-2">
                      {filteredVerbs.slice(0, 50).map((verb) => {
                        const isSelected = config.customVerbs.includes(verb.infinitive);
                        return (
                          <div
                            key={verb.infinitive}
                            className={`p-2 rounded-lg cursor-pointer transition-colors ${
                              isSelected 
                                ? 'bg-pink-100 border border-pink-300' 
                                : 'hover:bg-gray-50 border border-transparent'
                            }`}
                            onClick={() => handleVerbToggle(verb)}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <span className="font-medium">{verb.infinitive}</span>
                                <span className="text-sm text-gray-500 ml-2">
                                  {verb.infinitiveEnglish}
                                </span>
                              </div>
                              {isSelected && (
                                <CheckCircle className="w-4 h-4 text-pink-600" />
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    {config.customVerbs.length > 0 && (
                      <div className="mt-3">
                        <p className="text-sm text-gray-600 mb-2">
                          {language === 'es' ? 'Seleccionados:' : 'Selected:'} {config.customVerbs.length}
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {config.customVerbs.slice(0, 5).map((verb) => (
                            <Badge key={verb} variant="secondary" className="text-xs">
                              {verb}
                            </Badge>
                          ))}
                          {config.customVerbs.length > 5 && (
                            <Badge variant="secondary" className="text-xs">
                              +{config.customVerbs.length - 5} más
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
                
                {/* Favorites Info */}
                {config.verbSelection === 'favorites' && (
                  <div className="text-center py-4">
                    {favoriteVerbs.length > 0 ? (
                      <div>
                        <p className="text-gray-600 mb-2">
                          {language === 'es' 
                            ? `Usarás ${favoriteVerbs.length} verbos favoritos`
                            : `You'll use ${favoriteVerbs.length} favorite verbs`
                          }
                        </p>
                        <div className="flex flex-wrap gap-1 justify-center">
                          {favoriteVerbs.slice(0, 8).map((verb) => (
                            <Badge key={verb} variant="secondary" className="text-xs">
                              {verb}
                            </Badge>
                          ))}
                          {favoriteVerbs.length > 8 && (
                            <Badge variant="secondary" className="text-xs">
                              +{favoriteVerbs.length - 8} más
                            </Badge>
                          )}
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-500">
                        {language === 'es' 
                          ? 'No tienes verbos favoritos. Ve a CVerbos para agregar algunos.'
                          : 'No favorite verbs. Go to CVerbs to add some.'
                        }
                      </p>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        
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
            disabled={loading || config.selectedTenses.length === 0 || 
                     (config.verbSelection === 'custom' && config.customVerbs.length === 0) ||
                     (config.verbSelection === 'favorites' && favoriteVerbs.length === 0)}
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
    </div>
  );
}
