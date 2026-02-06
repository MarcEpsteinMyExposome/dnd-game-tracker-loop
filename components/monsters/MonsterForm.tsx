'use client'

/**
 * Monster Form Component
 *
 * Form for creating or editing custom monsters/outlaws.
 * Includes validation, abilities editor, and image upload.
 */

import { useState } from 'react'
import {
  Monster,
  CreateMonster,
  CreateMonsterSchema,
  MonsterAbility,
  MonsterTypeEnum,
  defaultMonster,
} from '@/lib/schemas/monster.schema'
import { useGameStore } from '@/lib/store/gameStore'
import { fileToBase64, validateImageFile, getAvatarUrl } from '@/lib/utils/avatar'

interface MonsterFormProps {
  monster?: Monster // If provided, form is in edit mode
  onClose: () => void
  onSuccess?: () => void
}

const MONSTER_TYPES = MonsterTypeEnum.options
const SIZE_OPTIONS = ['Tiny', 'Small', 'Medium', 'Large', 'Huge', 'Gargantuan'] as const

export function MonsterForm({ monster, onClose, onSuccess }: MonsterFormProps) {
  const addMonster = useGameStore((state) => state.addMonster)
  const updateMonster = useGameStore((state) => state.updateMonster)

  const [formData, setFormData] = useState<Partial<CreateMonster>>({
    name: monster?.name || '',
    type: monster?.type || defaultMonster.type,
    armorClass: monster?.armorClass || defaultMonster.armorClass,
    hitPoints: monster?.hitPoints || defaultMonster.hitPoints,
    damage: monster?.damage || defaultMonster.damage,
    abilities: monster?.abilities || [],
    challenge: monster?.challenge ?? defaultMonster.challenge,
    size: monster?.size || defaultMonster.size,
    speed: monster?.speed || defaultMonster.speed,
    description: monster?.description || '',
    avatarSeed: monster?.avatarSeed || '',
    imageUrl: monster?.imageUrl,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [imagePreview, setImagePreview] = useState<string | undefined>(monster?.imageUrl)
  const [imageError, setImageError] = useState<string | undefined>()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form data
    const result = CreateMonsterSchema.safeParse(formData)

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

    // Submit monster
    if (monster) {
      // Edit mode
      updateMonster({
        id: monster.id,
        ...result.data,
      })
    } else {
      // Create mode
      addMonster(result.data)
    }

    onSuccess?.()
    onClose()
  }

  const handleChange = (field: keyof CreateMonster, value: string | number | MonsterAbility[]) => {
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

    setImageError(undefined)

    const validation = validateImageFile(file)
    if (!validation.isValid) {
      setImageError(validation.error)
      return
    }

    try {
      const base64 = await fileToBase64(file)
      setFormData((prev) => ({ ...prev, imageUrl: base64 }))
      setImagePreview(base64)
    } catch {
      setImageError('Failed to upload image. Please try again.')
    }
  }

  const handleRemoveImage = () => {
    setFormData((prev) => ({ ...prev, imageUrl: undefined }))
    setImagePreview(undefined)
    setImageError(undefined)
  }

  // Abilities management
  const addAbility = () => {
    const newAbility: MonsterAbility = {
      name: '',
      description: '',
    }
    handleChange('abilities', [...(formData.abilities || []), newAbility])
  }

  const updateAbility = (index: number, field: keyof MonsterAbility, value: string) => {
    const abilities = [...(formData.abilities || [])]
    abilities[index] = { ...abilities[index], [field]: value }
    handleChange('abilities', abilities)
  }

  const removeAbility = (index: number) => {
    const abilities = (formData.abilities || []).filter((_, i) => i !== index)
    handleChange('abilities', abilities)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
      {/* Name */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-1 text-amber-200">
          Name *
        </label>
        <input
          id="name"
          type="text"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          className="w-full px-3 py-2 border border-stone-600 rounded-md bg-stone-800 text-amber-100 placeholder-stone-500"
          placeholder="Outlaw name"
        />
        {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
      </div>

      {/* Type and Size */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="type" className="block text-sm font-medium mb-1 text-amber-200">
            Type *
          </label>
          <select
            id="type"
            value={formData.type}
            onChange={(e) => handleChange('type', e.target.value)}
            className="w-full px-3 py-2 border border-stone-600 rounded-md bg-stone-800 text-amber-100"
          >
            {MONSTER_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="size" className="block text-sm font-medium mb-1 text-amber-200">
            Size *
          </label>
          <select
            id="size"
            value={formData.size}
            onChange={(e) => handleChange('size', e.target.value)}
            className="w-full px-3 py-2 border border-stone-600 rounded-md bg-stone-800 text-amber-100"
          >
            {SIZE_OPTIONS.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Stats Row 1: AC, HP, Speed */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label htmlFor="armorClass" className="block text-sm font-medium mb-1 text-amber-200">
            Armor Class *
          </label>
          <input
            id="armorClass"
            type="number"
            min="1"
            max="30"
            value={formData.armorClass}
            onChange={(e) => handleChange('armorClass', parseInt(e.target.value) || 1)}
            className="w-full px-3 py-2 border border-stone-600 rounded-md bg-stone-800 text-amber-100"
          />
          {errors.armorClass && <p className="text-red-400 text-sm mt-1">{errors.armorClass}</p>}
        </div>

        <div>
          <label htmlFor="hitPoints" className="block text-sm font-medium mb-1 text-amber-200">
            Hit Points *
          </label>
          <input
            id="hitPoints"
            type="number"
            min="1"
            max="999"
            value={formData.hitPoints}
            onChange={(e) => handleChange('hitPoints', parseInt(e.target.value) || 1)}
            className="w-full px-3 py-2 border border-stone-600 rounded-md bg-stone-800 text-amber-100"
          />
          {errors.hitPoints && <p className="text-red-400 text-sm mt-1">{errors.hitPoints}</p>}
        </div>

        <div>
          <label htmlFor="speed" className="block text-sm font-medium mb-1 text-amber-200">
            Speed (ft)
          </label>
          <input
            id="speed"
            type="number"
            min="0"
            max="200"
            value={formData.speed}
            onChange={(e) => handleChange('speed', parseInt(e.target.value) || 0)}
            className="w-full px-3 py-2 border border-stone-600 rounded-md bg-stone-800 text-amber-100"
          />
        </div>
      </div>

      {/* Stats Row 2: Damage, Challenge */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="damage" className="block text-sm font-medium mb-1 text-amber-200">
            Damage *
          </label>
          <input
            id="damage"
            type="text"
            value={formData.damage}
            onChange={(e) => handleChange('damage', e.target.value)}
            className="w-full px-3 py-2 border border-stone-600 rounded-md bg-stone-800 text-amber-100 placeholder-stone-500"
            placeholder="e.g., 2d6+3"
          />
          {errors.damage && <p className="text-red-400 text-sm mt-1">{errors.damage}</p>}
        </div>

        <div>
          <label htmlFor="challenge" className="block text-sm font-medium mb-1 text-amber-200">
            Challenge Rating
          </label>
          <input
            id="challenge"
            type="number"
            min="0"
            max="30"
            step="0.25"
            value={formData.challenge}
            onChange={(e) => handleChange('challenge', parseFloat(e.target.value) || 0)}
            className="w-full px-3 py-2 border border-stone-600 rounded-md bg-stone-800 text-amber-100"
          />
        </div>
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium mb-1 text-amber-200">
          Description
        </label>
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          rows={2}
          className="w-full px-3 py-2 border border-stone-600 rounded-md bg-stone-800 text-amber-100 placeholder-stone-500"
          placeholder="Optional lore or description..."
        />
      </div>

      {/* Abilities Section */}
      <div className="border border-stone-600 rounded-lg p-3 bg-stone-900/50">
        <div className="flex justify-between items-center mb-3">
          <label className="text-sm font-medium text-amber-200">Special Abilities</label>
          <button
            type="button"
            onClick={addAbility}
            className="text-sm px-3 py-1 bg-purple-700 text-white rounded hover:bg-purple-600 transition-colors"
          >
            + Add Ability
          </button>
        </div>

        {(formData.abilities || []).length === 0 ? (
          <p className="text-stone-500 text-sm italic">No abilities added yet</p>
        ) : (
          <div className="space-y-3">
            {(formData.abilities || []).map((ability, index) => (
              <div key={index} className="border border-stone-700 rounded p-3 bg-stone-800/50">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs text-stone-400">Ability {index + 1}</span>
                  <button
                    type="button"
                    onClick={() => removeAbility(index)}
                    className="text-red-400 text-xs hover:text-red-300"
                  >
                    Remove
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-2">
                  <input
                    type="text"
                    value={ability.name}
                    onChange={(e) => updateAbility(index, 'name', e.target.value)}
                    className="px-2 py-1 border border-stone-600 rounded bg-stone-700 text-amber-100 text-sm placeholder-stone-500"
                    placeholder="Ability name *"
                  />
                  <input
                    type="text"
                    value={ability.usage || ''}
                    onChange={(e) => updateAbility(index, 'usage', e.target.value)}
                    className="px-2 py-1 border border-stone-600 rounded bg-stone-700 text-amber-100 text-sm placeholder-stone-500"
                    placeholder="Usage (e.g., 1/Day)"
                  />
                </div>

                <textarea
                  value={ability.description}
                  onChange={(e) => updateAbility(index, 'description', e.target.value)}
                  rows={2}
                  className="w-full px-2 py-1 border border-stone-600 rounded bg-stone-700 text-amber-100 text-sm placeholder-stone-500 mb-2"
                  placeholder="Description *"
                />

                <input
                  type="text"
                  value={ability.damage || ''}
                  onChange={(e) => updateAbility(index, 'damage', e.target.value)}
                  className="w-full px-2 py-1 border border-stone-600 rounded bg-stone-700 text-amber-100 text-sm placeholder-stone-500"
                  placeholder="Damage (e.g., 2d6+3) - optional"
                />
              </div>
            ))}
          </div>
        )}
        {errors['abilities.0.name'] && (
          <p className="text-red-400 text-sm mt-2">Ability name is required</p>
        )}
        {errors['abilities.0.description'] && (
          <p className="text-red-400 text-sm mt-2">Ability description is required</p>
        )}
      </div>

      {/* Avatar Section */}
      <div className="border border-stone-600 rounded-lg p-3 bg-stone-900/50">
        <label className="block text-sm font-medium mb-2 text-amber-200">Avatar</label>
        <div className="space-y-3">
          {imagePreview ? (
            <div className="flex items-center gap-3">
              <img
                src={imagePreview}
                alt="Avatar preview"
                className="w-16 h-16 rounded-full object-cover border-2 border-amber-600"
              />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="text-red-400 text-sm hover:text-red-300"
              >
                Remove Image
              </button>
            </div>
          ) : formData.avatarSeed || formData.name ? (
            <div className="flex items-center gap-3">
              <img
                src={getAvatarUrl(formData.avatarSeed || formData.name || 'monster')}
                alt="Generated avatar"
                className="w-16 h-16 rounded-full border-2 border-amber-600"
              />
              <p className="text-sm text-stone-400">Auto-generated avatar</p>
            </div>
          ) : null}

          <div>
            <label
              htmlFor="imageUpload"
              className="inline-block bg-stone-700 px-4 py-2 rounded-md text-sm text-amber-200 cursor-pointer hover:bg-stone-600"
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
            {imageError && <p className="text-red-400 text-sm mt-1">{imageError}</p>}
          </div>

          <div>
            <input
              id="avatarSeed"
              type="text"
              value={formData.avatarSeed}
              onChange={(e) => handleChange('avatarSeed', e.target.value)}
              className="w-full px-3 py-2 border border-stone-600 rounded-md bg-stone-800 text-amber-100 placeholder-stone-500"
              placeholder="Avatar seed (defaults to name)"
            />
          </div>
        </div>
      </div>

      {/* Submit Buttons */}
      <div className="flex gap-2 pt-4 sticky bottom-0 bg-stone-900 py-3 -mb-4">
        <button
          type="submit"
          className="flex-1 bg-gradient-to-r from-amber-600 to-orange-600 text-white px-4 py-2 rounded-md hover:from-amber-500 hover:to-orange-500 font-semibold border border-amber-500/30"
        >
          {monster ? 'Update Outlaw' : 'Create Outlaw'}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="flex-1 bg-stone-700 text-stone-200 px-4 py-2 rounded-md hover:bg-stone-600 font-medium border border-stone-500/30"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
