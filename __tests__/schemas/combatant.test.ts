/**
 * Combatant Schema Tests
 *
 * Tests for combatant.schema.ts validation and helper functions
 */

import {
  CombatantSchema,
  parseCombatant,
  validateCombatant,
  createCombatantFromCharacter,
  createCombatantFromMonster,
  isCombatantDefeated,
  isCombatantBloodied,
  getCombatantHpPercentage,
  sortByInitiative,
  getActiveCombatant,
  getNextCombatant,
  type Combatant,
} from '@/lib/schemas/combatant.schema'
import type { Character } from '@/lib/schemas/character.schema'
import type { Monster } from '@/lib/schemas/monster.schema'

describe('CombatantSchema', () => {
  const validCombatant: Combatant = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    entityId: 'abc12345-e89b-12d3-a456-426614174000',
    type: 'character',
    name: 'Raul the Brave',
    armorClass: 18,
    maxHp: 45,
    currentHp: 32,
    initiative: 15,
    isActive: true,
    conditions: ['Poisoned'],
    avatarSeed: 'raul-paladin',
    isPlayer: true,
    addedAt: '2026-01-20T10:00:00.000Z',
  }

  describe('valid data', () => {
    it('should validate a complete combatant', () => {
      const result = CombatantSchema.safeParse(validCombatant)
      expect(result.success).toBe(true)
    })

    it('should validate character type combatant', () => {
      const result = CombatantSchema.safeParse(validCombatant)
      expect(result.success).toBe(true)
    })

    it('should validate monster type combatant', () => {
      const monster = { ...validCombatant, type: 'monster' as const, isPlayer: false }
      const result = CombatantSchema.safeParse(monster)
      expect(result.success).toBe(true)
    })

    it('should validate combatant with optional notes', () => {
      const withNotes = { ...validCombatant, notes: 'Focus fire on this one' }
      const result = CombatantSchema.safeParse(withNotes)
      expect(result.success).toBe(true)
    })

    it('should validate combatant with 0 HP', () => {
      const defeated = { ...validCombatant, currentHp: 0 }
      const result = CombatantSchema.safeParse(defeated)
      expect(result.success).toBe(true)
    })

    it('should validate combatant with negative initiative', () => {
      const negInit = { ...validCombatant, initiative: -5 }
      const result = CombatantSchema.safeParse(negInit)
      expect(result.success).toBe(true)
    })
  })

  describe('invalid data', () => {
    it('should reject combatant with invalid type', () => {
      const invalidType = { ...validCombatant, type: 'invalid' }
      const result = CombatantSchema.safeParse(invalidType)
      expect(result.success).toBe(false)
    })

    it('should reject combatant with negative HP', () => {
      const negHp = { ...validCombatant, currentHp: -1 }
      const result = CombatantSchema.safeParse(negHp)
      expect(result.success).toBe(false)
    })

    it('should reject combatant with AC 0', () => {
      const zeroAc = { ...validCombatant, armorClass: 0 }
      const result = CombatantSchema.safeParse(zeroAc)
      expect(result.success).toBe(false)
    })

    it('should reject combatant with empty name', () => {
      const emptyName = { ...validCombatant, name: '' }
      const result = CombatantSchema.safeParse(emptyName)
      expect(result.success).toBe(false)
    })
  })

  describe('parseCombatant', () => {
    it('should parse valid combatant data', () => {
      const combatant = parseCombatant(validCombatant)
      expect(combatant.name).toBe('Raul the Brave')
    })

    it('should throw on invalid data', () => {
      expect(() => parseCombatant({ name: 'Invalid' })).toThrow()
    })
  })

  describe('validateCombatant', () => {
    it('should return success for valid data', () => {
      const result = validateCombatant(validCombatant)
      expect(result.success).toBe(true)
    })

    it('should return error for invalid data', () => {
      const result = validateCombatant({ name: 'Invalid' })
      expect(result.success).toBe(false)
    })
  })
})

