# TASKS: Loop Iteration 3

**Project:** dnd-game-tracker-loop v2.0
**Iteration:** 3
**Phase:** Dashboard & Combat Tracker
**Created:** 2026-01-20
**Status:** Planning

---

## Iteration 3 Goals

Complete:
- Function 5: Dashboard & Statistics
- Function 6: Combat Tracker - Basic

**Success Criteria:**
- Dashboard displays team statistics (size, average HP)
- Combat tracker allows adding/removing combatants
- Initiative-based turn order (using AC initially, proper initiative in Iteration 5)
- HP adjustment controls in combat
- Active turn highlighting and advancement
- All features tested with passing tests

---

## Tasks Breakdown

### Function 5: Dashboard & Statistics

#### Task 5.1: Create Stats Calculation Utilities
- [ ] Create `lib/utils/stats.ts`
- [ ] Write `calculateTeamSize(characters)` function
- [ ] Write `calculateAverageHp(characters)` function
- [ ] Write `getHealthyCount(characters)` function
- [ ] Write `getInjuredCount(characters)` function
- [ ] Write `getUnconsciousCount(characters)` function
- [ ] Add JSDoc comments for all functions
- [ ] Write unit tests in `__tests__/utils/stats.test.ts`

**Acceptance Criteria:**
- All calculation functions work correctly
- Edge cases handled (empty array, all dead, etc.)
- Tests achieve 100% coverage
- Functions are pure (no side effects)

---

#### Task 5.2: Create StatCard Component
- [ ] Create `components/dashboard/StatCard.tsx`
- [ ] Props: title, value, icon, color, description
- [ ] Gradient background with color variants
- [ ] Responsive design (mobile/tablet/desktop)
- [ ] Optional trend indicator (up/down arrow)
- [ ] Accessible with ARIA labels

**Acceptance Criteria:**
- Component renders with all props
- Color variants work (blue, green, red, yellow, purple)
- Responsive layout verified
- TypeScript types exported

---

#### Task 5.3: Create Dashboard Component
- [ ] Create `components/dashboard/Dashboard.tsx`
- [ ] Display team size stat card
- [ ] Display average HP percentage stat card
- [ ] Display healthy/injured/unconscious counts
- [ ] Use stats utility functions
- [ ] Update in real-time when characters change
- [ ] Responsive grid layout (1-3 columns)

**Acceptance Criteria:**
- Dashboard displays all stat cards
- Stats update when useGameStore characters change
- Empty state shown when no characters
- Layout responsive on mobile/tablet/desktop

---

#### Task 5.4: Create Dashboard Page
- [ ] Create `app/dashboard/page.tsx`
- [ ] Page header with title and description
- [ ] Integrate Dashboard component
- [ ] Add quick actions (Create Character, Start Combat)
- [ ] Update navigation to include Dashboard link

**Acceptance Criteria:**
- Dashboard accessible at `/dashboard`
- Navigation includes Dashboard link
- Quick actions navigate correctly
- Page styled consistently with rest of app

---

#### Task 5.5: Write Dashboard Component Tests
- [ ] Create `__tests__/components/dashboard/StatCard.test.tsx`
- [ ] Create `__tests__/components/dashboard/Dashboard.test.tsx`
- [ ] Test all stat cards render correctly
- [ ] Test stats update with character changes
- [ ] Test empty state
- [ ] Test responsive behavior (if feasible)

**Acceptance Criteria:**
- All dashboard components have tests
- Tests cover rendering and updates
- All tests pass
- Mocked store data used correctly

---

### Function 6: Combat Tracker - Basic

#### Task 6.1: Create Combatant Schema Extensions
- [ ] Review existing `lib/schemas/combatant.schema.ts`
- [ ] Add helper functions: `createCombatantFromCharacter(character)`
- [ ] Add helper functions: `createCombatantFromMonster(monster)`
- [ ] Add validation for initiative values
- [ ] Update schema tests if needed
- [ ] Document combatant lifecycle in comments

