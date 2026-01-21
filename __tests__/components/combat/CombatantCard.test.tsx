/**
 * Tests for CombatantCard Component
 *
 * Tests combatant display, HP tracking, active turn indicator, and combat UI.
 */

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CombatantCard } from '@/components/combat/CombatantCard'
import { Combatant } from '@/lib/schemas/combatant.schema'
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

describe('CombatantCard', () => {
  const mockUpdateCombatantHp = jest.fn()
  const mockOnRemove = jest.fn()

  const mockCombatant: Combatant = {
    id: 'combatant-id',
    entityId: '123e4567-e89b-12d3-a456-426614174000',
    type: 'character',
    name: 'Gandalf',
    armorClass: 15,
    maxHp: 100,
    currentHp: 75,
    initiative: 18,
    isActive: false,
    conditions: ['Poisoned'],
    avatarSeed: 'gandalf',
    isPlayer: true,
    addedAt: '2026-01-21T10:00:00.000Z',
  }

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useGameStore as unknown as jest.Mock).mockReturnValue(mockUpdateCombatantHp)
  })

  describe('Rendering', () => {
    it('renders combatant name', () => {
      render(<CombatantCard combatant={mockCombatant} />)

      expect(screen.getByText('Gandalf')).toBeInTheDocument()
    })

    it('renders HP display', () => {
      render(<CombatantCard combatant={mockCombatant} />)

      expect(screen.getByText('75/100')).toBeInTheDocument()
    })

    it('renders armor class', () => {
      render(<CombatantCard combatant={mockCombatant} />)

      expect(screen.getByText(/AC:/)).toBeInTheDocument()
      expect(screen.getByText(/15/)).toBeInTheDocument()
    })

    it('renders initiative badge when showInitiative is true', () => {
      render(<CombatantCard combatant={mockCombatant} showInitiative={true} />)

      expect(screen.getByText('18')).toBeInTheDocument()
    })

    it('hides initiative badge when showInitiative is false', () => {
      render(<CombatantCard combatant={mockCombatant} showInitiative={false} />)

      expect(screen.queryByTitle('Initiative')).not.toBeInTheDocument()
    })

    it('shows player indicator for player characters', () => {
      render(<CombatantCard combatant={mockCombatant} />)

      expect(screen.getByText(/Player/)).toBeInTheDocument()
    })

    it('shows enemy indicator for non-player combatants', () => {
      const enemyCombatant = { ...mockCombatant, isPlayer: false, type: 'monster' as const }

      render(<CombatantCard combatant={enemyCombatant} />)

      expect(screen.getByText(/Enemy/)).toBeInTheDocument()
    })

    it('shows active turn indicator when combatant is active', () => {
      const activeCombatant = { ...mockCombatant, isActive: true }

      render(<CombatantCard combatant={activeCombatant} />)

      expect(screen.getByText(/Active Turn/i)).toBeInTheDocument()
    })

    it('does not show active turn indicator when combatant is not active', () => {
      render(<CombatantCard combatant={mockCombatant} />)

      expect(screen.queryByText(/Active Turn/i)).not.toBeInTheDocument()
    })

    it('shows DEFEATED indicator when HP is 0', () => {
      const defeatedCombatant = { ...mockCombatant, currentHp: 0 }

      render(<CombatantCard combatant={defeatedCombatant} />)

      expect(screen.getByText(/DEFEATED/i)).toBeInTheDocument()
    })

    it('renders condition badges', () => {
      render(<CombatantCard combatant={mockCombatant} />)

      expect(screen.getByText('Poisoned')).toBeInTheDocument()
    })

    it('renders multiple conditions', () => {
      const multiConditionCombatant = {
        ...mockCombatant,
        conditions: ['Poisoned', 'Prone', 'Blinded'] as any,
      }

      render(<CombatantCard combatant={multiConditionCombatant} />)

      expect(screen.getByText('Poisoned')).toBeInTheDocument()
      expect(screen.getByText('Prone')).toBeInTheDocument()
      expect(screen.getByText('Blinded')).toBeInTheDocument()
    })

    it('renders notes when provided', () => {
      const combatantWithNotes = {
        ...mockCombatant,
        notes: 'Focus fire on this target',
      }

      render(<CombatantCard combatant={combatantWithNotes} />)

      expect(screen.getByText('Focus fire on this target')).toBeInTheDocument()
    })

    it('does not render notes section when notes are absent', () => {
      render(<CombatantCard combatant={mockCombatant} />)

      // Notes would be in italic text, check it doesn't exist
      const italicElements = screen.queryAllByText((_, element) => {
        return element?.tagName.toLowerCase() === 'p' && element.className.includes('italic')
      })

      expect(italicElements.length).toBe(0)
    })
  })

  describe('HP Tracking', () => {
    it('renders HP adjustment buttons', () => {
      render(<CombatantCard combatant={mockCombatant} />)

      expect(screen.getByTitle('Decrease HP by 5')).toBeInTheDocument()
      expect(screen.getByTitle('Decrease HP by 1')).toBeInTheDocument()
      expect(screen.getByTitle('Increase HP by 1')).toBeInTheDocument()
      expect(screen.getByTitle('Increase HP by 5')).toBeInTheDocument()
    })

    it('calls updateCombatantHp when -5 button clicked', async () => {
      const user = userEvent.setup()
      render(<CombatantCard combatant={mockCombatant} />)

      const button = screen.getByTitle('Decrease HP by 5')
      await user.click(button)

      expect(mockUpdateCombatantHp).toHaveBeenCalledWith('combatant-id', 70)
    })

    it('calls updateCombatantHp when -1 button clicked', async () => {
      const user = userEvent.setup()
      render(<CombatantCard combatant={mockCombatant} />)

      const button = screen.getByTitle('Decrease HP by 1')
      await user.click(button)

      expect(mockUpdateCombatantHp).toHaveBeenCalledWith('combatant-id', 74)
    })

    it('calls updateCombatantHp when +1 button clicked', async () => {
      const user = userEvent.setup()
      render(<CombatantCard combatant={mockCombatant} />)

      const button = screen.getByTitle('Increase HP by 1')
      await user.click(button)

      expect(mockUpdateCombatantHp).toHaveBeenCalledWith('combatant-id', 76)
    })

    it('calls updateCombatantHp when +5 button clicked', async () => {
      const user = userEvent.setup()
      render(<CombatantCard combatant={mockCombatant} />)

      const button = screen.getByTitle('Increase HP by 5')
      await user.click(button)

      expect(mockUpdateCombatantHp).toHaveBeenCalledWith('combatant-id', 80)
    })

    it('disables damage buttons when combatant is defeated', () => {
      const defeatedCombatant = { ...mockCombatant, currentHp: 0 }
      render(<CombatantCard combatant={defeatedCombatant} />)

      const minusFiveButton = screen.getByTitle('Decrease HP by 5')
      const minusOneButton = screen.getByTitle('Decrease HP by 1')

      expect(minusFiveButton).toBeDisabled()
      expect(minusOneButton).toBeDisabled()
    })

    it('does not disable healing buttons when combatant is defeated', () => {
      const defeatedCombatant = { ...mockCombatant, currentHp: 0 }
      render(<CombatantCard combatant={defeatedCombatant} />)

      const plusOneButton = screen.getByTitle('Increase HP by 1')
      const plusFiveButton = screen.getByTitle('Increase HP by 5')

      expect(plusOneButton).not.toBeDisabled()
      expect(plusFiveButton).not.toBeDisabled()
    })
  })

  describe('Visual Styling', () => {
    it('applies player background color for player characters', () => {
      const { container } = render(<CombatantCard combatant={mockCombatant} />)

      const card = container.firstChild as HTMLElement
      expect(card.className).toContain('bg-blue-50')
    })

    it('applies enemy background color for non-player combatants', () => {
      const enemyCombatant = { ...mockCombatant, isPlayer: false }

      const { container } = render(<CombatantCard combatant={enemyCombatant} />)

      const card = container.firstChild as HTMLElement
      expect(card.className).toContain('bg-red-50')
    })

    it('applies active turn border when combatant is active', () => {
      const activeCombatant = { ...mockCombatant, isActive: true }

      const { container } = render(<CombatantCard combatant={activeCombatant} />)

      const card = container.firstChild as HTMLElement
      expect(card.className).toContain('border-yellow-400')
    })

    it('applies reduced opacity when combatant is defeated', () => {
      const defeatedCombatant = { ...mockCombatant, currentHp: 0 }

      const { container } = render(<CombatantCard combatant={defeatedCombatant} />)

      const card = container.firstChild as HTMLElement
      expect(card.className).toContain('opacity-60')
    })
  })

  describe('Remove Button', () => {
    it('renders remove button when onRemove callback provided', () => {
      render(<CombatantCard combatant={mockCombatant} onRemove={mockOnRemove} />)

      expect(screen.getByTitle('Remove from combat')).toBeInTheDocument()
    })

    it('does not render remove button when onRemove not provided', () => {
      render(<CombatantCard combatant={mockCombatant} />)

      expect(screen.queryByTitle('Remove from combat')).not.toBeInTheDocument()
    })

    it('calls onRemove callback when remove button clicked', async () => {
      const user = userEvent.setup()
      render(<CombatantCard combatant={mockCombatant} onRemove={mockOnRemove} />)

      const removeButton = screen.getByTitle('Remove from combat')
      await user.click(removeButton)

      expect(mockOnRemove).toHaveBeenCalledWith(mockCombatant)
    })
  })

  describe('Accessibility', () => {
    it('has proper ARIA role for card', () => {
      render(<CombatantCard combatant={mockCombatant} />)

      expect(screen.getByRole('article')).toBeInTheDocument()
    })

    it('has descriptive ARIA label', () => {
      render(<CombatantCard combatant={mockCombatant} />)

      expect(screen.getByLabelText(/Gandalf combatant card/i)).toBeInTheDocument()
    })
  })
})
