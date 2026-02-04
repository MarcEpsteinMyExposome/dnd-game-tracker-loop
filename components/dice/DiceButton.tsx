'use client'

/**
 * DiceButton Component
 *
 * Reusable button for rolling a specific die type.
 * Shows the die type, handles click to roll, and displays the result briefly.
 * Styled to match Bang Your Dead v3 Western theme with magic accents.
 *
 * @see Task 03 specification in .claude/tasks/iteration-5/task-03-dice-button-component.md
 */

import { useState, useCallback } from 'react'
import { rollDie, isStandardDie, type StandardDie } from '@/lib/dice/roller'

export interface DiceButtonProps {
  /** Number of sides on the die */
  sides: number
  /** Callback when die is rolled */
  onRoll?: (result: number, sides: number) => void
  /** Whether the button is disabled */
  disabled?: boolean
  /** Button size variant */
  size?: 'sm' | 'md' | 'lg'
  /** Show the die result on the button after rolling */
  showResult?: boolean
}

/**
 * Get die icon/emoji based on sides
 */
function getDieIcon(sides: number): string {
  switch (sides) {
    case 4:
      return '▲' // Triangle for d4
    case 6:
      return '⬡' // Hexagon approximation for d6
    case 8:
      return '◆' // Diamond for d8
    case 10:
      return '⬠' // Pentagon for d10
    case 12:
      return '⬢' // Hexagon for d12
    case 20:
      return '⬟' // Icosahedron approximation
    case 100:
      return '%' // Percentile
    default:
      return '?' // Unknown die
  }
}

/**
 * DiceButton - Interactive die button with roll animation
 *
 * Features:
 * - Click to roll the die
 * - Visual feedback with animation on roll
 * - Displays result briefly after rolling
 * - Accessible with ARIA labels
 * - Western theme with purple magic glow
 *
 * @example
 * ```tsx
 * <DiceButton
 *   sides={20}
 *   onRoll={(result) => console.log(`Rolled: ${result}`)}
 *   size="md"
 * />
 * ```
 */
export function DiceButton({
  sides,
  onRoll,
  disabled = false,
  size = 'md',
  showResult = true,
}: DiceButtonProps) {
  const [isRolling, setIsRolling] = useState(false)
  const [lastResult, setLastResult] = useState<number | null>(null)

  // Size classes
  const sizeClasses = {
    sm: 'w-12 h-12 text-sm',
    md: 'w-16 h-16 text-base',
    lg: 'w-20 h-20 text-lg',
  }

  const handleRoll = useCallback(() => {
    if (disabled || isRolling) return

    setIsRolling(true)

    // Short delay for animation feel
    setTimeout(() => {
      const result = rollDie(sides)
      setLastResult(result)
      setIsRolling(false)
      onRoll?.(result, sides)

      // Clear result after display time
      if (showResult) {
        setTimeout(() => {
          setLastResult(null)
        }, 2000)
      }
    }, 150)
  }, [sides, onRoll, disabled, isRolling, showResult])

  // Determine display content
  const displayContent = isRolling
    ? '...'
    : lastResult !== null && showResult
      ? lastResult
      : `d${sides}`

  // Check if showing result or label
  const isShowingResult = lastResult !== null && showResult && !isRolling

  return (
    <button
      onClick={handleRoll}
      disabled={disabled || isRolling}
      className={`
        ${sizeClasses[size]}
        relative
        flex flex-col items-center justify-center
        rounded-lg
        font-bold
        transition-all duration-200
        border-2
        ${
          disabled
            ? 'bg-stone-700 border-stone-600 text-stone-500 cursor-not-allowed'
            : isRolling
              ? 'bg-purple-800 border-purple-500 text-purple-200 animate-pulse'
              : isShowingResult
                ? 'bg-amber-700 border-amber-400 text-amber-100 shadow-lg shadow-amber-500/30'
                : 'bg-gradient-to-br from-stone-700 to-stone-800 border-amber-600/50 text-amber-200 hover:border-purple-400 hover:shadow-lg hover:shadow-purple-500/30 hover:scale-105 active:scale-95'
        }
      `}
      aria-label={`Roll d${sides}`}
      title={`Roll d${sides}`}
    >
      {/* Die icon (subtle, at top) */}
      <span className="text-xs opacity-60 absolute top-1">
        {getDieIcon(sides)}
      </span>

      {/* Main content */}
      <span className={`${isShowingResult ? 'text-xl font-black' : ''}`}>
        {displayContent}
      </span>

      {/* Rolling indicator */}
      {isRolling && (
        <span className="absolute inset-0 rounded-lg border-2 border-purple-400 animate-ping opacity-50" />
      )}
    </button>
  )
}

/**
 * DiceButtonRow - Convenience component for showing all standard dice
 *
 * @example
 * ```tsx
 * <DiceButtonRow onRoll={(result, sides) => console.log(`d${sides}: ${result}`)} />
 * ```
 */
export interface DiceButtonRowProps {
  onRoll?: (result: number, sides: number) => void
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
}

export function DiceButtonRow({
  onRoll,
  size = 'md',
  disabled = false,
}: DiceButtonRowProps) {
  const standardDice: StandardDie[] = [4, 6, 8, 10, 12, 20]

  return (
    <div className="flex flex-wrap gap-2 justify-center" role="group" aria-label="Dice roller buttons">
      {standardDice.map((sides) => (
        <DiceButton
          key={sides}
          sides={sides}
          onRoll={onRoll}
          size={size}
          disabled={disabled}
        />
      ))}
    </div>
  )
}
