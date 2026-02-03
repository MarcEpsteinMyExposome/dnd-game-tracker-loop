# FUNCTIONS: Feature Breakdown

**Project:** dnd-game-tracker-loop v2.0
**Phase:** FUNCTIONS (Breaking Down Requirements)
**Created:** 2026-01-20
**Status:** Active

---

## Overview

This document breaks down the DEFINE.md requirements into logical **functions** (major feature areas). Each function represents a cohesive set of capabilities that will be broken down further into atomic tasks.

---

## Function 1: Project Foundation & Testing Infrastructure

**Priority:** CRITICAL (Must complete first)
**Dependencies:** None
**Estimated Complexity:** Medium

### Scope
- Set up Jest configuration and test utilities
- Create base testing patterns and examples
- Establish Zod schema structure
- Set up Zustand store architecture
- Create basic component structure

### Success Criteria
- [ ] Jest runs successfully with `npm test`
- [ ] Sample test passes (example component + test)
- [ ] Zod schemas defined for Character, Monster, Combatant
- [ ] Zustand store created with basic structure
- [ ] TypeScript compiles without errors

### Files to Create
- `jest.config.js`
- `__tests__/setup.ts`
- `lib/schemas/character.schema.ts`
- `lib/schemas/monster.schema.ts`
- `lib/store/gameStore.ts`
- `__tests__/example.test.tsx` (learning example)

---

## Function 2: Data Models & Validation

**Priority:** CRITICAL
**Dependencies:** Function 1
**Estimated Complexity:** Medium

### Scope
- Define Zod schemas for all data types (Character, Monster, Combatant, Condition, etc.)
- Create TypeScript types from schemas
- Build validation helpers
- Create mock data generators for testing

### Success Criteria
- [ ] All data types have Zod schemas
- [ ] Schemas export TypeScript types
- [ ] Validation helper functions tested
- [ ] Mock data factory functions created
- [ ] 100% test coverage on schemas

### Files to Create
- `lib/schemas/index.ts` (barrel export)
- `lib/schemas/condition.schema.ts`
- `lib/schemas/encounter.schema.ts`
- `lib/validation/helpers.ts`
- `lib/testing/mockData.ts`
- `__tests__/schemas/*.test.ts`

---

## Function 3: Character Management

**Priority:** HIGH (MVP Core Feature)
**Dependencies:** Function 2
**Estimated Complexity:** High

### Scope
- Character CRUD operations (Create, Read, Update, Delete)
- HP tracking and validation
- Custom image upload with base64 encoding
- Auto-generated avatars (DiceBear integration)
- Character list display with cards

### Success Criteria
- [ ] Create character form functional
- [ ] Character list displays with avatars
- [ ] HP updates work with validation (0 to maxHp)
- [ ] Image upload stores base64 correctly
- [ ] Delete character with confirmation
- [ ] All operations have passing tests

### Files to Create
- `components/characters/CharacterForm.tsx`
- `components/characters/CharacterCard.tsx`
- `components/characters/CharacterList.tsx`
- `lib/store/slices/characterSlice.ts`
- `__tests__/components/characters/*.test.tsx`

---

## Function 4: Conditions System

**Priority:** MEDIUM (MVP Core Feature)
**Dependencies:** Function 3
**Estimated Complexity:** Medium

### Scope
- Apply/remove conditions to characters
- Visual display of active conditions
- Condition definitions (Poisoned, Prone, Paralyzed, etc.)
- Condition badges/chips UI

### Success Criteria
- [ ] Toggle conditions on characters
- [ ] Conditions persist in store
- [ ] Visual indicators display correctly
- [ ] All 7 standard conditions supported
- [ ] Tests cover edge cases (multiple conditions, none, all)

### Files to Create
- `components/conditions/ConditionBadge.tsx`
- `components/conditions/ConditionToggle.tsx`
- `lib/constants/conditions.ts`
- `__tests__/components/conditions/*.test.tsx`

---

## Function 5: Dashboard & Statistics

**Priority:** MEDIUM
**Dependencies:** Function 3
**Estimated Complexity:** Low

### Scope
- Team size counter
- Average HP percentage calculation
- Campaign/mission info display
- Visual stat cards

### Success Criteria
- [ ] Dashboard displays correct team stats
- [ ] Stats update when characters change
- [ ] Visual cards styled consistently
- [ ] Calculations tested and accurate

### Files to Create
- `components/dashboard/Dashboard.tsx`
- `components/dashboard/StatCard.tsx`
- `lib/utils/stats.ts`
- `__tests__/utils/stats.test.ts`

---

## Function 6: Combat Tracker - Basic

**Priority:** HIGH (MVP Core Feature)
**Dependencies:** Function 3, Function 4
**Estimated Complexity:** High

### Scope
- Add characters/monsters to combat
- Display combatants in initiative order
- HP adjustment controls (+1, -1, direct input)
- Active turn highlighting
- Remove from combat

### Success Criteria
- [ ] Add to combat from character roster
- [ ] Combatants sorted by initiative (AC initially, d20 later)
- [ ] HP changes update in real-time
- [ ] Active turn cycles through list
- [ ] Remove combatant works correctly
- [ ] All combat actions tested

### Files to Create
- `components/combat/CombatTracker.tsx`
- `components/combat/CombatantCard.tsx`
- `lib/store/slices/combatSlice.ts`
- `__tests__/components/combat/*.test.tsx`

---

## Function 7: Monster Library

**Priority:** MEDIUM
**Dependencies:** Function 2
**Estimated Complexity:** Medium

