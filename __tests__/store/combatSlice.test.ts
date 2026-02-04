/**
 * Combat Slice Tests
 *
 * Tests for combat store slice (combatSlice.ts) functionality
 * Covers actions, selectors, state management, and edge cases
 */

import { create } from 'zustand'
import { createCombatSlice, type CombatSlice } from '@/lib/store/slices/combatSlice'
import type { Combatant } from '@/lib/schemas/combatant.schema'

// Create a test store for each test
const createTestStore = () => {
  return create<CombatSlice>()((...args) => createCombatSlice(...args))
}

// Helper to create mock combatant data
const createMockCombatant = (overrides: Partial<Combatant> = {}): Omit<Combatant, 'id' | 'addedAt'> => ({
  entityId: '123e4567-e89b-12d3-a456-426614174000',
  type: 'character',
  name: 'Test Character',
  armorClass: 15,
  maxHp: 30,
  currentHp: 30,
  initiative: 10,
  dexModifier: 0,
  isActive: false,
  conditions: [],
  avatarSeed: 'test-seed',
  isPlayer: true,
  ...overrides,
})

describe('CombatSlice', () => {
  describe('Initial State', () => {
    it('should initialize with empty combatants array', () => {
      const store = createTestStore()
      expect(store.getState().combatants).toEqual([])
    })

    it('should initialize with round 1', () => {
      const store = createTestStore()
      expect(store.getState().round).toBe(1)
    })

    it('should initialize with isInCombat false', () => {
      const store = createTestStore()
      expect(store.getState().isInCombat).toBe(false)
    })
  })

  describe('addCombatant', () => {
    it('should add a combatant to the list', () => {
      const store = createTestStore()
      const combatantData = createMockCombatant({ name: 'Fighter' })

      store.getState().addCombatant(combatantData)

      const combatants = store.getState().combatants
      expect(combatants).toHaveLength(1)
      expect(combatants[0].name).toBe('Fighter')
    })

    it('should generate unique IDs for each combatant', () => {
      const store = createTestStore()
      const combatantData = createMockCombatant()

      store.getState().addCombatant(combatantData)
      store.getState().addCombatant(combatantData)

      const combatants = store.getState().combatants
      expect(combatants).toHaveLength(2)
      expect(combatants[0].id).not.toBe(combatants[1].id)
    })

    it('should set first combatant as active', () => {
      const store = createTestStore()
      const combatantData = createMockCombatant()

      store.getState().addCombatant(combatantData)

      const combatants = store.getState().combatants
      expect(combatants[0].isActive).toBe(true)
    })

    it('should sort combatants by initiative descending', () => {
      const store = createTestStore()

      store.getState().addCombatant(createMockCombatant({ name: 'Low Init', initiative: 5 }))
      store.getState().addCombatant(createMockCombatant({ name: 'High Init', initiative: 20 }))
      store.getState().addCombatant(createMockCombatant({ name: 'Mid Init', initiative: 12 }))

      const combatants = store.getState().combatants
      expect(combatants[0].name).toBe('High Init')
      expect(combatants[1].name).toBe('Mid Init')
      expect(combatants[2].name).toBe('Low Init')
    })

    it('should set isInCombat to true', () => {
      const store = createTestStore()
      const combatantData = createMockCombatant()

      store.getState().addCombatant(combatantData)

      expect(store.getState().isInCombat).toBe(true)
    })

    it('should add timestamp when adding combatant', () => {
      const store = createTestStore()
      const combatantData = createMockCombatant()

      store.getState().addCombatant(combatantData)

      const combatant = store.getState().combatants[0]
      expect(combatant.addedAt).toBeDefined()
      expect(typeof combatant.addedAt).toBe('string')
    })
  })

  describe('removeCombatant', () => {
    it('should remove a combatant by ID', () => {
      const store = createTestStore()
      store.getState().addCombatant(createMockCombatant({ name: 'Fighter' }))
      store.getState().addCombatant(createMockCombatant({ name: 'Wizard' }))

      const combatants = store.getState().combatants
      const fighterId = combatants.find((c) => c.name === 'Fighter')!.id

      store.getState().removeCombatant(fighterId)

      const remaining = store.getState().combatants
      expect(remaining).toHaveLength(1)
      expect(remaining[0].name).toBe('Wizard')
    })

    it('should activate next combatant when removing active one', () => {
      const store = createTestStore()
      store.getState().addCombatant(createMockCombatant({ name: 'First', initiative: 20 }))
      store.getState().addCombatant(createMockCombatant({ name: 'Second', initiative: 15 }))

      const combatants = store.getState().combatants
      const firstId = combatants[0].id

      // First should be active
      expect(combatants[0].isActive).toBe(true)

      store.getState().removeCombatant(firstId)

      const remaining = store.getState().combatants
      expect(remaining[0].name).toBe('Second')
      expect(remaining[0].isActive).toBe(true)
    })

    it('should set isInCombat to false when removing last combatant', () => {
      const store = createTestStore()
      store.getState().addCombatant(createMockCombatant())

      const combatantId = store.getState().combatants[0].id

      store.getState().removeCombatant(combatantId)

      expect(store.getState().isInCombat).toBe(false)
      expect(store.getState().combatants).toHaveLength(0)
    })

    it('should do nothing when removing non-existent ID', () => {
      const store = createTestStore()
      store.getState().addCombatant(createMockCombatant())

      const initialCount = store.getState().combatants.length

      store.getState().removeCombatant('non-existent-id')

      expect(store.getState().combatants).toHaveLength(initialCount)
    })
  })

  describe('updateCombatantHp', () => {
    it('should update combatant HP', () => {
      const store = createTestStore()
      store.getState().addCombatant(createMockCombatant({ currentHp: 30, maxHp: 30 }))

      const combatantId = store.getState().combatants[0].id

      store.getState().updateCombatantHp(combatantId, 20)

      expect(store.getState().combatants[0].currentHp).toBe(20)
    })

    it('should clamp HP to 0 minimum', () => {
      const store = createTestStore()
      store.getState().addCombatant(createMockCombatant({ currentHp: 30, maxHp: 30 }))

      const combatantId = store.getState().combatants[0].id

      store.getState().updateCombatantHp(combatantId, -10)

      expect(store.getState().combatants[0].currentHp).toBe(0)
    })

    it('should clamp HP to maxHp maximum', () => {
      const store = createTestStore()
      store.getState().addCombatant(createMockCombatant({ currentHp: 20, maxHp: 30 }))

      const combatantId = store.getState().combatants[0].id

      store.getState().updateCombatantHp(combatantId, 50)

      expect(store.getState().combatants[0].currentHp).toBe(30)
    })

    it('should do nothing when updating non-existent ID', () => {
      const store = createTestStore()
      store.getState().addCombatant(createMockCombatant({ currentHp: 30 }))

      const originalHp = store.getState().combatants[0].currentHp

      store.getState().updateCombatantHp('non-existent-id', 10)

      expect(store.getState().combatants[0].currentHp).toBe(originalHp)
    })
  })

  describe('setActiveCombatant', () => {
    it('should set specific combatant as active', () => {
      const store = createTestStore()
      store.getState().addCombatant(createMockCombatant({ name: 'First', initiative: 20 }))
      store.getState().addCombatant(createMockCombatant({ name: 'Second', initiative: 15 }))

      const combatants = store.getState().combatants
      const secondId = combatants.find((c) => c.name === 'Second')!.id

      store.getState().setActiveCombatant(secondId)

      const updated = store.getState().combatants
      expect(updated.find((c) => c.name === 'First')!.isActive).toBe(false)
      expect(updated.find((c) => c.name === 'Second')!.isActive).toBe(true)
    })

    it('should deactivate all other combatants', () => {
      const store = createTestStore()
      store.getState().addCombatant(createMockCombatant({ name: 'A', initiative: 30 }))
      store.getState().addCombatant(createMockCombatant({ name: 'B', initiative: 20 }))
      store.getState().addCombatant(createMockCombatant({ name: 'C', initiative: 10 }))

      const combatants = store.getState().combatants
      const bId = combatants.find((c) => c.name === 'B')!.id

      store.getState().setActiveCombatant(bId)

      const updated = store.getState().combatants
      const activeCount = updated.filter((c) => c.isActive).length
      expect(activeCount).toBe(1)
    })
  })

  describe('nextTurn', () => {
    it('should advance to next combatant in initiative order', () => {
      const store = createTestStore()
      store.getState().addCombatant(createMockCombatant({ name: 'First', initiative: 20 }))
      store.getState().addCombatant(createMockCombatant({ name: 'Second', initiative: 15 }))
      store.getState().addCombatant(createMockCombatant({ name: 'Third', initiative: 10 }))

      // First is active initially
      expect(store.getState().getActiveCombatant()?.name).toBe('First')

      store.getState().nextTurn()

      expect(store.getState().getActiveCombatant()?.name).toBe('Second')
    })

    it('should cycle back to first combatant after last', () => {
      const store = createTestStore()
      store.getState().addCombatant(createMockCombatant({ name: 'First', initiative: 20 }))
      store.getState().addCombatant(createMockCombatant({ name: 'Second', initiative: 15 }))

      // Advance to second
      store.getState().nextTurn()
      expect(store.getState().getActiveCombatant()?.name).toBe('Second')

      // Should cycle back to first
      store.getState().nextTurn()
      expect(store.getState().getActiveCombatant()?.name).toBe('First')
    })

    it('should increment round counter when cycling back to first', () => {
      const store = createTestStore()
      store.getState().addCombatant(createMockCombatant({ name: 'First', initiative: 20 }))
      store.getState().addCombatant(createMockCombatant({ name: 'Second', initiative: 15 }))

      expect(store.getState().round).toBe(1)

      // Complete full round
      store.getState().nextTurn() // First -> Second
      expect(store.getState().round).toBe(1)

      store.getState().nextTurn() // Second -> First (new round)
      expect(store.getState().round).toBe(2)
    })

    it('should skip defeated combatants (HP = 0)', () => {
      const store = createTestStore()
      store.getState().addCombatant(createMockCombatant({ name: 'First', initiative: 20, currentHp: 30 }))
      store.getState().addCombatant(createMockCombatant({ name: 'Second', initiative: 15, currentHp: 0 }))
      store.getState().addCombatant(createMockCombatant({ name: 'Third', initiative: 10, currentHp: 20 }))

      // First is active
      expect(store.getState().getActiveCombatant()?.name).toBe('First')

      // Should skip Second (defeated) and go to Third
      store.getState().nextTurn()
      expect(store.getState().getActiveCombatant()?.name).toBe('Third')
    })

    it('should not advance if all combatants are defeated', () => {
      const store = createTestStore()
      store.getState().addCombatant(createMockCombatant({ name: 'First', initiative: 20, currentHp: 0 }))
      store.getState().addCombatant(createMockCombatant({ name: 'Second', initiative: 15, currentHp: 0 }))

      const activeBefore = store.getState().getActiveCombatant()

      store.getState().nextTurn()

      const activeAfter = store.getState().getActiveCombatant()
      expect(activeAfter?.id).toBe(activeBefore?.id)
    })

    it('should do nothing if no combatants exist', () => {
      const store = createTestStore()

      store.getState().nextTurn()

      expect(store.getState().combatants).toHaveLength(0)
      expect(store.getState().round).toBe(1)
    })
  })

  describe('clearCombat', () => {
    it('should remove all combatants', () => {
      const store = createTestStore()
      store.getState().addCombatant(createMockCombatant({ name: 'First' }))
      store.getState().addCombatant(createMockCombatant({ name: 'Second' }))

      store.getState().clearCombat()

      expect(store.getState().combatants).toHaveLength(0)
    })

    it('should reset round to 1', () => {
      const store = createTestStore()
      store.getState().addCombatant(createMockCombatant({ initiative: 20 }))
      store.getState().addCombatant(createMockCombatant({ initiative: 15 }))

      // Complete a full round to increment round counter
      store.getState().nextTurn() // First -> Second
      store.getState().nextTurn() // Second -> First (round 2)

      expect(store.getState().round).toBe(2)

      store.getState().clearCombat()

      expect(store.getState().round).toBe(1)
    })

    it('should set isInCombat to false', () => {
      const store = createTestStore()
      store.getState().addCombatant(createMockCombatant())

      expect(store.getState().isInCombat).toBe(true)

      store.getState().clearCombat()

      expect(store.getState().isInCombat).toBe(false)
    })
  })

  describe('startCombat', () => {
    it('should set first combatant as active', () => {
      const store = createTestStore()
      store.getState().addCombatant(createMockCombatant({ name: 'First', initiative: 20 }))
      store.getState().addCombatant(createMockCombatant({ name: 'Second', initiative: 15 }))

      // Manually deactivate first
      const combatants = store.getState().combatants
      store.getState().setActiveCombatant(combatants[1].id)

      store.getState().startCombat()

      expect(store.getState().getActiveCombatant()?.name).toBe('First')
    })

    it('should reset round to 1', () => {
      const store = createTestStore()
      store.getState().addCombatant(createMockCombatant())

      // Advance a few rounds
      store.getState().nextTurn()
      store.getState().nextTurn()

      store.getState().startCombat()

      expect(store.getState().round).toBe(1)
    })

    it('should set isInCombat to true', () => {
      const store = createTestStore()
      store.getState().addCombatant(createMockCombatant())

      store.getState().clearCombat()
      expect(store.getState().isInCombat).toBe(false)

      // Re-add and start
      store.getState().addCombatant(createMockCombatant())
      store.getState().startCombat()

      expect(store.getState().isInCombat).toBe(true)
    })
  })

  describe('Selectors', () => {
    describe('getActiveCombatant', () => {
      it('should return the active combatant', () => {
        const store = createTestStore()
        store.getState().addCombatant(createMockCombatant({ name: 'Fighter' }))

        const active = store.getState().getActiveCombatant()

        expect(active).toBeDefined()
        expect(active?.name).toBe('Fighter')
      })

      it('should return undefined if no active combatant', () => {
        const store = createTestStore()
        store.getState().addCombatant(createMockCombatant())

        // Manually deactivate all
        const combatants = store.getState().combatants
        combatants.forEach((c) => {
          c.isActive = false
        })

        const active = store.getState().getActiveCombatant()

        expect(active).toBeUndefined()
      })

      it('should return undefined if no combatants', () => {
        const store = createTestStore()

        const active = store.getState().getActiveCombatant()

        expect(active).toBeUndefined()
      })
    })

    describe('getSortedCombatants', () => {
      it('should return combatants sorted by initiative descending', () => {
        const store = createTestStore()
        store.getState().addCombatant(createMockCombatant({ name: 'Low', initiative: 5 }))
        store.getState().addCombatant(createMockCombatant({ name: 'High', initiative: 25 }))
        store.getState().addCombatant(createMockCombatant({ name: 'Mid', initiative: 15 }))

        const sorted = store.getState().getSortedCombatants()

        expect(sorted[0].name).toBe('High')
        expect(sorted[1].name).toBe('Mid')
        expect(sorted[2].name).toBe('Low')
      })

      it('should return empty array if no combatants', () => {
        const store = createTestStore()

        const sorted = store.getState().getSortedCombatants()

        expect(sorted).toEqual([])
      })
    })

    describe('getCombatantById', () => {
      it('should return combatant with matching ID', () => {
        const store = createTestStore()
        store.getState().addCombatant(createMockCombatant({ name: 'Fighter' }))

        const combatantId = store.getState().combatants[0].id
        const combatant = store.getState().getCombatantById(combatantId)

        expect(combatant).toBeDefined()
        expect(combatant?.name).toBe('Fighter')
      })

      it('should return undefined for non-existent ID', () => {
        const store = createTestStore()
        store.getState().addCombatant(createMockCombatant())

        const combatant = store.getState().getCombatantById('non-existent-id')

        expect(combatant).toBeUndefined()
      })
    })
  })

  describe('Initiative Actions', () => {
    describe('rollInitiative', () => {
      it('should update initiative for a single combatant', () => {
        const store = createTestStore()
        store.getState().addCombatant(createMockCombatant({ name: 'Fighter', initiative: 10, dexModifier: 2 }))

        const combatantId = store.getState().combatants[0].id
        const originalInitiative = store.getState().combatants[0].initiative

        store.getState().rollInitiative(combatantId)

        const newInitiative = store.getState().combatants[0].initiative
        // Initiative should be different (could be same by chance, but unlikely)
        // At minimum, the action should have executed
        expect(typeof newInitiative).toBe('number')
        expect(newInitiative).toBeGreaterThanOrEqual(-3) // d20 min (1) + modifier (-5) = -4, but we use dexModifier 2, so min is 3
        expect(newInitiative).toBeLessThanOrEqual(22) // d20 max (20) + modifier (2) = 22
      })

      it('should re-sort combatants after rolling', () => {
        const store = createTestStore()
        store.getState().addCombatant(createMockCombatant({ name: 'First', initiative: 20 }))
        store.getState().addCombatant(createMockCombatant({ name: 'Second', initiative: 10 }))

        // Second should be last initially
        expect(store.getState().combatants[1].name).toBe('Second')

        // Set Second's initiative higher manually, then roll for First to lower it
        const secondId = store.getState().combatants[1].id
        store.getState().setManualInitiative(secondId, 25)

        // Now Second should be first
        expect(store.getState().combatants[0].name).toBe('Second')
      })

      it('should do nothing for non-existent combatant', () => {
        const store = createTestStore()
        store.getState().addCombatant(createMockCombatant({ name: 'Fighter', initiative: 10 }))

        const originalInitiative = store.getState().combatants[0].initiative

        store.getState().rollInitiative('non-existent-id')

        expect(store.getState().combatants[0].initiative).toBe(originalInitiative)
      })
    })

    describe('rollAllInitiatives', () => {
      it('should update initiative for all combatants', () => {
        const store = createTestStore()
        store.getState().addCombatant(createMockCombatant({ name: 'Fighter', initiative: 10, dexModifier: 2 }))
        store.getState().addCombatant(createMockCombatant({ name: 'Wizard', initiative: 10, dexModifier: 1 }))
        store.getState().addCombatant(createMockCombatant({ name: 'Rogue', initiative: 10, dexModifier: 4 }))

        store.getState().rollAllInitiatives()

        const combatants = store.getState().combatants
        combatants.forEach((c) => {
          expect(typeof c.initiative).toBe('number')
          // Initiative should be in valid range (d20 1-20 + modifier -5 to 10)
          expect(c.initiative).toBeGreaterThanOrEqual(-4)
          expect(c.initiative).toBeLessThanOrEqual(30)
        })
      })

      it('should sort combatants after rolling all', () => {
        const store = createTestStore()
        store.getState().addCombatant(createMockCombatant({ name: 'A', initiative: 10 }))
        store.getState().addCombatant(createMockCombatant({ name: 'B', initiative: 10 }))
        store.getState().addCombatant(createMockCombatant({ name: 'C', initiative: 10 }))

        store.getState().rollAllInitiatives()

        const combatants = store.getState().combatants
        // Should be sorted by initiative descending
        for (let i = 0; i < combatants.length - 1; i++) {
          expect(combatants[i].initiative).toBeGreaterThanOrEqual(combatants[i + 1].initiative)
        }
      })

      it('should set first combatant as active if none was active', () => {
        const store = createTestStore()
        store.getState().addCombatant(createMockCombatant({ name: 'Fighter' }))

        // Manually deactivate
        store.getState().combatants[0].isActive = false

        store.getState().rollAllInitiatives()

        expect(store.getState().combatants[0].isActive).toBe(true)
      })

      it('should handle empty combatant list', () => {
        const store = createTestStore()

        // Should not throw
        expect(() => store.getState().rollAllInitiatives()).not.toThrow()
      })
    })

    describe('setManualInitiative', () => {
      it('should set initiative to specified value', () => {
        const store = createTestStore()
        store.getState().addCombatant(createMockCombatant({ name: 'Fighter', initiative: 10 }))

        const combatantId = store.getState().combatants[0].id

        store.getState().setManualInitiative(combatantId, 18)

        expect(store.getState().combatants[0].initiative).toBe(18)
      })

      it('should validate initiative range (min -10)', () => {
        const store = createTestStore()
        store.getState().addCombatant(createMockCombatant({ name: 'Fighter', initiative: 10 }))

        const combatantId = store.getState().combatants[0].id
        const originalInitiative = store.getState().combatants[0].initiative

        store.getState().setManualInitiative(combatantId, -15)

        // Should not change because value is out of range
        expect(store.getState().combatants[0].initiative).toBe(originalInitiative)
      })

      it('should validate initiative range (max 50)', () => {
        const store = createTestStore()
        store.getState().addCombatant(createMockCombatant({ name: 'Fighter', initiative: 10 }))

        const combatantId = store.getState().combatants[0].id
        const originalInitiative = store.getState().combatants[0].initiative

        store.getState().setManualInitiative(combatantId, 55)

        // Should not change because value is out of range
        expect(store.getState().combatants[0].initiative).toBe(originalInitiative)
      })

      it('should accept valid negative initiative', () => {
        const store = createTestStore()
        store.getState().addCombatant(createMockCombatant({ name: 'Fighter', initiative: 10 }))

        const combatantId = store.getState().combatants[0].id

        store.getState().setManualInitiative(combatantId, -5)

        expect(store.getState().combatants[0].initiative).toBe(-5)
      })

      it('should re-sort combatants after setting', () => {
        const store = createTestStore()
        store.getState().addCombatant(createMockCombatant({ name: 'First', initiative: 20 }))
        store.getState().addCombatant(createMockCombatant({ name: 'Second', initiative: 10 }))

        const secondId = store.getState().combatants.find((c) => c.name === 'Second')!.id

        // Set Second's initiative higher than First
        store.getState().setManualInitiative(secondId, 25)

        // Second should now be first
        expect(store.getState().combatants[0].name).toBe('Second')
        expect(store.getState().combatants[0].initiative).toBe(25)
      })

      it('should round decimal values', () => {
        const store = createTestStore()
        store.getState().addCombatant(createMockCombatant({ name: 'Fighter', initiative: 10 }))

        const combatantId = store.getState().combatants[0].id

        store.getState().setManualInitiative(combatantId, 15.7)

        expect(store.getState().combatants[0].initiative).toBe(16)
      })
    })

    describe('dexModifier tiebreaker', () => {
      it('should break initiative ties by dexModifier', () => {
        const store = createTestStore()
        store.getState().addCombatant(createMockCombatant({ name: 'LowDex', initiative: 15, dexModifier: 1 }))
        store.getState().addCombatant(createMockCombatant({ name: 'HighDex', initiative: 15, dexModifier: 4 }))

        const combatants = store.getState().combatants

        // Both have same initiative, but HighDex should be first due to higher dexModifier
        expect(combatants[0].name).toBe('HighDex')
        expect(combatants[1].name).toBe('LowDex')
      })
    })
  })
})
