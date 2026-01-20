/**
 * Validation Helpers Tests
 *
 * Tests for validation/helpers.ts utility functions
 */

import { z } from 'zod'
import {
  validateWithSchema,
  validateAndParse,
  isValid,
  getFirstError,
  getAllErrors,
  validatePartial,
  validateArray,
  createTypeGuard,
  sanitizeAndValidate,
  validateWithDefaults,
} from '@/lib/validation/helpers'

// Test schema
const TestSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  age: z.number().min(0, 'Age must be non-negative').max(150, 'Age too high'),
  email: z.string().email('Invalid email format'),
  role: z.enum(['user', 'admin']),
  active: z.boolean().default(true),
})

type TestType = z.infer<typeof TestSchema>

const validData: TestType = {
  name: 'John Doe',
  age: 30,
  email: 'john@example.com',
  role: 'user',
  active: true,
}

describe('validateWithSchema', () => {
  it('should return success for valid data', () => {
    const result = validateWithSchema(TestSchema, validData)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data).toEqual(validData)
      expect(result.error).toBeNull()
    }
  })

  it('should return error for invalid data', () => {
    const invalidData = { name: '', age: -1, email: 'invalid', role: 'invalid' }
    const result = validateWithSchema(TestSchema, invalidData)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.data).toBeNull()
      expect(result.error.issues.length).toBeGreaterThan(0)
      expect(result.error.message).toContain('Validation failed')
    }
  })

  it('should format error paths correctly', () => {
    const invalidData = { name: '', age: 30, email: 'john@example.com', role: 'user' }
    const result = validateWithSchema(TestSchema, invalidData)
    expect(result.success).toBe(false)
    if (!result.success) {
      const nameError = result.error.issues.find((issue) => issue.path === 'name')
      expect(nameError).toBeDefined()
      expect(nameError?.message).toBe('Name is required')
    }
  })

  it('should handle nested validation errors', () => {
    const NestedSchema = z.object({
      user: z.object({
        name: z.string().min(1),
        email: z.string().email(),
      }),
    })
    const invalidData = { user: { name: '', email: 'invalid' } }
    const result = validateWithSchema(NestedSchema, invalidData)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues.some((issue) => issue.path.includes('user'))).toBe(true)
    }
  })
})

describe('validateAndParse', () => {
  it('should return parsed data for valid input', () => {
    const data = validateAndParse(TestSchema, validData)
    expect(data).toEqual(validData)
  })

  it('should throw for invalid input', () => {
    const invalidData = { name: '', age: -1 }
    expect(() => validateAndParse(TestSchema, invalidData)).toThrow()
  })
})

describe('isValid', () => {
  it('should return true for valid data', () => {
    expect(isValid(TestSchema, validData)).toBe(true)
  })

  it('should return false for invalid data', () => {
    const invalidData = { name: '', age: -1 }
    expect(isValid(TestSchema, invalidData)).toBe(false)
  })

  it('should return false for missing required fields', () => {
    const incompleteData = { name: 'John' }
    expect(isValid(TestSchema, incompleteData)).toBe(false)
  })
})

describe('getFirstError', () => {
  it('should return null for valid data', () => {
    const error = getFirstError(TestSchema, validData)
    expect(error).toBeNull()
  })

  it('should return first error message for invalid data', () => {
    const invalidData = { name: '', age: -1, email: 'invalid', role: 'user' }
    const error = getFirstError(TestSchema, invalidData)
    expect(error).toBeTruthy()
    expect(typeof error).toBe('string')
  })

  it('should include path in error message', () => {
    const invalidData = { name: '', age: 30, email: 'john@example.com', role: 'user' }
    const error = getFirstError(TestSchema, invalidData)
    expect(error).toContain('name')
  })
})

describe('getAllErrors', () => {
  it('should return empty array for valid data', () => {
    const errors = getAllErrors(TestSchema, validData)
    expect(errors).toEqual([])
  })

  it('should return all error messages for invalid data', () => {
    const invalidData = { name: '', age: -1, email: 'invalid', role: 'invalid' }
    const errors = getAllErrors(TestSchema, invalidData)
    expect(errors.length).toBeGreaterThan(0)
    expect(errors.every((error) => typeof error === 'string')).toBe(true)
  })

  it('should include paths in error messages', () => {
    const invalidData = { name: '', age: 30, email: 'john@example.com', role: 'user' }
    const errors = getAllErrors(TestSchema, invalidData)
    expect(errors.some((error) => error.includes('name'))).toBe(true)
  })
})

