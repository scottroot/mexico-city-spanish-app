import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const IMAGE_GENERATION_PROMPT = `Generate a featured image for this story. Do not include any text in the image. The style is a busy, full-color illustration style by Stephen Cartwright with large, detailed scenes filled with lots of objects for children to spot, learn, and discuss.`;

export interface GenerateImageParams {
  storyText: string;
  storyTitle: string;
}

export interface GenerateImageResult {
  imageUrl: string;
  revisedPrompt?: string;
}

export async function generateStoryImage(params: GenerateImageParams): Promise<GenerateImageResult> {
  const { storyText, storyTitle } = params;

  console.log(`Generating image for story: ${storyTitle}`);

  const prompt = `${IMAGE_GENERATION_PROMPT}\n\n${storyText}`;

  const response = await openai.images.generate({
    model: 'dall-e-3',
    prompt: prompt.substring(0, 4000), // DALL-E has prompt length limits
    size: '1024x1024',
    quality: 'standard',
    n: 1,
  });

  if (!response.data || response.data.length === 0) {
    throw new Error('No image data returned from DALL-E');
  }

  const imageUrl = response.data[0]?.url;
  const revisedPrompt = response.data[0]?.revised_prompt;

  if (!imageUrl) {
    throw new Error('No image URL returned from DALL-E');
  }

  console.log('Image generated successfully');

  return {
    imageUrl,
    revisedPrompt,
  };
}

export async function downloadImage(url: string): Promise<Buffer> {
  console.log('Downloading image from:', url);

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to download image: ${response.statusText}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}
