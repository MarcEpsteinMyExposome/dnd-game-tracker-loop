/**
 * Tests for Stats Calculation Utilities
 *
 * Tests all team statistics calculation functions with various scenarios:
 * - Normal team compositions
 * - Edge cases (empty, all dead, etc.)
 * - Boundary conditions
 * - Division by zero protection
 */

import {
  calculateTeamSize,
  calculateAverageHp,
  getHealthyCount,
  getInjuredCount,
  getUnconsciousCount,
} from '@/lib/utils/stats'
import { Character } from '@/lib/schemas/character.schema'

/**
 * Helper to create test character with minimal required fields
 */
function createTestCharacter(overrides: Partial<Character>): Character {
  return {
    id: '123e4567-e89b-12d3-a456-426614174000',
    name: 'Test Character',
    characterClass: 'Fighter',
    level: 1,
    maxHp: 10,
    currentHp: 10,
    armorClass: 10,
    avatarSeed: 'test-seed',
    conditions: [],
    createdAt: '2026-01-20T00:00:00.000Z',
    updatedAt: '2026-01-20T00:00:00.000Z',
    ...overrides,
  }
}

// ============================================
// calculateTeamSize Tests
// ============================================

describe('calculateTeamSize', () => {
  it('returns 0 for empty array', () => {
    expect(calculateTeamSize([])).toBe(0)
  })

  it('returns correct count for single character', () => {
    const characters = [createTestCharacter({})]
    expect(calculateTeamSize(characters)).toBe(1)
  })

  it('returns correct count for multiple characters', () => {
    const characters = [
      createTestCharacter({ id: '1' }),
      createTestCharacter({ id: '2' }),
      createTestCharacter({ id: '3' }),
      createTestCharacter({ id: '4' }),
    ]
    expect(calculateTeamSize(characters)).toBe(4)
  })

  it('counts unconscious characters', () => {
    const characters = [
      createTestCharacter({ currentHp: 10 }),
      createTestCharacter({ currentHp: 0 }), // Unconscious
    ]
    expect(calculateTeamSize(characters)).toBe(2)
  })
})

// ============================================
// calculateAverageHp Tests
// ============================================

describe('calculateAverageHp', () => {
  it('returns 0 for empty array', () => {
    expect(calculateAverageHp([])).toBe(0)
  })

  it('returns 100 for character at full health', () => {
    const characters = [createTestCharacter({ currentHp: 30, maxHp: 30 })]
    expect(calculateAverageHp(characters)).toBe(100)
  })

  it('returns 0 for character at 0 HP', () => {
    const characters = [createTestCharacter({ currentHp: 0, maxHp: 30 })]
    expect(calculateAverageHp(characters)).toBe(0)
  })

  it('calculates correct average for multiple characters', () => {
    const characters = [
      createTestCharacter({ currentHp: 30, maxHp: 30 }), // 100%
      createTestCharacter({ currentHp: 15, maxHp: 30 }), // 50%
    ]
    // Average: (100 + 50) / 2 = 75
    expect(calculateAverageHp(characters)).toBe(75)
  })

  it('calculates average with different max HP values', () => {
    const characters = [
      createTestCharacter({ currentHp: 20, maxHp: 20 }), // 100%
      createTestCharacter({ currentHp: 25, maxHp: 50 }), // 50%
      createTestCharacter({ currentHp: 30, maxHp: 40 }), // 75%
    ]
    // Average: (100 + 50 + 75) / 3 = 75
    expect(calculateAverageHp(characters)).toBe(75)
  })

  it('handles character with 0 maxHp gracefully', () => {
    const characters = [
      createTestCharacter({ currentHp: 20, maxHp: 20 }), // 100%
      createTestCharacter({ currentHp: 0, maxHp: 0 }), // Invalid, excluded from sum
    ]
    // Character with 0 maxHp contributes 0 to sum, still counted in division
    // Result: 100 / 2 = 50
    expect(calculateAverageHp(characters)).toBe(50)
  })

  it('returns 0 when all characters have 0 maxHp', () => {
    const characters = [
      createTestCharacter({ currentHp: 0, maxHp: 0 }),
      createTestCharacter({ currentHp: 0, maxHp: 0 }),
    ]
    expect(calculateAverageHp(characters)).toBe(0)
  })

  it('rounds to nearest integer', () => {
    const characters = [
      createTestCharacter({ currentHp: 10, maxHp: 30 }), // 33.33%
      createTestCharacter({ currentHp: 20, maxHp: 30 }), // 66.67%
    ]
    // Average: (33.33 + 66.67) / 2 = 50
    expect(calculateAverageHp(characters)).toBe(50)
  })
})

