'use client'

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { BookOpen, Play, Volume2, CheckCircle, XCircle } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { playTTS, fallbackTTS } from '../../lib/tts-client';

export default function VerbsPage() {
  const [verbs, setVerbs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVerb, setSelectedVerb] = useState(null);
  const [showConjugation, setShowConjugation] = useState(false);
  const { t } = useLanguage();

  // Sample verbs data - you can replace this with actual data from your backend
  const sampleVerbs = [
    {
      id: 'hablar',
      infinitive: 'hablar',
      meaning: 'to speak',
      category: 'regular',
      conjugations: {
        present: {
          yo: 'hablo',
          tú: 'hablas',
          él: 'habla',
          nosotros: 'hablamos',
          vosotros: 'habláis',
          ellos: 'hablan'
        }
      }
    },
    {
      id: 'comer',
      infinitive: 'comer',
      meaning: 'to eat',
      category: 'regular',
      conjugations: {
        present: {
          yo: 'como',
          tú: 'comes',
          él: 'come',
          nosotros: 'comemos',
          vosotros: 'coméis',
          ellos: 'comen'
        }
      }
    },
    {
      id: 'vivir',
      infinitive: 'vivir',
      meaning: 'to live',
      category: 'regular',
      conjugations: {
        present: {
          yo: 'vivo',
          tú: 'vives',
          él: 'vive',
          nosotros: 'vivimos',
          vosotros: 'vivís',
          ellos: 'viven'
        }
      }
    }
  ];

  useEffect(() => {
    // Simulate loading verbs data
    const loadVerbs = async () => {
      try {
        // In a real app, you'd fetch from your API
        await new Promise(resolve => setTimeout(resolve, 500));
        setVerbs(sampleVerbs);
      } catch (error) {
        console.error('Error loading verbs:', error);
        setVerbs([]);
      }
      setLoading(false);
    };

    loadVerbs();
  }, []);

  const playAudio = async (text) => {
    try {
      console.log('Playing TTS for:', text);
      await playTTS(text);
      console.log('TTS audio played successfully');
    } catch (error) {
      console.error('Error with TTS:', error);
      // Fallback to browser speech synthesis
      fallbackTTS(text);
    }
  };

  const handleVerbSelect = (verb) => {
    setSelectedVerb(verb);
    setShowConjugation(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-teal-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-3 mb-4"
          >
            <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-pink-400 rounded-full flex items-center justify-center shadow-lg">
              <BookOpen className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-800">{t('verbs.title')}</h1>
          </motion.div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('verbs.subtitle')}
          </p>
        </div>

        {/* Verbs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {verbs.map((verb, index) => (
            <motion.div
              key={verb.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer group">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl font-bold text-gray-800 group-hover:text-orange-600 transition-colors">
                      {verb.infinitive}
                    </CardTitle>
                    <Badge variant="outline" className="text-xs">
                      {verb.category}
                    </Badge>
                  </div>
                  <p className="text-gray-600 text-sm">{verb.meaning}</p>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => playAudio(verb.infinitive)}
                      className="flex items-center gap-2"
                    >
                      <Volume2 className="w-4 h-4" />
                      {t('verbs.listen')}
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleVerbSelect(verb)}
                      className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600"
                    >
                      <Play className="w-4 h-4" />
                      {t('verbs.learn')}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Conjugation Modal */}
        {showConjugation && selectedVerb && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowConjugation(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold text-gray-800">
                  {selectedVerb.infinitive}
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowConjugation(false)}
                >
                  ✕
                </Button>
              </div>
              
              <p className="text-gray-600 mb-4">{selectedVerb.meaning}</p>
              
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-800">{t('verbs.presentTense')}</h4>
                {Object.entries(selectedVerb.conjugations.present).map(([pronoun, conjugation]) => (
                  <div key={pronoun} className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                    <span className="font-medium text-gray-700">{pronoun}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-800">{conjugation}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => playAudio(conjugation)}
                        className="p-1"
                      >
                        <Volume2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
