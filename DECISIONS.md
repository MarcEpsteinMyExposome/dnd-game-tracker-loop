# Architectural Decision Records (ADR)

**Project:** dnd-game-tracker-loop v2.0
**Purpose:** Document WHY we made specific architectural and technical choices

---

## How to Use This File

When making a significant architectural decision:
1. Add a new entry with date and decision number
2. Explain the context (what problem are we solving?)
3. List options considered
4. State the decision and rationale
5. Note consequences (trade-offs)

---

## Decision Log

### ADR-001: Use Zustand for State Management
**Date:** 2026-01-20 (pre-project setup)
**Status:** Accepted

**Context:**
We need state management to share data between components (characters, combat state, etc.). Options include React Context, Redux, Zustand, Jotai, or Recoil.

**Options Considered:**
1. **React Context API**
   - ✅ Built-in, no dependencies
   - ❌ Verbose for complex state
   - ❌ Performance issues with frequent updates
   - ❌ No dev tools

2. **Redux Toolkit**
   - ✅ Industry standard, mature
   - ✅ Excellent dev tools
   - ❌ Heavy boilerplate (actions, reducers, slices)
   - ❌ Steeper learning curve
   - ❌ Overkill for this app's complexity

3. **Zustand** ⭐ CHOSEN
   - ✅ Minimal boilerplate
   - ✅ Simple hooks-based API
   - ✅ Good TypeScript support
   - ✅ No providers needed
   - ✅ Dev tools available
   - ✅ Sufficient for app complexity
   - ❌ Smaller community than Redux

**Decision:**
Use **Zustand** for state management.

**Rationale:**
- Simplicity aligns with learning goals (understand state management without Redux complexity)
- Hooks-based API feels natural with React 19
- Less code to write = faster iteration
- Easy to refactor to Redux later if needed

**Consequences:**
- Smaller ecosystem of plugins/middleware
- Team members familiar with Redux will need to learn Zustand patterns
- Pattern is store → hook → component (simpler than Redux)

---

### ADR-002: Use Zod for Schema Validation
**Date:** 2026-01-20 (pre-project setup)
**Status:** Accepted

**Context:**
We need runtime validation for user input and data integrity. TypeScript provides compile-time types but doesn't validate at runtime.

**Options Considered:**
1. **Manual validation**
   - ✅ No dependencies
   - ❌ Error-prone
   - ❌ Verbose
   - ❌ No TypeScript type inference

2. **Yup**
   - ✅ Mature library
   - ✅ Good form integration
   - ❌ Separate type definitions needed
   - ❌ Heavier than Zod

3. **Zod** ⭐ CHOSEN
   - ✅ TypeScript-first design
   - ✅ Infer types from schemas (DRY)
   - ✅ Composable schemas
   - ✅ Excellent error messages
   - ✅ Small bundle size
   - ❌ Newer than Yup (less mature)

**Decision:**
Use **Zod** for all data validation.

**Rationale:**
- Type inference eliminates duplicate type definitions
- Schemas serve as both validation and documentation
- Composability allows reusing schema pieces
- Aligns with "structured from start" principle (DEFINE.md)

**Consequences:**
- Single source of truth (schema = validation + types)
- Learning curve for Zod-specific syntax
- All data entering the system must be validated

**Pattern:**
```typescript
// Define schema
const CharacterSchema = z.object({
  name: z.string().min(1),
  hp: z.number().int().min(0),
})

// Infer TypeScript type
type Character = z.infer<typeof CharacterSchema>

// Validate data
const result = CharacterSchema.safeParse(data)
```

---

### ADR-003: Use Jest + React Testing Library
**Date:** 2026-01-20 (Task 1.1-1.2)
**Status:** Accepted

**Context:**
Need testing framework for unit, component, and integration tests. Testing is a learning goal, not optional.

**Options Considered:**
1. **Jest + Enzyme**
   - ✅ Jest is industry standard
   - ❌ Enzyme not well-maintained
   - ❌ Enzyme tests implementation details

