'use client'

import React from 'react';
import Link from 'next/link';
import { BookOpen, Scissors, Volume2, FileText, Brain, Zap } from 'lucide-react';


interface Tool {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  available: boolean;
}

export default function ToolsPage() {
  const tools: Tool[] = [
    {
      id: 'syllabification',
      name: 'Syllabification & Sinalefa',
      description: 'Break down Spanish text into syllables and identify sinalefa connections',
      icon: Scissors,
      href: '/tools/syllabification',
      available: true
    },
    {
      id: 'conjunctions',
      name: 'Conjunctions Cheat Sheet',
      description: 'A comprehensive guide to Spanish conjunctions',
      icon: Volume2,
      href: '/tools/conjunctions',
      available: true
    },
    {
      id: 'text-analysis',
      name: 'Text Analysis',
      description: 'Analyze Spanish text for grammar and structure',
      icon: FileText,
      href: '/tools/text-analysis',
      available: false
    },
    {
      id: 'vocabulary',
      name: 'Vocabulary Builder',
      description: 'Extract and learn new vocabulary from text',
      icon: Brain,
      href: '/tools/vocabulary',
      available: false
    },
    {
      id: 'conjugation',
      name: 'Verb Conjugation Helper',
      description: 'Get help with verb conjugations and tenses',
      icon: Zap,
      href: '/tools/conjugation',
      available: false
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-pink-400 rounded-full flex items-center justify-center shadow-lg">
              <BookOpen className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Language Tools</h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Powerful tools to help you understand and master Spanish language structure, pronunciation, and grammar.
          </p>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool) => (
            <Link
              key={tool.id}
              href={tool.available ? tool.href : '#'}
              className={`group relative block p-6 rounded-xl border-2 transition-all duration-200 ${
                tool.available
                  ? 'border-gray-200 bg-white hover:border-orange-300 hover:shadow-lg cursor-pointer'
                  : 'border-gray-100 bg-gray-50 cursor-not-allowed opacity-60'
              }`}
            >
              {!tool.available && (
                <div className="absolute top-3 right-3">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-200 text-gray-600">
                    Coming Soon
                  </span>
                </div>
              )}
              
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  tool.available
                    ? 'bg-gradient-to-r from-orange-400 to-pink-400 text-white'
                    : 'bg-gray-300 text-gray-500'
                }`}>
                  <tool.icon className="w-6 h-6" />
                </div>
                
                <div className="flex-1">
                  <h3 className={`text-lg font-semibold mb-2 ${
                    tool.available ? 'text-gray-900 group-hover:text-orange-600' : 'text-gray-500'
                  }`}>
                    {tool.name}
                  </h3>
                  <p className={`text-sm ${
                    tool.available ? 'text-gray-600' : 'text-gray-400'
                  }`}>
                    {tool.description}
                  </p>
                </div>
              </div>
              
              {tool.available && (
                <div className="mt-4 flex items-center text-sm text-orange-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  Try it now
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              )}
            </Link>
          ))}
        </div>

        {/* Footer Note */}
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500">
            More tools coming soon! Have a suggestion? Let us know what would help your Spanish learning.
          </p>
        </div>
      </div>
    </div>
  );
}
