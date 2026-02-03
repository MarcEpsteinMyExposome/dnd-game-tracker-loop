'use client'

/**
 * Combat Page
 *
 * Main combat tracker page for managing active encounters.
 * Accessible at /combat route.
 *
 * Features:
 * - CombatTracker component for managing combat
 * - AddToCombatModal for adding characters to combat
 * - AddMonstersModal for adding monsters to combat
 * - Real-time combat state updates
 * - Initiative order tracking
 * - Turn management controls
 *
 * @see components/combat/CombatTracker.tsx - Main combat interface
 * @see components/combat/AddToCombatModal.tsx - Modal for adding characters
 * @see components/combat/AddMonstersModal.tsx - Modal for adding monsters
 */

import { useState } from 'react'
import Link from 'next/link'
import { CombatTracker } from '@/components/combat/CombatTracker'
import { AddToCombatModal } from '@/components/combat/AddToCombatModal'
import { AddMonstersModal } from '@/components/combat/AddMonstersModal'

/**
 * CombatPage - Main combat encounter management page
 *
 * Provides the combat tracker interface with ability to add characters
 * and monsters to combat. Manages modal state for both types of combatants.
 *
 * Route: /combat
 *
 * @example
 * Navigation:
 * - From Dashboard: "Start Combat" button
 * - From Header: "Combat" link
 * - Direct: Navigate to /combat
 */
export default function CombatPage() {
  const [showAddModal, setShowAddModal] = useState(false)
  const [showAddMonstersModal, setShowAddMonstersModal] = useState(false)

  return (
    <main className="min-h-screen bg-gradient-to-br from-stone-950 via-red-950/70 to-stone-950 relative">
      {/* Atmospheric background - combat tension */}
      <div className="absolute inset-0 opacity-25 pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-red-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/3 w-56 h-56 bg-orange-600/20 rounded-full blur-2xl" />
        <div className="absolute top-1/2 right-1/4 w-40 h-40 bg-purple-600/15 rounded-full blur-xl" />
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="mb-8 text-center">
            <h1 className="text-5xl font-bold mb-3">
              <span className="mr-2">💥</span>
              <span className="bg-gradient-to-r from-red-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
                Showdown Tracker
              </span>
            </h1>
            <p className="text-amber-200/80 text-lg">
              Manage initiative, track HP, and orchestrate the shootout
            </p>
          </div>

          {/* Combat Tracker Component */}
          <CombatTracker
            onAddCombatants={() => setShowAddModal(true)}
            onAddMonsters={() => setShowAddMonstersModal(true)}
          />

          {/* Back to Dashboard Link */}
          <div className="mt-12 flex flex-wrap gap-4 justify-center">
            <Link
              href="/dashboard"
              className="px-6 py-3 bg-gradient-to-r from-purple-700 to-violet-600 hover:from-purple-600 hover:to-violet-500 text-white font-semibold rounded-lg shadow-lg transition-all border border-purple-500/30"
            >
              ⭐ Back to Dashboard
            </Link>
            <Link
              href="/characters"
              className="px-6 py-3 bg-gradient-to-r from-sky-700 to-blue-600 hover:from-sky-600 hover:to-blue-500 text-white font-semibold rounded-lg shadow-lg transition-all border border-sky-500/30"
            >
              🤠 Manage Posse
            </Link>
            <Link
              href="/monsters"
              className="px-6 py-3 bg-gradient-to-r from-amber-700 to-orange-600 hover:from-amber-600 hover:to-orange-500 text-white font-semibold rounded-lg shadow-lg transition-all border border-amber-500/30"
            >
              🦂 Outlaw Bounties
            </Link>
          </div>
        </div>
      </div>

      {/* Add Characters Modal */}
      {showAddModal && <AddToCombatModal onClose={() => setShowAddModal(false)} />}

      {/* Add Monsters Modal */}
      {showAddMonstersModal && (
        <AddMonstersModal onClose={() => setShowAddMonstersModal(false)} />
      )}
    </main>
  )
}
