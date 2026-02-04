/**
 * Combatant Schema - Defines validation for entities in combat
 *
 * This schema validates combatant data for active combat encounters.
 * A Combatant is a Character or Monster participating in combat,
 * with additional combat-specific properties (initiative, active turn, etc.).
 *
 * @see DEFINE.md - Combat Tracker requirements
 * @see PATTERNS.md - Zod schema patterns
 */

import { z } from 'zod'
import { type Character } from './character.schema'
import { type Monster } from './monster.schema'
import { ConditionsArraySchema, type Condition } from './condition.schema'

/**
 * Combatant type - either player character or monster/NPC
 */
export const CombatantTypeEnum = z.enum(['character', 'monster'])

/**
 * Type for combatant entity types
 */
export type CombatantType = z.infer<typeof CombatantTypeEnum>

/**
 * Combatant schema with combat-specific fields
 *
 * Represents a Character or Monster in active combat.
 * Extends base entity with combat tracking fields.
 *
 * Properties:
 * - id: Unique combatant ID (different from character/monster ID)
 * - entityId: Reference to original Character or Monster ID
 * - type: 'character' or 'monster' (determines which entity type)
 * - name: Display name in combat
 * - armorClass: AC for combat calculations
 * - maxHp: Maximum hit points
 * - currentHp: Current hit points (changes during combat)
 * - initiative: Initiative roll value (determines turn order)
 * - isActive: Whether this is the active combatant's turn
 * - conditions: Active status effects during combat
 * - imageUrl: Optional custom image
 * - avatarSeed: Seed for generated avatar
 * - isPlayer: true for player characters, false for enemies
 * - notes: Optional combat notes (tactics, reminders, etc.)
 */
export const CombatantSchema = z.object({
  /**
   * Unique combatant identifier (UUID)
   * Different from character/monster ID - represents this combat instance
   */
  id: z.string().uuid(),

  /**
   * Reference to original Character or Monster ID
   * Links back to the roster entity
   * Accepts UUID format (for characters) or string format (for monsters)
   */
  entityId: z.string().min(1),

  /**
   * Entity type - character or monster
   * Determines how to interpret entityId
   */
  type: CombatantTypeEnum,

  /**
   * Display name in combat
   * May include disambiguators like "Goblin 1", "Goblin 2"
   */
  name: z.string().min(1, 'Name is required').max(60, 'Name must be 60 characters or less'),

  /**
   * Armor class / Defense rating
   * Used for attack calculations
   */
  armorClass: z
    .number()
    .int()
    .min(1, 'AC must be at least 1')
    .max(30, 'AC cannot exceed 30'),

  /**
   * Maximum hit points
   * Reference value - doesn't change during combat
   */
  maxHp: z.number().int().min(1, 'Max HP must be at least 1').max(999, 'Max HP cannot exceed 999'),

  /**
   * Current hit points
   * Changes during combat as damage/healing occurs
   * 0 = unconscious/downed
   */
  currentHp: z
    .number()
    .int()
    .min(0, 'Current HP cannot be negative')
    .max(999, 'Current HP cannot exceed 999'),

  /**
   * Initiative value
   * Determines turn order (higher goes first)
   * Rolled as d20 + DEX modifier or manually entered
   */
  initiative: z
    .number()
    .int()
    .min(-10, 'Initiative too low')
    .max(50, 'Initiative too high'),

  /**
   * Dexterity modifier for initiative rolls
   * Typically -5 to +10 for most characters
   * Used when rolling initiative (d20 + dexModifier)
   */
  dexModifier: z.number().int().min(-5).max(10).default(0),

  /**
   * Whether this combatant's turn is currently active
   * Only one combatant should have isActive = true at a time
   */
  isActive: z.boolean().default(false),

  /**
   * Active conditions during combat
   * Applied conditions persist until removed
   */
  conditions: ConditionsArraySchema,

  /**
   * Custom image URL or base64 data
   * Optional - if not provided, use avatarSeed
   */
  imageUrl: z.string().optional(),

  /**
   * Seed for auto-generated avatar
   * Used when imageUrl is not provided
   */
  avatarSeed: z.string().default('default-combatant-seed'),

  /**
   * Whether this is a player character
   * true = player, false = enemy/NPC
   * Used for UI display and sorting
   */
  isPlayer: z.boolean(),

  /**
   * Optional combat notes
   * Tactical reminders, special abilities to use, etc.
   * Max 500 characters
   */
  notes: z.string().max(500, 'Notes too long').optional(),

  /**
   * Timestamp when added to combat
   * ISO 8601 string format
   */
  addedAt: z.string().datetime(),
})

