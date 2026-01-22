# System To Create App

**Purpose:** Bootstrap file for creating new software projects using the Ralph Loop methodology.

**How to use:** Point a fresh Claude instance at this file. It will set up the project structure and guide you through planning.

---

## Instructions for Claude

You are helping a user bootstrap a new software project using a structured, iterative development methodology called the "Ralph Loop." This methodology emphasizes:

- Breaking work into small, atomic tasks
- Tracking progress meticulously
- Frequent commits and documentation
- Iterative development with retrospectives
- Clear communication between human and AI

Your job is to guide the user through two phases:

1. **Phase 1: Discovery** - Interview the user to understand the project
2. **Phase 2: Scaffolding** - Create all the methodology files with the gathered information

---

## Phase 1: Discovery

Guide the user through these questions to understand the project. Be conversational and thorough. Take notes as you go - you'll use the answers to populate the files in Phase 2.

**Important:** Users have three options for any question:
- **Answer it** - Provide their preference
- **"Skip"** or **"Not sure yet"** - Leave it as TBD, decide later
- **"You decide"** or **"You pick"** - Claude makes a recommendation based on the project context and best practices

### Discovery Questions

**Project Basics:**
1. What is the name of this project?
2. In one sentence, what does this app do?
3. Who is the target user?
4. What problem does it solve?

**Goals & Success Criteria:**
5. What are the 3-5 main goals for this project?
6. What does "done" look like? How will you know the project is successful?
7. Are there any hard constraints (deadline, budget, must-use technologies)?

**Technical Decisions:**
8. What tech stack do you want to use? (If unsure, I can help you decide based on the project needs)
9. Will this be a web app, mobile app, CLI tool, API, or something else?
10. Do you have preferences for: frontend framework, backend language, database?
11. Do you need authentication? What kind?
12. Do you need to integrate with any external services or APIs?

**Deployment & Hosting:**
13. Do you want to deploy/host this app? If so, where? (Vercel, Netlify, AWS, self-hosted, etc.)
14. Do you need a custom domain?
15. Should deployment be set up early (recommended) or later?

**Features & Scope:**
16. List all the features you can think of, even if we won't build them all immediately.
17. Which features are absolutely essential for a first version (MVP)?
18. Which features are nice-to-have for later?
19. Are there any features you explicitly do NOT want?

**Existing Resources:**
20. Is this a brand new project or building on existing code?
21. Do you have any designs, mockups, or wireframes?
22. Are there similar apps I should look at for reference?

### After Discovery

Once you have enough information, proceed to Phase 2: Scaffolding.

---

## Phase 2: Scaffolding

Now create all the project files using the templates at the bottom of this file, populated with the information gathered during discovery.

### Step 1: Initialize Git Repository

```bash
git init
```

### Step 2: Create Project Files

Create these files in the project directory:

1. `README.md` - Project overview for humans (GitHub, new developers)
2. `INSTRUCTIONS_TO_LLM.md` - Entry point for future Claude sessions
3. `DEFINE.md` - Project goals and requirements
4. `FUNCTIONS.md` - Feature breakdown
5. `PROGRESS.md` - Current state tracking (living document)
6. `BUGS.md` - Bug tracking (living document)
7. `COMPLETED.md` - Historical record of finished iterations
8. `RETROSPECTIVE.md` - Lessons learned after each iteration
9. `ARCHITECTURE.md` - System architecture documentation
10. `DECISIONS.md` - Architectural decision records
11. `PATTERNS.md` - Code patterns and conventions
12. `TASKS-ITERATION-1.md` - First iteration task list

### Step 3: Initial Commit

```bash
git add -A
git commit -m "Initial project setup with Ralph Loop methodology"
```

### Step 4: Confirm Setup Complete

Tell the user:

""Setup complete! Your project is ready with all methodology files.

**Important - How to Work With Claude:**

1. **Start each session** by saying: 'Please read INSTRUCTIONS_TO_LLM.md'

2. **Restart Claude frequently** - Claude has a limited context window. When you notice:
   - Responses getting slower
   - Claude forgetting earlier context
   - Errors or confusion increasing

   ...it's time to start a fresh session. This is normal and expected! Just start a new chat and point Claude at INSTRUCTIONS_TO_LLM.md again. All your progress is saved in the files.

3. **Good restart points:**
   - After completing a task (before starting the next)
   - After completing an iteration
   - When switching focus areas
   - Whenever things feel "off"

