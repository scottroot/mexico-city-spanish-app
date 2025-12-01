'use client'

import { useState, useEffect } from 'react';
import { Favorites } from '../../entities/Favorites';

export function useVerbs() {
  const [verbs, setVerbs] = useState<any[]>([]);
  const [selectedVerb, setSelectedVerb] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [loadingVerb, setLoadingVerb] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredVerbs, setFilteredVerbs] = useState<any[]>([]);
  const [favorites, setFavorites] = useState(new Set<string>());
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

  const loadVerbConjugations = async (infinitive: string) => {
    setLoadingVerb(true);
    const prevVerb = selectedVerb;
    setSelectedVerb({infinitive});
    try {
      const response = await fetch(`/api/verbs/${encodeURIComponent(infinitive)}`);
      if (response.ok) {
        const verbData = await response.json();
        setSelectedVerb(verbData);
      }
    } catch (error) {
      console.error('Error loading verb conjugations:', error);
      setSelectedVerb(prevVerb);
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

  const loadFavorites = async () => {
    setLoadingFavorites(true);
    try {
      const result = await Favorites.getUserFavorites();
      if (result.success && result.data) {
        setFavorites(new Set(result.data));
      }
      setLoadingFavorites(false);
    } 
    catch (error) {
      console.error('Error loading favorites:', error);
      setLoadingFavorites(false);
    } 
  };

  const toggleFavorite = async (infinitive: string) => {
    setLoadingFavorites(true);
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
    } finally {
      setLoadingFavorites(false);
    }
  };

  return {
    verbs,
    selectedVerb,
    loading,
    loadingVerb,
    searchQuery,
    setSearchQuery,
    filteredVerbs,
    favorites,
    showFavoritesOnly,
    setShowFavoritesOnly,
    loadingFavorites,
    handleVerbSelect,
    handleCloseVerb,
    toggleFavorite
  };
}
