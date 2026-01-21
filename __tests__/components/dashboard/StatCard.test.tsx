/**
 * Tests for StatCard Component
 *
 * Tests rendering of stat cards with different props, color variants,
 * trend indicators, and accessibility features.
 */

import { render, screen } from '@testing-library/react'
import { StatCard } from '@/components/dashboard/StatCard'

describe('StatCard', () => {
  describe('Basic Rendering', () => {
    it('renders title and value', () => {
      render(<StatCard title="Team Size" value={5} />)

      expect(screen.getByText('Team Size')).toBeInTheDocument()
      expect(screen.getByText('5')).toBeInTheDocument()
    })

    it('renders string values', () => {
      render(<StatCard title="Average HP" value="85%" />)

      expect(screen.getByText('Average HP')).toBeInTheDocument()
      expect(screen.getByText('85%')).toBeInTheDocument()
    })

    it('renders numeric values', () => {
      render(<StatCard title="Healthy Count" value={3} />)

      expect(screen.getByText('Healthy Count')).toBeInTheDocument()
      expect(screen.getByText('3')).toBeInTheDocument()
    })

    it('renders zero value correctly', () => {
      render(<StatCard title="Unconscious" value={0} />)

      expect(screen.getByText('Unconscious')).toBeInTheDocument()
      expect(screen.getByText('0')).toBeInTheDocument()
    })
  })

  describe('Optional Props', () => {
    it('renders icon when provided', () => {
      render(<StatCard title="Team Size" value={5} icon="👥" />)

      const icon = screen.getByRole('img', { name: 'Team Size' })
      expect(icon).toBeInTheDocument()
      expect(icon).toHaveTextContent('👥')
    })

    it('renders without icon when not provided', () => {
      render(<StatCard title="Team Size" value={5} />)

      const icon = screen.queryByRole('img')
      expect(icon).not.toBeInTheDocument()
    })

    it('renders description when provided', () => {
      render(
        <StatCard
          title="Team Size"
          value={5}
          description="characters in the party"
        />
      )

      expect(screen.getByText('characters in the party')).toBeInTheDocument()
    })

    it('renders without description when not provided', () => {
      const { container } = render(<StatCard title="Team Size" value={5} />)

      const description = container.querySelector('.opacity-80')
      expect(description).not.toBeInTheDocument()
    })
  })

  describe('Color Variants', () => {
    it('applies blue color variant by default', () => {
      const { container } = render(<StatCard title="Test" value={1} />)

      const card = container.firstChild as HTMLElement
      expect(card).toHaveClass('from-blue-500')
      expect(card).toHaveClass('to-blue-700')
      expect(card).toHaveClass('border-blue-400')
    })

    it('applies green color variant', () => {
      const { container } = render(
        <StatCard title="Test" value={1} color="green" />
      )

      const card = container.firstChild as HTMLElement
      expect(card).toHaveClass('from-green-500')
      expect(card).toHaveClass('to-green-700')
      expect(card).toHaveClass('border-green-400')
    })

    it('applies red color variant', () => {
      const { container } = render(
        <StatCard title="Test" value={1} color="red" />
      )

      const card = container.firstChild as HTMLElement
      expect(card).toHaveClass('from-red-500')
      expect(card).toHaveClass('to-red-700')
      expect(card).toHaveClass('border-red-400')
    })

    it('applies yellow color variant', () => {
      const { container } = render(
        <StatCard title="Test" value={1} color="yellow" />
      )

      const card = container.firstChild as HTMLElement
      expect(card).toHaveClass('from-yellow-500')
      expect(card).toHaveClass('to-yellow-700')
      expect(card).toHaveClass('border-yellow-400')
    })

    it('applies purple color variant', () => {
      const { container } = render(
        <StatCard title="Test" value={1} color="purple" />
      )

      const card = container.firstChild as HTMLElement
      expect(card).toHaveClass('from-purple-500')
      expect(card).toHaveClass('to-purple-700')
      expect(card).toHaveClass('border-purple-400')
    })
  })

  describe('Trend Indicators', () => {
    it('renders up trend indicator', () => {
      render(<StatCard title="Test" value={5} trend="up" />)

      const trendIndicator = screen.getByLabelText('trending up')
      expect(trendIndicator).toBeInTheDocument()
      expect(trendIndicator).toHaveTextContent('↑')
    })

    it('renders down trend indicator', () => {
      render(<StatCard title="Test" value={5} trend="down" />)

      const trendIndicator = screen.getByLabelText('trending down')
      expect(trendIndicator).toBeInTheDocument()
      expect(trendIndicator).toHaveTextContent('↓')
    })

    it('renders without trend indicator when not provided', () => {
      render(<StatCard title="Test" value={5} />)

      expect(screen.queryByLabelText(/trending/)).not.toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('has article role', () => {
      render(<StatCard title="Team Size" value={5} />)

      const card = screen.getByRole('article')
      expect(card).toBeInTheDocument()
    })

    it('has aria-label with title and value', () => {
      render(<StatCard title="Team Size" value={5} />)

      const card = screen.getByRole('article')
      expect(card).toHaveAttribute('aria-label', 'Team Size: 5')
    })

    it('has aria-label with string value', () => {
      render(<StatCard title="Average HP" value="85%" />)

      const card = screen.getByRole('article')
      expect(card).toHaveAttribute('aria-label', 'Average HP: 85%')
    })

    it('icon has accessible label matching title', () => {
      render(<StatCard title="Team Size" value={5} icon="👥" />)

      const icon = screen.getByRole('img', { name: 'Team Size' })
      expect(icon).toBeInTheDocument()
    })
  })

  describe('Styling', () => {
    it('applies base styling classes', () => {
      const { container } = render(<StatCard title="Test" value={1} />)

      const card = container.firstChild as HTMLElement
      expect(card).toHaveClass('rounded-lg')
      expect(card).toHaveClass('border-2')
      expect(card).toHaveClass('p-6')
      expect(card).toHaveClass('text-white')
      expect(card).toHaveClass('shadow-lg')
      expect(card).toHaveClass('transition-transform')
      expect(card).toHaveClass('hover:scale-105')
    })
  })

  describe('Complete Card Examples', () => {
    it('renders complete card with all props', () => {
      render(
        <StatCard
          title="Team Size"
          value={5}
          icon="👥"
          color="blue"
          description="characters in the party"
          trend="up"
        />
      )

      expect(screen.getByText('Team Size')).toBeInTheDocument()
      expect(screen.getByText('5')).toBeInTheDocument()
      expect(screen.getByRole('img', { name: 'Team Size' })).toHaveTextContent(
        '👥'
      )
      expect(screen.getByText('characters in the party')).toBeInTheDocument()
      expect(screen.getByLabelText('trending up')).toHaveTextContent('↑')
    })

    it('renders minimal card with only required props', () => {
      render(<StatCard title="Simple Card" value={42} />)

      expect(screen.getByText('Simple Card')).toBeInTheDocument()
      expect(screen.getByText('42')).toBeInTheDocument()
      expect(screen.queryByRole('img')).not.toBeInTheDocument()
      expect(screen.queryByLabelText(/trending/)).not.toBeInTheDocument()
    })
  })
})
