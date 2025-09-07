/**
 * Example usage of the Deepgram TTS utility
 * This file demonstrates how to use the text-to-speech functionality
 */

import { 
  textToSpeech, 
  textToSpeechBlob, 
  textToSpeechFile,
  streamTextToSpeech,
  streamTextToSpeechForBrowser,
  streamChunkedTextToSpeech,
  segmentTextBySentence,
  streamOptimizedTTS,
  createOptimizedTTSOptions,
  StreamingPerformanceMonitor,
  NetworkPerformanceEstimator,
  BufferPredictor,
  AUDIO_FORMAT_PRESETS,
  getSpanishModels,
  getEnglishModels,
  DEEPGRAM_MODELS,
  type DeepgramTTSOptions,
  type AudioFormatPreset
} from './deepgram';

/**
 * Example: Basic text-to-speech conversion
 */
export async function basicTTSExample() {
  const options: DeepgramTTSOptions = {
    text: "Hello, how can I help you today?",
    model: DEEPGRAM_MODELS['aura-2-thalia-en']
  };

  const result = await textToSpeech(options);
  
  if (result.success && result.audioBuffer) {
    console.log('TTS successful! Audio buffer size:', result.audioBuffer.byteLength);
    console.log('Content type:', result.contentType);
  } else {
    console.error('TTS failed:', result.error);
  }
}

/**
 * Example: Spanish text-to-speech
 */
export async function spanishTTSExample() {
  const options: DeepgramTTSOptions = {
    text: "¡Hola! ¿Cómo estás hoy?",
    model: DEEPGRAM_MODELS['aura-2-luna-es']
  };

  const result = await textToSpeech(options);
  
  if (result.success && result.audioBuffer) {
    console.log('Spanish TTS successful!');
  } else {
    console.error('Spanish TTS failed:', result.error);
  }
}

/**
 * Example: Create blob URL for audio playback in browser
 */
export async function browserTTSExample() {
  const options: DeepgramTTSOptions = {
    text: "This audio will play in your browser",
    model: DEEPGRAM_MODELS['aura-2-stella-en']
  };

  const result = await textToSpeechBlob(options);
  
  if (result.success && result.blobUrl) {
    console.log('Blob URL created:', result.blobUrl);
    
    // You can use this blobUrl in an HTML audio element:
    // <audio src={result.blobUrl} controls />
    
    // Don't forget to revoke the URL when done:
    // URL.revokeObjectURL(result.blobUrl);
  } else {
    console.error('Blob creation failed:', result.error);
  }
}

/**
 * Example: Save audio to file (Node.js environment)
 */
export async function fileTTSExample() {
  const options: DeepgramTTSOptions = {
    text: "This will be saved as an audio file",
    model: DEEPGRAM_MODELS['aura-2-athena-en']
  };

  const result = await textToSpeechFile(options, './output.mp3');
  
  if (result.success) {
    console.log('Audio file saved successfully!');
  } else {
    console.error('File save failed:', result.error);
  }
}

/**
 * Example: List available models
 */
export function listAvailableModels() {
  console.log('Available Spanish models:', getSpanishModels());
  console.log('Available English models:', getEnglishModels());
  console.log('All models:', Object.keys(DEEPGRAM_MODELS));
}

/**
 * Example: Streaming TTS for immediate playback
 */
export async function streamingTTSExample() {
  const options: DeepgramTTSOptions = {
    text: "Hello, this audio will start playing as soon as the first byte arrives!",
    model: DEEPGRAM_MODELS['aura-2-thalia-en']
  };

  const audioChunks: Uint8Array[] = [];
  let totalBytes = 0;

  const result = await streamTextToSpeech(options, (chunk) => {
    audioChunks.push(chunk);
    totalBytes += chunk.length;
    console.log(`Received chunk: ${chunk.length} bytes, total: ${totalBytes} bytes`);
  });

  if (result.success) {
    console.log('Streaming completed successfully!');
    console.log(`Total bytes received: ${result.totalBytes}`);
    
    // Combine all chunks into a single buffer
    const combinedBuffer = new Uint8Array(totalBytes);
    let offset = 0;
    for (const chunk of audioChunks) {
      combinedBuffer.set(chunk, offset);
      offset += chunk.length;
    }
    
    // Create blob and play
    const blob = new Blob([combinedBuffer], { type: 'audio/mpeg' });
    const blobUrl = URL.createObjectURL(blob);
    console.log('Audio ready for playback:', blobUrl);
    
    return blobUrl;
  } else {
    console.error('Streaming failed:', result.error);
  }
}

