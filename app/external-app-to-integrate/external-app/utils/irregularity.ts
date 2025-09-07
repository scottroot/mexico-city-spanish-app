type Pronoun = "yo" | "tú" | "él" | "ella" | "usted" | "nosotros" | "ellos" | "ellas" | "ustedes";

function getHaberConjugation(pronoun: Pronoun, tense: string): string {
  const haberConjugations: Record<string, Record<Pronoun, string>> = {
    'presente perfecto': {
      yo: "he", tú: "has", él: "ha", ella: "ha", usted: "ha",
      nosotros: "hemos", ellos: "han", ellas: "han", ustedes: "han"
    },
    'pluscuamperfecto': {
      yo: "había", tú: "habías", él: "había", ella: "había", usted: "había",
      nosotros: "habíamos", ellos: "habían", ellas: "habían", ustedes: "habían"
    },
    'pretérito anterior': {
      yo: "hube", tú: "hubiste", él: "hubo", ella: "hubo", usted: "hubo",
      nosotros: "hubimos", ellos: "hubieron", ellas: "hubieron", ustedes: "hubieron"
    },
    'futuro perfecto': {
      yo: "habré", tú: "habrás", él: "habrá", ella: "habrá", usted: "habrá",
      nosotros: "habremos", ellos: "habrán", ellas: "habrán", ustedes: "habrán"
    },
    'condicional perfecto': {
      yo: "habría", tú: "habrías", él: "habría", ella: "habría", usted: "habría",
      nosotros: "habríamos", ellos: "habrían", ellas: "habrían", ustedes: "habrían"
    }
  };

  const tenseKey = Object.keys(haberConjugations).find(key => 
    key.toLowerCase() === tense.toLowerCase()
  ) || 'presente perfecto';

  return haberConjugations[tenseKey][pronoun] || "he";
}

function getRegularPastParticiple(infinitive: string): string {
  const ending = infinitive.slice(-2);
  const stem = infinitive.slice(0, -2);

  switch (ending) {
    case 'ar':
      return stem + 'ado';
    case 'er':
    case 'ir':
      return stem + 'ido';
    default:
      return infinitive + 'do'; // fallback
  }
}

