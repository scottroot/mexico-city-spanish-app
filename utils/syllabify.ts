// utils/syllabify.ts

// Spanish syllabification with sinalefa and tonic marking (caps).
const VOWELS = "aeiouáéíóúü";
const CLUSTERS = new Set(["pl", "pr", "bl", "br", "fr", "fl", "tr", "dr", "cl", "cr", "gl", "gr", "tl"]);
const CULT_INIT = new Set(["pt", "ps", "pn", "ct", "cn", "gn", "mn"]);
const DIGRAPHS = new Set(["ch", "ll", "rr"]);

const isWeak = (c: string) => "iuíúüy".includes(c);
const isStrong = (c: string) => "aeoáéó".includes(c);

// u is silent in qu/gu before e/i unless 'ü'
const isSilentU = (w: string, i: number) =>
  w[i] === "u" &&
  i > 0 &&
  (w[i - 1] === "q" || w[i - 1] === "g") &&
  (w[i + 1] === "e" || w[i + 1] === "i");

// treat 'y' as vowel only word-finally or before consonant
const isVocalicY = (w: string, i: number) =>
  w[i] === "y" && (i === w.length - 1 || !"aeiouáéíóúü".includes(w[i + 1]));

// replace isVowel with:
const isVowelAt = (w: string, i: number) => {
  if (isSilentU(w, i)) return false;
  const c = w[i];
  if ("aeiouáéíóúü".includes(c)) return true;
  return isVocalicY(w, i);
};

// diphthong/triphthong across 0 or 1 'h'
function formsDiphthong(w: string, i: number, j: number): boolean {
  if (j - i > 2) return false;               // too far
  if (j - i === 2 && w[i + 1] !== "h") return false; // only 'h' allowed inside
  const a = w[i], b = w[j];
  // vowel value for 'y'
  const A = a === "y" ? "i" : a;
  const B = b === "y" ? "i" : b;
  // accented weak breaks diphthong
  if ("íú".includes(A) || "íú".includes(B)) return false;
  // strong+strong is hiatus
  if (isStrong(A) && isStrong(B)) return false;
  // otherwise diphthong
  return true;
}

const cleanWord = (word: string) =>
  word
    .toLowerCase()
    .replace(/[^a-záéíóúüñ0-9_]/gi, "")
    .normalize("NFC");

const startsWithVowelSound = (s: string) => {
  s = s.trim().toLowerCase();
  if (!s) return false;
  if (s === "y") return true; // conjunction y = /i/
  if (s[0] === "h" && s.length > 1 && isVowelAt(s, 1)) return true;
  // initial 'y' before vowel is consonant
  if (s[0] === "y" && s.length > 1 && isVowelAt(s, 1)) return false;
  return isVowelAt(s, 0);
};

// Block sinalefa if either side ends/begins with accented vowel
const blocksSinalefa = (aLast: string, bFirst: string) =>
  /[áéíóú]/.test(aLast) || /[áéíóú]/.test(bFirst);

function getTonicIndex(word: string, syllables: string[]): number {
  // First check for explicit accents (including í/ú in diphthongs)
  for (let i = 0; i < syllables.length; i++) {
    const s = syllables[i];
    if (/[áéíóú]/.test(s)) return i;
  }
  
  // Default stress rules
  const n = syllables.length;
  const clean = cleanWord(word);
  if (!clean) return 0;
  const last = clean[clean.length - 1];
  if ("nsaeiou".includes(last)) return n >= 2 ? n - 2 : 0;
  return n - 1;
}

export function syllabifyWord(word: string): Array<[string, boolean]> {
  word = cleanWord(word);
  if (!word) return [];

  if (word.length <= 2) {
    const isTonic = /[áéíóú]/.test(word);
    return [[word, isTonic]];
  }

  // Find vowel positions with the new predicate
  const vowelPos: number[] = [];
  for (let i = 0; i < word.length; i++) if (isVowelAt(word, i)) vowelPos.push(i);
  if (vowelPos.length <= 1) return [[word, true]];

  const syllables: string[] = [];
  let start = 0;

  for (let i = 0; i < vowelPos.length - 1; i++) {
    const v1 = vowelPos[i];
    const v2 = vowelPos[i + 1];

    // consonant run boundaries
    let consStart = v1 + 1;
    let consEnd = v2;

    while (consStart < word.length && isVowelAt(word, consStart)) consStart++;
    while (consEnd > consStart && isVowelAt(word, consEnd - 1)) consEnd--;

    const consonants = word.slice(consStart, consEnd);

    // NEW: if no consonants and v1-v2 form diphthong/triphthong, merge nuclei: skip split
    if (consonants.length === 0 && formsDiphthong(word, v1, v2)) {
      continue; // do not set a boundary here; keep growing the syllable nucleus
    }

    let splitPoint: number;
    if (consonants.length === 0) splitPoint = v1 + 1;
    else if (consonants.length === 1) splitPoint = consStart;
    else if (consonants.length === 2) {
      splitPoint = (DIGRAPHS.has(consonants) || CLUSTERS.has(consonants)) ? consStart : consStart + 1;
    } else splitPoint = consStart + 1;

    syllables.push(word.slice(start, splitPoint));
    start = splitPoint;
  }
  syllables.push(word.slice(start));

  const tonicIndex = getTonicIndex(word, syllables);
  return syllables.map((s, i) => [s, i === tonicIndex]);
}

export function syllabifySentence(sentence: string): string[] {
  const words = sentence.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return [];

  const result: Array<[string, boolean]> = [];

  for (let i = 0; i < words.length; i++) {
    const sylls = syllabifyWord(words[i]); // [syll, isTonic][]
    if (sylls.length === 0) continue;

    const flat = sylls.map(([s]) => s);

    // sinalefa with previous syllable
    if (
      i > 0 &&
      result.length > 0 &&
      isVowelAt(result[result.length - 1][0].slice(-1).toLowerCase(), 0) &&
      startsWithVowelSound(flat[0])
    ) {
      const [lastSyll, lastIsTonic] = result.pop()!;
      const [firstSyll, firstIsTonic] = sylls[0];
      
      const lastChar = lastSyll.slice(-1).toLowerCase();
      const firstChar = firstSyll[0].toLowerCase();
      
      // Block sinalefa if either side has accented vowel
      if (!blocksSinalefa(lastChar, firstChar)) {
        let merged =
          lastSyll.toLowerCase() + (lastSyll.includes("_") ? "" : "_") + firstSyll.toLowerCase();
        const isTonic = lastIsTonic || firstIsTonic;

        if (merged.length >= 2 && merged[merged.length - 1] === merged[merged.length - 2]) {
          merged = merged.slice(0, -1);
        }
        result.push([isTonic ? merged.toUpperCase() : merged, isTonic]);

        for (let k = 1; k < sylls.length; k++) {
          const [s, t] = sylls[k];
          result.push([t ? s.toUpperCase() : s, t]);
        }
      } else {
        // No sinalefa due to accent blocking
        result.push([lastIsTonic ? lastSyll.toUpperCase() : lastSyll, lastIsTonic]);
        for (const [s, t] of sylls) result.push([t ? s.toUpperCase() : s, t]);
      }
    } else {
      for (const [s, t] of sylls) result.push([t ? s.toUpperCase() : s, t]);
    }
  }

  return result.map(([s]) => s);
}

// Example usage in a Next.js route or server util:
// const out = syllabifySentence("Yo nunca he vivido en un lugar así.");
// console.log(out);