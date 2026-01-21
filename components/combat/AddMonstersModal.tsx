'use client'

/**
 * Add Monsters Modal Component
 *
 * Modal dialog for adding monsters from the library to combat.
 * Displays all available monsters with checkboxes for selection.
 * Allows entering initiative value (defaults to AC temporarily).
 * Supports adding multiple instances of the same monster with unique names.
 *
 * Features:
 * - Monster list with avatars and stats
 * - Multi-select checkboxes
 * - Instance count selector for duplicates
 * - Initiative input field (defaults to AC)
 * - Add All / Clear All buttons
 * - Filters out monsters already in combat (by name)
 * - Empty state when no monsters available
 *
 * @see CombatTracker for the main combat interface
 * @see AddToCombatModal for the character version
 */

import { useState, useMemo } from 'react'
import { useGameStore } from '@/lib/store/gameStore'
import { getAllMonsters } from '@/lib/data/monsters'
import { createCombatantFromMonster } from '@/lib/schemas/combatant.schema'
import { getAvatarSource } from '@/lib/utils/avatar'
import type { Monster } from '@/lib/schemas/monster.schema'

interface AddMonstersModalProps {
  onClose: () => void
}

/**
 * AddMonstersModal - Modal for adding monsters to combat
 *
 * Allows selecting multiple monsters from the library and adding them
 * to the active combat encounter. Supports creating multiple instances
 * of the same monster with unique names (e.g., "Goblin 1", "Goblin 2").
 * Initiative defaults to AC value.
 *
 * @param onClose - Callback when modal is closed (ESC, backdrop click, or Cancel button)
 *
 * @example
 * ```tsx
 * {showAddMonstersModal && (
 *   <AddMonstersModal
 *     onClose={() => setShowAddMonstersModal(false)}
 *   />
 * )}
 * ```
 */
