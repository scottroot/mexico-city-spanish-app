'use client'

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Scissors, Volume2, Copy, Check, ArrowLeft, Info } from 'lucide-react';
import Link from 'next/link';
import { syllabifySentence } from '@/utils/syllabify';
import { playTTS, fallbackTTS } from '@/lib/tts-client';
import { useLanguage } from '@/contexts/LanguageContext';

interface SyllableProps {
  syllable: string;
  isTonic: boolean;
  onPlay: () => void;
}

const Syllable: React.FC<SyllableProps> = ({ syllable, isTonic, onPlay }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handleClick = async () => {
    if (isPlaying) return;
    
    setIsPlaying(true);
    try {
      await onPlay();
    } finally {
      setTimeout(() => setIsPlaying(false), 1000);
    }
  };

  return (
    <motion.span
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleClick}
      className={`
        inline-block px-2 py-1 mx-0.5 rounded-md cursor-pointer transition-all duration-200
        ${isTonic 
          ? 'bg-orange-200 text-orange-900 font-semibold shadow-sm' 
          : 'bg-gray-100 text-gray-700 hover:bg-orange-100 hover:text-orange-800'
        }
        ${isPlaying ? 'bg-orange-300 scale-105' : ''}
        border border-transparent hover:border-orange-200
      `}
      title={`Click to hear: ${syllable}${isTonic ? ' (stressed syllable)' : ''}`}
    >
      {syllable}
    </motion.span>
  );
};

export default function SyllabificationTool() {
  const [inputText, setInputText] = useState('');
  const [syllables, setSyllables] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [copied, setCopied] = useState(false);
  const { t } = useLanguage();

  const handleAnalyze = () => {
    if (!inputText.trim()) return;
    
    setIsProcessing(true);
    try {
      const result = syllabifySentence(inputText);
      setSyllables(result);
    } catch (error) {
      console.error('Error syllabifying:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePlaySyllable = async (syllable: string) => {
    try {
      await playTTS(syllable);
    } catch (error) {
      console.error('Error playing TTS:', error);
      // Fallback to browser speech synthesis
      fallbackTTS(syllable);
    }
  };

  const handlePlayFullText = async () => {
    try {
      await playTTS(inputText);
    } catch (error) {
      console.error('Error playing TTS:', error);
      // Fallback to browser speech synthesis
      fallbackTTS(inputText);
    }
  };

  const handleCopy = async () => {
    const result = syllables.join(' ');
    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Error copying:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/tools" 
            className="inline-flex items-center gap-2 text-gray-600 hover:text-orange-600 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Tools
          </Link>
          
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-pink-400 rounded-lg flex items-center justify-center">
              <Scissors className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Syllabification & Sinalefa</h1>
              <p className="text-gray-600">Break down Spanish text into syllables and identify sinalefa connections</p>
            </div>
          </div>
        </div>

        {/* Input Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Enter Spanish Text</h2>
            <div className="group relative">
              <Info className="w-4 h-4 text-gray-400 cursor-help" />
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                Enter any Spanish phrase or sentence
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Escribe una frase en español aquí..."
              className="w-full h-24 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-300 focus:border-orange-300 resize-none"
            />
            
            <div className="flex items-center gap-3">
              <button
                onClick={handleAnalyze}
                disabled={!inputText.trim() || isProcessing}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-400 to-pink-400 text-white rounded-lg hover:from-orange-500 hover:to-pink-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <Scissors className="w-4 h-4" />
                {isProcessing ? 'Analyzing...' : 'Analyze Syllables'}
              </button>
              
              {inputText.trim() && (
                <button
                  onClick={handlePlayFullText}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <Volume2 className="w-4 h-4" />
                  Play Full Text
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Results Section */}
        {syllables.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Syllabification Results</h2>
              <button
                onClick={handleCopy}
                className="flex items-center gap-2 px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">
                Click on any syllable to hear it pronounced. Stressed syllables are highlighted in orange.
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4 min-h-[60px] flex flex-wrap items-center gap-1">
              {syllables.map((syllable, index) => {
                const isTonic = syllable === syllable.toUpperCase();
                const cleanSyllable = syllable.toLowerCase();
                
                
                return (
                  <Syllable
                    key={index}
                    syllable={cleanSyllable}
                    isTonic={isTonic}
                    onPlay={() => handlePlaySyllable(cleanSyllable)}
                  />
                );
              })}
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-orange-200 rounded"></div>
                  <span>Stressed syllable</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gray-100 rounded"></div>
                  <span>Regular syllable</span>
                </div>
                <div className="flex items-center gap-2">
                  <Volume2 className="w-3 h-3" />
                  <span>Click to hear pronunciation</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Info Section */}
        <div className="mt-8 bg-blue-50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">About Syllabification & Sinalefa</h3>
          <div className="text-blue-800 space-y-2 text-sm">
            <p>
              <strong>Syllabification:</strong> This tool breaks Spanish words into their component syllables, 
              following Spanish phonetic rules. Stressed syllables are highlighted in orange.
            </p>
            <p>
              <strong>Sinalefa:</strong> When a word ending in a vowel is followed by a word beginning with a vowel, 
              they may be connected with an underscore (_) to show the natural flow of speech.
            </p>
            <p>
              <strong>Pronunciation:</strong> Click on any syllable to hear how it sounds. This helps you understand 
              the rhythm and stress patterns of Spanish.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
