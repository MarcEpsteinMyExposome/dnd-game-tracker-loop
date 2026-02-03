'use client'

/**
 * Dashboard Component
 *
 * Main dashboard view that displays team-wide statistics using stat cards.
 * Shows team size, average HP, and health status breakdowns (healthy/injured/unconscious).
 * Updates in real-time when character data changes in the store.
 *
 * @see components/dashboard/StatCard.tsx - Individual stat card display
 * @see lib/utils/stats.ts - Statistics calculation functions
 * @see lib/store/gameStore.ts - Character data source
 */

import { useGameStore } from '@/lib/store/gameStore'
import {
  calculateTeamSize,
  calculateAverageHp,
  getHealthyCount,
  getInjuredCount,
  getUnconsciousCount,
} from '@/lib/utils/stats'
import { StatCard } from './StatCard'

/**
 * Dashboard Component
 *
 * Displays a responsive grid of stat cards showing team statistics.
 * Automatically updates when characters are added, removed, or their HP changes.
 *
 * Features:
 * - Team size counter
 * - Average HP percentage with color-coded status
 * - Health status breakdown (healthy/injured/unconscious)
 * - Empty state when no characters exist
 * - Responsive grid layout (1-3 columns)
 *
 * @example
 * ```tsx
 * import { Dashboard } from '@/components/dashboard/Dashboard'
 *
 * export default function DashboardPage() {
 *   return <Dashboard />
 * }
 * ```
 */
export function Dashboard() {
  // Get characters from store - component will re-render when characters change
  const characters = useGameStore((state) => state.characters)

  // Calculate all statistics
  const teamSize = calculateTeamSize(characters)
  const averageHp = calculateAverageHp(characters)
  const healthyCount = getHealthyCount(characters)
  const injuredCount = getInjuredCount(characters)
  const unconsciousCount = getUnconsciousCount(characters)

  // Determine average HP color based on percentage
  const getAverageHpColor = (): 'green' | 'yellow' | 'red' => {
    if (averageHp > 75) return 'green'
    if (averageHp > 25) return 'yellow'
    return 'red'
  }

  // Empty state - no characters in roster
  if (teamSize === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-amber-200/70 text-lg mb-4">
          No deputies in your posse yet.
        </p>
        <p className="text-stone-500 text-sm">
          Create your first character to see posse statistics here.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Main Stats Grid - Team Size and Average HP */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatCard
          title="Posse Size"
          value={teamSize}
          icon="🤠"
          color="blue"
          description={`${teamSize} ${teamSize === 1 ? 'deputy' : 'deputies'} in the posse`}
        />

        <StatCard
          title="Average HP"
          value={`${averageHp}%`}
          icon="❤️"
          color={getAverageHpColor()}
          description="Posse health status"
        />
      </div>

      {/* Health Status Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Ready to Ride"
          value={healthyCount}
          icon="💚"
          color="green"
          description={`${healthyCount} above 75% HP`}
        />

        <StatCard
          title="Wounded"
          value={injuredCount}
          icon="🩹"
          color="yellow"
          description={`${injuredCount} between 1-75% HP`}
        />

        <StatCard
          title="Down & Out"
          value={unconsciousCount}
          icon="💀"
          color="red"
          description={`${unconsciousCount} at 0 HP`}
        />
      </div>
    </div>
  )
}
