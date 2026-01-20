/**
 * Example Schema - Demonstrates Zod validation patterns
 *
 * This file serves as a reference implementation showing how to:
 * - Define Zod schemas with validation rules
 * - Infer TypeScript types from schemas
 * - Export types and schemas for use throughout the app
 * - Document schema fields with JSDoc
 *
 * Real schemas (Character, Monster, etc.) will be created in Function 2.
 *
 * @see DECISIONS.md - ADR-002: Why Zod for validation
 * @see PATTERNS.md - Zod schema patterns
 */

import { z } from 'zod'

/**
 * Example User schema demonstrating Zod patterns
 *
 * This schema shows:
 * - Required vs optional fields
 * - String validation (min/max length, email)
 * - Number validation (min/max, integer)
 * - Enums for constrained values
 * - Nested objects
 * - Arrays
 * - Default values
 */
export const ExampleUserSchema = z.object({
  /**
   * Unique identifier (UUID format)
   * Required field - must be a valid UUID string
   */
  id: z.string().uuid(),

  /**
   * User's email address
   * Required, must be valid email format
   */
  email: z.string().email(),

  /**
   * Display name
   * Required, 1-50 characters
   */
  name: z.string().min(1, 'Name is required').max(50, 'Name too long'),

  /**
   * User's age
   * Optional, if provided must be 0-150
   */
  age: z.number().int().min(0).max(150).optional(),

  /**
   * User role
   * Must be one of the defined enum values
   */
  role: z.enum(['admin', 'user', 'guest']),

  /**
   * Account settings (nested object)
   * Optional, with default value
   */
  settings: z
    .object({
      darkMode: z.boolean(),
      notifications: z.boolean(),
    })
    .default({
      darkMode: false,
      notifications: true,
    }),

  /**
   * List of tags
   * Array of strings, defaults to empty array
   */
  tags: z.array(z.string()).default([]),
})

/**
 * Infer TypeScript type from schema
 *
 * This creates a TypeScript type that matches the schema exactly.
 * No need to define types separately - DRY principle!
 *
 * @example
 * ```typescript
 * const user: ExampleUser = {
 *   id: '123e4567-e89b-12d3-a456-426614174000',
 *   email: 'user@example.com',
 *   name: 'John Doe',
 *   role: 'user',
 * }
 * ```
 */
export type ExampleUser = z.infer<typeof ExampleUserSchema>

/**
 * Validate and parse user data
 *
 * @param data - Raw data to validate
 * @returns Validated ExampleUser or throws error
 *
 * @example
 * ```typescript
 * try {
 *   const user = parseUser(rawData)
 *   console.log(user.name) // TypeScript knows the shape
 * } catch (error) {
 *   console.error('Invalid user data:', error)
 * }
 * ```
 */
export function parseUser(data: unknown): ExampleUser {
  // parse() throws if validation fails
  // Use this when you want errors to bubble up
  return ExampleUserSchema.parse(data)
}

/**
 * Safely validate user data without throwing
 *
 * @param data - Raw data to validate
 * @returns Success object with data OR error object
 *
 * @example
 * ```typescript
 * const result = validateUser(rawData)
 * if (result.success) {
 *   console.log(result.data.name) // Type-safe access
 * } else {
 *   console.error(result.error.issues) // Detailed error info
 * }
 * ```
 */
export function validateUser(data: unknown) {
  // safeParse() returns { success: true, data } or { success: false, error }
  // Use this for graceful error handling (preferred in UI)
  return ExampleUserSchema.safeParse(data)
}

/**
 * Default user object (for forms, testing, etc.)
 */
export const defaultExampleUser: Partial<ExampleUser> = {
  role: 'user',
  settings: {
    darkMode: false,
    notifications: true,
  },
  tags: [],
}

// ============================================
// VALIDATION PATTERNS DEMONSTRATED:
// ============================================
//
// 1. SCHEMA DEFINITION
//    - Use z.object() for object schemas
//    - Chain validation methods (.min(), .max(), etc.)
//    - Add error messages for better UX
//
// 2. TYPE INFERENCE
//    - Use z.infer<typeof Schema> to get TypeScript type
//    - Single source of truth (schema defines both validation and types)
//
// 3. VALIDATION METHODS
//    - .parse() - Throws on error (use in server/backend)
//    - .safeParse() - Returns result object (use in UI)
//
// 4. OPTIONAL FIELDS
//    - Use .optional() for fields that may not exist
//    - Use .default() to provide fallback values
//
// 5. ENUMS
//    - Use z.enum() for constrained string values
//    - Better than string literals for validation
//
// 6. NESTED OBJECTS
//    - Schemas can contain other schemas
//    - Maintains full type safety at all levels
//
// 7. ARRAYS
//    - Use z.array(elementSchema) for lists
//    - Can validate each element's shape
//
// ============================================
