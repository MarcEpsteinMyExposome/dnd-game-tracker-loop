/**
 * Character Schema Tests
 *
 * Tests for character.schema.ts validation and helper functions
 */

import {
  CharacterSchema,
  CreateCharacterSchema,
  UpdateCharacterSchema,
  parseCharacter,
  validateCharacter,
  clampHp,
  type Character,
} from '@/lib/schemas/character.schema'

describe('CharacterSchema', () => {
  const validCharacter: Character = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    name: 'Raul the Brave',
    characterClass: 'Paladin',
    level: 5,
    maxHp: 45,
    currentHp: 32,
    armorClass: 18,
    avatarSeed: 'raul-paladin',
    conditions: ['Poisoned'],
    createdAt: '2026-01-20T10:00:00.000Z',
    updatedAt: '2026-01-20T10:00:00.000Z',
  }

  describe('valid data', () => {
    it('should validate a complete character', () => {
      const result = CharacterSchema.safeParse(validCharacter)
      expect(result.success).toBe(true)
    })

    it('should validate character with optional imageUrl', () => {
      const withImage = { ...validCharacter, imageUrl: 'https://example.com/image.png' }
      const result = CharacterSchema.safeParse(withImage)
      expect(result.success).toBe(true)
    })

    it('should validate character with empty conditions array', () => {
      const noConditions = { ...validCharacter, conditions: [] }
      const result = CharacterSchema.safeParse(noConditions)
      expect(result.success).toBe(true)
    })

    it('should validate character at level 1', () => {
      const level1 = { ...validCharacter, level: 1 }
      const result = CharacterSchema.safeParse(level1)
      expect(result.success).toBe(true)
    })

    it('should validate character at level 20', () => {
      const level20 = { ...validCharacter, level: 20 }
      const result = CharacterSchema.safeParse(level20)
      expect(result.success).toBe(true)
    })

    it('should validate character with 0 currentHp', () => {
      const unconscious = { ...validCharacter, currentHp: 0 }
      const result = CharacterSchema.safeParse(unconscious)
      expect(result.success).toBe(true)
    })
  })

  describe('invalid data', () => {
    it('should reject character without id', () => {
      const { id, ...noId } = validCharacter
      const result = CharacterSchema.safeParse(noId)
      expect(result.success).toBe(false)
    })

    it('should reject character with invalid UUID', () => {
      const invalidId = { ...validCharacter, id: 'not-a-uuid' }
      const result = CharacterSchema.safeParse(invalidId)
      expect(result.success).toBe(false)
    })

    it('should reject character with empty name', () => {
      const emptyName = { ...validCharacter, name: '' }
      const result = CharacterSchema.safeParse(emptyName)
      expect(result.success).toBe(false)
    })

    it('should reject character with name too long', () => {
      const longName = { ...validCharacter, name: 'a'.repeat(51) }
      const result = CharacterSchema.safeParse(longName)
      expect(result.success).toBe(false)
    })

    it('should reject character with empty class', () => {
      const emptyClass = { ...validCharacter, characterClass: '' }
      const result = CharacterSchema.safeParse(emptyClass)
      expect(result.success).toBe(false)
    })

    it('should reject character with level 0', () => {
      const level0 = { ...validCharacter, level: 0 }
      const result = CharacterSchema.safeParse(level0)
      expect(result.success).toBe(false)
    })

    it('should reject character with level above 20', () => {
      const level21 = { ...validCharacter, level: 21 }
      const result = CharacterSchema.safeParse(level21)
      expect(result.success).toBe(false)
    })

    it('should reject character with negative maxHp', () => {
      const negativeHp = { ...validCharacter, maxHp: -1 }
      const result = CharacterSchema.safeParse(negativeHp)
      expect(result.success).toBe(false)
    })

    it('should reject character with negative currentHp', () => {
      const negativeHp = { ...validCharacter, currentHp: -1 }
      const result = CharacterSchema.safeParse(negativeHp)
      expect(result.success).toBe(false)
    })

    it('should reject character with AC 0', () => {
      const zeroAc = { ...validCharacter, armorClass: 0 }
      const result = CharacterSchema.safeParse(zeroAc)
      expect(result.success).toBe(false)
    })

    it('should reject character with AC above 30', () => {
      const highAc = { ...validCharacter, armorClass: 31 }
      const result = CharacterSchema.safeParse(highAc)
      expect(result.success).toBe(false)
    })
  })

  describe('parseCharacter', () => {
    it('should parse valid character data', () => {
      const character = parseCharacter(validCharacter)
      expect(character.name).toBe('Raul the Brave')
    })

    it('should throw on invalid data', () => {
      expect(() => parseCharacter({ name: 'Invalid' })).toThrow()
    })
  })

  describe('validateCharacter', () => {
    it('should return success for valid data', () => {
      const result = validateCharacter(validCharacter)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.name).toBe('Raul the Brave')
      }
    })

    it('should return error for invalid data', () => {
      const result = validateCharacter({ name: 'Invalid' })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues.length).toBeGreaterThan(0)
      }
    })
  })
})

describe('CreateCharacterSchema', () => {
  it('should validate character creation data', () => {
    const createData = {
      name: 'New Character',
      characterClass: 'Fighter',
      level: 1,
      maxHp: 10,
      currentHp: 10,
      armorClass: 16,
      avatarSeed: 'fighter-seed',
      conditions: [],
    }
    const result = CreateCharacterSchema.safeParse(createData)
    expect(result.success).toBe(true)
  })

  it('should not require id, createdAt, updatedAt', () => {
    const minimalData = {
      name: 'Minimal',
      characterClass: 'Rogue',
      level: 1,
      maxHp: 8,
      armorClass: 14,
    }
    const result = CreateCharacterSchema.safeParse(minimalData)
    expect(result.success).toBe(true)
  })
})

describe('UpdateCharacterSchema', () => {
  it('should require only id for updates', () => {
    const updateData = {
      id: '123e4567-e89b-12d3-a456-426614174000',
    }
    const result = UpdateCharacterSchema.safeParse(updateData)
    expect(result.success).toBe(true)
  })

  it('should allow partial updates', () => {
    const updateData = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      currentHp: 25,
      conditions: ['Stunned'],
    }
    const result = UpdateCharacterSchema.safeParse(updateData)
    expect(result.success).toBe(true)
  })

  it('should reject update without id', () => {
    const updateData = {
      currentHp: 25,
    }
    const result = UpdateCharacterSchema.safeParse(updateData)
    expect(result.success).toBe(false)
  })
})

describe('clampHp', () => {
  it('should return HP unchanged if within range', () => {
    expect(clampHp(50, 100)).toBe(50)
  })

  it('should clamp HP to 0 if negative', () => {
    expect(clampHp(-10, 100)).toBe(0)
  })

  it('should clamp HP to maxHp if exceeds', () => {
    expect(clampHp(150, 100)).toBe(100)
  })

  it('should handle edge case of 0 HP', () => {
    expect(clampHp(0, 100)).toBe(0)
  })

  it('should handle edge case of exactly maxHp', () => {
    expect(clampHp(100, 100)).toBe(100)
  })
})
