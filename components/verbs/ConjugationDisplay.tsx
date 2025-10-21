'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Volume2, BookOpen, ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { playTTS, fallbackTTS } from '../../lib/tts-client';

interface VerbConjugation {
  infinitive: string;
  infinitive_english: string;
  mood: string;
  mood_english: string;
  tense: string;
  tense_english: string;
  verb_english: string;
  form_1s: string;
  form_2s: string;
  form_3s: string;
  form_1p: string;
  form_2p: string;
  form_3p: string;
  gerund: string;
  gerund_english: string;
  pastparticiple: string;
  pastparticiple_english: string;
}

interface Verb {
  infinitive: string;
  infinitive_english: string;
  conjugations: VerbConjugation[];
}

interface ConjugationDisplayProps {
  verb: Verb;
  loading?: boolean;
  onClose?: () => void;
  isMobile?: boolean;
}

export default function ConjugationDisplay({ 
  verb, 
  loading = false, 
  onClose,
  isMobile = false
}: ConjugationDisplayProps) {
  const [expandedMoods, setExpandedMoods] = useState<Set<string>>(new Set(['Indicativo']));

  // TTS function using your existing pattern
  const playAudio = async (text: string) => {
    try {
      console.log('Playing TTS for:', text);
      await playTTS(text);
      console.log('TTS audio played successfully');
    } catch (error) {
      console.error('Error with TTS:', error);
      fallbackTTS(text);
    }
  };

  const toggleMood = (mood: string) => {
    const newExpanded = new Set(expandedMoods);
    if (newExpanded.has(mood)) {
      newExpanded.delete(mood);
    } else {
      newExpanded.add(mood);
    }
    setExpandedMoods(newExpanded);
  };

  // Group conjugations by mood
  const conjugationsByMood = verb.conjugations.reduce((acc, conj) => {
    if (!acc[conj.mood]) {
      acc[conj.mood] = [];
    }
    acc[conj.mood].push(conj);
    return acc;
  }, {} as Record<string, VerbConjugation[]>);

  const getPronounLabel = (form: string) => {
    const pronounMap: Record<string, string> = {
      'form_1s': 'yo',
      'form_2s': 'tú',
      'form_3s': 'él/ella/usted',
      'form_1p': 'nosotros',
      'form_2p': 'vosotros',
      'form_3p': 'ellos/ellas/ustedes'
    };
    return pronounMap[form] || form;
  };

  const getFormValue = (conjugation: VerbConjugation, form: string) => {
    return conjugation[form as keyof VerbConjugation] as string;
  };

  const highlightIrregular = (text: string, base: string) => {
    if (!text || !base) return text;
    
    // Simple irregularity detection - highlight letters that differ from base
    const baseChars = base.toLowerCase().split('');
    const textChars = text.toLowerCase().split('');
    
    return text.split('').map((char, index) => {
      if (index < baseChars.length && char.toLowerCase() !== baseChars[index]) {
        return <span key={index} className="text-red-600 font-bold">{char}</span>;
      }
      return char;
    });
  };

  if (loading) {
    return (
      <div className={`${isMobile ? 'w-full' : 'flex-1'} flex items-center justify-center ${isMobile ? 'h-64' : ''}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">
            Loading conjugations...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${isMobile ? 'w-full' : 'flex-1'} ${isMobile ? 'overflow-y-auto' : 'overflow-y-auto'} bg-gray-50`}>
      <div className={`${isMobile ? 'px-4 py-6' : 'max-w-6xl mx-auto p-6'}`}>
        {/* Header */}
        <div className={`flex items-center justify-between ${isMobile ? 'mb-4' : 'mb-6'}`}>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <BookOpen className={`${isMobile ? 'w-5 h-5' : 'w-6 h-6'} text-orange-500`} />
              <h1 className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-bold text-gray-900`}>
                {verb.infinitive}
              </h1>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => playAudio(verb.infinitive)}
              className="hover:bg-orange-100"
            >
              <Volume2 className="w-4 h-4 text-orange-500" />
            </Button>
          </div>
          
          {onClose && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="hover:bg-gray-100"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* Verb Info */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {verb.infinitive_english}
                </h2>
                <p className="text-sm text-gray-600">
                  {verb.conjugations.length} conjugations
                </p>
              </div>
              <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                Spanish Verb
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Conjugations by Mood */}
        <div className="space-y-4">
          {Object.entries(conjugationsByMood).map(([mood, conjugations]) => (
            <Card key={mood} className="overflow-hidden">
              <CardHeader 
                className="bg-gradient-to-r from-orange-500 to-pink-500 text-white cursor-pointer"
                onClick={() => toggleMood(mood)}
              >
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">
                    {mood}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="bg-white/20 text-white">
                      {conjugations.length} tenses
                    </Badge>
                    {expandedMoods.has(mood) ? (
                      <ChevronDown className="w-5 h-5" />
                    ) : (
                      <ChevronRight className="w-5 h-5" />
                    )}
                  </div>
                </div>
              </CardHeader>
              
              {expandedMoods.has(mood) && (
                <CardContent className="p-0">
                  <div className="space-y-4 p-4">
                    {conjugations.map((conjugation, index) => (
                      <motion.div
                        key={`${conjugation.mood}-${conjugation.tense}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="border border-gray-200 rounded-lg p-4"
                      >
                        {/* Tense Header */}
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-semibold text-gray-900">
                            {conjugation.tense}
                          </h3>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => playAudio(conjugation.tense)}
                              className="hover:bg-orange-100"
                            >
                              <Volume2 className="w-3 h-3 text-orange-500" />
                            </Button>
                            <Badge variant="outline" className="text-xs">
                              {conjugation.tense_english}
                            </Badge>
                          </div>
                        </div>

                        {/* Conjugation Forms */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                          {['form_1s', 'form_2s', 'form_3s', 'form_1p', 'form_2p', 'form_3p'].map((form) => {
                            const formValue = getFormValue(conjugation, form);
                            if (!formValue) return null;
                            
                            return (
                              <div key={form} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                                <span className="text-sm font-medium text-gray-600 w-20">
                                  {getPronounLabel(form)}:
                                </span>
                                <span className="flex-1 font-medium">
                                  {highlightIrregular(formValue, verb.infinitive)}
                                </span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => playAudio(formValue)}
                                  className="h-6 w-6 p-0 hover:bg-orange-100"
                                >
                                  <Volume2 className="w-3 h-3 text-orange-500" />
                                </Button>
                              </div>
                            );
                          })}
                        </div>

                        {/* Gerund and Past Participle */}
                        {(conjugation.gerund || conjugation.pastparticiple) && (
                          <div className="mt-4 pt-3 border-t border-gray-200">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {conjugation.gerund && (
                                <div className="flex items-center gap-2 p-2 bg-blue-50 rounded">
                                  <span className="text-sm font-medium text-blue-600">
                                    Gerund:
                                  </span>
                                  <span className="flex-1 font-medium text-blue-900">
                                    {conjugation.gerund}
                                  </span>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => playAudio(conjugation.gerund)}
                                    className="h-6 w-6 p-0 hover:bg-blue-100"
                                  >
                                    <Volume2 className="w-3 h-3 text-blue-500" />
                                  </Button>
                                </div>
                              )}
                              
                              {conjugation.pastparticiple && (
                                <div className="flex items-center gap-2 p-2 bg-green-50 rounded">
                                  <span className="text-sm font-medium text-green-600">
                                    Past Participle:
                                  </span>
                                  <span className="flex-1 font-medium text-green-900">
                                    {conjugation.pastparticiple}
                                  </span>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => playAudio(conjugation.pastparticiple)}
                                    className="h-6 w-6 p-0 hover:bg-green-100"
                                  >
                                    <Volume2 className="w-3 h-3 text-green-500" />
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
