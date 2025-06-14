
import { useTypingStore } from '../store/typingStore';
import TypingChart from './TypingChart';

export default function TypingResults() {
  const { stats } = useTypingStore();
  const lastWPM = stats.wpm[stats.wpm.length - 1] || 0;
  const lastRaw = stats.raw[stats.raw.length - 1] || 0;
  const averageWPM = stats.wpm.length > 0
    ? Math.round(stats.wpm.reduce((a, b) => a + b, 0) / stats.wpm.length)
    : 0;

  return (
    <div className="mt-8 space-y-6">
      {/* Main Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-dark-800 p-6 rounded-xl shadow-lg border border-dark-700 text-center">
          <div className="text-4xl font-bold text-blue-400 mb-1">{lastWPM}</div>
          <div className="text-sm text-gray-400 uppercase tracking-wide">WPM</div>
          <div className="text-xs text-gray-500 mt-1">Avg: {averageWPM}</div>
        </div>
        
        <div className="bg-dark-800 p-6 rounded-xl shadow-lg border border-dark-700 text-center">
          <div className="text-4xl font-bold text-purple-400 mb-1">{Math.round(stats.accuracy)}%</div>
          <div className="text-sm text-gray-400 uppercase tracking-wide">Accuracy</div>
          <div className="text-xs text-gray-500 mt-1">Errors: {stats.totalErrors}</div>
        </div>

        <div className="bg-dark-800 p-6 rounded-xl shadow-lg border border-dark-700 text-center">
          <div className="text-4xl font-bold text-green-400 mb-1">{lastRaw}</div>
          <div className="text-sm text-gray-400 uppercase tracking-wide">Raw</div>
          <div className="text-xs text-gray-500 mt-1">Uncorrected</div>
        </div>

        <div className="bg-dark-800 p-6 rounded-xl shadow-lg border border-dark-700 text-center">
          <div className="text-4xl font-bold text-orange-400 mb-1">
            {stats.time !== null ? `${stats.time}s` : '--'}
          </div>
          <div className="text-sm text-gray-400 uppercase tracking-wide">Time</div>
          <div className="text-xs text-gray-500 mt-1">
            {stats.isComplete ? 'Completed' : 'In Progress'}
          </div>
        </div>
      </div>

      {/* Performance Chart */}
      {stats.wpm.length > 0 && <TypingChart />}

      {/* Character Stats */}
      <div className="bg-dark-800 rounded-xl shadow-lg border border-dark-700 p-6">
        <h3 className="text-lg font-semibold mb-6 text-gray-200 flex items-center">
          <span className="w-2 h-2 bg-blue-400 rounded-full mr-3"></span>
          Character Analysis
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400 mb-2">
              {stats.characters.correct}
            </div>
            <div className="text-sm text-gray-400 uppercase tracking-wide">Correct</div>
            <div className="w-full bg-dark-700 rounded-full h-2 mt-2">
              <div 
                className="bg-green-400 h-2 rounded-full transition-all duration-300"
                style={{ 
                  width: `${Math.min(100, (stats.characters.correct / Math.max(1, stats.characters.correct + stats.characters.incorrect)) * 100)}%` 
                }}
              ></div>
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-red-400 mb-2">
              {stats.characters.incorrect}
            </div>
            <div className="text-sm text-gray-400 uppercase tracking-wide">Incorrect</div>
            <div className="w-full bg-dark-700 rounded-full h-2 mt-2">
              <div 
                className="bg-red-400 h-2 rounded-full transition-all duration-300"
                style={{ 
                  width: `${Math.min(100, (stats.characters.incorrect / Math.max(1, stats.characters.correct + stats.characters.incorrect)) * 100)}%` 
                }}
              ></div>
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-400 mb-2">
              {stats.characters.extra}
            </div>
            <div className="text-sm text-gray-400 uppercase tracking-wide">Extra</div>
            <div className="w-full bg-dark-700 rounded-full h-2 mt-2">
              <div className="bg-yellow-400 h-2 rounded-full w-1/4 transition-all duration-300"></div>
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-400 mb-2">
              {stats.characters.missed}
            </div>
            <div className="text-sm text-gray-400 uppercase tracking-wide">Missed</div>
            <div className="w-full bg-dark-700 rounded-full h-2 mt-2">
              <div className="bg-gray-400 h-2 rounded-full w-1/4 transition-all duration-300"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
