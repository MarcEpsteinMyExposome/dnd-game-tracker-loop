/**
 * Characters Page
 *
 * Main page for character management.
 * Accessible at /characters route.
 */

import { CharacterList } from '@/components/characters/CharacterList'

export default function CharactersPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-stone-950 via-sky-950/50 to-stone-950 relative">
      {/* Atmospheric background elements */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-1/4 left-1/3 w-64 h-64 bg-sky-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-48 h-48 bg-purple-600/20 rounded-full blur-2xl" />
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="mb-8 text-center">
            <h1 className="text-5xl font-bold mb-3">
              <span className="mr-2">🤠</span>
              <span className="bg-gradient-to-r from-sky-300 via-blue-400 to-sky-300 bg-clip-text text-transparent">
                Posse Management
              </span>
            </h1>
            <p className="text-amber-200/80 text-lg">
              Create and manage your posse. Track HP, conditions, and more.
            </p>
          </div>

          {/* Character List */}
          <CharacterList />
        </div>
      </div>
    </main>
  )
}