function getRegularConjugation(infinitive: string, pronoun: Pronoun, tense: string): string {
  const ending = infinitive.slice(-2);
  const stem = infinitive.slice(0, -2);

  // Check if this is a perfect tense
  const isPerfectTense = [
    'presente perfecto', 'present perfect',
    'pluscuamperfecto', 'past perfect', 
    'pretérito anterior', 'past anterior',
    'futuro perfecto', 'future perfect',
    'condicional perfecto', 'conditional perfect'
  ].includes(tense.toLowerCase());

  if (isPerfectTense) {
    // For perfect tenses, we need haber + regular past participle
    const haberConjugation = getHaberConjugation(pronoun, tense);
    const regularPastParticiple = getRegularPastParticiple(infinitive);
    return `${haberConjugation} ${regularPastParticiple}`;
  }

  // Present tense endings
  const presentEndings: Record<string, Record<Pronoun, string>> = {
    ar: {
      yo: "o", tú: "as", él: "a", ella: "a", usted: "a",
      nosotros: "amos", ellos: "an", ellas: "an", ustedes: "an"
    },
    er: {
      yo: "o", tú: "es", él: "e", ella: "e", usted: "e",
      nosotros: "emos", ellos: "en", ellas: "en", ustedes: "en"
    },
    ir: {
      yo: "o", tú: "es", él: "e", ella: "e", usted: "e",
      nosotros: "imos", ellos: "en", ellas: "en", ustedes: "en"
    }
  };

  // Imperfect tense endings
  const imperfectEndings: Record<string, Record<Pronoun, string>> = {
    ar: {
      yo: "aba", tú: "abas", él: "aba", ella: "aba", usted: "aba",
      nosotros: "ábamos", ellos: "aban", ellas: "aban", ustedes: "aban"
    },
    er: {
      yo: "ía", tú: "ías", él: "ía", ella: "ía", usted: "ía",
      nosotros: "íamos", ellos: "ían", ellas: "ían", ustedes: "ían"
    },
    ir: {
      yo: "ía", tú: "ías", él: "ía", ella: "ía", usted: "ía",
      nosotros: "íamos", ellos: "ían", ellas: "ían", ustedes: "ían"
    }
  };

  // Preterite tense endings
  const preteriteEndings: Record<string, Record<Pronoun, string>> = {
    ar: {
      yo: "é", tú: "aste", él: "ó", ella: "ó", usted: "ó",
      nosotros: "amos", ellos: "aron", ellas: "aron", ustedes: "aron"
    },
    er: {
      yo: "í", tú: "iste", él: "ió", ella: "ió", usted: "ió",
      nosotros: "imos", ellos: "ieron", ellas: "ieron", ustedes: "ieron"
    },
    ir: {
      yo: "í", tú: "iste", él: "ió", ella: "ió", usted: "ió",
      nosotros: "imos", ellos: "ieron", ellas: "ieron", ustedes: "ieron"
    }
  };

  // Future tense endings
  const futureEndings: Record<string, Record<Pronoun, string>> = {
    ar: {
      yo: "aré", tú: "arás", él: "ará", ella: "ará", usted: "ará",
      nosotros: "aremos", ellos: "arán", ellas: "arán", ustedes: "arán"
    },
    er: {
      yo: "eré", tú: "erás", él: "erá", ella: "erá", usted: "erá",
      nosotros: "eremos", ellos: "erán", ellas: "erán", ustedes: "erán"
    },
    ir: {
      yo: "iré", tú: "irás", él: "irá", ella: "irá", usted: "irá",
      nosotros: "iremos", ellos: "irán", ellas: "irán", ustedes: "irán"
    }
  };

  // Conditional tense endings
  const conditionalEndings: Record<string, Record<Pronoun, string>> = {
    ar: {
      yo: "aría", tú: "arías", él: "aría", ella: "aría", usted: "aría",
      nosotros: "aríamos", ellos: "arían", ellas: "arían", ustedes: "arían"
    },
    er: {
      yo: "ería", tú: "erías", él: "ería", ella: "ería", usted: "ería",
      nosotros: "eríamos", ellos: "erían", ellas: "erían", ustedes: "erían"
    },
    ir: {
      yo: "iría", tú: "irías", él: "iría", ella: "iría", usted: "iría",
      nosotros: "iríamos", ellos: "irían", ellas: "irían", ustedes: "irían"
    }
  };

  // Present subjunctive endings
  const presentSubjunctiveEndings: Record<string, Record<Pronoun, string>> = {
    ar: {
      yo: "e", tú: "es", él: "e", ella: "e", usted: "e",
      nosotros: "emos", ellos: "en", ellas: "en", ustedes: "en"
    },
    er: {
      yo: "a", tú: "as", él: "a", ella: "a", usted: "a",
      nosotros: "amos", ellos: "an", ellas: "an", ustedes: "an"
    },
    ir: {
      yo: "a", tú: "as", él: "a", ella: "a", usted: "a",
      nosotros: "amos", ellos: "an", ellas: "an", ustedes: "an"
    }
  };

  // Imperfect subjunctive endings
  const imperfectSubjunctiveEndings: Record<string, Record<Pronoun, string>> = {
    ar: {
      yo: "ara", tú: "aras", él: "ara", ella: "ara", usted: "ara",
      nosotros: "áramos", ellos: "aran", ellas: "aran", ustedes: "aran"
    },
    er: {
      yo: "iera", tú: "ieras", él: "iera", ella: "iera", usted: "iera",
      nosotros: "iéramos", ellos: "ieran", ellas: "ieran", ustedes: "ieran"
    },
    ir: {
      yo: "iera", tú: "ieras", él: "iera", ella: "iera", usted: "iera",
      nosotros: "iéramos", ellos: "ieran", ellas: "ieran", ustedes: "ieran"
    }
  };

  // Present Perfect tense endings (haber + past participle)
  const presentPerfectEndings: Record<string, Record<Pronoun, string>> = {
    ar: {
      yo: "he", tú: "has", él: "ha", ella: "ha", usted: "ha",
      nosotros: "hemos", ellos: "han", ellas: "han", ustedes: "han"
    },
    er: {
      yo: "he", tú: "has", él: "ha", ella: "ha", usted: "ha",
      nosotros: "hemos", ellos: "han", ellas: "han", ustedes: "han"
    },
    ir: {
      yo: "he", tú: "has", él: "ha", ella: "ha", usted: "ha",
      nosotros: "hemos", ellos: "han", ellas: "han", ustedes: "han"
    }
  };

  // Past Perfect tense endings (había + past participle)
  const pastPerfectEndings: Record<string, Record<Pronoun, string>> = {
    ar: {
      yo: "había", tú: "habías", él: "había", ella: "había", usted: "había",
      nosotros: "habíamos", ellos: "habían", ellas: "habían", ustedes: "habían"
    },
    er: {
      yo: "había", tú: "habías", él: "había", ella: "había", usted: "había",
      nosotros: "habíamos", ellos: "habían", ellas: "habían", ustedes: "habían"
    },
    ir: {
      yo: "había", tú: "habías", él: "había", ella: "había", usted: "había",
      nosotros: "habíamos", ellos: "habían", ellas: "habían", ustedes: "habían"
    }
  };

  // Past Anterior tense endings (hube + past participle)
  const pastAnteriorEndings: Record<string, Record<Pronoun, string>> = {
    ar: {
      yo: "hube", tú: "hubiste", él: "hubo", ella: "hubo", usted: "hubo",
      nosotros: "hubimos", ellos: "hubieron", ellas: "hubieron", ustedes: "hubieron"
    },
    er: {
      yo: "hube", tú: "hubiste", él: "hubo", ella: "hubo", usted: "hubo",
      nosotros: "hubimos", ellos: "hubieron", ellas: "hubieron", ustedes: "hubieron"
    },
    ir: {
      yo: "hube", tú: "hubiste", él: "hubo", ella: "hubo", usted: "hubo",
      nosotros: "hubimos", ellos: "hubieron", ellas: "hubieron", ustedes: "hubieron"
    }
  };

  // Future Perfect tense endings (habré + past participle)
  const futurePerfectEndings: Record<string, Record<Pronoun, string>> = {
    ar: {
      yo: "habré", tú: "habrás", él: "habrá", ella: "habrá", usted: "habrá",
      nosotros: "habremos", ellos: "habrán", ellas: "habrán", ustedes: "habrán"
    },
    er: {
      yo: "habré", tú: "habrás", él: "habrá", ella: "habrá", usted: "habrá",
      nosotros: "habremos", ellos: "habrán", ellas: "habrán", ustedes: "habrán"
    },
    ir: {
      yo: "habré", tú: "habrás", él: "habrá", ella: "habrá", usted: "habrá",
      nosotros: "habremos", ellos: "habrán", ellas: "habrán", ustedes: "habrán"
    }
  };

  // Conditional Perfect tense endings (habría + past participle)
  const conditionalPerfectEndings: Record<string, Record<Pronoun, string>> = {
    ar: {
      yo: "habría", tú: "habrías", él: "habría", ella: "habría", usted: "habría",
      nosotros: "habríamos", ellos: "habrían", ellas: "habrían", ustedes: "habrían"
    },
    er: {
      yo: "habría", tú: "habrías", él: "habría", ella: "habría", usted: "habría",
      nosotros: "habríamos", ellos: "habrían", ellas: "habrían", ustedes: "habrían"
    },
    ir: {
      yo: "habría", tú: "habrías", él: "habría", ella: "habría", usted: "habría",
      nosotros: "habríamos", ellos: "habrían", ellas: "habrían", ustedes: "habrían"
    }
  };

  // Future subjunctive endings
  const futureSubjunctiveEndings: Record<string, Record<Pronoun, string>> = {
    ar: {
      yo: "are", tú: "ares", él: "are", ella: "are", usted: "are",
      nosotros: "áremos", ellos: "aren", ellas: "aren", ustedes: "aren"
    },
    er: {
      yo: "iere", tú: "ieres", él: "iere", ella: "iere", usted: "iere",
      nosotros: "iéremos", ellos: "ieren", ellas: "ieren", ustedes: "ieren"
    },
    ir: {
      yo: "iere", tú: "ieres", él: "iere", ella: "iere", usted: "iere",
      nosotros: "iéremos", ellos: "ieren", ellas: "ieren", ustedes: "ieren"
    }
  };

  // Imperative affirmative endings
  const imperativeAffirmativeEndings: Record<string, Record<Pronoun, string>> = {
    ar: {
      yo: "", tú: "a", él: "e", ella: "e", usted: "e",
      nosotros: "emos", ellos: "en", ellas: "en", ustedes: "en"
    },
    er: {
      yo: "", tú: "e", él: "a", ella: "a", usted: "a",
      nosotros: "amos", ellos: "an", ellas: "an", ustedes: "an"
    },
    ir: {
      yo: "", tú: "e", él: "a", ella: "a", usted: "a",
      nosotros: "amos", ellos: "an", ellas: "an", ustedes: "an"
    }
  };

  // Imperative negative endings
  const imperativeNegativeEndings: Record<string, Record<Pronoun, string>> = {
    ar: {
      yo: "", tú: "es", él: "e", ella: "e", usted: "e",
      nosotros: "emos", ellos: "en", ellas: "en", ustedes: "en"
    },
    er: {
      yo: "", tú: "as", él: "a", ella: "a", usted: "a",
      nosotros: "amos", ellos: "an", ellas: "an", ustedes: "an"
    },
    ir: {
      yo: "", tú: "as", él: "a", ella: "a", usted: "a",
      nosotros: "amos", ellos: "an", ellas: "an", ustedes: "an"
    }
  };

  // Select the appropriate endings based on tense
  let endings: Record<string, Record<Pronoun, string>>;
  
  switch (tense.toLowerCase()) {
    case 'presente':
    case 'present':
      endings = presentEndings;
      break;
    case 'imperfecto':
    case 'imperfect':
      endings = imperfectEndings;
      break;
    case 'pretérito':
    case 'preterite':
      endings = preteriteEndings;
      break;
    case 'futuro':
    case 'future':
      endings = futureEndings;
      break;
    case 'condicional':
    case 'conditional':
      endings = conditionalEndings;
      break;
    case 'presente subjuntivo':
    case 'present subjunctive':
      endings = presentSubjunctiveEndings;
      break;
    case 'imperfecto subjuntivo':
    case 'imperfect subjunctive':
      endings = imperfectSubjunctiveEndings;
      break;
    case 'presente perfecto':
    case 'present perfect':
      endings = presentPerfectEndings;
      break;
    case 'pluscuamperfecto':
    case 'past perfect':
      endings = pastPerfectEndings;
      break;
    case 'pretérito anterior':
    case 'past anterior':
      endings = pastAnteriorEndings;
      break;
    case 'futuro perfecto':
    case 'future perfect':
      endings = futurePerfectEndings;
      break;
    case 'condicional perfecto':
    case 'conditional perfect':
      endings = conditionalPerfectEndings;
      break;
    case 'futuro subjuntivo':
    case 'future subjunctive':
      endings = futureSubjunctiveEndings;
      break;
    case 'imperativo afirmativo':
    case 'affirmative imperative':
      endings = imperativeAffirmativeEndings;
      break;
    case 'imperativo negativo':
    case 'negative imperative':
      endings = imperativeNegativeEndings;
      break;
    default:
      // Default to present tense if tense not recognized
      endings = presentEndings;
  }

  const group = endings[ending];
  if (!group || !group[pronoun]) {
    throw new Error("Invalid verb, pronoun, or tense");
  }

  return stem + group[pronoun];
}

