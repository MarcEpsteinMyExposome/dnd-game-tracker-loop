/**
 * Characters Page
 *
 * Main page for character management.
 * Accessible at /characters route.
 */

import { CharacterList } from '@/components/characters/CharacterList'

export default function CharactersPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="mb-8 text-center">
            <h1 className="text-5xl font-bold text-amber-400 mb-3">
              ⚔️ Character Management
            </h1>
            <p className="text-purple-200 text-lg">
              Create and manage your D&D characters. Track HP, conditions, and more.
            </p>
          </div>

          {/* Character List */}
          <CharacterList />
        </div>
      </div>
    </main>
  )
}
