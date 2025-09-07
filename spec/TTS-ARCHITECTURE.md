# TTS System Architecture

## Overview

The Text-to-Speech (TTS) system is a comprehensive solution for real-time audio generation using Deepgram's API. It's designed for optimal performance, network adaptation, and seamless integration with the Spanish Language Learning App.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    TTS System Architecture                  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────┐    ┌─────────────────────────────────┐ │
│  │   Application   │    │        TTS Core Layer          │ │
│  │     Layer       │    │                                 │ │
│  │                 │    │  ┌─────────────────────────────┐ │ │
│  │ • React Components│   │  │    Streaming Functions     │ │ │
│  │ • Game Logic    │◄──►│  │                             │ │ │
│  │ • User Interface│    │  │ • streamTextToSpeech()     │ │ │
│  │                 │    │  │ • streamOptimizedTTS()     │ │ │
│  └─────────────────┘    │  │ • streamChunkedTextToSpeech│ │ │
│                         │  └─────────────────────────────┘ │ │
│                         │                                 │ │
│                         │  ┌─────────────────────────────┐ │ │
│                         │  │   Performance Layer        │ │ │
│                         │  │                             │ │ │
│                         │  │ • StreamingPerformanceMonitor│ │ │
│                         │  │ • NetworkPerformanceEstimator│ │ │
│                         │  │ • BufferPredictor          │ │ │
│                         │  └─────────────────────────────┘ │ │
│                         │                                 │ │
│                         │  ┌─────────────────────────────┐ │ │
│                         │  │    Audio Format Layer      │ │ │
│                         │  │                             │ │ │
│                         │  │ • AUDIO_FORMAT_PRESETS     │ │ │
│                         │  │ • createOptimizedTTSOptions│ │ │
│                         │  │ • createAutoOptimizedTTSOptions│ │ │
│                         │  └─────────────────────────────┘ │ │
│                         └─────────────────────────────────┘ │
│                                                             │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │              Deepgram API Integration                   │ │
│  │                                                         │ │
│  │ • REST API Calls                                       │ │
│  │ • Streaming Response Handling                          │ │
│  │ • Error Handling & Retry Logic                        │ │
│  │ • Authentication & Rate Limiting                      │ │
│  └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## Core Components

### 1. Streaming Functions Layer

#### `streamTextToSpeech(options, onChunk, performanceMonitor)`
- **Purpose**: Core streaming function with performance monitoring
- **Features**: 
  - Real-time chunk processing
  - Network condition adaptation
  - Performance metrics collection
- **Input**: TTS options, chunk callback, optional performance monitor
- **Output**: Streaming result with metrics

#### `streamTextToSpeechForBrowser(options)`
- **Purpose**: Browser-optimized streaming with MediaSource API
- **Features**:
  - Immediate audio playback
  - MediaSource integration
  - Automatic buffer management
- **Input**: TTS options
- **Output**: MediaSource URL for audio playback

#### `streamChunkedTextToSpeech(options, onChunk, onSegmentComplete)`
- **Purpose**: Long text streaming with sentence segmentation
- **Features**:
  - Automatic text segmentation
  - Progress tracking per segment
  - Efficient memory usage
- **Input**: TTS options, chunk callback, segment completion callback
- **Output**: Streaming result with segment metrics

### 2. Performance Layer

#### `StreamingPerformanceMonitor`
```typescript
class StreamingPerformanceMonitor {
  // Tracks real-time performance metrics
  startMonitoring(): void
  recordChunk(chunkSize: number): void
  updateNetworkMetrics(latency: number, bandwidth: number): void
  finishMonitoring(): StreamingMetrics
}
```

**Key Metrics Tracked**:
- Total bytes transferred
- Chunk count and average size
- Network latency and bandwidth
- Buffer efficiency
- Throughput calculations

#### `NetworkPerformanceEstimator`
```typescript
class NetworkPerformanceEstimator {
  // Singleton for network condition detection
  static getInstance(): NetworkPerformanceEstimator
  estimateLatency(): Promise<number>
  estimateBandwidth(): number
  getOptimalPreset(): Promise<AudioFormatPreset>
}
```

**Network Detection Methods**:
- Navigator Connection API integration
- Latency estimation via API calls
- Bandwidth estimation based on connection type
- Automatic preset selection

#### `BufferPredictor`
```typescript
class BufferPredictor {
  // Dynamic buffer size optimization
  adjustBufferSize(networkLatency: number, bandwidth: number): number
  getCurrentBufferSize(): number
  reset(): void
}
```

**Buffer Optimization Algorithm**:
- Historical network condition tracking
- Latency-based buffer adjustment
- Bandwidth-based optimization
- Constraint enforcement (1KB-16KB range)

### 3. Audio Format Layer

