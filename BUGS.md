# Bug Tracking

**Project:** dnd-game-tracker-loop v2.0
**Purpose:** Track bugs discovered during development and their resolutions
**Created:** 2026-01-21

---

## Active Bugs

*No active bugs*

---

## Resolved Bugs

### Bug #001: Invalid UUID Error When Adding Monsters to Combat

**Status:** ✅ RESOLVED
**Reported:** 2026-01-21
**Fixed:** 2026-01-21
**Severity:** High (blocking feature)
**Affected Version:** Iteration 4 (after Task 7.4)

#### Description

When clicking "Add to Combat" button on any monster card in the Monster Library page (`/monsters`), the application throws a `ZodError` validation error and the monster fails to be added to combat.

**Error Message:**
```
ZodError: [
  {
    "validation": "uuid",
    "code": "invalid_string",
    "message": "Invalid uuid",
    "path": ["entityId"]
  }
]
```

**Stack Trace:**
```
lib/store/slices/combatSlice.ts (97:74) @ addCombatant
app/monsters/page.tsx (66:7) @ handleAddToCombat
components/monsters/MonsterCard.tsx (203:26) @ onClick
```

#### Root Cause

1. In commit `57ba127`, monster IDs were changed from UUIDs to static string IDs (e.g., `monster-goblin-scout-001`) to fix a `crypto.randomUUID()` browser compatibility issue
2. The Monster schema was updated to accept non-UUID IDs: `id: z.string().min(1)`
3. However, the Combatant schema was **not updated** and still required `entityId: z.string().uuid()`
4. When `createCombatantFromMonster()` helper tries to use `monster.id` as the `entityId`, validation fails because `monster-goblin-scout-001` is not a valid UUID format

**Inconsistency:**
- Monster schema accepts: `z.string().min(1)` ✅
- Combatant schema requires: `z.string().uuid()` ❌
- Character schema uses: `z.string().uuid()` ✅

#### Proposed Fix

Update the Combatant schema's `entityId` field to accept both UUID format (for characters) and string format (for monsters):

**Before:**
```typescript
entityId: z.string().uuid(),
```

**After:**
```typescript
entityId: z.string().min(1),
```

This allows `entityId` to reference both:
- Character IDs (UUID format): `123e4567-e89b-12d3-a456-426614174000`
- Monster IDs (string format): `monster-goblin-scout-001`

#### Files to Update

1. `lib/schemas/combatant.schema.ts` - Line 60 (entityId validation)
2. `lib/schemas/combatant.schema.ts` - Line 211 (CreateCombatantFromCharacterSchema)
3. Update tests if needed to verify both ID formats work

#### Resolution

**Fixed in commit:** [Pending - changes ready for commit]

**Changes Applied:**
- ✅ Updated `CombatantSchema.entityId` from `.uuid()` to `.min(1)` (line 60)
- ✅ Updated `CreateCombatantFromCharacterSchema.entityId` from `.uuid()` to `.min(1)` (line 211)
- ✅ Updated JSDoc comments to reflect that entityId accepts both UUID and string formats
- ✅ Verified all 760 tests still pass (0 failures)
- ⏳ Ready for manual testing: adding monsters to combat

**Verification:**
- ✅ All existing tests pass (760/760)
- ✅ No TypeScript compilation errors
- ✅ Schema now accepts both character IDs (UUID) and monster IDs (string)
- ⏳ Awaiting user verification: Monster "Add to Combat" button works in browser

#### Related Issues

- Original monster ID fix: commit `57ba127` (Fixed crypto.randomUUID browser issue)
- This is a follow-up issue caused by incomplete schema updates

#### Lessons Learned

When changing ID formats for one entity type:
1. Check all schemas that reference that entity
2. Update dependent schemas (Combatant references Monster and Character)
3. Ensure validation rules are consistent across related schemas
4. Add tests that verify cross-entity relationships work

---

## Bug Report Guidelines

### When to Create a Bug Report

- Runtime errors that crash the app
- Validation errors that block features
- Data corruption or loss issues
- UI elements that don't work as expected
- Performance problems that impact usability

### Bug Report Template

```markdown
### Bug #XXX: [Short Title]

**Status:** 🐛 ACTIVE / ✅ RESOLVED
**Reported:** YYYY-MM-DD
**Fixed:** YYYY-MM-DD (if resolved)
**Severity:** Critical / High / Medium / Low
**Affected Version:** Iteration X

#### Description
[Clear description of the bug and how to reproduce it]

#### Root Cause
[Technical explanation of why the bug occurs]

#### Proposed Fix
[Specific code changes needed to fix the issue]

#### Files to Update
1. [File path] - [What needs to change]

#### Resolution
[Details of how it was fixed, commit hash, verification steps]
```

---

## Notes

- This file should be read at the start of each session (added to INSTRUCTIONS_TO_LLM.md)
- Active bugs should be addressed before starting new tasks
- All bugs should be documented even if quickly fixed
- Bug reports help prevent similar issues in the future
