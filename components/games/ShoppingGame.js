'use client'

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Volume2, Play, RotateCcw, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { useLanguage } from '../../contexts/LanguageContext';
import { playTTS, fallbackTTS } from '../../lib/tts-client';
import Image from 'next/image';

// Import all product images
import product001 from '../../app/game/products/001.png';
import product002 from '../../app/game/products/002.png';
import product003 from '../../app/game/products/003.png';
import product004 from '../../app/game/products/004.png';
import product005 from '../../app/game/products/005.png';
import product006 from '../../app/game/products/006.png';
import product007 from '../../app/game/products/007.png';
import product008 from '../../app/game/products/008.png';
import product009 from '../../app/game/products/009.png';
import product010 from '../../app/game/products/010.png';
import product011 from '../../app/game/products/011.png';
import product012 from '../../app/game/products/012.png';
import product013 from '../../app/game/products/013.png';
import product014 from '../../app/game/products/014.png';
import product015 from '../../app/game/products/015.png';
import product016 from '../../app/game/products/016.png';
import product017 from '../../app/game/products/017.png';
import product018 from '../../app/game/products/018.png';
import product019 from '../../app/game/products/019.png';
import product020 from '../../app/game/products/020.png';

// Import the tienda background
import tiendaBackground from '../../app/game/tienda-checkout.png';

const productImages = [
  product001, product002, product003, product004, product005,
  product006, product007, product008, product009, product010,
  product011, product012, product013, product014, product015,
  product016, product017, product018, product019, product020
];

