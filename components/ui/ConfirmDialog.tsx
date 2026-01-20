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
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={handleCancel}
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
    >
      <div
        className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Title */}
        <h3 id="dialog-title" className="text-xl font-bold mb-3">
          {title}
        </h3>

        {/* Message */}
        <p className="text-gray-700 mb-6">{message}</p>

        {/* Actions */}
        <div className="flex gap-3 justify-end">
          <button
            onClick={handleCancel}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
            autoFocus
          >
            {cancelText}
          </button>
          <button
            onClick={handleConfirm}
            className={`px-4 py-2 rounded-md transition-colors ${
              isDangerous
                ? 'bg-red-600 text-white hover:bg-red-700'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}
