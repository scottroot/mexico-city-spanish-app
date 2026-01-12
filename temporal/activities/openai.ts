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
