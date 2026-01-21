/**
 * Tests for LoadingSpinner Component
 */

import { render, screen } from '@testing-library/react'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

describe('LoadingSpinner', () => {
  describe('Rendering', () => {
    it('should render spinner with default props', () => {
      render(<LoadingSpinner />)
      const spinner = screen.getByRole('status')
      expect(spinner).toBeInTheDocument()
    })

    it('should render with custom message', () => {
      render(<LoadingSpinner message="Loading data..." />)
      expect(screen.getByText('Loading data...')).toBeInTheDocument()
    })

    it('should not render message when not provided', () => {
      const { container } = render(<LoadingSpinner />)
      const messages = container.querySelectorAll('p')
      expect(messages.length).toBe(0)
    })

    it('should have accessible label from message', () => {
      render(<LoadingSpinner message="Loading your game" />)
      const spinner = screen.getByRole('status')
      expect(spinner).toHaveAttribute('aria-label', 'Loading your game')
    })

    it('should have default accessible label when no message', () => {
      render(<LoadingSpinner />)
      const spinner = screen.getByRole('status')
      expect(spinner).toHaveAttribute('aria-label', 'Loading')
    })
  })

  describe('Size Variants', () => {
    it('should render small size', () => {
      const { container } = render(<LoadingSpinner size="sm" />)
      const spinner = container.querySelector('.w-6')
      expect(spinner).toBeInTheDocument()
    })

    it('should render medium size (default)', () => {
      const { container } = render(<LoadingSpinner size="md" />)
      const spinner = container.querySelector('.w-10')
      expect(spinner).toBeInTheDocument()
    })

    it('should render large size', () => {
      const { container } = render(<LoadingSpinner size="lg" />)
      const spinner = container.querySelector('.w-16')
      expect(spinner).toBeInTheDocument()
    })

    it('should apply correct text size for small spinner', () => {
      const { container } = render(<LoadingSpinner size="sm" message="Loading" />)
      const text = container.querySelector('.text-sm')
      expect(text).toBeInTheDocument()
    })

    it('should apply correct text size for large spinner', () => {
      const { container } = render(<LoadingSpinner size="lg" message="Loading" />)
      const text = container.querySelector('.text-lg')
      expect(text).toBeInTheDocument()
    })
  })

  describe('Overlay Mode', () => {
    it('should render as overlay when overlay prop is true', () => {
      render(<LoadingSpinner overlay />)
      const overlay = screen.getByRole('dialog')
      expect(overlay).toBeInTheDocument()
      expect(overlay).toHaveClass('fixed', 'inset-0')
    })

    it('should have modal attributes when overlay', () => {
      render(<LoadingSpinner overlay />)
      const overlay = screen.getByRole('dialog')
      expect(overlay).toHaveAttribute('aria-modal', 'true')
    })

    it('should not render as overlay by default', () => {
      render(<LoadingSpinner />)
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })

    it('should show message in overlay mode', () => {
      render(<LoadingSpinner overlay message="Loading..." />)
      expect(screen.getByText('Loading...')).toBeInTheDocument()
    })
  })

  describe('Custom Styling', () => {
    it('should apply custom className', () => {
      const { container } = render(<LoadingSpinner className="custom-class" />)
      const spinner = container.querySelector('.custom-class')
      expect(spinner).toBeInTheDocument()
    })

    it('should have spinning animation class', () => {
      const { container } = render(<LoadingSpinner />)
      const spinner = container.querySelector('.animate-spin')
      expect(spinner).toBeInTheDocument()
    })

    it('should have purple color scheme', () => {
      const { container } = render(<LoadingSpinner />)
      const spinner = container.querySelector('.border-purple-200')
      expect(spinner).toBeInTheDocument()
    })
  })
})
