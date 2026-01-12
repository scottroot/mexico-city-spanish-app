import { proxyActivities } from '@temporalio/workflow';
import type * as activities from '../activities';

const { generateStructuredContent, validateStoryContent, saveStory } =
  proxyActivities<typeof activities>({
    startToCloseTimeout: '5 minutes',
    retry: {
      initialInterval: '1s',
      maximumAttempts: 3,
    },
  });

export interface GenerateStoryParams {
  theme: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  wordCount: number;
  createdBy?: string;
}

export async function generateStoryWorkflow(
  params: GenerateStoryParams
): Promise<{ storyId: string }> {
  const { theme, difficulty, wordCount, createdBy } = params;

  // Step 1: Generate story content from OpenAI
  const systemPrompt = `You are a creative writer specializing in Spanish language learning stories set in Mexico City. Write at ${difficulty} level. Return JSON with "title" and "text" fields.`;

  const userPrompt = `Write a ${wordCount}-word story in Spanish about "${theme}" set in Mexico City.

Requirements:
- Level: ${difficulty}
- Use Mexico City Spanish expressions and cultural references
- Include dialogue if appropriate
- Make it engaging and educational
- Return JSON: { "title": "...", "text": "..." }`;

  const content = await generateStructuredContent({
    type: 'story',
    prompt: userPrompt,
    systemPrompt,
    schema: null,
  });

  // Step 2: Validate the generated content
  const validation = await validateStoryContent(content);

  if (!validation.valid) {
    throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
  }

  // Step 3: Save to database
  const result = await saveStory({
    title: content.title,
    content: content.text,
    difficulty,
    created_by: createdBy,
  });

  return { storyId: result.id };
}
