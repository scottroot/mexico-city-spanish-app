import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { QuizConfig, VerbOption, TenseOption, PronounOption } from "@/types/quiz";
import { motion } from "framer-motion";
import { Search, X } from "lucide-react";
import React from "react";
import { State } from "@hookstate/core";


export function VerbSelectionModal({
  modalOpen,
  setModalOpen,
  searchTerm,
  setSearchTerm,
  availableVerbs,
  configState,
  handleVerbToggle
}: {
  modalOpen: boolean;
  setModalOpen: (open: boolean) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  availableVerbs: VerbOption[];
  configState: State<QuizConfig>;
  handleVerbToggle: (verb: VerbOption) => void;
}) {
  // Don't render if modal is closed
  if (!modalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => setModalOpen(false)}
      />
      
      {/* Modal */}
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="relative bg-white rounded-t-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800">
              Select Verbs
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setModalOpen(false)}
              className="p-2"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>
        
        {/* Search */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder='Search verbs...'
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Content */}
        <div className="px-6 pb-24 max-h-[60vh] overflow-y-auto">
          {(() => {
            const filteredVerbs = availableVerbs.filter(verb =>
              verb.infinitive.toLowerCase().includes(searchTerm.toLowerCase()) ||
              verb.infinitiveEnglish.toLowerCase().includes(searchTerm.toLowerCase())
            );

            // Separate selected and unselected verbs
            const selectedVerbs = filteredVerbs.filter(verb =>
              configState.customVerbs.get().includes(verb.infinitive)
            );
            const unselectedVerbs = filteredVerbs.filter(verb =>
              !configState.customVerbs.get().includes(verb.infinitive)
            );

            return (
              <div className="space-y-2">
                {/* Selected verbs first */}
                {selectedVerbs.length > 0 && (
                  <>
                    <div className="sticky top-0 bg-white py-2 border-b border-pink-200">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xs font-semibold text-pink-700 uppercase tracking-wide">
                          Selected ({selectedVerbs.length})
                        </h3>
                        <button
                          onClick={() => configState.customVerbs.set([])}
                          className="text-xs text-pink-600 hover:text-pink-700 underline cursor-pointer"
                        >
                          Deselect all
                        </button>
                      </div>
                    </div>
                    {selectedVerbs.map((verb) => (
                      <label
                        key={verb.infinitive}
                        className="flex items-center space-x-3 px-3 py-1 rounded-lg bg-pink-50 hover:bg-pink-100 cursor-pointer transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={true}
                          onChange={() => handleVerbToggle(verb)}
                          className="w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-0"
                        />
                        <div className="sm:items-center sm:justify-between sm:flex sm:flex-row flex-1">
                          <div className="font-medium text-gray-900">
                            {verb.infinitive}
                          </div>
                          <div className="text-sm text-gray-500">
                            {verb.infinitiveEnglish}
                          </div>
                        </div>
                      </label>
                    ))}
                  </>
                )}

                {/* Divider */}
                {selectedVerbs.length > 0 && unselectedVerbs.length > 0 && (
                  <div className="sticky top-0 bg-white py-2 border-b border-gray-200">
                    <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                      All Verbs
                    </h3>
                  </div>
                )}

                {/* Unselected verbs */}
                {unselectedVerbs.map((verb) => (
                  <label
                    key={verb.infinitive}
                    className="flex items-center space-x-3 px-3 py-1 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={false}
                      onChange={() => handleVerbToggle(verb)}
                      className="w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-0"
                    />
                    <div className="sm:items-center sm:justify-between sm:flex sm:flex-row flex-1">
                      <div className="font-medium text-gray-900">
                        {verb.infinitive}
                      </div>
                      <div className="text-sm text-gray-500">
                        {verb.infinitiveEnglish}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            );
          })()}
        </div>
        
        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">
              {configState.customVerbs.get().length} verbs selected
            </span>
            <Button
              onClick={() => setModalOpen(false)}
              className="bg-pink-500 hover:bg-pink-600 text-white cursor-pointer"
            >
              Confirm
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export function TenseSelectionModal({
  modalOpen,
  setModalOpen,
  tenseOptions,
  config,
  tensesByMood,
  handleTenseToggle,
  handleSelectAllTenses
}: {
  modalOpen: boolean;
  setModalOpen: (open: boolean) => void;
  tenseOptions: TenseOption[];
  config: QuizConfig;
  tensesByMood: Record<string, TenseOption[]>;
  handleTenseToggle: (tense: TenseOption) => void;
  handleSelectAllTenses: () => void;
}) {
  // Don't render if modal is closed
  if (!modalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => setModalOpen(false)}
      />

      {/* Modal */}
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="relative bg-white rounded-t-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800">
              Select Tenses
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setModalOpen(false)}
              className="p-2"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-4 max-h-[60vh] overflow-y-auto">
          <div className="space-y-2">
            {/* Select All Tenses */}
            <div className="border-b border-gray-200 pb-4">
              <label className="flex items-center space-x-3 px-3 py-1 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={tenseOptions.every(tense => config.selectedTenseMoods.includes(`${tense.value}-${tense.mood}`))}
                  onChange={handleSelectAllTenses}
                  className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-0"
                />
                <div className="flex flex-row items-center justify-between w-full">
                  <div className="text-gray-900">
                    Select All
                  </div>
                  <div className="text-gray-500">
                    Select or deselect all tenses
                  </div>
                </div>
              </label>
            </div>

            {Object.entries(tensesByMood).map(([mood, tenses]) => (
              <div key={mood} className="">
                <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-3">
                  {tenses[0].moodEnglish}
                </h3>
                <div className="space-y-2">
                  {tenses.map((tense) => {
                    const tenseKey = `${tense.value}-${tense.mood}`;
                    const isSelected = config.selectedTenseMoods.includes(tenseKey);
                    return (
                      <label
                        key={tenseKey}
                        className="flex items-center space-x-3 px-3 py-1 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleTenseToggle(tense)}
                          className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-0"
                        />
                        <div className="sm:items-center sm:justify-between sm:flex sm:flex-row flex-1">
                          <div className="font-medium text-gray-900">
                            {tense.labelEnglish}
                          </div>
                          <div className="text-sm text-gray-500">
                            {tense.label}
                          </div>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">
              {config.selectedTenseMoods.length} tenses selected
            </span>
            <Button
              onClick={() => setModalOpen(false)}
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              Confirm
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export function PronounSelectionModal({
  modalOpen,
  setModalOpen,
  pronounOptions,
  config,
  handlePronounToggle
}: {
  modalOpen: boolean;
  setModalOpen: (open: boolean) => void;
  pronounOptions: PronounOption[];
  config: QuizConfig;
  handlePronounToggle: (pronoun: PronounOption) => void;
}) {
  // Don't render if modal is closed
  if (!modalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => setModalOpen(false)}
      />

      {/* Modal */}
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="relative bg-white rounded-t-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800">
              Select Pronouns
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setModalOpen(false)}
              className="p-2"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-4 max-h-[60vh] overflow-y-auto">
          <div className="space-y-2">
            {pronounOptions.map((pronoun) => {
              const isSelected = config.selectedPronouns.includes(pronoun.value);
              return (
                <label
                  key={pronoun.value}
                  className="flex items-center space-x-3 px-3 py-1 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => handlePronounToggle(pronoun)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-0"
                  />
                  <div className="sm:items-center sm:justify-between sm:flex sm:flex-row flex-1">
                    <div className="font-medium text-gray-900">
                      {pronoun.label}
                    </div>
                    <div className="text-sm text-gray-500">
                      {pronoun.labelEnglish}
                    </div>
                  </div>
                </label>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">
              {config.selectedPronouns.length} pronouns selected
            </span>
            <Button
              onClick={() => setModalOpen(false)}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              Confirm
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}