/**
 * Infer TypeScript type from schema
 *
 * Use this type throughout the app for type-safe combatant data
 *
 * @example
 * ```typescript
 * const combatant: Combatant = {
 *   id: '123e4567-e89b-12d3-a456-426614174000',
 *   entityId: 'abc12345-...',
 *   type: 'character',
 *   name: 'Raul the Brave',
 *   armorClass: 18,
 *   maxHp: 45,
 *   currentHp: 32,
 *   initiative: 15,
 *   isActive: true,
 *   conditions: ['Blessed'],
 *   avatarSeed: 'raul-paladin',
 *   isPlayer: true,
 *   addedAt: '2026-01-20T10:00:00.000Z',
 * }
 * ```
 */
export type Combatant = z.infer<typeof CombatantSchema>

/**
 * Validate and parse combatant data (throws on error)
 *
 * @param data - Raw combatant data to validate
 * @returns Validated Combatant object
 * @throws ZodError if validation fails
 */
export function parseCombatant(data: unknown): Combatant {
  return CombatantSchema.parse(data)
}

/**
 * Safely validate combatant data without throwing
 *
 * @param data - Raw combatant data to validate
 * @returns Success object with data OR error object with issues
 */
export function validateCombatant(data: unknown) {
  return CombatantSchema.safeParse(data)
}

/**
 * Schema for creating a combatant from a Character
 *
 * Omits combat-generated fields, provides defaults
 */
export const CreateCombatantFromCharacterSchema = z.object({
  entityId: z.string().min(1),
  name: z.string().min(1).max(60),
  armorClass: z.number().int().min(1).max(30),
  maxHp: z.number().int().min(1).max(999),
  currentHp: z.number().int().min(0).max(999),
  initiative: z.number().int().min(-10).max(50).optional().default(10),
  conditions: ConditionsArraySchema.optional().default([]),
  imageUrl: z.string().optional(),
  avatarSeed: z.string().default('default-combatant-seed'),
  notes: z.string().max(500).optional(),
})

/**
 * Type for creating combatant from character
 */
export type CreateCombatantFromCharacter = z.infer<typeof CreateCombatantFromCharacterSchema>

/**
 * Schema for creating a combatant from a Monster
 *
 * Similar to character but marks as non-player
 */
export const CreateCombatantFromMonsterSchema = CreateCombatantFromCharacterSchema

/**
 * Type for creating combatant from monster
 */
export type CreateCombatantFromMonster = z.infer<typeof CreateCombatantFromMonsterSchema>

/**
 * Schema for updating combatant during combat
 *
 * Only allows updating combat-relevant fields
 * Cannot change entityId, type, or isPlayer (immutable in combat)
 */
export const UpdateCombatantSchema = z.object({
  id: z.string().uuid(),
  currentHp: z.number().int().min(0).max(999).optional(),
  initiative: z.number().int().min(-10).max(50).optional(),
  isActive: z.boolean().optional(),
  conditions: ConditionsArraySchema.optional(),
  notes: z.string().max(500).optional(),
})

/**
 * Type for combatant updates
 */
export type UpdateCombatant = z.infer<typeof UpdateCombatantSchema>

/**
 * Helper to create combatant from Character entity
 *
 * @param character - Character to convert to combatant
 * @param initiative - Optional initiative value (defaults to AC temporarily)
 * @returns Combatant data ready for validation
 *
 * @example
 * ```typescript
 * const character: Character = { ... }
 * const combatantData = createCombatantFromCharacter(character, 15)
 * const combatant = parseCombatant(combatantData)
 * ```
 */
