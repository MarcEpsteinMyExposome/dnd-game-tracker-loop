/**
 * Mock Data Factory Tests
 *
 * Tests for mockData.ts factory functions
 */

import {
  generateMockUUID,
  generateMockTimestamp,
  createMockCharacter,
  createMockCreateCharacter,
  createMockMonster,
  createMockCreateMonster,
  createMockMonsterAbility,
  createMockCombatant,
  createMockCharacters,
  createMockMonsters,
  createMockCombatants,
  createMockEncounter,
  MOCK_CHARACTERS,
  MOCK_MONSTERS,
  MOCK_COMBATANTS,
} from '@/lib/testing/mockData'
import { CharacterSchema, CreateCharacterSchema } from '@/lib/schemas/character.schema'
import { MonsterSchema, CreateMonsterSchema, MonsterAbilitySchema } from '@/lib/schemas/monster.schema'
import { CombatantSchema } from '@/lib/schemas/combatant.schema'

describe('generateMockUUID', () => {
  it('should generate a valid UUID format', () => {
    const uuid = generateMockUUID()
    expect(uuid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)
  })

  it('should generate unique UUIDs', () => {
    const uuid1 = generateMockUUID()
    const uuid2 = generateMockUUID()
    expect(uuid1).not.toBe(uuid2)
  })
})

describe('generateMockTimestamp', () => {
  it('should generate a valid ISO 8601 timestamp', () => {
    const timestamp = generateMockTimestamp()
    expect(() => new Date(timestamp)).not.toThrow()
    expect(timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/)
  })
})

describe('createMockCharacter', () => {
  it('should create a valid Character', () => {
    const character = createMockCharacter()
    const result = CharacterSchema.safeParse(character)
    expect(result.success).toBe(true)
  })

  it('should allow overriding properties', () => {
    const character = createMockCharacter({ name: 'Custom Name', level: 10 })
    expect(character.name).toBe('Custom Name')
    expect(character.level).toBe(10)
  })

  it('should have default values', () => {
    const character = createMockCharacter()
    expect(character.characterClass).toBe('Fighter')
    expect(character.level).toBe(1)
    expect(character.maxHp).toBe(10)
  })

  it('should generate unique IDs', () => {
    const char1 = createMockCharacter()
    const char2 = createMockCharacter()
    expect(char1.id).not.toBe(char2.id)
  })
})

describe('createMockCreateCharacter', () => {
  it('should create a valid CreateCharacter', () => {
    const character = createMockCreateCharacter()
    const result = CreateCharacterSchema.safeParse(character)
    expect(result.success).toBe(true)
  })

  it('should not include id, createdAt, updatedAt', () => {
    const character = createMockCreateCharacter()
    expect(character).not.toHaveProperty('id')
    expect(character).not.toHaveProperty('createdAt')
    expect(character).not.toHaveProperty('updatedAt')
  })

  it('should allow overriding properties', () => {
    const character = createMockCreateCharacter({ name: 'New Hero', level: 5 })
    expect(character.name).toBe('New Hero')
    expect(character.level).toBe(5)
  })
})

describe('createMockMonster', () => {
  it('should create a valid Monster', () => {
    const monster = createMockMonster()
    const result = MonsterSchema.safeParse(monster)
    expect(result.success).toBe(true)
  })

  it('should allow overriding properties', () => {
    const monster = createMockMonster({ name: 'Dragon', type: 'Dragon', challenge: 10 })
    expect(monster.name).toBe('Dragon')
    expect(monster.type).toBe('Dragon')
    expect(monster.challenge).toBe(10)
  })

  it('should have default values', () => {
    const monster = createMockMonster()
    expect(monster.type).toBe('Beast')
    expect(monster.challenge).toBe(1)
    expect(monster.size).toBe('Medium')
  })

  it('should generate unique IDs', () => {
    const monster1 = createMockMonster()
    const monster2 = createMockMonster()
    expect(monster1.id).not.toBe(monster2.id)
  })
})

describe('createMockCreateMonster', () => {
  it('should create a valid CreateMonster', () => {
    const monster = createMockCreateMonster()
    const result = CreateMonsterSchema.safeParse(monster)
    expect(result.success).toBe(true)
  })

  it('should not include id, createdAt, updatedAt', () => {
    const monster = createMockCreateMonster()
    expect(monster).not.toHaveProperty('id')
    expect(monster).not.toHaveProperty('createdAt')
    expect(monster).not.toHaveProperty('updatedAt')
  })
})

