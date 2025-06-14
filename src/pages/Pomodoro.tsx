import React, { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Play, Pause, RotateCcw, CheckCircle, Settings } from 'lucide-react';
import PomodoroSettings from '@/components/pomodoro/PomodoroSettings';
import YouTubePlayer from '@/components/pomodoro/YouTubePlayer';
import PomodoroStats from '@/components/pomodoro/PomodoroStats';
import HowItWorksDialog from '@/components/pomodoro/HowItWorksDialog';

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
      
      // Fix streak handling
      const lastActiveDate = localStorage.getItem('lastActiveDate');
      const today = new Date().toDateString();
      
      if (lastActiveDate !== today) {
        // If last active was yesterday, maintain streak
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        if (lastActiveDate === yesterday.toDateString()) {
          setCurrentStreak(stats.currentStreak || 0);
        } else {
          // Reset streak if more than a day has passed
          setCurrentStreak(0);
        }
        setTodayPomodoros(0);
      } else {
        setCurrentStreak(stats.currentStreak || 0);
        setTodayPomodoros(stats.todayPomodoros || 0);
      }
      
      setLongestStreak(stats.longestStreak || 0);
    }
    
    // Load timer settings
    const savedSettings = localStorage.getItem('pomodoroSettings');
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      setPomodoroTime(settings.pomodoroTime || 25 * 60);
      setShortBreakTime(settings.shortBreakTime || 5 * 60);
      setLongBreakTime(settings.longBreakTime || 15 * 60);
      // Only set timeLeft if timer is not active
      if (!isActive) {
        setTimeLeft(settings.pomodoroTime || 25 * 60);
      }
    }

    localStorage.setItem('lastActiveDate', new Date().toDateString());
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
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prevTime - 1;
        });
        
        if (mode === 'pomodoro') {
          setTotalFocusTime(prev => prev + 1);
        }
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      
      // Play notification sound
      const audio = new Audio('/notification.mp3');
      audio.play().catch(() => {
        console.log('Audio playback failed');
      });
      
      if (mode === 'pomodoro') {
        const newCompletedPomodoros = completedPomodoros + 1;
        setCompletedPomodoros(newCompletedPomodoros);
        setTodayPomodoros(prev => prev + 1);
        
        // Update streak only when completing a pomodoro
        const newStreak = currentStreak + 1;
        setCurrentStreak(newStreak);
        if (newStreak > longestStreak) {
          setLongestStreak(newStreak);
        }
        
        toast("Pomodoro completed!", {
          description: "Time for a break!",
        });
        
        // Improved auto-switch logic
        if (newCompletedPomodoros % 4 === 0) {
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

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
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

  // Calculate progress
  const calculateProgress = (): number => {
    let totalTime;
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
    
    // Ensure we don't divide by zero
    if (totalTime === 0) return 0;
    
    // Calculate progress percentage
    const progress = ((totalTime - timeLeft) / totalTime) * 100;
    
    // Ensure progress stays between 0 and 100
    return Math.min(Math.max(progress, 0), 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-dark-950 via-dark-950 to-dark-900 text-white">
      <Navbar />
      
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          {/* Header with Help Button */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-4 mb-4">
              <h1 className="text-4xl md:text-5xl font-bold">
                <span className="text-gradient bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Pomodoro Timer</span>
              </h1>
              <HowItWorksDialog />
            </div>
            <p className="text-lg text-gray-400 max-w-xl mx-auto">
              Boost your productivity with focused work sessions and structured breaks
            </p>
          </div>
          
          {/* Main Timer Section - Centered and Larger */}
          <div className="max-w-2xl mx-auto mb-12">
            <div className="glass-card rounded-3xl border border-dark-800/50 shadow-2xl overflow-hidden">
              {/* Mode selector */}
              <div className="grid grid-cols-3 gap-3 p-6 bg-dark-900/80 border-b border-dark-800 relative">
                <Button 
                  className={`${getButtonColor('pomodoro')} text-white font-medium shadow-md h-12 text-base`}
                  onClick={() => changeMode('pomodoro')}
                >
                  Focus
                </Button>
                <Button 
                  className={`${getButtonColor('shortBreak')} text-white font-medium shadow-md h-12 text-base`}
                  onClick={() => changeMode('shortBreak')}
                >
                  Short Break
                </Button>
                <Button 
                  className={`${getButtonColor('longBreak')} text-white font-medium shadow-md h-12 text-base`}
                  onClick={() => changeMode('longBreak')}
                >
                  Long Break
                </Button>
                
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 top-4 text-gray-400 hover:text-white hover:bg-dark-800/50"
                  onClick={() => setShowSettings(true)}
                >
                  <Settings className="h-5 w-5" />
                </Button>
              </div>
              
              {/* Timer display - Much Larger */}
              <div className="p-12 md:p-16 flex flex-col items-center">
                <div className="w-80 h-80 md:w-96 md:h-96 rounded-full border-8 border-dark-800/50 flex items-center justify-center mb-12 relative">
                  <div 
                    className="absolute inset-0 rounded-full overflow-hidden"
                    style={{ 
                      background: `conic-gradient(${getProgressColor()} ${calculateProgress()}%, transparent 0)`,
                      transform: 'rotate(-90deg)',
                      transformOrigin: 'center'
                    }}
                  ></div>
                  <div className="absolute inset-[0.5rem] bg-dark-900/80 rounded-full backdrop-blur-sm border border-dark-800/30"></div>
                  <div className="text-8xl md:text-9xl font-bold tracking-tighter z-10 text-white">
                    {formatTime(timeLeft)}
                  </div>
                </div>
                
                {/* Controls - Larger */}
                <div className="flex gap-6 mt-6">
                  <Button
                    size="lg"
                    className={`${isActive ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-green-500 hover:bg-green-600'} text-white px-12 py-4 text-lg shadow-lg shadow-[rgba(0,0,0,0.1)]`}
                    onClick={toggleTimer}
                  >
                    {isActive ? <Pause className="mr-3 h-6 w-6" /> : <Play className="mr-3 h-6 w-6" />}
                    {isActive ? 'Pause' : 'Start'}
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-gray-700 text-gray-300 hover:text-white hover:border-gray-600 px-8 py-4 text-lg"
                    onClick={resetTimer}
                  >
                    <RotateCcw className="mr-3 h-6 w-6" />
                    Reset
                  </Button>
                </div>
              </div>
              
              {/* Session counter */}
              <div className="p-6 bg-dark-900/80 border-t border-dark-800 flex justify-center">
                <div className="flex items-center gap-3 px-6 py-3 rounded-full bg-dark-800/50 backdrop-blur-sm">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                  <span className="text-gray-300 text-lg">Today: </span>
                  <span className="font-semibold text-white text-lg">{todayPomodoros} sessions completed</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Secondary Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Stats Card */}
            <div className="glass-card rounded-2xl border border-dark-800/50 shadow-lg p-6">
              <PomodoroStats 
                completedPomodoros={completedPomodoros}
                completedBreaks={completedBreaks}
                totalFocusTime={totalFocusTime}
                todayPomodoros={todayPomodoros}
                longestStreak={longestStreak}
              />
            </div>
            
            {/* YouTube Player */}
            <div className="glass-card rounded-2xl border border-dark-800/50 shadow-lg overflow-hidden">
              <div className="p-4 bg-dark-900/80 border-b border-dark-800">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <span className="p-1.5 rounded-full bg-dark-800">
                    <CheckCircle className="h-4 w-4 text-blue-400" />
                  </span>
                  Background Music
                </h3>
              </div>
              <div className="p-1">
                <YouTubePlayer />
              </div>
            </div>
          </div>
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
