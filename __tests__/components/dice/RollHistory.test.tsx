/**
 * RollHistory Component Tests
 *
 * Tests for components/dice/RollHistory.tsx functionality
 * Covers rendering, history display, clearing, and limits
 */

import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import {
  RollHistory,
  type RollHistoryEntry,
  generateRollId,
  createRollEntry,
} from '@/components/dice/RollHistory'
import { type DiceResult } from '@/lib/dice/calculator'

// Helper to create mock history entries
const createMockEntry = (overrides: Partial<RollHistoryEntry> = {}): RollHistoryEntry => ({
  id: generateRollId(),
  notation: '2d6+3',
  rolls: [4, 5],
  total: 12,
  timestamp: new Date(),
  ...overrides,
})

describe('RollHistory', () => {
  describe('rendering', () => {
    it('should render the history header', () => {
      render(<RollHistory history={[]} />)

      expect(screen.getByText('Roll History')).toBeInTheDocument()
    })

    it('should show empty state when no history', () => {
      render(<RollHistory history={[]} />)

      expect(screen.getByText('No rolls yet')).toBeInTheDocument()
      expect(screen.getByText(/roll some dice/i)).toBeInTheDocument()
    })

    it('should render history entries', () => {
      const history = [
        createMockEntry({ notation: '2d6+3', rolls: [4, 5], total: 12 }),
        createMockEntry({ notation: '1d20', rolls: [15], total: 15 }),
      ]

      render(<RollHistory history={history} />)

      expect(screen.getByText('2d6+3')).toBeInTheDocument()
      expect(screen.getByText('1d20')).toBeInTheDocument()
      expect(screen.getByText('= 12')).toBeInTheDocument()
      expect(screen.getByText('= 15')).toBeInTheDocument()
    })

    it('should show roll breakdown', () => {
      const history = [
        createMockEntry({ notation: '3d6', rolls: [3, 4, 5], total: 12 }),
      ]

      render(<RollHistory history={history} />)

      expect(screen.getByText('[3, 4, 5]')).toBeInTheDocument()
    })

    it('should show entry count', () => {
      const history = [
        createMockEntry(),
        createMockEntry(),
        createMockEntry(),
      ]

      render(<RollHistory history={history} />)

      expect(screen.getByText('(3)')).toBeInTheDocument()
    })
  })

  describe('clear functionality', () => {
    it('should show clear button when onClear provided', () => {
      const history = [createMockEntry()]

      render(<RollHistory history={history} onClear={() => {}} />)

      expect(screen.getByRole('button', { name: /clear/i })).toBeInTheDocument()
    })

    it('should not show clear button when onClear not provided', () => {
      const history = [createMockEntry()]

      render(<RollHistory history={history} />)

      expect(screen.queryByRole('button', { name: /clear/i })).not.toBeInTheDocument()
    })

    it('should not show clear button when history is empty', () => {
      render(<RollHistory history={[]} onClear={() => {}} />)

      expect(screen.queryByRole('button', { name: /clear/i })).not.toBeInTheDocument()
    })

    it('should call onClear when clear button clicked', () => {
      const handleClear = jest.fn()
      const history = [createMockEntry()]

      render(<RollHistory history={history} onClear={handleClear} />)

      fireEvent.click(screen.getByRole('button', { name: /clear/i }))

      expect(handleClear).toHaveBeenCalled()
    })
  })

  describe('maxEntries', () => {
    it('should limit displayed entries to maxEntries', () => {
      const history = [
        createMockEntry({ notation: '1d4', total: 1 }),
        createMockEntry({ notation: '1d6', total: 2 }),
        createMockEntry({ notation: '1d8', total: 3 }),
        createMockEntry({ notation: '1d10', total: 4 }),
        createMockEntry({ notation: '1d12', total: 5 }),
      ]

      render(<RollHistory history={history} maxEntries={3} />)

      // Should only show the last 3 entries (most recent)
      expect(screen.queryByText('1d4')).not.toBeInTheDocument()
      expect(screen.queryByText('1d6')).not.toBeInTheDocument()
      expect(screen.getByText('1d8')).toBeInTheDocument()
      expect(screen.getByText('1d10')).toBeInTheDocument()
      expect(screen.getByText('1d12')).toBeInTheDocument()
    })

    it('should show count indicator when history exceeds maxEntries', () => {
      const history = [
        createMockEntry(),
        createMockEntry(),
        createMockEntry(),
        createMockEntry(),
        createMockEntry(),
      ]

      render(<RollHistory history={history} maxEntries={3} />)

      expect(screen.getByText('(3/5)')).toBeInTheDocument()
    })

    it('should default maxEntries to 10', () => {
      const history = Array.from({ length: 15 }, (_, i) =>
        createMockEntry({ notation: `1d${i + 1}`, total: i + 1 })
      )

      render(<RollHistory history={history} />)

      // First 5 entries (oldest) should not be shown
      expect(screen.queryByText('1d1')).not.toBeInTheDocument()
      expect(screen.queryByText('1d5')).not.toBeInTheDocument()

      // Last 10 entries should be shown
      expect(screen.getByText('1d6')).toBeInTheDocument()
      expect(screen.getByText('1d15')).toBeInTheDocument()
    })
  })

  describe('ordering', () => {
    it('should display most recent entry first', () => {
      const history = [
        createMockEntry({ notation: 'oldest', total: 1 }),
        createMockEntry({ notation: 'middle', total: 2 }),
        createMockEntry({ notation: 'newest', total: 3 }),
      ]

      render(<RollHistory history={history} />)

      const entries = screen.getAllByText(/=/)
      // Most recent (newest) should be first
      expect(entries[0]).toHaveTextContent('= 3')
      expect(entries[2]).toHaveTextContent('= 1')
    })
  })

  describe('compact mode', () => {
    it('should render in compact mode', () => {
      const history = [createMockEntry()]

      render(<RollHistory history={history} compact={true} />)

      expect(screen.getByText('Roll History')).toBeInTheDocument()
    })
  })
})

describe('helper functions', () => {
  describe('generateRollId', () => {
    it('should generate unique IDs', () => {
      const id1 = generateRollId()
      const id2 = generateRollId()

      expect(id1).not.toBe(id2)
    })

    it('should start with "roll-"', () => {
      const id = generateRollId()

      expect(id).toMatch(/^roll-/)
    })
  })

  describe('createRollEntry', () => {
    it('should create entry from DiceResult', () => {
      const result: DiceResult = {
        count: 2,
        sides: 6,
        modifier: 3,
        notation: '2d6+3',
        rolls: [4, 5],
        subtotal: 9,
        total: 12,
      }

      const entry = createRollEntry(result)

      expect(entry.notation).toBe('2d6+3')
      expect(entry.rolls).toEqual([4, 5])
      expect(entry.total).toBe(12)
      expect(entry.id).toMatch(/^roll-/)
      expect(entry.timestamp).toBeInstanceOf(Date)
    })
  })
})