function findIrregularIndices(infinitive: string, actual: string, pronoun: Pronoun, tense: string): [number, number][] {
  const isPerfectTense = [
    'presente perfecto', 'present perfect',
    'pluscuamperfecto', 'past perfect', 
    'pretérito anterior', 'past anterior',
    'futuro perfecto', 'future perfect',
    'condicional perfecto', 'conditional perfect'
  ].includes(tense.toLowerCase());

  if (isPerfectTense) {
    // For perfect tenses, compare only the past participle part
    const haberConjugation = getHaberConjugation(pronoun, tense);
    const expectedPastParticiple = getRegularPastParticiple(infinitive);
    const expectedFull = `${haberConjugation} ${expectedPastParticiple}`;
    
    // Find the past participle part in the actual conjugation
    const actualParts = actual.split(' ');
    if (actualParts.length >= 2) {
      const actualPastParticiple = actualParts[1];
      
      // Compare only the past participle
      const irregularIndices = findIrregularIndicesInWord(expectedPastParticiple, actualPastParticiple);
      
      // Adjust indices to account for the haber conjugation + space
      const haberLength = haberConjugation.length + 1; // +1 for the space
      return irregularIndices.map(([start, end]) => [start + haberLength, end + haberLength]);
    }
    
    return [];
  }

  // For non-perfect tenses, use the original logic
  const expected = getRegularConjugation(infinitive, pronoun, tense);
  return findIrregularIndicesInWord(expected, actual);
}

