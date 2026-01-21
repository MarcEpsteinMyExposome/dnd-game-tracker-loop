/**
 * Tests for LocalStorage Utility Module
 *
 * @module __tests__/storage/localStorage.test
 */

import {
  saveToLocalStorage,
  loadFromLocalStorage,
  removeFromLocalStorage,
  clearAllLocalStorage,
  isLocalStorageAvailable,
  getLocalStorageSize,
  QuotaExceededError,
  InvalidDataError,
} from '@/lib/storage/localStorage'

describe('localStorage utilities', () => {
  // Clear localStorage before and after each test
  beforeEach(() => {
    localStorage.clear()
  })

  afterEach(() => {
    localStorage.clear()
  })

  describe('saveToLocalStorage', () => {
    it('should save string data to localStorage', () => {
      saveToLocalStorage('test-key', 'test-value')
      expect(localStorage.getItem('test-key')).toBe('"test-value"')
    })

    it('should save object data to localStorage', () => {
      const data = { name: 'Raul', hp: 30 }
      saveToLocalStorage('test-object', data)

      const stored = localStorage.getItem('test-object')
      expect(stored).toBeTruthy()
      expect(JSON.parse(stored!)).toEqual(data)
    })

    it('should save array data to localStorage', () => {
      const data = [1, 2, 3, 4, 5]
      saveToLocalStorage('test-array', data)

      const stored = localStorage.getItem('test-array')
      expect(stored).toBeTruthy()
      expect(JSON.parse(stored!)).toEqual(data)
    })

    it('should save number data to localStorage', () => {
      saveToLocalStorage('test-number', 42)
      expect(localStorage.getItem('test-number')).toBe('42')
    })

    it('should save boolean data to localStorage', () => {
      saveToLocalStorage('test-bool', true)
      expect(localStorage.getItem('test-bool')).toBe('true')
    })

    it('should save null to localStorage', () => {
      saveToLocalStorage('test-null', null)
      expect(localStorage.getItem('test-null')).toBe('null')
    })

    it('should overwrite existing data', () => {
      saveToLocalStorage('test-key', 'first')
      saveToLocalStorage('test-key', 'second')
      expect(JSON.parse(localStorage.getItem('test-key')!)).toBe('second')
    })

    it('should save nested objects', () => {
      const data = {
        character: {
          name: 'Raul',
          stats: { hp: 30, ac: 15 },
        },
      }
      saveToLocalStorage('test-nested', data)

      const stored = localStorage.getItem('test-nested')
      expect(JSON.parse(stored!)).toEqual(data)
    })

    it('should throw QuotaExceededError when quota exceeded', () => {
      // Mock localStorage.setItem to throw quota exceeded error
      const originalSetItem = Storage.prototype.setItem
      jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        const error = new DOMException('Quota exceeded', 'QuotaExceededError')
        throw error
      })

      expect(() => {
        saveToLocalStorage('test-key', 'test-value')
      }).toThrow(QuotaExceededError)

      expect(() => {
        saveToLocalStorage('test-key', 'test-value')
      }).toThrow(/Storage quota exceeded/)

      // Restore original
      jest.restoreAllMocks()
    })

    it('should handle Firefox quota exceeded error', () => {
      jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        const error = new DOMException(
          'Quota exceeded',
          'NS_ERROR_DOM_QUOTA_REACHED'
        )
        throw error
      })

      expect(() => {
        saveToLocalStorage('test-key', 'test-value')
      }).toThrow(QuotaExceededError)

      jest.restoreAllMocks()
    })

    it('should handle objects with circular references gracefully', () => {
      const circular: any = { name: 'test' }
      circular.self = circular

      expect(() => {
        saveToLocalStorage('test-circular', circular)
      }).toThrow(/Failed to save to localStorage/)
    })
  })

  describe('loadFromLocalStorage', () => {
    it('should load string data from localStorage', () => {
      localStorage.setItem('test-key', JSON.stringify('test-value'))
      const result = loadFromLocalStorage<string>('test-key')
      expect(result).toBe('test-value')
    })

    it('should load object data from localStorage', () => {
      const data = { name: 'Raul', hp: 30 }
      localStorage.setItem('test-object', JSON.stringify(data))
      const result = loadFromLocalStorage<typeof data>('test-object')
      expect(result).toEqual(data)
    })

    it('should load array data from localStorage', () => {
      const data = [1, 2, 3, 4, 5]
      localStorage.setItem('test-array', JSON.stringify(data))
      const result = loadFromLocalStorage<number[]>('test-array')
      expect(result).toEqual(data)
    })

    it('should load number data from localStorage', () => {
      localStorage.setItem('test-number', JSON.stringify(42))
      const result = loadFromLocalStorage<number>('test-number')
      expect(result).toBe(42)
    })

    it('should load boolean data from localStorage', () => {
      localStorage.setItem('test-bool', JSON.stringify(true))
      const result = loadFromLocalStorage<boolean>('test-bool')
      expect(result).toBe(true)
    })

    it('should load null from localStorage', () => {
      localStorage.setItem('test-null', JSON.stringify(null))
      const result = loadFromLocalStorage<null>('test-null')
      expect(result).toBeNull()
    })

    it('should return null for non-existent key', () => {
      const result = loadFromLocalStorage<string>('non-existent')
      expect(result).toBeNull()
    })

    it('should load nested objects correctly', () => {
      const data = {
        character: {
          name: 'Raul',
          stats: { hp: 30, ac: 15 },
        },
      }
      localStorage.setItem('test-nested', JSON.stringify(data))
      const result = loadFromLocalStorage<typeof data>('test-nested')
      expect(result).toEqual(data)
    })

    it('should throw InvalidDataError for corrupted JSON', () => {
      localStorage.setItem('test-invalid', 'not valid json {')

      expect(() => {
        loadFromLocalStorage('test-invalid')
      }).toThrow(InvalidDataError)

      expect(() => {
        loadFromLocalStorage('test-invalid')
      }).toThrow(/Invalid JSON/)
    })

    it('should throw InvalidDataError for malformed data', () => {
      localStorage.setItem('test-malformed', '{broken')

      expect(() => {
        loadFromLocalStorage('test-malformed')
      }).toThrow(InvalidDataError)
    })

    it('should handle empty string as invalid JSON', () => {
      localStorage.setItem('test-empty', '')

      expect(() => {
        loadFromLocalStorage('test-empty')
      }).toThrow(InvalidDataError)
    })
  })

  describe('removeFromLocalStorage', () => {
    it('should remove existing key from localStorage', () => {
      localStorage.setItem('test-key', 'test-value')
      expect(localStorage.getItem('test-key')).toBeTruthy()

      removeFromLocalStorage('test-key')
      expect(localStorage.getItem('test-key')).toBeNull()
    })

    it('should not throw when removing non-existent key', () => {
      expect(() => {
        removeFromLocalStorage('non-existent')
      }).not.toThrow()
    })

    it('should only remove specified key', () => {
      localStorage.setItem('key1', 'value1')
      localStorage.setItem('key2', 'value2')
      localStorage.setItem('key3', 'value3')

      removeFromLocalStorage('key2')

      expect(localStorage.getItem('key1')).toBe('value1')
      expect(localStorage.getItem('key2')).toBeNull()
      expect(localStorage.getItem('key3')).toBe('value3')
    })
  })

  describe('clearAllLocalStorage', () => {
    it('should clear all localStorage data', () => {
      localStorage.setItem('key1', 'value1')
      localStorage.setItem('key2', 'value2')
      localStorage.setItem('key3', 'value3')

      expect(localStorage.length).toBe(3)

      clearAllLocalStorage()

      expect(localStorage.length).toBe(0)
      expect(localStorage.getItem('key1')).toBeNull()
      expect(localStorage.getItem('key2')).toBeNull()
      expect(localStorage.getItem('key3')).toBeNull()
    })

    it('should not throw when clearing empty localStorage', () => {
      expect(() => {
        clearAllLocalStorage()
      }).not.toThrow()
    })

    it('should clear all data including app and non-app keys', () => {
      localStorage.setItem('app-key', 'app-value')
      localStorage.setItem('other-key', 'other-value')

      clearAllLocalStorage()

      expect(localStorage.length).toBe(0)
    })
  })

  describe('isLocalStorageAvailable', () => {
    it('should return true when localStorage is available', () => {
      expect(isLocalStorageAvailable()).toBe(true)
    })

    it('should return false when localStorage.setItem throws', () => {
      jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('localStorage disabled')
      })

      expect(isLocalStorageAvailable()).toBe(false)

      jest.restoreAllMocks()
    })

    it('should return false when localStorage.removeItem throws', () => {
      jest.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => {
        throw new Error('localStorage disabled')
      })

      expect(isLocalStorageAvailable()).toBe(false)

      jest.restoreAllMocks()
    })

    it('should clean up test key after checking', () => {
      isLocalStorageAvailable()
      expect(localStorage.getItem('__localStorage_test__')).toBeNull()
    })
  })

  describe('getLocalStorageSize', () => {
    it('should return 0 for empty localStorage', () => {
      expect(getLocalStorageSize()).toBe(0)
    })

    it('should calculate size for single key-value pair', () => {
      localStorage.setItem('key', 'value')
      const size = getLocalStorageSize()
      // Size should be greater than 0 when data exists
      expect(size).toBeGreaterThan(0)
      // 'key' = 3 chars, 'value' = 5 chars, total = 8 chars * 2 bytes = 16 bytes
      expect(size).toBe(16)
    })

    it('should calculate size for multiple key-value pairs', () => {
      localStorage.setItem('a', 'b') // 2 chars * 2 = 4 bytes
      localStorage.setItem('c', 'd') // 2 chars * 2 = 4 bytes
      const size = getLocalStorageSize()
      expect(size).toBeGreaterThan(0)
      expect(size).toBe(8)
    })

    it('should calculate size for JSON data', () => {
      const data = { name: 'test' }
      const serialized = JSON.stringify(data)
      localStorage.setItem('data', serialized)
      // 'data' = 4 chars, serialized length, * 2 bytes
      const expectedSize = (4 + serialized.length) * 2
      expect(getLocalStorageSize()).toBe(expectedSize)
    })

    it('should return 0 when localStorage is unavailable', () => {
      const originalHasOwnProperty = Object.prototype.hasOwnProperty
      Object.prototype.hasOwnProperty = jest.fn(() => {
        throw new Error('localStorage unavailable')
      })

      expect(getLocalStorageSize()).toBe(0)

      Object.prototype.hasOwnProperty = originalHasOwnProperty
    })

    it('should handle large data correctly', () => {
      const largeString = 'x'.repeat(1000)
      localStorage.setItem('large', largeString)
      // 'large' = 5 chars, largeString = 1000 chars, total = 1005 * 2 = 2010 bytes
      expect(getLocalStorageSize()).toBe(2010)
    })

    it('should update size after adding more data', () => {
      localStorage.setItem('a', 'b')
      const size1 = getLocalStorageSize()

      localStorage.setItem('c', 'd')
      const size2 = getLocalStorageSize()

      expect(size2).toBeGreaterThan(size1)
      expect(size2).toBe(8)
    })

    it('should update size after removing data', () => {
      localStorage.setItem('a', 'b')
      localStorage.setItem('c', 'd')
      const sizeBefore = getLocalStorageSize()

      localStorage.removeItem('a')
      const sizeAfter = getLocalStorageSize()

      expect(sizeAfter).toBeLessThan(sizeBefore)
      expect(sizeAfter).toBe(4)
    })
  })

  describe('integration tests', () => {
    it('should save and load data correctly', () => {
      const data = { name: 'Raul', hp: 30, ac: 15 }
      saveToLocalStorage('character', data)

      const loaded = loadFromLocalStorage<typeof data>('character')
      expect(loaded).toEqual(data)
    })

    it('should save, load, update, and reload data', () => {
      const original = { count: 5 }
      saveToLocalStorage('counter', original)

      const loaded = loadFromLocalStorage<typeof original>('counter')
      expect(loaded).toEqual({ count: 5 })

      const updated = { count: loaded!.count + 1 }
      saveToLocalStorage('counter', updated)

      const reloaded = loadFromLocalStorage<typeof original>('counter')
      expect(reloaded).toEqual({ count: 6 })
    })

    it('should handle save, remove, and load cycle', () => {
      saveToLocalStorage('temp', 'value')
      expect(loadFromLocalStorage<string>('temp')).toBe('value')

      removeFromLocalStorage('temp')
      expect(loadFromLocalStorage<string>('temp')).toBeNull()
    })

    it('should handle multiple keys independently', () => {
      saveToLocalStorage('key1', 'value1')
      saveToLocalStorage('key2', 'value2')
      saveToLocalStorage('key3', 'value3')

      expect(loadFromLocalStorage<string>('key1')).toBe('value1')
      expect(loadFromLocalStorage<string>('key2')).toBe('value2')
      expect(loadFromLocalStorage<string>('key3')).toBe('value3')

      removeFromLocalStorage('key2')

      expect(loadFromLocalStorage<string>('key1')).toBe('value1')
      expect(loadFromLocalStorage<string>('key2')).toBeNull()
      expect(loadFromLocalStorage<string>('key3')).toBe('value3')
    })

    it('should handle complex game state object', () => {
      const gameState = {
        characters: [
          { id: '1', name: 'Raul', hp: 30, maxHp: 30, ac: 15 },
          { id: '2', name: 'Luna', hp: 25, maxHp: 28, ac: 17 },
        ],
        combat: {
          round: 3,
          isInCombat: true,
          activeCombatantId: '1',
        },
        settings: {
          theme: 'dark',
          soundEnabled: true,
        },
      }

      saveToLocalStorage('game-state', gameState)
      const loaded = loadFromLocalStorage<typeof gameState>('game-state')

      expect(loaded).toEqual(gameState)
      expect(loaded?.characters.length).toBe(2)
      expect(loaded?.combat.round).toBe(3)
      expect(loaded?.settings.theme).toBe('dark')
    })
  })
})
