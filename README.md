# Bang Your Dead v3

A Western Gun & Magic themed combat tracker for tabletop RPG sessions.

## Features

- **Posse Management** - Create, edit, and track deputies with HP, AC, conditions
- **Showdown Tracker** - Initiative-based turn order, HP tracking, round counter
- **Outlaw Bounties** - 15 pre-defined outlaws with Quick Encounter presets
- **Dashboard** - Posse statistics and health overview
- **Data Persistence** - Auto-save to localStorage with export/import

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:3000
```

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 16.1 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4 |
| State | Zustand 5.0 |
| Validation | Zod 3.24 |
| Testing | Jest + React Testing Library |

## Project Status

**Iteration 4 Complete** - 805 tests passing

### Completed
- Character CRUD with conditions system
- Combat tracker with turn management
- Monster library with Quick Encounters
- LocalStorage persistence with export/import
- Dashboard with team statistics
- Visual rebrand to Western Gun & Magic theme

### Next Up (Iteration 5)
- True initiative system (d20 + DEX)
- Visual dice roller

See [.claude/tasks/iteration-5/](.claude/tasks/iteration-5/) for task breakdown.

## Development

```bash
npm run dev      # Development server
npm test         # Run tests
npm run build    # Production build
npm run lint     # Lint check
```

## Documentation

- [CLAUDE.md](CLAUDE.md) - Project context for Claude Code
- [ARCHITECTURE.md](ARCHITECTURE.md) - System architecture
- [DECISIONS.md](DECISIONS.md) - Architectural decisions
- [PATTERNS.md](PATTERNS.md) - Code patterns

## License

Private project
