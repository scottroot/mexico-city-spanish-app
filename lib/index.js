// Utility functions for the Spanish Language App

export const createPageUrl = (pageName) => {
  const routes = {
    'Home': '/',
    'Game': '/game',
    'Progress': '/progress'
  }
  return routes[pageName] || '/'
}

// Re-export Deepgram TTS utilities
export * from './deepgram'
