/**
 * ErrorBoundary Component
 *
 * React error boundary for catching and handling errors gracefully.
 * Prevents the entire app from crashing when errors occur.
 *
 * Features:
 * - Catches JavaScript errors anywhere in child component tree
 * - Displays fallback UI instead of crashing
 * - Logs error details for debugging
 * - Provides reset functionality to recover
 * - Optional custom fallback UI
 *
 * @module components/ui/ErrorBoundary
 *
 * @example
 * ```tsx
 * // Wrap your app or specific components
 * <ErrorBoundary>
 *   <App />
 * </ErrorBoundary>
 *
 * // With custom fallback
 * <ErrorBoundary fallback={<CustomErrorPage />}>
 *   <RiskyComponent />
 * </ErrorBoundary>
 * ```
 */

'use client'

import { Component, ReactNode } from 'react'

interface ErrorBoundaryProps {
  /**
   * Child components to render
   */
  children: ReactNode

  /**
   * Optional custom fallback UI to show when error occurs
   */
  fallback?: ReactNode

  /**
   * Optional callback when error occurs
   */
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

/**
 * ErrorBoundary component
 *
 * Catches errors in child components and displays fallback UI.
 * Implements React error boundary pattern.
 *
 * @class
 */
export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
    }
  }

  /**
   * Update state when error occurs
   */
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    }
  }

  /**
   * Log error details
   */
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)

    // Call optional error handler
    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }
  }

  /**
   * Reset error state and try again
   */
  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
    })
  }

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback
      }

      // Default fallback UI
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-8">
          <div className="max-w-2xl w-full bg-white/10 backdrop-blur-sm rounded-lg p-8 shadow-2xl">
            <div className="text-center">
              {/* Error Icon */}
              <div className="text-6xl mb-4">⚠️</div>

              {/* Error Title */}
              <h1 className="text-3xl font-bold text-white mb-4">
                Something Went Wrong
              </h1>

              {/* Error Description */}
              <p className="text-gray-300 mb-6">
                The application encountered an unexpected error. This could be due to
                corrupted data or a bug in the application.
              </p>

              {/* Error Details (collapsed) */}
              {this.state.error && (
                <details className="mb-6 text-left">
                  <summary className="text-sm text-gray-400 cursor-pointer hover:text-gray-300 mb-2">
                    Technical Details
                  </summary>
                  <pre className="text-xs bg-black/30 rounded p-4 overflow-auto text-red-300">
                    {this.state.error.toString()}
                    {'\n\n'}
                    {this.state.error.stack}
                  </pre>
                </details>
              )}

              {/* Action Buttons */}
              <div className="flex gap-4 justify-center">
                <button
                  onClick={this.handleReset}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
                >
                  Try Again
                </button>
                <button
                  onClick={() => window.location.href = '/'}
                  className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition-colors"
                >
                  Go Home
                </button>
                <button
                  onClick={() => {
                    localStorage.clear()
                    window.location.reload()
                  }}
                  className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors"
                >
                  Clear Data & Reload
                </button>
              </div>

              {/* Help Text */}
              <p className="text-sm text-gray-400 mt-6">
                If the problem persists, try clearing your browser data or contact support.
              </p>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
