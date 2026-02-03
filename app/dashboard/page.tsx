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
    <main className="min-h-screen bg-gradient-to-br from-stone-950 via-amber-950/60 to-stone-950 relative">
      {/* Atmospheric background elements */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-purple-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 left-1/4 w-48 h-48 bg-amber-600/20 rounded-full blur-2xl" />
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="mb-8 text-center">
            <h1 className="text-5xl font-bold mb-3">
              <span className="mr-2">⭐</span>
              <span className="bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-300 bg-clip-text text-transparent">
                Posse Dashboard
              </span>
            </h1>
            <p className="text-purple-300 text-lg">
              Overview of your posse&apos;s health and status
            </p>
          </div>

          {/* Dashboard Component */}
          <Dashboard />

          {/* Quick Actions */}
          <div className="mt-12 flex flex-wrap gap-4 justify-center">
            <Link
              href="/characters"
              className="px-6 py-3 bg-gradient-to-r from-sky-700 to-blue-600 hover:from-sky-600 hover:to-blue-500 text-white font-semibold rounded-lg shadow-lg transition-all border border-sky-500/30"
            >
              🤠 Manage Posse
            </Link>
            <Link
              href="/combat"
              className="px-6 py-3 bg-gradient-to-r from-red-700 to-rose-600 hover:from-red-600 hover:to-rose-500 text-white font-semibold rounded-lg shadow-lg transition-all border border-red-500/30"
            >
              💥 Start Showdown
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
