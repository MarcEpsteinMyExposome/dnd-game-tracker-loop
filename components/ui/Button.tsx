/**
 * Button Component
 *
 * A reusable button component demonstrating testing patterns.
 * This is an example component to establish testing conventions.
 */

import React from 'react'

/**
 * Props for the Button component
 */
export interface ButtonProps {
  /** Text content to display in the button */
  children: React.ReactNode

  /** Click handler function */
  onClick?: () => void

  /** Whether the button is disabled */
  disabled?: boolean

  /** Button visual variant */
  variant?: 'primary' | 'secondary' | 'danger'

  /** Optional CSS class names */
  className?: string
}

/**
 * Button component for user interactions
 *
 * @description A styled button with support for different variants,
 * disabled state, and click handling. Used as a teaching example
 * for component testing patterns.
 *
 * @example
 * ```tsx
 * <Button onClick={handleClick}>Click me</Button>
 * <Button variant="danger" disabled>Delete</Button>
 * ```
 */
export function Button({
  children,
  onClick,
  disabled = false,
  variant = 'primary',
  className = '',
}: ButtonProps) {
  // Determine variant-specific styles
  // Using Tailwind CSS classes for styling
  const variantStyles = {
    primary: 'bg-amber-500 hover:bg-amber-600 text-white',
    secondary: 'bg-slate-600 hover:bg-slate-700 text-white',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
  }

  // Combine base styles with variant and custom classes
  const buttonClasses = [
    'px-4 py-2 rounded font-medium transition-colors',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    variantStyles[variant],
    className,
  ].join(' ')

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={buttonClasses}
    >
      {children}
    </button>
  )
}
