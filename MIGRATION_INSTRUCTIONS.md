# Database Migration Instructions

## Add Image Column to Games Table

To add dedicated card images to the games, you need to run the following SQL migration in your Supabase dashboard:

### Steps:

1. **Go to your Supabase Dashboard**
   - Navigate to your project
   - Go to the SQL Editor

2. **Run the Migration**
   - Copy and paste the contents of `database/add_games_image_column.sql`
   - Click "Run" to execute the migration

3. **Verify the Changes**
   - The migration will add two new columns to the `games` table:
     - `image_url` (TEXT) - URL to the game's card image
     - `description` (TEXT) - Description of the game
   - It will also populate existing games with default images and descriptions

### What the Migration Does:

- ✅ Adds `image_url` column to store game card images
- ✅ Adds `description` column for better game descriptions
- ✅ Updates existing games with default images based on game type:
  - **Vocabulary**: Books/learning image
  - **Grammar**: Writing/grammar image  
  - **Pronunciation**: Audio/speaking image
  - **Shopping**: Shopping/market image
- ✅ Updates existing games with default descriptions

### After Running the Migration:

The game cards on the homepage will automatically:
- Display the background image from the database
- Show the description from the database
- Fall back to default images/descriptions if database values are null
- Support both English and Spanish descriptions via the translation system

### Customizing Images:

You can update individual game images by:
1. Going to the Supabase Table Editor
2. Finding the `games` table
3. Editing the `image_url` field for specific games
4. Using any publicly accessible image URL

The game cards will automatically pick up the new images!
