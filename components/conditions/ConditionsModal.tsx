'use client'

/**
 * Conditions Management Modal
 *
 * Modal dialog for managing character conditions.
 * Shows ConditionToggle component and condition reference information.
 */

import { Character } from '@/lib/schemas'
import { CONDITION_DETAILS } from '@/lib/schemas/condition.schema'
import { ConditionToggle } from './ConditionToggle'

interface ConditionsModalProps {
  /**
   * Character to manage conditions for
   */
  character: Character

  /**
   * Callback when modal should close
   */
  onClose: () => void
}

export function ConditionsModal({ character, onClose }: ConditionsModalProps) {
  // Close on escape key
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose()
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-modal="true"
      aria-labelledby="conditions-modal-title"
    >
      <div
        className="bg-white rounded-lg p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h2 id="conditions-modal-title" className="text-2xl font-bold text-gray-900">
              Manage Conditions
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl w-8 h-8 flex items-center justify-center"
              aria-label="Close modal"
            >
              ✕
            </button>
          </div>
          <p className="text-gray-600">
            Character: <span className="font-semibold">{character.name}</span>
          </p>
        </div>

        {/* Condition Toggle */}
        <div className="mb-6">
          <ConditionToggle characterId={character.id} activeConditions={character.conditions} />
        </div>

        {/* Condition Reference */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Condition Reference</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.values(CONDITION_DETAILS).map((details) => (
              <div key={details.name} className={`p-3 rounded-lg border ${details.color}`}>
                <div className="font-semibold mb-1">{details.name}</div>
                <div className="text-xs opacity-90 mb-2">{details.description}</div>
                <div className="text-xs">
                  <span className="font-semibold">Effect:</span> {details.mechanicalEffect}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  )
}
