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
 * - Collapsible DiceRoller panel with roll history
 * - Real-time combat state updates
 * - Initiative order tracking
 * - Turn management controls
 *
 * @see components/combat/CombatTracker.tsx - Main combat interface
 * @see components/combat/AddToCombatModal.tsx - Modal for adding characters
 * @see components/combat/AddMonstersModal.tsx - Modal for adding monsters
 * @see components/dice/DiceRoller.tsx - Dice rolling interface
 */

import { useState } from 'react'
import Link from 'next/link'
import { CombatTracker } from '@/components/combat/CombatTracker'
import { AddToCombatModal } from '@/components/combat/AddToCombatModal'
import { AddMonstersModal } from '@/components/combat/AddMonstersModal'
import { DiceRoller, RollHistory, useRollHistory } from '@/components/dice'

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
  const [showDiceRoller, setShowDiceRoller] = useState(false)
  const { history, addRoll, clearHistory } = useRollHistory(10)

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

          {/* Collapsible Dice Roller Panel */}
          <div className="mt-6">
            <button
              onClick={() => setShowDiceRoller(!showDiceRoller)}
              className="w-full flex items-center justify-between px-4 py-3 bg-gradient-to-r from-amber-800/40 via-orange-700/30 to-amber-800/40 hover:from-amber-700/50 hover:via-orange-600/40 hover:to-amber-700/50 border border-amber-600/30 rounded-lg transition-all group"
              aria-expanded={showDiceRoller}
              aria-controls="dice-roller-panel"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl group-hover:animate-bounce">🎲</span>
                <span className="font-semibold text-amber-200">Dice Roller</span>
                {history.length > 0 && (
                  <span className="text-xs px-2 py-0.5 bg-purple-600/50 text-purple-200 rounded-full">
                    {history.length} roll{history.length !== 1 ? 's' : ''}
                  </span>
                )}
              </div>
              <span className={`text-amber-400 transition-transform duration-200 ${showDiceRoller ? 'rotate-180' : ''}`}>
                ▼
              </span>
            </button>

            {showDiceRoller && (
              <div
                id="dice-roller-panel"
                className="mt-2 grid grid-cols-1 lg:grid-cols-2 gap-4 animate-in slide-in-from-top-2 duration-200"
              >
                <DiceRoller onRoll={addRoll} />
                <RollHistory
                  history={history}
                  onClear={clearHistory}
                  maxEntries={10}
                />
              </div>
            )}
          </div>

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
