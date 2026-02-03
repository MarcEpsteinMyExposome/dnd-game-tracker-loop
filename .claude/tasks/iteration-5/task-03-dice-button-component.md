# Task 03: DiceButton Component

## Overview
Create reusable dice button component for individual die types.

## Status: Not Started

## Dependencies: Task 01 (Core Dice Roller)

## Files to Create
- `components/dice/DiceButton.tsx`
- `__tests__/components/dice/DiceButton.test.tsx`

## Requirements
- [ ] Display die type (d4, d6, d8, d10, d12, d20)
- [ ] Click to roll and show result
- [ ] Visual feedback on roll (animation/highlight)
- [ ] Accessible button with ARIA label
- [ ] Western theme styling (matches Bang Your Dead v3)

## Interface
```typescript
interface DiceButtonProps {
  sides: number
  onRoll?: (result: number) => void
  disabled?: boolean
  size?: 'sm' | 'md' | 'lg'
}
```

## Visual Design
- Purple magic glow on hover/active
- Stone/amber background matching app theme
- Die icon or number display
- Result appears briefly after roll

## Tests Required
- [ ] Renders with correct die label
- [ ] Calls onRoll with result on click
- [ ] Shows result after rolling
- [ ] Disabled state prevents rolling
- [ ] Accessible (keyboard, screen reader)

## Acceptance Criteria
- Matches Bang Your Dead v3 visual theme
- Smooth roll animation
- Full test coverage
