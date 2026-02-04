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
    dexModifier: character?.dexModifier ?? 0,
    avatarSeed: character?.avatarSeed || '',
    imageUrl: character?.imageUrl,
    conditions: character?.conditions || [],
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [imagePreview, setImagePreview] = useState<string | undefined>(character?.imageUrl)
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
      setFormData((prev) => ({ ...prev, imageUrl: base64 }))
      setImagePreview(base64)
    } catch (error) {
      setImageError('Failed to upload image. Please try again.')
    }
  }

  const handleRemoveImage = () => {
    setFormData((prev) => ({ ...prev, imageUrl: undefined }))
    setImagePreview(undefined)
    setImageError(undefined)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-1 text-slate-700">
          Name *
        </label>
        <input
          id="name"
          type="text"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          className="w-full px-3 py-2 border border-slate-300 rounded-md bg-white text-slate-900 placeholder-slate-400"
          placeholder="Character name"
        />
        {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
      </div>

      <div>
        <label htmlFor="characterClass" className="block text-sm font-medium mb-1 text-slate-700">
          Class *
        </label>
        <input
          id="characterClass"
          type="text"
          value={formData.characterClass}
          onChange={(e) => handleChange('characterClass', e.target.value)}
          className="w-full px-3 py-2 border border-slate-300 rounded-md bg-white text-slate-900 placeholder-slate-400"
          placeholder="Fighter, Wizard, Rogue..."
        />
        {errors.characterClass && (
          <p className="text-red-600 text-sm mt-1">{errors.characterClass}</p>
        )}
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label htmlFor="level" className="block text-sm font-medium mb-1 text-slate-700">
            Level *
          </label>
          <input
            id="level"
            type="number"
            min="1"
            max="20"
            value={formData.level}
            onChange={(e) => handleChange('level', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-slate-300 rounded-md bg-white text-slate-900"
          />
          {errors.level && <p className="text-red-600 text-sm mt-1">{errors.level}</p>}
        </div>

        <div>
          <label htmlFor="armorClass" className="block text-sm font-medium mb-1 text-slate-700">
            Armor Class *
          </label>
          <input
            id="armorClass"
            type="number"
            min="1"
            max="30"
            value={formData.armorClass}
            onChange={(e) => handleChange('armorClass', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-slate-300 rounded-md bg-white text-slate-900"
          />
          {errors.armorClass && (
            <p className="text-red-600 text-sm mt-1">{errors.armorClass}</p>
          )}
        </div>

        <div>
          <label htmlFor="dexModifier" className="block text-sm font-medium mb-1 text-slate-700">
            DEX Mod
          </label>
          <input
            id="dexModifier"
            type="number"
            min="-5"
            max="10"
            value={formData.dexModifier}
            onChange={(e) => handleChange('dexModifier', parseInt(e.target.value) || 0)}
            className="w-full px-3 py-2 border border-slate-300 rounded-md bg-white text-slate-900"
          />
          {errors.dexModifier && (
            <p className="text-red-600 text-sm mt-1">{errors.dexModifier}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="maxHp" className="block text-sm font-medium mb-1 text-slate-700">
            Max HP *
          </label>
          <input
            id="maxHp"
            type="number"
            min="1"
            max="999"
            value={formData.maxHp}
            onChange={(e) => handleChange('maxHp', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-slate-300 rounded-md bg-white text-slate-900"
          />
          {errors.maxHp && <p className="text-red-600 text-sm mt-1">{errors.maxHp}</p>}
        </div>

        <div>
          <label htmlFor="currentHp" className="block text-sm font-medium mb-1 text-slate-700">
            Current HP *
          </label>
          <input
            id="currentHp"
            type="number"
            min="0"
            max={formData.maxHp || 999}
            value={formData.currentHp}
            onChange={(e) => handleChange('currentHp', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-slate-300 rounded-md bg-white text-slate-900"
          />
          {errors.currentHp && (
            <p className="text-red-600 text-sm mt-1">{errors.currentHp}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2 text-slate-700">Avatar</label>
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
              <p className="text-sm text-slate-600">Auto-generated avatar</p>
            </div>
          ) : null}

          {/* Image Upload */}
          <div>
            <label
              htmlFor="imageUpload"
              className="inline-block bg-slate-100 px-4 py-2 rounded-md text-sm text-slate-700 cursor-pointer hover:bg-slate-200"
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
            <p className="text-xs text-slate-500 mt-1">JPEG, PNG, GIF, or WebP (max 2MB)</p>
          </div>

          {/* Avatar Seed (for generated avatars) */}
          <div>
            <label htmlFor="avatarSeed" className="block text-sm mb-1 text-slate-700">
              Or use seed for generated avatar
            </label>
            <input
              id="avatarSeed"
              type="text"
              value={formData.avatarSeed}
              onChange={(e) => handleChange('avatarSeed', e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-md bg-white text-slate-900 placeholder-slate-400"
              placeholder="Leave blank to use character name"
            />
            <p className="text-xs text-slate-500 mt-1">
              Optional: Any text generates a unique avatar (defaults to character name)
            </p>
          </div>
        </div>
      </div>

      <div className="flex gap-2 pt-4">
        <button
          type="submit"
          className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 font-medium"
        >
          {character ? 'Update Character' : 'Create Character'}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="flex-1 bg-slate-200 text-slate-800 px-4 py-2 rounded-md hover:bg-slate-300 font-medium"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
