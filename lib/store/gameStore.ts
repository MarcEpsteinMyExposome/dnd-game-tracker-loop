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
import { devtools } from 'zustand/middleware'

/**
 * Game Store State Interface
 *
 * This will be composed of multiple slice interfaces as we build them.
 * For now, it's a placeholder with basic structure.
 *
 * Future slices:
 * - CharacterSlice (Iteration 2)
 * - CombatSlice (Iteration 3)
 * - MonsterSlice (Iteration 4)
 * - SettingsSlice (Iteration 6)
 */
export interface GameStore {
  // Placeholder: Will add slice properties here
  // Example structure:
  // characters: Character[]
  // addCharacter: (character: Character) => void
  // updateCharacter: (id: string, updates: Partial<Character>) => void
  // deleteCharacter: (id: string) => void

  /**
   * Version of the store schema
   * Useful for data migrations if store structure changes
   */
  version: number
}

/**
 * Create the game store
 *
 * Uses Zustand's create function with devtools middleware for debugging.
 * The store is empty for now - slices will be added in subsequent tasks.
 *
 * @example
 * ```tsx
 * // In a component (future):
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
    (set) => ({
      // Initial state
      version: 1,

      // Actions will be added here as we build slices
      // Example pattern:
      // addCharacter: (character) => set((state) => ({
      //   characters: [...state.characters, character]
      // })),
    }),
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
 * 4. DEVTOOLS
 *    - Redux DevTools extension works with Zustand via middleware
 *    - Enables time-travel debugging, action inspection
 *
 * 5. TESTING
 *    - Store can be tested independently of components
 *    - Mock the store for component tests
 *    - Test actions and state updates in isolation
 */
