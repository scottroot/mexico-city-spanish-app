// Word-level timestamps for audio-text synchronization
export type Word = { 
  word: string; 
  start: number; 
  end: number; 
}; // seconds

// Story data structure
export interface Story {
  id: string;
  title: string;
  slug: string;
  level: string;
  reading_time: string;
  text: string;
  enhanced_text?: string;
  featured_image_url?: string;
  audio_url?: string;
  alignment_data?: any;
  normalized_alignment_data?: any;
  summary?: string;
  summary_english?: string;
  created_at: string;
  updated_at: string;
}

// Normalizer for ElevenLabs timings output
export function normalizeElevenLabsTimings(
  timings: Array<{text: string; start: number; end: number}> // ms
): Word[] {
  return timings
    .filter(t => t.text.trim().length)
    .map(t => ({ word: t.text, start: t.start / 1000, end: t.end / 1000 }));
}

// Normalizer for existing alignment data format
export function normalizeAlignmentData(alignmentData: any): Word[] {
  if (!alignmentData || !alignmentData.characters) {
    return [];
  }

  const words: Word[] = [];
  const characters = alignmentData.characters;
  
  // Handle different timestamp formats
  let startTimes: number[] = [];
  let endTimes: number[] = [];
  
  if (alignmentData.characterStartTimesSeconds && alignmentData.characterEndTimesSeconds) {
    // New format with separate start/end arrays
    startTimes = alignmentData.characterStartTimesSeconds;
    endTimes = alignmentData.characterEndTimesSeconds;
  } else if (alignmentData.timestamps) {
    // Old format with single timestamp array
    startTimes = alignmentData.timestamps;
    endTimes = alignmentData.timestamps;
  } else {
    return [];
  }
  
  let currentWord = '';
  let wordStart = -1;
  
  for (let i = 0; i < characters.length; i++) {
    const char = characters[i];
    const startTime = startTimes[i] || 0;
    const endTime = endTimes[i] || startTime;
    
    if (char === ' ' || char === '\n' || char === '\t') {
      // End of word
      if (currentWord.trim() && wordStart >= 0) {
        words.push({
          word: currentWord.trim(),
          start: wordStart,
          end: endTime
        });
      }
      currentWord = '';
      wordStart = -1;
    } else {
      // Add character to current word
      if (wordStart < 0) {
        wordStart = startTime;
      }
      currentWord += char;
    }
  }
  
  // Add final word if exists
  if (currentWord.trim() && wordStart >= 0) {
    const lastEndTime = endTimes[endTimes.length - 1] || wordStart;
    words.push({
      word: currentWord.trim(),
      start: wordStart,
      end: lastEndTime
    });
  }
  
  return words;
}
