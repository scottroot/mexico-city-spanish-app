import OpenAI from 'openai';
import { EVALUATION_PROMPT, BASE_PHRASE_PROMPT, } from './prompts';
import { DEFAULT_FOCUS } from './focus-areas';

if (!process.env.OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY is not set');
}
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY, });

export type TranslationDirection = 'es_to_en' | 'en_to_es';

export async function generateTranslationQuestion(
  customFocus: string = DEFAULT_FOCUS,
  direction: TranslationDirection = 'en_to_es',
  previousPhrases: string[] = []
): Promise<{
  questionId: string;
  phrase: string;
  tokenUsage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}> {  
  const previousPhrasesPrompt = previousPhrases.length > 0 
    ? `# Previous phrases already given in this quiz (do NOT repeat these):\n` +
      previousPhrases.map((phrase, index) => `${index + 1}. "${phrase}"`).join('\n') 
    : '';
  
  console.log(`\n\n****\nGenerating Translation Question:
    Custom Focus: ${customFocus.slice(0, 500)}
    Previous Phrases: ${previousPhrases.length > 0 ? previousPhrasesPrompt.replaceAll("\n", "; ") : 'None'}
    ****\n\n`
  );
  
  const start = Date.now();
  const completion = await openai.responses.create({
    prompt_cache_key: 'translation_question',
    model: 'gpt-4.1-mini',
    instructions: BASE_PHRASE_PROMPT,
    input: customFocus + "\n\n" + previousPhrasesPrompt,
  });
  const duration = Date.now() - start;
  console.log('Translation OpenAI call took', duration, 'ms');

  const phrase = completion?.output_text || "";
  if (!phrase) throw new Error('No response from OpenAI');
  
  const usage = completion.usage;

  return {
    questionId: '', // Will be set by the API route after saving to DB
    phrase,
    tokenUsage: {
      promptTokens: (usage as any)?.prompt_tokens || 0,
      completionTokens: (usage as any)?.completion_tokens || 0,
      totalTokens: (usage as any)?.total_tokens || 0,
    },
  };
}

/**
 * Evaluate a user's translation answer
 */
export async function evaluateTranslation(
  gptPhraseToTranslate: string,
  userTranslation: string,
  direction: TranslationDirection = 'en_to_es',
  streaming: boolean = false,
): Promise<{
  isCorrect: boolean;
  feedback: string;
  correctAnswer?: string;
  tokenUsage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}> {
  const userTranslationCapitalized = 
    userTranslation.charAt(0).toUpperCase() + userTranslation.slice(1);

  console.log(`\n\n****\nEvaluating Translation:
    English Phrase: ${gptPhraseToTranslate}
    Student's Translation: ${userTranslationCapitalized}
    ****\n\n`);

  const start = Date.now();
  const completion = await openai.responses.create({
    prompt_cache_key: 'translation_evaluation',
    model: 'gpt-5.1-chat-latest',
    // model: 'gpt-4.1-mini',
    instructions: EVALUATION_PROMPT,
    input: `English Phrase: ${gptPhraseToTranslate}\n` +
           `Student's Translation: ${userTranslationCapitalized}`,
    stream: false, // streaming,
  });
  const duration = Date.now() - start;
  console.log('Evaluation OpenAI call took', duration, 'ms');

  const content = completion?.output_text || "";
  if (!content) {
    throw new Error('No response from OpenAI');
  }

  const usage = completion.usage;

  // Parse the response - the prompt expects JSON format for evaluation
  let isCorrect: boolean;
  let feedback: string;
  let correctAnswer: string | undefined;

  try {
    // Try to parse as JSON (the prompt may return JSON format)
    const parsed = JSON.parse(content);
    if (parsed.isCorrect !== undefined) {
      isCorrect = parsed.isCorrect === true;
      feedback = parsed.feedback || '';
      correctAnswer = parsed.correctAnswer;
    } else {
      throw new Error('Not evaluation JSON format');
    }
  } catch {
    // Not JSON or wrong format - parse as text
    const responseText = content;
    
    // Check if there's JSON in the response (likely the next question) and remove it
    const jsonMatch = responseText.match(/\{[\s\S]*"phrase"[\s\S]*\}/);
    let evaluationText = responseText;
    if (jsonMatch) {
      // Remove the JSON part (next question) - keep only the evaluation
      evaluationText = responseText.substring(0, jsonMatch.index).trim();
    } 
    else {
      // Split at separator (⸻) or "Phrase" marker
      const separatorIndex = responseText.indexOf('⸻');
      const phraseIndex = responseText.search(/Phrase\s+\d+:/i);
      const evaluationEnd = separatorIndex !== -1 
        ? separatorIndex 
        : phraseIndex !== -1 
        ? phraseIndex 
        : responseText.length;
      evaluationText = responseText.substring(0, evaluationEnd).trim();
    }
    
    // Determine if answer is correct
    isCorrect = evaluationText.includes('✅') || 
      (!evaluationText.includes('❌') && evaluationText.toLowerCase().includes('correct'));
    
    // Extract correct answer if wrong
    if (!isCorrect) {
      // Look for the correct answer pattern: 👉 "correct answer" or bolded text
      const correctAnswerMatch = evaluationText.match(/👉\s*["']?([^"']+)["']?/);
      if (correctAnswerMatch) {
        correctAnswer = correctAnswerMatch[1].trim();
      } else {
        // Try to find bolded text (the words that were wrong)
        const boldMatch = evaluationText.match(/\*\*([^*]+)\*\*/);
        if (boldMatch) {
          correctAnswer = boldMatch[1].trim();
        }
      }
    }

    // The feedback is the evaluation text (without the next question)
    feedback = evaluationText;
  }

  return {
    isCorrect,
    feedback,
    correctAnswer,
    tokenUsage: {
      promptTokens: (usage as any)?.prompt_tokens || 0,
      completionTokens: (usage as any)?.completion_tokens || 0,
      totalTokens: (usage as any)?.total_tokens || 0,
    },
  };
}

