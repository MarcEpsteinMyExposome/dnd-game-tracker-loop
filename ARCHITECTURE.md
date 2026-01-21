# Architecture Overview

**Project:** dnd-game-tracker-loop v2.0
**Last Updated:** 2026-01-21 (Iteration 4 COMPLETE)
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
│   ├── layout.tsx               # Root layout with navigation + PersistenceProvider
│   ├── page.tsx                 # Home page (iteration status)
│   ├── characters/              # Character management route
│   │   └── page.tsx             # /characters page
│   ├── dashboard/               # Dashboard route (Iteration 3) ✅
│   │   └── page.tsx             # /dashboard page
│   ├── combat/                  # Combat tracker route (Iteration 3) ✅
│   │   └── page.tsx             # /combat page
│   ├── monsters/                # Monster library route (Iteration 4) ✅
│   │   └── page.tsx             # /monsters page
│   ├── settings/                # Settings/data management route (Iteration 4) ✅
│   │   └── page.tsx             # /settings page
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
│   │   ├── ConfirmDialog.tsx    # Confirmation modal
│   │   ├── LoadingSpinner.tsx   # Loading indicator (Iteration 4) ✅
│   │   ├── Toast.tsx            # Toast notifications (Iteration 4) ✅
│   │   └── ErrorBoundary.tsx    # Error boundary (Iteration 4) ✅
│   ├── layout/                  # Layout components (Iteration 4) ✅
│   │   └── PersistenceProvider.tsx  # Handles localStorage hydration
│   ├── dashboard/               # Dashboard components (Iteration 3) ✅
│   │   ├── StatCard.tsx
│   │   └── Dashboard.tsx
│   ├── combat/                  # Combat tracker (Iteration 3) ✅
│   │   ├── CombatantCard.tsx
│   │   ├── CombatTracker.tsx
│   │   ├── AddToCombatModal.tsx
│   │   └── AddMonstersModal.tsx # (Iteration 4) ✅
│   └── monsters/                # Monster library (Iteration 4) ✅
│       ├── MonsterCard.tsx
│       └── MonsterLibrary.tsx
│
├── lib/                         # Business logic and utilities
│   ├── schemas/                 # Zod validation schemas ✅
│   │   ├── character.schema.ts
│   │   ├── monster.schema.ts
│   │   ├── condition.schema.ts
│   │   ├── combatant.schema.ts
│   │   └── index.ts             # Barrel export
│   ├── store/                   # Zustand state management ✅
│   │   ├── gameStore.ts         # Main store with persist middleware
│   │   └── slices/              # Store slices
│   │       ├── characterSlice.ts  # (Iteration 2) ✅
│   │       └── combatSlice.ts     # (Iteration 3) ✅
│   ├── storage/                 # LocalStorage persistence (Iteration 4) ✅
│   │   ├── localStorage.ts      # Low-level localStorage utilities
│   │   ├── migrations.ts        # State version migration system
│   │   └── exportImport.ts      # Export/Import JSON functionality
│   ├── data/                    # Static data (Iteration 4) ✅
│   │   ├── monsters.ts          # 15 pre-defined monster stat blocks
│   │   └── encounters.ts        # 5 pre-built Quick Encounters
│   ├── validation/              # Validation helpers ✅
│   │   └── helpers.ts
│   ├── testing/                 # Mock data factories ✅
│   │   └── mockData.ts
│   ├── utils/                   # General utilities ✅
│   │   ├── avatar.ts            # (Iteration 2)
│   │   └── stats.ts             # (Iteration 3)
│   └── dice/                    # Dice rolling (Iteration 5)
│       └── (future)
│
├── __tests__/                   # Test files (mirrors lib/ and components/)
│   ├── app/                     # Page tests
│   │   └── monsters/            # Monster page tests ✅
│   ├── components/              # Component tests
│   │   ├── characters/          # ✅
│   │   ├── conditions/          # ✅
│   │   ├── dashboard/           # ✅
│   │   ├── combat/              # ✅
│   │   ├── monsters/            # ✅
│   │   └── ui/                  # ✅
│   ├── data/                    # Data file tests ✅
│   │   ├── monsters.test.ts
│   │   └── encounters.test.ts
│   ├── storage/                 # Persistence tests ✅
│   │   ├── localStorage.test.ts
│   │   ├── migrations.test.ts
│   │   ├── exportImport.test.ts
│   │   └── integration.test.ts
│   ├── store/                   # Store tests ✅
│   ├── schemas/                 # Schema validation tests ✅
│   └── utils/                   # Utility function tests ✅
│
├── public/                      # Static assets (images, fonts)
│
├── DEFINE.md                    # Project goals and requirements
├── FUNCTIONS.md                 # Feature breakdown (12 functions)
├── TASKS.md                     # Current iteration task list
├── TASKS-ITERATION-3.md         # Iteration 3 tasks ✅
├── TASKS-ITERATION-4.md         # Iteration 4 tasks ✅
├── PROGRESS.md                  # Current state and next actions
├── COMPLETED.md                 # Historical iteration record
├── RETROSPECTIVE.md             # Lessons learned
├── BUGS.md                      # Bug tracking
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

