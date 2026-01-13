import OpenAI from 'openai';
import { promises as fs } from 'fs';
import { join } from 'path';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { HumanMessage } from '@langchain/core/messages';
import { exists } from './utils';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const IMAGE_GENERATION_PROMPT = `Generate a featured image for this story. Do not include any text in the image. The style is a busy, full-color illustration style by Stephen Cartwright with large, detailed scenes filled with lots of objects for children to spot, learn, and discuss....`;

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
    model: 'gemini-2.5-flash-image', // Use image generation capable model
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

  // // Fallback: Try to access raw response metadata if Langchain exposes it
  // if (!imageDataUrl) {
  //   const responseAny = response as any;
    
  //   // Check response_metadata for raw response
  //   if (responseAny.response_metadata) {
  //     const rawResponse = responseAny.response_metadata;
      
  //     // Try native Gemini structure in raw response
  //     if (rawResponse.candidates && Array.isArray(rawResponse.candidates) && rawResponse.candidates.length > 0) {
  //       const candidate = rawResponse.candidates[0];
  //       if (candidate.content && candidate.content.parts && Array.isArray(candidate.content.parts)) {
  //         for (const part of candidate.content.parts) {
  //           if (part.inlineData && part.inlineData.data) {
  //             const mimeType = part.inlineData.mimeType || part.inlineData.mime_type || 'image/png';
  //             imageDataUrl = `data:${mimeType};base64,${part.inlineData.data}`;
  //             break;
  //           }
  //           if (part.inline_data && part.inline_data.data) {
  //             const mimeType = part.inline_data.mimeType || part.inline_data.mime_type || 'image/png';
  //             imageDataUrl = `data:${mimeType};base64,${part.inline_data.data}`;
  //             break;
  //           }
  //         }
  //       }
  //     }
  //   }
  // }

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

export async function generateStoryImage(params: {
  storyText: string; storyTitle: string;
}): Promise<{ imageUrl: string; }> {
  const { storyText, storyTitle } = params;

  console.log(`Generating image for story: ${storyTitle}`);

  const prompt = `${IMAGE_GENERATION_PROMPT}\n\n${storyTitle}\n\n${storyText}`;

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
  console.log('Revised image prompt:', revisedPrompt);

  if (!imageUrl) {
    throw new Error('No image URL returned from DALL-E');
  }

  console.log('Image generated successfully');

  return {
    imageUrl,
    // revisedPrompt,
  };
}

export async function downloadImage(urlOrPath: string, tempDir: string): Promise<string> {
  // // If it's already a file path, just return it
  // if (!urlOrPath.startsWith('http://') && !urlOrPath.startsWith('https://') && !urlOrPath.startsWith('data:')) {
  //   console.log('Image is already a local file:', urlOrPath);
  //   return urlOrPath;
  // }

  // console.log('Downloading image from:', urlOrPath);

  // Ensure the temp directory exists
  await fs.mkdir(tempDir, { recursive: true });

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
