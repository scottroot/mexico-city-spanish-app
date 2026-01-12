import { proxyActivities } from '@temporalio/workflow';
import type * as activities from '../activities';

const { generateStructuredContent, validateGrammarContent, saveGame } =
  proxyActivities<typeof activities>({
    startToCloseTimeout: '5 minutes',
    retry: {
      initialInterval: '1s',
      maximumAttempts: 3,
    },
  });

export interface GenerateGrammarParams {
  topic: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  questionCount: number;
  createdBy?: string;
}

export async function generateGrammarWorkflow(
  params: GenerateGrammarParams
): Promise<{ gameId: string }> {
  const { topic, difficulty, questionCount, createdBy } = params;

  // Step 1: Generate content from OpenAI
  const systemPrompt = `You are a Spanish grammar expert creating ${difficulty}-level exercises about ${topic}. Return JSON with a "questions" array.`;

  const userPrompt = `Generate ${questionCount} fill-in-the-blank grammar questions about "${topic}" at ${difficulty} level.

Each question should have:
- sentence: A Spanish sentence with a blank (use ___ to indicate the blank)
- blank_position: The index of the blank word in the sentence (0-based)
- options: 4 possible words/phrases to fill the blank
- correct_answer: The correct option (must be one of the options)
- explanation: Grammar rule explanation

Focus on common grammar challenges for English speakers learning Mexico City Spanish.`;

  const content = await generateStructuredContent({
    type: 'grammar',
    prompt: userPrompt,
    systemPrompt,
    schema: null,
  });

  // Step 2: Validate the generated content
  const validation = await validateGrammarContent(content);

  if (!validation.valid) {
    throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
  }

  // Step 3: Save to database
  const result = await saveGame({
    type: 'grammar',
    difficulty,
    title: `${topic} Grammar`,
    description: `Practice ${topic} in Mexican Spanish`,
    content,
    created_by: createdBy,
  });

  return { gameId: result.id };
}
