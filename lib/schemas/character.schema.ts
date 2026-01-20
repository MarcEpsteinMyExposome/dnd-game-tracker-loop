/**
 * Character Schema - Defines validation for player characters
 *
 * This schema validates character data for D&D/Warhammer 40K game tracking.
 * Characters represent player-controlled entities with stats, health, and conditions.
 *
 * @see DEFINE.md - Character Management requirements
 * @see PATTERNS.md - Zod schema patterns
 */

import { z } from 'zod'

/**
 * Character schema with full validation rules
 *
 * Properties:
 * - id: Unique identifier (UUID)
 * - name: Character name (1-50 chars, required)
 * - characterClass: D&D class or W40K role (1-30 chars, required)
 * - level: Character level (1-20 for D&D, 1-10 for W40K)
 * - maxHp: Maximum hit points (1-999)
 * - currentHp: Current hit points (0 to maxHp)
 * - armorClass: Armor class / defense rating (1-30)
 * - imageUrl: Optional custom image (base64 or URL)
 * - avatarSeed: Seed for auto-generated avatar fallback
 * - conditions: Array of active status effects
 * - createdAt: Timestamp when character was created
 * - updatedAt: Timestamp of last modification
 */
export const CharacterSchema = z.object({
  /**
   * Unique identifier (UUID format)
   * Generated on creation, immutable
   */
  id: z.string().uuid(),

  /**
   * Character name
   * Required, 1-50 characters
   * Examples: "Raul the Brave", "Brother Marcus", "Elara Moonshadow"
   */
  name: z.string().min(1, 'Name is required').max(50, 'Name must be 50 characters or less'),

  /**
   * Character class or role
   * Required, 1-30 characters
   * Examples: "Paladin", "Space Marine", "Rogue", "Tech-Priest"
   */
  characterClass: z
    .string()
    .min(1, 'Class is required')
    .max(30, 'Class must be 30 characters or less'),

  /**
   * Character level
   * 1-20 for D&D (covers standard progression)
   * 1-10 for Warhammer 40K (typical rank levels)
   */
  level: z.number().int().min(1, 'Level must be at least 1').max(20, 'Level cannot exceed 20'),

  /**
   * Maximum hit points
   * Must be positive integer, 1-999
   */
  maxHp: z.number().int().min(1, 'Max HP must be at least 1').max(999, 'Max HP cannot exceed 999'),

  /**
   * Current hit points
   * Must be non-negative integer, 0 to maxHp
   * 0 = unconscious/downed, negative not allowed (goes to 0)
   */
  currentHp: z
    .number()
    .int()
    .min(0, 'Current HP cannot be negative')
    .max(999, 'Current HP cannot exceed 999'),

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
   * Custom image URL or base64 data
   * Optional - if not provided, use avatarSeed for generated avatar
   * Can be:
   * - Base64 encoded image (data:image/png;base64,...)
   * - URL to hosted image
   */
  imageUrl: z.string().optional(),

  /**
   * Seed for auto-generated avatar (DiceBear)
   * Used when imageUrl is not provided
   * Defaults to character name if not specified
   */
  avatarSeed: z.string().default('default-seed'),

  /**
   * Active status conditions
   * Array of condition names (e.g., "Poisoned", "Stunned")
   * Defaults to empty array (no conditions)
   */
  conditions: z.array(z.string()).default([]),

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
 * Use this type throughout the app for type-safe character data
 *
 * @example
 * ```typescript
 * const character: Character = {
 *   id: '123e4567-e89b-12d3-a456-426614174000',
 *   name: 'Raul the Brave',
 *   characterClass: 'Paladin',
 *   level: 5,
 *   maxHp: 45,
 *   currentHp: 32,
 *   armorClass: 18,
 *   avatarSeed: 'raul-paladin',
 *   conditions: ['Blessed'],
 *   createdAt: '2026-01-20T10:00:00.000Z',
 *   updatedAt: '2026-01-20T10:00:00.000Z',
 * }
 * ```
 */
export type Character = z.infer<typeof CharacterSchema>

/**
 * Validate and parse character data (throws on error)
 *
 * Use when you want validation errors to propagate
 * Typically used in server-side or data import scenarios
 *
 * @param data - Raw character data to validate
 * @returns Validated Character object
 * @throws ZodError if validation fails
 *
 * @example
 * ```typescript
 * try {
 *   const character = parseCharacter(rawData)
 *   console.log(`Valid character: ${character.name}`)
 * } catch (error) {
 *   console.error('Invalid character data:', error)
 * }
 * ```
 */
export function parseCharacter(data: unknown): Character {
  return CharacterSchema.parse(data)
}

/**
 * Safely validate character data without throwing
 *
 * Returns a result object - check `.success` to determine outcome
 * Preferred method for UI validation (graceful error handling)
 *
 * @param data - Raw character data to validate
 * @returns Success object with data OR error object with issues
 *
 * @example
 * ```typescript
 * const result = validateCharacter(formData)
 * if (result.success) {
 *   // result.data is fully typed Character
 *   saveCharacter(result.data)
 * } else {
 *   // result.error.issues contains detailed validation errors
 *   displayErrors(result.error.issues)
 * }
 * ```
 */
export function validateCharacter(data: unknown) {
  return CharacterSchema.safeParse(data)
}

/**
 * Schema for creating a new character (omits auto-generated fields)
 *
 * Use this for character creation forms
 * Omits: id, createdAt, updatedAt (generated by system)
 * Makes optional: imageUrl, avatarSeed, conditions, currentHp
 */
export const CreateCharacterSchema = CharacterSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  // currentHp defaults to maxHp if not specified
  currentHp: z.number().int().min(0).optional(),
})

/**
 * Type for character creation (without auto-generated fields)
 */
export type CreateCharacter = z.infer<typeof CreateCharacterSchema>

/**
 * Schema for updating an existing character (all fields optional except id)
 *
 * Use this for character edit forms
 * Only id is required, all other fields optional
 */
export const UpdateCharacterSchema = CharacterSchema.partial().required({ id: true })

/**
 * Type for character updates
 */
export type UpdateCharacter = z.infer<typeof UpdateCharacterSchema>

/**
 * Default character values for form initialization
 *
 * Use when creating a new character form
 * Provides sensible defaults for all fields
 */
export const defaultCharacter: Partial<CreateCharacter> = {
  characterClass: 'Fighter',
  level: 1,
  maxHp: 10,
  currentHp: 10,
  armorClass: 10,
  conditions: [],
  avatarSeed: 'default-seed',
}

/**
 * HP validation helper - ensures currentHp doesn't exceed maxHp
 *
 * Use when updating character HP to maintain consistency
 *
 * @param currentHp - New current HP value
 * @param maxHp - Maximum HP limit
 * @returns Clamped HP value (0 to maxHp)
 *
 * @example
 * ```typescript
 * const safeHp = clampHp(150, 100) // Returns 100 (clamped to max)
 * const safeHp2 = clampHp(-10, 100) // Returns 0 (clamped to min)
 * const safeHp3 = clampHp(50, 100) // Returns 50 (valid)
 * ```
 */
export function clampHp(currentHp: number, maxHp: number): number {
  return Math.max(0, Math.min(currentHp, maxHp))
}
