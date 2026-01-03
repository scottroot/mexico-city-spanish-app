import { conjunctionsData } from '@/assets/conjunctions'
import CheatSheet from '../tools/CheatSheet'
import LayoutWrapper from '../tools/LayoutWrapper'

export default function DocsPage() {
  return (
    <LayoutWrapper>
      <section>
        <CheatSheet data={conjunctionsData} columnName="Conjunction" />
      </section>
    </LayoutWrapper>
  )
}
