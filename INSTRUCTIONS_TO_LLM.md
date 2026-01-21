# Instructions for AI Assistants

**Project:** dnd-game-tracker-loop v2.0
**Created:** 2026-01-20
**Last Updated:** 2026-01-20

---

## ⚠️ IMPORTANT: Working Directory

**ALWAYS work in:** `/c/Users/marce/Documents/Projects/dnd-game-tracker-loop`

**If you start in the wrong directory:**
1. Run: `cd /c/Users/marce/Documents/Projects/dnd-game-tracker-loop`
2. Verify with: `pwd`
3. You should see: `/c/Users/marce/Documents/Projects/dnd-game-tracker-loop`

**Note:** There is an OLD project called `dnd-game-tracker` (without `-loop`) - ignore it! Only work on the `-loop` version.

---

## What This Project Is About

This is a **learning project** to understand and practice the **"Ralph Loop" methodology** for iterative software development. The user is **manually walking through the loop process** to experience how it works, rather than using automated tools.

### Dual Purpose
1. **Practical Goal:** Build an improved D&D/Warhammer 40K game tracker web application
2. **Learning Goal:** Understand loop-based development methodology hands-on

---

## The Loop Methodology

The loop consists of these phases:

1. **DEFINE** - Establish project goals and requirements (see DEFINE.md)
2. **BREAK DOWN** - Split into logical functions/features (see FUNCTIONS.md)
3. **CREATE TASKS** - Break functions into atomic tasks (see TASKS.md)
4. **EXECUTE** - Work through tasks one by one
5. **TRACK PROGRESS** - Document what's done, what's blocked, what's next (see PROGRESS.md)
6. **LOOP BACK** - Review, retrospect, and start next iteration

---

## How to Help as an AI Assistant

### When Starting a New Session

1. **Read these files in order:**
   - `INSTRUCTIONS_TO_LLM.md` (this file) - Understand the context
   - `DEFINE.md` - Understand project goals
   - `FUNCTIONS.md` - Understand feature breakdown
   - `TASKS.md` - See the current iteration's task list
   - `PROGRESS.md` - **MOST IMPORTANT** - See current state and next steps

2. **Confirm understanding:**
   - State which iteration we're on
   - State which tasks are completed vs. remaining
   - Ask if the user wants to continue where they left off

3. **Continue working:**
   - Follow the loop process
   - Work on one task at a time
   - Update PROGRESS.md as you go
   - Commit frequently

### Important Guidelines

- **Go slowly and deliberately** - This is about learning the process, not speed
- **Interact frequently** - Check in with the user, don't get stuck in long loops
- **Manual process** - The user is experiencing the loop methodology hands-on, not automating it
- **Update PROGRESS.md** - After every task completion or significant change
- **Commit often** - After each task or logical group of changes
- **Testing is critical** - Tests are part of the learning process, not optional
- **Focus on loop project only** - Ignore the old `dnd-game-tracker` directory
- **DOCUMENTATION IS MANDATORY** - See "Documentation Requirements" section below

### Tech Stack
- Next.js 16.1+ (App Router)
- React 19.2+
- TypeScript 5+
- Tailwind CSS 4
- Zustand (state management)
- Zod (validation)
- Jest + React Testing Library (testing)
- Vercel (deployment)

---

## File Structure and Purpose

### Planning & Documentation Files
- `DEFINE.md` - Project goals, requirements, success criteria (stable, rarely changes)
- `FUNCTIONS.md` - Feature breakdown into 12 major functions (stable)
- `TASKS.md` - Current iteration's atomic task list (changes per iteration)
- `PROGRESS.md` - **LIVING DOCUMENT** - Current state, what's done, what's next, blockers
- `COMPLETED.md` - Historical record of finished iterations
- `RETROSPECTIVE.md` - Lessons learned after each iteration
- `INSTRUCTIONS_TO_LLM.md` - This file - context for AI assistants
- `ARCHITECTURE.md` - **LIVING DOCUMENT** - System architecture, folder structure, data flow
- `DECISIONS.md` - **LIVING DOCUMENT** - Architectural decision records (WHY choices were made)
- `PATTERNS.md` - **LIVING DOCUMENT** - Code patterns, conventions, examples to follow

