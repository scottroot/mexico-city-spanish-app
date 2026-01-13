import { NextRequest, NextResponse } from 'next/server';
import { getTemporalClient } from '@/utils/temporal-client';
import { createClient } from '@/utils/supabase/server';


const VALID_LEVELS = [
  'beginner',
  'high_beginner',
  'low_intermediate',
  'high_intermediate',
  'advanced',
  'proficient_near_native',
] as const;

async function getLevelWithFewestStories(): Promise<string> {
  const supabase = await createClient();

  // Get count of stories per level
  const { data: stories, error } = await supabase
    .from('stories')
    .select('level');

  if (error) {
    console.error('Error fetching stories:', error);
    // Default to beginner if query fails
    return 'beginner';
  }

  // Count stories per level
  const levelCounts: Record<string, number> = {};
  VALID_LEVELS.forEach((level) => {
    levelCounts[level] = 0;
  });

  stories?.forEach((story) => {
    if (story.level && levelCounts[story.level] !== undefined) {
      levelCounts[story.level]++;
    }
  });

  // Find level with minimum count
  let minLevel: (typeof VALID_LEVELS)[number] = VALID_LEVELS[0];
  let minCount = levelCounts[minLevel];

  VALID_LEVELS.forEach((level) => {
    if (levelCounts[level] < minCount) {
      minCount = levelCounts[level];
      minLevel = level;
    }
  });

  console.log('Story counts by level:', levelCounts);
  console.log(`Selected level: ${minLevel} (${minCount} stories)`);

  return minLevel;
}


export async function GET(req: NextRequest) {
  if (process.env.NODE_ENV !== 'development' && req.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    // Find which level needs more stories
    // TODO: remove hardcoding
    // const level = await getLevelWithFewestStories();
    const level = 'high_beginner';

    const client = await getTemporalClient();

    // Start workflow but DON'T await result
    const handle = await client.workflow.start('generateStoryWorkflow', {
      taskQueue: 'content-generation',
      workflowId: `story-${level}-${Date.now()}`,
      args: [{ level }],
    });

    console.log(`Story generation started for ${level}:`, handle.workflowId);

    // Return immediately - workflow will pause at approval step
    return NextResponse.json({
      workflowId: handle.workflowId,
      level,
      status: 'started',
    });
  } catch (error) {
    console.error('Error starting story generation:', error);
    return NextResponse.json(
      { error: 'Failed to start story generation' },
      { status: 500 }
    );
  }
}
