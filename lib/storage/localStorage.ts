/**
 * LocalStorage Utility Module
 *
 * Provides safe, typed localStorage operations with error handling.
 * Handles quota exceeded errors, invalid JSON, and browser compatibility.
 *
 * @module lib/storage/localStorage
 */

/**
 * Error thrown when localStorage quota is exceeded
 */
export class QuotaExceededError extends Error {
  constructor(message = 'LocalStorage quota exceeded') {
    super(message)
    this.name = 'QuotaExceededError'
  }
}

/**
 * Error thrown when localStorage data is invalid or corrupted
 */
export class InvalidDataError extends Error {
  constructor(message = 'Invalid or corrupted localStorage data') {
    super(message)
    this.name = 'InvalidDataError'
  }
}

/**
 * Saves data to localStorage with JSON serialization
 *
 * @param key - The localStorage key to store data under
 * @param data - The data to store (will be JSON.stringified)
 * @throws {QuotaExceededError} If localStorage quota is exceeded
 * @throws {Error} If JSON serialization fails or localStorage is unavailable
 *
 * @example
 * saveToLocalStorage('game-state', { characters: [...] })
 */
export function saveToLocalStorage<T>(key: string, data: T): void {
  try {
    const serialized = JSON.stringify(data)
    localStorage.setItem(key, serialized)
  } catch (error) {
    // Check if quota exceeded (different browsers use different error codes)
    if (
      error instanceof DOMException &&
      (error.name === 'QuotaExceededError' ||
        error.name === 'NS_ERROR_DOM_QUOTA_REACHED' ||
        error.code === 22 || // Legacy quota exceeded code
        error.code === 1014) // Firefox quota exceeded code
    ) {
      throw new QuotaExceededError(
        `Failed to save to localStorage: Storage quota exceeded for key "${key}"`
      )
    }

    // Re-throw other errors (JSON serialization errors, etc.)
    throw new Error(
      `Failed to save to localStorage: ${error instanceof Error ? error.message : 'Unknown error'}`
    )
  }
}

/**
 * Loads data from localStorage with JSON deserialization
 *
 * @param key - The localStorage key to load data from
 * @returns The parsed data, or null if key doesn't exist
 * @throws {InvalidDataError} If stored data is not valid JSON
 * @throws {Error} If localStorage is unavailable
 *
 * @example
 * const state = loadFromLocalStorage<GameState>('game-state')
 * if (state) {
 *   // Use loaded state
 * }
 */
export function loadFromLocalStorage<T>(key: string): T | null {
  try {
    const serialized = localStorage.getItem(key)

    // Key doesn't exist
    if (serialized === null) {
      return null
    }

    // Try to parse JSON
    try {
      return JSON.parse(serialized) as T
    } catch (parseError) {
      throw new InvalidDataError(
        `Failed to parse localStorage data for key "${key}": Invalid JSON`
      )
    }
  } catch (error) {
    // Re-throw InvalidDataError as-is
    if (error instanceof InvalidDataError) {
      throw error
    }

    // Wrap other errors
    throw new Error(
      `Failed to load from localStorage: ${error instanceof Error ? error.message : 'Unknown error'}`
    )
  }
}

/**
 * Removes a specific key from localStorage
 *
 * @param key - The localStorage key to remove
 * @throws {Error} If localStorage is unavailable
 *
 * @example
 * removeFromLocalStorage('game-state')
 */
export function removeFromLocalStorage(key: string): void {
  try {
    localStorage.removeItem(key)
  } catch (error) {
    throw new Error(
      `Failed to remove from localStorage: ${error instanceof Error ? error.message : 'Unknown error'}`
    )
  }
}

/**
 * Clears all data from localStorage
 *
 * WARNING: This removes ALL localStorage data, not just app-specific keys.
 * Use with caution in production environments.
 *
 * @throws {Error} If localStorage is unavailable
 *
 * @example
 * clearAllLocalStorage() // Removes everything
 */
export function clearAllLocalStorage(): void {
  try {
    localStorage.clear()
  } catch (error) {
    throw new Error(
      `Failed to clear localStorage: ${error instanceof Error ? error.message : 'Unknown error'}`
    )
  }
}

/**
 * Checks if localStorage is available and functioning
 *
 * Some browsers disable localStorage in private/incognito mode.
 * This function tests both availability and functionality.
 *
 * @returns true if localStorage is available, false otherwise
 *
 * @example
 * if (isLocalStorageAvailable()) {
 *   saveToLocalStorage('key', data)
 * } else {
 *   // Fallback to in-memory storage
 * }
 */
export function isLocalStorageAvailable(): boolean {
  try {
    const testKey = '__localStorage_test__'
    localStorage.setItem(testKey, 'test')
    localStorage.removeItem(testKey)
    return true
  } catch {
    return false
  }
}

/**
 * Gets the approximate size of localStorage usage in bytes
 *
 * Note: This is an approximation based on string length.
 * Actual storage may vary due to browser implementation details.
 *
 * @returns Approximate localStorage size in bytes
 *
 * @example
 * const usageBytes = getLocalStorageSize()
 * const usageMB = usageBytes / (1024 * 1024)
 * console.log(`Using ${usageMB.toFixed(2)} MB`)
 */
export function getLocalStorageSize(): number {
  let totalSize = 0

  try {
    // Iterate through all keys in localStorage
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key !== null) {
        const value = localStorage.getItem(key)
        if (value !== null) {
          // Count both key and value length (UTF-16 encoding = 2 bytes per char)
          totalSize += (key.length + value.length) * 2
        }
      }
    }
  } catch {
    // If localStorage is unavailable, return 0
    return 0
  }

  return totalSize
}
