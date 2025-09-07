require('dotenv').config();
const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');
const path = require('path');
const Papa = require('papaparse');

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Using Papa Parse for robust CSV parsing

async function importVerbs() {
  console.log('🚀 Starting verb conjugation import...');
  
  const verbs = new Map();
  const conjugations = [];
  const csvPath = path.join(__dirname, '../app/external-app-to-integrate/external-app/verbs_filled.csv');

  // Check if CSV file exists
  if (!fs.existsSync(csvPath)) {
    console.error('❌ CSV file not found at:', csvPath);
    console.log('Please make sure the verbs.csv file exists in the correct location.');
    return;
  }

  console.log('📖 Reading CSV file:', csvPath);

  // Use Papa Parse for robust CSV parsing
  const csvContent = fs.readFileSync(csvPath, 'utf8');
  
  console.log('📋 Parsing CSV with Papa Parse...');
  
  const parseResult = Papa.parse(csvContent, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (header) => header.trim(),
    transform: (value) => value?.trim() || ''
  });

  if (parseResult.errors.length > 0) {
    console.warn('⚠️ CSV parsing warnings:', parseResult.errors.slice(0, 5));
  }

  console.log(`📊 Parsed ${parseResult.data.length} rows from CSV`);

  // Process each row
  for (let i = 0; i < parseResult.data.length; i++) {
    const row = parseResult.data[i];
    
    // Debug: log first few rows
    if (i < 3) {
      console.log('🔍 Sample row:', {
        infinitive: row.infinitive,
        infinitive_english: row.infinitive_english,
        mood: row.mood
      });
    }
    
    const infinitive = row.infinitive?.trim();
    
    if (!infinitive || infinitive === '') {
      console.warn(`⚠️ Skipping row ${i + 1} with missing infinitive:`, {
        infinitive: row.infinitive,
        keys: Object.keys(row)
      });
      continue;
    }
    
    // Store unique verbs
    if (!verbs.has(infinitive)) {
      verbs.set(infinitive, {
        infinitive: infinitive,
        infinitive_english: row.infinitive_english?.trim() || ''
      });
    }

    // Store conjugation
    conjugations.push({
      infinitive: infinitive,
      mood: row.mood?.trim() || '',
      mood_english: row.mood_english?.trim() || '',
      tense: row.tense?.trim() || '',
      tense_english: row.tense_english?.trim() || '',
      verb_english: row.verb_english?.trim() || '',
      form_1s: row.form_1s?.trim() || '',
      form_2s: row.form_2s?.trim() || '',
      form_3s: row.form_3s?.trim() || '',
      form_1p: row.form_1p?.trim() || '',
      form_2p: row.form_2p?.trim() || '',
      form_3p: row.form_3p?.trim() || '',
      form_1s_english: row.form_1s_english?.trim() || '',
      form_2s_english: row.form_2s_english?.trim() || '',
      form_3s_english: row.form_3s_english?.trim() || '',
      form_1p_english: row.form_1p_english?.trim() || '',
      form_2p_english: row.form_2p_english?.trim() || '',
      form_3p_english: row.form_3p_english?.trim() || '',
      gerund: row.gerund?.trim() || '',
      gerund_english: row.gerund_english?.trim() || '',
      pastparticiple: row.pastparticiple?.trim() || '',
      pastparticiple_english: row.pastparticiple_english?.trim() || ''
    });
  }

  // Process the data
  try {
    console.log(`📊 Found ${verbs.size} unique verbs and ${conjugations.length} conjugations`);

    // Step 1: Insert verbs
    console.log('📝 Inserting verbs...');
    const verbArray = Array.from(verbs.values());
    
    const { data: verbData, error: verbError } = await supabase
      .from('verbs')
      .upsert(verbArray, { 
        onConflict: 'infinitive',
        ignoreDuplicates: false 
      });

    if (verbError) {
      console.error('❌ Error inserting verbs:', verbError);
      throw verbError;
    }

    console.log(`✅ Successfully inserted/updated ${verbArray.length} verbs`);

    // Step 2: Get verb IDs for conjugations
    console.log('🔍 Fetching verb IDs...');
    const { data: allVerbs, error: fetchError } = await supabase
      .from('verbs')
      .select('id, infinitive');

    if (fetchError) {
      console.error('❌ Error fetching verbs:', fetchError);
      throw fetchError;
    }

    const verbIdMap = new Map(allVerbs.map(v => [v.infinitive, v.id]));
    console.log(`📋 Mapped ${verbIdMap.size} verb IDs`);

    // Step 3: Add verb_id to conjugations
    const conjugationsWithIds = conjugations.map(conj => ({
      ...conj,
      verb_id: verbIdMap.get(conj.infinitive)
    })).filter(conj => conj.verb_id); // Filter out any without verb_id

    console.log(`📝 Preparing ${conjugationsWithIds.length} conjugations for import...`);

    // Step 4: Insert conjugations in batches
    const batchSize = 1000;
    const totalBatches = Math.ceil(conjugationsWithIds.length / batchSize);
    
    for (let i = 0; i < conjugationsWithIds.length; i += batchSize) {
      const batch = conjugationsWithIds.slice(i, i + batchSize);
      const batchNumber = Math.floor(i / batchSize) + 1;
      
      console.log(`📦 Inserting batch ${batchNumber}/${totalBatches} (${batch.length} records)...`);
      
      const { error: conjError } = await supabase
        .from('verb_conjugations')
        .insert(batch);

      if (conjError) {
        console.error(`❌ Error inserting batch ${batchNumber}:`, conjError);
        throw conjError;
      }
      
      console.log(`✅ Batch ${batchNumber}/${totalBatches} completed`);
    }

    console.log('🎉 Import completed successfully!');
    console.log(`📊 Final stats:`);
    console.log(`   - Verbs: ${verbArray.length}`);
    console.log(`   - Conjugations: ${conjugationsWithIds.length}`);
    
  } catch (error) {
    console.error('💥 Import failed:', error);
    throw error;
  }
}

// Run the import
if (require.main === module) {
  importVerbs()
    .then(() => {
      console.log('✨ Import process completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Import process failed:', error);
      process.exit(1);
    });
}

module.exports = { importVerbs };
