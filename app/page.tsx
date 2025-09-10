'use client'

import { createClient } from '@/utils/supabase/client'
import Link from 'next/link'
import { BookOpen, Trophy, Wrench, BookText, ArrowRight, Play, Star, Users, Globe } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { useEffect, useState } from 'react'

// Hero Section Component
function HeroSection() {
  const { t } = useLanguage()
  
  return (
    <section className="xbg-white">
      <div className="max-w-6xl mx-auto px-6 pt-16">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {t('app.subtitle', 'Learn Mexico City Spanish')}
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            {t('home.subtitle', 'Experience the future of language learning with interactive games, immersive stories, and intelligent tools designed to accelerate your Spanish journey.')}
          </p>
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
  const { t } = useLanguage()
  
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-1">{title}</h2>
        <p className="text-gray-600">{description}</p>
      </div>
      <Link 
        href={href} 
        className="flex items-center text-gray-600 hover:text-orange-500 font-medium text-sm"
      >
        {t('common.seeAll', 'See all')}
        <ArrowRight className="ml-1 w-4 h-4" />
      </Link>
    </div>
  )
}

// Game Card Component
function GameCard({ game, index }: { game: any; index: number }) {
  const { t } = useLanguage()
  
  // Fallback images for different game types
  const fallbackImage = "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop&crop=center";

  const imageUrl = game.image_url || fallbackImage;
  const description = game.description || 'Interactive Spanish learning game to improve your language skills.'

  return (
    <Link 
      href={`/game?type=${game.type}`}
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
            {t('home.gameNumber', 'GAME')} {index + 1}
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
  const { t } = useLanguage()
  
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
            {t(`stories.${story.level}`, story.level)}
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
  const { t } = useLanguage()
  
  return (
    <section className="py-16 bg-orange-500">
      <div className="max-w-4xl mx-auto text-center px-6">
        <h2 className="text-3xl font-bold text-white mb-4">
          {t('home.ctaTitle', 'Ready to Start Your Spanish Journey?')}
        </h2>
        <p className="text-lg text-white/90 mb-8">
          {t('home.ctaDescription', 'Join thousands of learners who are mastering Spanish with our AI-powered platform.')}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/games" 
            className="inline-flex items-center px-6 py-3 bg-white text-orange-500 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
          >
            {t('home.startLearningFree', 'Start Learning Free')}
            <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
          <Link 
            href="/pro" 
            className="inline-flex items-center px-6 py-3 border border-white text-white font-semibold rounded-lg hover:bg-white hover:text-orange-500 transition-colors"
          >
            <Star className="mr-2 w-4 h-4" />
            {t('home.upgradeToPro', 'Upgrade to Pro')}
          </Link>
        </div>
      </div>
    </section>
  )
}

export default function HomePage() {
  const { t } = useLanguage()
  const [gamesData, setGamesData] = useState<any[]>([])
  const [storiesData, setStoriesData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const supabase = createClient()
        
               // Get featured games sorted by sort_order
               const { data: games, error: gamesError } = await supabase
                 .from('games')
                 .select('*')
                 .order('sort_order', { ascending: true })
                 .limit(4)

        if (!gamesError) {
          setGamesData(games || [])
        }

        // Get featured stories (if stories table exists)
        const { data: stories, error: storiesError } = await supabase
          .from('stories')
          .select('*')
          .order('created_at', { ascending: true })
          .limit(4)

        if (!storiesError) {
          setStoriesData(stories || [])
        }
      } catch (err) {
        console.error('Database connection error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="min-h-screen xbg-gray-50">
      <HeroSection />

      {/* Games Section */}
      <section className="py-12 xbg-white">
        <div className="max-w-6xl mx-auto px-6">
          <SectionHeader 
            title={t('navigation.games', 'Games')} 
            description={t('home.gamesDescription', 'Practice Spanish through interactive games and challenges.')} 
            href="/games" 
          />
          
          <div className="grid grid-rows-1 auto-rows-[0] 
            grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 
            gap-4 overflow-hidden">
            {gamesData.slice(0, 4).map((game, index) => (
              <GameCard key={game.id} game={game} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Stories Section */}
      <section className="py-12 xbg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <SectionHeader 
            title={t('navigation.stories', 'Stories')} 
            description={t('stories.subtitle', 'Improve your reading skills through immersive Spanish stories.')} 
            href="/stories" 
          />
          
          <div className="grid grid-rows-1 auto-rows-[0] 
            grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 
            gap-4 overflow-hidden">
            {storiesData.map((story, index) => (
              <StoryCard key={story.id} story={story} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Tools Section */}
      <section className="py-12 xbg-white">
        <div className="max-w-6xl mx-auto px-6">
          <SectionHeader 
            title={t('navigation.tools', 'Tools')} 
            description={t('home.toolsDescription', 'Powerful language tools to enhance your learning experience.')} 
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
            title={t('navigation.verbs', 'Verbs')} 
            description={t('verbs.subtitle', 'Master Spanish verb conjugations with interactive practice.')} 
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