**Acceptance Criteria:**
- Helper functions create valid combatants
- Initiative defaults to AC (temporary until Iteration 5)
- Schema validation works correctly
- Tests cover helper functions

---

#### Task 6.2: Create Combat Zustand Store Slice
- [ ] Create `lib/store/slices/combatSlice.ts`
- [ ] Action: `addCombatant(combatant)` - Add to combat
- [ ] Action: `removeCombatant(id)` - Remove from combat
- [ ] Action: `updateCombatantHp(id, hp)` - Update HP
- [ ] Action: `setActiveCombatant(id)` - Set active turn
- [ ] Action: `nextTurn()` - Advance to next combatant
- [ ] Action: `clearCombat()` - End combat, remove all
- [ ] Selector: `getActiveCombatant()` - Get current turn
- [ ] Selector: `getSortedCombatants()` - Sort by initiative
- [ ] Add JSDoc documentation

**Acceptance Criteria:**
- All actions update state correctly
- Combatants sorted by initiative (descending)
- Active turn cycles through list
- Store slice integrates with gameStore
- TypeScript types exported

---

#### Task 6.3: Integrate Combat Slice into Main Store
- [ ] Update `lib/store/gameStore.ts`
- [ ] Add CombatSlice to GameStore interface
- [ ] Combine slices correctly
- [ ] Verify devtools shows combat state
- [ ] Test store integration

**Acceptance Criteria:**
- Combat actions available via useGameStore
- State persists correctly
- No TypeScript errors
- Devtools displays combat state

---

#### Task 6.4: Create CombatantCard Component
- [ ] Create `components/combat/CombatantCard.tsx`
- [ ] Display: name, type (character/monster), initiative, HP bar, AC
- [ ] HP adjustment controls (±1, ±5, direct input)
- [ ] Active turn indicator (border/glow effect)
- [ ] Conditions badges display
- [ ] Remove from combat button
- [ ] Show DEFEATED state when HP = 0
- [ ] Avatar/icon display

**Acceptance Criteria:**
- Card renders all combatant data
- HP controls update store
- Active state visually distinct
- Defeated state shows clearly
- Responsive design works

---

#### Task 6.5: Create CombatTracker Component
- [ ] Create `components/combat/CombatTracker.tsx`
- [ ] Display sorted list of combatants
- [ ] Show active turn at top or highlighted
- [ ] "Next Turn" button to advance
- [ ] "Add to Combat" button/dropdown
- [ ] "End Combat" button with confirmation
- [ ] Empty state when no combatants
- [ ] Round counter display (starts at 1)

**Acceptance Criteria:**
- Tracker displays all combatants sorted
- Next Turn advances correctly
- Add to Combat works (opens modal/dropdown)
- End Combat clears all combatants
- Round increments when cycling back to first combatant

---

#### Task 6.6: Create Add to Combat Modal
- [ ] Create `components/combat/AddToCombatModal.tsx`
- [ ] Tab interface: Characters | Monsters
- [ ] Characters tab: List available characters
- [ ] Monsters tab: List available monsters (from future monster library or hardcoded)
- [ ] Initiative input field (defaults to AC)
- [ ] "Add to Combat" confirmation
- [ ] Close/cancel functionality

**Acceptance Criteria:**
- Modal shows both tabs
- Characters list pulls from store
- Initiative can be manually entered
- Add creates combatant with correct data
- Modal closes after adding

---

#### Task 6.7: Create Combat Page
- [ ] Create `app/combat/page.tsx`
- [ ] Page header with title
- [ ] Integrate CombatTracker component
- [ ] Add navigation link to Combat
- [ ] Quick access to add characters/monsters

**Acceptance Criteria:**
- Combat page accessible at `/combat`
- Navigation includes Combat link
- CombatTracker renders correctly
- Styled consistently with app

