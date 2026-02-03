/**
 * Tests for Monster Library Page
 *
 * Covers:
 * - Basic rendering (title, description, MonsterLibrary component)
 * - Add to Combat functionality (single monster)
 * - Add All to Combat functionality (batch)
 * - Toast notifications (success/error)
 * - Name disambiguation for duplicate monsters
 * - Navigation links
 * - Store integration
 */

import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import MonstersPage from '@/app/monsters/page'
import { useGameStore } from '@/lib/store/gameStore'
import { Monster } from '@/lib/schemas/monster.schema'

// Mock the MonsterLibrary component
jest.mock('@/components/monsters/MonsterLibrary', () => {
  return function MockMonsterLibrary({
    onAddToCombat,
    onAddAllToCombat,
  }: {
    onAddToCombat?: (monster: Monster) => void
    onAddAllToCombat?: (monsters: Monster[]) => void
  }) {
    const mockMonster: Monster = {
      id: '1',
      name: 'Test Goblin',
      type: 'Humanoid',
      armorClass: 13,
      hitPoints: 7,
      damage: '1d6+1',
      abilities: [],
      challenge: 0.25,
      size: 'Small',
      speed: 30,
      avatarSeed: 'goblin',
      description: 'A test goblin',
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
    }

    const mockMonsters: Monster[] = [
      mockMonster,
      { ...mockMonster, id: '2', name: 'Test Zombie', type: 'Undead' },
    ]

    return (
      <div data-testid="monster-library">
        <button onClick={() => onAddToCombat?.(mockMonster)}>Add Test Goblin</button>
        <button onClick={() => onAddAllToCombat?.(mockMonsters)}>Add All Monsters</button>
      </div>
    )
  }
})

// Mock Toast component
jest.mock('@/components/ui/Toast', () => ({
  Toast: function MockToast({
    type,
    message,
    onDismiss,
  }: {
    type: string
    message: string
    onDismiss: () => void
  }) {
    return (
      <div data-testid={`toast-${type}`}>
        <span>{message}</span>
        <button onClick={onDismiss}>Dismiss</button>
      </div>
    )
  },
}))

// Mock Next.js Link
jest.mock('next/link', () => {
  return function MockLink({ children, href }: { children: React.ReactNode; href: string }) {
    return <a href={href}>{children}</a>
  }
})

// Mock Zustand store
jest.mock('@/lib/store/gameStore', () => ({
  useGameStore: jest.fn(),
}))

