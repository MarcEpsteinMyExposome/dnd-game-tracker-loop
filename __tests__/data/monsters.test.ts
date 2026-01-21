/**
 * Tests for Monster Library Data
 *
 * Validates all pre-defined monsters against schema
 * Tests helper functions for filtering, searching, and categorization
 */

import {
  MONSTERS,
  getAllMonsters,
  getMonstersByCategory,
  getMonsterById,
  getMonstersByChallengeRange,
  getMonsterCategories,
  searchMonsters,
} from '@/lib/data/monsters'
import { validateMonster, MonsterType } from '@/lib/schemas/monster.schema'

describe('Monster Library Data', () => {
  describe('MONSTERS array', () => {
    it('should contain at least 10 monsters', () => {
      expect(MONSTERS.length).toBeGreaterThanOrEqual(10)
    })

    it('should contain at most 20 monsters', () => {
      expect(MONSTERS.length).toBeLessThanOrEqual(20)
    })

    it('should have unique IDs for all monsters', () => {
      const ids = MONSTERS.map((m) => m.id)
      const uniqueIds = new Set(ids)
      expect(uniqueIds.size).toBe(ids.length)
    })

    it('should have unique names for all monsters', () => {
      const names = MONSTERS.map((m) => m.name)
      const uniqueNames = new Set(names)
      expect(uniqueNames.size).toBe(names.length)
    })
  })

  describe('Monster schema validation', () => {
    it('should validate all monsters against Monster schema', () => {
      MONSTERS.forEach((monster) => {
        const result = validateMonster(monster)
        expect(result.success).toBe(true)
        if (!result.success) {
          console.error(`Validation failed for ${monster.name}:`, result.error.issues)
        }
      })
    })

    it('should have valid IDs for all monsters', () => {
      // Accepts both UUID format and our monster-name-### format for pre-defined monsters
      const idRegex =
        /^([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}|monster-[\w-]+-\d{3})$/i
      MONSTERS.forEach((monster) => {
        expect(monster.id).toMatch(idRegex)
      })
    })

    it('should have valid dice notation for all monster damage', () => {
      const diceRegex = /^\d+d\d+([+-]\d+)?$/
      MONSTERS.forEach((monster) => {
        expect(monster.damage).toMatch(diceRegex)
      })
    })

    it('should have valid dice notation for ability damage when present', () => {
      const diceRegex = /^\d+d\d+([+-]\d+)?$/
      MONSTERS.forEach((monster) => {
        monster.abilities.forEach((ability) => {
          if (ability.damage) {
            expect(ability.damage).toMatch(diceRegex)
          }
        })
      })
    })

    it('should have ISO 8601 timestamps for all monsters', () => {
      const isoDateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/
      MONSTERS.forEach((monster) => {
        expect(monster.createdAt).toMatch(isoDateRegex)
        expect(monster.updatedAt).toMatch(isoDateRegex)
      })
    })
  })

  describe('Monster data completeness', () => {
    it('should have non-empty names for all monsters', () => {
      MONSTERS.forEach((monster) => {
        expect(monster.name).toBeTruthy()
        expect(monster.name.length).toBeGreaterThan(0)
        expect(monster.name.length).toBeLessThanOrEqual(50)
      })
    })

    it('should have valid armor class values (1-30)', () => {
      MONSTERS.forEach((monster) => {
        expect(monster.armorClass).toBeGreaterThanOrEqual(1)
        expect(monster.armorClass).toBeLessThanOrEqual(30)
      })
    })

    it('should have valid hit points (1-999)', () => {
      MONSTERS.forEach((monster) => {
        expect(monster.hitPoints).toBeGreaterThanOrEqual(1)
        expect(monster.hitPoints).toBeLessThanOrEqual(999)
      })
    })

    it('should have valid challenge ratings (0-30)', () => {
      MONSTERS.forEach((monster) => {
        expect(monster.challenge).toBeGreaterThanOrEqual(0)
        expect(monster.challenge).toBeLessThanOrEqual(30)
      })
    })

    it('should have valid speed values (0-200)', () => {
      MONSTERS.forEach((monster) => {
        expect(monster.speed).toBeGreaterThanOrEqual(0)
        expect(monster.speed).toBeLessThanOrEqual(200)
      })
    })

    it('should have valid size categories', () => {
      const validSizes = ['Tiny', 'Small', 'Medium', 'Large', 'Huge', 'Gargantuan']
      MONSTERS.forEach((monster) => {
        expect(validSizes).toContain(monster.size)
      })
    })

    it('should have avatarSeed for all monsters', () => {
      MONSTERS.forEach((monster) => {
        expect(monster.avatarSeed).toBeTruthy()
        expect(monster.avatarSeed.length).toBeGreaterThan(0)
      })
    })

    it('should have at least one ability for most monsters', () => {
      const monstersWithAbilities = MONSTERS.filter((m) => m.abilities.length > 0)
      expect(monstersWithAbilities.length).toBeGreaterThanOrEqual(MONSTERS.length - 2)
    })
  })

  describe('Monster balance and variety', () => {
    it('should include monsters of various challenge ratings', () => {
      const crValues = MONSTERS.map((m) => m.challenge)
      const uniqueCRs = new Set(crValues)
      expect(uniqueCRs.size).toBeGreaterThanOrEqual(5)
    })

    it('should include low-level monsters (CR 0-2)', () => {
      const lowLevel = MONSTERS.filter((m) => m.challenge <= 2)
      expect(lowLevel.length).toBeGreaterThanOrEqual(3)
    })

    it('should include mid-level monsters (CR 3-8)', () => {
      const midLevel = MONSTERS.filter((m) => m.challenge >= 3 && m.challenge <= 8)
      expect(midLevel.length).toBeGreaterThanOrEqual(2)
    })

    it('should include high-level monsters (CR 9+)', () => {
      const highLevel = MONSTERS.filter((m) => m.challenge >= 9)
      expect(highLevel.length).toBeGreaterThanOrEqual(2)
    })

    it('should include monsters of various types', () => {
      const types = MONSTERS.map((m) => m.type)
      const uniqueTypes = new Set(types)
      expect(uniqueTypes.size).toBeGreaterThanOrEqual(4)
    })

    it('should include at least one Undead monster', () => {
      const undead = MONSTERS.filter((m) => m.type === 'Undead')
      expect(undead.length).toBeGreaterThanOrEqual(1)
    })

    it('should include at least one Beast monster', () => {
      const beasts = MONSTERS.filter((m) => m.type === 'Beast')
      expect(beasts.length).toBeGreaterThanOrEqual(1)
    })

    it('should include at least one Humanoid monster', () => {
      const humanoids = MONSTERS.filter((m) => m.type === 'Humanoid')
      expect(humanoids.length).toBeGreaterThanOrEqual(1)
    })
  })

  describe('getAllMonsters()', () => {
    it('should return all monsters', () => {
      const monsters = getAllMonsters()
      expect(monsters).toHaveLength(MONSTERS.length)
    })

    it('should return a new array (not reference to original)', () => {
      const monsters = getAllMonsters()
      expect(monsters).not.toBe(MONSTERS)
      expect(monsters).toEqual(MONSTERS)
    })

    it('should return array of valid Monster objects', () => {
      const monsters = getAllMonsters()
      monsters.forEach((monster) => {
        expect(monster).toHaveProperty('id')
        expect(monster).toHaveProperty('name')
        expect(monster).toHaveProperty('type')
        expect(monster).toHaveProperty('armorClass')
        expect(monster).toHaveProperty('hitPoints')
      })
    })
  })

  describe('getMonstersByCategory()', () => {
    it('should return monsters of specified category', () => {
      const undead = getMonstersByCategory('Undead')
      undead.forEach((monster) => {
        expect(monster.type).toBe('Undead')
      })
    })

    it('should return empty array for category with no monsters', () => {
      const aberrations = getMonstersByCategory('Aberration')
      expect(Array.isArray(aberrations)).toBe(true)
    })

    it('should handle all valid MonsterType categories', () => {
      const validTypes: MonsterType[] = [
        'Beast',
        'Humanoid',
        'Undead',
        'Chaos',
        'Xenos',
        'Daemon',
        'Dragon',
        'Giant',
      ]

      validTypes.forEach((type) => {
        const monsters = getMonstersByCategory(type)
        expect(Array.isArray(monsters)).toBe(true)
        monsters.forEach((monster) => {
          expect(monster.type).toBe(type)
        })
      })
    })

    it('should return Undead monsters correctly', () => {
      const undead = getMonstersByCategory('Undead')
      expect(undead.length).toBeGreaterThanOrEqual(1)
      expect(undead.every((m) => m.type === 'Undead')).toBe(true)
    })

    it('should return Beast monsters correctly', () => {
      const beasts = getMonstersByCategory('Beast')
      expect(beasts.length).toBeGreaterThanOrEqual(1)
      expect(beasts.every((m) => m.type === 'Beast')).toBe(true)
    })

    it('should return Humanoid monsters correctly', () => {
      const humanoids = getMonstersByCategory('Humanoid')
      expect(humanoids.length).toBeGreaterThanOrEqual(1)
      expect(humanoids.every((m) => m.type === 'Humanoid')).toBe(true)
    })

    it('should return Chaos monsters correctly', () => {
      const chaos = getMonstersByCategory('Chaos')
      expect(Array.isArray(chaos)).toBe(true)
      if (chaos.length > 0) {
        expect(chaos.every((m) => m.type === 'Chaos')).toBe(true)
      }
    })
  })

  describe('getMonsterById()', () => {
    it('should return monster with matching ID', () => {
      const testMonster = MONSTERS[0]
      const found = getMonsterById(testMonster.id)
      expect(found).toBeDefined()
      expect(found?.id).toBe(testMonster.id)
      expect(found?.name).toBe(testMonster.name)
    })

    it('should return undefined for non-existent ID', () => {
      const found = getMonsterById('00000000-0000-0000-0000-000000000000')
      expect(found).toBeUndefined()
    })

    it('should return correct monster for each monster in library', () => {
      MONSTERS.forEach((monster) => {
        const found = getMonsterById(monster.id)
        expect(found).toEqual(monster)
      })
    })

    it('should return undefined for invalid UUID format', () => {
      const found = getMonsterById('invalid-uuid')
      expect(found).toBeUndefined()
    })
  })

  describe('getMonstersByChallengeRange()', () => {
    it('should return monsters within specified CR range', () => {
      const lowLevel = getMonstersByChallengeRange(0, 2)
      lowLevel.forEach((monster) => {
        expect(monster.challenge).toBeGreaterThanOrEqual(0)
        expect(monster.challenge).toBeLessThanOrEqual(2)
      })
    })

    it('should include monsters at exact min and max CR', () => {
      const range = getMonstersByChallengeRange(1, 1)
      range.forEach((monster) => {
        expect(monster.challenge).toBe(1)
      })
    })

    it('should return empty array if no monsters in range', () => {
      const noneFound = getMonstersByChallengeRange(100, 200)
      expect(noneFound).toEqual([])
    })

    it('should handle fractional CR values (CR 0.25, 0.5)', () => {
      const veryLow = getMonstersByChallengeRange(0, 0.5)
      expect(Array.isArray(veryLow)).toBe(true)
    })

    it('should return high-CR monsters correctly', () => {
      const bosses = getMonstersByChallengeRange(10, 30)
      bosses.forEach((monster) => {
        expect(monster.challenge).toBeGreaterThanOrEqual(10)
        expect(monster.challenge).toBeLessThanOrEqual(30)
      })
    })

    it('should return all monsters when range is 0-30', () => {
      const all = getMonstersByChallengeRange(0, 30)
      expect(all.length).toBe(MONSTERS.length)
    })
  })

  describe('getMonsterCategories()', () => {
    it('should return array of unique monster types', () => {
      const categories = getMonsterCategories()
      expect(Array.isArray(categories)).toBe(true)
      const uniqueCategories = new Set(categories)
      expect(uniqueCategories.size).toBe(categories.length)
    })

    it('should include all types present in MONSTERS', () => {
      const categories = getMonsterCategories()
      const expectedTypes = new Set(MONSTERS.map((m) => m.type))
      const returnedTypes = new Set(categories)

      expectedTypes.forEach((type) => {
        expect(returnedTypes.has(type)).toBe(true)
      })
    })

    it('should return sorted categories', () => {
      const categories = getMonsterCategories()
      const sorted = [...categories].sort()
      expect(categories).toEqual(sorted)
    })

    it('should return at least 4 different categories', () => {
      const categories = getMonsterCategories()
      expect(categories.length).toBeGreaterThanOrEqual(4)
    })
  })

  describe('searchMonsters()', () => {
    it('should find monsters by exact name match', () => {
      const testMonster = MONSTERS[0]
      const results = searchMonsters(testMonster.name)
      expect(results.length).toBeGreaterThanOrEqual(1)
      expect(results.some((m) => m.name === testMonster.name)).toBe(true)
    })

    it('should be case-insensitive', () => {
      const testMonster = MONSTERS[0]
      const lowerResults = searchMonsters(testMonster.name.toLowerCase())
      const upperResults = searchMonsters(testMonster.name.toUpperCase())
      const mixedResults = searchMonsters(testMonster.name)

      expect(lowerResults.length).toBe(upperResults.length)
      expect(lowerResults.length).toBe(mixedResults.length)
    })

    it('should find monsters by partial name match', () => {
      const results = searchMonsters('goblin')
      expect(results.length).toBeGreaterThanOrEqual(1)
      results.forEach((monster) => {
        expect(monster.name.toLowerCase()).toContain('goblin')
      })
    })

    it('should return empty array for non-matching query', () => {
      const results = searchMonsters('ThisMonsterDoesNotExist12345')
      expect(results).toEqual([])
    })

    it('should return empty array for empty query', () => {
      const results = searchMonsters('')
      expect(results).toEqual([])
    })

    it('should trim whitespace from query', () => {
      const testMonster = MONSTERS[0]
      const trimmedResults = searchMonsters(testMonster.name)
      const untrimmedResults = searchMonsters(`  ${testMonster.name}  `)
      expect(trimmedResults.length).toBe(untrimmedResults.length)
    })

    it('should find multiple monsters with shared keywords', () => {
      // If there are multiple "Chaos" monsters, this should find them all
      const chaosResults = searchMonsters('chaos')
      if (chaosResults.length > 1) {
        chaosResults.forEach((monster) => {
          expect(monster.name.toLowerCase()).toContain('chaos')
        })
      }
      expect(Array.isArray(chaosResults)).toBe(true)
    })
  })

  describe('Monster ability structure', () => {
    it('should have valid ability names', () => {
      MONSTERS.forEach((monster) => {
        monster.abilities.forEach((ability) => {
          expect(ability.name).toBeTruthy()
          expect(ability.name.length).toBeGreaterThan(0)
          expect(ability.name.length).toBeLessThanOrEqual(50)
        })
      })
    })

    it('should have valid ability descriptions', () => {
      MONSTERS.forEach((monster) => {
        monster.abilities.forEach((ability) => {
          expect(ability.description).toBeTruthy()
          expect(ability.description.length).toBeGreaterThan(0)
          expect(ability.description.length).toBeLessThanOrEqual(500)
        })
      })
    })

    it('should have unique ability names per monster', () => {
      MONSTERS.forEach((monster) => {
        const abilityNames = monster.abilities.map((a) => a.name)
        const uniqueNames = new Set(abilityNames)
        expect(uniqueNames.size).toBe(abilityNames.length)
      })
    })
  })
})
