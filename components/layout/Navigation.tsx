'use client'

/**
 * Navigation Component
 *
 * Main navigation bar for the application with links to all pages
 * and a global dice roller accessible from anywhere.
 *
 * Features:
 * - Links to Dashboard, Characters, Combat, Outlaws, and Settings
 * - Dice roller button that opens a modal
 * - Western theme styling with amber/gold accents
 */

import { useState } from 'react'
import Link from 'next/link'
import { DiceRollerModal } from '@/components/dice'

/**
 * Navigation - Main app navigation bar
 *
 * Includes all main navigation links plus a dice roller button
 * that opens a modal for rolling dice from any page.
 */
export function Navigation() {
  const [showDiceModal, setShowDiceModal] = useState(false)

  return (
    <>
      <nav className="bg-gradient-to-r from-stone-900 via-amber-950 to-stone-900 text-amber-100 shadow-lg border-b border-amber-900/50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link
              href="/"
              className="text-xl font-bold hover:text-amber-300 transition-colors flex items-center gap-2"
            >
              <span className="text-2xl">🔫</span>
              <span className="bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-200 bg-clip-text text-transparent">
                Bang Your Dead
              </span>
            </Link>
            <div className="flex gap-6 items-center">
              <Link
                href="/dashboard"
                className="hover:text-amber-300 transition-colors font-medium flex items-center gap-1"
              >
                <span className="text-sm">⭐</span> Dashboard
              </Link>
              <Link
                href="/characters"
                className="hover:text-amber-300 transition-colors font-medium flex items-center gap-1"
              >
                <span className="text-sm">🤠</span> Characters
              </Link>
              <Link
                href="/combat"
                className="hover:text-amber-300 transition-colors font-medium flex items-center gap-1"
              >
                <span className="text-sm">💥</span> Combat
              </Link>
              <Link
                href="/monsters"
                className="hover:text-amber-300 transition-colors font-medium flex items-center gap-1"
              >
                <span className="text-sm">🦂</span> Outlaws
              </Link>
              <Link
                href="/settings"
                className="hover:text-amber-300 transition-colors font-medium flex items-center gap-1"
              >
                <span className="text-sm">⚙️</span> Settings
              </Link>

              {/* Dice Roller Button */}
              <button
                onClick={() => setShowDiceModal(true)}
                className="ml-2 px-3 py-1.5 bg-gradient-to-r from-purple-700/80 to-violet-600/80 hover:from-purple-600 hover:to-violet-500 text-white font-medium rounded-lg transition-all border border-purple-500/30 flex items-center gap-1.5 shadow-lg shadow-purple-900/20"
                aria-label="Open dice roller"
                title="Roll Dice"
              >
                <span className="text-base">🎲</span>
                <span className="hidden sm:inline text-sm">Dice</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Dice Roller Modal */}
      {showDiceModal && (
        <DiceRollerModal onClose={() => setShowDiceModal(false)} />
      )}
    </>
  )
}
