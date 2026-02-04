/**
 * Mock Data Factory
 *
 * Generates mock/test data for Characters, Monsters, and Combatants.
 * Useful for testing, development, and seeding demo data.
 *
 * @see __tests__/testing/mockData.test.ts for usage examples
 */

import type { Character, CreateCharacter } from '@/lib/schemas/character.schema'
import type { Monster, CreateMonster, MonsterAbility } from '@/lib/schemas/monster.schema'
import type { Combatant } from '@/lib/schemas/combatant.schema'
import type { Condition } from '@/lib/schemas/condition.schema'

/**
 * Generate a UUID v4 string
 * Simple implementation for testing - not cryptographically secure
 */
export function generateMockUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

/**
 * Generate a timestamp string (ISO 8601 format)
 */
export function generateMockTimestamp(): string {
  return new Date().toISOString()
}

/**
 * Create mock Character with customizable properties
 *
 * @param overrides - Optional properties to override defaults
 * @returns Complete Character object
 *
 * @example
 * ```typescript
 * const character = createMockCharacter()
 * const paladin = createMockCharacter({ characterClass: 'Paladin', level: 5 })
 * ```
 */
export function createMockCharacter(overrides: Partial<Character> = {}): Character {
  const timestamp = generateMockTimestamp()
  return {
    id: generateMockUUID(),
    name: 'Test Character',
    characterClass: 'Fighter',
    level: 1,
    maxHp: 10,
    currentHp: 10,
    armorClass: 10,
    dexModifier: 0,
    avatarSeed: 'test-character-seed',
    conditions: [],
    createdAt: timestamp,
    updatedAt: timestamp,
    ...overrides,
  }
}

/**
 * Create mock Character for creation (without auto-generated fields)
 *
 * @param overrides - Optional properties to override defaults
 * @returns CreateCharacter object
 */
export function createMockCreateCharacter(overrides: Partial<CreateCharacter> = {}): CreateCharacter {
  return {
    name: 'New Character',
    characterClass: 'Fighter',
    level: 1,
    maxHp: 10,
    currentHp: 10,
    armorClass: 10,
    dexModifier: 0,
    avatarSeed: 'new-character-seed',
    conditions: [],
    ...overrides,
  }
}

/**
 * Create mock Monster with customizable properties
 *
 * @param overrides - Optional properties to override defaults
 * @returns Complete Monster object
 *
 * @example
 * ```typescript
 * const monster = createMockMonster()
 * const dragon = createMockMonster({ name: 'Red Dragon', type: 'Dragon', challenge: 20 })
 * ```
 */
export function createMockMonster(overrides: Partial<Monster> = {}): Monster {
  const timestamp = generateMockTimestamp()
  return {
    id: generateMockUUID(),
    name: 'Test Monster',
    type: 'Beast',
    armorClass: 12,
    hitPoints: 20,
    damage: '1d6+0',
    abilities: [],
    challenge: 1,
    size: 'Medium',
    speed: 30,
    avatarSeed: 'test-monster-seed',
    createdAt: timestamp,
    updatedAt: timestamp,
    ...overrides,
  }
}

/**
 * Create mock Monster for creation (without auto-generated fields)
 *
 * @param overrides - Optional properties to override defaults
 * @returns CreateMonster object
 */
export function createMockCreateMonster(overrides: Partial<CreateMonster> = {}): CreateMonster {
  return {
    name: 'New Monster',
    type: 'Beast',
    armorClass: 12,
    hitPoints: 20,
    damage: '1d6+0',
    abilities: [],
    challenge: 1,
    size: 'Medium',
    speed: 30,
    avatarSeed: 'new-monster-seed',
    ...overrides,
  }
}

/**
 * Create mock MonsterAbility
 *
 * @param overrides - Optional properties to override defaults
 * @returns MonsterAbility object
 */
export function createMockMonsterAbility(overrides: Partial<MonsterAbility> = {}): MonsterAbility {
  return {
    name: 'Test Ability',
    description: 'A test ability that does something interesting',
    damage: '2d6+2',
    usage: '1/Day',
    ...overrides,
  }
}

/**
 * Create mock Combatant with customizable properties
 *
 * @param overrides - Optional properties to override defaults
 * @returns Complete Combatant object
 *
 * @example
 * ```typescript
 * const combatant = createMockCombatant()
 * const activeCombatant = createMockCombatant({ isActive: true, initiative: 20 })
 * ```
 */
