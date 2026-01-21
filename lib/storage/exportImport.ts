/**
 * Export/Import Functionality
 *
 * Provides functions to export game state to JSON and import it back.
 * Useful for backups, sharing game states, or transferring between devices.
 *
 * @module lib/storage/exportImport
 */

import { z } from 'zod'
import { CharacterSchema } from '@/lib/schemas/character.schema'
import { CombatantSchema } from '@/lib/schemas/combatant.schema'
import type { GameStore } from '@/lib/store/gameStore'

/**
 * Schema for exported game state
 * Validates the structure of imported data
 */
const ExportedStateSchema = z.object({
  version: z.number().int().min(1),
  exportedAt: z.string().datetime(),
  data: z.object({
    characters: z.array(CharacterSchema),
    combatants: z.array(CombatantSchema),
    round: z.number().int().min(1),
    isInCombat: z.boolean(),
  }),
})

/**
 * Type for exported state data
 */
export type ExportedState = z.infer<typeof ExportedStateSchema>

/**
 * Result of an import operation
 */
export interface ImportResult {
  success: boolean
  error?: string
  data?: ExportedState['data']
}

/**
 * Export current game state to JSON string
 *
 * Creates a JSON representation of the current game state
 * that can be downloaded as a file or copied to clipboard.
 *
 * @param state - Current game store state
 * @returns JSON string of exported state
 *
 * @example
 * ```typescript
 * const state = useGameStore.getState()
 * const jsonString = exportGameState(state)
 * // Download or copy jsonString
 * ```
 */
export function exportGameState(state: Partial<GameStore>): string {
  const exportData: ExportedState = {
    version: state.version || 1,
    exportedAt: new Date().toISOString(),
    data: {
      characters: state.characters || [],
      combatants: state.combatants || [],
      round: state.round || 1,
      isInCombat: state.isInCombat || false,
    },
  }

  return JSON.stringify(exportData, null, 2)
}

/**
 * Import game state from JSON string
 *
 * Validates and parses a JSON string containing exported game state.
 * Returns success/error result with validated data.
 *
 * @param jsonString - JSON string to import
 * @returns Import result with success flag and data/error
 *
 * @example
 * ```typescript
 * const result = importGameState(fileContents)
 * if (result.success) {
 *   // Load result.data into store
 *   useGameStore.setState(result.data)
 * } else {
 *   // Show error: result.error
 * }
 * ```
 */
export function importGameState(jsonString: string): ImportResult {
  try {
    // Parse JSON
    const parsed = JSON.parse(jsonString)

    // Validate against schema
    const validationResult = ExportedStateSchema.safeParse(parsed)

    if (!validationResult.success) {
      return {
        success: false,
        error: `Invalid file format: ${validationResult.error.errors
          .map((e) => e.message)
          .join(', ')}`,
      }
    }

    // Return validated data
    return {
      success: true,
      data: validationResult.data.data,
    }
  } catch (error) {
    // Handle JSON parse errors
    if (error instanceof SyntaxError) {
      return {
        success: false,
        error: 'Invalid JSON format. Please check the file.',
      }
    }

    return {
      success: false,
      error: `Import failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
    }
  }
}

/**
 * Download exported state as JSON file
 *
 * Triggers browser download of game state as a .json file.
 * Filename includes timestamp for easy identification.
 *
 * @param state - Current game store state
 * @param filename - Optional custom filename (without extension)
 *
 * @example
 * ```typescript
 * const state = useGameStore.getState()
 * downloadGameState(state) // Downloads "dnd-tracker-backup-2026-01-21.json"
 * downloadGameState(state, 'my-campaign') // Downloads "my-campaign.json"
 * ```
 */
export function downloadGameState(
  state: Partial<GameStore>,
  filename?: string
): void {
  const jsonString = exportGameState(state)

  // Create filename with timestamp if not provided
  const finalFilename =
    filename || `dnd-tracker-backup-${new Date().toISOString().split('T')[0]}`

  // Create blob and download link
  const blob = new Blob([jsonString], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')

  link.href = url
  link.download = `${finalFilename}.json`
  document.body.appendChild(link)
  link.click()

  // Cleanup
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * Read file from input element and import state
 *
 * Helper function to handle file upload from input element.
 * Reads the file and imports the game state.
 *
 * @param file - File object from input element
 * @returns Promise resolving to import result
 *
 * @example
 * ```typescript
 * // In a component:
 * const handleFileUpload = async (event: ChangeEvent<HTMLInputElement>) => {
 *   const file = event.target.files?.[0]
 *   if (!file) return
 *
 *   const result = await importGameStateFromFile(file)
 *   if (result.success) {
 *     useGameStore.setState(result.data)
 *   } else {
 *     alert(result.error)
 *   }
 * }
 * ```
 */
export async function importGameStateFromFile(
  file: File
): Promise<ImportResult> {
  // Validate file type
  if (!file.name.endsWith('.json')) {
    return {
      success: false,
      error: 'Please select a .json file',
    }
  }

  // Validate file size (max 10MB)
  const maxSize = 10 * 1024 * 1024 // 10MB
  if (file.size > maxSize) {
    return {
      success: false,
      error: 'File too large. Maximum size is 10MB.',
    }
  }

  try {
    // Read file contents
    const text = await file.text()

    // Import and validate
    return importGameState(text)
  } catch (error) {
    return {
      success: false,
      error: `Failed to read file: ${error instanceof Error ? error.message : 'Unknown error'}`,
    }
  }
}

/**
 * Validate that imported data is compatible with current version
 *
 * Checks if the imported state version is compatible.
 * Warns if importing from a newer version.
 *
 * @param exportedState - Exported state to validate
 * @param currentVersion - Current store version
 * @returns Validation result with warnings
 *
 * @example
 * ```typescript
 * const parsed = JSON.parse(jsonString)
 * const validation = validateImportCompatibility(parsed, CURRENT_VERSION)
 * if (!validation.compatible) {
 *   console.warn(validation.warning)
 * }
 * ```
 */
export function validateImportCompatibility(
  exportedState: ExportedState,
  currentVersion: number
): { compatible: boolean; warning?: string } {
  if (exportedState.version > currentVersion) {
    return {
      compatible: false,
      warning: `This backup was created with a newer version (v${exportedState.version}) of the app. Current version is v${currentVersion}. Import may fail or lose data.`,
    }
  }

  if (exportedState.version < currentVersion) {
    return {
      compatible: true,
      warning: `This backup is from an older version (v${exportedState.version}). It will be automatically upgraded to v${currentVersion}.`,
    }
  }

  return {
    compatible: true,
  }
}