---

#### Task 6.8: Implement Turn Management Logic
- [ ] Enhance `nextTurn()` in combatSlice
- [ ] Skip defeated combatants automatically
- [ ] Cycle back to first when reaching end
- [ ] Increment round counter on cycle
- [ ] Handle edge cases (all defeated, only one combatant)

**Acceptance Criteria:**
- Turn advances correctly
- Defeated combatants skipped
- Round counter increments properly
- Edge cases handled gracefully

---

#### Task 6.9: Write Combat Store Tests
- [ ] Create `__tests__/store/slices/combatSlice.test.ts`
- [ ] Test all combat actions
- [ ] Test turn advancement logic
- [ ] Test sorting by initiative
- [ ] Test edge cases (empty, all defeated)
- [ ] Test round counter

**Acceptance Criteria:**
- All store actions tested
- Turn logic verified
- Edge cases covered
- All tests pass

---

#### Task 6.10: Write Combat Component Tests
- [ ] Create `__tests__/components/combat/CombatantCard.test.tsx`
- [ ] Create `__tests__/components/combat/CombatTracker.test.tsx`
- [ ] Create `__tests__/components/combat/AddToCombatModal.test.tsx`
- [ ] Test rendering and interactions
- [ ] Test HP updates
- [ ] Test turn advancement
- [ ] Test add/remove combatants

**Acceptance Criteria:**
- All combat components tested
- User interactions verified
- Store integration tested
- All tests pass

---

## Progress Tracking

**Total Tasks:** 15
- Function 5 (Dashboard): 5 tasks
- Function 6 (Combat): 10 tasks

**Completed:** 0
**In Progress:** 0
**Blocked:** 0

---

## Technical Considerations

### Initiative System (Temporary)
- For Iteration 3, initiative = AC (Armor Class)
- This will be replaced with d20 + DEX rolls in Iteration 5
- Combatants sorted by initiative (highest first)

### Monster Data
- For Iteration 3, use hardcoded monsters or small static list
- Full monster library will be Function 7 (Iteration 4)

### Combat State Persistence
- Combat state stored in Zustand (memory only for now)
- LocalStorage persistence comes in Iteration 4

### HP Synchronization
- Combat HP changes do NOT sync back to character roster (for now)
- This feature planned for Function 12 (later iteration)

---

## Dependencies

**Required Before Starting:**
- Iteration 2 complete ✅
- Character management working ✅
- Conditions system working ✅

**Needed for Iteration 3:**
- Monster schema (already exists from Iteration 1)
- Combatant schema (already exists from Iteration 1)
- Character store slice (already exists from Iteration 2)

---

## Testing Strategy

**Unit Tests:**
- Stats utility functions
- Combat store slice actions and selectors

**Component Tests:**
- StatCard rendering and props
- Dashboard stats display and updates
- CombatantCard rendering and interactions
- CombatTracker turn management
- AddToCombatModal tabs and adding

**Integration Tests (if time permits):**
- Full combat flow: add → adjust HP → next turn → end combat
- Dashboard updates when characters added/removed

---

## Documentation Requirements

Before marking Iteration 3 complete:
- [ ] Update PROGRESS.md with completion status
- [ ] Update COMPLETED.md with Iteration 3 summary
- [ ] Update ARCHITECTURE.md with new components/folders
- [ ] Add any architectural decisions to DECISIONS.md
- [ ] Update PATTERNS.md if new patterns established
- [ ] Create RETROSPECTIVE.md entry for Iteration 3

---

## Next Steps After Iteration 3

1. Run full test suite and verify all passing
2. Manual testing of dashboard and combat tracker
3. Commit all changes
4. Update all documentation files
5. Create retrospective for Iteration 3
6. Plan Loop Iteration 4 (Monster Library & LocalStorage)

---

**Start Date:** TBD
**Target Completion:** TBD
**Actual Completion:** Not yet started
