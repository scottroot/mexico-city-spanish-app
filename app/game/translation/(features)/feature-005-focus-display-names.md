# Feature 005 - Focus Display Names

## Summary
Adds human-readable display names for quiz focus areas in the quiz history list. Predefined focus areas use their preset names, while custom user-entered focus text is automatically summarized into a short, catchy name using AI.

## Motivation
Currently, the quiz history displays the full prompt text in the "Focus" field, which can be extremely long and makes the UI cluttered and hard to scan. Users can't quickly identify what a past quiz was about. This feature provides clean, scannable names that improve the quiz history UX.

## Requirements
- [ ] Add `focus_display_name` column to `translation_quizzes` table
- [ ] Run database migration to add column
- [ ] For predefined focus areas: store the focus area name (e.g., "Travel Basics")
- [ ] For custom user text: use OpenAI to generate a 2-5 word display name
- [ ] Display names should be concise (max 40 characters)
- [ ] Display names shown in PastQuizzesList instead of full prompt
- [ ] Fallback to truncated prompt if display name generation fails
- [ ] Backward compatibility: old quizzes without display name show truncated prompt
- [ ] Display name generation happens during quiz creation, not retroactively

## Non goals
- Regenerating display names for existing quizzes (only new quizzes)
- Allowing users to manually edit display names
- Translating display names to different languages
- Using display names for anything other than UI display (still use full prompt for AI)

## UX and flows

**Predefined focus area flow:**
1. User selects "Travel & Tourism" from focus area dropdown
2. Quiz created with:
   - `custom_focus` = full prompt ("Generate questions about...")
   - `focus_display_name` = "Travel & Tourism"
3. Quiz history shows: "Focus: Travel & Tourism"

**Custom text flow:**
1. User types custom focus: "I want to practice talking about my family and describing their personalities"
2. System sends to OpenAI: "Create a 2-5 word display name for: [user text]"
3. OpenAI returns: "Family Descriptions"
4. Quiz created with:
   - `custom_focus` = full user text
   - `focus_display_name` = "Family Descriptions"
5. Quiz history shows: "Focus: Family Descriptions"

**Fallback flow:**
1. User enters custom text
2. OpenAI call fails or times out
3. Quiz created with:
   - `custom_focus` = full user text
   - `focus_display_name` = null
4. Quiz history shows: "Focus: [first 40 chars]..."

**Screens affected:**
- Translation game start page (quiz history section)
- Past quizzes list component

## Data and API changes

**Database schema:**
- Table: `translation_quizzes`
  - Add `focus_display_name` (TEXT, nullable)

**Migration:** `database/add_focus_display_name.sql`

**New API functionality:**
- `POST /api/translation/quizzes` - Updated to generate display name
  - If predefined focus: extract name from focusAreas lookup
  - If custom text: call OpenAI to generate display name
  - Store both `custom_focus` (full prompt) and `focus_display_name`

**OpenAI call for custom text:**
- Model: `gpt-4o-mini`
- Temperature: 0.5 (more deterministic)
- Max tokens: 20
- System prompt: "You are a helpful assistant that creates short, catchy 2-5 word names for quiz topics."
- User prompt: "Create a brief 2-5 word display name for this quiz focus: [user_text]"

## Component and file plan
- `database/add_focus_display_name.sql` - Create migration file
- `app/api/translation/quizzes/route.ts` - Update POST to generate display names
- `app/game/translation/TranslationGameStart.tsx` - Update PastQuiz interface
- `app/game/translation/PastQuizzesList.tsx` - Display focus_display_name
- `app/api/translation/quizzes/route.ts` - Update GET to return focus_display_name

## Implementation plan

1. **Create database migration:**
   ```sql
   ALTER TABLE translation_quizzes
   ADD COLUMN IF NOT EXISTS focus_display_name TEXT;

   COMMENT ON COLUMN translation_quizzes.focus_display_name IS
   'Short, human-readable name for quiz focus (2-5 words)';
   ```

2. **Update TypeScript interfaces:**
   - Add `focus_display_name: string | null` to PastQuiz interface

3. **Update quiz creation API (`POST /api/translation/quizzes`):**
   - Check if customFocus matches a predefined focus area
   - If yes: use focusArea.name as display name
   - If no (custom text): call OpenAI helper function
   - Helper function: `generateFocusDisplayName(customText: string)`
     - Call gpt-4o-mini with summarization prompt
     - Return 2-5 word display name
     - Timeout after 5 seconds
     - On error: return null (fallback to UI truncation)
   - Store display name in database on quiz creation

4. **Update quiz list API (`GET /api/translation/quizzes`):**
   - Add `focus_display_name` to SELECT statement

5. **Update PastQuizzesList display:**
   - Change from `quiz.custom_focus` to display logic:
   ```typescript
   const displayFocus = quiz.focus_display_name
     || (quiz.custom_focus ? quiz.custom_focus.substring(0, 40) + '...' : null)
     || 'General Practice';
   ```

6. **Create OpenAI helper function:**
   - File: `app/api/translation/quizzes/route.ts` (inline helper)
   - Function signature: `async function generateFocusDisplayName(text: string): Promise<string | null>`
   - Use structured output or simple completion
   - Handle errors gracefully

7. **Test complete flow:**
   - Test with predefined focus area
   - Test with custom text
   - Test with very long custom text
   - Test OpenAI failure scenario
   - Test old quizzes display correctly

## Edge cases

| Scenario | Expected Behavior |
|----------|-------------------|
| User selects predefined focus | Use preset name (e.g., "Travel Basics") |
| User types short custom text (< 40 chars) | Generate AI name, fallback to original if fails |
| User types very long custom text (> 200 chars) | Generate AI name from full text, fallback to truncated |
| OpenAI API timeout or failure | Store null, display truncated custom_focus |
| OpenAI returns name > 40 chars | Truncate to 40 chars |
| Old quiz without focus_display_name | Display truncated custom_focus |
| Quiz with no focus at all | Display "General Practice" |
| Empty custom text | Display "General Practice" |
| Special characters in custom text | OpenAI handles, sanitize if needed |

## Testing plan

**Manual testing:**
- Create quiz with "Travel Basics" predefined focus
  - Verify display name = "Travel Basics"
- Create quiz with custom text: "I want to practice ordering food at restaurants"
  - Verify AI generates name like "Restaurant Ordering"
- Create quiz with very long custom paragraph
  - Verify AI generates concise name
- Disconnect internet, create quiz with custom text
  - Verify fallback to truncated text works
- Check old quiz without focus_display_name
  - Verify truncated display works

**Integration testing:**
- Mock OpenAI API responses
- Test timeout handling (5 second limit)
- Test error responses from OpenAI
- Verify database stores display name correctly

**Performance testing:**
- Measure OpenAI response time for display name generation
- Ensure doesn't significantly delay quiz creation
- Consider async generation if too slow (display "Generating..." then update)

## Status
**Not started**

## Implementation notes
- Display name generation happens synchronously during quiz creation to keep UX simple
- If OpenAI takes > 5 seconds, timeout and use fallback (don't block quiz creation)
- Consider caching common custom focus texts → display names to reduce API calls
- Could batch process old quizzes to backfill display names, but not priority
- Focus areas array is in `app/game/translation/focus-areas.ts` - use this for lookup
- Display name stored separately from prompt to maintain AI context quality
- Future enhancement: allow users to edit display names in settings
