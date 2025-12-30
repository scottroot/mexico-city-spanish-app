export interface UserData {
  isLoggedIn: boolean
  id: string | undefined
  name: string | undefined
  email: string | undefined
  emailVerified: boolean | undefined
  tier: "free" | "premium" | "pro"
  error?: string
}

export interface GameContent {
  questions: Array<{
    question?: string
    instruction?: string
    sentence?: string
    type?: string
    phrase?: string
    options?: string[]
    correct_answer: string
    hint?: string
    explanation?: string
    image?: string
  }>
}

/**
 * Game data interface
 * @interface GameData
 * @property {string} id - The game ID
 * @property {string} title - The game title
 * @property {string} type - The game type
 * @property {string} difficulty - The game difficulty
 * @property {GameContent} content - The game content
 */
export interface GameData {
  id: string
  title: string
  type: string
  difficulty: string
  content: GameContent
  created_at?: string
  updated_at?: string
  image_url?: string
}

export interface GameProps {
  game: GameData
  user: UserData
}

export interface Verb {
  infinitive: string;
  infinitive_english: string;
  conjugations: VerbConjugation[];
}

export interface VerbConjugation {
  infinitive: string;
  infinitive_english: string;
  mood: string;
  mood_english: string;
  tense: string;
  tense_english: string;
  verb_english: string;
  form_1s: string;
  form_2s: string;
  form_3s: string;
  form_1p: string;
  form_2p: string;
  form_3p: string;
  gerund: string;
  gerund_english: string;
  pastparticiple: string;
  pastparticiple_english: string;
}
