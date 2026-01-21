'use client'

/**
 * Monster Library Page
 *
 * Browse and manage monster stat blocks for D&D/Warhammer 40K encounters.
 * Accessible at /monsters route.
 *
 * Features:
 * - MonsterLibrary component for browsing all monsters
 * - Filter by category (Humanoid, Beast, Undead, etc.)
 * - Search monsters by name
 * - Sort by name, AC, HP, or Challenge Rating
 * - Add individual monsters to combat
 * - Batch add all filtered monsters to combat
 * - Toast notifications for user feedback
 *
 * @see components/monsters/MonsterLibrary.tsx - Main monster browser
 * @see lib/data/monsters.ts - Monster data and helper functions
 */

import { useState } from 'react'
import Link from 'next/link'
import MonsterLibrary from '@/components/monsters/MonsterLibrary'
import { Monster } from '@/lib/schemas/monster.schema'
import { createCombatantFromMonster } from '@/lib/schemas/combatant.schema'
import { useGameStore } from '@/lib/store/gameStore'
import { Toast } from '@/components/ui/Toast'

/**
 * MonstersPage - Monster library browser page
 *
 * Allows users to browse all available monsters, filter/search/sort them,
 * and add them to combat encounters. Provides toast notifications for
 * successful additions.
 *
 * Route: /monsters
 *
 * @example
 * Navigation:
 * - From Header: "Monsters" link
 * - Direct: Navigate to /monsters
 */
export default function MonstersPage() {
  const addCombatant = useGameStore((state) => state.addCombatant)
  const [toast, setToast] = useState<{
    type: 'success' | 'error' | 'warning' | 'info'
    message: string
  } | null>(null)

  /**
   * Handle adding a single monster to combat
   *
   * Converts Monster to Combatant using createCombatantFromMonster helper.
   * Initiative defaults to monster's AC (temporary until initiative rolling is implemented).
   * Shows success toast with monster name.
   *
   * @param monster - The monster to add to combat
   */
  const handleAddToCombat = (monster: Monster) => {
    try {
      // Create combatant from monster (initiative defaults to AC)
      const combatant = createCombatantFromMonster(monster)

      // Add to combat via Zustand store
      addCombatant(combatant)

      // Show success toast
      setToast({
        type: 'success',
        message: `${monster.name} added to combat!`,
      })
    } catch (error) {
      console.error('Failed to add monster to combat:', error)
      setToast({
        type: 'error',
        message: `Failed to add ${monster.name} to combat`,
      })
    }
  }

  /**
   * Handle adding all filtered monsters to combat in batch
   *
   * Converts each Monster to Combatant and adds them to the combat tracker.
   * For duplicate names (e.g., multiple Goblins), adds instance numbers (Goblin 1, Goblin 2).
   * Shows success toast with count of monsters added.
   *
   * @param monsters - Array of monsters to add to combat
   */
  const handleAddAllToCombat = (monsters: Monster[]) => {
    try {
      // Track name counts for disambiguation (e.g., "Goblin 1", "Goblin 2")
      const nameCounts = new Map<string, number>()

      monsters.forEach((monster) => {
        // Get current count for this name
        const count = nameCounts.get(monster.name) || 0
        const instanceName = count > 0 ? `${monster.name} ${count + 1}` : monster.name

        // Create combatant with instance name if needed
        const combatant = createCombatantFromMonster(
          monster,
          undefined, // initiative defaults to AC
          instanceName !== monster.name ? instanceName : undefined
        )

        // Add to combat
        addCombatant(combatant)

        // Increment count for next instance
        nameCounts.set(monster.name, count + 1)
      })

      // Show success toast
      setToast({
        type: 'success',
        message: `${monsters.length} ${monsters.length === 1 ? 'monster' : 'monsters'} added to combat!`,
      })
    } catch (error) {
      console.error('Failed to add monsters to combat:', error)
      setToast({
        type: 'error',
        message: 'Failed to add monsters to combat',
      })
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-red-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="mb-8 text-center">
            <h1 className="text-5xl font-bold text-red-400 mb-3">
              🐉 Monster Library
            </h1>
            <p className="text-orange-200 text-lg">
              Browse monsters, filter by type, and add them to combat encounters
            </p>
          </div>

          {/* Monster Library Component */}
          <MonsterLibrary
            onAddToCombat={handleAddToCombat}
            onAddAllToCombat={handleAddAllToCombat}
          />

          {/* Quick Action Links */}
          <div className="mt-12 flex flex-wrap gap-4 justify-center">
            <Link
              href="/combat"
              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-lg transition-colors"
            >
              ⚔️ Go to Combat Tracker
            </Link>
            <Link
              href="/dashboard"
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg shadow-lg transition-colors"
            >
              📊 Back to Dashboard
            </Link>
            <Link
              href="/characters"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg transition-colors"
            >
              👥 Manage Characters
            </Link>
          </div>
        </div>
      </div>

      {/* Toast Notifications */}
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onDismiss={() => setToast(null)}
          duration={3000}
        />
      )}
    </main>
  )
}
