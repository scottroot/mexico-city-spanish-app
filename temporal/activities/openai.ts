import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface GenerateContentParams {
  type: 'vocabulary' | 'grammar' | 'story' | 'translation';
  prompt: string;
  systemPrompt?: string;
  model?: string;
}

export async function generateContent(params: GenerateContentParams): Promise<string> {
  const { prompt, systemPrompt, model = 'gpt-4o-mini' } = params;

  console.log(`Generating content for type: ${params.type}`);

  const response = await openai.chat.completions.create({
    model,
    messages: [
      ...(systemPrompt ? [{ role: 'system' as const, content: systemPrompt }] : []),
      { role: 'user' as const, content: prompt },
    ],
    temperature: 0.7,
  });

  const content = response.choices[0]?.message?.content;

  if (!content) {
    throw new Error('No content generated from OpenAI');
  }

  return content;
}

export async function generateStructuredContent<T>(
  params: GenerateContentParams & { schema: any }
): Promise<T> {
  const { prompt, systemPrompt, schema, model = 'gpt-4o-mini' } = params;

  console.log(`Generating structured content for type: ${params.type}`);

  const response = await openai.chat.completions.create({
    model,
    messages: [
      ...(systemPrompt ? [{ role: 'system' as const, content: systemPrompt }] : []),
      { role: 'user' as const, content: prompt },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.7,
  });

  const content = response.choices[0]?.message?.content;

  if (!content) {
    throw new Error('No content generated from OpenAI');
  }

  return JSON.parse(content) as T;
}

export interface GenerateMexicoCityContextParams {
  level: string;
  storyTheme: string;
}

export interface MexicoCityContext {
  landmarks: string[];
  traditions: string[];
  local_events: string[];
  neighborhoods: string[];
  cultural_elements: string[];
}

export async function generateMexicoCityContext(
  params: GenerateMexicoCityContextParams
): Promise<MexicoCityContext> {
  const { level, storyTheme } = params;

  console.log(`Generating Mexico City context for level: ${level}`);

  const systemPrompt = `You are a Mexico City cultural expert. Generate authentic Mexico City landmarks, traditions, events, neighborhoods, and cultural elements that would fit naturally into a Spanish learning story.`;

  const userPrompt = `For a ${level} level Spanish story about "${storyTheme}", suggest Mexico City elements that could make the story feel authentic and grounded in place:

Return JSON with:
- landmarks: 2-3 specific locations (parks, plazas, buildings, metro stations)
- traditions: 1-2 local customs or cultural practices
- local_events: 1-2 everyday activities or occasional events
- neighborhoods: 1-2 specific colonias that fit the theme
- cultural_elements: 2-3 subtle details (food, slang, transportation, daily life)

These are OPTIONS for the story - it should only use 1-2 elements total, not all of them.`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.7,
  });

  const content = response.choices[0]?.message?.content;

  if (!content) {
    throw new Error('No Mexico City context generated from OpenAI');
  }

  return JSON.parse(content) as MexicoCityContext;
}
