/**
 * Tests for MonsterLibrary Component
 *
 * Covers:
 * - Basic rendering (title, monster count, empty state)
 * - Category filtering (All, Humanoid, Beast, etc.)
 * - Search functionality (case-insensitive name filtering)
 * - Sort functionality (name, AC, HP, CR)
 * - Add to Combat button integration
 * - Add All to Combat button
 * - Responsive grid layout
 * - Accessibility (ARIA labels, button roles)
 */

import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import MonsterLibrary from '@/components/monsters/MonsterLibrary'
import { Monster } from '@/lib/schemas/monster.schema'
import * as monstersData from '@/lib/data/monsters'

// Mock the monsters data module
jest.mock('@/lib/data/monsters', () => ({
  getAllMonsters: jest.fn(),
  getMonsterCategories: jest.fn(),
  searchMonsters: jest.fn(),
}))

// Mock MonsterCard component
jest.mock('@/components/monsters/MonsterCard', () => ({
  MonsterCard: ({ monster, onAddToCombat }: any) => (
    <div data-testid={`monster-card-${monster.id}`}>
      <h3>{monster.name}</h3>
      <p>AC: {monster.armorClass}</p>
      <p>HP: {monster.hitPoints}</p>
      <button onClick={() => onAddToCombat?.(monster)}>Add to Combat</button>
    </div>
  ),
}))

