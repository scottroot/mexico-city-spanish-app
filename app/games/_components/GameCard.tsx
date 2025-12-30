'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { BookOpen, MessageSquare, Volume2, ShoppingCart, Languages } from 'lucide-react'
import Image from 'next/image'
import type { GameData, UserData } from '@/app/types'


const RESTRICTED_GAMES = [
  'shopping-game-001',
  'translation-game'
]

const iconMap = {
  vocabulary: BookOpen,
  grammar: MessageSquare,
  pronunciation: Volume2,
  shopping: ShoppingCart,
  translation: Languages
}

const colorMap = {
  vocabulary: {
    from: 'var(--color-vocabulary-from)',
    to: 'var(--color-vocabulary-to)'
  },
  grammar: {
    from: 'var(--color-grammar-from)',
    to: 'var(--color-grammar-to)'
  },
  pronunciation: {
    from: 'var(--color-pronunciation-from)',
    to: 'var(--color-pronunciation-to)'
  },
  shopping: {
    from: 'var(--color-shopping-from)',
    to: 'var(--color-shopping-to)'
  },
  translation: {
    from: 'var(--color-translation-from)',
    to: 'var(--color-translation-to)'
  }
}

const difficultyColors = {
  beginner: 'bg-success/10 text-success border-success/20',
  intermediate: 'bg-warning/10 text-warning border-warning/20',
  advanced: 'bg-error/10 text-error border-error/20'
}

interface GameCardProps {
  game: GameData
  progress?: any[]
}

function TempCard({ game }: any) {
  return (
    <div className="max-w-sm w-full lg:max-w-full lg:flex border border-gray-300 rounded-lg overflow-hidden">
      <div 
        className="h-24 md:h-36 lg:h-auto lg:w-48 flex-none bg-cover rounded-t lg:rounded-t-none lg:rounded-l text-center overflow-hidden"
        style={{backgroundImage: `url(${game.image_url})` }}
        title="Woman holding a mug"
      >
      </div>
      <div className="p-4 flex flex-col justify-between leading-normal">
        <div className="mb-8">
          {RESTRICTED_GAMES.includes(game.id) && <p className="text-sm text-gray-600 flex items-center">
            <svg className="fill-current text-gray-500 w-3 h-3 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M4 8V6a6 6 0 1 1 12 0v2h1a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-8c0-1.1.9-2 2-2h1zm5 6.73V17h2v-2.27a2 2 0 1 0-2 0zM7 6v2h6V6a3 3 0 0 0-6 0z" />
            </svg>
            Members only
          </p>}
          <div className="text-gray-900 font-bold text-xl mb-2">{game.title}</div>
          <p className="text-gray-700 text-base">Lorem ipsum dolor sit amet, consectetur adipisicing elit</p>
        </div>
        <div className="inline-flex">
            <Badge
              variant="secondary"
              className={difficultyColors[game.difficulty as keyof typeof difficultyColors]}
            >
              {game.difficulty}
            </Badge>
          </div>
      </div>
    </div>
  )
}

