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
 * - Active turn indicator (magic purple glow)
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
  let hpColor = 'bg-emerald-500'
  if (hpPercentage <= 25) {
    hpColor = 'bg-red-500'
  } else if (hpPercentage <= 50) {
    hpColor = 'bg-amber-500'
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

  // Border style for active turn - magic purple glow
  const borderClass = combatant.isActive
    ? 'border-4 border-purple-400 shadow-lg shadow-purple-500/50'
    : 'border border-stone-600/40'

  // Background style for player vs enemy
  const bgClass = combatant.isPlayer
    ? 'bg-sky-900/30'
    : 'bg-red-900/30'

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
          <span className="inline-block bg-gradient-to-r from-purple-500 to-violet-500 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide shadow-md">
            ✨ Your Draw
          </span>
        </div>
      )}

      <div className="flex gap-3">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <div className={`w-16 h-16 rounded-full overflow-hidden border-2 ${
            combatant.isPlayer ? 'border-sky-500/60' : 'border-red-500/60'
          }`}>
            <img
              src={avatarSrc}
              alt={`${combatant.name}'s avatar`}
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback to initial if image fails to load
                e.currentTarget.style.display = 'none'
                e.currentTarget.parentElement!.innerHTML = `<div class="w-full h-full bg-stone-700 flex items-center justify-center text-xl font-bold text-amber-200">${combatant.name.charAt(0).toUpperCase()}</div>`
              }}
            />
          </div>

          {/* Initiative Badge */}
          {showInitiative && (
            <div className="text-center mt-1">
              <span
                className="inline-block bg-amber-700 text-amber-100 px-2 py-0.5 rounded text-xs font-bold border border-amber-500/40"
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
            <h3 className="text-base font-bold truncate text-amber-100">{combatant.name}</h3>
            <div className="flex items-center gap-2 text-xs">
              <span
                className={`inline-block px-2 py-0.5 rounded ${
                  combatant.isPlayer
                    ? 'bg-sky-800/60 text-sky-200 border border-sky-600/40'
                    : 'bg-red-800/60 text-red-200 border border-red-600/40'
                }`}
              >
                {combatant.isPlayer ? '🤠 Deputy' : '🦂 Outlaw'}
              </span>
              <span className="text-stone-400" title="Armor Class">
                AC: {combatant.armorClass}
              </span>
            </div>
          </div>

          {/* HP Bar */}
          <div className="mb-2">
            <div className="flex justify-between text-xs mb-1">
              <span className="font-semibold text-amber-200">HP</span>
              <span className="text-stone-300">
                {combatant.currentHp}/{combatant.maxHp}
              </span>
            </div>
            <div className="w-full bg-stone-700 rounded-full h-3 overflow-hidden">
              <div
                className={`h-full ${hpColor} transition-all duration-300 ${
                  hpFlash ? 'opacity-70' : 'opacity-100'
                }`}
                style={{ width: `${Math.max(0, Math.min(100, hpPercentage))}%` }}
              />
            </div>
            {isDefeated && (
              <p className="text-red-400 text-xs font-bold mt-1 text-center">
                💀 DOWN & OUT
              </p>
            )}
          </div>

          {/* HP Adjustment Controls */}
          <div className="grid grid-cols-4 gap-1 mb-2">
            <button
              onClick={() => adjustHp(-5)}
              className="bg-red-800/60 text-red-200 px-2 py-1 rounded text-xs font-semibold hover:bg-red-700/60 transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-red-600/30"
              title="Decrease HP by 5"
              disabled={isDefeated}
            >
              -5
            </button>
            <button
              onClick={() => adjustHp(-1)}
              className="bg-red-900/40 text-red-300 px-2 py-1 rounded text-xs font-semibold hover:bg-red-800/40 transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-red-700/30"
              title="Decrease HP by 1"
              disabled={isDefeated}
            >
              -1
            </button>
            <button
              onClick={() => adjustHp(1)}
              className="bg-emerald-900/40 text-emerald-300 px-2 py-1 rounded text-xs font-semibold hover:bg-emerald-800/40 transition-colors border border-emerald-700/30"
              title="Increase HP by 1"
            >
              +1
            </button>
            <button
              onClick={() => adjustHp(5)}
              className="bg-emerald-800/60 text-emerald-200 px-2 py-1 rounded text-xs font-semibold hover:bg-emerald-700/60 transition-colors border border-emerald-600/30"
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
              className="w-full bg-stone-700/60 text-stone-300 px-2 py-1 rounded text-xs font-medium hover:bg-stone-600/60 transition-colors border border-stone-600/30"
              title="Remove from combat"
            >
              Remove
            </button>
          )}
        </div>
      </div>

      {/* Notes (if present) */}
      {combatant.notes && (
        <div className="mt-2 pt-2 border-t border-stone-600/30">
          <p className="text-xs text-stone-400 italic">{combatant.notes}</p>
        </div>
      )}
    </div>
  )
}
