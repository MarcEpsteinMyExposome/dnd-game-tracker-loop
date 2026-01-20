/**
 * Character Slice - Zustand state management for characters
 *
 * Manages character roster CRUD operations:
 * - Add new characters
 * - Update existing characters
 * - Delete characters
 * - Query characters by ID
 *
 * @see Character schema in lib/schemas/character.schema.ts
 */

import { StateCreator } from 'zustand'
import {
  Character,
  CreateCharacter,
  UpdateCharacter,
  validateCharacter,
  clampHp,
} from '@/lib/schemas/character.schema'

/**
 * Character slice state
 */
export interface CharacterSlice {
  characters: Character[]

  // Actions
  addCharacter: (character: CreateCharacter) => void
  updateCharacter: (updates: UpdateCharacter) => void
  deleteCharacter: (id: string) => void
  getCharacterById: (id: string) => Character | undefined
  updateCharacterHp: (id: string, newHp: number) => void
  toggleCharacterCondition: (id: string, condition: string) => void
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
 * Create character slice
 */
export const createCharacterSlice: StateCreator<CharacterSlice> = (set, get) => ({
  characters: [],

  /**
   * Add a new character to the roster
   *
   * @param character - Character data (without id, timestamps)
   *
   * @example
   * ```typescript
   * addCharacter({
   *   name: 'Raul',
   *   characterClass: 'Paladin',
   *   level: 5,
   *   maxHp: 45,
   *   currentHp: 45,
   *   armorClass: 18,
   * })
   * ```
   */
  addCharacter: (character: CreateCharacter) => {
    const timestamp = new Date().toISOString()
    const newCharacter: Character = {
      id: generateUUID(),
      ...character,
      currentHp: character.currentHp ?? character.maxHp,
      conditions: character.conditions ?? [],
      avatarSeed: character.avatarSeed || character.name.toLowerCase().replace(/\s+/g, '-'),
      createdAt: timestamp,
      updatedAt: timestamp,
    }

    // Validate before adding
    const result = validateCharacter(newCharacter)
    if (!result.success) {
      console.error('Failed to add character: validation failed', result.error)
      return
    }

    set((state) => ({
      characters: [...state.characters, newCharacter],
    }))
  },

  /**
   * Update an existing character
   *
   * @param updates - Partial character data with required id
   *
   * @example
   * ```typescript
   * updateCharacter({
   *   id: 'char-123',
   *   level: 6,
   *   maxHp: 52,
   * })
   * ```
   */
  updateCharacter: (updates: UpdateCharacter) => {
    set((state) => ({
      characters: state.characters.map((char) => {
        if (char.id !== updates.id) return char

        const updated: Character = {
          ...char,
          ...updates,
          updatedAt: new Date().toISOString(),
        }

        // Validate updated character
        const result = validateCharacter(updated)
        if (!result.success) {
          console.error('Failed to update character: validation failed', result.error)
          return char // Return original if validation fails
        }

        return updated
      }),
    }))
  },

  /**
   * Delete a character from the roster
   *
   * @param id - Character ID to delete
   *
   * @example
   * ```typescript
   * deleteCharacter('char-123')
   * ```
   */
  deleteCharacter: (id: string) => {
    set((state) => ({
      characters: state.characters.filter((char) => char.id !== id),
    }))
  },

  /**
   * Get a character by ID
   *
   * @param id - Character ID
   * @returns Character or undefined if not found
   *
   * @example
   * ```typescript
   * const character = getCharacterById('char-123')
   * if (character) {
   *   console.log(character.name)
   * }
   * ```
   */
  getCharacterById: (id: string) => {
    return get().characters.find((char) => char.id === id)
  },

  /**
   * Update character HP with validation
   *
   * Ensures HP stays within valid range (0 to maxHp)
   *
   * @param id - Character ID
   * @param newHp - New HP value
   *
   * @example
   * ```typescript
   * updateCharacterHp('char-123', 30) // Set HP to 30
   * updateCharacterHp('char-123', -5) // Clamps to 0
   * updateCharacterHp('char-123', 999) // Clamps to maxHp
   * ```
   */
  updateCharacterHp: (id: string, newHp: number) => {
    set((state) => ({
      characters: state.characters.map((char) => {
        if (char.id !== id) return char

        const clampedHp = clampHp(newHp, char.maxHp)

        return {
          ...char,
          currentHp: clampedHp,
          updatedAt: new Date().toISOString(),
        }
      }),
    }))
  },

  /**
   * Toggle a condition on a character
   *
   * Adds condition if not present, removes if present
   *
   * @param id - Character ID
   * @param condition - Condition name to toggle
   *
   * @example
   * ```typescript
   * toggleCharacterCondition('char-123', 'Poisoned')
   * ```
   */
  toggleCharacterCondition: (id: string, condition: string) => {
    set((state) => ({
      characters: state.characters.map((char) => {
        if (char.id !== id) return char

        const hasCondition = char.conditions.includes(condition)
        const newConditions = hasCondition
          ? char.conditions.filter((c) => c !== condition)
          : [...char.conditions, condition]

        return {
          ...char,
          conditions: newConditions,
          updatedAt: new Date().toISOString(),
        }
      }),
    }))
  },
})
