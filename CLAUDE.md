# CLAUDE.md - Project Context

## Project Overview

**Project:** Bang Your Dead v3
**Status:** Iteration 5 Complete (1009 tests passing)
**Next:** Iteration 6 - TBD

A Western Gun & Magic themed combat tracker for tabletop RPG sessions. Features posse management, showdown tracking, outlaw bounties, and dice rolling.

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
npm test         # Run tests (1009 passing)
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
├── combat/             # CombatTracker, CombatantCard, AddMonstersModal, InitiativeRoller
├── monsters/           # MonsterCard, MonsterLibrary
├── dashboard/          # Dashboard, StatCard
├── dice/               # DiceButton, DiceRoller, DiceRollerModal, RollHistory
├── conditions/         # ConditionBadge, ConditionToggle, ConditionsModal
├── ui/                 # ConfirmDialog, LoadingSpinner, Toast, ErrorBoundary
└── layout/             # PersistenceProvider, Navigation

lib/                    # Business logic
├── schemas/            # Zod validation schemas
├── store/              # Zustand store + slices (characterSlice, combatSlice)
├── storage/            # LocalStorage persistence, migrations, export/import
├── dice/               # Dice roller and notation parser
├── data/               # monsters.ts (15 monsters), encounters.ts (5 encounters)
├── utils/              # avatar.ts, stats.ts
└── validation/         # helpers.ts

__tests__/              # Jest tests (mirrors src structure)
```

---

## Current Features (Iteration 5 Complete)

- **Posse Management:** CRUD, HP tracking, conditions, DiceBear avatars
- **Showdown Tracker:** Initiative order, turn management, round counter
- **Outlaw Bounties:** 15 pre-defined outlaws, Quick Encounters
- **Data Persistence:** LocalStorage with auto-save, export/import JSON
- **Dashboard:** Posse statistics with health status breakdown
- **Visual Theme:** Western Gun & Magic aesthetic with purple magic accents
- **Dice Rolling:** Full dice roller UI with d4-d100, custom notation (2d6+3), accessible from combat and navigation
- **Initiative System:** Roll initiative for combatants (d20 + DEX modifier)
- **Character DEX Modifier:** Characters have DEX modifier field that flows to initiative rolls

---

## User Preferences

### Task-Based Workflow
**IMPORTANT:** Always break projects into discrete tasks before starting implementation. This enables:
- Parallel execution where tasks are independent
- Better visibility into progress
- Clearer scope for each piece of work

Create task files in `.claude/tasks/` for each discrete unit of work. Run independent tasks in parallel when possible.

### Documentation Updates
**IMPORTANT:** Keep documentation current without being asked. After completing any significant work:
- Update **README.md** if features, status, or project description changed
- Update **CLAUDE.md** if project status, features list, or next steps changed
- Update task file status (Not Started → In Progress → Complete)

Do this proactively as part of completing work, not only when explicitly requested.

### Task Completion Validation
**IMPORTANT:** When spawning sub-agents via the Task tool, the calling agent must:
1. Wait for the task to complete
2. Validate the task completed successfully (check test results, verify files created)
3. Update documentation files (README.md, CLAUDE.md) with any new features or status changes
4. Update task files in `.claude/tasks/` if applicable

Sub-agents focus on implementation; the parent is responsible for documentation updates after task completion.

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

The project has completed 5 full iterations with 1009 passing tests. Now using modern Claude Code task-based workflow.

---

## Completed Iterations

### Iteration 5 (Complete)
**Focus:** Enhanced Combat - Initiative System & Dice Rolling

**Features Added:**
- Dice rolling system with crypto.getRandomValues() for randomness
- Dice notation parser (XdY+Z format)
- DiceButton, DiceRoller, DiceRollerModal, RollHistory components
- Initiative rolling (d20 + DEX modifier)
- Combat slice updates: rollInitiative, rollAllInitiatives, setManualInitiative
- InitiativeRoller integrated into CombatTracker
- DEX modifier field added to character schema and form
- DiceRoller accessible from combat page (toggle button) and navigation (modal)
- Navigation component with global dice roller access

**Files:** See [.claude/tasks/iteration-5/](.claude/tasks/iteration-5/) for detailed breakdown.
