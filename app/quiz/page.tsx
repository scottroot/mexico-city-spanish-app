import { createClient } from '@/utils/supabase/server';
import { VerbOption, QuizConfig } from '@/types/quiz';
import QuizPageClient from './QuizPageClient';
import { Verb } from '@/app/types';
import QuizPageClientWrapper from './QuizPageClientWrapper';


// Helper to clean quiz config data
function cleanQuizConfig(config: QuizConfig | null): QuizConfig | null {
  if (!config) return null;

  const cleanedTenseMoods = config.selectedTenseMoods
    ? [...new Set(config.selectedTenseMoods)].filter((tm: string) => tm && tm.trim())
    : [];

  const cleanedPronouns = config.selectedPronouns
    ? [...new Set(config.selectedPronouns)].filter((p: string) => p && p.trim())
    : [];

  return {
    ...config,
    selectedTenseMoods: cleanedTenseMoods,
    selectedPronouns: cleanedPronouns
  };
}

/**
Get all verbs from the verbs table
@param supabase - Supabase client
@returns Array of Verb objects
*/
async function getVerbs(supabase: any) {
  const { data: verbs, error: verbsError } = await supabase
    .from('verbs')
    .select('infinitive, infinitive_english')
    .order('infinitive');

  if (verbsError) {
    console.error('Error loading verbs:', verbsError);
    throw new Error('Failed to load verbs');
  }

  // Transform to match the expected interface
  const transformedVerbs: Verb[] = (verbs || []).map((verb: any) => ({
    infinitive: verb.infinitive,
    infinitive_english: verb.infinitive_english,
    conjugations: [] // Empty array for list view - conjugations loaded separately
  }));

  return transformedVerbs;
}

/**
 * Fetch favorites (user-specific, only if logged in)
 * @param supabase
 * @param user 
 * @returns 
 */
async function getFavorites(supabase: any, user: any) {
  if (!user) return [];
  const { data } = await supabase
    .from('user_favorites')
    .select('verb_infinitive')
    .eq('user_id', user.id);

  return data?.map((f: { verb_infinitive: string }) => f.verb_infinitive) || [];
}

/**
 * Fetch quiz preferences (user-specific, only if logged in)
 * @param supabase 
 * @param user 
 * @returns 
 */
async function getPreferences(supabase: any, user: any) {
  if (!user) return null;
  const { data, error } = await supabase
    .from('user_quiz_preferences')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (!data) return null;

  return {
    selectedTenseMoods: data.selected_tenses || [],
    verbSelection: data.verb_selection || 'preset',
    customVerbs: data.custom_verbs || [],
    presetGroupId: data.preset_group_id || 'top-100',
    selectedPronouns: data.selected_pronouns || ['yo', 'tú', 'él', 'nosotros', 'ustedes', 'ellos'],
    questionCount: data.question_count || 10
  } as QuizConfig;
}

export default async function QuizPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const verbsResponse = await getVerbs(supabase);
  const favoritesResponse = await getFavorites(supabase, user);
  const preferencesResponse = await getPreferences(supabase, user);

  // Transform verbs data
  const verbs: VerbOption[] = Array.isArray(verbsResponse)
    ? verbsResponse.map((verb: any) => ({
        infinitive: verb.infinitive,
        infinitiveEnglish: verb.infinitive_english
      }))
    : [];

  const favorites: string[] = favoritesResponse || [];
  const preferences = cleanQuizConfig(preferencesResponse);

  return (
    <QuizPageClientWrapper
      initialVerbs={verbs}
      initialFavorites={favorites}
      initialPreferences={preferences}
    />
  );
}
