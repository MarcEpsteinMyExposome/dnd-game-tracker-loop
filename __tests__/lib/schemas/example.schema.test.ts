/**
 * Tests for Example Schema
 *
 * Demonstrates Zod schema testing patterns.
 * Tests both valid and invalid data to ensure validation works correctly.
 */

import {
  ExampleUserSchema,
  parseUser,
  validateUser,
  defaultExampleUser,
} from '@/lib/schemas/example.schema'

describe('ExampleUserSchema', () => {
  // ============================================
  // VALID DATA TESTS
  // ============================================

  it('accepts valid user data', () => {
    const validUser = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      email: 'john@example.com',
      name: 'John Doe',
      role: 'user' as const,
    }

    const result = ExampleUserSchema.safeParse(validUser)

    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.name).toBe('John Doe')
      expect(result.data.email).toBe('john@example.com')
    }
  })

  it('accepts user with optional fields', () => {
    const userWithAge = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      email: 'john@example.com',
      name: 'John Doe',
      age: 30,
      role: 'admin' as const,
    }

    const result = ExampleUserSchema.safeParse(userWithAge)

    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.age).toBe(30)
    }
  })

  it('applies default values for settings and tags', () => {
    const minimalUser = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      email: 'john@example.com',
      name: 'John Doe',
      role: 'user' as const,
    }

    const result = ExampleUserSchema.safeParse(minimalUser)

    expect(result.success).toBe(true)
    if (result.success) {
      // Default values should be applied
      expect(result.data.settings).toEqual({
        darkMode: false,
        notifications: true,
      })
      expect(result.data.tags).toEqual([])
    }
  })

  // ============================================
  // INVALID DATA TESTS
  // ============================================

  it('rejects invalid UUID format', () => {
    const invalidUser = {
      id: 'not-a-uuid',
      email: 'john@example.com',
      name: 'John Doe',
      role: 'user',
    }

    const result = ExampleUserSchema.safeParse(invalidUser)

    expect(result.success).toBe(false)
  })

  it('rejects invalid email format', () => {
    const invalidUser = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      email: 'not-an-email',
      name: 'John Doe',
      role: 'user',
    }

    const result = ExampleUserSchema.safeParse(invalidUser)

    expect(result.success).toBe(false)
  })

  it('rejects name that is too long', () => {
    const invalidUser = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      email: 'john@example.com',
      name: 'a'.repeat(51), // 51 characters, max is 50
      role: 'user',
    }

    const result = ExampleUserSchema.safeParse(invalidUser)

    expect(result.success).toBe(false)
  })

  it('rejects empty name', () => {
    const invalidUser = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      email: 'john@example.com',
      name: '',
      role: 'user',
    }

    const result = ExampleUserSchema.safeParse(invalidUser)

    expect(result.success).toBe(false)
  })

  it('rejects age outside valid range', () => {
    const invalidUser = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      email: 'john@example.com',
      name: 'John Doe',
      age: 200, // Max is 150
      role: 'user',
    }

    const result = ExampleUserSchema.safeParse(invalidUser)

    expect(result.success).toBe(false)
  })

  it('rejects invalid role', () => {
    const invalidUser = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      email: 'john@example.com',
      name: 'John Doe',
      role: 'superadmin', // Not in enum
    }

    const result = ExampleUserSchema.safeParse(invalidUser)

    expect(result.success).toBe(false)
  })

  it('rejects missing required fields', () => {
    const invalidUser = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      // Missing: email, name, role
    }

    const result = ExampleUserSchema.safeParse(invalidUser)

    expect(result.success).toBe(false)
  })

  // ============================================
  // HELPER FUNCTION TESTS
  // ============================================

  describe('parseUser()', () => {
    it('returns parsed user for valid data', () => {
      const validData = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        email: 'john@example.com',
        name: 'John Doe',
        role: 'user' as const,
      }

      const user = parseUser(validData)

      expect(user.name).toBe('John Doe')
      expect(user.email).toBe('john@example.com')
    })

    it('throws error for invalid data', () => {
      const invalidData = {
        id: 'bad-uuid',
        email: 'john@example.com',
        name: 'John Doe',
        role: 'user',
      }

      expect(() => parseUser(invalidData)).toThrow()
    })
  })

  describe('validateUser()', () => {
    it('returns success: true for valid data', () => {
      const validData = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        email: 'john@example.com',
        name: 'John Doe',
        role: 'user' as const,
      }

      const result = validateUser(validData)

      expect(result.success).toBe(true)
    })

    it('returns success: false for invalid data', () => {
      const invalidData = {
        id: 'bad-uuid',
        email: 'john@example.com',
        name: 'John Doe',
        role: 'user',
      }

      const result = validateUser(invalidData)

      expect(result.success).toBe(false)
      if (!result.success) {
        // Error object contains detailed issue information
        expect(result.error.issues.length).toBeGreaterThan(0)
      }
    })
  })

  // ============================================
  // DEFAULT VALUES TEST
  // ============================================

  describe('defaultExampleUser', () => {
    it('provides sensible defaults', () => {
      expect(defaultExampleUser.role).toBe('user')
      expect(defaultExampleUser.settings).toEqual({
        darkMode: false,
        notifications: true,
      })
      expect(defaultExampleUser.tags).toEqual([])
    })
  })
})

// ============================================
// KEY SCHEMA TESTING PATTERNS DEMONSTRATED:
// ============================================
//
// 1. TEST VALID DATA
//    - Verify schema accepts correct data
//    - Check that parsed data has expected values
//    - Test optional fields work correctly
//    - Verify default values are applied
//
// 2. TEST INVALID DATA
//    - Each validation rule should have a failing test
//    - Test boundary conditions (min/max values)
//    - Test format validation (email, UUID, etc.)
//    - Test missing required fields
//
// 3. TEST HELPER FUNCTIONS
//    - Test both parse() and safeParse() patterns
//    - Verify parse() throws on invalid data
//    - Verify safeParse() returns error object
//
// 4. USE TYPE GUARDS
//    - Check result.success before accessing result.data
//    - TypeScript knows the type based on success check
//
// 5. DESCRIPTIVE TEST NAMES
//    - "accepts valid..." for positive tests
//    - "rejects invalid..." for negative tests
//
// ============================================