**Next step:** Should we begin working on Iteration 1?""

---

## The Ralph Loop Methodology

### Core Principles

1. **Break everything down** - No task should take more than 30-60 minutes. If it does, break it down further.
2. **Track meticulously** - Update PROGRESS.md after every task completion.
3. **Commit often** - After each task or logical group of changes.
4. **Test as you go** - Tests are part of the task, not an afterthought.
5. **Document decisions** - When you make a choice, record WHY in DECISIONS.md.
6. **Iterate and improve** - After each iteration, do a retrospective.

### The Loop

```
DEFINE → BREAK DOWN → CREATE TASKS → EXECUTE → TRACK PROGRESS → LOOP BACK
   ↑                                                                    |
   └────────────────────────────────────────────────────────────────────┘
```

1. **DEFINE** - Establish project goals and requirements (DEFINE.md)
2. **BREAK DOWN** - Split into logical functions/features (FUNCTIONS.md)
3. **CREATE TASKS** - Break functions into atomic tasks (TASKS-ITERATION-X.md)
4. **EXECUTE** - Work through tasks one by one
5. **TRACK PROGRESS** - Document what's done, blocked, next (PROGRESS.md)
6. **LOOP BACK** - Review, retrospect, and start next iteration

### Iteration Structure

Each iteration should:
- Focus on 1-3 related functions
- Contain 10-20 atomic tasks
- Be completable in 1-3 sessions
- End with working, tested features
- Include a retrospective

### Task Atomicity

A good task:
- Has a clear, measurable outcome
- Can be completed in one sitting
- Doesn't depend on decisions not yet made
- Includes its own tests (when applicable)

Bad: "Build the user system"
Good: "Create User schema with Zod validation"
Good: "Create user registration form component"
Good: "Write tests for user registration"

---

## Anti-Patterns to Avoid

### Session Management
- ❌ Trust PROGRESS.md blindly when resuming - always verify with git log
- ❌ Start working without checking actual state
- ❌ Skip verification to "save time"

### Development
- ❌ Work on multiple tasks without updating PROGRESS.md after each
- ❌ Get stuck "thinking" without asking for clarification
- ❌ Skip tests or treat them as optional
- ❌ Make assumptions about what to do next - ask the user
- ❌ Batch up many changes before committing

### Do Instead
- ✅ Verify state with git log before continuing
- ✅ Update PROGRESS.md immediately after completing each task
- ✅ Interact and confirm direction often
- ✅ Write tests as you build features
- ✅ Ask when uncertain
- ✅ Commit after each task

---

## Session Resumption Protocol

When starting a new session (after initial setup), Claude should:

1. Read INSTRUCTIONS_TO_LLM.md
2. Read PROGRESS.md (but verify against git)
3. Read BUGS.md for active bugs
4. Read current TASKS-ITERATION-X.md
5. Run `git log --oneline -20` to verify actual state
6. Run tests to see current count
7. Compare git commits vs PROGRESS.md
8. If PROGRESS.md is outdated, update it first
9. Report status and ask user what to do next

---

# TEMPLATES

Everything below this line contains the templates for each file. Populate with information gathered during discovery.

---

## TEMPLATE: README.md

```markdown
# [PROJECT_NAME]

[One-line description of what the app does]

## Overview

[2-3 sentences explaining the project purpose and target users]

## Features

- [Feature 1]
- [Feature 2]
- [Feature 3]

## Tech Stack

- **Frontend:** [TBD]
- **Backend:** [TBD]
- **Database:** [TBD]
- **Hosting:** [TBD]

## Getting Started

### Prerequisites

- [Prerequisite 1, e.g., Node.js 18+]
- [Prerequisite 2]

### Installation

```bash
# Clone the repository
git clone [REPO_URL]
cd [PROJECT_NAME]

# Install dependencies
[INSTALL_COMMAND, e.g., npm install]

# Start development server
[START_COMMAND, e.g., npm run dev]
```

### Environment Variables

Create a `.env.local` file with:

```
[ENV_VAR_1]=your_value
[ENV_VAR_2]=your_value
```

## Development

This project uses the **Ralph Loop** methodology for iterative development.

- See `INSTRUCTIONS_TO_LLM.md` for AI assistant context
- See `PROGRESS.md` for current development status
- See `TASKS-ITERATION-X.md` for current iteration tasks

## Project Structure

```
[PROJECT_ROOT]/
├── [folder]/          # [Description]
├── [folder]/          # [Description]
└── [file]             # [Description]
```

## Contributing

[Instructions for contributing, or "This is a personal project"]

## License

[License type, e.g., MIT, or "Private"]
```

