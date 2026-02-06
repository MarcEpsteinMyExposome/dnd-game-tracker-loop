/**
 * Core Dice Roller - Pure functions for rolling dice
 *
 * Uses crypto.getRandomValues() for better randomness than Math.random().
 * All functions are pure (except for the randomness source) and easy to test.
 *
 * @see Task 01 specification in .claude/tasks/iteration-5/task-01-dice-roller-core.md
 */

/**
 * Result of rolling one or more dice of the same type
 */
export interface DiceRoll {
  /** Number of sides on the dice */
  sides: number
  /** Individual roll results */
  rolls: number[]
  /** Sum of all rolls */
  total: number
}

/**
 * Standard D&D dice sides
 */
export const STANDARD_DICE = [4, 6, 8, 10, 12, 20, 30, 100] as const
export type StandardDie = (typeof STANDARD_DICE)[number]

/**
 * Generate a cryptographically random integer in range [1, max]
 * Uses crypto.getRandomValues() for better randomness than Math.random()
 *
 * @param max - Maximum value (inclusive)
 * @returns Random integer between 1 and max
 */
function getRandomInt(max: number): number {
  // Use crypto for better randomness
  const array = new Uint32Array(1)
  crypto.getRandomValues(array)

  // Scale to range [0, max-1] then add 1 for [1, max]
  return (array[0] % max) + 1
}

/**
 * Roll a single die with the given number of sides
 *
 * @param sides - Number of sides on the die (must be >= 1)
 * @returns The roll result (1 to sides)
 * @throws Error if sides < 1
 *
 * @example
 * ```typescript
 * const result = rollDie(20) // Returns 1-20
 * const d6 = rollDie(6) // Returns 1-6
 * ```
 */
export function rollDie(sides: number): number {
  if (!Number.isInteger(sides) || sides < 1) {
    throw new Error(`Invalid die: sides must be a positive integer, got ${sides}`)
  }

  return getRandomInt(sides)
}

/**
 * Roll multiple dice of the same type
 *
 * @param count - Number of dice to roll (must be >= 1)
 * @param sides - Number of sides on each die (must be >= 1)
 * @returns DiceRoll with individual rolls and total
 * @throws Error if count < 1 or sides < 1
 *
 * @example
 * ```typescript
 * const result = rollDice(2, 6)
 * // { sides: 6, rolls: [3, 5], total: 8 }
 *
 * const d20 = rollDice(1, 20)
 * // { sides: 20, rolls: [15], total: 15 }
 * ```
 */
export function rollDice(count: number, sides: number): DiceRoll {
  if (!Number.isInteger(count) || count < 1) {
    throw new Error(`Invalid dice count: must be a positive integer, got ${count}`)
  }

  if (!Number.isInteger(sides) || sides < 1) {
    throw new Error(`Invalid die sides: must be a positive integer, got ${sides}`)
  }

  const rolls: number[] = []
  for (let i = 0; i < count; i++) {
    rolls.push(rollDie(sides))
  }

  return {
    sides,
    rolls,
    total: rolls.reduce((sum, roll) => sum + roll, 0),
  }
}

/**
 * Roll a standard D&D die by name
 *
 * Convenience function for quick access to common dice.
 *
 * @param die - Standard die type (4, 6, 8, 10, 12, 20, or 100)
 * @returns The roll result
 *
 * @example
 * ```typescript
 * const attack = rollStandardDie(20) // d20
 * const damage = rollStandardDie(8) // d8
 * ```
 */
export function rollStandardDie(die: StandardDie): number {
  return rollDie(die)
}

/**
 * Roll initiative for D&D (d20 + modifier)
 *
 * @param modifier - DEX modifier or other initiative bonus
 * @returns Object with roll, modifier, and total
 *
 * @example
 * ```typescript
 * const init = rollInitiative(3) // d20 + 3
 * // { roll: 15, modifier: 3, total: 18 }
 * ```
 */
export function rollInitiative(modifier: number = 0): {
  roll: number
  modifier: number
  total: number
} {
  const roll = rollDie(20)
  return {
    roll,
    modifier,
    total: roll + modifier,
  }
}

/**
 * Check if a number is a valid die size
 *
 * @param sides - Number to check
 * @returns true if valid die size (positive integer)
 */
export function isValidDieSize(sides: number): boolean {
  return Number.isInteger(sides) && sides >= 1
}

/**
 * Check if a die size is a standard D&D die
 *
 * @param sides - Number to check
 * @returns true if standard D&D die (d4, d6, d8, d10, d12, d20, d100)
 */
export function isStandardDie(sides: number): sides is StandardDie {
  return STANDARD_DICE.includes(sides as StandardDie)
}
