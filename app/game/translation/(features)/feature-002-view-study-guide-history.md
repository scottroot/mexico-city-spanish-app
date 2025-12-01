# Feature 002 - View Study Guide from Quiz History

## Summary
Allows users to view study guides from previously completed quizzes by clicking a "View Study Guide" button in the quiz history list. Reuses the same StudyGuideModal component from Feature 001, providing a consistent experience for accessing past learning recommendations.

## Motivation
Users want to review study guides from past quizzes to reinforce learning or revisit recommendations. Without this feature, study guides are only visible once at quiz completion and then lost. This feature makes study guides a persistent learning resource that users can reference anytime.

## Requirements
- [x] Add `study_guide` and `mistakes_count` fields to PastQuiz TypeScript interface
- [x] Update quiz list API to return study_guide and mistakes_count
- [x] Display "View Study Guide" button for completed quizzes that have study guides
- [x] Clicking button opens StudyGuideModal with that quiz's study guide
- [x] Modal shows same content as originally generated (not regenerated)
- [x] Reuse existing StudyGuideModal component (no duplication)
- [x] Button only appears for completed quizzes with study guides
- [x] Incomplete quizzes show "Resume Quiz" button instead

## Non goals
- Regenerating study guides for old quizzes
- Editing or updating existing study guides
- Comparing study guides across multiple quizzes
- Filtering or searching quizzes by study guide content

## UX and flows
1. User navigates to translation game start page
2. Past quizzes list displays below game start options
3. For each completed quiz with a study guide:
   - Shows quiz metadata (date, score, direction, focus)
   - Displays "View Study Guide" button (orange gradient)
   - Displays "Start Similar" button
4. User clicks "View Study Guide" button
5. StudyGuideModal opens with fade/scale animation
6. Study guide content displayed
7. User reads study guide, optionally emails it
8. User closes modal
9. Returns to quiz history list

**Screens affected:**
- Translation game start page (quiz history section)
- StudyGuideModal (overlay)

## Data and API changes

**TypeScript interface updates:**
- `PastQuiz` interface in `TranslationGameStart.tsx`
  - Add `study_guide: string | null`
  - Add `mistakes_count: number`

**Updated API endpoints:**
- `GET /api/translation/quizzes` - Returns study_guide and mistakes_count fields

**Existing endpoints used:**
- `GET /api/translation/quizzes/[quizId]` - StudyGuideModal fetches full quiz data

## Component and file plan
- `app/game/translation/TranslationGameStart.tsx` - Add state and handler for viewing study guides
- `app/game/translation/PastQuizzesList.tsx` - Add "View Study Guide" button, pass handler
- `app/game/translation/StudyGuideModal.tsx` - Reused (no changes needed)
- `app/api/translation/quizzes/route.ts` - Update SELECT to include study_guide and mistakes_count

## Implementation plan
1. Update `PastQuiz` interface to include `study_guide` and `mistakes_count`
2. Update `GET /api/translation/quizzes` to select study_guide and mistakes_count
3. Update `PastQuizzesList.tsx`:
   - Import `BookOpen` icon
   - Add `onViewStudyGuide` prop
   - Add "View Study Guide" button conditionally (if quiz.study_guide exists)
   - Style with orange-to-pink gradient
4. Update `TranslationGameStart.tsx`:
   - Import `StudyGuideModal`
   - Add `viewStudyGuideQuizId` state
   - Add `handleViewStudyGuide` handler
   - Pass handler to PastQuizzesList
   - Render StudyGuideModal at bottom with quizId state
5. Test viewing study guides from quiz history

## Edge cases
- Quiz completed but no study guide (0 mistakes): No "View Study Guide" button shown
- Study guide fetch fails: Modal shows error toast
- Very old quizzes before feature existed: No study guide button (study_guide is null)
- User clicks button multiple times quickly: State prevents duplicate modals
- Network error while fetching: Modal displays error message

## Testing plan

**Manual testing:**
- Complete quiz with mistakes, verify study guide saved
- Return to quiz list, verify "View Study Guide" button appears
- Click button, verify modal opens with correct content
- Close modal, verify return to quiz list
- Check quiz with 0 mistakes has no "View Study Guide" button
- Verify completed quizzes show "View Study Guide" not "Resume Quiz"

**Integration testing:**
- Verify API returns study_guide field
- Verify modal fetches correct quiz by ID
- Verify button conditionally rendered based on study_guide presence

**Accessibility:**
- Button has clear label and icon
- Keyboard accessible
- Modal maintains same accessibility as Feature 001

## Status
**Complete** - Implemented and tested on 2025-11-30

## Implementation notes
- Reuses StudyGuideModal component with zero changes (fully self-contained design pays off)
- Button styling matches existing gradient theme (orange-to-pink)
- Conditional rendering: incomplete quizzes show "Resume", completed with study guide show "View Study Guide", all show "Start Similar"
- Study guides are never regenerated, always fetched from database
- Modal state managed in parent (TranslationGameStart) to avoid prop drilling