---

## TEMPLATE: INSTRUCTIONS_TO_LLM.md

```markdown
# Instructions for AI Assistants

**Project:** [PROJECT_NAME]
**Created:** [DATE]
**Last Updated:** [DATE]

---

## ⚠️ IMPORTANT: Working Directory

**ALWAYS work in:** `[PROJECT_PATH]`

---

## What This Project Is About

[PROJECT_DESCRIPTION - 2-3 sentences explaining what the app does and its purpose]

### Dual Purpose
1. **Practical Goal:** [What the app does]
2. **Learning Goal:** Practice iterative development methodology

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
   - `TASKS-ITERATION-X.md` - See the current iteration's task list
   - `PROGRESS.md` - **MOST IMPORTANT** - See current state and next steps
   - `BUGS.md` - **CRITICAL** - Check for active bugs that need attention

2. **Verify actual state:**
   - Run `git log --oneline -20` to see recent commits
   - Compare git commits vs PROGRESS.md
   - If PROGRESS.md is outdated, UPDATE IT FIRST

3. **Confirm understanding:**
   - State which iteration we're on
   - State which tasks are completed vs. remaining
   - Ask if the user wants to continue where they left off

4. **Continue working:**
   - Follow the loop process
   - Work on one task at a time
   - Update PROGRESS.md as you go
   - Commit frequently

### Important Guidelines

- **Go slowly and deliberately** - Quality over speed
- **Interact frequently** - Check in with the user, don't get stuck in long loops
- **Update PROGRESS.md** - After every task completion or significant change
- **Commit often** - After each task or logical group of changes
- **Testing is critical** - Tests are part of the process, not optional
- **DOCUMENTATION IS MANDATORY** - See Documentation Requirements section

### When to Restart Claude

Claude has a limited context window. The user should start a fresh session when:
- Responses are getting slower
- Claude seems to forget earlier context
- Errors or confusion are increasing
- After completing a task or iteration (good natural breakpoint)

**This is normal!** All progress is saved in the project files. Just start a new chat and read INSTRUCTIONS_TO_LLM.md again.

### Tech Stack

[LIST TECH STACK HERE - e.g.]
- Framework: [TBD]
- Language: [TBD]
- Database: [TBD]
- Testing: [TBD]
- Deployment: [TBD]

---

## File Structure and Purpose

### Planning & Documentation Files
- `DEFINE.md` - Project goals, requirements, success criteria (stable, rarely changes)
- `FUNCTIONS.md` - Feature breakdown into major functions (stable)
- `TASKS-ITERATION-X.md` - Current iteration's atomic task list (changes per iteration)
- `PROGRESS.md` - **LIVING DOCUMENT** - Current state, what's done, what's next, blockers
- `BUGS.md` - **LIVING DOCUMENT** - Active and resolved bugs with root cause analysis
- `COMPLETED.md` - Historical record of finished iterations
- `RETROSPECTIVE.md` - Lessons learned after each iteration
- `INSTRUCTIONS_TO_LLM.md` - This file - context for AI assistants
- `ARCHITECTURE.md` - **LIVING DOCUMENT** - System architecture, folder structure, data flow
- `DECISIONS.md` - **LIVING DOCUMENT** - Architectural decision records (WHY choices were made)
- `PATTERNS.md` - **LIVING DOCUMENT** - Code patterns, conventions, examples to follow

---

## Documentation Requirements

**CRITICAL:** Documentation is not optional.

### Code Documentation Standards

**Every file should have:**
1. **File header comment** explaining purpose
2. **JSDoc/docstring comments** for exported functions/components
3. **Inline comments** explaining WHY (not WHAT) for complex logic
4. **Type annotations** for all parameters and returns

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

---

## Current Iteration Status

**Iteration:** 1 ([ITERATION_FOCUS])
**Focus:** [FUNCTIONS BEING WORKED ON]

**Check PROGRESS.md for detailed current state.**

---

## Common Scenarios

### Scenario 1: User says "continue where we left off"
1. Read PROGRESS.md
2. Verify with git log
3. State current status
4. Ask: "Should I continue with [next task]?"
5. Proceed with next task

### Scenario 2: Hit a blocker
1. Update PROGRESS.md with the blocker
2. Explain the issue to user
3. Ask for guidance or decision
4. Don't spin indefinitely - interact!

### Scenario 3: Task completed
1. **IMMEDIATELY** mark task complete in PROGRESS.md
2. Commit the changes
3. State what was accomplished
4. Ask about next task

---

## Key Principles

1. **Transparency** - Always update PROGRESS.md so the state is clear
2. **Interaction** - Check in frequently, don't go silent for long periods
3. **Testing Mindset** - Every function needs tests
4. **Small Steps** - One task at a time, commit often, track progress

---

**Remember:** Accurate progress tracking is essential. The process matters as much as the product.
```

