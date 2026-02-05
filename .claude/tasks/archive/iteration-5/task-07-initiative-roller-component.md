# Task 07: InitiativeRoller Component

## Overview
Create UI for rolling initiative in combat tracker.

## Status: Not Started

## Dependencies: Task 03, Task 06

## Files to Create
- `components/combat/InitiativeRoller.tsx`
- `__tests__/components/combat/InitiativeRoller.test.tsx`

## Files to Modify
- `components/combat/CombatTracker.tsx` - Add roll initiative button
- `components/combat/CombatantCard.tsx` - Add re-roll/edit initiative

## Requirements
- [ ] "Roll All Initiative" button in combat header
- [ ] Individual re-roll button on each combatant card
- [ ] Manual initiative input (click to edit)
- [ ] Shows roll breakdown (d20 + DEX = total)
- [ ] Animation when initiatives are rolled

## Interface
```typescript
interface InitiativeRollerProps {
  onRollAll?: () => void
  isRolling?: boolean
}

interface InitiativeDisplayProps {
  combatantId: string
  initiative: number
  dexModifier: number
  onReroll?: () => void
  onManualSet?: (value: number) => void
}
```

## UI Locations
1. **Combat Header**: "🎲 Roll Initiative" button (rolls for all)
2. **Combatant Card**: Small initiative display with re-roll icon
3. **Edit Mode**: Click initiative to manually enter value

## Tests Required
- [ ] Roll All button triggers rollAllInitiatives
- [ ] Individual re-roll works
- [ ] Manual input validates and saves
- [ ] Shows DEX modifier breakdown
- [ ] Disabled during active combat round (optional)

## Acceptance Criteria
- Seamless integration with existing combat UI
- Clear visual feedback on rolls
- Full test coverage
