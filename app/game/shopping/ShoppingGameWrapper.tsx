'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Game, GameData } from '@/entities/Game'
import ShoppingGame from './ShoppingGame'
import GameHeader from '@/components/games/GameHeader'
import GameCompletion from '@/components/games/GameCompletion'
import { Loader2 } from 'lucide-react'
import { UserData } from '@/utils/supabase/auth'

export default async function ShoppingGameWrapper({ user }: { user: UserData }) {
  const [game, setGame] = useState<GameData | null>(null);
  const [loading, setLoading] = useState(true)
  const [gameCompleted, setGameCompleted] = useState(false)
  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    const loadGame = async () => {
      const gameId = searchParams.get('id')

      if (!gameId) {
        router.push('/games')
        return
      }

      try {
        const games = await Game.list()
        const foundGame = games.find((g) => g.id === gameId && g.type === 'shopping')

        if (!foundGame) {
          router.push('/games')
          return
        }

        setGame(foundGame)
      } catch (error) {
        console.error('Error loading game:', error)
        router.push('/games')
      } finally {
        setLoading(false)
      }
    }

    loadGame()
  }, [router, searchParams])

  const handleGameComplete = () => {
    setGameCompleted(true)
  }

  const handlePlayAgain = () => {
    setGameCompleted(false)
    window.location.reload()
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    )
  }

  if (!game) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Game not found</p>
      </div>
    )
  }

  if (gameCompleted) {
    return <GameCompletion gameTitle={game.title} onPlayAgain={handlePlayAgain} />
  }

  return (
    <div id="game-container" className="h-full w-full">
      <GameHeader title={game.title} type={game.type} difficulty={game.difficulty} />

      <div id="game-content" className="flex flex-col h-full flex-1">
        <ShoppingGame user={user} game={game} onComplete={handleGameComplete} />
      </div>
    </div>
  )
}