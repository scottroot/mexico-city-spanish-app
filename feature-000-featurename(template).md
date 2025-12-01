<!--
This is an example feature spec. The folder structure and where to store files like this are in the folder of whatever feature is being developed - in there there should be a ROADMAP.md file and then a folder "(features)" where all these `feature-###-[name...].md`.
Example:
- @/app/game/translation/ROADMAP.md
- @/app/game/translation/(features)/feature-001-study-guide-modal.md
-->

<!--
Instructions for maintaining feature docs:

- Do not rename this file, keep the filename stable, it is a template.
- These specs live in the "(features)" directory - the parentheses are part of the folder name.
- Create a new feature spec file (.md) following the template naming pattern "feature-[feature number, 3 digit, e.g. 001]-[clear feature name, descriptive enough to uniquely identify the feature but short enough for a filename].md"
- Track progress only by updating the Status section and checking off Requirements.
- When the feature is complete, set Status to Complete and mark all requirements as checked.
- The roadmap or index should reference this file and show whether it is In progress or Done.
- All design notes, decisions, and implementation details should be added to this file or linked from it.
- Do not include long multi feature notes here, keep this file scoped to one feature only.
-->

# Feature 000 - Short Feature Name

## Summary
One to three sentences describing what this feature does and the user outcome it enables.

## Motivation
Why this feature exists. The problem it solves, the pain point removed, or the opportunity created.

## Requirements
- [ ] Clear, testable requirement number one
- [ ] Requirement two
- [ ] Requirement three
- [ ] Any non functional requirement that matters (performance, security, accessibility)
- [ ] Add more as needed

## Non goals
What is explicitly out of scope for this feature.

## UX and flows
- High level flow description
- Screens affected
- Sketches or links to designs if available

## Data and API changes
- Data model changes
- New API endpoints or updates to existing endpoints
- Expected request and response shapes

## Component and file plan
List the exact files or components expected to change. Example:

- `app/feature/page.tsx` will render the main view
- `app/feature/_components/ItemCard.tsx` will hold the card UI
- `lib/feature/getData.ts` will implement data fetching

## Implementation plan
Step by step plan at the level a code assistant can follow.

1. Create required components in the `app/feature/_components` directory
2. Implement data fetching and validation in `lib/feature/getData.ts`
3. Update routing or query params
4. Add error states and loading states
5. Add tests where needed

## Edge cases
List any tricky behaviors or states the solution must handle.

## Testing plan
- What needs unit tests
- What needs integration tests
- Manual testing notes if relevant

## Status
- Current state, for example: Not started, In progress, Blocked, Complete
- Links to PRs or issues

## Implementation notes
Short notes you want future you or an assistant to remember. Include tradeoffs, shortcuts taken, or constraints discovered during implementation.