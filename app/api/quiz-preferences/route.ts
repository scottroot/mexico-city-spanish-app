import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { QuizConfig } from '@/types/quiz';
import { getUser } from '@/utils/supabase/auth';

// GET - Load user's quiz preferences
export async function GET() {
  try {
    const supabase = await createClient();
    
    // Get current user
    const { error, ...user } = await getUser();
    if (error || !user.isLoggedIn) {
      return NextResponse.json(
        { error: 'User not authenticated' },
        { status: 401 }
      );
    }
    
    // Get user's quiz preferences
    const { data: preferences, error: preferencesError } = await supabase
      .from('user_quiz_preferences')
      .select('*')
      .eq('user_id', user.id)
      .single();
    
    if (preferencesError && preferencesError.code !== 'PGRST116') {
      // PGRST116 is "not found" error, which is fine for new users
      console.error('Error loading quiz preferences:', preferencesError);
      return NextResponse.json(
        { error: 'Failed to load quiz preferences' },
        { status: 500 }
      );
    }
    
    // If no preferences found, return default config
    if (!preferences) {
      const defaultConfig: QuizConfig = {
        selectedTenseMoods: [],
        verbSelection: 'favorites',
        customVerbs: [],
        selectedPronouns: ['yo', 'tú', 'él', 'nosotros', 'ustedes', 'ellos'],
        questionCount: 10
      };
      return NextResponse.json({ config: defaultConfig });
    }
    
    // Convert database format to QuizConfig format
    const config: QuizConfig = {
      selectedTenseMoods: preferences.selected_tense_moods || [],
      verbSelection: preferences.verb_selection || 'favorites',
      customVerbs: preferences.custom_verbs || [],
      presetGroupId: preferences.preset_group_id,
      selectedPronouns: preferences.selected_pronouns || ['yo', 'tú', 'él', 'nosotros', 'ustedes'],
      questionCount: preferences.question_count || 10
    };
    
    return NextResponse.json({ config });
  } catch (error) {
    console.error('Error in GET /api/quiz-preferences:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Save user's quiz preferences
export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    
    // Get current user
    const { error: userError, ...user } = await getUser();
    if (userError || !user.isLoggedIn) {
      return NextResponse.json(
        { error: 'User not authenticated' },
        { status: 401 }
      );
    }
    
    // Parse request body
    const config: QuizConfig = await request.json();
    
    // Validate the config
    if (!config.selectedTenseMoods || !Array.isArray(config.selectedTenseMoods)) {
      return NextResponse.json(
        { error: 'Invalid selectedTenseMoods' },
        { status: 400 }
      );
    }
    
    if (!config.verbSelection || !['favorites', 'preset', 'custom'].includes(config.verbSelection)) {
      return NextResponse.json(
        { error: 'Invalid verbSelection' },
        { status: 400 }
      );
    }
    
    if (!config.customVerbs || !Array.isArray(config.customVerbs)) {
      return NextResponse.json(
        { error: 'Invalid customVerbs' },
        { status: 400 }
      );
    }
    
    if (!config.selectedPronouns || !Array.isArray(config.selectedPronouns)) {
      return NextResponse.json(
        { error: 'Invalid selectedPronouns' },
        { status: 400 }
      );
    }
    
    if (!config.questionCount || config.questionCount < 1 || config.questionCount > 100) {
      return NextResponse.json(
        { error: 'Invalid questionCount' },
        { status: 400 }
      );
    }
    
    // Convert QuizConfig format to database format
    const preferencesData = {
      user_id: user.id,
      selected_tense_moods: config.selectedTenseMoods,
      verb_selection: config.verbSelection,
      custom_verbs: config.customVerbs,
      preset_group_id: config.presetGroupId || null,
      selected_pronouns: config.selectedPronouns,
      question_count: config.questionCount,
      updated_at: new Date().toISOString()
    };
    
    // Upsert the preferences (insert or update)
    const { data, error } = await supabase
      .from('user_quiz_preferences')
      .upsert(preferencesData, {
        onConflict: 'user_id'
      })
      .select()
      .single();
    if (error) {
      console.error('Error saving quiz preferences:', error);
      return NextResponse.json(
        { error: 'Failed to save quiz preferences' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Quiz preferences saved successfully',
      data 
    });
  } catch (error) {
    console.error('Error in POST /api/quiz-preferences:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
