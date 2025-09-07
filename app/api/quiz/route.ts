import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { QuizConfig, QuizQuestion, VerbOption } from '@/types/quiz';

export async function POST(request: Request) {
  try {
    const config: QuizConfig = await request.json();
    
    console.log('Generating quiz with config:', config);
    console.log('Selected pronouns:', config.selectedPronouns);
    
    const supabase = await createClient();
    
    // Get user favorites if needed
    let availableVerbs: VerbOption[] = [];
    
    if (config.verbSelection === 'favorites') {
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        return NextResponse.json(
          { error: 'User not authenticated' },
          { status: 401 }
        );
      }
      
      // Get user favorites
      const { data: favorites, error: favoritesError } = await supabase
        .from('user_favorites')
        .select('verb_infinitive')
        .eq('user_id', user.id);
      
      if (favoritesError) {
        console.error('Error loading favorites:', favoritesError);
        return NextResponse.json(
          { error: 'Failed to load favorites' },
          { status: 500 }
        );
      }
      
      if (!favorites || favorites.length === 0) {
        return NextResponse.json(
          { error: 'No favorite verbs found. Please add some verbs to your favorites first.' },
          { status: 400 }
        );
      }
      
      // Get verb details for favorites
      const { data: verbs, error: verbsError } = await supabase
        .from('verbs')
        .select('infinitive, infinitive_english')
        .in('infinitive', favorites.map(f => f.verb_infinitive));
      
      if (verbsError) {
        console.error('Error loading favorite verbs:', verbsError);
        return NextResponse.json(
          { error: 'Failed to load favorite verbs' },
          { status: 500 }
        );
      }
      
      availableVerbs = (verbs || []).map(verb => ({
        infinitive: verb.infinitive,
        infinitiveEnglish: verb.infinitive_english,
        isFavorite: true
      }));
    } else {
      // Get custom selected verbs
      if (config.customVerbs.length === 0) {
        return NextResponse.json(
          { error: 'No verbs selected' },
          { status: 400 }
        );
      }
      
      const { data: verbs, error: verbsError } = await supabase
        .from('verbs')
        .select('infinitive, infinitive_english')
        .in('infinitive', config.customVerbs);
      
      if (verbsError) {
        console.error('Error loading custom verbs:', verbsError);
        return NextResponse.json(
          { error: 'Failed to load selected verbs' },
          { status: 500 }
        );
      }
      
      availableVerbs = (verbs || []).map(verb => ({
        infinitive: verb.infinitive,
        infinitiveEnglish: verb.infinitive_english
      }));
    }
    
    // Generate quiz questions
    const questions = await generateQuizQuestions(
      availableVerbs,
      config.selectedTenseMoods,
      config.selectedPronouns,
      config.questionCount,
      supabase
    );
    
    if (questions.length === 0) {
      return NextResponse.json(
        { error: 'No questions could be generated with the selected criteria' },
        { status: 400 }
      );
    }
    
    console.log(`Generated ${questions.length} quiz questions`);
    
    return NextResponse.json({ questions });
  } catch (error) {
    console.error('Error generating quiz:', error);
    return NextResponse.json(
      { error: 'Failed to generate quiz' },
      { status: 500 }
    );
  }
}

