/**
 * Condition Schema - Defines validation for status effects
 *
 * This schema validates condition/status effect data for D&D/Warhammer 40K game tracking.
 * Conditions represent temporary status effects that affect character/monster capabilities.
 *
 * @see DEFINE.md - Conditions System requirements
 * @see PATTERNS.md - Zod schema patterns
 */

import { z } from 'zod'

/**
 * Standard D&D/W40K condition types
 *
 * These represent the core status effects that can be applied to characters and monsters.
 * Each condition has mechanical effects on gameplay (movement, attacks, defenses, etc.).
 *
 * Definitions:
 * - Poisoned: Disadvantage on attack rolls and ability checks
 * - Prone: Disadvantage on attack rolls, advantage for nearby attackers
 * - Paralyzed: Incapacitated, can't move or speak, auto-fail STR/DEX saves
 * - Stunned: Incapacitated, can't move, can speak falteringly
 * - Blinded: Can't see, auto-fail sight-based checks, disadvantage on attacks
 * - Frightened: Disadvantage on ability checks and attacks while source visible
 * - Charmed: Can't attack charmer, charmer has advantage on social checks
 */
export const ConditionEnum = z.enum([
  'Poisoned',
  'Prone',
  'Paralyzed',
  'Stunned',
  'Blinded',
  'Frightened',
  'Charmed',
])

/**
 * Type for condition values
 *
 * Use this type when working with individual conditions
 *
 * @example
 * ```typescript
 * const condition: Condition = 'Poisoned'
 * const isValid = ConditionEnum.safeParse(condition).success
 * ```
 */
export type Condition = z.infer<typeof ConditionEnum>

/**
 * Array of all valid condition strings
 *
 * Useful for UI dropdowns, iteration, or validation
 *
 * @example
 * ```typescript
 * // Create dropdown options
 * const options = ALL_CONDITIONS.map(c => ({ value: c, label: c }))
 *
 * // Check if condition exists
 * if (ALL_CONDITIONS.includes(userInput)) {
 *   // Valid condition
 * }
 * ```
 */
export const ALL_CONDITIONS: Condition[] = [
  'Poisoned',
  'Prone',
  'Paralyzed',
  'Stunned',
  'Blinded',
  'Frightened',
  'Charmed',
]

/**
 * Schema for an array of conditions
 *
 * Use this when validating a character's or monster's active conditions
 * Ensures all values are valid condition types
 *
 * @example
 * ```typescript
 * const conditions = ['Poisoned', 'Prone']
 * const result = ConditionsArraySchema.safeParse(conditions)
 * if (result.success) {
 *   console.log('Valid conditions:', result.data)
 * }
 * ```
 */
export const ConditionsArraySchema = z.array(ConditionEnum).default([])

/**
 * Validate a single condition value
 *
 * @param value - Value to check against valid conditions
 * @returns true if valid condition, false otherwise
 *
 * @example
 * ```typescript
 * isValidCondition('Poisoned')  // true
 * isValidCondition('Stunned')   // true
 * isValidCondition('Flying')    // false
 * isValidCondition('invalid')   // false
 * ```
 */
export function isValidCondition(value: unknown): value is Condition {
  return ConditionEnum.safeParse(value).success
}

/**
 * Validate an array of conditions
 *
 * @param values - Array to validate
 * @returns true if all values are valid conditions, false otherwise
 *
 * @example
 * ```typescript
 * isValidConditionsArray(['Poisoned', 'Stunned'])  // true
 * isValidConditionsArray(['Invalid', 'Poisoned'])  // false
 * isValidConditionsArray([])                       // true (empty is valid)
 * ```
 */
export function isValidConditionsArray(values: unknown): values is Condition[] {
  return ConditionsArraySchema.safeParse(values).success
}

/**
 * Condition details for display and reference
 *
 * Maps each condition to its mechanical effects and description
 * Useful for tooltips, help text, or condition reference panels
 */
export const CONDITION_DETAILS: Record<
  Condition,
  {
    name: Condition
    description: string
    mechanicalEffect: string
    color: string // Tailwind color class for UI display
  }
