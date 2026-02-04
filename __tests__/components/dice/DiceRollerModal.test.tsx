/**
 * DiceRollerModal Component Tests
 *
 * Tests for components/dice/DiceRollerModal.tsx functionality
 * Covers rendering, closing behavior, and dice rolling integration
 */

import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { DiceRollerModal } from '@/components/dice/DiceRollerModal'

// Mock the dice modules
jest.mock('@/lib/dice/roller', () => ({
  rollDie: jest.fn(() => 15),
  rollDice: jest.fn(() => ({ sides: 6, rolls: [4, 5], total: 9 })),
  isStandardDie: jest.fn(() => true),
}))

jest.mock('@/lib/dice/calculator', () => ({
  parseDiceNotation: jest.fn((notation: string) => {
    const match = notation.match(/1d(\d+)/)
    if (match) {
      return { count: 1, sides: parseInt(match[1]), modifier: 0, notation }
    }
    return { count: 1, sides: 6, modifier: 0, notation: '1d6' }
  }),
  isValidDiceNotation: jest.fn((notation: string) => {
    if (!notation || notation.trim() === '') return false
    return /^\d*d\d+([+-]\d+)?$/i.test(notation)
  }),
  calculateResult: jest.fn((parsed, rolls) => ({
    ...parsed,
    rolls,
    subtotal: rolls.reduce((a: number, b: number) => a + b, 0),
    total: rolls.reduce((a: number, b: number) => a + b, 0) + parsed.modifier,
  })),
  formatDiceResult: jest.fn(() => '1d20 → 15'),
}))

describe('DiceRollerModal', () => {
  const mockOnClose = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('rendering', () => {
    it('should render the modal with title', () => {
      render(<DiceRollerModal onClose={mockOnClose} />)

      expect(screen.getByRole('dialog')).toBeInTheDocument()
      // Modal title has a specific id - check it exists
      expect(document.getElementById('dice-modal-title')).toBeInTheDocument()
    })

    it('should render the DiceRoller component inside', () => {
      render(<DiceRollerModal onClose={mockOnClose} />)

      // Check for dice buttons from DiceRoller
      expect(screen.getByRole('button', { name: /roll d20/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /roll d6/i })).toBeInTheDocument()
    })

    it('should render the RollHistory component', () => {
      render(<DiceRollerModal onClose={mockOnClose} />)

      expect(screen.getByText('Roll History')).toBeInTheDocument()
    })

    it('should render close button', () => {
      render(<DiceRollerModal onClose={mockOnClose} />)

      expect(screen.getByRole('button', { name: /close dice roller/i })).toBeInTheDocument()
    })

    it('should have proper accessibility attributes', () => {
      render(<DiceRollerModal onClose={mockOnClose} />)

      const dialog = screen.getByRole('dialog')
      expect(dialog).toHaveAttribute('aria-modal', 'true')
      expect(dialog).toHaveAttribute('aria-labelledby', 'dice-modal-title')
    })
  })

  describe('closing behavior', () => {
    it('should call onClose when close button is clicked', () => {
      render(<DiceRollerModal onClose={mockOnClose} />)

      fireEvent.click(screen.getByRole('button', { name: /close dice roller/i }))

      expect(mockOnClose).toHaveBeenCalledTimes(1)
    })

    it('should call onClose when clicking backdrop', () => {
      render(<DiceRollerModal onClose={mockOnClose} />)

      // Click on the backdrop (the dialog container)
      const dialog = screen.getByRole('dialog')
      fireEvent.click(dialog)

      expect(mockOnClose).toHaveBeenCalledTimes(1)
    })

    it('should not close when clicking inside modal content', () => {
      render(<DiceRollerModal onClose={mockOnClose} />)

      // Click on the modal title (inside content) - use the specific id
      const modalTitle = document.getElementById('dice-modal-title')!
      fireEvent.click(modalTitle)

      expect(mockOnClose).not.toHaveBeenCalled()
    })

    it('should call onClose when pressing Escape', () => {
      render(<DiceRollerModal onClose={mockOnClose} />)

      const dialog = screen.getByRole('dialog')
      fireEvent.keyDown(dialog, { key: 'Escape', code: 'Escape' })

      expect(mockOnClose).toHaveBeenCalledTimes(1)
    })
  })

  describe('dice rolling integration', () => {
    it('should show roll result when dice button is clicked', async () => {
      render(<DiceRollerModal onClose={mockOnClose} />)

      fireEvent.click(screen.getByRole('button', { name: /roll d20/i }))

      // Wait for result to appear
      expect(await screen.findByText('Result')).toBeInTheDocument()
    })
  })

  describe('keyboard hint', () => {
    it('should display keyboard hint for closing', () => {
      render(<DiceRollerModal onClose={mockOnClose} />)

      expect(screen.getByText(/esc/i)).toBeInTheDocument()
      expect(screen.getByText(/click outside to close/i)).toBeInTheDocument()
    })
  })
})
