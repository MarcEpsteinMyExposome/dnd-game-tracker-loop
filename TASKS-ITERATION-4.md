# TASKS: Loop Iteration 4

**Project:** dnd-game-tracker-loop v2.0
**Iteration:** 4
**Phase:** Data Persistence & Monster Library
**Created:** 2026-01-21
**Status:** Planning

---

## Iteration 4 Goals

Complete:
- Function 8: LocalStorage Persistence (PRIORITY 1)
- Function 7: Monster Library (PRIORITY 2)

**Success Criteria:**
- Game state persists across page refreshes
- Characters, combat state, and monsters saved to LocalStorage
- Export/Import JSON functionality works
- Monster library displays pre-defined stat blocks
- Add monsters to combat from library
- All features tested with passing tests

**Why This Order:**
LocalStorage comes first because without it, the app isn't truly usable for real games. Every refresh loses all data, making it frustrating to test and use. Once we have persistence, the monster library will automatically be saved too.

---

## Tasks Breakdown

### Function 8: LocalStorage Persistence (PRIORITY 1)

#### Task 8.1: Create LocalStorage Utility Module
- [ ] Create `lib/storage/localStorage.ts`
- [ ] Write `saveToLocalStorage(key, data)` function
- [ ] Write `loadFromLocalStorage(key)` function with error handling
- [ ] Write `removeFromLocalStorage(key)` function
- [ ] Write `clearAllLocalStorage()` function
- [ ] Add try-catch for quota exceeded errors
- [ ] Add JSDoc comments for all functions
- [ ] Write unit tests in `__tests__/storage/localStorage.test.ts`

**Acceptance Criteria:**
- All localStorage operations work correctly
- Error handling prevents crashes on quota exceeded
- Tests cover success and error cases
- Functions return typed data (not just `any`)

---

#### Task 8.2: Add Persistence Middleware to Zustand Store
- [ ] Research Zustand persist middleware options
- [ ] Update `lib/store/gameStore.ts` to add persist middleware
- [ ] Configure which state slices to persist (characters, combat, settings)
- [ ] Set storage key name: `dnd-game-tracker-v2`
- [ ] Add version number for future migrations
- [ ] Test that state saves on changes
- [ ] Test that state loads on app startup

**Acceptance Criteria:**
- Store automatically saves to localStorage on state changes
- Store automatically loads from localStorage on mount
- Persist middleware doesn't break existing functionality
- All 435 existing tests still pass

---

#### Task 8.3: Add State Version Migration System
- [ ] Create `lib/storage/migrations.ts`
- [ ] Define migration function signature
- [ ] Write migration for v1 → v2 (if needed, or placeholder)
- [ ] Add version checking logic to persist middleware
- [ ] Handle case where localStorage has old version
- [ ] Add JSDoc comments explaining migration process
- [ ] Write tests for migration logic

**Acceptance Criteria:**
- Version checking works on load
- Old data can be migrated to new format
- Invalid/corrupted data handled gracefully
- Migration tests cover edge cases

---

#### Task 8.4: Create Export/Import Functionality
- [ ] Create `lib/storage/exportImport.ts`
- [ ] Write `exportGameState()` - returns JSON string
- [ ] Write `importGameState(jsonString)` - validates and loads
- [ ] Add Zod schema validation for import data
- [ ] Create download trigger (browser download of JSON file)
- [ ] Create file upload handler
- [ ] Add error messages for invalid imports
- [ ] Write tests for export/import functions

**Acceptance Criteria:**
- Export creates valid JSON file
- Import validates data before loading
- Invalid JSON shows user-friendly error
- Tests cover valid and invalid import data

---

