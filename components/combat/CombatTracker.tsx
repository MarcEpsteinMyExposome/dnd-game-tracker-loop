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
  onAddMonsters?: () => void
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
 * @param onAddCombatants - Optional callback to open "Add Characters" modal
 * @param onAddMonsters - Optional callback to open "Add Monsters" modal
 *
 * @example
 * ```tsx
 * <CombatTracker
 *   onAddCombatants={() => setShowAddModal(true)}
 *   onAddMonsters={() => setShowAddMonstersModal(true)}
 * />
 * ```
 */
export function CombatTracker({ onAddCombatants, onAddMonsters }: CombatTrackerProps) {
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
        <div className="text-6xl mb-4">🔫</div>
        <h3 className="text-xl font-bold text-amber-200 mb-2">No Active Showdown</h3>
        <p className="text-stone-400 mb-6">
          Add deputies and outlaws to begin the shootout
        </p>
        <div className="flex gap-3 justify-center">
          {onAddCombatants && (
            <button
              onClick={onAddCombatants}
              className="bg-gradient-to-r from-sky-700 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-sky-600 hover:to-blue-500 transition-all border border-sky-500/30"
            >
              🤠 Add Deputies
            </button>
          )}
          {onAddMonsters && (
            <button
              onClick={onAddMonsters}
              className="bg-gradient-to-r from-red-700 to-rose-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-red-600 hover:to-rose-500 transition-all border border-red-500/30"
            >
              🦂 Add Outlaws
            </button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Combat Header - Round Counter and Controls */}
      <div className="bg-gradient-to-r from-amber-800 via-orange-800 to-amber-800 text-white rounded-xl p-4 shadow-lg border border-amber-600/40">
        <div className="flex items-center justify-between flex-wrap gap-4">
          {/* Round Counter */}
          <div>
            <div className="text-sm uppercase tracking-wide text-amber-200/80">Showdown Round</div>
            <div className="text-3xl font-bold text-amber-100">#{round}</div>
            {activeCombatant && (
              <div className="text-sm text-amber-200/80 mt-1">
                Current Turn: <span className="font-semibold text-amber-100">{activeCombatant.name}</span>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="flex gap-2 flex-wrap">
            {onAddCombatants && (
              <button
                onClick={onAddCombatants}
                className="bg-sky-700 text-white px-3 py-2 rounded-lg text-sm font-semibold hover:bg-sky-600 transition-colors border border-sky-500/30"
                title="Add deputies to showdown"
              >
                🤠 Deputies
              </button>
            )}
            {onAddMonsters && (
              <button
                onClick={onAddMonsters}
                className="bg-orange-700 text-white px-3 py-2 rounded-lg text-sm font-semibold hover:bg-orange-600 transition-colors border border-orange-500/30"
                title="Add outlaws to showdown"
              >
                🦂 Outlaws
              </button>
            )}
            <button
              onClick={handleNextTurn}
              className="bg-gradient-to-r from-purple-600 to-violet-600 text-white px-6 py-2 rounded-lg font-bold hover:from-purple-500 hover:to-violet-500 transition-all shadow-md border border-purple-400/30"
              title="Advance to next combatant's turn"
            >
              ✨ Next Turn
            </button>
            <button
              onClick={() => setShowEndCombatConfirm(true)}
              className="bg-red-700 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-600 transition-colors shadow-md border border-red-500/30"
              title="End showdown and clear all combatants"
            >
              🛑 End Showdown
            </button>
          </div>
        </div>
      </div>

      {/* Combat Status Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
        <div className="bg-sky-900/40 border border-sky-600/40 rounded-lg p-3">
          <div className="text-sky-300 font-semibold mb-1">🤠 Deputies</div>
          <div className="text-2xl font-bold text-sky-100">
            {sortedCombatants.filter((c) => c.isPlayer && c.currentHp > 0).length}
          </div>
          <div className="text-xs text-sky-400">standing</div>
        </div>
        <div className="bg-red-900/40 border border-red-600/40 rounded-lg p-3">
          <div className="text-red-300 font-semibold mb-1">🦂 Outlaws</div>
          <div className="text-2xl font-bold text-red-100">
            {sortedCombatants.filter((c) => !c.isPlayer && c.currentHp > 0).length}
          </div>
          <div className="text-xs text-red-400">standing</div>
        </div>
        <div className="bg-stone-800/60 border border-stone-600/40 rounded-lg p-3">
          <div className="text-stone-300 font-semibold mb-1">💥 Total</div>
          <div className="text-2xl font-bold text-stone-100">
            {sortedCombatants.length}
          </div>
          <div className="text-xs text-stone-400">combatants</div>
        </div>
      </div>

      {/* Combatants List */}
      <div>
        <h3 className="text-lg font-bold text-amber-200 mb-3 flex items-center gap-2">
          <span>🔫</span>
          <span>Draw Order</span>
        </h3>
        <div className="space-y-3">
          {sortedCombatants.map((combatant, index) => (
            <div key={combatant.id} className="flex items-start gap-3">
              {/* Initiative Rank */}
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-900/60 border border-amber-600/40 flex items-center justify-center text-sm font-bold text-amber-200">
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
          title="End Showdown?"
          message="This will remove all combatants and end the current encounter. This action cannot be undone."
          confirmText="End Showdown"
          cancelText="Cancel"
          isDangerous={true}
          onConfirm={handleEndCombat}
          onCancel={() => setShowEndCombatConfirm(false)}
        />
      )}
    </div>
  )
}
