'use client'

import { Button } from '@/components/ui/button';
import { ArrowLeft, Trophy, RotateCcw, UserPlus } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import type { UserData } from '@/app/types';
import Link from 'next/link';

interface GameCompletionProps {
  gameTitle: string
  onPlayAgain: () => void
  user?: UserData
}

export default function GameCompletion({ gameTitle, onPlayAgain, user }: GameCompletionProps) {
  const router = useRouter()

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center bg-white rounded-2xl p-8 shadow-2xl max-w-md"
      >
        <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <Trophy className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Congratulations!</h2>
        <p className="text-gray-600 mb-8">
          You completed <strong>{gameTitle}</strong>
        </p>

        {!user?.isLoggedIn && (
          <div className="mb-6 p-4 bg-gradient-to-r from-orange-50 to-pink-50 border-2 border-orange-200 rounded-lg">
            <p className="text-sm font-semibold text-gray-800 mb-3">
              Want to save your progress and track your learning?
            </p>
            <Link href="/auth/signup">
              <Button className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600">
                <UserPlus className="w-4 h-4 mr-2" />
                Sign Up Free
              </Button>
            </Link>
          </div>
        )}

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => router.push('/games')}
            className="flex-1"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <Button
            onClick={onPlayAgain}
            className="flex-1 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Play Again
          </Button>
        </div>
      </motion.div>
    </div>
  )
}
