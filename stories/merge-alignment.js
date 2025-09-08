// merge-alignment.js
// Usage: node stories/merge-alignment.js <path/to/story/folder>
// Example: node stories/merge-alignment.js stories/3_Low_Intermediate/El_sabado_de_la_feria_y_el_perro_perdido

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Get the directory where this script is located
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function combineAlignmentData(alignmentDataArray) {
  console.log(`\n🔧 combineAlignmentData called with ${alignmentDataArray.length} chunks`);
  
  if (alignmentDataArray.length === 0) {
    console.log("   ❌ No alignment data provided");
    return null;
  }
  if (alignmentDataArray.length === 1) {
    console.log("   ✅ Single chunk - returning as-is");
    return alignmentDataArray[0];
  }
  
  const combined = {
    characters: [],
    characterStartTimesSeconds: [],
    characterEndTimesSeconds: []
  };
  
  let timeOffset = 0;
  
  for (let i = 0; i < alignmentDataArray.length; i++) {
    const alignment = alignmentDataArray[i];
    console.log(`\n   📊 Processing chunk ${i + 1}:`);
    console.log(`      - Has alignment: ${!!alignment}`);
    console.log(`      - Has characters: ${!!(alignment && alignment.characters)} (${alignment?.characters?.length || 0} items)`);
    console.log(`      - Has start_times: ${!!(alignment && alignment.characterStartTimesSeconds)} (${alignment?.characterStartTimesSeconds?.length || 0} items)`);
    console.log(`      - Has end_times: ${!!(alignment && alignment.characterEndTimesSeconds)} (${alignment?.characterEndTimesSeconds?.length || 0} items)`);
    
    if (alignment && alignment.characters && 
        alignment.characterStartTimesSeconds && alignment.characterEndTimesSeconds) {
      
      console.log(`      ✅ Valid chunk - adding ${alignment.characters.length} characters`);
      console.log(`      - Time offset: ${timeOffset.toFixed(2)}s`);
      
      combined.characters.push(...alignment.characters);
      
      // Adjust timestamps by adding the time offset
      const adjustedStartTimes = alignment.characterStartTimesSeconds.map(t => t + timeOffset);
      const adjustedEndTimes = alignment.characterEndTimesSeconds.map(t => t + timeOffset);
      
      combined.characterStartTimesSeconds.push(...adjustedStartTimes);
      combined.characterEndTimesSeconds.push(...adjustedEndTimes);
      
      // Update time offset for next chunk
      if (alignment.characterEndTimesSeconds.length > 0) {
        const maxTime = Math.max(...alignment.characterEndTimesSeconds);
        timeOffset = maxTime + timeOffset;
        console.log(`      - Max time in chunk: ${maxTime.toFixed(2)}s`);
        console.log(`      - New time offset: ${timeOffset.toFixed(2)}s`);
      }
    } else {
      console.warn(`      ❌ Skipping chunk ${i + 1} - missing required properties:`, {
        hasAlignment: !!alignment,
        hasCharacters: !!(alignment && alignment.characters),
        hasStartTimes: !!(alignment && alignment.characterStartTimesSeconds),
        hasEndTimes: !!(alignment && alignment.characterEndTimesSeconds)
      });
    }
  }
  
  console.log(`\n   📈 Final combined data:`);
  console.log(`      - Total characters: ${combined.characters.length}`);
  console.log(`      - Total start times: ${combined.characterStartTimesSeconds.length}`);
  console.log(`      - Total end times: ${combined.characterEndTimesSeconds.length}`);
  
  return combined;
}

