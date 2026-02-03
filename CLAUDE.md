# CLAUDE.md - Project Context

## Project Overview

**Project:** D&D Game Tracker Loop v2.0
**Status:** Iteration 4 Complete (805 tests passing)
**Next:** Iteration 5 - Initiative System & Dice Rolling

A D&D/Warhammer 40K game tracker web application featuring character management, combat tracking, and monster library.

---

## Tech Stack

- **Framework:** Next.js 16.1 (App Router with Turbopack)
- **Language:** TypeScript 5
- **UI:** React 19.2 + Tailwind CSS 4
- **State:** Zustand 5.0.3 with persist middleware
- **Validation:** Zod 3.24.1
- **Testing:** Jest 29.7.0 + React Testing Library

---

## Key Commands

```bash
npm run dev      # Start dev server (localhost:3000)
npm test         # Run tests (805 passing)
npm run build    # Production build
npm run lint     # Run ESLint
```

---

## Project Structure

```
app/                    # Next.js pages
├── characters/         # Character management (/characters)
├── dashboard/          # Team statistics (/dashboard)
├── combat/             # Combat tracker (/combat)
├── monsters/           # Monster library (/monsters)
├── settings/           # Data management (/settings)
└── layout.tsx          # Root layout with navigation

components/             # React components
├── characters/         # CharacterForm, CharacterCard, CharacterList
├── combat/             # CombatTracker, CombatantCard, AddMonstersModal
├── monsters/           # MonsterCard, MonsterLibrary
├── dashboard/          # Dashboard, StatCard
├── conditions/         # ConditionBadge, ConditionToggle, ConditionsModal
├── ui/                 # ConfirmDialog, LoadingSpinner, Toast, ErrorBoundary
└── layout/             # PersistenceProvider

lib/                    # Business logic
├── schemas/            # Zod validation schemas
├── store/              # Zustand store + slices (characterSlice, combatSlice)
├── storage/            # LocalStorage persistence, migrations, export/import
├── data/               # monsters.ts (15 monsters), encounters.ts (5 encounters)
├── utils/              # avatar.ts, stats.ts
└── validation/         # helpers.ts

__tests__/              # Jest tests (mirrors src structure)
```

---

## Current Features (Iteration 4 Complete)

- **Character Management:** CRUD, HP tracking, conditions, DiceBear avatars
- **Combat Tracker:** Initiative order, turn management, round counter
- **Monster Library:** 15 pre-defined monsters, Quick Encounters
- **Data Persistence:** LocalStorage with auto-save, export/import JSON
- **Dashboard:** Team statistics with health status breakdown

---

## Code Patterns

### Testing
- Use accessible queries: `getByRole`, `getByLabelText` (not test IDs)
- Test user behavior, not implementation details
- All features require tests before completion

### Zustand Selectors
**IMPORTANT:** Never call selector functions during Zustand subscription:
```typescript
// WRONG - causes infinite loop
const combatants = useGameStore((state) => state.getSortedCombatants())

// CORRECT
const getSortedCombatants = useGameStore((state) => state.getSortedCombatants)
const sortedCombatants = getSortedCombatants()
```

### Tailwind CSS 4
Use slash syntax for opacity (required in Tailwind 4):
```typescript
// CORRECT
className="bg-green-900/30 border-green-500/50"

// WRONG (Tailwind 3 syntax, breaks in Tailwind 4)
className="bg-green-900 bg-opacity-30"
```

### Zod Schemas
- Schemas are source of truth for TypeScript types
- Use `safeParse()` for user input validation
- All data entering system must be validated

---

## Architecture References

- **[ARCHITECTURE.md](ARCHITECTURE.md)** - Full system architecture, data flow
- **[DECISIONS.md](DECISIONS.md)** - Architectural Decision Records (9 ADRs)
- **[PATTERNS.md](PATTERNS.md)** - Code patterns, testing conventions

---

## Historical Context

This project was originally built using the "RALPH Loop" iterative development methodology as a learning exercise. The original methodology documentation has been archived but preserved for reference:

- **[docs/archive/](docs/archive/)** - Original RALPH Loop files (INSTRUCTIONS_TO_LLM.md, DEFINE.md, FUNCTIONS.md, PROGRESS.md, etc.)

The project has completed 4 full iterations with 805 passing tests. Now using modern Claude Code task-based workflow.

---

## Next Iteration (5)

**Focus:** Enhanced Combat - Initiative System & Dice Rolling
- Function 9: True Initiative Rolling (d20 + DEX modifier)
- Function 10: Dice Rolling System

See `.claude/tasks/` for detailed planning.
