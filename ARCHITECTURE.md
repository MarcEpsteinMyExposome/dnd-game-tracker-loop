# Architecture Overview

**Project:** dnd-game-tracker-loop v2.0
**Last Updated:** 2026-01-20 (Iteration 3 PLANNING)
**Purpose:** Living document explaining how the codebase is structured and how pieces connect

---

## Tech Stack

### Core Technologies
- **Next.js 16.1.1** - React framework with App Router (file-based routing)
- **React 19.2.3** - UI library with hooks
- **TypeScript 5** - Type-safe JavaScript
- **Tailwind CSS 4** - Utility-first CSS framework

### State Management & Validation
- **Zustand 5.0.3** - Lightweight state management (simpler than Redux)
- **Zod 3.24.1** - Schema validation with TypeScript type inference

### Testing
- **Jest 29.7.0** - Test runner and assertion library
- **React Testing Library 16.3.2** - Component testing utilities
- **@testing-library/jest-dom** - Custom Jest matchers for DOM
- **@testing-library/user-event** - Simulate user interactions

### Deployment
- **Vercel** - Hosting platform (free tier)

---

## Folder Structure

```
dnd-game-tracker-loop/
├── app/                          # Next.js App Router directory
│   ├── layout.tsx               # Root layout with navigation
│   ├── page.tsx                 # Home page (iteration status)
│   ├── characters/              # Character management route
│   │   └── page.tsx             # /characters page
│   ├── dashboard/               # Dashboard route (Iteration 3)
│   │   └── page.tsx             # /dashboard page
│   ├── combat/                  # Combat tracker route (Iteration 3)
│   │   └── page.tsx             # /combat page
│   ├── globals.css              # Tailwind imports and global styles
│   └── favicon.ico              # Site icon
│
├── components/                   # React components
│   ├── characters/              # Character management (Iteration 2) ✅
│   │   ├── CharacterForm.tsx
│   │   ├── CharacterCard.tsx
│   │   └── CharacterList.tsx
│   ├── conditions/              # Condition system (Iteration 2) ✅
│   │   ├── ConditionBadge.tsx
│   │   ├── ConditionToggle.tsx
│   │   └── ConditionsModal.tsx
│   ├── ui/                      # Reusable UI components ✅
│   │   └── ConfirmDialog.tsx
│   ├── dashboard/               # Dashboard components (Iteration 3) 📋
│   │   ├── StatCard.tsx         # Planned
│   │   └── Dashboard.tsx        # Planned
│   ├── combat/                  # Combat tracker (Iteration 3) 📋
│   │   ├── CombatantCard.tsx    # Planned
│   │   ├── CombatTracker.tsx    # Planned
│   │   └── AddToCombatModal.tsx # Planned
│   └── monsters/                # Monster library (Iteration 4)
│       └── (future)
│
├── lib/                         # Business logic and utilities
│   ├── schemas/                 # Zod validation schemas ✅
│   │   ├── character.schema.ts
│   │   ├── monster.schema.ts
│   │   ├── condition.schema.ts
│   │   ├── combatant.schema.ts
│   │   └── index.ts             # Barrel export
│   ├── store/                   # Zustand state management
│   │   ├── gameStore.ts         # Main store ✅
│   │   └── slices/             # Store slices
│   │       ├── characterSlice.ts  # Iteration 2 ✅
│   │       └── combatSlice.ts     # Iteration 3 📋 (planned)
│   ├── validation/              # Validation helpers ✅
│   │   └── helpers.ts
│   ├── testing/                 # Mock data factories ✅
│   │   └── mockData.ts
│   ├── utils/                   # General utilities
│   │   ├── avatar.ts            # Iteration 2 ✅
│   │   └── stats.ts             # Iteration 3 📋 (planned)
│   └── dice/                    # Dice rolling (Iteration 5)
│       └── (future)
│
├── __tests__/                   # Test files (mirrors lib/ and components/)
│   ├── components/              # Component tests
│   ├── lib/                     # Library function tests
│   ├── schemas/                 # Schema validation tests
│   ├── utils/                   # Utility function tests
│   └── hooks/                   # Custom hook tests
│
├── public/                      # Static assets (images, fonts)
│
├── DEFINE.md                    # Project goals and requirements
├── FUNCTIONS.md                 # Feature breakdown (12 functions)
├── TASKS.md                     # Current iteration task list
├── PROGRESS.md                  # Current state and next actions
├── COMPLETED.md                 # Historical iteration record
├── RETROSPECTIVE.md             # Lessons learned
├── INSTRUCTIONS_TO_LLM.md       # AI assistant guide
├── ARCHITECTURE.md              # This file - system architecture
├── DECISIONS.md                 # Architectural decision records
├── PATTERNS.md                  # Code patterns and conventions
│
├── jest.config.js               # Jest test configuration
├── jest.setup.js                # Jest environment setup
├── next.config.ts               # Next.js configuration
├── tsconfig.json                # TypeScript configuration
├── tailwind.config.ts           # Tailwind CSS configuration (if exists)
├── postcss.config.mjs           # PostCSS configuration
├── eslint.config.mjs            # ESLint rules
├── package.json                 # Dependencies and scripts
└── .gitignore                   # Git exclusions
```

