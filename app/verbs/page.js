'use client'

import React, { useState, useEffect } from 'react';
import { 
  Orbit,
  Play,
  CalendarCheck,Calendar,CalendarSync,
  Sunset,
  Circle,
  CircleDot,
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import CondensedConjugationDisplay from '../../components/verbs/CondensedConjugationDisplay';
import { Favorites } from '../../entities/Favorites';
import { cn } from '@/lib/cn';
import LeftSidebar from './LeftSidebar';


function Loading({ t }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
        <p className="text-gray-600">{t('verbs.loading')}</p>
      </div>
    </div>
  )
}




function Timeline() {
  const getColorStyles = (color) => {
    const colorMap = {
      'past': { bg: 'bg-red-100', text: 'text-neutral-900' },
      'present': { bg: 'bg-orange-200', text: 'text-neutral-900' },
      'conditional': { bg: 'bg-blue-100', text: 'text-neutral-900' },
      'future': { bg: 'bg-slate-200', text: 'text-neutral-900' },
    }
    return colorMap[color] || { bg: '#E5E7EB', text: '#374151' }
  }
  const tenses = [
    { tense: "Past Perfect", text: "I had eaten", color: "past", icon: CalendarCheck },
    { tense: "Past Simple", text: "I ate", color: "past", icon: Calendar },
    { tense: "Imperfect", text: "I was eating", color: "past", icon: CalendarSync },
    { tense: "Present Perfect", text: "I have eaten", color: "present", icon: Circle },
    { tense: "Present Simple", text: "I eat", color: "present", icon: CircleDot },
    { tense: "Conditional", text: "I would eat", color: "conditional", icon: Orbit },
    { tense: "Conditional Perfect", text: "I would have eaten", color: "conditional", icon: Orbit },
    { tense: "Future Simple", text: "I will eat", color: "future", icon: Sunset },
    { tense: "Future Perfect", text: "I will have eaten", color: "future", icon: Sunset },
    // { tense: "Present Continuous", text: "I am eating", position: "top" },
    // { tense: "Future Continuous", text: "I will be eating", position: "top" },
  ]

  const TimeLineCircle = ({ icon, color }) => {
    const colorStyles = getColorStyles(color)
    return (
      <div className="flex items-center h-6 my-6 xtranslate-x-1/4">
        <div className="hidden sm:flex w-full bg-gray-200 h-0.5 dark:bg-gray-700"></div>
        <div 
          className={cn(
            "z-10 flex items-center justify-center w-6 h-6 rounded-full ring-0 ring-white dark:bg-blue-900 sm:ring-8 dark:ring-gray-900 shrink-0 ",
            colorStyles.bg
          )}
        >
          {React.createElement(icon, { 
            className: cn("w-4 h-4 ", colorStyles.text),
          })}
        </div>
        <div className="hidden sm:flex w-full bg-gray-200 h-0.5 dark:bg-gray-700 xnot-last:sm:pe-4"></div>
      </div>
    )
  }

  const TimeLineItemBody = ({ tense, text, color }) => {
    const colorStyles = getColorStyles(color)
    const bgClass = `text-center p-2 rounded-lg ${colorStyles.bg}`;
    const h3Class = `text-base font-semibold leading-5 h-10 flex items-center justify-center ${colorStyles.text}`;
    const pClass = `text-xs font-normal leading-5 h-10 flex items-center justify-center ${colorStyles.text}`;
    return (
      <div 
        // className="text-center p-2 rounded-lg"
        // style={{ backgroundColor: colorStyles.bg }}
        className={cn("text-center p-2 rounded-lg ", colorStyles.bg)}
        // className={bgClass}
      >
        <h3 
          //  className="text-base font-semibold leading-5 h-10 flex items-center justify-center"
          // style={{ color: colorStyles.text }}
          className={cn(
            "text-base font-semibold leading-5 h-10 flex items-center justify-center",
            colorStyles.text
         )}
       >
          {tense}
        </h3>
        <p 
          // className="text-xs font-normal leading-5 h-10 flex items-center justify-center"
          // style={{ color: colorStyles.text }}
          className={cn(
            "text-xs font-normal leading-5 h-10 flex items-center justify-center",
            colorStyles.text
          )}
        >
          {text}
        </p>
      </div>
    )
  }
  

  const TimeLineItem = ({ tense, text, position, color, icon }) => {
    if (position === "top") {
      return (
        <li className="relative flex flex-col h-104 flex-1">
          <div className="flex flex-col flex-shrink-0 h-48 not-first:sm:pl-4 not-last:sm:pr-4 justify-end">
            <TimeLineItemBody tense={tense} text={text} color={color} icon={icon} />
          </div>
          <TimeLineCircle icon={icon} color={color} />
          <div className="h-48" />
        </li>
      )
    }
    // Position === bottom
    return (
      <li className="relative flex flex-col flex-1">
        <div className="h-48" />
        <TimeLineCircle icon={icon} color={color} />
        <div className="flex flex-col flex-shrink-0 h-48 not-first:sm:pl-4 not-last:sm:pr-8 justify-start">
          <TimeLineItemBody tense={tense} text={text} color={color} />
        </div>
      </li>
    )
  }
}

function DefaultMainContent({ t }) {
  

  return (
    <div id="verbs-main-content" className="max-xl:scale-50 xl:max-2xl:scale-65">
      {/* <TenseTimeline /> */}
      <div className="flex items-center px-4">
        {/* Start Circle */}
        <div className="flex items-center justify-center w-6 h-6">
          <Circle className="w-4 h-4 text-gray-400 fill-gray-400" />
          <div className="hidden sm:flex w-full bg-gray-200 h-0.5 dark:bg-gray-700"></div>
        </div>
        
        {/* Timeline */}
        <ol className="items-center sm:flex mb-6 sm:mb-0 flex-1">
          {tenses.map((tense, idx) => {
            const position = idx % 2 === 0 ? "top" : "bottom";
            return (
              <TimeLineItem 
                key={idx}
                position={position}
                tense={tense.tense}
                text={tense.text}
                color={tense.color}
                // icon={<tense.icon className={cn("w-4 h-4 ", `text-${tense.color}`)} />}
                icon={tense.icon}
              />
            )
          })}
        </ol>
        
        {/* End Arrow */}
        <div className="flex items-center justify-center w-6 h-6">
          <div className="hidden sm:flex w-full bg-gray-200 h-0.5 dark:bg-gray-700"></div>
          <Play className="w-4 h-4 text-gray-400 fill-gray-400" />
        </div>
      </div>
    </div>
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

  if (loading) return <Loading t={t} />;


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
            <div className="hidden md:flex h-full w-full items-center justify-center mt-20">
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