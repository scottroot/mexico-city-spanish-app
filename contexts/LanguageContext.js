'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import esTranslations from '../lib/translations/es.json'
import enTranslations from '../lib/translations/en.json'

const LanguageContext = createContext()

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en') // Default to English
  const [isInitialized, setIsInitialized] = useState(false)
  
  // Load translations directly
  const translations = {
    es: esTranslations,
    en: enTranslations
  }
  
  // // Debug: log available translations
  // console.log('Available translations:', translations)

  // Load saved language preference from localStorage
  useEffect(() => {
    const savedLanguage = localStorage.getItem('app-language')
    if (savedLanguage && (savedLanguage === 'es' || savedLanguage === 'en')) {
      setLanguage(savedLanguage)
    } else {
      // Default to English if no saved preference
      setLanguage('en')
    }
    setIsInitialized(true)
  }, [])

  // Save language preference to localStorage
  const changeLanguage = (newLanguage) => {
    if (newLanguage === 'es' || newLanguage === 'en') {
      setLanguage(newLanguage)
      localStorage.setItem('app-language', newLanguage)
    }
  }

  // Translation function
  const t = (key, fallback = '') => {
    if (!translations[language]) {
      console.warn(`Translations not loaded for language: ${language}`)
      return fallback || key
    }
    
    // Handle nested keys like 'auth.loginButton'
    const keys = key.split('.')
    let value = translations[language]
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k]
      } else {
        console.warn(`Translation key not found: ${key} for language: ${language}`, { value, k, keys })
        return fallback || key
      }
    }
    
    return value || fallback || key
  }

  const value = {
    language,
    changeLanguage,
    t,
    translations: translations[language] || {},
    isInitialized
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}
