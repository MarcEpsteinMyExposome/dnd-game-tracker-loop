# Code Patterns & Conventions

**Project:** dnd-game-tracker-loop v2.0
**Purpose:** Document coding patterns, conventions, and examples to follow
**Last Updated:** 2026-01-20

---

## How to Use This File

This file contains:
- Coding conventions and style guides
- Example code snippets to follow
- Common patterns for components, tests, schemas, etc.
- Anti-patterns to avoid

**Update this file when:**
- You establish a new pattern (after creating first component, first test, etc.)
- You discover a better way to do something
- You encounter a common mistake to document

---

## File Naming Conventions

### Components
- **Format:** PascalCase with descriptive names
- **Location:** `components/[category]/[ComponentName].tsx`
- **Examples:**
  - `components/characters/CharacterCard.tsx`
  - `components/ui/Button.tsx`
  - `components/combat/InitiativeRoller.tsx`

### Tests
- **Format:** Same name as file being tested with `.test.tsx` or `.test.ts`
- **Location:** `__tests__/[mirrors-source-path]/[filename].test.ts`
- **Examples:**
  - `__tests__/components/characters/CharacterCard.test.tsx`
  - `__tests__/lib/schemas/character.test.ts`

### Schemas
- **Format:** Descriptive name with `.schema.ts` suffix
- **Location:** `lib/schemas/[name].schema.ts`
- **Examples:**
  - `lib/schemas/character.schema.ts`
  - `lib/schemas/monster.schema.ts`

### Utilities
- **Format:** camelCase, descriptive function names
- **Location:** `lib/[category]/[descriptiveName].ts`
- **Examples:**
  - `lib/validation/helpers.ts`
  - `lib/dice/roller.ts`

---

## Testing Patterns

### Component Test Pattern

**Pattern to follow:**
```typescript
/**
 * Test file for ExampleButton component
 * Tests user interactions and accessibility
 */
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ExampleButton } from '@/components/ui/ExampleButton'

describe('ExampleButton', () => {
  // Test block 1: Rendering
  it('renders with correct text', () => {
    render(<ExampleButton>Click me</ExampleButton>)

    // Use accessible queries (getByRole, getByText, etc.)
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument()
  })

  // Test block 2: User interaction
  it('calls onClick handler when clicked', async () => {
    const handleClick = jest.fn()
    const user = userEvent.setup()

    render(<ExampleButton onClick={handleClick}>Click me</ExampleButton>)

    // Simulate user action
    await user.click(screen.getByRole('button'))

    // Verify result
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  // Test block 3: Edge cases
  it('is disabled when disabled prop is true', () => {
    render(<ExampleButton disabled>Click me</ExampleButton>)

    expect(screen.getByRole('button')).toBeDisabled()
  })
})
```

**Key principles:**
- Use `describe()` to group related tests
- Use `it()` with clear, readable descriptions
- Arrange → Act → Assert pattern
- Use accessible queries (getByRole, getByLabelText)
- Test user behavior, not implementation

---

### Schema Test Pattern

**Pattern to follow (will be established in Task 2.6):**
```typescript
/**
 * Tests for Character schema validation
 * Ensures data integrity and type safety
 */
import { CharacterSchema } from '@/lib/schemas/character.schema'

describe('CharacterSchema', () => {
  // Test valid data
  it('accepts valid character data', () => {
    const validCharacter = {
      id: '123',
      name: 'Raul',
      class: 'Operative',
      level: 5,
      hp: 30,
      maxHp: 40,
      ac: 15,
    }

    const result = CharacterSchema.safeParse(validCharacter)

    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.name).toBe('Raul')
    }
  })

  // Test invalid data
  it('rejects character with negative HP', () => {
    const invalidCharacter = {
      id: '123',
      name: 'Raul',
      hp: -10, // Invalid
    }

    const result = CharacterSchema.safeParse(invalidCharacter)

    expect(result.success).toBe(false)
  })

  // Test required fields
  it('rejects character missing required name field', () => {
    const invalidCharacter = {
      id: '123',
      // name missing
      hp: 30,
    }

    const result = CharacterSchema.safeParse(invalidCharacter)

    expect(result.success).toBe(false)
  })
})
```

---

## TypeScript Conventions

### Type vs Interface
- **Use `type`** for unions, intersections, primitives
- **Use `interface`** for object shapes that may be extended
- **Infer from Zod schemas** when possible (DRY principle)

**Example:**
```typescript
// From Zod schema (preferred)
const CharacterSchema = z.object({
  name: z.string(),
  hp: z.number(),
})
type Character = z.infer<typeof CharacterSchema>

// Direct interface (when no schema needed)
interface ButtonProps {
  children: React.ReactNode
  onClick?: () => void
  disabled?: boolean
}
```

### Naming Conventions
- **Types/Interfaces:** PascalCase (e.g., `Character`, `Monster`)
- **Functions/Variables:** camelCase (e.g., `addCharacter`, `currentHp`)
- **Constants:** UPPER_SNAKE_CASE (e.g., `MAX_HP`, `DEFAULT_AC`)
- **Components:** PascalCase (e.g., `CharacterCard`)

---

## Component Patterns

### Component Structure Template

**Pattern to follow (will be refined in Iteration 2):**
```typescript
/**
 * ExampleComponent - Brief description
 *
 * @description Longer description of what this component does
 * @example
 * <ExampleComponent prop1="value" />
 */

import React from 'react'

// Props interface
interface ExampleComponentProps {
  /** Description of prop1 */
  prop1: string
  /** Description of prop2 (optional) */
  prop2?: number
}

/**
 * ExampleComponent renders...
 */
export function ExampleComponent({ prop1, prop2 = 0 }: ExampleComponentProps) {
  // Hooks at the top
  const [state, setState] = React.useState(0)

  // Event handlers
  const handleClick = () => {
    setState(prev => prev + 1)
  }

  // Render
  return (
    <div className="example-container">
      <p>{prop1}</p>
      <button onClick={handleClick}>Count: {state}</button>
    </div>
  )
}
```

