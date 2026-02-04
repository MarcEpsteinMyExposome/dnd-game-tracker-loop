/**
 * Combat Slice - Zustand state management for combat encounters
 *
 * Manages active combat state:
 * - Add/remove combatants
 * - Track initiative order
 * - Manage active turn
 * - Update combatant HP during combat
 * - Track round counter
 * - Roll initiative for combatants
 *
 * @see Combatant schema in lib/schemas/combatant.schema.ts
 */

import { StateCreator } from 'zustand'
import {
  Combatant,
  validateCombatant,
  sortByInitiative,
  getNextCombatant,
  isCombatantDefeated,
} from '../../schemas/combatant.schema'
import { rollInitiative as rollInitiativeDie } from '../../dice/roller'

/**
 * Combat slice state
 */
export interface CombatSlice {
  combatants: Combatant[]
  round: number
  isInCombat: boolean

  // Actions
  addCombatant: (combatant: Omit<Combatant, 'id' | 'addedAt'>) => void
  removeCombatant: (id: string) => void
  updateCombatantHp: (id: string, newHp: number) => void
  setActiveCombatant: (id: string) => void
  nextTurn: () => void
  clearCombat: () => void
  startCombat: () => void

  // Initiative actions
  rollInitiative: (combatantId: string) => void
  rollAllInitiatives: () => void
  setManualInitiative: (combatantId: string, value: number) => void

  // Selectors
  getActiveCombatant: () => Combatant | undefined
  getSortedCombatants: () => Combatant[]
  getCombatantById: (id: string) => Combatant | undefined
}

/**
 * Generate UUID v4
 */
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

/**
 * Create combat slice
 */