2. **Vitest + Testing Library**
   - ✅ Faster than Jest (uses Vite)
   - ✅ Modern tooling
   - ❌ Less mature ecosystem
   - ❌ Fewer Next.js examples

3. **Jest + React Testing Library** ⭐ CHOSEN
   - ✅ Industry standard combination
   - ✅ Tests user behavior, not implementation
   - ✅ Excellent Next.js integration
   - ✅ Large community and resources
   - ✅ Good learning investment
   - ❌ Slower than Vitest

**Decision:**
Use **Jest + React Testing Library**.

**Rationale:**
- Focus on testing what users experience, not internal implementation
- Best Next.js documentation and support
- Part of learning goals (understand standard testing practices)
- "Test the interface, not the implementation" philosophy

**Consequences:**
- Tests may run slower than Vitest (acceptable trade-off)
- Must learn Testing Library query patterns
- Encourages accessible component design (queries use accessibility roles)

**Testing Philosophy:**
- Write tests from user perspective
- Avoid testing internal state/props directly
- Use accessible queries (getByRole, getByLabelText)

---

### ADR-004: File-based Routing with Next.js App Router
**Date:** 2026-01-20 (project setup)
**Status:** Accepted

**Context:**
Need routing system for different tabs/views (Dashboard, Characters, Combat, Monsters).

**Options Considered:**
1. **Client-side tabs (no routing)**
   - ✅ Simplest implementation
   - ❌ No shareable URLs
   - ❌ No browser history
   - ❌ State lost on refresh (until persistence added)

2. **React Router**
   - ✅ Flexible, popular
   - ❌ Extra dependency
   - ❌ Not needed with Next.js

3. **Next.js App Router** ⭐ CHOSEN
   - ✅ Built-in, no extra dependency
   - ✅ File-based (intuitive structure)
   - ✅ Server components by default
   - ✅ Layouts and metadata handling
   - ❌ Overkill if only need client-side tabs

**Decision:**
Use **Next.js App Router** with file-based routing.

**Rationale:**
- Already using Next.js, leverage built-in features
- Shareable URLs for different tabs (future feature)
- Server components for better performance
- Learning opportunity (understand modern Next.js patterns)

**Consequences:**
- May refactor to use routes instead of client-side tabs
- Folder structure determines URLs
- Can mix server and client components

---

### ADR-005: Test-First Development (Not Strict TDD)
**Date:** 2026-01-20 (Task 1.2-1.3)
**Status:** Accepted

**Context:**
Testing is part of learning goals. Need to decide when to write tests relative to code.

**Options Considered:**
1. **Strict TDD (test first, always)**
   - ✅ Forces good design
   - ❌ Slower iteration (learning curve)
   - ❌ May feel restrictive while learning

2. **Tests after feature complete**
   - ✅ Faster initial development
   - ❌ Tests become afterthought
   - ❌ Code may be hard to test

3. **Test-aware development** ⭐ CHOSEN
   - ✅ Write tests alongside code (not strictly before)
   - ✅ Every feature needs tests before task completion
   - ✅ Flexibility for learning and experimentation
   - ❌ Requires discipline

**Decision:**
Use **test-aware development** - tests required for task completion, but not strict TDD.

**Rationale:**
- Balances learning goals with iteration speed
- Tests are NOT optional (part of "Definition of Done")
- Allows experimentation during development
- Tests verify understanding, not just coverage

**Consequences:**
- Must resist urge to skip tests
- Task isn't complete until tests pass
- May refactor code to make it testable
- Coverage goals enforced (see ARCHITECTURE.md)

**Pattern:**
1. Implement feature
2. Write tests (or alongside implementation)
3. Verify tests pass
4. Only then mark task complete

---

## Outstanding Issues

### ISSUE-001: Tailwind CSS 4 Syntax (RESOLVED ✅)
**Date Discovered:** 2026-01-20
**Date Resolved:** 2026-01-20
**Status:** ✅ RESOLVED

