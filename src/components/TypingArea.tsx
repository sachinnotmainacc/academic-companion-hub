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
}

const SAMPLE_INTERVAL = 1000; // 1 second

export default function TypingArea({
  snippet,
  timeLeft,
  onType,
  cursorPosition,
  setCursorPosition,
  currentText
}: TypingAreaProps) {
  const [isCursorVisible, setIsCursorVisible] = useState(true);
  const [hasStartedTyping, setHasStartedTyping] = useState(false);
  const [errorCount, setErrorCount] = useState(0);
  const [internalTimeLeft, setInternalTimeLeft] = useState(30);
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

  // Start timer when typing begins
  useEffect(() => {
    if (hasStartedTyping && internalTimeLeft > 0) {
      timerRef.current = setInterval(() => {
        setInternalTimeLeft((prev) => {
          if (prev <= 1) {
            if (timerRef.current) {
              clearInterval(timerRef.current);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => {
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      };
    }
  }, [hasStartedTyping]);

  // Cursor blinking effect
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsCursorVisible((prev) => !prev);
    }, 530);
    return () => clearInterval(blinkInterval);
  }, []);

  // Auto-focus the typing area when component mounts
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.focus();
    }
  }, []);

  // Prevent losing focus
  const handleBlur = useCallback(() => {
    if (containerRef.current) {
      containerRef.current.focus();
    }
  }, []);

  const calculateAndUpdateStats = useCallback(() => {
    const timeElapsed = (30 - internalTimeLeft) / 60; // Convert to minutes
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
  }, [internalTimeLeft, currentText, snippet.code, errorCount, addWPMSample, updateAccuracy, updateCharacters]);

  // Calculate and store WPM periodically
  useEffect(() => {
    if (!hasStartedTyping) return;

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
  }, [hasStartedTyping, calculateAndUpdateStats]);

  // Handle completion when text matches exactly
  useEffect(() => {
    if (currentText === snippet.code) {
      calculateAndUpdateStats();
      const elapsedTime = (30 - internalTimeLeft);
      setComplete(elapsedTime);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  }, [currentText, snippet.code, internalTimeLeft, calculateAndUpdateStats, setComplete]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (internalTimeLeft === 0) return;

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
        const elapsedTime = (30 - internalTimeLeft);
        setComplete(elapsedTime);
      }
    }
  }, [internalTimeLeft, hasStartedTyping, currentText, snippet.code, cursorPosition, onType, setCursorPosition, calculateAndUpdateStats, setComplete]);

  // Bind keyboard events
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className="relative">
      {/* Header with timer and language */}
      <div className="flex justify-between items-center mb-4">
        <div className="text-sm px-3 py-1 bg-dark-700 rounded-md text-gray-300">
          {snippet.language}
        </div>
        <div className="text-xl font-mono">
          {internalTimeLeft}s
        </div>
      </div>

      {/* Code display area */}
      <div 
        ref={containerRef}
        className="relative font-mono text-lg leading-relaxed whitespace-pre-wrap outline-none bg-dark-800 p-4 rounded-lg border border-dark-700"
        tabIndex={0}
        onBlur={handleBlur}
      >
        {snippet.code.split('').map((char, index) => {
          const isTyped = index < currentText.length;
          const typedChar = currentText[index];
          const isCorrect = isTyped && typedChar === char;
          const isWrong = isTyped && typedChar !== char;
          const isCursor = index === cursorPosition;

          return (
            <span
              key={index}
              className={`${
                isTyped
                  ? isCorrect
                    ? 'text-green-400'
                    : isWrong
                    ? 'text-red-400 bg-red-900/50'
                    : ''
                  : 'text-gray-500'
              }`}
            >
              {isCursor && isCursorVisible && (
                <span
                  className="absolute w-0.5 -ml-0.5 bg-blue-400"
                  style={{ height: '1.5em' }}
                  data-cursor
                />
              )}
              {char}
            </span>
          );
        })}
      </div>
    </div>
  );
} 