// ============================================
// getHealthyCount Tests
// ============================================

describe('getHealthyCount', () => {
  it('returns 0 for empty array', () => {
    expect(getHealthyCount([])).toBe(0)
  })

  it('counts character at 100% HP as healthy', () => {
    const characters = [createTestCharacter({ currentHp: 30, maxHp: 30 })]
    expect(getHealthyCount(characters)).toBe(1)
  })

  it('counts character at 76% HP as healthy', () => {
    const characters = [createTestCharacter({ currentHp: 76, maxHp: 100 })]
    expect(getHealthyCount(characters)).toBe(1)
  })

  it('does NOT count character at exactly 75% HP as healthy (boundary)', () => {
    const characters = [createTestCharacter({ currentHp: 75, maxHp: 100 })]
    expect(getHealthyCount(characters)).toBe(0)
  })

  it('does NOT count character at 50% HP as healthy', () => {
    const characters = [createTestCharacter({ currentHp: 15, maxHp: 30 })]
    expect(getHealthyCount(characters)).toBe(0)
  })

  it('does NOT count character at 0% HP as healthy', () => {
    const characters = [createTestCharacter({ currentHp: 0, maxHp: 30 })]
    expect(getHealthyCount(characters)).toBe(0)
  })

  it('counts only healthy characters in mixed team', () => {
    const characters = [
      createTestCharacter({ currentHp: 30, maxHp: 30 }), // 100% - Healthy
      createTestCharacter({ currentHp: 80, maxHp: 100 }), // 80% - Healthy
      createTestCharacter({ currentHp: 75, maxHp: 100 }), // 75% - Not healthy (boundary)
      createTestCharacter({ currentHp: 15, maxHp: 30 }), // 50% - Injured
      createTestCharacter({ currentHp: 0, maxHp: 30 }), // 0% - Unconscious
    ]
    expect(getHealthyCount(characters)).toBe(2)
  })

  it('handles character with 0 maxHp gracefully', () => {
    const characters = [
      createTestCharacter({ currentHp: 30, maxHp: 30 }), // Healthy
      createTestCharacter({ currentHp: 0, maxHp: 0 }), // Invalid
    ]
    expect(getHealthyCount(characters)).toBe(1)
  })

  it('returns correct count when all characters are healthy', () => {
    const characters = [
      createTestCharacter({ currentHp: 30, maxHp: 30 }),
      createTestCharacter({ currentHp: 80, maxHp: 100 }),
      createTestCharacter({ currentHp: 40, maxHp: 50 }),
    ]
    expect(getHealthyCount(characters)).toBe(3)
  })

  it('returns 0 when no characters are healthy', () => {
    const characters = [
      createTestCharacter({ currentHp: 15, maxHp: 30 }), // 50%
      createTestCharacter({ currentHp: 10, maxHp: 30 }), // 33%
      createTestCharacter({ currentHp: 0, maxHp: 30 }), // 0%
    ]
    expect(getHealthyCount(characters)).toBe(0)
  })
})

// ============================================
// getInjuredCount Tests
// ============================================