describe('createCombatantFromCharacter', () => {
  const mockCharacter: Character = {
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

  it('should create combatant from character', () => {
    const combatant = createCombatantFromCharacter(mockCharacter)
    expect(combatant.entityId).toBe(mockCharacter.id)
    expect(combatant.type).toBe('character')
    expect(combatant.name).toBe(mockCharacter.name)
    expect(combatant.isPlayer).toBe(true)
  })

  it('should use custom initiative if provided', () => {
    const combatant = createCombatantFromCharacter(mockCharacter, 20)
    expect(combatant.initiative).toBe(20)
  })

  it('should default initiative to AC if not provided', () => {
    const combatant = createCombatantFromCharacter(mockCharacter)
    expect(combatant.initiative).toBe(mockCharacter.armorClass)
  })

  it('should copy conditions from character', () => {
    const combatant = createCombatantFromCharacter(mockCharacter)
    expect(combatant.conditions).toEqual(['Poisoned'])
  })

  it('should set isActive to false', () => {
    const combatant = createCombatantFromCharacter(mockCharacter)
    expect(combatant.isActive).toBe(false)
  })
})

describe('createCombatantFromMonster', () => {
  const mockMonster: Monster = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    name: 'Goblin Shaman',
    type: 'Humanoid',
    armorClass: 13,
    hitPoints: 27,
    damage: '1d6+1',
    abilities: [],
    challenge: 1,
    size: 'Small',
    speed: 30,
    avatarSeed: 'goblin-shaman',
    createdAt: '2026-01-20T10:00:00.000Z',
    updatedAt: '2026-01-20T10:00:00.000Z',
  }

  it('should create combatant from monster', () => {
    const combatant = createCombatantFromMonster(mockMonster)
    expect(combatant.entityId).toBe(mockMonster.id)
    expect(combatant.type).toBe('monster')
    expect(combatant.name).toBe(mockMonster.name)
    expect(combatant.isPlayer).toBe(false)
  })

  it('should use custom initiative if provided', () => {
    const combatant = createCombatantFromMonster(mockMonster, 12)
    expect(combatant.initiative).toBe(12)
  })

  it('should default initiative to AC if not provided', () => {
    const combatant = createCombatantFromMonster(mockMonster)
    expect(combatant.initiative).toBe(mockMonster.armorClass)
  })

  it('should use instance name if provided', () => {
    const combatant = createCombatantFromMonster(mockMonster, 12, 'Goblin 1')
    expect(combatant.name).toBe('Goblin 1')
  })

  it('should use monster name if instance name not provided', () => {
    const combatant = createCombatantFromMonster(mockMonster)
    expect(combatant.name).toBe(mockMonster.name)
  })

  it('should set currentHp to full HP', () => {
    const combatant = createCombatantFromMonster(mockMonster)
    expect(combatant.currentHp).toBe(mockMonster.hitPoints)
  })

  it('should initialize with no conditions', () => {
    const combatant = createCombatantFromMonster(mockMonster)
    expect(combatant.conditions).toEqual([])
  })
})

describe('isCombatantDefeated', () => {
  const mockCombatant: Combatant = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    entityId: 'abc12345-e89b-12d3-a456-426614174000',
    type: 'character',
    name: 'Test',
    armorClass: 10,
    maxHp: 50,
    currentHp: 25,
    initiative: 10,
    isActive: false,
    conditions: [],
    avatarSeed: 'test',
    isPlayer: true,
    addedAt: '2026-01-20T10:00:00.000Z',
  }

  it('should return false for combatant with HP > 0', () => {
    expect(isCombatantDefeated(mockCombatant)).toBe(false)
  })

  it('should return true for combatant with HP = 0', () => {
    const defeated = { ...mockCombatant, currentHp: 0 }
    expect(isCombatantDefeated(defeated)).toBe(true)
  })
})

describe('isCombatantBloodied', () => {
  const mockCombatant: Combatant = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    entityId: 'abc12345-e89b-12d3-a456-426614174000',
    type: 'character',
    name: 'Test',
    armorClass: 10,
    maxHp: 100,
    currentHp: 60,
    initiative: 10,
    isActive: false,
    conditions: [],
    avatarSeed: 'test',
    isPlayer: true,
    addedAt: '2026-01-20T10:00:00.000Z',
  }

  it('should return false for combatant above 50% HP', () => {
    expect(isCombatantBloodied(mockCombatant)).toBe(false)
  })

  it('should return true for combatant at 50% HP', () => {
    const bloodied = { ...mockCombatant, currentHp: 50 }
    expect(isCombatantBloodied(bloodied)).toBe(true)
  })

  it('should return true for combatant below 50% HP', () => {
    const bloodied = { ...mockCombatant, currentHp: 25 }
    expect(isCombatantBloodied(bloodied)).toBe(true)
  })
})

describe('getCombatantHpPercentage', () => {
  const mockCombatant: Combatant = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    entityId: 'abc12345-e89b-12d3-a456-426614174000',
    type: 'character',
    name: 'Test',
    armorClass: 10,
    maxHp: 100,
    currentHp: 75,
    initiative: 10,
    isActive: false,
    conditions: [],
    avatarSeed: 'test',
    isPlayer: true,
    addedAt: '2026-01-20T10:00:00.000Z',
  }

  it('should calculate correct HP percentage', () => {
    expect(getCombatantHpPercentage(mockCombatant)).toBe(75)
  })

  it('should return 100 for full HP', () => {
    const full = { ...mockCombatant, currentHp: 100 }
    expect(getCombatantHpPercentage(full)).toBe(100)
  })

  it('should return 0 for 0 HP', () => {
    const zero = { ...mockCombatant, currentHp: 0 }
    expect(getCombatantHpPercentage(zero)).toBe(0)
  })

  it('should handle maxHp of 0', () => {
    const zeroMax = { ...mockCombatant, maxHp: 0, currentHp: 0 }
    expect(getCombatantHpPercentage(zeroMax)).toBe(0)
  })
})

