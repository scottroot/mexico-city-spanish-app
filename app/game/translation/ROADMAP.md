# Translation Game - Feature Roadmap

## Documentation Structure

**Individual feature specifications** are maintained in the `(features)` directory. Each feature has its own detailed spec file with requirements, implementation details, and testing plans.

📁 **Location:** `app/game/translation/(features)/`

**Template:** `feature-000-featurename(template).md` - Use this template for new features

---

## Features

### ✅ Feature 001 - Study Guide Modal on Quiz End
**Status:** Complete
**Spec:** [`feature-001-study-guide-modal.md`](./(features)/feature-001-study-guide-modal.md)

AI-generated study guides displayed in a modal after quiz completion. Analyzes mistakes and provides personalized learning recommendations.

**Key components:**
- StudyGuideModal component (self-contained, reusable)
- OpenAI integration for study guide generation
- Database: `study_guide`, `mistakes_count`, `quiz_history` columns

---

### ✅ Feature 002 - View Study Guide from Quiz History
**Status:** Complete
**Spec:** [`feature-002-view-study-guide-history.md`](./(features)/feature-002-view-study-guide-history.md)

Allows users to view study guides from previously completed quizzes via "View Study Guide" button in quiz history list.

**Key components:**
- PastQuizzesList component with conditional buttons
- Reuses StudyGuideModal from Feature 001

---

### 🔴 Feature 003 - Email Study Guide to User
**Status:** Not Started
**Spec:** [`feature-003-email-study-guide.md`](./(features)/feature-003-email-study-guide.md)

Sends study guide to user's registered email address via "Email Me This" button in modal.

**Key components:**
- Resend API integration
- Email template component
- Email sending endpoint

**Blockers:**
- Requires Resend account setup
- Requires `RESEND_API_KEY` environment variable
- Need to install `resend` package

---

### ✅ Feature 004 - Resume Incomplete Quizzes
**Status:** Complete
**Spec:** [`feature-004-resume-quiz.md`](./(features)/feature-004-resume-quiz.md)

Allows users to resume quizzes that were interrupted (page refresh, navigation, etc.). Progress automatically saved after each answer.

**Key components:**
- "Resume Quiz" button for incomplete quizzes
- State restoration from `quiz_history` JSONB
- Comprehensive study guide includes all mistakes (original + resumed)

---

### 🔴 Feature 005 - Focus Display Names
**Status:** Not Started
**Spec:** [`feature-005-focus-display-names.md`](./(features)/feature-005-focus-display-names.md)

Adds short, AI-generated display names for quiz focus areas in history list. Makes quiz history more scannable by replacing long prompts with concise 2-5 word names.

**Key components:**
- `focus_display_name` column in database
- OpenAI integration to summarize custom focus text
- Improved quiz history readability

---

## Database Schema

**Migration:** `database/add_translation_study_guide.sql`

**Table:** `translation_quizzes`
- `study_guide` (TEXT) - AI-generated HTML study guide
- `mistakes_count` (INTEGER) - Number of incorrect answers
- `quiz_history` (JSONB) - Question/answer/feedback history for resume functionality
- `completed` (BOOLEAN) - Determines if quiz can be resumed

---

## Environment Variables

```env
# Required for Feature 001, 002, 004
OPENAI_API_KEY=sk_xxxxx

# Required for Feature 003 (Email)
RESEND_API_KEY=re_xxxxx
```

---

## Quick Reference

**Completed Features:** 3/5 (60%)
**In Progress:** 0/5 (0%)
**Not Started:** 2/5 (40%)

**Next Up:** Feature 005 - Focus Display Names (UX improvement)
**Also Pending:** Feature 003 - Email Study Guide to User