export default function GameCard({ user, game, progress = [] }: GameCardProps & { user: UserData }) {
  const Icon = iconMap[game.type as keyof typeof iconMap]
  const colors = colorMap[game.type as keyof typeof colorMap]

  const averageScore = progress.length > 0
    ? Math.round(progress.reduce((sum, p) => sum + (p.score / p.max_score * 100), 0) / progress.length)
    : 0

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      className="cursor-pointer h-full flex flex-col"
    >
      <div className="sm:flex">
        <div // Card Image
          className="relative mb-4 shrink-0 sm:mr-4 sm:mb-0 w-fit"
        >
          <img
            src={game.image_url}
            className="w-24 md:w-32 aspect-square  border border-gray-300 bg-white text-gray-300 sm:w-32 object-cover no-select"
          />
          {(RESTRICTED_GAMES.includes(game.id) && !user?.isLoggedIn) && 
            <div className="absolute bottom-0 left-0 w-full">
              <p className="bg-gray-300 text-[10px] md:text-sm text-gray-600 py-1 flex justify-center items-center no-select">
                <svg className="fill-current text-gray-500 w-2.5 h-2.5 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M4 8V6a6 6 0 1 1 12 0v2h1a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-8c0-1.1.9-2 2-2h1zm5 6.73V17h2v-2.27a2 2 0 1 0-2 0zM7 6v2h6V6a3 3 0 0 0-6 0z" />
                </svg>
                Login Required
              </p>
            </div>
          }
        </div>
        <div className="flex flex-col">
          <div>
            <h4 className="text-lg leading-tight font-bold text-gray-900 no-select">{game.title}</h4>
            <p className="text-gray-500 capitalize no-select">
            {game.type}
            </p>
            <Badge // Difficulty Badge
              variant="secondary"
              className={`${difficultyColors[game.difficulty as keyof typeof difficultyColors]} mt-2 no-select`}
            >
              {game.difficulty}
            </Badge>
          </div>

          <div // Progress Bar
            className="mt-2 md:mt-auto w-full"
          >
            <div className="flex items-center justify-between text-sm">
              {/* <span className="text-neutral-500 capitalize font-medium">
                {game.type}
              </span> */}
              {progress.length >= 0 && (
                <div className="flex items-center gap-2 w-full">
                  <div className="w-full h-2 bg-neutral-200 rounded-full overflow-hidden">
                    <div
                      className="h-full transition-all duration-300"
                      style={{
                        width: `${averageScore}%`,
                        background: colors
                          ? `linear-gradient(90deg, ${colors.from} 0%, ${colors.to} 100%)`
                          : '#FF6B35'
                      }}
                    />
                  </div>
                  <span className="text-neutral-700 font-semibold text-xs w-[4ch]">
                    {averageScore}%
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* <section className="max-w-sm w-full lg:max-w-full lg:flex border border-gray-300 rounded-lg overflow-hidden">
        <div 
          className="h-24 md:h-36 lg:h-auto lg:w-48 flex-none bg-cover rounded-t lg:rounded-t-none lg:rounded-l text-center overflow-hidden"
          style={{backgroundImage: `url(${game.image_url})` }}
          title="Woman holding a mug"
        >
        </div>
        <div className="p-4 flex flex-col justify-between leading-normal">
          <div className="mb-8">
            {RESTRICTED_GAMES.includes(game.id) && <p className="text-sm text-gray-600 flex items-center">
              <svg className="fill-current text-gray-500 w-3 h-3 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M4 8V6a6 6 0 1 1 12 0v2h1a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-8c0-1.1.9-2 2-2h1zm5 6.73V17h2v-2.27a2 2 0 1 0-2 0zM7 6v2h6V6a3 3 0 0 0-6 0z" />
              </svg>
              Members only
            </p>}
            <div className="text-gray-900 font-bold text-xl mb-2">{game.title}</div>
            <p className="text-gray-700 text-base">Lorem ipsum dolor sit amet, consectetur adipisicing elit</p>
          </div>
          <div className="inline-flex">
              <Badge
                variant="secondary"
                className={difficultyColors[game.difficulty as keyof typeof difficultyColors]}
              >
                {game.difficulty}
              </Badge>
            </div>
        </div>
      </section>
      <Card className="overflow-hidden bg-white border border-neutral-200 hover:border-neutral-300 transition-all duration-200 h-full flex flex-col" style={{ boxShadow: 'var(--shadow-card)' }}>
        <div // Gradient Header
          className="h-32 flex items-center justify-center relative overflow-hidden"
          style={{
            background: colors
              ? `linear-gradient(135deg, ${colors.from} 0%, ${colors.to} 100%)`
              : 'linear-gradient(135deg, #FF6B35 0%, #FF8E53 100%)'
          }}
        >
          {game?.image_url ? ( // Icon or Image
            <div className="relative w-full h-full">
              <Image
                fill
                src={game.image_url}
                alt={game.title}
                className="object-cover object-center"
              />
            </div>
          ) : Icon ? (
            <Icon className="w-16 h-16 text-white/90" />
          ) : null}

          <div className="absolute top-3 right-3">
            <Badge // Difficulty Badge
              variant="outline"
              className={`${difficultyColors[game.difficulty as keyof typeof difficultyColors]} border text-xs font-medium`}
            >
              {game.difficulty}
            </Badge>
          </div>
        </div>

        <CardContent className="p-4 flex-1 flex flex-col">
          <h3 className="text-lg font-semibold text-neutral-900 mb-2 line-clamp-2">
            {game.title}
          </h3>

          <div className="mt-auto">
            <div className="flex items-center justify-between text-sm">
              <span className="text-neutral-500 capitalize font-medium">
                {game.type}
              </span>
              {progress.length > 0 && (
                <div className="flex items-center gap-2">
                  <div className="w-16 h-2 bg-neutral-200 rounded-full overflow-hidden">
                    <div
                      className="h-full transition-all duration-300"
                      style={{
                        width: `${averageScore}%`,
                        background: colors
                          ? `linear-gradient(90deg, ${colors.from} 0%, ${colors.to} 100%)`
                          : '#FF6B35'
                      }}
                    />
                  </div>
                  <span className="text-neutral-700 font-semibold text-xs">
                    {averageScore}%
                  </span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card> */}
    </motion.div>
  )
}
