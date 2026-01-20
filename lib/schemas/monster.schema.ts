/**
 * Monster Schema - Defines validation for enemy/NPC entities
 *
 * This schema validates monster data for D&D/Warhammer 40K game tracking.
 * Monsters represent enemies, NPCs, and other combatants controlled by the DM/GM.
 *
 * @see DEFINE.md - Monster Library requirements
 * @see PATTERNS.md - Zod schema patterns
 */

import { z } from 'zod'

/**
 * Monster type categories for organization
 * D&D: Aberration, Beast, Celestial, Construct, Dragon, Elemental, Fey, Fiend, Giant, Humanoid, Monstrosity, Ooze, Plant, Undead
 * W40K: Xenos, Chaos, Heretic, Daemon, etc.
 */
export const MonsterTypeEnum = z.enum([
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
])

/**
 * Type for monster categories
 */
export type MonsterType = z.infer<typeof MonsterTypeEnum>

/**
 * Monster ability or special action
 * Describes special attacks, traits, or actions the monster can perform
 */
export const MonsterAbilitySchema = z.object({
  /**
   * Ability name
   * Examples: "Multiattack", "Fire Breath", "Legendary Resistance"
   */
  name: z.string().min(1, 'Ability name is required').max(50, 'Ability name too long'),

  /**
   * Ability description
   * Explains what the ability does, damage, effects, etc.
   */
  description: z
    .string()
    .min(1, 'Ability description is required')
    .max(500, 'Ability description too long'),

  /**
   * Damage dice notation (optional)
   * Examples: "2d6+3", "1d10", "3d8+5"
   * null if ability doesn't deal damage
   */
  damage: z.string().max(20).optional(),

  /**
   * Usage limitation (optional)
   * Examples: "Recharge 5-6", "1/Day", "3/Day"
   */
  usage: z.string().max(30).optional(),
})

/**
 * Type for monster abilities
 */
export type MonsterAbility = z.infer<typeof MonsterAbilitySchema>

/**
 * Monster schema with full validation rules
 *
 * Properties:
 * - id: Unique identifier (UUID)
 * - name: Monster name (1-50 chars, required)
 * - type: Monster category (Aberration, Beast, Xenos, etc.)
 * - armorClass: Armor class / defense rating (1-30)
 * - hitPoints: Total hit points (1-999)
 * - damage: Primary damage output (dice notation)
 * - abilities: Array of special abilities/actions
 * - challenge: Challenge rating or threat level (0-30)
 * - size: Creature size (Tiny, Small, Medium, Large, Huge, Gargantuan)
 * - speed: Movement speed (in feet)
 * - imageUrl: Optional custom image
 * - avatarSeed: Seed for auto-generated avatar
 * - description: Optional lore/flavor text
 */
export const MonsterSchema = z.object({
  /**
   * Unique identifier (UUID format)
   * Generated on creation, immutable
   */
  id: z.string().uuid(),

  /**
   * Monster name
   * Required, 1-50 characters
   * Examples: "Goblin Shaman", "Tyranid Warrior", "Ancient Red Dragon"
   */
  name: z.string().min(1, 'Name is required').max(50, 'Name must be 50 characters or less'),

  /**
   * Monster type/category
   * Used for organization and filtering in monster library
   */
  type: MonsterTypeEnum,

  /**
   * Armor class / Defense rating
   * Typically 1-30 (D&D AC range)
   * Higher = harder to hit
   */
  armorClass: z
    .number()
    .int()
    .min(1, 'AC must be at least 1')
    .max(30, 'AC cannot exceed 30'),

  /**
   * Total hit points
   * Maximum health for this monster
   * Must be positive integer, 1-999
   */
  hitPoints: z
    .number()
    .int()
    .min(1, 'HP must be at least 1')
    .max(999, 'HP cannot exceed 999'),

  /**
   * Primary damage output (dice notation)
   * Examples: "1d6+2", "2d8+4", "3d10+5"
   * Represents typical attack damage
   */
  damage: z
    .string()
    .min(1, 'Damage is required')
    .max(20, 'Damage notation too long')
    .regex(/^\d+d\d+([+-]\d+)?$/, 'Invalid dice notation (use format: XdY+Z)'),

  /**
   * Special abilities and actions
   * Array of unique monster abilities
   * Examples: breath weapons, legendary actions, special traits
   */
  abilities: z.array(MonsterAbilitySchema).default([]),

  /**
   * Challenge rating or threat level
   * D&D: CR 0-30 (decimal allowed, e.g., 0.5 for CR 1/2)
   * W40K: Threat level 1-10
   */
  challenge: z.number().min(0, 'Challenge cannot be negative').max(30, 'Challenge too high'),

  /**
   * Creature size category
   * Affects space occupied and certain mechanics
   */
  size: z.enum(['Tiny', 'Small', 'Medium', 'Large', 'Huge', 'Gargantuan']),

  /**
   * Movement speed in feet
   * Typical range: 0-120 feet
   * 0 = immobile/stationary
   */
  speed: z.number().int().min(0, 'Speed cannot be negative').max(200, 'Speed too high'),

  /**
   * Custom image URL or base64 data
   * Optional - if not provided, use avatarSeed for generated avatar
   */
  imageUrl: z.string().optional(),

  /**
   * Seed for auto-generated avatar (DiceBear)
   * Used when imageUrl is not provided
   * Defaults to monster name if not specified
   */
  avatarSeed: z.string().default('default-monster-seed'),

  /**
   * Lore/flavor text description
   * Optional - provides context about the monster
   * Max 1000 characters
   */
  description: z.string().max(1000, 'Description too long').optional(),

  /**
   * Creation timestamp
   * ISO 8601 string format
   */
  createdAt: z.string().datetime(),

  /**
   * Last update timestamp
   * ISO 8601 string format
   */
  updatedAt: z.string().datetime(),
})

