# Task 01: Core Dice Roller

## Overview
Create the core dice rolling logic with proper randomness.

## Status: Not Started

## Dependencies: None (can run in parallel with Task 02)

## Files to Create
- `lib/dice/roller.ts`
- `__tests__/dice/roller.test.ts`

## Requirements
- [ ] `rollDie(sides: number)` - Roll a single die with given sides
- [ ] `rollDice(count: number, sides: number)` - Roll multiple dice
- [ ] Use `crypto.getRandomValues()` for better randomness
- [ ] Return individual rolls and total sum
- [ ] Support d4, d6, d8, d10, d12, d20, d100

## Interface
```typescript
interface DiceRoll {
  sides: number
  rolls: number[]
  total: number
}

function rollDie(sides: number): number
function rollDice(count: number, sides: number): DiceRoll
```

## Tests Required
- [ ] Each die type returns values in valid range
- [ ] Multiple dice sum correctly
- [ ] Invalid inputs throw appropriate errors
- [ ] Distribution test (optional - verify randomness over many rolls)

## Acceptance Criteria
- Pure functions with no side effects (except randomness)
- Full test coverage
- TypeScript types exported
