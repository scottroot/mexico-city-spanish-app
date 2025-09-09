'use client'

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpen,
  Sparkles,
  Menu,
  Search,
  Heart,
  Share2, 
  Orbit,
  Play,
  History,
  Sunrise,
  Clock,
  CalendarCheck,Calendar,CalendarSync,
  ClockFading,
  SunDim,
  Clock8,Clock10,Clock12,RotateCw,
  Sun,
  Sunset,
  CircleDotDashed,
  Circle,
  LoaderCircle,
  CircleDashed,
  // Circle,
  CircleDot,
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import CondensedConjugationDisplay from '../../components/verbs/CondensedConjugationDisplay';
import TenseTimeline from './tense-timeline';
import { Favorites } from '../../entities/Favorites';
import { cn } from '@/lib/cn';


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

// Mobile Search Bar - Only on small screens
function MobileSearchBar({ searchQuery, setSearchQuery }) {
  return (
    <div className="md:hidden bg-white border-b border-gray-200 p-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          placeholder="Search verbs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-gray-50 text-gray-900 rounded-lg border border-gray-200 focus:ring-2 focus:ring-orange-300 focus:border-orange-300 focus:outline-none"
        />
      </div>
    </div>
  )
}

// Left Sidebar - Verb List
function LeftSidebar({ 
  searchQuery,
  setSearchQuery,
  showFavoritesOnly,
  setShowFavoritesOnly,
  filteredVerbs,
  handleVerbSelect,
  selectedVerb,
  favorites,
  toggleFavorite,
  loadingFavorites
}) {
  return (
    <div 
      className="lg:fixed lg:mt-20 lg:inset-y-0 lg:flex lg:w-72 lg:flex-col
      border-r border-gray-200 bg-white relative h-screen lg:h-full flex flex-col"
    >
      <div className="p-4 pr-0 border-t border-orange-100 flex flex-col h-full">
        {/* Search Header */}
        <div className="mb-4 pr-4">
          <div className="flex items-center gap-2 mb-3">
            <button className="p-1 hover:bg-gray-100 rounded">
              <Menu className="w-5 h-5 text-gray-600" />
            </button>
            <h2 className="text-lg font-semibold text-gray-900">
              {showFavoritesOnly 
                ? (searchQuery ? `Favorite results for "${searchQuery}"` : 'Favorite Verbs')
                : (searchQuery ? `Results for "${searchQuery}"` : 'All Verbs')
              }
            </h2>
          </div>
          
          {/* Search Input - Hidden on mobile */}
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search verbs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 text-gray-900 rounded-lg border border-gray-200 focus:ring-2 focus:ring-orange-300 focus:border-orange-300 focus:outline-none"
            />
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex items-center gap-2 mb-4 pr-4">
          <button 
            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
            className={`flex items-center gap-2 p-2 rounded text-sm transition-colors ${
              showFavoritesOnly 
                ? 'bg-red-100 text-red-600' 
                : 'hover:bg-gray-100 text-gray-600'
            }`}
          >
            <Heart className={`w-4 h-4 ${
              showFavoritesOnly ? 'fill-current' : ''
            }`} />
            Show Favorites
          </button>
          {/* <button className="p-2 hover:bg-gray-100 rounded text-gray-600">
            <Share2 className="w-4 h-4" />
          </button> */}
        </div>
        
        {/* Verb List */}
        <div className="relative overflow-y-auto flex-1 overscroll-contain border-t border-gray-200">
          <div className="space-y-1 pr-4">
            {filteredVerbs.map((verb) => (
              <div
                key={verb.infinitive}
                onClick={() => handleVerbSelect(verb.infinitive)}
                className={`w-full p-2 rounded-lg transition-colors cursor-pointer ${
                  selectedVerb?.infinitive === verb.infinitive
                    ? 'bg-orange-50 border border-orange-200 text-orange-900'
                    : 'hover:bg-gray-50 text-gray-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(verb.infinitive);
                      }}
                      className={`p-0 rounded transition-colors ${
                        favorites.has(verb.infinitive)
                          ? 'text-red-500 hover:text-red-600'
                          : 'text-gray-400 hover:text-red-500'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${
                        favorites.has(verb.infinitive) ? 'fill-current' : ''
                      }`} />
                    </button>
                    <span className="text-sm font-medium">
                      {verb.infinitive}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500 text-right max-w-[120px] truncate">
                    {verb.infinitive_english.split(',').slice(0)[0].split(';').slice(0)[0]}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function DefaultMainContent({ t }) {
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

  return (
    <div>
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
      <MobileSearchBar 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

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
      <div className="flex-1 overflow-y-auto bg-gray-50 h-full overscroll-contain lg:pl-72">
        {selectedVerb 
          ? <CondensedConjugationDisplay 
              verb={selectedVerb} 
              loading={loadingVerb} 
              onClose={handleCloseVerb} 
            />
          : <DefaultMainContent t={t} />
        }
      </div>
    </div>
  );
}