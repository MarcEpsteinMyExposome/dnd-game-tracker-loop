# Instructions for AI Assistants

**Project:** dnd-game-tracker-loop v2.0
**Created:** 2026-01-20
**Last Updated:** 2026-01-20

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
1. Mark task complete in PROGRESS.md
2. Commit the changes
3. State what was accomplished
4. Ask about next task (don't assume - interact frequently)

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

❌ **Don't:** Work on multiple tasks without updating PROGRESS.md
❌ **Don't:** Get stuck "thinking" for long periods without interaction
❌ **Don't:** Skip tests or treat them as optional
❌ **Don't:** Make assumptions about what to do next - ask the user
❌ **Don't:** Work on the old `dnd-game-tracker` directory
❌ **Don't:** Batch up many changes before committing

✅ **Do:** Update PROGRESS.md frequently
✅ **Do:** Interact and confirm direction often
✅ **Do:** Write tests as you build features
✅ **Do:** Ask when uncertain
✅ **Do:** Focus on the loop project only
✅ **Do:** Commit after each task or logical change

---

## Quick Start for New Sessions

```
User: "Hey, please read INSTRUCTIONS_TO_LLM.md and continue where we left off"

Assistant should:
1. Read INSTRUCTIONS_TO_LLM.md, PROGRESS.md, TASKS.md
2. Respond: "I understand! We're working on [project name] using loop methodology.
   Currently on Iteration X, focusing on [functions].
   Last completed: [task]
   Next up: [task]
   Should I continue with [next task]?"
3. Wait for user confirmation
4. Proceed with task
5. Update PROGRESS.md
6. Commit
7. Report completion and ask about next step
```

---

**Remember:** This is a learning journey about understanding iterative development methodology. The process matters as much as the product.
