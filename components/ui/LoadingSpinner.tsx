/**
 * LoadingSpinner Component
 *
 * A reusable loading spinner with optional overlay and message.
 * Used to indicate loading states throughout the application.
 *
 * Features:
 * - Animated spinning circle
 * - Optional fullscreen overlay (blocks interaction)
 * - Optional loading message
 * - Multiple size variants
 * - Accessible with ARIA labels
 *
 * @module components/ui/LoadingSpinner
 *
 * @example
 * ```tsx
 * // Simple inline spinner
 * <LoadingSpinner />
 *
 * // Fullscreen overlay with message
 * <LoadingSpinner overlay message="Loading your data..." />
 *
 * // Large spinner
 * <LoadingSpinner size="lg" />
 * ```
 */

interface LoadingSpinnerProps {
  /**
   * Size variant of the spinner
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg'

  /**
   * Optional message to display below spinner
   */
  message?: string

  /**
   * If true, renders as fullscreen overlay that blocks interaction
   * @default false
   */
  overlay?: boolean

  /**
   * Custom className for additional styling
   */
  className?: string
}

/**
 * LoadingSpinner component
 *
 * Displays an animated loading spinner with optional message and overlay.
 *
 * @param props - Component props
 * @returns Loading spinner component
 */
export function LoadingSpinner({
  size = 'md',
  message,
  overlay = false,
  className = '',
}: LoadingSpinnerProps) {
  // Size mapping for spinner dimensions
  const sizeClasses = {
    sm: 'w-6 h-6 border-2',
    md: 'w-10 h-10 border-3',
    lg: 'w-16 h-16 border-4',
  }

  // Text size for message
  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  }

  const spinner = (
    <div
      className={`inline-block ${sizeClasses[size]} border-purple-200 border-t-purple-500 rounded-full animate-spin ${className}`}
      role="status"
      aria-label={message || 'Loading'}
    />
  )

  const content = (
    <div className="flex flex-col items-center justify-center gap-3">
      {spinner}
      {message && (
        <p className={`${textSizeClasses[size]} text-gray-300 font-medium`}>
          {message}
        </p>
      )}
    </div>
  )

  // Render as fullscreen overlay if specified
  if (overlay) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        role="dialog"
        aria-modal="true"
        aria-labelledby="loading-message"
      >
        <div className="bg-slate-800/90 rounded-lg p-8 shadow-2xl">
          {content}
        </div>
      </div>
    )
  }

  // Render as inline spinner
  return content
}
