'use client'

import { useState, useEffect, useRef } from 'react'
import { ChevronLeft, ChevronRight, RotateCcw, Shuffle, Volume2 } from 'lucide-react'
import { playTTS, fallbackTTS } from '@/lib/tts-client'
import { motion, AnimatePresence } from 'framer-motion'

export type FlashCard = {
  front: string;
  back: string;
  examples?: Array<{
    spanish: string;
    translation: string;
  }>;
}

/**
 * This takes a list of pairs of strings and displays one as a card and when clicked it shows the back of the card
 * @param param0 
 * @returns 
 */
export default function FlashCardsComponent({ flashCards }: { flashCards: FlashCard[] }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [shuffledCards, setShuffledCards] = useState(flashCards)
  const [isShuffled, setIsShuffled] = useState(false)
  const [isPlayingAudio, setIsPlayingAudio] = useState(false)
  const [autoAdvance, setAutoAdvance] = useState(false)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const prevIndexRef = useRef(currentIndex)

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50

  // Reset flip state when card changes
  useEffect(() => {
    setIsFlipped(false)
  }, [currentIndex])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowRight':
        case 'd':
        case 'D':
          e.preventDefault()
          handleNext()
          break
        case 'ArrowLeft':
        case 'a':
        case 'A':
          e.preventDefault()
          handlePrevious()
          break
        case ' ':
        case 's':
        case 'S':
          e.preventDefault()
          setIsFlipped(!isFlipped)
          break
        case 'f':
        case 'F':
          e.preventDefault()
          handleShuffle()
          break
        case 'r':
        case 'R':
          e.preventDefault()
          handleReset()
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentIndex, shuffledCards.length, isFlipped])

  // Auto-advance timer
  useEffect(() => {
    if (!autoAdvance || !isFlipped) return

    const timer = setTimeout(() => {
      handleNext()
    }, 3000) // Auto-advance after 3 seconds

    return () => clearTimeout(timer)
  }, [autoAdvance, isFlipped, currentIndex])

  const handleNext = () => {
    if (currentIndex < shuffledCards.length - 1) {
      setCurrentIndex(currentIndex + 1)
    }
  }

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  const handleShuffle = () => {
    const newShuffled = [...flashCards].sort(() => Math.random() - 0.5)
    setShuffledCards(newShuffled)
    setCurrentIndex(0)
    setIsFlipped(false)
    setIsShuffled(true)
  }

  const handleReset = () => {
    setShuffledCards(flashCards)
    setCurrentIndex(0)
    setIsFlipped(false)
    setIsShuffled(false)
  }

  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Edge navigation only works on the BACK of the card (when flipped)
    if (!isFlipped) {
      // Front of card - always flip, no edge navigation
      setIsFlipped(true)
      return
    }

    // Back of card - click edge navigation: divide card into 3 zones (left 25%, center 50%, right 25%)
    const rect = e.currentTarget.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const cardWidth = rect.width
    const leftEdge = cardWidth * 0.25
    const rightEdge = cardWidth * 0.75

    if (clickX < leftEdge) {
      // Clicked left edge - go to previous
      handlePrevious()
    } else if (clickX > rightEdge) {
      // Clicked right edge - go to next
      handleNext()
    } else {
      // Clicked center - flip card back to front
      setIsFlipped(false)
    }
  }

  const playAudio = async (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent card flip when clicking speaker icon

    if (isPlayingAudio) return

    setIsPlayingAudio(true)
    try {
      await playTTS(currentCard.front)
    } catch (error) {
      console.error('Error with TTS:', error)
      // Fallback to browser speech synthesis
      fallbackTTS(currentCard.front)
    } finally {
      setIsPlayingAudio(false)
    }
  }

  // Swipe gesture handlers
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return

    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe) {
      handleNext()
    } else if (isRightSwipe) {
      handlePrevious()
    }
  }

  const currentCard = shuffledCards[currentIndex]

  if (!currentCard) {
    return null
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Header with controls */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleShuffle}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm font-medium cursor-pointer"
            title="Shuffle cards (F)"
          >
            <Shuffle className="w-4 h-4" />
            Shuffle
          </button>
          {isShuffled && (
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm font-medium cursor-pointer"
              title="Reset to original order (R)"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
          )}
          <button
            onClick={() => setAutoAdvance(!autoAdvance)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors text-sm font-medium cursor-pointer ${
              autoAdvance
                ? 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
            title="Auto-advance after 3 seconds"
          >
            {autoAdvance ? '⏸' : '▶'} Auto
          </button>
        </div>
        <div className="text-sm text-gray-600">
          {currentIndex + 1} / {shuffledCards.length}
        </div>
      </div>

      {/* Flash Card */}
      <div className="relative mb-6 overflow-hidden">
        <AnimatePresence mode="wait" initial={false} custom={currentIndex > prevIndexRef.current ? 'left' : 'right'}>
          <motion.div
            key={currentIndex}
            custom={currentIndex > prevIndexRef.current ? 'left' : 'right'}
            initial={(direction: string) => ({
              x: direction === 'left' ? 300 : -300,
              opacity: 0
            })}
            animate={{
              x: 0,
              opacity: 1
            }}
            exit={(direction: string) => ({
              x: direction === 'left' ? -300 : 300,
              opacity: 0
            })}
            transition={{
              x: { type: 'spring', stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 }
            }}
            onAnimationComplete={() => {
              prevIndexRef.current = currentIndex
            }}
          >
            <div
              onClick={handleCardClick}
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
              className="cursor-pointer"
              style={{
                perspective: '1000px',
              }}
            >
              <div
                className="relative w-full min-h-80 h-fit transition-transform duration-500"
                style={{
                  transformStyle: 'preserve-3d',
                  transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                }}
              >
            {/* Front of card */}
            <div
              className="absolute inset-0 w-full h-full"
              style={{
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
                transform: 'rotateY(0deg)',
              }}
            >
              <div className="w-full h-full bg-gradient-to-br from-orange-50 to-orange-100/60 rounded-xl flex items-center justify-center p-8 relative">
                {/* Speaker button */}
                <button
                  onClick={playAudio}
                  disabled={isPlayingAudio}
                  className="absolute top-4 right-4 p-3 bg-white/80 hover:bg-white rounded-full shadow-md transition-all hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  title="Play pronunciation"
                  aria-label="Play pronunciation"
                >
                  <Volume2
                    className={`w-5 h-5 text-orange-600 ${isPlayingAudio ? 'animate-pulse' : ''}`}
                  />
                </button>

                <div className="text-center cursor-pointer">
                  {/* <p className="text-orange-500 text-sm mb-2">Spanish</p> */}
                  <h2 className="text-4xl md:text-5xl font-bold text-orange-600 no-select">
                    {currentCard.front}
                  </h2>
                  <p className="absolute bottom-4 text-center w-full right-0 text-orange-500/60 text-xs mt-4">Click to flip</p>
                </div>
              </div>
            </div>

            {/* Back of card */}
            <div
              className="absolute inset-0 w-full h-full"
              style={{
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)',
              }}
            >
              <div className="w-full h-full bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl flex items-center justify-center p-4 md:p-8 relative">
                {/* Left edge navigation - Previous */}
                <div
                  onClick={(e) => {
                    e.stopPropagation()
                    handlePrevious()
                  }}
                  className={`absolute left-0 top-0 h-full w-8 md:w-16 rounded-l-xl flex items-center justify-center transition-all duration-200 ${
                    currentIndex === 0
                      ? 'opacity-20 cursor-not-allowed'
                      : 'cursor-pointer bg-blue-100 hover:bg-blue-200/30 opacity-50 hover:opacity-100'
                  }`}
                  title="Previous card (←)"
                >
                  <div className="flex flex-col items-center gap-1">
                    <ChevronLeft className="w-5 h-5 text-blue-600" />
                    <span className="text-[10px] text-blue-600 font-medium -rotate-90 whitespace-nowrap">
                      Prev
                    </span>
                  </div>
                </div>

                {/* Center content */}
                <div className="text-center px-8 md:px-16 cursor-pointer max-h-full py-4">
                  <p className="text-slate-500/50 text-base md:text-xl mb-2 ">
                    &ldquo;<span className="font-bold">{currentCard.front}</span>&rdquo;
                  </p>
                  {(() => {
                    // Parse translation to separate main text from parenthetical
                    const match = currentCard.back.match(/^([^(]+)(\(.+\))(.*)$/)
                    if (match) {
                      const [, mainText, parenthetical, afterText] = match
                      return (
                        <>
                          <h2 className="text-3xl md:text-5xl font-bold text-blue-600 no-select">
                            {mainText.trim()}{afterText.trim()}
                          </h2>
                          <p className="text-lg text-blue-500 mt-2">
                            {parenthetical}
                          </p>
                        </>
                      )
                    }
                    return (
                      <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-blue-600 no-select">
                        {currentCard.back}
                      </h2>
                    )
                  })()}

                  {/* Example sentences */}
                  {currentCard.examples && currentCard.examples.length > 0 && (
                    <div className="relative mt-6 space-y-2">
                      <div className="absolute left-0 -top-3 text-xs text-slate-400 font-light tracking-loose">
                        EXAMPLE
                      </div>
                      {currentCard.examples.map((example, idx) => (
                        <div key={idx} className="bg-white/40 rounded-lg py-2 px-3 text-center h-fit md:h-14 space-y-1">
                          <p className="text-xs md:text-sm text-slate-700">
                            <span 
                              dangerouslySetInnerHTML={{ 
                                __html: example.spanish.replace(
                                  new RegExp(currentCard.front.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'),
                                  (match) => `<strong>${match}</strong>`
                                )
                              }}
                            />
                          </p>
                          <p className="text-xs md:text-sm text-blue-600/80">
                            {example.translation}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  <p className="absolute bottom-4 right-0 text-center w-full text-blue-500/60 text-xs mt-4">Click center to flip</p>
                </div>

                {/* Right edge navigation - Next */}
                <div
                  onClick={(e) => {
                    e.stopPropagation()
                    handleNext()
                  }}
                  className={`absolute right-0 top-0 h-full w-8 md:w-16 rounded-r-xl flex items-center justify-center transition-all duration-200 ${
                    currentIndex === shuffledCards.length - 1
                      ? 'opacity-20 cursor-not-allowed'
                      : 'cursor-pointer bg-blue-100 hover:bg-blue-200/30 opacity-50 hover:opacity-100'
                  }`}
                  title="Next card (→)"
                >
                  <div className="flex flex-col items-center gap-1">
                    <ChevronRight className="w-5 h-5 text-blue-600" />
                    <span className="text-[10px] text-blue-600 font-medium rotate-90 whitespace-nowrap">
                      Next
                    </span>
                  </div>
                </div>
              </div>
            </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation buttons */}
      <div className="flex items-center justify-center gap-4 mb-6">
        <button
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          className="flex items-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer rounded-lg transition-colors font-medium"
        >
          <ChevronLeft className="w-5 h-5" />
          Previous
        </button>
        <button
          onClick={handleNext}
          disabled={currentIndex === shuffledCards.length - 1}
          className="flex items-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer rounded-lg transition-colors font-medium"
        >
          Next
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Keyboard shortcuts hint */}
      <div className="text-center text-xs text-gray-500 space-y-1 border-t pt-4">
        <p className="font-semibold text-gray-600 mb-2">Navigation Tips</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 max-w-3xl mx-auto">
          <div>
            <span className="font-mono bg-gray-100 px-2 py-1 rounded">A</span>{' '}
            <span className="font-mono bg-gray-100 px-2 py-1 rounded">D</span> or{' '}
            <span className="font-mono bg-gray-100 px-2 py-1 rounded">← →</span> = Previous/Next
          </div>
          <div>
            <span className="font-mono bg-gray-100 px-2 py-1 rounded">S</span> or{' '}
            <span className="font-mono bg-gray-100 px-2 py-1 rounded">Space</span> = Flip
          </div>
          <div>
            <span className="font-mono bg-gray-100 px-2 py-1 rounded">F</span> = Shuffle,{' '}
            <span className="font-mono bg-gray-100 px-2 py-1 rounded">R</span> = Reset
          </div>
        </div>
        <p className="text-gray-400 mt-2">💡 Swipe left/right on mobile • Click card edges to navigate • Click center to flip</p>
      </div>
    </div>
  )
}