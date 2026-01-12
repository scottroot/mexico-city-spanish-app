import { ChatOpenAI } from '@langchain/openai';
import { PromptTemplate } from '@langchain/core/prompts';
import { z } from 'zod';
import { getStoryPromptForLevel } from './story-prompts';
// Import types from openai.ts to avoid duplicate exports
import type { MexicoCityContext, GenerateMexicoCityContextParams } from '../openai';

const llm = new ChatOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  model: 'gpt-4o-2024-08-06', // Must use a model that supports structured outputs
  temperature: 0.7,
});

// Zod schemas for type-safe structured outputs
const MexicoCityContextSchema = z.object({
  landmarks: z.array(z.string()).min(2).max(3),
  traditions: z.array(z.string()).min(1).max(2),
  local_events: z.array(z.string()).min(1).max(2),
  neighborhoods: z.array(z.string()).min(1).max(2),
  cultural_elements: z.array(z.string()).min(2).max(3),
});

const StoryContentSchema = z.object({
  title: z.string().min(1),
  reading_time: z.string().regex(/^\d+ min$/),
  text: z.string().min(100),
});

export type StoryContent = z.infer<typeof StoryContentSchema>;

// Prompt templates
const mexicoCityContextTemplate = PromptTemplate.fromTemplate(`
You are a Mexico City cultural expert. Generate authentic Mexico City landmarks, traditions, events, neighborhoods, and cultural elements that would fit naturally into a Spanish learning story.

For a {level} level Spanish story about "{storyTheme}", suggest Mexico City elements that could make the story feel authentic and grounded in place:

Return JSON with:
- landmarks: 2-3 specific locations (parks, plazas, buildings, metro stations)
- traditions: 1-2 local customs or cultural practices
- local_events: 1-2 everyday activities or occasional events
- neighborhoods: 1-2 specific colonias that fit the theme
- cultural_elements: 2-3 subtle details (food, slang, transportation, daily life)

These are OPTIONS for the story - it should only use 1-2 elements total, not all of them.
`);

export async function generateMexicoCityContextLangChain(
  params: GenerateMexicoCityContextParams
): Promise<MexicoCityContext> {
  const { level, storyTheme } = params;

  console.log(`Generating Mexico City context for level: ${level}`);

  // Format the prompt
  const prompt = await mexicoCityContextTemplate.format({
    level,
    storyTheme,
  });

  // Create structured output LLM with proper options
  // Type assertion needed to bypass TypeScript's deep type inference
  const structuredLlm = (llm.withStructuredOutput as any)(
    MexicoCityContextSchema,
    {
      name: "generate_mexico_city_context",
      strict: true,
    }
  );

  // Invoke with message array - LangChain handles validation with Zod
  // Type assertion needed due to TypeScript's deep type inference limitations
  const result = (await structuredLlm.invoke([
    { role: "user", content: prompt }
  ])) as MexicoCityContext;

  console.log('Mexico City context generated:', result);
  return result;
}

export interface GenerateStoryParams {
  level: string;
  mexicoCityContext: MexicoCityContext;
}

export async function generateStoryLangChain(
  params: GenerateStoryParams
): Promise<StoryContent> {
  const { level, mexicoCityContext } = params;

  console.log(`Generating story for level: ${level}`);

  // Get level-specific prompt
  const basePrompt = getStoryPromptForLevel(level);

  // Append Mexico City context
  const contextInstruction = `

IMPORTANT: Ground your story in Mexico City by naturally incorporating 1-2 of these elements (choose what fits the story best, don't force multiple):
- Locations: ${mexicoCityContext.landmarks.join(', ')}
- Neighborhoods: ${mexicoCityContext.neighborhoods.join(', ')}
- Cultural details: ${mexicoCityContext.cultural_elements.join(', ')}
- Events/Traditions: ${mexicoCityContext.traditions.join(', ')}, ${mexicoCityContext.local_events.join(', ')}

The story should feel like it naturally takes place in Mexico City, not like a tourist guide.`;

  const fullPrompt = basePrompt + contextInstruction;

  // Create structured output LLM with proper options
  // Type assertion needed to bypass TypeScript's deep type inference
  const structuredLlm = (llm.withStructuredOutput as any)(
    StoryContentSchema,
    {
      name: "generate_story_content",
      strict: true,
    }
  );

  // Invoke with message array - LangChain handles validation with Zod
  // Type assertion needed due to TypeScript's deep type inference limitations
  const result = (await structuredLlm.invoke([
    { role: "user", content: fullPrompt }
  ])) as StoryContent;

  console.log('Story generated:', result.title);
  return result;
}

// Alternative: Use RunnableSequence for chaining both steps
import { RunnableSequence } from '@langchain/core/runnables';

export async function generateStoryWithContextChain(params: {
  level: string;
}): Promise<{ context: MexicoCityContext; story: StoryContent }> {
  const { level } = params;

  // Step 1: Generate context
  const context = await generateMexicoCityContextLangChain({
    level,
    storyTheme: 'daily life',
  });

  // Step 2: Generate story with context
  const story = await generateStoryLangChain({
    level,
    mexicoCityContext: context,
  });

  return { context, story };
}
