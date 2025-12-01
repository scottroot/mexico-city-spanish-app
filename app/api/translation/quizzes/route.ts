import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { getUser } from '@/utils/supabase/auth';
import OpenAI from 'openai';
import { focusAreas } from '@/app/game/translation/focus-areas';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/**
 * Generate a short 2-5 word display name for custom focus text using AI
 * Returns null on error to allow graceful fallback to truncation
 */
async function generateFocusDisplayName(customText: string): Promise<string | null> {
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant that creates short, catchy 2-5 word names for quiz topics. Respond with ONLY the name, no extra text.',
        },
        {
          role: 'user',
          content: `Create a brief 2-5 word display name for this quiz focus:\n\n${customText}`,
        },
      ],
      temperature: 0.5,
      max_tokens: 20,
    });

    const displayName = completion.choices[0]?.message?.content?.trim();

    if (!displayName) return null;

    // Ensure it's not too long (max 40 chars)
    return displayName.length > 40 ? displayName.substring(0, 40) : displayName;
  } catch (error) {
    console.error('Error generating focus display name:', error);
    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const supabase = await createClient();
    const { error: userError, ...user } = await getUser();
    if (userError || !user.isLoggedIn) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Get user's past quizzes (metadata only)
    const { data: quizzes, error } = await supabase
      .from('translation_quizzes')
      .select('id, custom_focus, translation_direction, questions_count, score, completed, created_at, study_guide, mistakes_count, focus_display_name')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(50); // Limit to most recent 50 quizzes

    if (error) {
      console.error('Error fetching quizzes:', error);
      return NextResponse.json(
        { error: 'Failed to fetch quizzes' },
        { status: 500 }
      );
    }

    return NextResponse.json({ quizzes: quizzes || [] });
  } catch (error) {
    console.error('Error in GET /api/translation/quizzes:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch quizzes' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const supabase = await createClient();
    const { error: userError, ...user } = await getUser();
    if (userError || !user.isLoggedIn) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { customFocus, translationDirection } = body;

    // Generate display name for focus area
    let focusDisplayName: string | null = null;

    if (customFocus) {
      // Check if it's a predefined focus area
      const predefinedFocus = focusAreas.find(fa => fa.prompt === customFocus);

      if (predefinedFocus) {
        // Use preset name for predefined focus
        focusDisplayName = predefinedFocus.name;
      } else {
        // Generate AI display name for custom text
        focusDisplayName = await generateFocusDisplayName(customFocus);
      }
    }

    // Create a new quiz session
    const { data: quiz, error } = await supabase
      .from('translation_quizzes')
      .insert({
        user_id: user.id,
        custom_focus: customFocus || null,
        focus_display_name: focusDisplayName,
        translation_direction: translationDirection || 'es_to_en',
        questions_count: 0,
        score: 0,
        completed: false,
      })
      .select('id')
      .single();

    if (error) {
      console.error('Error creating quiz:', error);
      return NextResponse.json(
        { error: 'Failed to create quiz' },
        { status: 500 }
      );
    }

    return NextResponse.json({ quizId: quiz.id });
  } catch (error) {
    console.error('Error in POST /api/translation/quizzes:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create quiz' },
      { status: 500 }
    );
  }
}

