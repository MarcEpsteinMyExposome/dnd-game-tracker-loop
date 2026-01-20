'use client'

/**
 * Condition Badge Component
 *
 * Displays a single condition as a colored badge with tooltip.
 * Shows condition name, description, and mechanical effects on hover.
 * Includes optional remove button.
 */

import { useState } from 'react'
import { Condition, getConditionDetails } from '@/lib/schemas/condition.schema'

interface ConditionBadgeProps {
  /**
   * The condition to display
   */
  condition: Condition

  /**
   * Optional callback when remove button clicked
   * If not provided, remove button is hidden
   */
  onRemove?: (condition: Condition) => void

  /**
   * Size variant
   * Default: 'md'
   */
  size?: 'sm' | 'md' | 'lg'
}

export function ConditionBadge({ condition, onRemove, size = 'md' }: ConditionBadgeProps) {
  const [showTooltip, setShowTooltip] = useState(false)
  const details = getConditionDetails(condition)

  if (!details) {
    return null
  }

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2 py-1',
    lg: 'text-base px-3 py-1.5',
  }

  return (
    <div className="relative inline-block">
      {/* Badge */}
      <div
        className={`inline-flex items-center gap-1 rounded-full font-medium ${details.color} ${sizeClasses[size]} cursor-help`}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        role="status"
        aria-label={`${condition} condition`}
      >
        <span>{condition}</span>
        {onRemove && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              onRemove(condition)
            }}
            className="hover:opacity-70 transition-opacity ml-1"
            title={`Remove ${condition}`}
            aria-label={`Remove ${condition} condition`}
          >
            ✕
          </button>
        )}
      </div>

      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 bg-gray-900 text-white text-xs rounded-lg p-3 shadow-xl z-50">
          {/* Arrow */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-gray-900" />

          {/* Content */}
          <div className="space-y-2">
            <div>
              <div className="font-bold text-white mb-1">{details.name}</div>
              <div className="text-gray-300">{details.description}</div>
            </div>
            <div className="border-t border-gray-700 pt-2">
              <div className="font-semibold text-gray-200 mb-1">Effect:</div>
              <div className="text-gray-300">{details.mechanicalEffect}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
