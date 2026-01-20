/**
 * Monster Schema Tests
 *
 * Tests for monster.schema.ts validation and helper functions
 */

import {
  MonsterSchema,
  MonsterAbilitySchema,
  CreateMonsterSchema,
  UpdateMonsterSchema,
  parseMonster,
  validateMonster,
  isValidDiceNotation,
  type Monster,
  type MonsterAbility,
} from '@/lib/schemas/monster.schema'

describe('MonsterAbilitySchema', () => {
  const validAbility: MonsterAbility = {
    name: 'Multiattack',
    description: 'The creature makes two attacks',
    damage: '2d6+3',
    usage: '1/Turn',
  }

  it('should validate a complete ability', () => {
    const result = MonsterAbilitySchema.safeParse(validAbility)
    expect(result.success).toBe(true)
  })

  it('should validate ability without damage', () => {
    const { damage, ...noDamage } = validAbility
    const result = MonsterAbilitySchema.safeParse(noDamage)
    expect(result.success).toBe(true)
  })

  it('should validate ability without usage', () => {
    const { usage, ...noUsage } = validAbility
    const result = MonsterAbilitySchema.safeParse(noUsage)
    expect(result.success).toBe(true)
  })

  it('should reject ability with empty name', () => {
    const emptyName = { ...validAbility, name: '' }
    const result = MonsterAbilitySchema.safeParse(emptyName)
    expect(result.success).toBe(false)
  })

  it('should reject ability with empty description', () => {
    const emptyDesc = { ...validAbility, description: '' }
    const result = MonsterAbilitySchema.safeParse(emptyDesc)
    expect(result.success).toBe(false)
  })
})

describe('MonsterSchema', () => {
  const validMonster: Monster = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    name: 'Goblin Shaman',
    type: 'Humanoid',
    armorClass: 13,
    hitPoints: 27,
    damage: '1d6+1',
    abilities: [
      {
        name: 'Spellcasting',
        description: 'Can cast minor spells',
        usage: '3/Day',
      },
    ],
    challenge: 1,
    size: 'Small',
    speed: 30,
    avatarSeed: 'goblin-shaman',
    createdAt: '2026-01-20T10:00:00.000Z',
    updatedAt: '2026-01-20T10:00:00.000Z',
  }

  describe('valid data', () => {
    it('should validate a complete monster', () => {
      const result = MonsterSchema.safeParse(validMonster)
      expect(result.success).toBe(true)
    })

    it('should validate monster with optional description', () => {
      const withDesc = { ...validMonster, description: 'A cunning goblin spellcaster' }
      const result = MonsterSchema.safeParse(withDesc)
      expect(result.success).toBe(true)
    })

    it('should validate monster with empty abilities', () => {
      const noAbilities = { ...validMonster, abilities: [] }
      const result = MonsterSchema.safeParse(noAbilities)
      expect(result.success).toBe(true)
    })

    it('should validate all monster types', () => {
      const types = [
        'Aberration',
        'Beast',
        'Celestial',
        'Construct',
        'Dragon',
        'Elemental',
        'Fey',
        'Fiend',
        'Giant',
        'Humanoid',
        'Monstrosity',
        'Ooze',
        'Plant',
        'Undead',
        'Xenos',
        'Chaos',
        'Daemon',
        'Heretic',
        'Other',
      ]
      types.forEach((type) => {
        const withType = { ...validMonster, type }
        const result = MonsterSchema.safeParse(withType)
        expect(result.success).toBe(true)
      })
    })

    it('should validate all size categories', () => {
      const sizes = ['Tiny', 'Small', 'Medium', 'Large', 'Huge', 'Gargantuan']
      sizes.forEach((size) => {
        const withSize = { ...validMonster, size }
        const result = MonsterSchema.safeParse(withSize)
        expect(result.success).toBe(true)
      })
    })

    it('should validate challenge rating 0.5', () => {
      const cr05 = { ...validMonster, challenge: 0.5 }
      const result = MonsterSchema.safeParse(cr05)
      expect(result.success).toBe(true)
    })

    it('should validate challenge rating 30', () => {
      const cr30 = { ...validMonster, challenge: 30 }
      const result = MonsterSchema.safeParse(cr30)
      expect(result.success).toBe(true)
    })
  })

  describe('invalid data', () => {
    it('should reject monster with invalid dice notation', () => {
      const invalidDice = { ...validMonster, damage: 'invalid' }
      const result = MonsterSchema.safeParse(invalidDice)
      expect(result.success).toBe(false)
    })

    it('should reject monster with empty name', () => {
      const emptyName = { ...validMonster, name: '' }
      const result = MonsterSchema.safeParse(emptyName)
      expect(result.success).toBe(false)
    })

    it('should reject monster with invalid type', () => {
      const invalidType = { ...validMonster, type: 'InvalidType' }
      const result = MonsterSchema.safeParse(invalidType)
      expect(result.success).toBe(false)
    })

    it('should reject monster with AC 0', () => {
      const zeroAc = { ...validMonster, armorClass: 0 }
      const result = MonsterSchema.safeParse(zeroAc)
      expect(result.success).toBe(false)
    })

    it('should reject monster with negative HP', () => {
      const negativeHp = { ...validMonster, hitPoints: -1 }
      const result = MonsterSchema.safeParse(negativeHp)
      expect(result.success).toBe(false)
    })

    it('should reject monster with negative challenge', () => {
      const negativeCr = { ...validMonster, challenge: -1 }
      const result = MonsterSchema.safeParse(negativeCr)
      expect(result.success).toBe(false)
    })

    it('should reject monster with invalid size', () => {
      const invalidSize = { ...validMonster, size: 'Gigantic' }
      const result = MonsterSchema.safeParse(invalidSize)
      expect(result.success).toBe(false)
    })

    it('should reject monster with negative speed', () => {
      const negativeSpeed = { ...validMonster, speed: -1 }
      const result = MonsterSchema.safeParse(negativeSpeed)
      expect(result.success).toBe(false)
    })
  })

  describe('parseMonster', () => {
    it('should parse valid monster data', () => {
      const monster = parseMonster(validMonster)
      expect(monster.name).toBe('Goblin Shaman')
    })

    it('should throw on invalid data', () => {
      expect(() => parseMonster({ name: 'Invalid' })).toThrow()
    })
  })

  describe('validateMonster', () => {
    it('should return success for valid data', () => {
      const result = validateMonster(validMonster)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.name).toBe('Goblin Shaman')
      }
    })

    it('should return error for invalid data', () => {
      const result = validateMonster({ name: 'Invalid' })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues.length).toBeGreaterThan(0)
      }
    })
  })
})