describe('validatePartial', () => {
  it('should validate partial data', () => {
    const partialData = { name: 'John', age: 30 }
    const result = validatePartial(TestSchema, partialData)
    expect(result.success).toBe(true)
  })

  it('should reject invalid partial data', () => {
    const invalidPartialData = { name: '', age: -1 }
    const result = validatePartial(TestSchema, invalidPartialData)
    expect(result.success).toBe(false)
  })

  it('should allow empty partial data', () => {
    const result = validatePartial(TestSchema, {})
    expect(result.success).toBe(true)
  })

  it('should validate provided fields only', () => {
    const partialData = { email: 'invalid' }
    const result = validatePartial(TestSchema, partialData)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues.some((issue) => issue.path === 'email')).toBe(true)
    }
  })
})

describe('validateArray', () => {
  it('should validate all valid items', () => {
    const items = [
      { name: 'John', age: 30, email: 'john@example.com', role: 'user', active: true },
      { name: 'Jane', age: 25, email: 'jane@example.com', role: 'admin', active: false },
    ]
    const result = validateArray(TestSchema, items)
    expect(result.valid).toHaveLength(2)
    expect(result.errors).toHaveLength(0)
  })

  it('should separate valid and invalid items', () => {
    const items = [
      { name: 'John', age: 30, email: 'john@example.com', role: 'user', active: true },
      { name: '', age: -1, email: 'invalid', role: 'invalid' }, // Invalid
      { name: 'Jane', age: 25, email: 'jane@example.com', role: 'admin', active: false },
    ]
    const result = validateArray(TestSchema, items)
    expect(result.valid).toHaveLength(2)
    expect(result.errors).toHaveLength(1)
    expect(result.errors[0].index).toBe(1)
  })

  it('should provide error details for invalid items', () => {
    const items = [{ name: '', age: -1 }]
    const result = validateArray(TestSchema, items)
    expect(result.valid).toHaveLength(0)
    expect(result.errors).toHaveLength(1)
    expect(result.errors[0].error.issues.length).toBeGreaterThan(0)
  })

  it('should handle empty array', () => {
    const result = validateArray(TestSchema, [])
    expect(result.valid).toHaveLength(0)
    expect(result.errors).toHaveLength(0)
  })
})

describe('createTypeGuard', () => {
  const isTestType = createTypeGuard(TestSchema)

  it('should return true for valid data', () => {
    expect(isTestType(validData)).toBe(true)
  })

  it('should return false for invalid data', () => {
    const invalidData = { name: '', age: -1 }
    expect(isTestType(invalidData)).toBe(false)
  })

  it('should work with Array.filter', () => {
    const mixedData = [
      { name: 'John', age: 30, email: 'john@example.com', role: 'user', active: true },
      { name: '', age: -1 }, // Invalid
      { name: 'Jane', age: 25, email: 'jane@example.com', role: 'admin', active: false },
    ]
    const filtered = mixedData.filter(isTestType)
    expect(filtered).toHaveLength(2)
  })
})

describe('sanitizeAndValidate', () => {
  it('should validate and return only schema properties', () => {
    const dirtyData = {
      name: 'John',
      age: 30,
      email: 'john@example.com',
      role: 'user',
      active: true,
      extraField: 'should be removed',
    }
    const result = sanitizeAndValidate(TestSchema, dirtyData)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data).not.toHaveProperty('extraField')
      expect(result.data.name).toBe('John')
    }
  })

  it('should still reject invalid data', () => {
    const invalidData = { name: '', age: -1, email: 'invalid', role: 'invalid', extra: 'field' }
    const result = sanitizeAndValidate(TestSchema, invalidData)
    expect(result.success).toBe(false)
  })
})

describe('validateWithDefaults', () => {
  it('should apply default values for missing fields', () => {
    const dataWithoutActive = {
      name: 'John',
      age: 30,
      email: 'john@example.com',
      role: 'user' as const,
    }
    const result = validateWithDefaults(TestSchema, dataWithoutActive)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.active).toBe(true) // Default from schema
    }
  })

  it('should still validate required fields', () => {
    const incompleteData = { name: 'John' }
    const result = validateWithDefaults(TestSchema, incompleteData)
    expect(result.success).toBe(false)
  })

  it('should not override provided values with defaults', () => {
    const dataWithActive = {
      name: 'John',
      age: 30,
      email: 'john@example.com',
      role: 'user' as const,
      active: false,
    }
    const result = validateWithDefaults(TestSchema, dataWithActive)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.active).toBe(false) // User-provided value preserved
    }
  })
})
