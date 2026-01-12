import { proxyActivities } from '@temporalio/workflow';
import type * as activities from '../activities';
import { validateVocabularyContent } from '../activities/validate';

const { generateStructuredContent, saveGame } =
  proxyActivities<typeof activities>({
    startToCloseTimeout: '5 minutes',
    retry: {
      initialInterval: '1s',
      maximumAttempts: 3,
    },
  });

export interface GenerateVocabularyParams {
  theme: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  questionCount: number;
  createdBy?: string;
}

export async function generateVocabularyWorkflow(
  params: GenerateVocabularyParams
): Promise<{ gameId: string }> {
  const { theme, difficulty, questionCount, createdBy } = params;

  // Step 1: Generate content from OpenAI
  const systemPrompt = `You are a Spanish vocabulary expert creating ${difficulty}-level questions about ${theme} for Mexico City Spanish learners. Return JSON with a "questions" array.`;

  const userPrompt = `Generate ${questionCount} multiple-choice vocabulary questions about "${theme}" at ${difficulty} level.

Each question should have:
- question: The Spanish word or phrase to translate
- options: 4 possible English translations
- correct_answer: The correct English translation (must be one of the options)
- explanation: Why this is the correct answer and context for usage
- hint (optional): A helpful tip

Focus on Mexico City Spanish expressions and vocabulary.`;

  const content = await generateStructuredContent({
    type: 'vocabulary',
    prompt: userPrompt,
    systemPrompt,
    schema: null,
  });

  // Step 2: Validate the generated content
  const validation = validateVocabularyContent(content);

  if (!validation.valid) {
    throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
  }

  // Step 3: Save to database
  const result = await saveGame({
    type: 'vocabulary',
    difficulty,
    title: `${theme} Vocabulary`,
    description: `Learn ${theme} vocabulary in Mexico City Spanish`,
    content,
    created_by: createdBy,
  });

  return { gameId: result.id };
}
