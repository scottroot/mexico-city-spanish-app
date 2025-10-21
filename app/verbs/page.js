'use client'

import React, { useState, useEffect } from 'react';
import Image from "next/image";
import CondensedConjugationDisplay from '../../components/verbs/CondensedConjugationDisplay';
import { Favorites } from '../../entities/Favorites';
import { cn } from '@/lib/cn';
import LeftSidebar from './LeftSidebar';


function Loading() {
  return (

    <div className="relative flex items-center w-full h-[75vh] max-w-6xl px-6 lg:mx-auto">
      {/* Main content area */}
      <main className="flex-1 min-w-0 h-full lg:pr-96 pt-6 flex flex-col items-center justify-center gap-2">
        <Image src="/images/coyote-running-loading-transparent.gif" alt="" width={150} height={150} className="" />
        <div className="text-lg  italic text-stone-700 animate-pulse">LOADING VERBS...</div>
      </main>
    </div>

    // {/* <div className="min-h-screen flex items-center justify-center bg-gray-50">
    //   <div className="text-center">
    //     <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
    //     <p className="text-gray-600">Loading Spanish verbs...</p>
    //   </div>
    // </div> */}
  )
}


export default function VerbsPage() {
  const [verbs, setVerbs] = useState([]);
  const [selectedVerb, setSelectedVerb] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingVerb, setLoadingVerb] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredVerbs, setFilteredVerbs] = useState([]);
  const [favorites, setFavorites] = useState(new Set());
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [loadingFavorites, setLoadingFavorites] = useState(false);

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
        setFilteredVerbs(data);
      } catch (error) {
        console.error('Error loading verbs:', error);
      } finally {
        setLoading(false);
      }
    };

    loadVerbs();
    loadFavorites();
  }, []);

  // Filter verbs based on search query and favorites
  useEffect(() => {
    let filtered = verbs;
    
    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(verb =>
        verb.infinitive.toLowerCase().includes(searchQuery.toLowerCase()) ||
        verb.infinitive_english.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply favorites filter
    if (showFavoritesOnly) {
      filtered = filtered.filter(verb => favorites.has(verb.infinitive));
    }
    
    setFilteredVerbs(filtered);
  }, [searchQuery, verbs, favorites, showFavoritesOnly]);

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

  const loadFavorites = async () => {
    setLoadingFavorites(true);
    try {
      const result = await Favorites.getUserFavorites();
      if (result.success && result.data) {
        setFavorites(new Set(result.data));
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    } finally {
      setLoadingFavorites(false);
    }
  };

  const toggleFavorite = async (infinitive) => {
    try {
      if (favorites.has(infinitive)) {
        // Remove from favorites
        const result = await Favorites.removeFavorite(infinitive);
        if (result.success) {
          setFavorites(prev => {
            const newFavorites = new Set(prev);
            newFavorites.delete(infinitive);
            return newFavorites;
          });
        }
      } else {
        // Add to favorites
        const result = await Favorites.addFavorite(infinitive);
        if (result.success) {
          setFavorites(prev => new Set([...prev, infinitive]));
        }
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  if (loading) return <Loading />;


  return (
    <div className="relative flex-1 flex flex-col md:flex-row h-full">
      {/* Mobile Search Bar */}
      {/* <div className="md:hidden bg-white border-b border-gray-200 p-4">
        <SearchInput searchQuery={searchQuery} setSearchQuery={setSearchQuery} showVerbs={() => {}} />
      </div> */}

      <LeftSidebar 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        showFavoritesOnly={showFavoritesOnly}
        setShowFavoritesOnly={setShowFavoritesOnly}
        filteredVerbs={filteredVerbs}
        handleVerbSelect={handleVerbSelect}
        favorites={favorites}
        toggleFavorite={toggleFavorite}
        selectedVerb={selectedVerb}
      />

      {/* Right Main Content */}
      <div className="flex-1 overflow-y-auto bg-gray-50 h-full overscroll-contain md:pl-72">
        {selectedVerb 
          ? (
            <CondensedConjugationDisplay 
              verb={selectedVerb} 
              loading={loadingVerb} 
              onClose={handleCloseVerb} 
            />
          )
          // : <DefaultMainContent t={t} />
          : (
            <div className="hidden md:flex h-screen w-full items-center justify-center mt-20">
              <div className="max-w-2xl space-y-8 px-6 text-center">
                <h1 className="text-3xl font-bold tracking-tight">
                  Master Spanish Verbs
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400">
                  This page is your hub for exploring Spanish verbs. Choose a verb on the
                  left to see its full conjugations, translations, and usage examples.
                </p>
        
                <div className="grid gap-6 rounded-2xl border p-6 shadow-sm dark:border-zinc-800 sm:grid-cols-2">
                  <div className="space-y-2">
                    <h2 className="text-xl font-semibold">How to use this page</h2>
                    <ul className="list-disc space-y-1 pl-5 text-left text-gray-600 dark:text-gray-400">
                      <li>Select a verb from the list</li>
                      <li>Browse its conjugations by tense and mood</li>
                      <li>Read short usage notes and tips</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-xl font-semibold">Why focus on verbs?</h2>
                    <p className="text-gray-600 dark:text-gray-400">
                      Verbs are the backbone of Spanish sentences. Understanding their
                      forms makes speaking and reading easier.
                    </p>
                  </div>
                </div>
        
                <div className="rounded-2xl border bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                  <h2 className="mb-3 text-xl font-semibold">Tips for learning</h2>
                  <ol className="list-decimal space-y-2 pl-5 text-left text-gray-600 dark:text-gray-400">
                    <li>Start with common verbs like <em>ser</em>, <em>estar</em>, and <em>tener</em>.</li>
                    <li>Focus on one tense at a time.</li>
                    <li>Practice with short daily sentences.</li>
                  </ol>
                </div>
        
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Tip: Use the search bar above to quickly find any verb.
                </p>
              </div>
            </div>
          )
        }
      </div>
    </div>
  );
}