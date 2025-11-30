import { cn } from "@/lib/cn";
import { Heart, Menu, Search, X } from "lucide-react";


export function SearchInput({ searchQuery, setSearchQuery, showVerbs }: { searchQuery: string, setSearchQuery: (query: string) => void, showVerbs: (show: boolean) => void }) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
      <input
        type="text"
        placeholder="Search verbs..."
        value={searchQuery}
        onChange={(e) => {
          setSearchQuery(e.target.value);
          showVerbs(true);
        }}
        className="w-full pl-10 pr-4 py-2 bg-gray-50 text-gray-900 rounded-lg border border-gray-200 
        focus:ring-2 focus:ring-orange-300 focus:border-orange-300 focus:outline-none"
      />
    </div>
  )
}

// Mobile Header Component - Shows on mobile screens only
export function MobileHeader({ 
  showFavoritesOnly, 
  searchQuery, 
  setSearchQuery,
  setShowFavoritesOnly,
  selectedVerb
}: { 
  showFavoritesOnly: boolean, 
  searchQuery: string, 
  setSearchQuery: (query: string) => void,
  setShowFavoritesOnly: (show: boolean) => void,
  selectedVerb: any | null
}) {
  // Don't render anything when a verb is selected
  if (selectedVerb) return null;
  
  return (
    <div className="sticky top-0 z-40 bg-white border-b border-gray-200 md:hidden">
      <div className="p-4 space-y-3">
        {/* Only show header for favorites or search results, not for "All Verbs" */}
        {(showFavoritesOnly || searchQuery) && (
          <h2 className="text-lg font-semibold text-gray-900">
            {showFavoritesOnly 
              ? (searchQuery ? `Favorite results for "${searchQuery}"` : 'Favorite Verbs')
              : `Results for "${searchQuery}"`
            }
          </h2>
        )}
        
        {/* Search and controls */}
        <SearchInput
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          showVerbs={() => {}}
        />
        
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
            className={cn(
              "cursor-pointer flex items-center gap-2 p-2 rounded text-sm transition-colors",
              showFavoritesOnly ? 'bg-red-100 text-red-600' : 'hover:bg-gray-100 text-gray-600'
            )}
          >
            <Heart className={cn("w-4 h-4", showFavoritesOnly ? 'fill-current' : '')} />
            Show Favorites
          </button>
        </div>
      </div>
    </div>
  )
}

// Desktop Header Component - Shows on desktop screens only
function DesktopHeader({ 
  showFavoritesOnly, searchQuery 
}: { 
  showFavoritesOnly: boolean, searchQuery: string 
}) {
  return (
    <div id="verbs-list-header" className="mb-3">
      <h2 className="text-lg font-semibold text-gray-900">
        {showFavoritesOnly 
          ? (searchQuery ? `Favorite results for "${searchQuery}"` : 'Favorite Verbs')
          : (searchQuery ? `Results for "${searchQuery}"` : 'All Verbs')
        }
      </h2>
    </div>
  )
}

