'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import FlashCardsComponent, { type FlashCard } from '../FlashCardsComponent'

interface ConjunctionsContentProps {
  flashCards: FlashCard[]
}

export default function ConjunctionsContent({ flashCards }: ConjunctionsContentProps) {
  const [showFlashCards, setShowFlashCards] = useState(false)

  return (
    <>
      {/* CTA Button - Only show when flashcards are closed */}
      {!showFlashCards && (
        <div className="flex justify-center mb-8">
          <button
            onClick={() => setShowFlashCards(true)}
            className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg shadow-md transition-colors cursor-pointer"
          >
            Practice with Flash Cards
          </button>
        </div>
      )}

      {/* Flash Cards Section - Conditionally rendered */}
      {showFlashCards && (
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Flash Cards</h2>
            <button
              onClick={() => setShowFlashCards(false)}
              className="p-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer"
              title="Close flash cards"
              aria-label="Close flash cards"
            >
              <X className="w-6 h-6 text-gray-700" />
            </button>
          </div>
          <FlashCardsComponent flashCards={flashCards} />
        </section>
      )}
    </>
  )
}
