'use client'

/**
 * Character Card Component
 *
 * Displays character information in a card format.
 * Shows name, class, level, HP bar, AC, and action buttons.
 */

import { useState } from 'react'
import { Character, Condition } from '@/lib/schemas'
import { getAvatarSource } from '@/lib/utils/avatar'
import { useGameStore } from '@/lib/store/gameStore'
import { ConditionBadge } from '../conditions/ConditionBadge'

interface CharacterCardProps {
  character: Character
  onEdit: (character: Character) => void
  onDelete: (character: Character) => void
  onManageConditions: (character: Character) => void
}

export function CharacterCard({
  character,
  onEdit,
  onDelete,
  onManageConditions,
}: CharacterCardProps) {
  const updateCharacterHp = useGameStore((state) => state.updateCharacterHp)
  const [directHpInput, setDirectHpInput] = useState(character.currentHp.toString())
  const hpPercentage = (character.currentHp / character.maxHp) * 100

  // Determine HP bar color based on percentage
  let hpColor = 'bg-green-500'
  if (hpPercentage <= 25) {
    hpColor = 'bg-red-500'
  } else if (hpPercentage <= 50) {
    hpColor = 'bg-yellow-500'
  }

  const isUnconscious = character.currentHp === 0
  const [hpFlash, setHpFlash] = useState(false)

  // Adjust HP by amount
  const adjustHp = (amount: number) => {
    const newHp = character.currentHp + amount
    updateCharacterHp(character.id, newHp)
    setDirectHpInput(Math.max(0, Math.min(character.maxHp, newHp)).toString())

    // Flash animation
    setHpFlash(true)
    setTimeout(() => setHpFlash(false), 300)
  }

  // Handle direct HP input
  const handleDirectHpChange = (value: string) => {
    setDirectHpInput(value)
  }

  const handleDirectHpBlur = () => {
    const numValue = parseInt(directHpInput)
    if (!isNaN(numValue)) {
      updateCharacterHp(character.id, numValue)
    } else {
      // Reset to current HP if invalid
      setDirectHpInput(character.currentHp.toString())
    }
  }

  const handleDirectHpKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.currentTarget.blur()
    }
  }

  // Get avatar source (custom image, generated avatar, or fallback)
  const avatarSrc = getAvatarSource(
    character.imageUrl,
    character.avatarSeed || character.name, // Use name as fallback seed
    character.name
  )

  return (
    <div className="bg-white border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
      {/* Avatar */}
      <div className="w-20 h-20 rounded-full mx-auto mb-3 overflow-hidden border-2 border-gray-200">
        <img
          src={avatarSrc}
          alt={`${character.name}'s avatar`}
          className="w-full h-full object-cover"
          onError={(e) => {
            // Fallback to initial if image fails to load
            e.currentTarget.style.display = 'none'
            e.currentTarget.parentElement!.innerHTML = `<div class="w-full h-full bg-gray-200 flex items-center justify-center text-2xl font-bold text-gray-500">${character.name.charAt(0).toUpperCase()}</div>`
          }}
        />
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
            className={`h-full ${hpColor} transition-all duration-300 ${hpFlash ? 'opacity-70' : 'opacity-100'}`}
            style={{ width: `${Math.max(0, Math.min(100, hpPercentage))}%` }}
          />
        </div>
        {isUnconscious && (
          <p className="text-red-600 text-xs font-semibold mt-1 text-center">
            UNCONSCIOUS
          </p>
        )}
      </div>

      {/* HP Adjustment Controls */}
      <div className="mb-3 space-y-2">
        {/* Quick adjustment buttons */}
        <div className="grid grid-cols-4 gap-1">
          <button
            onClick={() => adjustHp(-5)}
            className="bg-red-100 text-red-700 px-2 py-1 rounded text-sm font-semibold hover:bg-red-200 transition-colors"
            title="Decrease HP by 5"
          >
            -5
          </button>
          <button
            onClick={() => adjustHp(-1)}
            className="bg-red-50 text-red-600 px-2 py-1 rounded text-sm font-semibold hover:bg-red-100 transition-colors"
            title="Decrease HP by 1"
          >
            -1
          </button>
          <button
            onClick={() => adjustHp(1)}
            className="bg-green-50 text-green-600 px-2 py-1 rounded text-sm font-semibold hover:bg-green-100 transition-colors"
            title="Increase HP by 1"
          >
            +1
          </button>
          <button
            onClick={() => adjustHp(5)}
            className="bg-green-100 text-green-700 px-2 py-1 rounded text-sm font-semibold hover:bg-green-200 transition-colors"
            title="Increase HP by 5"
          >
            +5
          </button>
        </div>

        {/* Direct HP input */}
        <div className="flex items-center gap-2">
          <label htmlFor={`hp-${character.id}`} className="text-xs text-gray-600">
            Set HP:
          </label>
          <input
            id={`hp-${character.id}`}
            type="number"
            min="0"
            max={character.maxHp}
            value={directHpInput}
            onChange={(e) => handleDirectHpChange(e.target.value)}
            onBlur={handleDirectHpBlur}
            onKeyDown={handleDirectHpKeyDown}
            className="flex-1 px-2 py-1 border rounded text-sm text-center"
          />
        </div>
      </div>

      {/* Armor Class & DEX Modifier */}
      <div className="flex justify-center gap-2 mb-3">
        <span className="inline-block bg-gray-100 px-3 py-1 rounded-md text-sm">
          <span className="font-semibold">AC:</span> {character.armorClass}
        </span>
        <span className="inline-block bg-purple-100 px-3 py-1 rounded-md text-sm">
          <span className="font-semibold">DEX:</span> {character.dexModifier >= 0 ? '+' : ''}{character.dexModifier}
        </span>
      </div>

      {/* Conditions */}
      <div className="mb-3">
        {character.conditions.length > 0 ? (
          <div className="flex flex-wrap gap-1 justify-center mb-2">
            {character.conditions.map((condition) => (
              <ConditionBadge key={condition} condition={condition as Condition} size="sm" />
            ))}
          </div>
        ) : (
          <p className="text-xs text-gray-400 text-center mb-2">No active conditions</p>
        )}
        <button
          onClick={() => onManageConditions(character)}
          className="w-full bg-purple-100 text-purple-700 px-3 py-1.5 rounded-md text-xs font-medium hover:bg-purple-200 transition-colors"
        >
          Manage Conditions
        </button>
      </div>

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
