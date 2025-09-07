/**
 * Client-side TTS utility that calls our server-side API
 */

export async function playTTS(text, model = null) {
  try {
    console.log('Client-side TTS request:', { text, model });
    
    const params = new URLSearchParams({ text });
    if (model) params.append('model', model);

    const response = await fetch(`/api/tts?${params.toString()}`);

    if (!response.ok) {
      // If there's error, the route returns JSON with message...
      try {
        const errorResult = await response.json();
        if (errorResult.fallback) {
          const error = new Error('TTS service unavailable, using fallback');
          error.fallback = true;
          throw error;
        }
        throw new Error(errorResult.error || 'TTS API request failed');
      } catch (parseError) {
        throw new Error(`TTS API request failed: ${response.status} ${response.statusText}`);
      }
    }
    
    // Check if response is audio content
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('audio/')) {
      // Convert response to blob and play
      const arrayBuffer = await response.arrayBuffer();
      const blob = new Blob([arrayBuffer], { type: contentType });
      const blobUrl = URL.createObjectURL(blob);
      
      // Create and play audio
      const audio = new Audio(blobUrl);
      
      return new Promise((resolve, reject) => {
        audio.onended = () => {
          URL.revokeObjectURL(blobUrl);
          resolve();
        };
        audio.onerror = (error) => {
          URL.revokeObjectURL(blobUrl);
          console.error('Audio playback error:', error);
          reject(error);
        };
        audio.onloadstart = () => {
          console.log('Audio started loading');
        };
        audio.oncanplay = () => {
          console.log('Audio can start playing');
        };
        audio.onloadeddata = () => {
          console.log('Audio data loaded');
        };
        audio.play().catch(reject);
      });
    } else {
      // Fallback: try to parse as JSON (for backward compatibility)
      const result = await response.json();
      if (result.success && result.audioData) {
        // Convert base64 back to blob
        const binaryString = atob(result.audioData);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        const blob = new Blob([bytes], { type: result.contentType || 'audio/mpeg' });
        const blobUrl = URL.createObjectURL(blob);
        
        // Create and play audio
        const audio = new Audio(blobUrl);
        
        return new Promise((resolve, reject) => {
          audio.onended = () => {
            URL.revokeObjectURL(blobUrl);
            resolve();
          };
          audio.onerror = (error) => {
            URL.revokeObjectURL(blobUrl);
            reject(error);
          };
          audio.play().catch(reject);
        });
      } else {
        throw new Error(result.error || 'TTS generation failed');
      }
    }
  } catch (error) {
    console.error('Client-side TTS error:', error);
    throw error;
  }
}

export function fallbackTTS(text) {
  if (!('speechSynthesis' in window)) {
    console.error('Speech synthesis not supported in this browser');
    return;
  }
  
  try {
    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-MX';
    utterance.rate = 0.8;
    utterance.volume = 1.0;
    speechSynthesis.speak(utterance);
    console.log('Fallback TTS initiated');
  } catch (error) {
    console.error('Error with fallback speech synthesis:', error);
  }
}