#### Audio Format Presets
```typescript
const AUDIO_FORMAT_PRESETS = {
  LOW_BANDWIDTH: {
    encoding: 'mp3',
    sample_rate: 22050,
    chunkSize: 1024,
    targetLatency: 200
  },
  MEDIUM_BANDWIDTH: {
    encoding: 'mp3', 
    sample_rate: 44100,
    chunkSize: 2048,
    targetLatency: 150
  },
  HIGH_BANDWIDTH: {
    encoding: 'wav',
    sample_rate: 48000,
    chunkSize: 4096,
    targetLatency: 100
  },
  REAL_TIME: {
    encoding: 'mp3',
    sample_rate: 24000,
    chunkSize: 512,
    targetLatency: 50
  }
}
```

#### Optimization Functions
- `createOptimizedTTSOptions()`: Creates options with specific preset
- `createAutoOptimizedTTSOptions()`: Auto-detects optimal settings
- `streamOptimizedTTS()`: One-function optimized streaming

## Data Flow

### 1. Basic Streaming Flow
```
User Request → TTS Options → Deepgram API → Stream Reader → Chunk Callback → Audio Playback
```

### 2. Optimized Streaming Flow
```
User Request → Network Detection → Preset Selection → Optimized Options → 
Streaming with Monitoring → Performance Metrics → Adaptive Optimization
```

### 3. Chunked Streaming Flow
```
Long Text → Sentence Segmentation → Multiple API Calls → Chunk Collection → 
Combined Audio Buffer → Playback
```

## Performance Optimization Strategies

### 1. Network Adaptation
- **Latency Detection**: Real-time latency measurement
- **Bandwidth Estimation**: Connection type-based estimation
- **Preset Selection**: Automatic format optimization
- **Buffer Adjustment**: Dynamic buffer sizing

### 2. Streaming Optimization
- **Chunked Transfer**: Efficient data transmission
- **Immediate Playback**: Start playing with first byte
- **Memory Management**: Efficient buffer handling
- **Error Recovery**: Robust error handling and retry logic

### 3. Browser Optimization
- **MediaSource API**: Native browser streaming support
- **Blob Management**: Efficient audio blob creation
- **Memory Cleanup**: Automatic resource cleanup
- **Cross-browser Compatibility**: Fallback mechanisms

## Error Handling

### 1. API Errors
- **Authentication**: Invalid API key handling
- **Rate Limiting**: Automatic retry with backoff
- **Network Errors**: Connection failure recovery
- **Response Errors**: HTTP error code handling

### 2. Streaming Errors
- **Chunk Processing**: Individual chunk error handling
- **Buffer Overflow**: Memory management
- **Playback Errors**: Audio playback failure recovery
- **Network Interruption**: Connection loss handling

### 3. Performance Errors
- **Monitoring Failures**: Graceful degradation
- **Network Detection**: Fallback to default settings
- **Buffer Prediction**: Constraint enforcement

## Integration Patterns

### 1. React Component Integration
```typescript
// Example: Pronunciation Game Component
const handleSpeak = async (text: string) => {
  const result = await streamOptimizedTTS(
    text,
    (chunk) => console.log('Streaming...'),
    DEEPGRAM_MODELS['aura-2-luna-es']
  );
  
  if (result.success) {
    // Play audio immediately
    const audio = new Audio(result.blobUrl);
    audio.play();
  }
};
```

### 2. Performance Monitoring Integration
```typescript
// Example: Performance-aware streaming
const monitor = new StreamingPerformanceMonitor();
const result = await streamTextToSpeech(options, onChunk, monitor);

if (result.metrics) {
  console.log(`Streaming completed in ${result.metrics.totalTime}ms`);
  console.log(`Average latency: ${result.metrics.averageLatency}ms`);
}
```

### 3. Network Adaptation Integration
```typescript
// Example: Adaptive quality selection
const networkEstimator = NetworkPerformanceEstimator.getInstance();
const preset = await networkEstimator.getOptimalPreset();
const options = createOptimizedTTSOptions(text, preset);
```

## Security Considerations

### 1. API Key Management
- Environment variable storage
- No client-side exposure
- Secure server-side usage

### 2. Input Validation
- Text sanitization
- Length limits
- Character encoding validation

### 3. Rate Limiting
- Request throttling
- Usage monitoring
- Cost control

## Future Enhancements

### 1. Advanced Features
- **Voice Cloning**: Custom voice generation
- **Emotion Detection**: Context-aware voice modulation
- **Multi-language**: Extended language support
- **Offline Mode**: Cached audio playback

### 2. Performance Improvements
- **WebRTC Integration**: Peer-to-peer streaming
- **Service Workers**: Background processing
- **Audio Compression**: Advanced codec support
- **Predictive Loading**: Pre-loading based on user behavior

### 3. Analytics Integration
- **Usage Tracking**: Detailed usage metrics
- **Performance Analytics**: Streaming performance data
- **User Behavior**: Learning pattern analysis
- **A/B Testing**: Feature optimization

---

*This architecture document should be updated when significant changes are made to the TTS system.*
