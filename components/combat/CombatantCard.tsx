'use client'

/**
 * Combatant Card Component
 *
 * Displays a combatant in the combat tracker.
 * Shows initiative order, HP tracking, active turn indicator, and conditions.
 * Optimized for quick combat reference with streamlined controls.
 *
 * @see CharacterCard for comparison with roster management card
 */

import { useState } from 'react'
import { Combatant } from '@/lib/schemas/combatant.schema'
import { getAvatarSource } from '@/lib/utils/avatar'
import { useGameStore } from '@/lib/store/gameStore'
import { ConditionBadge } from '../conditions/ConditionBadge'

interface CombatantCardProps {
  combatant: Combatant
  onRemove?: (combatant: Combatant) => void
  showInitiative?: boolean
}

/**
 * CombatantCard - Display combatant in combat tracker
 *
 * Features:
 * - Initiative display for turn order
 * - Active turn indicator (gold border + glow)
 * - HP bar with color coding (green/yellow/red)
 * - Quick HP adjustment buttons
 * - Condition badges with tooltips
 * - Player vs Enemy visual distinction
 * - Defeated/Unconscious state indicator
 *
 * @param combatant - Combatant data to display
 * @param onRemove - Optional callback when removing from combat
 * @param showInitiative - Whether to display initiative badge (default: true)
 *
 * @example
 * ```tsx
 * <CombatantCard
 *   combatant={combatant}
 *   onRemove={(c) => removeCombatant(c.id)}
 *   showInitiative={true}
 * />
 * ```
 */
export function CombatantCard({
  combatant,
  onRemove,
  showInitiative = true,
}: CombatantCardProps) {
  const updateCombatantHp = useGameStore((state) => state.updateCombatantHp)
  const [hpFlash, setHpFlash] = useState(false)

  const hpPercentage = (combatant.currentHp / combatant.maxHp) * 100

  // Determine HP bar color based on percentage
  let hpColor = 'bg-green-500'
  if (hpPercentage <= 25) {
    hpColor = 'bg-red-500'
  } else if (hpPercentage <= 50) {
    hpColor = 'bg-yellow-500'
  }

  const isDefeated = combatant.currentHp === 0

  // Adjust HP by amount
  const adjustHp = (amount: number) => {
    const newHp = combatant.currentHp + amount
    updateCombatantHp(combatant.id, newHp)

    // Flash animation
    setHpFlash(true)
    setTimeout(() => setHpFlash(false), 300)
  }

  // Get avatar source (custom image, generated avatar, or fallback)
  const avatarSrc = getAvatarSource(
    combatant.imageUrl,
    combatant.avatarSeed || combatant.name,
    combatant.name
  )

  // Border style for active turn
  const borderClass = combatant.isActive
    ? 'border-4 border-yellow-400 shadow-lg shadow-yellow-400/50'
    : 'border border-gray-200'

  // Background style for player vs enemy
  const bgClass = combatant.isPlayer ? 'bg-blue-50/50' : 'bg-red-50/50'

  return (
    <div
      className={`${bgClass} ${borderClass} rounded-lg p-3 transition-all duration-300 ${
        isDefeated ? 'opacity-60' : ''
      }`}
      role="article"
      aria-label={`${combatant.name} combatant card`}
    >
      {/* Active Turn Indicator */}
      {combatant.isActive && (
        <div className="text-center mb-2">
          <span className="inline-block bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
            ⚔️ Active Turn
          </span>
        </div>
      )}

      <div className="flex gap-3">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-300">
            <img
              src={avatarSrc}
              alt={`${combatant.name}'s avatar`}
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback to initial if image fails to load
                e.currentTarget.style.display = 'none'
                e.currentTarget.parentElement!.innerHTML = `<div class="w-full h-full bg-gray-300 flex items-center justify-center text-xl font-bold text-gray-600">${combatant.name.charAt(0).toUpperCase()}</div>`
              }}
            />
          </div>

          {/* Initiative Badge */}
          {showInitiative && (
            <div className="text-center mt-1">
              <span
                className="inline-block bg-purple-600 text-white px-2 py-0.5 rounded text-xs font-bold"
                title="Initiative"
              >
                {combatant.initiative}
              </span>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Name and Type */}
          <div className="mb-2">
            <h3 className="text-base font-bold truncate">{combatant.name}</h3>
            <div className="flex items-center gap-2 text-xs">
              <span
                className={`inline-block px-2 py-0.5 rounded ${
                  combatant.isPlayer
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-red-100 text-red-700'
                }`}
              >
                {combatant.isPlayer ? '👤 Player' : '💀 Enemy'}
              </span>
              <span className="text-gray-600" title="Armor Class">
                AC: {combatant.armorClass}
              </span>
            </div>
          </div>

          {/* HP Bar */}
          <div className="mb-2">
            <div className="flex justify-between text-xs mb-1">
              <span className="font-semibold">HP</span>
              <span>
                {combatant.currentHp}/{combatant.maxHp}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className={`h-full ${hpColor} transition-all duration-300 ${
                  hpFlash ? 'opacity-70' : 'opacity-100'
                }`}
                style={{ width: `${Math.max(0, Math.min(100, hpPercentage))}%` }}
              />
            </div>
            {isDefeated && (
              <p className="text-red-600 text-xs font-bold mt-1 text-center">
                ⚠️ DEFEATED
              </p>
            )}
          </div>

          {/* HP Adjustment Controls */}
          <div className="grid grid-cols-4 gap-1 mb-2">
            <button
              onClick={() => adjustHp(-5)}
              className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-semibold hover:bg-red-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Decrease HP by 5"
              disabled={isDefeated}
            >
              -5
            </button>
            <button
              onClick={() => adjustHp(-1)}
              className="bg-red-50 text-red-600 px-2 py-1 rounded text-xs font-semibold hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Decrease HP by 1"
              disabled={isDefeated}
            >
              -1
            </button>
            <button
              onClick={() => adjustHp(1)}
              className="bg-green-50 text-green-600 px-2 py-1 rounded text-xs font-semibold hover:bg-green-100 transition-colors"
              title="Increase HP by 1"
            >
              +1
            </button>
            <button
              onClick={() => adjustHp(5)}
              className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-semibold hover:bg-green-200 transition-colors"
              title="Increase HP by 5"
            >
              +5
            </button>
          </div>

          {/* Conditions */}
          {combatant.conditions.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {combatant.conditions.map((condition) => (
                <ConditionBadge key={condition} condition={condition} size="sm" />
              ))}
            </div>
          )}

          {/* Remove Button */}
          {onRemove && (
            <button
              onClick={() => onRemove(combatant)}
              className="w-full bg-gray-200 text-gray-700 px-2 py-1 rounded text-xs font-medium hover:bg-gray-300 transition-colors"
              title="Remove from combat"
            >
              Remove
            </button>
          )}
        </div>
      </div>

      {/* Notes (if present) */}
      {combatant.notes && (
        <div className="mt-2 pt-2 border-t border-gray-300">
          <p className="text-xs text-gray-600 italic">{combatant.notes}</p>
        </div>
      )}
    </div>
  )
}
