/**
 * Core Dice Roller Tests
 *
 * Tests for lib/dice/roller.ts functionality
 * Covers single die rolls, multiple dice, and edge cases
 */

import {
  rollDie,
  rollDice,
  rollStandardDie,
  rollInitiative,
  isValidDieSize,
  isStandardDie,
  STANDARD_DICE,
  type DiceRoll,
} from '@/lib/dice/roller'

describe('Core Dice Roller', () => {
  describe('rollDie', () => {
    it('should return a value between 1 and sides for d6', () => {
      for (let i = 0; i < 100; i++) {
        const result = rollDie(6)
        expect(result).toBeGreaterThanOrEqual(1)
        expect(result).toBeLessThanOrEqual(6)
      }
    })

    it('should return a value between 1 and sides for d20', () => {
      for (let i = 0; i < 100; i++) {
        const result = rollDie(20)
        expect(result).toBeGreaterThanOrEqual(1)
        expect(result).toBeLessThanOrEqual(20)
      }
    })

    it('should return a value between 1 and sides for d100', () => {
      for (let i = 0; i < 100; i++) {
        const result = rollDie(100)
        expect(result).toBeGreaterThanOrEqual(1)
        expect(result).toBeLessThanOrEqual(100)
      }
    })

    it('should return 1 for d1', () => {
      const result = rollDie(1)
      expect(result).toBe(1)
    })

    it('should throw error for sides < 1', () => {
      expect(() => rollDie(0)).toThrow('Invalid die: sides must be a positive integer')
      expect(() => rollDie(-1)).toThrow('Invalid die: sides must be a positive integer')
    })

    it('should throw error for non-integer sides', () => {
      expect(() => rollDie(2.5)).toThrow('Invalid die: sides must be a positive integer')
      expect(() => rollDie(NaN)).toThrow('Invalid die: sides must be a positive integer')
    })

    it('should return integers only', () => {
      for (let i = 0; i < 100; i++) {
        const result = rollDie(20)
        expect(Number.isInteger(result)).toBe(true)
      }
    })
  })

  describe('rollDice', () => {
    it('should return correct structure for 2d6', () => {
      const result = rollDice(2, 6)

      expect(result).toHaveProperty('sides', 6)
      expect(result).toHaveProperty('rolls')
      expect(result).toHaveProperty('total')
      expect(result.rolls).toHaveLength(2)
    })

    it('should have all rolls in valid range', () => {
      const result = rollDice(5, 8)

      expect(result.rolls).toHaveLength(5)
      result.rolls.forEach((roll) => {
        expect(roll).toBeGreaterThanOrEqual(1)
        expect(roll).toBeLessThanOrEqual(8)
      })
    })

    it('should calculate total correctly', () => {
      for (let i = 0; i < 50; i++) {
        const result = rollDice(3, 6)
        const expectedTotal = result.rolls.reduce((sum, r) => sum + r, 0)
        expect(result.total).toBe(expectedTotal)
      }
    })

    it('should handle single die (1dX)', () => {
      const result = rollDice(1, 20)

      expect(result.rolls).toHaveLength(1)
      expect(result.total).toBe(result.rolls[0])
    })

    it('should handle many dice', () => {
      const result = rollDice(10, 6)

      expect(result.rolls).toHaveLength(10)
      // Minimum possible: 10, Maximum possible: 60
      expect(result.total).toBeGreaterThanOrEqual(10)
      expect(result.total).toBeLessThanOrEqual(60)
    })

    it('should throw error for count < 1', () => {
      expect(() => rollDice(0, 6)).toThrow('Invalid dice count: must be a positive integer')
      expect(() => rollDice(-1, 6)).toThrow('Invalid dice count: must be a positive integer')
    })

    it('should throw error for sides < 1', () => {
      expect(() => rollDice(2, 0)).toThrow('Invalid die sides: must be a positive integer')
      expect(() => rollDice(2, -1)).toThrow('Invalid die sides: must be a positive integer')
    })

    it('should throw error for non-integer count', () => {
      expect(() => rollDice(2.5, 6)).toThrow('Invalid dice count: must be a positive integer')
    })

    it('should throw error for non-integer sides', () => {
      expect(() => rollDice(2, 6.5)).toThrow('Invalid die sides: must be a positive integer')
    })
  })

  describe('rollStandardDie', () => {
    it.each(STANDARD_DICE)('should roll d%i in valid range', (sides) => {
      for (let i = 0; i < 20; i++) {
        const result = rollStandardDie(sides)
        expect(result).toBeGreaterThanOrEqual(1)
        expect(result).toBeLessThanOrEqual(sides)
      }
    })
  })

  describe('rollInitiative', () => {
    it('should return roll, modifier, and total', () => {
      const result = rollInitiative(3)

      expect(result).toHaveProperty('roll')
      expect(result).toHaveProperty('modifier', 3)
      expect(result).toHaveProperty('total')
    })

    it('should calculate total as roll + modifier', () => {
      for (let i = 0; i < 50; i++) {
        const modifier = Math.floor(Math.random() * 11) - 5 // -5 to +5
        const result = rollInitiative(modifier)
        expect(result.total).toBe(result.roll + modifier)
      }
    })

    it('should use d20 for roll', () => {
      for (let i = 0; i < 50; i++) {
        const result = rollInitiative(0)
        expect(result.roll).toBeGreaterThanOrEqual(1)
        expect(result.roll).toBeLessThanOrEqual(20)
      }
    })

    it('should default modifier to 0', () => {
      const result = rollInitiative()
      expect(result.modifier).toBe(0)
      expect(result.total).toBe(result.roll)
    })

    it('should handle negative modifiers', () => {
      const result = rollInitiative(-3)
      expect(result.modifier).toBe(-3)
      expect(result.total).toBe(result.roll - 3)
    })
  })

  describe('isValidDieSize', () => {
    it('should return true for positive integers', () => {
      expect(isValidDieSize(1)).toBe(true)
      expect(isValidDieSize(6)).toBe(true)
      expect(isValidDieSize(20)).toBe(true)
      expect(isValidDieSize(100)).toBe(true)
    })

    it('should return false for zero', () => {
      expect(isValidDieSize(0)).toBe(false)
    })

    it('should return false for negative numbers', () => {
      expect(isValidDieSize(-1)).toBe(false)
      expect(isValidDieSize(-6)).toBe(false)
    })

    it('should return false for non-integers', () => {
      expect(isValidDieSize(2.5)).toBe(false)
      expect(isValidDieSize(6.1)).toBe(false)
    })
  })

  describe('isStandardDie', () => {
    it('should return true for standard D&D dice', () => {
      expect(isStandardDie(4)).toBe(true)
      expect(isStandardDie(6)).toBe(true)
      expect(isStandardDie(8)).toBe(true)
      expect(isStandardDie(10)).toBe(true)
      expect(isStandardDie(12)).toBe(true)
      expect(isStandardDie(20)).toBe(true)
      expect(isStandardDie(100)).toBe(true)
    })

    it('should return false for non-standard dice', () => {
      expect(isStandardDie(3)).toBe(false)
      expect(isStandardDie(5)).toBe(false)
      expect(isStandardDie(7)).toBe(false)
      expect(isStandardDie(30)).toBe(false)
    })
  })

  describe('STANDARD_DICE constant', () => {
    it('should contain all standard D&D dice', () => {
      expect(STANDARD_DICE).toContain(4)
      expect(STANDARD_DICE).toContain(6)
      expect(STANDARD_DICE).toContain(8)
      expect(STANDARD_DICE).toContain(10)
      expect(STANDARD_DICE).toContain(12)
      expect(STANDARD_DICE).toContain(20)
      expect(STANDARD_DICE).toContain(100)
    })

    it('should have exactly 7 dice types', () => {
      expect(STANDARD_DICE).toHaveLength(7)
    })
  })

  describe('Distribution (statistical sanity check)', () => {
    it('should produce varied results over many rolls', () => {
      // Roll d6 100 times and ensure we get at least 4 different values
      const results = new Set<number>()
      for (let i = 0; i < 100; i++) {
        results.add(rollDie(6))
      }
      expect(results.size).toBeGreaterThanOrEqual(4)
    })

    it('should produce reasonable average for 2d6', () => {
      // Expected average for 2d6 is 7
      // With 1000 rolls, we should be reasonably close
      let total = 0
      const iterations = 1000
      for (let i = 0; i < iterations; i++) {
        total += rollDice(2, 6).total
      }
      const average = total / iterations
      // Should be within 1 of expected average (7)
      expect(average).toBeGreaterThan(6)
      expect(average).toBeLessThan(8)
    })
  })
})
