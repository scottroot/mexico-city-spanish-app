'use client'

import React from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { BookOpen, Star, Clock, Users } from 'lucide-react'

export default function StoriesPage() {
  const { t } = useLanguage()

  // Placeholder story data
  const stories = [
    {
      id: 1,
      title: t('stories.story1.title'),
      subtitle: t('stories.story1.subtitle'),
      level: t('stories.beginner'),
      levelColor: 'bg-green-100 text-green-800',
      image: '/api/placeholder/300/200',
      duration: '5 min',
      readers: '1.2k'
    },
    {
      id: 2,
      title: t('stories.story2.title'),
      subtitle: t('stories.story2.subtitle'),
      level: t('stories.intermediate'),
      levelColor: 'bg-yellow-100 text-yellow-800',
      image: '/api/placeholder/300/200',
      duration: '8 min',
      readers: '856'
    },
    {
      id: 3,
      title: t('stories.story3.title'),
      subtitle: t('stories.story3.subtitle'),
      level: t('stories.intermediate'),
      levelColor: 'bg-yellow-100 text-yellow-800',
      image: '/api/placeholder/300/200',
      duration: '12 min',
      readers: '2.1k'
    },
    {
      id: 4,
      title: t('stories.story4.title'),
      subtitle: t('stories.story4.subtitle'),
      level: t('stories.advanced'),
      levelColor: 'bg-red-100 text-red-800',
      image: '/api/placeholder/300/200',
      duration: '15 min',
      readers: '634'
    },
    {
      id: 5,
      title: t('stories.story5.title'),
      subtitle: t('stories.story5.subtitle'),
      level: t('stories.advanced'),
      levelColor: 'bg-red-100 text-red-800',
      image: '/api/placeholder/300/200',
      duration: '20 min',
      readers: '423'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-teal-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-orange-400 to-pink-400 rounded-full flex items-center justify-center shadow-lg">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            {t('stories.title')}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t('stories.subtitle')}
          </p>
        </div>

        {/* Stories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {stories.map((story) => (
            <div
              key={story.id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer"
            >
              {/* Story Image */}
              <div className="relative h-48 bg-gradient-to-br from-orange-100 to-pink-100 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-200/50 to-pink-200/50 flex items-center justify-center">
                  <BookOpen className="w-16 h-16 text-orange-400 opacity-60" />
                </div>
                {/* Level Badge */}
                <div className="absolute top-4 left-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${story.levelColor}`}>
                    {story.level}
                  </span>
                </div>
                {/* Coming Soon Badge */}
                <div className="absolute top-4 right-4">
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-600">
                    {t('stories.comingSoon')}
                  </span>
                </div>
              </div>

              {/* Story Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-orange-600 transition-colors">
                  {story.title}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {story.subtitle}
                </p>

                {/* Story Stats */}
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{story.duration}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{story.readers}</span>
                  </div>
                </div>

                {/* Read Button */}
                <button className="w-full bg-gradient-to-r from-orange-400 to-pink-400 text-white py-3 px-4 rounded-lg font-medium hover:from-orange-500 hover:to-pink-500 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed">
                  {t('stories.readStory')}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Coming Soon Notice */}
        <div className="text-center mt-12">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 max-w-2xl mx-auto shadow-lg">
            <Star className="w-12 h-12 text-orange-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              {t('stories.comingSoon')}
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
