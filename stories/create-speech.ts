// scripts/generate-story.mjs
// Usage: node scripts/generate-story.mjs <levelNumber>
// 1=Beginner, 2=High Beginner, 3=Low Intermediate, 4=High Intermediate, 5=Advanced, 6=Proficient-Near-Native

import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import OpenAI from "openai";
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";
import dotenv from 'dotenv';
dotenv.config();

const LEVELS = {
  1: { key: "01_Beginner", prompt: "new-story-prompts/1 - Beginner.txt" },
  2: { key: "02_High Beginner", prompt: "new-story-prompts/2 - High Beginner.txt" },
  3: { key: "03_Low Intermediate", prompt: "new-story-prompts/3 - Low Intermediate.txt" },
  4: { key: "04_High Intermediate", prompt: "new-story-prompts/4 - High Intermediate.txt" },
  5: { key: "05_Advanced", prompt: "new-story-prompts/5 - Advanced.txt" },
  6: { key: "06_Proficient-Near-Native", prompt: "new-story-prompts/6 - Proficient-Near-Native.txt" }
};

const ROOT_STORIES_DIR = "stories";
const ELEVEN_V3_MODEL = "eleven_v3"; // official v3 (alpha) model id  [oai_citation:0‡ElevenLabs](https://elevenlabs.io/docs/models?utm_source=chatgpt.com) [oai_citation:1‡ElevenLabs](https://help.elevenlabs.io/hc/en-us/articles/35869054119057-What-is-Eleven-v3-Alpha?utm_source=chatgpt.com)
const REQUIRED_VOICE_NAME = "Fernanda Sanmiguel - Spanish Audiobook Neutral Voice";


const voices = [
    {
        id: "1aJyZpkt0vxhGPBnPyrs",
        name: "Fernanda Sanmiguel - Spanish Audiobook Neutral Voice",
        description: "Female Latina South American Spanish voice — neutral, passionate, and emotional. Deep and expressive, perfect for audiobooks, narrations, podcasts, reflections, and announcements. Natural flow that connects with audiences across Mexico, Colombia, Spain, Argentina, Peru, Venezuela, Chile, Ecuador, Guatemala, and Bolivia."
    }
]

// const client = new ElevenLabsClient({ apiKey: process.env.ELEVENLABS_API_KEY });

// const createSpeech = async (text: string, voiceId: string = voices[0].id) => {
//     // https://api.elevenlabs.io/v1/text-to-speech/:voice_id/with-timestamps
//     await client.textToSpeech.convertWithTimestamps(voiceId, { text });
// }

function requireEnv(name: string) {
  const v = process.env[name];
  if (!v) {
    console.error(`Missing env: ${name}`);
    process.exit(1);
  }
  return v;
}

function slugifyTitle(s: string) {
  return s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9 _.-]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/ /g, "_");
}

function extractFirstJson(str: string) {
  const match = str.match(/\{[\s\S]*\}/);
  if (!match) throw new Error("No JSON found in model output");
  return JSON.parse(match[0]);
}

async function ensureDir(p: string) {
  await fs.mkdir(p, { recursive: true });
}

async function readPrompt(promptPath: string) {
  const text = await fs.readFile(promptPath, "utf8");
  if (!text.trim()) throw new Error(`Prompt file empty: ${promptPath}`);
  return text;
}

async function openaiGenerateStory(promptText: string) {
  const openai = new OpenAI({ apiKey: requireEnv("OPENAI_API_KEY") });
  const model = requireEnv("OPENAI_DEFAULT_MODEL");

  const completion = await openai.chat.completions.create({
    model,
    temperature: 0.7,
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
async function enhanceTextIfConfigured(text: string) {
  const url = process.env.ELEVENLABS_V3_ENHANCE_URL;
  if (!url) return text;
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "xi-api-key": requireEnv("ELEVENLABS_API_KEY")
      },
      body: JSON.stringify({ text })
    });
    if (!res.ok) throw new Error(`Enhance HTTP ${res.status}`);
    const data = await res.json();
    return data?.text ?? text;
  } catch (e: any) {
    console.warn(`Enhance step failed, using original text: ${e.message}`);
    return text;
  }
}

async function resolveVoiceId(eleven: ElevenLabsClient) {
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

async function elevenGenerateMp3({ text, outPath }: { text: string, outPath: string }) {
  const eleven = new ElevenLabsClient({ apiKey: requireEnv("ELEVENLABS_API_KEY") });
  const voiceId = await resolveVoiceId(eleven);

  // Use Eleven v3 model. If your account lacks access, fall back to multilingual v2.
  let audio;
  try {
    audio = await eleven.textToSpeech.convert(voiceId, {
      text,
      modelId: ELEVEN_V3_MODEL // v3 supports audio tags and advanced delivery controls  [oai_citation:2‡ElevenLabs](https://elevenlabs.io/docs/models?utm_source=chatgpt.com) [oai_citation:3‡ElevenLabs](https://help.elevenlabs.io/hc/en-us/articles/35869142561297-How-do-audio-tags-work-with-Eleven-v3-Alpha?utm_source=chatgpt.com)
      // Leave stability at default as requested.
    });
  } catch (_) {
    console.warn("eleven_v3 unavailable for this account. Falling back to eleven_multilingual_v2.");
    audio = await eleven.textToSpeech.convert(voiceId, {
      text,
      modelId: "eleven_multilingual_v2" // documented fallback  [oai_citation:4‡ElevenLabs](https://elevenlabs.io/docs/api-reference/text-to-speech/convert?utm_source=chatgpt.com)
    });
  }

  // `convert` returns a Uint8Array/Buffer-like. Save as mp3.
  await fs.writeFile(outPath, Buffer.from(audio as unknown as Uint8Array));
}

async function main() {
  console.log(`process.argv[0]: ${process.argv[0]}`)
  console.log(`process.argv[1]: ${process.argv[1]}`)
  console.log(`process.argv[2]: ${process.argv[2]}`)
  return null;
  const levelArg = Number(process.argv[2]);
  if (!LEVELS[levelArg as keyof typeof LEVELS]) {
    console.error("Usage: node scripts/generate-story.mjs <1|2|3|4|5|6>");
    process.exit(1);
  }

  const level = LEVELS[levelArg as keyof typeof LEVELS];
  const promptPath = path.join(level.prompt);
  const promptText = await readPrompt(promptPath);

  const story = await openaiGenerateStory(promptText);

  if (!story?.title || !story?.text) throw new Error("Model response missing title or text");

  const folder = path.join(ROOT_STORIES_DIR, level.key);
  await ensureDir(folder);

  const baseName = slugifyTitle(story.title);
  const jsonPath = path.join(folder, `${baseName}.json`);
  await fs.writeFile(jsonPath, JSON.stringify(story, null, 2), "utf8");

  // Enhance (optional) then synthesize to MP3 with ElevenLabs.
  const enhancedText = await enhanceTextIfConfigured(story.text);
  const mp3Path = path.join(folder, `${baseName}.mp3`);
  await elevenGenerateMp3({ text: enhancedText, outPath: mp3Path });

  console.log("Saved:");
  console.log(jsonPath);
  console.log(mp3Path);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});