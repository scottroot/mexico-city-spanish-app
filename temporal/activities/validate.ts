export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export interface VocabularyQuestion {
  question: string;
  options: string[];
  correct_answer: string;
  explanation: string;
  hint?: string;
}

export interface GrammarQuestion {
  sentence: string;
  blank_position: number;
  options: string[];
  correct_answer: string;
  explanation: string;
}

export function validateVocabularyContent(content: any): ValidationResult {
  const errors: string[] = [];

  if (!Array.isArray(content.questions)) {
    errors.push('Content must have a questions array');
    return { valid: false, errors };
  }

  content.questions.forEach((q: VocabularyQuestion, index: number) => {
    if (!q.question || typeof q.question !== 'string') {
      errors.push(`Question ${index + 1}: Missing or invalid question text`);
    }
    if (!Array.isArray(q.options) || q.options.length < 2) {
      errors.push(`Question ${index + 1}: Must have at least 2 options`);
    }
    if (!q.correct_answer || typeof q.correct_answer !== 'string') {
      errors.push(`Question ${index + 1}: Missing correct_answer`);
    }
    if (!q.explanation || typeof q.explanation !== 'string') {
      errors.push(`Question ${index + 1}: Missing explanation`);
    }
    if (q.options && !q.options.includes(q.correct_answer)) {
      errors.push(`Question ${index + 1}: correct_answer not in options`);
    }
  });

  return { valid: errors.length === 0, errors };
}

export function validateGrammarContent(content: any): ValidationResult {
  const errors: string[] = [];

  if (!Array.isArray(content.questions)) {
    errors.push('Content must have a questions array');
    return { valid: false, errors };
  }

  content.questions.forEach((q: GrammarQuestion, index: number) => {
    if (!q.sentence || typeof q.sentence !== 'string') {
      errors.push(`Question ${index + 1}: Missing or invalid sentence`);
    }
    if (typeof q.blank_position !== 'number') {
      errors.push(`Question ${index + 1}: Missing blank_position`);
    }
    if (!Array.isArray(q.options) || q.options.length < 2) {
      errors.push(`Question ${index + 1}: Must have at least 2 options`);
    }
    if (!q.correct_answer || typeof q.correct_answer !== 'string') {
      errors.push(`Question ${index + 1}: Missing correct_answer`);
    }
    if (!q.explanation || typeof q.explanation !== 'string') {
      errors.push(`Question ${index + 1}: Missing explanation`);
    }
  });

  return { valid: errors.length === 0, errors };
}

export function validateStoryContent(content: any): ValidationResult {
  const errors: string[] = [];

  if (!content.text || typeof content.text !== 'string') {
    errors.push('Story must have a text field');
  }

  if (!content.title || typeof content.title !== 'string') {
    errors.push('Story must have a title');
  }

  if (content.text && content.text.length < 100) {
    errors.push('Story text must be at least 100 characters');
  }

  return { valid: errors.length === 0, errors };
}
