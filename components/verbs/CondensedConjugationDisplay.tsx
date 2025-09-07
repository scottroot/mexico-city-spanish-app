'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Volume2, Heart, BookOpen, Grid } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { useLanguage } from '../../contexts/LanguageContext';
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

interface CondensedConjugationDisplayProps {
  verb: Verb;
  loading?: boolean;
  onClose?: () => void;
}

const moods = [
  { id: 'Indicativo', label: 'Indicative' },
  { id: 'Subjuntivo', label: 'Subjunctive' },
  { id: 'Imperativo', label: 'Imperative' },
  { id: 'Otros', label: 'Other' }
];

const pronouns = [
  { key: 'form_1s', label: 'yo' },
  { key: 'form_2s', label: 'tú' },
  { key: 'form_3s', label: 'él/ella' },
  { key: 'form_1p', label: 'nosotros' },
  { key: 'form_2p', label: 'ustedes' },
  { key: 'form_3p', label: 'ellos/ellas' }
];

export default function CondensedConjugationDisplay({ 
  verb, 
  loading = false, 
  onClose 
}: CondensedConjugationDisplayProps) {
  const [selectedMood, setSelectedMood] = useState('Indicativo');
  const { t } = useLanguage();

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

  // Get conjugations for selected mood
  const getConjugationsForMood = (moodId: string) => {
    if (moodId === 'Otros') {
      // For "Other" mood, show gerund and past participle
      return [
        {
          tense: 'Gerundio',
          mood: 'Otros',
          form_1s: verb.conjugations[0]?.gerund || '',
          form_2s: '',
          form_3s: '',
          form_1p: '',
          form_2p: '',
          form_3p: ''
        },
        {
          tense: 'Participio',
          mood: 'Otros',
          form_1s: verb.conjugations[0]?.pastparticiple || '',
          form_2s: '',
          form_3s: '',
          form_1p: '',
          form_2p: '',
          form_3p: ''
        }
      ];
    }
    return verb.conjugations.filter(conj => conj.mood === moodId);
  };

  const currentConjugations = getConjugationsForMood(selectedMood);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">{t('verbs.loadingConjugations')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {verb.infinitive} <span className="text-gray-500">({verb.infinitive_english})</span>
              </h1>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => playAudio(verb.infinitive)}
              className="text-gray-500 hover:text-orange-500"
            >
              <Volume2 className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-500 hover:text-red-500"
            >
              <Heart className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-500 hover:text-gray-700"
            >
              <BookOpen className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-500 hover:text-gray-700"
            >
              <Grid className="w-4 h-4" />
            </Button>
            {onClose && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Conjugation Grid */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {currentConjugations.map((conjugation, index) => (
            <motion.div
              key={conjugation.tense}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-900 text-sm">
                      {conjugation.tense}
                    </h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => playAudio(conjugation.tense)}
                      className="text-gray-400 hover:text-orange-500 p-1 h-6 w-6"
                    >
                      <Volume2 className="w-3 h-3" />
                    </Button>
                  </div>
                  
                  <div className="space-y-1">
                    {pronouns.map((pronoun, formIndex) => {
                      const formValue = conjugation[pronoun.key as keyof VerbConjugation] as string;
                      if (!formValue || formValue.trim() === '') return null;
                      
                      return (
                        <div key={formIndex} className="flex items-center justify-between text-sm">
                          <span className="text-gray-600 font-medium min-w-[60px]">
                            {pronoun.label}
                          </span>
                          <div className="flex items-center gap-2 flex-1">
                            <span className="text-gray-900 font-medium">
                              {formValue}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => playAudio(formValue)}
                              className="text-gray-400 hover:text-orange-500 p-1 h-5 w-5"
                            >
                              <Volume2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Bottom Mood Navigation */}
      <div className="bg-white border-t border-gray-200 px-6 py-3">
        <div className="flex items-center justify-center gap-1">
          {moods.map((mood) => (
            <Button
              key={mood.id}
              variant={selectedMood === mood.id ? "default" : "ghost"}
              size="sm"
              onClick={() => setSelectedMood(mood.id)}
              className={`px-4 py-2 text-sm font-medium transition-all duration-200 ${
                selectedMood === mood.id
                  ? 'bg-gradient-to-r from-orange-400 to-pink-400 text-white shadow-md'
                  : 'text-gray-600 hover:text-orange-600 hover:bg-orange-50'
              }`}
            >
              {mood.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}