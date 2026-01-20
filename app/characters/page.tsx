/**
 * Characters Page
 *
 * Main page for character management.
 * Accessible at /characters route.
 */

import { CharacterList } from '@/components/characters/CharacterList'

export default function CharactersPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Character Management</h1>
          <p className="text-gray-600">
            Create and manage your D&D characters. Track HP, conditions, and more.
          </p>
        </div>

        {/* Character List */}
        <CharacterList />
      </div>
    </main>
  )
}
