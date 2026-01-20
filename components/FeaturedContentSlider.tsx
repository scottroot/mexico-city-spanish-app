'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, Sparkles, BookOpen, Scissors, Link2 } from 'lucide-react'

interface FeaturedItem {
  id: string
  badge: string
  title: string
  description: string
  href: string
  ctaText: string
  gradient: string
  iconBg: string
  icon: React.ReactNode
}

const featuredItems: FeaturedItem[] = [
  {
    id: 'prepositions',
    badge: 'NEW',
    title: 'Prepositions Flashcards',
    description: 'Master Spanish prepositions with interactive flashcards and a comprehensive cheat sheet.',
    href: '/tools/prepositions',
    ctaText: 'START LEARNING',
    gradient: 'from-emerald-500 to-teal-600',
    iconBg: 'bg-emerald-100 text-emerald-600',
    icon: <Link2 className="w-5 h-5" />,
  },
  {
    id: 'conjunctions',
    badge: 'NEW',
    title: 'Conjunctions Flashcards',
    description: 'Learn Spanish conjunctions to connect your sentences like a native speaker.',
    href: '/tools/conjunctions',
    ctaText: 'EXPLORE NOW',
    gradient: 'from-violet-500 to-purple-600',
    iconBg: 'bg-violet-100 text-violet-600',
    icon: <Sparkles className="w-5 h-5" />,
  },
  {
    id: 'syllabification',
    badge: 'TOOL',
    title: 'Syllabification Tool',
    description: 'Break down Spanish words into syllables and master sinalefa connections.',
    href: '/tools/syllabification',
    ctaText: 'TRY IT FREE',
    gradient: 'from-orange-500 to-pink-600',
    iconBg: 'bg-orange-100 text-orange-600',
    icon: <Scissors className="w-5 h-5" />,
  },
  {
    id: 'stories',
    badge: 'FEATURED',
    title: 'Spanish Stories',
    description: 'Improve your reading with engaging stories set in Mexico City.',
    href: '/stories',
    ctaText: 'READ STORIES',
    gradient: 'from-blue-500 to-indigo-600',
    iconBg: 'bg-blue-100 text-blue-600',
    icon: <BookOpen className="w-5 h-5" />,
  },
]

const AUTO_ADVANCE_MS = 6000

export default function FeaturedContentSlider() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const [progress, setProgress] = useState(0)

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % featuredItems.length)
    setProgress(0)
  }, [])

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + featuredItems.length) % featuredItems.length)
    setProgress(0)
  }, [])

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index)
    setProgress(0)
  }, [])

  // Auto-advance with progress bar
  useEffect(() => {
    if (isHovered) return

    const tick = 50 // update every 50ms
    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + (tick / AUTO_ADVANCE_MS) * 100
        if (next >= 100) {
          nextSlide()
          return 0
        }
        return next
      })
    }, tick)

    return () => clearInterval(interval)
  }, [isHovered, nextSlide])

  const currentItem = featuredItems[currentIndex]

  return (
    <div
      className="relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Gradient border glow effect */}
      <div className={`absolute -inset-0.5 bg-gradient-to-r ${currentItem.gradient} rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-500`} />

      <div className="relative bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Progress bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gray-100">
          <div
            className={`h-full bg-gradient-to-r ${currentItem.gradient} transition-all duration-100 ease-linear`}
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Decorative background gradient */}
        <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${currentItem.gradient} opacity-5 blur-2xl`} />

        {/* Slide Content */}
        <div className="relative p-6 pt-5">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              {/* Icon */}
              <div className={`w-10 h-10 rounded-xl ${currentItem.iconBg} flex items-center justify-center`}>
                {currentItem.icon}
              </div>
              {/* Badge */}
              <div className={`bg-gradient-to-r ${currentItem.gradient} text-white px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide`}>
                {currentItem.badge}
              </div>
            </div>

            {/* Navigation Arrows */}
            <div className="flex gap-1.5">
              <button
                onClick={prevSlide}
                className="w-8 h-8 rounded-lg bg-gray-50 hover:bg-gray-100 border border-gray-200 flex items-center justify-center transition-all hover:scale-105 active:scale-95"
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-4 h-4 text-gray-600" />
              </button>
              <button
                onClick={nextSlide}
                className="w-8 h-8 rounded-lg bg-gray-50 hover:bg-gray-100 border border-gray-200 flex items-center justify-center transition-all hover:scale-105 active:scale-95"
                aria-label="Next slide"
              >
                <ChevronRight className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>

          <h3 className="text-lg font-bold text-gray-900 mb-1.5">
            {currentItem.title}
          </h3>
          <p className="text-sm text-gray-500 mb-5 leading-relaxed">
            {currentItem.description}
          </p>

          <Link
            href={currentItem.href}
            className={`group/btn relative w-full bg-gradient-to-r ${currentItem.gradient} text-white py-3 px-4 rounded-xl font-semibold text-sm text-center block transition-all duration-200 hover:shadow-lg hover:shadow-gray-900/10 hover:-translate-y-0.5 active:translate-y-0`}
          >
            <span className="relative z-10">{currentItem.ctaText}</span>
            <div className="absolute inset-0 rounded-xl bg-white/20 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
          </Link>
        </div>

        {/* Dots Indicator */}
        <div className="flex justify-center gap-1.5 pb-4">
          {featuredItems.map((item, index) => (
            <button
              key={item.id}
              onClick={() => goToSlide(index)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? `w-6 bg-gradient-to-r ${currentItem.gradient}`
                  : 'w-1.5 bg-gray-200 hover:bg-gray-300'
              }`}
              aria-label={`Go to ${item.title}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
