/**
 * DiceButton Component Tests
 *
 * Tests for components/dice/DiceButton.tsx functionality
 * Covers rendering, clicking, rolling, accessibility
 */

import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { DiceButton, DiceButtonRow } from '@/components/dice/DiceButton'

// Mock the roller module
jest.mock('@/lib/dice/roller', () => ({
  rollDie: jest.fn(() => 15),
  isStandardDie: jest.fn(() => true),
}))

describe('DiceButton', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('rendering', () => {
    it('should render with correct die label', () => {
      render(<DiceButton sides={20} />)

      expect(screen.getByRole('button', { name: /roll d20/i })).toBeInTheDocument()
      expect(screen.getByText('d20')).toBeInTheDocument()
    })

    it('should render different die types', () => {
      const { rerender } = render(<DiceButton sides={6} />)
      expect(screen.getByText('d6')).toBeInTheDocument()

      rerender(<DiceButton sides={8} />)
      expect(screen.getByText('d8')).toBeInTheDocument()

      rerender(<DiceButton sides={12} />)
      expect(screen.getByText('d12')).toBeInTheDocument()
    })

    it('should apply size classes', () => {
      const { rerender } = render(<DiceButton sides={20} size="sm" />)
      expect(screen.getByRole('button')).toHaveClass('w-12', 'h-12')

      rerender(<DiceButton sides={20} size="md" />)
      expect(screen.getByRole('button')).toHaveClass('w-16', 'h-16')

      rerender(<DiceButton sides={20} size="lg" />)
      expect(screen.getByRole('button')).toHaveClass('w-20', 'h-20')
    })

    it('should have accessible label', () => {
      render(<DiceButton sides={20} />)

      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('aria-label', 'Roll d20')
      expect(button).toHaveAttribute('title', 'Roll d20')
    })
  })

  describe('clicking and rolling', () => {
    it('should call onRoll with result when clicked', async () => {
      const handleRoll = jest.fn()
      render(<DiceButton sides={20} onRoll={handleRoll} />)

      fireEvent.click(screen.getByRole('button'))

      await waitFor(() => {
        expect(handleRoll).toHaveBeenCalledWith(15, 20)
      })
    })

    it('should show result after rolling when showResult is true', async () => {
      render(<DiceButton sides={20} showResult={true} />)

      fireEvent.click(screen.getByRole('button'))

      await waitFor(() => {
        expect(screen.getByText('15')).toBeInTheDocument()
      })
    })

    it('should not show result when showResult is false', async () => {
      render(<DiceButton sides={20} showResult={false} />)

      fireEvent.click(screen.getByRole('button'))

      await waitFor(() => {
        // Should still show d20, not the result
        expect(screen.getByText('d20')).toBeInTheDocument()
      })
    })

    it('should call onRoll with correct sides for different dice', async () => {
      const handleRoll = jest.fn()
      const { rerender } = render(<DiceButton sides={6} onRoll={handleRoll} />)

      fireEvent.click(screen.getByRole('button'))
      await waitFor(() => {
        expect(handleRoll).toHaveBeenCalledWith(15, 6)
      })

      handleRoll.mockClear()
      rerender(<DiceButton sides={12} onRoll={handleRoll} />)

      fireEvent.click(screen.getByRole('button'))
      await waitFor(() => {
        expect(handleRoll).toHaveBeenCalledWith(15, 12)
      })
    })
  })

  describe('disabled state', () => {
    it('should not roll when disabled', async () => {
      const handleRoll = jest.fn()
      render(<DiceButton sides={20} onRoll={handleRoll} disabled={true} />)

      const button = screen.getByRole('button')
      expect(button).toBeDisabled()

      fireEvent.click(button)

      // Wait a bit and check that onRoll was not called
      await new Promise((resolve) => setTimeout(resolve, 200))
      expect(handleRoll).not.toHaveBeenCalled()
    })

    it('should apply disabled styling', () => {
      render(<DiceButton sides={20} disabled={true} />)

      const button = screen.getByRole('button')
      expect(button).toHaveClass('cursor-not-allowed')
    })
  })
})

describe('DiceButtonRow', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render all standard dice', () => {
    render(<DiceButtonRow />)

    expect(screen.getByRole('button', { name: /roll d4/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /roll d6/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /roll d8/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /roll d10/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /roll d12/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /roll d20/i })).toBeInTheDocument()
  })

  it('should pass onRoll to all buttons', async () => {
    const handleRoll = jest.fn()
    render(<DiceButtonRow onRoll={handleRoll} />)

    fireEvent.click(screen.getByRole('button', { name: /roll d6/i }))

    await waitFor(() => {
      expect(handleRoll).toHaveBeenCalledWith(15, 6)
    })
  })

  it('should pass size to all buttons', () => {
    render(<DiceButtonRow size="lg" />)

    const buttons = screen.getAllByRole('button')
    buttons.forEach((button) => {
      expect(button).toHaveClass('w-20', 'h-20')
    })
  })

  it('should disable all buttons when disabled', () => {
    render(<DiceButtonRow disabled={true} />)

    const buttons = screen.getAllByRole('button')
    buttons.forEach((button) => {
      expect(button).toBeDisabled()
    })
  })

  it('should have accessible group role', () => {
    render(<DiceButtonRow />)

    expect(screen.getByRole('group', { name: /dice roller buttons/i })).toBeInTheDocument()
  })
})
