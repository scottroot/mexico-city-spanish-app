import { proxyActivities, workflowInfo } from '@temporalio/workflow';
import * as activities from '../activities';
import { validateStoryContent } from '../activities/validate';
import { getStoryPromptForLevel } from '../activities/stories/story-prompts';


const {
  generateMexicoCityContext,
  generateStructuredContent,
  enhanceText,
  generateTTS,
  combineAudio,
  generateImageLangchain,
  uploadAudio,
  uploadImage,
  saveStory,
  createTempDir,
} = proxyActivities<typeof activities>({
  startToCloseTimeout: '10 minutes',
  retry: {
    initialInterval: '1s',
    maximumAttempts: 3,
  },
});

interface StoryContent {
  title: string;
  reading_time: string;
  text: string;
}

export interface GenerateStoryParams {
  level: 'beginner' | 'high_beginner' | 'low_intermediate' | 'high_intermediate' | 'advanced' | 'proficient_near_native';
}

export async function generateStoryWorkflow(
  params: GenerateStoryParams
): Promise<{ storyId: string; slug: string }> {
  const { level } = params;

  // Get temp directory for file operations using workflow info
  const info = workflowInfo();
  const tempDir = `/tmp/${info.workflowId}/${info.runId}`;

  // Create temp directory once
  await createTempDir(tempDir);

  // Step 1: Get level-specific prompt with all requirements
  const basePrompt = getStoryPromptForLevel(level);

  // Step 2: Generate Mexico City context to incorporate into the story
  const mexicoCityContext = await generateMexicoCityContext({
    level,
    storyTheme: 'daily life',
  });

  // Step 3: Append Mexico City context to the base prompt
  const contextInstruction = `

IMPORTANT: Ground your story in Mexico City by naturally incorporating 1-2 of these elements (choose what fits the story best, don't force multiple):
- Locations: ${mexicoCityContext.landmarks.join(', ')}
- Neighborhoods: ${mexicoCityContext.neighborhoods.join(', ')}
- Cultural details: ${mexicoCityContext.cultural_elements.join(', ')}
- Events/Traditions: ${mexicoCityContext.traditions.join(', ')}, ${mexicoCityContext.local_events.join(', ')}

The story should feel like it naturally takes place in Mexico City, not like a tourist guide.`;

  const fullPrompt = basePrompt + contextInstruction;

  // Step 4: Generate story content from OpenAI
  const systemPrompt = `You generate Spanish learner stories. Respond with JSON only: {"title":"...","reading_time":"<int> min","text":"<title>\\n\\n<story>"}.`;

  const content = await generateStructuredContent<StoryContent>({
    type: 'story',
    prompt: fullPrompt,
    systemPrompt,
    schema: null,
  });

  // Step 5: Validate the generated content
  const validation = validateStoryContent(content);

  if (!validation.valid) {
    throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
  }

  // Step 6: Enhance text with ElevenLabs (adds audio tags)
  const enhancedText = await enhanceText(content.text);

  // Step 7: Generate TTS with ElevenLabs
  const ttsResult = await generateTTS({
    text: enhancedText,
    tempDir,
  });

  // Step 8: Combine audio chunks if needed
  const combinedResult = await combineAudio(ttsResult);

  // Step 9: Generate cover image and save to temp directory
  const { imageFile } = await generateImageLangchain({
    storyText: content.text,
    storyTitle: content.title,
    tempDir,
  });

  // Step 11: Create slug for file paths
  const slug = content.title
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  // Step 12: Upload audio to Supabase Storage (audio/{slug}.mp3)
  const audioUpload = await uploadAudio({
    filePath: combinedResult.audioFile,
    slug,
  });

  // Step 13: Upload image to Supabase Storage (featured-images/{slug}.png)
  const imageUpload = await uploadImage({
    filePath: imageFile,
    slug,
  });

  // Step 14: Save story to database with alignment data from local files
  const result = await saveStory({
    title: content.title,
    slug,
    text: content.text,
    level,
    readingTime: content.reading_time,
    enhancedText: enhancedText,
    audioUrl: audioUpload.publicUrl,
    featuredImageUrl: imageUpload.publicUrl,
    alignmentFile: combinedResult.alignmentFile,
    normalizedAlignmentFile: combinedResult.normalizedAlignmentFile,
  });

  return { storyId: result.id, slug: result.slug };
}
