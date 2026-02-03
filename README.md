# D&D Game Tracker

A web-based game tracker for D&D and Warhammer 40K tabletop sessions.

## Features

- **Character Management** - Create, edit, and track characters with HP, AC, conditions
- **Combat Tracker** - Initiative-based turn order, HP tracking, round counter
- **Monster Library** - 15 pre-defined monsters with Quick Encounter presets
- **Dashboard** - Team statistics and health overview
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

### Next Up (Iteration 5)
- True initiative system (d20 + DEX)
- Visual dice roller

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
