# D&D Game Tracker Loop - v2.0

A rebuilt version of the D&D Game Tracker using the **RALPH Loop Methodology** for iterative development.

## Purpose

This project serves dual purposes:
1. **Practical**: Build an improved D&D/Warhammer 40K game tracker
2. **Educational**: Learn and demonstrate the RALPH loop development process

## Project Status

**Current Phase:** DEFINE ✅
**Next Phase:** Create FUNCTIONS.md and begin Loop Iteration 1

## How to Run

### Option 1: Local Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open http://localhost:3000 in your browser

### Option 2: Run Tests

```bash
npm test          # Run tests once
npm run test:watch  # Run tests in watch mode
```

## Loop Documentation

- [DEFINE.md](DEFINE.md) - Project goals, requirements, and success criteria ✅
- FUNCTIONS.md - Feature breakdown (coming next)
- TASKS.md - Current iteration tasks (coming next)
- PROGRESS.md - Loop status tracking (coming next)
- COMPLETED.md - Historical completion record (coming next)
- RETROSPECTIVE.md - Lessons learned (coming next)

## Tech Stack

- **Framework**: Next.js 16.1 (App Router with Turbopack)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **Runtime**: React 19.2
- **State Management**: Zustand
- **Validation**: Zod
- **Testing**: Jest + React Testing Library
- **Deployment**: Vercel (future)

## Key Differences from v1

- ✅ Test-driven development from the start
- ✅ Structured schemas with Zod validation
- ✅ Loop-based iterative development process
- ✅ Comprehensive documentation at each phase
- ✅ Better code organization and architecture
- ✅ Visual dice rolling system (planned)
- ✅ Data persistence with LocalStorage (planned)

## Development Principles

1. **Iterative Development** - Build in small, testable increments
2. **Test-Driven Mindset** - Tests are part of the learning journey
3. **Structured from Start** - Use schemas and validation from day one
4. **Progress Transparency** - All loop phases documented
5. **Learning Over Perfection** - Prioritize understanding the process

---

**Version**: 2.0.0
**Started**: 2026-01-20
