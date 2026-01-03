import { conjunctionsData } from '@/assets/conjunctions'
import CheatSheet from '../CheatSheet'
import LayoutWrapper from '../LayoutWrapper'
import ConjunctionsContent from './ConjunctionsContent'
import { FlashCard } from '../FlashCardsComponent'

// Flatten conjunctions for flashcards
const getAllConjunctions = () => {
  const items: Array<{ spanish: string; english: string; examples?: Array<{ spanish: string; translation: string }> }> = []
  conjunctionsData.sections.forEach(section => {
    if (section.items) items.push(...section.items)
    if (section.subsections) {
      section.subsections.forEach(sub => items.push(...sub.items))
    }
  })
  return items
}

const flashCards: FlashCard[] = getAllConjunctions().map(c => ({
  front: c.spanish,
  back: c.english,
  examples: c.examples,
}))

export default function DocsPage() {
  return (
    <LayoutWrapper>
      <div className="space-y-12">
        {/* Flash Cards Toggle - Client Component */}
        <ConjunctionsContent flashCards={flashCards} />

        {/* Cheat Sheet Section - Server Rendered */}
        <section>
          <CheatSheet data={conjunctionsData} columnName="Conjunction" />
        </section>
      </div>
    </LayoutWrapper>
  )
}
