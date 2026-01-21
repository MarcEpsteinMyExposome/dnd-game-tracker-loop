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
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16">
          {/* Iteration 2 Status */}
          <div className="bg-green-900 bg-opacity-30 border-2 border-green-500 border-opacity-50 rounded-xl p-8 shadow-2xl">
            <h2 className="text-2xl font-bold text-green-400 mb-4">
              ✅ Iteration 2 Complete
            </h2>
            <p className="text-green-200 mb-4 font-semibold">
              Character Management & Conditions System
            </p>
            <ul className="space-y-2 text-sm text-green-100">
              <li>✓ Character CRUD operations</li>
              <li>✓ HP tracking with visual feedback</li>
              <li>✓ Avatar system (DiceBear + uploads)</li>
              <li>✓ 7 D&D conditions with tooltips</li>
              <li>✓ 274 tests passing</li>
            </ul>
            <Link
              href="/characters"
              className="mt-6 block w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg text-center transition-colors shadow-lg"
            >
              Manage Characters →
            </Link>
          </div>

          {/* Iteration 1 Status */}
          <div className="bg-blue-900 bg-opacity-30 border-2 border-blue-500 border-opacity-50 rounded-xl p-8 shadow-2xl">
            <h2 className="text-2xl font-bold text-blue-400 mb-4">
              ✅ Iteration 1 Complete
            </h2>
            <p className="text-blue-200 mb-4 font-semibold">
              Foundation & Data Models
            </p>
            <ul className="space-y-2 text-sm text-blue-100">
              <li>✓ Testing infrastructure (Jest)</li>
              <li>✓ State management (Zustand)</li>
              <li>✓ Validation (Zod schemas)</li>
              <li>✓ Data models (Character, Monster, etc.)</li>
              <li>✓ 244 schema tests</li>
            </ul>
          </div>
        </div>

        {/* Features Showcase */}
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold text-center text-amber-400 mb-8">
            Available Features
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="bg-slate-800 bg-opacity-50 border border-purple-500 border-opacity-30 rounded-lg p-6 hover:border-opacity-60 transition-colors">
              <div className="text-4xl mb-4">⚔️</div>
              <h4 className="text-xl font-bold text-purple-300 mb-2">Characters</h4>
              <p className="text-slate-400 text-sm">
                Create and manage your D&D characters with HP tracking, conditions, and custom avatars.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-slate-800 bg-opacity-50 border border-amber-500 border-opacity-30 rounded-lg p-6 hover:border-opacity-60 transition-colors">
              <div className="text-4xl mb-4">🩹</div>
              <h4 className="text-xl font-bold text-amber-300 mb-2">HP Tracking</h4>
              <p className="text-slate-400 text-sm">
                Quick adjustment buttons and direct input with color-coded visual feedback.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-slate-800 bg-opacity-50 border border-green-500 border-opacity-30 rounded-lg p-6 hover:border-opacity-60 transition-colors">
              <div className="text-4xl mb-4">🌟</div>
              <h4 className="text-xl font-bold text-green-300 mb-2">Conditions</h4>
              <p className="text-slate-400 text-sm">
                Track all 7 D&D conditions with detailed tooltips and mechanical effects.
              </p>
            </div>
          </div>
        </div>

        {/* Next Iteration Teaser */}
        <div className="mt-16 max-w-4xl mx-auto bg-orange-900 bg-opacity-30 border-2 border-orange-500 border-opacity-50 rounded-xl p-8 text-center">
          <h3 className="text-2xl font-bold text-orange-400 mb-4">
            🚀 Coming Next: Iteration 3
          </h3>
          <p className="text-orange-200 mb-4">Combat Tracker System</p>
          <ul className="text-sm text-orange-100 space-y-1">
            <li>Initiative tracking</li>
            <li>Turn management</li>
            <li>Combat encounter management</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