describe('isValidDiceNotation', () => {
  it('should validate standard dice notation', () => {
    expect(isValidDiceNotation('1d6+2')).toBe(true)
    expect(isValidDiceNotation('2d8+4')).toBe(true)
    expect(isValidDiceNotation('3d10+5')).toBe(true)
  })

  it('should validate dice notation with subtraction', () => {
    expect(isValidDiceNotation('1d20-2')).toBe(true)
  })

  it('should validate dice notation without modifier', () => {
    expect(isValidDiceNotation('2d6+0')).toBe(true)
    expect(isValidDiceNotation('1d8+0')).toBe(true)
  })

  it('should reject invalid notation', () => {
    expect(isValidDiceNotation('invalid')).toBe(false)
    expect(isValidDiceNotation('d6+2')).toBe(false)
    expect(isValidDiceNotation('2d')).toBe(false)
    expect(isValidDiceNotation('2d6+')).toBe(false)
  })
})

describe('CreateMonsterSchema', () => {
  it('should validate monster creation data', () => {
    const createData = {
      name: 'New Monster',
      type: 'Beast' as const,
      armorClass: 12,
      hitPoints: 20,
      damage: '1d6+0',
      abilities: [],
      challenge: 0.5,
      size: 'Medium' as const,
      speed: 40,
      avatarSeed: 'beast-seed',
    }
    const result = CreateMonsterSchema.safeParse(createData)
    expect(result.success).toBe(true)
  })

  it('should not require id, createdAt, updatedAt', () => {
    const minimalData = {
      name: 'Minimal Monster',
      type: 'Undead' as const,
      armorClass: 10,
      hitPoints: 15,
      damage: '1d4+0',
      challenge: 1,
      size: 'Medium' as const,
      speed: 20,
    }
    const result = CreateMonsterSchema.safeParse(minimalData)
    expect(result.success).toBe(true)
  })
})

describe('UpdateMonsterSchema', () => {
  it('should require only id for updates', () => {
    const updateData = {
      id: '123e4567-e89b-12d3-a456-426614174000',
    }
    const result = UpdateMonsterSchema.safeParse(updateData)
    expect(result.success).toBe(true)
  })

  it('should allow partial updates', () => {
    const updateData = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      hitPoints: 30,
      challenge: 2,
    }
    const result = UpdateMonsterSchema.safeParse(updateData)
    expect(result.success).toBe(true)
  })

  it('should reject update without id', () => {
    const updateData = {
      hitPoints: 30,
    }
    const result = UpdateMonsterSchema.safeParse(updateData)
    expect(result.success).toBe(false)
  })
})
