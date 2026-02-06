/**
 * Game Store - Zustand State Management
 *
 * Central store for D&D Game Tracker application state.
 * Uses Zustand for lightweight, hook-based state management.
 *
 * Architecture:
 * - Store is composed of multiple "slices" (character, combat, monster, etc.)
 * - Each slice manages its own domain of state and actions
 * - TypeScript provides full type safety
 *
 * @see DECISIONS.md - ADR-001: Why Zustand over Redux
 * @see PATTERNS.md - Zustand store patterns
 */

import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { CharacterSlice, createCharacterSlice } from './slices/characterSlice'
import { CombatSlice, createCombatSlice } from './slices/combatSlice'
import { MonsterSlice, createMonsterSlice } from './slices/monsterSlice'
import { migrateState, CURRENT_VERSION } from '@/lib/storage/migrations'

/**
 * Game Store State Interface
 *
 * Composed of multiple slice interfaces.
 *
 * Current slices:
 * - CharacterSlice (Iteration 2) ✅
 * - CombatSlice (Iteration 3) ✅
 *
 * Future slices:
 * - MonsterSlice (Iteration 4)
 * - SettingsSlice (Iteration 6)
 */
export interface GameStore extends CharacterSlice, CombatSlice, MonsterSlice {
  /**
   * Version of the store schema
   * Useful for data migrations if store structure changes
   */
  version: number
}

/**
 * Storage key for persisted state
 * Version-prefixed to enable future migrations
 */
const STORAGE_KEY = 'dnd-game-tracker-v2'

/**
 * Create the game store
 *
 * Uses Zustand with persist and devtools middleware:
 * - persist: Automatically saves state to localStorage
 * - devtools: Enables Redux DevTools debugging
 *
 * Persistence Strategy:
 * - Persists: characters, combatants, combat state, round counter
 * - Does NOT persist: temporary UI state (modals, loading states)
 * - Version number enables future state migrations
 *
 * @example
 * ```tsx
 * // In a component:
 * import { useGameStore } from '@/lib/store/gameStore'
 *
 * function MyComponent() {
 *   const characters = useGameStore((state) => state.characters)
 *   const addCharacter = useGameStore((state) => state.addCharacter)
 *   // ...
 * }
 * ```
 */
export const useGameStore = create<GameStore>()(
  devtools(
    persist(
      (...a) => ({
        // Store version (use CURRENT_VERSION from migrations)
        version: CURRENT_VERSION,

        // Character slice
        ...createCharacterSlice(...a),

        // Combat slice
        ...createCombatSlice(...a),

        // Monster slice (custom monsters)
        ...createMonsterSlice(...a),
      }),
      {
        // Persistence configuration
        name: STORAGE_KEY,

        // Specify which parts of state to persist
        // We persist characters and combat state, but not temporary UI state
        partialize: (state) => ({
          version: state.version,
          characters: state.characters,
          combatants: state.combatants,
          round: state.round,
          isInCombat: state.isInCombat,
          customMonsters: state.customMonsters,
        }),

        // Migration function
        // Called when loading state from localStorage
        // Transforms old versions to current schema
        migrate: (persistedState: any, version: number) => {
          // Use our migration system to handle version upgrades
          const migrated = migrateState(persistedState)
          return migrated.state
        },

        // Version number for Zustand persist
        // This triggers migrate() when version changes
        version: CURRENT_VERSION,
      }
    ),
    {
      // DevTools configuration
      name: 'GameStore', // Name shown in Redux DevTools
    }
  )
)

/**
 * Store Architecture Notes:
 *
 * 1. IMMUTABILITY
 *    - Always use spread operators or .map/.filter for updates
 *    - Never mutate state directly (state.x = y is wrong)
 *    - Zustand uses immer-like syntax but we'll use explicit spreads
 *
 * 2. SLICES
 *    - Each domain (characters, combat, etc.) gets its own slice file
 *    - Slices are combined in this main gameStore file
 *    - Keeps code organized and testable
 *
 * 3. SELECTORS
 *    - Access state with selector functions: useGameStore(state => state.characters)
 *    - This allows React to optimize re-renders (only re-render when selected data changes)
 *
 * 4. PERSISTENCE (Iteration 4)
 *    - State automatically persisted to localStorage via persist middleware
 *    - Storage key: 'dnd-game-tracker-v2'
 *    - Persisted: characters, combat state, round counter, version
 *    - NOT persisted: temporary UI state, loading states, modal open/close
 *    - Version field enables future data migrations
 *
 * 5. DEVTOOLS
 *    - Redux DevTools extension works with Zustand via middleware
 *    - Enables time-travel debugging, action inspection
 *
 * 6. TESTING
 *    - Store can be tested independently of components
 *    - Mock the store for component tests
 *    - Test actions and state updates in isolation
 *    - Persist middleware can be tested separately for save/load behavior
 */
