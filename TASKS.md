# TASKS.md - Central Task Tracking

> Track all tasks across iterations. Update status as work progresses.

## Current Status

**Active Iteration:** None (Iteration 6 TBD)
**Tests:** 1009 passing
**Build:** Passing

---

## Iteration 6 (TBD)

_No tasks defined yet._

---

## Completed Iterations

### Iteration 5: Initiative System & Dice Rolling (DONE)

| ID | Task | Status | Files |
|----|------|--------|-------|
| IT5-01 | Core Dice Roller | DONE | `lib/dice/roller.ts` |
| IT5-02 | Dice Calculator/Parser | DONE | `lib/dice/calculator.ts` |
| IT5-03 | DiceButton Component | DONE | `components/dice/DiceButton.tsx` |
| IT5-04 | DiceRoller Component | DONE | `components/dice/DiceRoller.tsx` |
| IT5-05 | RollHistory Component | DONE | `components/dice/RollHistory.tsx` |
| IT5-06 | Combat Slice Initiative | DONE | `lib/store/combatSlice.ts` |
| IT5-07 | InitiativeRoller Component | DONE | `components/combat/InitiativeRoller.tsx` |
| IT5-08 | Polish & Integration | DONE | Navigation, modals, DEX modifier |

### Iteration 4: Data Persistence & Monster Library (DONE)

- LocalStorage persistence with auto-save
- Export/Import JSON backups
- 15 pre-defined outlaws
- Quick Encounter presets
- 805 tests at completion

### Iteration 3: Dashboard & Combat Tracker (DONE)

- Initiative-based combat tracker
- Turn management & round counter
- HP tracking during showdowns
- Posse statistics dashboard

### Iteration 2: Character Management & Conditions (DONE)

- Character CRUD operations
- HP tracking with visual feedback
- DiceBear avatar system
- 7 status conditions with tooltips

### Iteration 1: Foundation & Data Models (DONE)

- Jest testing infrastructure
- Zustand state management
- Zod validation schemas
- Data models & mock factories

---

## Task Management Protocol

When completing a task:
1. Mark status as `DONE` in this file
2. Update the task file with completion notes
3. **Move task file to `.claude/tasks/archive/`**
4. Update `SESSION.md` with session notes
5. Update `CLAUDE.md` if features changed

Task specs live in `.claude/tasks/` (active) and `.claude/tasks/archive/` (completed).
