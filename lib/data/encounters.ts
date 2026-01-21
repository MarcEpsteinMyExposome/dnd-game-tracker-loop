/**
 * Pre-built Encounter Data
 *
 * Quick encounters for one-click combat setup.
 * Each encounter includes a thematic monster group with counts.
 *
 * @see lib/data/monsters.ts - Monster library
 * @see lib/schemas/combatant.schema.ts - Combatant creation
 */

import { Monster } from '../schemas/monster.schema'
import { getMonsterById } from './monsters'

/**
 * Monster entry in an encounter with count
 */
export interface EncounterMonster {
  /** Monster ID from the monster library */
  monsterId: string
  /** Number of this monster type to add */
  count: number
}

/**
 * Pre-built encounter definition
 */
export interface Encounter {
  /** Unique identifier for the encounter */
  id: string
  /** Display name for the encounter */
  name: string
  /** Brief description of the encounter scenario */
  description: string
  /** Difficulty indicator (Easy, Medium, Hard, Deadly) */
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Deadly'
  /** Monsters included in this encounter */
  monsters: EncounterMonster[]
  /** Thematic tags for filtering */
  tags: string[]
}

/**
 * All pre-defined encounters
 */
export const ENCOUNTERS: Encounter[] = [
  {
    id: 'encounter-goblin-ambush',
    name: 'Goblin Ambush',
    description:
      'A band of goblin scouts has set up an ambush along the forest path. Perfect for low-level parties.',
    difficulty: 'Easy',
    monsters: [
      { monsterId: 'monster-goblin-scout-001', count: 4 },
    ],
    tags: ['forest', 'ambush', 'low-level', 'humanoid'],
  },
  {
    id: 'encounter-undead-horde',
    name: 'Undead Horde',
    description:
      'Zombies and skeletons rise from an ancient battlefield. The dead refuse to stay buried.',
    difficulty: 'Medium',
    monsters: [
      { monsterId: 'monster-zombie-002', count: 3 },
      { monsterId: 'monster-skeleton-warrior-006', count: 3 },
    ],
    tags: ['undead', 'graveyard', 'necromancy', 'mid-level'],
  },
  {
    id: 'encounter-cult-ritual',
    name: 'Cult Ritual',
    description:
      'Dark cultists perform a forbidden ritual. Stop them before they summon something worse.',
    difficulty: 'Medium',
    monsters: [
      { monsterId: 'monster-cultist-004', count: 4 },
      { monsterId: 'monster-chaos-marauder-008', count: 1 },
    ],
    tags: ['cult', 'ritual', 'chaos', 'dungeon'],
  },
  {
    id: 'encounter-beast-pack',
    name: 'Beast Pack',
    description:
      'A pack of dire wolves led by a giant spider has claimed this territory. Nature at its most dangerous.',
    difficulty: 'Hard',
    monsters: [
      { monsterId: 'monster-dire-wolf-007', count: 3 },
      { monsterId: 'monster-giant-spider-003', count: 1 },
    ],
    tags: ['beasts', 'wilderness', 'pack', 'mid-level'],
  },
  {
    id: 'encounter-chaos-warband',
    name: 'Chaos Warband',
    description:
      'A Chaos Warlord leads corrupted marauders in a raid. Prepare for brutal combat.',
    difficulty: 'Deadly',
    monsters: [
      { monsterId: 'monster-chaos-warlord-014', count: 1 },
      { monsterId: 'monster-chaos-marauder-008', count: 3 },
    ],
    tags: ['chaos', 'warband', 'boss', 'high-level'],
  },
]

/**
 * Get all pre-built encounters
 *
 * @returns Array of all Encounter objects
 *
 * @example
 * ```typescript
 * const encounters = getAllEncounters()
 * console.log(`Total encounters: ${encounters.length}`)
 * ```
 */
export function getAllEncounters(): Encounter[] {
  return [...ENCOUNTERS]
}

/**
 * Get a single encounter by ID
 *
 * @param id - Encounter ID
 * @returns Encounter object or undefined if not found
 *
 * @example
 * ```typescript
 * const encounter = getEncounterById('encounter-goblin-ambush')
 * if (encounter) {
 *   console.log(`Found: ${encounter.name}`)
 * }
 * ```
 */
export function getEncounterById(id: string): Encounter | undefined {
  return ENCOUNTERS.find((encounter) => encounter.id === id)
}

/**
 * Get encounters filtered by difficulty
 *
 * @param difficulty - Difficulty level to filter by
 * @returns Array of encounters matching the difficulty
 *
 * @example
 * ```typescript
 * const easyEncounters = getEncountersByDifficulty('Easy')
 * ```
 */
export function getEncountersByDifficulty(
  difficulty: Encounter['difficulty']
): Encounter[] {
  return ENCOUNTERS.filter((encounter) => encounter.difficulty === difficulty)
}

/**
 * Get encounters that contain a specific tag
 *
 * @param tag - Tag to search for (case-insensitive)
 * @returns Array of encounters containing the tag
 *
 * @example
 * ```typescript
 * const undeadEncounters = getEncountersByTag('undead')
 * ```
 */
export function getEncountersByTag(tag: string): Encounter[] {
  const lowerTag = tag.toLowerCase()
  return ENCOUNTERS.filter((encounter) =>
    encounter.tags.some((t) => t.toLowerCase() === lowerTag)
  )
}

/**
 * Resolve an encounter to its full monster data with counts
 *
 * Returns the actual Monster objects for each monster in the encounter,
 * along with the count of how many to add.
 *
 * @param encounterId - ID of the encounter to resolve
 * @returns Array of { monster, count } objects, or empty array if encounter not found
 *
 * @example
 * ```typescript
 * const monsters = resolveEncounterMonsters('encounter-goblin-ambush')
 * // Returns: [{ monster: GoblinScout, count: 4 }]
 *
 * monsters.forEach(({ monster, count }) => {
 *   console.log(`Add ${count}x ${monster.name}`)
 * })
 * ```
 */
export function resolveEncounterMonsters(
  encounterId: string
): { monster: Monster; count: number }[] {
  const encounter = getEncounterById(encounterId)
  if (!encounter) return []

  const resolved: { monster: Monster; count: number }[] = []

  for (const entry of encounter.monsters) {
    const monster = getMonsterById(entry.monsterId)
    if (monster) {
      resolved.push({ monster, count: entry.count })
    }
  }

  return resolved
}

/**
 * Calculate total monster count in an encounter
 *
 * @param encounterId - ID of the encounter
 * @returns Total number of monsters in the encounter
 *
 * @example
 * ```typescript
 * const count = getEncounterMonsterCount('encounter-undead-horde')
 * // Returns: 6 (3 zombies + 3 skeletons)
 * ```
 */
export function getEncounterMonsterCount(encounterId: string): number {
  const encounter = getEncounterById(encounterId)
  if (!encounter) return 0

  return encounter.monsters.reduce((sum, entry) => sum + entry.count, 0)
}

/**
 * Get unique difficulty levels from all encounters
 *
 * @returns Array of unique difficulty strings
 */
export function getEncounterDifficulties(): Encounter['difficulty'][] {
  const difficulties = new Set<Encounter['difficulty']>()
  ENCOUNTERS.forEach((e) => difficulties.add(e.difficulty))
  return Array.from(difficulties)
}
