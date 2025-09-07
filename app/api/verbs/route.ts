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

export async function GET() {
  try {
    console.log('Loading verbs from Supabase...');
    
    const supabase = await createClient();
    
    // Get all verbs from the verbs table
    const { data: verbs, error: verbsError } = await supabase
      .from('verbs')
      .select('infinitive, infinitive_english')
      .order('infinitive');

    if (verbsError) {
      console.error('Error loading verbs:', verbsError);
      return NextResponse.json(
        { error: 'Failed to load verbs' },
        { status: 500 }
      );
    }

    console.log('Loaded verbs count:', verbs?.length || 0);
    console.log('First verb:', verbs?.[0]);

    // Transform to match the expected interface
    const transformedVerbs: Verb[] = (verbs || []).map((verb: any) => ({
      infinitive: verb.infinitive,
      infinitive_english: verb.infinitive_english,
      conjugations: [] // Empty array for list view - conjugations loaded separately
    }));

    return NextResponse.json(transformedVerbs);
  } catch (error) {
    console.error('Error loading verbs:', error);
    return NextResponse.json(
      { error: 'Failed to load verbs' },
      { status: 500 }
    );
  }
}