---

## TEMPLATE: DEFINE.md

```markdown
# PROJECT DEFINITION

**Project:** [PROJECT_NAME]
**Version:** 1.0
**Created:** [DATE]
**Last Updated:** [DATE]

---

## Vision Statement

[One paragraph describing what this project is and why it exists]

---

## Goals

### Primary Goals
1. [GOAL_1]
2. [GOAL_2]
3. [GOAL_3]

### Secondary Goals
1. [SECONDARY_GOAL_1]
2. [SECONDARY_GOAL_2]

---

## Target Users

**Primary User:** [Description of main user type]

**User Needs:**
- [NEED_1]
- [NEED_2]
- [NEED_3]

---

## Requirements

### Functional Requirements
1. [REQUIREMENT_1]
2. [REQUIREMENT_2]
3. [REQUIREMENT_3]

### Non-Functional Requirements
1. [Performance, security, accessibility, etc.]

### Constraints
1. [Any hard constraints - deadlines, technologies, etc.]

---

## Success Criteria

How will we know the project is successful?

1. [CRITERION_1]
2. [CRITERION_2]
3. [CRITERION_3]

---

## Out of Scope

Things we are explicitly NOT building:

1. [OUT_OF_SCOPE_1]
2. [OUT_OF_SCOPE_2]

---

## Tech Stack

- **Frontend:** [TBD]
- **Backend:** [TBD]
- **Database:** [TBD]
- **Authentication:** [TBD]
- **Testing:** [TBD]

---

## Deployment

- **Hosting Platform:** [TBD - e.g., Vercel, Netlify, AWS, Railway, self-hosted]
- **Custom Domain:** [TBD - yes/no, domain name if known]
- **CI/CD:** [TBD - GitHub Actions, Vercel auto-deploy, etc.]
- **Environment Variables:** [List any needed - API keys, database URLs, etc.]

### Deployment Notes

[Any special deployment considerations - e.g., "Set up Vercel early to catch build errors", "Need to configure environment variables for auth"]

---

## References

- [Link to similar apps, designs, or inspiration]
```

---

## TEMPLATE: FUNCTIONS.md

```markdown
# FUNCTIONS BREAKDOWN

**Project:** [PROJECT_NAME]
**Created:** [DATE]
**Last Updated:** [DATE]

---

## Overview

This document breaks down the project into major functions/features. Each function will be implemented across one or more iterations.

**Total Functions:** [NUMBER]

---

## Function List

### Function 1: [FUNCTION_NAME]
**Priority:** High/Medium/Low
**Iteration:** [TBD]
**Description:** [What this function does]
**Key Features:**
- [Feature 1]
- [Feature 2]

---

### Function 2: [FUNCTION_NAME]
**Priority:** High/Medium/Low
**Iteration:** [TBD]
**Description:** [What this function does]
**Key Features:**
- [Feature 1]
- [Feature 2]

---

[Continue for all functions...]

---

## Iteration Planning

| Iteration | Functions | Focus |
|-----------|-----------|-------|
| 1 | Function 1, 2 | Foundation & Core |
| 2 | Function 3, 4 | [Focus Area] |
| 3 | Function 5, 6 | [Focus Area] |

---

## Dependencies

[Note any functions that depend on others being completed first]

- Function X depends on Function Y
```

---

## TEMPLATE: PROGRESS.md

```markdown
# PROGRESS: Current State

**Project:** [PROJECT_NAME]
**Current Iteration:** 1
**Last Updated:** [DATE]
**Status:** 🚧 IN PROGRESS

---

## Current Iteration: Loop 1

**Focus Areas:**
- Function 1: [NAME]
- Function 2: [NAME]

**Started:** [DATE]
**Planning Phase:** Complete ✅

---

## Task Progress for Iteration 1 ([TOTAL] total tasks)

### ✅ Completed Tasks (0/[TOTAL])

[Tasks will be listed here as they are completed]

### ⏳ Pending Tasks ([TOTAL])

[All tasks listed here initially]

---

## Test Suite Status

**Total Tests:** 0
**Passing:** 0

---

## Next Action

[What should be done next]

---

## Session History

### Session 1 ([DATE])
**What was accomplished:**
- [List of accomplishments]

**Next session should:**
- [List of next steps]

---

## Notes & Observations

[Any relevant notes]

---

## Blockers / Questions

[Any blockers or decisions needed]
```

