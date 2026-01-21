/**
 * Tests for Dashboard Component
 *
 * Tests dashboard statistics display, real-time updates when character data changes,
 * empty state handling, and integration with stat cards.
 */

import { render, screen } from '@testing-library/react'
import { Dashboard } from '@/components/dashboard/Dashboard'
import { useGameStore } from '@/lib/store/gameStore'
import { Character } from '@/lib/schemas'

// Mock the game store
jest.mock('@/lib/store/gameStore')

// Mock StatCard component to simplify testing
jest.mock('@/components/dashboard/StatCard', () => ({
  StatCard: ({
    title,
    value,
    icon,
    color,
    description,
  }: {
    title: string
    value: string | number
    icon?: string
    color?: string
    description?: string
  }) => (
    <div data-testid={`stat-card-${title}`} data-color={color}>
      <h3>{title}</h3>
      <p>{value}</p>
      {icon && <span>{icon}</span>}
      {description && <span>{description}</span>}
    </div>
  ),
}))

describe('Dashboard', () => {
  const mockUseGameStore = useGameStore as unknown as jest.Mock

  const createMockCharacter = (
    overrides: Partial<Character> = {}
  ): Character => ({
    id: `char-${Math.random()}`,
    name: 'Test Character',
    characterClass: 'Fighter',
    level: 5,
    maxHp: 100,
    currentHp: 100,
    armorClass: 15,
    avatarSeed: 'test',
    conditions: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Empty State', () => {
    it('shows empty state when no characters exist', () => {
      mockUseGameStore.mockReturnValue([])

      render(<Dashboard />)

      expect(
        screen.getByText('No characters in your roster yet.')
      ).toBeInTheDocument()
      expect(
        screen.getByText('Create your first character to see team statistics here.')
      ).toBeInTheDocument()
    })

    it('does not render stat cards when no characters', () => {
      mockUseGameStore.mockReturnValue([])

      render(<Dashboard />)

      expect(screen.queryByTestId(/stat-card/)).not.toBeInTheDocument()
    })
  })

  describe('Team Size Display', () => {
    it('displays team size for single character', () => {
      const characters = [createMockCharacter()]
      mockUseGameStore.mockReturnValue(characters)

      render(<Dashboard />)

      const teamSizeCard = screen.getByTestId('stat-card-Team Size')
      expect(teamSizeCard).toHaveTextContent('Team Size')
      expect(teamSizeCard).toHaveTextContent('1')
      expect(teamSizeCard).toHaveTextContent('1 character in the party')
      expect(teamSizeCard).toHaveTextContent('👥')
      expect(teamSizeCard).toHaveAttribute('data-color', 'blue')
    })

    it('displays team size for multiple characters', () => {
      const characters = [
        createMockCharacter({ name: 'Char 1' }),
        createMockCharacter({ name: 'Char 2' }),
        createMockCharacter({ name: 'Char 3' }),
      ]
      mockUseGameStore.mockReturnValue(characters)

      render(<Dashboard />)

      const teamSizeCard = screen.getByTestId('stat-card-Team Size')
      expect(teamSizeCard).toHaveTextContent('3')
      expect(teamSizeCard).toHaveTextContent('3 characters in the party')
    })
  })

  describe('Average HP Display', () => {
    it('displays average HP at 100% with green color', () => {
      const characters = [
        createMockCharacter({ maxHp: 100, currentHp: 100 }),
        createMockCharacter({ maxHp: 50, currentHp: 50 }),
      ]
      mockUseGameStore.mockReturnValue(characters)

      render(<Dashboard />)

      const avgHpCard = screen.getByTestId('stat-card-Average HP')
      expect(avgHpCard).toHaveTextContent('Average HP')
      expect(avgHpCard).toHaveTextContent('100%')
      expect(avgHpCard).toHaveTextContent('Team health status')
      expect(avgHpCard).toHaveTextContent('❤️')
      expect(avgHpCard).toHaveAttribute('data-color', 'green')
    })

    it('displays average HP at 76% with green color', () => {
      const characters = [createMockCharacter({ maxHp: 100, currentHp: 76 })]
      mockUseGameStore.mockReturnValue(characters)

      render(<Dashboard />)

      const avgHpCard = screen.getByTestId('stat-card-Average HP')
      expect(avgHpCard).toHaveTextContent('76%')
      expect(avgHpCard).toHaveAttribute('data-color', 'green')
    })

    it('displays average HP at 75% with yellow color', () => {
      const characters = [createMockCharacter({ maxHp: 100, currentHp: 75 })]
      mockUseGameStore.mockReturnValue(characters)

      render(<Dashboard />)

      const avgHpCard = screen.getByTestId('stat-card-Average HP')
      expect(avgHpCard).toHaveTextContent('75%')
      expect(avgHpCard).toHaveAttribute('data-color', 'yellow')
    })

    it('displays average HP at 50% with yellow color', () => {
      const characters = [createMockCharacter({ maxHp: 100, currentHp: 50 })]
      mockUseGameStore.mockReturnValue(characters)

      render(<Dashboard />)

      const avgHpCard = screen.getByTestId('stat-card-Average HP')
      expect(avgHpCard).toHaveTextContent('50%')
      expect(avgHpCard).toHaveAttribute('data-color', 'yellow')
    })

    it('displays average HP at 26% with yellow color', () => {
      const characters = [createMockCharacter({ maxHp: 100, currentHp: 26 })]
      mockUseGameStore.mockReturnValue(characters)

      render(<Dashboard />)

      const avgHpCard = screen.getByTestId('stat-card-Average HP')
      expect(avgHpCard).toHaveTextContent('26%')
      expect(avgHpCard).toHaveAttribute('data-color', 'yellow')
    })

    it('displays average HP at 25% with red color', () => {
      const characters = [createMockCharacter({ maxHp: 100, currentHp: 25 })]
      mockUseGameStore.mockReturnValue(characters)

      render(<Dashboard />)

      const avgHpCard = screen.getByTestId('stat-card-Average HP')
      expect(avgHpCard).toHaveTextContent('25%')
      expect(avgHpCard).toHaveAttribute('data-color', 'red')
    })

    it('displays average HP at 0% with red color', () => {
      const characters = [createMockCharacter({ maxHp: 100, currentHp: 0 })]
      mockUseGameStore.mockReturnValue(characters)

      render(<Dashboard />)

      const avgHpCard = screen.getByTestId('stat-card-Average HP')
      expect(avgHpCard).toHaveTextContent('0%')
      expect(avgHpCard).toHaveAttribute('data-color', 'red')
    })

    it('calculates average HP correctly for mixed values', () => {
      const characters = [
        createMockCharacter({ maxHp: 100, currentHp: 80 }), // 80%
        createMockCharacter({ maxHp: 50, currentHp: 10 }), // 20%
        createMockCharacter({ maxHp: 200, currentHp: 100 }), // 50%
      ]
      // Average: (80 + 20 + 50) / 3 = 50%
      mockUseGameStore.mockReturnValue(characters)

      render(<Dashboard />)

      const avgHpCard = screen.getByTestId('stat-card-Average HP')
      expect(avgHpCard).toHaveTextContent('50%')
      expect(avgHpCard).toHaveAttribute('data-color', 'yellow')
    })
  })

  describe('Health Status Breakdown', () => {
    it('displays all healthy characters', () => {
      const characters = [
        createMockCharacter({ maxHp: 100, currentHp: 100 }),
        createMockCharacter({ maxHp: 100, currentHp: 90 }),
        createMockCharacter({ maxHp: 100, currentHp: 76 }),
      ]
      mockUseGameStore.mockReturnValue(characters)

      render(<Dashboard />)

      const healthyCard = screen.getByTestId('stat-card-Healthy')
      expect(healthyCard).toHaveTextContent('3')
      expect(healthyCard).toHaveTextContent('3 above 75% HP')
      expect(healthyCard).toHaveTextContent('💚')
      expect(healthyCard).toHaveAttribute('data-color', 'green')

      const injuredCard = screen.getByTestId('stat-card-Injured')
      expect(injuredCard).toHaveTextContent('0')

      const unconsciousCard = screen.getByTestId('stat-card-Unconscious')
      expect(unconsciousCard).toHaveTextContent('0')
    })

    it('displays all injured characters', () => {
      const characters = [
        createMockCharacter({ maxHp: 100, currentHp: 75 }),
        createMockCharacter({ maxHp: 100, currentHp: 50 }),
        createMockCharacter({ maxHp: 100, currentHp: 1 }),
      ]
      mockUseGameStore.mockReturnValue(characters)

      render(<Dashboard />)

      const healthyCard = screen.getByTestId('stat-card-Healthy')
      expect(healthyCard).toHaveTextContent('0')

      const injuredCard = screen.getByTestId('stat-card-Injured')
      expect(injuredCard).toHaveTextContent('3')
      expect(injuredCard).toHaveTextContent('3 between 1-75% HP')
      expect(injuredCard).toHaveTextContent('💛')
      expect(injuredCard).toHaveAttribute('data-color', 'yellow')

      const unconsciousCard = screen.getByTestId('stat-card-Unconscious')
      expect(unconsciousCard).toHaveTextContent('0')
    })

    it('displays all unconscious characters', () => {
      const characters = [
        createMockCharacter({ maxHp: 100, currentHp: 0 }),
        createMockCharacter({ maxHp: 50, currentHp: 0 }),
      ]
      mockUseGameStore.mockReturnValue(characters)

      render(<Dashboard />)

      const healthyCard = screen.getByTestId('stat-card-Healthy')
      expect(healthyCard).toHaveTextContent('0')

      const injuredCard = screen.getByTestId('stat-card-Injured')
      expect(injuredCard).toHaveTextContent('0')

      const unconsciousCard = screen.getByTestId('stat-card-Unconscious')
      expect(unconsciousCard).toHaveTextContent('2')
      expect(unconsciousCard).toHaveTextContent('2 at 0 HP')
      expect(unconsciousCard).toHaveTextContent('💀')
      expect(unconsciousCard).toHaveAttribute('data-color', 'red')
    })

    it('displays mixed health statuses correctly', () => {
      const characters = [
        createMockCharacter({ maxHp: 100, currentHp: 100 }), // Healthy
        createMockCharacter({ maxHp: 100, currentHp: 80 }), // Healthy
        createMockCharacter({ maxHp: 100, currentHp: 50 }), // Injured
        createMockCharacter({ maxHp: 100, currentHp: 25 }), // Injured
        createMockCharacter({ maxHp: 100, currentHp: 0 }), // Unconscious
      ]
      mockUseGameStore.mockReturnValue(characters)

      render(<Dashboard />)

      const healthyCard = screen.getByTestId('stat-card-Healthy')
      expect(healthyCard).toHaveTextContent('2')

      const injuredCard = screen.getByTestId('stat-card-Injured')
      expect(injuredCard).toHaveTextContent('2')

      const unconsciousCard = screen.getByTestId('stat-card-Unconscious')
      expect(unconsciousCard).toHaveTextContent('1')
    })

    it('handles boundary case: exactly 75% HP is injured', () => {
      const characters = [createMockCharacter({ maxHp: 100, currentHp: 75 })]
      mockUseGameStore.mockReturnValue(characters)

      render(<Dashboard />)

      const healthyCard = screen.getByTestId('stat-card-Healthy')
      expect(healthyCard).toHaveTextContent('0')

      const injuredCard = screen.getByTestId('stat-card-Injured')
      expect(injuredCard).toHaveTextContent('1')
    })

    it('handles boundary case: exactly 76% HP is healthy', () => {
      const characters = [createMockCharacter({ maxHp: 100, currentHp: 76 })]
      mockUseGameStore.mockReturnValue(characters)

      render(<Dashboard />)

      const healthyCard = screen.getByTestId('stat-card-Healthy')
      expect(healthyCard).toHaveTextContent('1')

      const injuredCard = screen.getByTestId('stat-card-Injured')
      expect(injuredCard).toHaveTextContent('0')
    })
  })

  describe('Real-time Updates', () => {
    it('updates when character HP changes', () => {
      const characters = [createMockCharacter({ maxHp: 100, currentHp: 100 })]
      mockUseGameStore.mockReturnValue(characters)

      const { rerender } = render(<Dashboard />)

      let avgHpCard = screen.getByTestId('stat-card-Average HP')
      expect(avgHpCard).toHaveTextContent('100%')
      expect(avgHpCard).toHaveAttribute('data-color', 'green')

      // Simulate HP change
      characters[0].currentHp = 50
      mockUseGameStore.mockReturnValue([...characters])
      rerender(<Dashboard />)

      avgHpCard = screen.getByTestId('stat-card-Average HP')
      expect(avgHpCard).toHaveTextContent('50%')
      expect(avgHpCard).toHaveAttribute('data-color', 'yellow')
    })

    it('updates when characters are added', () => {
      const characters = [createMockCharacter({ name: 'Char 1' })]
      mockUseGameStore.mockReturnValue(characters)

      const { rerender } = render(<Dashboard />)

      let teamSizeCard = screen.getByTestId('stat-card-Team Size')
      expect(teamSizeCard).toHaveTextContent('1')

      // Add character
      characters.push(createMockCharacter({ name: 'Char 2' }))
      mockUseGameStore.mockReturnValue([...characters])
      rerender(<Dashboard />)

      teamSizeCard = screen.getByTestId('stat-card-Team Size')
      expect(teamSizeCard).toHaveTextContent('2')
    })

    it('updates when characters are removed', () => {
      const characters = [
        createMockCharacter({ name: 'Char 1' }),
        createMockCharacter({ name: 'Char 2' }),
      ]
      mockUseGameStore.mockReturnValue(characters)

      const { rerender } = render(<Dashboard />)

      let teamSizeCard = screen.getByTestId('stat-card-Team Size')
      expect(teamSizeCard).toHaveTextContent('2')

      // Remove character
      characters.pop()
      mockUseGameStore.mockReturnValue([...characters])
      rerender(<Dashboard />)

      teamSizeCard = screen.getByTestId('stat-card-Team Size')
      expect(teamSizeCard).toHaveTextContent('1')
    })

    it('shows empty state when last character removed', () => {
      const characters = [createMockCharacter()]
      mockUseGameStore.mockReturnValue(characters)

      const { rerender } = render(<Dashboard />)

      expect(screen.getByTestId('stat-card-Team Size')).toBeInTheDocument()

      // Remove all characters
      mockUseGameStore.mockReturnValue([])
      rerender(<Dashboard />)

      expect(
        screen.getByText('No characters in your roster yet.')
      ).toBeInTheDocument()
      expect(screen.queryByTestId(/stat-card/)).not.toBeInTheDocument()
    })
  })

  describe('Layout Structure', () => {
    it('renders main stats grid with Team Size and Average HP', () => {
      const characters = [createMockCharacter()]
      mockUseGameStore.mockReturnValue(characters)

      render(<Dashboard />)

      expect(screen.getByTestId('stat-card-Team Size')).toBeInTheDocument()
      expect(screen.getByTestId('stat-card-Average HP')).toBeInTheDocument()
    })

    it('renders health status breakdown with all three cards', () => {
      const characters = [createMockCharacter()]
      mockUseGameStore.mockReturnValue(characters)

      render(<Dashboard />)

      expect(screen.getByTestId('stat-card-Healthy')).toBeInTheDocument()
      expect(screen.getByTestId('stat-card-Injured')).toBeInTheDocument()
      expect(screen.getByTestId('stat-card-Unconscious')).toBeInTheDocument()
    })

    it('renders all 5 stat cards when characters exist', () => {
      const characters = [createMockCharacter()]
      mockUseGameStore.mockReturnValue(characters)

      render(<Dashboard />)

      const statCards = screen.getAllByTestId(/stat-card/)
      expect(statCards).toHaveLength(5)
    })
  })
})
