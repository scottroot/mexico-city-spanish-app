import { prepositionsData } from '@/assets/prepositions'
import CheatSheet from '../CheatSheet'
import LayoutWrapper from '../LayoutWrapper'
import FlashCardsToggle from './PrepositionsContent'
import { FlashCard } from '../FlashCardsComponent'

// Flatten prepositions for flashcards
const getAllPrepositions = () => {
  const items: Array<{ spanish: string; english: string }> = []
  prepositionsData.sections.forEach(section => {
    if (section.items) items.push(...section.items)
  })
  return items
}

const flashCards: FlashCard[] = getAllPrepositions().map(p => ({
  front: p.spanish,
  back: p.english,
}))

export default function DocsPage() {
  return (
    <LayoutWrapper>
      <div className="space-y-12">
        {/* Flash Cards Toggle - Client Component */}
        <FlashCardsToggle flashCards={flashCards} />

        {/* Cheat Sheet Section - Server Rendered */}
        <section>
          <CheatSheet data={prepositionsData} columnName="Preposition" />
        </section>
      </div>
    </LayoutWrapper>
  )
}
