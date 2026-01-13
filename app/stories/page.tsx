'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { BookOpen, Star, Clock, Users, Loader2, Filter, ArrowUpDown } from 'lucide-react'
import PageHeader from '@/components/ui/page-header'

interface Story {
  id: string
  title: string
  slug: string
  level: string
  reading_time: string
  featured_image_url: string | null
  audio_url: string | null
  summary: string | null
  summary_english: string | null
  created_at: string
}

export default function StoriesPage() {
  const router = useRouter()
  const [stories, setStories] = useState<Story[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedLevel, setSelectedLevel] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'alphabetical'>('newest')

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const response = await fetch('/api/stories')
        const data = await response.json()
        
        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch stories')
        }
        
        setStories(data.stories || [])
      } catch (err) {
        console.error('Error fetching stories:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch stories')
      } finally {
        setLoading(false)
      }
    }

    fetchStories()
  }, [])

  // Helper function to get level display info
  const getLevelInfo = (level: string) => {
    const levelMap = {
      'beginner': { label: 'Beginner', color: 'bg-green-100 text-green-800' },
      'high_beginner': { label: 'High Beginner', color: 'bg-green-100 text-green-800' },
      'low_intermediate': { label: 'Low Intermediate', color: 'bg-yellow-100 text-yellow-800' },
      'high_intermediate': { label: 'High Intermediate', color: 'bg-yellow-100 text-yellow-800' },
      'advanced': { label: 'Advanced', color: 'bg-red-100 text-red-800' }
    }
    return levelMap[level as keyof typeof levelMap] || { label: level, color: 'bg-gray-100 text-gray-800' }
  }

  // Helper function to get the summary
  const getStorySummary = (story: Story) => {
    if (story.summary_english) {
      return story.summary_english
    } else if (story.summary) {
      return story.summary
    } else {
      return 'A simple story about friendship'
    }
  }

  // Helper function to check if story is new (created within last 7 days)
  const isNewStory = (createdAt: string) => {
    const storyDate = new Date(createdAt)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    return storyDate > sevenDaysAgo
  }

  // Filter and sort stories
  const filteredAndSortedStories = React.useMemo(() => {
    let filtered = stories

    // Filter by level
    if (selectedLevel !== 'all') {
      filtered = filtered.filter(story => story.level === selectedLevel)
    }

    // Sort
    const sorted = [...filtered].sort((a, b) => {
      if (sortBy === 'alphabetical') {
        return a.title.localeCompare(b.title)
      } else if (sortBy === 'newest') {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      } else {
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      }
    })

    return sorted
  }, [stories, selectedLevel, sortBy])

  // Loading state or context not initialized
  if (loading) {
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
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-teal-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <PageHeader
          icon={BookOpen}
          title="Stories"
          subtitle="Immerse yourself in Spanish through engaging stories"
        />

        {/* Filter and Sort Controls */}
        <div className="mb-6 max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center gap-3 text-sm">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="text-gray-600 font-medium">Level:</span>
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="pl-3 pr-8 py-1 text-gray-700 rounded bg-white border border-gray-300 hover:border-gray-400 rounded 
              focus:ring-0 focus:outline-none !outline-none"
            >
              <option value="all">All Levels</option>
              <option value="beginner">Beginner</option>
              <option value="high_beginner">High Beginner</option>
              <option value="low_intermediate">Low Intermediate</option>
              <option value="high_intermediate">High Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-4 h-4 text-gray-500" />
            <span className="text-gray-600 font-medium">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest' | 'alphabetical')}
              className="pl-3 pr-8 py-1 text-gray-700 rounded bg-white border border-gray-300 hover:border-gray-400 rounded 
              focus:ring-0 focus:outline-none !outline-none"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="alphabetical">Alphabetical</option>
            </select>
          </div>
        </div>

        {/* Stories Grid */}
        {filteredAndSortedStories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {filteredAndSortedStories.map((story) => {
              const levelInfo = getLevelInfo(story.level)
              return (
                <div
                  key={story.id}
                  onClick={() => router.push(`/stories/${story.slug}`)}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer"
                >
                  {/* Story Image */}
                  <div className="relative h-48 bg-gradient-to-br from-orange-100 to-pink-100 overflow-hidden">
                    {story.featured_image_url ? (
                      <img 
                        src={story.featured_image_url} 
                        alt={story.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-orange-200/50 to-pink-200/50 flex items-center justify-center">
                        <BookOpen className="w-16 h-16 text-orange-400 opacity-60" />
                      </div>
                    )}
                    {/* Level Badge */}
                    <div className="absolute top-4 left-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${levelInfo.color}`}>
                        {levelInfo.label}
                      </span>
                    </div>
                    {/* Coming Soon Badge */}
                    {/* <div className="absolute top-4 right-4">
                      <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-600">
                        {t('stories.comingSoon')}
                      </span>
                    </div> */}
                  </div>

                  {/* Story Content */}
                  <div className="p-6">
                    <h3 
                      className="text-xl h-12 font-bold text-gray-800 mb-2 leading-6
                      group-hover:text-orange-600 transition-colors"
                    >
                      {story.title}
                    </h3>
                    <div className="relative flex text-gray-600 mb-4 line-clamp-3 leading-6 h-[4.5rem]">
                      <p className="flex h-18">{getStorySummary(story)}</p>
                    </div>

                    {/* Story Stats */}
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{story.reading_time || 'N/A'}</span>
                      </div>
                      {isNewStory(story.created_at) && (
                        <div className="flex items-center gap-1">
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-600">
                            New
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Read Button */}
                    <button 
                      onClick={(e) => {
                        e.stopPropagation()
                        router.push(`/stories/${story.slug}`)
                      }}
                      className="w-full bg-gradient-to-r from-orange-400 to-pink-400 text-white py-3 px-4 rounded-lg font-medium hover:from-orange-500 hover:to-pink-500 transition-all duration-200 shadow-md hover:shadow-lg"
                    >
                      Read Story
                    </button>
                  </div>
                </div>
              )
            })}
            {/* Coming Soon Story - La Playa */}
            <div
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer"
            >
              {/* Story Image */}
              <div className="relative h-48 bg-gradient-to-br from-orange-100 to-pink-100 overflow-hidden">
                  <img 
                    src="/coming-soon/la_playa.png" 
                    alt="Un viaje a la playa"
                    className="w-full h-full object-cover"
                  />
                {/* Level Badge */}
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    Beginner
                  </span>
                </div>
                {/* Coming Soon Badge */}
                <div className="absolute top-4 right-4">
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-600">
                    Coming Soon
                  </span>
                </div>
              </div>

              {/* Story Content */}
              <div className="p-6">
                <h3 
                  className="text-xl h-12 font-bold text-gray-800 mb-2 leading-6
                  group-hover:text-orange-600 transition-colors"
                >
                  Un viaje a la playa
                </h3>
                <div className="relative flex text-gray-600 mb-4 line-clamp-3 leading-6 h-[4.5rem]">

                <p>
                  Lucia has never seen the beach before. Today is a the day.
                </p>
                </div>

                {/* Story Stats */}
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>6 minutes</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {/* <span>New</span> */}
                  </div>
                </div>

                {/* Read Button */}
                <button 
                  className="w-full bg-gradient-to-r from-orange-400 to-pink-400 text-white py-3 px-4 rounded-lg font-medium hover:from-orange-500 hover:to-pink-500 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled
                >
                  Read Story
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              {stories.length === 0 ? 'No Stories Available' : 'No Stories Found'}
            </h3>
            <p className="text-gray-500">
              {stories.length === 0
                ? 'Check back later for new stories!'
                : 'Try adjusting your filters to see more stories.'}
            </p>
            {selectedLevel !== 'all' && (
              <button
                onClick={() => setSelectedLevel('all')}
                className="mt-4 px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}

        {/* Coming Soon Notice */}
        <div className="text-center mt-12">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 max-w-2xl mx-auto shadow-lg">
            <Star className="w-12 h-12 text-orange-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              Coming Soon
            </h3>
            <p className="text-gray-600">
              We're working hard to bring you these amazing stories. Stay tuned for updates!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
