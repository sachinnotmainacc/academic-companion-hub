
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Play, Pause, RotateCcw, CheckCircle, Settings } from 'lucide-react';
import PomodoroSettings from '@/components/pomodoro/PomodoroSettings';
import YouTubePlayer from '@/components/pomodoro/YouTubePlayer';
import PomodoroStats from '@/components/pomodoro/PomodoroStats';

const Pomodoro: React.FC = () => {
  // Timer durations (customizable now)
  const [pomodoroTime, setPomodoroTime] = useState(25 * 60); // 25 minutes in seconds
  const [shortBreakTime, setShortBreakTime] = useState(5 * 60); // 5 minutes in seconds
  const [longBreakTime, setLongBreakTime] = useState(15 * 60); // 15 minutes in seconds

  // State variables
  const [timeLeft, setTimeLeft] = useState(pomodoroTime);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'pomodoro' | 'shortBreak' | 'longBreak'>('pomodoro');
  const [completedPomodoros, setCompletedPomodoros] = useState(0);
  const [completedBreaks, setCompletedBreaks] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [totalFocusTime, setTotalFocusTime] = useState(0);
  const [todayPomodoros, setTodayPomodoros] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);

  // Load stats from localStorage
  useEffect(() => {
    const savedStats = localStorage.getItem('pomodoroStats');
    if (savedStats) {
      const stats = JSON.parse(savedStats);
      setCompletedPomodoros(stats.completedPomodoros || 0);
      setCompletedBreaks(stats.completedBreaks || 0);
      setTotalFocusTime(stats.totalFocusTime || 0);
      setTodayPomodoros(stats.todayPomodoros || 0);
      setLongestStreak(stats.longestStreak || 0);
      setCurrentStreak(stats.currentStreak || 0);
    }
    
    // Load timer settings
    const savedSettings = localStorage.getItem('pomodoroSettings');
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      setPomodoroTime(settings.pomodoroTime || 25 * 60);
      setShortBreakTime(settings.shortBreakTime || 5 * 60);
      setLongBreakTime(settings.longBreakTime || 15 * 60);
      setTimeLeft(settings.pomodoroTime || 25 * 60);
    }

    // Check if it's a new day
    const lastActiveDate = localStorage.getItem('lastActiveDate');
    const today = new Date().toDateString();
    if (lastActiveDate !== today) {
      setTodayPomodoros(0);
      localStorage.setItem('lastActiveDate', today);
    }
  }, []);

  // Save stats to localStorage
  useEffect(() => {
    const stats = {
      completedPomodoros,
      completedBreaks,
      totalFocusTime,
      todayPomodoros,
      longestStreak,
      currentStreak
    };
    localStorage.setItem('pomodoroStats', JSON.stringify(stats));
    localStorage.setItem('lastActiveDate', new Date().toDateString());
  }, [completedPomodoros, completedBreaks, totalFocusTime, todayPomodoros, longestStreak, currentStreak]);

  // Save timer settings
  useEffect(() => {
    const settings = {
      pomodoroTime,
      shortBreakTime,
      longBreakTime
    };
    localStorage.setItem('pomodoroSettings', JSON.stringify(settings));
  }, [pomodoroTime, shortBreakTime, longBreakTime]);

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

  // Update timer settings
  const updateTimerSettings = (pomodoro: number, shortBreak: number, longBreak: number): void => {
    setPomodoroTime(pomodoro);
    setShortBreakTime(shortBreak);
    setLongBreakTime(longBreak);
    
    // Update current timer if needed
    if (mode === 'pomodoro') {
      setTimeLeft(pomodoro);
    } else if (mode === 'shortBreak') {
      setTimeLeft(shortBreak);
    } else if (mode === 'longBreak') {
      setTimeLeft(longBreak);
    }
    
    toast("Settings updated", {
      description: "Your timer settings have been updated",
    });
  };

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft - 1);
        if (mode === 'pomodoro') {
          setTotalFocusTime(prev => prev + 1);
        }
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      setIsActive(false);
      
      // Notification when timer completes
      if (mode === 'pomodoro') {
        setCompletedPomodoros(prev => prev + 1);
        setTodayPomodoros(prev => prev + 1);
        setCurrentStreak(prev => prev + 1);
        
        // Update longest streak if needed
        if (currentStreak + 1 > longestStreak) {
          setLongestStreak(currentStreak + 1);
        }
        
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
        setCompletedBreaks(prev => prev + 1);
        toast("Break completed!", {
          description: "Ready to get back to work?",
        });
        changeMode('pomodoro');
      }
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft, mode, completedPomodoros, currentStreak, longestStreak]);

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
      
      <main className="flex-grow flex flex-col items-center justify-center pt-16 pb-16 px-4">
        <div className="max-w-4xl w-full mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 flex flex-col">
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                Pomodoro <span className="text-blue-500">Timer</span>
              </h1>
              <p className="text-gray-400">
                Focus, break, repeat. Boost your productivity.
              </p>
            </div>
            
            <div className="glass-card border-dark-800 rounded-xl overflow-hidden shadow-xl mb-6">
              {/* Mode selector */}
              <div className="grid grid-cols-3 gap-2 p-4 bg-dark-900 border-b border-dark-800 relative">
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
                
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-2 text-gray-400 hover:text-white"
                  onClick={() => setShowSettings(true)}
                >
                  <Settings className="h-5 w-5" />
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
                  <span className="text-gray-300">Completed today: </span>
                  <span className="font-semibold text-white">{todayPomodoros} pomodoros</span>
                </div>
              </div>
            </div>
            
            {/* YouTube Player */}
            <YouTubePlayer className="mb-6" />
          </div>
          
          <div className="lg:col-span-1">
            <div className="glass-card border-dark-800 rounded-xl overflow-hidden shadow-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-4">How it works</h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start">
                  <span className="bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs mr-3 mt-0.5 shrink-0">1</span>
                  <p>Set a 25-minute timer and focus on a single task until the timer rings.</p>
                </li>
                <li className="flex items-start">
                  <span className="bg-green-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs mr-3 mt-0.5 shrink-0">2</span>
                  <p>Take a short 5-minute break to relax and recharge.</p>
                </li>
                <li className="flex items-start">
                  <span className="bg-yellow-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs mr-3 mt-0.5 shrink-0">3</span>
                  <p>After completing four pomodoros, take a longer 15-minute break.</p>
                </li>
                <li className="flex items-start">
                  <span className="bg-blue-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs mr-3 mt-0.5 shrink-0">4</span>
                  <p>Adjust timer settings to find what works best for your productivity.</p>
                </li>
              </ul>
              <div className="mt-6 pt-6 border-t border-dark-800">
                <h4 className="text-lg font-medium text-white mb-3">Tips</h4>
                <ul className="space-y-2 text-gray-300 text-sm">
                  <li>• Break down complex tasks into actionable items</li>
                  <li>• Use the YouTube player for ambient background music</li>
                  <li>• Stay hydrated and take short walks during breaks</li>
                  <li>• Avoid checking emails or messages during focus time</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        {/* Stats Section */}
        <div className="w-full max-w-4xl mt-10 p-6 glass-card border-dark-800 rounded-xl">
          <PomodoroStats 
            completedPomodoros={completedPomodoros}
            completedBreaks={completedBreaks}
            totalFocusTime={totalFocusTime}
            todayPomodoros={todayPomodoros}
            longestStreak={longestStreak}
          />
        </div>
      </main>
      
      {/* Settings */}
      <PomodoroSettings
        open={showSettings}
        onOpenChange={setShowSettings}
        pomodoroTime={pomodoroTime}
        shortBreakTime={shortBreakTime}
        longBreakTime={longBreakTime}
        onSave={updateTimerSettings}
      />
      
      <Footer />
    </div>
  );
};

export default Pomodoro;
