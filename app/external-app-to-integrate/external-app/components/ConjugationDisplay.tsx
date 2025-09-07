import { Verb, VerbConjugation } from '../utils/verbs';
import { highlightIrregularLetters, getPronounFromForm } from '../utils/irregularity';
import Image from 'next/image';


interface ConjugationDisplayProps {
  verb: Verb | null;
  loading?: boolean;
  onClose?: () => void;
}

export default function ConjugationDisplay({ verb, loading = false, onClose }: ConjugationDisplayProps) {
  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading conjugations...</p>
        </div>
      </div>
    );
  }

  if (!verb) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center text-gray-500">
          <h2 className="text-2xl font-semibold mb-2">Select a Verb</h2>
          <p>Choose a verb from the sidebar to view its conjugations</p>
        </div>
      </div>
    );
  }

  // Group conjugations by mood and tense, ensuring no duplicates
  const groupedConjugations = verb.conjugations.reduce((acc, conjugation) => {
    let mood = conjugation.mood;
    let tense = conjugation.tense;
    
    // Group both imperative moods together
    if (mood === 'Imperativo Afirmativo' || mood === 'Imperativo Negativo') {
      mood = 'Imperativo';
      // Use the mood as the tense for imperatives
      tense = conjugation.mood;
    }
    
    if (!acc[mood]) {
      acc[mood] = {};
    }
    if (!acc[mood][tense]) {
      acc[mood][tense] = [];
    }
    
    // Check if this conjugation already exists to avoid duplicates
    const exists = acc[mood][tense].some(existing => 
      existing.form_1s === conjugation.form_1s &&
      existing.form_2s === conjugation.form_2s &&
      existing.form_3s === conjugation.form_3s &&
      existing.form_1p === conjugation.form_1p &&
      existing.form_2p === conjugation.form_2p &&
      existing.form_3p === conjugation.form_3p
    );
    
    if (!exists) {
      acc[mood][tense].push(conjugation);
    }
    
    return acc;
  }, {} as Record<string, Record<string, VerbConjugation[]>>);

  // Define the order for tenses with mapping from Spanish to English
  const tenseMapping: Record<string, string> = {
    'Gerundio': 'Gerund',
    'Participio': 'Past Participle',
    'Presente': 'Present',
    'Imperfecto': 'Imperfect',
    'Pretérito': 'Past',
    'Futuro': 'Future',
    'Condicional': 'Conditional',
    'Presente perfecto': 'Present Perfect',
    'Pluscuamperfecto': 'Past Perfect',
    'Pretérito anterior': 'Imperfect Perfect',
    'Futuro perfecto': 'Future Perfect',
    'Condicional perfecto': 'Conditional Perfect',
    'Presente subjuntivo': 'Subjunctive Present',
    'Imperfecto subjuntivo': 'Subjunctive Imperfect',
    'Futuro subjuntivo': 'Subjunctive Future',
    'Imperativo Afirmativo': 'Affirmative',
    'Imperativo Negativo': 'Negative'
  };

  const tenseOrder = [
    'Gerundio',
    'Participio',
    'Presente',
    'Imperfecto',
    'Pretérito',
    'Futuro',
    'Condicional',
    'Presente perfecto',
    'Pretérito anterior',
    'Pluscuamperfecto',
    'Futuro perfecto',
    'Condicional perfecto',
    'Presente subjuntivo',
    'Imperfecto subjuntivo',
    'Futuro subjuntivo',
    'Imperativo Afirmativo',
    'Imperativo Negativo'
  ];

  // Define the order for moods
  const moodOrder = ['Indicativo', 'Subjuntivo', 'Imperativo'];

  // Helper function to get display mood name
  const getDisplayMoodName = (mood: string) => {
    if (mood === 'Imperativo Afirmativo' || mood === 'Imperativo Negativo') {
      return 'Imperativo';
    }
    return mood;
  };

  return (
    <div className="flex-1 p-6 overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {verb.infinitive}
            </h1>
            <p className="text-lg text-gray-600 italic">
              {verb.infinitive_english || 'No translation available'}
            </p>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors cursor-pointer"
            >
              ← Back to Home
            </button>
          )}
        </div>

        {/* Gerund and Past Participle Card */}
        {verb.conjugations.length > 0 && (
          <div className="mb-8">
            <h3 className="text-xl font-medium text-gray-700 mb-3">Gerund & Past Participle</h3>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="grid gap-4">
                <div className="block space-y-1">
                  <div className="flex w-full">
                    <span className="text-gray-500 w-1/2 lg:w-1/3">Gerund:</span>
                    <span className="font-medium">{verb.conjugations[0].gerund || '-'}</span>
                  </div>
                  <div className="flex">
                    <span className="text-gray-500 w-1/2 lg:w-1/3">Past Participle:</span>
                    <span className="font-medium">{verb.conjugations[0].pastparticiple || '-'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {moodOrder.map((mood) => {
          const tenses = groupedConjugations[mood];
          if (!tenses) return null;

          const displayMoodName = getDisplayMoodName(mood);
          const shouldShowMoodHeader = mood !== 'Indicativo';

          return (
            <div key={mood} className="mb-8">
              {shouldShowMoodHeader && (
                <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">
                  {displayMoodName}
                </h2>
              )}
              
              {tenseOrder.map((tense) => {
                const conjugations = tenses[tense];
                if (!conjugations) return null;

                return (
                  <div key={`${mood}-${tense}`} className="mb-6">
                    <div className="relative flex items-center gap-2 mb-3">
                        <div className="relative block w-8 h-8">
                            <Image 
                                src={`/icons/${tenseMapping[tense] || tense}.png`} 
                                fill
                                alt={tenseMapping[tense] || tense}
                            />
                        </div>
                      <h3 className="text-xl font-medium text-gray-700">
                        {tenseMapping[tense] || tense}
                      </h3>
                    </div>
                    
                    {conjugations.map((conjugation, index) => (
                      <div key={`${mood}-${tense}-${index}`} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
                        <div className="mb-3">
                          <span className="text-sm text-gray-500 italic">
                            {conjugation.verb_english || 'No translation available'}
                          </span>
                        </div>
                        
                        <div className="grid lg:grid-cols-2 lg:gap-8 max-lg:divide-y max-lg:divide-gray-200">
                          <div className="space-y-2 divide-y divide-gray-200">
                            <div className="flex">
                              <span className="text-gray-500 w-[20ch]">yo</span>
                              <span 
                                className="font-medium ml-2"
                                dangerouslySetInnerHTML={{
                                  __html: highlightIrregularLetters(verb.infinitive, conjugation.form_1s || '-', 'yo', conjugation.tense)
                                }}
                              />
                            </div>
                            <div className="flex">
                              <span className="text-gray-500 w-[20ch]">tú</span>
                              <span 
                                className="font-medium ml-2"
                                dangerouslySetInnerHTML={{
                                  __html: highlightIrregularLetters(verb.infinitive, conjugation.form_2s || '-', 'tú', conjugation.tense)
                                }}
                              />
                            </div>
                            <div className="flex">
                              <span className="text-gray-500 w-[20ch]">él/ella</span>
                              <span 
                                className="font-medium ml-2"
                                dangerouslySetInnerHTML={{
                                  __html: highlightIrregularLetters(verb.infinitive, conjugation.form_3s || '-', 'él', conjugation.tense)
                                }}
                              />
                            </div>
                          </div>
                          
                          <div className="space-y-2 divide-y divide-gray-200">
                            <div className="flex">
                              <span className="text-gray-500 w-[20ch]">nosotros</span>
                              <span 
                                className="font-medium ml-2"
                                dangerouslySetInnerHTML={{
                                  __html: highlightIrregularLetters(verb.infinitive, conjugation.form_1p || '-', 'nosotros', conjugation.tense)
                                }}
                              />
                            </div>
                            {/* <div className="flex">
                              <span className="text-gray-500 w-[20ch]">vosotros:</span>
                              <span className="font-medium ml-2">{conjugation.form_2p || '-'}</span>
                            </div> */}
                            <div className="flex">
                              <span className="text-gray-500 w-[20ch]">ellos/ellas</span>
                              <span 
                                className="font-medium ml-2"
                                dangerouslySetInnerHTML={{
                                  __html: highlightIrregularLetters(verb.infinitive, conjugation.form_3p || '-', 'ellos', conjugation.tense)
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
} 