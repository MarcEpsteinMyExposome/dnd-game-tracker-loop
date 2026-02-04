# Iteration 5: Enhanced Combat - Initiative System & Dice Rolling

## Overview

**Status:** Ready for Implementation
**Focus Functions:**
- Function 9: True Initiative System
- Function 10: Dice Rolling System

**Dependencies:** Iteration 4 complete (805 tests passing)

> **Task Files:** This plan has been broken into discrete task files for parallel execution. See [iteration-5/](iteration-5/) folder for individual task specifications.

---

## Function 9: True Initiative System

**Goal:** Replace AC-based initiative with proper d20 + DEX modifier rolls

### Requirements
- [ ] Roll initiative (d20 + DEX modifier) for each combatant
- [ ] Manual initiative input option
- [ ] Re-roll initiative functionality
- [ ] Sort combatants by initiative value (descending)
- [ ] Handle initiative ties (higher DEX wins, or random)

### Files to Create/Modify
- `lib/dice/roller.ts` - Dice rolling logic
- `components/combat/InitiativeRoller.tsx` - UI for rolling initiative
- `lib/store/slices/combatSlice.ts` - Update initiative logic
- `__tests__/dice/roller.test.ts` - Dice rolling tests

### Acceptance Criteria
- [ ] Initiative rolls generate d20 + modifier correctly
- [ ] Manual entry validates and accepts valid values (-10 to 50)
- [ ] Re-roll updates initiative and re-sorts combatants
- [ ] Combat tracker uses initiative instead of AC for ordering
- [ ] All dice roll logic tested

---

## Function 10: Dice Rolling System

**Goal:** Visual dice roller for general use (attacks, saves, damage)

### Requirements
- [ ] Support all D&D dice: d4, d6, d8, d10, d12, d20
- [ ] Modifier support (+X, -X)
- [ ] Multiple dice notation (XdY format, e.g., 2d6+3)
- [ ] Click to roll displays result immediately
- [ ] Roll history (last 5 rolls)
- [ ] Future: 3D animated dice roll (optional enhancement)

### Files to Create
- `components/dice/DiceRoller.tsx` - Main roller component
- `components/dice/DiceButton.tsx` - Individual die button
- `components/dice/RollHistory.tsx` - Recent rolls display
- `lib/dice/calculator.ts` - Dice math and parsing
- `__tests__/dice/calculator.test.ts` - Calculator tests
- `__tests__/components/dice/*.test.tsx` - Component tests

### Acceptance Criteria
- [ ] All dice types roll correctly (uniform distribution)
- [ ] Modifiers calculate correctly (positive and negative)
- [ ] Multiple dice sum properly (3d6 = sum of 3 separate d6)
- [ ] Roll history displays last 5 rolls
- [ ] UI is intuitive and accessible
- [ ] Comprehensive test coverage

---

## Task Breakdown (Suggested)

### Phase 1: Core Dice Logic
1. Create `lib/dice/roller.ts` with basic `rollDie(sides)` function
2. Create `lib/dice/calculator.ts` with dice notation parser (e.g., "2d6+3")
3. Write comprehensive tests for dice math

### Phase 2: Dice UI
4. Create `DiceButton` component
5. Create `DiceRoller` component with all dice types
6. Create `RollHistory` component
7. Write component tests

### Phase 3: Initiative Integration
8. Add initiative rolling to combat tracker
9. Update combatSlice to use rolled initiative
10. Create `InitiativeRoller` component
11. Update AddToCombatModal with initiative rolling option

### Phase 4: Polish
12. Add keyboard shortcuts for dice rolling
13. Consider visual enhancements (animations)
14. Final testing and documentation

---

## Notes

- Current initiative uses AC as placeholder (ADR-006 in DECISIONS.md)
- Dice rolling should be pure functions for easy testing
- Consider using `crypto.getRandomValues()` for better randomness
- Keep UI simple initially, add animations in future iteration
