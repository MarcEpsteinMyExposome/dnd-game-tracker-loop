/**
 * DiceRoller Component Tests
 *
 * Tests for components/dice/DiceRoller.tsx functionality
 * Covers rendering, quick rolls, custom notation, and result display
 */

import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DiceRoller } from '@/components/dice/DiceRoller'

// Mock the dice modules
jest.mock('@/lib/dice/roller', () => ({
  rollDie: jest.fn(() => 15),
  rollDice: jest.fn(() => ({ sides: 6, rolls: [4, 5], total: 9 })),
  isStandardDie: jest.fn(() => true),
}))

jest.mock('@/lib/dice/calculator', () => ({
  parseDiceNotation: jest.fn((notation: string) => {
    if (notation === 'invalid') throw new Error('Invalid notation')
    if (notation === '2d6+3') return { count: 2, sides: 6, modifier: 3, notation: '2d6+3' }
    if (notation === '1d20') return { count: 1, sides: 20, modifier: 0, notation: '1d20' }
    // Default for quick rolls
    const match = notation.match(/1d(\d+)/)
    if (match) {
      return { count: 1, sides: parseInt(match[1]), modifier: 0, notation }
    }
    return { count: 1, sides: 6, modifier: 0, notation: '1d6' }
  }),
  isValidDiceNotation: jest.fn((notation: string) => {
    if (!notation || notation.trim() === '') return false
    if (notation === 'invalid') return false
    return /^\d*d\d+([+-]\d+)?$/i.test(notation)
  }),
  calculateResult: jest.fn((parsed, rolls) => ({
    ...parsed,
    rolls,
    subtotal: rolls.reduce((a: number, b: number) => a + b, 0),
    total: rolls.reduce((a: number, b: number) => a + b, 0) + parsed.modifier,
  })),
  formatDiceResult: jest.fn(() => '2d6+3 → [4, 5] + 3 = 12'),
}))

describe('DiceRoller', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('rendering', () => {
    it('should render the dice roller header', () => {
      render(<DiceRoller />)

      expect(screen.getByText('Dice Roller')).toBeInTheDocument()
    })

    it('should render all dice buttons', () => {
      render(<DiceRoller />)

      expect(screen.getByRole('button', { name: /roll d4/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /roll d6/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /roll d8/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /roll d10/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /roll d12/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /roll d20/i })).toBeInTheDocument()
    })

    it('should render custom notation input', () => {
      render(<DiceRoller />)

      expect(screen.getByLabelText(/custom roll/i)).toBeInTheDocument()
      expect(screen.getByPlaceholderText(/e\.g\., 2d6\+3/i)).toBeInTheDocument()
    })

    it('should render roll button', () => {
      render(<DiceRoller />)

      expect(screen.getByRole('button', { name: /^roll$/i })).toBeInTheDocument()
    })

    it('should show empty state initially', () => {
      render(<DiceRoller />)

      expect(screen.getByText(/click a die or enter a notation/i)).toBeInTheDocument()
    })
  })

  describe('quick dice rolls', () => {
    it('should display result when clicking a die', async () => {
      render(<DiceRoller />)

      fireEvent.click(screen.getByRole('button', { name: /roll d20/i }))

      await waitFor(() => {
        // Result appears in multiple places (button and result display)
        // Check that the result section appears
        expect(screen.getByText('Result')).toBeInTheDocument()
        expect(screen.getAllByText('15').length).toBeGreaterThanOrEqual(1)
      })
    })

    it('should call onRoll callback with result', async () => {
      const handleRoll = jest.fn()
      render(<DiceRoller onRoll={handleRoll} />)

      fireEvent.click(screen.getByRole('button', { name: /roll d6/i }))

      await waitFor(() => {
        expect(handleRoll).toHaveBeenCalled()
      })
    })
  })

  describe('custom notation input', () => {
    it('should accept custom notation input', async () => {
      const user = userEvent.setup()
      render(<DiceRoller />)

      const input = screen.getByLabelText(/custom roll/i)
      await user.type(input, '2d6+3')

      expect(input).toHaveValue('2d6+3')
    })

    it('should roll when clicking roll button', async () => {
      const handleRoll = jest.fn()
      const user = userEvent.setup()
      render(<DiceRoller onRoll={handleRoll} />)

      const input = screen.getByLabelText(/custom roll/i)
      await user.type(input, '2d6+3')

      fireEvent.click(screen.getByRole('button', { name: /^roll$/i }))

      await waitFor(() => {
        expect(handleRoll).toHaveBeenCalled()
      })
    })

    it('should roll when pressing Enter', async () => {
      const handleRoll = jest.fn()
      const user = userEvent.setup()
      render(<DiceRoller onRoll={handleRoll} />)

      const input = screen.getByLabelText(/custom roll/i)
      await user.type(input, '2d6+3{Enter}')

      await waitFor(() => {
        expect(handleRoll).toHaveBeenCalled()
      })
    })

    it('should show error for empty notation', async () => {
      render(<DiceRoller />)

      fireEvent.click(screen.getByRole('button', { name: /^roll$/i }))

      await waitFor(() => {
        expect(screen.getByText(/enter a dice notation/i)).toBeInTheDocument()
      })
    })

    it('should show error for invalid notation', async () => {
      const user = userEvent.setup()
      render(<DiceRoller />)

      const input = screen.getByLabelText(/custom roll/i)
      await user.type(input, 'invalid')

      fireEvent.click(screen.getByRole('button', { name: /^roll$/i }))

      await waitFor(() => {
        expect(screen.getByText(/invalid notation/i)).toBeInTheDocument()
      })
    })
  })

  describe('result display', () => {
    it('should show result after rolling', async () => {
      render(<DiceRoller />)

      fireEvent.click(screen.getByRole('button', { name: /roll d20/i }))

      await waitFor(() => {
        expect(screen.getByText('Result')).toBeInTheDocument()
        // Result appears in both the dice button and the result display
        expect(screen.getAllByText('15').length).toBeGreaterThanOrEqual(1)
      })
    })

    it('should hide empty state after rolling', async () => {
      render(<DiceRoller />)

      // Initially shows empty state
      expect(screen.getByText(/click a die or enter a notation/i)).toBeInTheDocument()

      fireEvent.click(screen.getByRole('button', { name: /roll d20/i }))

      await waitFor(() => {
        expect(screen.queryByText(/click a die or enter a notation/i)).not.toBeInTheDocument()
      })
    })
  })

  describe('compact mode', () => {
    it('should render in compact mode', () => {
      render(<DiceRoller compact={true} />)

      // Should still have all elements
      expect(screen.getByText('Dice Roller')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /roll d20/i })).toBeInTheDocument()
    })
  })
})
