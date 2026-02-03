# Iteration 5: Enhanced Combat - Initiative System & Dice Rolling

## Task Overview

| Task | Name | Dependencies | Status |
|------|------|--------------|--------|
| 01 | Core Dice Roller | None | Not Started |
| 02 | Dice Calculator/Parser | None | Not Started |
| 03 | DiceButton Component | 01 | Not Started |
| 04 | DiceRoller Component | 01, 02, 03 | Not Started |
| 05 | RollHistory Component | 04 | Not Started |
| 06 | Combat Slice Initiative | 01 | Not Started |
| 07 | InitiativeRoller Component | 03, 06 | Not Started |
| 08 | Polish and Integration | All | Not Started |

## Parallelization

### Phase 1 (Parallel)
- **Task 01** and **Task 02** can run simultaneously (no dependencies)

### Phase 2 (Parallel)
- **Task 03** (needs 01)
- **Task 06** (needs 01)
Can run in parallel after Task 01 completes

### Phase 3 (Sequential)
- **Task 04** (needs 01, 02, 03)
- **Task 07** (needs 03, 06)

### Phase 4 (Sequential)
- **Task 05** (needs 04)
- **Task 08** (needs all)

## Dependency Graph

```
Task 01 ─────┬──────> Task 03 ───┬──> Task 04 ──> Task 05
             │                   │       │
             └──────> Task 06 ───┴──> Task 07
                                        │
Task 02 ─────────────────────────> Task 04
                                        │
                                        v
                                   Task 08
```

## Getting Started

1. Start with Tasks 01 and 02 in parallel
2. Once 01 completes, start Tasks 03 and 06 in parallel
3. Continue following dependency graph
4. Finish with Task 08 (polish)

## Estimated Scope
- ~8 new files
- ~500-800 lines of new code
- ~40-60 new tests
- Target: 850+ total tests passing