/**
 * Example: Browser streaming with MediaSource (immediate playback)
 */
export async function browserStreamingExample() {
  const options: DeepgramTTSOptions = {
    text: "This audio will start playing immediately as it streams in!",
    model: DEEPGRAM_MODELS['aura-2-stella-en']
  };

  const result = await streamTextToSpeechForBrowser(options);
  
  if (result.success && result.mediaSourceUrl) {
    console.log('MediaSource URL created:', result.mediaSourceUrl);
    
    // You can use this URL in an HTML audio element:
    // <audio src={result.mediaSourceUrl} controls autoplay />
    
    return result.mediaSourceUrl;
  } else {
    console.error('Browser streaming failed:', result.error);
  }
}

/**
 * Example: Chunked streaming for long text passages
 */
export async function chunkedStreamingExample() {
  const longText = "Our story begins in a peaceful woodland kingdom where a lively squirrel named Frolic made his abode high up within a cedar tree's embrace. He was not a usual woodland creature, for he was blessed with an insatiable curiosity and a heart for adventure. Nearby, a glistening river snaked through the landscape, home to a wonder named Splash - a silver-scaled flying fish whose ability to break free from his water-haven intrigued the woodland onlookers. This magical world moved on a rhythm of its own until an unforeseen circumstance brought Frolic and Splash together.";

  const options: DeepgramTTSOptions = {
    text: longText,
    model: DEEPGRAM_MODELS['aura-2-thalia-en']
  };

  const audioChunks: Uint8Array[] = [];
  let totalBytes = 0;

  const result = await streamChunkedTextToSpeech(
    options,
    (chunk) => {
      audioChunks.push(chunk);
      totalBytes += chunk.length;
      console.log(`Received chunk: ${chunk.length} bytes`);
    },
    (segmentIndex, totalSegments) => {
      console.log(`Completed segment ${segmentIndex} of ${totalSegments}`);
    }
  );

  if (result.success) {
    console.log('Chunked streaming completed!');
    console.log(`Total bytes: ${result.totalBytes}, Segments: ${result.segmentsProcessed}`);
    
    // Combine all chunks
    const combinedBuffer = new Uint8Array(totalBytes);
    let offset = 0;
    for (const chunk of audioChunks) {
      combinedBuffer.set(chunk, offset);
      offset += chunk.length;
    }
    
    const blob = new Blob([combinedBuffer], { type: 'audio/mpeg' });
    const blobUrl = URL.createObjectURL(blob);
    
    return blobUrl;
  } else {
    console.error('Chunked streaming failed:', result.error);
  }
}

/**
 * Example: Text segmentation
 */
export function textSegmentationExample() {
  const text = "Hello world! How are you today? I hope you're doing well. This is a test of sentence segmentation.";
  
  const segments = segmentTextBySentence(text);
  console.log('Original text:', text);
  console.log('Segments:', segments);
  
  return segments;
}

/**
 * Example: React component with streaming
 */
export function ReactStreamingTTSExample() {
  // This would be used in a React component with streaming
  const handleStreamingSpeak = async (text: string) => {
    const options: DeepgramTTSOptions = {
      text,
      model: DEEPGRAM_MODELS['aura-2-thalia-en']
    };

    // For immediate playback in browser
    const result = await streamTextToSpeechForBrowser(options);
    
    if (result.success && result.mediaSourceUrl) {
      const audio = new Audio(result.mediaSourceUrl);
      audio.play();
      
      // Clean up when done
      audio.onended = () => {
        URL.revokeObjectURL(result.mediaSourceUrl!);
      };
      
      return audio;
    }
  };

  const handleChunkedSpeak = async (longText: string) => {
    const options: DeepgramTTSOptions = {
      text: longText,
      model: DEEPGRAM_MODELS['aura-2-thalia-en']
    };

    const audioChunks: Uint8Array[] = [];

    const result = await streamChunkedTextToSpeech(
      options,
      (chunk) => {
        audioChunks.push(chunk);
        console.log('Received audio chunk');
      },
      (segmentIndex, totalSegments) => {
        console.log(`Processing segment ${segmentIndex}/${totalSegments}`);
      }
    );

    if (result.success) {
      // Combine chunks and play
      const totalBytes = audioChunks.reduce((sum, chunk) => sum + chunk.length, 0);
      const combinedBuffer = new Uint8Array(totalBytes);
      let offset = 0;
      
      for (const chunk of audioChunks) {
        combinedBuffer.set(chunk, offset);
        offset += chunk.length;
      }
      
      const blob = new Blob([combinedBuffer], { type: 'audio/mpeg' });
      const blobUrl = URL.createObjectURL(blob);
      
      const audio = new Audio(blobUrl);
      audio.play();
      
      audio.onended = () => {
        URL.revokeObjectURL(blobUrl);
      };
      
      return audio;
    }
  };

  return {
    speakStreaming: handleStreamingSpeak,
    speakChunked: handleChunkedSpeak
  };
}