> = {
  Poisoned: {
    name: 'Poisoned',
    description: 'Afflicted by poison, toxins, or disease',
    mechanicalEffect: 'Disadvantage on attack rolls and ability checks',
    color: 'text-green-600 bg-green-100',
  },
  Prone: {
    name: 'Prone',
    description: 'Knocked down or lying on the ground',
    mechanicalEffect: 'Disadvantage on attack rolls; melee attackers have advantage',
    color: 'text-amber-600 bg-amber-100',
  },
  Paralyzed: {
    name: 'Paralyzed',
    description: 'Unable to move or act',
    mechanicalEffect:
      'Incapacitated, cannot move or speak, automatically fail STR and DEX saves, attacks have advantage',
    color: 'text-purple-600 bg-purple-100',
  },
  Stunned: {
    name: 'Stunned',
    description: 'Dazed and unable to react effectively',
    mechanicalEffect: 'Incapacitated, cannot move, can speak falteringly, automatically fail DEX saves',
    color: 'text-yellow-600 bg-yellow-100',
  },
  Blinded: {
    name: 'Blinded',
    description: 'Cannot see, impaired vision',
    mechanicalEffect:
      'Automatically fail sight-based checks, disadvantage on attack rolls, attackers have advantage',
    color: 'text-gray-600 bg-gray-100',
  },
  Frightened: {
    name: 'Frightened',
    description: 'Overcome with fear',
    mechanicalEffect:
      'Disadvantage on ability checks and attack rolls while source of fear is visible, cannot willingly move closer to source',
    color: 'text-red-600 bg-red-100',
  },
  Charmed: {
    name: 'Charmed',
    description: 'Magically influenced to be friendly',
    mechanicalEffect: "Cannot attack charmer or target with harmful effects, charmer has advantage on social checks",
    color: 'text-pink-600 bg-pink-100',
  },
}

/**
 * Get display details for a condition
 *
 * @param condition - Condition to get details for
 * @returns Condition details object or undefined if invalid
 *
 * @example
 * ```typescript
 * const details = getConditionDetails('Poisoned')
 * console.log(details?.description)
 * console.log(details?.mechanicalEffect)
 * ```
 */
export function getConditionDetails(condition: Condition) {
  return CONDITION_DETAILS[condition]
}

/**
 * Add a condition to an array (prevents duplicates)
 *
 * @param conditions - Current conditions array
 * @param condition - Condition to add
 * @returns New array with condition added (if not already present)
 *
 * @example
 * ```typescript
 * const current = ['Poisoned']
 * const updated = addCondition(current, 'Stunned')
 * // Returns: ['Poisoned', 'Stunned']
 *
 * const duplicate = addCondition(updated, 'Poisoned')
 * // Returns: ['Poisoned', 'Stunned'] (no duplicate)
 * ```
 */
export function addCondition(conditions: Condition[], condition: Condition): Condition[] {
  if (conditions.includes(condition)) {
    return conditions
  }
  return [...conditions, condition]
}

/**
 * Remove a condition from an array
 *
 * @param conditions - Current conditions array
 * @param condition - Condition to remove
 * @returns New array with condition removed
 *
 * @example
 * ```typescript
 * const current = ['Poisoned', 'Stunned', 'Blinded']
 * const updated = removeCondition(current, 'Stunned')
 * // Returns: ['Poisoned', 'Blinded']
 * ```
 */
export function removeCondition(conditions: Condition[], condition: Condition): Condition[] {
  return conditions.filter((c) => c !== condition)
}

/**
 * Toggle a condition (add if absent, remove if present)
 *
 * @param conditions - Current conditions array
 * @param condition - Condition to toggle
 * @returns New array with condition toggled
 *
 * @example
 * ```typescript
 * const current = ['Poisoned']
 * const withStunned = toggleCondition(current, 'Stunned')
 * // Returns: ['Poisoned', 'Stunned']
 *
 * const withoutStunned = toggleCondition(withStunned, 'Stunned')
 * // Returns: ['Poisoned']
 * ```
 */
export function toggleCondition(conditions: Condition[], condition: Condition): Condition[] {
  if (conditions.includes(condition)) {
    return removeCondition(conditions, condition)
  }
  return addCondition(conditions, condition)
}

/**
 * Check if a condition is active
 *
 * @param conditions - Current conditions array
 * @param condition - Condition to check for
 * @returns true if condition is active, false otherwise
 *
 * @example
 * ```typescript
 * const conditions = ['Poisoned', 'Stunned']
 * hasCondition(conditions, 'Poisoned')  // true
 * hasCondition(conditions, 'Blinded')   // false
 * ```
 */
export function hasCondition(conditions: Condition[], condition: Condition): boolean {
  return conditions.includes(condition)
}
