# Feature 004 - Resume Incomplete Quizzes

## Summary
Allows users to resume translation quizzes that were interrupted due to page refresh, accidental navigation, or intentional pause. Quiz progress is automatically saved after each answer, and users can pick up exactly where they left off. Once a quiz is completed and has a study guide, it cannot be resumed.

## Motivation
Users lose all progress when they accidentally refresh the page, close the tab, or navigate away during a quiz. This creates frustration and wastes the time they already invested. This feature preserves progress automatically and provides a seamless resume experience, making the quiz system more resilient and user-friendly.

## Requirements
- [x] Save quiz progress (`quiz_history`, `questions_count`, `score`) after each answer
- [x] Display "Resume Quiz" button for incomplete quizzes in history list
- [x] Clicking resume button loads quiz in exact state user left it
- [x] Restore question index, score, mistakes count, and quiz history
- [x] User continues answering from next unanswered question
- [x] Study guide generated includes ALL mistakes (original + resumed session)
- [x] Once quiz marked complete, resume button disappears
- [x] Completed quizzes show "View Study Guide" button instead
- [x] Resume button styled differently from study guide button (blue vs orange)
- [x] Old quizzes without quiz_history cannot be resumed

## Non goals
- Resuming completed quizzes to add more questions
- "Extend Quiz" feature for adding questions to completed quiz (future enhancement)
- Branching quiz sessions from same starting point
- Saving in-progress answer text (only completed answers saved)
- Time tracking for resume sessions

## UX and flows

**Normal quiz flow:**
1. User starts new quiz
2. Answers questions
3. Each answer saved to database immediately
4. User clicks "End Quiz"
5. Study guide generated
6. Quiz marked complete

**Resume flow:**
1. User starts quiz, answers 3 questions
2. User accidentally refreshes page
3. Returns to quiz start page
4. Sees incomplete quiz with "Resume Quiz" button (blue gradient)
5. Clicks "Resume Quiz"
6. Quiz loads with previous score and progress restored
7. Continues from question 4
8. Answers 3 more questions
9. Clicks "End Quiz"
10. Study guide generated with ALL 6 questions' mistakes
11. Quiz marked complete
12. Button changes to "View Study Guide" (orange gradient)

**Screens affected:**
- Translation game start page (shows Resume button)
- Translation quiz game (handles resume state)

## Data and API changes

**Database schema (no changes, existing columns used):**
- `translation_quizzes.quiz_history` (JSONB) - Stores question/answer/feedback array
- `translation_quizzes.completed` (BOOLEAN) - Determines if resume allowed
- `translation_quizzes.questions_count` (INTEGER) - Current progress
- `translation_quizzes.score` (INTEGER) - Current score

**Updated API endpoints:**
- `GET /api/translation/quizzes/[quizId]` - Now returns `quiz_history` field
- `PATCH /api/translation/quizzes/[quizId]` - Now accepts `quiz_history` field

**Resume logic:**
```
IF completed = false THEN
  Show "Resume Quiz" button
ELSE IF study_guide IS NOT NULL THEN
  Show "View Study Guide" button
END IF

Always show "Start Similar" button
```

## Component and file plan
- `app/game/translation/PastQuizzesList.tsx` - Add "Resume Quiz" button, conditional rendering
- `app/game/translation/TranslationGame.tsx` - Accept resumeQuizId prop, restore state
- `app/game/translation/TranslationGameWrapper.tsx` - Add resume handler and state
- `app/game/translation/TranslationGameStart.tsx` - Pass resume handler to list
- `app/api/translation/quizzes/[quizId]/route.ts` - Return quiz_history in GET

## Implementation plan
1. Update `PastQuizzesList.tsx`:
   - Import `Play` icon
   - Add `onResumeQuiz` prop
   - Add conditional "Resume Quiz" button for `!quiz.completed`
   - Style with blue-to-cyan gradient
   - Keep "View Study Guide" button for completed quizzes
2. Update `TranslationGame.tsx`:
   - Add `resumeQuizId` prop to interface
   - Update initialization useEffect to handle resume:
     - If resumeQuizId provided, fetch quiz data
     - Restore quizHistory, score, mistakes, currentQuestionIndex
     - Continue from last question
   - Update `updateQuizStats` to save quiz_history after each answer
   - Modify handleSubmit to pass updated history to updateQuizStats
3. Update `TranslationGameWrapper.tsx`:
   - Add `resumeQuizId` state
   - Add `handleResume` function
   - Pass resumeQuizId to TranslationGame
   - Pass onResumeQuiz to TranslationGameStart
   - Clear resume state on completion
4. Update `TranslationGameStart.tsx`:
   - Add `onResumeQuiz` prop
   - Pass to PastQuizzesList
5. Update `GET /api/translation/quizzes/[quizId]`:
   - Include `quiz_history` in SELECT statement
6. Test resume flow thoroughly

## Edge cases
- User refreshes during quiz: Progress saved, can resume
- User answers question but doesn't submit: Answer lost (only saved on submit)
- Old incomplete quizzes without quiz_history: Cannot resume, start fresh
- User tries to resume completed quiz: Resume button not shown
- Multiple browser tabs: Each tab loads current state, last save wins
- Resume quiz that was created before this feature: Gracefully handle missing quiz_history
- Study guide includes mistakes from both sessions: Works correctly, all in quiz_history array

## Testing plan

**Manual testing:**
- Start quiz, answer 2 questions, refresh page
- Verify "Resume Quiz" button appears
- Click resume, verify score and progress restored
- Answer 2 more questions
- Click "End Quiz"
- Verify study guide includes all 4 questions' mistakes
- Verify button changes to "View Study Guide"
- Try to resume completed quiz (button should be gone)

**Integration testing:**
- Verify quiz_history saved after each answer
- Verify state restoration loads correct data
- Verify study guide generation uses complete quiz_history
- Verify old quizzes handle missing quiz_history gracefully

**Edge case testing:**
- Refresh after each question (1-10)
- Resume multiple times
- Complete quiz from resumed state
- Check completed quiz can't be resumed

## Status
**Complete** - Implemented and tested on 2025-11-30

## Implementation notes
- quiz_history saved after EVERY answer to enable resume from any point
- Could optimize to save every 3-5 questions to reduce DB writes, but simpler to save always
- Resume uses same TranslationGame component, just different initialization
- State restoration happens in useEffect based on resumeQuizId prop
- Button conditional rendering: incomplete → Resume (blue), completed + study guide → View (orange)
- Study guide generation works identically whether quiz was resumed or not
- No special handling needed in generate-study-guide API - just processes quiz_history array
- Tradeoff: More DB writes (every answer) for better UX (resume from any point)
- Alternative considered: Batch saves every 5 questions - rejected for complexity
