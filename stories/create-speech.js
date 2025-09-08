// stories/create-speech.js
// Usage: node stories/create-speech.js <levelNumber>
// 1=Beginner, 2=High Beginner, 3=Low Intermediate, 4=High Intermediate, 5=Advanced, 6=Proficient-Near-Native

import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { spawn } from "child_process";
import ffmpegPath from "ffmpeg-static";
import OpenAI from "openai";
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";
import dotenv from 'dotenv';

// Get the directory where this script is located
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Determine if we're running from root or stories directory
const isRunningFromRoot = !__dirname.endsWith('stories');

// Configure dotenv to look for .env file in the correct location
if (isRunningFromRoot) {
  // Running from root, .env is in current directory
  dotenv.config();
} else {
  // Running from stories directory, .env is in parent directory
  dotenv.config({ path: '../.env' });
}

// Dynamic paths based on where the script is run from
const promptBasePath = isRunningFromRoot ? "stories/new-story-prompts" : "new-story-prompts";
const storiesBasePath = isRunningFromRoot ? "stories" : ".";

const LEVELS = {
  1: { key: "1_Beginner", prompt: `${promptBasePath}/1_Beginner.txt` },
  2: { key: "2_High_Beginner", prompt: `${promptBasePath}/2_High_Beginner.txt` },
  3: { key: "3_Low_Intermediate", prompt: `${promptBasePath}/3_Low_Intermediate.txt` },
  4: { key: "4_High_Intermediate", prompt: `${promptBasePath}/4_High_Intermediate.txt` },
  5: { key: "5_Advanced", prompt: `${promptBasePath}/5_Advanced.txt` },
  6: { key: "6_Proficient_Near_Native", prompt: `${promptBasePath}/6_Proficient_Near_Native.txt` }
};

const ROOT_STORIES_DIR = storiesBasePath;
const ELEVEN_V3_MODEL = "eleven_v3"; // official v3 (alpha) model id  [oai_citation:0‡ElevenLabs](https://elevenlabs.io/docs/models?utm_source=chatgpt.com) [oai_citation:1‡ElevenLabs](https://help.elevenlabs.io/hc/en-us/articles/35869054119057-What-is-Eleven-v3-Alpha?utm_source=chatgpt.com)
const REQUIRED_VOICE_NAME = "Fernanda Sanmiguel - Spanish Audiobook Neutral Voice";


const voices = [
    {
        id: "1aJyZpkt0vxhGPBnPyrs",
        name: "Fernanda Sanmiguel - Spanish Audiobook Neutral Voice",
        description: "Female Latina South American Spanish voice — neutral, passionate, and emotional. Deep and expressive, perfect for audiobooks, narrations, podcasts, reflections, and announcements. Natural flow that connects with audiences across Mexico, Colombia, Spain, Argentina, Peru, Venezuela, Chile, Ecuador, Guatemala, and Bolivia."
    }
]

function requireEnv(name) {
  const v = process.env[name];
  if (!v) {
    console.error(`Missing env: ${name}`);
    process.exit(1);
  }
  return v;
}

function slugifyTitle(s) {
  return s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9 _.-]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/ /g, "_");
}

function extractFirstJson(str) {
  const match = str.match(/\{[\s\S]*\}/);
  if (!match) throw new Error("No JSON found in model output");
  return JSON.parse(match[0]);
}

async function ensureDir(p) {
  await fs.mkdir(p, { recursive: true });
}

async function getUniqueFilePath(basePath, extension) {
  let counter = 1;
  let filePath = `${basePath}${extension}`;
  
  while (true) {
    try {
      await fs.access(filePath);
      // File exists, try with counter
      const baseName = basePath.replace(extension, '');
      filePath = `${baseName}_${counter}${extension}`;
      counter++;
    } catch {
      // File doesn't exist, we can use this path
      break;
    }
  }
  
  return filePath;
}

function splitTextIntoChunks(text, maxLength = 3000) {
  const lines = text.split('\n');
  const chunks = [];
  let currentChunk = '';
  
  for (const line of lines) {
    // If adding this line would exceed the limit, start a new chunk
    if (currentChunk.length + line.length + 1 > maxLength && currentChunk.length > 0) {
      chunks.push(currentChunk.trim());
      currentChunk = line;
    } else {
      // Add line to current chunk
      if (currentChunk.length > 0) {
        currentChunk += '\n' + line;
      } else {
        currentChunk = line;
      }
    }
  }
  
  // Add the last chunk if it has content
  if (currentChunk.trim().length > 0) {
    chunks.push(currentChunk.trim());
  }
  
  return chunks;
}

/**
 * Concatenate multiple MP3 files without adding silence.
 *
 * @param {string[]} inputFiles - Array of MP3 file paths
 * @param {string} outFile - Output MP3 file path
 * @returns {Promise<void>}
 */
