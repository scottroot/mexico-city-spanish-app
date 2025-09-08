import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export interface Verb {
  infinitive: string;
  infinitive_english: string;
  conjugations: VerbConjugation[];
}

export interface VerbConjugation {
  infinitive: string;
  infinitive_english: string;
  mood: string;
  mood_english: string;
  tense: string;
  tense_english: string;
  verb_english: string;
  form_1s: string;
  form_2s: string;
  form_3s: string;
  form_1p: string;
  form_2p: string;
  form_3p: string;
  gerund: string;
  gerund_english: string;
  pastparticiple: string;
  pastparticiple_english: string;
}

export async function GET(
  request: Request,
  context: { params: Promise<{ infinitive: string }> }
) {
  try {
    const { infinitive } = await context.params;
    const decodedInfinitive = decodeURIComponent(infinitive);
    
    console.log('Loading verb conjugations for:', decodedInfinitive);
    
    const supabase = await createClient();
    
    // First, get the verb basic info
    const { data: verbData, error: verbError } = await supabase
      .from('verbs')
      .select('infinitive, infinitive_english')
      .eq('infinitive', decodedInfinitive)
      .single();

    if (verbError || !verbData) {
      console.error('Verb not found:', decodedInfinitive, verbError);
      return NextResponse.json(
        { error: 'Verb not found' },
        { status: 404 }
      );
    }

    // Then get all conjugations for this verb
    const { data: conjugations, error: conjugationsError } = await supabase
      .from('verb_conjugations')
      .select('*')
      .eq('infinitive', decodedInfinitive)
      .order('mood, tense');

    if (conjugationsError) {
      console.error('Error loading conjugations:', conjugationsError);
      return NextResponse.json(
        { error: 'Failed to load verb conjugations' },
        { status: 500 }
      );
    }

    console.log('Loaded conjugations count:', conjugations?.length || 0);

    // Transform conjugations to match the expected interface
    const transformedConjugations: VerbConjugation[] = (conjugations || []).map((conj: any) => ({
      infinitive: conj.infinitive,
      infinitive_english: conj.infinitive_english,
      mood: conj.mood,
      mood_english: conj.mood_english,
      tense: conj.tense,
      tense_english: conj.tense_english,
      verb_english: conj.verb_english,
      form_1s: conj.form_1s,
      form_2s: conj.form_2s,
      form_3s: conj.form_3s,
      form_1p: conj.form_1p,
      form_2p: conj.form_2p,
      form_3p: conj.form_3p,
      gerund: conj.gerund,
      gerund_english: conj.gerund_english,
      pastparticiple: conj.pastparticiple,
      pastparticiple_english: conj.pastparticiple_english
    }));

    // Create the complete verb object
    const verb: Verb = {
      infinitive: verbData.infinitive,
      infinitive_english: verbData.infinitive_english,
      conjugations: transformedConjugations
    };

    return NextResponse.json(verb);
  } catch (error) {
    console.error('Error loading verb:', error);
    return NextResponse.json(
      { error: 'Failed to load verb' },
      { status: 500 }
    );
  }
}
