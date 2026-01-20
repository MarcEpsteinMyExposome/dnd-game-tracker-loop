'use client'

/**
 * Character Card Component
 *
 * Displays character information in a card format.
 * Shows name, class, level, HP bar, AC, and action buttons.
 */

import { Character } from '@/lib/schemas'

interface CharacterCardProps {
  character: Character
  onEdit: (character: Character) => void
  onDelete: (character: Character) => void
}

export function CharacterCard({ character, onEdit, onDelete }: CharacterCardProps) {
  const hpPercentage = (character.currentHp / character.maxHp) * 100

  // Determine HP bar color based on percentage
  let hpColor = 'bg-green-500'
  if (hpPercentage <= 25) {
    hpColor = 'bg-red-500'
  } else if (hpPercentage <= 50) {
    hpColor = 'bg-yellow-500'
  }

  const isUnconscious = character.currentHp === 0

  return (
    <div className="bg-white border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
      {/* Avatar placeholder */}
      <div className="w-20 h-20 rounded-full bg-gray-200 mx-auto mb-3 flex items-center justify-center text-2xl font-bold text-gray-500">
        {character.name.charAt(0).toUpperCase()}
      </div>

      {/* Character Info */}
      <div className="text-center mb-3">
        <h3 className="text-lg font-bold">{character.name}</h3>
        <p className="text-sm text-gray-600">
          Level {character.level} {character.characterClass}
        </p>
      </div>

      {/* HP Bar */}
      <div className="mb-3">
        <div className="flex justify-between text-sm mb-1">
          <span>HP</span>
          <span>
            {character.currentHp}/{character.maxHp}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
          <div
            className={`h-full ${hpColor} transition-all duration-300`}
            style={{ width: `${Math.max(0, Math.min(100, hpPercentage))}%` }}
          />
        </div>
        {isUnconscious && (
          <p className="text-red-600 text-xs font-semibold mt-1 text-center">
            UNCONSCIOUS
          </p>
        )}
      </div>

      {/* Armor Class */}
      <div className="text-center mb-3">
        <span className="inline-block bg-gray-100 px-3 py-1 rounded-md text-sm">
          <span className="font-semibold">AC:</span> {character.armorClass}
        </span>
      </div>

      {/* Conditions */}
      {character.conditions.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-1 justify-center">
          {character.conditions.map((condition) => (
            <span
              key={condition}
              className="inline-block bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded"
            >
              {condition}
            </span>
          ))}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          onClick={() => onEdit(character)}
          className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-md text-sm hover:bg-blue-700"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(character)}
          className="flex-1 bg-red-600 text-white px-3 py-2 rounded-md text-sm hover:bg-red-700"
        >
          Delete
        </button>
      </div>
    </div>
  )
}
