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

## Future Decisions to Document

- Tailwind CSS version strategy (resolve compatibility issue first)
- Data persistence strategy (LocalStorage vs. database)
- Initiative system implementation
- Dice rolling animation approach
- Responsive design breakpoints
- Dark mode implementation
- Image storage strategy

---

## Update History

**2026-01-20** - Initial ADR document created
- ADR-001: Zustand for state management
- ADR-002: Zod for validation
- ADR-003: Jest + React Testing Library
- ADR-004: Next.js App Router
- ADR-005: Test-aware development approach
- ISSUE-001: Tailwind CSS 4 syntax issue (resolved - slash syntax required)

---

**Note:** Add new decisions as they arise during development. Each decision should explain context, options, choice, and consequences.
