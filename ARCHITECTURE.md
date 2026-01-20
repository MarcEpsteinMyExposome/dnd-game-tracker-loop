# Architecture Overview

**Project:** dnd-game-tracker-loop v2.0
**Last Updated:** 2026-01-20 (Task 1.2 complete)
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
│   ├── layout.tsx               # Root layout (fonts, metadata)
│   ├── page.tsx                 # Home page
│   ├── globals.css              # Tailwind imports and global styles
│   └── favicon.ico              # Site icon
│
├── components/                   # React components (to be created)
│   ├── characters/              # Character management components
│   ├── combat/                  # Combat tracker components
│   ├── monsters/                # Monster library components
│   ├── dashboard/               # Dashboard/stats components
│   ├── conditions/              # Condition system components
│   └── ui/                      # Reusable UI components (buttons, cards, etc.)
│
├── lib/                         # Business logic and utilities
│   ├── schemas/                 # Zod validation schemas
│   ├── store/                   # Zustand state management
│   │   └── slices/             # Store slices (character, combat, etc.)
│   ├── validation/              # Validation helper functions
│   ├── testing/                 # Mock data factories for tests
│   ├── dice/                    # Dice rolling logic
│   └── utils/                   # General utility functions
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

### ✅ Completed (Iteration 1 in progress)
- Next.js project structure
- Jest + React Testing Library setup
- Test folder structure
- Zustand and Zod installed (not configured yet)

### 🔄 In Progress
- Creating first test example
- Setting up testing patterns

### ⏳ Planned
- Zod schemas for data models
- Zustand store setup
- Component library
- Feature implementation (6 iterations)

---

## Update History

**2026-01-20** - Initial architecture documentation created after Task 1.2
- Documented folder structure
- Explained tech stack choices
- Outlined data flow architecture
- Defined testing strategy

---

**Note:** This file should be updated whenever:
- New folders/major components are added
- Architectural patterns change
- Data flow is modified
- New technologies are integrated
