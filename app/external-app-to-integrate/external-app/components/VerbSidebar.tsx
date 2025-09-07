'use client';

import { useState } from 'react';
import { Verb } from '../utils/verbs';

interface VerbSidebarProps {
  verbs: Verb[];
  selectedVerb: string | null;
  onVerbSelect: (infinitive: string) => void;
}

export default function VerbSidebar({ verbs, selectedVerb, onVerbSelect }: VerbSidebarProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const itemsPerPage = 50;

  const filteredVerbs = verbs.filter(verb =>
    (verb.infinitive && verb.infinitive.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (verb.infinitive_english && verb.infinitive_english.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const totalPages = Math.ceil(filteredVerbs.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedVerbs = filteredVerbs.slice(startIndex, endIndex);

  // Reset to page 1 when search term changes
  if (searchTerm && page > 1) {
    setPage(1);
  }

  return (
    <div className="w-80 h-screen bg-gray-50 border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">Spanish Verbs</h2>
        <input
          type="text"
          placeholder="Search verbs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      
      <div className="flex-1 overflow-y-auto">
        <div className="p-2">
          {paginatedVerbs.map((verb) => (
            <button
              key={verb.infinitive}
              onClick={() => onVerbSelect(verb.infinitive)}
              className={`w-full text-left p-3 rounded-md mb-1 transition-colors cursor-pointer ${
                selectedVerb === verb.infinitive
                  ? 'bg-blue-100 text-blue-800 border-l-4 border-blue-500'
                  : 'hover:bg-gray-100 text-gray-700'
              }`}
            >
              <div className="font-medium">{verb.infinitive || 'Unknown verb'}</div>
              <div className="text-sm text-gray-500 truncate">
                {verb.infinitive_english || 'No translation available'}
              </div>
            </button>
          ))}
        </div>
      </div>
      
      <div className="p-4 border-t border-gray-200">
        <div className="flex justify-between items-center text-sm text-gray-500 mb-2">
          <span>{filteredVerbs.length} of {verbs.length} verbs</span>
          {totalPages > 1 && (
            <span>Page {page} of {totalPages}</span>
          )}
        </div>
        {totalPages > 1 && (
          <div className="flex justify-between">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="px-3 py-1 text-sm bg-gray-200 rounded disabled:opacity-50 cursor-pointer"
            >
              Previous
            </button>
            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="px-3 py-1 text-sm bg-gray-200 rounded disabled:opacity-50 cursor-pointer"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 