describe('getInjuredCount', () => {
  it('returns 0 for empty array', () => {
    expect(getInjuredCount([])).toBe(0)
  })

  it('does NOT count character at 100% HP as injured', () => {
    const characters = [createTestCharacter({ currentHp: 30, maxHp: 30 })]
    expect(getInjuredCount(characters)).toBe(0)
  })

  it('does NOT count character at 76% HP as injured', () => {
    const characters = [createTestCharacter({ currentHp: 76, maxHp: 100 })]
    expect(getInjuredCount(characters)).toBe(0)
  })

  it('counts character at exactly 75% HP as injured (boundary)', () => {
    const characters = [createTestCharacter({ currentHp: 75, maxHp: 100 })]
    expect(getInjuredCount(characters)).toBe(1)
  })

  it('counts character at 50% HP as injured', () => {
    const characters = [createTestCharacter({ currentHp: 15, maxHp: 30 })]
    expect(getInjuredCount(characters)).toBe(1)
  })

  it('counts character at 1% HP as injured', () => {
    const characters = [createTestCharacter({ currentHp: 1, maxHp: 100 })]
    expect(getInjuredCount(characters)).toBe(1)
  })

  it('does NOT count character at 0% HP as injured (unconscious instead)', () => {
    const characters = [createTestCharacter({ currentHp: 0, maxHp: 30 })]
    expect(getInjuredCount(characters)).toBe(0)
  })

  it('counts only injured characters in mixed team', () => {
    const characters = [
      createTestCharacter({ currentHp: 30, maxHp: 30 }), // 100% - Healthy
      createTestCharacter({ currentHp: 80, maxHp: 100 }), // 80% - Healthy
      createTestCharacter({ currentHp: 75, maxHp: 100 }), // 75% - Injured (boundary)
      createTestCharacter({ currentHp: 15, maxHp: 30 }), // 50% - Injured
      createTestCharacter({ currentHp: 1, maxHp: 30 }), // 3% - Injured
      createTestCharacter({ currentHp: 0, maxHp: 30 }), // 0% - Unconscious
    ]
    expect(getInjuredCount(characters)).toBe(3)
  })

  it('handles character with 0 maxHp gracefully', () => {
    const characters = [
      createTestCharacter({ currentHp: 15, maxHp: 30 }), // Injured
      createTestCharacter({ currentHp: 0, maxHp: 0 }), // Invalid
    ]
    expect(getInjuredCount(characters)).toBe(1)
  })

  it('returns correct count when all characters are injured', () => {
    const characters = [
      createTestCharacter({ currentHp: 15, maxHp: 30 }), // 50%
      createTestCharacter({ currentHp: 10, maxHp: 30 }), // 33%
      createTestCharacter({ currentHp: 1, maxHp: 30 }), // 3%
    ]
    expect(getInjuredCount(characters)).toBe(3)
  })

  it('returns 0 when no characters are injured', () => {
    const characters = [
      createTestCharacter({ currentHp: 30, maxHp: 30 }), // Healthy
      createTestCharacter({ currentHp: 0, maxHp: 30 }), // Unconscious
    ]
    expect(getInjuredCount(characters)).toBe(0)
  })
})

// ============================================
// getUnconsciousCount Tests
// ============================================

