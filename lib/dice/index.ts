/**
 * Dice Library
 *
 * Core dice rolling logic and notation parsing.
 */

export {
  rollDie,
  rollDice,
  rollStandardDie,
  rollInitiative,
  isValidDieSize,
  isStandardDie,
  STANDARD_DICE,
} from './roller'
export type { DiceRoll, StandardDie } from './roller'

export {
  parseDiceNotation,
  isValidDiceNotation,
  formatDiceNotation,
  calculateResult,
  formatDiceResult,
  quickNotation,
  COMMON_NOTATIONS,
} from './calculator'
export type { ParsedDice, DiceResult } from './calculator'
