
import { useState, useEffect } from 'react';
import { useTypingStore } from '../store/typingStore';
import TypingArea from '../components/TypingArea';
import TypingResults from '../components/TypingResults';
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { RotateCcw, Play, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';

const sampleCode = `function bubbleSort(arr) {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        // Swap elements
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  return arr;
}`;

const Typing = () => {
  const [timeLeft, setTimeLeft] = useState(30);
  const [currentText, setCurrentText] = useState('');
  const [cursorPosition, setCursorPosition] = useState(0);
  const [isStarted, setIsStarted] = useState(false);
  const { resetStats, stats } = useTypingStore();

  useEffect(() => {
    resetStats();
  }, []);

  const handleReset = () => {
    resetStats();
    setCurrentText('');
    setCursorPosition(0);
    setTimeLeft(30);
    setIsStarted(false);
  };

  const handleStart = () => {
    if (!isStarted) {
      setIsStarted(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-dark-950 text-white">
      <Navbar />
      <div className="container mx-auto px-4 py-24">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Code Typing Master
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Improve your coding speed and accuracy with real-time performance tracking
          </p>
        </div>

        {/* Control Bar */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="bg-dark-900 rounded-xl p-4 border border-dark-700 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <Button 
                onClick={handleReset}
                variant="outline"
                className="border-dark-600 hover:bg-dark-700"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
              
              <Button 
                onClick={handleStart}
                className="bg-blue-600 hover:bg-blue-700"
                disabled={isStarted}
              >
                <Play className="w-4 h-4 mr-2" />
                {isStarted ? 'Started' : 'Start Test'}
              </Button>
            </div>

            <div className="flex items-center space-x-6">
              <div className="text-center">
                <div className="text-sm text-gray-400">Test Type</div>
                <div className="text-white font-semibold">JavaScript</div>
              </div>
              
              <div className="text-center">
                <div className="text-sm text-gray-400">Duration</div>
                <div className="text-white font-semibold">30s</div>
              </div>
              
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Main Typing Area */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-dark-900 rounded-xl shadow-2xl border border-dark-700 overflow-hidden">
            <div className="p-8">
              <TypingArea
                snippet={{ code: sampleCode, language: 'javascript' }}
                timeLeft={timeLeft}
                onType={setCurrentText}
                cursorPosition={cursorPosition}
                setCursorPosition={setCursorPosition}
                currentText={currentText}
              />
            </div>
          </div>
          
          <TypingResults />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Typing;
