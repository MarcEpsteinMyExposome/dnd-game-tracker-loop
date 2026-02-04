/**
 * Dice Calculator/Parser - Parse and calculate dice notation
 *
 * Supports standard D&D dice notation: XdY, XdY+Z, XdY-Z, dY
 * Provides parsing, validation, and result calculation.
 *
 * @see Task 02 specification in .claude/tasks/iteration-5/task-02-dice-calculator.md
 */

/**
 * Parsed dice notation components
 */
export interface ParsedDice {
  /** Number of dice to roll */
  count: number
  /** Number of sides on each die */
  sides: number
  /** Modifier to add/subtract from total */
  modifier: number
  /** Original notation string (normalized) */
  notation: string
}

/**
 * Complete dice roll result
 */
export interface DiceResult extends ParsedDice {
  /** Individual roll results */
  rolls: number[]
  /** Sum of dice rolls (before modifier) */
  subtotal: number
  /** Final total (subtotal + modifier) */
  total: number
}

/**
 * Regex pattern for dice notation
 * Matches: XdY, XdY+Z, XdY-Z, dY, dY+Z, dY-Z
 *
 * Groups:
 * 1: count (optional, defaults to 1)
 * 2: sides (required)
 * 3: modifier sign and value (optional)
 */
const DICE_NOTATION_REGEX = /^(\d+)?d(\d+)([+-]\d+)?$/i

/**
 * Parse a dice notation string into its components
 *
 * Supported formats:
 * - "2d6" -> { count: 2, sides: 6, modifier: 0 }
 * - "1d20+5" -> { count: 1, sides: 20, modifier: 5 }
 * - "3d8-2" -> { count: 3, sides: 8, modifier: -2 }
 * - "d20" -> { count: 1, sides: 20, modifier: 0 }
 * - "d6+3" -> { count: 1, sides: 6, modifier: 3 }
 *
 * @param notation - Dice notation string to parse
 * @returns Parsed dice components
 * @throws Error if notation is invalid
 *
 * @example
 * ```typescript
 * parseDiceNotation("2d6+3")
 * // { count: 2, sides: 6, modifier: 3, notation: "2d6+3" }
 *
 * parseDiceNotation("d20")
 * // { count: 1, sides: 20, modifier: 0, notation: "1d20" }
 * ```
 */
export function parseDiceNotation(notation: string): ParsedDice {
  const trimmed = notation.trim().toLowerCase()

  if (!trimmed) {
    throw new Error('Dice notation cannot be empty')
  }

  const match = trimmed.match(DICE_NOTATION_REGEX)

  if (!match) {
    throw new Error(`Invalid dice notation: "${notation}". Expected format: XdY, XdY+Z, or XdY-Z`)
  }

  const count = match[1] ? parseInt(match[1], 10) : 1
  const sides = parseInt(match[2], 10)
  const modifier = match[3] ? parseInt(match[3], 10) : 0

  // Validate ranges
  if (count < 1) {
    throw new Error(`Invalid dice count: ${count}. Must be at least 1`)
  }

  if (count > 100) {
    throw new Error(`Too many dice: ${count}. Maximum is 100`)
  }

  if (sides < 1) {
    throw new Error(`Invalid die sides: ${sides}. Must be at least 1`)
  }

  if (sides > 1000) {
    throw new Error(`Invalid die sides: ${sides}. Maximum is 1000`)
  }

  // Normalize the notation string
  const normalizedNotation = formatDiceNotation(count, sides, modifier)

  return {
    count,
    sides,
    modifier,
    notation: normalizedNotation,
  }
}

/**
 * Check if a string is valid dice notation
 *
 * @param notation - String to validate
 * @returns true if valid dice notation
 *
 * @example
 * ```typescript
 * isValidDiceNotation("2d6") // true
 * isValidDiceNotation("invalid") // false
 * isValidDiceNotation("") // false
 * ```
 */
export function isValidDiceNotation(notation: string): boolean {
  try {
    parseDiceNotation(notation)
    return true
  } catch {
    return false
  }
}

/**
 * Format dice components into notation string
 *
 * @param count - Number of dice
 * @param sides - Number of sides
 * @param modifier - Modifier (default 0)
 * @returns Formatted notation string
 *
 * @example
 * ```typescript
 * formatDiceNotation(2, 6, 3) // "2d6+3"
 * formatDiceNotation(1, 20, 0) // "1d20"
 * formatDiceNotation(3, 8, -2) // "3d8-2"
 * ```
 */
export function formatDiceNotation(count: number, sides: number, modifier: number = 0): string {
  let notation = `${count}d${sides}`

  if (modifier > 0) {
    notation += `+${modifier}`
  } else if (modifier < 0) {
    notation += `${modifier}` // Already includes minus sign
  }

  return notation
}

/**
 * Calculate dice result from parsed components and roll values
 *
 * @param parsed - Parsed dice components
 * @param rolls - Array of roll values
 * @returns Complete dice result
 *
 * @example
 * ```typescript
 * const parsed = parseDiceNotation("2d6+3")
 * const result = calculateResult(parsed, [4, 5])
 * // { ...parsed, rolls: [4, 5], subtotal: 9, total: 12 }
 * ```
 */
export function calculateResult(parsed: ParsedDice, rolls: number[]): DiceResult {
  if (rolls.length !== parsed.count) {
    throw new Error(
      `Roll count mismatch: expected ${parsed.count} rolls, got ${rolls.length}`
    )
  }

  // Validate each roll is within valid range
  for (const roll of rolls) {
    if (!Number.isInteger(roll) || roll < 1 || roll > parsed.sides) {
      throw new Error(
        `Invalid roll value: ${roll}. Must be between 1 and ${parsed.sides}`
      )
    }
  }

  const subtotal = rolls.reduce((sum, roll) => sum + roll, 0)
  const total = subtotal + parsed.modifier

  return {
    ...parsed,
    rolls,
    subtotal,
    total,
  }
}

/**
 * Format a dice result for display
 *
 * @param result - Dice result to format
 * @returns Human-readable result string
 *
 * @example
 * ```typescript
 * formatDiceResult(result)
 * // "2d6+3 → [4, 5] + 3 = 12"
 * ```
 */
export function formatDiceResult(result: DiceResult): string {
  const rollsStr = `[${result.rolls.join(', ')}]`

  if (result.modifier === 0) {
    return `${result.notation} → ${rollsStr} = ${result.total}`
  }

  const modifierStr = result.modifier > 0 ? `+ ${result.modifier}` : `- ${Math.abs(result.modifier)}`
  return `${result.notation} → ${rollsStr} ${modifierStr} = ${result.total}`
}

/**
 * Create a quick dice notation for a single die type
 *
 * @param sides - Number of sides
 * @param modifier - Optional modifier
 * @returns Formatted notation string
 *
 * @example
 * ```typescript
 * quickNotation(20) // "1d20"
 * quickNotation(20, 5) // "1d20+5"
 * ```
 */
export function quickNotation(sides: number, modifier: number = 0): string {
  return formatDiceNotation(1, sides, modifier)
}

/**
 * Common dice notation presets
 */
export const COMMON_NOTATIONS = {
  d4: '1d4',
  d6: '1d6',
  d8: '1d8',
  d10: '1d10',
  d12: '1d12',
  d20: '1d20',
  d100: '1d100',
  advantage: '2d20', // Roll 2, take highest (handled by caller)
  disadvantage: '2d20', // Roll 2, take lowest (handled by caller)
} as const
