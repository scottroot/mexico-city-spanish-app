/**
 * Import Stories Script
 * 
 * This script imports your existing stories from the local filesystem
 * into the Supabase stories table.
 * 
 * Usage: node scripts/import-stories.js
 * 
 * Make sure your .env file has the correct Supabase credentials:
 * - NEXT_PUBLIC_SUPABASE_URL
 * - SUPABASE_SERVICE_ROLE_KEY
 */
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { parseFile } from 'music-metadata';

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

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Helper function to create URL-friendly slug
function createSlug(title) {
  return title
    .toLowerCase()
    // Normalize Spanish accented characters
    .replace(/á/g, 'a')
    .replace(/é/g, 'e')
    .replace(/í/g, 'i')
    .replace(/ó/g, 'o')
    .replace(/ú/g, 'u')
    .replace(/ñ/g, 'n')
    .replace(/ü/g, 'u')
    .replace(/ç/g, 'c')
    // Remove any remaining special characters except spaces and hyphens
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim();
}

// Helper function to get level from folder name
function getLevelFromFolder(folderName) {
  const levelMap = {
    '1_Beginner': 'beginner',
    '2_High_Beginner': 'high_beginner',
    '3_Low_Intermediate': 'low_intermediate',
    '4_High_Intermediate': 'high_intermediate',
    '5_Advanced': 'advanced'
  };
  return levelMap[folderName] || 'beginner';
}

// Helper function to get audio duration from MP3 file
async function getAudioDuration(audioPath) {
  try {
    // Use music-metadata to get duration
    const metadata = await parseFile(audioPath);
    const duration = metadata.format.duration;
    
    if (!duration || isNaN(duration)) {
      console.log(`    ⚠️  Could not parse duration for ${audioPath}`);
      return null;
    }
    
    // Convert seconds to minutes and format as "X min" or "X min Y sec"
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60);
    
    if (seconds === 0) {
      return `${minutes} min`;
    } else if (minutes === 0) {
      return `${seconds} sec`;
    } else {
      return `${minutes} min ${seconds} sec`;
    }
  } catch (error) {
    console.log(`    ⚠️  Could not get duration for ${audioPath}: ${error.message}`);
    return null;
  }
}

// Helper function to get file URL from Supabase Storage
function getStorageUrl(filePath) {
  const bucketName = 'stories';
  return `${supabaseUrl}/storage/v1/object/public/${bucketName}/${filePath}`;
}

async function importStories() {
  const storiesDir = path.join(__dirname, '..', 'stories');
  
  console.log('Starting stories import...');
  
  try {
    // Read all level directories
    const allItems = await fs.readdir(storiesDir);
    const levelDirs = [];
    
    for (const item of allItems) {
      const itemPath = path.join(storiesDir, item);
      const stats = await fs.stat(itemPath);
      if (stats.isDirectory() && item.match(/^\d+_/)) {
        levelDirs.push(item);
      }
    }

    for (const levelDir of levelDirs) {
      const levelPath = path.join(storiesDir, levelDir);
      const level = getLevelFromFolder(levelDir);
      
      console.log(`\nProcessing level: ${levelDir} (${level})`);
      
      // Read story directories within this level
      const allLevelItems = await fs.readdir(levelPath);
      const storyDirs = [];
      
      for (const item of allLevelItems) {
        const itemPath = path.join(levelPath, item);
        const stats = await fs.stat(itemPath);
        if (stats.isDirectory()) {
          storyDirs.push(item);
        }
      }
      
      for (const storyDir of storyDirs) {
        const storyPath = path.join(levelPath, storyDir);
        const storyJsonPath = path.join(storyPath, 'story.json');
        
        try {
          // Check if story.json exists and read it
          await fs.access(storyJsonPath);
          const storyData = JSON.parse(await fs.readFile(storyJsonPath, 'utf8'));
          
          // Create slug from title
          const slug = createSlug(storyData.title);
          
          // Check if story already exists
          const { data: existingStory } = await supabase
            .from('stories')
            .select('id')
            .eq('slug', slug)
            .single();
          
          if (existingStory) {
            console.log(`  ⚠️  Story "${storyData.title}" already exists, skipping...`);
            continue;
          }
          
          // Prepare story data for database
          const storyRecord = {
            title: storyData.title,
            slug: slug,
            level: level,
            reading_time: storyData.reading_time || null, // Will be updated with actual duration below
            text: storyData.text,
            enhanced_text: storyData.enhanced_text || null,
            featured_image_url: null,
            audio_url: null,
            alignment_data: null,
            normalized_alignment_data: null
          };
          
          // Check for featured image
          const storyFiles = await fs.readdir(storyPath);
          const imageFiles = storyFiles.filter(file => file.match(/\.(png|jpg|jpeg|webp)$/i));
          
          if (imageFiles.length > 0) {
            const imageFile = imageFiles[0]; // Take the first image found
            storyRecord.featured_image_url = getStorageUrl(`featured-images/${imageFile}`);
          }
          
          // Check for audio file and get duration
          const audioFiles = storyFiles.filter(file => file.match(/\.(mp3|wav)$/i) && !file.includes('chunk'));
          
          if (audioFiles.length > 0) {
            const audioFile = audioFiles[0]; // Take the main audio file (not chunks)
            const audioPath = path.join(storyPath, audioFile);
            
            // Get actual duration from audio file
            const actualDuration = await getAudioDuration(audioPath);
            if (actualDuration) {
              storyRecord.reading_time = actualDuration;
              console.log(`    📊 Audio duration: ${actualDuration}`);
            } else {
              console.log(`    ⚠️  No audio duration found for: ${storyData.title}`);
            }
            
            storyRecord.audio_url = getStorageUrl(`audio/${audioFile}`);
          }
          
          // Check for alignment data
          const alignmentPath = path.join(storyPath, 'alignment.json');
          try {
            await fs.access(alignmentPath);
            const alignmentData = JSON.parse(await fs.readFile(alignmentPath, 'utf8'));
            storyRecord.alignment_data = alignmentData;
          } catch (error) {
            console.log(`    ⚠️  No alignment data found for: ${storyData.title}`);
          }
          
          // Check for normalized alignment data
          const normalizedAlignmentPath = path.join(storyPath, 'normalized_alignment.json');
          try {
            await fs.access(normalizedAlignmentPath);
            const normalizedAlignmentData = JSON.parse(await fs.readFile(normalizedAlignmentPath, 'utf8'));
            storyRecord.normalized_alignment_data = normalizedAlignmentData;
          } catch (error) {
            console.log(`    ⚠️  No normalized alignment data found for: ${storyData.title}`);
          }
          
          // Insert story into database
          const { data, error } = await supabase
            .from('stories')
            .insert([storyRecord])
            .select();
          
          if (error) {
            console.error(`  ❌ Error importing "${storyData.title}":`, error.message);
          } else {
            console.log(`  ✅ Imported: "${storyData.title}" (${slug})`);
          }
          
        } catch (error) {
          if (error.code === 'ENOENT') {
            console.log(`  ⚠️  Skipping ${storyDir} - no story.json found`);
          } else {
            console.error(`  ❌ Error processing ${storyDir}:`, error.message);
          }
        }
      }
    }
    
    console.log('\n🎉 Stories import completed!');
    
  } catch (error) {
    console.error('❌ Import failed:', error.message);
    process.exit(1);
  }
}

// Run the import
importStories();
