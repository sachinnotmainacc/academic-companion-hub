
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
  const [currentSnippet, setCurrentSnippet] = useState<CodeSnippet>(codeSnippets.javascript[0]);
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
    if (!isStarted && timeLeft > 0) {
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 text-white">
      <Navbar />
      <div className="container mx-auto px-4 py-24">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-blue-500 bg-clip-text text-transparent drop-shadow-lg">
            Code Typing Master
          </h1>
          <p className="text-gray-400 text-xl max-w-3xl mx-auto leading-relaxed">
            Elevate your coding speed and precision with advanced performance analytics
          </p>
        </div>

        {!showResults ? (
          <>
            {/* Control Bar */}
            <div className="max-w-5xl mx-auto mb-10">
              <div className="bg-gradient-to-r from-slate-800/90 to-gray-800/90 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/60 shadow-2xl shadow-black/20">
                <div className="flex flex-wrap items-center justify-between gap-6">
                  <div className="flex items-center space-x-6">
                    <Button 
                      onClick={handleReset}
                      variant="outline"
                      className="border-slate-600 hover:bg-slate-700 hover:border-slate-500 bg-slate-800/60 text-gray-200 transition-all duration-300"
                      disabled={isStarted && timeLeft > 0}
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Reset
                    </Button>
                    
                    <Button 
                      onClick={handleStart}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg shadow-blue-500/25 transition-all duration-300"
                      disabled={isStarted}
                    >
                      <Play className="w-4 h-4 mr-2" />
                      {isStarted ? 'Started' : 'Start Test'}
                    </Button>
                  </div>

                  <div className="flex items-center space-x-8">
                    <div className="text-center">
                      <div className="text-sm text-gray-400 mb-2 font-medium tracking-wide">Language</div>
                      <LanguageSelector 
                        currentLanguage={currentSnippet.language}
                        onLanguageChange={handleLanguageChange}
                        disabled={isStarted}
                      />
                    </div>
                    
                    <div className="text-center">
                      <div className="text-sm text-gray-400 mb-2 font-medium tracking-wide">Duration</div>
                      <select 
                        value={testDuration}
                        onChange={(e) => handleDurationChange(Number(e.target.value))}
                        disabled={isStarted}
                        className="bg-slate-800/80 border border-slate-600 rounded-lg px-4 py-2 text-white text-sm min-w-[90px] focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                      >
                        <option value={15}>15s</option>
                        <option value={30}>30s</option>
                        <option value={60}>60s</option>
                        <option value={120}>120s</option>
                      </select>
                    </div>
                    
                    <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-slate-700/60 transition-all duration-300">
                      <Settings className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Typing Area */}
            <div className="max-w-5xl mx-auto">
              <div className="bg-gradient-to-br from-slate-800/95 to-gray-800/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-700/40 overflow-hidden">
                <div className="p-10">
                  <TypingArea
                    snippet={currentSnippet}
                    timeLeft={timeLeft}
                    onType={setCurrentText}
                    cursorPosition={cursorPosition}
                    setCursorPosition={setCursorPosition}
                    currentText={currentText}
                    setTimeLeft={setTimeLeft}
                    testDuration={testDuration}
                    isStarted={isStarted}
                    onStart={handleStart}
                  />
                </div>
              </div>
              
              {/* Only show live results during typing, not the full results */}
              {isStarted && !isTestComplete && <TypingResults />}
            </div>
          </>
        ) : (
          /* Show final test results */
          <div className="max-w-5xl mx-auto">
            <TypingTestResults onRestart={handleReset} />
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Typing;
