# Quiz Feature Roadmap

This roadmap tracks all features and improvements for the custom quiz system.

## Overview
The quiz system allows users to create custom verb conjugation quizzes by selecting tenses, verbs, pronouns, and question counts.

## Features

### Completed
- Custom quiz configuration page
- Tense/mood selection
- Verb selection (favorites and custom)
- Pronoun selection
- Question count configuration
- Quiz generation and gameplay
- [Feature 001: Preset Verb Groups]((features)/feature-001-preset-verb-groups.md) - Predefined verb groups (Top 100, Travel, Workplace, etc.) for quick quiz setup

### In Progress
(No features currently in progress)

### Planned
(No features currently planned)

## Feature Specs
Feature specifications are stored in the `(features)/` directory following the pattern:
`feature-###-[feature-name].md`

See `@/feature-000-featurename(template).md` for the feature spec template.

## Notes
- All quiz preferences are saved to the database
- Quiz generation happens server-side via `/api/quiz`
- Game state is stored in sessionStorage during active quiz
