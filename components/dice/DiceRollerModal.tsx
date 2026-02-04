'use client'

/**
 * DiceRollerModal Component
 *
 * A modal wrapper for the DiceRoller component that can be accessed
 * from anywhere in the application via the navigation bar.
 *
 * Features:
 * - Full-featured dice roller with all standard dice types
 * - Roll history that persists while modal is open
 * - Keyboard accessible (Escape to close)
 * - Click outside to close
 * - Western theme styling consistent with the rest of the app
 */

import { DiceRoller } from './DiceRoller'
import { RollHistory, useRollHistory } from './RollHistory'

export interface DiceRollerModalProps {
  /** Callback when the modal is closed */
  onClose: () => void
}

/**
 * DiceRollerModal - Modal container for dice rolling interface
 *
 * @example
 * ```tsx
 * const [showDice, setShowDice] = useState(false)
 *
 * {showDice && <DiceRollerModal onClose={() => setShowDice(false)} />}
 * ```
 */
export function DiceRollerModal({ onClose }: DiceRollerModalProps) {
  const { history, addRoll, clearHistory } = useRollHistory(15)

  // Close on escape key
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose()
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={onClose}
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-modal="true"
      aria-labelledby="dice-modal-title"
    >
      <div
        className="bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 rounded-xl p-6 max-w-4xl w-full shadow-2xl border border-amber-600/30"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🎲</span>
            <h2
              id="dice-modal-title"
              className="text-2xl font-bold bg-gradient-to-r from-amber-200 via-orange-300 to-amber-200 bg-clip-text text-transparent"
            >
              Dice Roller
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-amber-300 transition-colors p-2 hover:bg-stone-700/50 rounded-lg"
            aria-label="Close dice roller"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content - Dice Roller and History side by side on large screens */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DiceRoller onRoll={addRoll} />
          <RollHistory
            history={history}
            onClear={clearHistory}
            maxEntries={15}
          />
        </div>

        {/* Footer hint */}
        <div className="mt-4 text-center text-stone-500 text-sm">
          Press <kbd className="px-1.5 py-0.5 bg-stone-700 rounded text-stone-300">Esc</kbd> or click outside to close
        </div>
      </div>
    </div>
  )
}
