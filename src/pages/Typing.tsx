
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
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-black to-zinc-950 text-white relative overflow-hidden">
      {/* Premium background effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-zinc-900/20 via-transparent to-zinc-900/20"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/3 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white/2 rounded-full blur-3xl"></div>
      
      <Navbar />
      <div className="container mx-auto px-4 py-24 relative z-10">
        {/* Premium Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-zinc-100 to-zinc-300 bg-clip-text text-transparent drop-shadow-lg">
            Code Typing Master
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-white to-zinc-400 mx-auto mb-6"></div>
          <p className="text-zinc-400 text-xl max-w-3xl mx-auto leading-relaxed">
            Elevate your coding speed and precision with advanced performance analytics
          </p>
        </div>

        {!showResults ? (
          <>
            {/* Premium Control Bar */}
            <div className="max-w-5xl mx-auto mb-10">
              <div className="bg-gradient-to-r from-zinc-900/90 via-zinc-800/90 to-zinc-900/90 backdrop-blur-xl rounded-2xl p-6 border border-zinc-700/50 shadow-2xl shadow-black/50">
                <div className="flex flex-wrap items-center justify-between gap-6">
                  <div className="flex items-center space-x-6">
                    <Button 
                      onClick={handleReset}
                      variant="outline"
                      className="border-zinc-600 hover:bg-zinc-700/50 hover:border-zinc-500 bg-zinc-800/50 text-zinc-200 transition-all duration-300 backdrop-blur-sm"
                      disabled={isStarted && timeLeft > 0}
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Reset
                    </Button>
                    
                    <Button 
                      onClick={handleStart}
                      className="bg-gradient-to-r from-white to-zinc-200 text-black hover:from-zinc-100 hover:to-zinc-300 shadow-lg transition-all duration-300 font-medium"
                      disabled={isStarted}
                    >
                      <Play className="w-4 h-4 mr-2" />
                      {isStarted ? 'Started' : 'Start Test'}
                    </Button>
                  </div>

                  <div className="flex items-center space-x-8">
                    <div className="text-center">
                      <div className="text-sm text-zinc-400 mb-2 font-medium tracking-wide">Language</div>
                      <LanguageSelector 
                        currentLanguage={currentSnippet.language}
                        onLanguageChange={handleLanguageChange}
                        disabled={isStarted}
                      />
                    </div>
                    
                    <div className="text-center">
                      <div className="text-sm text-zinc-400 mb-2 font-medium tracking-wide">Duration</div>
                      <select 
                        value={testDuration}
                        onChange={(e) => handleDurationChange(Number(e.target.value))}
                        disabled={isStarted}
                        className="bg-zinc-800/50 border border-zinc-600 rounded-lg px-4 py-2 text-white text-sm min-w-[90px] focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                      >
                        <option value={15}>15s</option>
                        <option value={30}>30s</option>
                        <option value={60}>60s</option>
                        <option value={120}>120s</option>
                      </select>
                    </div>
                    
                    <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white hover:bg-zinc-700/50 transition-all duration-300">
                      <Settings className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Premium Typing Area */}
            <div className="max-w-5xl mx-auto">
              <div className="bg-gradient-to-br from-zinc-900/95 via-zinc-800/95 to-zinc-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-zinc-700/50 overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-r from-white/5 via-transparent to-white/5 pointer-events-none"></div>
                <div className="p-10 relative z-10">
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
              
              {isStarted && !isTestComplete && <TypingResults />}
            </div>
          </>
        ) : (
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
