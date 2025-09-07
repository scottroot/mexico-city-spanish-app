'use client'

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Sparkles } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import VerbSidebar from '../../components/verbs/VerbSidebar';
import ConjugationDisplay from '../../components/verbs/ConjugationDisplay';
import TenseTimeline from '../../components/verbs/TenseTimeline';

export default function VerbsPage() {
  const [verbs, setVerbs] = useState([]);
  const [selectedVerb, setSelectedVerb] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingVerb, setLoadingVerb] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    // Load verb list from API
    const loadVerbs = async () => {
      try {
        // console.log('Fetching verbs from API...');
        const response = await fetch('/api/verbs');
        // console.log('API response status:', response.status);
        const data = await response.json();
        // console.log('API response data:', data);
        setVerbs(data);
      } catch (error) {
        console.error('Error loading verbs:', error);
      } finally {
        setLoading(false);
      }
    };

    loadVerbs();
  }, []);

  const loadVerbConjugations = async (infinitive) => {
    setLoadingVerb(true);
    try {
      const response = await fetch(`/api/verbs/${encodeURIComponent(infinitive)}`);
      if (response.ok) {
        const verbData = await response.json();
        setSelectedVerb(verbData);
      }
    } catch (error) {
      console.error('Error loading verb conjugations:', error);
    } finally {
      setLoadingVerb(false);
    }
  };

  const handleVerbSelect = async (infinitive) => {
    await loadVerbConjugations(infinitive);
  };

  const handleCloseVerb = () => {
    setSelectedVerb(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">{t('verbs.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full bg-gray-50">
      {/* Verb Sidebar - Fixed width on left */}
      <div className="w-80 flex-shrink-0 border-r border-gray-200 bg-white">
        <VerbSidebar
          verbs={verbs}
          selectedVerb={selectedVerb?.infinitive || null}
          onVerbSelect={handleVerbSelect}
          loading={loading}
        />
      </div>
      
      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden">
        {selectedVerb ? (
          <ConjugationDisplay 
            verb={selectedVerb} 
            loading={loadingVerb} 
            onClose={handleCloseVerb} 
          />
        ) : (
          <div className="h-full overflow-y-auto">
            <div className="max-w-4xl mx-auto px-6 py-8">
              <div className="text-center mb-8">
                <div className="flex items-center justify-center gap-2 mb-6">
                  <Sparkles className="w-8 h-8 text-orange-500" />
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
                    {t('verbs.title')}
                  </h1>
                </div>
                <p className="text-xl text-gray-600">
                  {t('verbs.subtitle')}
                </p>
              </div>
              
              <TenseTimeline />
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
              >
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-orange-500" />
                  {t('verbs.features')}
                </h2>
                <ul className="text-gray-600 space-y-2 text-left">
                  <li>• {t('verbs.feature1')}</li>
                  <li>• {t('verbs.feature2')}</li>
                  <li>• {t('verbs.feature3')}</li>
                  <li>• {t('verbs.feature4')}</li>
                  <li>• {t('verbs.feature5')}</li>
                </ul>
              </motion.div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}