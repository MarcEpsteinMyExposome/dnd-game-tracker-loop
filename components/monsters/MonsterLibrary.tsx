'use client'

/**
 * Monster Library Component
 *
 * Container component that displays the full monster library with filtering and sorting.
 * Shows all available monsters in a responsive grid with category filters, search, and sort options.
 *
 * Features:
 * - Category filter tabs (All, Humanoid, Beast, Undead, etc.)
 * - Search by monster name
 * - Sort by name, AC, HP, or CR
 * - Responsive grid layout (1-3 columns)
 * - "Add All to Combat" batch functionality
 * - Quick Encounter presets for one-click combat setup
 * - Empty state when no monsters match filters
 * - Monster count display
 *
 * @see components/monsters/MonsterCard.tsx - Individual monster cards
 * @see lib/data/monsters.ts - Monster data and helper functions
 * @see lib/data/encounters.ts - Pre-built encounter data
 */

import { useState, useMemo } from 'react'
import { Monster, MonsterType } from '@/lib/schemas/monster.schema'
import { getAllMonsters, getMonsterCategories } from '@/lib/data/monsters'
import { useGameStore } from '@/lib/store/gameStore'
import {
  getAllEncounters,
  resolveEncounterMonsters,
  getEncounterMonsterCount,
  Encounter,
} from '@/lib/data/encounters'
import { MonsterCard } from './MonsterCard'

/**
 * Monster entry with count for adding to combat
 * Used by Quick Encounter feature to add multiple copies of same monster
 */
export interface MonsterWithCount {
  monster: Monster
  count: number
}

interface MonsterLibraryProps {
  /**
   * Callback when "Add to Combat" is clicked on a monster card
   * @param monster - The monster to add to combat
   */
  onAddToCombat?: (monster: Monster) => void

  /**
   * Callback when "Add All to Combat" button is clicked
   * @param monsters - Array of all currently filtered/visible monsters
   */
  onAddAllToCombat?: (monsters: Monster[]) => void

  /**
   * Callback when a Quick Encounter is loaded
   * @param monsters - Array of monsters with counts to add
   */
  onLoadEncounter?: (monsters: MonsterWithCount[]) => void

  /**
   * Callback when "Create Outlaw" button is clicked
   */
  onCreateMonster?: () => void

  /**
   * Callback when "Edit" is clicked on a custom monster
   * @param monster - The monster to edit
   */
  onEditMonster?: (monster: Monster) => void

  /**
   * Callback when "Delete" is clicked on a custom monster
   * @param monster - The monster to delete
   */
  onDeleteMonster?: (monster: Monster) => void

  /**
   * Optional CSS classes for custom styling
   */
  className?: string
}

type SortOption = 'name' | 'ac' | 'hp' | 'cr'

/**
 * MonsterLibrary displays all monsters with filtering and sorting
 *
 * Manages state for:
 * - Active category filter (All, Humanoid, Beast, etc.)
 * - Search query (filters by name)
 * - Sort order (name, AC, HP, CR)
 * - Quick Encounter selection
 *
 * Filtering logic:
 * 1. Filter by category (if not "All")
 * 2. Filter by search query (case-insensitive name match)
 * 3. Sort by selected option
 *
 * @example
 * ```tsx
 * <MonsterLibrary
 *   onAddToCombat={(monster) => addMonsterToCombat(monster)}
 *   onAddAllToCombat={(monsters) => addAllMonsters(monsters)}
 *   onLoadEncounter={(monsters) => loadEncounterToCombat(monsters)}
 * />
 * ```
 */
