'use client'

import { useState } from 'react'
import GameCompletion from './GameCompletion'
import GameHeader from './GameHeader'
import type { GameData, UserData } from "@/app/types"


interface GameWrapperProps {
  game: GameData
  user: UserData
  children: (onComplete: () => void) => React.ReactNode
}
/**
 * GameWrapper - Client component that manages game completion state and rendering
 *
 * What it HANDLES:
 * - Completion state management (completed/not completed)
 * - Conditional rendering (game vs completion screen)
 * - Creating and passing the onComplete callback to child games
 * - Play again functionality (reloads the page)
 *
 * What it PASSES THROUGH:
 * - game.title, game.type, game.difficulty → GameHeader component
 * - user data → GameCompletion component (for signup prompt if anonymous)
 *
 * Render Prop Pattern:
 * - Receives children as a function: (onComplete: () => void) => React.ReactNode
 * - Calls children with a callback that sets completed to true
 * - This allows game components to trigger completion without prop drilling
 * - Flow: Game calls onComplete() → setCompleted(true) → shows GameCompletion
 *
 * @param game - Game data from database (title, type, difficulty, content)
 * @param user - User data from Supabase auth (null if anonymous)
 * @param children - Render prop function that receives onComplete callback
 */
export default function GameWrapper({ game, user, children }: GameWrapperProps) {
  const [completed, setCompleted] = useState(false)

  const handlePlayAgain = () => {
    setCompleted(false)
    window.location.reload()
  }

  if (completed) {
    return <GameCompletion gameTitle={game.title} onPlayAgain={handlePlayAgain} user={user} />
  }

  return (
    <div id="game-container" className="h-full w-full">
      <GameHeader title={game.title} type={game.type} difficulty={game.difficulty} />
      <div id="game-content" className="flex flex-col h-full flex-1">
        {children(() => setCompleted(true))}
      </div>
    </div>
  )
}
