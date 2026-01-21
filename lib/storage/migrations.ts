/**
 * State Migration System
 *
 * Handles version migrations for persisted game state.
 * When the store schema changes between versions, migrations ensure
 * old data can be safely transformed to the new format.
 *
 * @module lib/storage/migrations
 */

import type { GameStore } from '@/lib/store/gameStore'

/**
 * Current version of the store schema
 * Increment this when making breaking changes to the store structure
 */
export const CURRENT_VERSION = 1

/**
 * Persisted state structure (as stored in localStorage)
 * This matches what Zustand persist middleware saves
 */
export interface PersistedState {
  state: Partial<GameStore>
  version: number
}

/**
 * Migration function signature
 * Takes old state and returns migrated state
 */
export type MigrationFn = (oldState: any) => any

/**
 * Registry of all migration functions
 * Key is the version TO migrate to
 *
 * Example:
 * - migrations[1] = function that migrates from v0 to v1
 * - migrations[2] = function that migrates from v1 to v2
 */
const migrations: Record<number, MigrationFn> = {
  // Migration from v0 (no version) to v1
  1: (oldState: any) => {
    // If old state has no version field, it's v0
    // v1 added version field and structured persistence
    return {
      ...oldState,
      version: 1,
    }
  },

  // Future migrations will be added here
  // Example:
  // 2: (oldState: any) => {
  //   return {
  //     ...oldState,
  //     newField: 'default value',
  //     version: 2,
  //   }
  // },
}

/**
 * Migrate persisted state to current version
 *
 * Applies all necessary migrations in sequence to bring old state
 * up to the current version.
 *
 * @param persistedState - Raw state loaded from localStorage
 * @returns Migrated state compatible with current version
 *
 * @example
 * ```typescript
 * const oldState = JSON.parse(localStorage.getItem('store-key'))
 * const migratedState = migrateState(oldState)
 * ```
 */
export function migrateState(persistedState: any): PersistedState {
  // If state is null/undefined, return empty state
  if (!persistedState) {
    return {
      state: {},
      version: CURRENT_VERSION,
    }
  }

  // Extract current version (default to 0 if not present)
  const currentVersion = persistedState.version || 0

  // If already at current version, no migration needed
  if (currentVersion >= CURRENT_VERSION) {
    return persistedState
  }

  // Apply migrations sequentially from current to target version
  let migratedState = persistedState.state || persistedState

  for (let v = currentVersion + 1; v <= CURRENT_VERSION; v++) {
    const migrationFn = migrations[v]

    if (migrationFn) {
      try {
        migratedState = migrationFn(migratedState)
      } catch (error) {
        console.error(`Migration to version ${v} failed:`, error)
        // On migration failure, return empty state to prevent corruption
        return {
          state: {},
          version: CURRENT_VERSION,
        }
      }
    }
  }

  return {
    state: migratedState,
    version: CURRENT_VERSION,
  }
}

/**
 * Validate persisted state structure
 *
 * Checks if the loaded state has the expected structure.
 * Used to detect corrupted or invalid localStorage data.
 *
 * @param persistedState - State loaded from localStorage
 * @returns True if state is valid, false otherwise
 *
 * @example
 * ```typescript
 * const stored = JSON.parse(localStorage.getItem('key'))
 * if (isValidPersistedState(stored)) {
 *   // Safe to use
 * } else {
 *   // Corrupted, use default state
 * }
 * ```
 */
export function isValidPersistedState(persistedState: any): boolean {
  // Must be an object
  if (!persistedState || typeof persistedState !== 'object') {
    return false
  }

  // Must have either 'state' property (Zustand format) or be direct state
  if (!persistedState.state && !persistedState.version && !persistedState.characters) {
    return false
  }

  return true
}

/**
 * Get version from persisted state
 *
 * Safely extracts version number from stored state.
 *
 * @param persistedState - State loaded from localStorage
 * @returns Version number, or 0 if not present
 *
 * @example
 * ```typescript
 * const stored = JSON.parse(localStorage.getItem('key'))
 * const version = getStateVersion(stored)
 * console.log(`State is at version ${version}`)
 * ```
 */
export function getStateVersion(persistedState: any): number {
  if (!persistedState || typeof persistedState !== 'object') {
    return 0
  }

  // Check top-level version (Zustand persist format)
  if (typeof persistedState.version === 'number') {
    return persistedState.version
  }

  // Check nested state.version
  if (
    persistedState.state &&
    typeof persistedState.state.version === 'number'
  ) {
    return persistedState.state.version
  }

  // No version found, assume v0
  return 0
}

/**
 * Clear persisted state and return fresh state
 *
 * Used when migrations fail or data is corrupted beyond repair.
 *
 * @returns Fresh empty state at current version
 *
 * @example
 * ```typescript
 * try {
 *   const state = migrateState(oldState)
 * } catch (error) {
 *   // Migration failed, start fresh
 *   const state = getFreshState()
 * }
 * ```
 */
export function getFreshState(): PersistedState {
  return {
    state: {
      version: CURRENT_VERSION,
      characters: [],
      combatants: [],
      round: 1,
      isInCombat: false,
    },
    version: CURRENT_VERSION,
  }
}
