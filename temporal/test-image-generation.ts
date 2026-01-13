#!/usr/bin/env tsx

/**
 * Test script for generateImageLangchain function
 * 
 * Usage:
 *   cd temporal
 *   GOOGLE_API_KEY=your-key tsx test-image-generation.ts
 */

import { generateImageLangchain } from './activities/stories/image';
import { writeFile } from 'fs/promises';
import { join } from 'path';

async function testImageGeneration() {
  console.log('🧪 Testing generateImageLangchain function...\n');

  if (!process.env.GOOGLE_API_KEY) {
    console.error('❌ Error: GOOGLE_API_KEY environment variable is not set');
    process.exit(1);
  }

  // Test parameters
  const testParams = {
    storyTitle: 'Una Aventura en el Parque',
    storyText: 'María va al parque todos los días. Ella juega con su perro. El parque es muy bonito. Hay muchos árboles y flores.',
    tempDir: './',
  };

  console.log('📝 Test parameters:');
  console.log(`   Title: ${testParams.storyTitle}`);
  console.log(`   Text: ${testParams.storyText.substring(0, 50)}...\n`);

  try {
    console.log('🚀 Generating image...\n');
    // const result = await generateStoryImage(testParams);
    const result = await generateImageLangchain(testParams);
    console.log('result keys: ', Object.keys(result));
    for (const key of Object.keys(result)) {
      const val = result[key as keyof typeof result];
      if(typeof val === 'object') {
        console.log(key, ':', Object.keys(val));
      }
    }
    console.log('=====================================');

    console.log('✅ Image generated successfully!');
    console.log(`   URL type: ${result.imageFile}`);

    console.log('\n✨ Test completed successfully!');
  } 
  catch (error) {
    console.error('\n❌ Test failed:');
    if (error instanceof Error) {
      console.error(`   ${error.message}`);
      if (error.stack) {
        console.error('\n   Stack trace:');
        console.error(error.stack);
      }
    }
    else {
      console.error(error);
    }
    process.exit(1);
  }
}

// Run the test
testImageGeneration();
