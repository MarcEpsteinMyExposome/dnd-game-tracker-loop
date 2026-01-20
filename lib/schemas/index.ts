/**
 * Schema Barrel Export
 *
 * Central export point for all Zod schemas and TypeScript types.
 * Import schemas from this file for consistent usage across the app.
 *
 * @example
 * ```typescript
 * import { CharacterSchema, type Character } from '@/lib/schemas'
 * import { validateCharacter, parseMonster } from '@/lib/schemas'
 * ```
 */

// ============================================
// CHARACTER SCHEMA
// ============================================
export {
  CharacterSchema,
  CreateCharacterSchema,
  UpdateCharacterSchema,
  parseCharacter,
  validateCharacter,
  clampHp,
  defaultCharacter,
  type Character,
  type CreateCharacter,
  type UpdateCharacter,
} from './character.schema'

// ============================================
// MONSTER SCHEMA
// ============================================
export {
  MonsterSchema,
  MonsterAbilitySchema,
  MonsterTypeEnum,
  CreateMonsterSchema,
  UpdateMonsterSchema,
  parseMonster,
  validateMonster,
  isValidDiceNotation,
  defaultMonster,
  type Monster,
  type MonsterAbility,
  type MonsterType,
  type CreateMonster,
  type UpdateMonster,
} from './monster.schema'

// ============================================
// CONDITION SCHEMA
// ============================================
export {
  ConditionEnum,
  ConditionsArraySchema,
  ALL_CONDITIONS,
  CONDITION_DETAILS,
  isValidCondition,
  isValidConditionsArray,
  addCondition,
  removeCondition,
  toggleCondition,
  hasCondition,
  getConditionDetails,
  type Condition,
} from './condition.schema'

// ============================================
// COMBATANT SCHEMA
// ============================================
export {
  CombatantSchema,
  CombatantTypeEnum,
  CreateCombatantFromCharacterSchema,
  CreateCombatantFromMonsterSchema,
  UpdateCombatantSchema,
  parseCombatant,
  validateCombatant,
  createCombatantFromCharacter,
  createCombatantFromMonster,
  isCombatantDefeated,
  isCombatantBloodied,
  getCombatantHpPercentage,
  sortByInitiative,
  getActiveCombatant,
  getNextCombatant,
  type Combatant,
  type CombatantType,
  type CreateCombatantFromCharacter,
  type CreateCombatantFromMonster,
  type UpdateCombatant,
} from './combatant.schema'
