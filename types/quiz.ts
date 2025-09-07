// Quiz Types for Custom Quiz Feature

export interface QuizConfig {
  selectedTenses: string[];
  selectedMoods: string[];
  verbSelection: 'favorites' | 'custom';
  customVerbs: string[];
  questionCount: number;
}

export interface QuizQuestion {
  id: string;
  englishPhrase: string;
  tense: string;
  mood: string;
  tenseEnglish: string;
  moodEnglish: string;
  infinitive: string;
  infinitiveEnglish: string;
  correctAnswer: string;
  pronoun: string;
  pronounEnglish: string;
  explanation?: string;
}

export interface QuizResult {
  score: number;
  totalQuestions: number;
  mistakes: number;
  completionTime: number;
  questions: QuizQuestion[];
  userAnswers: string[];
  correctAnswers: boolean[];
}

export interface QuizSession {
  config: QuizConfig;
  questions: QuizQuestion[];
  currentQuestionIndex: number;
  userAnswers: string[];
  startTime: number;
  isCompleted: boolean;
}

export interface TenseOption {
  value: string;
  label: string;
  labelEnglish: string;
  mood: string;
  moodEnglish: string;
}

export interface VerbOption {
  infinitive: string;
  infinitiveEnglish: string;
  isFavorite?: boolean;
}

export interface QuestionCountOption {
  value: number;
  label: string;
}
