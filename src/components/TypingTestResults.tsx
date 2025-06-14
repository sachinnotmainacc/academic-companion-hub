
import { useTypingStore } from '../store/typingStore';
import TypingChart from './TypingChart';
import { Button } from '@/components/ui/button';
import { RotateCcw, Trophy, Target, Clock, Zap } from 'lucide-react';

interface TypingTestResultsProps {
  onRestart: () => void;
}

export default function TypingTestResults({ onRestart }: TypingTestResultsProps) {
  const { stats } = useTypingStore();
  const finalWPM = stats.wpm[stats.wpm.length - 1] || 0;
  const finalRaw = stats.raw[stats.raw.length - 1] || 0;
  const averageWPM = stats.wpm.length > 0
    ? Math.round(stats.wpm.reduce((a, b) => a + b, 0) / stats.wpm.length)
    : 0;

  const getPerformanceGrade = (wpm: number) => {
    if (wpm >= 70) return { grade: 'Excellent', color: 'text-green-400', icon: Trophy };
    if (wpm >= 50) return { grade: 'Good', color: 'text-blue-400', icon: Target };
    if (wpm >= 30) return { grade: 'Average', color: 'text-yellow-400', icon: Clock };
    return { grade: 'Needs Practice', color: 'text-red-400', icon: Zap };
  };

  const performance = getPerformanceGrade(finalWPM);
  const PerformanceIcon = performance.icon;

  return (
    <div className="space-y-8">
      {/* Test Complete Header */}
      <div className="text-center py-8 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-xl border border-dark-700">
        <div className="flex justify-center mb-4">
          <div className="p-4 bg-green-500/20 rounded-full">
            <Trophy className="w-8 h-8 text-green-400" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-white mb-2">Test Complete!</h2>
        <p className="text-gray-400">Here's how you performed</p>
      </div>

      {/* Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-dark-800 p-6 rounded-xl border border-dark-700 text-center">
          <div className="flex justify-center mb-3">
            <PerformanceIcon className={`w-6 h-6 ${performance.color}`} />
          </div>
          <div className="text-2xl font-bold text-white mb-1">{performance.grade}</div>
          <div className="text-sm text-gray-400">Overall Performance</div>
        </div>
        
        <div className="bg-dark-800 p-6 rounded-xl border border-dark-700 text-center">
          <div className="text-4xl font-bold text-blue-400 mb-1">{finalWPM}</div>
          <div className="text-sm text-gray-400 uppercase tracking-wide">Final WPM</div>
          <div className="text-xs text-gray-500 mt-1">Average: {averageWPM}</div>
        </div>
      </div>

      {/* Detailed Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-dark-800 p-6 rounded-xl shadow-lg border border-dark-700 text-center">
          <div className="text-3xl font-bold text-purple-400 mb-1">{Math.round(stats.accuracy)}%</div>
          <div className="text-sm text-gray-400 uppercase tracking-wide">Accuracy</div>
          <div className="text-xs text-gray-500 mt-1">Errors: {stats.totalErrors}</div>
        </div>

        <div className="bg-dark-800 p-6 rounded-xl shadow-lg border border-dark-700 text-center">
          <div className="text-3xl font-bold text-green-400 mb-1">{finalRaw}</div>
          <div className="text-sm text-gray-400 uppercase tracking-wide">Raw Speed</div>
          <div className="text-xs text-gray-500 mt-1">Uncorrected</div>
        </div>

        <div className="bg-dark-800 p-6 rounded-xl shadow-lg border border-dark-700 text-center">
          <div className="text-3xl font-bold text-orange-400 mb-1">
            {stats.time !== null ? `${stats.time}s` : '30s'}
          </div>
          <div className="text-sm text-gray-400 uppercase tracking-wide">Time</div>
          <div className="text-xs text-gray-500 mt-1">Duration</div>
        </div>

        <div className="bg-dark-800 p-6 rounded-xl shadow-lg border border-dark-700 text-center">
          <div className="text-3xl font-bold text-cyan-400 mb-1">
            {stats.characters.correct + stats.characters.incorrect}
          </div>
          <div className="text-sm text-gray-400 uppercase tracking-wide">Total Chars</div>
          <div className="text-xs text-gray-500 mt-1">Typed</div>
        </div>
      </div>

      {/* Performance Chart */}
      {stats.wpm.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold mb-4 text-gray-200">Performance Over Time</h3>
          <TypingChart />
        </div>
      )}

      {/* Character Analysis */}
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

      {/* Restart Button */}
      <div className="text-center pt-4">
        <Button 
          onClick={onRestart}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
        >
          <RotateCcw className="w-5 h-5 mr-2" />
          Take Another Test
        </Button>
      </div>
    </div>
  );
}
