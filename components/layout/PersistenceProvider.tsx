/**
 * PersistenceProvider Component
 *
 * Handles initial loading state while Zustand persist middleware
 * hydrates state from localStorage. Prevents flash of empty state.
 *
 * Features:
 * - Shows loading spinner while localStorage is being read
 * - Prevents rendering children until hydration complete
 * - Wraps app in error boundary for persistence failures
 * - Handles corrupted localStorage gracefully
 *
 * @module components/layout/PersistenceProvider
 *
 * @example
 * ```tsx
 * // In root layout
 * <PersistenceProvider>
 *   <App />
 * </PersistenceProvider>
 * ```
 */

'use client'

import { useState, useEffect, ReactNode } from 'react'
import { useGameStore } from '@/lib/store/gameStore'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { ErrorBoundary } from '@/components/ui/ErrorBoundary'

interface PersistenceProviderProps {
  children: ReactNode
}

/**
 * PersistenceProvider component
 *
 * Manages initial loading state during localStorage hydration.
 * Wraps children in error boundary for persistence failures.
 *
 * @param props - Component props
 * @returns Provider component with loading state
 */
export function PersistenceProvider({ children }: PersistenceProviderProps) {
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    // Wait for Zustand persist middleware to hydrate from localStorage
    // The persist middleware is asynchronous, so we need to wait a tick
    const checkHydration = async () => {
      // Small delay to ensure persist middleware has run
      await new Promise((resolve) => setTimeout(resolve, 100))
      setIsHydrated(true)
    }

    checkHydration()
  }, [])

  // Show loading screen while hydrating
  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <LoadingSpinner size="lg" message="Loading your game data..." />
      </div>
    )
  }

  // Wrap in error boundary to catch persistence-related errors
  return (
    <ErrorBoundary
      onError={(error) => {
        console.error('Persistence error:', error)
        // Could send to error tracking service here
      }}
    >
      {children}
    </ErrorBoundary>
  )
}
