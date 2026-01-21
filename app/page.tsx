import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold text-amber-400 mb-4">
            🎲 D&D Game Tracker
          </h1>
          <p className="text-slate-300 text-2xl mb-2">Loop Iteration v2.0</p>
          <p className="text-purple-300 text-lg">
            Built using the RALPH Loop Methodology
          </p>
        </div>

        {/* Status Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto mb-16">
          {/* Iteration 4 Status */}
          <div className="bg-orange-900/30 border-2 border-orange-500/50 rounded-xl p-6 shadow-2xl">
            <h2 className="text-xl font-bold text-orange-400 mb-3">
              ✅ Iteration 4 Complete
            </h2>
            <p className="text-orange-200 mb-3 font-semibold text-sm">
              Persistence & Monster Library
            </p>
            <ul className="space-y-1 text-xs text-orange-100">
              <li>✓ LocalStorage persistence</li>
              <li>✓ Export/Import JSON backups</li>
              <li>✓ 15 pre-defined monsters</li>
              <li>✓ Quick Encounter presets</li>
              <li>✓ 805 tests passing</li>
            </ul>
            <Link
              href="/monsters"
              className="mt-4 block w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded-lg text-center transition-colors shadow-lg text-sm"
            >
              Monster Library →
            </Link>
          </div>

          {/* Iteration 3 Status */}
          <div className="bg-green-900/30 border-2 border-green-500/50 rounded-xl p-6 shadow-2xl">
            <h2 className="text-xl font-bold text-green-400 mb-3">
              ✅ Iteration 3 Complete
            </h2>
            <p className="text-green-200 mb-3 font-semibold text-sm">
              Dashboard & Combat Tracker
            </p>
            <ul className="space-y-1 text-xs text-green-100">
              <li>✓ Team statistics dashboard</li>
              <li>✓ Initiative-based combat tracker</li>
              <li>✓ Turn management & round counter</li>
              <li>✓ HP tracking during combat</li>
            </ul>
            <Link
              href="/combat"
              className="mt-4 block w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg text-center transition-colors shadow-lg text-sm"
            >
              Combat Tracker →
            </Link>
          </div>

          {/* Iteration 2 Status */}
          <div className="bg-blue-900/30 border-2 border-blue-500/50 rounded-xl p-6 shadow-2xl">
            <h2 className="text-xl font-bold text-blue-400 mb-3">
              ✅ Iteration 2 Complete
            </h2>
            <p className="text-blue-200 mb-3 font-semibold text-sm">
              Character Management & Conditions
            </p>
            <ul className="space-y-1 text-xs text-blue-100">
              <li>✓ Character CRUD operations</li>
              <li>✓ HP tracking with visual feedback</li>
              <li>✓ Avatar system (DiceBear + uploads)</li>
              <li>✓ 7 D&D conditions with tooltips</li>
            </ul>
            <Link
              href="/characters"
              className="mt-4 block w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg text-center transition-colors shadow-lg text-sm"
            >
              Manage Characters →
            </Link>
          </div>

          {/* Iteration 1 Status */}
          <div className="bg-purple-900/30 border-2 border-purple-500/50 rounded-xl p-6 shadow-2xl">
            <h2 className="text-xl font-bold text-purple-400 mb-3">
              ✅ Iteration 1 Complete
            </h2>
            <p className="text-purple-200 mb-3 font-semibold text-sm">
              Foundation & Data Models
            </p>
            <ul className="space-y-1 text-xs text-purple-100">
              <li>✓ Testing infrastructure (Jest)</li>
              <li>✓ State management (Zustand)</li>
              <li>✓ Validation (Zod schemas)</li>
              <li>✓ Data models & mock factories</li>
            </ul>
            <Link
              href="/dashboard"
              className="mt-4 block w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg text-center transition-colors shadow-lg text-sm"
            >
              View Dashboard →
            </Link>
          </div>
        </div>

        {/* Features Showcase */}
        <div className="max-w-7xl mx-auto">
          <h3 className="text-3xl font-bold text-center text-amber-400 mb-8">
            Available Features
          </h3>
          <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4">
            {/* Feature 1 */}
            <div className="bg-slate-800/50 border border-purple-500/30 rounded-lg p-4 hover:border-purple-500/60 transition-colors">
              <div className="text-3xl mb-2">👥</div>
              <h4 className="text-lg font-bold text-purple-300 mb-1">Characters</h4>
              <p className="text-slate-400 text-xs">
                Create and manage D&D characters with HP, conditions, and avatars.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-slate-800/50 border border-amber-500/30 rounded-lg p-4 hover:border-amber-500/60 transition-colors">
              <div className="text-3xl mb-2">🩹</div>
              <h4 className="text-lg font-bold text-amber-300 mb-1">HP Tracking</h4>
              <p className="text-slate-400 text-xs">
                Quick buttons and color-coded visual feedback for health management.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-slate-800/50 border border-green-500/30 rounded-lg p-4 hover:border-green-500/60 transition-colors">
              <div className="text-3xl mb-2">🌟</div>
              <h4 className="text-lg font-bold text-green-300 mb-1">Conditions</h4>
              <p className="text-slate-400 text-xs">
                Track all 7 D&D conditions with detailed tooltips and effects.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-slate-800/50 border border-red-500/30 rounded-lg p-4 hover:border-red-500/60 transition-colors">
              <div className="text-3xl mb-2">⚔️</div>
              <h4 className="text-lg font-bold text-red-300 mb-1">Combat</h4>
              <p className="text-slate-400 text-xs">
                Initiative-based turn management with auto defeated-skipping.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-slate-800/50 border border-orange-500/30 rounded-lg p-4 hover:border-orange-500/60 transition-colors">
              <div className="text-3xl mb-2">🐉</div>
              <h4 className="text-lg font-bold text-orange-300 mb-1">Monsters</h4>
              <p className="text-slate-400 text-xs">
                15 pre-defined monsters with Quick Encounter presets.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-slate-800/50 border border-cyan-500/30 rounded-lg p-4 hover:border-cyan-500/60 transition-colors">
              <div className="text-3xl mb-2">💾</div>
              <h4 className="text-lg font-bold text-cyan-300 mb-1">Persistence</h4>
              <p className="text-slate-400 text-xs">
                Auto-save to localStorage with export/import JSON backups.
              </p>
            </div>
          </div>
        </div>

        {/* Next Iteration Teaser */}
        <div className="mt-16 max-w-4xl mx-auto bg-pink-900/30 border-2 border-pink-500/50 rounded-xl p-8 text-center">
          <h3 className="text-2xl font-bold text-pink-400 mb-4">
            🚀 Coming Next: Iteration 5
          </h3>
          <p className="text-pink-200 mb-4">Enhanced Combat - Initiative System & Dice Rolling</p>
          <ul className="text-sm text-pink-100 space-y-1">
            <li>True initiative rolling (dice-based, not AC placeholder)</li>
            <li>D20 dice rolling system with modifiers</li>
            <li>Attack and damage roll integration</li>
            <li>Saving throw support</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
