'use client'

/**
 * InitiativeRoller Component
 *
 * UI for rolling and managing initiative in combat.
 * Integrates with the combat slice for state management.
 *
 * @see Task 07 specification in .claude/tasks/iteration-5/task-07-initiative-roller-component.md
 */

import { useState, useCallback } from 'react'
import { useGameStore } from '@/lib/store/gameStore'

export interface InitiativeRollerProps {
  /** Callback when all initiatives are rolled */
  onRollAll?: () => void
  /** Whether rolling is currently in progress */
  isRolling?: boolean
}

/**
 * InitiativeRoller - Roll all initiative button for combat header
 *
 * Features:
 * - "Roll All Initiative" button
 * - Visual feedback during rolling
 * - Western theme styling
 *
 * @example
 * ```tsx
 * <InitiativeRoller onRollAll={() => console.log('Rolled!')} />
 * ```
 */
export function InitiativeRoller({ onRollAll }: InitiativeRollerProps) {
  const [isRolling, setIsRolling] = useState(false)
  const rollAllInitiatives = useGameStore((state) => state.rollAllInitiatives)
  const combatants = useGameStore((state) => state.combatants)

  const handleRollAll = useCallback(() => {
    if (combatants.length === 0) return

    setIsRolling(true)

    // Small delay for animation feel
    setTimeout(() => {
      rollAllInitiatives()
      setIsRolling(false)
      onRollAll?.()
    }, 300)
  }, [rollAllInitiatives, combatants.length, onRollAll])

  const isDisabled = isRolling || combatants.length === 0

  return (
    <button
      onClick={handleRollAll}
      disabled={isDisabled}
      className={`
        px-4 py-2 rounded-lg font-semibold
        transition-all duration-200
        border
        ${
          isDisabled
            ? 'bg-stone-700 border-stone-600 text-stone-500 cursor-not-allowed'
            : isRolling
              ? 'bg-purple-700 border-purple-500 text-purple-200 animate-pulse'
              : 'bg-gradient-to-r from-amber-600 to-orange-600 border-amber-500/30 text-white hover:from-amber-500 hover:to-orange-500 shadow-md'
        }
      `}
      title={combatants.length === 0 ? 'Add combatants first' : 'Roll initiative for all combatants'}
    >
      {isRolling ? '🎲 Rolling...' : '🎲 Roll Initiative'}
    </button>
  )
}

export interface InitiativeDisplayProps {
  /** Combatant ID */
  combatantId: string
  /** Current initiative value */
  initiative: number
  /** DEX modifier for display */
  dexModifier: number
  /** Callback when re-roll is requested */
  onReroll?: () => void
  /** Callback when manual value is set */
  onManualSet?: (value: number) => void
  /** Compact display mode */
  compact?: boolean
}

/**
 * InitiativeDisplay - Shows initiative with re-roll and edit options
 *
 * Features:
 * - Displays current initiative value
 * - Shows DEX modifier breakdown
 * - Re-roll button
 * - Click to edit manually
 *
 * @example
 * ```tsx
 * <InitiativeDisplay
 *   combatantId="123"
 *   initiative={15}
 *   dexModifier={3}
 *   onReroll={() => rollInitiative('123')}
 *   onManualSet={(value) => setManualInitiative('123', value)}
 * />
 * ```
 */
export function InitiativeDisplay({
  combatantId,
  initiative,
  dexModifier,
  onReroll,
  onManualSet,
  compact = false,
}: InitiativeDisplayProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(String(initiative))
  const [isRolling, setIsRolling] = useState(false)

  const handleReroll = useCallback(() => {
    setIsRolling(true)
    setTimeout(() => {
      onReroll?.()
      setIsRolling(false)
    }, 150)
  }, [onReroll])

  const handleEditStart = () => {
    setEditValue(String(initiative))
    setIsEditing(true)
  }

  const handleEditSubmit = () => {
    const value = parseInt(editValue, 10)
    if (!isNaN(value) && value >= -10 && value <= 50) {
      onManualSet?.(value)
    }
    setIsEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleEditSubmit()
    } else if (e.key === 'Escape') {
      setIsEditing(false)
    }
  }

  if (isEditing) {
    return (
      <div className="flex items-center gap-1">
        <input
          type="number"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={handleEditSubmit}
          onKeyDown={handleKeyDown}
          min={-10}
          max={50}
          autoFocus
          className={`
            w-14 px-2 py-1 rounded text-center
            bg-stone-700 border border-purple-500
            text-amber-100 font-bold
            focus:outline-none focus:ring-1 focus:ring-purple-400
            ${compact ? 'text-xs' : 'text-sm'}
          `}
          aria-label="Edit initiative value"
        />
      </div>
    )
  }

  return (
    <div className="flex items-center gap-1">
      {/* Initiative Badge - Click to edit */}
      <button
        onClick={handleEditStart}
        className={`
          inline-flex items-center justify-center
          bg-amber-700 text-amber-100 rounded font-bold
          border border-amber-500/40
          hover:bg-amber-600 transition-colors
          ${compact ? 'px-2 py-0.5 text-xs min-w-[2rem]' : 'px-3 py-1 text-sm min-w-[2.5rem]'}
          ${isRolling ? 'animate-bounce' : ''}
        `}
        title={`Initiative: ${initiative} (DEX ${dexModifier >= 0 ? '+' : ''}${dexModifier}). Click to edit.`}
      >
        {initiative}
      </button>

      {/* Re-roll Button */}
      {onReroll && (
        <button
          onClick={handleReroll}
          disabled={isRolling}
          className={`
            text-stone-400 hover:text-purple-400
            transition-colors
            disabled:opacity-50
            ${compact ? 'text-xs' : 'text-sm'}
          `}
          title="Re-roll initiative"
          aria-label="Re-roll initiative"
        >
          🎲
        </button>
      )}
    </div>
  )
}
