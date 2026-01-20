'use client'

/**
 * Character Form Component
 *
 * Form for creating or editing characters.
 * Includes validation and error display.
 */

import { useState, useEffect } from 'react'
import { Character, CreateCharacter } from '@/lib/schemas'
import { validateWithSchema, CreateCharacterSchema } from '@/lib/schemas'
import { useGameStore } from '@/lib/store/gameStore'

interface CharacterFormProps {
  character?: Character // If provided, form is in edit mode
  onClose: () => void
  onSuccess?: () => void
}

export function CharacterForm({ character, onClose, onSuccess }: CharacterFormProps) {
  const addCharacter = useGameStore((state) => state.addCharacter)
  const updateCharacter = useGameStore((state) => state.updateCharacter)

  const [formData, setFormData] = useState<Partial<CreateCharacter>>({
    name: character?.name || '',
    characterClass: character?.characterClass || '',
    level: character?.level || 1,
    maxHp: character?.maxHp || 10,
    currentHp: character?.currentHp || 10,
    armorClass: character?.armorClass || 10,
    avatarSeed: character?.avatarSeed || '',
    conditions: character?.conditions || [],
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  // Update currentHp when maxHp changes (for new characters)
  useEffect(() => {
    if (!character && formData.maxHp !== undefined) {
      setFormData((prev) => ({ ...prev, currentHp: formData.maxHp }))
    }
  }, [formData.maxHp, character])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form data
    const result = validateWithSchema(CreateCharacterSchema, formData)

    if (!result.success) {
      // Convert errors to object
      const errorObj: Record<string, string> = {}
      result.error.issues.forEach((issue) => {
        errorObj[issue.path] = issue.message
      })
      setErrors(errorObj)
      return
    }

    // Clear errors
    setErrors({})

    // Submit character
    if (character) {
      // Edit mode
      updateCharacter({
        id: character.id,
        ...result.data,
      })
    } else {
      // Create mode
      addCharacter(result.data)
    }

    onSuccess?.()
    onClose()
  }

  const handleChange = (field: keyof CreateCharacter, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error for this field when user types
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-1">
          Name *
        </label>
        <input
          id="name"
          type="text"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          className="w-full px-3 py-2 border rounded-md"
          placeholder="Character name"
        />
        {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
      </div>

      <div>
        <label htmlFor="characterClass" className="block text-sm font-medium mb-1">
          Class *
        </label>
        <input
          id="characterClass"
          type="text"
          value={formData.characterClass}
          onChange={(e) => handleChange('characterClass', e.target.value)}
          className="w-full px-3 py-2 border rounded-md"
          placeholder="Fighter, Wizard, Rogue..."
        />
        {errors.characterClass && (
          <p className="text-red-600 text-sm mt-1">{errors.characterClass}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="level" className="block text-sm font-medium mb-1">
            Level *
          </label>
          <input
            id="level"
            type="number"
            min="1"
            max="20"
            value={formData.level}
            onChange={(e) => handleChange('level', parseInt(e.target.value))}
            className="w-full px-3 py-2 border rounded-md"
          />
          {errors.level && <p className="text-red-600 text-sm mt-1">{errors.level}</p>}
        </div>

        <div>
          <label htmlFor="armorClass" className="block text-sm font-medium mb-1">
            Armor Class *
          </label>
          <input
            id="armorClass"
            type="number"
            min="1"
            max="30"
            value={formData.armorClass}
            onChange={(e) => handleChange('armorClass', parseInt(e.target.value))}
            className="w-full px-3 py-2 border rounded-md"
          />
          {errors.armorClass && (
            <p className="text-red-600 text-sm mt-1">{errors.armorClass}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="maxHp" className="block text-sm font-medium mb-1">
            Max HP *
          </label>
          <input
            id="maxHp"
            type="number"
            min="1"
            max="999"
            value={formData.maxHp}
            onChange={(e) => handleChange('maxHp', parseInt(e.target.value))}
            className="w-full px-3 py-2 border rounded-md"
          />
          {errors.maxHp && <p className="text-red-600 text-sm mt-1">{errors.maxHp}</p>}
        </div>

        <div>
          <label htmlFor="currentHp" className="block text-sm font-medium mb-1">
            Current HP *
          </label>
          <input
            id="currentHp"
            type="number"
            min="0"
            max={formData.maxHp || 999}
            value={formData.currentHp}
            onChange={(e) => handleChange('currentHp', parseInt(e.target.value))}
            className="w-full px-3 py-2 border rounded-md"
          />
          {errors.currentHp && (
            <p className="text-red-600 text-sm mt-1">{errors.currentHp}</p>
          )}
        </div>
      </div>

      <div className="flex gap-2 pt-4">
        <button
          type="submit"
          className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          {character ? 'Update Character' : 'Create Character'}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
