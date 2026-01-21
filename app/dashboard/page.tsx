/**
 * Dashboard Page
 *
 * Main dashboard view showing team-wide statistics and overview.
 * Accessible at /dashboard route.
 *
 * Features:
 * - Team statistics display (size, average HP, health breakdown)
 * - Quick action buttons to navigate to other sections
 * - Real-time updates when character data changes
 *
 * @see components/dashboard/Dashboard.tsx - Main dashboard component
 */

import Link from 'next/link'
import { Dashboard } from '@/components/dashboard/Dashboard'

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="mb-8 text-center">
            <h1 className="text-5xl font-bold text-amber-400 mb-3">
              📊 Team Dashboard
            </h1>
            <p className="text-purple-200 text-lg">
              Overview of your party&apos;s health and status
            </p>
          </div>

          {/* Dashboard Component */}
          <Dashboard />

          {/* Quick Actions */}
          <div className="mt-12 flex flex-wrap gap-4 justify-center">
            <Link
              href="/characters"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg transition-colors"
            >
              Manage Characters
            </Link>
            <Link
              href="/combat"
              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-lg transition-colors"
            >
              Start Combat
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
