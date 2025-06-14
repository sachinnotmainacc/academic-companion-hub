import { useState, useEffect, useCallback, useRef } from 'react';
import { useTypingStore } from '../store/typingStore';
import { motion, AnimatePresence } from 'framer-motion';

interface CodeSnippet {
  code: string;
  language: string;
}

interface TypingAreaProps {
  snippet: CodeSnippet;
  timeLeft: number;
  onType: (text: string) => void;
  cursorPosition: number;
  setCursorPosition: (pos: number) => void;
  currentText: string;
  setTimeLeft: (time: number) => void;
  testDuration: number;
  isStarted: boolean;
  onStart: () => void;
}

const SAMPLE_INTERVAL = 1000; // 1 second

export default function TypingArea({
  snippet,
  timeLeft,
  onType,
  cursorPosition,
  setCursorPosition,
  currentText,
  setTimeLeft,
  testDuration,
  isStarted,
  onStart
}: TypingAreaProps) {
  const [isCursorVisible, setIsCursorVisible] = useState(true);
  const [hasStartedTyping, setHasStartedTyping] = useState(false);
  const [errorCount, setErrorCount] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const lastSampleTime = useRef<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const {
    addWPMSample,
    updateAccuracy,
    updateCharacters,
    setComplete,
    settings
  } = useTypingStore();

  // Start timer when test is started
  useEffect(() => {
    if (isStarted && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        const newTime = Math.max(0, timeLeft - 1);
        setTimeLeft(newTime);
        if (newTime <= 0) {
          const elapsedTime = testDuration;
          setComplete(elapsedTime);
          if (timerRef.current) {
            clearInterval(timerRef.current);
          }
        }
      }, 1000);

      return () => {
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      };
    }
  }, [isStarted, setTimeLeft, testDuration, setComplete, timeLeft]);

  // Cursor blinking effect
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsCursorVisible((prev) => !prev);
    }, 530);
    return () => clearInterval(blinkInterval);
  }, []);

  // Auto-focus the typing area when component mounts
  useEffect(() => {
    if (containerRef.current && isStarted) {
      containerRef.current.focus();
    }
  }, [isStarted]);

  // Prevent losing focus during test
  const handleBlur = useCallback(() => {
    if (containerRef.current && isStarted) {
      containerRef.current.focus();
    }
  }, [isStarted]);

  const calculateAndUpdateStats = useCallback(() => {
    const timeElapsed = (testDuration - timeLeft) / 60; // Convert to minutes
    if (timeElapsed > 0) {
      const wordCount = currentText.length / 5;
      const wpm = Math.round(wordCount / timeElapsed);
      const raw = Math.round((currentText.length / 5) / timeElapsed);
      
      addWPMSample(wpm, raw, errorCount);
      
      // Calculate accuracy
      const totalChars = currentText.length;
      const correctChars = currentText.split('').filter((char, i) => char === snippet.code[i]).length;
      const accuracy = totalChars > 0 ? (correctChars / (totalChars + errorCount)) * 100 : 0;
      updateAccuracy(accuracy);
      
      // Update character stats
      updateCharacters({
        correct: correctChars,
        incorrect: totalChars - correctChars,
        extra: Math.max(0, totalChars - snippet.code.length),
        missed: Math.max(0, snippet.code.length - totalChars),
      });
    }
  }, [timeLeft, currentText, snippet.code, errorCount, addWPMSample, updateAccuracy, updateCharacters, testDuration]);

  // Calculate and store WPM periodically
  useEffect(() => {
    if (!hasStartedTyping || !isStarted) return;

    const now = Date.now();
    if (now - lastSampleTime.current >= SAMPLE_INTERVAL) {
      calculateAndUpdateStats();
      lastSampleTime.current = now;
    }

    const interval = setInterval(() => {
      const now = Date.now();
      if (now - lastSampleTime.current >= SAMPLE_INTERVAL) {
        calculateAndUpdateStats();
        lastSampleTime.current = now;
      }
    }, 100);

    return () => clearInterval(interval);
  }, [hasStartedTyping, isStarted, calculateAndUpdateStats]);

  // Handle completion when text matches exactly
  useEffect(() => {
    if (currentText === snippet.code && isStarted) {
      calculateAndUpdateStats();
      const elapsedTime = (testDuration - timeLeft);
      setComplete(elapsedTime);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  }, [currentText, snippet.code, isStarted, timeLeft, calculateAndUpdateStats, setComplete]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (timeLeft === 0) return;

    // Start the test on first keypress if not already started
    if (!isStarted) {
      onStart();
      return;
    }

    // Prevent default behavior for space
    if (e.code === 'Space') {
      e.preventDefault();
    }

    if (!hasStartedTyping) {
      setHasStartedTyping(true);
      lastSampleTime.current = Date.now();
    }

    const currentValue = currentText;
    const targetText = snippet.code;

    if (e.key === 'Enter') {
      e.preventDefault();
      const newText = currentValue.slice(0, cursorPosition) + '\n' + currentValue.slice(cursorPosition);
      onType(newText);
      setCursorPosition(cursorPosition + 1);
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const newText = currentValue.slice(0, cursorPosition) + '  ' + currentValue.slice(cursorPosition);
      onType(newText);
      setCursorPosition(cursorPosition + 2);
    } else if (e.key === 'Backspace') {
      if (cursorPosition > 0) {
        const newText = currentValue.slice(0, cursorPosition - 1) + currentValue.slice(cursorPosition);
        onType(newText);
        setCursorPosition(cursorPosition - 1);
      }
    } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
      const expectedChar = targetText[cursorPosition];
      const isCorrect = e.key === expectedChar;
      
      const newText = currentValue.slice(0, cursorPosition) + e.key + currentValue.slice(cursorPosition);
      onType(newText);
      setCursorPosition(cursorPosition + 1);

      if (!isCorrect) {
        setErrorCount(prev => prev + 1);
      }

      // Check if this was the last character
      if (newText === targetText) {
        calculateAndUpdateStats();
        const elapsedTime = (testDuration - timeLeft);
        setComplete(elapsedTime);
      }
    }
  }, [timeLeft, isStarted, onStart, hasStartedTyping, currentText, snippet.code, cursorPosition, onType, setCursorPosition, calculateAndUpdateStats, setComplete, testDuration]);

  // Bind keyboard events
  useEffect(() => {
    if (isStarted) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [handleKeyDown, isStarted]);

  return (
    <div className="relative">
      {/* Enhanced Header */}
      <div className="flex justify-between items-center mb-6 p-4 bg-dark-800 rounded-lg border border-dark-600">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
          <div className="text-sm px-3 py-1 bg-blue-600 rounded-md text-white font-medium capitalize">
            {snippet.language}
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <div className="text-xs text-gray-400 uppercase tracking-wide">Time Left</div>
            <div className={`text-2xl font-mono font-bold ${
              timeLeft <= 10 ? 'text-red-400' : 
              timeLeft <= 20 ? 'text-yellow-400' : 'text-green-400'
            }`}>
              {timeLeft}s
            </div>
          </div>
          <div className="w-12 h-12 relative">
            <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 36 36">
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#374151"
                strokeWidth="2"
              />
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke={timeLeft <= 10 ? '#F87171' : timeLeft <= 20 ? '#FBBF24' : '#10B981'}
                strokeWidth="2"
                strokeDasharray={`${(timeLeft / testDuration) * 100}, 100`}
                className="transition-all duration-1000 ease-linear"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Enhanced Code Display */}
      <div 
        ref={containerRef}
        className={`relative font-mono text-lg leading-relaxed whitespace-pre-wrap outline-none bg-dark-850 p-6 rounded-lg border border-dark-600 transition-colors min-h-[300px] ${
          isStarted ? 'focus:border-blue-500 cursor-text' : 'cursor-pointer border-gray-600'
        }`}
        tabIndex={0}
        onBlur={handleBlur}
        onClick={() => {
          if (!isStarted) {
            onStart();
          }
        }}
        style={{ lineHeight: '1.8' }}
      >
        {!isStarted && (
          <div className="absolute inset-0 flex items-center justify-center bg-dark-850/80 rounded-lg">
            <div className="text-center">
              <p className="text-gray-400 text-lg mb-2">Click here or press any key to start typing</p>
              <p className="text-gray-500 text-sm">Make sure to click "Start Test" first</p>
            </div>
          </div>
        )}
        
        {snippet.code.split('').map((char, index) => {
          const isTyped = index < currentText.length;
          const typedChar = currentText[index];
          const isCorrect = isTyped && typedChar === char;
          const isWrong = isTyped && typedChar !== char;
          const isCursor = index === cursorPosition && isStarted;

          return (
            <span
              key={index}
              className={`relative ${
                isTyped
                  ? isCorrect
                    ? 'text-green-400 bg-green-400/10'
                    : isWrong
                    ? 'text-red-400 bg-red-400/20 rounded'
                    : ''
                  : 'text-gray-500'
              } transition-colors duration-150`}
            >
              {isCursor && isCursorVisible && (
                <span
                  className="absolute w-0.5 -ml-0.5 bg-blue-400 animate-pulse"
                  style={{ height: '1.6em' }}
                  data-cursor
                />
              )}
              {char}
            </span>
          );
        })}
      </div>

      {/* Progress Bar */}
      <div className="mt-4">
        <div className="flex justify-between text-xs text-gray-400 mb-1">
          <span>Progress</span>
          <span>{Math.round((currentText.length / snippet.code.length) * 100)}%</span>
        </div>
        <div className="w-full bg-dark-700 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${Math.min(100, (currentText.length / snippet.code.length) * 100)}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}
