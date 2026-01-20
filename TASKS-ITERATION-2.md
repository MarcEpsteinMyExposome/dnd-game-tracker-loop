# TASKS: Loop Iteration 2

**Project:** dnd-game-tracker-loop v2.0
**Iteration:** 2
**Phase:** Character Management & Conditions System
**Created:** 2026-01-20
**Status:** Planning (Awaiting Approval)

---

## Iteration 2 Goals

Complete:
- Function 3: Character Management (CRUD operations, HP tracking, image support)
- Function 4: Conditions System (apply/remove conditions, visual display)

**Dependencies:** Iteration 1 complete (schemas, validation, testing infrastructure)

---

## Tasks Breakdown

### Function 3: Character Management

#### Task 3.1: Create Character Zustand Store Slice
- [ ] Create lib/store/slices/characterSlice.ts
- [ ] Define character state interface (characters array)
- [ ] Implement addCharacter action (with UUID generation, timestamps)
- [ ] Implement updateCharacter action (merge updates)
- [ ] Implement deleteCharacter action (remove by id)
- [ ] Implement getCharacterById selector
- [ ] Add JSDoc documentation for all actions

**Acceptance Criteria:**
- characterSlice.ts exists with all CRUD operations
- State properly typed with Character type from schemas
- Actions use Zod validation before updating state
- TypeScript compiles without errors

---

#### Task 3.2: Integrate Character Slice into Main Store
- [ ] Import characterSlice into lib/store/gameStore.ts
- [ ] Add character slice to store
- [ ] Verify devtools shows character actions
- [ ] Test store integration manually

**Acceptance Criteria:**
- Character slice accessible via useGameStore()
- All character actions available
- Devtools displays character state and actions

---

#### Task 3.3: Create Character Form Component
- [ ] Create components/characters/CharacterForm.tsx
- [ ] Build form with fields: name, class, level, maxHp, armorClass
- [ ] Add form validation (use validation helpers from lib/validation)
- [ ] Display validation errors inline
- [ ] Handle form submission (create or update mode)
- [ ] Add "Create" and "Cancel" buttons
- [ ] Add JSDoc component documentation

**Acceptance Criteria:**
- Form renders with all required fields
- Validation prevents invalid submissions
- Error messages display clearly
- Form can create new characters
- Form can edit existing characters (when passed character prop)

---

#### Task 3.4: Create Character Card Component
- [ ] Create components/characters/CharacterCard.tsx
- [ ] Display character name, class, level
- [ ] Display HP bar (current/max with percentage visual)
- [ ] Display armor class
- [ ] Show avatar (placeholder initially, real implementation in 3.5)
- [ ] Add "Edit" and "Delete" buttons
- [ ] Add hover effects for interactivity
- [ ] Style with Tailwind CSS

**Acceptance Criteria:**
- Card displays all character info
- HP bar visualizes health percentage (color changes: green > yellow > red)
- Buttons trigger appropriate actions
- Component is responsive
- Styled consistently with app theme

---

#### Task 3.5: Implement Avatar Support
- [ ] Research DiceBear API for auto-generated avatars
- [ ] Create lib/utils/avatar.ts helper
- [ ] Implement getAvatarUrl(seed) function using DiceBear
- [ ] Add support for custom image upload (base64 encoding)
- [ ] Create image upload input in CharacterForm
- [ ] Update CharacterCard to display avatar or generated image
- [ ] Add fallback for missing images

**Acceptance Criteria:**
- Auto-generated avatars work using character avatarSeed
- Custom images can be uploaded and stored as base64
- CharacterCard displays correct avatar
- Fallback avatar displays if image fails to load

---

#### Task 3.6: Create Character List Component
- [ ] Create components/characters/CharacterList.tsx
- [ ] Display grid of CharacterCard components
- [ ] Add "Add Character" button (opens form)
- [ ] Implement empty state (no characters message)
- [ ] Sort characters alphabetically by name
- [ ] Add loading state (for future async operations)
- [ ] Style with Tailwind grid layout

**Acceptance Criteria:**
- List displays all characters from store
- Grid layout responsive (adjusts columns based on screen size)
- Empty state shows helpful message
- Add button triggers character creation
- List updates reactively when store changes

---

#### Task 3.7: Implement HP Tracking UI
- [ ] Add HP adjustment controls to CharacterCard
- [ ] Create +1, -1, +5, -5 buttons
- [ ] Add direct HP input field
- [ ] Validate HP stays within 0 to maxHp range (use clampHp helper)
- [ ] Update character in store on HP change
- [ ] Add visual feedback on HP changes (animation/flash)
- [ ] Show "unconscious" indicator when HP = 0

**Acceptance Criteria:**
- HP buttons work correctly
- Direct input validates and clamps HP
- HP updates persist in store
- Visual feedback provides clear UX
- Unconscious state clearly visible

---

#### Task 3.8: Implement Delete Character with Confirmation
- [ ] Create components/ui/ConfirmDialog.tsx reusable component
- [ ] Add confirmation dialog for character deletion
- [ ] Show character name in confirmation message
- [ ] Implement "Confirm" and "Cancel" actions
- [ ] Delete character from store on confirmation
- [ ] Add JSDoc documentation

**Acceptance Criteria:**
- ConfirmDialog component reusable for other deletions
- Confirmation prevents accidental deletions
- Character removed from store on confirm
- Dialog can be cancelled without action

---

#### Task 3.9: Create Character Management Page
- [ ] Create app/characters/page.tsx
- [ ] Integrate CharacterList component
- [ ] Add page title and description
- [ ] Implement modal or sidebar for CharacterForm
- [ ] Handle form open/close state
- [ ] Add navigation link to main layout

