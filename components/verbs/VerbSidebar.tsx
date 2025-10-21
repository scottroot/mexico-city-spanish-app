'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Volume2, BookOpen } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { playTTS, fallbackTTS } from '../../lib/tts-client';

interface Verb {
  infinitive: string;
  infinitive_english: string;
  conjugations: any[];
}

interface VerbSidebarProps {
  verbs: Verb[];
  selectedVerb: string | null;
  onVerbSelect: (infinitive: string) => void;
  loading?: boolean;
}

export default function VerbSidebar({ 
  verbs, 
  selectedVerb, 
  onVerbSelect, 
  loading = false 
}: VerbSidebarProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  
  const itemsPerPage = 20;
  
  // Filter verbs based on search term
  const filteredVerbs = verbs.filter(verb =>
    verb.infinitive.toLowerCase().includes(searchTerm.toLowerCase()) ||
    verb.infinitive_english.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Pagination
  const totalPages = Math.ceil(filteredVerbs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedVerbs = filteredVerbs.slice(startIndex, startIndex + itemsPerPage);
  
  // TTS function using your existing pattern
  const playAudio = async (text: string) => {
    try {
      console.log('Playing TTS for:', text);
      await playTTS(text);
      console.log('TTS audio played successfully');
    } catch (error) {
      console.error('Error with TTS:', error);
      fallbackTTS(text);
    }
  };

  const handleVerbClick = (infinitive: string) => {
    onVerbSelect(infinitive);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top of sidebar
    const sidebar = document.getElementById('verb-sidebar');
    if (sidebar) {
      sidebar.scrollTop = 0;
    }
  };

  if (loading) {
    return (
      <div className="w-80 bg-white border-r border-gray-200 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">
            Loading Spanish verbs...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="w-5 h-5 text-orange-500" />
          <h2 className="text-lg font-semibold text-gray-900">
            Verb List
          </h2>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            type="text"
            placeholder="Search verbs..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reset to first page when searching
            }}
            className="pl-10"
          />
        </div>
        
        {/* Results count */}
        <div className="mt-2 text-sm text-gray-600">
          {filteredVerbs.length} verbs found
        </div>
      </div>

      {/* Verb List */}
      <div 
        id="verb-sidebar"
        className="flex-1 overflow-y-auto p-4 space-y-2"
      >
        {paginatedVerbs.map((verb, index) => (
          <motion.div
            key={verb.infinitive}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.02 }}
          >
            <Card 
              className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                selectedVerb === verb.infinitive 
                  ? 'ring-2 ring-orange-500 bg-orange-50' 
                  : 'hover:bg-gray-50'
              }`}
              onClick={() => handleVerbClick(verb.infinitive)}
            >
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 truncate">
                      {verb.infinitive}
                    </h3>
                    <p className="text-sm text-gray-600 truncate">
                      {verb.infinitive_english}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-1 ml-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        playAudio(verb.infinitive);
                      }}
                      className="h-8 w-8 p-0 hover:bg-orange-100"
                    >
                      <Volume2 className="w-3 h-3 text-orange-500" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
        
        {paginatedVerbs.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <BookOpen className="w-8 h-8 mx-auto mb-2 text-gray-300" />
            <p>No verbs found</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            
            <div className="flex items-center gap-2">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const page = i + 1;
                return (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(page)}
                    className={currentPage === page ? "bg-orange-500 hover:bg-orange-600" : ""}
                  >
                    {page}
                  </Button>
                );
              })}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
