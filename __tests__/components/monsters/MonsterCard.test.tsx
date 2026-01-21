/**
 * Tests for MonsterCard Component
 *
 * Validates monster stat display, special abilities rendering,
 * "Add to Combat" functionality, and accessibility
 */

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MonsterCard } from '@/components/monsters/MonsterCard'
import { Monster } from '@/lib/schemas/monster.schema'
import { randomUUID } from 'crypto'

// Mock avatar utility
jest.mock('@/lib/utils/avatar', () => ({
  getAvatarSource: jest.fn(
    (imageUrl?: string, seed?: string, name?: string) =>
      imageUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${seed || name}`
  ),
}))

describe('MonsterCard', () => {
  // Sample monster data for testing
  const mockMonster: Monster = {
    id: randomUUID(),
    name: 'Goblin Scout',
    type: 'Humanoid',
    armorClass: 13,
    hitPoints: 7,
    damage: '1d6+1',
    abilities: [
      {
        name: 'Nimble Escape',
        description: 'Can take the Disengage or Hide action as a bonus action on each turn.',
      },
    ],
    challenge: 0.25,
    size: 'Small',
    speed: 30,
    avatarSeed: 'goblin-scout',
    description: 'Small, cunning humanoid creatures that live in dark caves and forests.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  const mockBossMonster: Monster = {
    id: randomUUID(),
    name: 'Ancient Wyrm',
    type: 'Dragon',
    armorClass: 19,
    hitPoints: 200,
    damage: '3d10+7',
    abilities: [
      {
        name: 'Fire Breath',
        description: 'Exhales fire in a 60-foot cone.',
        damage: '10d6+0',
        usage: 'Recharge 5-6',
      },
      {
        name: 'Legendary Resistance',
        description: 'If the dragon fails a saving throw, it can choose to succeed instead.',
        usage: '3/Day',
      },
    ],
    challenge: 15,
    size: 'Gargantuan',
    speed: 40,
    avatarSeed: 'ancient-wyrm',
    description: 'Colossal dragon with scales like molten metal.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  describe('Basic Rendering', () => {
    it('should render monster name', () => {
      render(<MonsterCard monster={mockMonster} />)
      expect(screen.getByText('Goblin Scout')).toBeInTheDocument()
    })

    it('should render monster type badge', () => {
      render(<MonsterCard monster={mockMonster} />)
      expect(screen.getByText('Humanoid')).toBeInTheDocument()
    })

    it('should render armor class', () => {
      render(<MonsterCard monster={mockMonster} />)
      expect(screen.getByText('AC')).toBeInTheDocument()
      expect(screen.getByText('13')).toBeInTheDocument()
    })

    it('should render hit points', () => {
      render(<MonsterCard monster={mockMonster} />)
      expect(screen.getByText('HP')).toBeInTheDocument()
      expect(screen.getByText('7')).toBeInTheDocument()
    })

    it('should render damage output', () => {
      render(<MonsterCard monster={mockMonster} />)
      expect(screen.getByText('Damage')).toBeInTheDocument()
      expect(screen.getByText('1d6+1')).toBeInTheDocument()
    })

    it('should render challenge rating', () => {
      render(<MonsterCard monster={mockMonster} />)
      expect(screen.getByText('Challenge')).toBeInTheDocument()
      expect(screen.getByText('CR 1/4')).toBeInTheDocument()
    })

    it('should render size', () => {
      const { container } = render(<MonsterCard monster={mockMonster} />)
      expect(screen.getByText(/Size:/)).toBeInTheDocument()
      // Check for "Small" in the Size section specifically
      const sizeElements = screen.getAllByText(/Small/)
      expect(sizeElements.length).toBeGreaterThan(0)
    })

    it('should render speed', () => {
      render(<MonsterCard monster={mockMonster} />)
      expect(screen.getByText(/Speed:/)).toBeInTheDocument()
      expect(screen.getByText(/30 ft/)).toBeInTheDocument()
    })

    it('should render description when provided', () => {
      render(<MonsterCard monster={mockMonster} />)
      expect(
        screen.getByText(/Small, cunning humanoid creatures that live in dark caves/)
      ).toBeInTheDocument()
    })

    it('should render monster avatar', () => {
      render(<MonsterCard monster={mockMonster} />)
      const avatar = screen.getByAltText("Goblin Scout's avatar")
      expect(avatar).toBeInTheDocument()
      expect(avatar).toHaveAttribute('src', expect.stringContaining('goblin-scout'))
    })
  })

  describe('Challenge Rating Display', () => {
    it('should display CR 1/4 for challenge 0.25', () => {
      const monster = { ...mockMonster, challenge: 0.25 }
      render(<MonsterCard monster={monster} />)
      expect(screen.getByText('CR 1/4')).toBeInTheDocument()
    })

    it('should display CR 1/2 for challenge 0.5', () => {
      const monster = { ...mockMonster, challenge: 0.5 }
      render(<MonsterCard monster={monster} />)
      expect(screen.getByText('CR 1/2')).toBeInTheDocument()
    })

    it('should display CR X for whole number challenges', () => {
      const monster = { ...mockMonster, challenge: 5 }
      render(<MonsterCard monster={monster} />)
      expect(screen.getByText('CR 5')).toBeInTheDocument()
    })

    it('should display high CR numbers correctly', () => {
      render(<MonsterCard monster={mockBossMonster} />)
      expect(screen.getByText('CR 15')).toBeInTheDocument()
    })
  })

  describe('Special Abilities', () => {
    it('should render special abilities section when abilities exist', () => {
      render(<MonsterCard monster={mockMonster} />)
      expect(screen.getByText('Special Abilities:')).toBeInTheDocument()
    })

    it('should render ability name', () => {
      render(<MonsterCard monster={mockMonster} />)
      expect(screen.getByText('Nimble Escape')).toBeInTheDocument()
    })

    it('should render ability description', () => {
      render(<MonsterCard monster={mockMonster} />)
      expect(
        screen.getByText(/Can take the Disengage or Hide action/)
      ).toBeInTheDocument()
    })

    it('should render ability usage when provided', () => {
      render(<MonsterCard monster={mockBossMonster} />)
      expect(screen.getByText('(Recharge 5-6)')).toBeInTheDocument()
      expect(screen.getByText('(3/Day)')).toBeInTheDocument()
    })

    it('should render ability damage when provided', () => {
      render(<MonsterCard monster={mockBossMonster} />)
      expect(screen.getByText(/Damage: 10d6\+0/)).toBeInTheDocument()
    })

    it('should render multiple abilities', () => {
      render(<MonsterCard monster={mockBossMonster} />)
      expect(screen.getByText('Fire Breath')).toBeInTheDocument()
      expect(screen.getByText('Legendary Resistance')).toBeInTheDocument()
    })

    it('should not render abilities section when no abilities', () => {
      const monsterNoAbilities = { ...mockMonster, abilities: [] }
      render(<MonsterCard monster={monsterNoAbilities} />)
      expect(screen.queryByText('Special Abilities:')).not.toBeInTheDocument()
    })
  })

  describe('Add to Combat Button', () => {
    it('should render "Add to Combat" button when callback provided', () => {
      const onAddToCombat = jest.fn()
      render(<MonsterCard monster={mockMonster} onAddToCombat={onAddToCombat} />)
      expect(screen.getByRole('button', { name: /Add Goblin Scout to combat/i })).toBeInTheDocument()
    })

    it('should not render "Add to Combat" button when no callback provided', () => {
      render(<MonsterCard monster={mockMonster} />)
      expect(screen.queryByRole('button', { name: /Add to combat/i })).not.toBeInTheDocument()
    })

    it('should call onAddToCombat when button clicked', async () => {
      const user = userEvent.setup()
      const onAddToCombat = jest.fn()
      render(<MonsterCard monster={mockMonster} onAddToCombat={onAddToCombat} />)

      const button = screen.getByRole('button', { name: /Add Goblin Scout to combat/i })
      await user.click(button)

      expect(onAddToCombat).toHaveBeenCalledTimes(1)
      expect(onAddToCombat).toHaveBeenCalledWith(mockMonster)
    })

    it('should display button text with emoji', () => {
      const onAddToCombat = jest.fn()
      render(<MonsterCard monster={mockMonster} onAddToCombat={onAddToCombat} />)
      expect(screen.getByText(/⚔️ Add to Combat/)).toBeInTheDocument()
    })
  })

  describe('Visual Styling', () => {
    it('should have red/orange gradient background', () => {
      const { container } = render(<MonsterCard monster={mockMonster} />)
      const card = container.firstChild as HTMLElement
      expect(card).toHaveClass('bg-gradient-to-br', 'from-red-50', 'to-orange-50')
    })

    it('should have red border', () => {
      const { container } = render(<MonsterCard monster={mockMonster} />)
      const card = container.firstChild as HTMLElement
      expect(card).toHaveClass('border-2', 'border-red-200')
    })

    it('should apply custom className when provided', () => {
      const { container } = render(<MonsterCard monster={mockMonster} className="custom-class" />)
      const card = container.firstChild as HTMLElement
      expect(card).toHaveClass('custom-class')
    })

    it('should have hover effects', () => {
      const { container } = render(<MonsterCard monster={mockMonster} />)
      const card = container.firstChild as HTMLElement
      expect(card).toHaveClass('hover:shadow-md', 'hover:scale-105')
    })
  })

  describe('Type-Specific Styling', () => {
    it('should apply correct color for Humanoid type', () => {
      render(<MonsterCard monster={mockMonster} />)
      const badge = screen.getByText('Humanoid')
      expect(badge).toHaveClass('bg-amber-100', 'text-amber-800')
    })

    it('should apply correct color for Dragon type', () => {
      render(<MonsterCard monster={mockBossMonster} />)
      const badge = screen.getByText('Dragon')
      expect(badge).toHaveClass('bg-orange-100', 'text-orange-800')
    })

    it('should apply correct color for Undead type', () => {
      const undeadMonster = { ...mockMonster, type: 'Undead' as const }
      render(<MonsterCard monster={undeadMonster} />)
      const badge = screen.getByText('Undead')
      expect(badge).toHaveClass('bg-purple-100', 'text-purple-800')
    })

    it('should apply correct color for Beast type', () => {
      const beastMonster = { ...mockMonster, type: 'Beast' as const }
      render(<MonsterCard monster={beastMonster} />)
      const badge = screen.getByText('Beast')
      expect(badge).toHaveClass('bg-green-100', 'text-green-800')
    })

    it('should apply correct color for Chaos type', () => {
      const chaosMonster = { ...mockMonster, type: 'Chaos' as const }
      render(<MonsterCard monster={chaosMonster} />)
      const badge = screen.getByText('Chaos')
      expect(badge).toHaveClass('bg-red-100', 'text-red-800')
    })
  })

  describe('Accessibility', () => {
    it('should have accessible button label', () => {
      const onAddToCombat = jest.fn()
      render(<MonsterCard monster={mockMonster} onAddToCombat={onAddToCombat} />)
      const button = screen.getByRole('button', { name: /Add Goblin Scout to combat/i })
      expect(button).toHaveAccessibleName()
    })

    it('should have alt text for avatar image', () => {
      render(<MonsterCard monster={mockMonster} />)
      const avatar = screen.getByAltText("Goblin Scout's avatar")
      expect(avatar).toBeInTheDocument()
    })

    it('should have title attribute for ability descriptions (tooltip)', () => {
      const { container } = render(<MonsterCard monster={mockMonster} />)
      const abilityElement = container.querySelector('[title*="Disengage"]')
      expect(abilityElement).toBeInTheDocument()
    })

    it('should have title attribute for description (tooltip)', () => {
      const { container } = render(<MonsterCard monster={mockMonster} />)
      const descElement = container.querySelector(`[title*="${mockMonster.description}"]`)
      expect(descElement).toBeInTheDocument()
    })
  })

  describe('Edge Cases', () => {
    it('should handle monster with no description', () => {
      const monsterNoDesc = { ...mockMonster, description: undefined }
      render(<MonsterCard monster={monsterNoDesc} />)
      expect(screen.queryByText(/Small, cunning humanoid/)).not.toBeInTheDocument()
    })

    it('should handle monster with empty description', () => {
      const monsterEmptyDesc = { ...mockMonster, description: '' }
      render(<MonsterCard monster={monsterEmptyDesc} />)
      // Should not render empty description paragraph
      const { container } = render(<MonsterCard monster={monsterEmptyDesc} />)
      expect(container.querySelector('.italic.line-clamp-2')).not.toBeInTheDocument()
    })

    it('should handle monster with no abilities', () => {
      const monsterNoAbilities = { ...mockMonster, abilities: [] }
      render(<MonsterCard monster={monsterNoAbilities} />)
      expect(screen.queryByText('Special Abilities:')).not.toBeInTheDocument()
    })

    it('should handle large HP values', () => {
      const tankMonster = { ...mockMonster, hitPoints: 999 }
      render(<MonsterCard monster={tankMonster} />)
      expect(screen.getByText('999')).toBeInTheDocument()
    })

    it('should handle low AC values', () => {
      const lowAcMonster = { ...mockMonster, armorClass: 5 }
      render(<MonsterCard monster={lowAcMonster} />)
      expect(screen.getByText('5')).toBeInTheDocument()
    })

    it('should handle high AC values', () => {
      const highAcMonster = { ...mockMonster, armorClass: 25 }
      render(<MonsterCard monster={highAcMonster} />)
      expect(screen.getByText('25')).toBeInTheDocument()
    })
  })
})