### Scope
- Pre-defined monster stat blocks
- Monster grid display
- Add monster to combat tracker
- Monster type categorization (Xenos, Chaos, etc.)

### Success Criteria
- [ ] Monster library displays all monsters
- [ ] Add to combat creates combatant
- [ ] Monster data follows schema
- [ ] Categories filter/organize monsters

### Files to Create
- `components/monsters/MonsterLibrary.tsx`
- `components/monsters/MonsterCard.tsx`
- `lib/data/monsters.ts`
- `__tests__/components/monsters/*.test.tsx`

---

## Function 8: LocalStorage Persistence

**Priority:** HIGH (Post-MVP)
**Dependencies:** Function 3, Function 6, Function 7
**Estimated Complexity:** Medium

### Scope
- Save game state to LocalStorage
- Load state on app start
- Auto-save on state changes
- Export/Import JSON functionality
- Clear all data option

### Success Criteria
- [ ] State persists across page refreshes
- [ ] Auto-save triggers appropriately
- [ ] Export downloads valid JSON
- [ ] Import validates and loads data
- [ ] Clear data resets to defaults

### Files to Create
- `lib/storage/localStorage.ts`
- `lib/storage/exportImport.ts`
- `__tests__/storage/*.test.ts`

---

## Function 9: True Initiative System

**Priority:** MEDIUM (Enhancement)
**Dependencies:** Function 6
**Estimated Complexity:** Medium

### Scope
- Roll initiative (d20 + DEX modifier)
- Manual initiative input option
- Re-roll initiative
- Sort combatants by initiative value

### Success Criteria
- [ ] Initiative rolls generate correctly
- [ ] Manual entry accepts valid values
- [ ] Re-roll updates and re-sorts
- [ ] Sorting uses initiative instead of AC
- [ ] Dice roll logic tested

### Files to Create
- `lib/dice/roller.ts`
- `components/combat/InitiativeRoller.tsx`
- `__tests__/dice/roller.test.ts`

---

## Function 10: Dice Rolling System

**Priority:** MEDIUM (Enhancement)
**Dependencies:** None (can be standalone)
**Estimated Complexity:** High

### Scope
- Simple visual dice roller (immediate result display)
- Support all D&D dice (d4, d6, d8, d10, d12, d20)
- Modifier support (+X, -X)
- Multiple dice (XdY format)
- Future: 3D animated dice roll

### Success Criteria
- [ ] Click to roll displays result
- [ ] All dice types supported
- [ ] Modifiers calculate correctly
- [ ] Multiple dice sum properly
- [ ] Result history (last 5 rolls)
- [ ] Dice math tested thoroughly

### Files to Create
- `components/dice/DiceRoller.tsx`
- `components/dice/DiceButton.tsx`
- `components/dice/RollHistory.tsx`
- `lib/dice/calculator.ts`
- `__tests__/dice/*.test.ts`

---

## Function 11: UI/UX Enhancements

**Priority:** LOW (Polish)
**Dependencies:** Most other functions
**Estimated Complexity:** Medium

### Scope
- Dark mode toggle (manual override)
- Confirmation dialogs for destructive actions
- Keyboard shortcuts
- Responsive mobile layout
- Loading states and animations

### Success Criteria
- [ ] Dark mode toggle persists preference
- [ ] Delete actions require confirmation
- [ ] Keyboard shortcuts documented and work
- [ ] Mobile layout usable on tablets
- [ ] Loading states provide feedback

### Files to Create
- `components/ui/ConfirmDialog.tsx`
- `components/ui/DarkModeToggle.tsx`
- `hooks/useKeyboardShortcuts.ts`
- `__tests__/hooks/*.test.ts`

---

## Function 12: Combat Enhancements

**Priority:** LOW (Future)
**Dependencies:** Function 6, Function 9
**Estimated Complexity:** Medium

### Scope
- Round counter
- Damage history log
- Action economy tracking (bonus action, reaction)
- Turn timer
- Combat HP sync to character roster

### Success Criteria
- [ ] Round advances on cycle
- [ ] Damage log shows history
- [ ] Action economy tracks usage
- [ ] Timer optional and configurable
- [ ] HP syncs back to roster

### Files to Create
- `components/combat/RoundCounter.tsx`
- `components/combat/DamageLog.tsx`
- `components/combat/ActionTracker.tsx`
- `lib/store/slices/combatEnhancementsSlice.ts`

---

## Implementation Roadmap

### Loop Iteration 1: Foundation
- Function 1: Project Foundation & Testing
- Function 2: Data Models & Validation

### Loop Iteration 2: Core Characters
- Function 3: Character Management
- Function 4: Conditions System

### Loop Iteration 3: Dashboard & Combat
- Function 5: Dashboard & Statistics
- Function 6: Combat Tracker - Basic

### Loop Iteration 4: Monsters & Persistence
- Function 7: Monster Library
- Function 8: LocalStorage Persistence

### Loop Iteration 5: Enhanced Combat
- Function 9: True Initiative System
- Function 10: Dice Rolling System

### Loop Iteration 6: Polish & Future
- Function 11: UI/UX Enhancements
- Function 12: Combat Enhancements

---

## Notes

- Each function should be fully tested before moving to next
- Functions may be split into smaller tasks in TASKS.md
- Some functions can be parallelized (e.g., Function 5 & 7)
- Complexity estimates are rough guides, may adjust during execution
- All functions require documentation in code

---

**Next Step:** Create TASKS.md for Loop Iteration 1 (Functions 1 & 2)
