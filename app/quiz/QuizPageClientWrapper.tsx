'use client';

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { QuizConfig, VerbOption } from "@/types/quiz";

const QuizPageClient = dynamic(() => import('./QuizPageClient'), { ssr: false });

export default function QuizPageClientWrapper({ 
  initialVerbs,
  initialFavorites,
  initialPreferences = null
}: { 
  initialVerbs: VerbOption[], 
  initialFavorites: string[], 
  initialPreferences: QuizConfig | null
}) {
  const window: Window | undefined = globalThis.window;

  const [hydrated, setHydrated] = useState(false)
  useEffect(() => {
    if ( typeof window !== 'undefined' && window.localStorage) {
      setHydrated(true);
    }
  }, [window]);

  if (!hydrated) return null;

  return (
    <QuizPageClient
      initialVerbs={initialVerbs}
      initialFavorites={initialFavorites}
      initialPreferences={initialPreferences}
    />
  );
}