/**
 * Example: Performance-optimized streaming with automatic network detection
 */
export async function optimizedStreamingExample() {
  const text = "¡Hola! This is an optimized streaming example that automatically adjusts to your network conditions.";
  
  const result = await streamOptimizedTTS(
    text,
    (chunk) => {
      console.log(`Received optimized chunk: ${chunk.length} bytes`);
    },
    DEEPGRAM_MODELS['aura-2-luna-es'] // Spanish voice
  );

  if (result.success) {
    console.log('Optimized streaming completed!');
    console.log(`Preset used: ${result.preset}`);
    console.log(`Total bytes: ${result.totalBytes}`);
    
    if (result.metrics) {
      console.log('Performance metrics:', {
        averageLatency: `${result.metrics.averageLatency.toFixed(2)}ms`,
        networkLatency: `${result.metrics.networkLatency.toFixed(2)}ms`,
        bandwidth: `${(result.metrics.bandwidth / 1000000).toFixed(2)} Mbps`,
        bufferSize: `${result.metrics.bufferSize} bytes`,
        totalChunks: result.metrics.totalChunks
      });
    }
  } else {
    console.error('Optimized streaming failed:', result.error);
  }
}

/**
 * Example: Using specific audio format presets
 */
export async function presetBasedStreamingExample() {
  const text = "This example demonstrates different audio format presets for various network conditions.";
  
  // Test different presets
  const presets: AudioFormatPreset[] = ['LOW_BANDWIDTH', 'MEDIUM_BANDWIDTH', 'HIGH_BANDWIDTH', 'REAL_TIME'];
  
  for (const preset of presets) {
    console.log(`\nTesting ${preset} preset:`);
    console.log('Configuration:', AUDIO_FORMAT_PRESETS[preset]);
    
    const options = createOptimizedTTSOptions(text, preset);
    const performanceMonitor = new StreamingPerformanceMonitor();
    
    const result = await streamTextToSpeech(options, (chunk) => {
      console.log(`  Chunk: ${chunk.length} bytes`);
    }, performanceMonitor);
    
    if (result.success && result.metrics) {
      console.log(`  Completed in ${result.metrics.totalTime.toFixed(2)}ms`);
      console.log(`  Average latency: ${result.metrics.averageLatency.toFixed(2)}ms`);
    }
  }
}

/**
 * Example: Dynamic buffer prediction
 */
export async function dynamicBufferingExample() {
  const bufferPredictor = new BufferPredictor();
  
  console.log('Testing dynamic buffer prediction:');
  
  // Simulate different network conditions
  const testConditions = [
    { latency: 50, bandwidth: 10000000 },   // Fast connection
    { latency: 200, bandwidth: 1000000 },   // Medium connection
    { latency: 500, bandwidth: 500000 },    // Slow connection
    { latency: 1000, bandwidth: 100000 }    // Very slow connection
  ];
  
  for (const condition of testConditions) {
    const bufferSize = bufferPredictor.adjustBufferSize(condition.latency, condition.bandwidth);
    console.log(`Latency: ${condition.latency}ms, Bandwidth: ${condition.bandwidth/1000}Kbps -> Buffer: ${bufferSize} bytes`);
  }
}

/**
 * Example: Network performance estimation
 */
export async function networkPerformanceExample() {
  const networkEstimator = NetworkPerformanceEstimator.getInstance();
  
  console.log('Network Performance Analysis:');
  
  const latency = await networkEstimator.estimateLatency();
  const bandwidth = networkEstimator.estimateBandwidth();
  const optimalPreset = await networkEstimator.getOptimalPreset();
  
  console.log(`Estimated latency: ${latency.toFixed(2)}ms`);
  console.log(`Estimated bandwidth: ${(bandwidth / 1000000).toFixed(2)} Mbps`);
  console.log(`Recommended preset: ${optimalPreset}`);
  console.log(`Preset configuration:`, AUDIO_FORMAT_PRESETS[optimalPreset]);
}

