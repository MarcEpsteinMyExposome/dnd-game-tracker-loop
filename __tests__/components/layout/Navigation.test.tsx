/**
 * Navigation Component Tests
 *
 * Tests for components/layout/Navigation.tsx functionality
 * Covers rendering, navigation links, and dice roller modal integration
 */

import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { Navigation } from '@/components/layout/Navigation'

// Mock the dice modules used by DiceRollerModal
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

describe('Navigation', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('rendering', () => {
    it('should render the app title/logo link', () => {
      render(<Navigation />)

      const logoLink = screen.getByRole('link', { name: /bang your dead/i })
      expect(logoLink).toBeInTheDocument()
      expect(logoLink).toHaveAttribute('href', '/')
    })

    it('should render all navigation links', () => {
      render(<Navigation />)

      expect(screen.getByRole('link', { name: /dashboard/i })).toHaveAttribute('href', '/dashboard')
      expect(screen.getByRole('link', { name: /characters/i })).toHaveAttribute('href', '/characters')
      expect(screen.getByRole('link', { name: /combat/i })).toHaveAttribute('href', '/combat')
      expect(screen.getByRole('link', { name: /outlaws/i })).toHaveAttribute('href', '/monsters')
      expect(screen.getByRole('link', { name: /settings/i })).toHaveAttribute('href', '/settings')
    })

    it('should render dice roller button', () => {
      render(<Navigation />)

      const diceButton = screen.getByRole('button', { name: /open dice roller/i })
      expect(diceButton).toBeInTheDocument()
    })
  })

  describe('dice roller modal', () => {
    it('should not show dice modal initially', () => {
      render(<Navigation />)

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })

    it('should open dice modal when dice button is clicked', () => {
      render(<Navigation />)

      fireEvent.click(screen.getByRole('button', { name: /open dice roller/i }))

      expect(screen.getByRole('dialog')).toBeInTheDocument()
      // Check for the modal title
      expect(screen.getAllByText('Dice Roller').length).toBeGreaterThanOrEqual(1)
    })

    it('should close dice modal when close button is clicked', () => {
      render(<Navigation />)

      // Open modal
      fireEvent.click(screen.getByRole('button', { name: /open dice roller/i }))
      expect(screen.getByRole('dialog')).toBeInTheDocument()

      // Close modal
      fireEvent.click(screen.getByRole('button', { name: /close dice roller/i }))
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })

    it('should close dice modal when pressing Escape', () => {
      render(<Navigation />)

      // Open modal
      fireEvent.click(screen.getByRole('button', { name: /open dice roller/i }))
      expect(screen.getByRole('dialog')).toBeInTheDocument()

      // Press Escape
      const dialog = screen.getByRole('dialog')
      fireEvent.keyDown(dialog, { key: 'Escape', code: 'Escape' })

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })

    it('should close dice modal when clicking backdrop', () => {
      render(<Navigation />)

      // Open modal
      fireEvent.click(screen.getByRole('button', { name: /open dice roller/i }))
      expect(screen.getByRole('dialog')).toBeInTheDocument()

      // Click backdrop
      const dialog = screen.getByRole('dialog')
      fireEvent.click(dialog)

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })
  })

  describe('accessibility', () => {
    it('should have accessible dice button with title', () => {
      render(<Navigation />)

      const diceButton = screen.getByRole('button', { name: /open dice roller/i })
      expect(diceButton).toHaveAttribute('title', 'Roll Dice')
    })
  })
})
