# Task 02: Dice Calculator/Parser

## Overview
Create dice notation parser and calculator (e.g., "2d6+3").

## Status: Not Started

## Dependencies: None (can run in parallel with Task 01)

## Files to Create
- `lib/dice/calculator.ts`
- `__tests__/dice/calculator.test.ts`

## Requirements
- [ ] Parse standard dice notation: `XdY`, `XdY+Z`, `XdY-Z`
- [ ] Validate notation format
- [ ] Return parsed components for UI display
- [ ] Handle edge cases (1d20, d20, 2d6+0)

## Interface
```typescript
interface ParsedDice {
  count: number
  sides: number
  modifier: number
  notation: string
}

interface DiceResult extends ParsedDice {
  rolls: number[]
  subtotal: number
  total: number
}

function parseDiceNotation(notation: string): ParsedDice
function isValidDiceNotation(notation: string): boolean
function calculateResult(parsed: ParsedDice, rolls: number[]): DiceResult
```

## Tests Required
- [ ] Parse "2d6" -> { count: 2, sides: 6, modifier: 0 }
- [ ] Parse "1d20+5" -> { count: 1, sides: 20, modifier: 5 }
- [ ] Parse "3d8-2" -> { count: 3, sides: 8, modifier: -2 }
- [ ] Parse "d20" -> { count: 1, sides: 20, modifier: 0 }
- [ ] Invalid notation returns error or throws
- [ ] Modifier applies correctly to total

## Acceptance Criteria
- Regex-based parsing with clear error messages
- Full test coverage
- TypeScript types exported
