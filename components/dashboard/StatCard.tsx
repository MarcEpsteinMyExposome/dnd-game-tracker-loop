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
  // Western-themed color variant classes with magic accents
  const colorVariants = {
    blue: 'bg-gradient-to-br from-sky-800 to-blue-900 border-sky-500/50 shadow-sky-900/30',
    green: 'bg-gradient-to-br from-emerald-800 to-green-900 border-emerald-500/50 shadow-emerald-900/30',
    red: 'bg-gradient-to-br from-red-800 to-rose-900 border-red-500/50 shadow-red-900/30',
    yellow: 'bg-gradient-to-br from-amber-700 to-orange-900 border-amber-500/50 shadow-amber-900/30',
    purple: 'bg-gradient-to-br from-purple-800 to-violet-900 border-purple-500/50 shadow-purple-900/30',
  }

  // Trend arrow icons
  const trendIcons = {
    up: '↑',
    down: '↓',
  }

  const colorClass = colorVariants[color]

  return (
    <div
      className={`${colorClass} rounded-xl border-2 p-6 text-white shadow-xl transition-all hover:scale-105 hover:shadow-2xl backdrop-blur-sm`}
      role="article"
      aria-label={`${title}: ${value}`}
    >
      {/* Header: Title and Icon */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-amber-100/80">
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
        <p className="text-4xl font-bold text-amber-100">{value}</p>
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
        <p className="text-sm text-white/70 mt-2">{description}</p>
      )}
    </div>
  )
}