**Problem:**
Homepage at localhost:3001 displayed "undefined Runtime Error" and spun endlessly. Error message: "Next.js 16.1.1 (stale) Turbopack Runtime Error undefined"

**Technical Context:**
- Project uses Tailwind CSS 4 (`@import "tailwindcss"` in app/globals.css)
- Next.js 16.1.1 with Turbopack
- React 19.2.3
- Visual styling added to app/page.tsx and app/characters/page.tsx

**Investigation Process:**
1. Initially identified potential Tailwind 4 syntax incompatibility
2. **First attempt (WRONG):** Converted slash opacity syntax to explicit opacity classes
   - Changed `bg-green-900/30` to `bg-green-900 bg-opacity-30`
   - This actually **caused** the error (old Tailwind 3 syntax incompatible with Tailwind 4)
3. **Second attempt (CORRECT):** Reverted to proper Tailwind 4 slash syntax
   - Tailwind 4 **requires** slash syntax for opacity: `bg-green-900/30`
   - The old `bg-opacity-X` utility classes are not supported in Tailwind 4

**Root Cause:**
Misunderstanding of Tailwind 4 syntax changes. The slash syntax (`/30`) is the **correct** way to specify opacity in Tailwind 4, not the old separate utility approach.

**Solution:**
Reverted all opacity modifiers to Tailwind 4 slash syntax:
- ✓ `bg-green-900/30` (correct)
- ✓ `border-green-500/50` (correct)
- ✓ `bg-slate-800/50` (correct)
- ✗ `bg-green-900 bg-opacity-30` (wrong, incompatible)

**Files Fixed:**
- app/page.tsx (corrected all opacity modifiers)

**Outcome:**
- Server runs successfully on localhost:3001
- Homepage loads with 200 status codes
- All visual styling displays correctly
- No runtime errors

**Lesson Learned:**
When migrating to major versions, the "obvious" fix may be wrong. Tailwind 4 represents a breaking change where slash syntax is **required**, not optional. Always verify syntax against current documentation rather than assuming backward compatibility.

---

## Iteration 3 Decisions

### ADR-006: Initiative = AC for Iteration 3 (Temporary Solution)
**Date:** 2026-01-20
**Status:** ✅ ACCEPTED (Temporary)
**Context:** Need combat tracker with initiative-based turn order

**Decision:** Use Armor Class (AC) as initiative value for Iteration 3
- Combatants sorted by AC (highest first)
- Simpler implementation for initial combat system
- Will be replaced with proper d20 + DEX initiative rolls in Iteration 5

**Alternatives Considered:**
1. **Implement full d20 initiative immediately** - Rejected due to complexity, dice rolling system is Function 10
2. **Random number for initiative** - Rejected, AC provides more meaningful ordering
3. **Manual initiative input only** - Rejected, wanted some automatic sorting

**Consequences:**
- ✅ Faster development for Iteration 3
- ✅ Combat system functional sooner
- ✅ Clear upgrade path to proper initiative in Iteration 5
- ⚠️ Not "realistic" D&D initiative, but acceptable for MVP
- ⚠️ Must document clearly that this is temporary

**Implementation:**
- `combatant.initiative` field defaults to `character.armorClass` or `monster.armorClass`
- Sort function: `combatants.sort((a, b) => b.initiative - a.initiative)`
- UI note: "Initiative (using AC temporarily)"

---

### ADR-007: Combat HP Doesn't Sync to Character Roster (For Now)
**Date:** 2026-01-20
**Status:** ✅ ACCEPTED (Temporary)
**Context:** When combatant HP changes in combat, should it update the source character?

**Decision:** Combat HP changes do NOT sync back to character roster in Iteration 3
- Combat uses separate `combatant.currentHp` field
- Character roster `character.currentHp` remains unchanged during combat
- Sync feature planned for Function 12 (future iteration)