/**
 * Infer TypeScript type from schema
 *
 * Use this type throughout the app for type-safe monster data
 *
 * @example
 * ```typescript
 * const monster: Monster = {
 *   id: '123e4567-e89b-12d3-a456-426614174000',
 *   name: 'Goblin Shaman',
 *   type: 'Humanoid',
 *   armorClass: 13,
 *   hitPoints: 27,
 *   damage: '1d6+1',
 *   abilities: [{
 *     name: 'Spellcasting',
 *     description: 'Can cast minor spells',
 *     usage: '3/Day',
 *   }],
 *   challenge: 1,
 *   size: 'Small',
 *   speed: 30,
 *   avatarSeed: 'goblin-shaman',
 *   createdAt: '2026-01-20T10:00:00.000Z',
 *   updatedAt: '2026-01-20T10:00:00.000Z',
 * }
 * ```
 */
export type Monster = z.infer<typeof MonsterSchema>

/**
 * Validate and parse monster data (throws on error)
 *
 * Use when you want validation errors to propagate
 * Typically used in server-side or data import scenarios
 *
 * @param data - Raw monster data to validate
 * @returns Validated Monster object
 * @throws ZodError if validation fails
 *
 * @example
 * ```typescript
 * try {
 *   const monster = parseMonster(rawData)
 *   console.log(`Valid monster: ${monster.name}`)
 * } catch (error) {
 *   console.error('Invalid monster data:', error)
 * }
 * ```
 */
export function parseMonster(data: unknown): Monster {
  return MonsterSchema.parse(data)
}

/**
 * Safely validate monster data without throwing
 *
 * Returns a result object - check `.success` to determine outcome
 * Preferred method for UI validation (graceful error handling)
 *
 * @param data - Raw monster data to validate
 * @returns Success object with data OR error object with issues
 *
 * @example
 * ```typescript
 * const result = validateMonster(formData)
 * if (result.success) {
 *   // result.data is fully typed Monster
 *   saveMonster(result.data)
 * } else {
 *   // result.error.issues contains detailed validation errors
 *   displayErrors(result.error.issues)
 * }
 * ```
 */
export function validateMonster(data: unknown) {
  return MonsterSchema.safeParse(data)
}

/**
 * Schema for creating a new monster (omits auto-generated fields)
 *
 * Use this for monster creation forms
 * Omits: id, createdAt, updatedAt (generated by system)
 */
export const CreateMonsterSchema = MonsterSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
})

/**
 * Type for monster creation (without auto-generated fields)
 */
export type CreateMonster = z.infer<typeof CreateMonsterSchema>

/**
 * Schema for updating an existing monster (all fields optional except id)
 *
 * Use this for monster edit forms
 * Only id is required, all other fields optional
 */
export const UpdateMonsterSchema = MonsterSchema.partial().required({ id: true })

/**
 * Type for monster updates
 */
export type UpdateMonster = z.infer<typeof UpdateMonsterSchema>

/**
 * Default monster values for form initialization
 *
 * Use when creating a new monster form
 * Provides sensible defaults for all fields
 */
export const defaultMonster: Partial<CreateMonster> = {
  type: 'Humanoid',
  armorClass: 10,
  hitPoints: 10,
  damage: '1d6+0',
  abilities: [],
  challenge: 1,
  size: 'Medium',
  speed: 30,
  avatarSeed: 'default-monster-seed',
}

/**
 * Helper to validate dice notation format
 *
 * @param notation - Dice notation string (e.g., "2d6+3")
 * @returns true if valid, false otherwise
 *
 * @example
 * ```typescript
 * isValidDiceNotation('2d6+3')   // true
 * isValidDiceNotation('1d20-2')  // true
 * isValidDiceNotation('3d8')     // true
 * isValidDiceNotation('invalid') // false
 * ```
 */
export function isValidDiceNotation(notation: string): boolean {
  return /^\d+d\d+([+-]\d+)?$/.test(notation)
}