// Verb List Content Component - Reusable for both desktop and mobile
function VerbListContent({ 
  filteredVerbs, 
  handleVerbSelect, 
  setMobileVerbsExpanded, 
  selectedVerb, 
  favorites, 
  toggleFavorite,
  loadingFavorites,
}: { 
  filteredVerbs: any[], 
  handleVerbSelect: (infinitive: string) => void, 
  setMobileVerbsExpanded: (show: boolean) => void, 
  selectedVerb: any, 
  favorites: Set<string>, 
  toggleFavorite: (infinitive: string) => void,
  loadingFavorites: boolean,
}) {
  return (
    <div className="space-y-1 pr-4 overflow-x-hidden w-full">
      {filteredVerbs.map((verb) => (
        <div
          key={verb.infinitive}
          onClick={(e: any) => {
            e.preventDefault();
            handleVerbSelect(verb.infinitive);
            setMobileVerbsExpanded(false);
          }}
          className={`w-full p-2 rounded-lg transition-colors cursor-pointer ${
            selectedVerb?.infinitive === verb.infinitive
              ? 'bg-orange-50 border border-orange-200 text-orange-900'
              : 'hover:bg-gray-50 text-gray-700'
          }`}
        >
          <div className="flex items-center justify-between w-full min-w-0">
            <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(verb.infinitive);
                  }}
                  className={`cursor-pointer p-0 rounded transition-colors ${
                    favorites.has(verb.infinitive)
                      ? 'text-red-500 hover:text-red-600'
                      : 'text-gray-400 hover:text-red-500'
                  }`}
                >
                  {/* {loadingFavorites
                    ? <div className="w-4 h-4 animate-pulse bg-gray-300 rounded" />
                    : <Heart className={`w-4 h-4 ${favorites.has(verb.infinitive) ? 'fill-current text-red-500' : 'text-gray-400'}`} />
                  } */}
                  <Heart 
                    className={cn(
                      "w-4 h-4",
                      loadingFavorites 
                        ? 'animate-pulse text-gray-300 cursor-loading'
                        : favorites.has(verb.infinitive) ? 'fill-current text-red-500' : 'text-gray-400'
                    )} 
                  />
                </button>
              
              <span className="text-sm font-medium">
                {verb.infinitive}
              </span>
            </div>
            <span className="text-sm text-gray-500 text-right max-w-[150px] truncate">
              {verb.infinitive_english.split(',').slice(0)[0].split(';').slice(0)[0]}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}

// Desktop Verb List - Shows on desktop screens only
function DesktopVerbList({ 
  filteredVerbs, 
  handleVerbSelect, 
  setMobileVerbsExpanded, 
  selectedVerb, 
  favorites, 
  toggleFavorite,
  loadingFavorites,
}: { 
  filteredVerbs: any[], 
  handleVerbSelect: (infinitive: string) => void, 
  setMobileVerbsExpanded: (show: boolean) => void, 
  selectedVerb: any, 
  favorites: Set<string>, 
  toggleFavorite: (infinitive: string) => void,
  loadingFavorites: boolean,
}) {
  return (
    <div className="relative overflow-y-auto flex-1 overscroll-contain border-t w-full border-gray-200 hidden md:flex">
      <VerbListContent
        filteredVerbs={filteredVerbs}
        handleVerbSelect={handleVerbSelect}
        setMobileVerbsExpanded={setMobileVerbsExpanded}
        selectedVerb={selectedVerb}
        favorites={favorites}
        toggleFavorite={toggleFavorite}
        loadingFavorites={loadingFavorites}
      />
    </div>
  )
}

// Mobile Verb List - Shows as main content on mobile when no verb selected
export function MobileVerbList({ 
  filteredVerbs, 
  handleVerbSelect, 
  selectedVerb, 
  favorites, 
  toggleFavorite,
  loadingFavorites,
}: { 
  filteredVerbs: any[], 
  handleVerbSelect: (infinitive: string) => void, 
  selectedVerb: any, 
  favorites: Set<string>, 
  toggleFavorite: (infinitive: string) => void,
  loadingFavorites: boolean,
}) {
  // Only show on mobile when no verb is selected
  if (selectedVerb) return null;
  
  return (
    <div className="md:hidden bg-white min-h-screen">
      <div className="p-4">
        <div className="space-y-1">
          {filteredVerbs.map((verb) => (
            <div
              key={verb.infinitive}
              onClick={(e: any) => {
                e.preventDefault();
                handleVerbSelect(verb.infinitive);
              }}
              className="w-full p-3 rounded-lg transition-colors cursor-pointer hover:bg-gray-50 text-gray-700 border border-gray-100"
            >
              <div className="flex items-center justify-between w-full min-w-0">
                <div className="flex items-center gap-3 flex-shrink-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(verb.infinitive);
                    }}
                    className={`cursor-pointer p-1 rounded transition-colors ${
                      favorites.has(verb.infinitive)
                        ? 'text-red-500 hover:text-red-600'
                        : 'text-gray-400 hover:text-red-500'
                    }`}
                  >
                    {/* {loadingFavorites
                      ? <div className="w-5 h-5 animate-pulse bg-gray-300 rounded" />
                      : <Heart className={`w-5 h-5 ${favorites.has(verb.infinitive) ? 'fill-current text-red-500' : 'text-gray-400'}`} />
                    } */}
                    <Heart 
                      className={cn(
                        "w-4 h-4",
                        loadingFavorites 
                          ? 'animate-pulse text-gray-300 cursor-loading'
                          : favorites.has(verb.infinitive) ? 'fill-current text-red-500' : 'text-gray-400'
                      )} 
                    />
                  </button>
                  <span className="text-base font-medium">
                    {verb.infinitive}
                  </span>
                </div>
                <span className="text-sm text-gray-500 text-right max-w-[120px] truncate">
                {/* <span className="text-sm text-gray-500 text-right max-w-[150px] truncate"> */}
                  {verb.infinitive_english.split(',').slice(0)[0].split(';').slice(0)[0]}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}



// Left Sidebar - Verb List
export default function LeftSidebar({ 
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
  }: {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    showFavoritesOnly: boolean;
    setShowFavoritesOnly: (show: boolean) => void;
    filteredVerbs: any[];
    handleVerbSelect: (infinitive: string) => void;
    selectedVerb: any | null;
    favorites: Set<string>;
    toggleFavorite: (infinitive: string) => void;
    loadingFavorites: boolean;
  }) {
    
    return (
      <>
        {/* Mobile Header - Sticky at top on mobile */}
        <MobileHeader
          showFavoritesOnly={showFavoritesOnly}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          setShowFavoritesOnly={setShowFavoritesOnly}
          selectedVerb={selectedVerb}
        />

        {/* Desktop Sidebar - Hidden on mobile */}
        <div className="hidden md:fixed md:inset-y-0 md:flex md:w-72 md:flex-col border-r border-gray-200 bg-white md:h-full">
          <div className="p-4 pr-0 border-t border-orange-100 flex flex-col h-full">
            {/* Desktop Header */}
            <div className="mb-4 pr-4">
              <DesktopHeader
                showFavoritesOnly={showFavoritesOnly}
                searchQuery={searchQuery}
              />
              <SearchInput
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                showVerbs={() => {}}
              />
            </div>
            
            {/* Favorites Toggle */}
            <div className="flex items-center gap-2 mb-4 pr-4">
              <button 
                onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                className={cn(
                  "cursor-pointer flex items-center gap-2 p-2 rounded text-sm transition-colors",
                  showFavoritesOnly ? 'bg-red-100 text-red-600' : 'hover:bg-gray-100 text-gray-600',
                  loadingFavorites ? 'opacity-50 cursor-loading animate-pulse' : ''
                )}
                disabled={loadingFavorites}
              >
                <Heart 
                  className={cn(
                    "w-4 h-4", 
                    showFavoritesOnly ? 'fill-current' : ''
                  )}
                />
                Show Favorites
              </button>
            </div>
            
            {/* Desktop Verb List */}
            <DesktopVerbList
              filteredVerbs={filteredVerbs}
              handleVerbSelect={handleVerbSelect}
              setMobileVerbsExpanded={() => {}}
              selectedVerb={selectedVerb}
              favorites={favorites}
              toggleFavorite={toggleFavorite}
              loadingFavorites={loadingFavorites}
            />
          </div>
        </div>

        {/* Mobile Verb List - Shows as main content when no verb selected */}
        <MobileVerbList
          filteredVerbs={filteredVerbs}
          handleVerbSelect={handleVerbSelect}
          selectedVerb={selectedVerb}
          favorites={favorites}
          toggleFavorite={toggleFavorite}
          loadingFavorites={loadingFavorites}
        />
      </>
    )
  }
  