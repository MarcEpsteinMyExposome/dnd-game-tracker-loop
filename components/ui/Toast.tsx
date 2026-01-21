/**
 * Toast Component
 *
 * A toast notification component for displaying temporary messages.
 * Automatically dismisses after a configurable duration.
 *
 * Features:
 * - Success, error, warning, and info variants
 * - Auto-dismiss with configurable duration
 * - Manual dismiss button
 * - Slide-in animation
 * - Accessible with ARIA attributes
 *
 * @module components/ui/Toast
 *
 * @example
 * ```tsx
 * // Success toast
 * <Toast type="success" message="Data saved successfully!" />
 *
 * // Error toast with custom duration
 * <Toast type="error" message="Failed to load data" duration={5000} />
 *
 * // Toast with onDismiss callback
 * <Toast
 *   type="info"
 *   message="Import complete"
 *   onDismiss={() => console.log('dismissed')}
 * />
 * ```
 */

import { useEffect } from 'react'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

interface ToastProps {
  /**
   * Type of toast notification
   */
  type: ToastType

  /**
   * Message to display
   */
  message: string

  /**
   * Auto-dismiss duration in milliseconds
   * Set to 0 to disable auto-dismiss
   * @default 3000
   */
  duration?: number

  /**
   * Callback when toast is dismissed
   */
  onDismiss?: () => void

  /**
   * Show dismiss button
   * @default true
   */
  showDismiss?: boolean
}

/**
 * Toast notification component
 *
 * Displays a temporary notification message with auto-dismiss.
 *
 * @param props - Component props
 * @returns Toast notification component
 */
export function Toast({
  type,
  message,
  duration = 3000,
  onDismiss,
  showDismiss = true,
}: ToastProps) {
  // Auto-dismiss after duration
  useEffect(() => {
    if (duration > 0 && onDismiss) {
      const timer = setTimeout(onDismiss, duration)
      return () => clearTimeout(timer)
    }
  }, [duration, onDismiss])

  // Type-specific styling
  const typeStyles = {
    success: {
      bg: 'bg-green-500/20 border-green-500',
      text: 'text-green-200',
      icon: '✅',
    },
    error: {
      bg: 'bg-red-500/20 border-red-500',
      text: 'text-red-200',
      icon: '❌',
    },
    warning: {
      bg: 'bg-yellow-500/20 border-yellow-500',
      text: 'text-yellow-200',
      icon: '⚠️',
    },
    info: {
      bg: 'bg-blue-500/20 border-blue-500',
      text: 'text-blue-200',
      icon: 'ℹ️',
    },
  }

  const styles = typeStyles[type]

  return (
    <div
      className={`fixed top-4 right-4 z-50 max-w-md animate-slide-in-right ${styles.bg} border ${styles.text} rounded-lg p-4 shadow-lg backdrop-blur-sm`}
      role="alert"
      aria-live="polite"
      aria-atomic="true"
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <span className="text-2xl flex-shrink-0" aria-hidden="true">
          {styles.icon}
        </span>

        {/* Message */}
        <p className="flex-1 font-medium">{message}</p>

        {/* Dismiss button */}
        {showDismiss && onDismiss && (
          <button
            onClick={onDismiss}
            className="flex-shrink-0 text-xl opacity-70 hover:opacity-100 transition-opacity"
            aria-label="Dismiss notification"
          >
            ×
          </button>
        )}
      </div>
    </div>
  )
}
