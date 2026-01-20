/**
 * Tests for ConditionBadge Component
 *
 * Tests badge rendering, tooltip display, and remove functionality.
 */

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ConditionBadge } from '@/components/conditions/ConditionBadge'
import { Condition } from '@/lib/schemas/condition.schema'

describe('ConditionBadge', () => {
  const testCondition: Condition = 'Poisoned'

  describe('Rendering', () => {
    it('renders condition name', () => {
      render(<ConditionBadge condition={testCondition} />)

      expect(screen.getByText('Poisoned')).toBeInTheDocument()
    })

    it('renders with correct ARIA label', () => {
      render(<ConditionBadge condition={testCondition} />)

      const badge = screen.getByRole('status')
      expect(badge).toHaveAttribute('aria-label', 'Poisoned condition')
    })

    it('renders remove button when onRemove provided', () => {
      const mockOnRemove = jest.fn()

      render(<ConditionBadge condition={testCondition} onRemove={mockOnRemove} />)

      const removeButton = screen.getByRole('button')
      expect(removeButton).toBeInTheDocument()
      expect(removeButton).toHaveAttribute('title', 'Remove Poisoned')
    })

    it('does not render remove button when onRemove not provided', () => {
      render(<ConditionBadge condition={testCondition} />)

      const buttons = screen.queryAllByRole('button')
      expect(buttons).toHaveLength(0)
    })

    it('applies correct size classes for sm size', () => {
      render(<ConditionBadge condition={testCondition} size="sm" />)

      const badge = screen.getByRole('status')
      expect(badge.firstChild).toHaveClass('text-xs')
    })

    it('applies correct size classes for md size', () => {
      render(<ConditionBadge condition={testCondition} size="md" />)

      const badge = screen.getByRole('status')
      expect(badge.firstChild).toHaveClass('text-sm')
    })

    it('applies correct size classes for lg size', () => {
      render(<ConditionBadge condition={testCondition} size="lg" />)

      const badge = screen.getByRole('status')
      expect(badge.firstChild).toHaveClass('text-base')
    })
  })

  describe('User Interactions', () => {
    it('calls onRemove when remove button clicked', async () => {
      const mockOnRemove = jest.fn()
      const user = userEvent.setup()

      render(<ConditionBadge condition={testCondition} onRemove={mockOnRemove} />)

      const removeButton = screen.getByRole('button')
      await user.click(removeButton)

      expect(mockOnRemove).toHaveBeenCalledTimes(1)
      expect(mockOnRemove).toHaveBeenCalledWith(testCondition)
    })
  })

  describe('All Conditions', () => {
    const allConditions: Condition[] = [
      'Poisoned',
      'Prone',
      'Paralyzed',
      'Stunned',
      'Blinded',
      'Frightened',
      'Charmed',
    ]

    it('renders all condition types correctly', () => {
      allConditions.forEach((condition) => {
        const { unmount } = render(<ConditionBadge condition={condition} />)
        expect(screen.getByText(condition)).toBeInTheDocument()
        unmount()
      })
    })
  })
})
