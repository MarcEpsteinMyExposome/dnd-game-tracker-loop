/**
 * Monster Slice - Zustand state management for custom monsters
 *
 * Manages custom monster CRUD operations:
 * - Add new custom monsters
 * - Update existing custom monsters
 * - Delete custom monsters
 * - Query monsters by ID
 *
 * Note: This slice manages USER-CREATED monsters only.
 * Library monsters (pre-built) are in lib/data/monsters.ts
 *
 * @see Monster schema in lib/schemas/monster.schema.ts
 */

import { StateCreator } from 'zustand'
import {
  Monster,
  CreateMonster,
  UpdateMonster,
  validateMonster,
} from '../../schemas/monster.schema'

/**
 * Monster slice state
 */
export interface MonsterSlice {
  customMonsters: Monster[]

  // Actions
  addMonster: (monster: CreateMonster) => void
  updateMonster: (updates: UpdateMonster) => void
  deleteMonster: (id: string) => void
  getCustomMonsterById: (id: string) => Monster | undefined
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
 * Create monster slice
 */
export const createMonsterSlice: StateCreator<MonsterSlice> = (set, get) => ({
  customMonsters: [],

  /**
   * Add a new custom monster
   *
   * @param monster - Monster data (without id, timestamps)
   *
   * @example
   * ```typescript
   * addMonster({
   *   name: 'Desert Scorpion',
   *   type: 'Beast',
   *   armorClass: 14,
   *   hitPoints: 26,
   *   damage: '1d8+2',
   *   abilities: [],
   *   challenge: 1,
   *   size: 'Large',
   *   speed: 30,
   * })
   * ```
   */
  addMonster: (monster: CreateMonster) => {
    const timestamp = new Date().toISOString()
    const newMonster: Monster = {
      id: `custom-${generateUUID()}`,
      ...monster,
      abilities: monster.abilities ?? [],
      avatarSeed: monster.avatarSeed || monster.name.toLowerCase().replace(/\s+/g, '-'),
      createdAt: timestamp,
      updatedAt: timestamp,
    }

    // Validate before adding
    const result = validateMonster(newMonster)
    if (!result.success) {
      console.error('Failed to add monster: validation failed', result.error)
      return
    }

    set((state) => ({
      customMonsters: [...state.customMonsters, newMonster],
    }))
  },

  /**
   * Update an existing custom monster
   *
   * @param updates - Partial monster data with required id
   *
   * @example
   * ```typescript
   * updateMonster({
   *   id: 'custom-123',
   *   hitPoints: 35,
   *   challenge: 2,
   * })
   * ```
   */
  updateMonster: (updates: UpdateMonster) => {
    set((state) => ({
      customMonsters: state.customMonsters.map((monster) => {
        if (monster.id !== updates.id) return monster

        const updated: Monster = {
          ...monster,
          ...updates,
          updatedAt: new Date().toISOString(),
        }

        // Validate updated monster
        const result = validateMonster(updated)
        if (!result.success) {
          console.error('Failed to update monster: validation failed', result.error)
          return monster // Return original if validation fails
        }

        return updated
      }),
    }))
  },

  /**
   * Delete a custom monster
   *
   * @param id - Monster ID to delete
   *
   * @example
   * ```typescript
   * deleteMonster('custom-123')
   * ```
   */
  deleteMonster: (id: string) => {
    set((state) => ({
      customMonsters: state.customMonsters.filter((monster) => monster.id !== id),
    }))
  },

  /**
   * Get a custom monster by ID
   *
   * @param id - Monster ID
   * @returns Monster or undefined if not found
   *
   * @example
   * ```typescript
   * const monster = getCustomMonsterById('custom-123')
   * if (monster) {
   *   console.log(monster.name)
   * }
   * ```
   */
  getCustomMonsterById: (id: string) => {
    return get().customMonsters.find((monster) => monster.id === id)
  },
})
