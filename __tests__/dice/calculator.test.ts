/**
 * Dice Calculator/Parser Tests
 *
 * Tests for lib/dice/calculator.ts functionality
 * Covers parsing, validation, and result calculation
 */

import {
  parseDiceNotation,
  isValidDiceNotation,
  formatDiceNotation,
  calculateResult,
  formatDiceResult,
  quickNotation,
  COMMON_NOTATIONS,
  type ParsedDice,
  type DiceResult,
} from '@/lib/dice/calculator'

describe('Dice Calculator/Parser', () => {
  describe('parseDiceNotation', () => {
    describe('basic notation', () => {
      it('should parse "2d6"', () => {
        const result = parseDiceNotation('2d6')
        expect(result).toEqual({
          count: 2,
          sides: 6,
          modifier: 0,
          notation: '2d6',
        })
      })

      it('should parse "1d20"', () => {
        const result = parseDiceNotation('1d20')
        expect(result).toEqual({
          count: 1,
          sides: 20,
          modifier: 0,
          notation: '1d20',
        })
      })

      it('should parse "3d8"', () => {
        const result = parseDiceNotation('3d8')
        expect(result).toEqual({
          count: 3,
          sides: 8,
          modifier: 0,
          notation: '3d8',
        })
      })

      it('should parse "d20" (implied 1)', () => {
        const result = parseDiceNotation('d20')
        expect(result).toEqual({
          count: 1,
          sides: 20,
          modifier: 0,
          notation: '1d20',
        })
      })

      it('should parse "d6" (implied 1)', () => {
        const result = parseDiceNotation('d6')
        expect(result).toEqual({
          count: 1,
          sides: 6,
          modifier: 0,
          notation: '1d6',
        })
      })
    })

    describe('notation with positive modifier', () => {
      it('should parse "1d20+5"', () => {
        const result = parseDiceNotation('1d20+5')
        expect(result).toEqual({
          count: 1,
          sides: 20,
          modifier: 5,
          notation: '1d20+5',
        })
      })

      it('should parse "2d6+3"', () => {
        const result = parseDiceNotation('2d6+3')
        expect(result).toEqual({
          count: 2,
          sides: 6,
          modifier: 3,
          notation: '2d6+3',
        })
      })

      it('should parse "d8+2"', () => {
        const result = parseDiceNotation('d8+2')
        expect(result).toEqual({
          count: 1,
          sides: 8,
          modifier: 2,
          notation: '1d8+2',
        })
      })

      it('should parse "4d4+10"', () => {
        const result = parseDiceNotation('4d4+10')
        expect(result).toEqual({
          count: 4,
          sides: 4,
          modifier: 10,
          notation: '4d4+10',
        })
      })
    })

    describe('notation with negative modifier', () => {
      it('should parse "3d8-2"', () => {
        const result = parseDiceNotation('3d8-2')
        expect(result).toEqual({
          count: 3,
          sides: 8,
          modifier: -2,
          notation: '3d8-2',
        })
      })

      it('should parse "1d20-1"', () => {
        const result = parseDiceNotation('1d20-1')
        expect(result).toEqual({
          count: 1,
          sides: 20,
          modifier: -1,
          notation: '1d20-1',
        })
      })

      it('should parse "d6-3"', () => {
        const result = parseDiceNotation('d6-3')
        expect(result).toEqual({
          count: 1,
          sides: 6,
          modifier: -3,
          notation: '1d6-3',
        })
      })
    })

    describe('case insensitivity and whitespace', () => {
      it('should handle uppercase D', () => {
        const result = parseDiceNotation('2D6')
        expect(result.count).toBe(2)
        expect(result.sides).toBe(6)
      })

      it('should handle mixed case', () => {
        const result = parseDiceNotation('3D8+2')
        expect(result.count).toBe(3)
        expect(result.sides).toBe(8)
        expect(result.modifier).toBe(2)
      })

      it('should trim whitespace', () => {
        const result = parseDiceNotation('  2d6  ')
        expect(result.count).toBe(2)
        expect(result.sides).toBe(6)
      })
    })

    describe('edge cases', () => {
      it('should handle d100', () => {
        const result = parseDiceNotation('1d100')
        expect(result.sides).toBe(100)
      })

      it('should handle large dice counts', () => {
        const result = parseDiceNotation('10d6')
        expect(result.count).toBe(10)
      })

      it('should handle modifier of 0 implicitly', () => {
        const result = parseDiceNotation('2d6')
        expect(result.modifier).toBe(0)
      })
    })

    describe('invalid notation', () => {
      it('should throw for empty string', () => {
        expect(() => parseDiceNotation('')).toThrow('Dice notation cannot be empty')
      })

      it('should throw for whitespace only', () => {
        expect(() => parseDiceNotation('   ')).toThrow('Dice notation cannot be empty')
      })

      it('should throw for invalid format', () => {
        expect(() => parseDiceNotation('invalid')).toThrow('Invalid dice notation')
        expect(() => parseDiceNotation('2+6')).toThrow('Invalid dice notation')
        expect(() => parseDiceNotation('d')).toThrow('Invalid dice notation')
        expect(() => parseDiceNotation('2d')).toThrow('Invalid dice notation')
        expect(() => parseDiceNotation('d+5')).toThrow('Invalid dice notation')
      })

      it('should throw for too many dice', () => {
        expect(() => parseDiceNotation('101d6')).toThrow('Too many dice')
      })

      it('should throw for invalid sides', () => {
        expect(() => parseDiceNotation('2d1001')).toThrow('Invalid die sides')
      })
    })
  })

  describe('isValidDiceNotation', () => {
    it('should return true for valid notation', () => {
      expect(isValidDiceNotation('2d6')).toBe(true)
      expect(isValidDiceNotation('1d20+5')).toBe(true)
      expect(isValidDiceNotation('3d8-2')).toBe(true)
      expect(isValidDiceNotation('d20')).toBe(true)
    })

    it('should return false for invalid notation', () => {
      expect(isValidDiceNotation('')).toBe(false)
      expect(isValidDiceNotation('invalid')).toBe(false)
      expect(isValidDiceNotation('2+6')).toBe(false)
      expect(isValidDiceNotation('101d6')).toBe(false)
    })
  })

  describe('formatDiceNotation', () => {
    it('should format basic notation', () => {
      expect(formatDiceNotation(2, 6)).toBe('2d6')
      expect(formatDiceNotation(1, 20)).toBe('1d20')
      expect(formatDiceNotation(3, 8)).toBe('3d8')
    })

    it('should format with positive modifier', () => {
      expect(formatDiceNotation(2, 6, 3)).toBe('2d6+3')
      expect(formatDiceNotation(1, 20, 5)).toBe('1d20+5')
    })

    it('should format with negative modifier', () => {
      expect(formatDiceNotation(3, 8, -2)).toBe('3d8-2')
      expect(formatDiceNotation(1, 20, -1)).toBe('1d20-1')
    })

    it('should omit modifier when zero', () => {
      expect(formatDiceNotation(2, 6, 0)).toBe('2d6')
    })
  })

  describe('calculateResult', () => {
    it('should calculate basic result', () => {
      const parsed = parseDiceNotation('2d6')
      const result = calculateResult(parsed, [3, 5])

      expect(result.rolls).toEqual([3, 5])
      expect(result.subtotal).toBe(8)
      expect(result.total).toBe(8)
    })

    it('should apply positive modifier', () => {
      const parsed = parseDiceNotation('2d6+3')
      const result = calculateResult(parsed, [4, 5])

      expect(result.subtotal).toBe(9)
      expect(result.total).toBe(12)
    })

    it('should apply negative modifier', () => {
      const parsed = parseDiceNotation('3d8-2')
      const result = calculateResult(parsed, [3, 5, 7])

      expect(result.subtotal).toBe(15)
      expect(result.total).toBe(13)
    })

    it('should include all parsed fields', () => {
      const parsed = parseDiceNotation('2d6+3')
      const result = calculateResult(parsed, [4, 5])

      expect(result.count).toBe(2)
      expect(result.sides).toBe(6)
      expect(result.modifier).toBe(3)
      expect(result.notation).toBe('2d6+3')
    })

    it('should handle single die', () => {
      const parsed = parseDiceNotation('1d20')
      const result = calculateResult(parsed, [15])

      expect(result.rolls).toEqual([15])
      expect(result.subtotal).toBe(15)
      expect(result.total).toBe(15)
    })

    it('should throw for mismatched roll count', () => {
      const parsed = parseDiceNotation('2d6')

      expect(() => calculateResult(parsed, [3])).toThrow('Roll count mismatch')
      expect(() => calculateResult(parsed, [3, 5, 2])).toThrow('Roll count mismatch')
    })

    it('should throw for invalid roll values', () => {
      const parsed = parseDiceNotation('2d6')

      expect(() => calculateResult(parsed, [0, 5])).toThrow('Invalid roll value')
      expect(() => calculateResult(parsed, [3, 7])).toThrow('Invalid roll value')
      expect(() => calculateResult(parsed, [3, -1])).toThrow('Invalid roll value')
    })
  })

  describe('formatDiceResult', () => {
    it('should format basic result', () => {
      const parsed = parseDiceNotation('2d6')
      const result = calculateResult(parsed, [3, 5])

      expect(formatDiceResult(result)).toBe('2d6 → [3, 5] = 8')
    })

    it('should format result with positive modifier', () => {
      const parsed = parseDiceNotation('2d6+3')
      const result = calculateResult(parsed, [4, 5])

      expect(formatDiceResult(result)).toBe('2d6+3 → [4, 5] + 3 = 12')
    })

    it('should format result with negative modifier', () => {
      const parsed = parseDiceNotation('3d8-2')
      const result = calculateResult(parsed, [3, 5, 7])

      expect(formatDiceResult(result)).toBe('3d8-2 → [3, 5, 7] - 2 = 13')
    })

    it('should format single die result', () => {
      const parsed = parseDiceNotation('1d20')
      const result = calculateResult(parsed, [15])

      expect(formatDiceResult(result)).toBe('1d20 → [15] = 15')
    })
  })

  describe('quickNotation', () => {
    it('should create notation for single die', () => {
      expect(quickNotation(20)).toBe('1d20')
      expect(quickNotation(6)).toBe('1d6')
    })

    it('should create notation with modifier', () => {
      expect(quickNotation(20, 5)).toBe('1d20+5')
      expect(quickNotation(8, -2)).toBe('1d8-2')
    })

    it('should handle zero modifier', () => {
      expect(quickNotation(20, 0)).toBe('1d20')
    })
  })

  describe('COMMON_NOTATIONS', () => {
    it('should contain all standard dice', () => {
      expect(COMMON_NOTATIONS.d4).toBe('1d4')
      expect(COMMON_NOTATIONS.d6).toBe('1d6')
      expect(COMMON_NOTATIONS.d8).toBe('1d8')
      expect(COMMON_NOTATIONS.d10).toBe('1d10')
      expect(COMMON_NOTATIONS.d12).toBe('1d12')
      expect(COMMON_NOTATIONS.d20).toBe('1d20')
      expect(COMMON_NOTATIONS.d100).toBe('1d100')
    })

    it('should have advantage and disadvantage', () => {
      expect(COMMON_NOTATIONS.advantage).toBe('2d20')
      expect(COMMON_NOTATIONS.disadvantage).toBe('2d20')
    })

    it('should all be valid notation', () => {
      Object.values(COMMON_NOTATIONS).forEach((notation) => {
        expect(isValidDiceNotation(notation)).toBe(true)
      })
    })
  })
})