describe('createMockMonsterAbility', () => {
  it('should create a valid MonsterAbility', () => {
    const ability = createMockMonsterAbility()
    const result = MonsterAbilitySchema.safeParse(ability)
    expect(result.success).toBe(true)
  })

  it('should allow overriding properties', () => {
    const ability = createMockMonsterAbility({ name: 'Fire Breath', damage: '3d6+0' })
    expect(ability.name).toBe('Fire Breath')
    expect(ability.damage).toBe('3d6+0')
  })
})

describe('createMockCombatant', () => {
  it('should create a valid Combatant', () => {
    const combatant = createMockCombatant()
    const result = CombatantSchema.safeParse(combatant)
    expect(result.success).toBe(true)
  })

  it('should allow overriding properties', () => {
    const combatant = createMockCombatant({ name: 'Hero', initiative: 20, isActive: true })
    expect(combatant.name).toBe('Hero')
    expect(combatant.initiative).toBe(20)
    expect(combatant.isActive).toBe(true)
  })

  it('should default to character type and player', () => {
    const combatant = createMockCombatant()
    expect(combatant.type).toBe('character')
    expect(combatant.isPlayer).toBe(true)
  })

  it('should generate unique IDs', () => {
    const combatant1 = createMockCombatant()
    const combatant2 = createMockCombatant()
    expect(combatant1.id).not.toBe(combatant2.id)
  })
})

describe('createMockCharacters', () => {
  it('should create specified number of characters', () => {
    const characters = createMockCharacters(3)
    expect(characters).toHaveLength(3)
  })

  it('should create valid Characters', () => {
    const characters = createMockCharacters(2)
    characters.forEach((character) => {
      const result = CharacterSchema.safeParse(character)
      expect(result.success).toBe(true)
    })
  })

  it('should apply overrides to all characters', () => {
    const characters = createMockCharacters(3, { characterClass: 'Paladin' })
    characters.forEach((character) => {
      expect(character.characterClass).toBe('Paladin')
    })
  })

  it('should generate unique names', () => {
    const characters = createMockCharacters(3)
    expect(characters[0].name).toBe('Character 1')
    expect(characters[1].name).toBe('Character 2')
    expect(characters[2].name).toBe('Character 3')
  })
})

describe('createMockMonsters', () => {
  it('should create specified number of monsters', () => {
    const monsters = createMockMonsters(4)
    expect(monsters).toHaveLength(4)
  })

  it('should create valid Monsters', () => {
    const monsters = createMockMonsters(2)
    monsters.forEach((monster) => {
      const result = MonsterSchema.safeParse(monster)
      expect(result.success).toBe(true)
    })
  })

  it('should apply overrides to all monsters', () => {
    const monsters = createMockMonsters(3, { type: 'Undead' })
    monsters.forEach((monster) => {
      expect(monster.type).toBe('Undead')
    })
  })
})

describe('createMockCombatants', () => {
  it('should create specified number of combatants', () => {
    const combatants = createMockCombatants(5)
    expect(combatants).toHaveLength(5)
  })

  it('should create valid Combatants', () => {
    const combatants = createMockCombatants(2)
    combatants.forEach((combatant) => {
      const result = CombatantSchema.safeParse(combatant)
      expect(result.success).toBe(true)
    })
  })

  it('should generate descending initiative values', () => {
    const combatants = createMockCombatants(3)
    expect(combatants[0].initiative).toBeGreaterThan(combatants[1].initiative)
    expect(combatants[1].initiative).toBeGreaterThan(combatants[2].initiative)
  })

  it('should apply overrides to all combatants', () => {
    const combatants = createMockCombatants(3, { type: 'monster', isPlayer: false })
    combatants.forEach((combatant) => {
      expect(combatant.type).toBe('monster')
      expect(combatant.isPlayer).toBe(false)
    })
  })
})