**Key principles:**
- JSDoc comments for components and props
- Props interface with descriptive names
- Hooks before event handlers
- Event handlers before render
- Export components as named exports (not default)

---

## Zod Schema Patterns

### Schema Definition Template

**Pattern to follow (will be established in Task 2.1):**
```typescript
/**
 * Character validation schema
 * Defines structure and validation rules for Character entities
 */
import { z } from 'zod'

/**
 * Character schema with all validation rules
 */
export const CharacterSchema = z.object({
  /** Unique identifier */
  id: z.string().uuid(),

  /** Character name (1-50 characters) */
  name: z.string().min(1).max(50),

  /** Current hit points (0 to maxHp) */
  hp: z.number().int().min(0),

  /** Maximum hit points (positive integer) */
  maxHp: z.number().int().positive(),

  /** Armor class (1-30) */
  ac: z.number().int().min(1).max(30),

  /** Optional custom image (base64 or URL) */
  customImage: z.string().optional(),
})

// Infer TypeScript type from schema
export type Character = z.infer<typeof CharacterSchema>

// Helper: Create default character
export const defaultCharacter: Partial<Character> = {
  hp: 10,
  maxHp: 10,
  ac: 10,
}
```

**Key principles:**
- JSDoc comments for schema and each field
- Validation constraints match business rules
- Export schema and inferred type
- Optional helper functions/defaults

---

## Zustand Store Patterns

### Store Slice Template

**Pattern to follow (will be established in Task 1.4):**
```typescript
/**
 * Character store slice
 * Manages character state and actions
 */
import { StateCreator } from 'zustand'
import { Character } from '@/lib/schemas/character.schema'

// Slice interface
export interface CharacterSlice {
  // State
  characters: Character[]

  // Actions
  addCharacter: (character: Character) => void
  updateCharacter: (id: string, updates: Partial<Character>) => void
  deleteCharacter: (id: string) => void
}

// Slice implementation
export const createCharacterSlice: StateCreator<CharacterSlice> = (set) => ({
  // Initial state
  characters: [],

  // Actions
  addCharacter: (character) => set((state) => ({
    characters: [...state.characters, character]
  })),

  updateCharacter: (id, updates) => set((state) => ({
    characters: state.characters.map(char =>
      char.id === id ? { ...char, ...updates } : char
    )
  })),

  deleteCharacter: (id) => set((state) => ({
    characters: state.characters.filter(char => char.id !== id)
  })),
})
```

**Key principles:**
- Separate interface and implementation
- Immutable updates (spread operators, map, filter)
- Clear action names (addX, updateX, deleteX)
- JSDoc comments for public API

---

## Git Commit Patterns

### Commit Message Format

**Pattern:**
```
<type>: <short summary>

<optional detailed description>

<optional Co-Authored-By line>
```

**Types:**
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation only
- `test:` - Adding tests
- `refactor:` - Code restructuring
- `style:` - Formatting changes
- `chore:` - Maintenance tasks

**Example:**
```
feat: Add Character schema with validation

Created Zod schema for Character entity with validation rules:
- Name required (1-50 chars)
- HP must be 0 to maxHp
- AC between 1-30

Exported TypeScript type via z.infer for type safety.

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
```

---

## Documentation Patterns

### JSDoc Comment Template

**For functions:**
```typescript
/**
 * Validates character data and returns parsed result
 *
 * @param data - Raw character data to validate
 * @returns Validated character or validation error
 *
 * @example
 * const result = validateCharacter({ name: 'Raul', hp: 30 })
 * if (result.success) {
 *   console.log(result.data.name)
 * }
 */
export function validateCharacter(data: unknown) {
  return CharacterSchema.safeParse(data)
}
```

**For components:**
```typescript
/**
 * CharacterCard displays a character's stats and avatar
 *
 * @description Shows HP bar, AC, conditions, and action buttons.
 * Allows editing HP and toggling conditions.
 *
 * @example
 * <CharacterCard character={raul} onUpdate={handleUpdate} />
 */
export function CharacterCard({ character, onUpdate }: CharacterCardProps) {
  // ...
}
```

---

## Anti-Patterns to Avoid

### ❌ Don't: Test implementation details
```typescript
// BAD: Testing internal state
expect(component.state.count).toBe(5)

// GOOD: Test what user sees
expect(screen.getByText('Count: 5')).toBeInTheDocument()
```

### ❌ Don't: Mutate state directly
```typescript
// BAD: Direct mutation
state.characters.push(newCharacter)

// GOOD: Immutable update
setState({ characters: [...state.characters, newCharacter] })
```

### ❌ Don't: Skip TypeScript types
```typescript
// BAD: Using 'any'
function updateCharacter(data: any) { }

// GOOD: Proper typing
function updateCharacter(data: Partial<Character>) { }
```

### ❌ Don't: Commit without tests
- Every feature needs tests
- Task isn't complete without passing tests
- See ADR-005 in DECISIONS.md

---

## Future Patterns to Document

- Component composition patterns
- Custom hook patterns
- Form handling patterns
- Error handling patterns
- Loading state patterns
- Responsive design patterns

---

## Update History

**2026-01-20** - Initial patterns documentation
- File naming conventions
- Testing patterns (component and schema templates)
- TypeScript conventions
- Component structure template
- Zod schema template
- Zustand store template
- Git commit format
- JSDoc patterns
- Anti-patterns to avoid

---

**Note:** This file will grow as we establish patterns during development. Update after creating new pattern examples.
