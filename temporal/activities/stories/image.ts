import { promises as fs } from 'fs';
import { join } from 'path';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { HumanMessage } from '@langchain/core/messages';
import { exists } from './utils';

const IMAGE_GENERATION_PROMPT = `Generate a featured image for this story. Do not include any text in the image. The style is a busy, full-color illustration style by Stephen Cartwright with large, detailed scenes filled with lots of objects for children to spot, learn, and discuss. Important: full image with no borders, no frames, no signatures, no text.`;

/**
 * Function uses Langchain with Gemini to generate an image.
 * @param params - Parameters for image generation
 * @returns Object with imageUrl (data URL) of the generated image
 */
export async function generateImageLangchain(params: {
  storyText: string;
  storyTitle: string;
  tempDir: string;
}): Promise<{
  imageFile: string;
}> {
  const { storyText, storyTitle, tempDir } = params;

  // Create a deterministic filename based on the story title
  const imageFilePath = join(tempDir, 'featured.png');

  // Check if the image already exists
  if (await exists(imageFilePath)) {
    console.log(`Image already exists for story "${storyTitle}", returning existing file: ${imageFilePath}`);
    return {
      imageFile: imageFilePath,
    };
  }

  if (!process.env.GOOGLE_API_KEY) {
    throw new Error('GOOGLE_API_KEY environment variable is not set');
  }

  console.log(`Generating image with Gemini for story: ${storyTitle}`);

  const model = new ChatGoogleGenerativeAI({
    // model: 'gemini-2.5-flash-image', // Use image generation capable model
    model: 'gemini-3-pro-image-preview',
    maxOutputTokens: 2048,
  });

  // Create the prompt
  const prompt = `${IMAGE_GENERATION_PROMPT}\n\n${storyTitle}\n\n${storyText}`;

  // Create message
  const message = new HumanMessage({
    content: [
      {
        type: 'text',
        text: prompt,
      },
    ],
  });

  // Generate image with response modalities to ensure image generation
  const response = await model.invoke([message], {
    generationConfig: {
      responseModalities: ['TEXT', 'IMAGE'],
    },
  } as any);

  // Extract image from Langchain response structure
  // Langchain returns: response.content = [{ type: "inlineData", inlineData: { mimeType: "image/png", data: "base64..." } }]
  let imageDataUrl: string | undefined;

  if (Array.isArray(response.content)) {
    for (const block of response.content) {
      if (block && typeof block === 'object') {
        const blockAny = block as any;
        
        // Langchain structure: block with type "inlineData" and inlineData.data
        if (blockAny.type === 'inlineData' && blockAny.inlineData) {
          const inlineData = blockAny.inlineData;
          if (inlineData.data) {
            const mimeType = inlineData.mimeType || inlineData.mime_type || 'image/png';
            imageDataUrl = `data:${mimeType};base64,${inlineData.data}`;
            break;
          }
        }
      }
    }
  }

  if (!imageDataUrl) {
    // Debug: log the response structure to help troubleshoot
    console.error('Langchain response structure:', JSON.stringify(response, null, 2));
    if ((response as any).response_metadata) {
      console.error('Raw response metadata:', JSON.stringify((response as any).response_metadata, null, 2));
    }
    throw new Error('No image data found in Langchain/Gemini response. Check the logged response structure.');
  }

  console.log('Image extracted successfully, data URL length:', imageDataUrl.length);

  const imageFile = await downloadImage(imageDataUrl, tempDir);
  return {
    imageFile,
  };
}

export async function downloadImage(urlOrPath: string, tempDir: string): Promise<string> {
  // Handle data URLs
  if (urlOrPath.startsWith('data:')) {
    const base64Data = urlOrPath.split(',')[1];
    const imageBuffer = Buffer.from(base64Data, 'base64');
    const outFile = join(tempDir, 'featured.png');
    await fs.writeFile(outFile, imageBuffer);
    return outFile;
  }

  // Handle HTTP/HTTPS URLs
  const response = await fetch(urlOrPath);

  if (!response.ok) {
    throw new Error(`Failed to download image: ${response.statusText}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  const outFile = join(tempDir, 'featured.png');
  await fs.writeFile(outFile, Buffer.from(arrayBuffer));
  return outFile;
}