async function concatMp3Files(inputFiles, outFile) {
  if (inputFiles.length === 0) {
    throw new Error("No input files provided");
  }
  
  if (inputFiles.length === 1) {
    // Just copy the single file
    await fs.copyFile(inputFiles[0], outFile);
    return;
  }
  
  // Build FFmpeg arguments for multiple inputs
  const args = [];
  
  // Add input files
  for (const file of inputFiles) {
    args.push("-i", file);
  }
  
  // Build filter complex for concatenation
  const inputLabels = inputFiles.map((_, i) => `[${i}:a]`).join('');
  const filterComplex = `${inputLabels}concat=n=${inputFiles.length}:v=0:a=1[a]`;
  
  args.push(
    "-filter_complex", filterComplex,
    "-map", "[a]",
    "-c:a", "libmp3lame", "-q:a", "2",
    outFile
  );

  await new Promise((resolve, reject) => {
    const ff = spawn(ffmpegPath, args, { stdio: "inherit" });
    ff.on("error", reject);
    ff.on("exit", code => {
      if (code === 0) resolve();
      else reject(new Error(`ffmpeg exited with code ${code}`));
    });
  });
}

async function combineAudioFiles(audioFilePaths, outputPath) {
  if (audioFilePaths.length === 0) {
    throw new Error("No audio files to combine");
  }
  
  // Use the new function that handles multiple files at once
  await concatMp3Files(audioFilePaths, outputPath);
}

async function combineAlignmentData(alignmentDataArray) {
  if (alignmentDataArray.length === 0) return null;
  if (alignmentDataArray.length === 1) return alignmentDataArray[0];
  
  const combined = {
    characters: [],
    character_start_times_seconds: [],
    character_end_times_seconds: []
  };
  
  let timeOffset = 0;
  
  for (const alignment of alignmentDataArray) {
    if (alignment && alignment.characters) {
      combined.characters.push(...alignment.characters);
      
      // Adjust timestamps by adding the time offset
      const adjustedStartTimes = alignment.character_start_times_seconds.map(t => t + timeOffset);
      const adjustedEndTimes = alignment.character_end_times_seconds.map(t => t + timeOffset);
      
      combined.character_start_times_seconds.push(...adjustedStartTimes);
      combined.character_end_times_seconds.push(...adjustedEndTimes);
      
      // Update time offset for next chunk
      if (alignment.character_end_times_seconds.length > 0) {
        timeOffset = Math.max(...alignment.character_end_times_seconds) + timeOffset;
      }
    }
  }
  
  return combined;
}

async function readPrompt(promptPath) {
  const text = await fs.readFile(promptPath, "utf8");
  if (!text.trim()) throw new Error(`Prompt file empty: ${promptPath}`);
  return text;
}

async function openaiGenerateStory(promptText) {
  const openai = new OpenAI({ apiKey: requireEnv("OPENAI_API_KEY") });
  const model = requireEnv("OPENAI_DEFAULT_MODEL");

  const completion = await openai.chat.completions.create({
    model,
    messages: [
      {
        role: "system",
        content:
          "You generate Spanish learner stories. Respond with JSON only: {\"title\":\"...\",\"reading_time\":\"<int> min\",\"text\":\"<title>\\n\\n<story>\"}."
      },
      { role: "user", content: promptText }
    ]
  });

  const raw = completion.choices?.[0]?.message?.content ?? "";
  return extractFirstJson(raw);
}

// Optional “V3 Enhance (alpha)” pass: if ELEVEN_V3_ENHANCE_URL is set, POST the text to that URL.
// If not set, return text unchanged.
// This keeps compatibility with ElevenLabs’ evolving v3 tooling (audio tags) without hardcoding a non-public endpoint.
async function enhanceTextIfConfigured(text) {
  const url = process.env.ELEVENLABS_V3_ENHANCE_URL;
  if (!url) return text;
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "xi-api-key": requireEnv("ELEVENLABS_API_KEY")
      },
      body: JSON.stringify({ 
        dialogue_blocks: [text] 
      })
    });
    if (!res.ok) throw new Error(`Enhance HTTP ${res.status}`);
    const data = await res.json();
    return data?.enhanced_blocks?.[0] ?? text;
  } catch (e) {
    console.warn(`Enhance step failed, using original text: ${e.message}`);
    return text;
  }
}