### Code Structure
```
app/                    # Next.js app directory
lib/
  ├── schemas/         # Zod validation schemas
  ├── store/           # Zustand state management
  ├── validation/      # Validation helpers
  ├── testing/         # Mock data factories
  ├── dice/            # Dice rolling logic
  └── utils/           # Utility functions
components/            # React components
  ├── characters/
  ├── combat/
  ├── monsters/
  ├── dashboard/
  ├── conditions/
  └── ui/
__tests__/            # Jest tests (mirror structure of lib/ and components/)
```

---

## Documentation Requirements

**CRITICAL:** Documentation is not optional. The user must be able to understand all code and decisions.

### Code Documentation Standards

**Every file must have:**
1. **File header comment** explaining purpose
2. **JSDoc comments** for all exported functions/components
3. **Inline comments** explaining WHY (not WHAT) for complex logic
4. **Type annotations** for all parameters and returns

**Example:**
```typescript
/**
 * Character validation schema
 * Defines structure and validation rules for Character entities
 */
import { z } from 'zod'

/**
 * Validates character data against schema
 *
 * @param data - Raw character data to validate
 * @returns Validated character or validation error
 *
 * @example
 * const result = validateCharacter({ name: 'Raul', hp: 30 })
 */
export function validateCharacter(data: unknown) {
  // Use safeParse instead of parse to avoid throwing exceptions
  // This allows graceful error handling in the UI
  return CharacterSchema.safeParse(data)
}
```

### Documentation Files to Update

**After EVERY task:**
- ✅ Update `PROGRESS.md` with completion status

**When architectural changes occur:**
- ✅ Update `ARCHITECTURE.md` if folder structure or data flow changes
- ✅ Add entry to `DECISIONS.md` when making significant technical choices
- ✅ Update `PATTERNS.md` when establishing new code patterns

**When iterations complete:**
- ✅ Update `COMPLETED.md` with iteration summary
- ✅ Add retrospective entry to `RETROSPECTIVE.md`

### What to Document

**In ARCHITECTURE.md:**
- New folders created
- New major components added
- Data flow changes
- Integration points

**In DECISIONS.md:**
- Why technology X over Y?
- Why pattern A over B?
- Trade-offs and consequences
- Context for future maintainers

**In PATTERNS.md:**
- How to write a component (with example)
- How to write a test (with example)
- How to create a schema (with example)
- Common patterns to follow
- Anti-patterns to avoid

### Documentation Checklist for Tasks

Before marking a task complete:
- [ ] All code has JSDoc comments
- [ ] Complex logic has explanatory inline comments
- [ ] PROGRESS.md updated
- [ ] ARCHITECTURE.md updated (if structural changes)
- [ ] DECISIONS.md updated (if architectural choice made)
- [ ] PATTERNS.md updated (if new pattern established)
- [ ] README updated (if user-facing changes)

---

## Current Iteration Status

**Iteration:** 1 (Foundation & Data Models)
**Focus:**
- Function 1: Project Foundation & Testing Infrastructure
- Function 2: Data Models & Validation

**Check PROGRESS.md for detailed current state.**

---

## Common Scenarios

### Scenario 1: User says "continue where we left off"
1. Read PROGRESS.md
2. State current status ("We're on Task X, completed Y tasks so far")
3. Ask: "Should I continue with [next task]?"
4. Proceed with next task

### Scenario 2: User wants to restart/review
1. Summarize current iteration progress
2. Show what's completed vs. remaining
3. Ask what they want to focus on

### Scenario 3: Hit a blocker
1. Update PROGRESS.md with the blocker
2. Explain the issue to user
3. Ask for guidance or decision
4. Don't spin indefinitely - interact!

