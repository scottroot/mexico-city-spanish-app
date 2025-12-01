'use client'

import React from 'react';
import CondensedConjugationDisplay from '../../components/verbs/CondensedConjugationDisplay';
import LeftSidebar from './LeftSidebar';
// import Loading from './Loading';
import DefaultMainContent from './DefaultMainContent';
import { useVerbs } from './useVerbs';


export default function VerbsPage({ user }: { user?: any }) {
  const {
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
  } = useVerbs();

  // if (loading) return <Loading />;


  return (
    <>
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
        loadingFavorites={loadingFavorites}
      />

      {/* Right Main Content */}
      <div className="flex-1 overflow-y-auto bg-gray-50 max-md:h-full overscroll-contain md:pl-72">
        {selectedVerb 
          ? (
            <CondensedConjugationDisplay 
              verb={selectedVerb} 
              loading={loadingVerb} 
              onClose={handleCloseVerb}
              favorites={favorites}
              toggleFavorite={toggleFavorite}
              loadingFavorites={loadingFavorites}
            />
          )
          : <DefaultMainContent user={user} />
        }
      </div>
    </>
  );
}