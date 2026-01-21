/**
 * Monster Library Data
 *
 * Pre-defined monsters for D&D/Warhammer 40K games.
 * All monsters are SRD-compliant and use generic fantasy/sci-fi archetypes.
 *
 * Categories:
 * - Beast: Natural creatures
 * - Humanoid: Sentient creatures (goblins, orcs, etc.)
 * - Undead: Reanimated creatures
 * - Xenos: Alien creatures (W40K)
 * - Chaos: Chaos-corrupted entities (W40K)
 * - Fiend: Demonic entities
 *
 * @see lib/schemas/monster.schema.ts - Monster schema definition
 */

import { Monster, MonsterType } from '../schemas/monster.schema'
import { randomUUID } from 'crypto'

/**
 * All pre-defined monsters in the library
 * Organized by challenge rating (low to high)
 */
export const MONSTERS: Monster[] = [
  // ========================================
  // CR 0.25 - 1: Weak enemies
  // ========================================
  {
    id: randomUUID(),
    name: 'Goblin Scout',
    type: 'Humanoid',
    armorClass: 13,
    hitPoints: 7,
    damage: '1d6+1',
    abilities: [
      {
        name: 'Nimble Escape',
        description: 'Can take the Disengage or Hide action as a bonus action on each turn.',
      },
    ],
    challenge: 0.25,
    size: 'Small',
    speed: 30,
    avatarSeed: 'goblin-scout',
    description: 'Small, cunning humanoid creatures that live in dark caves and forests.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: randomUUID(),
    name: 'Zombie',
    type: 'Undead',
    armorClass: 8,
    hitPoints: 22,
    damage: '1d6+1',
    abilities: [
      {
        name: 'Undead Fortitude',
        description:
          'If damage reduces the zombie to 0 HP, it must make a Constitution saving throw. On success, drop to 1 HP instead.',
        usage: '1/Day',
      },
    ],
    challenge: 0.25,
    size: 'Medium',
    speed: 20,
    avatarSeed: 'zombie',
    description: 'Reanimated corpse that shambles forward with relentless hunger.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: randomUUID(),
    name: 'Giant Spider',
    type: 'Beast',
    armorClass: 14,
    hitPoints: 26,
    damage: '1d8+2',
    abilities: [
      {
        name: 'Web',
        description:
          'Ranged attack that restrains the target. Escape DC 12. Web can be destroyed (AC 10, 5 HP).',
        damage: '0d0+0',
        usage: 'Recharge 5-6',
      },
      {
        name: 'Spider Climb',
        description: 'Can climb difficult surfaces, including upside down on ceilings.',
      },
    ],
    challenge: 1,
    size: 'Large',
    speed: 30,
    avatarSeed: 'giant-spider',
    description: 'Massive arachnid that lurks in dark corners, waiting to trap prey in webs.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: randomUUID(),
    name: 'Cultist',
    type: 'Humanoid',
    armorClass: 12,
    hitPoints: 9,
    damage: '1d6+0',
    abilities: [
      {
        name: 'Dark Devotion',
        description: 'Has advantage on saving throws against being charmed or frightened.',
      },
    ],
    challenge: 0.5,
    size: 'Medium',
    speed: 30,
    avatarSeed: 'cultist',
    description: 'Fanatical worshipper of dark gods, willing to die for their twisted beliefs.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  // ========================================
  // CR 2 - 4: Moderate enemies
  // ========================================
  {
    id: randomUUID(),
    name: 'Orc Warrior',
    type: 'Humanoid',
    armorClass: 13,
    hitPoints: 15,
    damage: '1d12+3',
    abilities: [
      {
        name: 'Aggressive',
        description: 'As a bonus action, can move up to its speed toward a hostile creature.',
      },
    ],
    challenge: 1,
    size: 'Medium',
    speed: 30,
    avatarSeed: 'orc-warrior',
    description: 'Brutal, savage fighter with green skin and a fearsome reputation.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: randomUUID(),
    name: 'Skeleton Warrior',
    type: 'Undead',
    armorClass: 13,
    hitPoints: 13,
    damage: '1d6+2',
    abilities: [
      {
        name: 'Undead Nature',
        description: 'Immune to poison damage and exhaustion. Does not need air, food, or sleep.',
      },
    ],
    challenge: 0.5,
    size: 'Medium',
    speed: 30,
    avatarSeed: 'skeleton-warrior',
    description: 'Animated bones held together by dark magic, wielding ancient weapons.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: randomUUID(),
    name: 'Dire Wolf',
    type: 'Beast',
    armorClass: 14,
    hitPoints: 37,
    damage: '2d6+3',
    abilities: [
      {
        name: 'Pack Tactics',
        description: 'Has advantage on attack rolls if at least one ally is within 5 feet of target.',
      },
      {
        name: 'Pounce',
        description: 'If it moves at least 20 feet and hits with bite, target must succeed on DC 13 Strength save or be knocked prone.',
      },
    ],
    challenge: 1,
    size: 'Large',
    speed: 50,
    avatarSeed: 'dire-wolf',
    description: 'Massive wolf with powerful jaws and a pack hunting instinct.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: randomUUID(),
    name: 'Chaos Marauder',
    type: 'Chaos',
    armorClass: 15,
    hitPoints: 45,
    damage: '2d6+4',
    abilities: [
      {
        name: 'Chaos Blessing',
        description: 'Whenever the marauder deals damage, it gains 5 temporary hit points.',
        usage: '3/Day',
      },
    ],
    challenge: 2,
    size: 'Medium',
    speed: 30,
    avatarSeed: 'chaos-marauder',
    description: 'Corrupted warrior blessed by the dark gods, seeking glory through carnage.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  // ========================================
  // CR 5 - 8: Challenging enemies
  // ========================================
  {
    id: randomUUID(),
    name: 'Tyranid Warrior',
    type: 'Xenos',
    armorClass: 16,
    hitPoints: 68,
    damage: '2d8+5',
    abilities: [
      {
        name: 'Bio-Weapons',
        description: 'Can make two attacks per turn with different bio-weapons.',
      },
      {
        name: 'Synapse',
        description: 'Lesser tyranids within 30 feet gain +2 to attack rolls.',
      },
    ],
    challenge: 5,
    size: 'Large',
    speed: 40,
    avatarSeed: 'tyranid-warrior',
    description: 'Alien bio-construct with chitinous armor and deadly bio-weapons.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: randomUUID(),
    name: 'Vampire Spawn',
    type: 'Undead',
    armorClass: 15,
    hitPoints: 82,
    damage: '1d6+3',
    abilities: [
      {
        name: 'Regeneration',
        description: 'Regains 10 HP at start of turn if it has at least 1 HP. Only radiant damage or sunlight prevents this.',
      },
      {
        name: 'Spider Climb',
        description: 'Can climb difficult surfaces, including upside down on ceilings.',
      },
      {
        name: 'Bite',
        description: 'Deals damage and reduces target maximum HP by the same amount.',
        damage: '1d6+3',
      },
    ],
    challenge: 5,
    size: 'Medium',
    speed: 30,
    avatarSeed: 'vampire-spawn',
    description: 'Lesser vampire created by a true vampire, hungry for blood.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: randomUUID(),
    name: 'Ogre Brute',
    type: 'Giant',
    armorClass: 11,
    hitPoints: 59,
    damage: '2d8+4',
    abilities: [
      {
        name: 'Brutal Strike',
        description: 'Critical hits deal an extra 2d8 damage.',
      },
    ],
    challenge: 2,
    size: 'Large',
    speed: 40,
    avatarSeed: 'ogre-brute',
    description: 'Massive, dim-witted humanoid with incredible strength and terrible hygiene.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  // ========================================
  // CR 9+: Boss-tier enemies
  // ========================================
  {
    id: randomUUID(),
    name: 'Daemon Prince',
    type: 'Daemon',
    armorClass: 18,
    hitPoints: 150,
    damage: '3d8+6',
    abilities: [
      {
        name: 'Daemonic Aura',
        description: 'All enemies within 20 feet have disadvantage on saving throws.',
      },
      {
        name: 'Warp Strike',
        description: 'Teleports up to 30 feet and makes an attack with advantage.',
        damage: '3d8+6',
        usage: 'Recharge 5-6',
      },
      {
        name: 'Dark Regeneration',
        description: 'Regains 20 HP at start of turn if below half health.',
      },
    ],
    challenge: 10,
    size: 'Large',
    speed: 40,
    avatarSeed: 'daemon-prince',
    description: 'Ascended mortal transformed into a powerful daemon by the Chaos Gods.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: randomUUID(),
    name: 'Ancient Wyrm',
    type: 'Dragon',
    armorClass: 19,
    hitPoints: 200,
    damage: '3d10+7',
    abilities: [
      {
        name: 'Fire Breath',
        description: 'Exhales fire in a 60-foot cone. Each creature must make DC 18 Dex save or take damage.',
        damage: '10d6+0',
        usage: 'Recharge 5-6',
      },
      {
        name: 'Legendary Resistance',
        description: 'If the dragon fails a saving throw, it can choose to succeed instead.',
        usage: '3/Day',
      },
      {
        name: 'Frightful Presence',
        description: 'Creatures within 120 feet must succeed on DC 16 Wisdom save or be frightened for 1 minute.',
      },
    ],
    challenge: 15,
    size: 'Gargantuan',
    speed: 40,
    avatarSeed: 'ancient-wyrm',
    description: 'Colossal dragon with scales like molten metal and breath that incinerates armies.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: randomUUID(),
    name: 'Chaos Warlord',
    type: 'Chaos',
    armorClass: 17,
    hitPoints: 120,
    damage: '2d10+5',
    abilities: [
      {
        name: 'Battle Frenzy',
        description: 'Can make three attacks per turn instead of one.',
      },
      {
        name: 'Rallying Cry',
        description: 'All allies within 30 feet gain 10 temporary HP and advantage on next attack.',
        usage: '1/Day',
      },
      {
        name: 'Chaos Armor',
        description: 'Resistant to all non-magical damage.',
      },
    ],
    challenge: 8,
    size: 'Medium',
    speed: 30,
    avatarSeed: 'chaos-warlord',
    description: 'Veteran champion of Chaos clad in corrupted power armor, leading hordes to ruin.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: randomUUID(),
    name: 'Lich',
    type: 'Undead',
    armorClass: 17,
    hitPoints: 135,
    damage: '1d8+4',
    abilities: [
      {
        name: 'Spellcasting',
        description: 'Can cast powerful necromancy and evocation spells. Spell save DC 18.',
      },
      {
        name: 'Paralyzing Touch',
        description: 'Target must succeed on DC 18 Constitution save or be paralyzed for 1 minute.',
        damage: '3d6+0',
      },
      {
        name: 'Legendary Resistance',
        description: 'If the lich fails a saving throw, it can choose to succeed instead.',
        usage: '3/Day',
      },
      {
        name: 'Rejuvenation',
        description: 'If destroyed, the lich reforms in 1d10 days unless its phylactery is destroyed.',
      },
    ],
    challenge: 12,
    size: 'Medium',
    speed: 30,
    avatarSeed: 'lich',
    description: 'Undead spellcaster of terrifying power, sustained by dark magic and an arcane phylactery.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

/**
 * Get all monsters from the library
 *
 * @returns Array of all Monster objects
 *
 * @example
 * ```typescript
 * const monsters = getAllMonsters()
 * console.log(`Total monsters: ${monsters.length}`)
 * ```
 */
export function getAllMonsters(): Monster[] {
  return [...MONSTERS]
}

/**
 * Get monsters filtered by category/type
 *
 * @param category - Monster type to filter by (e.g., 'Undead', 'Beast', 'Chaos')
 * @returns Array of monsters matching the category
 *
 * @example
 * ```typescript
 * const undead = getMonstersByCategory('Undead')
 * console.log(`Found ${undead.length} undead monsters`)
 * // Returns: Zombie, Skeleton Warrior, Vampire Spawn, Lich
 * ```
 */
export function getMonstersByCategory(category: MonsterType): Monster[] {
  return MONSTERS.filter((monster) => monster.type === category)
}

/**
 * Get a single monster by ID
 *
 * @param id - Monster UUID
 * @returns Monster object or undefined if not found
 *
 * @example
 * ```typescript
 * const monster = getMonsterById('123e4567-e89b-12d3-a456-426614174000')
 * if (monster) {
 *   console.log(`Found: ${monster.name}`)
 * }
 * ```
 */
export function getMonsterById(id: string): Monster | undefined {
  return MONSTERS.find((monster) => monster.id === id)
}

/**
 * Get monsters filtered by challenge rating range
 *
 * @param minCR - Minimum challenge rating (inclusive)
 * @param maxCR - Maximum challenge rating (inclusive)
 * @returns Array of monsters within the CR range
 *
 * @example
 * ```typescript
 * // Get low-level monsters (CR 0-2)
 * const weakMonsters = getMonstersByChallengeRange(0, 2)
 *
 * // Get boss-tier monsters (CR 10+)
 * const bosses = getMonstersByChallengeRange(10, 30)
 * ```
 */
export function getMonstersByChallengeRange(minCR: number, maxCR: number): Monster[] {
  return MONSTERS.filter((monster) => monster.challenge >= minCR && monster.challenge <= maxCR)
}

/**
 * Get all unique monster categories present in the library
 *
 * @returns Array of unique MonsterType values
 *
 * @example
 * ```typescript
 * const categories = getMonsterCategories()
 * // Returns: ['Humanoid', 'Undead', 'Beast', 'Chaos', 'Xenos', 'Daemon', 'Dragon', 'Giant']
 * ```
 */
export function getMonsterCategories(): MonsterType[] {
  const categories = new Set<MonsterType>()
  MONSTERS.forEach((monster) => categories.add(monster.type))
  return Array.from(categories).sort()
}

/**
 * Search monsters by name (case-insensitive)
 *
 * @param query - Search string to match against monster names
 * @returns Array of monsters whose names contain the query
 *
 * @example
 * ```typescript
 * const results = searchMonsters('goblin')
 * // Returns: [Goblin Scout]
 *
 * const chaosResults = searchMonsters('chaos')
 * // Returns: [Chaos Marauder, Chaos Warlord]
 * ```
 */
export function searchMonsters(query: string): Monster[] {
  const lowerQuery = query.toLowerCase().trim()
  if (!lowerQuery) return []

  return MONSTERS.filter((monster) => monster.name.toLowerCase().includes(lowerQuery))
}