**Iteration 4: Data Persistence & Monster Library (COMPLETE)**
- LocalStorage persistence with Zustand persist middleware
- State version migration system (v0 → v1)
- Export/Import JSON functionality
- Settings page at /settings with data management UI
- Loading states (LoadingSpinner, Toast, ErrorBoundary)
- PersistenceProvider wraps entire app for hydration
- Monster library with 15 pre-defined monsters
- MonsterCard component with red/orange theme
- MonsterLibrary with filtering, search, and sort
- AddMonstersModal for adding monsters from combat page
- Quick Encounter system with 5 pre-built encounters
- 370 new tests (805 total passing)

**Iteration 3: Dashboard & Combat Tracker (COMPLETE)**
- Dashboard page at /dashboard with team statistics
- StatCard component with 5 color variants
- Stats utilities (calculateTeamSize, calculateAverageHp, etc.)
- Combat Tracker at /combat with initiative-based ordering
- Combat Zustand store slice (combatants, turn management, round counter)
- CombatantCard with HP tracking and active turn indicator
- AddToCombatModal for adding characters to combat
- Turn advancement with auto-skip defeated combatants
- 161 tests (435 total passing)

**Iteration 2: Character Management & Conditions System (COMPLETE)**
- Character Zustand store slice (CRUD operations, HP tracking, conditions)
- Character management UI (CharacterForm, CharacterCard, CharacterList)
- HP tracking with visual feedback (±1, ±5 buttons, direct input, color-coded bar)
- Avatar system (DiceBear integration + custom uploads)
- Conditions system (ConditionBadge, ConditionToggle, ConditionsModal)
- Reusable ConfirmDialog component
- Navigation bar in layout
- Character management page at /characters
- 30 component tests (274 total tests passing)

**Iteration 1: Foundation & Data Models (COMPLETE)**
- Complete testing infrastructure (Jest, React Testing Library)
- Zustand state management configured
- Zod validation configured
- All data model schemas (Character, Monster, Condition, Combatant)
- Mock data factory
- Generic validation helpers
- 244 schema and unit tests

### ⏳ Future Iterations
**Iteration 5:** Enhanced Combat - Initiative System & Dice Rolling (NEXT)
**Iteration 6:** UI/UX Enhancements & Advanced Combat Features

---

## Update History

**2026-01-21 (Iteration 4 Complete)** - Data Persistence & Monster Library Complete
- Added lib/storage/ with localStorage utilities, migrations, export/import
- Added lib/data/ with monsters.ts (15 monsters) and encounters.ts (5 encounters)
- Created components/monsters/ with MonsterCard and MonsterLibrary
- Created components/ui/ additions: LoadingSpinner, Toast, ErrorBoundary
- Created components/layout/PersistenceProvider.tsx
- Added app/monsters/page.tsx and app/settings/page.tsx routes
- Zustand persist middleware integrated into gameStore
- Quick Encounter feature for one-click combat setup
- 370 new tests (805 total passing)

**2026-01-21 (Iteration 3 Complete)** - Dashboard & Combat Tracker Complete
- Created app/dashboard/page.tsx and app/combat/page.tsx routes
- Added components/dashboard/ with StatCard and Dashboard
- Added components/combat/ with CombatantCard, CombatTracker, AddToCombatModal
- Created lib/utils/stats.ts and lib/store/slices/combatSlice.ts
- Turn management with auto-skip defeated, round counter
- 161 new tests (435 total passing)

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
