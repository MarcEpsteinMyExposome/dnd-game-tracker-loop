/**
 * Avatar Utilities
 *
 * Handles avatar generation and management for characters.
 * Uses DiceBear API for auto-generated avatars based on seed.
 *
 * @see https://www.dicebear.com/styles/adventurer/
 */

/**
 * DiceBear API configuration
 */
const DICEBEAR_BASE_URL = 'https://api.dicebear.com/7.x'
const AVATAR_STYLE = 'adventurer' // Fantasy-themed style for D&D characters
const AVATAR_SIZE = 200 // Default size in pixels

/**
 * Generate avatar URL using DiceBear API
 *
 * Creates a deterministic avatar based on the seed value.
 * The same seed will always generate the same avatar.
 *
 * @param seed - Unique identifier for avatar generation (usually character name or UUID)
 * @param size - Size of the avatar in pixels (default: 200)
 * @returns URL string for the avatar image
 *
 * @example
 * ```typescript
 * const avatarUrl = getAvatarUrl('gandalf')
 * // Returns: https://api.dicebear.com/7.x/adventurer/svg?seed=gandalf&size=200
 * ```
 */
export function getAvatarUrl(seed: string, size: number = AVATAR_SIZE): string {
  if (!seed || seed.trim() === '') {
    // Fallback to random seed if none provided
    seed = 'default'
  }

  // Encode seed to handle special characters
  const encodedSeed = encodeURIComponent(seed)

  return `${DICEBEAR_BASE_URL}/${AVATAR_STYLE}/svg?seed=${encodedSeed}&size=${size}`
}

/**
 * Convert image file to base64 data URL
 *
 * Used for custom image uploads. Converts File to base64 string
 * that can be stored directly in character data.
 *
 * @param file - Image file from input
 * @returns Promise resolving to base64 data URL
 *
 * @example
 * ```typescript
 * const file = event.target.files[0]
 * const base64 = await fileToBase64(file)
 * // Returns: "data:image/png;base64,iVBORw0KGgo..."
 * ```
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result)
      } else {
        reject(new Error('Failed to read file as base64'))
      }
    }

    reader.onerror = () => {
      reject(new Error('Error reading file'))
    }

    reader.readAsDataURL(file)
  })
}

/**
 * Validate image file
 *
 * Checks if file is a valid image type and size.
 *
 * @param file - Image file to validate
 * @param maxSizeMB - Maximum file size in megabytes (default: 2MB)
 * @returns Object with isValid flag and optional error message
 *
 * @example
 * ```typescript
 * const validation = validateImageFile(file)
 * if (!validation.isValid) {
 *   console.error(validation.error)
 * }
 * ```
 */
export function validateImageFile(
  file: File,
  maxSizeMB: number = 2
): { isValid: boolean; error?: string } {
  // Check file type
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
  if (!validTypes.includes(file.type)) {
    return {
      isValid: false,
      error: 'Invalid file type. Please upload a JPEG, PNG, GIF, or WebP image.',
    }
  }

  // Check file size
  const maxSizeBytes = maxSizeMB * 1024 * 1024
  if (file.size > maxSizeBytes) {
    return {
      isValid: false,
      error: `File too large. Maximum size is ${maxSizeMB}MB.`,
    }
  }

  return { isValid: true }
}

/**
 * Get avatar source
 *
 * Returns the appropriate avatar URL based on character data.
 * Priority: imageUrl (custom image) > avatarSeed > fallback
 *
 * @param imageUrl - Base64 image string or URL (optional)
 * @param avatarSeed - Seed for generated avatar (optional)
 * @param fallbackSeed - Fallback seed if others unavailable
 * @returns Avatar URL or data URL
 *
 * @example
 * ```typescript
 * // Custom image
 * getAvatarSource('data:image/png;base64,...', 'gandalf')
 * // Returns: "data:image/png;base64,..."
 *
 * // Generated avatar
 * getAvatarSource(undefined, 'gandalf')
 * // Returns: "https://api.dicebear.com/7.x/adventurer/svg?seed=gandalf..."
 * ```
 */
export function getAvatarSource(
  imageUrl: string | undefined,
  avatarSeed: string | undefined,
  fallbackSeed: string = 'default'
): string {
  // Priority 1: Use custom uploaded image
  if (imageUrl && imageUrl.startsWith('data:image')) {
    return imageUrl
  }

  // Priority 2: Use avatar seed for generated image
  if (avatarSeed) {
    return getAvatarUrl(avatarSeed)
  }

  // Priority 3: Fallback to default seed
  return getAvatarUrl(fallbackSeed)
}