export function createMockCombatant(overrides: Partial<Combatant> = {}): Combatant {
  const timestamp = generateMockTimestamp()
  return {
    id: generateMockUUID(),
    entityId: generateMockUUID(),
    type: 'character',
    name: 'Test Combatant',
    armorClass: 15,
    maxHp: 30,
    currentHp: 30,
    initiative: 10,
    dexModifier: 0,
    isActive: false,
    conditions: [],
    avatarSeed: 'test-combatant-seed',
    isPlayer: true,
    addedAt: timestamp,
    ...overrides,
  }
}

/**
 * Create an array of mock Characters
 *
 * @param count - Number of characters to create
 * @param overrides - Optional properties to override for all characters
 * @returns Array of Character objects
 *
 * @example
 * ```typescript
 * const party = createMockCharacters(4)
 * const paladins = createMockCharacters(3, { characterClass: 'Paladin' })
 * ```
 */
export function createMockCharacters(count: number, overrides: Partial<Character> = {}): Character[] {
  return Array.from({ length: count }, (_, i) =>
    createMockCharacter({
      name: `Character ${i + 1}`,
      ...overrides,
    })
  )
}

/**
 * Create an array of mock Monsters
 *
 * @param count - Number of monsters to create
 * @param overrides - Optional properties to override for all monsters
 * @returns Array of Monster objects
 *
 * @example
 * ```typescript
 * const goblins = createMockMonsters(5, { name: 'Goblin', type: 'Humanoid' })
 * ```
 */
export function createMockMonsters(count: number, overrides: Partial<Monster> = {}): Monster[] {
  return Array.from({ length: count }, (_, i) =>
    createMockMonster({
      name: `Monster ${i + 1}`,
      ...overrides,
    })
  )
}

/**
 * Create an array of mock Combatants
 *
 * @param count - Number of combatants to create
 * @param overrides - Optional properties to override for all combatants
 * @returns Array of Combatant objects
 *
 * @example
 * ```typescript
 * const combatants = createMockCombatants(6)
 * const enemies = createMockCombatants(3, { type: 'monster', isPlayer: false })
 * ```
 */
export function createMockCombatants(count: number, overrides: Partial<Combatant> = {}): Combatant[] {
  return Array.from({ length: count }, (_, i) =>
    createMockCombatant({
      name: `Combatant ${i + 1}`,
      initiative: 20 - i * 2, // Descending initiative
      ...overrides,
    })
  )
}

/**
 * Pre-defined mock Characters for common use cases
 */
export const MOCK_CHARACTERS = {
  paladin: createMockCharacter({
    name: 'Raul the Brave',
    characterClass: 'Paladin',
    level: 5,
    maxHp: 45,
    currentHp: 45,
    armorClass: 18,
    avatarSeed: 'raul-paladin',
  }),
  rogue: createMockCharacter({
    name: 'Shadow',
    characterClass: 'Rogue',
    level: 4,
    maxHp: 28,
    currentHp: 28,
    armorClass: 15,
    avatarSeed: 'shadow-rogue',
  }),
  wizard: createMockCharacter({
    name: 'Elara Moonshadow',
    characterClass: 'Wizard',
    level: 6,
    maxHp: 30,
    currentHp: 30,
    armorClass: 12,
    avatarSeed: 'elara-wizard',
  }),
  fighter: createMockCharacter({
    name: 'Grom',
    characterClass: 'Fighter',
    level: 3,
    maxHp: 32,
    currentHp: 32,
    armorClass: 16,
    avatarSeed: 'grom-fighter',
  }),
  wounded: createMockCharacter({
    name: 'Wounded Hero',
    characterClass: 'Fighter',
    level: 3,
    maxHp: 30,
    currentHp: 8, // Bloodied
    armorClass: 14,
    conditions: ['Poisoned', 'Frightened'],
  }),
  unconscious: createMockCharacter({
    name: 'Unconscious Hero',
    characterClass: 'Cleric',
    level: 2,
    maxHp: 20,
    currentHp: 0, // Defeated
    armorClass: 13,
    conditions: ['Prone'],
  }),
}

/**
 * Pre-defined mock Monsters for common use cases
 */