async function resolveVoiceId(eleven) {
  // If provided, use explicit voice id.
  if (process.env.ELEVENLABS_VOICE_ID) return process.env.ELEVENLABS_VOICE_ID;

  // // Search by display name from your account.
  // const voices = await eleven.voices.getAll();
  // const match =
  //   voices.voices.find(v => v.name === REQUIRED_VOICE_NAME) ||
  //   voices.voices.find(v => v.name?.toLowerCase().includes("fernanda") && v.name?.toLowerCase().includes("spanish"));

  // if (!match) {
  //   const available = voices.voices.map(v => v.name).join(", ");
  //   throw new Error(
  //     `Voice not found: "${REQUIRED_VOICE_NAME}". Add it to your ElevenLabs account or set ELEVENLABS_VOICE_ID. Available: ${available}`
  //   );
  // }
  // return match.voice_id;
  return "1aJyZpkt0vxhGPBnPyrs";
}


async function elevenGenerateMp3Single({ text, outPath, saveAlignmentFiles = true }) {
  const eleven = new ElevenLabsClient({ apiKey: requireEnv("ELEVENLABS_API_KEY") });
  const voiceId = await resolveVoiceId(eleven);

  // Use Eleven v3 model. If your account lacks access, fall back to multilingual v2.
  let response;
  try {
    response = await eleven.textToSpeech.convertWithTimestamps(voiceId, {
      text,
      modelId: ELEVEN_V3_MODEL // v3 supports audio tags and advanced delivery controls  [oai_citation:2‡ElevenLabs](https://elevenlabs.io/docs/models?utm_source=chatgpt.com) [oai_citation:3‡ElevenLabs](https://help.elevenlabs.io/hc/en-us/articles/35869142561297-How-do-audio-tags-work-with-Eleven-v3-Alpha?utm_source=chatgpt.com)
      // Leave stability at default as requested.
    });
  } catch (err) {
    console.error("The eleven request error...", err)
    console.warn("eleven_v3 unavailable for this account. Falling back to eleven_multilingual_v2.");
    // TODO: decide on whether to fall back or not...
    // response = await eleven.textToSpeech.convert(voiceId, {
    //   text,
    //   modelId: "eleven_multilingual_v2" // documented fallback  [oai_citation:4‡ElevenLabs](https://elevenlabs.io/docs/api-reference/text-to-speech/convert?utm_source=chatgpt.com)
    // });
    return null;
  }

  // Handle the new response format with timestamps
  console.log("Response type:", typeof response);

  // Response keys: { 'audioBase64', 'alignment', 'normalizedAlignment' }
  console.log("Response keys:", Object.keys(response));
  
  if (response && typeof response === 'object' && response.audioBase64) {
    // New format: decode base64 audio and save
    const audioBuffer = Buffer.from(response.audioBase64, 'base64');
    await fs.writeFile(outPath, audioBuffer);
    
    // Also save the alignment data as JSON (only if saveAlignmentFiles is true)
    if (saveAlignmentFiles && response.alignment) {
      const alignmentPath = path.join(path.dirname(outPath), 'alignment.json');
      await fs.writeFile(alignmentPath, JSON.stringify(response.alignment, null, 2));
      console.log("Saved alignment data:", alignmentPath);
    }
    
    // Save normalized alignment too (only if saveAlignmentFiles is true)
    if (saveAlignmentFiles && response.normalizedAlignment) {
      const normalizedAlignmentPath = path.join(path.dirname(outPath), 'normalized_alignment.json');
      await fs.writeFile(normalizedAlignmentPath, JSON.stringify(response.normalizedAlignment, null, 2));
      console.log("Saved normalized alignment data:", normalizedAlignmentPath);
    }
    
    return {
      audioBuffer,
      alignment: response.alignment,
      normalizedAlignment: response.normalizedAlignment
    };
  } 
  else if (Buffer.isBuffer(response) || response instanceof Uint8Array) {
    // Fallback format: direct audio buffer
    await fs.writeFile(outPath, Buffer.from(response));
    return { audioBuffer: response };
  } 
  else {
    throw new Error(`Unexpected response format: ${typeof response}. Expected object with audio_base64 or Buffer.`);
  }
}

