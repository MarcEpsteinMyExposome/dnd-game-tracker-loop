# Store Slices

This directory contains Zustand store slices - modular pieces of state management.

## What are Slices?

Slices are separate modules that manage a specific domain of application state. Each slice contains:
- State properties (data)
- Actions (functions to modify state)
- TypeScript types

## Slice Pattern

```typescript
// Example: characterSlice.ts
import { StateCreator } from 'zustand'
import { Character } from '@/lib/schemas/character.schema'

export interface CharacterSlice {
  // State
  characters: Character[]

  // Actions
  addCharacter: (character: Character) => void
  updateCharacter: (id: string, updates: Partial<Character>) => void
  deleteCharacter: (id: string) => void
}

export const createCharacterSlice: StateCreator<CharacterSlice> = (set) => ({
  characters: [],

  addCharacter: (character) => set((state) => ({
    characters: [...state.characters, character]
  })),

  updateCharacter: (id, updates) => set((state) => ({
    characters: state.characters.map(char =>
      char.id === id ? { ...char, ...updates } : char
    )
  })),

  deleteCharacter: (id) => set((state) => ({
    characters: state.characters.filter(char => char.id !== id)
  })),
})
```

## Planned Slices

Will be created in future iterations:

- **characterSlice.ts** (Iteration 2) - Character roster management
- **combatSlice.ts** (Iteration 3) - Combat tracker state
- **monsterSlice.ts** (Iteration 4) - Monster library
- **settingsSlice.ts** (Iteration 6) - App settings (dark mode, etc.)

## How Slices are Combined

Slices are imported and combined in the main `gameStore.ts`:

```typescript
import { create } from 'zustand'
import { createCharacterSlice, CharacterSlice } from './slices/characterSlice'
import { createCombatSlice, CombatSlice } from './slices/combatSlice'

type GameStore = CharacterSlice & CombatSlice

export const useGameStore = create<GameStore>()((...args) => ({
  ...createCharacterSlice(...args),
  ...createCombatSlice(...args),
}))
```

## Testing Slices

Each slice should have its own test file:

```
__tests__/
  lib/
    store/
      slices/
        characterSlice.test.ts
        combatSlice.test.ts
```

Test the slice actions and verify state updates:

```typescript
import { createCharacterSlice } from '@/lib/store/slices/characterSlice'

describe('CharacterSlice', () => {
  it('adds character to state', () => {
    // Test implementation
  })
})
```

## References

- See `ARCHITECTURE.md` for store architecture overview
- See `DECISIONS.md` ADR-001 for why we chose Zustand
- See `PATTERNS.md` for Zustand code patterns
