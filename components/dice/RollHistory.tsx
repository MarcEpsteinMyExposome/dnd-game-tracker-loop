'use client'

/**
 * RollHistory Component
 *
 * Displays recent dice roll history with timestamps and clear functionality.
 * Designed to work alongside the DiceRoller component.
 *
 * @see Task 05 specification in .claude/tasks/iteration-5/task-05-roll-history-component.md
 */

import { type DiceResult } from '@/lib/dice/calculator'

/**
 * Entry in the roll history
 */
export interface RollHistoryEntry {
  /** Unique identifier for this entry */
  id: string
  /** Dice notation that was rolled */
  notation: string
  /** Individual roll values */
  rolls: number[]
  /** Final total (including modifier) */
  total: number
  /** Timestamp when the roll was made */
  timestamp: Date
}

export interface RollHistoryProps {
  /** Array of roll history entries */
  history: RollHistoryEntry[]
  /** Callback to clear all history */
  onClear?: () => void
  /** Maximum number of entries to display */
  maxEntries?: number
  /** Compact display mode */
  compact?: boolean
}

/**
 * Generate a unique ID for a roll entry
 */
export function generateRollId(): string {
  return `roll-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Create a RollHistoryEntry from a DiceResult
 */
export function createRollEntry(result: DiceResult): RollHistoryEntry {
  return {
    id: generateRollId(),
    notation: result.notation,
    rolls: result.rolls,
    total: result.total,
    timestamp: new Date(),
  }
}

/**
 * Format a timestamp for display
 */
function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
}

/**
 * RollHistory - Display recent dice rolls
 *
 * Features:
 * - Shows last N rolls with notation, dice, and total
 * - Timestamps for each roll
 * - Clear history button
 * - Empty state when no history
 * - Scrollable list for many entries
 *
 * @example
 * ```tsx
 * const [history, setHistory] = useState<RollHistoryEntry[]>([])
 *
 * <RollHistory
 *   history={history}
 *   onClear={() => setHistory([])}
 *   maxEntries={10}
 * />
 * ```
 */
export function RollHistory({
  history,
  onClear,
  maxEntries = 10,
  compact = false,
}: RollHistoryProps) {
  // Limit entries to maxEntries, showing most recent first
  const displayHistory = history.slice(-maxEntries).reverse()

  // Empty state
  if (displayHistory.length === 0) {
    return (
      <div className={`bg-stone-800/60 border border-stone-600/40 rounded-lg ${compact ? 'p-3' : 'p-4'}`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-lg">📜</span>
            <h3 className={`font-semibold text-amber-200 ${compact ? 'text-sm' : 'text-base'}`}>
              Roll History
            </h3>
          </div>
        </div>
        <div className="text-center py-4">
          <p className="text-stone-500 text-sm">No rolls yet</p>
          <p className="text-stone-600 text-xs mt-1">Roll some dice to see history</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-stone-800/60 border border-stone-600/40 rounded-lg ${compact ? 'p-3' : 'p-4'}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">📜</span>
          <h3 className={`font-semibold text-amber-200 ${compact ? 'text-sm' : 'text-base'}`}>
            Roll History
          </h3>
          <span className="text-xs text-stone-500">
            ({displayHistory.length}{maxEntries < history.length ? `/${history.length}` : ''})
          </span>
        </div>
        {onClear && (
          <button
            onClick={onClear}
            className="text-xs text-stone-400 hover:text-red-400 transition-colors px-2 py-1 rounded hover:bg-stone-700/50"
            title="Clear roll history"
          >
            Clear
          </button>
        )}
      </div>

      {/* History List */}
      <div className={`space-y-2 ${compact ? 'max-h-40' : 'max-h-60'} overflow-y-auto`}>
        {displayHistory.map((entry, index) => (
          <div
            key={entry.id}
            className={`
              flex items-center justify-between gap-2
              bg-stone-900/40 rounded px-3 py-2
              border border-stone-700/30
              ${index === 0 ? 'border-amber-600/30 bg-stone-900/60' : ''}
            `}
          >
            {/* Roll info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className={`font-semibold text-amber-200 ${compact ? 'text-xs' : 'text-sm'}`}>
                  {entry.notation}
                </span>
                <span className="text-stone-500">→</span>
                <span className={`text-stone-400 ${compact ? 'text-xs' : 'text-sm'}`}>
                  [{entry.rolls.join(', ')}]
                </span>
              </div>
            </div>

            {/* Result and time */}
            <div className="flex items-center gap-3">
              <span className={`
                font-bold text-amber-100
                ${compact ? 'text-sm' : 'text-base'}
                ${index === 0 ? 'text-amber-300' : ''}
              `}>
                = {entry.total}
              </span>
              <span className="text-xs text-stone-500 tabular-nums">
                {formatTime(entry.timestamp)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/**
 * Hook for managing roll history state
 *
 * @example
 * ```tsx
 * const { history, addRoll, clearHistory } = useRollHistory(10)
 *
 * <DiceRoller onRoll={(result) => addRoll(result)} />
 * <RollHistory history={history} onClear={clearHistory} />
 * ```
 */
export function useRollHistory(maxEntries: number = 10) {
  const [history, setHistory] = useState<RollHistoryEntry[]>([])

  const addRoll = (result: DiceResult) => {
    const entry = createRollEntry(result)
    setHistory((prev) => {
      const updated = [...prev, entry]
      // Keep only the last maxEntries * 2 to allow some buffer
      if (updated.length > maxEntries * 2) {
        return updated.slice(-maxEntries * 2)
      }
      return updated
    })
  }

  const clearHistory = () => {
    setHistory([])
  }

  return { history, addRoll, clearHistory }
}

// Need to import useState for the hook
import { useState } from 'react'
