/**
 * Encounters Data Tests
 *
 * Tests for the pre-built encounter data and helper functions.
 *
 * @see lib/data/encounters.ts - Encounter data and functions
 */

import {
  ENCOUNTERS,
  getAllEncounters,
  getEncounterById,
  getEncountersByDifficulty,
  getEncountersByTag,
  resolveEncounterMonsters,
  getEncounterMonsterCount,
  getEncounterDifficulties,
  Encounter,
} from '@/lib/data/encounters'
import { getMonsterById } from '@/lib/data/monsters'

describe('Encounters Data', () => {
  describe('ENCOUNTERS constant', () => {
    it('contains at least 5 pre-built encounters', () => {
      expect(ENCOUNTERS.length).toBeGreaterThanOrEqual(5)
    })

    it('all encounters have required fields', () => {
      ENCOUNTERS.forEach((encounter) => {
        expect(encounter.id).toBeDefined()
        expect(encounter.id.length).toBeGreaterThan(0)
        expect(encounter.name).toBeDefined()
        expect(encounter.name.length).toBeGreaterThan(0)
        expect(encounter.description).toBeDefined()
        expect(encounter.description.length).toBeGreaterThan(0)
        expect(encounter.difficulty).toBeDefined()
        expect(['Easy', 'Medium', 'Hard', 'Deadly']).toContain(encounter.difficulty)
        expect(encounter.monsters).toBeDefined()
        expect(Array.isArray(encounter.monsters)).toBe(true)
        expect(encounter.monsters.length).toBeGreaterThan(0)
        expect(encounter.tags).toBeDefined()
        expect(Array.isArray(encounter.tags)).toBe(true)
      })
    })

    it('all encounters have unique IDs', () => {
      const ids = ENCOUNTERS.map((e) => e.id)
      const uniqueIds = new Set(ids)
      expect(uniqueIds.size).toBe(ids.length)
    })

    it('all encounter monster IDs reference valid monsters', () => {
      ENCOUNTERS.forEach((encounter) => {
        encounter.monsters.forEach((entry) => {
          const monster = getMonsterById(entry.monsterId)
          expect(monster).toBeDefined()
          expect(entry.count).toBeGreaterThan(0)
        })
      })
    })

    it('encounter IDs follow naming convention', () => {
      ENCOUNTERS.forEach((encounter) => {
        expect(encounter.id).toMatch(/^encounter-[a-z-]+$/)
      })
    })
  })

  describe('getAllEncounters', () => {
    it('returns all encounters', () => {
      const encounters = getAllEncounters()
      expect(encounters.length).toBe(ENCOUNTERS.length)
    })

    it('returns a copy, not the original array', () => {
      const encounters = getAllEncounters()
      expect(encounters).not.toBe(ENCOUNTERS)
      expect(encounters).toEqual(ENCOUNTERS)
    })
  })

  describe('getEncounterById', () => {
    it('returns the correct encounter for a valid ID', () => {
      const encounter = getEncounterById('encounter-goblin-ambush')
      expect(encounter).toBeDefined()
      expect(encounter?.name).toBe('Goblin Ambush')
    })

    it('returns undefined for invalid ID', () => {
      const encounter = getEncounterById('invalid-encounter-id')
      expect(encounter).toBeUndefined()
    })

    it('finds all encounters by their IDs', () => {
      ENCOUNTERS.forEach((encounter) => {
        const found = getEncounterById(encounter.id)
        expect(found).toBeDefined()
        expect(found?.id).toBe(encounter.id)
      })
    })
  })

  describe('getEncountersByDifficulty', () => {
    it('returns encounters filtered by Easy difficulty', () => {
      const easy = getEncountersByDifficulty('Easy')
      expect(easy.length).toBeGreaterThan(0)
      easy.forEach((e) => expect(e.difficulty).toBe('Easy'))
    })

    it('returns encounters filtered by Medium difficulty', () => {
      const medium = getEncountersByDifficulty('Medium')
      expect(medium.length).toBeGreaterThan(0)
      medium.forEach((e) => expect(e.difficulty).toBe('Medium'))
    })

    it('returns encounters filtered by Hard difficulty', () => {
      const hard = getEncountersByDifficulty('Hard')
      hard.forEach((e) => expect(e.difficulty).toBe('Hard'))
    })

    it('returns encounters filtered by Deadly difficulty', () => {
      const deadly = getEncountersByDifficulty('Deadly')
      deadly.forEach((e) => expect(e.difficulty).toBe('Deadly'))
    })

    it('returns empty array for non-existent difficulty', () => {
      // @ts-expect-error Testing invalid input
      const result = getEncountersByDifficulty('Trivial')
      expect(result).toEqual([])
    })
  })

  describe('getEncountersByTag', () => {
    it('returns encounters containing the specified tag', () => {
      const undead = getEncountersByTag('undead')
      expect(undead.length).toBeGreaterThan(0)
      undead.forEach((e) => {
        expect(e.tags.some((t) => t.toLowerCase() === 'undead')).toBe(true)
      })
    })

    it('is case-insensitive', () => {
      const lower = getEncountersByTag('undead')
      const upper = getEncountersByTag('UNDEAD')
      const mixed = getEncountersByTag('UnDeAd')
      expect(lower).toEqual(upper)
      expect(lower).toEqual(mixed)
    })

    it('returns empty array for non-existent tag', () => {
      const result = getEncountersByTag('nonexistenttag')
      expect(result).toEqual([])
    })
  })

  describe('resolveEncounterMonsters', () => {
    it('returns resolved monsters with counts for valid encounter', () => {
      const resolved = resolveEncounterMonsters('encounter-goblin-ambush')
      expect(resolved.length).toBeGreaterThan(0)
      resolved.forEach(({ monster, count }) => {
        expect(monster).toBeDefined()
        expect(monster.id).toBeDefined()
        expect(monster.name).toBeDefined()
        expect(count).toBeGreaterThan(0)
      })
    })

    it('returns empty array for invalid encounter ID', () => {
      const resolved = resolveEncounterMonsters('invalid-id')
      expect(resolved).toEqual([])
    })

    it('resolves all monsters in all encounters', () => {
      ENCOUNTERS.forEach((encounter) => {
        const resolved = resolveEncounterMonsters(encounter.id)
        expect(resolved.length).toBe(encounter.monsters.length)
      })
    })

    it('preserves monster counts from encounter definition', () => {
      const goblinAmbush = getEncounterById('encounter-goblin-ambush')
      expect(goblinAmbush).toBeDefined()

      const resolved = resolveEncounterMonsters('encounter-goblin-ambush')
      goblinAmbush?.monsters.forEach((entry, index) => {
        expect(resolved[index].count).toBe(entry.count)
      })
    })
  })

  describe('getEncounterMonsterCount', () => {
    it('returns total monster count for valid encounter', () => {
      // Goblin Ambush has 4 goblins
      const count = getEncounterMonsterCount('encounter-goblin-ambush')
      expect(count).toBe(4)
    })

    it('returns correct count for multi-monster encounters', () => {
      // Undead Horde has 3 zombies + 3 skeletons = 6
      const count = getEncounterMonsterCount('encounter-undead-horde')
      expect(count).toBe(6)
    })

    it('returns 0 for invalid encounter ID', () => {
      const count = getEncounterMonsterCount('invalid-id')
      expect(count).toBe(0)
    })

    it('calculates correct total for all encounters', () => {
      ENCOUNTERS.forEach((encounter) => {
        const expected = encounter.monsters.reduce((sum, m) => sum + m.count, 0)
        const actual = getEncounterMonsterCount(encounter.id)
        expect(actual).toBe(expected)
      })
    })
  })

  describe('getEncounterDifficulties', () => {
    it('returns unique difficulty levels', () => {
      const difficulties = getEncounterDifficulties()
      const uniqueDifficulties = new Set(difficulties)
      expect(difficulties.length).toBe(uniqueDifficulties.size)
    })

    it('only contains valid difficulty values', () => {
      const validDifficulties = ['Easy', 'Medium', 'Hard', 'Deadly']
      const difficulties = getEncounterDifficulties()
      difficulties.forEach((d) => {
        expect(validDifficulties).toContain(d)
      })
    })
  })

  describe('Encounter Content Validation', () => {
    it('Goblin Ambush encounter is properly defined', () => {
      const encounter = getEncounterById('encounter-goblin-ambush')
      expect(encounter).toBeDefined()
      expect(encounter?.name).toBe('Goblin Ambush')
      expect(encounter?.difficulty).toBe('Easy')
      expect(encounter?.monsters.length).toBeGreaterThan(0)
      expect(encounter?.tags).toContain('ambush')
    })

    it('Undead Horde encounter is properly defined', () => {
      const encounter = getEncounterById('encounter-undead-horde')
      expect(encounter).toBeDefined()
      expect(encounter?.name).toBe('Undead Horde')
      expect(encounter?.difficulty).toBe('Medium')
      expect(encounter?.tags).toContain('undead')
    })

    it('Chaos Warband encounter is properly defined', () => {
      const encounter = getEncounterById('encounter-chaos-warband')
      expect(encounter).toBeDefined()
      expect(encounter?.name).toBe('Chaos Warband')
      expect(encounter?.difficulty).toBe('Deadly')
      expect(encounter?.tags).toContain('chaos')
      expect(encounter?.tags).toContain('boss')
    })

    it('all encounters have thematic descriptions', () => {
      ENCOUNTERS.forEach((encounter) => {
        // Description should be at least 30 characters
        expect(encounter.description.length).toBeGreaterThanOrEqual(30)
      })
    })

    it('all encounters have at least one tag', () => {
      ENCOUNTERS.forEach((encounter) => {
        expect(encounter.tags.length).toBeGreaterThan(0)
      })
    })
  })
})