export default function ShoppingGame({ game, onComplete }) {
  const { t } = useLanguage();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [currentPrice, setCurrentPrice] = useState(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackType, setFeedbackType] = useState(''); // 'correct' or 'incorrect'
  const [hasRetried, setHasRetried] = useState(false);
  const inputRef = useRef(null);

  const totalQuestions = 10;
  const minPrice = 5.00;
  const maxPrice = 99.99;

  // Generate random price
  const generateRandomPrice = () => {
    return Math.round((Math.random() * (maxPrice - minPrice) + minPrice) * 100) / 100;
  };

  // Format price for display
  const formatPrice = (price) => {
    return `$${price.toFixed(2)}`;
  };

  // Convert price to Spanish words
  const priceToSpanishWords = (price) => {
    const dollars = Math.floor(price);
    const cents = Math.round((price - dollars) * 100);
    
    let result = '';
    
    // Convert dollars
    if (dollars === 0) {
      result = 'cero';
    } else if (dollars === 1) {
      result = 'un';
    } else if (dollars < 20) {
      const units = ['', 'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve', 
                     'diez', 'once', 'doce', 'trece', 'catorce', 'quince', 'dieciséis', 'diecisiete', 'dieciocho', 'diecinueve'];
      result = units[dollars];
    } else if (dollars < 100) {
      const tens = ['', '', 'veinte', 'treinta', 'cuarenta', 'cincuenta', 'sesenta', 'setenta', 'ochenta', 'noventa'];
      const units = ['', 'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve'];
      const tenDigit = Math.floor(dollars / 10);
      const unitDigit = dollars % 10;
      
      if (unitDigit === 0) {
        result = tens[tenDigit];
      } else if (tenDigit === 2) {
        result = `veinti${units[unitDigit]}`;
      } else {
        result = `${tens[tenDigit]} y ${units[unitDigit]}`;
      }
    } else {
      result = 'cien'; // For simplicity, handle 100+ as "cien"
    }
    
    // Add "dólares" or "dólar"
    if (dollars === 1) {
      result += ' dólar';
    } else {
      result += ' dólares';
    }
    
    // Add cents
    if (cents > 0) {
      if (cents === 1) {
        result += ' y un centavo';
      } else {
        result += ` y ${cents} centavos`;
      }
    }
    
    return result;
  };

  // Format user input
  const formatUserInput = (value) => {
    // Remove all non-numeric characters except decimal point
    let cleaned = value.replace(/[^0-9.]/g, '');
    
    // Ensure only one decimal point
    const parts = cleaned.split('.');
    if (parts.length > 2) {
      cleaned = parts[0] + '.' + parts.slice(1).join('');
    }
    
    // Limit to 2 decimal places
    if (parts[1] && parts[1].length > 2) {
      cleaned = parts[0] + '.' + parts[1].substring(0, 2);
    }
    
    return cleaned;
  };

  // Initialize first question
  useEffect(() => {
    generateNewQuestion();
    
    // Cleanup timeout on unmount
    return () => {
      if (audioTimeoutRef.current) {
        clearTimeout(audioTimeoutRef.current);
      }
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Prevent multiple audio calls
  const audioTimeoutRef = useRef(null);

  const generateNewQuestion = () => {
    const randomProductIndex = Math.floor(Math.random() * productImages.length);
    const randomPrice = generateRandomPrice();
    
    setCurrentProduct(productImages[randomProductIndex]);
    setCurrentPrice(randomPrice);
    setUserAnswer('');
    setShowResult(false);
    setIsCorrect(false);
    setShowFeedback(false);
    setFeedbackType('');
    setHasRetried(false);
    
    // Clear any existing audio timeout
    if (audioTimeoutRef.current) {
      clearTimeout(audioTimeoutRef.current);
    }
    
    // Play TTS after a short delay only if user has interacted
    if (hasUserInteracted) {
      audioTimeoutRef.current = setTimeout(() => {
        playPriceAudio(randomPrice);
      }, 500);
    }
  };


  const playPriceAudio = async (price) => {
    if(isPlayingAudio) return;
    setIsPlayingAudio(true);
    inputRef.current.focus();
    try {
      const priceWords = priceToSpanishWords(price);
      const priceText = `cuesta ${priceWords}`;
      // Use the woman voice model specifically for the shopping game
      const womanVoice = process.env.NEXT_PUBLIC_DEEPGRAM_VOICE_WOMAN || "aura-2-estrella-es";
      await playTTS(priceText, womanVoice);
    } catch (error) {
      console.error('TTS failed, using fallback:', error);
      const priceWords = priceToSpanishWords(price);
      const priceText = `cuesta ${priceWords}`;
      await fallbackTTS(priceText);
    } finally {
      setIsPlayingAudio(false);
    }
  };

  const handleSubmit = () => {
    const userPrice = parseFloat(userAnswer);
    const correct = Math.abs(userPrice - currentPrice) < 0.001; // Allow for small floating point differences
    
    setIsCorrect(correct);
    setShowResult(true);
    setShowFeedback(true);
    setFeedbackType(correct ? 'correct' : 'incorrect');
    
    if (correct) {
      setScore(score + 1);
      // Move to next question after delay for correct answer
      setTimeout(() => {
        if (currentQuestion + 1 >= totalQuestions) {
          setGameCompleted(true);
          onComplete();
        } else {
          setCurrentQuestion(currentQuestion + 1);
          generateNewQuestion();
        }
      }, 2000);
    } else {
      // Handle incorrect answer
      if (!hasRetried) {
        // First wrong answer - give them a retry
        setHasRetried(true);
        setTimeout(() => {
          setShowFeedback(false);
          setUserAnswer('');
          setShowResult(false);
        }, 3000);
      } else {
        // Second wrong answer - move to next question
        setTimeout(() => {
          if (currentQuestion + 1 >= totalQuestions) {
            setGameCompleted(true);
            onComplete();
          } else {
            setCurrentQuestion(currentQuestion + 1);
            generateNewQuestion();
          }
        }, 3000);
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
    else if (e.key === ' ') {
      playPriceAudio(currentPrice);
    }
  };

  const handleStartGame = () => {
    setHasUserInteracted(true);
    // Play the first audio after user interaction
    setTimeout(() => {
      playPriceAudio(currentPrice);
    }, 500);
  };

  // Show start screen if user hasn't interacted yet
  if (!hasUserInteracted) {
    return (
      <div className="h-full xbg-red-500 xbg-gray-50 flex flex-col items-center p-4 pt-8">
        <div className="max-w-4xl w-full flex justify-center">
          <div className="w-full md:w-3/4">
            {/* Image Area with Rounded Corners */}
            <div className="relative w-full aspect-[3/2] bg-gray-100 overflow-hidden rounded-2xl shadow-xl">
              <div className="absolute inset-0">
                <Image 
                  src={tiendaBackground} 
                  alt="Tienda checkout" 
                  fill
                  priority
                />
              </div>
              
              {/* Product Overlay - Only show during game, not on start screen */}
              {/* {currentProduct && hasUserInteracted && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute inset-0 -top-1/3 z-10"
                >
                  <Image 
                    src={currentProduct} 
                    alt="Product" 
                    fill
                  />
                </motion.div>
              )} */}
              
              {/* Start Screen Overlay */}
              <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center rounded-2xl min-h-full">
                <div className="text-center space-y-4 max-w-sm mx-4 flex flex-col justify-center">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                      Tienda Checkout - Price Listening
                    </h2>
                    <p className="text-gray-600 text-sm md:text-base">
                      Listen to the price and type what you hear!
                    </p>
                  </div>
                  
                  <div className="flex flex-col space-y-2 text-gray-500 text-xs md:text-sm mx-auto">
                    <p className="text-left">• You'll hear a price in Spanish</p>
                    <p className="text-left">• Type the exact amount you heard</p>
                    <p className="text-left">• Complete 10 questions to finish</p>
                  </div>
                  
                  <Button
                    onClick={handleStartGame}
                    className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white px-6 py-2 text-base"
                  >
                    <Volume2 className="w-4 h-4 mr-2" />
                    Start Game
                  </Button>
                </div>
              </div>

            </div>

            {/* Mobile Start Screen Overlay */}
            {/* <div className="md:hidden flex items-center justify-center rounded-2xl min-h-full">
              <div className="text-center space-y-4 max-w-sm mx-4 flex flex-col justify-center">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    Tienda Checkout - Price Listening
                  </h2>
                  <p className="text-gray-600 text-sm md:text-base">
                    Listen to the price and type what you hear!
                  </p>
                </div>
                
                <div className="flex flex-col space-y-2 text-gray-500 text-xs md:text-sm mx-auto">
                  <p className="text-left">• You'll hear a price in Spanish</p>
                  <p className="text-left">• Type the exact amount you heard</p>
                  <p className="text-left">• Complete 10 questions to finish</p>
                </div>
                
                <Button
                  onClick={handleStartGame}
                  className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white px-6 py-2 text-base"
                >
                  <Volume2 className="w-4 h-4 mr-2" />
                  Start Game
                </Button>
              </div>
            </div> */}
            
          </div>
        </div>
      </div>
    );
  }

  if (gameCompleted) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center bg-white rounded-2xl p-8 shadow-2xl max-w-md"
        >
          <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">¡Excelente!</h2>
          <p className="text-gray-600 mb-4">
            Puntuación: <strong>{score}/{totalQuestions}</strong>
          </p>
          <p className="text-gray-600 mb-8">
            {score >= totalQuestions * 0.8 ? '¡Muy bien! Eres un experto en precios.' : 
             score >= totalQuestions * 0.6 ? 'Buen trabajo. Sigue practicando.' : 
             'Sigue practicando para mejorar.'}
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 flex justify-center p-4 pt-8">
      <div className="max-w-4xl w-full flex flex-col items-center">
        {/* Progress Bar */}
        <div className="mb-6 w-full max-w-3xl">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Pregunta {currentQuestion + 1} de {totalQuestions}</span>
            <span>Puntuación: {score}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-orange-500 to-pink-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / totalQuestions) * 100}%` }}
            />
          </div>
        </div>

        {/* Game Area */}
        <div className="relative xbg-white w-3/4 aspect-[3/2]">
          {/* Image Area with Rounded Corners */}
          <div className="relative w-full aspect-[3/2] bg-gray-100 overflow-hidden rounded-2xl shadow-xl">
            <div className="absolute inset-0">
              <Image 
                src={tiendaBackground} 
                alt="Tienda checkout" 
                fill
                priority
              />
            </div>
            
            {/* Product Overlay */}
            {currentProduct && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute inset-0 z-10"
              >
                <Image 
                  src={currentProduct} 
                  alt="Product" 
                  fill
                />
              </motion.div>
            )}
            
            {/* LCD Display */}
            {/* <div 
              className="absolute text-green-400 font-mono 
              text-3xl font-bold flex items-center justify-center
              top-[51%] left-[9%] rotate-1"
            >
              {showResult ? (
                <span className={isCorrect ? 'text-green-400' : 'text-red-400'}>
                  {formatPrice(currentPrice)}
                </span>
              ) : (
                <span className="text-green-300">$ ?.??</span>
              )}
            </div> */}

            {/* Replay Audio Button - Top Right Overlay */}
            {/* <div className="absolute top-4 right-4 z-20">
              <Button
                onClick={() => playPriceAudio(currentPrice)}
                disabled={isPlayingAudio}
                size="sm"
                className="bg-white/90 hover:bg-white text-gray-700 shadow-lg backdrop-blur-sm border border-gray-200 h-8 w-8 p-0"
              >
                {isPlayingAudio ? (
                  <div className="w-3 h-3 border-2 border-gray-700 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Volume2 className="w-3 h-3" />
                )}
              </Button>
            </div> */}

            <div 
              className="absolute inset-0 h-full z-20" 
              onClick={() => playPriceAudio(currentPrice)} disabled={isPlayingAudio}
              
            >
              <Button
                size="sm"
                className="absolute top-4 right-4 bg-white/90 hover:bg-white text-gray-700 shadow-lg backdrop-blur-sm border border-gray-200 h-8 w-8 p-0"
              >
                {isPlayingAudio ? (
                  <div className="w-3 h-3 border-2 border-gray-700 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Volume2 className="w-3 h-3" />
                )}
              </Button>
            </div>



            {/* Feedback Overlay */}
            {showFeedback && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={`absolute inset-0 flex items-center justify-center z-20 ${
                  feedbackType === 'correct' 
                    ? 'bg-green-500/80' 
                    : 'bg-red-500/80'
                }`}
              >
                <div className="text-center text-white">
                  <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    className="text-4xl font-bold mb-2"
                  >
                    {feedbackType === 'correct' ? '¡Correcto!' : 'Incorrecto'}
                  </motion.div>
                  {feedbackType === 'correct' ? (
                    <div>
                      <div className="text-4xl font-bold mb-2">
                        {formatPrice(currentPrice)}
                      </div>
                      <div className="text-lg font-medium opacity-90">
                        {priceToSpanishWords(currentPrice)}
                      </div>
                    </div>
                  ) : (
                    <div className="text-xl">
                      {hasRetried ? 'Inténtalo de nuevo' : 'Inténtalo una vez más'}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </div>

          {/* Controls */}
          <div className="p-6 bg-gray-50">
            <div className="flex flex-col items-center space-y-4">

                {/* Input Area */}
                <div className="w-full max-w-md">


                  {/* Result Message - colored bar above input*/}
                  {showResult && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`text-center p-4 rounded-lg -mt-2 mb-2 ${
                        isCorrect 
                          ? 'bg-green-100 text-green-800 border border-green-200' 
                          : 'bg-red-100 text-red-800 border border-red-200'
                      }`}
                    >
                      {isCorrect ? (
                        <p className="font-semibold">¡Correcto! 🎉</p>
                      ) : (
                        <p className="font-semibold">
                          Incorrecto. {hasRetried && `La respuesta correcta es ${formatPrice(currentPrice)}`}
                        </p>
                      )}
                    </motion.div>
                  )}
                {(!showResult && hasRetried) && <div className="text-red-500 font-bold text-center italic -mt-2 mb-2">Inténtalo una vez más</div>}
                  <label className="block text-base font-bold text-gray-700 mb-2">
                    ¿Cuánto cuesta? (en pesos)
                  </label>
                  <div className="flex space-x-2">
                    <Input
                      ref={inputRef}
                      type="text"
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(formatUserInput(e.target.value))}
                      onKeyPress={handleKeyPress}
                      placeholder="0.00"
                      className="text-center text-lg border-2 border-gray-300"
                      disabled={showResult}
                    />
                    <Button
                      onClick={handleSubmit}
                      disabled={!userAnswer || showResult}
                      className="bg-green-500 hover:bg-green-600 text-white px-6"
                    >
                      {showResult ? (
                        isCorrect ? (
                          <CheckCircle className="w-5 h-5 text-green-400" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-400" />
                        )
                      ) : (
                        'Enviar'
                      )}
                    </Button>
                  </div>
                  <div className='mt-4 text-gray-500 text-sm italic'>
                    Pulsa <code className="bg-gray-400 text-white text-xs px-1 rounded-sm">espacio</code> para escuchar el precio. 
                    Pulsa <code className="bg-gray-400 text-white text-xs px-1 rounded-sm">enter</code> para enviar.
                  </div>
                </div>

                
              </div>
            </div>
          </div>
        </div>
      </div>
    );
}
