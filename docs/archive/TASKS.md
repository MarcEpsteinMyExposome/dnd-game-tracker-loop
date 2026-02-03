# TASKS: Loop Iteration 1

**Project:** dnd-game-tracker-loop v2.0
**Iteration:** 1
**Phase:** Foundation & Data Models
**Created:** 2026-01-20
**Status:** In Progress

---

## Iteration 1 Goals

Complete:
- Function 1: Project Foundation & Testing Infrastructure
- Function 2: Data Models & Validation

---

## Tasks Breakdown

### Function 1: Project Foundation & Testing Infrastructure

#### Task 1.1: Install Testing Dependencies
- [ ] Install Jest
- [ ] Install React Testing Library
- [ ] Install @testing-library/jest-dom
- [ ] Install @types/jest
- [ ] Verify all dependencies in package.json

**Acceptance Criteria:**
- `npm test` command exists
- Dependencies installed without errors

---

#### Task 1.2: Configure Jest
- [ ] Create jest.config.js with Next.js settings
- [ ] Create jest.setup.js for test environment
- [ ] Add test scripts to package.json
- [ ] Create __tests__ folder structure

**Acceptance Criteria:**
- Jest configuration loads without errors
- Can run `npm test` successfully (even with 0 tests)

---

#### Task 1.3: Create First Test Example
- [ ] Create simple example component (Button or similar)
- [ ] Write test for example component
- [ ] Run test and verify it passes
- [ ] Document testing patterns in comments

**Acceptance Criteria:**
- At least 1 passing test
- Test demonstrates basic pattern (render, query, assert)
- Code has clear comments explaining the test

---

#### Task 1.4: Install State Management (Zustand)
- [ ] Install zustand
- [ ] Create lib/store/ folder structure
- [ ] Create basic store template (gameStore.ts)
- [ ] Add TypeScript types for store

**Acceptance Criteria:**
- Zustand installed
- Store file created with basic structure
- TypeScript compiles without errors

---

#### Task 1.5: Install Validation (Zod)
- [ ] Install zod
- [ ] Create lib/schemas/ folder structure
- [ ] Create example schema file
- [ ] Test schema validation works

**Acceptance Criteria:**
- Zod installed
- Folder structure created
- Example schema validates correctly

---

### Function 2: Data Models & Validation

#### Task 2.1: Create Character Schema
- [ ] Define Character interface properties (name, class, level, hp, maxHp, ac, etc.)
- [ ] Create Zod schema for Character
- [ ] Export TypeScript type from schema
- [ ] Add JSDoc comments explaining each field

**Acceptance Criteria:**
- lib/schemas/character.schema.ts exists
- Schema validates valid characters
- Schema rejects invalid data
- TypeScript type exported

---

#### Task 2.2: Create Monster Schema
- [ ] Define Monster interface properties (name, type, ac, hp, damage, abilities)
- [ ] Create Zod schema for Monster
- [ ] Export TypeScript type from schema
- [ ] Add JSDoc comments

**Acceptance Criteria:**
- lib/schemas/monster.schema.ts exists
- Schema validates valid monsters
- Schema rejects invalid data
- TypeScript type exported

---

#### Task 2.3: Create Condition Schema
- [ ] Define Condition type (enum or union)
- [ ] List all 7 conditions (Poisoned, Prone, Paralyzed, Stunned, Blinded, Frightened, Charmed)
- [ ] Create Zod schema for Condition
- [ ] Export TypeScript type

**Acceptance Criteria:**
- lib/schemas/condition.schema.ts exists
- All 7 conditions defined
- Schema validates conditions correctly

---

#### Task 2.4: Create Combatant Schema
- [ ] Define Combatant interface (extends Character/Monster for combat)
- [ ] Add combat-specific fields (initiative, isActive, currentHp)
- [ ] Create Zod schema for Combatant
- [ ] Export TypeScript type

**Acceptance Criteria:**
- lib/schemas/combatant.schema.ts exists
- Schema includes combat-specific fields
- Schema validates correctly

---

#### Task 2.5: Create Schema Barrel Export
- [ ] Create lib/schemas/index.ts
- [ ] Export all schemas
- [ ] Export all TypeScript types
- [ ] Add documentation comment

**Acceptance Criteria:**
- lib/schemas/index.ts exists
- Can import schemas from single file
- TypeScript autocomplete works

---

#### Task 2.6: Write Schema Tests
- [ ] Create __tests__/schemas/character.test.ts
- [ ] Create __tests__/schemas/monster.test.ts
- [ ] Create __tests__/schemas/condition.test.ts
- [ ] Create __tests__/schemas/combatant.test.ts
- [ ] Test valid data passes
- [ ] Test invalid data fails
- [ ] Aim for 100% coverage on schemas

**Acceptance Criteria:**
- All schema files have tests
- Tests cover valid and invalid cases
- All tests pass
- Coverage report shows 100% on schemas

---

#### Task 2.7: Create Mock Data Factory
- [ ] Create lib/testing/mockData.ts
- [ ] Write function to generate mock Character
- [ ] Write function to generate mock Monster
- [ ] Write function to generate mock Combatant
- [ ] Add optional parameters for customization

**Acceptance Criteria:**
- lib/testing/mockData.ts exists
- Factory functions generate valid data
- Functions tested and work correctly
- Documentation explains usage

---

#### Task 2.8: Create Validation Helpers
- [ ] Create lib/validation/helpers.ts
- [ ] Write helper to validate and parse with error handling
- [ ] Write helper to safely validate (returns boolean)
- [ ] Add TypeScript generics for reusability

**Acceptance Criteria:**
- lib/validation/helpers.ts exists
- Helpers work with all schemas
- Error messages are clear
- Tests verify functionality

---

## Progress Tracking

**Total Tasks:** 16
**Completed:** 0
**In Progress:** 0
**Blocked:** 0

---

## Notes

- Work through tasks sequentially
- Each task should have tests where applicable
- Commit after completing each task or logical group
- Update PROGRESS.md as you work
- Move completed tasks to COMPLETED.md when iteration finishes

---

## Next Steps After Iteration 1

1. Run full test suite and verify 100% passing
2. Commit all changes
3. Update COMPLETED.md with what was accomplished
4. Create RETROSPECTIVE.md for Iteration 1
5. Plan Loop Iteration 2 (Character Management)

---

**Start Date:** 2026-01-20
**Target Completion:** TBD
**Actual Completion:** Not yet complete