describe('MonsterLibrary', () => {
  // Sample test monsters
  const mockMonsters: Monster[] = [
    {
      id: '1',
      name: 'Goblin Scout',
      type: 'Humanoid',
      armorClass: 13,
      hitPoints: 7,
      damage: '1d6+1',
      abilities: [{ name: 'Nimble Escape', description: 'Can disengage as bonus action' }],
      challenge: 0.25,
      size: 'Small',
      speed: 30,
      avatarSeed: 'goblin',
      description: 'A sneaky goblin',
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
    },
    {
      id: '2',
      name: 'Zombie',
      type: 'Undead',
      armorClass: 8,
      hitPoints: 22,
      damage: '1d6+1',
      abilities: [{ name: 'Undead Fortitude', description: 'Can survive lethal damage' }],
      challenge: 0.25,
      size: 'Medium',
      speed: 20,
      avatarSeed: 'zombie',
      description: 'A shambling zombie',
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
    },
    {
      id: '3',
      name: 'Ancient Wyrm',
      type: 'Dragon',
      armorClass: 22,
      hitPoints: 200,
      damage: '4d10+10',
      abilities: [{ name: 'Fire Breath', description: 'Devastating fire attack', damage: '10d6' }],
      challenge: 15,
      size: 'Gargantuan',
      speed: 40,
      avatarSeed: 'dragon',
      description: 'An ancient dragon',
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
    },
    {
      id: '4',
      name: 'Dire Wolf',
      type: 'Beast',
      armorClass: 14,
      hitPoints: 37,
      damage: '2d6+3',
      abilities: [{ name: 'Pack Tactics', description: 'Advantage on attacks' }],
      challenge: 1,
      size: 'Large',
      speed: 50,
      avatarSeed: 'wolf',
      description: 'A large predatory wolf',
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
    },
  ]

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks()
    ;(monstersData.getAllMonsters as jest.Mock).mockReturnValue(mockMonsters)
    ;(monstersData.getMonsterCategories as jest.Mock).mockReturnValue([
      'Humanoid',
      'Undead',
      'Dragon',
      'Beast',
    ])
  })

  describe('Basic Rendering', () => {
    it('renders the component with title', () => {
      render(<MonsterLibrary />)
      expect(screen.getByText('Monster Library')).toBeInTheDocument()
    })

    it('displays total monster count', () => {
      render(<MonsterLibrary />)
      expect(screen.getByText(/4 monsters/i)).toBeInTheDocument()
    })

    it('displays all monsters by default', () => {
      render(<MonsterLibrary />)
      expect(screen.getByText('Goblin Scout')).toBeInTheDocument()
      expect(screen.getByText('Zombie')).toBeInTheDocument()
      expect(screen.getByText('Ancient Wyrm')).toBeInTheDocument()
      expect(screen.getByText('Dire Wolf')).toBeInTheDocument()
    })

    it('renders monsters in a grid layout', () => {
      render(<MonsterLibrary />)
      const grid = screen.getByText('Goblin Scout').closest('.grid')
      expect(grid).toHaveClass('grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-3')
    })

    it('renders category filter tabs', () => {
      render(<MonsterLibrary />)
      expect(screen.getByRole('button', { name: /show all monsters/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /filter by humanoid/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /filter by undead/i })).toBeInTheDocument()
    })

    it('renders search input', () => {
      render(<MonsterLibrary />)
      expect(screen.getByPlaceholderText(/search monsters by name/i)).toBeInTheDocument()
    })

    it('renders sort dropdown', () => {
      render(<MonsterLibrary />)
      expect(screen.getByRole('combobox', { name: /sort monsters by/i })).toBeInTheDocument()
    })
  })

  describe('Category Filtering', () => {
    it('filters monsters by Humanoid category', async () => {
      const user = userEvent.setup()
      render(<MonsterLibrary />)

      const humanoidButton = screen.getByRole('button', { name: /filter by humanoid/i })
      await user.click(humanoidButton)

      expect(screen.getByText('Goblin Scout')).toBeInTheDocument()
      expect(screen.queryByText('Zombie')).not.toBeInTheDocument()
      expect(screen.queryByText('Ancient Wyrm')).not.toBeInTheDocument()
      expect(screen.getByText(/1 monster/i)).toBeInTheDocument() // Singular
    })

    it('filters monsters by Undead category', async () => {
      const user = userEvent.setup()
      render(<MonsterLibrary />)

      const undeadButton = screen.getByRole('button', { name: /filter by undead/i })
      await user.click(undeadButton)

      expect(screen.getByText('Zombie')).toBeInTheDocument()
      expect(screen.queryByText('Goblin Scout')).not.toBeInTheDocument()
    })

    it('shows all monsters when "All" button is clicked', async () => {
      const user = userEvent.setup()
      render(<MonsterLibrary />)

      // First filter by Humanoid
      const humanoidButton = screen.getByRole('button', { name: /filter by humanoid/i })
      await user.click(humanoidButton)
      expect(screen.queryByText('Zombie')).not.toBeInTheDocument()

      // Then click "All" to show all monsters again
      const allButton = screen.getByRole('button', { name: /show all monsters/i })
      await user.click(allButton)
      expect(screen.getByText('Zombie')).toBeInTheDocument()
      expect(screen.getByText('Goblin Scout')).toBeInTheDocument()
    })

    it('shows category count in filter buttons', () => {
      render(<MonsterLibrary />)
      expect(screen.getByRole('button', { name: /show all monsters/i })).toHaveTextContent('All (4)')
      expect(screen.getByRole('button', { name: /filter by humanoid/i })).toHaveTextContent(
        'Humanoid (1)'
      )
      expect(screen.getByRole('button', { name: /filter by undead/i })).toHaveTextContent(
        'Undead (1)'
      )
    })

    it('highlights active category button', async () => {
      const user = userEvent.setup()
      render(<MonsterLibrary />)

      const undeadButton = screen.getByRole('button', { name: /filter by undead/i })
      await user.click(undeadButton)

      expect(undeadButton).toHaveClass('bg-purple-600', 'text-white')
    })

    it('sets aria-pressed on active category', async () => {
      const user = userEvent.setup()
      render(<MonsterLibrary />)

      const humanoidButton = screen.getByRole('button', { name: /filter by humanoid/i })
      await user.click(humanoidButton)

      expect(humanoidButton).toHaveAttribute('aria-pressed', 'true')
    })
  })

  describe('Search Functionality', () => {
    it('filters monsters by search query (case-insensitive)', async () => {
      const user = userEvent.setup()
      render(<MonsterLibrary />)

      const searchInput = screen.getByPlaceholderText(/search monsters by name/i)
      await user.type(searchInput, 'goblin')

      expect(screen.getByText('Goblin Scout')).toBeInTheDocument()
      expect(screen.queryByText('Zombie')).not.toBeInTheDocument()
      expect(screen.queryByText('Ancient Wyrm')).not.toBeInTheDocument()
    })

    it('handles search query with capital letters', async () => {
      const user = userEvent.setup()
      render(<MonsterLibrary />)

      const searchInput = screen.getByPlaceholderText(/search monsters by name/i)
      await user.type(searchInput, 'WYRM')

      expect(screen.getByText('Ancient Wyrm')).toBeInTheDocument()
      expect(screen.queryByText('Goblin Scout')).not.toBeInTheDocument()
    })

    it('handles partial name matches', async () => {
      const user = userEvent.setup()
      render(<MonsterLibrary />)

      const searchInput = screen.getByPlaceholderText(/search monsters by name/i)
      await user.type(searchInput, 'wolf')

      expect(screen.getByText('Dire Wolf')).toBeInTheDocument()
    })

    it('updates monster count with search query text', async () => {
      const user = userEvent.setup()
      render(<MonsterLibrary />)

      const searchInput = screen.getByPlaceholderText(/search monsters by name/i)
      await user.type(searchInput, 'zombie')

      expect(screen.getByText(/1 monster matching "zombie"/i)).toBeInTheDocument()
    })

    it('shows empty state when no monsters match search', async () => {
      const user = userEvent.setup()
      render(<MonsterLibrary />)

      const searchInput = screen.getByPlaceholderText(/search monsters by name/i)
      await user.type(searchInput, 'nonexistent')

      expect(screen.getByText(/no monsters found matching/i)).toBeInTheDocument()
      expect(screen.getByText((content, element) => {
        return element?.textContent === '"nonexistent"'
      })).toBeInTheDocument()
    })

    it('clears filters button resets search query', async () => {
      const user = userEvent.setup()
      render(<MonsterLibrary />)

      const searchInput = screen.getByPlaceholderText(/search monsters by name/i)
      await user.type(searchInput, 'nonexistent')

      const clearButton = screen.getByRole('button', { name: /clear filters/i })
      await user.click(clearButton)

      expect(searchInput).toHaveValue('')
      expect(screen.getByText('Goblin Scout')).toBeInTheDocument()
    })

    it('combines category filter and search', async () => {
      const user = userEvent.setup()
      render(<MonsterLibrary />)

      // Filter by Undead
      const undeadButton = screen.getByRole('button', { name: /filter by undead/i })
      await user.click(undeadButton)

      // Search for "zombie"
      const searchInput = screen.getByPlaceholderText(/search monsters by name/i)
      await user.type(searchInput, 'zombie')

      expect(screen.getByText('Zombie')).toBeInTheDocument()
      expect(screen.queryByText('Goblin Scout')).not.toBeInTheDocument()
    })
  })

  describe('Sort Functionality', () => {
    it('sorts monsters by name (A-Z)', async () => {
      const user = userEvent.setup()
      render(<MonsterLibrary />)

      const sortSelect = screen.getByRole('combobox', { name: /sort monsters by/i })
      await user.selectOptions(sortSelect, 'name')

      const monsterCards = screen.getAllByRole('heading', { level: 3 })
      const monsterNames = monsterCards.map((card) => card.textContent)

      expect(monsterNames).toEqual(['Ancient Wyrm', 'Dire Wolf', 'Goblin Scout', 'Zombie'])
    })

    it('sorts monsters by AC (high to low)', async () => {
      const user = userEvent.setup()
      render(<MonsterLibrary />)

      const sortSelect = screen.getByRole('combobox', { name: /sort monsters by/i })
      await user.selectOptions(sortSelect, 'ac')

      const monsterCards = screen.getAllByRole('heading', { level: 3 })
      const monsterNames = monsterCards.map((card) => card.textContent)

      // Ancient Wyrm (AC 22), Dire Wolf (14), Goblin Scout (13), Zombie (8)
      expect(monsterNames).toEqual(['Ancient Wyrm', 'Dire Wolf', 'Goblin Scout', 'Zombie'])
    })

    it('sorts monsters by HP (high to low)', async () => {
      const user = userEvent.setup()
      render(<MonsterLibrary />)

      const sortSelect = screen.getByRole('combobox', { name: /sort monsters by/i })
      await user.selectOptions(sortSelect, 'hp')

      const monsterCards = screen.getAllByRole('heading', { level: 3 })
      const monsterNames = monsterCards.map((card) => card.textContent)

      // Ancient Wyrm (200 HP), Dire Wolf (37), Zombie (22), Goblin Scout (7)
      expect(monsterNames).toEqual(['Ancient Wyrm', 'Dire Wolf', 'Zombie', 'Goblin Scout'])
    })

    it('sorts monsters by CR (high to low)', async () => {
      const user = userEvent.setup()
      render(<MonsterLibrary />)

      const sortSelect = screen.getByRole('combobox', { name: /sort monsters by/i })
      await user.selectOptions(sortSelect, 'cr')

      const monsterCards = screen.getAllByRole('heading', { level: 3 })
      const monsterNames = monsterCards.map((card) => card.textContent)

      // Ancient Wyrm (CR 15), Dire Wolf (1), Goblin Scout (0.25), Zombie (0.25)
      expect(monsterNames).toEqual(['Ancient Wyrm', 'Dire Wolf', 'Goblin Scout', 'Zombie'])
    })
  })

  describe('Add to Combat Integration', () => {
    it('calls onAddToCombat when MonsterCard button is clicked', async () => {
      const user = userEvent.setup()
      const mockAddToCombat = jest.fn()
      render(<MonsterLibrary onAddToCombat={mockAddToCombat} />)

      const addButtons = screen.getAllByRole('button', { name: /add to combat/i })
      await user.click(addButtons[0]) // Click first monster's button (sorted by name: Ancient Wyrm)

      expect(mockAddToCombat).toHaveBeenCalledTimes(1)
      // Monsters are sorted by name, so first is "Ancient Wyrm" (id: '3')
      expect(mockAddToCombat).toHaveBeenCalledWith(expect.objectContaining({ id: '3', name: 'Ancient Wyrm' }))
    })

    it('does not show "Add All to Combat" button when callback not provided', () => {
      render(<MonsterLibrary />)
      expect(
        screen.queryByRole('button', { name: /add all \d+ monsters to combat/i })
      ).not.toBeInTheDocument()
    })

    it('shows "Add All to Combat" button when callback provided', () => {
      const mockAddAllToCombat = jest.fn()
      render(<MonsterLibrary onAddAllToCombat={mockAddAllToCombat} />)

      expect(
        screen.getByRole('button', { name: /add all 4 monsters to combat/i })
      ).toBeInTheDocument()
    })

    it('calls onAddAllToCombat with all filtered monsters', async () => {
      const user = userEvent.setup()
      const mockAddAllToCombat = jest.fn()
      render(<MonsterLibrary onAddAllToCombat={mockAddAllToCombat} />)

      const addAllButton = screen.getByRole('button', { name: /add all 4 monsters to combat/i })
      await user.click(addAllButton)

      expect(mockAddAllToCombat).toHaveBeenCalledTimes(1)
      // Monsters are sorted by name by default
      const sortedMonsters = [...mockMonsters].sort((a, b) => a.name.localeCompare(b.name))
      expect(mockAddAllToCombat).toHaveBeenCalledWith(sortedMonsters)
    })

    it('updates "Add All" count when filtering', async () => {
      const user = userEvent.setup()
      const mockAddAllToCombat = jest.fn()
      render(<MonsterLibrary onAddAllToCombat={mockAddAllToCombat} />)

      // Filter by Humanoid (1 monster)
      const humanoidButton = screen.getByRole('button', { name: /filter by humanoid/i })
      await user.click(humanoidButton)

      const addAllButton = screen.getByRole('button', { name: /add all 1 monsters to combat/i })
      await user.click(addAllButton)

      // Only Goblin Scout (Humanoid)
      const goblinScout = mockMonsters.find((m) => m.type === 'Humanoid')
      expect(mockAddAllToCombat).toHaveBeenCalledWith([goblinScout])
    })

    it('hides "Add All" button when no monsters match filters', async () => {
      const user = userEvent.setup()
      const mockAddAllToCombat = jest.fn()
      render(<MonsterLibrary onAddAllToCombat={mockAddAllToCombat} />)

      const searchInput = screen.getByPlaceholderText(/search monsters by name/i)
      await user.type(searchInput, 'nonexistent')

      expect(
        screen.queryByRole('button', { name: /add all \d+ monsters to combat/i })
      ).not.toBeInTheDocument()
    })
  })

  describe('Empty States', () => {
    it('shows empty state when no monsters in library', () => {
      ;(monstersData.getAllMonsters as jest.Mock).mockReturnValue([])
      ;(monstersData.getMonsterCategories as jest.Mock).mockReturnValue([])

      render(<MonsterLibrary />)

      expect(screen.getByText(/no monsters/i)).toBeInTheDocument()
    })

    it('shows search-specific empty state', async () => {
      const user = userEvent.setup()
      render(<MonsterLibrary />)

      const searchInput = screen.getByPlaceholderText(/search monsters by name/i)
      await user.type(searchInput, 'xyz')

      expect(screen.getByText(/no monsters found matching/i)).toBeInTheDocument()
      expect(screen.getByText((content, element) => {
        return element?.textContent === 'No monsters found matching "xyz"'
      })).toBeInTheDocument()
    })

    it('shows category-specific empty state', async () => {
      const user = userEvent.setup()

      // Add a category with no monsters
      ;(monstersData.getMonsterCategories as jest.Mock).mockReturnValue([
        'Humanoid',
        'Undead',
        'Dragon',
        'Beast',
        'Construct',
      ])

      render(<MonsterLibrary />)

      const constructButton = screen.getByRole('button', { name: /filter by construct/i })
      await user.click(constructButton)

      expect(screen.getByText(/no monsters in the construct category/i)).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('has accessible labels for search input', () => {
      render(<MonsterLibrary />)
      const searchInput = screen.getByRole('textbox', { name: /search monsters by name/i })
      expect(searchInput).toBeInTheDocument()
    })

    it('has accessible labels for sort dropdown', () => {
      render(<MonsterLibrary />)
      const sortSelect = screen.getByRole('combobox', { name: /sort monsters by/i })
      expect(sortSelect).toBeInTheDocument()
    })

    it('has accessible labels for category filter buttons', () => {
      render(<MonsterLibrary />)
      expect(screen.getByRole('button', { name: /show all monsters/i })).toHaveAttribute(
        'aria-label',
        'Show all monsters'
      )
      expect(screen.getByRole('button', { name: /filter by humanoid/i })).toHaveAttribute(
        'aria-label',
        'Filter by Humanoid'
      )
    })

    it('has accessible label for "Add All" button', () => {
      const mockAddAllToCombat = jest.fn()
      render(<MonsterLibrary onAddAllToCombat={mockAddAllToCombat} />)

      expect(
        screen.getByRole('button', { name: /add all 4 monsters to combat/i })
      ).toHaveAttribute('aria-label', 'Add all 4 monsters to combat')
    })
  })

  describe('Edge Cases', () => {
    it('handles monsters with same name (sorts by ID as tiebreaker)', () => {
      const duplicateMonsters = [
        { ...mockMonsters[0], id: 'a', name: 'Goblin' },
        { ...mockMonsters[1], id: 'b', name: 'Goblin' },
      ]
      ;(monstersData.getAllMonsters as jest.Mock).mockReturnValue(duplicateMonsters)

      render(<MonsterLibrary />)

      expect(screen.getAllByText('Goblin')).toHaveLength(2)
    })

    it('handles empty search query (shows all monsters)', async () => {
      const user = userEvent.setup()
      render(<MonsterLibrary />)

      const searchInput = screen.getByPlaceholderText(/search monsters by name/i)
      await user.type(searchInput, '   ') // Whitespace only

      expect(screen.getByText('Goblin Scout')).toBeInTheDocument()
      expect(screen.getByText('Zombie')).toBeInTheDocument()
    })

    it('preserves sort order when filtering', async () => {
      const user = userEvent.setup()
      render(<MonsterLibrary />)

      // Sort by HP first
      const sortSelect = screen.getByRole('combobox', { name: /sort monsters by/i })
      await user.selectOptions(sortSelect, 'hp')

      // Then filter by category
      const humanoidButton = screen.getByRole('button', { name: /filter by humanoid/i })
      await user.click(humanoidButton)

      // Should still be sorted by HP (even though only 1 monster)
      expect(screen.getByText('Goblin Scout')).toBeInTheDocument()
    })
  })
})