async function elevenGenerateMp3({ text, outPath }) {
  const chunks = splitTextIntoChunks(text, 3000);
  console.log(`Text split into ${chunks.length} chunks`);
  
  if (chunks.length === 1) {
    // Single chunk, use the original function
    return await elevenGenerateMp3Single({ text, outPath });
  }
  
  // Multiple chunks - process each one
  const audioFilePaths = [];
  const alignmentData = [];
  const normalizedAlignmentData = [];
  const storyDir = path.dirname(outPath);
  
  for (let i = 0; i < chunks.length; i++) {
    const chunkPath = path.join(storyDir, `speech_chunk_${i + 1}.mp3`);
    console.log(`Processing chunk ${i + 1}/${chunks.length}...`);
    
    const result = await elevenGenerateMp3Single({ text: chunks[i], outPath: chunkPath, saveAlignmentFiles: false });
    
    if (result) {
      audioFilePaths.push(chunkPath);
      if (result.alignment) alignmentData.push(result.alignment);
      if (result.normalizedAlignment) normalizedAlignmentData.push(result.normalizedAlignment);
      
      // Save individual chunk alignment files with chunk number suffix
      if (result.alignment) {
        const chunkAlignmentPath = path.join(storyDir, `alignment_chunk_${i + 1}.json`);
        await fs.writeFile(chunkAlignmentPath, JSON.stringify(result.alignment, null, 2));
        console.log(`Saved chunk ${i + 1} alignment data:`, chunkAlignmentPath);
      }
      
      if (result.normalizedAlignment) {
        const chunkNormalizedAlignmentPath = path.join(storyDir, `normalized_alignment_chunk_${i + 1}.json`);
        await fs.writeFile(chunkNormalizedAlignmentPath, JSON.stringify(result.normalizedAlignment, null, 2));
        console.log(`Saved chunk ${i + 1} normalized alignment data:`, chunkNormalizedAlignmentPath);
      }
    }
  }
  
  // Combine all audio files using FFmpeg
  await combineAudioFiles(audioFilePaths, outPath);
  console.log("Combined audio saved to:", outPath);
  
  // Combine and save alignment data
  if (alignmentData.length > 0) {
    const combinedAlignment = await combineAlignmentData(alignmentData);
    const alignmentPath = path.join(storyDir, 'alignment.json');
    await fs.writeFile(alignmentPath, JSON.stringify(combinedAlignment, null, 2));
    console.log("Combined alignment data saved to:", alignmentPath);
  }
  
  if (normalizedAlignmentData.length > 0) {
    const combinedNormalizedAlignment = await combineAlignmentData(normalizedAlignmentData);
    const normalizedAlignmentPath = path.join(storyDir, 'normalized_alignment.json');
    await fs.writeFile(normalizedAlignmentPath, JSON.stringify(combinedNormalizedAlignment, null, 2));
    console.log("Combined normalized alignment data saved to:", normalizedAlignmentPath);
  }
}

async function main() {
  const arg = process.argv[2];
  
  let story, storyFolder, jsonPath, mp3Path;
  
  // Check if argument is a file path (contains .json)
  if (arg && arg.includes('.json')) {
    // File path mode - load existing story.json
    console.log(`Loading existing story from: ${arg}`);
    
    try {
      const text = await fs.readFile(arg, "utf8");
      story = JSON.parse(text);
    } catch (error) {
      console.error(`Error reading story file: ${error.message}`);
      process.exit(1);
    }
    
    if (!story?.title || !story?.text) {
      throw new Error("Story file missing title or text");
    }
    
    // Use the directory containing the story.json as the story folder
    storyFolder = path.dirname(arg);
    jsonPath = arg;
    mp3Path = path.join(storyFolder, 'speech.mp3');
    
    console.log(`Using existing story folder: ${storyFolder}`);
    
  } else {
    // Level number mode - generate new story
    const levelArg = Number(arg);
    if (!LEVELS[levelArg]) {
      console.error("Usage: node stories/create-speech.js <1|2|3|4|5|6>");
      console.error("   OR: node stories/create-speech.js <path/to/story.json>");
      process.exit(1);
    }

    const level = LEVELS[levelArg];
    const promptPath = path.join(level.prompt);
    const promptText = await readPrompt(promptPath);

    story = await openaiGenerateStory(promptText);

    if (!story?.title || !story?.text) throw new Error("Model response missing title or text");

    const folder = path.join(ROOT_STORIES_DIR, level.key);
    await ensureDir(folder);

    const baseName = slugifyTitle(story.title);
    
    // Create a unique story folder
    let tempStoryFolder = path.join(folder, baseName);
    let counter = 1;
    while (true) {
      try {
        await fs.access(tempStoryFolder);
        // Folder exists, try with counter
        tempStoryFolder = path.join(folder, `${baseName}_${counter}`);
        counter++;
      } catch {
        // Folder doesn't exist, we can use this path
        break;
      }
    }
    
    // Create the story folder
    await ensureDir(tempStoryFolder);
    
    // Set up file paths within the story folder
    storyFolder = tempStoryFolder;
    jsonPath = path.join(storyFolder, 'story.json');
    mp3Path = path.join(storyFolder, 'speech.mp3');
    
    // Save the story.json
    await fs.writeFile(jsonPath, JSON.stringify(story, null, 2), "utf8");
  }

  // Enhance text and generate audio (common for both modes)
  if (!story.enhanced_text) {
    const enhancedText = await enhanceTextIfConfigured(story.text);
    story.enhanced_text = enhancedText;
  }
  
  await elevenGenerateMp3({ text: story.enhanced_text, outPath: mp3Path });

  console.log("Saved:");
  console.log(jsonPath);
  console.log(mp3Path);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});