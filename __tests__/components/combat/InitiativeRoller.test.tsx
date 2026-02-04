/**
 * InitiativeRoller Component Tests
 *
 * Tests for components/combat/InitiativeRoller.tsx functionality
 * Covers InitiativeRoller button and InitiativeDisplay component
 */

import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { InitiativeRoller, InitiativeDisplay } from '@/components/combat/InitiativeRoller'

// Mock the game store
const mockRollAllInitiatives = jest.fn()
const mockCombatants = [
  { id: '1', name: 'Fighter', initiative: 15, dexModifier: 2 },
  { id: '2', name: 'Wizard', initiative: 10, dexModifier: 1 },
]

jest.mock('@/lib/store/gameStore', () => ({
  useGameStore: jest.fn((selector) => {
    const state = {
      combatants: mockCombatants,
      rollAllInitiatives: mockRollAllInitiatives,
    }
    return selector(state)
  }),
}))

describe('InitiativeRoller', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockCombatants.length = 2 // Reset to having combatants
    mockCombatants[0] = { id: '1', name: 'Fighter', initiative: 15, dexModifier: 2 }
    mockCombatants[1] = { id: '2', name: 'Wizard', initiative: 10, dexModifier: 1 }
  })

  describe('rendering', () => {
    it('should render roll initiative button', () => {
      render(<InitiativeRoller />)

      expect(screen.getByRole('button', { name: /roll initiative/i })).toBeInTheDocument()
    })

    it('should show dice emoji', () => {
      render(<InitiativeRoller />)

      expect(screen.getByText(/🎲/)).toBeInTheDocument()
    })
  })

  describe('rolling', () => {
    it('should call rollAllInitiatives when clicked', async () => {
      render(<InitiativeRoller />)

      fireEvent.click(screen.getByRole('button', { name: /roll initiative/i }))

      await waitFor(() => {
        expect(mockRollAllInitiatives).toHaveBeenCalled()
      })
    })

    it('should call onRollAll callback', async () => {
      const handleRollAll = jest.fn()
      render(<InitiativeRoller onRollAll={handleRollAll} />)

      fireEvent.click(screen.getByRole('button', { name: /roll initiative/i }))

      await waitFor(() => {
        expect(handleRollAll).toHaveBeenCalled()
      })
    })

    it('should show rolling state', async () => {
      render(<InitiativeRoller />)

      fireEvent.click(screen.getByRole('button', { name: /roll initiative/i }))

      // Should show rolling text briefly
      expect(screen.getByText(/rolling/i)).toBeInTheDocument()

      // Should return to normal after animation
      await waitFor(() => {
        expect(screen.getByText(/roll initiative/i)).toBeInTheDocument()
      }, { timeout: 500 })
    })
  })

  describe('disabled state', () => {
    it('should be disabled when no combatants', () => {
      // Clear combatants
      mockCombatants.length = 0

      render(<InitiativeRoller />)

      expect(screen.getByRole('button')).toBeDisabled()
    })

    it('should show tooltip when disabled', () => {
      mockCombatants.length = 0

      render(<InitiativeRoller />)

      expect(screen.getByRole('button')).toHaveAttribute('title', 'Add combatants first')
    })
  })
})