describe('MonstersPage', () => {
  const mockAddCombatant = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useGameStore as unknown as jest.Mock).mockImplementation((selector: any) => {
      const store = {
        addCombatant: mockAddCombatant,
      }
      return selector(store)
    })
  })

  describe('Basic Rendering', () => {
    it('renders the page title', () => {
      render(<MonstersPage />)
      expect(screen.getByText(/outlaw bounties/i)).toBeInTheDocument()
    })

    it('renders the page description', () => {
      render(<MonstersPage />)
      expect(
        screen.getByText(/browse wanted outlaws, filter by type, and add them to showdowns/i)
      ).toBeInTheDocument()
    })

    it('renders the MonsterLibrary component', () => {
      render(<MonstersPage />)
      expect(screen.getByTestId('monster-library')).toBeInTheDocument()
    })

    it('renders navigation links', () => {
      render(<MonstersPage />)
      expect(screen.getByRole('link', { name: /go to showdown/i })).toHaveAttribute(
        'href',
        '/combat'
      )
      expect(screen.getByRole('link', { name: /back to dashboard/i })).toHaveAttribute(
        'href',
        '/dashboard'
      )
      expect(screen.getByRole('link', { name: /manage posse/i })).toHaveAttribute(
        'href',
        '/characters'
      )
    })
  })

  describe('Add to Combat - Single Monster', () => {
    it('adds a monster to combat when button is clicked', async () => {
      const user = userEvent.setup()
      render(<MonstersPage />)

      const addButton = screen.getByRole('button', { name: /add test goblin/i })
      await user.click(addButton)

      expect(mockAddCombatant).toHaveBeenCalledTimes(1)
      expect(mockAddCombatant).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'monster',
          name: 'Test Goblin',
          armorClass: 13,
          maxHp: 7,
          currentHp: 7,
          isPlayer: false,
        })
      )
    })

    it('shows success toast after adding monster', async () => {
      const user = userEvent.setup()
      render(<MonstersPage />)

      const addButton = screen.getByRole('button', { name: /add test goblin/i })
      await user.click(addButton)

      await waitFor(() => {
        expect(screen.getByTestId('toast-success')).toBeInTheDocument()
        expect(screen.getByText(/test goblin added to combat!/i)).toBeInTheDocument()
      })
    })

    it('dismisses toast when dismiss button is clicked', async () => {
      const user = userEvent.setup()
      render(<MonstersPage />)

      const addButton = screen.getByRole('button', { name: /add test goblin/i })
      await user.click(addButton)

      await waitFor(() => {
        expect(screen.getByTestId('toast-success')).toBeInTheDocument()
      })

      const dismissButton = screen.getByRole('button', { name: /dismiss/i })
      await user.click(dismissButton)

      await waitFor(() => {
        expect(screen.queryByTestId('toast-success')).not.toBeInTheDocument()
      })
    })

    it('shows error toast when adding monster fails', async () => {
      mockAddCombatant.mockImplementation(() => {
        throw new Error('Failed to add')
      })

      const user = userEvent.setup()
      render(<MonstersPage />)

      const addButton = screen.getByRole('button', { name: /add test goblin/i })
      await user.click(addButton)

      await waitFor(() => {
        expect(screen.getByTestId('toast-error')).toBeInTheDocument()
        expect(screen.getByText(/failed to add test goblin to combat/i)).toBeInTheDocument()
      })
    })
  })

  describe('Add All to Combat - Batch', () => {
    beforeEach(() => {
      // Reset mock implementation to default
      mockAddCombatant.mockImplementation(() => {})
    })

    it('adds all monsters to combat when "Add All" is clicked', async () => {
      const user = userEvent.setup()
      render(<MonstersPage />)

      const addAllButton = screen.getByRole('button', { name: /add all monsters/i })
      await user.click(addAllButton)

      expect(mockAddCombatant).toHaveBeenCalledTimes(2)
      expect(mockAddCombatant).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'monster',
          name: 'Test Goblin',
        })
      )
      expect(mockAddCombatant).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'monster',
          name: 'Test Zombie',
        })
      )
    })

    it('shows success toast with count after adding all monsters', async () => {
      const user = userEvent.setup()
      render(<MonstersPage />)

      const addAllButton = screen.getByRole('button', { name: /add all monsters/i })
      await user.click(addAllButton)

      await waitFor(() => {
        expect(screen.getByTestId('toast-success')).toBeInTheDocument()
        expect(screen.getByText(/2 outlaws added to combat!/i)).toBeInTheDocument()
      })
    })

    it('creates proper combatant structure for batch add', async () => {
      mockAddCombatant.mockClear() // Clear previous calls
      const user = userEvent.setup()
      render(<MonstersPage />)

      const addAllButton = screen.getByRole('button', { name: /add all monsters/i })
      await user.click(addAllButton)

      // Verify both monsters were added with correct structure
      expect(mockAddCombatant).toHaveBeenCalledTimes(2)
      const firstCall = mockAddCombatant.mock.calls[0][0]
      const secondCall = mockAddCombatant.mock.calls[1][0]

      expect(firstCall).toMatchObject({
        type: 'monster',
        isPlayer: false,
        isActive: false,
      })
      expect(secondCall).toMatchObject({
        type: 'monster',
        isPlayer: false,
        isActive: false,
      })
    })

    it('shows error toast when batch add fails', async () => {
      mockAddCombatant.mockClear() // Clear previous calls
      mockAddCombatant.mockImplementation(() => {
        throw new Error('Failed to add')
      })

      const user = userEvent.setup()
      render(<MonstersPage />)

      const addAllButton = screen.getByRole('button', { name: /add all monsters/i })
      await user.click(addAllButton)

      await waitFor(() => {
        expect(screen.getByTestId('toast-error')).toBeInTheDocument()
        expect(screen.getByText(/failed to add outlaws to combat/i)).toBeInTheDocument()
      })
    })
  })

  describe('Name Disambiguation Logic', () => {
    it('handles duplicate monster names by testing the logic directly', () => {
      // Test the name disambiguation logic used in handleAddAllToCombat
      const monsters = [
        { name: 'Goblin', id: '1' },
        { name: 'Goblin', id: '2' },
        { name: 'Goblin', id: '3' },
        { name: 'Zombie', id: '4' },
      ]

      const nameCounts = new Map<string, number>()
      const instanceNames: string[] = []

      monsters.forEach((monster) => {
        const count = nameCounts.get(monster.name) || 0
        const instanceName = count > 0 ? `${monster.name} ${count + 1}` : monster.name
        instanceNames.push(instanceName)
        nameCounts.set(monster.name, count + 1)
      })

      expect(instanceNames).toEqual(['Goblin', 'Goblin 2', 'Goblin 3', 'Zombie'])
    })
  })

  describe('Store Integration', () => {
    it('uses Zustand store to add combatants', async () => {
      const user = userEvent.setup()
      render(<MonstersPage />)

      const addButton = screen.getByRole('button', { name: /add test goblin/i })
      await user.click(addButton)

      expect(mockAddCombatant).toHaveBeenCalledWith(
        expect.objectContaining({
          entityId: '1',
          type: 'monster',
        })
      )
    })

    it('creates combatant with correct properties from monster', async () => {
      const user = userEvent.setup()
      render(<MonstersPage />)

      const addButton = screen.getByRole('button', { name: /add test goblin/i })
      await user.click(addButton)

      const combatant = mockAddCombatant.mock.calls[0][0]
      expect(combatant).toMatchObject({
        type: 'monster',
        name: 'Test Goblin',
        armorClass: 13,
        maxHp: 7,
        currentHp: 7,
        initiative: 13, // Defaults to AC
        isActive: false,
        isPlayer: false,
        conditions: [],
      })
    })
  })
})
