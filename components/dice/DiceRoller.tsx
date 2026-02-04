'use client'

/**
 * DiceRoller Component
 *
 * Main dice roller UI with all standard dice types and custom notation input.
 * Features quick dice buttons and a custom notation field for complex rolls.
 *
 * @see Task 04 specification in .claude/tasks/iteration-5/task-04-dice-roller-component.md
 */

import { useState, useCallback, useId } from 'react'
import { DiceButtonRow } from './DiceButton'
import { rollDice } from '@/lib/dice/roller'
import {
  parseDiceNotation,
  isValidDiceNotation,
  calculateResult,
  formatDiceResult,
  type DiceResult,
} from '@/lib/dice/calculator'

export interface DiceRollerProps {
  /** Callback when any dice are rolled */
  onRoll?: (result: DiceResult) => void
  /** Whether to show roll history (handled by parent) */
  showHistory?: boolean
  /** Compact mode for smaller displays */
  compact?: boolean
}

/**
 * DiceRoller - Main dice rolling interface
 *
 * Features:
 * - Quick access buttons for all standard dice (d4-d20)
 * - Custom notation input (e.g., "2d6+3")
 * - Displays current result prominently
 * - Shows roll breakdown (individual dice + modifier)
 * - Western theme styling
 *
 * @example
 * ```tsx
 * <DiceRoller
 *   onRoll={(result) => addToHistory(result)}
 *   showHistory={true}
 * />
 * ```
 */
export function DiceRoller({
  onRoll,
  compact = false,
}: DiceRollerProps) {
  const [customNotation, setCustomNotation] = useState('')
  const [lastResult, setLastResult] = useState<DiceResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isRolling, setIsRolling] = useState(false)

  const inputId = useId()

  // Handle quick roll from dice buttons
  const handleQuickRoll = useCallback((rollValue: number, sides: number) => {
    const parsed = parseDiceNotation(`1d${sides}`)
    const result = calculateResult(parsed, [rollValue])

    setLastResult(result)
    setError(null)
    onRoll?.(result)
  }, [onRoll])

  // Handle custom notation roll
  const handleCustomRoll = useCallback(() => {
    if (!customNotation.trim()) {
      setError('Enter a dice notation (e.g., 2d6+3)')
      return
    }

    if (!isValidDiceNotation(customNotation)) {
      setError('Invalid notation. Use format: XdY or XdY+Z')
      return
    }

    setIsRolling(true)
    setError(null)

    // Small delay for animation feel
    setTimeout(() => {
      try {
        const parsed = parseDiceNotation(customNotation)
        const diceRoll = rollDice(parsed.count, parsed.sides)
        const result = calculateResult(parsed, diceRoll.rolls)

        setLastResult(result)
        onRoll?.(result)
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Roll failed')
      } finally {
        setIsRolling(false)
      }
    }, 100)
  }, [customNotation, onRoll])

  // Handle Enter key in input
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCustomRoll()
    }
  }

  return (
    <div className={`bg-stone-800/80 border border-stone-600/40 rounded-xl ${compact ? 'p-3' : 'p-4'}`}>
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xl">🎲</span>
        <h2 className={`font-bold text-amber-200 ${compact ? 'text-base' : 'text-lg'}`}>
          Dice Roller
        </h2>
      </div>

      {/* Quick Dice Buttons */}
      <div className="mb-4">
        <DiceButtonRow
          onRoll={handleQuickRoll}
          size={compact ? 'sm' : 'md'}
        />
      </div>

      {/* Custom Notation Input */}
      <div className="mb-4">
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-stone-300 mb-1"
        >
          Custom Roll
        </label>
        <div className="flex gap-2">
          <input
            id={inputId}
            type="text"
            value={customNotation}
            onChange={(e) => setCustomNotation(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="e.g., 2d6+3"
            className={`
              flex-1 px-3 py-2 rounded-lg
              bg-stone-700 border border-stone-600/50
              text-amber-100 placeholder-stone-500
              focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50
              ${compact ? 'text-sm' : 'text-base'}
            `}
            aria-describedby={error ? `${inputId}-error` : undefined}
          />
          <button
            onClick={handleCustomRoll}
            disabled={isRolling}
            className={`
              px-4 py-2 rounded-lg font-semibold
              bg-gradient-to-r from-purple-600 to-violet-600
              text-white
              hover:from-purple-500 hover:to-violet-500
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-all
              border border-purple-400/30
              ${compact ? 'text-sm' : 'text-base'}
            `}
          >
            {isRolling ? '...' : 'Roll'}
          </button>
        </div>
        {error && (
          <p
            id={`${inputId}-error`}
            className="mt-1 text-sm text-red-400"
            role="alert"
          >
            {error}
          </p>
        )}
      </div>

      {/* Result Display */}
      {lastResult && (
        <div className="bg-stone-900/60 border border-amber-600/30 rounded-lg p-4 text-center">
          <div className="text-sm text-stone-400 mb-1">Result</div>
          <div className="text-4xl font-black text-amber-200 mb-2">
            {lastResult.total}
          </div>
          <div className="text-sm text-stone-400">
            {formatRollBreakdown(lastResult)}
          </div>
        </div>
      )}

      {/* Empty state */}
      {!lastResult && (
        <div className="bg-stone-900/40 border border-stone-600/30 rounded-lg p-4 text-center">
          <div className="text-stone-500 text-sm">
            Click a die or enter a notation to roll
          </div>
        </div>
      )}
    </div>
  )
}

/**
 * Format roll breakdown for display
 */
function formatRollBreakdown(result: DiceResult): string {
  const rollsStr = result.rolls.join(' + ')

  if (result.modifier === 0) {
    return `${result.notation}: ${rollsStr} = ${result.total}`
  }

  const modStr = result.modifier > 0 ? `+ ${result.modifier}` : `- ${Math.abs(result.modifier)}`
  return `${result.notation}: (${rollsStr}) ${modStr} = ${result.total}`
}