### Scenario 4: Task completed
1. **IMMEDIATELY** mark task complete in PROGRESS.md (don't wait, don't batch)
2. Update test count in PROGRESS.md if tests were added
3. Update "Next Action" section in PROGRESS.md to reflect new status
4. Commit the changes (code + PROGRESS.md update together)
5. State what was accomplished
6. Ask about next task (don't assume - interact frequently)

**CRITICAL:** Never complete a task without updating PROGRESS.md in the same session. This is the #1 cause of tracking drift.

---

## Key Principles

1. **Transparency** - Always update PROGRESS.md so the state is clear
2. **Interaction** - Check in frequently, don't go silent for long periods
3. **Learning Focus** - This is about understanding the process, not just building the app
4. **Testing Mindset** - Every function needs tests, this is part of learning
5. **Manual Loop** - The user is walking through this deliberately, not automating
6. **Small Steps** - One task at a time, commit often, track progress

---

## Anti-Patterns to Avoid

### Session Management Anti-Patterns

❌ **Don't:** Trust PROGRESS.md blindly when resuming a session
❌ **Don't:** Start working without checking git log and actual files
❌ **Don't:** Assume PROGRESS.md is up-to-date
❌ **Don't:** Skip verification steps to "save time" - it wastes more time later

✅ **Do:** Always verify state with git log before continuing
✅ **Do:** Check actual files exist before assuming tasks are incomplete
✅ **Do:** Update PROGRESS.md when discrepancies found
✅ **Do:** Run tests to verify current state

### General Anti-Patterns

❌ **Don't:** Work on multiple tasks without updating PROGRESS.md after each
❌ **Don't:** Get stuck "thinking" for long periods without interaction
❌ **Don't:** Skip tests or treat them as optional
❌ **Don't:** Make assumptions about what to do next - ask the user
❌ **Don't:** Work on the old `dnd-game-tracker` directory
❌ **Don't:** Batch up many changes before committing

✅ **Do:** Update PROGRESS.md immediately after completing each task
✅ **Do:** Interact and confirm direction often
✅ **Do:** Write tests as you build features
✅ **Do:** Ask when uncertain
✅ **Do:** Focus on the loop project only
✅ **Do:** Commit after each task or logical change

---

## Quick Start for New Sessions

### CRITICAL: Always Verify Actual State Before Continuing

**PROBLEM:** PROGRESS.md may be outdated. Git commits and actual files are the source of truth.

**SOLUTION:** When resuming a session, ALWAYS follow this protocol:

```
User: "Hey, please read INSTRUCTIONS_TO_LLM.md and continue where we left off"

Assistant MUST:
1. Read INSTRUCTIONS_TO_LLM.md, PROGRESS.md, TASKS-ITERATION-X.md
2. Check git log for recent commits (git log --oneline -20)
3. Check what files actually exist (Glob for relevant directories)
4. Run tests to see current test count (npm test)
5. COMPARE git commits vs PROGRESS.md to find discrepancies
6. If PROGRESS.md is outdated, UPDATE IT FIRST before doing anything else
7. Respond with corrected status:
   "I found PROGRESS.md was outdated. Updated it.
   Actually completed: [tasks from git log]
   Currently on Iteration X, focusing on [functions].
   Last completed: [task]
   Next up: [task]
   Should I continue with [next task]?"
8. Wait for user confirmation
9. Proceed with task
10. Update PROGRESS.md IMMEDIATELY after completing task
11. Commit with descriptive message
12. Report completion and ask about next step
```

### Session Resumption Checklist

**Before starting ANY work:**
- [ ] Read INSTRUCTIONS_TO_LLM.md
- [ ] Read PROGRESS.md (but don't trust it yet)
- [ ] Read TASKS-ITERATION-X.md
- [ ] Run `git log --oneline -20` to see recent commits
- [ ] Check for existence of files mentioned in tasks (use Glob)
- [ ] Run `npm test` to see current test count
- [ ] **VERIFY:** Does PROGRESS.md match git commits?
- [ ] **IF NO:** Update PROGRESS.md FIRST
- [ ] **ONLY THEN:** Ask user what to do next

### Why This Matters

**Without verification:**
- You might redo completed work
- PROGRESS.md becomes increasingly inaccurate
- User loses trust in the tracking system
- The learning value of the loop methodology is lost

**With verification:**
- Accurate tracking of progress
- No duplicate work
- User can always trust PROGRESS.md as source of truth
- Demonstrates proper software project management

### Example of Proper Resumption

**WRONG:**
```
User: Continue where we left off
Assistant: According to PROGRESS.md, we're on Task 8.1. Let me start creating localStorage.ts...
[Creates file that already exists, wasting time]
```

**RIGHT:**
```
User: Continue where we left off
Assistant: Let me check the actual state...
[Reads PROGRESS.md, git log, globs for files, runs tests]
Assistant: I found PROGRESS.md was outdated. According to git commits, Tasks 8.1-8.4 are complete.
Let me update PROGRESS.md first...
[Updates PROGRESS.md]
Assistant: ✅ Updated. Actually on Task 8.5 (Settings Page). Test count: 548 (was 435).
Should I continue with Task 8.5?
```

---

**Remember:** This is a learning journey about understanding iterative development methodology. The process matters as much as the product. **Accurate progress tracking is essential to the learning experience.**
