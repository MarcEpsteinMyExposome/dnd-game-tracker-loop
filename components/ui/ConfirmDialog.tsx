'use client'

/**
 * Confirm Dialog Component
 *
 * Reusable confirmation dialog for destructive actions.
 * Displays a message and provides Confirm/Cancel buttons.
 */

interface ConfirmDialogProps {
  /**
   * Dialog title
   */
  title: string

  /**
   * Confirmation message or question
   */
  message: string

  /**
   * Text for confirm button (default: "Confirm")
   */
  confirmText?: string

  /**
   * Text for cancel button (default: "Cancel")
   */
  cancelText?: string

  /**
   * Callback when user confirms
   */
  onConfirm: () => void

  /**
   * Callback when user cancels or closes dialog
   */
  onCancel: () => void

  /**
   * Whether this is a dangerous action (uses red confirm button)
   * Default: true
   */
  isDangerous?: boolean
}

export function ConfirmDialog({
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  isDangerous = true,
}: ConfirmDialogProps) {
  const handleConfirm = () => {
    onConfirm()
  }

  const handleCancel = () => {
    onCancel()
  }

  // Close on escape key
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleCancel()
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={handleCancel}
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
    >
      <div
        className="bg-gradient-to-br from-stone-800 to-stone-900 rounded-xl p-6 max-w-md w-full shadow-2xl border border-amber-900/40"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Title */}
        <h3 id="dialog-title" className="text-xl font-bold mb-3 text-amber-100">
          {title}
        </h3>

        {/* Message */}
        <p className="text-stone-300 mb-6">{message}</p>

        {/* Actions */}
        <div className="flex gap-3 justify-end">
          <button
            onClick={handleCancel}
            className="px-4 py-2 bg-stone-700 text-stone-200 rounded-lg hover:bg-stone-600 transition-colors border border-stone-600/50"
            autoFocus
          >
            {cancelText}
          </button>
          <button
            onClick={handleConfirm}
            className={`px-4 py-2 rounded-lg transition-all font-semibold ${
              isDangerous
                ? 'bg-gradient-to-r from-red-700 to-rose-600 text-white hover:from-red-600 hover:to-rose-500 border border-red-500/30'
                : 'bg-gradient-to-r from-sky-700 to-blue-600 text-white hover:from-sky-600 hover:to-blue-500 border border-sky-500/30'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}
