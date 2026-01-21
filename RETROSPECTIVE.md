# RETROSPECTIVE: Lessons Learned

**Project:** dnd-game-tracker-loop v2.0
**Purpose:** Document insights and learnings after each iteration

---

## How to Use This File

After completing each loop iteration:
1. Review what happened during the iteration
2. Document what went well
3. Document what could be improved
4. Capture specific lessons learned
5. Note any process adjustments for next iteration

---

## Iteration Retrospectives

### Loop Iteration 4: Data Persistence & Monster Library

**Completed:** 2026-01-21
**Duration:** 1 day
**Tasks Completed:** 16 of 16

#### What Went Well ✅
- Zustand persist middleware integrated seamlessly with existing store architecture
- Migration system designed upfront provides clear path for future schema changes
- Monster library feels complete with filtering, sorting, and search capabilities
- Quick Encounter feature adds genuine gameplay value for real D&D sessions
- Two pathways to add monsters (from /monsters or /combat) improves UX flexibility
- Toast notifications provide clear feedback without interrupting user flow
- ErrorBoundary catches persistence failures gracefully
- Comprehensive test coverage maintained (370 new tests, 805 total)
- AddMonstersModal instance count feature (add 3x Goblins) is very practical

#### What Could Be Improved 🔄
- Only 5 pre-built encounters - could add more variety
- No custom monster creation - only pre-defined stat blocks
- Initiative still uses AC as placeholder - real dice rolling would improve experience
- Could add monster stat block export/print functionality
- Settings page is functional but minimal - could be more polished

#### Specific Lessons Learned 💡

1. **Zustand Persist Middleware Timing**
   - Situation: Initial page load showed loading state while Zustand hydrated from localStorage.
   - Learning: Zustand persist middleware handles hydration timing automatically, but apps need to handle the "loading" state before hydration completes.
   - Action: Created PersistenceProvider component that wraps app and shows loading spinner until hasHydrated is true.

2. **Migration System Design**
   - Situation: Needed a way to upgrade persisted state when schema changes in future versions.
   - Learning: Designing migration system upfront (even with only v0 → v1) makes future upgrades straightforward. Sequential migrations are easier to reason about than complex version jumping.
   - Action: Always include version number in persisted state. Add migrations before schema changes.

3. **Quick Encounters Add Real Value**
   - Situation: Added pre-built encounters as "nice to have" feature, but it proved very useful.
   - Learning: Pre-configured combat setups significantly reduce friction for actual gameplay. DMs can start sessions faster.
   - Action: Consider more "quick action" features that bundle common operations together.

4. **Multiple Pathways to Same Action**
   - Situation: Can add monsters from both /monsters page and /combat page (via AddMonstersModal).
   - Learning: Providing multiple entry points for same functionality improves UX - users can work in whatever flow feels natural.
   - Action: Consider dual-pathway approach for other features (e.g., adding characters to combat).

5. **Instance Count Selector**
   - Situation: Users often want to add multiple copies of same monster (e.g., 4 Goblins).
   - Learning: Single "Add to Combat" button per monster is inefficient. Instance count selector saves many clicks.
   - Action: Look for other places where "add multiple of same thing" would be useful.

#### Process Observations 📊
- **Task breakdown:** 16 tasks was appropriate for combined persistence + monster library scope.
- **Blockers:** No significant blockers. Hydration timing was expected challenge.
- **Testing approach:** Integration tests (16) proved valuable for end-to-end persistence flows.
- **Commit frequency:** Good cadence with logical groupings.

#### Adjustments for Next Iteration ⚙️
- [ ] Plan more comprehensive encounter presets (different themes, party sizes)
- [ ] Consider adding custom monster creation in future iteration
- [ ] Implement real dice rolling for initiative (Iteration 5 priority)
- [ ] Add keyboard shortcuts for common combat actions

#### Metrics 📈
- Tasks planned: 16
- Tasks completed: 16
- Tests written: 370
- Total test count: 805
- Commits made: Multiple (including post-fix commits)
- Blockers encountered: 0 significant

#### Notes
- App now persists state - actually usable for real game sessions
- Monster library with Quick Encounters significantly improves combat setup experience
- Settings page provides data management (export, import, clear) for backup/restore
- Ready for enhanced combat features (dice rolling, true initiative) in Iteration 5

---

### Loop Iteration 3: Dashboard & Combat Tracker

**Completed:** 2026-01-21
**Duration:** 1 day
**Tasks Completed:** 15 of 15

#### What Went Well ✅
- Pure calculation utilities (stats.ts) were extremely easy to test and reason about
- Combat store slice followed established patterns from characterSlice - consistency pays off
- Turn management logic handles edge cases gracefully (defeated combatants, empty lists, cycling)
- Dashboard auto-updates with Zustand reactivity - no manual refresh needed
- Initiative-based ordering "just works" with sort by descending initiative
- HP adjustment buttons provide excellent UX for quick combat updates
- Round counter automatically increments - one less thing for users to track manually
- Color-coded visual feedback (HP bars, player/enemy distinction) improves usability
- Test coverage remained comprehensive (161 new tests, 435 total)

