'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Trophy, Wrench, BookText, ArrowRight, Star, Users, Globe } from 'lucide-react'
import { Volume2, VolumeX, ShoppingCart, BookOpen } from 'lucide-react';
import clsx from 'clsx';



function HomeStats() {
  const stats = [
    { id: 1, name: 'Verb Conjugations', value: '11K+', icon: '⚡' },
    { id: 1.5 },
    { id: 2, name: 'Stories & Games', value: '50+', icon: '📚' },
    { id: 2.5 },
    { id: 3, name: 'Free to Start', value: '100%', icon: '🎯' },
  ]
  return (
    <div className="flex max-w-4xl justify-center py-6">
      <div className="hidden md:block px-6">
        <div 
          // className="grid grid-cols-1 gap-6 sm:grid-cols-3"
          className="flex flex-row gap-4 justify-center items-center"
        >
          {stats.map((stat) => {
            if(!stat.name) {
              return <div key={stat.id} className="w-px h-12 bg-gray-300 border-none"></div>
            }
            return (
              <div key={stat.id} className="p-4 text-center no-select">
                <div className="text-3xl font-bold text-teal-600">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600">
                  {stat.name}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
// Hero Section Component
function HeroSection() {
  return (
    <section className="xbg-white">
      <div className="max-w-full lg:max-w-6xl mx-auto px-6 md:pt-16">
        <div className="relative w-full h-56 py-4 ">
          <Image src="/hero-logo.png" alt="Hero Image" fill className="object-contain" />
        </div>
        <div className="text-center">
          <HomeStats />
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
      href={`/game/${game.type}`}
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
      className="group bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-all"
    >
      <div className="aspect-video relative">
        {/* Background Image */}
        {/* <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${imageUrl})` }}
        >
        </div> */}
        <Image 
          src={imageUrl} 
          alt={story.title} 
          fill 
          className="object-cover no-select opacity-75 group-hover:opacity-100 transition-opacity" 
          loading="lazy"
        />
        
        {/* Reading time badge */}
        <div className="absolute top-3 right-3 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
          {readingTime}
        </div>
        
        {/* Book icon overlay */}
        {/* <div className="absolute inset-0 flex items-center justify-center">
          <BookText className="w-8 h-8 text-white/60" />
        </div> */}
      </div>
      
      <div className="p-4 flex flex-col">
        <h3 className="font-semibold text-gray-900 text-sm group-hover:text-orange-500 transition-colors line-clamp-3 leading-4 h-12">
          {story.title}
        </h3>
        {story.level && (
          <p className="text-xs text-gray-500 group-hover:text-gray-700 transition-colors mt-2 capitalize">
            {story.level.replace("_", " ")}
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
      <div className="max-w-4xl py-16 mx-auto text-center px-6 bg-orange-500 rounded-xl">
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

function NewFeaturedSection() {
  const CTAWrapper = ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div 
      className={clsx("flex flex-row w-full min-h-75 overflow-hidden", className)}
    >
      {children}
    </div>
  )
  return (
    <div 
      // className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 p-8"
      className=""
    >
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto">
        
        {/* Main Hero Card */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-8">
          {/* <div className="relative block bg-gradient-to-r from-teal-500 to-teal-600 overflow-hidden"> */}

          {/* Main CTA */}
          <CTAWrapper className="bg-gradient-to-b from-teal-700 to-teal-500 ">

            {/* Left Side */}
            <div className="flex flex-col p-6 mr-auto">
              {/* Headline */}
              <div className="mb-8">
                <h4 className="text-2xl font-semibold text-white mb-2.5 no-select">
                  Listen to Mexico City Spanish
                </h4>
                <div className="text-lg text-teal-50 leading-tight no-select">
                  Hear stories read by native Mexico City speaker voices.
                </div>
              </div>

              {/* Primary CTA */}
              <div className="flex flex-col justify-center h-full">
              <Link 
                className="bg-white hover:bg-gray-50 text-teal-600 font-bold p-4 md:p-6 rounded-2xl text-xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200 flex items-center gap-3"
                href="/stories/la-nina-y-el-gato"
              >
                <Image 
                  src="/stories-circle-placeholder.webp" 
                  className="w-12 h-12 no-select" 
                  alt="Story Circle Placeholder" 
                  width={48} 
                  height={48}
                />
                <div className="text-left">
                  <div className="text-base md:text-lg">
                    <span className="hidden md:inline">Listen to </span>
                    "La niña y el gato"
                  </div>
                  <div className="text-sm text-gray-500 font-normal">
                    2 minutes • Beginner
                  </div>
                </div>
              </Link>
              </div>
            </div>
              
            <div className="hidden md:flex flex-col w-1/3 overflow-hidden">
              <img 
                  src="/images/coyote-holding-beatz.webp" 
                  alt="Coyote Character" 
                  // width={250}
                  // height={339}
                  className="static object-contain mt-auto max-h-[90%] no-select" 
                />
            </div>

          </CTAWrapper>


          {/* Secondary CTA Bar */}
          <CTAWrapper className="bg-gradient-to-r from-orange-500 to-red-500">
            <div className="hidden md:flex flex-col w-1/4 flex-none overflow-hidden">
              <img 
                  src="/images/coyote-holding-groceries-flipped.webp" 
                  alt="Coyote Character" 
                  // width={250}
                  // height={339}
                  className="static object-contain mt-auto max-h-[90%] no-select" 
                />
            </div>

            <div className="flex flex-col  p-6 mr-auto">
              {/* Headline */}
              <div className="mb-8">
                <h4 className="text-2xl font-semibold text-white mb-2.5 no-select">
                  Practice Paying for Groceries
                </h4>
                <div className="text-lg text-teal-50 leading-tight no-select">
                  Listen to the cashier, enter the right price, and test your real-world Spanish.
                </div>
              </div>

              <Link 
                // className="w-full bg-white hover:bg-gray-50 text-orange-600 font-bold py-5 px-8 rounded-xl text-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 flex items-center justify-between"
                className="w-full bg-white hover:bg-gray-50 text-orange-600 font-bold p-4 md:p-6 rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200 flex items-center justify-between gap-3"
                href="/game/shopping"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 flex-none bg-orange-100 rounded-xl flex items-center justify-center">
                    <ShoppingCart className="w-6 h-6 text-orange-600" />
                  </div>
                  <div className="text-left">
                    <div className="text-base md:text-lg">
                      <span className="hidden md:inline">Try the </span>
                      Checkout Game
                    </div>
                    <div className="text-sm text-gray-500 font-normal">
                      <span className="md:hidden">Understand prices in real-time</span>
                      <span className="max-md:hidden">Can you understand prices in real-time?</span>
                    </div>
                  </div>
                </div>
                <div className="hidden md:block text-orange-500 text-2xl">→</div>
              </Link>
            </div>

            
          </CTAWrapper>


        </div>

        {/* Supporting Features Grid */}
        <div className="grid md:grid-cols-2 gap-6 mt-16">
          
          {/* Pronunciation Tool */}
          <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-lg hover:shadow-xl transition-shadow flex flex-col justify-between items-start">
            <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
              <span className="text-3xl">🗣️</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              Master Pronunciation
            </h3>
            <p className="text-gray-600 mb-4">
              See how words merge together (sinalefa) - type any phrase!
            </p>
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <div className="text-sm text-gray-500 mb-1">Try it:</div>
              <div className="text-lg font-mono">¿Cómo estás? → <span className="text-purple-600">¿Có-moes-tás?</span></div>
            </div>
            <button className="text-purple-600 font-semibold hover:text-purple-700 transition-colors">
              Try it now →
            </button>
          </div>

          {/* Verb Database */}
          <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow flex flex-col justify-between items-start">
            <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
              <BookOpen className="w-7 h-7 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">11,000+ Conjugations</h3>
            <p className="text-gray-600 mb-4">Quiz yourself on any verb, tense, or mood combination</p>
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <div className="flex gap-2 mb-2 flex-wrap">
                <span className="bg-blue-200 text-blue-700 px-3 py-1 rounded-full text-sm">
                  hablar
                </span>
                <span className="bg-blue-200 text-blue-700 px-3 py-1 rounded-full text-sm">
                  comer
                </span>
                <span className="zlg:max-xl:hidden bg-blue-200 text-blue-700 px-3 py-1 rounded-full text-sm">
                  vivir
                </span>
              </div>
              <div className="text-sm text-gray-500">+ create custom quizzes</div>
            </div>
            <button className="text-blue-600 font-semibold hover:text-blue-700 transition-colors">
              Start practicing →
            </button>
          </div>
        </div>
      
      </div>
    </div>
  )
}


export default function HomePage({ games, stories }: { games: any[], stories: any[] }) {
  return (
    <div className="flex-1 w-full max-w-full overflow-x-hidden">
      <HeroSection />
      <NewFeaturedSection />

      {/* Games Section */}
      <section className="mt-6 py-12">
        <div className="">
          <SectionHeader 
            title="Games" 
            description="Practice Spanish through interactive games and challenges." 
            href="/games" 
          />
          
          <div className="grid grid-cols-1 grid-rows-3 auto-rows-[0]
            md:grid-rows-1 md:auto-rows-[0] md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 
            gap-4 overflow-hidden">
            {games.slice(0, 4).map((game, index) => (
              <GameCard key={game.id} game={game} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Stories Section */}
      <section className="py-12">
        <div className="">
          <SectionHeader 
            title="Stories" 
            description="Improve your reading skills through immersive Spanish stories." 
            href="/stories" 
          />
          
          <div className="grid grid-cols-1 grid-rows-3 auto-rows-[0]
            md:grid-rows-1 md:auto-rows-[0] md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 
            gap-4">
            {stories.map((story, index) => (
              <StoryCard key={story.id} story={story} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Tools Section */}
      <section className="py-12">
        <div className="">
          <SectionHeader 
            title="Tools" 
            description="Powerful language tools to enhance your learning experience." 
            href="/tools" 
          />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4">
            <ToolCard 
              title="Syllabification"
              description="Break down Spanish words into syllables and practice pronunciation."
              href="/tools/syllabification"
              icon={Wrench}
            />
            {/* <ToolCard 
              title="Translation Tool"
              description="Coming soon - Advanced translation and context analysis."
              icon={Globe}
              comingSoon={true}
            /> */}
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
      <section className="py-12">
        <div className="">
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
