/**
 * Settings Page
 *
 * Data management page for the D&D Game Tracker.
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
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

      <div className="max-w-4xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            ⚙️ Settings & Data Management
          </h1>
          <p className="text-gray-300">
            Manage your game data: export backups, import saves, or clear everything.
          </p>
        </div>

        {/* Data Statistics */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">📊 Current Data</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Character Count */}
            <div className="bg-blue-500/20 border border-blue-500/50 rounded-lg p-4">
              <div className="text-3xl font-bold text-blue-200 mb-1">
                {characters.length}
              </div>
              <div className="text-sm text-blue-300">Characters</div>
            </div>

            {/* Combat Status */}
            <div className={`border rounded-lg p-4 ${
              isInCombat
                ? 'bg-red-500/20 border-red-500/50'
                : 'bg-green-500/20 border-green-500/50'
            }`}>
              <div className={`text-3xl font-bold mb-1 ${
                isInCombat ? 'text-red-200' : 'text-green-200'
              }`}>
                {isInCombat ? combatants.length : 'None'}
              </div>
              <div className={`text-sm ${
                isInCombat ? 'text-red-300' : 'text-green-300'
              }`}>
                {isInCombat ? 'In Combat' : 'No Active Combat'}
              </div>
            </div>

            {/* Storage Usage */}
            <div className="bg-purple-500/20 border border-purple-500/50 rounded-lg p-4">
              <div className="text-3xl font-bold text-purple-200 mb-1">
                {parseFloat(storageMB) > 0 ? `${storageMB} MB` : `${storageKB} KB`}
              </div>
              <div className="text-sm text-purple-300">Storage Used</div>
            </div>
          </div>
        </div>

        {/* Data Management Actions */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">💾 Data Management</h2>

          <div className="space-y-4">
            {/* Export Data */}
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white mb-1">
                  Export Data
                </h3>
                <p className="text-sm text-gray-300 mb-2">
                  Download your game data as a JSON file. Includes all characters, combat state, and settings.
                  Filename includes current date for easy organization.
                </p>
              </div>
              <button
                onClick={handleExport}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
              >
                📥 Export
              </button>
            </div>

            <hr className="border-gray-600" />

            {/* Import Data */}
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white mb-1">
                  Import Data
                </h3>
                <p className="text-sm text-gray-300 mb-2">
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
                  className="inline-block px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  📤 Import
                </label>
              </div>
            </div>

            <hr className="border-gray-600" />

            {/* Clear All Data */}
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white mb-1">
                  Clear All Data
                </h3>
                <p className="text-sm text-gray-300 mb-2">
                  Delete all characters, combat state, and stored data. This action cannot be undone.
                  Export your data first if you want to keep a backup!
                </p>
              </div>
              <button
                onClick={() => setShowClearConfirm(true)}
                className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors"
              >
                🗑️ Clear All
              </button>
            </div>
          </div>
        </div>

        {/* Storage Information */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
          <h2 className="text-2xl font-bold text-white mb-4">ℹ️ Storage Information</h2>
          <div className="text-sm text-gray-300 space-y-2">
            <p>
              <strong>Storage Location:</strong> Browser localStorage (typically 5-10MB limit)
            </p>
            <p>
              <strong>What's Saved:</strong> Characters, combat state, round counter, and game settings
            </p>
            <p>
              <strong>Auto-Save:</strong> Data is automatically saved whenever you make changes
            </p>
            <p>
              <strong>Export Format:</strong> JSON files that can be imported on any device
            </p>
            <p className="text-yellow-300">
              ⚠️ <strong>Important:</strong> Clearing browser data will delete your saved game.
              Export regularly to keep backups!
            </p>
          </div>
        </div>

        {/* Quick Navigation */}
        <div className="mt-8 flex gap-4 justify-center">
          <a
            href="/dashboard"
            className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
          >
            ← Back to Dashboard
          </a>
          <a
            href="/characters"
            className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
          >
            Manage Characters
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