export function createCombatantFromCharacter(
  character: Character,
  initiative?: number,
  dexModifier: number = 0
): Omit<Combatant, 'id' | 'addedAt'> {
  return {
    entityId: character.id,
    type: 'character' as const,
    name: character.name,
    armorClass: character.armorClass,
    maxHp: character.maxHp,
    currentHp: character.currentHp,
    initiative: initiative ?? 10, // Default to 10, will be rolled
    dexModifier,
    isActive: false,
    conditions: (character.conditions || []) as Condition[],
    imageUrl: character.imageUrl,
    avatarSeed: character.avatarSeed,
    isPlayer: true,
    notes: undefined,
  }
}

/**
 * Helper to create combatant from Monster entity
 *
 * @param monster - Monster to convert to combatant
 * @param initiative - Optional initiative value (defaults to AC temporarily)
 * @param instanceName - Optional name override (e.g., "Goblin 1", "Goblin 2")
 * @returns Combatant data ready for validation
 *
 * @example
 * ```typescript
 * const monster: Monster = { ... }
 * const combatantData = createCombatantFromMonster(monster, 12, 'Goblin 1')
 * const combatant = parseCombatant(combatantData)
 * ```
 */
export function createCombatantFromMonster(
  monster: Monster,
  initiative?: number,
  instanceName?: string,
  dexModifier: number = 0
): Omit<Combatant, 'id' | 'addedAt'> {
  return {
    entityId: monster.id,
    type: 'monster' as const,
    name: instanceName || monster.name,
    armorClass: monster.armorClass,
    maxHp: monster.hitPoints,
    currentHp: monster.hitPoints,
    initiative: initiative ?? 10, // Default to 10, will be rolled
    dexModifier,
    isActive: false,
    conditions: [] as Condition[],
    imageUrl: monster.imageUrl,
    avatarSeed: monster.avatarSeed,
    isPlayer: false,
    notes: undefined,
  }
}

/**
 * Check if combatant is defeated (HP <= 0)
 *
 * @param combatant - Combatant to check
 * @returns true if HP is 0 or below, false otherwise
 */
export function isCombatantDefeated(combatant: Combatant): boolean {
  return combatant.currentHp <= 0
}

/**
 * Check if combatant is bloodied (HP <= 50% of max)
 *
 * @param combatant - Combatant to check
 * @returns true if current HP is 50% or less of max HP
 */
export function isCombatantBloodied(combatant: Combatant): boolean {
  return combatant.currentHp <= combatant.maxHp * 0.5
}

/**
 * Calculate HP percentage
 *
 * @param combatant - Combatant to calculate for
 * @returns HP percentage (0-100)
 */
export function getCombatantHpPercentage(combatant: Combatant): number {
  if (combatant.maxHp === 0) return 0
  return Math.round((combatant.currentHp / combatant.maxHp) * 100)
}

/**
 * Sort combatants by initiative (descending - highest first)
 * Ties are broken by dexModifier (higher goes first)
 *
 * @param combatants - Array of combatants to sort
 * @returns New sorted array (does not mutate original)
 *
 * @example
 * ```typescript
 * const sorted = sortByInitiative(combatants)
 * // First combatant has highest initiative
 * ```
 */
export function sortByInitiative(combatants: Combatant[]): Combatant[] {
  return [...combatants].sort((a, b) => {
    // Primary sort by initiative (descending)
    if (b.initiative !== a.initiative) {
      return b.initiative - a.initiative
    }
    // Tie-breaker: higher DEX modifier goes first
    return (b.dexModifier ?? 0) - (a.dexModifier ?? 0)
  })
}

/**
 * Get active combatant from array
 *
 * @param combatants - Array of combatants
 * @returns Active combatant or undefined if none active
 */
export function getActiveCombatant(combatants: Combatant[]): Combatant | undefined {
  return combatants.find((c) => c.isActive)
}

/**
 * Get next combatant in initiative order
 *
 * Cycles back to start if at end of list
 *
 * @param combatants - Array of combatants (should be sorted by initiative)
 * @param currentId - ID of current active combatant
 * @returns Next combatant or undefined if list is empty
 */
export function getNextCombatant(combatants: Combatant[], currentId: string): Combatant | undefined {
  if (combatants.length === 0) return undefined

  const currentIndex = combatants.findIndex((c) => c.id === currentId)

  // If current not found or at end, return first
  if (currentIndex === -1 || currentIndex === combatants.length - 1) {
    return combatants[0]
  }

  // Return next in order
  return combatants[currentIndex + 1]
}
