/**
 * Team Statistics Utilities
 *
 * Provides functions for calculating team-wide statistics from character data.
 * Used by the Dashboard component to display team health and status overview.
 */

import { Character } from '@/lib/schemas'

/**
 * Calculates the total number of characters in the team
 *
 * @param characters - Array of character objects
 * @returns Total count of characters
 *
 * @example
 * const size = calculateTeamSize(characters) // 4
 */
export function calculateTeamSize(characters: Character[]): number {
  return characters.length
}

/**
 * Calculates the average HP percentage across all characters
 *
 * HP percentage is calculated as (currentHp / maxHp) * 100 for each character,
 * then averaged across the entire team.
 *
 * @param characters - Array of character objects
 * @returns Average HP percentage (0-100), or 0 if no characters
 *
 * @example
 * const avgHp = calculateAverageHp(characters) // 75.5
 */
export function calculateAverageHp(characters: Character[]): number {
  if (characters.length === 0) {
    return 0
  }

  const totalHpPercentage = characters.reduce((sum, char) => {
    // Avoid division by zero
    if (char.maxHp === 0) {
      return sum
    }
    const hpPercentage = (char.currentHp / char.maxHp) * 100
    return sum + hpPercentage
  }, 0)

  return Math.round(totalHpPercentage / characters.length)
}

/**
 * Counts characters with HP above 75% (healthy)
 *
 * A character is considered "healthy" if their current HP is greater than
 * 75% of their maximum HP.
 *
 * @param characters - Array of character objects
 * @returns Count of healthy characters
 *
 * @example
 * const healthy = getHealthyCount(characters) // 3
 */
export function getHealthyCount(characters: Character[]): number {
  return characters.filter((char) => {
    if (char.maxHp === 0) {
      return false
    }
    const hpPercentage = (char.currentHp / char.maxHp) * 100
    return hpPercentage > 75
  }).length
}

/**
 * Counts characters with HP between 1% and 75% (injured)
 *
 * A character is considered "injured" if their current HP is between
 * 1% and 75% of their maximum HP (inclusive).
 *
 * @param characters - Array of character objects
 * @returns Count of injured characters
 *
 * @example
 * const injured = getInjuredCount(characters) // 2
 */
export function getInjuredCount(characters: Character[]): number {
  return characters.filter((char) => {
    if (char.maxHp === 0) {
      return false
    }
    const hpPercentage = (char.currentHp / char.maxHp) * 100
    return hpPercentage > 0 && hpPercentage <= 75
  }).length
}

/**
 * Counts characters with 0 HP (unconscious/dead)
 *
 * A character is considered "unconscious" if their current HP is 0.
 * In D&D rules, 0 HP typically means unconscious and making death saves.
 *
 * @param characters - Array of character objects
 * @returns Count of unconscious characters
 *
 * @example
 * const unconscious = getUnconsciousCount(characters) // 1
 */
export function getUnconsciousCount(characters: Character[]): number {
  return characters.filter((char) => char.currentHp === 0).length
}