---

## Data Flow Architecture

### Current State (Iteration 1)
*Basic setup complete, no data flow yet*

### Planned Data Flow (Future Iterations)

```
User Interaction (UI Component)
    ↓
Event Handler (component)
    ↓
Zustand Action (store/slices/*)
    ↓
State Update (validated with Zod schema)
    ↓
React Re-render (automatic)
    ↓
UI Update (reflects new state)
```

**Example Flow: Creating a Character**
1. User fills form in `CharacterForm.tsx`
2. Clicks "Add Character" button
3. Form calls `addCharacter()` action from Zustand store
4. Action validates data using `CharacterSchema` (Zod)
5. If valid, adds character to `characters[]` array in store
6. React detects state change, re-renders `CharacterList.tsx`
7. New character appears in UI

---

## Key Architectural Decisions

### Why Zustand over Redux?
- Simpler API (less boilerplate)
- No providers needed (just hooks)
- Better TypeScript support out of the box
- Sufficient for this app's complexity

### Why Zod for Validation?
- Type inference (schemas generate TypeScript types)
- Runtime validation (catch errors before they break the app)
- Composable schemas (reuse and extend)
- Great error messages

### Why Jest + Testing Library?
- Industry standard for React testing
- Focus on testing user behavior, not implementation
- Good Next.js integration
- Part of learning goals

### File-based Routing (Next.js App Router)
- Simpler than defining routes manually
- Server components by default (performance)
- Built-in layouts and metadata handling

---

## Component Architecture (Planned)

### Component Hierarchy
```
App (layout.tsx)
└── Page (page.tsx)
    ├── Navigation Tabs
    ├── Dashboard Tab
    │   └── StatCards
    ├── Characters Tab
    │   ├── CharacterForm
    │   └── CharacterList
    │       └── CharacterCard[]
    ├── Combat Tab
    │   ├── CombatTracker
    │   │   └── CombatantCard[]
    │   └── InitiativeRoller
    └── Monsters Tab
        └── MonsterLibrary
            └── MonsterCard[]
```

### Component Patterns
- **Presentational components** - UI only, receive props
- **Container components** - Connect to Zustand store
- **Custom hooks** - Reusable logic (e.g., `useCharacters()`)

---

## State Management Architecture (Planned)

### Store Structure
```typescript
// lib/store/gameStore.ts
{
  // Character slice
  characters: Character[],
  addCharacter: (character) => void,
  updateCharacter: (id, updates) => void,
  deleteCharacter: (id) => void,

  // Combat slice
  combatants: Combatant[],
  activeTurn: number,
  roundNumber: number,

  // Monster slice
  monsters: Monster[],

  // Settings slice
  darkMode: boolean,
  autosave: boolean,
}
```

### State Persistence (Future)
- LocalStorage integration (Iteration 4)
- Auto-save on state changes
- Load on app initialization

---

## Testing Strategy

