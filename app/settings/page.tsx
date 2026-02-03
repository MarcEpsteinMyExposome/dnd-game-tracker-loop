/**
 * Settings Page
 *
 * Data management page for Bang Your Dead.
 * Provides export, import, and clear data functionality.
 *
 * Features:
 * - Export game state to JSON file (with timestamp)
 * - Import game state from JSON file (with validation)
 * - Clear all data (with confirmation)
 * - View current data statistics (character count, etc.)
 * - View localStorage usage (approximate)
 *
 * Route: /settings
 *
 * @module app/settings/page
 */

'use client'

import { useState, useRef, ChangeEvent, useEffect } from 'react'
import { useGameStore } from '@/lib/store/gameStore'
import { downloadGameState, importGameStateFromFile } from '@/lib/storage/exportImport'
import { getLocalStorageSize } from '@/lib/storage/localStorage'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { Toast, ToastType } from '@/components/ui/Toast'

export default function SettingsPage() {
  const [isImporting, setIsImporting] = useState(false)
  const [toastMessage, setToastMessage] = useState<{
    type: ToastType
    message: string
  } | null>(null)
  const [showClearConfirm, setShowClearConfirm] = useState(false)
  const [storageBytes, setStorageBytes] = useState<number>(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Get store data and actions
  const characters = useGameStore((state) => state.characters)
  const combatants = useGameStore((state) => state.combatants)
  const isInCombat = useGameStore((state) => state.isInCombat)

  /**
   * Handle export button click
   * Downloads game state as JSON file with timestamp
   */
  const handleExport = () => {
    const state = useGameStore.getState()
    downloadGameState(state)

    // Show success toast
    setToastMessage({
      type: 'success',
      message: 'Data exported successfully!',
    })
  }

  /**
   * Handle import file selection
   * Validates and loads game state from uploaded JSON file
   */
  const handleImport = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Clear previous messages and show loading
    setToastMessage(null)
    setIsImporting(true)

    // Import and validate file
    const result = await importGameStateFromFile(file)

    setIsImporting(false)

    if (result.success && result.data) {
      // Load data into store
      useGameStore.setState(result.data)
      setToastMessage({
        type: 'success',
        message: 'Data imported successfully! Page will refresh...',
      })

      // Refresh page after brief delay to re-render with new data
      setTimeout(() => window.location.reload(), 1500)
    } else {
      setToastMessage({
        type: 'error',
        message: result.error || 'Import failed',
      })
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  /**
   * Handle clear all data
   * Resets store to initial state after confirmation
   */
  const handleClearAll = () => {
    // Reset store to empty state
    useGameStore.setState({
      characters: [],
      combatants: [],
      round: 1,
      isInCombat: false,
    })

    setShowClearConfirm(false)
    setToastMessage({
      type: 'success',
      message: 'All data cleared successfully!',
    })
  }

  // Calculate localStorage usage on client-side only to avoid hydration mismatch
  useEffect(() => {
    setStorageBytes(getLocalStorageSize())
  }, [characters, combatants]) // Recalculate when data changes

  const storageMB = (storageBytes / (1024 * 1024)).toFixed(2)
  const storageKB = (storageBytes / 1024).toFixed(2)

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-950 via-stone-900/80 to-stone-950 p-8 relative">
      {/* Atmospheric background */}
      <div className="absolute inset-0 opacity-15 pointer-events-none">
        <div className="absolute top-1/3 right-1/4 w-48 h-48 bg-amber-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/3 w-40 h-40 bg-purple-600/20 rounded-full blur-2xl" />
      </div>

      {/* Loading overlay during import */}
      {isImporting && (
        <LoadingSpinner overlay message="Importing your data..." size="lg" />
      )}

      {/* Toast notifications */}
      {toastMessage && (
        <Toast
          type={toastMessage.type}
          message={toastMessage.message}
          onDismiss={() => setToastMessage(null)}
        />
      )}

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            <span className="mr-2">⚙️</span>
            <span className="bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-200 bg-clip-text text-transparent">
              Settings & Data Management
            </span>
          </h1>
          <p className="text-amber-100/70">
            Manage your game data: export backups, import saves, or clear everything.
          </p>
        </div>

        {/* Data Statistics */}
        <div className="bg-stone-900/60 backdrop-blur-sm rounded-lg p-6 mb-8 border border-amber-900/30">
          <h2 className="text-2xl font-bold text-amber-200 mb-4">⭐ Current Data</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Character Count */}
            <div className="bg-sky-900/30 border border-sky-600/40 rounded-lg p-4">
              <div className="text-3xl font-bold text-sky-200 mb-1">
                {characters.length}
              </div>
              <div className="text-sm text-sky-300">🤠 Posse Members</div>
            </div>

            {/* Combat Status */}
            <div className={`border rounded-lg p-4 ${
              isInCombat
                ? 'bg-red-900/30 border-red-600/40'
                : 'bg-green-900/30 border-green-600/40'
            }`}>
              <div className={`text-3xl font-bold mb-1 ${
                isInCombat ? 'text-red-200' : 'text-green-200'
              }`}>
                {isInCombat ? combatants.length : 'None'}
              </div>
              <div className={`text-sm ${
                isInCombat ? 'text-red-300' : 'text-green-300'
              }`}>
                {isInCombat ? '💥 In Showdown' : '✨ No Active Showdown'}
              </div>
            </div>

            {/* Storage Usage */}
            <div className="bg-purple-900/30 border border-purple-600/40 rounded-lg p-4">
              <div className="text-3xl font-bold text-purple-200 mb-1">
                {parseFloat(storageMB) > 0 ? `${storageMB} MB` : `${storageKB} KB`}
              </div>
              <div className="text-sm text-purple-300">💾 Storage Used</div>
            </div>
          </div>
        </div>

        {/* Data Management Actions */}
        <div className="bg-stone-900/60 backdrop-blur-sm rounded-lg p-6 mb-8 border border-amber-900/30">
          <h2 className="text-2xl font-bold text-amber-200 mb-4">💾 Data Management</h2>

          <div className="space-y-4">
            {/* Export Data */}
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-amber-100 mb-1">
                  Export Data
                </h3>
                <p className="text-sm text-stone-400 mb-2">
                  Download your game data as a JSON file. Includes all characters, combat state, and settings.
                  Filename includes current date for easy organization.
                </p>
              </div>
              <button
                onClick={handleExport}
                className="px-6 py-3 bg-gradient-to-r from-sky-700 to-blue-600 hover:from-sky-600 hover:to-blue-500 text-white font-semibold rounded-lg transition-all border border-sky-500/30"
              >
                📥 Export
              </button>
            </div>

            <hr className="border-stone-700" />

            {/* Import Data */}
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-amber-100 mb-1">
                  Import Data
                </h3>
                <p className="text-sm text-stone-400 mb-2">
                  Load game data from a previously exported JSON file. This will replace all current data.
                  Make sure to export your current data first if you want to keep it!
                </p>
              </div>
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json"
                  onChange={handleImport}
                  className="hidden"
                  id="import-file-input"
                />
                <label
                  htmlFor="import-file-input"
                  className="inline-block px-6 py-3 bg-gradient-to-r from-green-700 to-emerald-600 hover:from-green-600 hover:to-emerald-500 text-white font-semibold rounded-lg transition-all cursor-pointer border border-green-500/30"
                >
                  📤 Import
                </label>
              </div>
            </div>

            <hr className="border-stone-700" />

            {/* Clear All Data */}
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-amber-100 mb-1">
                  Clear All Data
                </h3>
                <p className="text-sm text-stone-400 mb-2">
                  Delete all characters, combat state, and stored data. This action cannot be undone.
                  Export your data first if you want to keep a backup!
                </p>
              </div>
              <button
                onClick={() => setShowClearConfirm(true)}
                className="px-6 py-3 bg-gradient-to-r from-red-700 to-rose-600 hover:from-red-600 hover:to-rose-500 text-white font-semibold rounded-lg transition-all border border-red-500/30"
              >
                🗑️ Clear All
              </button>
            </div>
          </div>
        </div>

        {/* Storage Information */}
        <div className="bg-stone-900/60 backdrop-blur-sm rounded-lg p-6 border border-amber-900/30">
          <h2 className="text-2xl font-bold text-amber-200 mb-4">ℹ️ Storage Information</h2>
          <div className="text-sm text-stone-400 space-y-2">
            <p>
              <strong className="text-amber-100">Storage Location:</strong> Browser localStorage (typically 5-10MB limit)
            </p>
            <p>
              <strong className="text-amber-100">What&apos;s Saved:</strong> Characters, combat state, round counter, and game settings
            </p>
            <p>
              <strong className="text-amber-100">Auto-Save:</strong> Data is automatically saved whenever you make changes
            </p>
            <p>
              <strong className="text-amber-100">Export Format:</strong> JSON files that can be imported on any device
            </p>
            <p className="text-amber-300">
              ⚠️ <strong>Important:</strong> Clearing browser data will delete your saved game.
              Export regularly to keep backups!
            </p>
          </div>
        </div>

        {/* Quick Navigation */}
        <div className="mt-8 flex gap-4 justify-center">
          <a
            href="/dashboard"
            className="px-6 py-3 bg-stone-800 hover:bg-stone-700 text-amber-100 rounded-lg transition-colors border border-stone-700"
          >
            ⭐ Back to Dashboard
          </a>
          <a
            href="/characters"
            className="px-6 py-3 bg-stone-800 hover:bg-stone-700 text-amber-100 rounded-lg transition-colors border border-stone-700"
          >
            🤠 Manage Posse
          </a>
        </div>
      </div>

      {/* Clear All Confirmation Dialog */}
      {showClearConfirm && (
        <ConfirmDialog
          title="Clear All Data?"
          message="This will permanently delete all characters, combat data, and settings. This action cannot be undone. Are you sure?"
          confirmText="Yes, Clear Everything"
          cancelText="Cancel"
          isDangerous={true}
          onConfirm={handleClearAll}
          onCancel={() => setShowClearConfirm(false)}
        />
      )}
    </div>
  )
}
