/**
 * Tests for Toast Component
 */

import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Toast } from '@/components/ui/Toast'

describe('Toast', () => {
  // Mock timers for auto-dismiss tests
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.runOnlyPendingTimers()
    jest.useRealTimers()
  })

  describe('Rendering', () => {
    it('should render toast with message', () => {
      render(<Toast type="info" message="Test message" />)
      expect(screen.getByText('Test message')).toBeInTheDocument()
    })

    it('should have alert role', () => {
      render(<Toast type="info" message="Test" />)
      const toast = screen.getByRole('alert')
      expect(toast).toBeInTheDocument()
    })

    it('should have aria-live attribute', () => {
      render(<Toast type="info" message="Test" />)
      const toast = screen.getByRole('alert')
      expect(toast).toHaveAttribute('aria-live', 'polite')
    })
  })

  describe('Toast Types', () => {
    it('should render success toast with green styling', () => {
      const { container } = render(<Toast type="success" message="Success!" />)
      expect(screen.getByText('✅')).toBeInTheDocument()
      const toast = container.querySelector('.border-green-500')
      expect(toast).toBeInTheDocument()
    })

    it('should render error toast with red styling', () => {
      const { container } = render(<Toast type="error" message="Error!" />)
      expect(screen.getByText('❌')).toBeInTheDocument()
      const toast = container.querySelector('.border-red-500')
      expect(toast).toBeInTheDocument()
    })

    it('should render warning toast with yellow styling', () => {
      const { container } = render(<Toast type="warning" message="Warning!" />)
      expect(screen.getByText('⚠️')).toBeInTheDocument()
      const toast = container.querySelector('.border-yellow-500')
      expect(toast).toBeInTheDocument()
    })

    it('should render info toast with blue styling', () => {
      const { container } = render(<Toast type="info" message="Info!" />)
      expect(screen.getByText('ℹ️')).toBeInTheDocument()
      const toast = container.querySelector('.border-blue-500')
      expect(toast).toBeInTheDocument()
    })
  })

  describe('Auto-dismiss', () => {
    it('should call onDismiss after default duration', () => {
      const onDismiss = jest.fn()
      render(<Toast type="info" message="Test" onDismiss={onDismiss} />)

      // Fast-forward 3 seconds (default duration)
      jest.advanceTimersByTime(3000)

      expect(onDismiss).toHaveBeenCalledTimes(1)
    })

    it('should call onDismiss after custom duration', () => {
      const onDismiss = jest.fn()
      render(
        <Toast type="info" message="Test" duration={5000} onDismiss={onDismiss} />
      )

      // Fast-forward 5 seconds
      jest.advanceTimersByTime(5000)

      expect(onDismiss).toHaveBeenCalledTimes(1)
    })

    it('should not auto-dismiss when duration is 0', () => {
      const onDismiss = jest.fn()
      render(
        <Toast type="info" message="Test" duration={0} onDismiss={onDismiss} />
      )

      // Fast-forward 10 seconds
      jest.advanceTimersByTime(10000)

      expect(onDismiss).not.toHaveBeenCalled()
    })

    it('should not crash if onDismiss is not provided', () => {
      expect(() => {
        render(<Toast type="info" message="Test" />)
        jest.advanceTimersByTime(3000)
      }).not.toThrow()
    })
  })

  describe('Manual Dismiss', () => {
    it('should render dismiss button by default', () => {
      const onDismiss = jest.fn()
      render(<Toast type="info" message="Test" onDismiss={onDismiss} />)

      const dismissButton = screen.getByLabelText('Dismiss notification')
      expect(dismissButton).toBeInTheDocument()
    })

    it('should call onDismiss when dismiss button clicked', async () => {
      const user = userEvent.setup({ delay: null })
      const onDismiss = jest.fn()
      render(<Toast type="info" message="Test" onDismiss={onDismiss} />)

      const dismissButton = screen.getByLabelText('Dismiss notification')
      await user.click(dismissButton)

      expect(onDismiss).toHaveBeenCalledTimes(1)
    })

    it('should not render dismiss button when showDismiss is false', () => {
      const onDismiss = jest.fn()
      render(
        <Toast
          type="info"
          message="Test"
          showDismiss={false}
          onDismiss={onDismiss}
        />
      )

      expect(
        screen.queryByLabelText('Dismiss notification')
      ).not.toBeInTheDocument()
    })

    it('should not render dismiss button when no onDismiss callback', () => {
      render(<Toast type="info" message="Test" showDismiss={true} />)

      expect(
        screen.queryByLabelText('Dismiss notification')
      ).not.toBeInTheDocument()
    })
  })

  describe('Positioning and Animation', () => {
    it('should have fixed positioning in top-right', () => {
      const { container } = render(<Toast type="info" message="Test" />)
      const toast = container.querySelector('.fixed.top-4.right-4')
      expect(toast).toBeInTheDocument()
    })

    it('should have slide-in animation class', () => {
      const { container } = render(<Toast type="info" message="Test" />)
      const toast = container.querySelector('.animate-slide-in-right')
      expect(toast).toBeInTheDocument()
    })

    it('should have backdrop blur effect', () => {
      const { container } = render(<Toast type="info" message="Test" />)
      const toast = container.querySelector('.backdrop-blur-sm')
      expect(toast).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('should have aria-atomic attribute', () => {
      render(<Toast type="info" message="Test" />)
      const toast = screen.getByRole('alert')
      expect(toast).toHaveAttribute('aria-atomic', 'true')
    })

    it('should hide icon from screen readers', () => {
      render(<Toast type="success" message="Test" />)
      const icon = screen.getByText('✅')
      expect(icon).toHaveAttribute('aria-hidden', 'true')
    })

    it('should have accessible dismiss button', () => {
      const onDismiss = jest.fn()
      render(<Toast type="info" message="Test" onDismiss={onDismiss} />)

      const dismissButton = screen.getByLabelText('Dismiss notification')
      expect(dismissButton).toHaveAttribute('aria-label', 'Dismiss notification')
    })
  })
})