async function generateQuizQuestions(
  verbs: VerbOption[],
  selectedTenseMoods: string[],
  selectedPronouns: string[],
  questionCount: number,
  supabase: any
): Promise<QuizQuestion[]> {
  const questions: QuizQuestion[] = [];
  const usedCombinations = new Set<string>();
  
  // Parse selected tense-mood combinations
  const tenseMoodPairs = selectedTenseMoods.map(tm => {
    const [tense, mood] = tm.split('-');
    return { tense, mood };
  });
  
  // Get all conjugations for the selected verbs, tenses, and moods
  // Join with verbs table to get infinitive_english
  const { data: conjugations, error } = await supabase
    .from('verb_conjugations')
    .select(`
      *,
      verbs!inner(infinitive_english)
    `)
    .in('infinitive', verbs.map(v => v.infinitive))
    .or(tenseMoodPairs.map(pair => `and(tense.eq.${pair.tense},mood.eq.${pair.mood})`).join(','));
  
  if (error || !conjugations) {
    console.error('Error loading conjugations:', error);
    return [];
  }
  
  // Filter out conjugations without valid forms
  const validConjugations = conjugations.filter((conj: any) => 
    conj.form_1s || conj.form_2s || conj.form_3s || 
    conj.form_1p || conj.form_2p || conj.form_3p
  );
  
  console.log('Quiz API Debug:', {
    totalConjugations: conjugations.length,
    validConjugations: validConjugations.length,
    requestedQuestions: questionCount,
    selectedVerbs: verbs.map(v => v.infinitive),
    selectedTenseMoods,
    tenseMoodPairs
  });
  
  // Generate questions
  let attempts = 0;
  while (questions.length < questionCount && validConjugations.length > 0 && attempts < questionCount * 10) {
    attempts++;
    // Randomly select a conjugation
    const randomIndex = Math.floor(Math.random() * validConjugations.length);
    const conjugation = validConjugations[randomIndex];
    
    console.log(`Attempt ${attempts}: Trying to generate question ${questions.length + 1}/${questionCount}`);
    
    // Randomly select a pronoun form from selected pronouns only
    const allPronounForms = [
      { 
        pronoun: 'yo', 
        pronounEnglish: 'I', 
        form: conjugation.form_1s,
        formEnglish: conjugation.form_1s_english
      },
      { 
        pronoun: 'tú', 
        pronounEnglish: 'you', 
        form: conjugation.form_2s,
        formEnglish: conjugation.form_2s_english
      },
      { 
        pronoun: 'él', 
        pronounEnglish: 'he', 
        form: conjugation.form_3s,
        formEnglish: conjugation.form_3s_english
      },
      { 
        pronoun: 'ella', 
        pronounEnglish: 'she', 
        form: conjugation.form_3s,
        formEnglish: conjugation.form_3s_english
      },
      { 
        pronoun: 'usted', 
        pronounEnglish: 'you (formal)', 
        form: conjugation.form_3s,
        formEnglish: conjugation.form_3s_english
      },
      { 
        pronoun: 'nosotros', 
        pronounEnglish: 'we', 
        form: conjugation.form_1p,
        formEnglish: conjugation.form_1p_english
      },
      { 
        pronoun: 'ellos', 
        pronounEnglish: 'they', 
        form: conjugation.form_3p,
        formEnglish: conjugation.form_3p_english
      },
      { 
        pronoun: 'ellas', 
        pronounEnglish: 'they', 
        form: conjugation.form_3p,
        formEnglish: conjugation.form_3p_english
      },
      { 
        pronoun: 'ustedes', 
        pronounEnglish: 'you all', 
        form: conjugation.form_3p,
        formEnglish: conjugation.form_3p_english
      }
    ];
    
    // Filter to only include selected pronouns and valid forms
    const pronounForms = allPronounForms.filter(p => 
      selectedPronouns.includes(p.pronoun) && p.form && p.form.trim() !== ''
    );
    
    if (pronounForms.length === 0) {
      validConjugations.splice(randomIndex, 1);
      continue;
    }
    
    const selectedForm = pronounForms[Math.floor(Math.random() * pronounForms.length)];
    
    // Create unique key for this combination
    const combinationKey = `${conjugation.infinitive}-${conjugation.tense}-${conjugation.mood}-${selectedForm.pronoun}`;
    
    if (usedCombinations.has(combinationKey)) {
      // Skip this combination but don't remove the conjugation
      console.log(`Skipping duplicate combination: ${combinationKey}`);
      continue;
    }
    
    usedCombinations.add(combinationKey);
    
    // Create the question
    const question: QuizQuestion = {
      id: `q_${questions.length + 1}`,
      englishPhrase: selectedForm.formEnglish || `${selectedForm.pronounEnglish} ${conjugation.verb_english || conjugation.infinitive_english}`,
      tense: conjugation.tense,
      mood: conjugation.mood,
      tenseEnglish: conjugation.tense_english,
      moodEnglish: conjugation.mood_english,
      infinitive: conjugation.infinitive,
      infinitiveEnglish: conjugation.verbs?.infinitive_english || conjugation.infinitive_english,
      correctAnswer: selectedForm.form,
      pronoun: selectedForm.pronoun,
      pronounEnglish: selectedForm.pronounEnglish,
      explanation: `${conjugation.tense_english} - ${conjugation.mood_english}`
    };
    
    questions.push(question);
    // Don't remove conjugations - allow reuse with different pronouns
    
    console.log(`Generated question ${questions.length}/${questionCount}:`, {
      infinitive: conjugation.infinitive,
      tense: conjugation.tense,
      mood: conjugation.mood,
      pronoun: selectedForm.pronoun,
      remainingConjugations: validConjugations.length
    });
  }
  
  console.log('Final quiz generation:', {
    requestedQuestions: questionCount,
    generatedQuestions: questions.length,
    remainingConjugations: validConjugations.length
  });
  
  return questions;
}