#### What Could Be Improved 🔄
- Hit a post-iteration bug with CombatTracker infinite loop (selector functions called during subscription)
- Initiative still uses AC placeholder - real dice rolling would be better UX
- No animations for turn transitions - could feel more polished
- Combat lacks persistence - refresh loses all state (addressed in Iteration 4)
- Monster library missing - testing combat with characters only feels incomplete
- Could use loading states when adding combatants to provide visual feedback

#### Specific Lessons Learned 💡

1. **Zustand Selector Functions and Infinite Loops**
   - Situation: CombatTracker crashed with "result of getSnapshot should be cached" error. Selector functions like `getSortedCombatants()` were being called inside `useGameStore` subscriptions.
   - Learning: Selector functions that return new arrays/objects cause React to detect changes on every render. Must access the selector function itself from store, then call it outside the subscription.
   - Action: Always call selector functions in component body, not during store subscription. Document this pattern in PATTERNS.md.

2. **Pure Functions Are Test-Friendly**
   - Situation: Stats calculation utilities (calculateTeamSize, calculateAverageHp, etc.) had 45 comprehensive tests covering all edge cases.
   - Learning: Pure functions with no side effects are trivial to test - just input → output assertions. No mocking, no store setup.
   - Action: Extract complex calculations into pure utility functions whenever possible. Keep component logic focused on UI concerns.

3. **Auto-Skipping Defeated Combatants**
   - Situation: Turn management needed to handle combatants at 0 HP during nextTurn().
   - Learning: Automatically skipping defeated combatants prevents user frustration and manual errors. Need safeguard for "all defeated" case to prevent infinite loops.
   - Action: Always consider edge cases in game logic (empty arrays, all filtered out, boundary conditions).

4. **Round Counter as First-Class Feature**
   - Situation: Initially considered round counter as "nice to have", but it proved essential during testing.
   - Learning: Round tracking is critical for spell durations, conditions, and game flow. Auto-incrementing on turn cycle removes manual tracking burden.
   - Action: Game mechanics that players would track manually should be automated when possible.

#### Process Observations 📊
- **Task breakdown:** Well-balanced. Stats utilities were quick, combat tracker was more complex but logically grouped.
- **Time estimates:** Not tracked (per project guidelines), but tasks felt appropriately scoped.
- **Blockers:** One post-iteration bug (infinite loop) discovered during manual testing - emphasizes need for manual QA after test suite passes.
- **Testing approach:** Comprehensive unit tests for utilities and store, component tests for UI. Integration tests could be added for full combat flow.
- **Commit frequency:** Good cadence, commits after logical completion of features.

#### Adjustments for Next Iteration ⚙️
- [x] Document Zustand selector pattern in PATTERNS.md to prevent future infinite loop bugs
- [ ] Consider adding manual QA checklist before marking iteration complete
- [ ] Add loading states for async operations (will be relevant with persistence in Iteration 4)
- [ ] Consider animation strategy for future polish iterations

#### Metrics 📈
- Tasks planned: 15
- Tasks completed: 15
- Tests written: 161
- Total test count: 435
- Commits made: Multiple (exact count not tracked)
- Blockers encountered: 1 (infinite loop bug, resolved post-iteration)

#### Notes
- Combat system feels functional and usable now
- Dashboard provides valuable at-a-glance team health overview
- Missing persistence makes it hard to truly evaluate in real-world use
- Next iteration (LocalStorage) will make app actually usable for real games

---

### Loop Iteration 2: Character Management & Conditions System

**Completed:** 2026-01-20
**Duration:** 1 day
**Tasks Completed:** 15 of 15

#### What Went Well ✅
- Zustand slice pattern established clear state management conventions
- DiceBear avatar integration provides beautiful default avatars with zero effort
- Condition tooltips with mechanical effects are genuinely helpful during gameplay
- HP tracking UI is intuitive with both quick buttons and direct input
- ConfirmDialog component established reusable modal pattern
- Tests use accessible queries (getByRole) which caught accessibility issues early
- Character CRUD operations work smoothly with Zod validation

#### What Could Be Improved 🔄
- Avatar upload could show file size limit before user tries to upload
- Character list could benefit from search/filter as roster grows
- Loading states not implemented yet (not needed for synchronous operations, but good practice)
- Could add character export/import (individual characters, not just full state)

#### Specific Lessons Learned 💡

1. **Breaking UI into Small Components**
   - Situation: CharacterCard component became complex with HP tracking, conditions, edit/delete actions.
   - Learning: Smaller focused components (ConditionBadge, ConfirmDialog) are easier to test and reuse.
   - Action: Continue component decomposition strategy. Aim for single responsibility.

2. **Accessible Queries Catch Bugs**
   - Situation: Tests using getByRole found missing ARIA labels and incorrect semantic HTML.
   - Learning: Accessibility-first testing improves code quality beyond just a11y compliance.
   - Action: Always prefer getByRole and getByLabelText over data-testid in tests.

3. **Base64 Images for Small Avatars**
   - Situation: Decided to store custom avatars as base64 strings in state.
   - Learning: Works well for small images, but will hit localStorage limits if users upload many large images.
   - Action: Document this limitation. Consider cloud storage for production version.

