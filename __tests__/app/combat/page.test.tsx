/**
 * Combat Page Tests
 *
 * Tests for app/combat/page.tsx functionality
 * Covers rendering and collapsible dice roller panel integration
 */

import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import CombatPage from '@/app/combat/page'

// Mock zustand store
const mockCombatants: never[] = []
const mockGetSortedCombatants = jest.fn(() => mockCombatants)
const mockGetActiveCombatant = jest.fn(() => null)

jest.mock('@/lib/store/gameStore', () => ({
  useGameStore: jest.fn((selector) => {
    const state = {
      combatants: mockCombatants,
      characters: [],
      currentTurn: 0,
      round: 1,
      isInCombat: false,
      getSortedCombatants: mockGetSortedCombatants,
      getActiveCombatant: mockGetActiveCombatant,
      addCombatant: jest.fn(),
      removeCombatant: jest.fn(),
      updateCombatantHP: jest.fn(),
      nextTurn: jest.fn(),
      previousTurn: jest.fn(),
      startCombat: jest.fn(),
      endCombat: jest.fn(),
      clearCombat: jest.fn(),
    }
    return selector(state)
  }),
}))

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

describe('CombatPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('rendering', () => {
    it('should render the page title', () => {
      render(<CombatPage />)

      expect(screen.getByRole('heading', { name: /showdown tracker/i })).toBeInTheDocument()
    })

    it('should render navigation links', () => {
      render(<CombatPage />)

      expect(screen.getByRole('link', { name: /back to dashboard/i })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: /manage posse/i })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: /outlaw bounties/i })).toBeInTheDocument()
    })
  })

  describe('dice roller panel', () => {
    it('should render dice roller toggle button', () => {
      render(<CombatPage />)

      const toggleButton = screen.getByRole('button', { name: /dice roller/i })
      expect(toggleButton).toBeInTheDocument()
      expect(toggleButton).toHaveAttribute('aria-expanded', 'false')
    })

    it('should not show dice roller panel initially', () => {
      render(<CombatPage />)

      // The panel should not be visible
      expect(screen.queryByRole('textbox', { name: /custom roll/i })).not.toBeInTheDocument()
    })

    it('should expand dice roller panel when toggle is clicked', async () => {
      render(<CombatPage />)

      const toggleButton = screen.getByRole('button', { name: /dice roller/i })
      fireEvent.click(toggleButton)

      // Panel should now be expanded
      expect(toggleButton).toHaveAttribute('aria-expanded', 'true')

      // Dice roller components should be visible
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /roll d20/i })).toBeInTheDocument()
      })
    })

    it('should collapse dice roller panel when toggle is clicked again', async () => {
      render(<CombatPage />)

      const toggleButton = screen.getByRole('button', { name: /dice roller/i })

      // Open panel
      fireEvent.click(toggleButton)
      expect(toggleButton).toHaveAttribute('aria-expanded', 'true')

      // Close panel
      fireEvent.click(toggleButton)
      expect(toggleButton).toHaveAttribute('aria-expanded', 'false')

      // Dice roller should be hidden
      await waitFor(() => {
        expect(screen.queryByRole('button', { name: /roll d20/i })).not.toBeInTheDocument()
      })
    })

    it('should show roll history panel when expanded', async () => {
      render(<CombatPage />)

      const toggleButton = screen.getByRole('button', { name: /dice roller/i })
      fireEvent.click(toggleButton)

      await waitFor(() => {
        expect(screen.getByText('Roll History')).toBeInTheDocument()
      })
    })

    it('should update roll count badge when dice are rolled', async () => {
      render(<CombatPage />)

      const toggleButton = screen.getByRole('button', { name: /dice roller/i })
      fireEvent.click(toggleButton)

      // Roll a die
      const d20Button = await screen.findByRole('button', { name: /roll d20/i })
      fireEvent.click(d20Button)

      // Badge should show roll count
      await waitFor(() => {
        expect(screen.getByText(/1 roll/i)).toBeInTheDocument()
      })
    })
  })

  describe('accessibility', () => {
    it('should have accessible toggle button with aria-expanded', () => {
      render(<CombatPage />)

      const toggleButton = screen.getByRole('button', { name: /dice roller/i })
      expect(toggleButton).toHaveAttribute('aria-expanded')
      expect(toggleButton).toHaveAttribute('aria-controls', 'dice-roller-panel')
    })

    it('should have panel with matching id', async () => {
      render(<CombatPage />)

      const toggleButton = screen.getByRole('button', { name: /dice roller/i })
      fireEvent.click(toggleButton)

      await waitFor(() => {
        const panel = document.getElementById('dice-roller-panel')
        expect(panel).toBeInTheDocument()
      })
    })
  })
})
