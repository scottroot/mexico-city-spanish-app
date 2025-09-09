// Script to add the shopping game to the database
import { createClient } from '@supabase/supabase-js';
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

async function addShoppingGame() {
  // You'll need to add your Supabase URL and anon key here
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase environment variables');
    console.log('Please add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to your .env file');
    return;
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  const shoppingGameData = {
    id: 'shopping-game-001',
    title: 'Tienda Checkout - Price Listening',
    type: 'shopping',
    difficulty: 'intermediate',
    content: {
      questions: [] // Shopping game doesn't use traditional questions
    }
  };

  try {
    console.log('Adding shopping game to database...');
    const { data, error } = await supabase
      .from('games')
      .insert([shoppingGameData])
      .select()
      .single();
    
    if (error) {
      console.error('❌ Failed to add shopping game:', error.message);
    } else {
      console.log('✅ Shopping game added successfully!');
      console.log('Game ID:', data.id);
      console.log('Access URL: http://localhost:3000/game?id=' + data.id);
    }
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

// Run the script
addShoppingGame();