function findIrregularIndicesInWord(expected: string, actual: string): [number, number][] {
  const result: [number, number][] = [];

  // Find the longest common prefix
  let prefixLength = 0;
  while (prefixLength < expected.length && 
         prefixLength < actual.length && 
         expected[prefixLength] === actual[prefixLength]) {
    prefixLength++;
  }

  // Find the longest common suffix
  let suffixLength = 0;
  while (suffixLength < expected.length - prefixLength && 
         suffixLength < actual.length - prefixLength && 
         expected[expected.length - 1 - suffixLength] === actual[actual.length - 1 - suffixLength]) {
    suffixLength++;
  }

  // If there's a difference in the middle, highlight it
  if (prefixLength < expected.length - suffixLength || prefixLength < actual.length - suffixLength) {
    result.push([prefixLength, Math.max(expected.length - suffixLength, actual.length - suffixLength)]);
  }

  return result;
}

export function highlightIrregularLetters(infinitive: string, conjugation: string, pronoun: Pronoun, tense: string): string {
  try {
    const irregularIndices = findIrregularIndices(infinitive, conjugation, pronoun, tense);
    
    if (irregularIndices.length === 0) {
      return conjugation;
    }

    let result = '';
    let lastIndex = 0;

    irregularIndices.forEach(([start, end]) => {
      result += conjugation.slice(lastIndex, start);
      result += `<span class="text-red-600 font-semibold">${conjugation.slice(start, end)}</span>`;
      lastIndex = end;
    });

    result += conjugation.slice(lastIndex);
    return result;
  } catch (error) {
    // If there's an error (e.g., invalid verb), return the original conjugation
    return conjugation;
  }
}

export function getPronounFromForm(formType: string): Pronoun {
  const pronounMap: Record<string, Pronoun> = {
    'form_1s': 'yo',
    'form_2s': 'tú',
    'form_3s': 'él',
    'form_1p': 'nosotros',
    'form_2p': 'ellos', // vosotros maps to ellos for simplicity
    'form_3p': 'ellos'
  };
  
  return pronounMap[formType] || 'yo';
} 