export function AddMonstersModal({ onClose }: AddMonstersModalProps) {
  const monsters = getAllMonsters()
  const combatants = useGameStore((state) => state.combatants)
  const addCombatant = useGameStore((state) => state.addCombatant)

  // Track selected monster IDs, their initiative values, and instance counts
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [initiativeValues, setInitiativeValues] = useState<Record<string, number>>({})
  const [instanceCounts, setInstanceCounts] = useState<Record<string, number>>({})

  // Get count of each monster type already in combat
  const monsterCombatCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    combatants
      .filter((c) => c.type === 'monster')
      .forEach((c) => {
        const baseName = c.name.replace(/\s+\d+$/, '') // Remove trailing number
        counts[baseName] = (counts[baseName] || 0) + 1
      })
    return counts
  }, [combatants])

  // Toggle monster selection
  const toggleMonster = (monsterId: string, ac: number) => {
    const newSelected = new Set(selectedIds)
    if (newSelected.has(monsterId)) {
      newSelected.delete(monsterId)
      // Remove initiative value and instance count
      const newInitiatives = { ...initiativeValues }
      const newCounts = { ...instanceCounts }
      delete newInitiatives[monsterId]
      delete newCounts[monsterId]
      setInitiativeValues(newInitiatives)
      setInstanceCounts(newCounts)
    } else {
      newSelected.add(monsterId)
      // Initialize with AC as default initiative and 1 instance
      setInitiativeValues({
        ...initiativeValues,
        [monsterId]: ac,
      })
      setInstanceCounts({
        ...instanceCounts,
        [monsterId]: 1,
      })
    }
    setSelectedIds(newSelected)
  }

  // Select all monsters
  const selectAll = () => {
    const newSelected = new Set(monsters.map((m) => m.id))
    const newInitiatives: Record<string, number> = {}
    const newCounts: Record<string, number> = {}
    monsters.forEach((monster) => {
      newInitiatives[monster.id] = monster.armorClass
      newCounts[monster.id] = 1
    })
    setSelectedIds(newSelected)
    setInitiativeValues(newInitiatives)
    setInstanceCounts(newCounts)
  }

  // Clear all selections
  const clearAll = () => {
    setSelectedIds(new Set())
    setInitiativeValues({})
    setInstanceCounts({})
  }

  // Update initiative for a monster
  const updateInitiative = (monsterId: string, initiative: number) => {
    setInitiativeValues({
      ...initiativeValues,
      [monsterId]: initiative,
    })
  }

  // Update instance count for a monster
  const updateInstanceCount = (monsterId: string, count: number) => {
    const clampedCount = Math.max(1, Math.min(10, count)) // Limit 1-10 instances
    setInstanceCounts({
      ...instanceCounts,
      [monsterId]: clampedCount,
    })
  }

  // Handle adding selected monsters to combat
  const handleAddToCombat = () => {
    selectedIds.forEach((monsterId) => {
      const monster = monsters.find((m) => m.id === monsterId)
      if (monster) {
        const initiative = initiativeValues[monsterId] ?? monster.armorClass
        const instanceCount = instanceCounts[monsterId] ?? 1
        const existingCount = monsterCombatCounts[monster.name] || 0

        // Add multiple instances with unique names
        for (let i = 0; i < instanceCount; i++) {
          const instanceNumber = existingCount + i + 1
          const instanceName = instanceCount > 1 || existingCount > 0
            ? `${monster.name} ${instanceNumber}`
            : monster.name

          const combatantData = createCombatantFromMonster(
            monster,
            initiative,
            instanceName
          )
          addCombatant(combatantData)
        }
      }
    })
    onClose()
  }

  // Handle ESC key
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose()
    }
  }

  // Calculate total instances to add
  const totalInstances = Array.from(selectedIds).reduce((sum, id) => {
    return sum + (instanceCounts[id] || 1)
  }, 0)

  // Empty state - no available monsters
  if (monsters.length === 0) {
    return (
      <div
        className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
        onClick={onClose}
        onKeyDown={handleKeyDown}
        role="dialog"
        aria-labelledby="add-monsters-title"
        aria-modal="true"
      >
        <div
          className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
          onClick={(e) => e.stopPropagation()}
        >
          <h2 id="add-monsters-title" className="text-2xl font-bold mb-4">
            Add Monsters to Combat
          </h2>
          <div className="text-center py-8">
            <div className="text-4xl mb-2">🚫</div>
            <p className="text-gray-600 mb-4">
              No monsters available in the library.
            </p>
            <button
              onClick={onClose}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-labelledby="add-monsters-title"
      aria-modal="true"
    >
      <div
        className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white p-4">
          <h2 id="add-monsters-title" className="text-2xl font-bold">
            🐉 Add Monsters to Combat
          </h2>
          <p className="text-sm opacity-90 mt-1">
            Select monsters to add to the encounter
          </p>
        </div>

        {/* Controls */}
        <div className="p-4 border-b border-gray-200 flex gap-2">
          <button
            onClick={selectAll}
            className="bg-blue-100 text-blue-700 px-3 py-1.5 rounded text-sm font-semibold hover:bg-blue-200 transition-colors"
          >
            ✓ Select All
          </button>
          <button
            onClick={clearAll}
            className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded text-sm font-semibold hover:bg-gray-200 transition-colors"
          >
            ✗ Clear All
          </button>
          <div className="ml-auto text-sm text-gray-600 flex items-center gap-3">
            <span>
              <span className="font-semibold">{selectedIds.size}</span> selected
            </span>
            {totalInstances !== selectedIds.size && (
              <span>
                (<span className="font-semibold">{totalInstances}</span> total instances)
              </span>
            )}
          </div>
        </div>

        {/* Monster List */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-3">
            {monsters.map((monster) => {
              const isSelected = selectedIds.has(monster.id)
              const avatarSrc = getAvatarSource(
                monster.imageUrl,
                monster.avatarSeed || monster.name,
                monster.name
              )
              const existingCount = monsterCombatCounts[monster.name] || 0

              return (
                <div
                  key={monster.id}
                  className={`border rounded-lg p-3 transition-all ${
                    isSelected
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {/* Checkbox */}
                    <input
                      type="checkbox"
                      id={`monster-${monster.id}`}
                      checked={isSelected}
                      onChange={() => toggleMonster(monster.id, monster.armorClass)}
                      className="w-5 h-5 rounded border-gray-300 text-red-600 focus:ring-red-500 cursor-pointer"
                    />

                    {/* Avatar */}
                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gray-300 flex-shrink-0">
                      <img
                        src={avatarSrc}
                        alt={`${monster.name}'s avatar`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none'
                          e.currentTarget.parentElement!.innerHTML = `<div class="w-full h-full bg-gray-300 flex items-center justify-center text-lg font-bold text-gray-600">${monster.name.charAt(0).toUpperCase()}</div>`
                        }}
                      />
                    </div>

                    {/* Monster Info */}
                    <div className="flex-1 min-w-0">
                      <label
                        htmlFor={`monster-${monster.id}`}
                        className="block font-bold text-gray-900 cursor-pointer truncate"
                      >
                        {monster.name}
                      </label>
                      <div className="text-sm text-gray-600">
                        {monster.type} • CR {monster.challenge}
                      </div>
                      <div className="flex gap-3 text-xs text-gray-500 mt-1">
                        <span>HP: {monster.hitPoints}</span>
                        <span>AC: {monster.armorClass}</span>
                        <span>DMG: {monster.damage}</span>
                        {existingCount > 0 && (
                          <span className="text-orange-600 font-semibold">
                            ({existingCount} in combat)
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Initiative and Instance Count */}
                    {isSelected && (
                      <div className="flex-shrink-0 flex gap-2">
                        {/* Instance Count */}
                        <div>
                          <label
                            htmlFor={`count-${monster.id}`}
                            className="block text-xs text-gray-600 mb-1"
                          >
                            Count
                          </label>
                          <input
                            id={`count-${monster.id}`}
                            type="number"
                            min="1"
                            max="10"
                            value={instanceCounts[monster.id] ?? 1}
                            onChange={(e) =>
                              updateInstanceCount(monster.id, parseInt(e.target.value) || 1)
                            }
                            className="w-16 px-2 py-1 border rounded text-sm text-center"
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>

                        {/* Initiative Input */}
                        <div>
                          <label
                            htmlFor={`init-${monster.id}`}
                            className="block text-xs text-gray-600 mb-1"
                          >
                            Initiative
                          </label>
                          <input
                            id={`init-${monster.id}`}
                            type="number"
                            min="-10"
                            max="50"
                            value={initiativeValues[monster.id] ?? monster.armorClass}
                            onChange={(e) =>
                              updateInitiative(monster.id, parseInt(e.target.value) || 0)
                            }
                            className="w-16 px-2 py-1 border rounded text-sm text-center"
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 flex gap-2 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleAddToCombat}
            disabled={selectedIds.size === 0}
            className="px-6 py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add to Combat ({totalInstances})
          </button>
        </div>
      </div>
    </div>
  )
}
