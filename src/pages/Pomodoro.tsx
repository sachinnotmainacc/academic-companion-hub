
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Play, Pause, RotateCcw, CheckCircle } from 'lucide-react';

const Pomodoro: React.FC = () => {
  // Fixed timer durations
  const pomodoroTime = 25 * 60; // 25 minutes in seconds
  const shortBreakTime = 5 * 60; // 5 minutes in seconds
  const longBreakTime = 15 * 60; // 15 minutes in seconds

  // State variables
  const [timeLeft, setTimeLeft] = useState(pomodoroTime);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'pomodoro' | 'shortBreak' | 'longBreak'>('pomodoro');
  const [completedPomodoros, setCompletedPomodoros] = useState(0);

  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Toggle timer active state
  const toggleTimer = (): void => {
    setIsActive(!isActive);
    if (!isActive) {
      toast("Timer started", {
        description: `${mode.charAt(0).toUpperCase() + mode.slice(1)} timer is running`,
        action: {
          label: "Dismiss",
          onClick: () => console.log("Dismissed toast"),
        },
      });
    } else {
      toast("Timer paused", {
        description: `${mode.charAt(0).toUpperCase() + mode.slice(1)} timer is paused`,
        action: {
          label: "Dismiss",
          onClick: () => console.log("Dismissed toast"),
        },
      });
    }
  };

  // Reset timer
  const resetTimer = (): void => {
    setIsActive(false);
    switch (mode) {
      case 'pomodoro':
        setTimeLeft(pomodoroTime);
        break;
      case 'shortBreak':
        setTimeLeft(shortBreakTime);
        break;
      case 'longBreak':
        setTimeLeft(longBreakTime);
        break;
    }
    toast("Timer reset", {
      description: `${mode.charAt(0).toUpperCase() + mode.slice(1)} timer has been reset`,
      action: {
        label: "Dismiss",
        onClick: () => console.log("Dismissed toast"),
      },
    });
  };

  // Change timer mode
  const changeMode = (newMode: 'pomodoro' | 'shortBreak' | 'longBreak'): void => {
    setIsActive(false);
    setMode(newMode);
    switch (newMode) {
      case 'pomodoro':
        setTimeLeft(pomodoroTime);
        break;
      case 'shortBreak':
        setTimeLeft(shortBreakTime);
        break;
      case 'longBreak':
        setTimeLeft(longBreakTime);
        break;
    }
    toast(`${newMode.charAt(0).toUpperCase() + newMode.slice(1)} mode activated`, {
      description: "Timer has been reset for the new mode",
    });
  };

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      setIsActive(false);
      
      // Notification when timer completes
      if (mode === 'pomodoro') {
        setCompletedPomodoros(prev => prev + 1);
        toast("Pomodoro completed!", {
          description: "Time for a break!",
        });
        
        // Auto switch to break after pomodoro
        if (completedPomodoros % 4 === 3) { // Every 4th pomodoro
          changeMode('longBreak');
        } else {
          changeMode('shortBreak');
        }
      } else {
        toast("Break completed!", {
          description: "Ready to get back to work?",
        });
        changeMode('pomodoro');
      }
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft, mode, completedPomodoros]);

  // Get button color based on mode
  const getButtonColor = (buttonMode: 'pomodoro' | 'shortBreak' | 'longBreak'): string => {
    if (buttonMode === mode) {
      switch (mode) {
        case 'pomodoro':
          return 'bg-red-500 hover:bg-red-600';
        case 'shortBreak':
          return 'bg-green-500 hover:bg-green-600';
        case 'longBreak':
          return 'bg-blue-500 hover:bg-blue-600';
      }
    }
    return 'bg-dark-800 hover:bg-dark-700';
  };

  // Get progress bar color based on mode
  const getProgressColor = (): string => {
    switch (mode) {
      case 'pomodoro':
        return 'bg-red-500';
      case 'shortBreak':
        return 'bg-green-500';
      case 'longBreak':
        return 'bg-blue-500';
    }
  };

  // Calculate progress percentage
  const calculateProgress = (): number => {
    let totalTime: number;
    switch (mode) {
      case 'pomodoro':
        totalTime = pomodoroTime;
        break;
      case 'shortBreak':
        totalTime = shortBreakTime;
        break;
      case 'longBreak':
        totalTime = longBreakTime;
        break;
      default:
        totalTime = pomodoroTime;
    }
    return (timeLeft / totalTime) * 100;
  };

  return (
    <div className="min-h-screen bg-dark-950 text-white flex flex-col">
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center pt-16 pb-16 px-4">
        <div className="max-w-md w-full mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Pomodoro <span className="text-blue-500">Timer</span>
            </h1>
            <p className="text-gray-400">
              Focus, break, repeat. Boost your productivity.
            </p>
          </div>
          
          <div className="glass-card border-dark-800 rounded-xl overflow-hidden shadow-xl">
            {/* Mode selector */}
            <div className="grid grid-cols-3 gap-2 p-4 bg-dark-900 border-b border-dark-800">
              <Button 
                className={`${getButtonColor('pomodoro')} text-white`}
                onClick={() => changeMode('pomodoro')}
              >
                Pomodoro
              </Button>
              <Button 
                className={`${getButtonColor('shortBreak')} text-white`}
                onClick={() => changeMode('shortBreak')}
              >
                Short Break
              </Button>
              <Button 
                className={`${getButtonColor('longBreak')} text-white`}
                onClick={() => changeMode('longBreak')}
              >
                Long Break
              </Button>
            </div>
            
            {/* Timer display */}
            <div className="p-8 flex flex-col items-center">
              <div className="text-7xl font-bold mb-8 tracking-tighter">
                {formatTime(timeLeft)}
              </div>
              
              {/* Progress bar */}
              <div className="w-full h-2 bg-dark-800 rounded-full mb-8">
                <div 
                  className={`h-full rounded-full ${getProgressColor()}`}
                  style={{ width: `${calculateProgress()}%` }}
                ></div>
              </div>
              
              {/* Controls */}
              <div className="flex gap-4">
                <Button
                  size="lg"
                  className={`${isActive ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-green-500 hover:bg-green-600'} text-white px-8`}
                  onClick={toggleTimer}
                >
                  {isActive ? <Pause className="mr-2 h-5 w-5" /> : <Play className="mr-2 h-5 w-5" />}
                  {isActive ? 'Pause' : 'Start'}
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-gray-700 text-gray-300 hover:text-white"
                  onClick={resetTimer}
                >
                  <RotateCcw className="mr-2 h-5 w-5" />
                  Reset
                </Button>
              </div>
            </div>
            
            {/* Stats */}
            <div className="p-4 bg-dark-900 border-t border-dark-800">
              <div className="flex items-center justify-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-gray-300">Completed: </span>
                <span className="font-semibold text-white">{completedPomodoros} pomodoros</span>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Pomodoro;
