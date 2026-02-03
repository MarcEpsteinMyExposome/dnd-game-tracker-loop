# Task 05: RollHistory Component

## Overview
Create component to display recent dice roll history.

## Status: Not Started

## Dependencies: Task 04 (DiceRoller Component)

## Files to Create
- `components/dice/RollHistory.tsx`
- `__tests__/components/dice/RollHistory.test.tsx`

## Requirements
- [ ] Display last 5-10 rolls
- [ ] Show notation, individual rolls, and total
- [ ] Timestamp for each roll
- [ ] Clear history button
- [ ] Scrollable if many rolls
- [ ] Persists during session (optional: localStorage)

## Interface
```typescript
interface RollHistoryEntry {
  id: string
  notation: string
  rolls: number[]
  total: number
  timestamp: Date
}

interface RollHistoryProps {
  history: RollHistoryEntry[]
  onClear?: () => void
  maxEntries?: number
}
```

## Layout
```
┌─────────────────────────────────┐
│  📜 Roll History    [Clear]     │
├─────────────────────────────────┤
│  2d6+3 → [4,5]+3 = 12   12:34  │
│  1d20  → [18] = 18      12:33  │
│  3d8   → [3,7,2] = 12   12:32  │
└─────────────────────────────────┘
```

## Tests Required
- [ ] Displays roll history entries
- [ ] Shows notation, rolls, and total
- [ ] Clear button removes all entries
- [ ] Respects maxEntries limit
- [ ] Empty state message when no history

## Acceptance Criteria
- Clean, readable history display
- Matches app theme
- Full test coverage