/**
 * Example: Performance monitoring with detailed metrics
 */
export async function performanceMonitoringExample() {
  const text = "This example shows detailed performance monitoring during streaming.";
  const performanceMonitor = new StreamingPerformanceMonitor();
  
  const options: DeepgramTTSOptions = {
    text,
    model: DEEPGRAM_MODELS['aura-2-thalia-en'],
    enableDynamicBuffering: true,
    targetLatency: 100
  };
  
  const result = await streamTextToSpeech(options, (chunk) => {
    console.log(`Received chunk: ${chunk.length} bytes`);
  }, performanceMonitor);
  
  if (result.success && result.metrics) {
    const metrics = result.metrics;
    console.log('\nDetailed Performance Metrics:');
    console.log(`Total bytes transferred: ${metrics.totalBytes}`);
    console.log(`Total chunks received: ${metrics.totalChunks}`);
    console.log(`Average chunk size: ${metrics.averageChunkSize.toFixed(2)} bytes`);
    console.log(`Total streaming time: ${metrics.totalTime.toFixed(2)}ms`);
    console.log(`Average latency per chunk: ${metrics.averageLatency.toFixed(2)}ms`);
    console.log(`Network latency: ${metrics.networkLatency.toFixed(2)}ms`);
    console.log(`Available bandwidth: ${(metrics.bandwidth / 1000000).toFixed(2)} Mbps`);
    console.log(`Optimal buffer size: ${metrics.bufferSize} bytes`);
    
    // Calculate efficiency metrics
    const throughput = (metrics.totalBytes / (metrics.totalTime / 1000)) / 1000; // KB/s
    const efficiency = (metrics.totalBytes / metrics.totalChunks) / metrics.bufferSize;
    
    console.log(`\nEfficiency Metrics:`);
    console.log(`Throughput: ${throughput.toFixed(2)} KB/s`);
    console.log(`Buffer efficiency: ${(efficiency * 100).toFixed(2)}%`);
  }
}

/**
 * Example: React component with performance optimization
 */
export function ReactOptimizedTTSExample() {
  const handleOptimizedSpeak = async (text: string) => {
    console.log('Starting optimized TTS...');
    
    const result = await streamOptimizedTTS(
      text,
      (chunk) => {
        console.log(`Streaming chunk: ${chunk.length} bytes`);
      },
      DEEPGRAM_MODELS['aura-2-luna-es']
    );
    
    if (result.success) {
      console.log(`TTS completed using ${result.preset} preset`);
      console.log(`Performance: ${result.metrics?.averageLatency.toFixed(2)}ms average latency`);
      
      // In a real React component, you would play the audio here
      return result;
    } else {
      console.error('TTS failed:', result.error);
      return null;
    }
  };

  const handleAdaptiveSpeak = async (text: string) => {
    // Get network conditions and choose optimal settings
    const networkEstimator = NetworkPerformanceEstimator.getInstance();
    const preset = await networkEstimator.getOptimalPreset();
    
    console.log(`Using adaptive preset: ${preset}`);
    
    const options = createOptimizedTTSOptions(text, preset, DEEPGRAM_MODELS['aura-2-thalia-en']);
    const performanceMonitor = new StreamingPerformanceMonitor();
    
    const audioChunks: Uint8Array[] = [];
    
    const result = await streamTextToSpeech(options, (chunk) => {
      audioChunks.push(chunk);
      console.log(`Adaptive streaming: ${chunk.length} bytes`);
    }, performanceMonitor);
    
    if (result.success) {
      // Combine chunks and create audio
      const totalBytes = audioChunks.reduce((sum, chunk) => sum + chunk.length, 0);
      const combinedBuffer = new Uint8Array(totalBytes);
      let offset = 0;
      
      for (const chunk of audioChunks) {
        combinedBuffer.set(chunk, offset);
        offset += chunk.length;
      }
      
      const blob = new Blob([combinedBuffer], { type: 'audio/mpeg' });
      const blobUrl = URL.createObjectURL(blob);
      
      console.log(`Adaptive TTS completed with ${result.metrics?.totalChunks} chunks`);
      
      return {
        blobUrl,
        metrics: result.metrics,
        preset
      };
    }
    
    return null;
  };

  return {
    speakOptimized: handleOptimizedSpeak,
    speakAdaptive: handleAdaptiveSpeak
  };
}
