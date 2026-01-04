'use client'

import { useState } from 'react'

interface WordItem {
  spanish: string
  english: string
}

interface Subsection {
  title: string
  items: WordItem[]
}

interface Section {
  title?: string
  description?: string
  items?: WordItem[]
  subsections?: Subsection[]
}

interface CheatSheetData {
  title: string
  description: string
  sections: Section[]
}

type CheatSheetProps = {
  data: CheatSheetData
  columnName?: string
}

type SortMode = 'sections' | 'spanish' | 'english'

export default function CheatSheet({ data, columnName = "Word" }: CheatSheetProps) {
  const [sortMode, setSortMode] = useState<SortMode>('sections')

  // Flatten all items from sections and subsections
  const getAllItems = (): WordItem[] => {
    const items: WordItem[] = []
    data.sections.forEach(section => {
      if (section.items) items.push(...section.items)
      if (section.subsections) {
        section.subsections.forEach(sub => items.push(...sub.items))
      }
    })
    return items
  }

  // Get sorted items based on current sort mode
  const getSortedItems = (): WordItem[] => {
    const allItems = getAllItems()
    if (sortMode === 'spanish') {
      return [...allItems].sort((a, b) => a.spanish.localeCompare(b.spanish, 'es'))
    } else if (sortMode === 'english') {
      return [...allItems].sort((a, b) => a.english.localeCompare(b.english, 'en'))
    }
    return allItems
  }

  const renderTable = (items: WordItem[]) => (
    <table className="w-full border-collapse mb-6">
      <thead>
        <tr className="bg-gray-100 border-b-2 border-gray-300">
          <th className="text-left py-3 px-4 font-semibold text-gray-800 w-2/5">{columnName}</th>
          <th className="text-left py-3 px-4 font-semibold text-gray-800 w-3/5">Translation</th>
        </tr>
      </thead>
      <tbody>
        {items.map((item, idx) => (
          <tr
            key={idx}
            className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <td className="py-3 px-4 font-medium text-gray-900">{item.spanish}</td>
            <td className="py-3 px-4 text-gray-700">{item.english}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg print:p-4 print:max-w-full">
      {/* Header */}
      <div className="mb-8 text-center print:mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 print:text-2xl">
          {data.title}
        </h1>
        <p className="text-gray-600 text-sm print:text-xs">
          {data.description}
        </p>

        {/* Sort Mode Controls */}
        <div className="flex justify-center mt-6 print:hidden">
          <div className="inline-flex rounded-lg border border-gray-300 bg-gray-50 p-1">
            <button
              onClick={() => setSortMode('sections')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                sortMode === 'sections'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              By Sections
            </button>
            <button
              onClick={() => setSortMode('spanish')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                sortMode === 'spanish'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              Sort by Spanish
            </button>
            <button
              onClick={() => setSortMode('english')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                sortMode === 'english'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              Sort by English
            </button>
          </div>
        </div>
      </div>

      {/* Content based on sort mode */}
      {sortMode === 'sections' ? (
        // Original sections view
        data.sections.map((section, sectionIdx) => (
          <section key={sectionIdx} className="mb-10 print:mb-8">
            {/* Section header (optional) */}
            {section.title && (
              <div className={section.subsections ? "mb-6" : "mb-4"}>
                <h2 className="text-2xl font-bold text-gray-900 mb-2 print:text-xl">
                  {section.title}
                </h2>
                {section.description && (
                  <p className="text-gray-600 text-sm italic print:text-xs">
                    {section.description}
                  </p>
                )}
              </div>
            )}

            {/* Simple items */}
            {section.items && renderTable(section.items)}

            {/* Subsections */}
            {section.subsections && section.subsections.map((subsection, subIdx) => (
              <div key={subIdx} className="mb-6 print:mb-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-3 print:text-base">
                  {subsection.title}
                </h3>
                {renderTable(subsection.items)}
              </div>
            ))}
          </section>
        ))
      ) : (
        // Sorted flat list view
        <div className="mb-10">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            {sortMode === 'spanish' ? 'Sorted by Spanish (A-Z)' : 'Sorted by English (A-Z)'}
          </h2>
          {renderTable(getSortedItems())}
        </div>
      )}
    </div>
  )
}