describe('getUnconsciousCount', () => {
  it('returns 0 for empty array', () => {
    expect(getUnconsciousCount([])).toBe(0)
  })

  it('counts character at 0 HP as unconscious', () => {
    const characters = [createTestCharacter({ currentHp: 0, maxHp: 30 })]
    expect(getUnconsciousCount(characters)).toBe(1)
  })

  it('does NOT count character at 1 HP as unconscious', () => {
    const characters = [createTestCharacter({ currentHp: 1, maxHp: 30 })]
    expect(getUnconsciousCount(characters)).toBe(0)
  })

  it('does NOT count character at full HP as unconscious', () => {
    const characters = [createTestCharacter({ currentHp: 30, maxHp: 30 })]
    expect(getUnconsciousCount(characters)).toBe(0)
  })

  it('counts multiple unconscious characters', () => {
    const characters = [
      createTestCharacter({ currentHp: 30, maxHp: 30 }), // Healthy
      createTestCharacter({ currentHp: 0, maxHp: 50 }), // Unconscious
      createTestCharacter({ currentHp: 15, maxHp: 30 }), // Injured
      createTestCharacter({ currentHp: 0, maxHp: 20 }), // Unconscious
    ]
    expect(getUnconsciousCount(characters)).toBe(2)
  })

  it('returns correct count when all characters are unconscious', () => {
    const characters = [
      createTestCharacter({ currentHp: 0, maxHp: 30 }),
      createTestCharacter({ currentHp: 0, maxHp: 50 }),
      createTestCharacter({ currentHp: 0, maxHp: 20 }),
    ]
    expect(getUnconsciousCount(characters)).toBe(3)
  })

  it('returns 0 when no characters are unconscious', () => {
    const characters = [
      createTestCharacter({ currentHp: 30, maxHp: 30 }),
      createTestCharacter({ currentHp: 15, maxHp: 30 }),
      createTestCharacter({ currentHp: 1, maxHp: 30 }),
    ]
    expect(getUnconsciousCount(characters)).toBe(0)
  })

  it('handles character with 0 currentHp and 0 maxHp', () => {
    const characters = [createTestCharacter({ currentHp: 0, maxHp: 0 })]
    expect(getUnconsciousCount(characters)).toBe(1)
  })
})

// ============================================
// Integration Tests - All Functions Together
// ============================================

describe('Stats Functions Integration', () => {
  it('provides consistent counts that add up to team size', () => {
    const characters = [
      createTestCharacter({ currentHp: 30, maxHp: 30 }), // Healthy
      createTestCharacter({ currentHp: 80, maxHp: 100 }), // Healthy
      createTestCharacter({ currentHp: 15, maxHp: 30 }), // Injured
      createTestCharacter({ currentHp: 10, maxHp: 30 }), // Injured
      createTestCharacter({ currentHp: 0, maxHp: 30 }), // Unconscious
    ]

    const teamSize = calculateTeamSize(characters)
    const healthy = getHealthyCount(characters)
    const injured = getInjuredCount(characters)
    const unconscious = getUnconsciousCount(characters)

    // All characters should be categorized
    expect(healthy + injured + unconscious).toBe(teamSize)
    expect(teamSize).toBe(5)
    expect(healthy).toBe(2)
    expect(injured).toBe(2)
    expect(unconscious).toBe(1)
  })

  it('handles team where everyone is at full health', () => {
    const characters = [
      createTestCharacter({ currentHp: 30, maxHp: 30 }),
      createTestCharacter({ currentHp: 40, maxHp: 40 }),
      createTestCharacter({ currentHp: 50, maxHp: 50 }),
    ]

    expect(calculateTeamSize(characters)).toBe(3)
    expect(calculateAverageHp(characters)).toBe(100)
    expect(getHealthyCount(characters)).toBe(3)
    expect(getInjuredCount(characters)).toBe(0)
    expect(getUnconsciousCount(characters)).toBe(0)
  })

  it('handles team where everyone is unconscious', () => {
    const characters = [
      createTestCharacter({ currentHp: 0, maxHp: 30 }),
      createTestCharacter({ currentHp: 0, maxHp: 40 }),
      createTestCharacter({ currentHp: 0, maxHp: 50 }),
    ]

    expect(calculateTeamSize(characters)).toBe(3)
    expect(calculateAverageHp(characters)).toBe(0)
    expect(getHealthyCount(characters)).toBe(0)
    expect(getInjuredCount(characters)).toBe(0)
    expect(getUnconsciousCount(characters)).toBe(3)
  })

  it('handles empty team consistently', () => {
    const characters: Character[] = []

    expect(calculateTeamSize(characters)).toBe(0)
    expect(calculateAverageHp(characters)).toBe(0)
    expect(getHealthyCount(characters)).toBe(0)
    expect(getInjuredCount(characters)).toBe(0)
    expect(getUnconsciousCount(characters)).toBe(0)
  })
})