describe('sortByInitiative', () => {
  const combatants: Combatant[] = [
    {
      id: '1',
      entityId: 'e1',
      type: 'character',
      name: 'Low Init',
      armorClass: 10,
      maxHp: 50,
      currentHp: 50,
      initiative: 5,
      isActive: false,
      conditions: [],
      avatarSeed: 'test',
      isPlayer: true,
      addedAt: '2026-01-20T10:00:00.000Z',
    },
    {
      id: '2',
      entityId: 'e2',
      type: 'character',
      name: 'High Init',
      armorClass: 10,
      maxHp: 50,
      currentHp: 50,
      initiative: 20,
      isActive: false,
      conditions: [],
      avatarSeed: 'test',
      isPlayer: true,
      addedAt: '2026-01-20T10:00:00.000Z',
    },
    {
      id: '3',
      entityId: 'e3',
      type: 'character',
      name: 'Mid Init',
      armorClass: 10,
      maxHp: 50,
      currentHp: 50,
      initiative: 12,
      isActive: false,
      conditions: [],
      avatarSeed: 'test',
      isPlayer: true,
      addedAt: '2026-01-20T10:00:00.000Z',
    },
  ]

  it('should sort combatants by initiative descending', () => {
    const sorted = sortByInitiative(combatants)
    expect(sorted[0].initiative).toBe(20)
    expect(sorted[1].initiative).toBe(12)
    expect(sorted[2].initiative).toBe(5)
  })

  it('should not mutate original array', () => {
    const original = [...combatants]
    sortByInitiative(combatants)
    expect(combatants).toEqual(original)
  })
})

describe('getActiveCombatant', () => {
  const combatants: Combatant[] = [
    {
      id: '1',
      entityId: 'e1',
      type: 'character',
      name: 'Inactive',
      armorClass: 10,
      maxHp: 50,
      currentHp: 50,
      initiative: 5,
      isActive: false,
      conditions: [],
      avatarSeed: 'test',
      isPlayer: true,
      addedAt: '2026-01-20T10:00:00.000Z',
    },
    {
      id: '2',
      entityId: 'e2',
      type: 'character',
      name: 'Active',
      armorClass: 10,
      maxHp: 50,
      currentHp: 50,
      initiative: 20,
      isActive: true,
      conditions: [],
      avatarSeed: 'test',
      isPlayer: true,
      addedAt: '2026-01-20T10:00:00.000Z',
    },
  ]

  it('should return active combatant', () => {
    const active = getActiveCombatant(combatants)
    expect(active?.name).toBe('Active')
  })

  it('should return undefined if no active combatant', () => {
    const noActive = combatants.map((c) => ({ ...c, isActive: false }))
    const active = getActiveCombatant(noActive)
    expect(active).toBeUndefined()
  })
})

describe('getNextCombatant', () => {
  const combatants: Combatant[] = [
    {
      id: '1',
      entityId: 'e1',
      type: 'character',
      name: 'First',
      armorClass: 10,
      maxHp: 50,
      currentHp: 50,
      initiative: 20,
      isActive: false,
      conditions: [],
      avatarSeed: 'test',
      isPlayer: true,
      addedAt: '2026-01-20T10:00:00.000Z',
    },
    {
      id: '2',
      entityId: 'e2',
      type: 'character',
      name: 'Second',
      armorClass: 10,
      maxHp: 50,
      currentHp: 50,
      initiative: 15,
      isActive: false,
      conditions: [],
      avatarSeed: 'test',
      isPlayer: true,
      addedAt: '2026-01-20T10:00:00.000Z',
    },
    {
      id: '3',
      entityId: 'e3',
      type: 'character',
      name: 'Third',
      armorClass: 10,
      maxHp: 50,
      currentHp: 50,
      initiative: 10,
      isActive: false,
      conditions: [],
      avatarSeed: 'test',
      isPlayer: true,
      addedAt: '2026-01-20T10:00:00.000Z',
    },
  ]

  it('should return next combatant in order', () => {
    const next = getNextCombatant(combatants, '1')
    expect(next?.name).toBe('Second')
  })

  it('should cycle back to first when at end', () => {
    const next = getNextCombatant(combatants, '3')
    expect(next?.name).toBe('First')
  })

  it('should return first if current not found', () => {
    const next = getNextCombatant(combatants, 'invalid-id')
    expect(next?.name).toBe('First')
  })

  it('should return undefined for empty array', () => {
    const next = getNextCombatant([], '1')
    expect(next).toBeUndefined()
  })
})