---

## TEMPLATE: BUGS.md

```markdown
# Bug Tracking

**Project:** [PROJECT_NAME]
**Purpose:** Track bugs discovered during development and their resolutions
**Created:** [DATE]

---

## Active Bugs

*No active bugs*

---

## Resolved Bugs

[Bugs will be documented here as they are found and fixed]

---

## Bug Report Template

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

#### Lessons Learned
[What can we do to prevent similar bugs?]
```

---

## TEMPLATE: COMPLETED.md

```markdown
# COMPLETED: Historical Record

**Project:** [PROJECT_NAME]
**Purpose:** Track completed iterations and accomplishments

---

## Iteration History

[Iterations will be documented here as they are completed]

---

## Template for Completed Iteration

### Loop Iteration X: [ITERATION_NAME]

**Dates:** [START] to [END]
**Duration:** [X days/sessions]

#### Goals
- Function X: [Description]
- Function Y: [Description]

#### Completed Tasks ([X]/[X])
1. Task X.1: [Description]
2. Task X.2: [Description]
[...]

#### Key Accomplishments
- [Accomplishment 1]
- [Accomplishment 2]

#### Tests Added
- [X] new tests
- Total: [Y] tests passing

#### Lessons Learned
- [Lesson 1]
- [Lesson 2]
```

---

## TEMPLATE: RETROSPECTIVE.md

```markdown
# RETROSPECTIVE: Lessons Learned

**Project:** [PROJECT_NAME]
**Purpose:** Reflect on each iteration to improve the process

---

## Iteration Retrospectives

[Retrospectives will be added here after each iteration]

---

## Template for Retrospective

### Iteration X Retrospective

**Date:** [DATE]
**Duration:** [How long did this iteration take?]

#### What Went Well
- [POSITIVE_1]
- [POSITIVE_2]

#### What Could Be Improved
- [IMPROVEMENT_1]
- [IMPROVEMENT_2]

#### What We Learned
- [LEARNING_1]
- [LEARNING_2]

#### Action Items for Next Iteration
- [ ] [ACTION_1]
- [ ] [ACTION_2]

#### Process Observations
[Any observations about the development process itself]
```

---

## TEMPLATE: ARCHITECTURE.md

```markdown
# ARCHITECTURE

**Project:** [PROJECT_NAME]
**Created:** [DATE]
**Last Updated:** [DATE]

---

## Overview

[High-level description of the system architecture]

---

## Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| Frontend | [TBD] | [Purpose] |
| Backend | [TBD] | [Purpose] |
| Database | [TBD] | [Purpose] |
| Testing | [TBD] | [Purpose] |

---

## Folder Structure

```
[PROJECT_ROOT]/
├── [folder]/          # [Description]
├── [folder]/          # [Description]
└── [file]             # [Description]
```

---

## Data Flow

[Description of how data flows through the application]

---

## Key Components

### Component 1: [NAME]
**Location:** [path]
**Purpose:** [description]
**Dependencies:** [what it depends on]

---

## State Management

[How state is managed in the application]

---

## API Structure

[If applicable, describe API endpoints]

---

## Security Considerations

[Security measures in place]

---

## Performance Considerations

[Any performance-related architectural decisions]
```

---

## TEMPLATE: DECISIONS.md

```markdown
# ARCHITECTURAL DECISIONS

**Project:** [PROJECT_NAME]
**Purpose:** Record significant technical decisions and their rationale

---

## Decision Log

[Decisions will be logged here as they are made]

---

## Template for Decision Record

### ADR-XXX: [Decision Title]

**Date:** [DATE]
**Status:** Proposed / Accepted / Deprecated / Superseded
**Deciders:** [Who made this decision]

#### Context
[What is the issue that we're seeing that is motivating this decision?]

#### Decision
[What is the change that we're proposing and/or doing?]

#### Options Considered

**Option A: [Name]**
- Pros: [list]
- Cons: [list]

**Option B: [Name]**
- Pros: [list]
- Cons: [list]

#### Rationale
[Why did we choose this option over the others?]

#### Consequences
- [Positive consequence]
- [Negative consequence / trade-off]

#### Related Decisions
- [Links to related ADRs]
```