export default function MonsterLibrary({
  onAddToCombat,
  onAddAllToCombat,
  onLoadEncounter,
  onCreateMonster,
  onEditMonster,
  onDeleteMonster,
  className = '',
}: MonsterLibraryProps) {
  const [activeCategory, setActiveCategory] = useState<MonsterType | 'All'>('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<SortOption>('name')
  const [selectedEncounter, setSelectedEncounter] = useState<string>('')

  // Get custom monsters from store
  const customMonsters = useGameStore((state) => state.customMonsters)

  // Get all monsters from library and combine with custom
  const libraryMonsters = getAllMonsters()
  const allMonsters = useMemo(() => {
    return [...libraryMonsters, ...customMonsters]
  }, [libraryMonsters, customMonsters])

  // Track which monster IDs are custom
  const customMonsterIds = useMemo(() => {
    return new Set(customMonsters.map((m) => m.id))
  }, [customMonsters])

  // Get unique categories for filter tabs
  const categories = getMonsterCategories()

  // Get all pre-built encounters
  const encounters = getAllEncounters()

  // Filter and sort monsters based on current state
  const filteredMonsters = useMemo(() => {
    let filtered = allMonsters

    // Filter by category
    if (activeCategory !== 'All') {
      filtered = filtered.filter((m) => m.type === activeCategory)
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim()
      filtered = filtered.filter((m) => m.name.toLowerCase().includes(query))
    }

    // Sort monsters
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name)
        case 'ac':
          return b.armorClass - a.armorClass // Descending
        case 'hp':
          return b.hitPoints - a.hitPoints // Descending
        case 'cr':
          return b.challenge - a.challenge // Descending
        default:
          return 0
      }
    })

    return sorted
  }, [allMonsters, activeCategory, searchQuery, sortBy])

  // Handle "Add All to Combat" button
  const handleAddAllToCombat = () => {
    if (onAddAllToCombat && filteredMonsters.length > 0) {
      onAddAllToCombat(filteredMonsters)
    }
  }

  // Handle Quick Encounter load
  const handleLoadEncounter = () => {
    if (!selectedEncounter || !onLoadEncounter) return

    const resolvedMonsters = resolveEncounterMonsters(selectedEncounter)
    if (resolvedMonsters.length > 0) {
      onLoadEncounter(resolvedMonsters)
      setSelectedEncounter('') // Reset selection after loading
    }
  }

  // Get difficulty badge color
  const getDifficultyColor = (difficulty: Encounter['difficulty']): string => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-green-600 text-green-100'
      case 'Medium':
        return 'bg-yellow-600 text-yellow-100'
      case 'Hard':
        return 'bg-orange-600 text-orange-100'
      case 'Deadly':
        return 'bg-red-600 text-red-100'
      default:
        return 'bg-slate-600 text-slate-100'
    }
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header with count and actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-100">Monster Library</h2>
          <p className="text-sm text-slate-400 mt-1">
            {filteredMonsters.length} {filteredMonsters.length === 1 ? 'monster' : 'monsters'}
            {customMonsters.length > 0 && ` (${customMonsters.length} custom)`}
            {searchQuery && ` matching "${searchQuery}"`}
          </p>
        </div>

        <div className="flex gap-2 flex-wrap">
          {/* Create Outlaw button */}
          {onCreateMonster && (
            <button
              onClick={onCreateMonster}
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white rounded-lg font-medium transition-colors border border-purple-400/30"
              aria-label="Create a new custom outlaw"
            >
              ✨ Create Outlaw
            </button>
          )}

          {/* Add All to Combat button */}
          {onAddAllToCombat && filteredMonsters.length > 0 && (
            <button
              onClick={handleAddAllToCombat}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
              aria-label={`Add all ${filteredMonsters.length} monsters to combat`}
            >
              Add All to Combat ({filteredMonsters.length})
            </button>
          )}
        </div>
      </div>

      {/* Quick Encounter Section */}
      {onLoadEncounter && (
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex-1">
              <label htmlFor="quick-encounter" className="block text-sm font-medium text-slate-300 mb-2">
                Quick Encounter
              </label>
              <select
                id="quick-encounter"
                value={selectedEncounter}
                onChange={(e) => setSelectedEncounter(e.target.value)}
                className="w-full px-4 py-2 bg-slate-700 text-slate-100 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                aria-label="Select a quick encounter"
              >
                <option value="">Select an encounter...</option>
                {encounters.map((encounter) => (
                  <option key={encounter.id} value={encounter.id}>
                    {encounter.name} ({encounter.difficulty}) - {getEncounterMonsterCount(encounter.id)} monsters
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleLoadEncounter}
              disabled={!selectedEncounter}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                selectedEncounter
                  ? 'bg-orange-600 hover:bg-orange-700 text-white'
                  : 'bg-slate-600 text-slate-400 cursor-not-allowed'
              }`}
              aria-label="Load selected encounter"
            >
              Load Encounter
            </button>
          </div>

          {/* Encounter preview */}
          {selectedEncounter && (
            <div className="mt-4 pt-4 border-t border-slate-700">
              {encounters
                .filter((e) => e.id === selectedEncounter)
                .map((encounter) => (
                  <div key={encounter.id}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded ${getDifficultyColor(encounter.difficulty)}`}>
                        {encounter.difficulty}
                      </span>
                      <span className="text-slate-400 text-sm">
                        {getEncounterMonsterCount(encounter.id)} total monsters
                      </span>
                    </div>
                    <p className="text-slate-300 text-sm mb-3">{encounter.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {resolveEncounterMonsters(encounter.id).map(({ monster, count }) => (
                        <span
                          key={monster.id}
                          className="px-3 py-1 bg-slate-700 text-slate-200 text-sm rounded-full"
                        >
                          {count}x {monster.name}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      )}

      {/* Category filter tabs */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setActiveCategory('All')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeCategory === 'All'
              ? 'bg-purple-600 text-white'
              : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
          }`}
          aria-label="Show all monsters"
          aria-pressed={activeCategory === 'All'}
        >
          All ({allMonsters.length})
        </button>

        {categories.map((category) => {
          const count = allMonsters.filter((m) => m.type === category).length
          return (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeCategory === category
                  ? 'bg-purple-600 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
              aria-label={`Filter by ${category}`}
              aria-pressed={activeCategory === category}
            >
              {category} ({count})
            </button>
          )
        })}
      </div>

      {/* Search and Sort controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search input */}
        <div className="flex-1">
          <label htmlFor="monster-search" className="sr-only">
            Search monsters by name
          </label>
          <input
            id="monster-search"
            type="text"
            placeholder="Search monsters by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 bg-slate-700 text-slate-100 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder:text-slate-400"
            aria-label="Search monsters by name"
          />
        </div>

        {/* Sort dropdown */}
        <div className="sm:w-48">
          <label htmlFor="monster-sort" className="sr-only">
            Sort monsters by
          </label>
          <select
            id="monster-sort"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="w-full px-4 py-2 bg-slate-700 text-slate-100 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            aria-label="Sort monsters by"
          >
            <option value="name">Sort by Name</option>
            <option value="ac">Sort by AC (High to Low)</option>
            <option value="hp">Sort by HP (High to Low)</option>
            <option value="cr">Sort by CR (High to Low)</option>
          </select>
        </div>
      </div>

      {/* Monster grid */}
      {filteredMonsters.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMonsters.map((monster) => {
            const isCustom = customMonsterIds.has(monster.id)
            return (
              <MonsterCard
                key={monster.id}
                monster={monster}
                onAddToCombat={onAddToCombat}
                isCustom={isCustom}
                onEdit={isCustom ? onEditMonster : undefined}
                onDelete={isCustom ? onDeleteMonster : undefined}
              />
            )
          })}
        </div>
      ) : (
        /* Empty state */
        <div className="text-center py-12 bg-slate-800 rounded-lg border border-slate-700">
          <p className="text-slate-400 text-lg">
            {searchQuery ? (
              <>
                No monsters found matching <span className="text-slate-200">"{searchQuery}"</span>
              </>
            ) : (
              <>No monsters in the {activeCategory} category</>
            )}
          </p>
          <button
            onClick={() => {
              setSearchQuery('')
              setActiveCategory('All')
            }}
            className="mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  )
}