#### Process Observations 📊
- **Task breakdown:** Tasks well-scoped, each completable in reasonable time
- **Blockers:** Tooltip z-index required some CSS adjustment
- **Testing approach:** Component tests worked well with React Testing Library user interactions
- **Commit frequency:** Regular commits after each task or small group of related tasks

#### Adjustments for Next Iteration ⚙️
- [x] Continue Zustand slice pattern (worked great)
- [x] Keep breaking components into smaller, focused pieces
- [x] Maintain high test coverage with accessible queries

#### Metrics 📈
- Tasks planned: 15
- Tasks completed: 15
- Tests written: 30
- Total test count: 274
- Commits made: 14
- Blockers encountered: Minor (CSS z-index for tooltips)

#### Notes
- Character management feels complete and polished
- Conditions system provides good reference information
- Avatar system works well with DiceBear fallback

---

### Loop Iteration 1: Foundation & Data Models

**Completed:** 2026-01-20
**Duration:** 1 day
**Tasks Completed:** 16 of 16

#### What Went Well ✅
- Testing infrastructure setup went smoothly (Jest + React Testing Library)
- Zod schemas provide excellent TypeScript type inference
- Mock data factory approach makes testing much easier
- 244 tests for foundation layer provides confidence for future iterations
- Helper functions (createCombatantFromCharacter, etc.) proved valuable in later iterations
- 100% schema coverage established quality baseline

#### What Could Be Improved 🔄
- Initial setup takes time (expected for foundation iteration)
- Some schemas (like Combatant) could have been discovered during later iterations rather than upfront
- Could have started with simpler schemas and extended later

#### Specific Lessons Learned 💡

1. **Zod Schema Design**
   - Situation: Needed validation and TypeScript types for all data models.
   - Learning: Zod provides both validation and type inference from single source of truth.
   - Action: Define schemas before implementing features. Use safeParse for user-facing validation.

2. **Mock Data Factories**
   - Situation: Tests needed sample data (characters, monsters, combatants).
   - Learning: Factory functions with default values + optional overrides make tests readable and maintainable.
   - Action: Create mock factories for all major entities. Keep them in sync with schemas.

3. **Helper Functions for Common Transformations**
   - Situation: Need to convert Character → Combatant and Monster → Combatant.
   - Learning: Helper functions defined early prevented duplication in later iterations.
   - Action: Think about data transformations during schema design.

#### Process Observations 📊
- **Task breakdown:** Foundation tasks are inherently more setup-heavy
- **Blockers:** None significant
- **Testing approach:** Comprehensive schema testing established quality bar
- **Commit frequency:** Regular commits throughout

#### Adjustments for Next Iteration ⚙️
- [x] Foundation complete, shift to feature development
- [x] Maintain test coverage standards (aim for comprehensive coverage)
- [x] Use established patterns (schemas, factories, helpers)

#### Metrics 📈
- Tasks planned: 16
- Tasks completed: 16
- Tests written: 244
- Total test count: 244
- Commits made: Multiple
- Blockers encountered: 0

#### Notes
- Solid foundation enables rapid feature development in subsequent iterations
- Time invested in testing infrastructure pays off immediately
- Zod + TypeScript + Zustand stack works very well together

---

## Template for Future Retrospectives

```markdown
## Loop Iteration X: [Name]

**Completed:** YYYY-MM-DD
**Duration:** X days
**Tasks Completed:** X of Y

### What Went Well ✅
- [Positive aspect 1]
- [Positive aspect 2]
- [Positive aspect 3]

### What Could Be Improved 🔄
- [Challenge or issue 1]
- [Challenge or issue 2]
- [Challenge or issue 3]

### Specific Lessons Learned 💡
1. **[Lesson title]**
   - Situation: [What happened]
   - Learning: [What we learned]
   - Action: [How to apply this going forward]

2. **[Lesson title]**
   - Situation: [What happened]
   - Learning: [What we learned]
   - Action: [How to apply this going forward]

### Process Observations 📊
- **Task breakdown:** [Too granular? Too broad? Just right?]
- **Time estimates:** [Accurate? Way off?]
- **Blockers:** [What blocked progress and how resolved?]
- **Testing approach:** [Did TDD work? Coverage adequate?]
- **Commit frequency:** [Too often? Not enough?]

### Adjustments for Next Iteration ⚙️
- [ ] [Specific change to make]
- [ ] [Specific change to make]
- [ ] [Specific change to make]

### Metrics 📈
- Tasks planned: X
- Tasks completed: Y
- Tests written: Z
- Code coverage: X%
- Commits made: N
- Blockers encountered: M

### Notes
[Any additional observations or context]

---
```

## General Observations (Ongoing)

### About the Loop Methodology
*Will update as we experience the process*

### About Testing Practices
*Will update as we write tests*

### About the Tech Stack
*Will update as we work with Next.js, Zustand, Zod, etc.*

### About AI Assistance
*Will update with observations about working with AI on iterative projects*

---

**This file will grow richer with insights as we complete each iteration!**
