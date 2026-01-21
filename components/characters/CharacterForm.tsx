'use client'

/**
 * Character Form Component
 *
 * Form for creating or editing characters.
 * Includes validation and error display.
 */

import { useState, useEffect } from 'react'
import { Character, CreateCharacter, CreateCharacterSchema } from '@/lib/schemas'
import { useGameStore } from '@/lib/store/gameStore'
import { fileToBase64, validateImageFile, getAvatarUrl } from '@/lib/utils/avatar'

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
    customImage: character?.customImage,
    conditions: character?.conditions || [],
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [imagePreview, setImagePreview] = useState<string | undefined>(character?.customImage)
  const [imageError, setImageError] = useState<string | undefined>()

  // Update currentHp when maxHp changes (for new characters)
  useEffect(() => {
    if (!character && formData.maxHp !== undefined) {
      setFormData((prev) => ({ ...prev, currentHp: formData.maxHp }))
    }
  }, [formData.maxHp, character])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form data
    const result = CreateCharacterSchema.safeParse(formData)

    if (!result.success) {
      // Convert errors to object
      const errorObj: Record<string, string> = {}
      result.error.issues.forEach((issue) => {
        const key = issue.path.join('.')
        errorObj[key] = issue.message
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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Clear previous errors
    setImageError(undefined)

    // Validate file
    const validation = validateImageFile(file)
    if (!validation.isValid) {
      setImageError(validation.error)
      return
    }

    try {
      // Convert to base64
      const base64 = await fileToBase64(file)
      setFormData((prev) => ({ ...prev, customImage: base64 }))
      setImagePreview(base64)
    } catch (error) {
      setImageError('Failed to upload image. Please try again.')
    }
  }

  const handleRemoveImage = () => {
    setFormData((prev) => ({ ...prev, customImage: undefined }))
    setImagePreview(undefined)
    setImageError(undefined)
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

      <div>
        <label className="block text-sm font-medium mb-2">Avatar</label>
        <div className="space-y-3">
          {/* Image Preview */}
          {imagePreview ? (
            <div className="flex items-center gap-3">
              <img
                src={imagePreview}
                alt="Avatar preview"
                className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
              />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="text-red-600 text-sm hover:text-red-700"
              >
                Remove Image
              </button>
            </div>
          ) : formData.avatarSeed ? (
            <div className="flex items-center gap-3">
              <img
                src={getAvatarUrl(formData.avatarSeed)}
                alt="Generated avatar preview"
                className="w-20 h-20 rounded-full border-2 border-gray-200"
              />
              <p className="text-sm text-gray-600">Auto-generated avatar</p>
            </div>
          ) : null}

          {/* Image Upload */}
          <div>
            <label
              htmlFor="imageUpload"
              className="inline-block bg-gray-100 px-4 py-2 rounded-md text-sm cursor-pointer hover:bg-gray-200"
            >
              Upload Custom Image
            </label>
            <input
              id="imageUpload"
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
              onChange={handleImageUpload}
              className="hidden"
            />
            {imageError && <p className="text-red-600 text-sm mt-1">{imageError}</p>}
            <p className="text-xs text-gray-500 mt-1">JPEG, PNG, GIF, or WebP (max 2MB)</p>
          </div>

          {/* Avatar Seed (for generated avatars) */}
          <div>
            <label htmlFor="avatarSeed" className="block text-sm mb-1">
              Or use seed for generated avatar
            </label>
            <input
              id="avatarSeed"
              type="text"
              value={formData.avatarSeed}
              onChange={(e) => handleChange('avatarSeed', e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Leave blank to use character name"
            />
            <p className="text-xs text-gray-500 mt-1">
              Optional: Any text generates a unique avatar (defaults to character name)
            </p>
          </div>
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
