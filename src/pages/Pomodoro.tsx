
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Play, Pause, RotateCcw, CheckCircle, Settings, Maximize2 } from 'lucide-react';
import PomodoroSettings from '@/components/pomodoro/PomodoroSettings';
import YouTubePlayer from '@/components/pomodoro/YouTubePlayer';
import PomodoroStats from '@/components/pomodoro/PomodoroStats';
import HowItWorksDialog from '@/components/pomodoro/HowItWorksDialog';
import FullscreenPomodoro from '@/components/pomodoro/FullscreenPomodoro';

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
  const [isFullscreen, setIsFullscreen] = useState(false);

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
          return 'bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/25';
        case 'shortBreak':
          return 'bg-green-500 hover:bg-green-600 text-white shadow-lg shadow-green-500/25';
        case 'longBreak':
          return 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg shadow-blue-500/25';
      }
    }
    return 'bg-zinc-800/60 hover:bg-zinc-700/80 text-gray-400 hover:text-white border border-zinc-700/50';
  };

  // Get progress bar color based on mode
  const getProgressColor = (): string => {
    switch (mode) {
      case 'pomodoro':
        return 'bg-gradient-to-r from-red-500 to-red-400';
      case 'shortBreak':
        return 'bg-gradient-to-r from-green-500 to-green-400';
      case 'longBreak':
        return 'bg-gradient-to-r from-blue-500 to-blue-400';
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

  const getModeTitle = () => {
    switch (mode) {
      case 'pomodoro':
        return 'Focus Session';
      case 'shortBreak':
        return 'Short Break';
      case 'longBreak':
        return 'Long Break';
    }
  };

  const getModeSubtitle = () => {
    switch (mode) {
      case 'pomodoro':
        return 'Time to focus and get things done';
      case 'shortBreak':
        return 'Take a quick break and recharge';
      case 'longBreak':
        return 'Enjoy a well-deserved longer break';
    }
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Premium background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-zinc-900/20 via-black to-zinc-900/20"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/2 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white/1 rounded-full blur-3xl"></div>
      
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 pb-8 md:pt-28 md:pb-16 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Shortened Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="p-2 rounded-xl bg-gradient-to-br from-white/10 to-zinc-800/30 border border-white/20 backdrop-blur-sm">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white via-zinc-100 to-zinc-300 bg-clip-text text-transparent">
                Pomodoro Timer
              </h1>
              <HowItWorksDialog />
            </div>
            <p className="text-zinc-400">Boost your productivity with focused work sessions</p>
          </div>
          
          {/* Main Timer Card */}
          <div className="max-w-4xl mx-auto mb-16">
            <div className="bg-gradient-to-br from-zinc-900/90 via-zinc-800/90 to-zinc-900/90 backdrop-blur-xl rounded-3xl border border-zinc-700/50 shadow-2xl shadow-black/50 overflow-hidden">
              {/* Mode Selector */}
              <div className="p-6 bg-gradient-to-r from-zinc-900/80 via-zinc-800/80 to-zinc-900/80 border-b border-zinc-700/50">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-white">{getModeTitle()}</h2>
                    <p className="text-zinc-400">{getModeSubtitle()}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-zinc-400 hover:text-white hover:bg-zinc-800/50 rounded-xl transition-all duration-300"
                      onClick={() => setIsFullscreen(true)}
                    >
                      <Maximize2 className="h-5 w-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-zinc-400 hover:text-white hover:bg-zinc-800/50 rounded-xl transition-all duration-300"
                      onClick={() => setShowSettings(true)}
                    >
                      <Settings className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-3">
                  <Button 
                    className={`${getButtonColor('pomodoro')} h-14 text-base font-medium rounded-xl transition-all duration-300 hover:scale-105`}
                    onClick={() => changeMode('pomodoro')}
                  >
                    Focus
                  </Button>
                  <Button 
                    className={`${getButtonColor('shortBreak')} h-14 text-base font-medium rounded-xl transition-all duration-300 hover:scale-105`}
                    onClick={() => changeMode('shortBreak')}
                  >
                    Short Break
                  </Button>
                  <Button 
                    className={`${getButtonColor('longBreak')} h-14 text-base font-medium rounded-xl transition-all duration-300 hover:scale-105`}
                    onClick={() => changeMode('longBreak')}
                  >
                    Long Break
                  </Button>
                </div>
              </div>
              
              {/* Timer Display */}
              <div className="p-12 md:p-20 flex flex-col items-center">
                {/* Circular Progress Timer */}
                <div className="relative mb-12">
                  <div className="w-80 h-80 md:w-96 md:h-96 rounded-full relative">
                    {/* Background circle */}
                    <div className="absolute inset-0 rounded-full border-8 border-zinc-800/30"></div>
                    
                    {/* Progress circle */}
                    <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="none"
                        className="text-zinc-800/30"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        stroke="url(#gradient)"
                        strokeWidth="8"
                        fill="none"
                        strokeLinecap="round"
                        strokeDasharray={`${2 * Math.PI * 45}`}
                        strokeDashoffset={`${2 * Math.PI * 45 * (1 - calculateProgress() / 100)}`}
                        className="transition-all duration-1000 ease-out"
                      />
                      <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor={mode === 'pomodoro' ? '#ef4444' : mode === 'shortBreak' ? '#22c55e' : '#3b82f6'} />
                          <stop offset="100%" stopColor={mode === 'pomodoro' ? '#dc2626' : mode === 'shortBreak' ? '#16a34a' : '#2563eb'} />
                        </linearGradient>
                      </defs>
                    </svg>
                    
                    {/* Time display */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <div className="text-6xl md:text-8xl font-bold text-white mb-2 font-mono tracking-tight">
                        {formatTime(timeLeft)}
                      </div>
                      <div className="text-lg text-zinc-400 font-medium">
                        {isActive ? 'Active' : 'Paused'}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Enhanced Controls */}
                <div className="flex gap-6">
                  <Button
                    size="lg"
                    className={`${isActive 
                      ? 'bg-orange-500 hover:bg-orange-600 shadow-lg shadow-orange-500/25' 
                      : 'bg-green-500 hover:bg-green-600 shadow-lg shadow-green-500/25'
                    } text-white px-10 py-4 text-lg font-semibold rounded-xl transition-all duration-300 hover:scale-105`}
                    onClick={toggleTimer}
                  >
                    {isActive ? <Pause className="mr-3 h-6 w-6" /> : <Play className="mr-3 h-6 w-6" />}
                    {isActive ? 'Pause' : 'Start'}
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-2 border-zinc-700 bg-zinc-800/50 text-zinc-300 hover:text-white hover:border-zinc-600 hover:bg-zinc-700/80 px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-300 hover:scale-105"
                    onClick={resetTimer}
                  >
                    <RotateCcw className="mr-3 h-6 w-6" />
                    Reset
                  </Button>
                </div>
              </div>
              
              {/* Enhanced Session Counter */}
              <div className="p-6 bg-gradient-to-r from-zinc-900/80 via-zinc-800/80 to-zinc-900/80 border-t border-zinc-700/50">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-green-500/20 border border-green-500/30">
                      <CheckCircle className="h-6 w-6 text-green-400" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-white">{todayPomodoros}</div>
                      <div className="text-sm text-zinc-400">Sessions Today</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <div className="text-lg font-semibold text-white">{currentStreak}</div>
                      <div className="text-xs text-zinc-400">Current Streak</div>
                    </div>
                    <div className="w-px h-8 bg-zinc-700"></div>
                    <div className="text-center">
                      <div className="text-lg font-semibold text-white">{completedPomodoros}</div>
                      <div className="text-xs text-zinc-400">Total Sessions</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Enhanced Secondary Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Stats Card */}
            <div className="bg-gradient-to-br from-zinc-900/90 via-zinc-800/90 to-zinc-900/90 backdrop-blur-xl rounded-2xl border border-zinc-700/50 shadow-lg p-6">
              <PomodoroStats 
                completedPomodoros={completedPomodoros}
                completedBreaks={completedBreaks}
                totalFocusTime={totalFocusTime}
                todayPomodoros={todayPomodoros}
                longestStreak={longestStreak}
              />
            </div>
            
            {/* YouTube Player */}
            <div className="bg-gradient-to-br from-zinc-900/90 via-zinc-800/90 to-zinc-900/90 backdrop-blur-xl rounded-2xl border border-zinc-700/50 shadow-lg overflow-hidden">
              <div className="p-6 bg-gradient-to-r from-zinc-900/80 via-zinc-800/80 to-zinc-900/80 border-b border-zinc-700/50">
                <h3 className="text-xl font-bold text-white flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-white/10 border border-white/20">
                    <CheckCircle className="h-5 w-5 text-white" />
                  </div>
                  Background Music
                </h3>
                <p className="text-zinc-400 mt-1">Enhance your focus with ambient sounds</p>
              </div>
              <div className="p-1">
                <YouTubePlayer />
              </div>
            </div>
          </div>
        </div>
      </main>
      
      {/* Fullscreen Pomodoro */}
      <FullscreenPomodoro
        isOpen={isFullscreen}
        onClose={() => setIsFullscreen(false)}
        timeLeft={timeLeft}
        isActive={isActive}
        mode={mode}
        onToggleTimer={toggleTimer}
        onResetTimer={resetTimer}
        calculateProgress={calculateProgress}
        formatTime={formatTime}
      />
      
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
