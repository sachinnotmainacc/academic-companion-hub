
import { useState, useEffect } from 'react';
import { useTypingStore } from '../store/typingStore';
import TypingArea from '../components/TypingArea';
import TypingResults from '../components/TypingResults';
import TypingTestResults from '../components/TypingTestResults';
import LanguageSelector, { codeSnippets, CodeSnippet } from '../components/LanguageSelector';
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { RotateCcw, Play, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Typing = () => {
  const [timeLeft, setTimeLeft] = useState(30);
  const [currentText, setCurrentText] = useState('');
  const [cursorPosition, setCursorPosition] = useState(0);
  const [isStarted, setIsStarted] = useState(false);
  const [currentSnippet, setCurrentSnippet] = useState<CodeSnippet>(codeSnippets.javascript);
  const [testDuration, setTestDuration] = useState(30);
  const { resetStats, stats } = useTypingStore();

  const isTestComplete = stats.isComplete || timeLeft === 0;
  const showResults = isTestComplete && isStarted;

  useEffect(() => {
    resetStats();
  }, []);

  const handleReset = () => {
    resetStats();
    setCurrentText('');
    setCursorPosition(0);
    setTimeLeft(testDuration);
    setIsStarted(false);
  };

  const handleStart = () => {
    if (!isStarted) {
      setIsStarted(true);
    }
  };

  const handleLanguageChange = (snippet: CodeSnippet) => {
    if (!isStarted) {
      setCurrentSnippet(snippet);
      setCurrentText('');
      setCursorPosition(0);
      resetStats();
    }
  };

  const handleDurationChange = (duration: number) => {
    if (!isStarted) {
      setTestDuration(duration);
      setTimeLeft(duration);
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

        {!showResults ? (
          <>
            {/* Control Bar */}
            <div className="max-w-4xl mx-auto mb-8">
              <div className="bg-dark-900 rounded-xl p-4 border border-dark-700 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <Button 
                    onClick={handleReset}
                    variant="outline"
                    className="border-dark-600 hover:bg-dark-700"
                    disabled={isStarted && timeLeft > 0}
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
                    <LanguageSelector 
                      currentLanguage={currentSnippet.language}
                      onLanguageChange={handleLanguageChange}
                      disabled={isStarted}
                    />
                  </div>
                  
                  <div className="text-center">
                    <div className="text-sm text-gray-400">Duration</div>
                    <select 
                      value={testDuration}
                      onChange={(e) => handleDurationChange(Number(e.target.value))}
                      disabled={isStarted}
                      className="bg-dark-800 border border-dark-600 rounded px-3 py-1 text-white text-sm"
                    >
                      <option value={15}>15s</option>
                      <option value={30}>30s</option>
                      <option value={60}>60s</option>
                      <option value={120}>120s</option>
                    </select>
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
                    snippet={currentSnippet}
                    timeLeft={timeLeft}
                    onType={setCurrentText}
                    cursorPosition={cursorPosition}
                    setCursorPosition={setCursorPosition}
                    currentText={currentText}
                    setTimeLeft={setTimeLeft}
                    testDuration={testDuration}
                  />
                </div>
              </div>
              
              {/* Only show live results during typing, not the full results */}
              {isStarted && !isTestComplete && <TypingResults />}
            </div>
          </>
        ) : (
          /* Show final test results */
          <div className="max-w-4xl mx-auto">
            <TypingTestResults onRestart={handleReset} />
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Typing;
