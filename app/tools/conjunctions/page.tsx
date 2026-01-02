import ConjunctionsCheatSheet from '@/assets/cheat-sheets/conjunctions'
import LayoutWrapper from '../LayoutWrapper'
import ConjunctionsContent from './ConjunctionsContent'
import { FlashCard } from '../FlashCardsComponent'

// Conjunctions data shared between cheat sheet and flash cards
const conjunctionsData = [
  // Coordinating conjunctions
  { spanish: "y", english: "and" },
  { spanish: "e", english: "and (before i, hi)" },
  { spanish: "o", english: "or" },
  { spanish: "u", english: "or (before o, ho)" },
  { spanish: "pero", english: "but" },
  { spanish: "mas", english: "but (formal)" },
  { spanish: "sino", english: "but rather" },
  { spanish: "sino que", english: "but rather that" },
  { spanish: "sino también", english: "but also" },
  { spanish: "no solo… sino…", english: "not only… but…" },
  { spanish: "no solo… sino también…", english: "not only… but also…" },
  { spanish: "bien… bien…", english: "either… or…" },
  { spanish: "ora… ora…", english: "now… now…" },
  { spanish: "además", english: "furthermore, also" },
  { spanish: "en cambio", english: "on the other hand" },
  { spanish: "incluso", english: "even" },
  { spanish: "así como", english: "just as, as well as" },
  { spanish: "igual que", english: "just like" },
  { spanish: "mientras tanto", english: "meanwhile" },
  { spanish: "al contrario", english: "on the contrary" },
  { spanish: "aun así", english: "even so" },
  { spanish: "de cualquier manera", english: "in any way" },
  { spanish: "de cualquier modo", english: "in any way" },
  { spanish: "de todos modos", english: "anyway" },
  { spanish: "de todas formas", english: "in any case" },
  { spanish: "sin embargo", english: "however" },
  { spanish: "no obstante", english: "however" },
  { spanish: "entonces", english: "so, then" },
  { spanish: "así pues", english: "so, thus" },
  { spanish: "así que", english: "so, therefore" },
  { spanish: "por eso", english: "that is why" },
  { spanish: "por lo tanto", english: "therefore" },
  { spanish: "por tanto", english: "therefore" },
  { spanish: "por consiguiente", english: "consequently" },
  { spanish: "por ende", english: "therefore" },
  { spanish: "esto es", english: "that is" },
  { spanish: "es decir", english: "that is" },
  { spanish: "o sea", english: "that is, I mean" },

  // Subordinating - Causal
  { spanish: "porque", english: "because" },
  { spanish: "como", english: "since, because, as" },
  { spanish: "debido a que", english: "because" },
  { spanish: "puesto que", english: "since, given that" },
  { spanish: "ya que", english: "since, because" },
  { spanish: "pues", english: "since, because" },
  { spanish: "de ahí que", english: "hence" },

  // Subordinating - Conditional
  { spanish: "si", english: "if" },
  { spanish: "siempre que", english: "as long as" },
  { spanish: "a menos que", english: "unless" },
  { spanish: "a no ser que", english: "unless" },
  { spanish: "en caso de que", english: "in case" },

  // Subordinating - Concessive
  { spanish: "aunque", english: "although" },
  { spanish: "aunque sí", english: "although yes, even if so" },
  { spanish: "aun cuando", english: "even when, although" },
  { spanish: "pese a que", english: "although, despite the fact that" },
  { spanish: "a pesar de que", english: "despite the fact that" },

  // Subordinating - Temporal
  { spanish: "cuando", english: "when" },
  { spanish: "tan pronto como", english: "as soon as" },
  { spanish: "en cuanto", english: "as soon as" },
  { spanish: "apenas", english: "as soon as, barely" },
  { spanish: "apenas si", english: "barely" },
  { spanish: "después de que", english: "after" },
  { spanish: "tras", english: "after" },
  { spanish: "mientras", english: "while" },
  { spanish: "mientras que", english: "whereas" },

  // Subordinating - Final (purpose)
  { spanish: "a fin de que", english: "so that" },
  { spanish: "de manera que", english: "so that" },
  { spanish: "de modo que", english: "so that" },

  // Subordinating - Comparative
  { spanish: "como si", english: "as if" },

  // Subordinating - Declarative
  { spanish: "que", english: "that (subordinating)" },

  // Subordinating - Other
  { spanish: "según", english: "according to" },
  { spanish: "ya sea que", english: "whether" },

  // Correlative
  { spanish: "tanto… como…", english: "both… and…" },
  { spanish: "ya sea… ya sea…", english: "whether… or…" },
  { spanish: "ya sea / ya sea que", english: "whether" },
]

// Convert to flash card format
const flashCards: FlashCard[] = conjunctionsData.map(c => ({
  front: c.spanish,
  back: c.english,
}))

export default function DocsPage() {
  return (
    <LayoutWrapper>
      <div className="space-y-12">
        {/* Flash Cards Toggle - Client Component */}
        <ConjunctionsContent flashCards={flashCards} />

        {/* Cheat Sheet Section - Server Rendered */}
        <section>
          <ConjunctionsCheatSheet />
        </section>
      </div>
    </LayoutWrapper>
  )
}
