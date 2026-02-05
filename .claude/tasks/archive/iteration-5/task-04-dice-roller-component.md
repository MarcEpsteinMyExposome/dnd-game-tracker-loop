# Task 04: DiceRoller Component

## Overview
Create main dice roller UI with all dice types and custom notation input.

## Status: Not Started

## Dependencies: Task 01, Task 02, Task 03

## Files to Create
- `components/dice/DiceRoller.tsx`
- `__tests__/components/dice/DiceRoller.test.tsx`

## Requirements
- [ ] Display all standard dice: d4, d6, d8, d10, d12, d20
- [ ] Custom notation input field (e.g., "2d6+3")
- [ ] Roll button for custom notation
- [ ] Display current result prominently
- [ ] Modifier input (+/- buttons or number field)
- [ ] Clear/reset functionality

## Interface
```typescript
interface DiceRollerProps {
  onRoll?: (result: DiceResult) => void
  showHistory?: boolean
  compact?: boolean
}
```

## Layout
```
┌─────────────────────────────────────┐
│  🎲 Dice Roller                     │
├─────────────────────────────────────┤
│  [d4] [d6] [d8] [d10] [d12] [d20]  │
├─────────────────────────────────────┤
│  Custom: [2d6+3______] [Roll]       │
├─────────────────────────────────────┤
│  Result: 15                         │
│  (rolled 6, 6 + 3)                  │
└─────────────────────────────────────┘
```

## Tests Required
- [ ] Renders all dice buttons
- [ ] Quick dice buttons roll correctly
- [ ] Custom notation input works
- [ ] Invalid notation shows error
- [ ] Result displays correctly
- [ ] onRoll callback fires with result

## Acceptance Criteria
- Intuitive UI matching app theme
- Works on mobile (responsive)
- Full test coverage
