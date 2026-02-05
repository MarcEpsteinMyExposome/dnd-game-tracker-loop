# Task 06: Update Combat Slice for Initiative

## Overview
Update Zustand combat slice to support rolled initiative instead of AC-based.

## Status: Not Started

## Dependencies: Task 01 (Core Dice Roller)

## Files to Modify
- `lib/store/slices/combatSlice.ts`
- `lib/schemas/combatant.schema.ts`
- `__tests__/store/combatSlice.test.ts`

## Requirements
- [ ] Add DEX modifier to Combatant schema
- [ ] Add `rollInitiative(combatantId)` action
- [ ] Add `rollAllInitiatives()` action
- [ ] Add `setManualInitiative(combatantId, value)` action
- [ ] Update sorting to use initiative (already exists, verify)
- [ ] Handle ties: higher DEX wins, then random

## Schema Updates
```typescript
// Add to Combatant schema
dexModifier: z.number().int().min(-5).max(10).default(0)

// Initiative already exists, ensure it's mutable
initiative: z.number().int()
```

## New Actions
```typescript
interface CombatSlice {
  // Existing...
  rollInitiative: (combatantId: string) => void
  rollAllInitiatives: () => void
  setManualInitiative: (combatantId: string, value: number) => void
}
```

## Tests Required
- [ ] rollInitiative updates single combatant
- [ ] rollAllInitiatives updates all combatants
- [ ] setManualInitiative validates range (-10 to 50)
- [ ] Sorting correctly orders by initiative
- [ ] Ties resolved by DEX modifier

## Acceptance Criteria
- Backward compatible (existing data still works)
- Initiative no longer defaults to AC
- Full test coverage
