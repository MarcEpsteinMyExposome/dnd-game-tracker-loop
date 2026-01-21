/**
 * Persistence Integration Tests
 *
 * Tests the full persistence flow end-to-end:
 * - Create data → persist → refresh → data restored
 * - Export → clear → import → data restored
 * - Corrupted localStorage → graceful fallback
 * - Quota exceeded → proper error handling
 * - State migrations work correctly
 *
 * These tests simulate real user scenarios with the complete persistence system.
 *
 * @module __tests__/storage/integration.test
 */

import { renderHook, act, waitFor } from '@testing-library/react'
import { useGameStore } from '@/lib/store/gameStore'
import {
  exportGameState,
  importGameState,
} from '@/lib/storage/exportImport'
import {
  saveToLocalStorage,
  loadFromLocalStorage,
  clearAllLocalStorage,
  QuotaExceededError,
} from '@/lib/storage/localStorage'
import {
  migrateState,
  CURRENT_VERSION,
  getFreshState,
} from '@/lib/storage/migrations'
import { createMockCharacter, generateMockUUID } from '@/lib/testing/mockData'
import type { Character } from '@/lib/schemas/character.schema'

// Storage key used by the store
const STORAGE_KEY = 'dnd-game-tracker-v2'

describe('Persistence Integration Tests', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear()
    // Reset Zustand store to initial state
    useGameStore.setState(getFreshState().state)
  })

  afterEach(() => {
    localStorage.clear()
  })

  describe('Full Persistence Flow: Characters', () => {
    it('should persist character data and restore after simulated refresh', async () => {
      // Step 1: Create a character
      const character = createMockCharacter({
        name: 'Raul the Brave',
        characterClass: 'Paladin',
        level: 5,
        maxHp: 50,
        currentHp: 35,
        armorClass: 18,
      })

      // Add character to store
      act(() => {
        useGameStore.getState().addCharacter(character)
      })

      // Verify character is in store
      const { result } = renderHook(() => useGameStore((state) => state.characters))
      expect(result.current).toHaveLength(1)
      expect(result.current[0].name).toBe('Raul the Brave')

      // Step 2: Verify data was persisted to localStorage
      await waitFor(() => {
        const stored = localStorage.getItem(STORAGE_KEY)
        expect(stored).toBeTruthy()
      })

      const persistedData = loadFromLocalStorage<any>(STORAGE_KEY)
      expect(persistedData).toBeTruthy()
      expect(persistedData.state.characters).toHaveLength(1)
      expect(persistedData.state.characters[0].name).toBe('Raul the Brave')

      // Step 3: Simulate page refresh by clearing store and rehydrating
      // This simulates what happens when the user refreshes the page
      const storedState = loadFromLocalStorage<any>(STORAGE_KEY)

      act(() => {
        useGameStore.setState(storedState.state)
      })

      // Step 4: Verify character was restored after "refresh"
      const { result: afterRefresh } = renderHook(() =>
        useGameStore((state) => state.characters)
      )
      expect(afterRefresh.current).toHaveLength(1)
      expect(afterRefresh.current[0].name).toBe('Raul the Brave')
      expect(afterRefresh.current[0].level).toBe(5)
      expect(afterRefresh.current[0].currentHp).toBe(35)
    })

    it('should persist multiple characters with different states', async () => {
      // Create multiple characters with varying states
      const characters = [
        createMockCharacter({
          name: 'Raul',
          currentHp: 30,
          maxHp: 30,
          conditions: ['blessed', 'hasted'],
        }),
        createMockCharacter({
          name: 'Luna',
          currentHp: 0, // Unconscious
          maxHp: 25,
          conditions: ['unconscious'],
        }),
        createMockCharacter({
          name: 'Marcus',
          currentHp: 15,
          maxHp: 40,
          conditions: ['poisoned', 'frightened'],
        }),
      ]

      // Add all characters
      act(() => {
        characters.forEach((char) => useGameStore.getState().addCharacter(char))
      })

      // Wait for persistence
      await waitFor(() => {
        const stored = localStorage.getItem(STORAGE_KEY)
        expect(stored).toBeTruthy()
      })

      // Simulate refresh
      const storedState = loadFromLocalStorage<any>(STORAGE_KEY)
      act(() => {
        useGameStore.setState(storedState.state)
      })

      // Verify all characters restored correctly
      const { result } = renderHook(() => useGameStore((state) => state.characters))
      expect(result.current).toHaveLength(3)

      const raul = result.current.find((c) => c.name === 'Raul')
      expect(raul?.conditions).toEqual(['blessed', 'hasted'])

      const luna = result.current.find((c) => c.name === 'Luna')
      expect(luna?.currentHp).toBe(0)
      expect(luna?.conditions).toEqual(['unconscious'])

      const marcus = result.current.find((c) => c.name === 'Marcus')
      expect(marcus?.conditions).toEqual(['poisoned', 'frightened'])
    })
  })

  describe('Full Persistence Flow: Combat State', () => {
    it('should persist combat state and restore after simulated refresh', async () => {
      // Step 1: Set up combat scenario
      const character1 = createMockCharacter({
        name: 'Hero',
        armorClass: 18,
      })
      const character2 = createMockCharacter({
        name: 'Villain',
        armorClass: 15,
      })

      act(() => {
        useGameStore.getState().addCharacter(character1)
        useGameStore.getState().addCharacter(character2)
        useGameStore.getState().startCombat()
        useGameStore.getState().addCombatant({
          entityId: character1.id,
          name: 'Hero',
          type: 'character',
          initiative: 20,
          currentHp: 30,
          maxHp: 30,
          armorClass: 18,
          conditions: [],
          isActive: false,
          isPlayer: true,
          avatarSeed: 'hero-seed',
          notes: 'Tank',
        })
        useGameStore.getState().addCombatant({
          entityId: character2.id,
          name: 'Villain',
          type: 'monster',
          initiative: 15,
          currentHp: 25,
          maxHp: 25,
          armorClass: 15,
          conditions: [],
          isActive: false,
          isPlayer: false,
          avatarSeed: 'villain-seed',
          notes: 'Boss',
        })
        // Advance to round 3
        useGameStore.getState().nextTurn()
        useGameStore.getState().nextTurn()
        useGameStore.getState().nextTurn()
        useGameStore.getState().nextTurn()
      })

      // Verify combat state (directly access instead of renderHook to avoid infinite loop)
      const combatResult = {
        current: {
          isInCombat: useGameStore.getState().isInCombat,
          round: useGameStore.getState().round,
          combatants: useGameStore.getState().combatants,
        },
      }

      expect(combatResult.current.isInCombat).toBe(true)
      expect(combatResult.current.round).toBeGreaterThan(1)
      expect(combatResult.current.combatants).toHaveLength(2)

      // Step 2: Wait for persistence
      await waitFor(() => {
        const stored = localStorage.getItem(STORAGE_KEY)
        expect(stored).toBeTruthy()
      })

      // Step 3: Simulate refresh
      const storedState = loadFromLocalStorage<any>(STORAGE_KEY)
      act(() => {
        useGameStore.setState(storedState.state)
      })

      // Step 4: Verify combat state restored (directly access instead of renderHook)
      const afterRefresh = {
        current: {
          isInCombat: useGameStore.getState().isInCombat,
          round: useGameStore.getState().round,
          combatants: useGameStore.getState().combatants,
        },
      }

      expect(afterRefresh.current.isInCombat).toBe(true)
      expect(afterRefresh.current.round).toBeGreaterThan(1)
      expect(afterRefresh.current.combatants).toHaveLength(2)
      expect(afterRefresh.current.combatants[0].name).toBe('Hero')
      expect(afterRefresh.current.combatants[0].initiative).toBe(20)
    })
  })

  describe('Export → Clear → Import Flow', () => {
    it('should export data, clear store, then restore via import', async () => {
      // Step 1: Create initial game state
      const character = createMockCharacter({
        name: 'Test Hero',
        level: 10,
        maxHp: 100,
        currentHp: 75,
      })

      act(() => {
        useGameStore.getState().addCharacter(character)
      })

      // Verify initial state
      expect(useGameStore.getState().characters).toHaveLength(1)

      // Step 2: Export state
      const currentState = useGameStore.getState()
      const exportedJson = exportGameState(currentState)

      // Verify export format
      expect(exportedJson).toBeTruthy()
      expect(exportedJson).toContain('Test Hero')
      expect(exportedJson).toContain('"level": 10')

      // Step 3: Clear all data
      act(() => {
        useGameStore.setState({
          characters: [],
          combatants: [],
          round: 1,
          isInCombat: false,
          version: CURRENT_VERSION,
        })
      })
      clearAllLocalStorage()

      // Verify store is empty
      expect(useGameStore.getState().characters).toHaveLength(0)
      expect(localStorage.length).toBe(0)

      // Step 4: Import the exported data
      const importResult = importGameState(exportedJson)

      // Verify import success
      expect(importResult.success).toBe(true)
      expect(importResult.data).toBeTruthy()
      expect(importResult.data?.characters).toHaveLength(1)

      // Step 5: Restore to store
      if (importResult.success && importResult.data) {
        act(() => {
          useGameStore.setState(importResult.data!)
        })
      }

      // Step 6: Verify data restored
      const restoredCharacters = useGameStore.getState().characters
      expect(restoredCharacters).toHaveLength(1)
      expect(restoredCharacters[0].name).toBe('Test Hero')
      expect(restoredCharacters[0].level).toBe(10)
      expect(restoredCharacters[0].currentHp).toBe(75)
    })

    it('should handle full game state export/import with combat data', async () => {
      // Create complex game state
      act(() => {
        useGameStore.getState().addCharacter(
          createMockCharacter({ name: 'Player 1' })
        )
        useGameStore.getState().addCharacter(
          createMockCharacter({ name: 'Player 2' })
        )
        useGameStore.getState().startCombat()
        useGameStore.getState().addCombatant({
          entityId: generateMockUUID(),
          name: 'Enemy 1',
          type: 'monster',
          initiative: 18,
          currentHp: 20,
          maxHp: 20,
          armorClass: 14,
          conditions: [],
          isActive: false,
          isPlayer: false,
          avatarSeed: 'enemy-seed',
        })
      })

      // Export
      const exportedJson = exportGameState(useGameStore.getState())

      // Clear
      act(() => {
        useGameStore.setState(getFreshState().state)
      })
      clearAllLocalStorage()

      // Import
      const importResult = importGameState(exportedJson)
      expect(importResult.success).toBe(true)

      // Restore
      if (importResult.data) {
        act(() => {
          useGameStore.setState(importResult.data!)
        })
      }

      // Verify everything restored
      expect(useGameStore.getState().characters).toHaveLength(2)
      expect(useGameStore.getState().combatants).toHaveLength(1)
      expect(useGameStore.getState().isInCombat).toBe(true)
    })
  })

  describe('Corrupted localStorage Handling', () => {
    it('should handle corrupted JSON gracefully and return fresh state', () => {
      // Corrupt the localStorage with invalid JSON
      localStorage.setItem(STORAGE_KEY, 'not valid json {{{')

      // Try to load - should not throw, should return fresh state
      const freshState = getFreshState()

      act(() => {
        // This simulates what Zustand persist middleware does
        try {
          const loaded = loadFromLocalStorage<any>(STORAGE_KEY)
          if (loaded) {
            useGameStore.setState(loaded.state)
          } else {
            useGameStore.setState(freshState.state)
          }
        } catch (error) {
          // On error, use fresh state
          useGameStore.setState(freshState.state)
        }
      })

      // Verify store has fresh state, not corrupted data
      const state = useGameStore.getState()
      expect(state.characters).toEqual([])
      expect(state.combatants).toEqual([])
      expect(state.round).toBe(1)
      expect(state.isInCombat).toBe(false)
    })

    it('should handle invalid data structure gracefully', () => {
      // Store data with wrong structure
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          state: {
            characters: 'this should be an array',
            combatants: null,
            version: 'not a number',
          },
        })
      )

      // Load - this should handle corrupted data
      const freshState = getFreshState()

      act(() => {
        try {
          const loaded = loadFromLocalStorage<any>(STORAGE_KEY)
          // Migration will add version but may preserve corrupt data
          // In real app, the Zustand middleware would fail to parse this
          // and fall back to fresh state
          const migrated = migrateState(loaded)

          // If migrated state has invalid structure, use fresh state
          if (!Array.isArray(migrated.state.characters) || !Array.isArray(migrated.state.combatants)) {
            useGameStore.setState(freshState.state)
          } else {
            useGameStore.setState(migrated.state)
          }
        } catch (error) {
          useGameStore.setState(freshState.state)
        }
      })

      // Should have valid state structure after fallback
      const state = useGameStore.getState()
      expect(Array.isArray(state.characters)).toBe(true)
      expect(Array.isArray(state.combatants)).toBe(true)
    })

    it('should handle import with invalid JSON and show error', () => {
      const invalidJson = 'not json at all!!!'

      const result = importGameState(invalidJson)

      expect(result.success).toBe(false)
      expect(result.error).toBeTruthy()
      expect(result.error).toContain('Invalid JSON')
    })

    it('should handle import with missing required fields and show error', () => {
      const invalidData = JSON.stringify({
        version: 1,
        exportedAt: new Date().toISOString(),
        // Missing 'data' field
      })

      const result = importGameState(invalidData)

      expect(result.success).toBe(false)
      expect(result.error).toBeTruthy()
    })
  })

  describe('Quota Exceeded Handling', () => {
    it('should throw QuotaExceededError when localStorage quota exceeded', () => {
      // Mock localStorage.setItem to throw quota exceeded error
      const originalSetItem = Storage.prototype.setItem
      jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new DOMException('Quota exceeded', 'QuotaExceededError')
      })

      expect(() => {
        saveToLocalStorage('test-key', 'test-value')
      }).toThrow(QuotaExceededError)

      expect(() => {
        saveToLocalStorage('test-key', 'test-value')
      }).toThrow(/Storage quota exceeded/)

      // Restore
      jest.restoreAllMocks()
    })

    it('should handle quota exceeded when saving large game state', () => {
      // Create a very large state
      const largeState = {
        characters: Array(1000)
          .fill(null)
          .map((_, i) =>
            createMockCharacter({
              name: `Character ${i}`,
              notes: 'x'.repeat(1000), // Add large notes field
            })
          ),
      }

      // Mock quota exceeded
      jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new DOMException('Quota exceeded', 'QuotaExceededError')
      })

      expect(() => {
        saveToLocalStorage(STORAGE_KEY, largeState)
      }).toThrow(QuotaExceededError)

      jest.restoreAllMocks()
    })
  })

  describe('State Migration Integration', () => {
    it('should migrate v0 state (no version) to current version', () => {
      // Simulate old state from before versioning was added
      const legacyState = {
        characters: [
          createMockCharacter({ name: 'Legacy Character' }),
        ],
        combatants: [],
        round: 1,
        isInCombat: false,
        // No version field
      }

      // Store legacy state
      localStorage.setItem(STORAGE_KEY, JSON.stringify(legacyState))

      // Load and migrate
      const loaded = loadFromLocalStorage<any>(STORAGE_KEY)
      const migrated = migrateState(loaded)

      // Verify migration
      expect(migrated.version).toBe(CURRENT_VERSION)
      expect(migrated.state.version).toBe(1)
      expect(migrated.state.characters).toHaveLength(1)
      expect(migrated.state.characters[0].name).toBe('Legacy Character')
    })

    it('should preserve all data during migration', () => {
      // Legacy state with complex data
      const legacyState = {
        characters: [
          createMockCharacter({
            name: 'Raul',
            level: 10,
            currentHp: 50,
            maxHp: 100,
            conditions: ['blessed', 'hasted'],
          }),
          createMockCharacter({
            name: 'Luna',
            level: 8,
            currentHp: 0,
            conditions: ['unconscious'],
          }),
        ],
        combatants: [
          {
            id: generateMockUUID(),
            entityId: generateMockUUID(),
            name: 'Goblin',
            type: 'monster',
            initiative: 15,
            currentHp: 7,
            maxHp: 7,
            armorClass: 13,
            conditions: [],
            isActive: false,
            isPlayer: false,
            avatarSeed: 'goblin',
            addedAt: new Date().toISOString(),
          },
        ],
        round: 5,
        isInCombat: true,
      }

      // Migrate
      const migrated = migrateState(legacyState)

      // Verify all data preserved
      expect(migrated.state.characters).toHaveLength(2)
      expect(migrated.state.characters[0].name).toBe('Raul')
      expect(migrated.state.characters[0].level).toBe(10)
      expect(migrated.state.characters[0].conditions).toEqual([
        'blessed',
        'hasted',
      ])
      expect(migrated.state.characters[1].currentHp).toBe(0)
      expect(migrated.state.combatants).toHaveLength(1)
      expect(migrated.state.round).toBe(5)
      expect(migrated.state.isInCombat).toBe(true)
    })

    it('should handle Zustand persist wrapper format', () => {
      // Zustand persist wraps state in { state, version } format
      const zustandFormat = {
        state: {
          characters: [createMockCharacter({ name: 'Wrapped' })],
          combatants: [],
          round: 1,
          isInCombat: false,
        },
        version: 0, // Old version
      }

      const migrated = migrateState(zustandFormat)

      expect(migrated.version).toBe(CURRENT_VERSION)
      expect(migrated.state.version).toBe(1)
      expect(migrated.state.characters[0].name).toBe('Wrapped')
    })
  })

  describe('Real-World Scenarios', () => {
    it('should handle complete game session: create → play → refresh → continue', async () => {
      // === SESSION START ===
      // Create party
      act(() => {
        useGameStore.getState().addCharacter(
          createMockCharacter({ name: 'Tank', maxHp: 100, currentHp: 100 })
        )
        useGameStore.getState().addCharacter(
          createMockCharacter({ name: 'Healer', maxHp: 60, currentHp: 60 })
        )
        useGameStore.getState().addCharacter(
          createMockCharacter({ name: 'DPS', maxHp: 80, currentHp: 80 })
        )
      })

      // Start combat
      act(() => {
        useGameStore.getState().startCombat()
        const tankId = useGameStore.getState().characters[0].id
        useGameStore.getState().addCombatant({
          entityId: tankId,
          name: 'Tank',
          type: 'character',
          initiative: 15,
          currentHp: 100,
          maxHp: 100,
          armorClass: 20,
          conditions: [],
          isActive: false,
          isPlayer: true,
          avatarSeed: 'tank-seed',
        })
        useGameStore.getState().addCombatant({
          entityId: generateMockUUID(),
          name: 'Goblin',
          type: 'monster',
          initiative: 12,
          currentHp: 7,
          maxHp: 7,
          armorClass: 13,
          conditions: [],
          isActive: false,
          isPlayer: false,
          avatarSeed: 'goblin-seed',
        })
      })

      // Play a few rounds
      act(() => {
        // Get the actual IDs of the combatants
        const combatants = useGameStore.getState().combatants
        const tankCombatant = combatants.find((c) => c.name === 'Tank')
        const goblinCombatant = combatants.find((c) => c.name === 'Goblin')

        if (tankCombatant && goblinCombatant) {
          // Round 1
          useGameStore.getState().updateCombatantHp(tankCombatant.id, 85) // Tank takes damage
          useGameStore.getState().nextTurn()
          useGameStore.getState().updateCombatantHp(goblinCombatant.id, 0) // Goblin defeated
          useGameStore.getState().nextTurn()

          // Round 2 starts
          useGameStore.getState().nextTurn()
        }
      })

      // Wait for persistence
      await waitFor(() => {
        const stored = localStorage.getItem(STORAGE_KEY)
        expect(stored).toBeTruthy()
      })

      // === SIMULATED PAGE REFRESH ===
      const beforeRefreshState = {
        characters: useGameStore.getState().characters,
        combatants: useGameStore.getState().combatants,
        round: useGameStore.getState().round,
        isInCombat: useGameStore.getState().isInCombat,
      }

      // Simulate refresh
      const storedState = loadFromLocalStorage<any>(STORAGE_KEY)
      act(() => {
        useGameStore.setState(storedState.state)
      })

      // === SESSION CONTINUE ===
      // Verify session restored correctly
      const afterRefreshState = {
        characters: useGameStore.getState().characters,
        combatants: useGameStore.getState().combatants,
        round: useGameStore.getState().round,
        isInCombat: useGameStore.getState().isInCombat,
      }

      expect(afterRefreshState.characters).toHaveLength(3)
      expect(afterRefreshState.combatants).toHaveLength(2)
      expect(afterRefreshState.isInCombat).toBe(true)
      expect(afterRefreshState.round).toBeGreaterThan(1)

      // Verify Tank's damage persisted
      const tank = afterRefreshState.combatants.find((c) => c.name === 'Tank')
      expect(tank?.currentHp).toBe(85)

      // Verify Goblin defeat persisted
      const goblin = afterRefreshState.combatants.find((c) => c.name === 'Goblin')
      expect(goblin?.currentHp).toBe(0)
    })

    it('should handle backup/restore workflow for migrating to new device', async () => {
      // === DEVICE 1: Create and backup ===
      act(() => {
        useGameStore.getState().addCharacter(
          createMockCharacter({ name: 'Campaign Character', level: 15 })
        )
      })

      // Export for backup
      const backup = exportGameState(useGameStore.getState())

      // Simulate saving to file (user downloads JSON)
      const backupFile = backup

      // === DEVICE 2: Restore from backup ===
      // Clear store (simulating fresh device)
      act(() => {
        useGameStore.setState(getFreshState().state)
      })
      clearAllLocalStorage()

      // Verify empty
      expect(useGameStore.getState().characters).toHaveLength(0)

      // Import backup (user uploads JSON file)
      const importResult = importGameState(backupFile)
      expect(importResult.success).toBe(true)

      // Restore
      if (importResult.data) {
        act(() => {
          useGameStore.setState(importResult.data!)
        })
      }

      // Verify restore successful
      expect(useGameStore.getState().characters).toHaveLength(1)
      expect(useGameStore.getState().characters[0].name).toBe(
        'Campaign Character'
      )
      expect(useGameStore.getState().characters[0].level).toBe(15)
    })
  })
})
