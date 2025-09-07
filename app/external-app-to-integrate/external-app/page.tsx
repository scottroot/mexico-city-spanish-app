'use client';

import { useState, useEffect } from 'react';
import VerbSidebar from './components/VerbSidebar';
import ConjugationDisplay from './components/ConjugationDisplay';
import TenseTimeline from './components/TenseTimeline';
import { Verb } from './utils/verbs';

export default function Home() {
  const [verbs, setVerbs] = useState<Verb[]>([]);
  const [selectedVerb, setSelectedVerb] = useState<Verb | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingVerb, setLoadingVerb] = useState(false);

  useEffect(() => {
    // Load verb list only
    const loadVerbs = async () => {
      try {
        console.log('Fetching verbs from API...');
        const response = await fetch('/api/verbs');
        console.log('API response status:', response.status);
        const data = await response.json();
        console.log('API response data:', data);
        setVerbs(data);
      } catch (error) {
        console.error('Error loading verbs:', error);
      } finally {
        setLoading(false);
      }
    };

    loadVerbs();
  }, []);

  const loadVerbConjugations = async (infinitive: string) => {
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

  const handleVerbSelect = async (infinitive: string) => {
    await loadVerbConjugations(infinitive);
  };

  const handleCloseVerb = () => {
    setSelectedVerb(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Spanish verbs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <VerbSidebar
        verbs={verbs}
        selectedVerb={selectedVerb?.infinitive || null}
        onVerbSelect={handleVerbSelect}
      />
      {selectedVerb ? (
        <ConjugationDisplay verb={selectedVerb} loading={loadingVerb} onClose={handleCloseVerb} />
      ) : (
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-6 py-8">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-6">
                Spanish Conjugation Viewer
              </h1>
              <p className="text-xl text-gray-600">
                Welcome! Select a verb from the sidebar to view its complete conjugation table.
              </p>
            </div>
            
            <TenseTimeline />
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Features:</h2>
              <ul className="text-gray-600 space-y-2 text-left">
                <li>• Browse thousands of Spanish verbs</li>
                <li>• View all tenses and moods</li>
                <li>• Irregular letters highlighted in red</li>
                <li>• Search functionality</li>
                <li>• Clean, organized layout</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
