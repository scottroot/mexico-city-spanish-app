"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import type { Word } from "@/types/story";

type Props = {
  src: string;           // MP3 URL
  words: Word[];         // [{word:"This", start:0.1, end:0.25}, ...]
  autoScroll?: boolean;  // default true
};

function findActiveIndex(starts: Float64Array, words: Word[], t: number) {
  // Return index of last start <= t (binary search), skipping line breaks and bracketed words
  let lo = 0, hi = starts.length - 1, ans = -1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (starts[mid] <= t) { ans = mid; lo = mid + 1; }
    else { hi = mid - 1; }
  }
  
  // If we found a line break or bracketed word, find the previous actual word
  if (ans >= 0 && (words[ans]?.word === '\n' || isBracketedWord(words[ans]?.word))) {
    for (let i = ans - 1; i >= 0; i--) {
      if (words[i]?.word !== '\n' && !isBracketedWord(words[i]?.word)) {
        return i;
      }
    }
    return -1;
  }
  
  return ans;
}

// Helper function to check if a word is wrapped in square brackets
function isBracketedWord(word: string | undefined): boolean {
  if (!word) return false;
  
  // Check for exact bracket wrapping
  if (word.startsWith('[') && word.endsWith(']')) {
    return true;
  }
  
  // Check for bracket wrapping with quotation marks
  if ((word.startsWith('"[[') && word.endsWith(']]"')) ||
      (word.startsWith('"[') && word.endsWith(']"')) ||
      (word.startsWith("'[") && word.endsWith("]'")) ||
      (word.startsWith("'[[") && word.endsWith("]]'"))) {
    return true;
  }
  
  // Check for bracket wrapping with leading quotation mark
  if ((word.startsWith('"[') && word.endsWith(']')) ||
      (word.startsWith("'[") && word.endsWith(']'))) {
    return true;
  }
  
  // Check for bracket wrapping with trailing quotation mark
  if ((word.startsWith('[') && word.endsWith(']"')) ||
      (word.startsWith('[') && word.endsWith("]'"))) {
    return true;
  }
  
  // Check for words that contain bracketed content (like "[thoughtful] Mañana")
  // This handles cases where the bracket is in the middle of a word
  if (word.includes('[') && word.includes(']')) {
    // Extract the bracketed part
    const bracketMatch = word.match(/\[([^\]]+)\]/);
    if (bracketMatch) {
      // If the word is mostly just the bracket with minimal other content, filter it out
      const bracketContent = bracketMatch[0]; // e.g., "[thoughtful]"
      const otherContent = word.replace(bracketContent, '').trim();
      
      // If there's minimal content outside the brackets, consider it a bracketed word
      if (otherContent.length <= 2) { // Allow for quotes or minimal punctuation
        return true;
      }
    }
  }
  
  return false;
}

export default function TranscriptPlayer({ src, words, autoScroll = true }: Props) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const rafRef = useRef<number | null>(null);

  const starts = useMemo(() => {
    const arr = new Float64Array(words.length);
    for (let i = 0; i < words.length; i++) arr[i] = words[i].start;
    return arr;
  }, [words]);

  const [activeIdx, setActiveIdx] = useState<number>(-1);

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;

    const loop = () => {
      const t = el.currentTime || 0;
      const idx = findActiveIndex(starts, words, t);
      // Use functional update to avoid dependency on activeIdx
      setActiveIdx(prev => idx !== prev ? idx : prev);
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [starts, words]);

  useEffect(() => {
    if (!autoScroll) return;
    if (activeIdx < 0) return;
    const node = wordRefs.current[activeIdx];
    if (!node) return;

    const nodeBox = node.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const audioPlayerHeight = 100; // Approximate height of fixed audio player
    const availableHeight = viewportHeight - audioPlayerHeight;
    
    // Check if the active word is visible in the viewport (accounting for fixed audio player)
    const isVisible = nodeBox.top >= 8 && nodeBox.bottom <= availableHeight - 8;
    
    if (!isVisible) {
      // Calculate the scroll position to center the word in the available viewport
      const scrollY = window.scrollY + nodeBox.top - (availableHeight / 2);
      window.scrollTo({ top: Math.max(0, scrollY), behavior: "smooth" });
    }
  }, [activeIdx, autoScroll]);

  // Handle keyboard events for audio control
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle spacebar if not typing in an input field
      if (e.code === 'Space' && e.target instanceof HTMLElement && 
          !['INPUT', 'TEXTAREA'].includes(e.target.tagName)) {
        e.preventDefault();
        const audio = audioRef.current;
        if (!audio) return;
        
        if (audio.paused) {
          audio.play().catch(() => {});
        } else {
          audio.pause();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const onWordClick = (idx: number) => {
    const el = audioRef.current;
    if (!el) return;
    const word = words[idx];
    if (!word || word.word === '\n' || isBracketedWord(word.word)) return; // Skip line breaks and bracketed words
    const t = word.start ?? 0;
    el.currentTime = Math.max(0, t + 0.01); // nudge to trigger highlight
    el.play().catch(() => {});
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Story Text Area - Full height with normal page scroll */}
      <div
        ref={containerRef}
        className="overflow-x-hidden rounded-2xl border border-gray-200 p-6 leading-8 text-[16px] bg-white shadow-sm mb-20"
        style={{ wordWrap: "break-word", overflowWrap: "break-word" }}
        aria-label="Transcript"
      >
        {words.map((w, i) => {
          const currentTime = audioRef.current?.currentTime ?? -1;
          const active = i === activeIdx || (i < activeIdx && words[i+1] && words[i+1].start > currentTime && currentTime <= w.end);
          
          // Handle line breaks
          if (w.word === '\n') {
            return <br key={i} />;
          }
          
          // Skip words wrapped in square brackets (don't display them)
          if (isBracketedWord(w.word)) {
            return null;
          }
          
          return (
            <span
              key={i}
              ref={el => { wordRefs.current[i] = el }}
              onClick={() => onWordClick(i)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") onWordClick(i); }}
              className={[
                "cursor-pointer select-none px-1 rounded-md transition-colors duration-150 inline-block",
                active ? "bg-yellow-200 text-gray-900" : "hover:bg-gray-100 text-gray-700"
              ].join(" ")}
              style={{ wordBreak: "break-word", overflowWrap: "break-word" }}
              aria-current={active ? "true" : undefined}
              aria-label={`${w.word}, jump to ${w.start.toFixed(2)} seconds`}
            >
              {w.word}
              {" "}
            </span>
          );
        })}
      </div>
      
      {/* Fixed Audio Player at Bottom - Accounts for sidebar and mobile nav */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-10
                      max-md:bottom-16 md:left-[86px] xl:left-64">
        <div className="container mx-auto px-4 py-4">
          <audio
            ref={audioRef}
            src={src}
            controls
            preload="metadata"
            className="w-full rounded-lg"
          />
        </div>
      </div>
    </div>
  );
}