export const MOCK_MONSTERS = {
  goblin: createMockMonster({
    name: 'Goblin',
    type: 'Humanoid',
    armorClass: 13,
    hitPoints: 7,
    damage: '1d6+0',
    challenge: 0.25,
    size: 'Small',
    speed: 30,
  }),
  goblinShaman: createMockMonster({
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
  }),
  orc: createMockMonster({
    name: 'Orc Warrior',
    type: 'Humanoid',
    armorClass: 13,
    hitPoints: 15,
    damage: '1d12+3',
    challenge: 0.5,
    size: 'Medium',
    speed: 30,
  }),
  dragon: createMockMonster({
    name: 'Young Red Dragon',
    type: 'Dragon',
    armorClass: 18,
    hitPoints: 178,
    damage: '2d10+6',
    abilities: [
      {
        name: 'Fire Breath',
        description: 'Exhales fire in a 30-foot cone',
        damage: '16d6+0',
        usage: 'Recharge 5-6',
      },
      {
        name: 'Multiattack',
        description: 'Makes three attacks: one bite and two claws',
      },
    ],
    challenge: 10,
    size: 'Large',
    speed: 40,
  }),
  zombie: createMockMonster({
    name: 'Zombie',
    type: 'Undead',
    armorClass: 8,
    hitPoints: 22,
    damage: '1d6+1',
    challenge: 0.25,
    size: 'Medium',
    speed: 20,
  }),
}

/**
 * Pre-defined mock Combatants for testing combat scenarios
 */
export const MOCK_COMBATANTS = {
  activePaladin: createMockCombatant({
    name: 'Raul the Brave',
    type: 'character',
    armorClass: 18,
    maxHp: 45,
    currentHp: 45,
    initiative: 18,
    isActive: true,
    isPlayer: true,
  }),
  rogue: createMockCombatant({
    name: 'Shadow',
    type: 'character',
    armorClass: 15,
    maxHp: 28,
    currentHp: 28,
    initiative: 22,
    isActive: false,
    isPlayer: true,
  }),
  goblin1: createMockCombatant({
    name: 'Goblin 1',
    type: 'monster',
    armorClass: 13,
    maxHp: 7,
    currentHp: 7,
    initiative: 12,
    isActive: false,
    isPlayer: false,
  }),
  goblin2: createMockCombatant({
    name: 'Goblin 2',
    type: 'monster',
    armorClass: 13,
    maxHp: 7,
    currentHp: 3, // Bloodied
    initiative: 10,
    isActive: false,
    isPlayer: false,
    conditions: ['Poisoned'],
  }),
  defeatedOrc: createMockCombatant({
    name: 'Orc Warrior',
    type: 'monster',
    armorClass: 13,
    maxHp: 15,
    currentHp: 0, // Defeated
    initiative: 8,
    isActive: false,
    isPlayer: false,
  }),
}

/**
 * Create a mock combat encounter with players and monsters
 *
 * @param playerCount - Number of player characters
 * @param monsterCount - Number of monsters
 * @returns Object with characters, monsters, and combatants arrays
 *
 * @example
 * ```typescript
 * const encounter = createMockEncounter(4, 3)
 * // encounter.characters - 4 player characters
 * // encounter.monsters - 3 monsters
 * // encounter.combatants - 7 combatants (sorted by initiative)
 * ```
 */
export function createMockEncounter(playerCount: number, monsterCount: number) {
  const characters = createMockCharacters(playerCount)
  const monsters = createMockMonsters(monsterCount)

  const combatants: Combatant[] = [
    ...characters.map((char, i) =>
      createMockCombatant({
        entityId: char.id,
        type: 'character',
        name: char.name,
        armorClass: char.armorClass,
        maxHp: char.maxHp,
        currentHp: char.currentHp,
        initiative: 20 - i,
        isPlayer: true,
      })
    ),
    ...monsters.map((monster, i) =>
      createMockCombatant({
        entityId: monster.id,
        type: 'monster',
        name: `${monster.name} ${i + 1}`,
        armorClass: monster.armorClass,
        maxHp: monster.hitPoints,
        currentHp: monster.hitPoints,
        initiative: 15 - i,
        isPlayer: false,
      })
    ),
  ].sort((a, b) => b.initiative - a.initiative) // Sort by initiative descending

  // Set first combatant as active
  if (combatants.length > 0) {
    combatants[0] = { ...combatants[0], isActive: true }
  }

  return {
    characters,
    monsters,
    combatants,
  }
}