async function loadAlignmentChunks(storyFolder) {
  const alignmentChunks = [];
  const normalizedAlignmentChunks = [];
  
  // Find all alignment chunk files
  const files = await fs.readdir(storyFolder);
  const alignmentChunkFiles = files
    .filter(file => file.startsWith('alignment_chunk_') && file.endsWith('.json'))
    .sort((a, b) => {
      const aNum = parseInt(a.match(/alignment_chunk_(\d+)\.json/)[1]);
      const bNum = parseInt(b.match(/alignment_chunk_(\d+)\.json/)[1]);
      return aNum - bNum;
    });
  
  const normalizedAlignmentChunkFiles = files
    .filter(file => file.startsWith('normalized_alignment_chunk_') && file.endsWith('.json'))
    .sort((a, b) => {
      const aNum = parseInt(a.match(/normalized_alignment_chunk_(\d+)\.json/)[1]);
      const bNum = parseInt(b.match(/normalized_alignment_chunk_(\d+)\.json/)[1]);
      return aNum - bNum;
    });
  
  console.log(`Found ${alignmentChunkFiles.length} alignment chunk files`);
  console.log(`Found ${normalizedAlignmentChunkFiles.length} normalized alignment chunk files`);
  
  // Load alignment chunks
  for (const file of alignmentChunkFiles) {
    const filePath = path.join(storyFolder, file);
    try {
      const data = JSON.parse(await fs.readFile(filePath, 'utf8'));
      console.log(`\n📄 Loading ${file}:`);
      console.log(`   - Has characters: ${!!data.characters} (${data.characters?.length || 0} items)`);
      console.log(`   - Has start_times: ${!!data.characterStartTimesSeconds} (${data.characterStartTimesSeconds?.length || 0} items)`);
      console.log(`   - Has end_times: ${!!data.characterEndTimesSeconds} (${data.characterEndTimesSeconds?.length || 0} items)`);
      
      if (data.characters && data.characterStartTimesSeconds && data.characterEndTimesSeconds) {
        alignmentChunks.push(data);
        console.log(`   ✅ Valid alignment data - added to chunks`);
      } else {
        console.log(`   ❌ Invalid alignment data - missing required properties`);
      }
    } catch (error) {
      console.error(`❌ Error loading ${file}:`, error.message);
    }
  }
  
  // Load normalized alignment chunks
  for (const file of normalizedAlignmentChunkFiles) {
    const filePath = path.join(storyFolder, file);
    try {
      const data = JSON.parse(await fs.readFile(filePath, 'utf8'));
      console.log(`\n📄 Loading ${file}:`);
      console.log(`   - Has characters: ${!!data.characters} (${data.characters?.length || 0} items)`);
      console.log(`   - Has start_times: ${!!data.characterStartTimesSeconds} (${data.characterStartTimesSeconds?.length || 0} items)`);
      console.log(`   - Has end_times: ${!!data.characterEndTimesSeconds} (${data.characterEndTimesSeconds?.length || 0} items)`);
      
      if (data.characters && data.characterStartTimesSeconds && data.characterEndTimesSeconds) {
        normalizedAlignmentChunks.push(data);
        console.log(`   ✅ Valid normalized alignment data - added to chunks`);
      } else {
        console.log(`   ❌ Invalid normalized alignment data - missing required properties`);
      }
    } catch (error) {
      console.error(`❌ Error loading ${file}:`, error.message);
    }
  }
  
  return { alignmentChunks, normalizedAlignmentChunks };
}

async function main() {
  const storyFolderArg = process.argv[2];
  
  if (!storyFolderArg) {
    console.error("Usage: node stories/merge-alignment.js <path/to/story/folder>");
    console.error("Example: node stories/merge-alignment.js stories/3_Low_Intermediate/El_sabado_de_la_feria_y_el_perro_perdido");
    process.exit(1);
  }
  
  // Resolve the story folder path
  const storyFolder = path.resolve(storyFolderArg);
  
  try {
    await fs.access(storyFolder);
  } catch (error) {
    console.error(`Story folder not found: ${storyFolder}`);
    process.exit(1);
  }
  
  console.log(`Processing alignment files in: ${storyFolder}`);
  
  // Load all chunk files
  const { alignmentChunks, normalizedAlignmentChunks } = await loadAlignmentChunks(storyFolder);
  
  console.log(`\nAlignment data collected: ${alignmentChunks.length} chunks`);
  console.log(`Normalized alignment data collected: ${normalizedAlignmentChunks.length} chunks`);
  
  // Combine alignment data
  if (alignmentChunks.length > 0) {
    console.log("\nCombining alignment data...");
    try {
      const combinedAlignment = await combineAlignmentData(alignmentChunks);
      if (combinedAlignment) {
        const alignmentPath = path.join(storyFolder, 'alignment.json');
        await fs.writeFile(alignmentPath, JSON.stringify(combinedAlignment, null, 2));
        console.log(`✅ Combined alignment data saved to: ${alignmentPath}`);
        console.log(`   Total characters: ${combinedAlignment.characters.length}`);
        console.log(`   Duration: ${Math.max(...combinedAlignment.characterEndTimesSeconds).toFixed(2)} seconds`);
      } else {
        console.warn("❌ No valid alignment data to combine");
      }
    } catch (error) {
      console.error("❌ Error combining alignment data:", error.message);
    }
  } else {
    console.warn("❌ No alignment data collected from any chunks");
  }
  
  // Combine normalized alignment data
  if (normalizedAlignmentChunks.length > 0) {
    console.log("\nCombining normalized alignment data...");
    try {
      const combinedNormalizedAlignment = await combineAlignmentData(normalizedAlignmentChunks);
      if (combinedNormalizedAlignment) {
        const normalizedAlignmentPath = path.join(storyFolder, 'normalized_alignment.json');
        await fs.writeFile(normalizedAlignmentPath, JSON.stringify(combinedNormalizedAlignment, null, 2));
        console.log(`✅ Combined normalized alignment data saved to: ${normalizedAlignmentPath}`);
        console.log(`   Total characters: ${combinedNormalizedAlignment.characters.length}`);
        console.log(`   Duration: ${Math.max(...combinedNormalizedAlignment.characterEndTimesSeconds).toFixed(2)} seconds`);
      } else {
        console.warn("❌ No valid normalized alignment data to combine");
      }
    } catch (error) {
      console.error("❌ Error combining normalized alignment data:", error.message);
    }
  } else {
    console.warn("❌ No normalized alignment data collected from any chunks");
  }
  
  console.log("\n🎉 Alignment merging complete!");
}

main().catch(err => {
  console.error("❌ Script failed:", err);
  process.exit(1);
});
