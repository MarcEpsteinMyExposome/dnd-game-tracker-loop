'use client'

/**
 * StatCard Component
 *
 * Displays a single statistic card with a title, value, optional icon, and description.
 * Features gradient backgrounds with color variants and optional trend indicators.
 * Used in the Dashboard to show team statistics like size, average HP, etc.
 *
 * @see components/dashboard/Dashboard.tsx - Uses this component
 * @see lib/utils/stats.ts - Calculates the statistics displayed
 */

interface StatCardProps {
  /**
   * The title/label for the statistic
   * @example "Team Size", "Average HP", "Healthy Characters"
   */
  title: string

  /**
   * The main value to display
   * Can be a number or string
   * @example 5, "85%", "3/5"
   */
  value: string | number

  /**
   * Optional emoji icon to display
   * @example "👥", "❤️", "⚔️"
   */
  icon?: string

  /**
   * Color theme variant
   * Determines the gradient background color
   * Default: 'blue'
   */
  color?: 'blue' | 'green' | 'red' | 'yellow' | 'purple'

  /**
   * Optional description text shown below the value
   * @example "characters in the party", "team health status"
   */
  description?: string

  /**
   * Optional trend indicator
   * Shows an up or down arrow with the value
   * @example 'up', 'down'
   */
  trend?: 'up' | 'down'
}

export function StatCard({
  title,
  value,
  icon,
  color = 'blue',
  description,
  trend,
}: StatCardProps) {
  // Color variant classes using Tailwind CSS 4 syntax
  const colorVariants = {
    blue: 'bg-gradient-to-br from-blue-500 to-blue-700 border-blue-400',
    green: 'bg-gradient-to-br from-green-500 to-green-700 border-green-400',
    red: 'bg-gradient-to-br from-red-500 to-red-700 border-red-400',
    yellow: 'bg-gradient-to-br from-yellow-500 to-yellow-700 border-yellow-400',
    purple: 'bg-gradient-to-br from-purple-500 to-purple-700 border-purple-400',
  }

  // Trend arrow icons
  const trendIcons = {
    up: '↑',
    down: '↓',
  }

  const colorClass = colorVariants[color]

  return (
    <div
      className={`${colorClass} rounded-lg border-2 p-6 text-white shadow-lg transition-transform hover:scale-105`}
      role="article"
      aria-label={`${title}: ${value}`}
    >
      {/* Header: Title and Icon */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold uppercase tracking-wide opacity-90">
          {title}
        </h3>
        {icon && (
          <span className="text-2xl" role="img" aria-label={title}>
            {icon}
          </span>
        )}
      </div>

      {/* Value Display */}
      <div className="flex items-baseline gap-2 mb-2">
        <p className="text-4xl font-bold">{value}</p>
        {trend && (
          <span
            className="text-2xl font-bold"
            aria-label={`trending ${trend}`}
          >
            {trendIcons[trend]}
          </span>
        )}
      </div>

      {/* Description */}
      {description && (
        <p className="text-sm opacity-80 mt-2">{description}</p>
      )}
    </div>
  )
}
