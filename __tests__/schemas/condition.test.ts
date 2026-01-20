/**
 * Condition Schema Tests
 *
 * Tests for condition.schema.ts validation and helper functions
 */

import {
  ConditionEnum,
  ConditionsArraySchema,
  ALL_CONDITIONS,
  CONDITION_DETAILS,
  isValidCondition,
  isValidConditionsArray,
  addCondition,
  removeCondition,
  toggleCondition,
  hasCondition,
  getConditionDetails,
  type Condition,
} from '@/lib/schemas/condition.schema'

describe('ConditionEnum', () => {
  it('should validate all 7 standard conditions', () => {
    const conditions = ['Poisoned', 'Prone', 'Paralyzed', 'Stunned', 'Blinded', 'Frightened', 'Charmed']
    conditions.forEach((condition) => {
      const result = ConditionEnum.safeParse(condition)
      expect(result.success).toBe(true)
    })
  })

  it('should reject invalid conditions', () => {
    const invalid = ['Flying', 'Invisible', 'Invalid']
    invalid.forEach((condition) => {
      const result = ConditionEnum.safeParse(condition)
      expect(result.success).toBe(false)
    })
  })
})

describe('ConditionsArraySchema', () => {
  it('should validate empty array', () => {
    const result = ConditionsArraySchema.safeParse([])
    expect(result.success).toBe(true)
  })

  it('should validate array with valid conditions', () => {
    const result = ConditionsArraySchema.safeParse(['Poisoned', 'Stunned'])
    expect(result.success).toBe(true)
  })

  it('should reject array with invalid condition', () => {
    const result = ConditionsArraySchema.safeParse(['Poisoned', 'Invalid'])
    expect(result.success).toBe(false)
  })

  it('should default to empty array', () => {
    const result = ConditionsArraySchema.safeParse(undefined)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data).toEqual([])
    }
  })
})

describe('ALL_CONDITIONS', () => {
  it('should contain all 7 conditions', () => {
    expect(ALL_CONDITIONS).toHaveLength(7)
  })

  it('should include all standard conditions', () => {
    expect(ALL_CONDITIONS).toContain('Poisoned')
    expect(ALL_CONDITIONS).toContain('Prone')
    expect(ALL_CONDITIONS).toContain('Paralyzed')
    expect(ALL_CONDITIONS).toContain('Stunned')
    expect(ALL_CONDITIONS).toContain('Blinded')
    expect(ALL_CONDITIONS).toContain('Frightened')
    expect(ALL_CONDITIONS).toContain('Charmed')
  })
})

describe('CONDITION_DETAILS', () => {
  it('should have details for all conditions', () => {
    ALL_CONDITIONS.forEach((condition) => {
      expect(CONDITION_DETAILS[condition]).toBeDefined()
    })
  })

  it('should have required properties for each condition', () => {
    ALL_CONDITIONS.forEach((condition) => {
      const details = CONDITION_DETAILS[condition]
      expect(details.name).toBe(condition)
      expect(details.description).toBeTruthy()
      expect(details.mechanicalEffect).toBeTruthy()
      expect(details.color).toBeTruthy()
    })
  })
})

describe('isValidCondition', () => {
  it('should return true for valid conditions', () => {
    expect(isValidCondition('Poisoned')).toBe(true)
    expect(isValidCondition('Stunned')).toBe(true)
  })

  it('should return false for invalid conditions', () => {
    expect(isValidCondition('Invalid')).toBe(false)
    expect(isValidCondition('Flying')).toBe(false)
    expect(isValidCondition(123)).toBe(false)
  })
})

describe('isValidConditionsArray', () => {
  it('should return true for valid arrays', () => {
    expect(isValidConditionsArray([])).toBe(true)
    expect(isValidConditionsArray(['Poisoned'])).toBe(true)
    expect(isValidConditionsArray(['Poisoned', 'Stunned'])).toBe(true)
  })

  it('should return false for invalid arrays', () => {
    expect(isValidConditionsArray(['Invalid'])).toBe(false)
    expect(isValidConditionsArray(['Poisoned', 'Invalid'])).toBe(false)
    expect(isValidConditionsArray('not-an-array')).toBe(false)
  })
})

describe('addCondition', () => {
  it('should add condition to empty array', () => {
    const result = addCondition([], 'Poisoned')
    expect(result).toEqual(['Poisoned'])
  })

  it('should add condition to existing array', () => {
    const result = addCondition(['Stunned'], 'Poisoned')
    expect(result).toEqual(['Stunned', 'Poisoned'])
  })

  it('should not add duplicate condition', () => {
    const result = addCondition(['Poisoned'], 'Poisoned')
    expect(result).toEqual(['Poisoned'])
  })

  it('should not mutate original array', () => {
    const original: Condition[] = ['Stunned']
    const result = addCondition(original, 'Poisoned')
    expect(original).toEqual(['Stunned'])
    expect(result).toEqual(['Stunned', 'Poisoned'])
  })
})

describe('removeCondition', () => {
  it('should remove condition from array', () => {
    const result = removeCondition(['Poisoned', 'Stunned'], 'Poisoned')
    expect(result).toEqual(['Stunned'])
  })

  it('should handle removing non-existent condition', () => {
    const result = removeCondition(['Stunned'], 'Poisoned')
    expect(result).toEqual(['Stunned'])
  })

  it('should handle empty array', () => {
    const result = removeCondition([], 'Poisoned')
    expect(result).toEqual([])
  })

  it('should not mutate original array', () => {
    const original: Condition[] = ['Poisoned', 'Stunned']
    const result = removeCondition(original, 'Poisoned')
    expect(original).toEqual(['Poisoned', 'Stunned'])
    expect(result).toEqual(['Stunned'])
  })
})

describe('toggleCondition', () => {
  it('should add condition if not present', () => {
    const result = toggleCondition(['Stunned'], 'Poisoned')
    expect(result).toEqual(['Stunned', 'Poisoned'])
  })

  it('should remove condition if present', () => {
    const result = toggleCondition(['Poisoned', 'Stunned'], 'Poisoned')
    expect(result).toEqual(['Stunned'])
  })

  it('should handle empty array', () => {
    const result = toggleCondition([], 'Poisoned')
    expect(result).toEqual(['Poisoned'])
  })

  it('should not mutate original array', () => {
    const original: Condition[] = ['Stunned']
    const result = toggleCondition(original, 'Poisoned')
    expect(original).toEqual(['Stunned'])
    expect(result).toEqual(['Stunned', 'Poisoned'])
  })
})

describe('hasCondition', () => {
  it('should return true if condition present', () => {
    expect(hasCondition(['Poisoned', 'Stunned'], 'Poisoned')).toBe(true)
  })

  it('should return false if condition absent', () => {
    expect(hasCondition(['Stunned'], 'Poisoned')).toBe(false)
  })

  it('should return false for empty array', () => {
    expect(hasCondition([], 'Poisoned')).toBe(false)
  })
})

describe('getConditionDetails', () => {
  it('should return details for valid condition', () => {
    const details = getConditionDetails('Poisoned')
    expect(details).toBeDefined()
    expect(details.name).toBe('Poisoned')
    expect(details.description).toBeTruthy()
  })

  it('should return details for all conditions', () => {
    ALL_CONDITIONS.forEach((condition) => {
      const details = getConditionDetails(condition)
      expect(details).toBeDefined()
      expect(details.name).toBe(condition)
    })
  })
})