**Alternatives Considered:**
1. **Sync immediately** - Rejected, adds complexity to Iteration 3 scope
2. **Sync only on combat end** - Considered for future, not Iteration 3
3. **Warn user about desync** - Good idea, add UI note

**Consequences:**
- ✅ Simpler implementation for Iteration 3
- ✅ Clear separation of concerns (combat state vs. roster state)
- ⚠️ User must manually update character HP after combat (for now)
- ⚠️ Potential confusion if user expects auto-sync
- ✅ Future enhancement opportunity

**Implementation:**
- Combatant created with copy of HP: `currentHp: character.currentHp`
- Combat only modifies combatant state
- Add UI note: "Combat HP changes are temporary - update characters manually after combat"

---

### ADR-008: Hardcoded Monsters for Iteration 3
**Date:** 2026-01-20
**Status:** ✅ ACCEPTED (Temporary)
**Context:** Need monsters available to add to combat, but full library is Function 7 (Iteration 4)

**Decision:** Use small hardcoded monster list for Iteration 3
- 3-5 example monsters with full stats
- Defined in `lib/data/monsters.ts` (temporary file)
- Validates against MonsterSchema
- Will be replaced with full library + database in Iteration 4

**Alternatives Considered:**
1. **Wait for full monster library** - Rejected, blocks combat testing
2. **No monsters, characters only** - Rejected, less realistic testing
3. **Import from API** - Rejected, adds external dependency

**Consequences:**
- ✅ Combat system testable with both characters and monsters
- ✅ No database/persistence complexity for Iteration 3
- ⚠️ Limited monster variety (acceptable for testing)
- ✅ Easy to replace in Iteration 4

**Example Monsters:**
- Goblin (weak melee)
- Orc (medium melee)
- Dragon Wyrmling (strong, special abilities)

---

### ADR-009: Combat State in Memory Only (No Persistence)
**Date:** 2026-01-20
**Status:** ✅ ACCEPTED (Temporary)
**Context:** Should combat state persist across page refreshes?

**Decision:** Combat state stored in Zustand (memory) only for Iteration 3
- Combat data lost on page refresh
- LocalStorage persistence comes in Iteration 4 (Function 8)
- Simpler implementation for initial combat system

**Alternatives Considered:**
1. **Add LocalStorage immediately** - Rejected, Function 8 scope
2. **Session storage** - Rejected, no benefit over Zustand for now
3. **No state at all** - Rejected, need working combat

**Consequences:**
- ✅ Faster Iteration 3 development
- ✅ Focus on combat mechanics, not persistence
- ⚠️ Users lose combat state on refresh (acceptable for testing)
- ✅ LocalStorage will handle all state in Iteration 4

**Implementation:**
- Combat slice uses Zustand's built-in memory storage
- No middleware added yet
- Clear upgrade path to persistence layer

---

## Future Decisions to Document

- Data persistence strategy details (LocalStorage structure, auto-save timing)
- Dice rolling animation approach (simple vs. 3D)
- Responsive design breakpoints (mobile-first vs. desktop-first)
- Dark mode implementation (manual toggle vs. system preference)
- Image storage strategy (base64 vs. file uploads vs. CDN)

---

## Update History

**2026-01-20 (Iteration 3 Planning)** - Iteration 3 architectural decisions
- ADR-006: Initiative = AC temporarily (will be d20 in Iteration 5)
- ADR-007: Combat HP doesn't sync to roster yet (future feature)
- ADR-008: Hardcoded monsters for Iteration 3 (full library in Iteration 4)
- ADR-009: Combat state in memory only (LocalStorage in Iteration 4)

**2026-01-20** - Initial ADR document created
- ADR-001: Zustand for state management
- ADR-002: Zod for validation
- ADR-003: Jest + React Testing Library
- ADR-004: Next.js App Router
- ADR-005: Test-aware development approach
- ISSUE-001: Tailwind CSS 4 syntax issue (resolved - slash syntax required)

---

**Note:** Add new decisions as they arise during development. Each decision should explain context, options, choice, and consequences.
