# Feature 001 - Study Guide Modal on Quiz End

## Summary
Automatically generates and displays AI-powered study guides in a modal when users complete a translation quiz with mistakes. The study guide analyzes error patterns across all incorrect answers and provides 3-5 personalized, actionable learning recommendations to help users improve their translation skills.

## Motivation
Users complete quizzes but have no way to learn from their mistakes systematically. They might repeat the same errors without understanding the underlying patterns. This feature provides immediate, personalized feedback that helps users identify weak areas and gives them concrete steps to improve.

## Requirements
- [x] Study guide only generated when user makes at least one mistake
- [x] Uses OpenAI gpt-4o-mini to analyze mistakes and generate recommendations
- [x] Modal appears automatically after user clicks "End Quiz"
- [x] Study guide provides 3-5 actionable takeaways
- [x] Study guide saved to database for future reference
- [x] Modal uses framer-motion for smooth animations
- [x] User can close modal via close button, backdrop click, or ESC key
- [x] After modal closes, user returns to quiz completion screen
- [x] Modal is reusable across different contexts (quiz end and history viewing)

## Non goals
- Regenerating study guides for the same quiz
- Allowing users to edit or customize study guide content
- Sharing study guides with other users
- Downloading study guides as PDF (future enhancement)

## UX and flows
1. User answers questions in translation quiz
2. Each answer's feedback is collected in memory
3. User clicks "End Quiz" button
4. If user made mistakes:
   - Loading indicator while AI generates study guide
   - Modal fades in with scale animation
   - Study guide content displayed in formatted HTML
   - "Email Me This" and "Close" buttons at bottom
5. User reads study guide recommendations
6. User clicks Close or backdrop
7. Modal animates out
8. Quiz completion screen appears

**Screens affected:**
- Translation quiz game screen (shows modal overlay)
- Quiz completion/results screen (appears after modal closes)

## Data and API changes

**Database schema:**
- Table: `translation_quizzes`
  - `study_guide` (TEXT) - AI-generated HTML study guide content
  - `mistakes_count` (INTEGER) - Number of incorrect answers
  - `quiz_history` (JSONB) - Array of question/answer/feedback objects

**Migration:** `database/add_translation_study_guide.sql`

**New API endpoint:**
- `POST /api/translation/generate-study-guide`
  - Request: `{ mistakes: [], translationDirection: string, customFocus?: string }`
  - Response: `{ studyGuide: string, tokenUsage: object }`

**Updated API endpoints:**
- `GET /api/translation/quizzes/[quizId]` - Now returns `study_guide` field
- `PATCH /api/translation/quizzes/[quizId]` - Accepts `study_guide` and `mistakes_count`

## Component and file plan
- `app/game/translation/StudyGuideModal.tsx` - Self-contained modal component
- `app/game/translation/TranslationGame.tsx` - Tracks quiz history, generates study guide, shows modal
- `app/api/translation/generate-study-guide/route.ts` - OpenAI integration for study guide generation
- `app/api/translation/quizzes/[quizId]/route.ts` - Updated GET to return study_guide field
- `database/add_translation_study_guide.sql` - Database migration

## Implementation plan
1. Run database migration to add `study_guide`, `mistakes_count`, and `quiz_history` columns
2. Create `StudyGuideModal.tsx` with framer-motion animations
   - Accept `quizId` and `onComplete` props
   - Fetch quiz data when quizId changes
   - Display study guide with formatted HTML
   - Handle loading and error states
3. Create `POST /api/translation/generate-study-guide` endpoint
   - Accept array of mistakes with question/answer/feedback
   - Format prompt for OpenAI
   - Call gpt-4o-mini with temperature 0.7
   - Return generated study guide HTML
4. Update `TranslationGame.tsx`
   - Add `quizHistory` state to track all answers
   - Collect feedback after each answer submission
   - In `handleFinish()`, filter mistakes and call generate-study-guide API
   - Save study guide to database via PATCH
   - Show modal by setting `showStudyGuideForQuiz` state
   - Wait for modal close before calling `onComplete()`
5. Update `GET /api/translation/quizzes/[quizId]` to include study_guide in SELECT
6. Test complete flow

## Edge cases
- Quiz with zero mistakes: No study guide generated, no modal shown, proceed directly to completion
- OpenAI API timeout or failure: Log error, complete quiz without study guide, don't block user
- Database save failure: Log error but don't block quiz completion
- Very long study guide: Modal content scrolls with sticky header/footer
- User closes modal immediately: onComplete called, returns to quiz list normally
- Study guide fetch fails in modal: Show error toast, display fallback message

## Testing plan

**Manual testing:**
- Complete quiz with 3+ mistakes, verify study guide appears and is relevant
- Complete quiz with 0 mistakes, verify no modal appears
- Click close button, backdrop, and ESC key to close modal
- Verify modal animations are smooth
- Check study guide saved to database after generation
- Test on mobile viewport

**Integration testing:**
- Verify OpenAI API called with correct mistake data
- Verify study guide HTML is sanitized and safe
- Verify database PATCH includes all required fields

**Accessibility:**
- ESC key closes modal
- Focus trap prevents tabbing outside modal
- Close button has aria-label
- Screen reader announces modal content

## Status
**Complete** - Implemented and tested on 2025-11-30

## Implementation notes
- Modal uses `dangerouslySetInnerHTML` for study guide HTML - OpenAI output is trusted
- Modal is fully self-contained to maximize reusability (used in both quiz end and history viewing)
- Study guide generation uses `gpt-4o-mini` for cost efficiency (~10-30 seconds response time)
- `quizHistory` state maintained in TranslationGame to avoid database calls during quiz
- Study guide only generated once per quiz, never regenerated (saved to DB)
- Modal waits for close before calling onComplete() to prevent jarring transitions
