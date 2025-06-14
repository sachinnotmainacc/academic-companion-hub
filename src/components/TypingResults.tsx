
import { useTypingStore } from '../store/typingStore';

export default function TypingResults() {
  const { stats } = useTypingStore();
  const lastWPM = stats.wpm[stats.wpm.length - 1] || 0;
  const lastRaw = stats.raw[stats.raw.length - 1] || 0;

  return (
    <div className="mt-8">
      {/* Live Stats During Typing */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-dark-800 p-4 rounded-xl shadow-lg border border-dark-700 text-center">
          <div className="text-3xl font-bold text-blue-400 mb-1">{lastWPM}</div>
          <div className="text-sm text-gray-400 uppercase tracking-wide">WPM</div>
        </div>
        
        <div className="bg-dark-800 p-4 rounded-xl shadow-lg border border-dark-700 text-center">
          <div className="text-3xl font-bold text-purple-400 mb-1">{Math.round(stats.accuracy)}%</div>
          <div className="text-sm text-gray-400 uppercase tracking-wide">Accuracy</div>
        </div>

        <div className="bg-dark-800 p-4 rounded-xl shadow-lg border border-dark-700 text-center">
          <div className="text-3xl font-bold text-green-400 mb-1">{lastRaw}</div>
          <div className="text-sm text-gray-400 uppercase tracking-wide">Raw</div>
        </div>

        <div className="bg-dark-800 p-4 rounded-xl shadow-lg border border-dark-700 text-center">
          <div className="text-3xl font-bold text-orange-400 mb-1">{stats.totalErrors}</div>
          <div className="text-sm text-gray-400 uppercase tracking-wide">Errors</div>
        </div>
      </div>
    </div>
  );
}