describe('InitiativeDisplay', () => {
  describe('rendering', () => {
    it('should display initiative value', () => {
      render(
        <InitiativeDisplay
          combatantId="1"
          initiative={15}
          dexModifier={2}
        />
      )

      expect(screen.getByText('15')).toBeInTheDocument()
    })

    it('should show DEX modifier in tooltip', () => {
      render(
        <InitiativeDisplay
          combatantId="1"
          initiative={15}
          dexModifier={2}
        />
      )

      const button = screen.getByRole('button', { name: /15/i })
      expect(button).toHaveAttribute('title', expect.stringContaining('DEX +2'))
    })

    it('should show negative DEX modifier correctly', () => {
      render(
        <InitiativeDisplay
          combatantId="1"
          initiative={8}
          dexModifier={-2}
        />
      )

      const button = screen.getByRole('button', { name: /8/i })
      expect(button).toHaveAttribute('title', expect.stringContaining('DEX -2'))
    })
  })

  describe('re-roll', () => {
    it('should show re-roll button when onReroll provided', () => {
      render(
        <InitiativeDisplay
          combatantId="1"
          initiative={15}
          dexModifier={2}
          onReroll={() => {}}
        />
      )

      expect(screen.getByRole('button', { name: /re-roll/i })).toBeInTheDocument()
    })

    it('should not show re-roll button when onReroll not provided', () => {
      render(
        <InitiativeDisplay
          combatantId="1"
          initiative={15}
          dexModifier={2}
        />
      )

      expect(screen.queryByRole('button', { name: /re-roll/i })).not.toBeInTheDocument()
    })

    it('should call onReroll when clicked', async () => {
      const handleReroll = jest.fn()
      render(
        <InitiativeDisplay
          combatantId="1"
          initiative={15}
          dexModifier={2}
          onReroll={handleReroll}
        />
      )

      fireEvent.click(screen.getByRole('button', { name: /re-roll/i }))

      await waitFor(() => {
        expect(handleReroll).toHaveBeenCalled()
      })
    })
  })

  describe('manual editing', () => {
    it('should enter edit mode when clicking initiative value', async () => {
      const user = userEvent.setup()
      render(
        <InitiativeDisplay
          combatantId="1"
          initiative={15}
          dexModifier={2}
          onManualSet={() => {}}
        />
      )

      await user.click(screen.getByText('15'))

      expect(screen.getByRole('spinbutton')).toBeInTheDocument()
    })

    it('should show current value in input', async () => {
      const user = userEvent.setup()
      render(
        <InitiativeDisplay
          combatantId="1"
          initiative={15}
          dexModifier={2}
          onManualSet={() => {}}
        />
      )

      await user.click(screen.getByText('15'))

      expect(screen.getByRole('spinbutton')).toHaveValue(15)
    })

    it('should call onManualSet when submitting valid value', async () => {
      const handleManualSet = jest.fn()
      const user = userEvent.setup()
      render(
        <InitiativeDisplay
          combatantId="1"
          initiative={15}
          dexModifier={2}
          onManualSet={handleManualSet}
        />
      )

      await user.click(screen.getByText('15'))

      const input = screen.getByRole('spinbutton')
      await user.clear(input)
      await user.type(input, '20')
      await user.keyboard('{Enter}')

      expect(handleManualSet).toHaveBeenCalledWith(20)
    })

    it('should exit edit mode on Escape', async () => {
      const user = userEvent.setup()
      render(
        <InitiativeDisplay
          combatantId="1"
          initiative={15}
          dexModifier={2}
          onManualSet={() => {}}
        />
      )

      await user.click(screen.getByText('15'))
      expect(screen.getByRole('spinbutton')).toBeInTheDocument()

      await user.keyboard('{Escape}')

      expect(screen.queryByRole('spinbutton')).not.toBeInTheDocument()
      expect(screen.getByText('15')).toBeInTheDocument()
    })

    it('should exit edit mode on blur', async () => {
      const user = userEvent.setup()
      render(
        <InitiativeDisplay
          combatantId="1"
          initiative={15}
          dexModifier={2}
          onManualSet={() => {}}
        />
      )

      await user.click(screen.getByText('15'))
      expect(screen.getByRole('spinbutton')).toBeInTheDocument()

      // Tab away to blur
      await user.tab()

      expect(screen.queryByRole('spinbutton')).not.toBeInTheDocument()
    })
  })

  describe('compact mode', () => {
    it('should render in compact mode', () => {
      render(
        <InitiativeDisplay
          combatantId="1"
          initiative={15}
          dexModifier={2}
          compact={true}
        />
      )

      expect(screen.getByText('15')).toBeInTheDocument()
    })
  })
})