describe('MOCK_CHARACTERS', () => {
  it('should have predefined characters', () => {
    expect(MOCK_CHARACTERS.paladin).toBeDefined()
    expect(MOCK_CHARACTERS.rogue).toBeDefined()
    expect(MOCK_CHARACTERS.wizard).toBeDefined()
    expect(MOCK_CHARACTERS.fighter).toBeDefined()
    expect(MOCK_CHARACTERS.wounded).toBeDefined()
    expect(MOCK_CHARACTERS.unconscious).toBeDefined()
  })

  it('should have valid Character data', () => {
    Object.values(MOCK_CHARACTERS).forEach((character) => {
      const result = CharacterSchema.safeParse(character)
      expect(result.success).toBe(true)
    })
  })

  it('should have wounded character with low HP', () => {
    const wounded = MOCK_CHARACTERS.wounded
    expect(wounded.currentHp).toBeLessThan(wounded.maxHp * 0.5)
  })

  it('should have unconscious character with 0 HP', () => {
    const unconscious = MOCK_CHARACTERS.unconscious
    expect(unconscious.currentHp).toBe(0)
  })
})

describe('MOCK_MONSTERS', () => {
  it('should have predefined monsters', () => {
    expect(MOCK_MONSTERS.goblin).toBeDefined()
    expect(MOCK_MONSTERS.goblinShaman).toBeDefined()
    expect(MOCK_MONSTERS.orc).toBeDefined()
    expect(MOCK_MONSTERS.dragon).toBeDefined()
    expect(MOCK_MONSTERS.zombie).toBeDefined()
  })

  it('should have valid Monster data', () => {
    Object.values(MOCK_MONSTERS).forEach((monster) => {
      const result = MonsterSchema.safeParse(monster)
      expect(result.success).toBe(true)
    })
  })

  it('should have dragon with abilities', () => {
    const dragon = MOCK_MONSTERS.dragon
    expect(dragon.abilities.length).toBeGreaterThan(0)
  })
})

describe('MOCK_COMBATANTS', () => {
  it('should have predefined combatants', () => {
    expect(MOCK_COMBATANTS.activePaladin).toBeDefined()
    expect(MOCK_COMBATANTS.rogue).toBeDefined()
    expect(MOCK_COMBATANTS.goblin1).toBeDefined()
    expect(MOCK_COMBATANTS.goblin2).toBeDefined()
    expect(MOCK_COMBATANTS.defeatedOrc).toBeDefined()
  })

  it('should have valid Combatant data', () => {
    Object.values(MOCK_COMBATANTS).forEach((combatant) => {
      const result = CombatantSchema.safeParse(combatant)
      expect(result.success).toBe(true)
    })
  })

  it('should have active paladin with isActive true', () => {
    expect(MOCK_COMBATANTS.activePaladin.isActive).toBe(true)
  })

  it('should have defeated orc with 0 HP', () => {
    expect(MOCK_COMBATANTS.defeatedOrc.currentHp).toBe(0)
  })
})

describe('createMockEncounter', () => {
  it('should create encounter with correct counts', () => {
    const encounter = createMockEncounter(3, 2)
    expect(encounter.characters).toHaveLength(3)
    expect(encounter.monsters).toHaveLength(2)
    expect(encounter.combatants).toHaveLength(5)
  })

  it('should have valid data in all arrays', () => {
    const encounter = createMockEncounter(2, 2)

    encounter.characters.forEach((character) => {
      const result = CharacterSchema.safeParse(character)
      expect(result.success).toBe(true)
    })

    encounter.monsters.forEach((monster) => {
      const result = MonsterSchema.safeParse(monster)
      expect(result.success).toBe(true)
    })

    encounter.combatants.forEach((combatant) => {
      const result = CombatantSchema.safeParse(combatant)
      expect(result.success).toBe(true)
    })
  })

  it('should sort combatants by initiative descending', () => {
    const encounter = createMockEncounter(3, 2)
    for (let i = 0; i < encounter.combatants.length - 1; i++) {
      expect(encounter.combatants[i].initiative).toBeGreaterThanOrEqual(
        encounter.combatants[i + 1].initiative
      )
    }
  })

  it('should mark first combatant as active', () => {
    const encounter = createMockEncounter(2, 2)
    expect(encounter.combatants[0].isActive).toBe(true)
    expect(encounter.combatants.slice(1).every((c) => !c.isActive)).toBe(true)
  })

  it('should have correct player/monster types', () => {
    const encounter = createMockEncounter(2, 2)
    const players = encounter.combatants.filter((c) => c.isPlayer)
    const enemies = encounter.combatants.filter((c) => !c.isPlayer)
    expect(players).toHaveLength(2)
    expect(enemies).toHaveLength(2)
  })
})
