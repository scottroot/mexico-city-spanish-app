'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Volume2, Heart, X } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { useLanguage } from '../../contexts/LanguageContext';
import { playTTS, fallbackTTS } from '../../lib/tts-client';
import { Favorites } from '../../entities/Favorites';

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
  { id: 'Indicativo', label: 'Indicative', labelEs: 'Indicativo' },
  { id: 'Subjuntivo', label: 'Subjunctive', labelEs: 'Subjuntivo' },
  { id: 'Imperativo', label: 'Imperative', labelEs: 'Imperativo' },
  { id: 'Otros', label: 'Other', labelEs: 'Otros' }
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
  const [isFavorite, setIsFavorite] = useState(false);
  const [loadingFavorite, setLoadingFavorite] = useState(false);
  const { t, language } = useLanguage();

  // Load favorite status on mount
  React.useEffect(() => {
    const checkFavorite = async () => {
      const favorited = await Favorites.isFavorited(verb.infinitive);
      setIsFavorite(favorited);
    };
    checkFavorite();
  }, [verb.infinitive]);

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

  // Toggle favorite
  const toggleFavorite = async () => {
    setLoadingFavorite(true);
    try {
      if (isFavorite) {
        const result = await Favorites.removeFavorite(verb.infinitive);
        if (result.success) {
          setIsFavorite(false);
        }
      } else {
        const result = await Favorites.addFavorite(verb.infinitive);
        if (result.success) {
          setIsFavorite(true);
        }
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    } finally {
      setLoadingFavorite(false);
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
    <div className="h-full flex flex-col">
      {/* Main Content Header */}
      <div className="py-4 border-b border-orange-200 bg-gradient-to-r from-orange-50 to-pink-50 relative">
        <div className="flex items-center justify-center gap-3">
          <h1 className="text-sm md:text-base lg:text-xl font-bold text-gray-900">
            {verb.infinitive} <span className="text-gray-500">({verb.infinitive_english})</span>
          </h1>
          <div className="flex items-center gap-2">
            <button
              onClick={() => playAudio(verb.infinitive)}
              className="p-2 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <Volume2 className="w-4 h-4 text-white" />
            </button>
            <button
              onClick={toggleFavorite}
              disabled={loadingFavorite}
              className={`p-2 rounded-full transition-all duration-200 ${
                isFavorite 
                  ? 'bg-red-500 hover:bg-red-600 shadow-md' 
                  : 'bg-gray-100 hover:bg-gray-200'
              } ${loadingFavorite ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <Heart className={`w-4 h-4 ${
                isFavorite ? 'text-white fill-white' : 'text-gray-600'
              }`} />
            </button>
          </div>
      </div>
        
        {/* Close Button */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-all duration-200 shadow-sm hover:shadow-md"
            title="Close"
          >
            <X className="w-4 h-4 text-gray-600" />
          </button>
        )}
      </div>

      {/* Conjugation Grid */}
      <div className="flex-1 overflow-y-auto bg-white">
        <div className="grid gap-4 p-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {currentConjugations.map((conjugation, index) => (
            <motion.div
              key={conjugation.tense}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className=" bg-white h-full shadow-none border-none">
                <CardContent className="p-3">
                  {/* Card Header */}
                  <h3 className="font-normal text-gray-900 text-sm md:text-base lg:text-xl  mb-2">
                    {language === 'en' && 'tense_english' in conjugation 
                      ? conjugation.tense_english 
                      : conjugation.tense}
                  </h3>
                  
                  {/* Card Body - Compact List */}
                  <div className="space-y-1">
                    {pronouns.map((pronoun, formIndex) => {
                      const formValue = (conjugation as any)[pronoun.key] as string;
                      if (!formValue || formValue.trim() === '') return null;
                      
                      return (
                        <div key={formIndex} className="flex items-center justify-between text-xs md:text-sm lg:text-base gap-2">
                          <span className="text-gray-600 font-medium min-w-[50px] flex-shrink-0">
                            {pronoun.label}
                          </span>
                          <span className="text-gray-900 font-medium flex-1 text-right">
                            {formValue}
                          </span>
                          <button
                            onClick={() => playAudio(formValue)}
                            className="p-1 rounded-full bg-gradient-to-r from-orange-400 to-pink-400 hover:from-orange-500 hover:to-pink-500 transition-all duration-200 shadow-sm hover:shadow-md flex-shrink-0"
                          >
                            <Volume2 className="w-3 h-3 text-white" />
                          </button>
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

      {/* Bottom Navigation - Sticky Tab Bar */}
        <div className="sticky bottom-0 border-t bg-gradient-to-r from-orange-50 to-pink-50 flex justify-center gap-2 p-2">
        {moods.map((mood) => (
            <button
              key={mood.id}
              onClick={() => setSelectedMood(mood.id)}
              className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 ${
                selectedMood === mood.id
                  ? 'bg-gradient-to-r from-orange-400 to-pink-400 text-white shadow-md'
                  : 'text-gray-600 hover:text-orange-600 hover:bg-orange-50'
              }`}
            >
              {language === 'en' ? mood.label : mood.labelEs}
            </button>
        ))}
      </div>
    </div>
  );
}