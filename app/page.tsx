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
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
          {/* Iteration 3 Status */}
          <div className="bg-green-900/30 border-2 border-green-500/50 rounded-xl p-8 shadow-2xl">
            <h2 className="text-2xl font-bold text-green-400 mb-4">
              ✅ Iteration 3 Complete
            </h2>
            <p className="text-green-200 mb-4 font-semibold">
              Dashboard & Combat Tracker
            </p>
            <ul className="space-y-2 text-sm text-green-100">
              <li>✓ Team statistics dashboard</li>
              <li>✓ Initiative-based combat tracker</li>
              <li>✓ Turn management & round counter</li>
              <li>✓ HP tracking during combat</li>
              <li>✓ 435 tests passing</li>
            </ul>
            <Link
              href="/combat"
              className="mt-6 block w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg text-center transition-colors shadow-lg"
            >
              Combat Tracker →
            </Link>
          </div>

          {/* Iteration 2 Status */}
          <div className="bg-blue-900/30 border-2 border-blue-500/50 rounded-xl p-8 shadow-2xl">
            <h2 className="text-2xl font-bold text-blue-400 mb-4">
              ✅ Iteration 2 Complete
            </h2>
            <p className="text-blue-200 mb-4 font-semibold">
              Character Management & Conditions
            </p>
            <ul className="space-y-2 text-sm text-blue-100">
              <li>✓ Character CRUD operations</li>
              <li>✓ HP tracking with visual feedback</li>
              <li>✓ Avatar system (DiceBear + uploads)</li>
              <li>✓ 7 D&D conditions with tooltips</li>
            </ul>
            <Link
              href="/characters"
              className="mt-6 block w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg text-center transition-colors shadow-lg"
            >
              Manage Characters →
            </Link>
          </div>

          {/* Iteration 1 Status */}
          <div className="bg-purple-900/30 border-2 border-purple-500/50 rounded-xl p-8 shadow-2xl">
            <h2 className="text-2xl font-bold text-purple-400 mb-4">
              ✅ Iteration 1 Complete
            </h2>
            <p className="text-purple-200 mb-4 font-semibold">
              Foundation & Data Models
            </p>
            <ul className="space-y-2 text-sm text-purple-100">
              <li>✓ Testing infrastructure (Jest)</li>
              <li>✓ State management (Zustand)</li>
              <li>✓ Validation (Zod schemas)</li>
              <li>✓ Data models & mock factories</li>
            </ul>
            <Link
              href="/dashboard"
              className="mt-6 block w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg text-center transition-colors shadow-lg"
            >
              View Dashboard →
            </Link>
          </div>
        </div>

        {/* Features Showcase */}
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold text-center text-amber-400 mb-8">
            Available Features
          </h3>
          <div className="grid md:grid-cols-4 gap-6">
            {/* Feature 1 */}
            <div className="bg-slate-800/50 border border-purple-500/30 rounded-lg p-6 hover:border-purple-500/60 transition-colors">
              <div className="text-4xl mb-4">⚔️</div>
              <h4 className="text-xl font-bold text-purple-300 mb-2">Characters</h4>
              <p className="text-slate-400 text-sm">
                Create and manage your D&D characters with HP tracking, conditions, and custom avatars.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-slate-800/50 border border-amber-500/30 rounded-lg p-6 hover:border-amber-500/60 transition-colors">
              <div className="text-4xl mb-4">🩹</div>
              <h4 className="text-xl font-bold text-amber-300 mb-2">HP Tracking</h4>
              <p className="text-slate-400 text-sm">
                Quick adjustment buttons and direct input with color-coded visual feedback.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-slate-800/50 border border-green-500/30 rounded-lg p-6 hover:border-green-500/60 transition-colors">
              <div className="text-4xl mb-4">🌟</div>
              <h4 className="text-xl font-bold text-green-300 mb-2">Conditions</h4>
              <p className="text-slate-400 text-sm">
                Track all 7 D&D conditions with detailed tooltips and mechanical effects.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-slate-800/50 border border-red-500/30 rounded-lg p-6 hover:border-red-500/60 transition-colors">
              <div className="text-4xl mb-4">⚔️</div>
              <h4 className="text-xl font-bold text-red-300 mb-2">Combat</h4>
              <p className="text-slate-400 text-sm">
                Initiative-based combat tracker with turn management and automatic defeated-skipping.
              </p>
            </div>
          </div>
        </div>

        {/* Next Iteration Teaser */}
        <div className="mt-16 max-w-4xl mx-auto bg-orange-900/30 border-2 border-orange-500/50 rounded-xl p-8 text-center">
          <h3 className="text-2xl font-bold text-orange-400 mb-4">
            🚀 Coming Next: Iteration 4
          </h3>
          <p className="text-orange-200 mb-4">Data Persistence & Monster Library</p>
          <ul className="text-sm text-orange-100 space-y-1">
            <li>LocalStorage persistence (save/load state)</li>
            <li>Export/Import JSON backups</li>
            <li>Monster library with pre-defined stat blocks</li>
            <li>Add monsters to combat encounters</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
