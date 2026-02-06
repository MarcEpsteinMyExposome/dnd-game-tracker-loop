'use client'

/**
 * Monster Library Page
 *
 * Browse and manage monster stat blocks for encounters.
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
import MonsterLibrary, { MonsterWithCount } from '@/components/monsters/MonsterLibrary'
import { MonsterForm } from '@/components/monsters/MonsterForm'
import { Monster } from '@/lib/schemas/monster.schema'
import { createCombatantFromMonster } from '@/lib/schemas/combatant.schema'
import { useGameStore } from '@/lib/store/gameStore'
import { Toast } from '@/components/ui/Toast'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'

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
  const deleteMonster = useGameStore((state) => state.deleteMonster)

  const [toast, setToast] = useState<{
    type: 'success' | 'error' | 'warning' | 'info'
    message: string
  } | null>(null)

  // Modal state for create/edit form
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingMonster, setEditingMonster] = useState<Monster | undefined>()

  // Modal state for delete confirmation
  const [deletingMonster, setDeletingMonster] = useState<Monster | undefined>()

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
        message: `${monsters.length} ${monsters.length === 1 ? 'outlaw' : 'outlaws'} added to combat!`,
      })
    } catch (error) {
      console.error('Failed to add monsters to combat:', error)
      setToast({
        type: 'error',
        message: 'Failed to add outlaws to combat',
      })
    }
  }

  /**
   * Handle loading a Quick Encounter
   *
   * Adds all monsters from the encounter with their specified counts.
   * Names are disambiguated with instance numbers (e.g., "Goblin 1", "Goblin 2").
   *
   * @param monstersWithCounts - Array of monsters with counts to add
   */
  const handleLoadEncounter = (monstersWithCounts: MonsterWithCount[]) => {
    try {
      // Track name counts across all monsters for disambiguation
      const nameCounts = new Map<string, number>()
      let totalAdded = 0

      monstersWithCounts.forEach(({ monster, count }) => {
        for (let i = 0; i < count; i++) {
          // Get current count for this name
          const currentCount = nameCounts.get(monster.name) || 0
          // Always add number suffix for encounters (even first instance) to distinguish copies
          const instanceName = `${monster.name} ${currentCount + 1}`

          // Create combatant with instance name
          const combatant = createCombatantFromMonster(
            monster,
            undefined, // initiative defaults to AC
            instanceName
          )

          // Add to combat
          addCombatant(combatant)

          // Increment count for next instance
          nameCounts.set(monster.name, currentCount + 1)
          totalAdded++
        }
      })

      // Show success toast
      setToast({
        type: 'success',
        message: `Encounter loaded! ${totalAdded} ${totalAdded === 1 ? 'outlaw' : 'outlaws'} added to combat!`,
      })
    } catch (error) {
      console.error('Failed to load encounter:', error)
      setToast({
        type: 'error',
        message: 'Failed to load encounter',
      })
    }
  }

  // Handle create monster
  const handleCreateMonster = () => {
    setEditingMonster(undefined)
    setIsFormOpen(true)
  }

  // Handle edit monster
  const handleEditMonster = (monster: Monster) => {
    setEditingMonster(monster)
    setIsFormOpen(true)
  }

  // Handle delete monster click (shows confirmation)
  const handleDeleteMonster = (monster: Monster) => {
    setDeletingMonster(monster)
  }

  // Confirm delete
  const confirmDelete = () => {
    if (deletingMonster) {
      deleteMonster(deletingMonster.id)
      setToast({
        type: 'success',
        message: `${deletingMonster.name} has been deleted`,
      })
      setDeletingMonster(undefined)
    }
  }

  // Handle form close
  const handleFormClose = () => {
    setIsFormOpen(false)
    setEditingMonster(undefined)
  }

  // Handle form success
  const handleFormSuccess = () => {
    setToast({
      type: 'success',
      message: editingMonster ? 'Outlaw updated!' : 'Outlaw created!',
    })
    handleFormClose()
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-stone-950 via-amber-950/70 to-stone-950 relative">
      {/* Atmospheric background - wanted poster vibes */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-1/4 right-1/3 w-64 h-64 bg-amber-600/25 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 left-1/4 w-56 h-56 bg-orange-600/20 rounded-full blur-2xl" />
        <div className="absolute top-1/2 left-1/2 w-40 h-40 bg-red-600/15 rounded-full blur-xl" />
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="mb-8 text-center">
            <h1 className="text-5xl font-bold mb-3">
              <span className="mr-2">🦂</span>
              <span className="bg-gradient-to-r from-amber-300 via-orange-400 to-amber-300 bg-clip-text text-transparent">
                Outlaw Bounties
              </span>
            </h1>
            <p className="text-amber-200/80 text-lg">
              Browse wanted outlaws, filter by type, and add them to showdowns
            </p>
          </div>

          {/* Monster Library Component */}
          <MonsterLibrary
            onAddToCombat={handleAddToCombat}
            onAddAllToCombat={handleAddAllToCombat}
            onLoadEncounter={handleLoadEncounter}
            onCreateMonster={handleCreateMonster}
            onEditMonster={handleEditMonster}
            onDeleteMonster={handleDeleteMonster}
          />

          {/* Quick Action Links */}
          <div className="mt-12 flex flex-wrap gap-4 justify-center">
            <Link
              href="/combat"
              className="px-6 py-3 bg-gradient-to-r from-red-700 to-rose-600 hover:from-red-600 hover:to-rose-500 text-white font-semibold rounded-lg shadow-lg transition-all border border-red-500/30"
            >
              💥 Go to Showdown
            </Link>
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

      {/* Monster Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-stone-900 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-hidden border border-stone-700 shadow-xl">
            <h3 className="text-xl font-bold text-amber-200 mb-4">
              {editingMonster ? `Edit ${editingMonster.name}` : '✨ Create New Outlaw'}
            </h3>
            <MonsterForm
              monster={editingMonster}
              onClose={handleFormClose}
              onSuccess={handleFormSuccess}
            />
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deletingMonster && (
        <ConfirmDialog
          title="Delete Outlaw"
          message={`Are you sure you want to delete ${deletingMonster.name}? This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
          isDangerous={true}
          onConfirm={confirmDelete}
          onCancel={() => setDeletingMonster(undefined)}
        />
      )}
    </main>
  )
}
