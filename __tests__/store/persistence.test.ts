/**
 * Persistence Integration Tests
 *
 * Tests that Zustand persist middleware correctly saves and loads state.
 *
 * @module __tests__/store/persistence.test
 */

import { useGameStore } from '@/lib/store/gameStore'
import { createMockCharacter } from '@/lib/testing/mockData'

describe('Store Persistence', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear()

    // Reset store to initial state
    useGameStore.setState({
      characters: [],
      combatants: [],
      round: 1,
      isInCombat: false,
    })
  })

  afterEach(() => {
    localStorage.clear()
  })

  describe('Character Persistence', () => {
    it('should persist characters to localStorage', async () => {
      const character = createMockCharacter({ name: 'Raul' })

      // Add character to store
      useGameStore.getState().addCharacter(character)

      // Wait a tick for persistence to complete
      await new Promise((resolve) => setTimeout(resolve, 0))

      // Check that localStorage was updated
      const stored = localStorage.getItem('dnd-game-tracker-v2')
      expect(stored).toBeTruthy()

      const parsed = JSON.parse(stored!)
      expect(parsed.state.characters).toHaveLength(1)
      expect(parsed.state.characters[0].name).toBe('Raul')
    })

    it('should load persisted characters on store initialization', () => {
      const character = createMockCharacter({ name: 'Luna' })

      // Manually set localStorage (simulating previous session)
      const persistedState = {
        state: {
          version: 1,
          characters: [character],
          combatants: [],
          round: 1,
          isInCombat: false,
        },
        version: 0,
      }
      localStorage.setItem('dnd-game-tracker-v2', JSON.stringify(persistedState))

      // Force store to rehydrate by accessing persist API
      useGameStore.persist.rehydrate()

      // Get fresh store state (should load from localStorage)
      const state = useGameStore.getState()

      expect(state.characters).toHaveLength(1)
      expect(state.characters[0].name).toBe('Luna')
    })

    it('should persist character updates', async () => {
      const character = createMockCharacter({ name: 'Raul', currentHp: 30, maxHp: 30 })
      useGameStore.getState().addCharacter(character)

      // Update character HP
      useGameStore.getState().updateCharacterHp(character.id, 20)

      // Wait for persistence
      await new Promise((resolve) => setTimeout(resolve, 0))

      // Check localStorage
      const stored = localStorage.getItem('dnd-game-tracker-v2')
      const parsed = JSON.parse(stored!)
      expect(parsed.state.characters[0].currentHp).toBe(20)
    })

    it('should persist character deletion', () => {
      const character = createMockCharacter({ name: 'Raul' })
      useGameStore.getState().addCharacter(character)

      // Delete character
      useGameStore.getState().deleteCharacter(character.id)

      // Check localStorage
      const stored = localStorage.getItem('dnd-game-tracker-v2')
      const parsed = JSON.parse(stored!)
      expect(parsed.state.characters).toHaveLength(0)
    })
  })

  describe('Combat Persistence', () => {
    it('should persist combat state to localStorage', async () => {
      const character = createMockCharacter({ name: 'Fighter' })
      const combatantData = {
        ...character,
        entityId: character.id, // Required field
        type: 'character' as const,
        isPlayer: true,
        initiative: 15,
        isActive: false,
      }

      // Add combatant to combat
      useGameStore.getState().addCombatant(combatantData)

      // Wait for persistence
      await new Promise((resolve) => setTimeout(resolve, 0))

      // Check localStorage
      const stored = localStorage.getItem('dnd-game-tracker-v2')
      expect(stored).toBeTruthy()

      const parsed = JSON.parse(stored!)
      expect(parsed.state.combatants).toHaveLength(1)
      expect(parsed.state.isInCombat).toBe(true)
    })

    it('should persist round counter', async () => {
      const character1 = createMockCharacter({ name: 'Fighter 1' })
      const character2 = createMockCharacter({ name: 'Fighter 2' })

      const combatant1 = {
        ...character1,
        entityId: character1.id,
        type: 'character' as const,
        isPlayer: true,
        initiative: 20,
        isActive: true,
      }

      const combatant2 = {
        ...character2,
        entityId: character2.id,
        type: 'character' as const,
        isPlayer: true,
        initiative: 15,
        isActive: false,
      }

      useGameStore.getState().addCombatant(combatant1)
      useGameStore.getState().addCombatant(combatant2)

      // Advance turn to cycle back (should increment round)
      useGameStore.getState().nextTurn() // Go to second combatant
      useGameStore.getState().nextTurn() // Cycle back to first, increment round

      // Wait for persistence
      await new Promise((resolve) => setTimeout(resolve, 0))

      // Check localStorage has updated round
      const stored = localStorage.getItem('dnd-game-tracker-v2')
      const parsed = JSON.parse(stored!)
      expect(parsed.state.round).toBe(2)
    })

    it('should load persisted combat state', () => {
      const character = createMockCharacter({ name: 'Paladin' })
      const combatantData = {
        ...character,
        entityId: character.id,
        type: 'character' as const,
        isPlayer: true,
        initiative: 18,
        isActive: true,
      }

      // Manually set localStorage
      const persistedState = {
        state: {
          version: 1,
          characters: [],
          combatants: [combatantData],
          round: 3,
          isInCombat: true,
        },
        version: 0,
      }
      localStorage.setItem('dnd-game-tracker-v2', JSON.stringify(persistedState))

      // Force rehydration
      useGameStore.persist.rehydrate()

      // Get fresh store state
      const state = useGameStore.getState()

      expect(state.combatants).toHaveLength(1)
      expect(state.round).toBe(3)
      expect(state.isInCombat).toBe(true)
    })

    it('should persist combat clear', async () => {
      const character = createMockCharacter({ name: 'Fighter' })
      const combatantData = {
        ...character,
        entityId: character.id,
        type: 'character' as const,
        isPlayer: true,
        initiative: 15,
        isActive: true,
      }

      useGameStore.getState().addCombatant(combatantData)
      useGameStore.getState().clearCombat()

      // Wait for persistence
      await new Promise((resolve) => setTimeout(resolve, 0))

      // Check localStorage
      const stored = localStorage.getItem('dnd-game-tracker-v2')
      const parsed = JSON.parse(stored!)
      expect(parsed.state.combatants).toHaveLength(0)
      expect(parsed.state.isInCombat).toBe(false)
      expect(parsed.state.round).toBe(1)
    })
  })

  describe('Version Persistence', () => {
    it('should persist store version', async () => {
      const character = createMockCharacter()
      useGameStore.getState().addCharacter(character)

      // Wait for persistence
      await new Promise((resolve) => setTimeout(resolve, 0))

      const stored = localStorage.getItem('dnd-game-tracker-v2')
      const parsed = JSON.parse(stored!)
      expect(parsed.state.version).toBe(1)
    })
  })

  describe('Partialize Strategy', () => {
    it('should only persist specified state fields', async () => {
      const character = createMockCharacter({ name: 'Raul' })
      useGameStore.getState().addCharacter(character)

      // Wait for persistence
      await new Promise((resolve) => setTimeout(resolve, 0))

      const stored = localStorage.getItem('dnd-game-tracker-v2')
      const parsed = JSON.parse(stored!)

      // Should persist these fields
      expect(parsed.state).toHaveProperty('version')
      expect(parsed.state).toHaveProperty('characters')
      expect(parsed.state).toHaveProperty('combatants')
      expect(parsed.state).toHaveProperty('round')
      expect(parsed.state).toHaveProperty('isInCombat')

      // Should NOT persist action functions (they're not serializable anyway)
      expect(parsed.state).not.toHaveProperty('addCharacter')
      expect(parsed.state).not.toHaveProperty('updateCharacter')
    })
  })

  describe('localStorage Size', () => {
    it('should handle multiple characters without quota issues', async () => {
      // Add 10 characters
      for (let i = 0; i < 10; i++) {
        const character = createMockCharacter({ name: `Character ${i}` })
        useGameStore.getState().addCharacter(character)
      }

      // Wait for persistence
      await new Promise((resolve) => setTimeout(resolve, 0))

      // Should not throw
      const stored = localStorage.getItem('dnd-game-tracker-v2')
      expect(stored).toBeTruthy()

      const parsed = JSON.parse(stored!)
      expect(parsed.state.characters).toHaveLength(10)
    })
  })
})
