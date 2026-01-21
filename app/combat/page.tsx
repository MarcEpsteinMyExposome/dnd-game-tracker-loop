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
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-red-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="mb-8 text-center">
            <h1 className="text-5xl font-bold text-amber-400 mb-3">
              ⚔️ Combat Tracker
            </h1>
            <p className="text-purple-200 text-lg">
              Manage initiative, track HP, and orchestrate the battle
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
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg shadow-lg transition-colors"
            >
              ← Back to Dashboard
            </Link>
            <Link
              href="/characters"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg transition-colors"
            >
              Manage Characters
            </Link>
            <Link
              href="/monsters"
              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-lg transition-colors"
            >
              Monster Library
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
