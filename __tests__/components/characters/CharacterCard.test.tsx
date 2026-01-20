/**
 * Tests for CharacterCard Component
 *
 * Tests character display, HP tracking, and condition management.
 */

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CharacterCard } from '@/components/characters/CharacterCard'
import { Character } from '@/lib/schemas'
import { useGameStore } from '@/lib/store/gameStore'

// Mock the game store
jest.mock('@/lib/store/gameStore')

// Mock avatar utility
jest.mock('@/lib/utils/avatar', () => ({
  getAvatarSource: jest.fn(() => 'https://example.com/avatar.png'),
}))

// Mock ConditionBadge component
jest.mock('@/components/conditions/ConditionBadge', () => ({
  ConditionBadge: ({ condition }: { condition: string }) => <span>{condition}</span>,
}))

describe('CharacterCard', () => {
  const mockUpdateCharacterHp = jest.fn()
  const mockCharacter: Character = {
    id: 'test-id',
    name: 'Gandalf',
    characterClass: 'Wizard',
    level: 20,
    maxHp: 100,
    currentHp: 75,
    armorClass: 15,
    avatarSeed: 'gandalf',
    conditions: ['Poisoned'],
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  const mockOnEdit = jest.fn()
  const mockOnDelete = jest.fn()
  const mockOnManageConditions = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useGameStore as unknown as jest.Mock).mockReturnValue(mockUpdateCharacterHp)
  })

  describe('Rendering', () => {
    it('renders character name and class', () => {
      render(
        <CharacterCard
          character={mockCharacter}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
          onManageConditions={mockOnManageConditions}
        />
      )

      expect(screen.getByText('Gandalf')).toBeInTheDocument()
      expect(screen.getByText(/Level 20 Wizard/i)).toBeInTheDocument()
    })

    it('renders HP display', () => {
      render(
        <CharacterCard
          character={mockCharacter}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
          onManageConditions={mockOnManageConditions}
        />
      )

      expect(screen.getByText('75/100')).toBeInTheDocument()
    })

    it('renders armor class', () => {
      render(
        <CharacterCard
          character={mockCharacter}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
          onManageConditions={mockOnManageConditions}
        />
      )

      expect(screen.getByText(/AC:/)).toBeInTheDocument()
      expect(screen.getByText(/15/)).toBeInTheDocument()
    })

    it('shows UNCONSCIOUS when HP is 0', () => {
      const unconsciousCharacter = { ...mockCharacter, currentHp: 0 }

      render(
        <CharacterCard
          character={unconsciousCharacter}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
          onManageConditions={mockOnManageConditions}
        />
      )

      expect(screen.getByText('UNCONSCIOUS')).toBeInTheDocument()
    })

    it('renders active conditions', () => {
      render(
        <CharacterCard
          character={mockCharacter}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
          onManageConditions={mockOnManageConditions}
        />
      )

      expect(screen.getByText('Poisoned')).toBeInTheDocument()
    })

    it('shows "No active conditions" when no conditions', () => {
      const noConditionsCharacter = { ...mockCharacter, conditions: [] }

      render(
        <CharacterCard
          character={noConditionsCharacter}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
          onManageConditions={mockOnManageConditions}
        />
      )

      expect(screen.getByText('No active conditions')).toBeInTheDocument()
    })
  })

  describe('HP Tracking', () => {
    it('renders HP adjustment buttons', () => {
      render(
        <CharacterCard
          character={mockCharacter}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
          onManageConditions={mockOnManageConditions}
        />
      )

      expect(screen.getByTitle('Decrease HP by 5')).toBeInTheDocument()
      expect(screen.getByTitle('Decrease HP by 1')).toBeInTheDocument()
      expect(screen.getByTitle('Increase HP by 1')).toBeInTheDocument()
      expect(screen.getByTitle('Increase HP by 5')).toBeInTheDocument()
    })

    it('renders direct HP input', () => {
      render(
        <CharacterCard
          character={mockCharacter}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
          onManageConditions={mockOnManageConditions}
        />
      )

      const input = screen.getByLabelText(/Set HP:/i)
      expect(input).toBeInTheDocument()
      expect(input).toHaveValue(75)
    })
  })

  describe('User Interactions', () => {
    it('calls onEdit when Edit button clicked', async () => {
      const user = userEvent.setup()

      render(
        <CharacterCard
          character={mockCharacter}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
          onManageConditions={mockOnManageConditions}
        />
      )

      const editButton = screen.getByRole('button', { name: /edit/i })
      await user.click(editButton)

      expect(mockOnEdit).toHaveBeenCalledTimes(1)
      expect(mockOnEdit).toHaveBeenCalledWith(mockCharacter)
    })

    it('calls onDelete when Delete button clicked', async () => {
      const user = userEvent.setup()

      render(
        <CharacterCard
          character={mockCharacter}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
          onManageConditions={mockOnManageConditions}
        />
      )

      const deleteButton = screen.getByRole('button', { name: /delete/i })
      await user.click(deleteButton)

      expect(mockOnDelete).toHaveBeenCalledTimes(1)
      expect(mockOnDelete).toHaveBeenCalledWith(mockCharacter)
    })

    it('calls onManageConditions when Manage Conditions button clicked', async () => {
      const user = userEvent.setup()

      render(
        <CharacterCard
          character={mockCharacter}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
          onManageConditions={mockOnManageConditions}
        />
      )

      const manageButton = screen.getByRole('button', { name: /manage conditions/i })
      await user.click(manageButton)

      expect(mockOnManageConditions).toHaveBeenCalledTimes(1)
      expect(mockOnManageConditions).toHaveBeenCalledWith(mockCharacter)
    })
  })
})
