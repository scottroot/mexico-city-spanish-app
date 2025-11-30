

// import React, { useState, useEffect } from 'react';
// import dynamic from 'next/dynamic';
// import { Game, GameData } from '@/entities/Game';
// import { useRouter, useSearchParams } from 'next/navigation';
// import { Button } from '@/components/ui/button';
// import { ArrowLeft, Trophy, RotateCcw, Loader2 } from 'lucide-react';
// import { motion } from 'framer-motion';
// import Link from 'next/link';
// import { createClient } from '@/utils/supabase/client';
// import { GameType } from '@/components/games/types';


// // Dynamic imports for game components (only load when needed)
// const VocabularyGame = dynamic(() => import('@/components/games/VocabularyGame'), {
//   loading: () => <GameLoadingSpinner />,
// });

// const GrammarGame = dynamic(() => import('@/components/games/GrammarGame'), {
//   loading: () => <GameLoadingSpinner />,
// });

// const PronunciationGame = dynamic(() => import('@/components/games/PronunciationGame'), {
//   loading: () => <GameLoadingSpinner />,
// });

// const ShoppingGame = dynamic(() => import('@/components/games/ShoppingGame'), {
//   loading: () => <GameLoadingSpinner />,
// });

// const TranslationGame = dynamic(() => import('@/app/game/translation/TranslationGameWrapper'), {
//   loading: () => <GameLoadingSpinner />,
// });

// function GameLoadingSpinner() {
//   return (
//     <div className="flex items-center justify-center min-h-[400px]">
//       <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
//     </div>
//   );
// }

// export default function GamePage({user}: {user: any}) {
//   const [game, setGame] = useState<GameData | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [gameCompleted, setGameCompleted] = useState(false);
//   const [authChecked, setAuthChecked] = useState(false);
//   const router = useRouter();
//   const searchParams = useSearchParams();

//   useEffect(() => {
//     const loadGame = async () => {
//       const gameId = searchParams.get('id');

//       if (!gameId) {
//         router.push('/games');
//         return;
//       }

//       try {
//         const games = await Game.list();
//         const foundGame = games.find((g) => g.id === gameId);

//         if (!foundGame) {
//           router.push('/games');
//           return;
//         }

//         // Check authentication for translation game
//         if (foundGame.type === 'translation') {
//           const supabase = createClient();
//           if (!user.isLoggedIn) {
//             router.push(`/auth/login?redirect=/game?id=${gameId}`);
//             return;
//           }
//         }

//         setGame(foundGame);
//         setAuthChecked(true);
//       } catch (error) {
//         console.error('Error loading game:', error);
//         router.push('/games');
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadGame();
//   }, [router, searchParams]);

//   const handleGameComplete = () => {
//     setGameCompleted(true);
//   };

//   const handlePlayAgain = () => {
//     setGameCompleted(false);
//     window.location.reload();
//   };

//   if (loading || !authChecked) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
//       </div>
//     );
//   }

//   if (!game) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <p className="text-gray-500">Game not found</p>
//       </div>
//     );
//   }

//   if (gameCompleted) {
//     return (
//       <div className="min-h-screen flex items-center justify-center p-4">
//         <motion.div
//           initial={{ opacity: 0, scale: 0.8 }}
//           animate={{ opacity: 1, scale: 1 }}
//           className="text-center bg-white rounded-2xl p-8 shadow-2xl max-w-md"
//         >
//           <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
//             <Trophy className="w-10 h-10 text-white" />
//           </div>
//           <h2 className="text-3xl font-bold text-gray-800 mb-4">Congratulations!</h2>
//           <p className="text-gray-600 mb-8">
//             You completed <strong>{game.title}</strong>
//           </p>
//           <div className="flex gap-3">
//             <Button
//               variant="outline"
//               onClick={() => router.push('/games')}
//               className="flex-1"
//             >
//               <ArrowLeft className="w-4 h-4 mr-2" />
//               Back
//             </Button>
//             <Button
//               onClick={handlePlayAgain}
//               className="flex-1 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600"
//             >
//               <RotateCcw className="w-4 h-4 mr-2" />
//               Play Again
//             </Button>
//           </div>
//         </motion.div>
//       </div>
//     );
//   }

//   const renderGame = () => {
//     switch (game.type) {
//       case 'vocabulary':
//         return <VocabularyGame game={game} onComplete={handleGameComplete} />;
//       case 'grammar':
//         return <GrammarGame game={game} onComplete={handleGameComplete} />;
//       case 'pronunciation':
//         return <PronunciationGame game={game} onComplete={handleGameComplete} />;
//       case 'shopping':
//         return <ShoppingGame game={game} onComplete={handleGameComplete} />;
//       case 'translation':
//         return <TranslationGame />;
//       default:
//         return <div>Unsupported game type</div>;
//     }
//   };

//   return (
//     <div id="game-container" className="h-full w-full">
//       {/* Header */}
//       <div className="w-full bg-white/80 backdrop-blur-sm border-b border-gray-200 px-4 h-14 max-w-6xl mx-auto flex items-center justify-start gap-3">
//         <Link href="/games">
//           <Button variant="outline" size="sm" className="h-8 w-8 p-0">
//             <ArrowLeft className="w-4 h-4" />
//           </Button>
//         </Link>
//         <div>
//           <h1 className="text-sm font-semibold text-gray-800">{game.title}</h1>
//           <p className="text-xs text-gray-500 capitalize">
//             {game.type} • {game.difficulty}
//           </p>
//         </div>
//       </div>

//       {/* Game Content */}
//       <div id="game-content" className="flex flex-col h-full flex-1">
//         {renderGame()}
//       </div>
//     </div>
//   );
// }

import { redirect } from 'next/navigation';


export default async function GamePage() {
  redirect('/games');
}
