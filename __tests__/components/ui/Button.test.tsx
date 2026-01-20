/**
 * Tests for Button component
 *
 * This test file demonstrates the testing patterns we'll use throughout
 * the project. It shows how to:
 * - Render components
 * - Query elements using accessible roles
 * - Simulate user interactions
 * - Assert expected outcomes
 */

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from '@/components/ui/Button'

describe('Button Component', () => {
  // ============================================
  // RENDERING TESTS
  // Test that the component renders correctly
  // ============================================

  /**
   * Test: Button renders with text content
   *
   * Pattern: Use getByRole to find button by its accessible role
   * This is the preferred query method (tests what users experience)
   */
  it('renders with text content', () => {
    render(<Button>Click me</Button>)

    // getByRole uses accessibility tree - best practice
    const button = screen.getByRole('button', { name: /click me/i })
    expect(button).toBeInTheDocument()
  })

  /**
   * Test: Button renders children elements
   *
   * Pattern: Test that complex children (not just text) render correctly
   */
  it('renders with child elements', () => {
    render(
      <Button>
        <span>Icon</span> Submit
      </Button>
    )

    // Button should contain both the span and text
    const button = screen.getByRole('button')
    expect(button).toHaveTextContent('Icon Submit')
  })

  // ============================================
  // USER INTERACTION TESTS
  // Test user actions like clicking
  // ============================================

  /**
   * Test: Button calls onClick handler when clicked
   *
   * Pattern:
   * 1. Create a mock function with jest.fn()
   * 2. Set up userEvent for realistic user simulation
   * 3. Render component with mock
   * 4. Simulate user action
   * 5. Assert the mock was called
   */
  it('calls onClick handler when clicked', async () => {
    // Arrange: Create mock and user event simulator
    const handleClick = jest.fn()
    const user = userEvent.setup()

    render(<Button onClick={handleClick}>Click me</Button>)

    // Act: Simulate user clicking the button
    const button = screen.getByRole('button')
    await user.click(button)

    // Assert: Verify onClick was called exactly once
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  /**
   * Test: Button can be clicked multiple times
   *
   * Pattern: Verify behavior with repeated interactions
   */
  it('calls onClick multiple times when clicked multiple times', async () => {
    const handleClick = jest.fn()
    const user = userEvent.setup()

    render(<Button onClick={handleClick}>Click me</Button>)

    const button = screen.getByRole('button')

    // Click three times
    await user.click(button)
    await user.click(button)
    await user.click(button)

    expect(handleClick).toHaveBeenCalledTimes(3)
  })

  // ============================================
  // DISABLED STATE TESTS
  // Test that disabled buttons behave correctly
  // ============================================

  /**
   * Test: Disabled button doesn't call onClick
   *
   * Pattern: Verify that disabled state prevents interaction
   * Important for accessibility and UX
   */
  it('does not call onClick when disabled', async () => {
    const handleClick = jest.fn()
    const user = userEvent.setup()

    render(
      <Button onClick={handleClick} disabled>
        Click me
      </Button>
    )

    const button = screen.getByRole('button')

    // Verify button is actually disabled
    expect(button).toBeDisabled()

    // Try to click (should not work)
    await user.click(button)

    // onClick should NOT have been called
    expect(handleClick).not.toHaveBeenCalled()
  })

  /**
   * Test: Disabled button has correct accessibility attribute
   *
   * Pattern: Test that disabled state is properly communicated to assistive tech
   */
  it('has disabled attribute when disabled prop is true', () => {
    render(<Button disabled>Click me</Button>)

    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('disabled')
  })

  // ============================================
  // VARIANT TESTS
  // Test different button styles
  // ============================================

  /**
   * Test: Primary variant applies correct styles
   *
   * Pattern: Test that variant prop affects CSS classes
   * Note: We test the class names, not the actual computed styles
   */
  it('applies primary variant styles by default', () => {
    render(<Button>Primary</Button>)

    const button = screen.getByRole('button')
    // Check for primary variant class
    expect(button).toHaveClass('bg-amber-500')
  })

  /**
   * Test: Danger variant applies correct styles
   */
  it('applies danger variant styles when variant="danger"', () => {
    render(<Button variant="danger">Delete</Button>)

    const button = screen.getByRole('button')
    expect(button).toHaveClass('bg-red-600')
  })

  /**
   * Test: Secondary variant applies correct styles
   */
  it('applies secondary variant styles when variant="secondary"', () => {
    render(<Button variant="secondary">Cancel</Button>)

    const button = screen.getByRole('button')
    expect(button).toHaveClass('bg-slate-600')
  })

  // ============================================
  // CUSTOM CLASSNAME TESTS
  // Test that custom classes can be added
  // ============================================

  /**
   * Test: Custom className is applied
   *
   * Pattern: Verify that component allows style customization
   */
  it('applies custom className', () => {
    render(<Button className="custom-class">Click me</Button>)

    const button = screen.getByRole('button')
    expect(button).toHaveClass('custom-class')
  })

  /**
   * Test: Custom className doesn't override base classes
   *
   * Pattern: Ensure custom classes are additive, not replacing
   */
  it('preserves base classes when custom className is provided', () => {
    render(<Button className="custom-class">Click me</Button>)

    const button = screen.getByRole('button')
    // Should have both custom and base classes
    expect(button).toHaveClass('custom-class')
    expect(button).toHaveClass('px-4') // Base padding class
  })
})

// ============================================
// KEY TESTING PATTERNS DEMONSTRATED:
// ============================================
//
// 1. ACCESSIBLE QUERIES
//    - Use getByRole('button') instead of getByTestId
//    - Tests what users (and screen readers) experience
//
// 2. USER EVENT SIMULATION
//    - Use @testing-library/user-event for realistic interactions
//    - Always await user actions (they're async)
//
// 3. ARRANGE-ACT-ASSERT
//    - Arrange: Set up test data and mocks
//    - Act: Perform the action being tested
//    - Assert: Verify the expected outcome
//
// 4. MOCK FUNCTIONS
//    - Use jest.fn() to create testable callbacks
//    - Verify calls with expect(fn).toHaveBeenCalledTimes(n)
//
// 5. DESCRIBE BLOCKS
//    - Group related tests for better organization
//    - Makes test output more readable
//
// 6. DESCRIPTIVE TEST NAMES
//    - Use clear, readable descriptions
//    - Should explain what is being tested
//
// 7. EDGE CASES
//    - Test both happy path and edge cases
//    - Include disabled state, multiple clicks, etc.
//
// ============================================
