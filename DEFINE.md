# DEFINE: DND Game Tracker Loop (v2.0)

**Project Name:** dnd-game-tracker-loop
**Version:** 2.0 (Loop Methodology Rebuild)
**Created:** 2026-01-20
**Status:** DEFINE Phase

---

## Project Purpose

Rebuild the D&D Game Tracker application using the **RALPH Loop methodology** to:
1. **Learn** the iterative loop development process hands-on
2. **Demonstrate** how breaking projects into functions → tasks → iterations works
3. **Build** a better version of the existing tracker with planned features
4. **Track** progress transparently using structured documentation files

This project serves dual purposes:
- **Practical**: Create an improved D&D/Warhammer 40K game tracker
- **Educational**: Understand and practice loop-based development methodology

---

## Success Criteria

### Primary Goals
- [ ] Rebuild existing MVP features using loop methodology
- [ ] Implement at least 3 new features from the planned list
- [ ] Maintain clear loop documentation (DEFINE, FUNCTIONS, TASKS, PROGRESS, COMPLETED)
- [ ] Deploy working version to Vercel
- [ ] Application demonstrates visible improvement over v1

### Learning Goals
- [ ] Successfully complete at least 2 full loop iterations
- [ ] Document what worked and what didn't in each iteration
- [ ] Understand when to break down vs. when to combine tasks
- [ ] Experience the "loop restart" process with clean slate + context from previous runs

---

## Core Requirements (From Existing App)

### Must-Have Features (MVP Parity)
1. **Character Management**
   - Create/edit/delete characters
   - Track: Name, Class, Level, HP, Max HP, AC
   - Custom image upload support
   - Auto-generated avatars as fallback

2. **Dashboard**
   - Team size display
   - Average health percentage
   - Campaign/mission information

3. **Combat Tracker**
   - Initiative-based combat system
   - HP adjustment controls
   - Active turn highlighting
   - Sorted combatant list

4. **Conditions System**
   - Apply/remove status effects (Poisoned, Prone, Paralyzed, Stunned, Blinded, Frightened, Charmed)
   - Visual indication of active conditions

5. **Monster Library**
   - Pre-defined enemy stat blocks
   - Add monsters to combat encounters
   - Display: Type, AC, HP, Damage, Abilities

---

## Planned New Features (Priority Ordered)

### Phase 1: Data Persistence (HIGH PRIORITY)
- **LocalStorage Integration** - Save characters, monsters, combatants to browser storage
- **Export/Import** - JSON backup/restore functionality
- **Auto-save** - Prevent data loss on page refresh

### Phase 2: Combat Enhancements (HIGH PRIORITY)
- **True Initiative System** - Replace AC-based sorting with d20 + DEX modifier rolls
- **Round Tracker** - Visual round counter in combat
- **Damage History** - Log of damage/healing per round
- **Combat HP Sync** - Changes in combat tracker update character roster

### Phase 3: User Experience (MEDIUM PRIORITY)
- **Dark Mode Toggle** - Manual override for color scheme
- **Keyboard Shortcuts** - Fast combat management (arrow keys, number keys)
- **Responsive Mobile Design** - Tablet-optimized for table use
- **Confirmation Dialogs** - Prevent accidental deletions

### Phase 4: Enhanced Tracking (MEDIUM PRIORITY)
- **Spell Slot Management** - Track available/used spell slots per character
- **Action Economy** - Track bonus actions, reactions, legendary actions
- **Turn Timer** - Optional timer for turn duration
- **Dice Roller** - Visual dice rolling system
  - Simple display: Click button → show result immediately
  - Enhanced display: Animated 3D dice roll effect (future enhancement)
  - Support for: d20, d12, d10, d8, d6, d4, and modifiers
  - Results displayed prominently with success/failure indicators

### Phase 5: Content & Organization (LOW PRIORITY)
- **Encounter Builder** - Save/load pre-built encounters
- **NPC Database** - Store recurring NPCs
- **Quest Log** - Campaign quest tracking
- **Session Notes** - Date-stamped session summaries

### Phase 6: Advanced Features (FUTURE)
- **Statblock Import** - Parse D&D Beyond or other formats
- **Multi-user Support** - Shared encounters for DM + players
- **Sound Effects** - Optional combat ambiance
- **Cloud Sync** - Database backend for cross-device access

---

## Technical Stack

### Core Technologies (Same as v1)
- **Framework**: Next.js 16.1+ (App Router)
- **Language**: TypeScript 5+
- **Styling**: Tailwind CSS 4
- **Runtime**: React 19.2+
- **Deployment**: Vercel (free tier)

### New Additions
- **State Management**: Zustand or Context API (for complex state)
- **Storage**: LocalStorage API initially, plan for database later
- **Validation**: Zod for type-safe data validation and structured schemas
- **Testing**: Jest + React Testing Library (REQUIRED from iteration 1)
  - Unit tests for all functions
  - Component tests for UI interactions
  - Integration tests for critical flows
  - Test creation is part of the learning process

---

## Design Principles

1. **Iterative Development** - Build in small, testable increments
2. **Progress Transparency** - All loop phases documented in markdown files
3. **Learning Over Perfection** - Prioritize understanding the process
4. **User-Centric** - Every feature must serve the end-user (game tracker needs)
5. **Code Quality** - Better documentation than v1, clear comments, typed interfaces
6. **Test-Driven Mindset** - Tests are not optional - they're part of the learning journey
7. **Structured from Start** - Use schemas and validation to establish growth-friendly patterns
8. **Visual Feedback** - User interactions should have clear, engaging visual responses (especially dice rolling)

---

## Loop Methodology Structure

### Files to Maintain
- `DEFINE.md` (this file) - Project goals and requirements
- `FUNCTIONS.md` - Feature breakdown into logical functions
- `TASKS.md` - Current iteration task list
- `PROGRESS.md` - Current loop status and blockers
- `COMPLETED.md` - Historical record of completed work
- `RETROSPECTIVE.md` - Lessons learned per iteration

### Loop Phases
1. **Define** - Review goals (this document)
2. **Break Down** - Split into functions (FUNCTIONS.md)
3. **Task Creation** - Atomic tasks from functions (TASKS.md)
4. **Execute** - Work on tasks, update PROGRESS.md
5. **Track Progress** - Document completion in COMPLETED.md
6. **Loop Back** - Review, retrospective, plan next iteration

---

## Non-Goals (Out of Scope)

- ❌ No mobile native apps (iOS/Android)
- ❌ No real-time multiplayer (unless simple implementation in Phase 6)
- ❌ No paid features or monetization
- ❌ No AI-generated content (monsters, NPCs)
- ❌ No VTT (Virtual Tabletop) integration like Roll20
- ❌ No full SRD database (licensing complexity)

---

## Open Questions

1. **Initiative System**: Roll automatically on combat start, or let user enter rolls manually?
2. **Mobile Priority**: Should Phase 3 come before Phase 2?

## Resolved Decisions

✅ **Data Format**: Use structured schema with Zod validation from the start - provides framework for growth
✅ **Testing**: Tests are REQUIRED from iteration 1 - part of the learning process and critical to understanding loop methodology
✅ **Migration**: No migration tool needed - this is a fresh start, experimental learning project
✅ **Dice Rolling**: Visual rolling system with simple immediate display first, then enhanced 3D animation in future phase

---

## Next Steps

1. Create new project: `dnd-game-tracker-loop`
2. Create `FUNCTIONS.md` - Break project into major feature areas
3. Create `TASKS.md` - First iteration task list (likely: "Set up project + basic character management")
4. Begin Loop Iteration 1

---

**End of DEFINE Phase**
