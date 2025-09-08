# Stories Audio Generation

## Overview
Script for generating Spanish learning stories with synchronized audio using OpenAI and ElevenLabs APIs.

## Usage
```bash
node stories/create-speech.js <level>
# Levels: 1=Beginner, 2=High_Beginner, 3=Low_Intermediate, 4=High_Intermediate, 5=Advanced, 6=Proficient_Near_Native
```

## Key Functions
- `openaiGenerateStory()` - Generates story content from prompts
- `enhanceTextIfConfigured()` - Adds audio tags via ElevenLabs enhance API
- `splitTextIntoChunks()` - Splits long text at line breaks (3000 char limit)
- `elevenGenerateMp3()` - Main TTS function with chunking support
- `elevenGenerateMp3Single()` - Single chunk TTS processing
- `combineAudioBuffers()` - Merges multiple audio chunks
- `combineAlignmentData()` - Merges timing data with offset adjustments

## File Structure
```
stories/
  {level}_{name}/
    {story_name}/
      story.json
      speech.mp3 (final audio)
      alignment.json (final timing)
      normalized_alignment.json (final normalized timing)
      [if chunked]:
        speech_chunk_1.mp3, speech_chunk_2.mp3, etc.
        alignment_chunk_1.json, alignment_chunk_2.json, etc.
        normalized_alignment_chunk_1.json, normalized_alignment_chunk_2.json, etc.
```

## Process Flow
1. **Text Processing**: Enhance → Split into chunks if >3000 chars
2. **Single Chunk**: Direct TTS → Save `speech.mp3`, `alignment.json`, `normalized_alignment.json`
3. **Multiple Chunks**: 
   - Process each chunk → Save individual `speech_chunk_N.mp3`, `alignment_chunk_N.json`, `normalized_alignment_chunk_N.json`
   - Combine all chunks → Save final `speech.mp3`, `alignment.json`, `normalized_alignment.json`

## Environment Variables
- `OPENAI_API_KEY` - OpenAI API key
- `OPENAI_DEFAULT_MODEL` - OpenAI model to use
- `ELEVENLABS_API_KEY` - ElevenLabs API key
- `ELEVENLABS_V3_ENHANCE_URL` - Optional text enhancement endpoint
