'use client'

/**
 * Add to Combat Modal Component
 *
 * Modal dialog for adding characters from the roster to combat.
 * Displays all available characters with checkboxes for selection.
 * Allows entering initiative value (defaults to AC temporarily).
 *
 * Features:
 * - Character list with avatars and stats
 * - Multi-select checkboxes
 * - Initiative input field (defaults to AC)
 * - Add All / Clear All buttons
 * - Filters out characters already in combat
 * - Empty state when no characters available
 *
 * @see CombatTracker for the main combat interface
 */

import { useState, useMemo } from 'react'
import { useGameStore } from '@/lib/store/gameStore'
import { getAvatarSource } from '@/lib/utils/avatar'
import { createCombatantFromCharacter } from '@/lib/schemas/combatant.schema'

interface AddToCombatModalProps {
  onClose: () => void
}

/**
 * AddToCombatModal - Modal for adding characters to combat
 *
 * Allows selecting multiple characters from the roster and adding them
 * to the active combat encounter. Characters already in combat are
 * automatically filtered out. Initiative defaults to AC value.
 *
 * @param onClose - Callback when modal is closed (ESC, backdrop click, or Cancel button)
 *
 * @example
 * ```tsx
 * {showAddModal && (
 *   <AddToCombatModal
 *     onClose={() => setShowAddModal(false)}
 *   />
 * )}
 * ```
 */
export function AddToCombatModal({ onClose }: AddToCombatModalProps) {
  const characters = useGameStore((state) => state.characters)
  const combatants = useGameStore((state) => state.combatants)
  const addCombatant = useGameStore((state) => state.addCombatant)

  // Track selected character IDs and their initiative values
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [initiativeValues, setInitiativeValues] = useState<Record<string, number>>({})

  // Filter out characters already in combat
  const availableCharacters = useMemo(() => {
    const combatantEntityIds = new Set(
      combatants.filter((c) => c.type === 'character').map((c) => c.entityId)
    )
    return characters.filter((char) => !combatantEntityIds.has(char.id))
  }, [characters, combatants])

  // Toggle character selection
  const toggleCharacter = (characterId: string, ac: number) => {
    const newSelected = new Set(selectedIds)
    if (newSelected.has(characterId)) {
      newSelected.delete(characterId)
      // Remove initiative value
      const newInitiatives = { ...initiativeValues }
      delete newInitiatives[characterId]
      setInitiativeValues(newInitiatives)
    } else {
      newSelected.add(characterId)
      // Initialize with AC as default initiative
      setInitiativeValues({
        ...initiativeValues,
        [characterId]: ac,
      })
    }
    setSelectedIds(newSelected)
  }

  // Select all characters
  const selectAll = () => {
    const newSelected = new Set(availableCharacters.map((c) => c.id))
    const newInitiatives: Record<string, number> = {}
    availableCharacters.forEach((char) => {
      newInitiatives[char.id] = char.armorClass
    })
    setSelectedIds(newSelected)
    setInitiativeValues(newInitiatives)
  }

  // Clear all selections
  const clearAll = () => {
    setSelectedIds(new Set())
    setInitiativeValues({})
  }

  // Update initiative for a character
  const updateInitiative = (characterId: string, initiative: number) => {
    setInitiativeValues({
      ...initiativeValues,
      [characterId]: initiative,
    })
  }

  // Handle adding selected characters to combat
  const handleAddToCombat = () => {
    selectedIds.forEach((charId) => {
      const character = characters.find((c) => c.id === charId)
      if (character) {
        const initiative = initiativeValues[charId] ?? character.armorClass
        const combatantData = createCombatantFromCharacter(character, initiative)
        addCombatant(combatantData)
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

  // Empty state - no available characters
  if (availableCharacters.length === 0) {
    return (
      <div
        className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
        onClick={onClose}
        onKeyDown={handleKeyDown}
        role="dialog"
        aria-labelledby="add-to-combat-title"
        aria-modal="true"
      >
        <div
          className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
          onClick={(e) => e.stopPropagation()}
        >
          <h2 id="add-to-combat-title" className="text-2xl font-bold mb-4">
            Add to Combat
          </h2>
          <div className="text-center py-8">
            <div className="text-4xl mb-2">🚫</div>
            <p className="text-gray-600 mb-4">
              No characters available. All characters are already in combat or none exist.
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
      aria-labelledby="add-to-combat-title"
      aria-modal="true"
    >
      <div
        className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white p-4">
          <h2 id="add-to-combat-title" className="text-2xl font-bold">
            ➕ Add Characters to Combat
          </h2>
          <p className="text-sm opacity-90 mt-1">
            Select characters to add to the encounter
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
          <div className="ml-auto text-sm text-gray-600 flex items-center">
            <span className="font-semibold">{selectedIds.size}</span>
            <span className="ml-1">selected</span>
          </div>
        </div>

        {/* Character List */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-3">
            {availableCharacters.map((character) => {
              const isSelected = selectedIds.has(character.id)
              const avatarSrc = getAvatarSource(
                character.imageUrl,
                character.avatarSeed || character.name,
                character.name
              )

              return (
                <div
                  key={character.id}
                  className={`border rounded-lg p-3 transition-all ${
                    isSelected
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {/* Checkbox */}
                    <input
                      type="checkbox"
                      id={`char-${character.id}`}
                      checked={isSelected}
                      onChange={() => toggleCharacter(character.id, character.armorClass)}
                      className="w-5 h-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
                    />

                    {/* Avatar */}
                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gray-300 flex-shrink-0">
                      <img
                        src={avatarSrc}
                        alt={`${character.name}'s avatar`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none'
                          e.currentTarget.parentElement!.innerHTML = `<div class="w-full h-full bg-gray-300 flex items-center justify-center text-lg font-bold text-gray-600">${character.name.charAt(0).toUpperCase()}</div>`
                        }}
                      />
                    </div>

                    {/* Character Info */}
                    <div className="flex-1 min-w-0">
                      <label
                        htmlFor={`char-${character.id}`}
                        className="block font-bold text-gray-900 cursor-pointer truncate"
                      >
                        {character.name}
                      </label>
                      <div className="text-sm text-gray-600">
                        Level {character.level} {character.characterClass}
                      </div>
                      <div className="flex gap-3 text-xs text-gray-500 mt-1">
                        <span>HP: {character.currentHp}/{character.maxHp}</span>
                        <span>AC: {character.armorClass}</span>
                      </div>
                    </div>

                    {/* Initiative Input */}
                    {isSelected && (
                      <div className="flex-shrink-0">
                        <label
                          htmlFor={`init-${character.id}`}
                          className="block text-xs text-gray-600 mb-1"
                        >
                          Initiative
                        </label>
                        <input
                          id={`init-${character.id}`}
                          type="number"
                          min="-10"
                          max="50"
                          value={initiativeValues[character.id] ?? character.armorClass}
                          onChange={(e) =>
                            updateInitiative(character.id, parseInt(e.target.value) || 0)
                          }
                          className="w-16 px-2 py-1 border rounded text-sm text-center"
                          onClick={(e) => e.stopPropagation()}
                        />
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
            className="px-6 py-2 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add to Combat ({selectedIds.size})
          </button>
        </div>
      </div>
    </div>
  )
}