export const createCombatSlice: StateCreator<CombatSlice> = (set, get) => ({
  combatants: [],
  round: 1,
  isInCombat: false,

  /**
   * Add a combatant to combat
   *
   * @param combatant - Combatant data (without id, addedAt)
   *
   * @example
   * ```typescript
   * addCombatant({
   *   entityId: 'char-123',
   *   type: 'character',
   *   name: 'Raul',
   *   armorClass: 18,
   *   maxHp: 45,
   *   currentHp: 45,
   *   initiative: 15,
   *   isActive: false,
   *   conditions: [],
   *   avatarSeed: 'raul',
   *   isPlayer: true,
   * })
   * ```
   */
  addCombatant: (combatant: Omit<Combatant, 'id' | 'addedAt'>) => {
    const newCombatant: Combatant = {
      id: generateUUID(),
      ...combatant,
      addedAt: new Date().toISOString(),
    }

    // Validate before adding
    const result = validateCombatant(newCombatant)
    if (!result.success) {
      console.error('Failed to add combatant: validation failed', result.error)
      return
    }

    set((state) => {
      const updatedCombatants = [...state.combatants, newCombatant]
      // Sort by initiative after adding
      const sorted = sortByInitiative(updatedCombatants)

      // If this is the first combatant, make it active
      const withActive =
        state.combatants.length === 0
          ? sorted.map((c, idx) => ({ ...c, isActive: idx === 0 }))
          : sorted

      return {
        combatants: withActive,
        isInCombat: true,
      }
    })
  },

  /**
   * Remove a combatant from combat
   *
   * @param id - Combatant ID to remove
   *
   * @example
   * ```typescript
   * removeCombatant('combatant-123')
   * ```
   */
  removeCombatant: (id: string) => {
    set((state) => {
      const combatant = state.combatants.find((c) => c.id === id)
      if (!combatant) return state

      const wasActive = combatant.isActive
      const remainingCombatants = state.combatants.filter((c) => c.id !== id)

      // If removed combatant was active, activate next one
      if (wasActive && remainingCombatants.length > 0) {
        // Get the next combatant in the original list
        const next = getNextCombatant(state.combatants, id)
        return {
          combatants: remainingCombatants.map((c) => ({
            ...c,
            isActive: c.id === next?.id,
          })),
          isInCombat: remainingCombatants.length > 0,
        }
      }

      return {
        combatants: remainingCombatants,
        isInCombat: remainingCombatants.length > 0,
      }
    })
  },

  /**
   * Update combatant HP during combat
   *
   * Ensures HP stays within valid range (0 to maxHp)
   *
   * @param id - Combatant ID
   * @param newHp - New HP value
   *
   * @example
   * ```typescript
   * updateCombatantHp('combatant-123', 30) // Set HP to 30
   * updateCombatantHp('combatant-123', -5) // Clamps to 0
   * updateCombatantHp('combatant-123', 999) // Clamps to maxHp
   * ```
   */
  updateCombatantHp: (id: string, newHp: number) => {
    set((state) => ({
      combatants: state.combatants.map((combatant) => {
        if (combatant.id !== id) return combatant

        // Clamp HP to valid range
        const clampedHp = Math.max(0, Math.min(newHp, combatant.maxHp))

        return {
          ...combatant,
          currentHp: clampedHp,
        }
      }),
    }))
  },

  /**
   * Set the active combatant
   *
   * @param id - Combatant ID to set as active
   *
   * @example
   * ```typescript
   * setActiveCombatant('combatant-123')
   * ```
   */
  setActiveCombatant: (id: string) => {
    set((state) => ({
      combatants: state.combatants.map((c) => ({
        ...c,
        isActive: c.id === id,
      })),
    }))
  },

  /**
   * Advance to next turn
   *
   * Automatically skips defeated combatants (HP = 0)
   * Increments round counter when cycling back to first combatant
   *
   * @example
   * ```typescript
   * nextTurn()
   * ```
   */
  nextTurn: () => {
    set((state) => {
      const sorted = sortByInitiative(state.combatants)
      const activeCombatant = sorted.find((c) => c.isActive)

      if (!activeCombatant || sorted.length === 0) {
        return state
      }

      // Find next non-defeated combatant
      let nextCombatant = getNextCombatant(sorted, activeCombatant.id)
      const startingId = nextCombatant?.id

      // Skip defeated combatants
      while (nextCombatant && isCombatantDefeated(nextCombatant)) {
        nextCombatant = getNextCombatant(sorted, nextCombatant.id)

        // Prevent infinite loop if all combatants are defeated
        if (nextCombatant?.id === startingId) {
          return state
        }
      }

      if (!nextCombatant) {
        return state
      }

      // Check if we cycled back to the first combatant (new round)
      const isNewRound = nextCombatant.id === sorted[0].id && activeCombatant.id !== sorted[0].id

      return {
        combatants: sorted.map((c) => ({
          ...c,
          isActive: c.id === nextCombatant.id,
        })),
        round: isNewRound ? state.round + 1 : state.round,
      }
    })
  },

  /**
   * Clear all combatants and end combat
   *
   * Resets round counter to 1
   *
   * @example
   * ```typescript
   * clearCombat()
   * ```
   */
  clearCombat: () => {
    set({
      combatants: [],
      round: 1,
      isInCombat: false,
    })
  },

  /**
   * Start combat with current combatants
   *
   * Sets first combatant as active
   *
   * @example
   * ```typescript
   * startCombat()
   * ```
   */
  startCombat: () => {
    set((state) => {
      const sorted = sortByInitiative(state.combatants)
      return {
        combatants: sorted.map((c, idx) => ({
          ...c,
          isActive: idx === 0,
        })),
        round: 1,
        isInCombat: true,
      }
    })
  },

  /**
   * Roll initiative for a single combatant
   *
   * Rolls d20 + dexModifier and updates the combatant's initiative
   *
   * @param combatantId - ID of combatant to roll for
   *
   * @example
   * ```typescript
   * rollInitiative('combatant-123')
   * ```
   */
  rollInitiative: (combatantId: string) => {
    set((state) => {
      const combatant = state.combatants.find((c) => c.id === combatantId)
      if (!combatant) return state

      const rollResult = rollInitiativeDie(combatant.dexModifier ?? 0)
      const updatedCombatants = state.combatants.map((c) =>
        c.id === combatantId ? { ...c, initiative: rollResult.total } : c
      )

      return {
        combatants: sortByInitiative(updatedCombatants),
      }
    })
  },

  /**
   * Roll initiative for all combatants
   *
   * Rolls d20 + dexModifier for each combatant
   *
   * @example
   * ```typescript
   * rollAllInitiatives()
   * ```
   */
  rollAllInitiatives: () => {
    set((state) => {
      const updatedCombatants = state.combatants.map((c) => {
        const rollResult = rollInitiativeDie(c.dexModifier ?? 0)
        return { ...c, initiative: rollResult.total }
      })

      const sorted = sortByInitiative(updatedCombatants)

      // Preserve active combatant status or set first as active
      const hasActive = sorted.some((c) => c.isActive)
      const withActive = hasActive
        ? sorted
        : sorted.map((c, idx) => ({ ...c, isActive: idx === 0 }))

      return {
        combatants: withActive,
      }
    })
  },

  /**
   * Set initiative manually for a combatant
   *
   * Validates the value is within range (-10 to 50)
   *
   * @param combatantId - ID of combatant
   * @param value - Initiative value to set
   *
   * @example
   * ```typescript
   * setManualInitiative('combatant-123', 18)
   * ```
   */
  setManualInitiative: (combatantId: string, value: number) => {
    // Validate range
    if (value < -10 || value > 50) {
      console.warn(`Invalid initiative value: ${value}. Must be between -10 and 50.`)
      return
    }

    set((state) => {
      const updatedCombatants = state.combatants.map((c) =>
        c.id === combatantId ? { ...c, initiative: Math.round(value) } : c
      )

      return {
        combatants: sortByInitiative(updatedCombatants),
      }
    })
  },

  /**
   * Get the currently active combatant
   *
   * @returns Active combatant or undefined if none
   *
   * @example
   * ```typescript
   * const active = getActiveCombatant()
   * if (active) {
   *   console.log(`It's ${active.name}'s turn`)
   * }
   * ```
   */
  getActiveCombatant: () => {
    return get().combatants.find((c) => c.isActive)
  },

  /**
   * Get combatants sorted by initiative (descending)
   *
   * @returns Sorted array of combatants
   *
   * @example
   * ```typescript
   * const sorted = getSortedCombatants()
   * sorted.forEach(c => console.log(`${c.name}: ${c.initiative}`))
   * ```
   */
  getSortedCombatants: () => {
    return sortByInitiative(get().combatants)
  },

  /**
   * Get a combatant by ID
   *
   * @param id - Combatant ID
   * @returns Combatant or undefined if not found
   *
   * @example
   * ```typescript
   * const combatant = getCombatantById('combatant-123')
   * if (combatant) {
   *   console.log(combatant.name)
   * }
   * ```
   */
  getCombatantById: (id: string) => {
    return get().combatants.find((c) => c.id === id)
  },
})
