import { proxyActivities, workflowInfo } from '@temporalio/workflow';
import * as activities from '../activities';
import { validateStoryContent } from '../activities/validate';


const {
  generateStoryWithContext,
  generateStorySummary,
  enhanceText,
  generateTTS,
  combineAudio,
  generateImageLangchain,
  uploadAudio,
  uploadImage,
  saveStory,
  createTempDir,
  getRecentStoryTitles,
} = proxyActivities<typeof activities>({
  startToCloseTimeout: '10 minutes',
  retry: {
    initialInterval: '1s',
    maximumAttempts: 3,
  },
});

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

  // Step 1: Get recent story titles to avoid duplicates
  const recentTitles = await getRecentStoryTitles({ level, limit: 50 });

  // Step 2: Generate story content with Mexico City context
  const { story } = await generateStoryWithContext({
    level,
    recentTitles,
  });

  // Step 3: Validate the generated content
  const validation = validateStoryContent(story);

  if (!validation.valid) {
    throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
  }

  // Step 4: Generate summary
  const summary = await generateStorySummary({
    storyText: story.text,
    storyTitle: story.title,
  });

  // Step 5: Enhance text with ElevenLabs (adds audio tags)
  const enhancedText = await enhanceText(story.text);

  // Step 6: Generate TTS with ElevenLabs
  const ttsResult = await generateTTS({
    text: enhancedText,
    tempDir,
  });

  // Step 7: Combine audio chunks if needed
  const combinedResult = await combineAudio(ttsResult);

  // Step 8: Generate cover image and save to temp directory
  const { imageFile } = await generateImageLangchain({
    storyText: story.text,
    storyTitle: story.title,
    tempDir,
  });

  // Step 9: Create slug for file paths
  const slug = story.title
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  // Step 10: Upload audio to Supabase Storage (audio/{slug}.mp3)
  const audioUpload = await uploadAudio({
    filePath: combinedResult.audioFile,
    slug,
  });

  // Step 11: Upload image to Supabase Storage (featured-images/{slug}.png)
  const imageUpload = await uploadImage({
    filePath: imageFile,
    slug,
  });

  // Step 12: Save story to database with alignment data from local files
  const result = await saveStory({
    title: story.title,
    slug,
    text: story.text,
    level,
    readingTime: story.reading_time,
    enhancedText: enhancedText,
    audioUrl: audioUpload.publicUrl,
    featuredImageUrl: imageUpload.publicUrl,
    alignmentFile: combinedResult.alignmentFile,
    normalizedAlignmentFile: combinedResult.normalizedAlignmentFile,
    summaryEnglish: summary,
  });

  return { storyId: result.id, slug: result.slug };
}