### Test Types
1. **Unit Tests** - Individual functions (lib/*)
2. **Component Tests** - React components with user interactions
3. **Integration Tests** - Multiple components working together
4. **Schema Tests** - Zod validation (valid/invalid data)

### Coverage Goals
- **100%** on schemas and validation
- **80%+** on business logic (lib/*)
- **70%+** on components (critical paths)

### Testing Pattern (see PATTERNS.md for examples)
- Arrange: Set up test data
- Act: Perform action (click, type, etc.)
- Assert: Verify result

---

## Build & Deployment

### Development
```bash
npm run dev          # Start dev server (localhost:3000)
npm test             # Run Jest tests
npm test:watch       # Run tests in watch mode
npm run lint         # Run ESLint
```

### Production
```bash
npm run build        # Build for production
npm start            # Start production server
```

### Deployment
- Push to GitHub `main` branch
- Vercel auto-deploys
- Live URL: https://dnd-game-tracker-loop.vercel.app (when deployed)

---

## Current Implementation Status

### ✅ Completed

**Iteration 2: Character Management & Conditions System**
- Character Zustand store slice (CRUD operations, HP tracking, conditions)
- Character management UI (CharacterForm, CharacterCard, CharacterList)
- HP tracking with visual feedback (±1, ±5 buttons, direct input, color-coded bar)
- Avatar system (DiceBear integration + custom uploads)
- Conditions system (ConditionBadge, ConditionToggle, ConditionsModal)
- Reusable ConfirmDialog component
- Navigation bar in layout
- Character management page at /characters
- 30 component tests (274 total tests passing)

**Iteration 1: Foundation & Data Models**
- Complete testing infrastructure (Jest, React Testing Library)
- Zustand state management configured
- Zod validation configured
- All data model schemas (Character, Monster, Condition, Combatant)
- Mock data factory
- Generic validation helpers
- 244 schema and unit tests

### 🔄 In Progress

**Iteration 3: Dashboard & Combat Tracker (PLANNING PHASE)**
- Function 5: Dashboard & Statistics (5 tasks)
- Function 6: Combat Tracker - Basic (10 tasks)
- Created TASKS-ITERATION-3.md with detailed task breakdown
- Planning phase complete, ready to begin execution

### ⏳ Planned Components (Iteration 3)

**New Folders/Files to Create:**
```
app/dashboard/page.tsx           # Dashboard page route
app/combat/page.tsx              # Combat tracker page route

components/dashboard/
  ├── StatCard.tsx               # Reusable stat display card
  └── Dashboard.tsx              # Main dashboard component

components/combat/
  ├── CombatantCard.tsx          # Individual combatant in combat
  ├── CombatTracker.tsx          # Combat encounter manager
  └── AddToCombatModal.tsx       # Modal to add characters/monsters

lib/utils/stats.ts               # Team statistics calculations
lib/store/slices/combatSlice.ts  # Combat state management

__tests__/utils/stats.test.ts    # Stats utilities tests
__tests__/components/dashboard/  # Dashboard component tests
__tests__/components/combat/     # Combat component tests
__tests__/store/slices/combatSlice.test.ts  # Combat store tests
```

**Planned Data Flow (Iteration 3):**
- Dashboard reads character data → calculates stats → displays in StatCards
- Combat page allows adding characters/monsters → creates combatants → manages turn order → tracks HP changes
- Combat slice manages: combatants list, active turn, round counter
- Turn advancement: next button → skip defeated → cycle back to first → increment round

### ⏳ Future Iterations
**Iteration 4:** Monster Library & LocalStorage Persistence
**Iteration 5:** True Initiative System & Dice Rolling
**Iteration 6:** UI/UX Enhancements & Combat Features

---

## Update History

**2026-01-20 (Iteration 3 Planning)** - Dashboard & Combat Tracker Planning Complete
- Created TASKS-ITERATION-3.md with 15 detailed tasks
- Updated PROGRESS.md to reflect Iteration 3 planning phase
- Updated ARCHITECTURE.md with planned folder structure for Iteration 3
- Planning: 5 dashboard tasks + 10 combat tracker tasks
- Ready to begin execution phase

**2026-01-20 (Iteration 2)** - Character Management & Conditions System Complete
- Created character Zustand store slice with CRUD operations
- Built complete character management UI (form, card, list)
- Implemented HP tracking with visual feedback
- Added avatar system (DiceBear + custom uploads)
- Built conditions system (badges, toggles, modal)
- Created /characters page with navigation
- Added reusable ConfirmDialog component
- Wrote 30 component tests (274 total passing)

**2026-01-20 (Iteration 1)** - Foundation & Data Models Complete
- Set up testing infrastructure (Jest, React Testing Library)
- Configured Zustand state management
- Configured Zod validation
- Created all data model schemas
- Created mock data factory and validation helpers
- Wrote 244 schema and unit tests

---

**Note:** This file should be updated whenever:
- New folders/major components are added
- Architectural patterns change
- Data flow is modified
- New technologies are integrated
