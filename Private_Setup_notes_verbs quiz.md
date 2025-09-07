Review the @INSTRUCTIONS_START.md 
Then, come up with a plan to create the following.

\# New "Custom Quiz" page:
\* Allows user to select tenses include (user can include one single tense and mood, or one tense across different moods, or multiple tenses, etc.)
\* Allows user to select a specific set of verbs to quiz (can either quick select "favorited verbs" and just quiz on those, or can manually select a custom list to use.)
\* Allows user to select how many questions to have in the quiz, they select from dropdown from options like 5,10,15,20,25,30,35,40,45,50,...
\* Once these options are selected, they click Start button
\* Quiz is launched.

\# Quiz format
\* Quiz shows as follows:
\```
We ate
Past Tense - Indicative
([button] Reveal Infinitive)

[text input box]
\```
\* User would type in "comimos" and hit enter or a submit button
\* Answer displayed just like the other games showing right or wrong.

----

## Plan for Custom Quiz Feature

Based on my analysis of the codebase, here's my plan to create the Custom Quiz page:

### 1. **Custom Quiz Setup Page** (`/app/quiz/page.js`)
- **Tense Selection**: Multi-select interface for choosing tenses and moods
- **Verb Selection**: 
  - Quick select "Favorited Verbs" option
  - Manual verb selection with search/filter
- **Question Count**: Dropdown with options (5, 10, 15, 20, 25, 30, 35, 40, 45, 50)
- **Start Button**: Launches the quiz

### 2. **Custom Quiz Game Component** (`/components/games/CustomQuizGame.js`)
- **Question Format**: 
  ```
  "We ate"
  "Past Tense - Indicative"
  [Reveal Infinitive button]
  [Text input box]
  ```
- **Answer Validation**: Compare user input with correct conjugation
- **Progress Tracking**: Similar to existing games with score/mistakes tracking
- **Database Integration**: Save progress using existing Progress entity

### 3. **API Endpoint** (`/app/api/quiz/route.ts`)
- **Quiz Generation**: Create quiz questions based on selected parameters
- **Verb Filtering**: Filter verbs by favorites or custom selection
- **Tense/Mood Filtering**: Generate questions for selected tenses and moods
- **Randomization**: Randomly select verbs and forms for variety

### 4. **Database Integration**
- **Use Existing Tables**: Leverage `verbs`, `verb_conjugations`, and `user_favorites` tables
- **Progress Tracking**: Use existing `progress` table with `game_type: 'custom_quiz'`
- **Favorites Integration**: Use existing `Favorites` entity for quick verb selection

### 5. **Translation Support**
- **Add Quiz Translations**: Extend translation files with quiz-specific terms
- **Language-Aware UI**: Support English/Spanish interface toggle
- **Tense Name Translation**: Use existing tense translation system

### 6. **UI/UX Features**
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Theme Integration**: Orange-pink gradient theme matching app design
- **TTS Integration**: Optional pronunciation for questions and answers
- **Progress Visualization**: Progress bar and score tracking
- **Result Display**: Right/wrong feedback with explanations

### 7. **Navigation Integration**
- **Add to Main Menu**: Include "Custom Quiz" in navigation
- **Route Protection**: Use existing authentication system
- **Breadcrumb Navigation**: Easy navigation back to setup

### 8. **Technical Implementation**
- **TypeScript Support**: Use existing type definitions for verbs and conjugations
- **Error Handling**: Comprehensive error handling for API failures
- **Loading States**: Proper loading indicators during quiz generation
- **Performance**: Efficient quiz generation and question loading

This plan leverages the existing architecture while adding the new Custom Quiz functionality. The implementation will be consistent with the app's design patterns, use existing database tables, and integrate seamlessly with the current authentication and progress tracking systems.

Would you like me to proceed with implementing this plan?