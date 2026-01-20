export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
      <div className="max-w-4xl mx-auto px-6 py-12 text-center">
        <h1 className="text-5xl font-bold text-amber-400 mb-4">
          🎲 D&D Game Tracker Loop v2.0
        </h1>
        <p className="text-slate-300 text-xl mb-8">
          Built using the RALPH Loop Methodology
        </p>
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-8">
          <h2 className="text-2xl font-semibold text-amber-300 mb-4">
            Project Status: DEFINE Phase Complete ✅
          </h2>
          <p className="text-slate-400 mb-4">
            Next steps: Create FUNCTIONS.md and begin Loop Iteration 1
          </p>
          <div className="text-left mt-6 space-y-2 text-sm text-slate-300">
            <p>📋 <strong>DEFINE.md</strong> - Project requirements documented</p>
            <p>⏳ <strong>FUNCTIONS.md</strong> - Coming next</p>
            <p>⏳ <strong>TASKS.md</strong> - Coming next</p>
            <p>⏳ <strong>PROGRESS.md</strong> - Coming next</p>
          </div>
        </div>
      </div>
    </div>
  );
}
