/**
 * Tests for ConditionToggle Component
 *
 * Tests condition toggle functionality and store integration.
 */

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ConditionToggle } from '@/components/conditions/ConditionToggle'
import { Condition } from '@/lib/schemas/condition.schema'
import { useGameStore } from '@/lib/store/gameStore'

// Mock the game store
jest.mock('@/lib/store/gameStore')

describe('ConditionToggle', () => {
  const mockToggleCharacterCondition = jest.fn()
  const mockGetCharacterById = jest.fn()
  const testCharacterId = 'test-character-id'
  const activeConditions: Condition[] = ['Poisoned', 'Stunned']

  beforeEach(() => {
    jest.clearAllMocks()

    // Mock the store to return character with conditions
    mockGetCharacterById.mockReturnValue({
      id: testCharacterId,
      name: 'Test Character',
      conditions: activeConditions,
    })

    // Mock useGameStore to return different values based on selector
    ;(useGameStore as unknown as jest.Mock).mockImplementation((selector) => {
      const state = {
        toggleCharacterCondition: mockToggleCharacterCondition,
        getCharacterById: mockGetCharacterById,
      }
      return selector(state)
    })
  })

  describe('Rendering', () => {
    it('renders all 7 conditions as checkboxes', () => {
      render(
        <ConditionToggle characterId={testCharacterId} />
      )

      // Verify all conditions are present as checkboxes
      expect(screen.getByRole('checkbox', { name: /poisoned/i })).toBeInTheDocument()
      expect(screen.getByRole('checkbox', { name: /prone/i })).toBeInTheDocument()
      expect(screen.getByRole('checkbox', { name: /paralyzed/i })).toBeInTheDocument()
      expect(screen.getByRole('checkbox', { name: /stunned/i })).toBeInTheDocument()
      expect(screen.getByRole('checkbox', { name: /blinded/i })).toBeInTheDocument()
      expect(screen.getByRole('checkbox', { name: /frightened/i })).toBeInTheDocument()
      expect(screen.getByRole('checkbox', { name: /charmed/i })).toBeInTheDocument()
    })

    it('marks active conditions as checked', () => {
      render(
        <ConditionToggle characterId={testCharacterId} />
      )

      const poisonedButton = screen.getByRole('checkbox', { name: /poisoned/i })
      const stunnedButton = screen.getByRole('checkbox', { name: /stunned/i })

      expect(poisonedButton).toHaveAttribute('aria-checked', 'true')
      expect(stunnedButton).toHaveAttribute('aria-checked', 'true')
    })

    it('marks inactive conditions as unchecked', () => {
      render(
        <ConditionToggle characterId={testCharacterId} />
      )

      const proneButton = screen.getByRole('checkbox', { name: /prone/i })
      const blindedButton = screen.getByRole('checkbox', { name: /blinded/i })

      expect(proneButton).toHaveAttribute('aria-checked', 'false')
      expect(blindedButton).toHaveAttribute('aria-checked', 'false')
    })

    it('shows active conditions summary', () => {
      render(
        <ConditionToggle characterId={testCharacterId} />
      )

      expect(screen.getByText(/Active Conditions \(2\):/)).toBeInTheDocument()
    })

    it('does not show summary when no active conditions', () => {
      // Override mock for this test to return character with no conditions
      mockGetCharacterById.mockReturnValue({
        id: testCharacterId,
        name: 'Test Character',
        conditions: [],
      })

      render(<ConditionToggle characterId={testCharacterId} />)

      expect(screen.queryByText(/Active Conditions/)).not.toBeInTheDocument()
    })
  })

  describe('User Interactions', () => {
    it('calls toggleCharacterCondition when condition clicked', async () => {
      const user = userEvent.setup()

      render(
        <ConditionToggle characterId={testCharacterId} />
      )

      const proneButton = screen.getByRole('checkbox', { name: /prone/i })
      await user.click(proneButton)

      expect(mockToggleCharacterCondition).toHaveBeenCalledTimes(1)
      expect(mockToggleCharacterCondition).toHaveBeenCalledWith(testCharacterId, 'Prone')
    })

    it('toggles active condition when clicked', async () => {
      const user = userEvent.setup()

      render(
        <ConditionToggle characterId={testCharacterId} />
      )

      const poisonedButton = screen.getByRole('checkbox', { name: /poisoned/i })
      await user.click(poisonedButton)

      expect(mockToggleCharacterCondition).toHaveBeenCalledWith(testCharacterId, 'Poisoned')
    })

    it('can toggle multiple conditions', async () => {
      const user = userEvent.setup()

      render(
        <ConditionToggle characterId={testCharacterId} />
      )

      const proneButton = screen.getByRole('checkbox', { name: /prone/i })
      const blindedButton = screen.getByRole('checkbox', { name: /blinded/i })

      await user.click(proneButton)
      await user.click(blindedButton)

      expect(mockToggleCharacterCondition).toHaveBeenCalledTimes(2)
      expect(mockToggleCharacterCondition).toHaveBeenCalledWith(testCharacterId, 'Prone')
      expect(mockToggleCharacterCondition).toHaveBeenCalledWith(testCharacterId, 'Blinded')
    })
  })

  describe('Accessibility', () => {
    it('uses checkbox role for conditions', () => {
      render(
        <ConditionToggle characterId={testCharacterId} />
      )

      const checkboxes = screen.getAllByRole('checkbox')
      expect(checkboxes).toHaveLength(7) // All 7 conditions
    })

    it('has proper aria-labels', () => {
      render(
        <ConditionToggle characterId={testCharacterId} />
      )

      expect(screen.getByRole('checkbox', { name: /toggle poisoned/i })).toBeInTheDocument()
      expect(screen.getByRole('checkbox', { name: /toggle prone/i })).toBeInTheDocument()
      expect(screen.getByRole('checkbox', { name: /toggle paralyzed/i })).toBeInTheDocument()
    })
  })
})
