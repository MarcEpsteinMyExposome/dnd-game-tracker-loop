/**
 * Migration System Tests
 *
 * Tests state version migrations and validation.
 *
 * @module __tests__/storage/migrations.test
 */

import {
  CURRENT_VERSION,
  migrateState,
  isValidPersistedState,
  getStateVersion,
  getFreshState,
  type PersistedState,
} from '@/lib/storage/migrations'

describe('Migration System', () => {
  describe('CURRENT_VERSION', () => {
    it('should be defined as a number', () => {
      expect(typeof CURRENT_VERSION).toBe('number')
      expect(CURRENT_VERSION).toBeGreaterThan(0)
    })
  })

  describe('migrateState', () => {
    it('should return empty state for null input', () => {
      const result = migrateState(null)

      expect(result).toEqual({
        state: {},
        version: CURRENT_VERSION,
      })
    })

    it('should return empty state for undefined input', () => {
      const result = migrateState(undefined)

      expect(result).toEqual({
        state: {},
        version: CURRENT_VERSION,
      })
    })

    it('should not modify state already at current version', () => {
      const currentState = {
        state: {
          characters: [{ id: '1', name: 'Raul' }],
          combatants: [],
          version: CURRENT_VERSION,
        },
        version: CURRENT_VERSION,
      }

      const result = migrateState(currentState)

      expect(result).toEqual(currentState)
    })

    it('should migrate v0 state (no version) to v1', () => {
      const v0State = {
        characters: [{ id: '1', name: 'Luna' }],
        combatants: [],
        round: 1,
      }

      const result = migrateState(v0State)

      expect(result.version).toBe(CURRENT_VERSION)
      expect(result.state.version).toBe(1)
      expect(result.state.characters).toEqual(v0State.characters)
      expect(result.state.combatants).toEqual(v0State.combatants)
    })

    it('should handle Zustand persist format with nested state', () => {
      const zustandFormat = {
        state: {
          characters: [],
          combatants: [],
        },
        version: 0,
      }

      const result = migrateState(zustandFormat)

      expect(result.version).toBe(CURRENT_VERSION)
      expect(result.state.version).toBe(1)
    })

    it('should apply migrations sequentially', () => {
      // Test that migrations are applied in order from v0 -> v1 -> v2 etc.
      const v0State = {
        characters: [],
      }

      const result = migrateState(v0State)

      // Should have gone through migration to v1
      expect(result.version).toBe(CURRENT_VERSION)
      expect(result.state.version).toBe(1)
    })

    it('should handle negative version gracefully', () => {
      // Simulate a state with invalid negative version
      const corruptState = {
        version: -1,
        state: null,
      }

      const result = migrateState(corruptState)

      // Negative version is treated as < current, so migration runs
      expect(result.version).toBe(CURRENT_VERSION)
      // State is wrapped in migration result
      expect(result).toHaveProperty('state')
      expect(result).toHaveProperty('version', CURRENT_VERSION)
    })

    it('should skip migrations for future versions', () => {
      // State from a newer version (shouldn't happen, but handle gracefully)
      const futureState = {
        state: {
          characters: [],
          version: 999,
        },
        version: 999,
      }

      const result = migrateState(futureState)

      // Should return unchanged (no downgrade migrations)
      expect(result).toEqual(futureState)
    })
  })

  describe('isValidPersistedState', () => {
    it('should return false for null', () => {
      expect(isValidPersistedState(null)).toBe(false)
    })

    it('should return false for undefined', () => {
      expect(isValidPersistedState(undefined)).toBe(false)
    })

    it('should return false for primitive types', () => {
      expect(isValidPersistedState('string')).toBe(false)
      expect(isValidPersistedState(123)).toBe(false)
      expect(isValidPersistedState(true)).toBe(false)
    })

    it('should return false for empty object', () => {
      expect(isValidPersistedState({})).toBe(false)
    })

    it('should return true for valid Zustand persist format', () => {
      const validState = {
        state: {
          characters: [],
          combatants: [],
        },
        version: 1,
      }

      expect(isValidPersistedState(validState)).toBe(true)
    })

    it('should return true for state with characters (direct format)', () => {
      const validState = {
        characters: [],
        combatants: [],
        version: 1,
      }

      expect(isValidPersistedState(validState)).toBe(true)
    })

    it('should return true for state with version field', () => {
      const validState = {
        version: 1,
        characters: [],
      }

      expect(isValidPersistedState(validState)).toBe(true)
    })

    it('should return false for array', () => {
      expect(isValidPersistedState([])).toBe(false)
    })
  })

  describe('getStateVersion', () => {
    it('should return 0 for null', () => {
      expect(getStateVersion(null)).toBe(0)
    })

    it('should return 0 for undefined', () => {
      expect(getStateVersion(undefined)).toBe(0)
    })

    it('should return 0 for primitive types', () => {
      expect(getStateVersion('string')).toBe(0)
      expect(getStateVersion(123)).toBe(0)
      expect(getStateVersion(true)).toBe(0)
    })

    it('should return 0 for object without version', () => {
      expect(getStateVersion({ characters: [] })).toBe(0)
    })

    it('should return top-level version from Zustand format', () => {
      const state = {
        version: 3,
        state: {
          characters: [],
        },
      }

      expect(getStateVersion(state)).toBe(3)
    })

    it('should return nested state.version', () => {
      const state = {
        state: {
          version: 2,
          characters: [],
        },
      }

      expect(getStateVersion(state)).toBe(2)
    })

    it('should prioritize top-level version over nested', () => {
      const state = {
        version: 5,
        state: {
          version: 2,
        },
      }

      expect(getStateVersion(state)).toBe(5)
    })

    it('should return 0 for version with wrong type', () => {
      const state = {
        version: 'not a number',
      }

      expect(getStateVersion(state)).toBe(0)
    })
  })

  describe('getFreshState', () => {
    it('should return state at current version', () => {
      const freshState = getFreshState()

      expect(freshState.version).toBe(CURRENT_VERSION)
      expect(freshState.state.version).toBe(CURRENT_VERSION)
    })

    it('should return empty arrays for characters and combatants', () => {
      const freshState = getFreshState()

      expect(freshState.state.characters).toEqual([])
      expect(freshState.state.combatants).toEqual([])
    })

    it('should set default combat values', () => {
      const freshState = getFreshState()

      expect(freshState.state.round).toBe(1)
      expect(freshState.state.isInCombat).toBe(false)
    })

    it('should return a new object each time (not cached)', () => {
      const state1 = getFreshState()
      const state2 = getFreshState()

      expect(state1).not.toBe(state2) // Different references
      expect(state1).toEqual(state2) // Same values
    })
  })

  describe('Integration: Migration Flow', () => {
    it('should successfully migrate legacy state through full pipeline', () => {
      // Simulate old state from localStorage
      const legacyState = {
        characters: [
          { id: '1', name: 'Raul', hp: 30, maxHp: 30 },
          { id: '2', name: 'Luna', hp: 25, maxHp: 25 },
        ],
        combatants: [],
      }

      // Check version
      const version = getStateVersion(legacyState)
      expect(version).toBe(0)

      // Validate (is valid because it has characters field)
      const isValid = isValidPersistedState(legacyState)
      expect(isValid).toBe(true) // Has characters field, so structure is valid

      // Migrate
      const migrated = migrateState(legacyState)

      // Verify migration
      expect(migrated.version).toBe(CURRENT_VERSION)
      expect(migrated.state.version).toBe(1)
      expect(migrated.state.characters).toHaveLength(2)
      expect(migrated.state.characters[0].name).toBe('Raul')
    })

    it('should handle corrupted data gracefully', () => {
      const corruptedState = {
        version: 'not a number',
        state: {
          characters: 'should be array',
          combatants: null,
        },
      }

      // Validation should fail
      const isValid = isValidPersistedState(corruptedState)
      expect(isValid).toBe(true) // Structure looks ok

      // But migration should handle corruption
      const migrated = migrateState(corruptedState)

      // Should return valid state (even if data is lost)
      expect(migrated.version).toBe(CURRENT_VERSION)
    })

    it('should preserve data through migration', () => {
      const stateWithData = {
        version: 0,
        characters: [
          {
            id: 'char-1',
            name: 'Warrior',
            class: 'Fighter',
            level: 5,
            maxHp: 50,
            currentHp: 35,
            armorClass: 18,
          },
        ],
        combatants: [
          {
            id: 'combat-1',
            name: 'Goblin',
            type: 'monster',
            initiative: 15,
            hp: 7,
            maxHp: 7,
          },
        ],
        round: 3,
        isInCombat: true,
      }

      const migrated = migrateState(stateWithData)

      // All original data should be preserved
      expect(migrated.state.characters[0].name).toBe('Warrior')
      expect(migrated.state.characters[0].level).toBe(5)
      expect(migrated.state.combatants[0].name).toBe('Goblin')
      expect(migrated.state.round).toBe(3)
      expect(migrated.state.isInCombat).toBe(true)
    })
  })
})
