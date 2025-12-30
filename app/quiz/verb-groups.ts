import { QuizConfig } from "@/types/quiz";


export interface VerbGroup {
  id: string
  name: string
  description: string
  category: 'frequency' | 'thematic' | 'level'
  verbs: string[] // array of verb infinitives
  displayOrder: number
}

export const VERB_GROUPS: VerbGroup[] = [
  // Frequency-based groups
  {
    id: 'top-25',
    name: 'Top 25 Verbs',
    description: 'The 25 most commonly used Spanish verbs',
    category: 'frequency',
    verbs: [
      'ser', 'estar', 'haber', 'tener', 'hacer', 'poder', 'decir', 'ir',
      'ver', 'dar', 'saber', 'querer', 'llegar', 'pasar', 'deber',
      'poner', 'parecer', 'quedar', 'creer', 'hablar', 'llevar', 'dejar',
      'seguir', 'encontrar', 'llamar'
    ],
    displayOrder: 1
  },
  {
    id: 'top-50',
    name: 'Top 50 Verbs',
    description: 'The 50 most frequently used Spanish verbs',
    category: 'frequency',
    verbs: [
      'ser', 'estar', 'haber', 'tener', 'hacer', 'poder', 'decir', 'ir',
      'ver', 'dar', 'saber', 'querer', 'llegar', 'pasar', 'deber',
      'poner', 'parecer', 'quedar', 'creer', 'hablar', 'llevar', 'dejar',
      'seguir', 'encontrar', 'llamar', 'venir', 'pensar', 'salir', 'volver',
      'tomar', 'conocer', 'vivir', 'sentir', 'tratar', 'mirar', 'contar',
      'empezar', 'esperar', 'buscar', 'existir', 'entrar', 'trabajar',
      'escribir', 'perder', 'producir', 'ocurrir', 'entender', 'pedir',
      'recibir', 'recordar'
    ],
    displayOrder: 2
  },
  {
    id: 'top-100',
    name: 'Top 100 Verbs',
    description: 'The 100 most essential Spanish verbs',
    category: 'frequency',
    verbs: [
      'ser', 'estar', 'haber', 'tener', 'hacer', 'poder', 'decir', 'ir',
      'ver', 'dar', 'saber', 'querer', 'llegar', 'pasar', 'deber',
      'poner', 'parecer', 'quedar', 'creer', 'hablar', 'llevar', 'dejar',
      'seguir', 'encontrar', 'llamar', 'venir', 'pensar', 'salir', 'volver',
      'tomar', 'conocer', 'vivir', 'sentir', 'tratar', 'mirar', 'contar',
      'empezar', 'esperar', 'buscar', 'existir', 'entrar', 'trabajar',
      'escribir', 'perder', 'producir', 'ocurrir', 'entender', 'pedir',
      'recibir', 'recordar', 'terminar', 'permitir', 'aparecer', 'conseguir',
      'comenzar', 'servir', 'sacar', 'necesitar', 'mantener', 'resultar',
      'leer', 'caer', 'cambiar', 'presentar', 'crear', 'abrir', 'considerar',
      'oír', 'acabar', 'suponer', 'comprender', 'lograr', 'explicar',
      'reconocer', 'estudiar', 'intentar', 'usar', 'nacer', 'mandar',
      'morir', 'ofrecer', 'subir', 'aprender', 'gustar', 'correr',
      'preguntar', 'importar', 'cumplir', 'echar', 'tirar', 'añadir',
      'ganar', 'valer', 'constituir', 'formar', 'ayudar', 'responder',
      'preferir', 'atender'
    ],
    displayOrder: 3
  },

  // Thematic groups
  {
    id: 'travel',
    name: 'Travel & Tourism',
    description: 'Essential verbs for traveling and tourism',
    category: 'thematic',
    verbs: [
      'viajar', 'visitar', 'llegar', 'salir', 'ir', 'venir', 'volver',
      'reservar', 'registrarse', 'hospedarse', 'alojarse', 'quedarse',
      'explorar', 'pasear', 'caminar', 'conducir', 'volar', 'aterrizar',
      'despegar', 'embarcar', 'desembarcar', 'facturar', 'buscar',
      'encontrar', 'perderse', 'orientarse', 'preguntar', 'recomendar',
      'fotografiar', 'comprar', 'pagar'
    ],
    displayOrder: 4
  },
  {
    id: 'food',
    name: 'Food & Dining',
    description: 'Verbs related to food, cooking, and dining',
    category: 'thematic',
    verbs: [
      'comer', 'beber', 'tomar', 'cocinar', 'preparar', 'hornear',
      'freír', 'hervir', 'asar', 'cortar', 'picar', 'mezclar',
      'batir', 'pelar', 'lavar', 'servir', 'pedir', 'ordenar',
      'probar', 'degustar', 'saborear', 'cenar', 'desayunar', 'almorzar',
      'merendar', 'reservar', 'recomendar', 'pagar', 'invitar', 'compartir'
    ],
    displayOrder: 5
  },
  {
    id: 'work',
    name: 'Work & Office',
    description: 'Common verbs for workplace and professional contexts',
    category: 'thematic',
    verbs: [
      'trabajar', 'escribir', 'leer', 'enviar', 'recibir', 'llamar',
      'contestar', 'responder', 'reunirse', 'presentar', 'explicar',
      'discutir', 'negociar', 'acordar', 'decidir', 'planificar',
      'organizar', 'gestionar', 'dirigir', 'supervisar', 'colaborar',
      'ayudar', 'asistir', 'archivar', 'imprimir', 'copiar',
      'firmar', 'revisar', 'corregir', 'aprobar'
    ],
    displayOrder: 6
  },
  {
    id: 'daily-routine',
    name: 'Daily Routine',
    description: 'Verbs for everyday activities and routines',
    category: 'thematic',
    verbs: [
      'despertarse', 'levantarse', 'ducharse', 'bañarse', 'lavarse',
      'afeitarse', 'peinarse', 'cepillarse', 'vestirse', 'ponerse',
      'quitarse', 'desayunar', 'almorzar', 'cenar', 'comer',
      'beber', 'dormir', 'acostarse', 'descansar', 'relajarse',
      'limpiar', 'ordenar', 'hacer', 'salir', 'volver',
      'llegar', 'ir', 'venir', 'trabajar', 'estudiar'
    ],
    displayOrder: 7
  },
  {
    id: 'communication',
    name: 'Communication',
    description: 'Verbs for speaking, writing, and communicating',
    category: 'thematic',
    verbs: [
      'hablar', 'decir', 'contar', 'explicar', 'comunicar', 'expresar',
      'mencionar', 'comentar', 'opinar', 'discutir', 'debatir',
      'preguntar', 'responder', 'contestar', 'llamar', 'gritar',
      'susurrar', 'murmurar', 'escribir', 'leer', 'enviar',
      'recibir', 'mandar', 'escuchar', 'oír', 'entender',
      'comprender', 'traducir', 'interpretar', 'conversar'
    ],
    displayOrder: 8
  },
  {
    id: 'household',
    name: 'Household & Chores',
    description: 'Verbs for home activities and household tasks',
    category: 'thematic',
    verbs: [
      'limpiar', 'barrer', 'trapear', 'aspirar', 'sacudir',
      'lavar', 'secar', 'planchar', 'doblar', 'guardar',
      'ordenar', 'organizar', 'cocinar', 'preparar', 'calentar',
      'fregar', 'regar', 'cortar', 'podar', 'arreglar',
      'reparar', 'pintar', 'decorar', 'sacar', 'tirar',
      'reciclar', 'comprar', 'hacer', 'poner', 'quitar'
    ],
    displayOrder: 9
  },
  {
    id: 'emotions',
    name: 'Emotions & Feelings',
    description: 'Verbs expressing emotions and feelings',
    category: 'thematic',
    verbs: [
      'sentir', 'amar', 'querer', 'odiar', 'gustar', 'encantar',
      'molestar', 'fastidiar', 'preocupar', 'tranquilizar', 'calmar',
      'alegrar', 'entristecer', 'enojar', 'enfadar', 'irritar',
      'sorprender', 'asombrar', 'asustar', 'temer', 'esperar',
      'desear', 'anhelar', 'disfrutar', 'gozar', 'sufrir',
      'llorar', 'reír', 'sonreír', 'emocionar'
    ],
    displayOrder: 10
  }
]

// Helper function to get a verb group by ID
export function getVerbGroupById(id: string): VerbGroup | undefined {
  return VERB_GROUPS.find(group => group.id === id)
}

// Helper function to get all verb groups by category
export function getVerbGroupsByCategory(category: VerbGroup['category']): VerbGroup[] {
  return VERB_GROUPS.filter(group => group.category === category)
}

// Helper function to validate that all verbs in groups are unique within each group
export function validateVerbGroups(): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  VERB_GROUPS.forEach(group => {
    const uniqueVerbs = new Set(group.verbs)
    if (uniqueVerbs.size !== group.verbs.length) {
      errors.push(`Group "${group.name}" contains duplicate verbs`)
    }
  })

  return {
    valid: errors.length === 0,
    errors
  }
}

export const defaultConfig: QuizConfig = {
  selectedTenseMoods: [],
  verbSelection: 'preset',
  customVerbs: getVerbGroupById('top-100')?.verbs || [],
  presetGroupId: 'top-100',
  selectedPronouns: ['yo', 'tú', 'él', 'nosotros', 'ustedes', 'ellos'],
  questionCount: 10
};