import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-950 via-amber-950/80 to-stone-950 relative overflow-hidden">
      {/* Atmospheric dust particles effect */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-600/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-orange-500/10 rounded-full blur-2xl" />
      </div>

      <div className="container mx-auto px-6 py-20 relative z-10">
        <div className="text-center mb-16">
          <h1 className="text-7xl font-black mb-4 tracking-tight">
            <span className="text-5xl mr-3">🔫</span>
            <span className="bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-300 bg-clip-text text-transparent drop-shadow-lg">
              Bang Your Dead
            </span>
          </h1>
          <p className="text-amber-200/80 text-3xl mb-2 font-light tracking-wide">v3</p>
          <p className="text-purple-300 text-lg flex items-center justify-center gap-2">
            <span>✨</span>
            Western Gun & Magic Combat Tracker
            <span>✨</span>
          </p>
        </div>

        {/* Status Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6 max-w-7xl mx-auto mb-16">
          {/* Iteration 5 Status */}
          <div className="bg-gradient-to-br from-green-900/40 to-emerald-900/30 border-2 border-green-600/40 rounded-xl p-6 shadow-2xl backdrop-blur-sm hover:border-green-500/60 transition-all hover:shadow-green-900/20">
            <h2 className="text-xl font-bold text-green-300 mb-3">
              ✅ Dice Ready
            </h2>
            <p className="text-green-100 mb-3 font-semibold text-sm">
              Initiative & Dice Rolling
            </p>
            <ul className="space-y-1 text-xs text-green-100/80">
              <li>✓ Full dice roller (d4-d100)</li>
              <li>✓ Custom notation (2d6+3)</li>
              <li>✓ Initiative rolling (d20+DEX)</li>
              <li>✓ Roll history tracking</li>
              <li>✓ 1009 tests passing</li>
            </ul>
            <Link
              href="/combat"
              className="mt-4 block w-full bg-gradient-to-r from-green-700 to-emerald-600 hover:from-green-600 hover:to-emerald-500 text-white font-bold py-2 px-4 rounded-lg text-center transition-all shadow-lg text-sm border border-green-500/30"
            >
              🎲 Roll Dice →
            </Link>
          </div>

          {/* Iteration 4 Status */}
          <div className="bg-gradient-to-br from-amber-900/40 to-orange-900/30 border-2 border-amber-600/40 rounded-xl p-6 shadow-2xl backdrop-blur-sm hover:border-amber-500/60 transition-all hover:shadow-amber-900/20">
            <h2 className="text-xl font-bold text-amber-300 mb-3">
              ✅ Saloon Ready
            </h2>
            <p className="text-amber-100 mb-3 font-semibold text-sm">
              Persistence & Outlaw Library
            </p>
            <ul className="space-y-1 text-xs text-amber-100/80">
              <li>✓ LocalStorage persistence</li>
              <li>✓ Export/Import JSON backups</li>
              <li>✓ 15 pre-defined outlaws</li>
              <li>✓ Quick Encounter presets</li>
            </ul>
            <Link
              href="/monsters"
              className="mt-4 block w-full bg-gradient-to-r from-amber-700 to-orange-600 hover:from-amber-600 hover:to-orange-500 text-white font-bold py-2 px-4 rounded-lg text-center transition-all shadow-lg text-sm border border-amber-500/30"
            >
              🦂 Outlaw Bounties →
            </Link>
          </div>

          {/* Iteration 3 Status */}
          <div className="bg-gradient-to-br from-red-900/40 to-rose-900/30 border-2 border-red-600/40 rounded-xl p-6 shadow-2xl backdrop-blur-sm hover:border-red-500/60 transition-all hover:shadow-red-900/20">
            <h2 className="text-xl font-bold text-red-300 mb-3">
              ✅ Showdown Ready
            </h2>
            <p className="text-red-100 mb-3 font-semibold text-sm">
              Dashboard & Combat Tracker
            </p>
            <ul className="space-y-1 text-xs text-red-100/80">
              <li>✓ Posse statistics dashboard</li>
              <li>✓ Initiative-based combat tracker</li>
              <li>✓ Turn management & round counter</li>
              <li>✓ HP tracking during shootouts</li>
            </ul>
            <Link
              href="/combat"
              className="mt-4 block w-full bg-gradient-to-r from-red-700 to-rose-600 hover:from-red-600 hover:to-rose-500 text-white font-bold py-2 px-4 rounded-lg text-center transition-all shadow-lg text-sm border border-red-500/30"
            >
              💥 Combat Tracker →
            </Link>
          </div>

          {/* Iteration 2 Status */}
          <div className="bg-gradient-to-br from-sky-900/40 to-blue-900/30 border-2 border-sky-600/40 rounded-xl p-6 shadow-2xl backdrop-blur-sm hover:border-sky-500/60 transition-all hover:shadow-sky-900/20">
            <h2 className="text-xl font-bold text-sky-300 mb-3">
              ✅ Deputies Ready
            </h2>
            <p className="text-sky-100 mb-3 font-semibold text-sm">
              Character Management & Conditions
            </p>
            <ul className="space-y-1 text-xs text-sky-100/80">
              <li>✓ Character CRUD operations</li>
              <li>✓ HP tracking with visual feedback</li>
              <li>✓ Avatar system (DiceBear + uploads)</li>
              <li>✓ 7 status conditions with tooltips</li>
            </ul>
            <Link
              href="/characters"
              className="mt-4 block w-full bg-gradient-to-r from-sky-700 to-blue-600 hover:from-sky-600 hover:to-blue-500 text-white font-bold py-2 px-4 rounded-lg text-center transition-all shadow-lg text-sm border border-sky-500/30"
            >
              🤠 Manage Posse →
            </Link>
          </div>

          {/* Iteration 1 Status */}
          <div className="bg-gradient-to-br from-purple-900/40 to-violet-900/30 border-2 border-purple-500/40 rounded-xl p-6 shadow-2xl backdrop-blur-sm hover:border-purple-400/60 transition-all hover:shadow-purple-900/20">
            <h2 className="text-xl font-bold text-purple-300 mb-3">
              ✅ Magic Foundation
            </h2>
            <p className="text-purple-100 mb-3 font-semibold text-sm">
              Foundation & Data Models
            </p>
            <ul className="space-y-1 text-xs text-purple-100/80">
              <li>✓ Testing infrastructure (Jest)</li>
              <li>✓ State management (Zustand)</li>
              <li>✓ Validation (Zod schemas)</li>
              <li>✓ Data models & mock factories</li>
            </ul>
            <Link
              href="/dashboard"
              className="mt-4 block w-full bg-gradient-to-r from-purple-700 to-violet-600 hover:from-purple-600 hover:to-violet-500 text-white font-bold py-2 px-4 rounded-lg text-center transition-all shadow-lg text-sm border border-purple-500/30"
            >
              ✨ View Dashboard →
            </Link>
          </div>
        </div>

        {/* Features Showcase */}
        <div className="max-w-7xl mx-auto">
          <h3 className="text-3xl font-bold text-center mb-8">
            <span className="bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-300 bg-clip-text text-transparent">
              Available Features
            </span>
          </h3>
          <div className="grid md:grid-cols-3 lg:grid-cols-7 gap-4">
            {/* Feature 1 */}
            <div className="bg-stone-900/60 border border-amber-700/30 rounded-lg p-4 hover:border-amber-500/50 hover:bg-stone-900/80 transition-all group">
              <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">🤠</div>
              <h4 className="text-lg font-bold text-amber-200 mb-1">Characters</h4>
              <p className="text-stone-400 text-xs">
                Create and manage your posse with HP, conditions, and avatars.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-stone-900/60 border border-red-700/30 rounded-lg p-4 hover:border-red-500/50 hover:bg-stone-900/80 transition-all group">
              <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">🩹</div>
              <h4 className="text-lg font-bold text-red-200 mb-1">HP Tracking</h4>
              <p className="text-stone-400 text-xs">
                Quick buttons and color-coded visual feedback for health.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-stone-900/60 border border-purple-600/30 rounded-lg p-4 hover:border-purple-400/50 hover:bg-stone-900/80 transition-all group">
              <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">✨</div>
              <h4 className="text-lg font-bold text-purple-200 mb-1">Conditions</h4>
              <p className="text-stone-400 text-xs">
                Track all 7 status conditions with detailed tooltips.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-stone-900/60 border border-orange-600/30 rounded-lg p-4 hover:border-orange-400/50 hover:bg-stone-900/80 transition-all group">
              <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">💥</div>
              <h4 className="text-lg font-bold text-orange-200 mb-1">Combat</h4>
              <p className="text-stone-400 text-xs">
                Initiative-based turn management with auto defeated-skipping.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-stone-900/60 border border-amber-600/30 rounded-lg p-4 hover:border-amber-400/50 hover:bg-stone-900/80 transition-all group">
              <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">🦂</div>
              <h4 className="text-lg font-bold text-amber-200 mb-1">Outlaws</h4>
              <p className="text-stone-400 text-xs">
                15 pre-defined outlaws with Quick Encounter presets.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-stone-900/60 border border-cyan-600/30 rounded-lg p-4 hover:border-cyan-400/50 hover:bg-stone-900/80 transition-all group">
              <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">💾</div>
              <h4 className="text-lg font-bold text-cyan-200 mb-1">Persistence</h4>
              <p className="text-stone-400 text-xs">
                Auto-save to localStorage with export/import backups.
              </p>
            </div>

            {/* Feature 7 */}
            <div className="bg-stone-900/60 border border-green-600/30 rounded-lg p-4 hover:border-green-400/50 hover:bg-stone-900/80 transition-all group">
              <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">🎲</div>
              <h4 className="text-lg font-bold text-green-200 mb-1">Dice Roller</h4>
              <p className="text-stone-400 text-xs">
                Full dice system with d4-d100, custom notation, and roll history.
              </p>
            </div>
          </div>
        </div>

        {/* Next Iteration Teaser */}
        <div className="mt-16 max-w-4xl mx-auto bg-gradient-to-br from-purple-900/50 to-violet-900/40 border-2 border-purple-500/40 rounded-xl p-8 text-center backdrop-blur-sm relative overflow-hidden">
          {/* Magic glow effect */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-purple-500/30 rounded-full blur-3xl" />
          </div>
          <div className="relative z-10">
            <h3 className="text-2xl font-bold text-purple-300 mb-4 flex items-center justify-center gap-2">
              <span>✨</span>
              Coming Next: Iteration 6
              <span>✨</span>
            </h3>
            <p className="text-purple-200 mb-4">To Be Determined</p>
            <p className="text-sm text-purple-100/80">
              Have ideas? The next iteration focus is open for suggestions!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
