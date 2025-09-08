"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import type { Word } from "@/types/story";

type Props = {
  src: string;           // MP3 URL
  words: Word[];         // [{word:"This", start:0.1, end:0.25}, ...]
  autoScroll?: boolean;  // default true
};

function findActiveIndex(starts: Float64Array, t: number) {
  // Return index of last start <= t (binary search)
  let lo = 0, hi = starts.length - 1, ans = -1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (starts[mid] <= t) { ans = mid; lo = mid + 1; }
    else { hi = mid - 1; }
  }
  return ans;
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
      const idx = findActiveIndex(starts, t);
      if (idx !== activeIdx) setActiveIdx(idx);
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [starts, activeIdx]);

  useEffect(() => {
    if (!autoScroll) return;
    if (activeIdx < 0) return;
    const node = wordRefs.current[activeIdx];
    const container = containerRef.current;
    if (!node || !container) return;

    const nodeBox = node.getBoundingClientRect();
    const contBox = container.getBoundingClientRect();
    const isVisible = nodeBox.top >= contBox.top + 8 && nodeBox.bottom <= contBox.bottom - 8;
    if (!isVisible) node.scrollIntoView({ block: "center", inline: "nearest", behavior: "smooth" });
  }, [activeIdx, autoScroll]);

  const onWordClick = (idx: number) => {
    const el = audioRef.current;
    if (!el) return;
    const t = words[idx]?.start ?? 0;
    el.currentTime = Math.max(0, t + 0.01); // nudge to trigger highlight
    el.play().catch(() => {});
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <audio 
        ref={audioRef} 
        src={src} 
        controls 
        preload="metadata" 
        className="w-full my-6 rounded-lg shadow-md" 
      />
      <div
        ref={containerRef}
        className="h-96 overflow-y-auto rounded-2xl border border-gray-200 p-6 leading-8 text-[16px] bg-white shadow-sm"
        style={{ wordWrap: "break-word" }}
        aria-label="Transcript"
      >
        {words.map((w, i) => {
          const currentTime = audioRef.current?.currentTime ?? -1;
          const active = i === activeIdx || (i < activeIdx && words[i+1] && words[i+1].start > currentTime && currentTime <= w.end);
          return (
            <span
              key={i}
              ref={el => { wordRefs.current[i] = el }}
              onClick={() => onWordClick(i)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") onWordClick(i); }}
              className={[
                "cursor-pointer select-none px-1 rounded-md transition-colors duration-150",
                active ? "bg-yellow-200 text-gray-900" : "hover:bg-gray-100 text-gray-700"
              ].join(" ")}
              aria-current={active ? "true" : undefined}
              aria-label={`${w.word}, jump to ${w.start.toFixed(2)} seconds`}
            >
              {w.word}
              {" "}
            </span>
          );
        })}
      </div>
    </div>
  );
}
