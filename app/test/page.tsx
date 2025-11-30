'use client'

import { useState } from 'react'
'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Trophy, Wrench, BookText, ArrowRight, Star, Users, Globe } from 'lucide-react'


function HomeStats() {
  const stats = [
    { id: 1, name: 'Vocabulary Words', value: '600+' },
    { id: 2, name: 'Verb Conjugations', value: '11K+' },
    { id: 3, name: 'Free to Start', value: '100%' },
  ]
  return (
    <div className="bg-white py-24 sm:py-32 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <dl className="grid grid-cols-1 gap-x-8 gap-y-16 text-center lg:grid-cols-3">
          {stats.map((stat) => (
            <div key={stat.id} className="mx-auto flex max-w-xs flex-col gap-y-4">
              <dt className="text-base/7 text-gray-600 dark:text-gray-400">{stat.name}</dt>
              <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900 sm:text-5xl dark:text-white">
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  )
}
// Hero Section Component
function HeroSection() {
  return (
    <section className="xbg-white">
      <div className="max-w-6xl mx-auto px-6 pt-16">
        <div className="relative w-full h-56 py-4 ">
          <Image src="/hero-logo.png" alt="Hero Image" fill className="object-contain" />
        </div>
        <div className="text-center">
          {/* <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Learn Mexico City Spanish
          </h1> */}
          <HomeStats />
          {/* <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Experience the future of language learning with interactive games, immersive stories, and intelligent tools designed to accelerate your Spanish journey.
          </p> */}
          {/* <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/games" 
              className="inline-flex items-center px-6 py-3 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition-colors"
            >
              {t('home.startLearning', 'Start Learning')}
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
            <Link 
              href="/pro" 
              className="inline-flex items-center px-6 py-3 border border-orange-500 text-orange-500 font-semibold rounded-lg hover:bg-orange-500 hover:text-white transition-colors"
            >
              <Star className="mr-2 w-4 h-4" />
              {t('home.goPro', 'Go Pro')}
            </Link>
          </div> */}
        </div>
      </div>
    </section>
  )
}

// Section Header Component
function SectionHeader({ title, description, href }: { title: string; description: string; href: string }) {
  return (
    <div className="flex items-center justify-between mb-6 gap-x-2">
      <div>
        <h2 className="text-lg md:text-2xl font-bold text-gray-900 mb-1">{title}</h2>
        <p className="text-sm md:text-base text-gray-600">{description}</p>
      </div>
      <Link 
        href={href} 
        className="flex items-center text-gray-600 hover:text-orange-500 font-medium text-sm whitespace-nowrap"
      >
        See all
        <ArrowRight className="ml-1 w-4 h-4" />
      </Link>
    </div>
  )
}

// Game Card Component
function GameCard({ game, index }: { game: any; index: number }) {
  // Fallback images for different game types
  const fallbackImage = "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop&crop=center";

  const imageUrl = game.image_url || fallbackImage;
  const description = game.description || 'Interactive Spanish learning game to improve your language skills.'

  return (
    <Link 
      href={`/game?id=${game.id}`}
      className="group relative overflow-hidden rounded-xl hover:shadow-lg transition-all duration-200 h-48"
    >
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${imageUrl})` }}
      >
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
      </div>
      
      {/* Content */}
      <div className="relative z-10 p-6 h-full flex flex-col justify-end text-white">
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm text-white/80 font-medium text-shadow-lg">
            GAME {index + 1}
          </div>
          <Trophy className="w-5 h-5 text-white/80" />
        </div>
        <h3 className="text-lg font-bold mb-2 group-hover:text-orange-300 transition-colors">
          {game.title}
        </h3>
        <p className="text-white/90 text-sm line-clamp-2">
          {description}
        </p>
      </div>
    </Link>
  )
}

// Story Card Component
function StoryCard({ story, index }: { story: any; index: number }) {
  // Fallback images for different story levels
  const fallbackImage = "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop&crop=center";

  const imageUrl = story.featured_image_url || fallbackImage;
  const readingTime = story.reading_time || '3 min';

  return (
    <Link 
      href={story.slug ? `/stories/${story.slug}` : '#'}
      className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200"
    >
      <div className="aspect-video relative">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${imageUrl})` }}
        >
          {/* Overlay for better text readability */}
          {/* <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-grey-900 to-transparent" /> */}
        </div>
        
        {/* Reading time badge */}
        <div className="absolute top-3 right-3 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
          {readingTime}
        </div>
        
        {/* Book icon overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <BookText className="w-8 h-8 text-white/60" />
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 text-sm group-hover:text-orange-500 transition-colors">
          {story.title}
        </h3>
        {story.level && (
          <p className="text-xs text-gray-500 mt-1 capitalize">
            {story.level}
          </p>
        )}
      </div>
    </Link>
  )
}

// Tool Card Component
function ToolCard({ title, description, href, icon: Icon, comingSoon = false }: { 
  title: string; 
  description: string; 
  href?: string; 
  icon: any; 
  comingSoon?: boolean 
}) {
  const CardContent = () => (
    <div className={`group bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 ${comingSoon ? 'opacity-60' : ''}`}>
      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
        <Icon className="w-6 h-6 text-gray-600" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-orange-500 transition-colors">
        {title}
      </h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  )

  if (comingSoon || !href) {
    return <CardContent />
  }

  return (
    <Link href={href}>
      <CardContent />
    </Link>
  )
}

// Verb Card Component
function VerbCard({ verb, title, icon }: { verb: string; title: string; icon: string }) {
  return (
    <Link 
      href="/verbs" 
      className="group bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100"
    >
      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4 text-2xl">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-orange-500 transition-colors">
        {title}
      </h3>
      <p className="text-gray-600 text-sm">Essential Spanish verbs for {title.toLowerCase()}.</p>
    </Link>
  )
}

// CTA Section Component
function CTASection() {
  return (
    <section className="max-md:pb-16">
      <div className="max-w-4xl py-16 mx-auto text-center px-6 bg-orange-500">
        <h2 className="text-3xl font-bold text-white mb-4">
          Ready to Start Your Spanish Journey?
        </h2>
        <p className="text-lg text-white/90 mb-8">
          Join thousands of learners who are mastering Spanish with our AI-powered platform.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/games" 
            className="inline-flex items-center px-6 py-3 bg-white text-orange-500 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
          >
            Start Learning Free
            <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
          <Link 
            href="/pro" 
            className="inline-flex items-center px-6 py-3 border border-white text-white font-semibold rounded-lg hover:bg-white hover:text-orange-500 transition-colors"
          >
            <Star className="mr-2 w-4 h-4" />
            Upgrade to Pro
          </Link>
        </div>
      </div>
    </section>
  )
}

function HomePage({ games, stories }: { games: any[], stories: any[] }) {
  return (
    <div className="min-h-screen h-fit xbg-gray-50">
      <HeroSection />

      {/* Games Section */}
      <section className="py-12 xbg-white">
        <div className="max-w-6xl mx-auto px-6">
          <SectionHeader 
            title="Games" 
            description="Practice Spanish through interactive games and challenges." 
            href="/games" 
          />
          
          <div className="grid grid-cols-1 grid-rows-3 auto-rows-[0]
            md:grid-rows-1 md:auto-rows-[0] md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 
            gap-4 overflow-hidden">
            {games.slice(0, 4).map((game, index) => (
              <GameCard key={game.id} game={game} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Stories Section */}
      <section className="py-12 xbg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <SectionHeader 
            title="Stories" 
            description="Improve your reading skills through immersive Spanish stories." 
            href="/stories" 
          />
          
          <div className="grid grid-cols-1 grid-rows-3 auto-rows-[0]
            md:grid-rows-1 md:auto-rows-[0] md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 
            gap-4 overflow-hidden">
            {stories.map((story, index) => (
              <StoryCard key={story.id} story={story} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Tools Section */}
      <section className="py-12 xbg-white">
        <div className="max-w-6xl mx-auto px-6">
          <SectionHeader 
            title="Tools" 
            description="Powerful language tools to enhance your learning experience." 
            href="/tools" 
          />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ToolCard 
              title="Syllabification"
              description="Break down Spanish words into syllables and practice pronunciation."
              href="/tools/syllabification"
              icon={Wrench}
            />
            <ToolCard 
              title="Translation Tool"
              description="Coming soon - Advanced translation and context analysis."
              icon={Globe}
              comingSoon={true}
            />
            <ToolCard 
              title="Conversation Practice"
              description="Coming soon - AI-powered conversation practice."
              icon={Users}
              comingSoon={true}
            />
          </div>
        </div>
      </section>

      {/* Verbs Section */}
      <section className="py-12 xbg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <SectionHeader 
            title="Verbs" 
            description="Master Spanish verb conjugations with interactive practice." 
            href="/verbs" 
          />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { verb: 'ser', title: 'Dining Out', icon: '🍽️' },
              { verb: 'estar', title: 'Getting Around', icon: '🚌' },
              { verb: 'tener', title: 'Health & Safety', icon: '🏥' }
            ].map((item, index) => (
              <VerbCard 
                key={item.verb}
                verb={item.verb}
                title={item.title}
                icon={item.icon}
              />
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </div>
  )
}



function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export function TestPage() {
  return (
    <div className="px-6">
      {/* Main content area */}
      <main className="flex-1 min-w-0 h-full bg-red-500 lg:pr-96 pt-6">
          <HomePage games={[]} stories={[]} />
      </main>

      {/* Right sidebar - only visible on xl screens and up */}
      <aside 
        className="hidden fixed right-0 top-0 lg:block h-screen z-50
         w-96 bg-blue-500 border-l border-gray-200 pointer-events-non
         pt-6"
      >
        <div className="px-4 py-6 sm:px-6 lg:px-8 h-full pointer-events-auto">
          <div className="h-full flex items-center justify-center">
            <h2 className="text-xl font-bold text-white">Right Sidebar</h2>
          </div>
        </div>
      </aside>
    </div>
  )
}

//////////////////////////////////////////////////

import { BellIcon } from '@heroicons/react/24/outline'

export default function Example() {
  return (
    <div className="flex min-h-full flex-col">

      <div className="mx-auto flex w-full max-w-7xl items-start gap-x-8 px-4 py-10 sm:px-6 lg:px-8">
        <aside className="sticky top-8 hidden w-44 shrink-0 lg:block">
          Left column area

        </aside>

        <main className="flex-1">
          <HomePage games={[]} stories={[]} />
        </main>

        <aside className="sticky -top-24 hidden w-96 shrink-0 xl:flex xl:flex-col gap-8">
          Right column area
          <div className="w-full h-36 bg-green-500"></div>
          <div className="w-full h-36 bg-green-600"></div>
          <div className="w-full h-36 bg-green-700"></div>
          <div className="w-full h-36 bg-green-800"></div>
          <div className="w-full h-36 bg-green-900"></div>
        </aside>
      </div>
    </div>
  )
}
