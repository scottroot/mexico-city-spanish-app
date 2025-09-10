'use client'

import React, { useState, useRef, useEffect } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { Globe, Check, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import ClickAway from '../ClickAway'

const LANGUAGES = [
  { code: 'es', name: 'Español', flag: '🇲🇽' },
  { code: 'en', name: 'English', flag: '🇺🇸' }
]

export default function LanguageToggle() {
  const { language, changeLanguage, t } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState(null)
  const dropdownRef = useRef(null)
  const timeoutRef = useRef(null)

  const currentLanguage = LANGUAGES.find(lang => lang.code === language)

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  // // Close dropdown when clicking outside
  // useEffect(() => {
  //   const handleClickOutside = (event) => {
  //     if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
  //       setIsOpen(false)
  //     }
  //   }

  //   document.addEventListener('mousedown', handleClickOutside)
  //   return () => {
  //     document.removeEventListener('mousedown', handleClickOutside)
  //   }
  // }, [])

  const handleCloseModal = () => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setIsOpen(false)
    setSelectedLanguage(null)
  }

  const handleLanguageChange = (langCode) => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    
    // Show visual feedback by setting the selected language
    setSelectedLanguage(langCode)
    
    // Change the language immediately
    changeLanguage(langCode)
    
    // Close the modal after a short delay to show the selection
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false)
      setSelectedLanguage(null) // Reset selection state
    }, 600) // 600ms delay to show the selection feedback
  }

  return (
    <ClickAway onClickAway={handleCloseModal}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center max-xl:justify-center xl:px-2 py-2 w-full gap-2 rounded-lg 
        hover:bg-orange-50 transition-colors"
        aria-label="Change language"
      >
        <Globe className="hidden xl:block w-5 h-5 text-gray-600" />
        <span className="text-lg leading-none">{currentLanguage?.flag}</span>
        <span className="hidden xl:block text-sm font-medium text-gray-700">
          {currentLanguage?.name}
        </span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 flex items-center justify-center"
            onClick={handleCloseModal}
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
            
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="relative z-100 bg-white rounded-xl shadow-2xl border border-gray-200 p-6 w-80 max-w-[90vw]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-800">Select Language</h3>
                <button
                  onClick={handleCloseModal}
                  className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Language Options */}
              <div className="space-y-2">
                {LANGUAGES.map((lang) => {
                  const isCurrentLanguage = language === lang.code
                  const isSelected = selectedLanguage === lang.code
                  
                  return (
                    <motion.button
                      key={lang.code}
                      onClick={() => handleLanguageChange(lang.code)}
                      className={`w-full flex items-center gap-4 p-4 rounded-lg transition-all duration-300 ${
                        isCurrentLanguage || isSelected
                          ? 'bg-orange-50 border-2 border-orange-200'
                          : 'hover:bg-gray-50 border-2 border-transparent'
                      }`}
                      whileTap={{ scale: 0.98 }}
                      animate={isSelected ? { 
                        backgroundColor: 'rgb(255 237 213)', // orange-50
                        borderColor: 'rgb(251 146 60)', // orange-400
                        scale: 1.02
                      } : {}}
                      transition={{ duration: 0.2 }}
                    >
                      <span className="text-2xl">{lang.flag}</span>
                      <span className="flex-1 text-left font-medium text-gray-800">
                        {lang.name}
                      </span>
                      {(isCurrentLanguage || isSelected) && (
                        <motion.div
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: isSelected ? 0.1 : 0, duration: 0.2 }}
                        >
                          <Check className="w-5 h-5 text-orange-500" />
                        </motion.div>
                      )}
                    </motion.button>
                  )
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </ClickAway>
  )
}