#### Task 8.5: Create Settings/Data Management Page
- [ ] Create `app/settings/page.tsx`
- [ ] Add "Export Data" button with download
- [ ] Add "Import Data" button with file picker
- [ ] Add "Clear All Data" button with confirmation
- [ ] Show current data statistics (# characters, # monsters, etc.)
- [ ] Show localStorage usage (if possible)
- [ ] Add navigation link to Settings page
- [ ] Style consistently with rest of app

**Acceptance Criteria:**
- Settings page accessible at `/settings`
- Export downloads JSON file with timestamp
- Import loads file and validates
- Clear all data requires confirmation dialog
- Navigation includes Settings link

---

#### Task 8.6: Add Loading States for Persistence
- [ ] Create loading spinner component (if not exists)
- [ ] Add loading state while localStorage is being read on mount
- [ ] Show loading indicator during import
- [ ] Show success/error toast notifications (or use existing)
- [ ] Prevent UI interactions during load
- [ ] Add error boundary for persistence failures

**Acceptance Criteria:**
- Loading states provide visual feedback
- User can't interact with app while loading
- Errors don't crash the app
- Success/error messages are clear

---

#### Task 8.7: Write Persistence Integration Tests
- [ ] Create `__tests__/storage/integration.test.ts`
- [ ] Test: Create character → refresh → character persists
- [ ] Test: Add to combat → refresh → combat persists
- [ ] Test: Export → clear → import → data restored
- [ ] Test: Corrupted localStorage → graceful fallback
- [ ] Test: Quota exceeded → error message shown
- [ ] Test: Migration from old version works

**Acceptance Criteria:**
- Integration tests cover full persistence flow
- Tests simulate real user scenarios
- Edge cases covered (errors, corruption, quota)
- All tests pass

---

### Function 7: Monster Library (PRIORITY 2)

#### Task 7.1: Create Monster Data File
- [ ] Create `lib/data/monsters.ts`
- [ ] Define 10-15 pre-defined monsters (D&D SRD compliant)
- [ ] Monster categories: Xenos, Chaos, Imperial, Undead, Beasts
- [ ] Each monster includes: name, type, AC, HP, damage, abilities, avatarSeed
- [ ] Use existing Monster schema for validation
- [ ] Add JSDoc comments explaining monster structure
- [ ] Create helper function `getAllMonsters()`
- [ ] Create helper function `getMonstersByCategory(category)`

**Acceptance Criteria:**
- 10-15 monsters defined with complete data
- All monsters validate against Monster schema
- Monsters grouped by category
- Helper functions return typed Monster arrays

**Example Monsters:**
- Goblin (Beast/Xenos)
- Orc Warrior (Chaos)
- Zombie (Undead)
- Giant Spider (Beast)
- Cultist (Chaos)
- Imperial Guard (Imperial)

---

#### Task 7.2: Create MonsterCard Component
- [ ] Create `components/monsters/MonsterCard.tsx`
- [ ] Display: name, type/category, AC, HP, damage, special abilities
- [ ] Show avatar (using avatarSeed or monster type icon)
- [ ] "Add to Combat" button
- [ ] Visual distinction from character cards (different color scheme)
- [ ] Hover effects and transitions
- [ ] Add ARIA labels for accessibility
- [ ] Add JSDoc comments

**Acceptance Criteria:**
- Card renders all monster data
- "Add to Combat" button works
- Visual design matches app theme
- Responsive design works on mobile

---

#### Task 7.3: Create MonsterLibrary Component
- [ ] Create `components/monsters/MonsterLibrary.tsx`
- [ ] Display all monsters in grid layout (2-4 columns responsive)
- [ ] Category filter tabs (All, Xenos, Chaos, Imperial, Undead, Beasts)
- [ ] Search/filter by name
- [ ] "Add All to Combat" button (for quick encounters)
- [ ] Empty state when no monsters match filter
- [ ] Sort options (name, AC, HP, type)
- [ ] Add JSDoc comments

**Acceptance Criteria:**
- Library displays all monsters
- Category filters work correctly
- Search filters monster list
- Sort options reorder monsters
- Add to Combat integrates with combat store

---

#### Task 7.4: Create Monster Library Page
- [ ] Create `app/monsters/page.tsx`
- [ ] Page header with title and description
- [ ] Integrate MonsterLibrary component
- [ ] Quick action to navigate to Combat page
- [ ] Add navigation link to Monsters page
- [ ] Style consistently with app theme
- [ ] Add monster count display

**Acceptance Criteria:**
- Monsters page accessible at `/monsters`
- Navigation includes Monsters link
- Page integrates with existing navigation
- Styled consistently

---

#### Task 7.5: Integrate Monsters with Combat Tracker
- [ ] Update AddToCombatModal to include Monsters tab
- [ ] List available monsters from library
- [ ] Allow selecting multiple monsters
- [ ] Create multiple instances of same monster (e.g., 3x Goblin)
- [ ] Set unique names (Goblin 1, Goblin 2, Goblin 3)
- [ ] Initiative input for each monster instance
- [ ] Use `createCombatantFromMonster` helper
- [ ] Update modal styling for two tabs

**Acceptance Criteria:**
- Modal has Characters and Monsters tabs
- Can add monsters to combat
- Multiple instances get unique names
- Monsters appear in initiative order
- Initiative defaults to AC for monsters too

---

#### Task 7.6: Add Monster Quick Actions
- [ ] "Quick Encounter" button on Monster Library
- [ ] Pre-defined encounters (e.g., "Goblin Ambush", "Undead Horde")
- [ ] One-click to add full encounter to combat
- [ ] Create `lib/data/encounters.ts` with 3-5 pre-built encounters
- [ ] Each encounter: name, description, monster list with counts
- [ ] Add encounter selector dropdown

**Acceptance Criteria:**
- Quick encounter button works
- Pre-defined encounters load all monsters
- Encounters have thematic names
- One-click adds all to combat

---

#### Task 7.7: Write Monster Component Tests
- [ ] Create `__tests__/components/monsters/MonsterCard.test.tsx`
- [ ] Create `__tests__/components/monsters/MonsterLibrary.test.tsx`
- [ ] Test monster card rendering
- [ ] Test "Add to Combat" functionality
- [ ] Test category filtering
- [ ] Test search functionality
- [ ] Test sort options
- [ ] Test integration with combat store

**Acceptance Criteria:**
- All monster components have tests
- Tests cover user interactions
- Tests verify combat integration
- All tests pass

---

#### Task 7.8: Write Monster Data Tests
- [ ] Create `__tests__/data/monsters.test.ts`
- [ ] Test all monsters validate against schema
- [ ] Test `getAllMonsters()` returns correct count
- [ ] Test `getMonstersByCategory()` filters correctly
- [ ] Test monster data completeness (no missing fields)
- [ ] Test monster balance (AC/HP ranges reasonable)

**Acceptance Criteria:**
- All monster data validated
- Helper functions tested
- Data completeness verified
- All tests pass

---

## Progress Tracking

**Total Tasks:** 16
- Function 8 (LocalStorage Persistence): 7 tasks
- Function 7 (Monster Library): 8 tasks
- Integration: 1 task (monster + combat integration counted above)

**Completed:** 0
**In Progress:** 0
**Blocked:** 0

---

## Technical Considerations

### LocalStorage Limits
- Browser localStorage limit: ~5-10MB
- Store only essential data (no large images in localStorage)
- Custom images stored as base64 might hit limits with many characters
- Consider compression for large datasets (future enhancement)

### State Persistence Strategy
- Use Zustand persist middleware (official, well-maintained)
- Persist characters, combat state, and settings
- Do NOT persist temporary UI state (modals, loading states)
- Use versioning for future migrations

### Monster Data Source
- Use SRD (System Reference Document) compliant monsters
- Avoid copyrighted monster names (use generic equivalents)
- Example: "Orc" ✓ legal, "Beholder" ✗ copyrighted

### Combat Integration
- Monsters use same Combatant schema as characters
- `createCombatantFromMonster()` helper already exists from Iteration 1
- Monster instances need unique IDs even if same monster type

---

## Dependencies

**Required Before Starting:**
- Iteration 3 complete ✅
- Combat tracker working ✅
- Character management working ✅
- All 435 tests passing ✅

**Needed for Iteration 4:**
- Monster schema (already exists from Iteration 1) ✅
- Combatant schema (already exists from Iteration 1) ✅
- Combat store slice (already exists from Iteration 3) ✅

---

## Testing Strategy

**Unit Tests:**
- LocalStorage utility functions
- Export/Import functions
- Migration logic
- Monster data validation
- Monster helper functions

**Component Tests:**
- Settings page controls
- MonsterCard rendering and interactions
- MonsterLibrary filtering and sorting
- AddToCombatModal with Monsters tab

**Integration Tests:**
- Full persistence flow (save → refresh → load)
- Export → clear → import cycle
- Add monster to combat → save → refresh → combat restored
- Corrupted data handling

---

## Documentation Requirements

Before marking Iteration 4 complete:
- [ ] Update PROGRESS.md with completion status
- [ ] Update COMPLETED.md with Iteration 4 summary
- [ ] Update ARCHITECTURE.md with new storage layer
- [ ] Add persistence decisions to DECISIONS.md (why Zustand persist? why localStorage?)
- [ ] Update PATTERNS.md with persistence patterns
- [ ] Update homepage to show Iteration 4 complete
- [ ] Create RETROSPECTIVE.md entry for Iteration 4

---

## Risk Assessment

### High Risk
- **LocalStorage quota exceeded**: Mitigate with compression, error handling
- **Migration bugs**: Mitigate with comprehensive tests, fallback to empty state

### Medium Risk
- **Persist middleware conflicts**: Mitigate with careful store setup, test existing functionality
- **Corrupted localStorage data**: Mitigate with validation, error boundaries

### Low Risk
- **Monster data balance issues**: Mitigate with SRD reference, playtesting
- **Monster art/avatars**: Mitigate with fallback icons, DiceBear seeds

---

## Next Steps After Iteration 4

1. Run full test suite and verify all passing
2. Manual testing of persistence (create → refresh → verify)
3. Manual testing of monster library (add to combat)
4. Commit all changes
5. Update all documentation files
6. Create retrospective for Iteration 4
7. Plan Loop Iteration 5 (Enhanced Combat: Initiative System & Dice Rolling)

---

**Start Date:** TBD
**Target Completion:** TBD
**Actual Completion:** Not yet started
