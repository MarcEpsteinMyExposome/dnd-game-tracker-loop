'use client'

/**
 * Monster Card Component
 *
 * Displays monster information in a card format optimized for quick reference.
 * Shows name, type, AC, HP, damage, special abilities, and "Add to Combat" button.
 * Uses red/orange theme to visually distinguish from character cards (which use blue/green).
 *
 * @see components/characters/CharacterCard.tsx - Character card for comparison
 * @see lib/schemas/monster.schema.ts - Monster schema
 */

import { Monster } from '@/lib/schemas/monster.schema'
import { getAvatarSource } from '@/lib/utils/avatar'

interface MonsterCardProps {
  /**
   * Monster data to display
   */
  monster: Monster

  /**
   * Callback when "Add to Combat" button is clicked
   * @param monster - The monster to add to combat
   */
  onAddToCombat?: (monster: Monster) => void

  /**
   * Optional CSS classes for custom styling
   */
  className?: string
}

/**
 * MonsterCard displays a single monster's stat block in a card format
 *
 * Features:
 * - Red/orange gradient theme (distinct from character cards)
 * - Monster type badge (Beast, Undead, Chaos, etc.)
 * - AC and HP displayed prominently
 * - Damage output and challenge rating
 * - Special abilities with tooltips
 * - "Add to Combat" button integration
 * - Avatar display with DiceBear fallback
 * - Responsive design
 *
 * @example
 * ```tsx
 * <MonsterCard
 *   monster={goblinScout}
 *   onAddToCombat={(monster) => addMonsterToCombat(monster)}
 * />
 * ```
 */
export function MonsterCard({ monster, onAddToCombat, className = '' }: MonsterCardProps) {
  // Get avatar source (custom image, generated avatar, or fallback)
  const avatarSrc = getAvatarSource(
    monster.imageUrl,
    monster.avatarSeed || monster.name,
    monster.name
  )

  // Map challenge rating to display text
  const getChallengeText = (cr: number): string => {
    if (cr < 1) {
      // Convert decimal to fraction (0.25 → 1/4, 0.5 → 1/2)
      if (cr === 0.25) return 'CR 1/4'
      if (cr === 0.5) return 'CR 1/2'
      return `CR ${cr}`
    }
    return `CR ${cr}`
  }

  // Get type color for badge
  const getTypeColor = (type: string): string => {
    const colors: Record<string, string> = {
      Humanoid: 'bg-amber-100 text-amber-800 border-amber-300',
      Beast: 'bg-green-100 text-green-800 border-green-300',
      Undead: 'bg-purple-100 text-purple-800 border-purple-300',
      Chaos: 'bg-red-100 text-red-800 border-red-300',
      Xenos: 'bg-teal-100 text-teal-800 border-teal-300',
      Daemon: 'bg-pink-100 text-pink-800 border-pink-300',
      Dragon: 'bg-orange-100 text-orange-800 border-orange-300',
      Giant: 'bg-stone-100 text-stone-800 border-stone-300',
      Fiend: 'bg-rose-100 text-rose-800 border-rose-300',
      Aberration: 'bg-indigo-100 text-indigo-800 border-indigo-300',
      Elemental: 'bg-sky-100 text-sky-800 border-sky-300',
      Construct: 'bg-slate-100 text-slate-800 border-slate-300',
      Other: 'bg-gray-100 text-gray-800 border-gray-300',
    }
    return colors[type] || colors.Other
  }

  return (
    <div
      className={`bg-gradient-to-br from-red-50 to-orange-50 border-2 border-red-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-all hover:scale-105 ${className}`}
    >
      {/* Avatar */}
      <div className="w-20 h-20 rounded-full mx-auto mb-3 overflow-hidden border-2 border-red-300 shadow-md">
        <img
          src={avatarSrc}
          alt={`${monster.name}'s avatar`}
          className="w-full h-full object-cover"
          onError={(e) => {
            // Fallback to initial if image fails to load
            e.currentTarget.style.display = 'none'
            e.currentTarget.parentElement!.innerHTML = `<div class="w-full h-full bg-red-100 flex items-center justify-center text-2xl font-bold text-red-600">${monster.name.charAt(0).toUpperCase()}</div>`
          }}
        />
      </div>

      {/* Monster Name */}
      <div className="text-center mb-2">
        <h3 className="text-lg font-bold text-gray-800">{monster.name}</h3>
      </div>

      {/* Type Badge */}
      <div className="flex justify-center mb-3">
        <span
          className={`inline-block px-3 py-1 text-xs font-semibold rounded-full border ${getTypeColor(monster.type)}`}
        >
          {monster.type}
        </span>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
        {/* AC */}
        <div className="bg-white rounded-md p-2 border border-red-200 text-center">
          <div className="text-xs text-gray-500 font-medium">AC</div>
          <div className="text-lg font-bold text-red-600">{monster.armorClass}</div>
        </div>

        {/* HP */}
        <div className="bg-white rounded-md p-2 border border-red-200 text-center">
          <div className="text-xs text-gray-500 font-medium">HP</div>
          <div className="text-lg font-bold text-red-600">{monster.hitPoints}</div>
        </div>

        {/* Damage */}
        <div className="bg-white rounded-md p-2 border border-red-200 text-center">
          <div className="text-xs text-gray-500 font-medium">Damage</div>
          <div className="text-sm font-bold text-orange-600">{monster.damage}</div>
        </div>

        {/* Challenge Rating */}
        <div className="bg-white rounded-md p-2 border border-red-200 text-center">
          <div className="text-xs text-gray-500 font-medium">Challenge</div>
          <div className="text-sm font-bold text-orange-600">{getChallengeText(monster.challenge)}</div>
        </div>
      </div>

      {/* Size & Speed */}
      <div className="flex justify-center gap-2 mb-3 text-xs text-gray-600">
        <span className="bg-white px-2 py-1 rounded border border-gray-200">
          <strong>Size:</strong> {monster.size}
        </span>
        <span className="bg-white px-2 py-1 rounded border border-gray-200">
          <strong>Speed:</strong> {monster.speed} ft
        </span>
      </div>

      {/* Special Abilities */}
      {monster.abilities.length > 0 && (
        <div className="mb-3">
          <div className="text-xs font-semibold text-gray-700 mb-1">Special Abilities:</div>
          <div className="space-y-1">
            {monster.abilities.map((ability, index) => (
              <div
                key={index}
                className="bg-white rounded-md p-2 border border-orange-200 text-xs"
                title={ability.description}
              >
                <div className="font-semibold text-orange-700 flex items-center justify-between">
                  <span>{ability.name}</span>
                  {ability.usage && (
                    <span className="text-xs text-gray-500 italic">({ability.usage})</span>
                  )}
                </div>
                <div className="text-gray-600 mt-1 line-clamp-2">{ability.description}</div>
                {ability.damage && (
                  <div className="text-orange-600 font-mono mt-1">Damage: {ability.damage}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Description (if available) */}
      {monster.description && (
        <div className="mb-3">
          <p className="text-xs text-gray-600 italic line-clamp-2" title={monster.description}>
            {monster.description}
          </p>
        </div>
      )}

      {/* Add to Combat Button */}
      {onAddToCombat && (
        <button
          onClick={() => onAddToCombat(monster)}
          className="w-full bg-gradient-to-r from-red-500 to-orange-500 text-white font-semibold py-2 px-4 rounded-md hover:from-red-600 hover:to-orange-600 transition-colors shadow-sm hover:shadow-md"
          aria-label={`Add ${monster.name} to combat`}
        >
          ⚔️ Add to Combat
        </button>
      )}
    </div>
  )
}