**Acceptance Criteria:**
- Page accessible at /characters route
- CharacterList displays on page
- Form opens in modal/sidebar
- Form can create and edit characters
- Navigation works from main app

---

#### Task 3.10: Write Character Component Tests
- [ ] Create __tests__/components/characters/CharacterForm.test.tsx
- [ ] Create __tests__/components/characters/CharacterCard.test.tsx
- [ ] Create __tests__/components/characters/CharacterList.test.tsx
- [ ] Test form validation and submission
- [ ] Test HP tracking controls
- [ ] Test delete confirmation
- [ ] Test empty states
- [ ] Mock Zustand store for tests

**Acceptance Criteria:**
- All character components have tests
- Tests cover user interactions (form fills, button clicks, HP adjustments)
- Tests verify store actions called correctly
- All tests pass
- Aim for 80%+ component coverage

---

### Function 4: Conditions System

#### Task 4.1: Create Condition Badge Component
- [ ] Create components/conditions/ConditionBadge.tsx
- [ ] Display condition name
- [ ] Apply condition color from CONDITION_DETAILS
- [ ] Add tooltip showing condition description and effects
- [ ] Style as small badge/chip with Tailwind
- [ ] Add remove button (X icon)

**Acceptance Criteria:**
- Badge displays condition name
- Colors match CONDITION_DETAILS from schema
- Tooltip shows on hover with details
- Remove button triggers condition removal
- Badge styled consistently

---

#### Task 4.2: Create Condition Toggle Component
- [ ] Create components/conditions/ConditionToggle.tsx
- [ ] Display all 7 conditions as toggleable buttons/checkboxes
- [ ] Highlight active conditions
- [ ] Call toggleCondition helper from condition schema
- [ ] Update character in store when toggled
- [ ] Add icons or colors for each condition

**Acceptance Criteria:**
- All 7 conditions displayed
- Toggle adds/removes condition from character
- Active conditions visually distinct
- Store updated on toggle
- UI is intuitive and accessible

---

#### Task 4.3: Integrate Conditions into Character Card
- [ ] Add condition badges display to CharacterCard
- [ ] Show active conditions below character info
- [ ] Add "Manage Conditions" button
- [ ] Open ConditionToggle in popover/modal
- [ ] Update badges when conditions change

**Acceptance Criteria:**
- Character card shows active condition badges
- Badges displayed clearly without cluttering card
- Manage button opens condition toggle UI
- Changes persist in store
- UI updates reactively

---

#### Task 4.4: Create Conditions Management Modal
- [ ] Create components/conditions/ConditionsModal.tsx
- [ ] Display ConditionToggle component
- [ ] Show CONDITION_DETAILS for reference
- [ ] Add "Done" button to close modal
- [ ] Handle modal open/close state
- [ ] Style modal with Tailwind

**Acceptance Criteria:**
- Modal opens from Character Card
- All conditions manageable in modal
- Condition details visible for reference
- Modal closes properly
- Styled consistently with app

---

#### Task 4.5: Write Condition Component Tests
- [ ] Create __tests__/components/conditions/ConditionBadge.test.tsx
- [ ] Create __tests__/components/conditions/ConditionToggle.test.tsx
- [ ] Create __tests__/components/conditions/ConditionsModal.test.tsx
- [ ] Test condition toggling
- [ ] Test badge display and removal
- [ ] Test modal open/close
- [ ] Mock store for isolated testing

**Acceptance Criteria:**
- All condition components have tests
- Tests verify toggle functionality
- Tests check badge rendering
- Tests verify store interactions
- All tests pass

---

## Progress Tracking

**Total Tasks:** 15
**Completed:** 0
**In Progress:** 0
**Blocked:** 0

---

## Notes

- All components should use TypeScript with proper typing
- Use Character, Condition types from lib/schemas
- Use validation helpers from lib/validation
- Follow testing patterns from Iteration 1
- Commit after each task completion
- Update PROGRESS.md as you work
- Use Tailwind CSS for all styling
- Ensure accessibility (ARIA labels, keyboard navigation)

---

## Dependencies & Considerations

**From Iteration 1:**
- Character schema (lib/schemas/character.schema.ts) ✅
- Condition schema (lib/schemas/condition.schema.ts) ✅
- Validation helpers (lib/validation/helpers.ts) ✅
- Mock data factory (lib/testing/mockData.ts) ✅
- Zustand store setup (lib/store/gameStore.ts) ✅

**New for Iteration 2:**
- Zustand character slice (state management)
- React components (forms, cards, lists)
- UI patterns (modals, confirmations, tooltips)
- Avatar integration (DiceBear or similar)

---

## Testing Strategy

1. **Unit Tests:** Individual components in isolation (mocked store)
2. **Integration Tests:** Components + Zustand store interactions
3. **User Flow Tests:** Complete workflows (create character → add conditions → delete)
4. **Manual Testing:** Visual verification in browser

---

## Success Criteria for Iteration 2

- [ ] Users can create, edit, and delete characters
- [ ] Characters display with avatars and stats
- [ ] HP tracking works with validation
- [ ] Conditions can be applied and removed
- [ ] All 15 tasks completed
- [ ] All tests passing (aim for 200+ total tests)
- [ ] App functional at localhost:3001/characters
- [ ] Code reviewed and documented

---

**Start Date:** TBD (after approval)
**Target Completion:** TBD
**Actual Completion:** Not yet started

