/**
 * Validation Helpers
 *
 * Generic validation utilities that work with all Zod schemas.
 * Provides consistent error handling and validation patterns.
 *
 * @see __tests__/validation/helpers.test.ts for usage examples
 */

import { z, type ZodSchema } from 'zod'

/**
 * Validation result for successful validation
 */
export interface ValidationSuccess<T> {
  success: true
  data: T
  error: null
}

/**
 * Validation result for failed validation
 */
export interface ValidationError {
  success: false
  data: null
  error: {
    message: string
    issues: Array<{
      path: string
      message: string
    }>
  }
}

/**
 * Union type for validation results
 */
export type ValidationResult<T> = ValidationSuccess<T> | ValidationError

/**
 * Validate data against a Zod schema with enhanced error formatting
 *
 * Returns a consistent ValidationResult object with user-friendly error messages.
 * Use this for UI validation where detailed error feedback is needed.
 *
 * @param schema - Zod schema to validate against
 * @param data - Data to validate
 * @returns ValidationResult with success/error information
 *
 * @example
 * ```typescript
 * const result = validateWithSchema(CharacterSchema, formData)
 * if (result.success) {
 *   console.log('Valid character:', result.data)
 * } else {
 *   console.error('Validation errors:', result.error.issues)
 *   // Display errors to user
 *   result.error.issues.forEach(issue => {
 *     showError(issue.path, issue.message)
 *   })
 * }
 * ```
 */
export function validateWithSchema<T>(schema: ZodSchema<T>, data: unknown): ValidationResult<T> {
  const result = schema.safeParse(data)

  if (result.success) {
    return {
      success: true,
      data: result.data,
      error: null,
    }
  }

  // Format Zod errors into user-friendly structure
  const issues = result.error.issues.map((issue) => ({
    path: issue.path.join('.') || 'root',
    message: issue.message,
  }))

  return {
    success: false,
    data: null,
    error: {
      message: `Validation failed: ${issues.length} error(s) found`,
      issues,
    },
  }
}

/**
 * Validate data and throw on error
 *
 * Use this when you want validation errors to propagate as exceptions.
 * Useful in server-side code or when validation failure should halt execution.
 *
 * @param schema - Zod schema to validate against
 * @param data - Data to validate
 * @returns Validated data (typed)
 * @throws ValidationError if validation fails
 *
 * @example
 * ```typescript
 * try {
 *   const character = validateAndParse(CharacterSchema, rawData)
 *   // character is fully typed and valid
 *   saveCharacter(character)
 * } catch (error) {
 *   console.error('Validation failed:', error)
 * }
 * ```
 */
export function validateAndParse<T>(schema: ZodSchema<T>, data: unknown): T {
  return schema.parse(data)
}

/**
 * Check if data is valid without returning detailed errors
 *
 * Simple boolean check - useful for quick validation or conditional logic.
 *
 * @param schema - Zod schema to validate against
 * @param data - Data to validate
 * @returns true if valid, false otherwise
 *
 * @example
 * ```typescript
 * if (isValid(CharacterSchema, formData)) {
 *   // Data is valid, proceed
 * } else {
 *   // Data is invalid, show generic error
 * }
 * ```
 */
export function isValid<T>(schema: ZodSchema<T>, data: unknown): boolean {
  return schema.safeParse(data).success
}

/**
 * Get first validation error message
 *
 * Useful when you only want to display the first error to the user.
 *
 * @param schema - Zod schema to validate against
 * @param data - Data to validate
 * @returns First error message or null if valid
 *
 * @example
 * ```typescript
 * const error = getFirstError(CharacterSchema, formData)
 * if (error) {
 *   showNotification(error)
 * }
 * ```
 */
export function getFirstError<T>(schema: ZodSchema<T>, data: unknown): string | null {
  const result = schema.safeParse(data)
  if (result.success) return null

  const firstIssue = result.error.issues[0]
  if (!firstIssue) return 'Validation failed'

  const path = firstIssue.path.length > 0 ? `${firstIssue.path.join('.')}: ` : ''
  return `${path}${firstIssue.message}`
}

/**
 * Get all validation error messages as array
 *
 * Returns all error messages in a flat array format.
 *
 * @param schema - Zod schema to validate against
 * @param data - Data to validate
 * @returns Array of error messages (empty if valid)
 *
 * @example
 * ```typescript
 * const errors = getAllErrors(CharacterSchema, formData)
 * errors.forEach(error => console.error(error))
 * ```
 */
