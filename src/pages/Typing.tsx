import { useState, useEffect } from 'react';
import { useTypingStore } from '../store/typingStore';
import TypingArea from '../components/TypingArea';
import TypingResults from '../components/TypingResults';
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

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
  const { resetStats } = useTypingStore();

  useEffect(() => {
    resetStats();
  }, []);

  return (
    <div className="min-h-screen bg-dark-950 text-white">
      <Navbar />
      <div className="container mx-auto px-4 py-24">
        <h1 className="text-3xl font-bold mb-8 text-center">Typing Practice</h1>
        <div className="max-w-3xl mx-auto bg-dark-900 rounded-lg shadow-lg p-6">
          <TypingArea
            snippet={{ code: sampleCode, language: 'javascript' }}
            timeLeft={timeLeft}
            onType={setCurrentText}
            cursorPosition={cursorPosition}
            setCursorPosition={setCursorPosition}
            currentText={currentText}
          />
          <TypingResults />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Typing; 