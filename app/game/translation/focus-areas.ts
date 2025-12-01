/**
 * Prompts for the Translation Game
 * These prompts are used to generate translation questions and evaluate answers
 */

export const DEFAULT_FOCUS = `Well rounded grammatical structures and usage of verbs and parts of speech.`;

// const PREPOSITIONS_FOCUS = `
// <focus_area>
// Practice prepositional phrases; provide examples of English sentences whose correct Spanish translations require very common Spanish prepositional phrases.

// You must respond with an English sentence.

// List of Spanish Translations of Prepositions: a base de, a bordo de, a causa de, a cambio de, a cargo de, a consecuencia de, a costa de, a favor de, a falta de, a fin de, a fuerza de, a lo largo de, a partir de, a partir desde, a pesar de, a punta de, a raíz de, a través de, abajo de, adentro de, afuera de, al lado de, alrededor de, ante, antes de, arriba de, bajo, cerca de, con, con base en, con respecto a, con rumbo a, contra, de, de acuerdo con, de lado de, debajo de, debido a, delante de, dentro de, después de, detrás de, durante, en, en busca de, en caso de, en contra de, en dirección a, en frente de, en función de, en lugar de, en medio de, en nombre de, en cuanto a, en torno a, en vez de, en vista de, entre, frente a, hacia, hasta, junto a, junto con, lejos de, mediante, para, por, por alrededor de, por causa de, por culpa de, por dentro, por dentro de, por delante de, por debajo de, por detrás de, por encima de, por fuera, por fuera de, por medio de, por motivo de, por parte de, por razón de, rumbo a, según, sin, sobre, tras, vía

// Do not respond in Spanish; only provide a phrase in English that requires the use of the prepositions in the list above.
// </focus_area>`;

const PREPOSITIONS_FOCUS = `# Focus Area:
Practice translating phrases that when translated into Spanish include prepositional phrases (listed below).

## Complexity
Sentence difficulty (out of max 10 being most difficult) should be between 5 and 8.

## List of Prepositions: "a base de": "by means of, made from", "desde": "from / since (time)", "a bordo de": "aboard, on board", "a causa de": "because of", "a cambio de": "in exchange for", "a cargo de": "in charge of", "a consecuencia de": "as a consequence of", "a costa de": "at the cost of", "a favor de": "in favor of", "a falta de": "lacking, in the absence of", "a fin de": "in order to", "a fuerza de": "by force of", "a lo largo de": "along", "a partir de": "starting from", "a partir desde": "starting from (colloquial variant)", "a pesar de": "despite", "a punta de": "by force of, using", "a raíz de": "as a result of", "a través de": "through", "abajo de": "below", "adentro de": "inside", "afuera de": "outside", "al lado de": "beside", "alrededor de": "around", "ante": "before, in front of", "antes de": "before", "arriba de": "above", "bajo": "under", "cerca de": "near", "con": "with", "con base en": "based on", "con respecto a": "regarding", "con rumbo a": "heading toward", "contra": "against", "de": "of, from", "de acuerdo con": "according to", "de lado de": "on the side of", "debajo de": "underneath", "debido a": "due to", "delante de": "in front of", "dentro de": "inside", "después de": "after", "detrás de": "behind", "durante": "during", "en": "in, on, at", "en busca de": "in search of", "en caso de": "in case of", "en contra de": "against", "en dirección a": "in the direction of", "en frente de": "in front of", "en función de": "depending on, according to", "en lugar de": "instead of", "en medio de": "in the middle of", "en nombre de": "in the name of", "en cuanto a": "regarding", "en torno a": "around, about", "en vez de": "instead of", "en vista de": "in view of", "entre": "between", "frente a": "facing", "hacia": "toward", "hasta": "until, up to", "junto a": "next to", "junto con": "together with", "lejos de": "far from", "mediante": "through/via", "para": "for, in order to", "por": "for, because of, by", "por alrededor de": "around (quantity estimate)", "por causa de": "because of", "por culpa de": "because of, due to someone or something", "por dentro": "inside", "por dentro de": "inside of", "por delante de": "ahead of", "por debajo de": "below", "por detrás de": "behind", "por encima de": "above", "por fuera": "outside", "por fuera de": "outside of", "por medio de": "by means of", "por motivo de": "due to", "por parte de": "on the part of", "por razón de": "on account of", "rumbo a": "toward", "según": "according to", "sin": "without", "sobre": "on, about", "tras": "after, behind", "vía": "via, through"

## Important
Do not respond in Spanish; only provide a phrase in English that requires the use of the prepositions in the list above.
`;

export const CONJUNCTIONS_FOCUS= `# Focus Area
Practice conjunction phrases; provide examples of English sentences whose correct Spanish translations require very common Spanish conjunctions (listed below).

## List of Conjunctions:
"además": "furthermore, also", "al contrario": "on the contrary", "aunque": "although", "aunque sí": "although yes, even if so", "aun así": "even so", "aun cuando": "even when, although", "apenas": "barely, as soon as", "apenas si": "barely", "a fin de que": "so that", "a menos que": "unless", "a no ser que": "unless", "a pesar de que": "despite the fact that", "así como": "just as, as well as", "así pues": "so, thus", "así que": "so, therefore", "bien… bien…": "either… or…", "como": "since, because, as", "como si": "as if", "de ahí que": "hence", "de cualquier manera": "in any way", "de cualquier modo": "in any way", "de todos modos": "anyway", "de todas formas": "in any case", "de manera que": "so that", "de modo que": "so that", "debido a que": "because", "después de que": "after", "e": "and (before i or hi)", "en cambio": "on the other hand", "en caso de que": "in case", "en cuanto": "as soon as", "entonces": "so, then", "es decir": "that is", "esto es": "that is", "incluso": "even", "igual que": "just like", "mientras": "while", "mientras tanto": "meanwhile", "mientras que": "whereas", "mas": "but (formal)", "no obstante": "however", "no solo… sino…": "not only… but…", "no solo… sino también…": "not only… but also…", "o": "or", "ora… ora…": "now… now… (alternation)", "o sea": "that is, I mean", "pese a que": "although, despite the fact that", "pero": "but", "pues": "since, because", "por consiguiente": "consequently", "por ende": "therefore", "por eso": "that is why", "por lo tanto": "therefore", "por tanto": "therefore", "porque": "because", "puesto que": "since, given that", "que": "that (subordinating)", "según": "according to", "si": "if", "siempre que": "as long as", "sino": "but rather", "sino que": "but rather that", "sino también": "but also", "sin embargo": "however", "tan pronto como": "as soon as", "tanto… como…": "both… and…", "tras": "after", "u": "or (before o or ho)", "ya que": "since, because", "ya sea": "whether", "ya sea que": "whether"

## Important
Do not respond in Spanish; only provide a phrase in English that requires the use of the conjunctions in the list above.
`;


export const focusAreas = [
  {
    name: 'Prepositions',
    prompt: PREPOSITIONS_FOCUS,
  },
  {
    name: 'Conjunctions',
    prompt: CONJUNCTIONS_FOCUS,
  },
];