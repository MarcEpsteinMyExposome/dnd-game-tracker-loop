'use client'

/**
 * Combat Tracker Component
 *
 * Main combat management interface.
 * Displays all combatants in initiative order, round counter,
 * and turn management controls (Next Turn, End Combat).
 *
 * Features:
 * - Initiative-ordered combatant list
 * - Round counter
 * - Next Turn button (automatically skips defeated combatants)
 * - End Combat button (with confirmation)
 * - Add Combatants button
 * - Empty state when no combat active
 *
 * @see CombatantCard for individual combatant display
 */

import { useState } from 'react'
import { useGameStore } from '@/lib/store/gameStore'
import { CombatantCard } from './CombatantCard'
import { ConfirmDialog } from '../ui/ConfirmDialog'

interface CombatTrackerProps {
  onAddCombatants?: () => void
}

/**
 * CombatTracker - Main combat management interface
 *
 * Orchestrates the combat encounter:
 * - Displays all combatants sorted by initiative
 * - Shows current round number
 * - Provides turn advancement (Next Turn button)
 * - Allows ending combat (with confirmation)
 * - Handles removing individual combatants
 * - Shows empty state when no combatants present
 *
 * @param onAddCombatants - Optional callback to open "Add to Combat" modal
 *
 * @example
 * ```tsx
 * <CombatTracker
 *   onAddCombatants={() => setShowAddModal(true)}
 * />
 * ```
 */
export function CombatTracker({ onAddCombatants }: CombatTrackerProps) {
  // Access state directly instead of calling selector functions during render
  const combatants = useGameStore((state) => state.combatants)
  const round = useGameStore((state) => state.round)
  const isInCombat = useGameStore((state) => state.isInCombat)
  const nextTurn = useGameStore((state) => state.nextTurn)
  const clearCombat = useGameStore((state) => state.clearCombat)
  const removeCombatant = useGameStore((state) => state.removeCombatant)
  const getSortedCombatants = useGameStore((state) => state.getSortedCombatants)
  const getActiveCombatant = useGameStore((state) => state.getActiveCombatant)

  // Call selector functions here (not during render subscription)
  const sortedCombatants = getSortedCombatants()
  const activeCombatant = getActiveCombatant()

  const [showEndCombatConfirm, setShowEndCombatConfirm] = useState(false)

  // Handle next turn
  const handleNextTurn = () => {
    nextTurn()
  }

  // Handle end combat
  const handleEndCombat = () => {
    clearCombat()
    setShowEndCombatConfirm(false)
  }

  // Empty state - no combatants
  if (sortedCombatants.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">⚔️</div>
        <h3 className="text-xl font-bold text-gray-700 mb-2">No Active Combat</h3>
        <p className="text-gray-600 mb-6">
          Add characters and monsters to begin combat
        </p>
        {onAddCombatants && (
          <button
            onClick={onAddCombatants}
            className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
          >
            ➕ Add Combatants
          </button>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Combat Header - Round Counter and Controls */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-lg p-4 shadow-lg">
        <div className="flex items-center justify-between flex-wrap gap-4">
          {/* Round Counter */}
          <div>
            <div className="text-sm uppercase tracking-wide opacity-90">Combat Round</div>
            <div className="text-3xl font-bold">#{round}</div>
            {activeCombatant && (
              <div className="text-sm opacity-90 mt-1">
                Current Turn: <span className="font-semibold">{activeCombatant.name}</span>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="flex gap-2">
            {onAddCombatants && (
              <button
                onClick={onAddCombatants}
                className="bg-white/20 text-white px-4 py-2 rounded-lg font-semibold hover:bg-white/30 transition-colors backdrop-blur-sm"
                title="Add more combatants to combat"
              >
                ➕ Add
              </button>
            )}
            <button
              onClick={handleNextTurn}
              className="bg-yellow-400 text-yellow-900 px-6 py-2 rounded-lg font-bold hover:bg-yellow-300 transition-colors shadow-md"
              title="Advance to next combatant's turn"
            >
              ⏭️ Next Turn
            </button>
            <button
              onClick={() => setShowEndCombatConfirm(true)}
              className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors shadow-md"
              title="End combat and clear all combatants"
            >
              🛑 End Combat
            </button>
          </div>
        </div>
      </div>

      {/* Combat Status Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="text-blue-600 font-semibold mb-1">Players</div>
          <div className="text-2xl font-bold text-blue-700">
            {sortedCombatants.filter((c) => c.isPlayer && c.currentHp > 0).length}
          </div>
          <div className="text-xs text-blue-600">alive</div>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <div className="text-red-600 font-semibold mb-1">Enemies</div>
          <div className="text-2xl font-bold text-red-700">
            {sortedCombatants.filter((c) => !c.isPlayer && c.currentHp > 0).length}
          </div>
          <div className="text-xs text-red-600">alive</div>
        </div>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
          <div className="text-gray-600 font-semibold mb-1">Total</div>
          <div className="text-2xl font-bold text-gray-700">
            {sortedCombatants.length}
          </div>
          <div className="text-xs text-gray-600">combatants</div>
        </div>
      </div>

      {/* Combatants List */}
      <div>
        <h3 className="text-lg font-bold text-gray-700 mb-3 flex items-center gap-2">
          <span>⚔️</span>
          <span>Initiative Order</span>
        </h3>
        <div className="space-y-3">
          {sortedCombatants.map((combatant, index) => (
            <div key={combatant.id} className="flex items-start gap-3">
              {/* Initiative Rank */}
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-bold text-gray-600">
                {index + 1}
              </div>

              {/* Combatant Card */}
              <div className="flex-1">
                <CombatantCard
                  combatant={combatant}
                  onRemove={(c) => removeCombatant(c.id)}
                  showInitiative={true}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* End Combat Confirmation Dialog */}
      {showEndCombatConfirm && (
        <ConfirmDialog
          title="End Combat?"
          message="This will remove all combatants and end the current encounter. This action cannot be undone."
          confirmText="End Combat"
          cancelText="Cancel"
          isDangerous={true}
          onConfirm={handleEndCombat}
          onCancel={() => setShowEndCombatConfirm(false)}
        />
      )}
    </div>
  )
}
