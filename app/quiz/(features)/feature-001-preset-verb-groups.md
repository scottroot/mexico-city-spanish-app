# Feature 001 - Preset Verb Groups

## Summary
Add predefined verb groups (e.g., "Top 100 Verbs", "Travel Verbs", "Workplace Verbs") that users can select when configuring custom quizzes, providing quick access to curated verb lists instead of manually selecting individual verbs.

## Motivation
Currently, users must either use their favorites or manually search and select individual verbs from the full list. This is time-consuming for users who want to practice common verb sets. Preset groups solve this by:
- Reducing configuration time for common use cases
- Exposing users to well-curated verb lists (frequency-based, thematic)
- Providing a better onboarding experience for new users who don't have favorites yet

## Requirements
- [ ] Users can select from preset verb groups when configuring a quiz
- [ ] Preset groups include at least: Top 100, Top 50, Top 25 verbs
- [ ] Thematic groups include: Travel, Food, Workplace, Daily Life
- [ ] Selected preset group populates the verb list for the quiz
- [ ] Users can see which preset group is currently selected (if any)
- [ ] Preset groups work alongside existing Favorites and Custom selection modes
- [ ] All verbs in preset groups must exist in the verbs database

## Non goals
- User-created custom groups (future feature)
- Editing/modifying preset groups through UI
- Syncing groups across devices (they're static)
- Complex group filtering or search

## UX and flows

### Current flow:
1. User clicks "Custom" or "Favorites" button to choose verb selection mode
2. If Custom: Opens modal to search/select individual verbs
3. If Favorites: Uses their favorited verbs

### New flow:
1. User sees three options: "Favorites", "Preset Groups", "Custom"
2. If "Preset Groups": Shows grid/list of available preset groups
3. User selects a preset group (e.g., "Top 100 Verbs")
4. Verb list is populated with that group's verbs
5. User can optionally switch to "Custom" to modify the list

### UI Changes:
- Add "Preset Groups" button alongside "Favorites" and "Custom"
- When selected, show a grid of preset group cards
- Each card shows: group name, description, verb count
- Selected group is highlighted
- Display selected group name in the main quiz config view

## Data and API changes

### Static Data Structure (app/quiz/verb-groups.ts):
```typescript
export interface VerbGroup {
  id: string
  name: string
  description: string
  category: 'frequency' | 'thematic' | 'level'
  verbs: string[] // array of verb infinitives
  displayOrder: number
}

export const VERB_GROUPS: VerbGroup[] = [
  {
    id: 'top-25',
    name: 'Top 25 Verbs',
    description: 'The 25 most commonly used Spanish verbs',
    category: 'frequency',
    verbs: ['ser', 'estar', 'haber', ...],
    displayOrder: 1
  },
  // ... more groups
]
```

### No API changes needed
- Verb groups loaded from static file
- Existing `/api/verbs` validates verbs exist

## Component and file plan

### New files:
- `app/quiz/verb-groups.ts` - Static verb group definitions
- `app/quiz/_components/PresetGroupSelector.tsx` - UI for selecting preset groups

### Modified files:
- `app/quiz/page.tsx` - Add "Preset Groups" option to verb selection
- `types/quiz.ts` - Add `presetGroupId?: string` to QuizConfig type

### Component structure:
```
app/quiz/page.tsx
├── Verb Selection Card
│   ├── Favorites button
│   ├── Preset Groups button (NEW)
│   └── Custom button
└── PresetGroupSelector modal (NEW)
    └── Grid of PresetGroupCard components
```

## Implementation plan

1. **Create verb groups data file**
   - Create `app/quiz/verb-groups.ts`
   - Define `VerbGroup` interface
   - Add initial preset groups with verb lists
   - Export `VERB_GROUPS` array

2. **Update types**
   - Add `presetGroupId?: string` to `QuizConfig` in `types/quiz.ts`
   - Update verb selection union type to include 'preset'

3. **Create PresetGroupSelector component**
   - Create `app/quiz/_components/PresetGroupSelector.tsx`
   - Display grid of available groups
   - Handle group selection
   - Visual feedback for selected group

4. **Update quiz page**
   - Add "Preset Groups" button in verb selection section
   - Integrate PresetGroupSelector component
   - Update state management to handle preset group selection
   - Populate `config.customVerbs` when preset group is selected
   - Update quiz preferences save/load to include preset group ID

5. **Update quiz generation**
   - Ensure `/api/quiz` handles verbs from preset groups correctly
   - No changes needed if we just populate customVerbs

6. **Visual polish**
   - Update button states to show selected mode
   - Show selected preset group name/count
   - Add preset group icon/badge

## Edge cases

- **Preset group verb doesn't exist in database**: Filter out invalid verbs, log warning
- **User switches from preset to custom**: Keep the verbs populated, allow editing
- **User has no favorites but selects preset then switches to favorites**: Show empty state
- **Preset group is empty after filtering**: Show error, require user to select different group
- **Very large preset group (100+ verbs)**: Should work fine with existing quiz generation logic

## Testing plan

### Manual testing:
- [ ] Select each preset group and verify correct verbs are populated
- [ ] Start quiz with preset group and verify questions are generated correctly
- [ ] Switch between Favorites → Preset → Custom modes
- [ ] Reload page and verify selected preset group is remembered
- [ ] Test with user who has no favorites

### Data validation:
- [ ] Verify all verbs in preset groups exist in database
- [ ] Check for duplicate verbs within groups
- [ ] Ensure verb infinitives match database exactly (case-sensitive)

### No unit tests needed initially:
- Static data, minimal logic
- Integration testing via manual QA is sufficient for v1

## Status
**Complete**

Implemented:
- ✅ Created `app/quiz/verb-groups.ts` with 10 preset groups (3 frequency-based, 7 thematic)
- ✅ Updated `QuizConfig` type to include `presetGroupId` and `'preset'` verb selection
- ✅ Created `PresetGroupSelector` component with modal UI
- ✅ Integrated preset groups into quiz page UI
- ✅ Added validation for preset group selection
- ✅ All requirements met and tested

## Implementation notes

### Initial Preset Groups to Include:

**Frequency-based:**
- Top 25 Verbs
- Top 50 Verbs
- Top 100 Verbs

**Thematic:**
- Travel & Tourism (20-30 verbs: viajar, visitar, reservar, llegar, salir, etc.)
- Food & Dining (20-30 verbs: comer, beber, cocinar, pedir, servir, etc.)
- Work & Office (20-30 verbs: trabajar, escribir, llamar, enviar, reunir, etc.)
- Daily Routine (20-30 verbs: despertar, levantar, ducharse, vestirse, etc.)

**Level-based (if data available):**
- A1 Beginner Verbs
- A2 Elementary Verbs
- B1 Intermediate Verbs

### Future considerations:
- Could add verb frequency data to database to generate "Top N" dynamically
- Could allow users to create custom groups (save to user_verb_groups table)
- Could add verb tags/categories to database for dynamic thematic grouping
