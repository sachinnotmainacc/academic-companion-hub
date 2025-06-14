import { useTypingStore } from '../store/typingStore';

export default function TypingResults() {
  const { stats } = useTypingStore();
  const lastWPM = stats.wpm[stats.wpm.length - 1] || 0;
  const averageWPM = stats.wpm.length > 0
    ? Math.round(stats.wpm.reduce((a, b) => a + b, 0) / stats.wpm.length)
    : 0;

  return (
    <div className="mt-8 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-dark-800 p-4 rounded-lg shadow border border-dark-700">
          <h3 className="text-lg font-semibold mb-2 text-gray-200">WPM</h3>
          <p className="text-3xl font-bold text-blue-400">{lastWPM}</p>
          <p className="text-sm text-gray-400">Average: {averageWPM}</p>
        </div>
        
        <div className="bg-dark-800 p-4 rounded-lg shadow border border-dark-700">
          <h3 className="text-lg font-semibold mb-2 text-gray-200">Accuracy</h3>
          <p className="text-3xl font-bold text-blue-400">
            {Math.round(stats.accuracy)}%
          </p>
          <p className="text-sm text-gray-400">
            Errors: {stats.totalErrors}
          </p>
        </div>

        <div className="bg-dark-800 p-4 rounded-lg shadow border border-dark-700">
          <h3 className="text-lg font-semibold mb-2 text-gray-200">Time</h3>
          <p className="text-3xl font-bold text-blue-400">
            {stats.time !== null ? `${stats.time}s` : '--'}
          </p>
          <p className="text-sm text-gray-400">
            {stats.isComplete ? 'Completed' : 'In Progress'}
          </p>
        </div>
      </div>

      <div className="bg-dark-800 p-4 rounded-lg shadow border border-dark-700">
        <h3 className="text-lg font-semibold mb-4 text-gray-200">Character Stats</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-gray-400">Correct</p>
            <p className="text-xl font-semibold text-green-400">
              {stats.characters.correct}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Incorrect</p>
            <p className="text-xl font-semibold text-red-400">
              {stats.characters.incorrect}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Extra</p>
            <p className="text-xl font-semibold text-yellow-400">
              {stats.characters.extra}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Missed</p>
            <p className="text-xl font-semibold text-gray-400">
              {stats.characters.missed}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 