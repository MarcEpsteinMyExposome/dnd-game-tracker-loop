'use client'

/**
 * Condition Toggle Component
 *
 * Displays all 7 conditions as toggleable buttons.
 * Allows adding/removing conditions from a character.
 */

import { Condition, ALL_CONDITIONS, getConditionDetails } from '@/lib/schemas/condition.schema'
import { useGameStore } from '@/lib/store/gameStore'

interface ConditionToggleProps {
  /**
   * ID of the character to manage conditions for
   */
  characterId: string

  /**
   * Current active conditions for the character
   */
  activeConditions: Condition[]
}

export function ConditionToggle({ characterId, activeConditions }: ConditionToggleProps) {
  const toggleCharacterCondition = useGameStore((state) => state.toggleCharacterCondition)

  const handleToggle = (condition: Condition) => {
    toggleCharacterCondition(characterId, condition)
  }

  return (
    <div className="space-y-3">
      <div className="text-sm text-gray-600 mb-3">
        Click to toggle conditions on/off. Active conditions are highlighted.
      </div>

      <div className="grid grid-cols-1 gap-2">
        {ALL_CONDITIONS.map((condition) => {
          const details = getConditionDetails(condition)
          const isActive = activeConditions.includes(condition)

          return (
            <button
              key={condition}
              onClick={() => handleToggle(condition)}
              className={`text-left px-4 py-3 rounded-lg border-2 transition-all ${
                isActive
                  ? `${details.color} border-current font-semibold shadow-md`
                  : 'bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
              role="checkbox"
              aria-checked={isActive}
              aria-label={`Toggle ${condition} condition`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <div
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                        isActive ? 'bg-current border-current' : 'border-gray-300'
                      }`}
                    >
                      {isActive && <span className="text-white text-xs">✓</span>}
                    </div>
                    <span className={`font-semibold ${isActive ? '' : 'text-gray-700'}`}>
                      {condition}
                    </span>
                  </div>
                  <p className={`text-xs ${isActive ? 'opacity-90' : 'text-gray-600'} ml-7`}>
                    {details.description}
                  </p>
                </div>
              </div>
            </button>
          )
        })}
      </div>

      {/* Active conditions summary */}
      {activeConditions.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="text-sm font-semibold text-gray-700 mb-2">
            Active Conditions ({activeConditions.length}):
          </div>
          <div className="flex flex-wrap gap-2">
            {activeConditions.map((condition) => {
              const details = getConditionDetails(condition)
              return (
                <span
                  key={condition}
                  className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${details.color}`}
                >
                  {condition}
                </span>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
