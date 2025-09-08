'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useLanguage } from '@/contexts/LanguageContext'
import { ArrowLeft, BookOpen, Clock, Star, Loader2, AlertCircle } from 'lucide-react'
import TranscriptPlayer from '@/components/TranscriptPlayer'
import type { Story, Word } from '@/types/story'
import { normalizeAlignmentData } from '@/types/story'

export default function StoryViewerPage() {
  const params = useParams()
  const router = useRouter()
  const { t, language, isInitialized } = useLanguage()
  const [story, setStory] = useState<Story | null>(null)
  const [words, setWords] = useState<Word[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const slug = params.slug as string

  useEffect(() => {
    const fetchStory = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/stories/${slug}`)
        const data = await response.json()
        
        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch story')
        }
        
        setStory(data.story)
        
        // Process alignment data to create words array
        if (data.story.normalized_alignment_data) {
          const normalizedWords = normalizeAlignmentData(data.story.normalized_alignment_data)
          setWords(normalizedWords)
        } else if (data.story.alignment_data) {
          const normalizedWords = normalizeAlignmentData(data.story.alignment_data)
          setWords(normalizedWords)
        }
        
      } catch (err) {
        console.error('Error fetching story:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch story')
      } finally {
        setLoading(false)
      }
    }

    if (slug) {
      fetchStory()
    }
  }, [slug])

  // Helper function to get level display info
  const getLevelInfo = (level: string) => {
    const levelMap = {
      'beginner': { label: t('stories.beginner'), color: 'bg-green-100 text-green-800' },
      'high_beginner': { label: t('stories.beginner'), color: 'bg-green-100 text-green-800' },
      'low_intermediate': { label: t('stories.intermediate'), color: 'bg-yellow-100 text-yellow-800' },
      'high_intermediate': { label: t('stories.intermediate'), color: 'bg-yellow-100 text-yellow-800' },
      'advanced': { label: t('stories.advanced'), color: 'bg-red-100 text-red-800' }
    }
    return levelMap[level as keyof typeof levelMap] || { label: level, color: 'bg-gray-100 text-gray-800' }
  }

  // Helper function to get the appropriate summary based on language
  const getStorySummary = (story: Story) => {
    if (language === 'es' && story.summary) {
      return story.summary
    } else if (language === 'en' && story.summary_english) {
      return story.summary_english
    } else if (story.summary) {
      return story.summary // Fallback to Spanish
    } else if (story.summary_english) {
      return story.summary_english // Fallback to English
    } else {
      return t('stories.story1.subtitle') // Final fallback
    }
  }

  // Loading state or context not initialized
  if (loading || !isInitialized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-orange-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error || !story) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Story Not Found</h2>
          <p className="text-gray-600 mb-4">{error || 'The story you are looking for does not exist.'}</p>
          <button 
            onClick={() => router.push('/stories')} 
            className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
          >
            Back to Stories
          </button>
        </div>
      </div>
    )
  }

  const levelInfo = getLevelInfo(story.level)

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-teal-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <button 
            onClick={() => router.push('/stories')}
            className="flex items-center gap-2 text-gray-600 hover:text-orange-600 transition-colors mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Stories</span>
          </button>

          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-orange-400 to-pink-400 rounded-full flex items-center justify-center shadow-lg">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              {story.title}
            </h1>
            
            <div className="flex items-center justify-center gap-4 mb-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${levelInfo.color}`}>
                {levelInfo.label}
              </span>
              <div className="flex items-center gap-1 text-gray-600">
                <Clock className="w-4 h-4" />
                <span>{story.reading_time || 'N/A'}</span>
              </div>
            </div>

            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              {getStorySummary(story)}
            </p>
          </div>
        </div>

        {/* Story Content */}
        <div className="max-w-5xl mx-auto">
          {story.audio_url && words.length > 0 ? (
            <TranscriptPlayer
              src={story.audio_url}
              words={words}
              autoScroll={true}
            />
          ) : (
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                Audio Not Available
              </h3>
              <p className="text-gray-500 mb-6">
                This story doesn't have synchronized audio yet. You can still read the text below.
              </p>
              
              {/* Fallback: Display story text */}
              <div className="text-left bg-gray-50 rounded-lg p-6 max-w-3xl mx-auto">
                <h4 className="font-semibold text-gray-800 mb-4">Story Text:</h4>
                <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed whitespace-pre-line">
                  {story.text}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Story Image */}
        {story.featured_image_url && (
          <div className="max-w-2xl mx-auto mt-12">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <img 
                src={story.featured_image_url} 
                alt={story.title}
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