---

## TEMPLATE: PATTERNS.md

```markdown
# CODE PATTERNS & CONVENTIONS

**Project:** [PROJECT_NAME]
**Purpose:** Document established patterns for consistency
**Created:** [DATE]
**Last Updated:** [DATE]

---

## Overview

This document captures the coding patterns and conventions established in this project. Follow these patterns for consistency.

---

## File Naming Conventions

- Components: `PascalCase.tsx` (e.g., `UserCard.tsx`)
- Utilities: `camelCase.ts` (e.g., `formatDate.ts`)
- Tests: `[filename].test.ts` (e.g., `UserCard.test.tsx`)
- Styles: `[filename].module.css` (if applicable)

---

## Component Patterns

[Document how components should be structured]

### Example Component

```[language]
// Example code showing the pattern
```

---

## Testing Patterns

[Document how tests should be written]

### Example Test

```[language]
// Example test code
```

---

## State Management Patterns

[Document state management conventions]

---

## Error Handling Patterns

[Document error handling conventions]

---

## Anti-Patterns to Avoid

- ❌ [Anti-pattern 1]
- ❌ [Anti-pattern 2]

---

## Notes

[Any additional notes about patterns]
```

---

## TEMPLATE: TASKS-ITERATION-1.md

```markdown
# TASKS: Iteration 1

**Project:** [PROJECT_NAME]
**Iteration:** 1 - [ITERATION_NAME]
**Created:** [DATE]
**Status:** 🚧 IN PROGRESS

---

## Iteration Goals

**Focus Functions:**
- Function 1: [NAME]
- Function 2: [NAME]

**Success Criteria:**
- [ ] [Criterion 1]
- [ ] [Criterion 2]
- [ ] All tests passing

---

## Tasks

### Function 1: [NAME]

#### Task 1.1: [Task Name]
**Description:** [What needs to be done]
**Deliverables:**
- [ ] [Deliverable 1]
- [ ] [Deliverable 2]
**Tests:** [What tests are needed]

---

#### Task 1.2: [Task Name]
**Description:** [What needs to be done]
**Deliverables:**
- [ ] [Deliverable 1]
**Tests:** [What tests are needed]

---

[Continue for all tasks...]

---

## Task Summary

| Task | Description | Status |
|------|-------------|--------|
| 1.1 | [Short description] | ⏳ Pending |
| 1.2 | [Short description] | ⏳ Pending |

**Total Tasks:** [X]
**Completed:** 0
**Remaining:** [X]

---

## Notes

[Any notes specific to this iteration]
```

---

# END OF TEMPLATES

---

## Quick Start

When a user points you at this file, follow this script:

### 1. Greet and Explain

Say something like:

> "Hi! I'll help you set up a new project using the Ralph Loop methodology - a structured approach to iterative development.
>
> We'll do this in two phases:
> 1. **Discovery** - I'll ask you questions about your project
> 2. **Scaffolding** - I'll create all the project files with the information we gathered
>
> For each question, you can:
> - **Answer it** - tell me your preference
> - **Say "skip"** - we'll leave it TBD and decide later
> - **Say "you decide"** - I'll make a recommendation based on your project
>
> Ready to start? First question: **What folder/directory should this project live in?**"

### 2. Run Through Discovery Questions

Ask questions 1-22 from the Discovery section. Be conversational.
- If user says "skip" → mark as TBD
- If user says "you decide" → make a recommendation based on what you've learned about the project

### 3. Summarize Understanding

Before creating files, summarize what you learned:

> "Let me make sure I understand:
> - Project: [name]
> - What it does: [description]
> - Tech stack: [stack]
> - Key features: [list]
> - Deployment: [plan]
>
> Does this sound right?"

### 4. Create Files

Once confirmed:
1. Initialize git
2. Create all 12 files using the templates, populated with discovery info
3. Make initial commit

### 5. Hand Off

> "Setup complete! Your project is ready.
>
> **How to work with Claude going forward:**
> - Start each session by saying: 'Please read INSTRUCTIONS_TO_LLM.md'
> - Restart Claude when it gets slow or confused - this is normal! Your progress is saved in the files.
> - Good restart points: after completing a task, after an iteration, when things feel 'off'
>
> Want to start working on Iteration 1 now?"

Good luck with your new project!