export function getAllErrors<T>(schema: ZodSchema<T>, data: unknown): string[] {
  const result = schema.safeParse(data)
  if (result.success) return []

  return result.error.issues.map((issue) => {
    const path = issue.path.length > 0 ? `${issue.path.join('.')}: ` : ''
    return `${path}${issue.message}`
  })
}

/**
 * Validate partial data (useful for form fields)
 *
 * Validates a subset of fields using schema.partial().
 * Useful for incremental validation as user fills out forms.
 *
 * @param schema - Zod schema to validate against
 * @param data - Partial data to validate
 * @returns ValidationResult for partial data
 *
 * @example
 * ```typescript
 * // Validate only the fields the user has filled so far
 * const result = validatePartial(CharacterSchema, { name: 'Hero', level: 5 })
 * if (!result.success) {
 *   // Show errors for fields that have been filled
 * }
 * ```
 */
export function validatePartial<T extends z.ZodObject<z.ZodRawShape>>(
  schema: T,
  data: unknown
): ValidationResult<Partial<z.infer<T>>> {
  const partialSchema = schema.partial()
  return validateWithSchema(partialSchema, data)
}

/**
 * Validate multiple items in an array
 *
 * Validates each item and returns both valid items and errors.
 *
 * @param schema - Zod schema to validate each item against
 * @param items - Array of items to validate
 * @returns Object with valid items and errors
 *
 * @example
 * ```typescript
 * const result = validateArray(CharacterSchema, importedCharacters)
 * console.log(`Valid: ${result.valid.length}, Invalid: ${result.errors.length}`)
 * result.errors.forEach(({ index, error }) => {
 *   console.error(`Item ${index} failed:`, error.message)
 * })
 * // Save only valid items
 * saveCharacters(result.valid)
 * ```
 */
export function validateArray<T>(
  schema: ZodSchema<T>,
  items: unknown[]
): {
  valid: T[]
  errors: Array<{ index: number; error: ValidationError['error'] }>
} {
  const valid: T[] = []
  const errors: Array<{ index: number; error: ValidationError['error'] }> = []

  items.forEach((item, index) => {
    const result = validateWithSchema(schema, item)
    if (result.success) {
      valid.push(result.data)
    } else {
      errors.push({ index, error: result.error })
    }
  })

  return { valid, errors }
}

/**
 * Create a type guard function from a Zod schema
 *
 * Returns a TypeScript type guard that can be used with Array.filter() etc.
 *
 * @param schema - Zod schema to create guard from
 * @returns Type guard function
 *
 * @example
 * ```typescript
 * const isCharacter = createTypeGuard(CharacterSchema)
 * const characters = mixedData.filter(isCharacter)
 * // characters is now typed as Character[]
 * ```
 */
export function createTypeGuard<T>(schema: ZodSchema<T>): (value: unknown) => value is T {
  return (value: unknown): value is T => {
    return schema.safeParse(value).success
  }
}

/**
 * Sanitize and validate data (removes unknown properties)
 *
 * Parses data and returns only properties defined in the schema.
 * Unknown properties are stripped out.
 *
 * @param schema - Zod schema to validate against
 * @param data - Data to sanitize and validate
 * @returns ValidationResult with sanitized data
 *
 * @example
 * ```typescript
 * const dirtyData = { name: 'Hero', level: 5, hackerField: 'malicious' }
 * const result = sanitizeAndValidate(CharacterSchema, dirtyData)
 * if (result.success) {
 *   // result.data only contains valid schema properties
 *   // hackerField is removed
 * }
 * ```
 */
export function sanitizeAndValidate<T>(schema: ZodSchema<T>, data: unknown): ValidationResult<T> {
  // Zod automatically strips unknown properties by default
  return validateWithSchema(schema, data)
}

/**
 * Validate with default values
 *
 * Attempts to parse with defaults applied for missing fields.
 * Useful when accepting user input that may be incomplete.
 *
 * @param schema - Zod schema to validate against (should have .default() on fields)
 * @param data - Data to validate
 * @returns ValidationResult with defaults applied
 *
 * @example
 * ```typescript
 * const result = validateWithDefaults(CreateCharacterSchema, { name: 'Hero' })
 * // Missing fields get their default values from schema
 * ```
 */
export function validateWithDefaults<T>(schema: ZodSchema<T>, data: unknown): ValidationResult<T> {
  // Zod automatically applies defaults during parse
  return validateWithSchema(schema, data)
}
